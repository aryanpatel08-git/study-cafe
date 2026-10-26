// Reads a PDF or PowerPoint file in the browser and splits it into study sections.
// Nothing is uploaded anywhere: the file never leaves the user's device.

export type Section = { start: number; end: number; text: string };
export type ParsedFile = { unit: "pages" | "slides"; count: number; sections: Section[] };

// About 8,000 characters is roughly 2,000 tokens, a comfortable size for one AI request.
const SECTION_CHARS = 8000;

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

async function readPdf(buf: ArrayBuffer): Promise<string[]> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: false });
  return (Array.isArray(text) ? text : [text]).map((t) => t.replace(/\s+/g, " ").trim());
}

async function readPptx(buf: ArrayBuffer): Promise<string[]> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buf);
  const slides = Object.keys(zip.files)
    .map((name) => ({ name, m: /^ppt\/slides\/slide(\d+)\.xml$/.exec(name) }))
    .filter((x) => x.m)
    .sort((a, b) => Number(a.m![1]) - Number(b.m![1]));
  const out: string[] = [];
  for (const s of slides) {
    const xml = await zip.files[s.name].async("string");
    const parts = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)].map((m) => decodeXml(m[1]));
    out.push(parts.join(" ").replace(/\s+/g, " ").trim());
  }
  return out;
}

function toSections(pages: string[]): Section[] {
  const sections: Section[] = [];
  let text = "";
  let start = 1;
  pages.forEach((p, i) => {
    const n = i + 1;
    if (!p) return;
    if (text && text.length + p.length > SECTION_CHARS) {
      sections.push({ start, end: n - 1, text: text.trim() });
      text = "";
      start = n;
    }
    if (!text) start = n;
    text += `[Page ${n}] ${p}\n`;
  });
  if (text.trim()) sections.push({ start, end: pages.length, text: text.trim() });
  return sections;
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const buf = await file.arrayBuffer();
  const isPdf = /\.pdf$/i.test(file.name);
  const pages = isPdf ? await readPdf(buf) : await readPptx(buf);
  const chars = pages.reduce((n, p) => n + p.length, 0);
  if (chars < 100) throw new Error("No readable text found");
  return { unit: isPdf ? "pages" : "slides", count: pages.length, sections: toSections(pages) };
}
