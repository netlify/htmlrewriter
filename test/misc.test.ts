import { HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test({
  name: "handles multiple element handlers",
  fn: async () => {
    await init();
    const res = new HTMLRewriter()
      .on("h1", {
        element(element) {
          element.setInnerContent("new h1");
        },
      })
      .on("h2", {
        element(element) {
          element.setInnerContent("new h2");
        },
      })
      .on("p", {
        element(element) {
          element.setInnerContent("new p");
        },
      })
      .transform(new Response("<h1>old h1</h1><h2>old h2</h2><p>old p</p>"));
    const result = await res.text();
    console.log({ result });
    assertEquals(result, "<h1>new h1</h1><h2>new h2</h2><p>new p</p>");
  },
});

Deno.test({
  name: "handles empty chunk",
  fn: async () => {
    await init();
    const res = new HTMLRewriter().transform(new Response(""));
    assertEquals(await res.text(), "");
  },
});
