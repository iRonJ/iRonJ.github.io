export const snowVS = `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
export const snowFS = `uniform float u_time; varying vec2 vUv;
float r(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}
float s(vec2 uv,float sc,float sp){uv.y+=u_time*sp;uv.x+=sin(uv.y*2.+u_time)*0.03;uv*=sc;vec2 i=floor(uv);vec2 f=fract(uv)-0.5;if(r(i)>0.95)return smoothstep(0.4,0.0,length(f));return 0.0;}
void main(){vec3 sky=vec3(0.53,0.81,0.92);float f=s(vUv,15.,0.3)+s(vUv+vec2(0.3,0.4),25.,0.2)+s(vUv+vec2(-0.2,0.1),10.,0.4);gl_FragColor=vec4(mix(sky,vec3(1.),clamp(f,0.,1.)),1.);}`;

export const waterVS = `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
export const waterFS = `uniform float u_time; uniform vec3 u_color; varying vec2 vUv;
void main(){vec2 uv=vUv*4.;float w=(sin(uv.x*2.+u_time*0.5)+sin(uv.y*3.+u_time*0.4)+sin((uv.x+uv.y)*4.+u_time*0.6))/3.;vec3 c=mix(u_color*0.5,u_color*1.5,w*0.5+0.5);if(w>0.8)c=mix(c,vec3(0.9,0.95,1.),(w-0.8)*5.);gl_FragColor=vec4(c,0.9);}`;

export const treeVS = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
export const treeFS = `
uniform float u_time;
uniform float u_growth;
varying vec2 vUv;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float sdBox(vec2 p, vec2 b) { vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y += 1.0; 
    float d = 1000.0;
    vec2 p = uv;
    float scale = 1.0;
    
    for(int i=0; i<9; i++) {
        float len = 0.25 * scale * u_growth;
        float seg = sdBox(p - vec2(0.0, len), vec2(0.015 * scale, len));
        d = min(d, seg);
        p.y -= 2.0 * len;
        p.x = abs(p.x);
        float angle = 0.95 + 0.15 * sin(u_time * 1.5 + float(i));
        p *= rot(angle);
        scale *= 0.75;
    }
    
    vec3 col = vec3(0.0);
    if(d < 0.0) { col = vec3(0.2, 1.0, 0.5); } else { col = vec3(0.1, 0.8, 0.3) * (0.005 / d); }
    float alpha = smoothstep(0.05, 0.0, d);
    if(alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
}
`;
