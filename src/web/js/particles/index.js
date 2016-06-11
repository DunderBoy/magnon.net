import * as PIXI from "pixi.js";
import * as Particles from "pixi-particles";

import ParticleGenerator from "./particleGenerator.js";

export default class BackgroundParticles {
	constructor(element) {
		this.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{ transparent: true }
		);

		element.appendChild(this.renderer.view);

		this.container = new PIXI.Container();

		this.particleGenerator = new ParticleGenerator();

		this.emitter = this.particleGenerator.getNewBackgroundEmitter(
			this.container,
			window.innerWidth,
			window.innerHeight
		);

		this.smallParticles = [];

		window.addEventListener("resize", () => {
			this.resize(window.innerWidth, window.innerHeight);
		});
		this.resize(window.innerWidth, window.innerHeight);

		window.addEventListener("mousedown", e => {
			this.splash(e.pageX, e.pageY);
		});
		window.addEventListener("touchdown", e => {
			this.splash(e.clientX, e.clientY);
		});
	}

	splash(x, y, emitterScale) {
		emitterScale = emitterScale || 1;

		let emitter = this.particleGenerator.getNewSplashEmitter(
			this.container,
			x, y,
			emitterScale
		);

		emitter.emit = true;
		this.smallParticles.push(emitter);

		window.setTimeout(() => {
			this.smallParticles.splice(this.smallParticles.indexOf(emitter), 1);
		}, 1000 * emitterScale);
	}

	resize(width, height) {
		this.emitter.spawnRect = new PIXI.Rectangle(0, height, width, 10);
		this.emitter.minLifetime = (5 * height * 0.001);
		this.emitter.maxLifetime = (7 * height * 0.001);
		this.renderer.resize(width, height);
	}

	run() {
		this.emitter.emit = true;

		this.lastTime = 0;
		this.update();
	}

	update() {
		this.now = window.performance.now();
		this.delta = this.now - this.lastTime;
		this.lastTime = this.now;

		this.emitter.update(this.delta * 0.001);

		for (let emitter of this.smallParticles) {
			emitter.update(this.delta * 0.001);
		}

		this.renderer.render(this.container);

		requestAnimationFrame(this.update.bind(this));
	}
}
