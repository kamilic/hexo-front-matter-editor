const hexoFrontMatter = require('hexo-front-matter');
const HexoFrontMatterData = require('./front-matter-data');
const fs = require('fs-extra');
const extend = require('node.extend');

/**
 * @description parse markdown front matter, using hexo-front-matter.
 * @param {string} str 
 */
function parse(str) {
	let lf = str.replace(/\r\n/g, '\n');
	let parsedData = hexoFrontMatter.parse(lf);
	return parsedData;
}
/**
 * @description Reading .md files content, then pass to parse();
 * @param {string} path - .md filePath
 */
function parseFromFile(path) {
	return fs.readFile(path).then((data) => {
		let str = data.toString();
		return parse(str);
	});
}

/**
 * @returns Promise<HexoFrontMatterData>
 * @param {string} from - .md filePath
 */
function read(from) {
	if (from) {
		return parseFromFile(from).then((obj) => new HexoFrontMatterData(obj));
	} else {
		return Promise.resolve(create());
	}
}

/**
 * @returns HexoFrontMatterData
 */
function create(initObj = {}) {
	if (typeof initObj === 'object') {
		return new HexoFrontMatterData(initObj);
	} else {
		return new HexoFrontMatterData({});
	}
}

/**
 * @param {HexoFrontMatterData} data
 * @param {string} to - .md output filePath
 * @returns Promise<T>
 */
function write(data, to) {
	if (data instanceof HexoFrontMatterData) {
		let str = hexoFrontMatter.stringify(data.output(), { prefixSeparator: true });
		return fs.writeFile(to, str);
	} else {
		return Promise.reject(new Error('data must be a HexoFrontMatterData!'));
	}
}

module.exports = {
	read,
	write,
	create
};
