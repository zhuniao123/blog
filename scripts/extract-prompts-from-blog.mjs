import fs from "node:fs";
import path from "node:path";

const root = "D:/requirement/blog";
const blogDir = path.join(root, "src/data/blog");
const promptDir = path.join(root, "src/data/prompts");

const targetFiles = [
	"gpt-image-2-english-prompts-2026-04-30.md",
	"gpt-image-2-chinese-prompts-2026-05-01.md",
	"gpt-image-2-english-prompts-2026-05-01.md",
	"gpt-image-2-chinese-prompts-2026-05-02.md",
	"gpt-image-2-english-prompts-2026-05-02.md",
	"gpt-image-2-chinese-prompts-2026-05-03.md",
	"gpt-image-2-english-prompts-2026-05-03.md",
];

const forbiddenTokens = [
	"...",
	"…",
	"详见原帖",
	"完整长提示",
	"完整结构",
	"full prompt in source",
	"see source thread",
	"完整提示词见",
	"[完整",
	"[full",
];

function normalizePrompt(raw) {
	return raw
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/&nbsp;/g, " ")
		.replace(/\r\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function isExtractable(prompt) {
	if (prompt.length < 80) return false;
	const lower = prompt.toLowerCase();
	if (forbiddenTokens.some(token => lower.includes(token.toLowerCase()))) return false;
	return true;
}

function findNearestSourceUrl(content, offset) {
	const prev = content.slice(0, offset);
	const urls = [...prev.matchAll(/https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+/g)];
	if (urls.length === 0) return "https://x.com";
	return urls[urls.length - 1][0];
}

function findNearbyImageUrls(content, offset) {
	const windowStart = Math.max(0, offset - 1200);
	const windowEnd = Math.min(content.length, offset + 1200);
	const windowText = content.slice(windowStart, windowEnd);
	return [...new Set([...windowText.matchAll(/https:\/\/pbs\.twimg\.com\/media\/[A-Za-z0-9_\-\.]+\.jpg/g)].map(m => m[0]))].slice(0, 4);
}

function toSlugPart(text) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-")
		.slice(0, 42);
}

function dateFromName(name) {
	const m = name.match(/(\d{4})-(\d{2})-(\d{2})/);
	if (!m) return "2026-05-06";
	return `${m[1]}-${m[2]}-${m[3]}`;
}

function escapeYaml(value) {
	return value.replace(/"/g, '\\"');
}

let created = 0;

for (const file of targetFiles) {
	const filePath = path.join(blogDir, file);
	if (!fs.existsSync(filePath)) continue;

	const content = fs.readFileSync(filePath, "utf8");
	const lang = file.includes("chinese") ? "zh" : "en";
	const date = dateFromName(file);

	const codeBlocks = [...content.matchAll(/```(?:text)?\n?([\s\S]*?)```/g)];
	let index = 0;

	for (const match of codeBlocks) {
		const raw = match[1] ?? "";
		const promptText = normalizePrompt(raw);
		if (!isExtractable(promptText)) continue;

		const at = match.index ?? 0;
		const sourceUrl = findNearestSourceUrl(content, at);
		const tweetId = sourceUrl.split("/").pop() ?? `unknown-${index + 1}`;
		const sampleImages = findNearbyImageUrls(content, at);

		index += 1;

		const title =
			lang === "zh"
				? `提取提示词 ${date} #${index}`
				: `Extracted Prompt ${date} #${index}`;
		const slug = `extracted-${date}-${lang}-${tweetId}-${index}`;
		const fileName = `${date}-${toSlugPart(slug)}.md`;
		const outPath = path.join(promptDir, fileName);

		if (fs.existsSync(outPath)) continue;

		const promptBlock = promptText
			.split("\n")
			.map(line => `  ${line}`)
			.join("\n");

		const imageYaml =
			sampleImages.length > 0
				? sampleImages.map(url => `  - ${url}`).join("\n")
				: "  []";

		const body =
			lang === "zh"
				? `## 核心价值\n\n从博文自动提取的可复制 prompt，用于快速复现和二次改写。\n\n## 适用场景\n\n- 社媒配图\n- 封面海报\n- 视觉草案\n\n## 使用提醒\n\n如果输出偏离预期，优先补充主体约束和负面约束，而不是无限堆叠风格词。\n`
				: `## Core Value\n\nCopy-ready prompt extracted from roundup content for faster reuse and iteration.\n\n## Recommended Use Cases\n\n- Social visuals\n- Poster drafts\n- Creative mockups\n\n## Usage Notes\n\nWhen quality drops, tighten subject constraints and negatives before adding more style terms.\n`;

		const frontmatter = `---\ntitle: "${escapeYaml(title)}"\nslug: "${slug}"\nlang: ${lang}\nsourceDate: ${date}T00:00:00Z\nsourcePlatform: x\nsourceUrl: ${sourceUrl}\nprompt: |\n${promptBlock}\nsummary: "${lang === "zh" ? "从 roundup 博文提取出的可复用提示词。" : "Reusable prompt extracted from roundup blog content."}"\ntags:\n  - gpt-image-2\n  - prompt\n  - extracted\nsampleImages:\n${imageYaml}\narchivedImages: []\n---\n\n`;

		fs.writeFileSync(outPath, frontmatter + body, "utf8");
		created += 1;
		console.log(`CREATED ${path.basename(outPath)}`);
	}
}

console.log(`DONE created=${created}`);
