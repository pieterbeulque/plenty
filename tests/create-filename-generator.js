import test from 'ava';
import createFilenameGenerator from '../src/create-filename-generator';

test('exports a function', (t) => {
	t.is(typeof createFilenameGenerator, 'function');
});

test('returns a function', (t) => {
	t.is(typeof createFilenameGenerator(), 'function');
});

test('generates filename as `_row` by default', (t) => {
	const row = { _row: 0 };
	const filename = createFilenameGenerator()(row);
	t.is(filename, '0');
});

test('supports custom Twig templates', (t) => {
	const row = { _row: 0, name: 'kendrick' };
	const filename = createFilenameGenerator('{{ name }}')(row);
	t.is(filename, 'kendrick');
});

test('enforces lowercase', (t) => {
	const row = { _row: 0, name: 'KENDRICK' };
	const filename = createFilenameGenerator('{{ name }}')(row);
	t.is(filename, 'kendrick');
});

test('strips whitespace', (t) => {
	const row = { _row: 0, name: 'kendrick lamar' };
	const filename = createFilenameGenerator('{{ name }}')(row);
	t.is(filename, 'kendrick-lamar');
});

test('strips accented characters', (t) => {
	const row = { _row: 0, name: 'kéndrīçk låmär' };
	const filename = createFilenameGenerator('{{ name }}')(row);
	t.is(filename, 'kendrick-lamar');
});

test('avoids multiple hyphens', (t) => {
	const row = { _row: 0, name: 'kendrick           lamar' };
	const filename = createFilenameGenerator('{{ name }}')(row);
	t.is(filename, 'kendrick-lamar');
});
