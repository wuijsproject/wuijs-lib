/*
 * WUICookie - v0.2
 * Author: Sergio E. Belmar (sbelmar@wuijs.dev)
 * Copyright (c) Sergio E. Belmar (sbelmar@wuijs.dev)
 */

class WUICookie {

	static version = "0.2";
	static #defaults = {
		domain: location.hostname,
		path: "",
		minutes: 365 * 24 * 60,
		overssl: false
	};

	#domain;
	#path;
	#minutes;
	#overssl;

	get domain() {
		return this.#domain;
	}

	get path() {
		return this.#path;
	}

	get minutes() {
		return this.#minutes;
	}

	get overssl() {
		return this.#overssl;
	}

	set domain(value) {
		if (typeof (value) == "string" && value != "") {
			this.#domain = value;
		}
	}

	set path(value) {
		if (typeof (value) == "string") {
			this.#path = value;
		}
	}

	set minutes(value) {
		if (typeof (value) == "number" && value.toString().match(/^\d+$/)) {
			this.#minutes = value;
		}
	}

	set overssl(value) {
		if (typeof (value) == "boolean") {
			this.#overssl = value;
		}
	}

	constructor(properties) {
		const defaults = structuredClone(WUICookie.#defaults);
		Object.entries(defaults).forEach(([key, defValue]) => {
			this[key] = key in properties ? properties[key] : defValue;
		});
	}

	set(name, value, options = {}) {
		const domain = typeof (options.domain) == "string" ? options.domain : this.domain;
		const path = typeof (options.path) == "string" ? options.path : this.path;
		const minutes = typeof (options.minutes) == "number" ? options.minutes : this.minutes;
		const overssl = typeof (options.overssl) == "boolean" ? options.overssl : this.overssl;
		const cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
			+ (domain != "" ? "; domain=" + domain : "")
			+ (path != "" && path != "./" ? "; path=" + path : "")
			+ "; max-age=" + (60 * minutes)
			+ (overssl ? " secure" : "")
		if (navigator.cookieEnabled) {
			try {
				document.cookie = cookie;
			} catch (error) {
				console.error("WUICookie error:", error);
			}
		}
	}

	get(name) {
		const cname = name + "=";
		let cookies = [];
		if (navigator.cookieEnabled) {
			try {
				cookies = decodeURIComponent(document.cookie).split(";");
			} catch (error) {
				console.error("WUICookie error:", error);
			}
			cookies.forEach(part => {
				while (part.charAt(0) == " ") {
					part = part.substring(1);
				}
				if (part.indexOf(cname) == 0) {
					return part.substring(cname.length, part.length);
				}
			});
		}
		return "";
	}

	remove(name) {
		this.set(name, "", { minutes: 0 });
	}
};