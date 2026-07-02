import * as THREE from "three";

// ============================================================================
// Custom GLSL materials. Each factory returns a fresh THREE.ShaderMaterial so
// instances never share uniforms. Components attach them with
// <primitive object={mat} attach="material" /> and advance mat.uniforms.uTime
// inside useFrame. Keeps all shader logic in one reusable place.
// ============================================================================

const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
`;

/** Holographic surface: fresnel rim, travelling scanlines, gentle flicker. */
export function createHolographicMaterial(color = "#22d3ee") {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal; varying vec3 vView; varying vec2 vUv; varying vec3 vPos;
      void main(){
        vUv = uv; vPos = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal; varying vec3 vView; varying vec2 vUv; varying vec3 vPos;
      uniform float uTime; uniform vec3 uColor; uniform float uOpacity;
      void main(){
        float fres = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
        float scan = 0.5 + 0.5 * sin((vPos.y * 14.0) - uTime * 3.0);
        float flick = 0.85 + 0.15 * sin(uTime * 40.0 + vPos.y * 3.0);
        float a = (fres * 0.9 + scan * 0.35) * flick;
        gl_FragColor = vec4(uColor * (1.2 + fres), a * uOpacity);
      }`,
  });
}

/** Molten energy core: layered simplex noise, hot centre, additive glow. */
export function createEnergyMaterial(color = "#2f6bff", color2 = "#22d3ee") {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uColor2: { value: new THREE.Color(color2) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      void main(){
        vPos = position; vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader:
      noiseGLSL +
      /* glsl */ `
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      uniform float uTime; uniform vec3 uColor; uniform vec3 uColor2;
      void main(){
        vec3 p = normalize(vPos);
        float n = snoise(p * 2.2 + vec3(0.0, uTime * 0.35, 0.0));
        n += 0.5 * snoise(p * 5.0 - vec3(uTime * 0.2));
        n = n * 0.5 + 0.5;
        float fres = pow(1.0 - abs(dot(vNormal, vView)), 1.6);
        vec3 col = mix(uColor, uColor2, n);
        col += fres * 1.4;
        float a = 0.55 + 0.45 * n + fres * 0.6;
        gl_FragColor = vec4(col * 1.6, a);
      }`,
  });
}

/** Fresnel glow shell — a soft atmospheric halo around a mesh. */
export function createFresnelMaterial(color = "#22d3ee", power = 3.0) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal; varying vec3 vView;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal; varying vec3 vView;
      uniform vec3 uColor; uniform float uPower; uniform float uTime;
      void main(){
        float f = pow(1.0 - abs(dot(vNormal, vView)), uPower);
        float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
        gl_FragColor = vec4(uColor, f * pulse);
      }`,
  });
}

/** Glowing wireframe / hologram grid ground plane. */
export function createHoloGridMaterial(color = "#22d3ee") {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uScale: { value: 24.0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vPos;
      void main(){ vUv = uv; vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vPos;
      uniform float uTime; uniform vec3 uColor; uniform float uScale;
      float gridLine(vec2 uv, float scale){
        vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
        return 1.0 - min(min(g.x, g.y), 1.0);
      }
      void main(){
        float line = gridLine(vUv, uScale);
        float pulse = 0.5 + 0.5 * sin(vPos.x * 0.4 + vPos.y * 0.4 - uTime * 2.0);
        float fade = smoothstep(0.75, 0.0, distance(vUv, vec2(0.5)));
        float a = line * (0.35 + 0.65 * pulse) * fade;
        gl_FragColor = vec4(uColor * 1.4, a);
      }`,
  });
}

/** Themed planet surface: fbm continents/bands + day/night terminator + rim. */
export function createPlanetMaterial(
  colorA = "#0a1740",
  colorB = "#2f6bff",
  colorC = "#22d3ee",
  lightDir: [number, number, number] = [0.6, 0.5, 0.6]
) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
      uLightDir: { value: new THREE.Vector3(...lightDir).normalize() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      void main(){
        vPos = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader:
      noiseGLSL +
      /* glsl */ `
      varying vec3 vPos; varying vec3 vNormal; varying vec3 vView;
      uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC; uniform vec3 uLightDir;
      float fbm(vec3 p){
        float f = 0.0; float a = 0.5;
        for(int i=0;i<5;i++){ f += a*snoise(p); p*=2.03; a*=0.5; }
        return f;
      }
      void main(){
        vec3 p = normalize(vPos);
        float bands = fbm(p*2.4 + vec3(0.0, uTime*0.03, 0.0));
        float detail = fbm(p*7.0 - vec3(uTime*0.02));
        float m = smoothstep(-0.2, 0.5, bands + detail*0.35);
        vec3 surface = mix(uColorA, uColorB, m);
        surface = mix(surface, uColorC, smoothstep(0.55, 0.9, detail));
        // day/night terminator
        float diff = clamp(dot(normalize(vNormal), normalize(uLightDir)), 0.0, 1.0);
        float lit = smoothstep(0.0, 0.35, diff);
        vec3 night = uColorA * 0.12 + uColorC * 0.05 * (0.5+0.5*sin(detail*20.0));
        vec3 col = mix(night, surface * (0.35 + diff), lit);
        // fresnel rim (atmosphere edge)
        float rim = pow(1.0 - abs(dot(normalize(vNormal), vView)), 3.0);
        col += uColorC * rim * 0.9;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
}
