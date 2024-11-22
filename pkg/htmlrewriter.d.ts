/* tslint:disable */
/* eslint-disable */
export class Comment {
  free(): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content: string, content_type?: any): void;
  remove(): void;
  readonly removed: boolean;
  text: string;
}
export class Doctype {
  free(): void;
  readonly name: any;
  readonly publicId: any;
  readonly systemId: any;
}
export class DocumentEnd {
  free(): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  append(content: string, content_type?: any): void;
}
export class Element {
  free(): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content: string, content_type?: any): void;
  remove(): void;
  /**
   * @param {string} name
   * @returns {any}
   */
  getAttribute(name: string): any;
  /**
   * @param {string} name
   * @returns {boolean}
   */
  hasAttribute(name: string): boolean;
  /**
   * @param {string} name
   * @param {string} value
   */
  setAttribute(name: string, value: string): void;
  /**
   * @param {string} name
   */
  removeAttribute(name: string): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  prepend(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  append(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  setInnerContent(content: string, content_type?: any): void;
  removeAndKeepContent(): void;
  readonly attributes: any;
  readonly namespaceURI: any;
  readonly removed: boolean;
  tagName: string;
}
export class HTMLRewriter {
  free(): void;
  /**
   * @param {Function} output_sink
   * @param {any | undefined} [options]
   */
  constructor(output_sink: Function, options?: any);
  /**
   * @param {string} selector
   * @param {any} handlers
   */
  on(selector: string, handlers: any): void;
  /**
   * @param {any} handlers
   */
  onDocument(handlers: any): void;
  /**
   * @param {Uint8Array} chunk
   */
  write(chunk: Uint8Array): void;
  end(): void;
  readonly asyncifyStackPtr: number;
}
export class TextChunk {
  free(): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content: string, content_type?: any): void;
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content: string, content_type?: any): void;
  remove(): void;
  readonly lastInTextNode: boolean;
  readonly removed: boolean;
  readonly text: string;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_comment_free: (a: number, b: number) => void;
  readonly comment_before: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly comment_after: (a: number, b: number, c: number, d: number) => Array;
  readonly comment_replace: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly comment_remove: (a: number) => Array;
  readonly comment_removed: (a: number) => Array;
  readonly comment_text: (a: number) => Array;
  readonly comment_set_text: (a: number, b: number, c: number) => Array;
  readonly doctype_name: (a: number) => Array;
  readonly doctype_public_id: (a: number) => Array;
  readonly doctype_system_id: (a: number) => Array;
  readonly documentend_append: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_before: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_after: (a: number, b: number, c: number, d: number) => Array;
  readonly element_replace: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_remove: (a: number) => Array;
  readonly element_removed: (a: number) => Array;
  readonly element_tag_name: (a: number) => Array;
  readonly element_set_tag_name: (a: number, b: number, c: number) => Array;
  readonly element_namespace_uri: (a: number) => Array;
  readonly element_attributes: (a: number) => Array;
  readonly element_getAttribute: (a: number, b: number, c: number) => Array;
  readonly element_hasAttribute: (a: number, b: number, c: number) => Array;
  readonly element_setAttribute: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
  ) => Array;
  readonly element_removeAttribute: (a: number, b: number, c: number) => Array;
  readonly element_prepend: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_append: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_setInnerContent: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly element_removeAndKeepContent: (a: number) => Array;
  readonly __wbg_htmlrewriter_free: (a: number, b: number) => void;
  readonly htmlrewriter_new: (a: number, b: number) => number;
  readonly htmlrewriter_on: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly htmlrewriter_onDocument: (a: number, b: number) => Array;
  readonly htmlrewriter_write: (a: number, b: number, c: number) => Array;
  readonly htmlrewriter_end: (a: number) => Array;
  readonly htmlrewriter_asyncify_stack_ptr: (a: number) => number;
  readonly textchunk_text: (a: number) => Array;
  readonly textchunk_last_in_text_node: (a: number) => Array;
  readonly textchunk_removed: (a: number) => Array;
  readonly textchunk_remove: (a: number) => Array;
  readonly __wbg_doctype_free: (a: number, b: number) => void;
  readonly __wbg_documentend_free: (a: number, b: number) => void;
  readonly __wbg_element_free: (a: number, b: number) => void;
  readonly __wbg_textchunk_free: (a: number, b: number) => void;
  readonly textchunk_replace: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly textchunk_before: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly textchunk_after: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => Array;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __externref_table_alloc: () => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
