export default function installTokenBarShim() {
	// Code taken from FFG Star Wars which also flips their health system! (Plus
	// I like the increasing height that it implements)
	Token.prototype._drawBar = function(number, bar, data) {
		let val = Number(data.value);

		if (data.attribute === "stress") {
			val = Number(data.max - data.value);
		}

		const pct = Math.clamped(val, 0, data.max) / data.max;

		let h = Math.max(canvas.dimensions.size / 12, 8);

		// Enlarge the bar for large tokens
		if (this.document.height >= 2) h *= 1.6;

		let r = 0;
		let g = 0;
		let b = 0;

		if (number === 0) {
			r = Number.parseInt(255 * (1 - (pct / 2)));
			g = Number.parseInt(255 * pct);
			b = 0;
		}
		else {
			r = Number.parseInt(255 * 0.5 * pct);
			g = Number.parseInt(255 * 0.7 * pct);
			b = Number.parseInt(255 * (0.5 + (pct / 2)));
		}

		const color = (r << 16) | (g << 8) | b;

		bar
			.clear()
			.beginFill(0x000000, 0.5)
			.lineStyle(2, 0x000000, 0.9)
			.drawRoundedRect(0, 0, this.w, h, 3)
			.beginFill(color, 0.8)
			.lineStyle(1, 0x000000, 0.8)
			.drawRoundedRect(1, 1, pct * (this.w - 2), h - 2, 2);

		const posY = number === 0 ? this.h - h : 0;
		bar.position.set(0, posY);
	};
}
