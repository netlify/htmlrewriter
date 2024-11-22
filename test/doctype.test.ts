import { Doctype, HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

const doctypeInput =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html lang="en"></html>';
Deno.test({
  name: "handles document doctype properties",
  fn: async () => {
    await init();
    const res = new HTMLRewriter()
      .onDocument({
        doctype(doctype) {
          assertEquals(doctype.name, "html");
          assertEquals(doctype.publicId, "-//W3C//DTD HTML 4.01//EN");
          assertEquals(
            doctype.systemId,
            "http://www.w3.org/TR/html4/strict.dtd",
          );
        },
      })
      .transform(new Response(doctypeInput));
    assertEquals(await res.text(), doctypeInput);
  },
});
Deno.test({
  name: "handles document doctype properties for empty doctype",
  fn: async () => {
    await init();
    new HTMLRewriter()
      .onDocument({
        doctype(doctype) {
          assertEquals(doctype.name, null);
          assertEquals(doctype.publicId, null);
          assertEquals(doctype.systemId, null);
        },
      })
      .transform(new Response("<!DOCTYPE>"));
  },
});
Deno.test({
  name: "handles document doctype class handler",
  fn: async () => {
    await init();
    class Handler {
      constructor(private content: string) {}
      doctype(doctype: Doctype) {
        assertEquals(doctype.name, "html");
        assertEquals(this.content, "new");
      }
    }
    const res = new HTMLRewriter()
      .onDocument(new Handler("new"))
      .transform(new Response(doctypeInput));
    assertEquals(await res.text(), doctypeInput);
  },
});
