/*
 * WUIMenubar - v0.1
 * Author: Sergio E. Belmar (sbelmar@wuijs.dev)
 * Copyright (c) Sergio E. Belmar (sbelmar@wuijs.dev)
 */

class WUIMenubar {

	static version = "0.1";
	static #defaults = {
		selector: ".wui-menubar",
		mainOptions: [],
		secondaryOptions: []
	};

	constructor (properties) {
		const defaults = structuredClone(WUIMenubar.#defaults);
		Object.entries(defaults).forEach(([key, defValue]) => {
			this[key] = key in properties ? properties[key] : defValue;
		});
		this._page = 0;
	}

	get selector() {
		return this._selector;
	}

	get mainOptions() {
		return this._mainOptions;
	}

	get secondaryOptions() {
		return this._secondaryOptions;
	}

	set selector(value) {
		if (typeof(value) == "string" && value != "") {
			this._selector = value;
			this._element = document.querySelector(value);
		}
	}

	set mainOptions(value) {
		if (Array.isArray(value)) {
			this._mainOptions = value;
		}
	}

	set secondaryOptions(value) {
		if (Array.isArray(value)) {
			this._secondaryOptions = value;
		}
	}

	getElement() {
		return this._element;
	}

	init() {
		this.print();
	}

	addOption(type = "main", option) {
		if (type.toLowerCase() == "main") {
			this._mainOptions.push(option);
		} else if (type.toLowerCase() == "secondary") {
			this._secondaryOptions.push(option);
		}
	}

	print(page = this._page) {
	}

	enableOption(index, enabled = true) {
		if (index >= 0 && index < this._secondaryOptions.length) {
			const row = this._element.querySelector(".row:nth-of-type("+(index+1)+")");
			if (row != null) {
				if (enabled) {
					row.classList.remove("disabled");
				} else {
					row.classList.add("disabled");
				}
			}
			this._secondaryOptions[index].enabled = enabled;
		}
	}

	destroy() {
		if (this._element) {
			this._element.innerHTML = "";
		}
	}
}