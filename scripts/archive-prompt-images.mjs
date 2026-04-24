import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const promptsDir = path.join(rootDir, "src", "data", "prompts");
const publicDir = path.join(rootDir, "public");
const defaultAssetRoot = path.join(publicDir, "prompt-assets");
const archiveProxy =
  process.env.PROMPT_ARCHIVE_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  "";

async function main() {
  const files = await getMarkdownFiles(promptsDir);
  const promptFiles = files.filter(file => !file.endsWith("README.md"));

  if (promptFiles.length === 0) {
    console.log("No prompt files found.");
    return;
  }

  let downloadedCount = 0;

  for (const filePath of promptFiles) {
    const fileText = await readFile(filePath, "utf8");
    const parsed = parsePromptFile(fileText);

    if (!parsed) {
      console.warn(`Skip invalid prompt file: ${filePath}`);
      continue;
    }

    const { frontmatter, body } = parsed;
    const slug = frontmatter.slug ?? path.basename(filePath, ".md");
    const sampleImages = frontmatter.sampleImages.filter(Boolean);

    if (sampleImages.length === 0) {
      continue;
    }

    const outputDir = resolveOutputDir(frontmatter, slug);
    await mkdir(outputDir, { recursive: true });

    const archivedImages = [];

    for (let index = 0; index < sampleImages.length; index += 1) {
      const imageUrl = sampleImages[index];

      try {
        const archivedImagePath = await downloadImage({
          imageUrl,
          outputDir,
          slug,
          index,
        });

        if (archivedImagePath) {
          archivedImages.push(archivedImagePath);
          downloadedCount += 1;
        }
      } catch (error) {
        console.warn(`Failed to archive ${imageUrl}: ${error.message}`);
      }
    }

    if (archivedImages.length > 0) {
      const updatedFrontmatter = {
        ...frontmatter,
        archivedImages,
        storage: {
          provider: "local",
          path: toPosixPath(path.relative(publicDir, outputDir)),
        },
      };

      const nextText = serializePromptFile(updatedFrontmatter, body);
      if (nextText !== fileText) {
        await writeFile(filePath, nextText, "utf8");
      }
    }
  }

  console.log(`Archived ${downloadedCount} image(s).`);
}

async function getMarkdownFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return getMarkdownFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
    })
  );

  return files.flat();
}

function parsePromptFile(fileText) {
  const match = fileText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const [, rawFrontmatter, body] = match;
  const lines = rawFrontmatter.split(/\r?\n/);
  const frontmatter = {
    title: "",
    slug: "",
    lang: "zh",
    sourceDate: "",
    sourcePlatform: "x",
    sourceUrl: "",
    prompt: "",
    summary: "",
    tags: [],
    sampleImages: [],
    archivedImages: [],
    storage: undefined,
  };

  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.includes(":")) {
      index += 1;
      continue;
    }

    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim();
    const value = rest.join(":").trim();

    if (key === "tags" || key === "sampleImages" || key === "archivedImages") {
      const items = [];
      index += 1;
      while (index < lines.length && /^\s+-\s+/.test(lines[index])) {
        items.push(unquote(lines[index].replace(/^\s+-\s+/, "").trim()));
        index += 1;
      }
      frontmatter[key] = items;
      continue;
    }

    if (key === "prompt") {
      const block = [];
      index += 1;
      while (index < lines.length && /^\s+/.test(lines[index])) {
        block.push(lines[index].replace(/^\s{2}/, ""));
        index += 1;
      }
      frontmatter.prompt = block.join("\n");
      continue;
    }

    if (key === "storage") {
      const storage = {};
      index += 1;
      while (index < lines.length && /^\s{2}\w+:/u.test(lines[index])) {
        const [storageKey, ...storageRest] = lines[index].trim().split(":");
        storage[storageKey] = unquote(storageRest.join(":").trim());
        index += 1;
      }
      frontmatter.storage = storage;
      continue;
    }

    frontmatter[key] = unquote(value);
    index += 1;
  }

  return { frontmatter, body };
}

function serializePromptFile(frontmatter, body) {
  const lines = [
    "---",
    `title: ${quote(frontmatter.title)}`,
    `slug: ${quote(frontmatter.slug)}`,
    `lang: ${frontmatter.lang}`,
    `sourceDate: ${frontmatter.sourceDate}`,
    `sourcePlatform: ${frontmatter.sourcePlatform}`,
    `sourceUrl: ${frontmatter.sourceUrl}`,
    "prompt: |",
    ...frontmatter.prompt.split("\n").map(line => `  ${line}`),
    `summary: ${quote(frontmatter.summary)}`,
    "tags:",
    ...frontmatter.tags.map(tag => `  - ${tag}`),
    "sampleImages:",
    ...frontmatter.sampleImages.map(url => `  - ${url}`),
    "archivedImages:",
    ...frontmatter.archivedImages.map(url => `  - ${url}`),
  ];

  if (frontmatter.storage) {
    lines.push("storage:");
    lines.push(`  provider: ${frontmatter.storage.provider}`);
    lines.push(`  path: ${frontmatter.storage.path}`);
  }

  lines.push("---", "", body.trimStart());
  return `${lines.join("\n")}\n`;
}

function resolveOutputDir(frontmatter, slug) {
  if (frontmatter.storage?.provider === "local" && frontmatter.storage.path) {
    return path.join(publicDir, frontmatter.storage.path);
  }

  const [year = "unknown", month = "00"] = frontmatter.sourceDate.split("T")[0].split("-");
  return path.join(defaultAssetRoot, year, month, slug);
}

async function downloadImage({ imageUrl, outputDir, slug, index }) {
  const fallbackExtension = getFileExtension(imageUrl, "image/jpeg");
  const fileName = `${slug}-${String(index + 1).padStart(2, "0")}.${fallbackExtension}`;
  const destination = path.join(outputDir, fileName);

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "user-agent": "Mozilla/5.0 PromptArchiveBot/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
    }

    const finalExtension = getFileExtension(imageUrl, contentType);
    const finalDestination = path.join(
      outputDir,
      `${slug}-${String(index + 1).padStart(2, "0")}.${finalExtension}`
    );
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(finalDestination, buffer);

    return `/${toPosixPath(path.relative(publicDir, finalDestination))}`;
  } catch {
    await downloadViaCurl(imageUrl, destination);
  }

  return `/${toPosixPath(path.relative(publicDir, destination))}`;
}

async function downloadViaCurl(imageUrl, destination) {
  const args = [
    "--location",
    "--fail",
    "--silent",
    "--show-error",
    "--output",
    destination,
  ];

  if (archiveProxy) {
    args.push("--proxy", archiveProxy);
  }

  args.push(imageUrl);

  try {
    await execFileAsync("curl.exe", args, { windowsHide: true });
  } catch (error) {
    const stderr = error?.stderr?.trim();
    throw new Error(stderr || error.message || "curl download failed");
  }
}

function getFileExtension(imageUrl, contentType) {
  const url = new URL(imageUrl);
  const ext = path.extname(url.pathname).replace(".", "").toLowerCase();
  if (ext) return ext;

  const mime = contentType.split("/")[1]?.toLowerCase();
  if (mime === "jpeg") return "jpg";
  return mime || "jpg";
}

function quote(value) {
  return JSON.stringify(value ?? "");
}

function unquote(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});