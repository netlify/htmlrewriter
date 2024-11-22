import { Element, HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test({
  name: "handles element properties",
  fn: async () => {
    await init();
    const res = new HTMLRewriter()
      .on("p", {
        element(element) {
          assertEquals(element.tagName, "p");
          element.tagName = "h1";
          assertEquals(element.removed, false);
          assertEquals(element.namespaceURI, "http://www.w3.org/1999/xhtml");
          assertEquals([...element.attributes], [["class", "red"]]);
        },
      })
      .transform(new Response('<p class="red">test</p>'));
    assertEquals(await res.text(), '<h1 class="red">test</h1>');
  },
});
Deno.test({
  name: "handles element attribute methods",
  fn: async () => {
    await init();
    const res = new HTMLRewriter()
      .on("p", {
        element(element) {
          assertEquals(element.getAttribute("class"), "red");
          assertEquals(element.getAttribute("id"), null);
          assertEquals(element.hasAttribute("class"), true);
          assertEquals(element.hasAttribute("id"), false);
          element.setAttribute("id", "header");
          element.removeAttribute("class");
        },
      })
      .transform(new Response('<p class="red">test</p>'));
    assertEquals(await res.text(), '<p id="header">test</p>');
  },
});
Deno.test({
  name: "handles element mutations",
  fn: async () => {
    await init();
    // before/after
    let res = new HTMLRewriter().on("p", {
      element(token) {
        if ("text" in token && !token.text) return;
        token.before("<span>before</span>");
        token.before("<span>before html</span>", { html: true });
        token.after("<span>after</span>");
        token.after("<span>after html</span>", { html: true });
      },
    }).transform(new Response("<p>test</p>"));
    assertEquals(
      await res.text(),
      "&lt;span&gt;before&lt;/span&gt;<span>before html</span><p>test</p><span>after html</span>&lt;span&gt;after&lt;/span&gt;",
    );

    // replace
    res = new HTMLRewriter().on("p", {
      element(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>");
      },
    }).transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "&lt;span&gt;replace&lt;/span&gt;");
    res = new HTMLRewriter().on("p", {
      element(token) {
        if ("text" in token && !token.text) return;
        token.replace("<span>replace</span>", { html: true });
      },
    }).transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "<span>replace</span>");

    // remove
    res = new HTMLRewriter().on("p", {
      element(token) {
        if ("text" in token && !token.text) return;
        assertEquals(token.removed, false);
        token.remove();
        assertEquals(token.removed, true);
      },
    }).transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "");
  },
});
Deno.test({
  name: "handles element specific mutations",
  fn: async () => {
    await init();
    // prepend/append
    let res = new HTMLRewriter()
      .on("p", {
        element(element) {
          element.prepend("<span>prepend</span>");
          element.prepend("<span>prepend html</span>", { html: true });
          element.append("<span>append</span>");
          element.append("<span>append html</span>", { html: true });
        },
      })
      .transform(new Response("<p>test</p>"));
    assertEquals(
      await res.text(),
      "<p><span>prepend html</span>&lt;span&gt;prepend&lt;/span&gt;test&lt;span&gt;append&lt;/span&gt;<span>append html</span></p>",
    );

    // setInnerContent
    res = new HTMLRewriter()
      .on("p", {
        element(element) {
          element.setInnerContent("<span>replace</span>");
        },
      })
      .transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "<p>&lt;span&gt;replace&lt;/span&gt;</p>");
    res = new HTMLRewriter()
      .on("p", {
        element(element) {
          element.setInnerContent("<span>replace</span>", { html: true });
        },
      })
      .transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "<p><span>replace</span></p>");

    // removeAndKeepContent
    res = new HTMLRewriter()
      .on("p", {
        element(element) {
          element.removeAndKeepContent();
        },
      })
      .transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "test");
  },
});
Deno.test({
  name: "element allows chaining",
  fn: async () => {
    await init();
    new HTMLRewriter()
      .on("p", {
        element(element) {
          assertEquals(element.before(""), element);
          assertEquals(element.after(""), element);
          assertEquals(element.replace(""), element);
          assertEquals(element.remove(), element);
          assertEquals(element.setAttribute("test", ""), element);
          assertEquals(element.removeAttribute("test"), element);
          assertEquals(element.prepend(""), element);
          assertEquals(element.append(""), element);
          assertEquals(element.setInnerContent(""), element);
          assertEquals(element.removeAndKeepContent(), element);
        },
      })
      .transform(new Response("<p>test</p>"));
  },
});
Deno.test({
  name: "handles element class handler",
  fn: async () => {
    await init();
    class Handler {
      constructor(private content: string) {}
      element(element: Element) {
        element.setInnerContent(this.content);
      }
    }
    const res = new HTMLRewriter()
      .on("p", new Handler("new"))
      .transform(new Response("<p>test</p>"));
    assertEquals(await res.text(), "<p>new</p>");
  },
});
