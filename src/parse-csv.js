const csvParse = require('csv-parse');

module.exports = async function parseCSV(csv, parserOptions = {}) {
	const parserSettings = Object.assign({
		relax_column_count: true,
		cast: true,
		trim: true,
	}, typeof parserOptions === 'object' ? parserOptions : {});

	const parse = (raw) => new Promise((resolve, reject) => {
		csvParse(
			raw.trim(),
			parserSettings,
			(error, data) => {
				if (error) {
					reject(error);
				} else {
					resolve(data);
				}
			},
		);
	});

	const [headers, ...rows] = await parse(csv);

	return rows.map((row) => row.reduce((carry, value, index) => {
		const key = headers[index];

		Object.assign(carry, {
			[key]: value,
		});

		return carry;
	}, {}));
};
