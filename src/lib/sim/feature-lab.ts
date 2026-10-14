import {
	COLORS,
	type Camera,
	type Point2,
	arcPoints,
	drawDotField,
	drawMarker,
	drawMeter,
	drawTag,
	fillDot,
	makeCamera,
	project,
	smoothstep,
	strokePlanePath,
	strokeRing
} from './render.ts';

export type LabMode = 'attenuation' | 'occlusion' | 'reflections' | 'hrtf' | 'rtpc';
export type AttenuationShape = 'sphere' | 'box' | 'capsule' | 'cone';

export interface CanvasLabels {
	source: string;
	listener: string;
	wall: string;
	front: string;
	maxDistance: string;
	engine: string;
	pitch: string;
	rpm: string;
}

export interface LabFrame {
	mode: LabMode;
	shape: AttenuationShape;
	/** The active mode's slider value, 0..1. */
	param: number;
	t: number;
	dt: number;
	/** 0 while the panel is a card, 1 when it fills the stage. */
	zoom: number;
	density: number;
	labels: CanvasLabels;
}

const K = 13;
const W = 4.6;
const INNER = 0.15;
const INNER_COLOR = 'rgba(230,238,243,0.5)';
const OUTER_COLOR = 'rgba(121,185,210,0.9)';

export const maxDistance = (p: number) => 0.3 + p * 1.3;
export const rtpcPitch = (p: number) => 0.6 + 1.4 * Math.pow(p, 1.6);

/** Interaural time difference (Woodworth model, 8.75 cm head radius) in ms. */
export function interauralDelayMs(p: number) {
	const lateral = Math.abs(Math.asin(Math.sin(p * Math.PI * 2)));
	return (0.0875 / 343) * (lateral + Math.sin(lateral)) * 1000;
}

const falloff = (n: number) =>
	n >= 1 ? 0 : n <= INNER ? 1 : Math.pow(1 - (n - INNER) / (1 - INNER), 2);

export class FeatureLabScene {
	private rtpcPhase = 0;

	draw(ctx: CanvasRenderingContext2D, w: number, h: number, frame: LabFrame) {
		ctx.clearRect(0, 0, w, h);
		const { t, zoom } = frame;
		const wide = w > 980;
		const cam = makeCamera(
			0.42 + Math.sin(t * 0.09) * 0.12,
			-0.8 + 0.12 * (1 - zoom),
			3.2,
			Math.min(wide ? w * 0.62 : w, h * 1.45) * 0.86 * (0.72 + 0.4 * zoom),
			wide ? w * 0.6 : w / 2,
			h * 0.5
		);
		const N = Math.round(frame.density * 0.85);
		// Below 760px the mode list becomes a strip across the top, so readouts move down.
		const readoutTop = w < 760 ? 92 : 32;

		switch (frame.mode) {
			case 'attenuation':
				this.attenuation(ctx, cam, N, frame);
				break;
			case 'occlusion':
				this.occlusion(ctx, cam, N, frame);
				break;
			case 'reflections':
				this.reflections(ctx, cam, N, frame);
				break;
			case 'hrtf':
				this.hrtf(ctx, cam, N, frame, w, readoutTop);
				break;
			case 'rtpc':
				this.rtpc(ctx, cam, N, frame, w, readoutTop);
				break;
		}
	}

