#!/usr/bin/env node

const fs = require('fs-extra');
const parseCSV = require('csv-parse');
const path = require('path');
const sanitize = require('sanitize-filename');
const { twig } = require('twig');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));

const getData = async (file) => {
	const parse = (raw) => new Promise((resolve, reject) => {
		parseCSV(
			raw,
			{
				relax_column_count: true,
				cast: true,
			},
			(error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			},
		);
	});

	const raw = await fs.readFile(file, 'utf8');
	const [headers, ...rows] = await parse(raw);

	return rows.map((row) => row.reduce((carry, value, index) => {
		const key = headers[index];

		Object.assign(carry, {
			[key]: value,
		});

		return carry;
	}, {}));
};

const getTemplate = async (file) => {
	const data = await fs.readFile(file, 'utf8');
	return twig({ data });
};

const generateFilenameForRow = (() => {
	const filename = typeof argv.filename === 'string' ? argv.filename : '{{ _row }}-output';
	const template = twig({ data: filename });

	return (row) => sanitize(
		template
			.render(row)
			.trim()
			.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
			.replace(/\s/gi, '-')
			.replace(/[^\w-]/gi, '')
			.replace(/[-]{2,}/, '-')
			.replace(/-$/, '')
			.replace(/^-/, '')
			.toLowerCase(),
	);
})();

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

	const rows = await getData(paths.data);
	const template = await getTemplate(paths.template);
	const extension = path.extname(paths.template);

	const output = rows.map((row, index) => {
		const rendered = template.render(row);
		const filename = generateFilenameForRow({ _row: index, ...row });

		return fs.outputFile(path.resolve(paths.output, `${filename}${extension}`), rendered);
	});

	return Promise.all(output);
}());
