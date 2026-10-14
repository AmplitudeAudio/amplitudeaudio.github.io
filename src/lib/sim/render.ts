export const COLORS = {
	cyan: '#74d0f1',
	accent: '#4a86e8',
	ink: '#e6eef3',
	inkSoft: '#c9d6de',
	inkMuted: '#97a7b3',
	border: '#213039',
	backdrop: 'rgba(10,14,18,0.85)'
};

const MONO = '600 11px "JetBrains Mono", ui-monospace, monospace';
const TAU = Math.PI * 2;

export interface Camera {
	cx: number;
	cy: number;
	f: number;
	D: number;
	cosYaw: number;
	sinYaw: number;
	cosTilt: number;
	sinTilt: number;
	/** Dot radius multiplier, so dot size tracks the camera's zoom. */
	dot: number;
}

export type Point2 = [number, number];
/** [screenX, screenY, depthScale] */
export type Projected = [number, number, number];

export function makeCamera(
	yaw: number,
	tilt: number,
	D: number,
	f: number,
	cx: number,
	cy: number
): Camera {
	return {
		cx,
		cy,
		f,
		D,
		cosYaw: Math.cos(yaw),
		sinYaw: Math.sin(yaw),
		cosTilt: Math.cos(tilt),
		sinTilt: Math.sin(tilt),
		dot: f / (D * 210)
	};
}

export function project(cam: Camera, x: number, y: number, z: number): Projected {
	const x1 = x * cam.cosYaw - z * cam.sinYaw;
	const z1 = x * cam.sinYaw + z * cam.cosYaw;
	const y2 = y * cam.cosTilt - z1 * cam.sinTilt;
	const z2 = y * cam.sinTilt + z1 * cam.cosTilt;
	const zc = z2 + cam.D;
	const k = cam.f / zc;
	return [cam.cx + x1 * k, cam.cy - y2 * k, cam.D / zc];
}

export function smoothstep(a: number, b: number, x: number): number {
	const u = Math.max(0, Math.min(1, (x - a) / (b - a)));
	return u * u * (3 - 2 * u);
}

/** Resizes the backing store to the element's CSS size and returns a DPR-scaled context. */
export function fitCanvas(
	canvas: HTMLCanvasElement
): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
	const w = canvas.clientWidth;
	const h = canvas.clientHeight;
	if (!w || !h) return null;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const W = Math.round(w * dpr);
	const H = Math.round(h * dpr);
	if (canvas.width !== W || canvas.height !== H) {
		canvas.width = W;
		canvas.height = H;
	}
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	return { ctx, w, h };
}

/**
 * Draws an N×N grid of dots on the y=0 plane, displaced by the signed amplitude `fn`
 * returns (null skips a dot). Dots are batched into alpha buckets to keep fill calls low.
 */
export function drawDotField(
	ctx: CanvasRenderingContext2D,
	cam: Camera,
	N: number,
	ext: number,
	fn: (x: number, z: number) => number | null
) {
	const B = 8;
	const paths: Path2D[] = [];
	for (let k = 0; k < B * 2; k++) paths.push(new Path2D());
	for (let i = 0; i < N; i++) {
		const x = -ext + (2 * ext * i) / (N - 1);
		for (let j = 0; j < N; j++) {
			const z = -ext + (2 * ext * j) / (N - 1);
			const v = fn(x, z);
			if (v === null) continue;
			const P = project(cam, x, v * 0.16, z);
			if (P[2] <= 0) continue;
			const e = Math.min(1, Math.abs(v) * 1.4);
			const rad = (1 + e * 1.6) * P[2] * cam.dot;
			const a = (0.16 + 0.84 * e) * Math.min(1, P[2] * P[2]);
			const b = Math.min(B - 1, Math.floor(a * B));
			const path = paths[(v >= 0 ? 0 : B) + b];
			path.moveTo(P[0] + rad, P[1]);
			path.arc(P[0], P[1], rad, 0, TAU);
		}
	}
	for (let k = 0; k < B; k++) {
		const a = (k + 0.5) / B;
		ctx.fillStyle = `rgba(116,208,241,${a.toFixed(3)})`;
		ctx.fill(paths[k]);
		ctx.fillStyle = `rgba(121,185,210,${(a * 0.45).toFixed(3)})`;
		ctx.fill(paths[B + k]);
	}
}

