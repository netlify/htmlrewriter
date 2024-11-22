let wasm;
export function __wbg_set_wasm(val) {
  wasm = val;
}

const lTextDecoder = typeof TextDecoder === "undefined"
  ? (0, module.require)("util").TextDecoder
  : TextDecoder;

let cachedTextDecoder = new lTextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
  if (
    cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0
  ) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(
    getUint8ArrayMemory0().subarray(ptr, ptr + len),
  );
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === "undefined"
  ? (0, module.require)("util").TextEncoder
  : TextEncoder;

let cachedTextEncoder = new lTextEncoder("utf-8");

const encodeString = typeof cachedTextEncoder.encodeInto === "function"
  ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
  }
  : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
      read: arg.length,
      written: buf.length,
    };
  };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8ArrayMemory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
  if (
    cachedDataViewMemory0 === null ||
    cachedDataViewMemory0.buffer.detached === true ||
    (cachedDataViewMemory0.buffer.detached === undefined &&
      cachedDataViewMemory0.buffer !== wasm.memory.buffer)
  ) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_export_2.set(idx, obj);
  return idx;
}

function takeFromExternrefTable0(idx) {
  const value = wasm.__wbindgen_export_2.get(idx);
  wasm.__externref_table_dealloc(idx);
  return value;
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8ArrayMemory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}

const CommentFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_comment_free(ptr >>> 0, 1));

