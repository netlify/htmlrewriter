import { DocumentEnd, HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test({
  name: "handles document end specific mutations",
  fn: async () => {
    await init();
    // append
    const res = new HTMLRewriter()
      .onDocument({
        end(end) {
          end.append("<span>append</span>");
          end.append("<span>append html</span>", { html: true });
        },
      })
      .transform(new Response("<p>test</p>"));
    assertEquals(
      await res.text(),
      "<p>test</p>&lt;span&gt;append&lt;/span&gt;<span>append html</span>",
    );
  },
});
Deno.test({
  name: "document end allows chaining",
  fn: async () => {
    await init();
    new HTMLRewriter()
      .onDocument({
        end(end) {
          assertEquals(end.append(""), end);
        },
      })
      .transform(new Response("<p>test</p>"));
  },
});
Deno.test({
  name: "handles document end class handler",
  fn: async () => {
    await init();
    class Handler {
      constructor(private content: string) {}
      end(end: DocumentEnd) {
        end.append(this.content, { html: true });
      }
    }
    const res = await new HTMLRewriter()
      .onDocument(new Handler("<span>append html</span>"))
      .transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "<p>test</p><span>append html</span>");
  },
});
