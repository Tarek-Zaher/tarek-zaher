'use client';

import { useEffect, useRef } from 'react';

const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.1;
const rangeSpeed = 1;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const startingHue = 15;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(0,0%,5%,1)';

const TAU = Math.PI * 2;
const rand = (n) => n * Math.random();
const fadeInOut = (life, ttl) => {
  const halfTtl = 0.5 * ttl;
  return Math.abs(((life + halfTtl) % ttl) - halfTtl) / halfTtl;
};

// Inline 3D Simplex Noise (Stefan Gustavson's algorithm)
class SimplexNoise {
  constructor() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise3D(xin, yin, zin) {
    const grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
    ];
    const dot = (g, x, y, z) => g[0] * x + g[1] * y + g[2] * z;
    const F3 = 1 / 3, G3 = 1 / 6;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0)      { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else               { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0)       { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0)  { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else               { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }

    const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
    const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
    const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3;
    const ii=i&255, jj=j&255, kk=k&255;
    const { perm, permMod12 } = this;

    let n0=0, n1=0, n2=0, n3=0;
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 >= 0) { t0 *= t0; n0 = t0*t0*dot(grad3[permMod12[ii+perm[jj+perm[kk]]]], x0, y0, z0); }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 >= 0) { t1 *= t1; n1 = t1*t1*dot(grad3[permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]], x1, y1, z1); }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 >= 0) { t2 *= t2; n2 = t2*t2*dot(grad3[permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]], x2, y2, z2); }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 >= 0) { t3 *= t3; n3 = t3*t3*dot(grad3[permMod12[ii+1+perm[jj+1+perm[kk+1]]]], x3, y3, z3); }

    return 32 * (n0 + n1 + n2 + n3);
  }
}

// Parent div must have position: relative (or any non-static position) for this to fill it correctly.
export default function BlurBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = {
      a: document.createElement('canvas'),
      b: document.createElement('canvas'),
    };
    canvas.b.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    container.appendChild(canvas.b);

    const ctx = {
      a: canvas.a.getContext('2d'),
      b: canvas.b.getContext('2d'),
    };

    let circleProps, simplex, baseHue, rafId;

    function resize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.a.width = w;
      canvas.a.height = h;
      ctx.a.drawImage(canvas.b, 0, 0);
      canvas.b.width = w;
      canvas.b.height = h;
      ctx.b.drawImage(canvas.a, 0, 0);
    }

    function initCircles() {
      circleProps = new Float32Array(circlePropsLength);
      simplex = new SimplexNoise();
      baseHue = startingHue;
      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        initCircle(i);
      }
    }

    function initCircle(i) {
      const w = canvas.a.width, h = canvas.a.height;
      const x = rand(w);
      const y = rand(h);
      const n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
      const t = rand(TAU);
      const speed = baseSpeed + rand(rangeSpeed);
      const vx = speed * Math.cos(t);
      const vy = speed * Math.sin(t);
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + n * rangeHue;
      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }

    function updateCircles() {
      baseHue = baseHue + 0.01;
      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        updateCircle(i);
      }
    }

    function updateCircle(i) {
      const i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
      const x = circleProps[i];
      const y = circleProps[i2];
      const vx = circleProps[i3];
      const vy = circleProps[i4];
      const life = circleProps[i5];
      const ttl = circleProps[i6];
      const radius = circleProps[i7];
      const hue = circleProps[i8];

      drawCircle(x, y, life, ttl, radius, hue);

      circleProps[i] = x + vx;
      circleProps[i2] = y + vy;
      circleProps[i5] = life + 1;

      if (checkBounds(x, y, radius) || life > ttl) initCircle(i);
    }

    function drawCircle(x, y, life, ttl, radius, hue) {
      ctx.a.save();
      ctx.a.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
      ctx.a.beginPath();
      ctx.a.arc(x, y, radius, 0, TAU);
      ctx.a.fill();
      ctx.a.closePath();
      ctx.a.restore();
    }

    function checkBounds(x, y, radius) {
      return (
        x < -radius ||
        x > canvas.a.width + radius ||
        y < -radius ||
        y > canvas.a.height + radius
      );
    }

    function render() {
      ctx.b.save();
      ctx.b.filter = 'blur(50px)';
      ctx.b.drawImage(canvas.a, 0, 0);
      ctx.b.restore();
    }

    function draw() {
      ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);
      ctx.b.fillStyle = backgroundColor;
      ctx.b.fillRect(0, 0, canvas.b.width, canvas.b.height);
      updateCircles();
      render();
      rafId = requestAnimationFrame(draw);
    }

    resize();
    initCircles();
    draw();

    const observer = new ResizeObserver(() => resize());
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      if (canvas.b.parentNode) canvas.b.parentNode.removeChild(canvas.b);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
