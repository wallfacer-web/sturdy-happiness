import fs from 'node:fs/promises';
import path from 'node:path';

const sourceRootArg = process.argv[2] ?? process.env.PROMPT_ENG_SOURCE;

if (!sourceRootArg) {
	throw new Error('Missing source path. Pass it as an argument or set PROMPT_ENG_SOURCE.');
}

const repoRoot = process.cwd();
const sourceRoot = path.resolve(sourceRootArg);
const docsRoot = path.join(repoRoot, 'src', 'content', 'docs');
const landingPagePath = path.join(docsRoot, 'index.mdx');

const excludedDirs = new Set([
	'.git',
	'.github',
	'.obsidian',
	'.smart-env',
	'node_modules',
	'notebooklm-py',
	'public',
	'quartz',
	'repo-meta',
	'scripts',
]);

const excludedFiles = new Set([
	'.gitignore',
	'.git.broken',
	'index.md',
	'README.md',
	'网站发布说明.md',
	'给下一个Codex的项目交接.md',
	'给新Codex的NotebookLM使用说明.md',
	'首页.md',
]);

const specialSlugs = new Map([
	['00-MOC-课程总导航.md', 'course-map'],
	['课程介绍（网页版）.md', 'course-intro'],
	['角色入口总览（网页版）.md', 'audience-entry'],
	['工作台总览（网页版）.md', 'workbench-overview'],
]);

const directoryIndexBasenames = new Set([
	'角色入口总览.md',
	'00-工作台总览.md',
	'00-基础层说明.md',
	'00-方法层说明.md',
	'00-应用层说明.md',
	'00-前沿层说明.md',
	'知识卡片MOC.md',
	'模板总览.md',
	'对象库总览.md',
	'课程运行总览.md',
]);

const noteMap = new Map();
const routeMap = new Map();
const filesToImport = [];

const landingPage = await fs.readFile(landingPagePath, 'utf8').catch(() => null);

await fs.rm(docsRoot, { recursive: true, force: true });
await fs.mkdir(docsRoot, { recursive: true });

if (landingPage) {
	await fs.writeFile(landingPagePath, landingPage, 'utf8');
}

await walk(sourceRoot);

for (const sourceFile of filesToImport) {
	const sourceRel = toPosix(path.relative(sourceRoot, sourceFile));
	const targetRel = targetRelativePath(sourceRel);
	const route = primaryRouteForSourceRel(sourceRel);
	const noteName = path.posix.basename(sourceRel, '.md');

	routeMap.set(sourceRel, route);
	noteMap.set(stripMarkdownExtension(sourceRel), route);
	noteMap.set(sourceRel, route);

	if (noteName !== 'README' && noteName !== 'index' && noteName !== '首页') {
		if (!noteMap.has(noteName)) {
			noteMap.set(noteName, route);
		}
	}
}

noteMap.set('index', '');
noteMap.set('首页', '');

for (const sourceFile of filesToImport) {
	const sourceRel = toPosix(path.relative(sourceRoot, sourceFile));
	const targetRel = targetRelativePath(sourceRel);
	const outputPath = path.join(docsRoot, targetRel);
	const sourceName = path.posix.basename(sourceRel);

	await fs.mkdir(path.dirname(outputPath), { recursive: true });

	const raw = await fs.readFile(sourceFile, 'utf8');
	const { title, body } = extractTitleAndBody(raw, path.posix.basename(sourceRel, '.md'));
	const cleanedBody = stripLeadingTitleHeading(body, title);
	const convertedBody = replaceWikiLinks(cleanedBody, sourceRel);
	const specialSlug = specialSlugs.get(sourceName);
	const documentSlug = specialSlug ?? primaryRouteForSourceRel(sourceRel);
	const rendered = renderDocument(title, convertedBody, documentSlug);

	await fs.writeFile(outputPath, rendered, 'utf8');

	if (shouldCreateDirectoryIndex(sourceRel)) {
		const directoryIndexPath = path.join(path.dirname(outputPath), 'index.md');
		const directoryRendered = renderDocument(title, convertedBody);
		await fs.writeFile(directoryIndexPath, directoryRendered, 'utf8');
	}
}

console.log(`Imported ${filesToImport.length} Markdown files from ${sourceRoot}`);

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const absolutePath = path.join(dir, entry.name);
		const relativePath = toPosix(path.relative(sourceRoot, absolutePath));
		const isDirectory = entry.isDirectory() || (!entry.isFile() && !entry.isDirectory() && (await fs.stat(absolutePath)).isDirectory());
		const isFile = entry.isFile() || (!entry.isFile() && !entry.isDirectory() && (await fs.stat(absolutePath)).isFile());

		if (isDirectory) {
			if (shouldSkipDirectory(relativePath)) {
				continue;
			}

			await walk(absolutePath);
			continue;
		}

		if (!isFile || path.extname(entry.name).toLowerCase() !== '.md') {
			continue;
		}

		if (excludedFiles.has(entry.name)) {
			continue;
		}

		filesToImport.push(absolutePath);
	}
}

