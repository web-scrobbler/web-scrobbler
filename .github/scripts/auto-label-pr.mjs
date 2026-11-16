#!/usr/bin/env node
// Applies taxonomy labels to pull requests based on the conventional-commit
// title and the set of changed files. Invoked by .github/workflows/auto-label.yml.
//
// Label mapping (see .github/release-drafter.yml):
//   deps-only change            -> maintenance + dependencies + semver bump
//   locales-only change         -> translations + skip-changelog
//   docs/tooling-only change    -> maintenance + skip-changelog
//   feat + new connector file   -> new-connector + minor-change
//   feat + core runtime         -> new-feature + minor-change
//   feat + connector only       -> updated + minor-change
//   fix + core runtime          -> core-fix + patch-change
//   fix + connector only        -> fixed-connector + patch-change
//   other + runtime change      -> updated + patch-change
//   '!' or BREAKING CHANGE      -> major-change (overrides minor/patch)
//
// Existing category/versioning labels are never duplicated or overridden;
// topical extras (dependencies, translations, skip-changelog) are added
// only when missing.

const REPO = process.env.GITHUB_REPOSITORY;
const PR_NUMBER = process.env.PR_NUMBER;
const TOKEN = process.env.GH_TOKEN;

const VERSIONING_LABELS = new Set([
	'major-change',
	'minor-change',
	'patch-change',
]);
const CATEGORY_LABELS = new Set([
	'new-feature',
	'core-fix',
	'new-connector',
	'fixed-connector',
	'updated',
	'maintenance',
]);

const CONNECTOR_FILE = /^src\/connectors\/[\w.-]+\.ts$/;
const CONNECTOR_SCOPE =
	/^src\/connectors\/|^tests\/connectors\/|^src\/core\/connectors\.ts$/;
const LOCALE_SCOPE = /^src\/_locales\//;
const DEP_FILE = /^(package(-lock)?\.json)$/;
const TEST_FILE = /^tests\//;
const DOC_FILE = /^(docs\/|.+\.(md|markdown|mdx|rst|txt)$)/i;

const isDocFile = (name) => DOC_FILE.test(name);
const isTestFile = (name) => TEST_FILE.test(name);
const isDepFile = (name) => DEP_FILE.test(name);
const isLocaleFile = (name) => LOCALE_SCOPE.test(name);
const isConnectorFile = (name) => CONNECTOR_SCOPE.test(name);
const isCoreRuntime = (name) =>
	name.startsWith('src/') && !isConnectorFile(name) && !isLocaleFile(name);

// Runtime classes that decide the scope: dep | locale | connector | core.
// Docs, tests and tooling files do not influence the scope.
function classifyRuntime(name) {
	if (isDepFile(name)) {
		return 'dep';
	}
	if (isLocaleFile(name)) {
		return 'locale';
	}
	if (isConnectorFile(name)) {
		return 'connector';
	}
	if (isCoreRuntime(name)) {
		return 'core';
	}
	return null;
}

function parseTitle(title) {
	const m = title.match(/^(\w+)(?:\([^)]*\))?(!)?:/);
	return { kind: m?.[1] ?? '', breaking: Boolean(m?.[3]) };
}

// Highest semver bump found in a package.json diff patch.
function depVersioning(patch) {
	if (!patch) {
		return 'patch-change';
	}
	const oldVersions = new Map();
	const newVersions = new Map();
	const lineRe = /^[-+]\s*"((?:@[^"/]+\/)?[^"/]+)"\s*:\s*"([^"]+)"/;

	for (const line of patch.split('\n')) {
		const m = line.match(lineRe);
		if (!m) {
			continue;
		}
		const [, name, version] = m;
		if (name === 'version') {
			continue;
		}
		const target = line.startsWith('-') ? oldVersions : newVersions;
		if (!target.has(name)) {
			target.set(name, version);
		}
	}

	const semver = (v) => {
		const m = v.match(/\d+\.\d+\.\d+/);
		return m ? m[0].split('.').map(Number) : null;
	};

	let result = 'patch-change';
	for (const [name, oldV] of oldVersions) {
		const newV = newVersions.get(name);
		if (!newV) {
			continue;
		}
		const o = semver(oldV);
		const n = semver(newV);
		if (!o || !n) {
			continue;
		}
		if (o[0] !== n[0]) {
			return 'major-change';
		}
		if (o[1] !== n[1]) {
			result = 'minor-change';
		}
	}
	return result;
}