	private attenuation(ctx: CanvasRenderingContext2D, cam: Camera, N: number, f: LabFrame) {
		const { t, labels } = f;
		const maxD = maxDistance(f.param);
		const wave = (r: number) => Math.sin(r * K - t * W);
		let label: Point2;
		let source: Point2 = [0, 0];

		if (f.shape === 'box') {
			const hx = maxD;
			const hz = maxD * 0.6;
			drawDotField(
				ctx,
				cam,
				N,
				1.1,
				(x, z) => wave(Math.hypot(x, z)) * falloff(Math.max(Math.abs(x) / hx, Math.abs(z) / hz))
			);
			const rect = (s: number): Point2[] => [
				[-hx * s, -hz * s],
				[hx * s, -hz * s],
				[hx * s, hz * s],
				[-hx * s, hz * s]
			];
			strokePlanePath(ctx, cam, rect(INNER), INNER_COLOR, false, true);
			strokePlanePath(ctx, cam, rect(1), OUTER_COLOR, true, true);
			label = [hx, -hz];
		} else if (f.shape === 'capsule') {
			const L = maxD * 0.5;
			const rad = maxD * 0.5;
			const segDist = (x: number, z: number) => Math.hypot(x - Math.max(-L, Math.min(L, x)), z);
			drawDotField(ctx, cam, N, 1.1, (x, z) => {
				const d = segDist(x, z);
				return wave(d) * falloff(d / rad);
			});
			const capsule = (r: number) =>
				arcPoints(L, 0, r, -Math.PI / 2, Math.PI / 2, 24).concat(
					arcPoints(-L, 0, r, Math.PI / 2, Math.PI * 1.5, 24)
				);
			strokePlanePath(ctx, cam, capsule(rad * INNER), INNER_COLOR, false, true);
			strokePlanePath(ctx, cam, capsule(rad), OUTER_COLOR, true, true);
			const P0 = project(cam, -L, 0, 0);
			const P1 = project(cam, L, 0, 0);
			ctx.strokeStyle = COLORS.cyan;
			ctx.lineWidth = 2.5;
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(P0[0], P0[1]);
			ctx.lineTo(P1[0], P1[1]);
			ctx.stroke();
			label = [L, -rad];
		} else if (f.shape === 'cone') {
			const ax = -0.8;
			const R = maxD + 0.3;
			const innerAngle = 0.4;
			const outerAngle = 0.8;
			drawDotField(ctx, cam, N, 1.1, (x, z) => {
				const dx = x - ax;
				const r = Math.hypot(dx, z);
				const angular = 1 - smoothstep(innerAngle, outerAngle, Math.abs(Math.atan2(z, dx)));
				return wave(r) * falloff(r / R) * angular;
			});
			for (const s of [1, -1]) {
				strokePlanePath(
					ctx,
					cam,
					[
						[ax, 0],
						[ax + Math.cos(innerAngle) * R, s * Math.sin(innerAngle) * R]
					],
					INNER_COLOR,
					false,
					false
				);
			}
			strokePlanePath(
				ctx,
				cam,
				[[ax, 0] as Point2, ...arcPoints(ax, 0, R, -outerAngle, outerAngle, 40), [ax, 0]],
				OUTER_COLOR,
				true,
				false
			);
			label = [ax + Math.cos(outerAngle) * R, -Math.sin(outerAngle) * R];
			source = [ax, 0];
		} else {
			drawDotField(ctx, cam, N, 1.1, (x, z) => {
				const r = Math.hypot(x, z);
				return wave(r) * falloff(r / maxD);
			});
			strokeRing(ctx, cam, 0, 0, maxD * INNER, INNER_COLOR, false);
			strokeRing(ctx, cam, 0, 0, maxD, OUTER_COLOR, true);
			label = [maxD * Math.SQRT1_2, -maxD * Math.SQRT1_2];
		}

		drawMarker(ctx, cam, source[0], source[1], 0.32, COLORS.cyan, labels.source);
		const E = project(cam, label[0], 0, label[1]);
		drawTag(ctx, E[0], E[1] + 16, labels.maxDistance);
	}

	private occlusion(ctx: CanvasRenderingContext2D, cam: Camera, N: number, f: LabFrame) {
		const { t, param: p, labels } = f;
		const S = { x: -0.7, z: 0.15 };
		const L = { x: 0.72, z: -0.22 };
		const half = 0.42;
		const gainAt = (x: number, z: number) => {
			if (x <= 0) return 1;
			const zc = S.z + (z - S.z) * ((0 - S.x) / (x - S.x));
			const b = smoothstep(half, half + 0.22, Math.abs(zc));
			return (1 - p * 0.92) * (1 - b) + b;
		};
		drawDotField(ctx, cam, N, 1.1, (x, z) => {
			const r = Math.hypot(x - S.x, z - S.z);
			return (Math.sin(r * K - t * W) / (1 + r * r * 1.5)) * gainAt(x, z);
		});
		ctx.fillStyle = 'rgba(230,238,243,0.6)';
		for (let zz = -half; zz <= half + 1e-6; zz += 0.045) {
			for (let yy = 0; yy <= 0.3001; yy += 0.04) fillDot(ctx, cam, 0, yy, zz, 1.3);
		}
		const db = 20 * Math.log10(Math.max(0.001, gainAt(L.x, L.z)));
		const top = project(cam, 0, 0.36, half);
		drawTag(ctx, top[0], top[1] - 12, labels.wall);
		drawMarker(ctx, cam, S.x, S.z, 0.32, COLORS.cyan, labels.source);
		drawMarker(
			ctx,
			cam,
			L.x,
			L.z,
			0.2,
			COLORS.accent,
			`${labels.listener} ${db > -0.05 ? '0.0' : db.toFixed(1)} dB`
		);
	}

	private reflections(ctx: CanvasRenderingContext2D, cam: Camera, N: number, f: LabFrame) {
		const { t, param: p, labels } = f;
		const S = { x: -0.35, z: 0.3 };
		const R = 1;
		const c = (1 - p) * 0.85;
		// First-order image sources, one mirrored across each wall.
		const sources: [number, number, number][] = [
			[S.x, S.z, 1],
			[-2 * R - S.x, S.z, c],
			[2 * R - S.x, S.z, c],
			[S.x, -2 * R - S.z, c],
			[S.x, 2 * R - S.z, c]
		];
		drawDotField(ctx, cam, N, 1.1, (x, z) => {
			if (Math.abs(x) > R || Math.abs(z) > R) return null;
			let v = 0;
			for (const [sx, sz, gain] of sources) {
				const r = Math.hypot(x - sx, z - sz);
				v += (gain * Math.sin(r * K - t * W)) / (1 + r * r * 1.3);
			}
			return Math.max(-1, Math.min(1, v * 0.8));
		});
		ctx.fillStyle = 'rgba(230,238,243,0.4)';
		for (let k = 0; k <= 40; k++) {
			const u = -R + (2 * R * k) / 40;
			for (let yy = 0; yy <= 0.161; yy += 0.08) {
				fillDot(ctx, cam, u, yy, -R, 1.1);
				fillDot(ctx, cam, u, yy, R, 1.1);
				fillDot(ctx, cam, -R, yy, u, 1.1);
				fillDot(ctx, cam, R, yy, u, 1.1);
			}
		}
		drawMarker(ctx, cam, S.x, S.z, 0.32, COLORS.cyan, labels.source);
	}

