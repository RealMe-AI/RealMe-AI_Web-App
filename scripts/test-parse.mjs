import { test } from "node:test";
import assert from "node:assert/strict";
import markdownToPlainText from "../app/lib/markdownToPlainText.ts";
import sanitizeAsterisks from "../app/lib/sanitizeMarkdown.ts";

// Same token regex used by markdownToPlainText.stripInline and
// parseMarkdown.parseInline — verifies segmentation the renderer relies on.
const INLINE_TOKEN = /(`[^`]+`)|(\*\*(.+?)\*\*)|(\*([^*\n]+)\*)|(~~(.+?)~~)|\[([^\]]+)\]\([^)]*\)/g;

function tokens(text) {
  const out = [];
  for (const m of text.matchAll(INLINE_TOKEN)) {
    if (m[1] !== undefined) out.push(`code:${m[1]}`);
    else if (m[3] !== undefined) out.push(`bold:${m[3]}`);
    else if (m[5] !== undefined) out.push(`em:${m[5]}`);
    else if (m[7] !== undefined) out.push(`del:${m[7]}`);
    else if (m[8] !== undefined) out.push(`a:${m[8]}`);
  }
  return out;
}

test("markdownToPlainText keeps bold inline in mid-sentence", () => {
  const out = markdownToPlainText("Agha gara ume, kpatara **ọnwụ** na ụba.");
  assert.equal(out, "Agha gara ume, kpatara ọnwụ na ụba.");
});

test("markdownToPlainText preserves multiple lines (no first-line truncation)", () => {
  const out = markdownToPlainText(
    "Atụrụ dị ka **Benin** (n'ala Edo), **Oyo** (n'ala Yorùbá).\nNdị a nwere omenala.",
  );
  assert.equal(out, "Atụrụ dị ka Benin (n'ala Edo), Oyo (n'ala Yorùbá).\nNdị a nwere omenala.");
});

test("markdownToPlainText strips empty/stray ** residues", () => {
  assert.equal(markdownToPlainText("na Middle East na ** ** in inside."), "na Middle East na  in inside.");
  assert.equal(markdownToPlainText("stray ** marker"), "stray  marker");
});

test("markdownToPlainText handles links, strike, inline code", () => {
  assert.equal(
    markdownToPlainText("[RealMe](https://x.com) ~~dup~~ and \`code\` keep text."),
    "RealMe dup and code keep text.",
  );
});

test("renderer tokenizer segments bold anywhere in sentence", () => {
  assert.deepEqual(tokens("kpatara **ọnwụ** na ụba"), ["bold:ọnwụ"]);
  assert.deepEqual(tokens("**Benin** (n'ala Edo), **Oyo** na **Ifẹ̀**."), [
    "bold:Benin",
    "bold:Oyo",
    "bold:Ifẹ̀",
  ]);
});

test("sanitize Option B: flatten mid-sentence, keep bullet-lead bold", () => {
  assert.equal(
    sanitizeAsterisks("- **Ndị mbụ bi n'ala**: gụnyere **Ọdọ̀m̀bà**, **Ifẹ̀**, na **Ugwuele**."),
    "- **Ndị mbụ bi n'ala**: gụnyere Ọdọ̀m̀bà, Ifẹ̀, na Ugwuele.",
  );
  assert.equal(
    sanitizeAsterisks("1. **Naịjirịa**: Oge Ncheta **mbụ**."),
    "1. **Naịjirịa**: Oge Ncheta mbụ.",
  );
  assert.equal(sanitizeAsterisks("**Benin** na **Ifẹ̀** ok"), "Benin na Ifẹ̀ ok");
  assert.equal(
    sanitizeAsterisks("gụnyere **Ọdọ̀m̀bà**, **Ifẹ̀**, na **Ugwuele**"),
    "gụnyere Ọdọ̀m̀bà, Ifẹ̀, na Ugwuele",
  );
  assert.equal(sanitizeAsterisks("na *ụba* ok"), "na ụba ok");
});

test("sanitize drops dangling/unpaired and punctuation-only markers", () => {
  const norm = (s) => s.trim().replace(/\s+/g, " ");
  assert.equal(norm(sanitizeAsterisks("Nsogbu **Corruption**, ** ")), norm("Nsogbu Corruption,"));
  assert.equal(norm(sanitizeAsterisks("Nsogbu **Corruption**, ** Bola")), norm("Nsogbu Corruption, Bola"));
  assert.equal(sanitizeAsterisks("stray ** marker"), "stray  marker");
  assert.equal(sanitizeAsterisks("open **bold without close"), "open bold without close");
  assert.equal(sanitizeAsterisks("empty ** ** bold"), "empty   bold");
});

test("sanitize fixes model interleaving Term**, **Term** (no ** left)", () => {
  assert.equal(
    sanitizeAsterisks("Nnamdi Azikiwe (Zik)**, **Obafemi Awolowo**, **Ahmadu Bello**, **Nnamdi Okonkwo"),
    "Nnamdi Azikiwe (Zik), Obafemi Awolowo, Ahmadu Bello, Nnamdi Okonkwo",
  );
  assert.equal(sanitizeAsterisks("****"), "");
});

test("sanitize keeps inline code untouched but flattens emphasis around it", () => {
  assert.equal(sanitizeAsterisks("kpatara **ọnwụ** na *ụba* `code`"), "kpatara ọnwụ na ụba `code`");
});

test("sanitize guarantees no literal * remains except bullet-lead pair", () => {
  const samples = [
    "- **Term**: a**b**c **d** ok.",
    "Nnamdi Azikiwe (Zik)**, **Obafemi Awolowo**, **Ahmadu Bello**, **Nnamdi Okonkwo",
    "alaeze dị ka **Oyo**, **Benin**, na **Ifẹ** (n'ala Yorùbá)",
    "e nwere obodo dị ka **Oyo**, na **Ifẹ** (n'ala Yorùbá)",
    "Onye isi ala mbụ n'oge nd ",
    "1. **Naịjirịa**: Oge **mbụ**.",
  ];
  for (const sample of samples) {
    const out = sanitizeAsterisks(sample);
    // Only a single merged bullet-lead pair is permitted; anything else with a
    // `*` indicates a leak.
    const remainder = out.replace(/^- \*\*[^*]+\*\*:/, "").replace(/^\d+\. \*\*[^*]+\*\*:/, "");
    assert.ok(!remainder.includes("*"), JSON.stringify({ sample, out, remainder }));
  }
  // Bullet-lead pair must be the only bold kept
  assert.equal(sanitizeAsterisks("- **Term**: a**b**c"), "- **Term**: abc");
});

test("sanitize adds space after colon followed by a letter, but not ://", () => {
  assert.equal(sanitizeAsterisks("(1939 - 1975):General Francisco Franco ruled"), "(1939 - 1975): General Francisco Franco ruled");
  assert.equal(sanitizeAsterisks("url https://x.com: ok"), "url https://x.com: ok");
  assert.equal(sanitizeAsterisks("e.g :nke bụ okwu"), "e.g : nke bụ okwu");
});

test("renderer: bullet-lead keeps bold and shows the colon", () => {
  const renderDefItem = (item) => {
    const m = item.match(/^\*\*(.+?)\*\*\s*([:：\-–—])\s*(.+)$/);
    return m ? `{B}${m[1]}{/B}${m[2]}` + (m[3] ? ` ${m[3]}` : "") : null;
  };
  const cleaned = sanitizeAsterisks("- **Ndị mbụ bi n'ala**: gụnyere **Ọdọ̀m̀bà**.");
  const item = cleaned.replace(/^- /, "");
  const rendered = renderDefItem(item);
  assert.equal(rendered, "{B}Ndị mbụ bi n'ala{/B}: gụnyere Ọdọ̀m̀bà.");
});