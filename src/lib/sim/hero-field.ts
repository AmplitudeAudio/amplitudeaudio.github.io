import { smoothstep } from './render.ts';

interface Wave {
	x: number;
	y: number;
	t0: number;
}

const HOT_RADIUS = 150;
const FADE_RADIUS = 460;
const WAVE_SPEED = 560;
const MAX_WAVES = 6;
const COLOR_LEVELS = 6;
const ALPHA_LEVELS = 8;
const TAU = Math.PI * 2;

/**
 * Flat dot grid behind the hero: dots near the cursor glow cyan, fade to white, then to
 * transparent; clicks emit rings that sweep the whole grid.
 */
export class HeroField {
	private pointer: { x: number; y: number } | null = null;
	private cursor: { x: number; y: number } | null = null;
	private waves: Wave[] = [];

	setPointer(p: { x: number; y: number } | null) {
		this.pointer = p;
	}

	emit(x: number, y: number, t: number) {
		this.pointer = { x, y };
		this.waves.push({ x, y, t0: t });
		if (this.waves.length > MAX_WAVES) this.waves.shift();
	}

	draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, spacing: number) {
		ctx.clearRect(0, 0, w, h);

		// Without a pointer, an idle highlight drifts so the hero never looks empty.
		const target = this.pointer ?? {
			x: w * (0.5 + Math.cos(t * 0.23) * 0.3),
			y: h * (0.5 + Math.sin(t * 0.37) * 0.3)
		};
		if (!this.cursor) this.cursor = { ...target };
		const cur = this.cursor;
		cur.x += (target.x - cur.x) * 0.16;
		cur.y += (target.y - cur.y) * 0.16;

		const diag = Math.hypot(w, h) + 200;
		this.waves = this.waves.filter((wv) => (t - wv.t0) * WAVE_SPEED < diag);
		const waves = this.waves;

		const paths: (Path2D | null)[] = new Array(COLOR_LEVELS * ALPHA_LEVELS).fill(null);
		const ox = (w % spacing) / 2;
		const oy = (h % spacing) / 2;

		for (let gy = oy; gy <= h; gy += spacing) {
			for (let gx = ox; gx <= w; gx += spacing) {
				const d = Math.hypot(gx - cur.x, gy - cur.y);
				let hot = 1 - smoothstep(0, HOT_RADIUS, d);
				let alpha = 1 - smoothstep(HOT_RADIUS * 0.35, FADE_RADIUS, d);
				for (const wv of waves) {
					const age = t - wv.t0;
					const front = age * WAVE_SPEED;
					const rw = Math.hypot(gx - wv.x, gy - wv.y);
					const u = (rw - front) / 26;
					const u2 = (rw - front + 64) / 22;
					const band = (Math.exp(-u * u) + 0.45 * Math.exp(-u2 * u2)) * Math.exp(-age * 0.8);
					if (band > hot) hot = band;
					if (band > alpha) alpha = band;
				}
				if (alpha < 0.03) continue;
				const ci = Math.min(COLOR_LEVELS - 1, Math.round(hot * (COLOR_LEVELS - 1)));
				const ai = Math.min(ALPHA_LEVELS - 1, Math.floor(alpha * ALPHA_LEVELS));
				const idx = ci * ALPHA_LEVELS + ai;
				const path = paths[idx] ?? (paths[idx] = new Path2D());
				const rad = 1.1 + hot * 1.3;
				path.moveTo(gx + rad, gy);
				path.arc(gx, gy, rad, 0, TAU);
			}
		}

		for (let ci = 0; ci < COLOR_LEVELS; ci++) {
			// White (#ecf2f6) at rest, cyan (#74d0f1) at the hot spot.
			const m = ci / (COLOR_LEVELS - 1);
			const r = Math.round(236 - 120 * m);
			const g = Math.round(242 - 34 * m);
			const b = Math.round(246 - 5 * m);
			for (let ai = 0; ai < ALPHA_LEVELS; ai++) {
				const path = paths[ci * ALPHA_LEVELS + ai];
				if (!path) continue;
				ctx.fillStyle = `rgba(${r},${g},${b},${((ai + 1) / ALPHA_LEVELS).toFixed(3)})`;
				ctx.fill(path);
			}
		}
	}
}
