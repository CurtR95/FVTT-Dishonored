import { readyHook } from "../hooks/readyHook.mjs";

export const DishonoredHooks = {
	attach: () => {
		dishonored.logger.debug("Attaching hooks");

		const listeners = [
			readyHook,
		];

		for (const listener of listeners) {
			listener.attach();
		}
	},
};
