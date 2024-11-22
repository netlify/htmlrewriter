import { HTMLRewriter, init, TextChunk } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test({
  name: "handles text properties",
  fn: async () => {
    await init();
    const res = new HTMLRewriter().on("p", {
      text(text) {
        assertEquals(text.removed, false);
        if (text.lastInTextNode) {
          assertEquals(text.text, "");
        } else {
          assertEquals(text.text, "t");
        }
      },
    }).transform(new Response("<p>t</p>"));
    assertEquals(await res.text(), "<p>t</p>");
  },
});
Deno.test(
  {
    name: "handles text mutations",
    fn: async () => {
      await init();
      // before/after
      let res = new HTMLRewriter().on("p", {
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.before("<span>before</span>");
          token.before("<span>before html</span>", { html: true });
          token.after("<span>after</span>");
          token.after("<span>after html</span>", { html: true });
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(
        await res.text(),
        "<p>&lt;span&gt;before&lt;/span&gt;<span>before html</span>t<span>after html</span>&lt;span&gt;after&lt;/span&gt;</p>",
      );

      // replace
      res = new HTMLRewriter().on("p", {
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.replace("<span>replace</span>");
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p>&lt;span&gt;replace&lt;/span&gt;</p>");
      res = new HTMLRewriter().on("p", {
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.replace("<span>replace</span>", { html: true });
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p><span>replace</span></p>");

      // remove
      res = new HTMLRewriter().on("p", {
        text: (token) => {
          if ("text" in token && !token.text) return;
          assertEquals(token.removed, false);
          token.remove();
          assertEquals(token.removed, true);
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p></p>");
    },
  },
);
Deno.test({
  name: "text allows chaining",
  fn: async () => {
    await init();
    new HTMLRewriter()
      .on("p", {
        text(text) {
          if (text.text === "t") {
            assertEquals(text.before(""), text);
            assertEquals(text.after(""), text);
            assertEquals(text.replace(""), text);
            assertEquals(text.remove(), text);
          }
        },
      })
      .transform(new Response("<p>t</p"));
  },
});
Deno.test(
  {
    name: "handles text class handler",
    fn: async () => {
      await init();
      class Handler {
        constructor(private content: string) {}
        text(text: TextChunk) {
          if (text.text === "t") text.after(this.content);
        }
      }
      const res = new HTMLRewriter().on("p", new Handler(" new")).transform(
        new Response("<p>t</p>"),
      );
      assertEquals(await res.text(), "<p>t new</p>");
    },
  },
);

Deno.test(
  {
    name: "handles document text properties",
    fn: async () => {
      await init();
      const res = new HTMLRewriter().onDocument({
        text(text) {
          assertEquals(text.removed, false);
          if (text.lastInTextNode) {
            assertEquals(text.text, "");
          } else {
            assertEquals(text.text, "t");
          }
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p>t</p>");
    },
  },
);
Deno.test(
  {
    name: "handles document text mutations",
    fn: async () => {
      await init();
      // before/after
      let res = new HTMLRewriter().onDocument({
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.before("<span>before</span>");
          token.before("<span>before html</span>", { html: true });
          token.after("<span>after</span>");
          token.after("<span>after html</span>", { html: true });
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(
        await res.text(),
        "<p>&lt;span&gt;before&lt;/span&gt;<span>before html</span>t<span>after html</span>&lt;span&gt;after&lt;/span&gt;</p>",
      );

      // replace
      res = new HTMLRewriter().onDocument({
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.replace("<span>replace</span>");
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p>&lt;span&gt;replace&lt;/span&gt;</p>");
      res = new HTMLRewriter().onDocument({
        text: (token) => {
          if ("text" in token && !token.text) return;
          token.replace("<span>replace</span>", { html: true });
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p><span>replace</span></p>");

      // remove
      res = new HTMLRewriter().onDocument({
        text: (token) => {
          if ("text" in token && !token.text) return;
          assertEquals(token.removed, false);
          token.remove();
          assertEquals(token.removed, true);
        },
      }).transform(new Response("<p>t</p>"));
      assertEquals(await res.text(), "<p></p>");
    },
  },
);
Deno.test(
  {
    name: "handles document text class handler",
    fn: async () => {
      await init();
      class Handler {
        constructor(private content: string) {}
        text(text: TextChunk) {
          if (text.text === "t") text.after(this.content);
        }
      }
      const res = new HTMLRewriter().onDocument(new Handler(" new")).transform(
        new Response("<p>t</p>"),
      );
      assertEquals(await res.text(), "<p>t new</p>");
    },
  },
);
