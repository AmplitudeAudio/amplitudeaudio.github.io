/**
 * Runs `frame` on every animation frame with an accumulated, motion-aware clock.
 * Time advances at 30% speed for users who prefer reduced motion. Returns a stop function.
 */
export function startLoop(frame: (t: number, dt: number) => void): () => void {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const speed = reduce ? 0.3 : 1;
	let t = 0;
	let last = performance.now();
	let raf = 0;
	const tick = (now: number) => {
		raf = requestAnimationFrame(tick);
		const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)) * speed;
		last = now;
		t += dt;
		frame(t, dt);
	};
	raf = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(raf);
}

/** True while the element intersects the viewport. */
export function isOnScreen(el: Element): boolean {
	const r = el.getBoundingClientRect();
	return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
}