function shouldSkipDirectory(relativePath) {
	if (!relativePath) {
		return false;
	}

	return relativePath
		.split('/')
		.some((segment) => excludedDirs.has(segment));
}

function targetRelativePath(sourceRel) {
	if (path.posix.basename(sourceRel).toLowerCase() === 'readme.md') {
		return path.posix.join(path.posix.dirname(sourceRel), 'index.md');
	}

	return sourceRel;
}

function primaryRouteForSourceRel(sourceRel) {
	const targetRel = targetRelativePath(sourceRel);

	if (path.posix.basename(targetRel).toLowerCase() === 'index.md') {
		return path.posix.dirname(targetRel);
	}

	return stripMarkdownExtension(targetRel);
}

function shouldCreateDirectoryIndex(sourceRel) {
	return directoryIndexBasenames.has(path.posix.basename(sourceRel));
}

function renderDocument(title, body, slug) {
	const frontmatterLines = ['---', `title: ${yamlString(title)}`];

	if (slug) {
		frontmatterLines.push(`slug: ${yamlString(slug)}`);
	}

	frontmatterLines.push('---', '');
	const frontmatter = frontmatterLines.join('\n');
	return `${frontmatter}\n${body.trim()}\n`;
}

function extractTitleAndBody(raw, fallbackTitle) {
	const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
	const frontmatter = frontmatterMatch?.[1] ?? '';
	const body = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;
	const titleFromFrontmatter = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim();
	const firstHeading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
	const title = unquote(titleFromFrontmatter ?? firstHeading ?? fallbackTitle);

	return { title, body };
}

function stripLeadingTitleHeading(body, title) {
	const normalized = body.replace(/^\uFEFF/, '').trimStart();
	const headingPattern = new RegExp(`^#\\s+${escapeRegExp(title)}\\s*\\n+`);

	if (headingPattern.test(normalized)) {
		return normalized.replace(headingPattern, '');
	}

	return normalized;
}

function replaceWikiLinks(content, currentSourceRel) {
	return content.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
		const [targetPart, aliasPart] = inner.split('|');
		const targetRaw = targetPart.trim();
		const alias = aliasPart?.trim();
		const destinationRoute = resolveTargetRoute(currentSourceRel, targetRaw);

		if (destinationRoute === null) {
			return alias ?? targetRaw;
		}

		const href = relativeHref(routeMap.get(currentSourceRel), destinationRoute);
		const label = alias ?? targetRaw.split('/').pop()?.replace(/\.md$/i, '') ?? targetRaw;
		return `[${label}](${href})`;
	});
}

function resolveTargetRoute(currentSourceRel, rawTarget) {
	const cleaned = rawTarget.replace(/\\/g, '/').split('#')[0].trim();

	if (!cleaned) {
		return null;
	}

	if (noteMap.has(cleaned)) {
		return noteMap.get(cleaned);
	}

	const currentDir = path.posix.dirname(currentSourceRel);
	const relativeCandidate = stripMarkdownExtension(path.posix.normalize(path.posix.join(currentDir, cleaned)));

	if (noteMap.has(relativeCandidate)) {
		return noteMap.get(relativeCandidate);
	}

	let forgivingCandidate = relativeCandidate;
	while (forgivingCandidate.startsWith('../')) {
		forgivingCandidate = forgivingCandidate.slice(3);
		if (noteMap.has(forgivingCandidate)) {
			return noteMap.get(forgivingCandidate);
		}
	}

	const relativeReadmeCandidate = stripMarkdownExtension(
		path.posix.normalize(path.posix.join(currentDir, cleaned, 'README.md')),
	);
	if (noteMap.has(relativeReadmeCandidate)) {
		return noteMap.get(relativeReadmeCandidate);
	}

	let forgivingReadmeCandidate = relativeReadmeCandidate;
	while (forgivingReadmeCandidate.startsWith('../')) {
		forgivingReadmeCandidate = forgivingReadmeCandidate.slice(3);
		if (noteMap.has(forgivingReadmeCandidate)) {
			return noteMap.get(forgivingReadmeCandidate);
		}
	}

	if (noteMap.has(`${cleaned}/README`)) {
		return noteMap.get(`${cleaned}/README`);
	}

	const basenameCandidate = path.posix.basename(cleaned);
	if (noteMap.has(basenameCandidate)) {
		return noteMap.get(basenameCandidate);
	}

	return null;
}

function relativeHref(fromRoute, toRoute) {
	if (toRoute === '') {
		const fromDir = fromRoute ?? '';
		const rel = path.posix.relative(fromDir, '') || '.';
		return ensureTrailingSlash(rel);
	}

	const fromDir = fromRoute ?? '';
	const rel = path.posix.relative(fromDir, toRoute) || '.';
	return ensureTrailingSlash(rel);
}

function ensureTrailingSlash(value) {
	return value.endsWith('/') ? value : `${value}/`;
}

function stripMarkdownExtension(value) {
	return value.replace(/\.md$/i, '');
}

function toPosix(value) {
	return value.split(path.sep).join('/');
}

function yamlString(value) {
	return `'${value.replace(/'/g, "''")}'`;
}

function unquote(value) {
	return value.replace(/^['"]|['"]$/g, '');
}

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
