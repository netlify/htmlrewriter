import { assertThrows } from "https://deno.land/std@0.224.0/assert/assert_throws.ts";
import { HTMLRewriter, init } from "../src/index.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

const selectorTest = async (
  selector: string,
  input: string,
  expected: string,
) => {
  const res = new HTMLRewriter()
    .on(selector, {
      element(element) {
        element.setInnerContent("new");
      },
    })
    .transform(new Response(input));
  assertEquals(await res.text(), expected);
};

Deno.test({
  name: "*",
  fn: async () => {
    await init();
    await selectorTest("*", "<h1>1</h1><p>2</p>", "<h1>new</h1><p>new</p>");
  },
});
Deno.test({
  name: "E",
  fn: async () => {
    await init();
    await selectorTest("p", "<h1>1</h1><p>2</p>", "<h1>1</h1><p>new</p>");
  },
});
Deno.test({
  name: "E:nth-child(n)",
  fn: async () => {
    await init();
    await selectorTest(
      "p:nth-child(2)",
      "<div><p>1</p><p>2</p><p>3</p></div>",
      "<div><p>1</p><p>new</p><p>3</p></div>",
    );
  },
});
Deno.test({
  name: "E:first-child",
  fn: async () => {
    await init();
    await selectorTest(
      "p:first-child",
      "<div><p>1</p><p>2</p><p>3</p></div>",
      "<div><p>new</p><p>2</p><p>3</p></div>",
    );
  },
});
Deno.test({
  name: "E:nth-of-type(n)",
  fn: async () => {
    await init();
    await selectorTest(
      "p:nth-of-type(2)",
      "<div><p>1</p><h1>2</h1><p>3</p><h1>4</h1><p>5</p></div>",
      "<div><p>1</p><h1>2</h1><p>new</p><h1>4</h1><p>5</p></div>",
    );
  },
});
Deno.test({
  name: "E:first-of-type",
  fn: async () => {
    await init();
    await selectorTest(
      "p:first-of-type",
      "<div><h1>1</h1><p>2</p><p>3</p></div>",
      "<div><h1>1</h1><p>new</p><p>3</p></div>",
    );
  },
});
Deno.test({
  name: "E:not(s)",
  fn: async () => {
    await init();
    await selectorTest(
      "p:not(:first-child)",
      "<div><p>1</p><p>2</p><p>3</p></div>",
      "<div><p>1</p><p>new</p><p>new</p></div>",
    );
  },
});
Deno.test({
  name: "E.class",
  fn: async () => {
    await init();
    await selectorTest(
      "p.red",
      '<p class="red">1</p><p>2</p>',
      '<p class="red">new</p><p>2</p>',
    );
  },
});
Deno.test({
  name: "E#id",
  fn: async () => {
    await init();
    await selectorTest(
      "h1#header",
      '<h1 id="header">1</h1><h1>2</h1>',
      '<h1 id="header">new</h1><h1>2</h1>',
    );
  },
});
Deno.test({
  name: "E[attr]",
  fn: async () => {
    await init();
    await selectorTest(
      "p[data-test]",
      "<p data-test>1</p><p>2</p>",
      "<p data-test>new</p><p>2</p>",
    );
  },
});
Deno.test({
  name: 'E[attr="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test="one"]',
      '<p data-test="one">1</p><p data-test="two">2</p>',
      '<p data-test="one">new</p><p data-test="two">2</p>',
    );
  },
});
Deno.test({
  name: 'E[attr="value" i]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test="one" i]',
      '<p data-test="one">1</p><p data-test="OnE">2</p><p data-test="two">3</p>',
      '<p data-test="one">new</p><p data-test="OnE">new</p><p data-test="two">3</p>',
    );
  },
});
Deno.test({
  name: 'E[attr="value" s]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test="one" s]',
      '<p data-test="one">1</p><p data-test="OnE">2</p><p data-test="two">3</p>',
      '<p data-test="one">new</p><p data-test="OnE">2</p><p data-test="two">3</p>',
    );
  },
});
Deno.test({
  name: 'E[attr~="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test~="two"]',
      '<p data-test="one two three">1</p><p data-test="one two">2</p><p data-test="one">3</p>',
      '<p data-test="one two three">new</p><p data-test="one two">new</p><p data-test="one">3</p>',
    );
  },
});
Deno.test({
  name: 'E[attr^="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test^="a"]',
      '<p data-test="a1">1</p><p data-test="a2">2</p><p data-test="b1">3</p>',
      '<p data-test="a1">new</p><p data-test="a2">new</p><p data-test="b1">3</p>',
    );
  },
});
Deno.test({
  name: 'E[attr$="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test$="1"]',
      '<p data-test="a1">1</p><p data-test="a2">2</p><p data-test="b1">3</p>',
      '<p data-test="a1">new</p><p data-test="a2">2</p><p data-test="b1">new</p>',
    );
  },
});
Deno.test({
  name: 'E[attr*="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test*="b"]',
      '<p data-test="abc">1</p><p data-test="ab">2</p><p data-test="a">3</p>',
      '<p data-test="abc">new</p><p data-test="ab">new</p><p data-test="a">3</p>',
    );
  },
});
Deno.test({
  name: 'E[attr|="value"]',
  fn: async () => {
    await init();
    await selectorTest(
      'p[data-test|="a"]',
      '<p data-test="a">1</p><p data-test="a-1">2</p><p data-test="a2">3</p>',
      '<p data-test="a">new</p><p data-test="a-1">new</p><p data-test="a2">3</p>',
    );
  },
});
Deno.test({
  name: "E F",
  fn: async () => {
    await init();
    await selectorTest(
      "div span",
      "<div><h1><span>1</span></h1><span>2</span><b>3</b></div>",
      "<div><h1><span>new</span></h1><span>new</span><b>3</b></div>",
    );
  },
});
Deno.test({
  name: "E > F",
  fn: async () => {
    await init();
    await selectorTest(
      "div > span",
      "<div><h1><span>1</span></h1><span>2</span><b>3</b></div>",
      "<div><h1><span>1</span></h1><span>new</span><b>3</b></div>",
    );
  },
});

Deno.test({
  name: "throws error on unsupported selector",
  fn: async () => {
    await init();
    assertThrows(() => {
      new HTMLRewriter()
        .on("p:last-child", {
          element(element) {
            element.setInnerContent("new");
          },
        })
        .transform(new Response("<p>old</p>"));
    });
  },
});