export function computeLabels({ title, body, files }) {
	const { kind, breaking } = parseTitle(title ?? '');
	const isBreaking = breaking || /BREAKING[ -]CHANGE/i.test(body ?? '');

	const runtime = new Set(
		files
			.filter((f) => !isDocFile(f.filename) && !isTestFile(f.filename))
			.map((f) => classifyRuntime(f.filename))
			.filter(Boolean),
	);
	const has = (c) => runtime.has(c);
	const addedConnector = files.some(
		(f) => f.status === 'added' && CONNECTOR_FILE.test(f.filename),
	);

	const labels = [];
	const extras = new Set();

	let scope;
	if (runtime.size === 0) {
		scope = 'tooling';
	} else if ([...runtime].every((c) => c === 'dep')) {
		scope = 'deps';
	} else if ([...runtime].every((c) => c === 'locale')) {
		scope = 'locale';
	} else if (has('core')) {
		scope = 'core';
	} else if (has('connector')) {
		scope = 'connector';
	} else {
		scope = 'tooling';
	}

	switch (scope) {
		case 'deps': {
			labels.push('maintenance');
			extras.add('dependencies');
			break;
		}
		case 'locale': {
			labels.push('translations');
			extras.add('skip-changelog');
			break;
		}
		case 'tooling': {
			labels.push('maintenance');
			extras.add('skip-changelog');
			break;
		}
		case 'connector': {
			if (kind === 'feat') {
				labels.push(addedConnector ? 'new-connector' : 'updated');
			} else if (kind === 'fix') {
				labels.push('fixed-connector');
			} else {
				labels.push('updated');
			}
			break;
		}
		case 'core': {
			if (kind === 'feat') {
				labels.push('new-feature');
			} else if (kind === 'fix') {
				labels.push('core-fix');
			} else {
				labels.push('updated');
			}
			break;
		}
	}

	let versioning;
	if (isBreaking) {
		versioning = 'major-change';
	} else if (scope === 'deps') {
		const pkgPatch = files.find(
			(f) => f.filename === 'package.json',
		)?.patch;
		versioning = depVersioning(pkgPatch);
	} else if (scope === 'locale' || scope === 'tooling') {
		// Non-runtime changes never bump more than a patch.
		versioning = 'patch-change';
	} else if (kind === 'feat') {
		versioning = 'minor-change';
	} else {
		versioning = 'patch-change';
	}

	return [...new Set([...labels, versioning, ...extras])];
}

async function api(path, options = {}) {
	const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
		...options,
		headers: {
			authorization: `Bearer ${TOKEN}`,
			accept: 'application/vnd.github+json',
			'x-github-api-version': '2022-11-28',
			'content-type': 'application/json',
		},
	});
	if (!res.ok) {
		throw new Error(
			`${options.method ?? 'GET'} ${path} -> ${res.status}: ${await res.text()}`,
		);
	}
	return res.status === 204 ? null : res.json();
}

async function listFiles() {
	const files = [];
	for (let page = 1; ; page++) {
		const batch = await api(
			`/pulls/${PR_NUMBER}/files?per_page=100&page=${page}`,
		);
		files.push(...batch);
		if (batch.length < 100) {
			return files;
		}
	}
}

async function main() {
	const pr = await api(`/pulls/${PR_NUMBER}`);
	const files = await listFiles();
	const wanted = computeLabels({
		title: pr.title,
		body: pr.body,
		files,
	});

	const existing = new Set(pr.labels.map((l) => l.name));
	const toAdd = wanted.filter((label) => {
		if (existing.has(label)) {
			return false;
		}
		// Respect manually applied taxonomy labels: never add a second
		// category or versioning label.
		if (
			CATEGORY_LABELS.has(label) &&
			[...existing].some((l) => CATEGORY_LABELS.has(l))
		) {
			return false;
		}
		if (
			VERSIONING_LABELS.has(label) &&
			[...existing].some((l) => VERSIONING_LABELS.has(l))
		) {
			return false;
		}
		return true;
	});

	if (toAdd.length === 0) {
		console.log(
			`PR #${PR_NUMBER}: labels up to date (${[...existing].join(', ')})`,
		);
		return;
	}

	await api(`/issues/${PR_NUMBER}/labels`, {
		method: 'POST',
		body: JSON.stringify({ labels: toAdd }),
	});
	console.log(`PR #${PR_NUMBER}: added ${toAdd.join(', ')}`);
}

if (PR_NUMBER && TOKEN) {
	main().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