export class Comment {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Comment.prototype);
    obj.__wbg_ptr = ptr;
    CommentFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    CommentFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_comment_free(ptr, 0);
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.comment_before(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.comment_after(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.comment_replace(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  remove() {
    const ret = wasm.comment_remove(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {boolean}
   */
  get removed() {
    const ret = wasm.comment_removed(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @returns {string}
   */
  get text() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.comment_text(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {string} text
   */
  set text(text) {
    const ptr0 = passStringToWasm0(
      text,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.comment_set_text(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
}

const DoctypeFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_doctype_free(ptr >>> 0, 1));

export class Doctype {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Doctype.prototype);
    obj.__wbg_ptr = ptr;
    DoctypeFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DoctypeFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_doctype_free(ptr, 0);
  }
  /**
   * @returns {any}
   */
  get name() {
    const ret = wasm.doctype_name(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {any}
   */
  get publicId() {
    const ret = wasm.doctype_public_id(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {any}
   */
  get systemId() {
    const ret = wasm.doctype_system_id(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
}

const DocumentEndFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) =>
    wasm.__wbg_documentend_free(ptr >>> 0, 1)
  );

export class DocumentEnd {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(DocumentEnd.prototype);
    obj.__wbg_ptr = ptr;
    DocumentEndFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DocumentEndFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_documentend_free(ptr, 0);
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  append(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.documentend_append(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
}

const ElementFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_element_free(ptr >>> 0, 1));

export class Element {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(Element.prototype);
    obj.__wbg_ptr = ptr;
    ElementFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    ElementFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_element_free(ptr, 0);
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_before(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_after(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_replace(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  remove() {
    const ret = wasm.element_remove(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {boolean}
   */
  get removed() {
    const ret = wasm.element_removed(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @returns {string}
   */
  get tagName() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.element_tag_name(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @param {string} name
   */
  set tagName(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_set_tag_name(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {any}
   */
  get namespaceURI() {
    const ret = wasm.element_namespace_uri(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @returns {any}
   */
  get attributes() {
    const ret = wasm.element_attributes(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {string} name
   * @returns {any}
   */
  getAttribute(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_getAttribute(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
  }
  /**
   * @param {string} name
   * @returns {boolean}
   */
  hasAttribute(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_hasAttribute(this.__wbg_ptr, ptr0, len0);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @param {string} name
   * @param {string} value
   */
  setAttribute(name, value) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      value,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.element_setAttribute(
      this.__wbg_ptr,
      ptr0,
      len0,
      ptr1,
      len1,
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} name
   */
  removeAttribute(name) {
    const ptr0 = passStringToWasm0(
      name,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_removeAttribute(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  prepend(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_prepend(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  append(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_append(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  setInnerContent(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.element_setInnerContent(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  removeAndKeepContent() {
    const ret = wasm.element_removeAndKeepContent(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
}

const HTMLRewriterFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) =>
    wasm.__wbg_htmlrewriter_free(ptr >>> 0, 1)
  );

export class HTMLRewriter {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    HTMLRewriterFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_htmlrewriter_free(ptr, 0);
  }
  /**
   * @param {Function} output_sink
   * @param {any | undefined} [options]
   */
  constructor(output_sink, options) {
    const ret = wasm.htmlrewriter_new(
      output_sink,
      isLikeNone(options) ? 0 : addToExternrefTable0(options),
    );
    this.__wbg_ptr = ret >>> 0;
    HTMLRewriterFinalization.register(this, this.__wbg_ptr, this);
    return this;
  }
  /**
   * @param {string} selector
   * @param {any} handlers
   */
  on(selector, handlers) {
    const ptr0 = passStringToWasm0(
      selector,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.htmlrewriter_on(this.__wbg_ptr, ptr0, len0, handlers);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {any} handlers
   */
  onDocument(handlers) {
    const ret = wasm.htmlrewriter_onDocument(this.__wbg_ptr, handlers);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {Uint8Array} chunk
   */
  write(chunk) {
    const ptr0 = passArray8ToWasm0(chunk, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.htmlrewriter_write(this.__wbg_ptr, ptr0, len0);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  end() {
    const ret = wasm.htmlrewriter_end(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {number}
   */
  get asyncifyStackPtr() {
    const ret = wasm.htmlrewriter_asyncify_stack_ptr(this.__wbg_ptr);
    return ret >>> 0;
  }
}

const TextChunkFinalization = (typeof FinalizationRegistry === "undefined")
  ? { register: () => {}, unregister: () => {} }
  : new FinalizationRegistry((ptr) => wasm.__wbg_textchunk_free(ptr >>> 0, 1));

export class TextChunk {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(TextChunk.prototype);
    obj.__wbg_ptr = ptr;
    TextChunkFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    TextChunkFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_textchunk_free(ptr, 0);
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  before(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.textchunk_before(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  after(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.textchunk_after(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @param {string} content
   * @param {any | undefined} [content_type]
   */
  replace(content, content_type) {
    const ptr0 = passStringToWasm0(
      content,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.textchunk_replace(
      this.__wbg_ptr,
      ptr0,
      len0,
      isLikeNone(content_type) ? 0 : addToExternrefTable0(content_type),
    );
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  remove() {
    const ret = wasm.textchunk_remove(this.__wbg_ptr);
    if (ret[1]) {
      throw takeFromExternrefTable0(ret[0]);
    }
  }
  /**
   * @returns {boolean}
   */
  get removed() {
    const ret = wasm.textchunk_removed(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
  /**
   * @returns {string}
   */
  get text() {
    let deferred2_0;
    let deferred2_1;
    try {
      const ret = wasm.textchunk_text(this.__wbg_ptr);
      var ptr1 = ret[0];
      var len1 = ret[1];
      if (ret[3]) {
        ptr1 = 0;
        len1 = 0;
        throw takeFromExternrefTable0(ret[2]);
      }
      deferred2_0 = ptr1;
      deferred2_1 = len1;
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
  }
  /**
   * @returns {boolean}
   */
  get lastInTextNode() {
    const ret = wasm.textchunk_last_in_text_node(this.__wbg_ptr);
    if (ret[2]) {
      throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0] !== 0;
  }
}

export function __wbg_documentend_new(arg0) {
  const ret = DocumentEnd.__wrap(arg0);
  return ret;
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}

export function __wbg_html_fbd00991d780a754(arg0) {
  const ret = arg0.html;
  return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}

export function __wbg_element_dc40d85e59f7e8db(arg0) {
  const ret = arg0.element;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_comments_f4a32acf5bd7f6d3(arg0) {
  const ret = arg0.comments;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_text_52e38b02986f1e18(arg0) {
  const ret = arg0.text;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_element_new(arg0) {
  const ret = Element.__wrap(arg0);
  return ret;
}

export function __wbg_comment_new(arg0) {
  const ret = Comment.__wrap(arg0);
  return ret;
}

export function __wbg_textchunk_new(arg0) {
  const ret = TextChunk.__wrap(arg0);
  return ret;
}

export function __wbg_doctype_95d10656b9e0c589(arg0) {
  const ret = arg0.doctype;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_comments_b4db58b38f105644(arg0) {
  const ret = arg0.comments;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_text_54a231591f2b4f44(arg0) {
  const ret = arg0.text;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_end_84bb4f497e4b2cf5(arg0) {
  const ret = arg0.end;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}

export function __wbg_doctype_new(arg0) {
  const ret = Doctype.__wrap(arg0);
  return ret;
}

export function __wbg_enableEsiTags_d72598c2e278624d(arg0) {
  const ret = arg0.enableEsiTags;
  return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
}

export function __wbg_String_b9412f8799faab3e(arg0, arg1) {
  const ret = String(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbg_new_034f913e7636e987() {
  const ret = new Array();
  return ret;
}

export function __wbg_set_425e70f7c64ac962(arg0, arg1, arg2) {
  arg0[arg1 >>> 0] = arg2;
}

export function __wbg_call_3bfa248576352471() {
  return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
  }, arguments);
}

export function __wbg_new_9a7e38dd635a4e93(arg0, arg1) {
  const ret = new TypeError(getStringFromWasm0(arg0, arg1));
  return ret;
}

export function __wbg_buffer_ccaed51a635d8a2d(arg0) {
  const ret = arg0.buffer;
  return ret;
}

export function __wbg_newwithbyteoffsetandlength_7e3eb787208af730(
  arg0,
  arg1,
  arg2,
) {
  const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
  return ret;
}

export function __wbg_new_fec2611eb9180f95(arg0) {
  const ret = new Uint8Array(arg0);
  return ret;
}

export function __wbindgen_debug_string(arg0, arg1) {
  const ret = debugString(arg1);
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

export function __wbindgen_memory() {
  const ret = wasm.memory;
  return ret;
}

export function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_export_2;
  const offset = table.grow(4);
  table.set(0, undefined);
  table.set(offset + 0, undefined);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
}