	private hrtf(
		ctx: CanvasRenderingContext2D,
		cam: Camera,
		N: number,
		f: LabFrame,
		w: number,
		top: number
	) {
		const { t, param: p, labels } = f;
		const az = p * Math.PI * 2;
		const S = { x: Math.sin(az) * 0.75, z: Math.cos(az) * 0.75 };
		drawDotField(ctx, cam, N, 1.1, (x, z) => {
			if (Math.hypot(x, z) < 0.12) return null;
			const r = Math.hypot(x - S.x, z - S.z);
			return Math.sin(r * K - t * W) / (1 + r * r * 1.5);
		});
		strokeRing(ctx, cam, 0, 0, 0.75, 'rgba(121,185,210,0.35)', true);
		ctx.fillStyle = 'rgba(230,238,243,0.75)';
		for (let k = 0; k < 28; k++) {
			const a = (k / 28) * Math.PI * 2;
			fillDot(ctx, cam, Math.cos(a) * 0.09, 0.06, Math.sin(a) * 0.09, 1.2);
		}
		fillDot(ctx, cam, 0, 0.06, 0.135, 1.6);
		ctx.fillStyle = COLORS.accent;
		fillDot(ctx, cam, -0.11, 0.06, 0, 2.6);
		fillDot(ctx, cam, 0.11, 0.06, 0, 2.6);
		const front = project(cam, 0, 0, 1);
		drawTag(ctx, front[0], front[1] - 6, labels.front);
		drawMarker(ctx, cam, S.x, S.z, 0.32, COLORS.cyan, labels.source);
		const ux = Math.sin(az);
		const mx = Math.max(24, w - 32 - 242);
		drawMeter(ctx, mx, top + 12, 'L', 0.55 - 0.45 * ux);
		drawMeter(ctx, mx, top + 40, 'R', 0.55 + 0.45 * ux);
	}

	private rtpc(
		ctx: CanvasRenderingContext2D,
		cam: Camera,
		N: number,
		f: LabFrame,
		w: number,
		top: number
	) {
		const { param: p, labels } = f;
		const pitch = rtpcPitch(p);
		const gain = 0.35 + 0.65 * smoothstep(0, 1, p);
		// Accumulate phase so changing the pitch doesn't make the waves jump.
		this.rtpcPhase += f.dt * W * pitch;
		const phase = this.rtpcPhase;
		drawDotField(ctx, cam, N, 1.1, (x, z) => {
			const r = Math.hypot(x, z);
			return (Math.sin(r * K * pitch - phase) * gain) / (1 + r * r * 1.6);
		});
		drawMarker(ctx, cam, 0, 0, 0.32, COLORS.cyan, labels.engine);

		const bw = 200;
		const bh = 120;
		const bx = Math.max(16, w - 32 - bw);
		const by = top;
		ctx.fillStyle = 'rgba(10,14,18,0.88)';
		ctx.fillRect(bx, by, bw, bh);
		ctx.strokeStyle = COLORS.border;
		ctx.lineWidth = 1;
		ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
		const gx = bx + 14;
		const gy = by + 24;
		const gw = bw - 28;
		const gh = bh - 48;
		ctx.strokeStyle = '#2b3b47';
		ctx.beginPath();
		ctx.moveTo(gx, gy);
		ctx.lineTo(gx, gy + gh);
		ctx.lineTo(gx + gw, gy + gh);
		ctx.stroke();
		ctx.strokeStyle = COLORS.cyan;
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.beginPath();
		for (let k = 0; k <= 40; k++) {
			const u = k / 40;
			const px = gx + u * gw;
			const py = gy + gh - Math.pow(u, 1.6) * gh;
			if (k === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		}
		ctx.stroke();
		ctx.fillStyle = COLORS.accent;
		ctx.beginPath();
		ctx.arc(gx + p * gw, gy + gh - Math.pow(p, 1.6) * gh, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.font = '600 10px "JetBrains Mono", ui-monospace, monospace';
		ctx.fillStyle = COLORS.inkMuted;
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText(labels.pitch, gx, by + 16);
		ctx.textAlign = 'right';
		ctx.fillText(labels.rpm, gx + gw, by + bh - 8);
	}
}
