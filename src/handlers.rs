use super::comment::Comment;
use super::doctype::Doctype;
use super::document_end::DocumentEnd;
use super::element::Element;
use super::text_chunk::TextChunk;
use super::*;
use js_sys::{Function as JsFunction, Promise as JsPromise};
use lol_html::{
    DocumentContentHandlers as NativeDocumentContentHandlers,
    ElementContentHandlers as NativeElementContentHandlers,
};
use std::mem;
use std::rc::Rc;
use thiserror::Error;

// NOTE: Display is noop, because we'll unwrap JSValue error when it will be propagated to
// `write()` or `end()`.
#[derive(Error, Debug)]
#[error("JS handler error")]
pub struct HandlerJsErrorWrap(pub JsValue);
// Probably horribly unsafe, but it works™
unsafe impl Send for HandlerJsErrorWrap {}
unsafe impl Sync for HandlerJsErrorWrap {}

#[wasm_bindgen(raw_module = "./asyncify.js")]
extern "C" {
    #[wasm_bindgen(js_name = awaitPromise)]
    pub(crate) fn await_promise(stack_ptr: *mut u8, promise: &JsPromise);
}

pub trait IntoNativeHandlers<T> {
    fn into_native(self) -> T;
}

#[wasm_bindgen]
extern "C" {
    pub type ElementContentHandlers;

    #[wasm_bindgen(method, getter)]
    fn element(this: &ElementContentHandlers) -> Option<JsFunction>;

    #[wasm_bindgen(method, getter)]
    fn comments(this: &ElementContentHandlers) -> Option<JsFunction>;

    #[wasm_bindgen(method, getter)]
    fn text(this: &ElementContentHandlers) -> Option<JsFunction>;
}

impl IntoNativeHandlers<NativeElementContentHandlers<'static>> for ElementContentHandlers {
    fn into_native(self) -> NativeElementContentHandlers<'static> {
        let handlers: Rc<JsValue> = Rc::new((&self).into());
        let mut native = NativeElementContentHandlers::default();

        if let Some(handler) = self.element() {
            let this = Rc::clone(&handlers);
            native = {
                #[inline(always)]
                fn type_hint<'h, T, H: lol_html::HandlerTypes>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::Element<'_, '_, H>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::ElementContentHandlers::default().element(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = Element::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        if let Some(handler) = self.comments() {
            let this = Rc::clone(&handlers);
            // native = native.comments(make_handler!(handler, Comment, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::Comment<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::ElementContentHandlers::default().comments(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = Comment::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        if let Some(handler) = self.text() {
            let this = Rc::clone(&handlers);
            // native = native.text(make_handler!(handler, TextChunk, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::TextChunk<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::ElementContentHandlers::default().text(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = TextChunk::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        native
    }
}

#[wasm_bindgen]
extern "C" {
    pub type DocumentContentHandlers;

    #[wasm_bindgen(method, getter)]
    fn doctype(this: &DocumentContentHandlers) -> Option<JsFunction>;

    #[wasm_bindgen(method, getter)]
    fn comments(this: &DocumentContentHandlers) -> Option<JsFunction>;

    #[wasm_bindgen(method, getter)]
    fn text(this: &DocumentContentHandlers) -> Option<JsFunction>;

    #[wasm_bindgen(method, getter)]
    fn end(this: &DocumentContentHandlers) -> Option<JsFunction>;
}

impl IntoNativeHandlers<NativeDocumentContentHandlers<'static>> for DocumentContentHandlers {
    fn into_native(self) -> NativeDocumentContentHandlers<'static> {
        let handlers: Rc<JsValue> = Rc::new((&self).into());
        let mut native = NativeDocumentContentHandlers::default();

        if let Some(handler) = self.doctype() {
            let this = Rc::clone(&handlers);
            // native = native.doctype(make_handler!(handler, Doctype, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::Doctype<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::DocumentContentHandlers::default().doctype(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = Doctype::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        if let Some(handler) = self.comments() {
            let this = Rc::clone(&handlers);
            // native = native.comments(make_handler!(handler, Comment, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::Comment<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::DocumentContentHandlers::default().comments(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = Comment::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        if let Some(handler) = self.text() {
            let this = Rc::clone(&handlers);
            // native = native.text(make_handler!(handler, TextChunk, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::TextChunk<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::DocumentContentHandlers::default().text(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = TextChunk::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        if let Some(handler) = self.end() {
            let this = Rc::clone(&handlers);
            // native = native.end(make_handler!(handler, DocumentEnd, this));
            native = {
                #[inline(always)]
                fn type_hint<'h, T>(h: T) -> T
                where
                    T: FnMut(
                            &mut lol_html::html_content::DocumentEnd<'_>,
                        ) -> lol_html::HandlerResult
                        + 'h,
                {
                    h
                }
                lol_html::DocumentContentHandlers::default().end(
                    type_hint(
                        move |el: &mut _| {
                            let (js_arg, anchor) = DocumentEnd::from_native(el);
                            let js_arg = JsValue::from(js_arg);
                            let res = match handler.call1(&this, &js_arg) {
                                Ok(_) => Ok(()),
                                Err(e) => Err(HandlerJsErrorWrap(e).into()),
                            };
                            mem::drop(anchor);
                            res
                        },
                    ),
                )
            };
        }

        native
    }
}