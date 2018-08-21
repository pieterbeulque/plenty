#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { twig } = require('twig');
const minimist = require('minimist');

const parseCSV = require('./parse-csv');
const createFilenameGenerator = require('./create-filename-generator');

const argv = minimist(process.argv.slice(2));

const generateFilenameForRow = createFilenameGenerator(typeof argv.filename === 'string' ? argv.filename : undefined);

(async function plenty() {
	if (typeof argv.csv !== 'string') {
		throw new Error('Missing --csv argument');
	}

	if (typeof argv.template !== 'string') {
		throw new Error('Missing --template argument');
	}

	const paths = {
		data: path.resolve(argv.csv),
		template: path.resolve(argv.template),
		output: path.resolve(typeof argv.output === 'string' ? argv.output : './output'),
	};

	await fs.emptyDir(paths.output);

	const rows = await parseCSV(await fs.readFile(paths.data, 'utf8'));
	const template = await twig({ data: await fs.readFile(paths.template, 'utf8') });
	const extension = path.extname(paths.template);

	const output = rows.map((row, index) => {
		const rendered = template.render(row);
		const filename = generateFilenameForRow({ _row: index, ...row });

		return fs.outputFile(path.resolve(paths.output, `${filename}${extension}`), rendered);
	});

	return Promise.all(output);
}());
