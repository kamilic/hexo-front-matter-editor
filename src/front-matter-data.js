const extend = require('node.extend');
const _CONTENT_KEY_ = '_content';

/**
 * @class HexoFrontMatterData
 * @description 
 * A simple data structure to represent a .md front-matter-data. 
 * Simply extend the result of hexoFrontMatter.parse();
 */
class HexoFrontMatterData {
	constructor(obj = {}) {
		extend(this, obj);
	}

	add(key, value) {
		if (key !== _CONTENT_KEY_) {
			if (key && key in this) {
				throw Error('Cannot add an existed key.');
			} else if (key && typeof key === 'string') {
				this[key] = value.toString();
			} else {
				throw Error('Params Key: Invalid type.');
			}
		} else {
			throw Error("key _content is reserved, can't be used.");
		}
	}

	set(key, value) {
		if (key !== _CONTENT_KEY_) {
			if (key && typeof key === 'string') {
				if (key in this) {
					this[key] = value.toString();
				} else {
					this.add(key, value);
				}
			} else {
				throw Error('Params Key: Invalid type.');
			}
		} else {
			throw Error("key _content is reserved, can't be used.");
		}
	}

	remove(key) {
		if (key !== _CONTENT_KEY_) {
			if (key && key in this && typeof key === 'string') {
				delete this[key];
			} else if (key && !(key in this)) {
				throw Error('not existed key cannot be removed.');
			} else {
				throw Error('Params Key: Invalid type.');
			}
		} else {
			throw Error("key _content is reserved, can't be used.");
		}
	}

	output() {
		let result = {};

		for (let key of Object.keys(this)) {
			result[key] = this[key];
		}

		return result;
	}
}

module.exports = HexoFrontMatterData;
