/*
 * WUI JS Lib - v0.3.0
 * Author: Sergio E. Belmar (wuijs.project@gmail.com)
 * Copyright (c) Sergio E. Belmar (wuijs.project@gmail.com)
 */

(() => {
	const scripts = document.getElementsByTagName("script");
	const script = scripts[scripts.length - 1];
	const dir = script.src.replace(new RegExp(/[^\/]+$/), "");
	const get = script.src.replace(new RegExp(/^.+\?/), "");
	const getParams = get.split("&");
	const js = document.createElement("script");
	const jsParams = {};
	let ver = "0.3.0";
	if (script.src.match(/\?/)) {
		for (let i in getParams) {
			const param = getParams[i].split("=");
			jsParams[param[0]] = param[1];
		}
		for (let param in jsParams) {
			if (param.match(/^(v|version)$/i)) {
				ver = jsParams[param];
			}
		}
	}
	window.wuiVersion = ver;
	window.wuiDirectory = dir;
	js.setAttribute("src", dir + "WUI-" + ver + ".js?" + get);
	document.head.appendChild(js);
})();