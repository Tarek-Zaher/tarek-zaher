'use client';

import { useEffect, useRef } from 'react';

export const PALETTES = [
  { name: 'Mint Bloom',   colors: ['#f3d6ef', '#8de8c2', '#3a5bf0', '#dff0ff'] },
  { name: 'Citrus Pop',   colors: ['#ffe9b0', '#f3a85a', '#f0c7e8', '#fff6e0'] },
  { name: 'Coral Dusk',   colors: ['#f6cdb0', '#5b8aa6', '#d65a3f', '#fbe3cf'] },
  { name: 'Golden Marsh', colors: ['#d9a93c', '#e9d77a', '#7fc9b8', '#c98a2e'] },
  { name: 'Lavender Sky', colors: ['#c9b8f0', '#7aa6e0', '#f0d4e8', '#9be0d4'] },
];

const VERT = `#version 300 es
in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uGrain;
uniform float uLevels;
uniform float uScale;
uniform vec3 uColors[4];

vec3 mod289v3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec2 mod289v2(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
vec3 permute(vec3 x){ return mod289v3(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1  = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m = max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m = m*m; m = m*m;
  vec3 x  = 2.0*fract(p*C.www)-1.0;
  vec3 h  = abs(x)-0.5;
  vec3 ox = floor(x+0.5);
  vec3 a0 = x-ox;
  m *= 1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x  = a0.x *x0.x  + h.x *x0.y;
  g.yz = a0.yz*x12.xz + h.yz*x12.yw;
  return 130.0*dot(m,g);
}

float fbm(vec2 p){
  float v=0.0, amp=0.5;
  for(int i=0;i<5;i++){ v+=amp*snoise(p); p*=2.0; amp*=0.5; }
  return v;
}

vec3 flow(vec2 p, float t){
  vec2 q = vec2(fbm(p+vec2(0.0)), fbm(p+vec2(5.2,1.3)));
  vec2 r = vec2(
    fbm(p+4.0*q+vec2(1.7+t*0.18, 9.2-t*0.05)),
    fbm(p+4.0*q+vec2(8.3-t*0.07, 2.8+t*0.14))
  );
  float f = fbm(p+4.0*r);
  return vec3(f, q.x, r.x);
}

float bayer(vec2 pix){
  int x=int(mod(pix.x,8.0)), y=int(mod(pix.y,8.0));
  int idx=y*8+x;
  float m[64]=float[64](
     0.0,32.0, 8.0,40.0, 2.0,34.0,10.0,42.0,
    48.0,16.0,56.0,24.0,50.0,18.0,58.0,26.0,
    12.0,44.0, 4.0,36.0,14.0,46.0, 6.0,38.0,
    60.0,28.0,52.0,20.0,62.0,30.0,54.0,22.0,
     3.0,35.0,11.0,43.0, 1.0,33.0, 9.0,41.0,
    51.0,19.0,59.0,27.0,49.0,17.0,57.0,25.0,
    15.0,47.0, 7.0,39.0,13.0,45.0, 5.0,37.0,
    63.0,31.0,55.0,23.0,61.0,29.0,53.0,21.0
  );
  return (m[idx]+0.5)/64.0;
}

void main(){
  vec2 fragPix = floor(gl_FragCoord.xy/uGrain)*uGrain;
  vec2 uv = fragPix/uRes;
  vec2 p  = (uv-0.5);
  p.x *= uRes.x/uRes.y;
  p   *= uScale*0.01;

  vec3 n  = flow(p, uTime);
  float f = n.x, qx = n.y, rx = n.z;

  vec3 col = mix(uColors[0], uColors[1], smoothstep(-0.7, 0.7, qx));
  col = mix(col, uColors[2], smoothstep(-0.6, 0.6, rx)*0.65);
  col = mix(col, uColors[3], smoothstep(-0.2, 0.9, f)*0.55);

  float d = bayer(floor(gl_FragCoord.xy/uGrain));
  outColor = vec4(floor(col*uLevels+d)/uLevels, 1.0);
}
`;

function hexToRgb01(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
  return s;
}

// Parent div must have position: relative (or any non-static position) for this to fill it correctly.
export default function DitherGradientBackground({
  // Animation speed — 0 is frozen, 1 is full speed
  speed = 0.35,
  // Pixel block size for the dither grain (1 = sharp, 4 = chunky)
  grain = 2,
  // Number of quantization levels — lower = more posterized
  levels = 6,
  // Noise domain scale — higher = more zoomed out
  scale = 120,
  // Palette: index into PALETTES (0–4) or an array of exactly 4 hex strings
  palette = 0,
  // Optional overlay color on top of the gradient, e.g. 'rgba(0,0,0,0.4)'
  overlay = null,
  style = {},
}) {
  const containerRef = useRef(null);
  const propsRef = useRef({ speed, grain, levels, scale, palette });

  useEffect(() => { propsRef.current.speed   = speed;   }, [speed]);
  useEffect(() => { propsRef.current.grain   = grain;   }, [grain]);
  useEffect(() => { propsRef.current.levels  = levels;  }, [levels]);
  useEffect(() => { propsRef.current.scale   = scale;   }, [scale]);
  useEffect(() => { propsRef.current.palette = palette; }, [palette]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: false });
    if (!gl) {
      console.error('DitherGradientBackground: WebGL2 is not supported in this browser.');
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResLoc    = gl.getUniformLocation(program, 'uRes');
    const uTimeLoc   = gl.getUniformLocation(program, 'uTime');
    const uGrainLoc  = gl.getUniformLocation(program, 'uGrain');
    const uLevelsLoc = gl.getUniformLocation(program, 'uLevels');
    const uScaleLoc  = gl.getUniformLocation(program, 'uScale');
    const uColorsLoc = gl.getUniformLocation(program, 'uColors[0]');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.floor(container.offsetWidth  * dpr);
      canvas.height = Math.floor(container.offsetHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
    }

    let t0 = performance.now();
    let timeAccum = 0;
    let rafId;

    function render(now) {
      const dt = (now - t0) / 1000;
      t0 = now;
      const { speed, grain, levels, scale, palette: pal } = propsRef.current;
      timeAccum += dt * speed;

      const colors = Array.isArray(pal)
        ? pal
        : (PALETTES[pal] ?? PALETTES[0]).colors;

      const flat = new Float32Array(12);
      colors.forEach((hex, i) => {
        const [r, g, b] = hexToRgb01(hex);
        flat[i * 3] = r; flat[i * 3 + 1] = g; flat[i * 3 + 2] = b;
      });

      gl.uniform3fv(uColorsLoc, flat);
      gl.uniform1f(uTimeLoc,   timeAccum);
      gl.uniform1f(uGrainLoc,  grain);
      gl.uniform1f(uLevelsLoc, levels);
      gl.uniform1f(uScaleLoc,  scale);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(render);
    }

    resize();
    rafId = requestAnimationFrame(render);

    const observer = new ResizeObserver(() => resize());
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    >
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: overlay, zIndex: 1 }} />
      )}
    </div>
  );
}
