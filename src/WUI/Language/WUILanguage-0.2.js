/*
 * WUILanguage - v0.2
 * Author: Sergio E. Belmar (sbelmar@wuijs.dev)
 * Copyright (c) Sergio E. Belmar (sbelmar@wuijs.dev)
 */

class WUILanguage {

	static version = "0.2";
	static #defaults = {
		selector: ".wui-language",
		directory: "Languages/",
		sets: ["main"],
		lang: "en",
		mode: "js",
		dataKey: "key",
		dataOutput: "text",
		onLoad: null
	};
	static #log = [];

	#selector;
	#directory;
	#sets;
	#lang;
	#mode;
	#dataKey;
	#dataOutput;
	#onLoad;

	#languages = {};

	constructor(properties) {
		const defaults = structuredClone(WUILanguage.#defaults);
		Object.entries(defaults).forEach(([key, defValue]) => {
			this[key] = key in properties ? properties[key] : defValue;
		});
	}

	get selector() {
		return this.#selector;
	}

	get directory() {
		return this.#directory;
	}

	get sets() {
		return this.#sets;
	}

	get lang() {
		return this.#lang;
	}

	get mode() {
		return this.#mode;
	}

	get dataKey() {
		return this.#dataKey;
	}

	get dataOutput() {
		return this.#dataOutput;
	}

	get onLoad() {
		return this.#onLoad;
	}

	set selector(value) {
		if (typeof (value) == "string") {
			this.#selector = value;
		}
	}

	set directory(value) {
		if (typeof (value) == "string") {
			this.#directory = value;
		}
	}

	set sets(value) {
		if (Array.isArray(value)) {
			this.#sets = value;
		}
	}

	set lang(value) {
		if (typeof (value) == "string") {
			this.#lang = value;
		}
	}

	set mode(value) {
		if (typeof (value) == "string" && value.toString().match(/^(js|json)$/i)) {
			this.#mode = value.toLowerCase();
		}
	}

	set dataKey(value) {
		if (typeof (value) == "string") {
			this.#dataKey = value;
		}
	}

	set dataOutput(value) {
		if (typeof (value) == "string") {
			this.#dataOutput = value;
		}
	}

	set onLoad(value) {
		if (typeof (value) == "function") {
			this.#onLoad = value;
		}
	}

	load(lang = this.#lang, sets = this.#sets) {
		const temp = {};
		const onLoad = (set) => {
			total++;
			if (total == sets.length) {
				sets.forEach(set => {
					Object.keys(temp[set]).forEach(key1 => {
						if (!(key1 in this.#languages[lang])) {
							this.#languages[lang][key1] = {};
						}
						Object.keys(temp[set][key1]).forEach(key2 => {
							if (typeof (temp[set][key1][key2]) == "string") {
								this.#languages[lang][key1][key2] = temp[set][key1][key2];
							} else {
								if (!(key2 in this.#languages[lang][key1])) {
									this.#languages[lang][key1][key2] = {};
								}
								Object.assign(this.#languages[lang][key1][key2], temp[set][key1][key2]);
							}
						});
					});
				});
				this.refresh();
				if (typeof (this.#onLoad) == "function") {
					this.#onLoad(lang, this.#languages);
				}
			}
		}
		let total = 0;
		this.#lang = lang;
		this.#sets = sets;
		if (!(lang in this.#languages)) {
			this.#languages[lang] = {};
		}
		sets.forEach(set => {
			const key = set + "-" + lang;
			if (WUILanguage.#log.indexOf(key) == -1) {
				const xhr = new XMLHttpRequest();
				const token = new Date().getTime();
				const url = `${this.#directory}${set}-${lang}.${this.#mode}?_=${token}`;
				if (this.#mode == "js") {
					xhr.overrideMimeType("text/plain");
				} else if (this.#mode == "json") {
					xhr.responseType = "json";
					xhr.overrideMimeType("application/json");
				}
				xhr.onload = () => {
					if (xhr.status == 200 || xhr.status == 0) {
						const content = xhr.responseText;
						if (this.#mode == "js") {
							if (content.trim().replace(/[\n\r]+/g, " ").match(/^return\s*\{.+\}\s*;?$/)) {
								try {
									let jsObject = {};
									const jsCode = "jsObject = (() => {" + content + "})()";
									temp[set] = JSON.parse(JSON.stringify(eval(jsCode)));
								} catch (error) {
									console.error(`error stringify-parse JS file '${url}': ${error}`);
								}
							}
						} else if (this.#mode == "json") {
							try {
								temp[set] = JSON.parse(content);
							} catch (error) {
								console.error(`error parse JSON file '${url}': ${error}`);
							}
						}
						onLoad(set);
					} else {
						console.error(`error load ${this.#mode.toUpperCase()} file '${url}'`);
					}
				}
				xhr.open("GET", url, true);
				xhr.send();
				WUILanguage.#log.push(key);
			} else {
				onLoad(set);
			}
		});
	}

	refresh(selector = this.#selector, lang = this.#lang) {
		document.querySelectorAll(selector).forEach(element => {
			const tagName = element.tagName;
			const dataKey = element.dataset[this.#dataKey];
			const dataOutput = element.dataset[this.#dataOutput];
			if (dataKey != "") {
				const keys = dataKey.split(".");
				let text = this.#languages[lang];
				for (const key of keys) {
					if (text && typeof text == "object" && key in text) {
						text = text[key];
					} else {
						text = undefined;
						break;
					}
				}
				if (typeof (dataOutput) != "undefined") {
					element.dataset[this.#dataOutput] = text;
				} else if (tagName.match(/^(meta)$/i)) {
					element.setAttribute("content", text);
				} else if (tagName.match(/^(h1|h2|h3|h4|h5|h6|div|span|p|i|li|a|legend|label|option|data|button)$/i)) {
					element.innerHTML = text;
				} else if (tagName.match(/^(input|textarea)$/i)) {
					element.setAttribute("placeholder", text);
				}
			}
		});
	}
}