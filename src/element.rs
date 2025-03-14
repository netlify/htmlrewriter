use super::*;
use lol_html::html_content::Element as NativeElement;
use serde_wasm_bindgen::to_value as to_js_value;

#[wasm_bindgen]
pub struct Element(NativeRefWrap<NativeElement<'static, 'static>>);

impl_from_native!(NativeElement --> Element);
impl_mutations!(Element);

#[wasm_bindgen]
impl Element {
    #[wasm_bindgen(getter=tagName)]
    pub fn tag_name(&self) -> JsResult<String> {
        self.0.get().map(|e| e.tag_name())
    }

    #[wasm_bindgen(setter=tagName)]
    pub fn set_tag_name(&mut self, name: &str) -> JsResult<()> {
        self.0.get_mut()?.set_tag_name(name).into_js_result()
    }

    #[wasm_bindgen(getter=namespaceURI)]
    pub fn namespace_uri(&self) -> JsResult<JsValue> {
        self.0.get().map(|e| e.namespace_uri().into())
    }

    #[wasm_bindgen(getter)]
    pub fn attributes(&self) -> JsResult<JsValue> {
        self.0
            .get()
            .map(|e| {
                e.attributes()
                    .iter()
                    .map(|a| vec![a.name(), a.value()])
                    .collect::<Vec<_>>()
            })
            .and_then(|a| to_js_value(&a).into_js_result())
    }

    #[wasm_bindgen(method, js_name=getAttribute)]
    pub fn get_attribute(&self, name: &str) -> JsResult<JsValue> {
        self.0.get().map(|e| {
            e.get_attribute(name)
                .map(JsValue::from)
                .unwrap_or(JsValue::null())
        })
    }

    #[wasm_bindgen(method, js_name=hasAttribute)]
    pub fn has_attribute(&self, name: &str) -> JsResult<bool> {
        self.0.get().map(|e| e.has_attribute(name))
    }

    #[wasm_bindgen(method, js_name=setAttribute)]
    pub fn set_attribute(&mut self, name: &str, value: &str) -> JsResult<()> {
        self.0
            .get_mut()?
            .set_attribute(name, value)
            .into_js_result()
    }

    #[wasm_bindgen(method, js_name=removeAttribute)]
    pub fn remove_attribute(&mut self, name: &str) -> JsResult<()> {
        self.0.get_mut().map(|e| e.remove_attribute(name))
    }

    pub fn prepend(
        &mut self,
        content: &str,
        content_type: Option<ContentTypeOptions>,
    ) -> Result<(), JsValue> {
        self.0
            .get_mut()
            .map(|e| e.prepend(content, content_type.into_native()))
    }

    pub fn append(
        &mut self,
        content: &str,
        content_type: Option<ContentTypeOptions>,
    ) -> Result<(), JsValue> {
        self.0
            .get_mut()
            .map(|e| e.append(content, content_type.into_native()))
    }

    #[wasm_bindgen(method, js_name=setInnerContent)]
    pub fn set_inner_content(
        &mut self,
        content: &str,
        content_type: Option<ContentTypeOptions>,
    ) -> Result<(), JsValue> {
        self.0
            .get_mut()
            .map(|e| e.set_inner_content(content, content_type.into_native()))
    }

    #[wasm_bindgen(method, js_name=removeAndKeepContent)]
    pub fn remove_and_keep_content(&mut self) -> Result<(), JsValue> {
        self.0.get_mut().map(|e| e.remove_and_keep_content())
    }
}
