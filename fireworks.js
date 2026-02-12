let W = window.innerWidth;
let H = window.innerHeight;
// Special math functions
Math.randInt = (min,max) => {
	return Math.floor(Math.random() * ((max + 1) - min)) + min;
};
Math.randFloat = (min,max) => {
	return Math.random() * ((max + 1) - min) + min;
};
// Main app code
window.addEventListener("load",app);
function app() {
	let C = document.getElementById('fireworks-canvas') || document.querySelector("canvas"),
		c = C.getContext("2d"),
		S = window.devicePixelRatio || 1;
	// set canvas dimensions with device pixel ratio
	function resizeCanvas() {
		W = window.innerWidth;
		H = window.innerHeight;
		C.width = Math.floor(W * S);
		C.height = Math.floor(H * S);
		C.style.width = W + 'px';
		C.style.height = H + 'px';
		// reset transform to avoid cumulative scaling
		c.setTransform(S, 0, 0, S, 0, 0);
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas);
	
	let playing = false,
		score = 0,
		hiScore = 0,
		stars = [],
		starLimit = 20;

	while (starLimit--)
		stars.push(new Star(Math.randInt(0,W),Math.randInt(0,H)));
		
	let drone = new Drone(),
		cityPart1 = [
			[0,8],[1,8],[1,11],[3,11],[3,10],[4,10],[4,5],[7,5],[7,13],[9,13],[9,14],[11,14],[11,13],[13,13],[13,3],[16,3],[16,18],[20,18],[20,5],[21,5],[21,10],[27,10],[27,4],[29,4],[29,1],[30,1],[30,14],[38,14],[38,1],[39,1],[39,8],[46,8],[46,1],[48,1],[48,0],[0,0]
		],
		cityPart2 = [
			[0,8],[5,8],[5,4],[7,4],[7,11],[10,11],[10,10],[11,10],[11,6],[14,6],[14,14],[17,14],[17,6],[18,6],[18,18],[21,18],[21,5],[23,5],[23,7],[27,7],[27,4],[30,4],[30,10],[33,10],[33,9],[35,9],[35,4],[37,4],[37,16],[42,16],[42,8],[47,8],[47,4],[48,4],[48,0],[0,0]
		],
		cityPart3 = [
			[0,11],[1,11],[1,12],[3,12],[3,11],[4,11],[4,6],[6,6],[6,17],[8,17],[8,18],[10,18],[10,6],[12,6],[12,14],[15,14],[15,5],[17,5],[17,20],[19,20],[19,19],[20,19],[20,5],[21,5],[21,10],[26,10],[26,5],[27,5],[27,7],[28,7],[28,12],[31,12],[31,7],[32,7],[32,6],[33,6],[33,16],[36,16],[36,6],[37,6],[37,5],[38,5],[38,6],[39,6],[39,14],[42,14],[42,6],[43,6],[43,9],[47,9],[47,6],[48,6],[48,0],[0,0]
		],
		windows = [
			[0.5,8],[2.5,8],[0.5,10],[2.5,10],
			[6.5,8],[8.5,8],[6.5,10],[8.5,10],[6.5,12],[8.5,12],[6.5,14],[8.5,14],[6.5,16],[8.5,16],
			[13,7],[13,9],[13,11],[13,13],
			[18,7],[18,9],[18,11],[18,13],[18,15],[18,17],
			[22,7],[22,9],[24,7],[24,9],
			[29,7],[29,9],[29,11],
			[34,7],[34,9],[34,11],[34,13],[34,15],
			[40,7],[40,9],[40,11],[40,13],
			[43.5,8],[45.5,8]
		],
		fireworks = [],
		fireworksChance = 0.02,
		fireworksLimit = 40,
		particles = [];

		let draw = () => {
			// recompute sky gradient to match current W/H
			let sky = c.createLinearGradient(W/2,0,W/2,H),
				skyHS = "hsl(240,100%,";
			sky.addColorStop(0,   `${skyHS}8%)`);
			sky.addColorStop(0.25,`${skyHS}8%)`);
			sky.addColorStop(0.25,`${skyHS}10%)`);
			sky.addColorStop(0.5, `${skyHS}10%)`);
			sky.addColorStop(0.5, `${skyHS}12%)`);
			sky.addColorStop(0.75,`${skyHS}12%)`);
			sky.addColorStop(0.75,`${skyHS}14%)`);
			sky.addColorStop(1,   `${skyHS}14%)`);

			// sky
			c.fillStyle = sky;
			c.fillRect(0,0,W,H);
			// stars
			for (let s of stars) {
				c.fillStyle = s.brghtnss > 0.5 ? "hsl(0,0%,100%)" : "hsl(0,0%,66%)";
				c.fillRect(s.x,s.y,s.size,s.size);
				s.brghtnss = s.brghtnss > 1 ? 0 : s.brghtnss + 0.01;
			}
			// drone
			let deathColor = "hsl(48,100%,50%)";
			if (drone.isNewYears) {
				c.fillStyle = drone.isDying ? deathColor : "hsl(0,0%,67%)";
				c.font = `${drone.h}px 'Press Start 2P'`;
				c.textAlign = "left";
				c.textBaseline = "top";
				c.fillText(drone.text,drone.x,drone.y);

			} else {
				c.fillStyle = drone.isDying ? deathColor : "hsl(240,9%,37%)";
				c.beginPath();
				c.moveTo(drone.x,drone.y);

				for (let pl of drone.pts)
					c.lineTo(drone.x + pl[0],drone.y + pl[1]);

				c.fill();
				c.closePath();
			}
			// change direction after exiting, record new high score and reset score if missed
			if ((drone.x > W && !drone.dir) || (drone.x < -drone.w && drone.dir)) {
				drone = new Drone();
				if (score > hiScore)
					hiScore = score;
				score = 0;

			// death sequence
			} else if (drone.isDying) {
				--drone.deathTime;
				if (drone.deathTime < 0)
					drone = new Drone();

			// red light (if not dead) and movement
			} else {
				 if (!drone.isNewYears) {
				 	c.fillStyle = "hsl(0,100%,63%)";
					c.fillRect(drone.x + drone.light.x,drone.y + drone.light.y,2,1);
				 }
				drone.x += drone.speed * (drone.dir ? -1 : 1);
			}
			// fireworks rockets
			for (let f of fireworks) {
				// draw exhaust (or trail of "kids")
				c.fillStyle = f.color;
				for (let k of f.kids)
					c.fillRect(Math.floor(k.x / f.size) * f.size,k.y,f.size,f.size);
				// keep exhaust at restricted length
				if (f.kids.length > f.maxKids || f.y <= f.ey)
					f.kids.pop();
					
				if (f.y > f.ey) {
					// draw rocket
					c.fillStyle = "hsl(0,0%,100%)";
					c.fillRect(Math.floor(f.x / f.size) * f.size,f.y,f.size,f.size);
					// generate kid
					f.kids.unshift({x:f.x,y:f.y});
					// X distance * (1 / steps it takes to reach Y distance)
					f.x += (f.ex - f.sx) * Math.abs(1/((f.ey - f.sy)/f.size));
					f.y -= f.size;
					
				} else if (f.kids.length == 1) {
					// spawn particles, trash rocket
					let ps = f.pSpawn;
					// contact with drone
					if (
						(f.x + f.size > drone.x && f.x < drone.x + drone.w) && 
						(f.y + f.size > drone.y && f.y < drone.y + drone.h) && 
						!drone.isDying && playing
					) {
						drone.isDying = true;
						++score;
					}
					while (ps--)
						particles.push(new FireworksParticle(f.x,f.y,Math.randFloat(0,Math.PI*2),f.color));
					
					fireworks.shift();
				}
			}
			// particles
			for (let p of particles) {
				c.fillStyle = p.color;
				c.fillRect(p.x,p.y,Math.ceil(p.size),Math.ceil(p.size));
				// particle brightness
				if (p.brghtnss > 0) {
					c.fillStyle = `hsla(0,0%,100%,${p.brghtnss})`;
					c.fillRect(p.x,p.y,p.size,p.size);
				}
				p.brghtnss = p.brghtnss > 0.9 ? 0 : p.brghtnss + 0.1;
				// movement
				p.x += Math.cos(p.angle) * p.speed;
				p.y += Math.sin(p.angle) * p.speed + p.gravity;
				p.speed *= p.friction;
				p.size -= 1/p.dspwnTm;

				if (p.dspwnTm < 0)
					particles.shift();
				else
					--p.dspwnTm;
			}
			// randomly fire more rockets until user fires some (spawn across full width)
			if (Math.random() < fireworksChance && !playing) {
				const sx = Math.randInt(50, Math.max(50, W - 50));
				const ex = Math.randInt(50, Math.max(50, W - 50));
				const ey = Math.randInt(50, Math.max(100, Math.floor(H * 0.6)));
				fireworks.push(new Fireworks(sx, H, ex, ey));
			}
			// city - tile across the full width
			let citySize = 5,
				cityWidth = citySize * 48,
				cityPartsCount = Math.ceil(W / cityWidth) + 1;

			for (let part = 0; part < cityPartsCount; part++) {
				// back
				c.fillStyle = "hsl(240,33%,20%)";
				c.beginPath();
				c.moveTo(cityWidth * part, H);
				for (let _1 of cityPart1)
					c.lineTo(
						cityWidth * part + citySize * _1[0],
						H - citySize * (_1[1] + 8)
					);
				c.fill();
				c.closePath();
				// middle
				c.fillStyle = "hsl(240,33%,10%)";
				c.beginPath();
				c.moveTo(cityWidth * part, H);
				for (let _2 of cityPart2)
					c.lineTo(
						cityWidth * part + citySize * _2[0],
						H - citySize * (_2[1] + 4)
					);
				c.fill();
				c.closePath();
				// front
				c.fillStyle = "hsl(240,100%,3%)";
				c.beginPath();
				c.moveTo(cityWidth * part, H);
				for (let _3 of cityPart3)
					c.lineTo(
						cityWidth * part + citySize * _3[0],
						H - citySize * _3[1]
					);
				c.fill();
				c.closePath();
				// windows
				c.fillStyle = "hsl(60,64%,37%)";
				for (let _window of windows)
					c.fillRect(
						cityWidth * part + citySize * _window[0],
						H - citySize * _window[1],
						citySize,
						citySize * 1.5
					);
			}
			// high score and current score
			let fontFamily = "Press Start 2P";
			c.fillStyle = "hsl(0,0%,100%)";
			c.textBaseline = "middle";
			if (hiScore > 0) {
				c.font = `16px '${fontFamily}'`;
				c.textAlign = "left";
				c.fillText(`BEST: ${hiScore}`,24,24);
			}
			if (score > 0) {			
				c.font = `32px '${fontFamily}'`;
				c.textAlign = "center";
				c.fillText(score,W/2,80);
			}
		},
		addFireworks = e => {
			if (fireworks.length <= fireworksLimit) {
				if (!playing)
					playing = true;

				let rawX = e.pageX - C.offsetLeft,
					rawY = e.pageY - C.offsetTop,
					// (click coord * virtual dimension) / canvas dimension
					x = Math.round((rawX * W) / C.offsetWidth),
					y = Math.round((rawY * H) / C.offsetHeight),
					sx = x < W/3 ? W/4 : (x > W/3 && x < W*(2/3) ? W/2 : W*0.75),
					sy = 60;

				fireworks.push(new Fireworks(sx,H - sy,x,y));
			}
		},
		run = () => {
			draw();
			requestAnimationFrame(run);
		},
		hold = false,
		holdSt = 0,
		isTouch = "ontouchstart" in document.documentElement,
		inputD = isTouch ? "touchstart" : "mousedown",
		inputM = isTouch ? "touchmove" : "mousemove",
		inputU = isTouch ? "touchend" : "mouseup",
		inputO = isTouch ? "touchcancel" : "mouseout";
	
	run();
	
	C.addEventListener(inputD,e => {
		addFireworks(e);
		hold = !hold;
		holdSt = Date.now();
	});
	C.addEventListener(inputM,e => {
		// control how many fireworks are launched as you drag
		let rate = 5;
		if (hold && (Date.now() - holdSt) % rate === 0)
			addFireworks(e);
	});
	// use document instead of canvas to prevent firing on hover
	document.addEventListener(inputU,() => {
		if (hold)
			hold = !hold;
	});
	document.addEventListener(inputO,() => {
		if (hold)
			hold = !hold;
	});
}
// Objects
class Star {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.size = Math.randInt(1,3);
		this.brghtnss = Math.randInt(0,100)/100;
	}
}
class Drone {
	constructor() {
		this.dir = Math.randInt(0,1);
		this.w = 16;
		this.h = 7;
		this.x = this.placeX();
		this.y = Math.randInt(16,H*0.6);
		this.speed = 1;
		this.deathTime = 15;
		this.isDying = false;
		this.pts = [
			[5,0],[5,1],[3,1],[3,2],[6,2],[6,1],[10,1],[10,2],[13,2],[13,1],[11,1],[11,0],[16,0],[16,1],[14,1],[14,3],[11,3],[11,7],[10,7],[10,3],[9,3],[9,5],[7,5],[7,3],[6,3],[6,7],[5,7],[5,3],[2,3],[2,1],[0,1],[0,0]
		];
		this.light = {
			x: 7,
			y: 1
		};
		this.text = "";
		this.isNewYears = false;
		// by chance, text to use for New Year’s instead of normal drone
		let date = new Date(),
			year = date.getFullYear(),
			month = date.getMonth(),
			day = date.getDate(),
			isJan1 = month == 0 && day == 1;

		if (isJan1 && Math.randInt(0,1)) {
			this.isNewYears = true;
			this.newYearsTextWithYear(year);
		}
	}
	placeX() {
		let startXOffset = 100;
		return this.dir ? W + startXOffset : -this.w - startXOffset;
	}
	newYearsTextWithYear(year) {
		this.text = `HAPPY NEW YEAR! ${year}`;
		this.h = 12;
		this.w = this.h * this.text.length;
		this.x = this.placeX();
		this.speed = 2;
	}
}
class Fireworks {
	constructor(sx,sy,ex,ey) {
		let h = Math.randInt(0,359),
			s = Math.randInt(75,100),
			l = Math.randInt(50,75);
		this.color = `hsl(${h},${s}%,${l}%)`;
		this.sx = sx;
		this.sy = sy;
		this.x = this.sx;
		this.y = this.sy;
		this.ex = ex;
		this.ey = ey;
		this.size = 2;
		this.kids = [];
		this.maxKids = 16;
		this.pSpawn = 54;
	}
}
class FireworksParticle {
	constructor(x,y,angle,color) {
		this.color = color || "hsl(0,0%,100%)";
		this.brghtnss = 0;
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.size = 4;
		this.speed = this.size / Math.randFloat(1,2);
		this.friction = 0.97;
		this.gravity = 0.98;
		this.dspwnTm = 90;
	}
}