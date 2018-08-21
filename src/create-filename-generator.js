const sanitize = require('sanitize-filename');
const { twig } = require('twig');

module.exports = function createFilenameGenerator(format = '{{ _row }}') {
	const template = twig({ data: format });

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
};
