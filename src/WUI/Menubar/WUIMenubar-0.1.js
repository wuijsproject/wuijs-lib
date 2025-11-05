/*
 * WUIMenubar - v0.1
 * Author: Sergio E. Belmar (sbelmar@wuijs.dev)
 * Copyright (c) Sergio E. Belmar (sbelmar@wuijs.dev)
 */

class WUIMenubar {

	static version = "0.1";
	static #defaults = {
		selector: ".wui-menubar",
		expansive: true,
		options: []
	};

	constructor (properties) {
		const defaults = structuredClone(WUIMenubar.#defaults);
		Object.entries(defaults).forEach(([key, defValue]) => {
			this[key] = key in properties ? properties[key] : defValue;
		});
	}

	get selector() {
		return this._selector;
	}

	get expansive() {
		return this._expansive;
	}

	get options() {
		return this._options;
	}

	set selector(value) {
		if (typeof(value) == "string" && value != "") {
			this._selector = value;
			this._element = document.querySelector(value);
			this._main = document.querySelector(value+" > .main");
			this._bottom = document.querySelector(value+" > .bottom");
		}
	}

	set expansive(value) {
		if (typeof(value) == "boolean") {
			this._expansive = value;
		}
	}

	set options(value) {
		if (Array.isArray(value)) {
			this._options = value;
		}
	}

	getElement() {
		return this._element;
	}

	getOption(id, options = this._options) {
		for (const option of options) {
			if (option.id == id) {
				return option;
			}
			if (option.options && option.options.length > 0) {
				const found = this.getOption(id, option.options);
				if (found) return found;
			}
		}
		return null;
	}

	init() {
		this._options.forEach(option => {
			const button = document.createElement("div");
			const icon = document.createElement("div");
			const text = document.createElement("span");
			button.dataset.id = option.id;
			button.className = "button"+(option.enabled == false ? " disabled" : "");
			(option.iconClass || "").split(/\s+/).forEach(name => {
				icon.classList.add(name);
			});
			text.innerText = option.label || "";
			if ((typeof(option.position) == "undefined" || option.position == "main") && this._main) {
				this._main.append(button);
			} else if (option.position == "bottom" && this._bottom) {
				this._bottom.append(button);
			}
		});
	}

	enableOption(id, enabled = true) {
		const button = this._element.querySelector(`[data-id='${id}'].button`);
		if (button != null) {
			if (enabled) {
				button.classList.remove("disabled");
			} else {
				button.classList.add("disabled");
			}
		}
		this.getOption(id).enabled = enabled;
	}

	destroy() {
		if (this._element) {
			this._element.innerHTML = "";
		}
	}
}