import { DishonoredBaseItemSheet } from "./DishonoredBaseItemSheet";

export class DishonoredFocusSheet extends DishonoredBaseItemSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			height: 200,
		});
	}

}