export function strokePlanePath(
	ctx: CanvasRenderingContext2D,
	cam: Camera,
	pts: Point2[],
	color: string,
	dashed: boolean,
	closed: boolean
) {
	ctx.beginPath();
	pts.forEach(([x, z], i) => {
		const P = project(cam, x, 0, z);
		if (i === 0) ctx.moveTo(P[0], P[1]);
		else ctx.lineTo(P[0], P[1]);
	});
	if (closed) ctx.closePath();
	ctx.setLineDash(dashed ? [4, 6] : []);
	ctx.strokeStyle = color;
	ctx.lineWidth = 1.5;
	ctx.stroke();
	ctx.setLineDash([]);
}

export function arcPoints(
	cx: number,
	cz: number,
	r: number,
	a0: number,
	a1: number,
	steps: number
): Point2[] {
	const out: Point2[] = [];
	for (let k = 0; k <= steps; k++) {
		const a = a0 + ((a1 - a0) * k) / steps;
		out.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
	}
	return out;
}

export function strokeRing(
	ctx: CanvasRenderingContext2D,
	cam: Camera,
	x: number,
	z: number,
	r: number,
	color: string,
	dashed: boolean
) {
	strokePlanePath(ctx, cam, arcPoints(x, z, r, 0, TAU, 96), color, dashed, true);
}

export function drawTag(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
	ctx.font = MONO;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	const w = ctx.measureText(text).width + 12;
	ctx.fillStyle = COLORS.backdrop;
	ctx.fillRect(x - w / 2, y - 9, w, 18);
	ctx.fillStyle = COLORS.ink;
	ctx.fillText(text, x, y + 0.5);
}

export function drawMarker(
	ctx: CanvasRenderingContext2D,
	cam: Camera,
	x: number,
	z: number,
	h: number,
	color: string,
	label?: string
) {
	const A = project(cam, x, 0, z);
	const B = project(cam, x, h, z);
	ctx.strokeStyle = color;
	ctx.lineWidth = 1.5;
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(A[0], A[1]);
	ctx.lineTo(B[0], B[1]);
	ctx.stroke();
	const g = ctx.createRadialGradient(B[0], B[1], 0, B[0], B[1], 20);
	g.addColorStop(0, color);
	g.addColorStop(1, 'rgba(10,14,18,0)');
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(B[0], B[1], 20, 0, TAU);
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(B[0], B[1], 4.5, 0, TAU);
	ctx.fill();
	if (label) drawTag(ctx, B[0], B[1] - 22, label);
}

export function fillDot(
	ctx: CanvasRenderingContext2D,
	cam: Camera,
	x: number,
	y: number,
	z: number,
	r: number
) {
	const P = project(cam, x, y, z);
	ctx.beginPath();
	ctx.arc(P[0], P[1], r * P[2] * cam.dot, 0, TAU);
	ctx.fill();
}

export function drawMeter(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	label: string,
	v: number
) {
	ctx.font = MONO;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = COLORS.backdrop;
	ctx.fillRect(x - 8, y - 12, 250, 24);
	ctx.fillStyle = COLORS.ink;
	ctx.fillText(label, x, y);
	ctx.fillStyle = COLORS.border;
	ctx.fillRect(x + 18, y - 4, 140, 8);
	ctx.fillStyle = COLORS.cyan;
	ctx.fillRect(x + 18, y - 4, 140 * v, 8);
	ctx.fillStyle = COLORS.inkSoft;
	ctx.fillText(`${(20 * Math.log10(Math.max(0.001, v))).toFixed(1)} dB`, x + 168, y);
}
