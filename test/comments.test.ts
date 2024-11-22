import { Comment, HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test({
  name: "handles comment properties",
  fn: async () => {
    await init();
    const response = new HTMLRewriter().on("p", {
      comments: (comment) => {
        assertEquals(comment.removed, false);
        assertEquals(comment.text, "test");
        comment.text = "new";
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await response.text(), "<p><!--new--></p>");
  },
});

Deno.test({
  name: "handles comment mutations",
  fn: async () => {
    await init();
    let res = new HTMLRewriter().on("p", {
      comments: (comment) => {
        if ("text" in comment && !comment.text) return;
        comment.before("<span>before</span>");
        comment.before("<span>before html</span>", { html: true });
        comment.after("<span>after</span>");
        comment.after("<span>after html</span>", { html: true });
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(
      await res.text(),
      "<p>&lt;span&gt;before&lt;/span&gt;<span>before html</span><!--test--><span>after html</span>&lt;span&gt;after&lt;/span&gt;</p>",
    );

    // replace
    res = new HTMLRewriter().on("p", {
      comments(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>");
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p>&lt;span&gt;replace&lt;/span&gt;</p>");

    res = new HTMLRewriter().on("p", {
      comments(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>", { html: true });
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p><span>replace</span></p>");

    // remove
    res = new HTMLRewriter().on("p", {
      comments(token) {
        if ("text" in token && !token.text) return;
        assertEquals(token.removed, false);
        token.remove();
        assertEquals(token.removed, true);
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p></p>");
  },
});

Deno.test({
  name: "comment allows chaining",
  fn: async () => {
    await init();
    new HTMLRewriter().on("p", {
      comments(comment) {
        assertEquals(comment.before(""), comment);
        assertEquals(comment.after(""), comment);
        assertEquals(comment.replace(""), comment);
        assertEquals(comment.remove(), comment);
      },
    })
      .transform(new Response("<p><!--test--></p>"));
  },
});

Deno.test({
  name: "handles comment class handler",
  fn: async () => {
    await init();
    class Handler {
      constructor(private content: string) {}
      comments(comment: Comment) {
        comment.text = this.content;
      }
    }
    const res = new HTMLRewriter().on("p", new Handler("new")).transform(
      new Response("<p><!--test--></p>"),
    );
    assertEquals(await res.text(), "<p><!--new--></p>");
  },
});

Deno.test({
  name: "handles document comment properties",
  fn: async () => {
    await init();
    const res = new HTMLRewriter().onDocument({
      comments(comment) {
        assertEquals(comment.removed, false);
        assertEquals(comment.text, "test");
        comment.text = "new";
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p><!--new--></p>");
  },
});
Deno.test({
  name: "handles document comment mutations",
  fn: async () => {
    await init();
    // In all these tests, only process text chunks containing text. All test
    // inputs for text handlers will be single characters, so we'll only process
    // text nodes once.

    // before/after
    let res = new HTMLRewriter().onDocument({
      comments(token) {
        if ("text" in token && !token.text) return;
        token.before("<span>before</span>");
        token.before("<span>before html</span>", { html: true });
        token.after("<span>after</span>");
        token.after("<span>after html</span>", { html: true });
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(
      await res.text(),
      "<p>&lt;span&gt;before&lt;/span&gt;<span>before html</span><!--test--><span>after html</span>&lt;span&gt;after&lt;/span&gt;</p>",
    );

    // replace
    res = new HTMLRewriter().onDocument({
      comments(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>");
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p>&lt;span&gt;replace&lt;/span&gt;</p>");
    res = new HTMLRewriter().onDocument({
      comments(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>", { html: true });
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p><span>replace</span></p>");

    // remove
    res = new HTMLRewriter().onDocument({
      comments(token) {
        if ("text" in token && !token.text) return;
        assertEquals(token.removed, false);
        token.remove();
        assertEquals(token.removed, true);
      },
    }).transform(new Response("<p><!--test--></p>"));
    assertEquals(await res.text(), "<p></p>");
  },
});
Deno.test({
  name: "handles document comment class handler",
  fn: async () => {
    await init();
    class Handler {
      constructor(private content: string) {}
      comments(comment: Comment) {
        comment.text = this.content;
      }
    }
    const res = new HTMLRewriter().onDocument(new Handler("new")).transform(
      new Response("<p><!--test--></p>"),
    );
    assertEquals(await res.text(), "<p><!--new--></p>");
  },
});
