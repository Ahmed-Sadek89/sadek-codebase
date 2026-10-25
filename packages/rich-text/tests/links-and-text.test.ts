import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  isRichTextEmpty,
  plainTextToHtml,
  richTextToPlainText,
  sanitizeRichText,
} from "../src/index.ts";

describe("sanitizeRichText: link schemes", () => {
  const unsafe = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "java\tscript:alert(1)",
    "java&#x09;script:alert(1)",
    "&#106;avascript:alert(1)",
    "&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;:alert(1)",
    "javascript&colon;alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "//evil.example",
    "/relative/path",
    "file:///etc/passwd",
    "ftp://evil.example",
    "",
  ];
  for (const href of unsafe) {
    test(JSON.stringify(href), () => {
      const out = sanitizeRichText(`<p><a href="${href}">click</a></p>`);
      assert.equal(out, "<p>click</p>");
    });
  }

  test("an unsafe link next to a safe one leaves the safe one intact", () => {
    assert.equal(
      sanitizeRichText('<p><a href="javascript:alert(1)">bad</a> <a href="https://ok.example">ok</a> <a href="data:x">bad2</a></p>'),
      '<p>bad <a href="https://ok.example" target="_blank" rel="noopener noreferrer nofollow">ok</a> bad2</p>',
    );
  });

  test("renamed tags close correctly next to their targets", () => {
    assert.equal(
      sanitizeRichText("<h1>a</h1><h2>b</h2><p><b>c</b><strong>d</strong><i>e</i><em>f</em></p>"),
      "<h2>a</h2><h2>b</h2><p><strong>c</strong><strong>d</strong><em>e</em><em>f</em></p>",
    );
  });

  test("a link without href keeps only its text", () => {
    assert.equal(sanitizeRichText("<p><a name='x'>t</a></p>"), "<p>t</p>");
  });
});

describe("sanitizeRichText: empty and legacy input", () => {
  test("empty editor output becomes an empty string", () => {
    for (const value of ["", "<p></p>", "<p> </p>", "<p><br></p>", "<p>&nbsp;</p>", "<hr>", "<script>x</script>", null, undefined]) {
      assert.equal(sanitizeRichText(value), "", String(value));
    }
  });

  test("legacy plain text becomes escaped paragraphs", () => {
    assert.equal(
      sanitizeRichText("First line\nsecond line\n\nNext <paragraph> & more"),
      "<p>First line<br />second line</p><p>Next &lt;paragraph&gt; &amp; more</p>",
    );
  });

  test("plainTextToHtml leaves HTML as is", () => {
    assert.equal(plainTextToHtml("<p>x</p>"), "<p>x</p>");
  });

  test("plain text that merely contains a tag is escaped, not parsed", () => {
    assert.equal(
      sanitizeRichText("Hello <script>alert(1)</script>"),
      "<p>Hello &lt;script&gt;alert(1)&lt;/script&gt;</p>",
    );
  });

  test("a lone '<' in plain text is escaped, not parsed", () => {
    assert.equal(sanitizeRichText("a < b"), "<p>a &lt; b</p>");
  });
});

test("deeply nested markup does not overflow the stack", () => {
  const deep = "<blockquote>".repeat(5000) + "x" + "</blockquote>".repeat(5000);
  assert.doesNotThrow(() => sanitizeRichText(deep));
  assert.doesNotThrow(() => sanitizeRichText("<iframe>".repeat(5000)));
});

describe("richTextToPlainText / isRichTextEmpty", () => {
  test("strips tags, decodes entities, keeps block words apart", () => {
    assert.equal(
      richTextToPlainText("<h2>Title</h2><p>a &amp; b &lt;c&gt;</p><ul><li>one</li><li>two</li></ul>"),
      "Title a & b <c> one two",
    );
  });

  test("drops script and style content", () => {
    assert.equal(richTextToPlainText("<p>x</p><script>alert(1)</script><style>p{}</style>"), "x");
  });

  test("empty checks", () => {
    assert.equal(isRichTextEmpty("<p></p>"), true);
    assert.equal(isRichTextEmpty("<p><br></p>"), true);
    assert.equal(isRichTextEmpty("<p>x</p>"), false);
    assert.equal(isRichTextEmpty(null), true);
  });
});
