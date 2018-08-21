import test from 'ava';
import parseCSV from '../src/parse-csv';


test('parses CSV', async (t) => {
	const csv = `id,tests
1,ava
2,mocha`;

	const parsed = parseCSV(csv);
	t.notThrowsAsync(parsed);
	t.deepEqual(await parsed, [{ id: 1, tests: 'ava' }, { id: 2, tests: 'mocha' }]);
});

test('passes options to csv parser', async (t) => {
	const csv = `id;tests
1;ava
2;mocha`;

	const parsed = parseCSV(csv, { delimiter: ';' });
	t.deepEqual(await parsed, [{ id: 1, tests: 'ava' }, { id: 2, tests: 'mocha' }]);
});

test('handles whitespace in csv', async (t) => {
	const csv = `
	id,tests
	1,ava
	2,mocha
`;

	const parsed = parseCSV(csv);
	t.deepEqual(await parsed, [{ id: 1, tests: 'ava' }, { id: 2, tests: 'mocha' }]);
});

test('throws an error with faulty csv', async (t) => {
	const csv = { test: 'not valid csv', trim: () => {} };

	const parsed = parseCSV(csv);
	return t.throwsAsync(parsed);
});

test('silently goes through with invalid options', async (t) => {
	const csv = `id,tests
1,ava
2,mocha`;

	const parsed = parseCSV(csv, 'invalid option');
	return t.notThrowsAsync(parsed);
});
