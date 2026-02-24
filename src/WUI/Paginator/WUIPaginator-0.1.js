/*
 * WUIPaginator - v0.1
 * Author: Sergio E. Belmar (wuijs.project@gmail.com)
 * Copyright (c) Sergio E. Belmar (wuijs.project@gmail.com)
 */

class WUIPaginator {

	static version = "0.1";
	static #defaults = {
		selector: "",
		total: 0,
		firstPageButton: true,
		prevPageButton: true,
		numberedButtons: false,
		maxNumberedButtons: 5,
		nextPageButton: true,
		lastPageButton: true,
		pagingOptions: [10, 30, 50, 100],
		pagingValue: 30,
		label: "p/P (t)",
		onChange: null
	};

	static #icons = {
		"first-page": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='11 17 6 12 11 7'%3E%3C/polyline%3E%3Cpolyline points='18 17 13 12 18 7'%3E%3C/polyline%3E%3C/svg%3E",
		"prev-page": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E",
		"next-page": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E",
		"last-page": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='13 17 18 12 13 7'%3E%3C/polyline%3E%3Cpolyline points='6 17 11 12 6 7'%3E%3C/polyline%3E%3C/svg%3E"
	};

	#properties = {};
	#htmlElement;
	#htmlElements = {
		firstPageBtn: null,
		prevPageBtn: null,
		numberedContainer: null,
		nextPageBtn: null,
		lastPageBtn: null,
		pagingSelect: null,
		label: null
	};
	#currentPage = 0;

	constructor(properties = {}) {
		const defaults = structuredClone(WUIPaginator.#defaults);
		Object.entries(defaults).forEach(([name, value]) => {
			this[name] = name in properties ? properties[name] : value;
		});
	}

	get selector() {
		return this.#properties.selector;
	}

	get total() {
		return this.#properties.total;
	}

	get firstPageButton() {
		return this.#properties.firstPageButton;
	}

	get prevPageButton() {
		return this.#properties.prevPageButton;
	}

	get numberedButtons() {
		return this.#properties.numberedButtons;
	}

	get maxNumberedButtons() {
		return this.#properties.maxNumberedButtons;
	}

	get nextPageButton() {
		return this.#properties.nextPageButton;
	}

	get lastPageButton() {
		return this.#properties.lastPageButton;
	}

	get pagingOptions() {
		return this.#properties.pagingOptions;
	}

	get pagingValue() {
		return this.#properties.pagingValue;
	}

	get label() {
		return this.#properties.label;
	}

	get onChange() {
		return this.#properties.onChange;
	}

	set selector(value) {
		if (typeof (value) == "string" && value != "") {
			this.#properties.selector = value;
			this.#htmlElement = document.querySelector(value);
		}
	}

	set total(value) {
		if (typeof (value) == "number" && value >= 0) {
			this.#properties.total = value;
		}
	}

	set firstPageButton(value) {
		if (typeof (value) == "boolean") {
			this.#properties.firstPageButton = value;
		}
	}

	set prevPageButton(value) {
		if (typeof (value) == "boolean") {
			this.#properties.prevPageButton = value;
		}
	}

	set numberedButtons(value) {
		if (typeof (value) == "boolean") {
			this.#properties.numberedButtons = value;
		}
	}

	set maxNumberedButtons(value) {
		if (typeof (value) == "number" && value >= 1) {
			this.#properties.maxNumberedButtons = value;
		}
	}

	set nextPageButton(value) {
		if (typeof (value) == "boolean") {
			this.#properties.nextPageButton = value;
		}
	}

	set lastPageButton(value) {
		if (typeof (value) == "boolean") {
			this.#properties.lastPageButton = value;
		}
	}

	set pagingOptions(value) {
		if (Array.isArray(value)) {
			this.#properties.pagingOptions = value;
		}
	}

	set pagingValue(value) {
		if (typeof (value) == "number" && value >= 1) {
			this.#properties.pagingValue = value;
		}
	}

	set label(value) {
		if (typeof (value) == "string") {
			this.#properties.label = value;
		}
	}

	set onChange(value) {
		if (typeof (value) == "function" || value == null) {
			this.#properties.onChange = value;
		}
	}

	get #totalPages() {
		if (!this.#properties.pagingValue || this.#properties.pagingValue <= 0) return 0;
		return Math.max(0, Math.ceil(this.#properties.total / this.#properties.pagingValue) - 1);
	}

	#getSRCIcon(name) {
		const element = this.#htmlElement || document.documentElement;
		const src = getComputedStyle(element).getPropertyValue("--wui-paginator-" + name + "icon-src");
		return src != "" && !src.match(/^(none|url\(\))$/) ? src : "url(\"data:image/svg+xml," + WUIPaginator.#icons[name] + "\")";
	}

	#createButton(iconUrl, className, onClick) {
		const button = document.createElement("button");
		button.className = `wui-paginator-button ${className}`;
		button.type = "button";
		const icon = document.createElement("span");
		icon.className = "icon";
		icon.style.maskImage = `url('${iconUrl}')`;
		icon.style.webkitMaskImage = `url('${iconUrl}')`;
		button.appendChild(icon);
		button.addEventListener("click", onClick);
		return button;
	}

	#updateButtonStates() {
		if (this.#htmlElements.firstPageBtn) {
			this.#htmlElements.firstPageBtn.disabled = this.#currentPage <= 0;
		}
		if (this.#htmlElements.prevPageBtn) {
			this.#htmlElements.prevPageBtn.disabled = this.#currentPage <= 0;
		}
		if (this.#htmlElements.nextPageBtn) {
			this.#htmlElements.nextPageBtn.disabled = this.#currentPage >= this.#totalPages;
		}
		if (this.#htmlElements.lastPageBtn) {
			this.#htmlElements.lastPageBtn.disabled = this.#currentPage >= this.#totalPages;
		}
	}

	#updateNumberedButtons() {
		if (!this.numberedButtons || !this.#htmlElements.numberedContainer) return;
		this.#htmlElements.numberedContainer.innerHTML = "";
		const totalPages = this.#totalPages + 1;
		const currentPageVisible = this.#currentPage + 1;
		const totalButtons = Math.min(totalPages, this.maxNumberedButtons);
		let startPage = 1;
		let endPage = totalButtons;
		if (totalPages > this.maxNumberedButtons) {
			const half = Math.floor(this.maxNumberedButtons / 2);
			startPage = Math.max(1, currentPageVisible - half);
			endPage = Math.min(totalPages, startPage + this.maxNumberedButtons - 1);
			if (endPage - startPage + 1 < this.maxNumberedButtons) {
				startPage = Math.max(1, endPage - this.maxNumberedButtons + 1);
			}
		}
		for (let i = startPage; i <= endPage; i++) {
			const button = document.createElement("button");
			const page = i;
			button.className = "wui-paginator-button numbered";
			button.type = "button";
			button.textContent = i;
			if (i === currentPageVisible) {
				button.classList.add("active");
			}
			button.addEventListener("click", () => this.goPage(page));
			this.#htmlElements.numberedContainer.appendChild(button);
		}
	}

	#updatePagingSelect() {
		if (!this.#htmlElements.pagingSelect || this.pagingOptions.length === 0) return;
		this.#htmlElements.pagingSelect.innerHTML = "";
		this.pagingOptions.forEach(option => {
			const opt = document.createElement("option");
			opt.value = option.value || option;
			opt.textContent = option.label || option;
			this.#htmlElements.pagingSelect.appendChild(opt);
		});
		this.#htmlElements.pagingSelect.value = String(this.pagingValue);
	}

	#updateLabel() {
		if (!this.#htmlElements.label) return;
		let label = this.label;
		label = label.replace(/\bp\b/g, this.#currentPage + 1);
		label = label.replace(/\bP\b/g, this.#totalPages + 1);
		label = label.replace(/\bt\b/g, this.total);
		this.#htmlElements.label.textContent = label;
	}

	#triggerChange(oldPage, button) {
		if (typeof (this.onChange) == "function") {
			this.onChange(oldPage + 1, this.#currentPage + 1, button);
		}
	}

	getElement() {
		return this.#htmlElement;
	}

	init() {
		if (!(this.#htmlElement instanceof HTMLDivElement)) return;
		this.#htmlElement.classList.add("wui-paginator");
		this.#htmlElement.innerHTML = "";
		this.#currentPage = 0;
		if (this.firstPageButton) {
			this.#htmlElements.firstPageBtn = this.#createButton(
				WUIPaginator.#icons["first-page"],
				"first",
				() => this.firstPage()
			);
			this.#htmlElement.appendChild(this.#htmlElements.firstPageBtn);
		}
		if (this.prevPageButton) {
			this.#htmlElements.prevPageBtn = this.#createButton(
				WUIPaginator.#icons["prev-page"],
				"prev",
				() => this.prevPage()
			);
			this.#htmlElement.appendChild(this.#htmlElements.prevPageBtn);
		}
		if (this.numberedButtons) {
			this.#htmlElements.numberedContainer = document.createElement("div");
			this.#htmlElements.numberedContainer.className = "wui-paginator-numbered";
			this.#htmlElement.appendChild(this.#htmlElements.numberedContainer);
		}
		if (this.nextPageButton) {
			this.#htmlElements.nextPageBtn = this.#createButton(
				WUIPaginator.#icons["next-page"],
				"next",
				() => this.nextPage()
			);
			this.#htmlElement.appendChild(this.#htmlElements.nextPageBtn);
		}
		if (this.lastPageButton) {
			this.#htmlElements.lastPageBtn = this.#createButton(
				WUIPaginator.#icons["last-page"],
				"last",
				() => this.lastPage()
			);
			this.#htmlElement.appendChild(this.#htmlElements.lastPageBtn);
		}
		if (this.pagingOptions.length > 0) {
			this.#htmlElements.pagingSelect = document.createElement("select");
			this.#htmlElements.pagingSelect.className = "wui-paginator-select";
			this.#htmlElements.pagingSelect.addEventListener("change", (e) => {
				this.#properties.pagingValue = parseInt(e.target.value);
				this.#currentPage = 0;
				this.#updateButtonStates();
				this.#updateNumberedButtons();
				this.#updateLabel();
			});
			this.#htmlElement.appendChild(this.#htmlElements.pagingSelect);
			this.#updatePagingSelect();
		}
		if (this.label && this.label !== "") {
			this.#htmlElements.label = document.createElement("span");
			this.#htmlElements.label.className = "wui-paginator-label";
			this.#htmlElement.appendChild(this.#htmlElements.label);
		}
		this.#updateButtonStates();
		this.#updateNumberedButtons();
		this.#updateLabel();
	}

	firstPage() {
		if (this.#currentPage > 0) {
			const oldPage = this.#currentPage;
			this.#currentPage = 0;
			this.#updateButtonStates();
			this.#updateNumberedButtons();
			this.#updateLabel();
			this.#triggerChange(oldPage, "first");
		}
	}

	prevPage() {
		if (this.#currentPage > 0) {
			const oldPage = this.#currentPage;
			this.#currentPage--;
			this.#updateButtonStates();
			this.#updateNumberedButtons();
			this.#updateLabel();
			this.#triggerChange(oldPage, "prev");
		}
	}

	nextPage() {
		if (this.#currentPage < this.#totalPages) {
			const oldPage = this.#currentPage;
			this.#currentPage++;
			this.#updateButtonStates();
			this.#updateNumberedButtons();
			this.#updateLabel();
			this.#triggerChange(oldPage, "next");
		}
	}

	lastPage() {
		if (this.#currentPage < this.#totalPages) {
			const oldPage = this.#currentPage;
			this.#currentPage = this.#totalPages;
			this.#updateButtonStates();
			this.#updateNumberedButtons();
			this.#updateLabel();
			this.#triggerChange(oldPage, "last");
		}
	}

	goPage(page = 0) {
		if (typeof (page) == "number" && page >= 0 && page <= this.#totalPages && page !== this.#currentPage) {
			const oldPage = this.#currentPage;
			this.#currentPage = page;
			this.#updateButtonStates();
			this.#updateNumberedButtons();
			this.#updateLabel();
			this.#triggerChange(oldPage, "numbered");
		}
	}

	destroy() {
		if (this.#htmlElement instanceof HTMLDivElement) {
			this.#htmlElement.innerHTML = "";
			this.#htmlElement.classList.remove("wui-paginator");
		}
		this.#htmlElements = {
			firstPageBtn: null,
			prevPageBtn: null,
			numberedContainer: null,
			nextPageBtn: null,
			lastPageBtn: null,
			pagingSelect: null,
			label: null
		};
	}
}

/*
HTML output:
<div class="wui-paginator">
	<button class="wui-paginator-button first"><span class="icon"></span></button>
	<button class="wui-paginator-button prev"><span class="icon"></span></button>
	<div class="wui-paginator-numbered">
		<button class="wui-paginator-button numbered">1</button>
		<button class="wui-paginator-button numbered active">2</button>
		<button class="wui-paginator-button numbered">3</button>
	</div>
	<button class="wui-paginator-button next"><span class="icon"></span></button>
	<button class="wui-paginator-button last"><span class="icon"></span></button>
	<select class="wui-paginator-select">
		<option value="10">10</option>
		<option value="30">30</option>
		<option value="50">50</option>
		<option value="100">100</option>
	</select>
	<span class="wui-paginator-label">1/4 (100)</span>
</div>
*/
