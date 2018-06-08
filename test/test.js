'use strict';
const { assert } = require('chai');
const editor = require('../index.js');
const FrontMatterData = require('../src/front-matter-data');
const path = require('path');
const fs = require('fs-extra');
const testFilePath = path.resolve(__filename, '../md/test/test-file.md');
const saveTestFilePath = path.resolve(__filename, '../md/test/result-file.md');

console.log(testFilePath);

describe('editor.read()', function() {
	it('read files and parse to a object', function(done) {
		editor
			.read(testFilePath)
			.then((result) => {
				assert.isOk(result instanceof FrontMatterData);
				assert.deepEqual(result, { abc: 1, xyz: 2, _content: 'hello' });
				done();
			})
			.catch((e) => {
				done(e);
			});
	});

	it("don't pass params path to read()", function(done) {
		editor
			.read()
			.then((result) => {
				assert.isOk(result instanceof FrontMatterData);
				assert.deepEqual(result, {});
				done();
			})
			.catch((e) => {
				done(e);
			});
	});
});

describe('editor.create()', function() {
	it('create a new front matter data.', function() {
		let result = editor.create();
		assert.isOk(result instanceof FrontMatterData);
		assert.deepEqual(result, {});
	});

	it('create a new front matter data by passing param initObj.', function() {
		let result = editor.create({ xyz: 2, abc: 3 });
		assert.isOk(result instanceof FrontMatterData);
		assert.deepEqual(result, { xyz: 2, abc: 3 });
	});

	it('create a empty front matter data when pass a wrong type.', function() {
		let result = editor.create(2);
		let result1 = editor.create('hello');
		assert.isOk(result instanceof FrontMatterData);
		assert.deepEqual(result, {});
		assert.deepEqual(result1, {});
	});
});

describe('editor.write()', function() {
	it('transform to string and save to given path, and the output file content is vaild', function(done) {
		let result = editor.create({ xyz: 2, abc: 3, _content: 'hello' });
		editor
			.write(result, saveTestFilePath)
			.then(() => {
				return fs.readFile(saveTestFilePath);
			})
			.then((buf) => {
				assert.equal(buf.toString(), '---\nxyz: 2\nabc: 3\n---\nhello');
				done();
			})
			.catch((e) => {
				done(e);
			});
	});

	it("will throw an error when param data's type isn't FrontMatterData.", function(done) {
		editor
			.write({ xyz: 2, abc: 3, _content: 'hello' }, saveTestFilePath)
			.then(() => {
				done('oops~ unexpected result.');
			})
			.catch(() => {
				done();
			});
	});
});

describe('FrontMatterData.add()', function() {
	it('add a new value', function() {
		let result = editor.create({});
		result.add('key', 'value');
		assert.isOk('key' in result && result.key === 'value');
	});

	it('can\'t add a "_content" key', function() {
		let result = editor.create({});
		let errorHappen = false;

		try {
			result.add('_content', 'value');
		} catch (e) {
			errorHappen = true;
		}

		assert.isOk(errorHappen);
	});

	it("can't add a repeat key", function() {
		let result = editor.create({});
		let errorHappen = false;
		result.add('key', 'value');

		try {
			result.add('key', 'value');
		} catch (e) {
			errorHappen = true;
		}

		assert.isOk(errorHappen);
	});

	it('only allow to pass string key', function() {
		let result = editor.create({});
		let errorHappen = false;
		let error2Happen = false;
		let error3Happen = false;
		result.add('key', 'value');

		try {
			result.add(undefined, 'value');
		} catch (e) {
			errorHappen = true;
		}

		try {
			result.add(null, 'value');
		} catch (e) {
			error2Happen = true;
		}

		try {
			result.add(new Array(), 'value');
		} catch (e) {
			error3Happen = true;
		}

		assert.isOk(errorHappen && error2Happen && error3Happen);
	});
});

describe('FrontMatterData.set()', function() {
	it('set a new value', function() {
		let result = editor.create({});
		result.add('key', 'value');
		result.set('key', 'value2');
		assert.isOk('key' in result && result.key === 'value2');
	});

	it('can\'t set a "_content" key', function() {
		let result = editor.create({});
		let errorHappen = false;

		try {
			result.set('_content', 'value');
		} catch (e) {
			errorHappen = true;
		}

		assert.isOk(errorHappen);
	});

	it("add a key-value pair when key doesn't exist in instance", function() {
		let result = editor.create({});

		result.set('key', 'value');
		assert.isOk('key' in result && result.key === 'value');
	});

	it('only allow to pass string key', function() {
		let result = editor.create({});
		let errorHappen = false;
		let error2Happen = false;
		let error3Happen = false;
		result.add('key', 'value');

		try {
			result.set(undefined, 'value');
		} catch (e) {
			errorHappen = true;
		}

		try {
			result.set(null, 'value');
		} catch (e) {
			error2Happen = true;
		}

		try {
			result.set(new Array(), 'value');
		} catch (e) {
			error3Happen = true;
		}

		assert.isOk(errorHappen && error2Happen && error3Happen);
	});
});

describe('FrontMatterData.remove()', function() {
	it('remove a key-value pair', function() {
		let result = editor.create({});
		result.add('key', 'value');
		result.remove('key');

		assert.isNotOk('key' in result);
	});

	it('can\'t remove a "_content" key', function() {
		let result = editor.create({});
		let errorHappen = false;

		try {
			result.remove('_content', 'value');
		} catch (e) {
			errorHappen = true;
		}

		assert.isOk(errorHappen);
	});

	it("will throw an error when remove a key that isn't exist", function() {
		let result = editor.create({});
		let errorHappen = false;

		try {
			result.remove('key', 'value');
		} catch (e) {
			errorHappen = true;
		}

		assert.isOk(errorHappen);
	});

	it('only allow to pass string key', function() {
		let result = editor.create({});
		let errorHappen = false;
		let error2Happen = false;
		let error3Happen = false;
		result.add('key', 'value');

		try {
			result.remove(undefined, 'value');
		} catch (e) {
			errorHappen = true;
		}

		try {
			result.remove(null, 'value');
		} catch (e) {
			error2Happen = true;
		}

		try {
			result.remove(new Array(), 'value');
		} catch (e) {
			error3Happen = true;
		}

		assert.isOk(errorHappen && error2Happen && error3Happen);
	});
});
