!function(t){var e={};function r(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(i,n,function(e){return t[e]}.bind(null,n));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";r.r(e);const i=Math.pow(2,-52),n=new Uint32Array(512);class s{static from(t,e=_,r=d){const i=t.length,n=new Float64Array(2*i);for(let s=0;s<i;s++){const i=t[s];n[2*s]=e(i),n[2*s+1]=r(i)}return new s(n)}constructor(t){const e=t.length>>1;if(e>0&&"number"!=typeof t[0])throw new Error("Expected coords to contain numbers.");this.coords=t;const r=Math.max(2*e-5,0);this._triangles=new Uint32Array(3*r),this._halfedges=new Int32Array(3*r),this._hashSize=Math.ceil(Math.sqrt(e)),this._hullPrev=new Uint32Array(e),this._hullNext=new Uint32Array(e),this._hullTri=new Uint32Array(e),this._hullHash=new Int32Array(this._hashSize).fill(-1),this._ids=new Uint32Array(e),this._dists=new Float64Array(e),this.update()}update(){const{coords:t,_hullPrev:e,_hullNext:r,_hullTri:n,_hullHash:s}=this,o=t.length>>1;let l=1/0,f=1/0,_=-1/0,d=-1/0;for(let e=0;e<o;e++){const r=t[2*e],i=t[2*e+1];r<l&&(l=r),i<f&&(f=i),r>_&&(_=r),i>d&&(d=i),this._ids[e]=e}const g=(l+_)/2,y=(f+d)/2;let v,T,E,p=1/0;for(let e=0;e<o;e++){const r=a(g,y,t[2*e],t[2*e+1]);r<p&&(v=e,p=r)}const A=t[2*v],m=t[2*v+1];p=1/0;for(let e=0;e<o;e++){if(e===v)continue;const r=a(A,m,t[2*e],t[2*e+1]);r<p&&r>0&&(T=e,p=r)}let b=t[2*T],w=t[2*T+1],S=1/0;for(let e=0;e<o;e++){if(e===v||e===T)continue;const r=u(A,m,b,w,t[2*e],t[2*e+1]);r<S&&(E=e,S=r)}let R=t[2*E],x=t[2*E+1];if(S===1/0){for(let e=0;e<o;e++)this._dists[e]=t[2*e]-t[0]||t[2*e+1]-t[1];c(this._ids,this._dists,0,o-1);const e=new Uint32Array(o);let r=0;for(let t=0,i=-1/0;t<o;t++){const n=this._ids[t];this._dists[n]>i&&(e[r++]=n,i=this._dists[n])}return this.hull=e.subarray(0,r),this.triangles=new Uint32Array(0),void(this.halfedges=new Uint32Array(0))}if(h(A,m,b,w,R,x)){const t=T,e=b,r=w;T=E,b=R,w=x,E=t,R=e,x=r}const U=function(t,e,r,i,n,s){const a=r-t,o=i-e,h=n-t,l=s-e,u=a*a+o*o,c=h*h+l*l,f=.5/(a*l-o*h);return{x:t+(l*u-o*c)*f,y:e+(a*c-h*u)*f}}(A,m,b,w,R,x);this._cx=U.x,this._cy=U.y;for(let e=0;e<o;e++)this._dists[e]=a(t[2*e],t[2*e+1],U.x,U.y);c(this._ids,this._dists,0,o-1),this._hullStart=v;let P=3;r[v]=e[E]=T,r[T]=e[v]=E,r[E]=e[T]=v,n[v]=0,n[T]=1,n[E]=2,s.fill(-1),s[this._hashKey(A,m)]=v,s[this._hashKey(b,w)]=T,s[this._hashKey(R,x)]=E,this.trianglesLen=0,this._addTriangle(v,T,E,-1,-1,-1);for(let a,o,l=0;l<this._ids.length;l++){const u=this._ids[l],c=t[2*u],f=t[2*u+1];if(l>0&&Math.abs(c-a)<=i&&Math.abs(f-o)<=i)continue;if(a=c,o=f,u===v||u===T||u===E)continue;let _=0;for(let t=0,e=this._hashKey(c,f);t<this._hashSize&&(-1===(_=s[(e+t)%this._hashSize])||_===r[_]);t++);let d,g=_=e[_];for(;d=r[g],!h(c,f,t[2*g],t[2*g+1],t[2*d],t[2*d+1]);)if((g=d)===_){g=-1;break}if(-1===g)continue;let y=this._addTriangle(g,u,r[g],-1,-1,n[g]);n[u]=this._legalize(y+2),n[g]=y,P++;let p=r[g];for(;d=r[p],h(c,f,t[2*p],t[2*p+1],t[2*d],t[2*d+1]);)y=this._addTriangle(p,u,d,n[u],-1,n[p]),n[u]=this._legalize(y+2),r[p]=p,P--,p=d;if(g===_)for(;h(c,f,t[2*(d=e[g])],t[2*d+1],t[2*g],t[2*g+1]);)y=this._addTriangle(d,u,g,-1,n[g],n[d]),this._legalize(y+2),n[d]=y,r[g]=g,P--,g=d;this._hullStart=e[u]=g,r[g]=e[p]=u,r[u]=p,s[this._hashKey(c,f)]=u,s[this._hashKey(t[2*g],t[2*g+1])]=g}this.hull=new Uint32Array(P);for(let t=0,e=this._hullStart;t<P;t++)this.hull[t]=e,e=r[e];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(t,e){return Math.floor(function(t,e){const r=t/(Math.abs(t)+Math.abs(e));return(e>0?3-r:1+r)/4}(t-this._cx,e-this._cy)*this._hashSize)%this._hashSize}_legalize(t){const{_triangles:e,_halfedges:r,coords:i}=this;let s=0,a=0;for(;;){const o=r[t],h=t-t%3;if(a=h+(t+2)%3,-1===o){if(0===s)break;t=n[--s];continue}const u=o-o%3,c=h+(t+1)%3,f=u+(o+2)%3,_=e[a],d=e[t],g=e[c],y=e[f];if(l(i[2*_],i[2*_+1],i[2*d],i[2*d+1],i[2*g],i[2*g+1],i[2*y],i[2*y+1])){e[t]=y,e[o]=_;const i=r[f];if(-1===i){let e=this._hullStart;do{if(this._hullTri[e]===f){this._hullTri[e]=t;break}e=this._hullPrev[e]}while(e!==this._hullStart)}this._link(t,i),this._link(o,r[a]),this._link(a,f);const h=u+(o+1)%3;s<n.length&&(n[s++]=h)}else{if(0===s)break;t=n[--s]}}return a}_link(t,e){this._halfedges[t]=e,-1!==e&&(this._halfedges[e]=t)}_addTriangle(t,e,r,i,n,s){const a=this.trianglesLen;return this._triangles[a]=t,this._triangles[a+1]=e,this._triangles[a+2]=r,this._link(a,i),this._link(a+1,n),this._link(a+2,s),this.trianglesLen+=3,a}}function a(t,e,r,i){const n=t-r,s=e-i;return n*n+s*s}function o(t,e,r,i,n,s){const a=(i-e)*(n-t),o=(r-t)*(s-e);return Math.abs(a-o)>=33306690738754716e-32*Math.abs(a+o)?a-o:0}function h(t,e,r,i,n,s){return(o(n,s,t,e,r,i)||o(t,e,r,i,n,s)||o(r,i,n,s,t,e))<0}function l(t,e,r,i,n,s,a,o){const h=t-a,l=e-o,u=r-a,c=i-o,f=n-a,_=s-o,d=u*u+c*c,g=f*f+_*_;return h*(c*g-d*_)-l*(u*g-d*f)+(h*h+l*l)*(u*_-c*f)<0}function u(t,e,r,i,n,s){const a=r-t,o=i-e,h=n-t,l=s-e,u=a*a+o*o,c=h*h+l*l,f=.5/(a*l-o*h),_=(l*u-o*c)*f,d=(a*c-h*u)*f;return _*_+d*d}function c(t,e,r,i){if(i-r<=20)for(let n=r+1;n<=i;n++){const i=t[n],s=e[i];let a=n-1;for(;a>=r&&e[t[a]]>s;)t[a+1]=t[a--];t[a+1]=i}else{let n=r+1,s=i;f(t,r+i>>1,n),e[t[r]]>e[t[i]]&&f(t,r,i),e[t[n]]>e[t[i]]&&f(t,n,i),e[t[r]]>e[t[n]]&&f(t,r,n);const a=t[n],o=e[a];for(;;){do{n++}while(e[t[n]]<o);do{s--}while(e[t[s]]>o);if(s<n)break;f(t,n,s)}t[r+1]=t[s],t[s]=a,i-n+1>=s-r?(c(t,e,n,i),c(t,e,r,s-1)):(c(t,e,r,s-1),c(t,e,n,i))}}function f(t,e,r){const i=t[e];t[e]=t[r],t[r]=i}function _(t){return t[0]}function d(t){return t[1]}!function(t){function e(t,e){for(var r=[],i=0;i<e.length;i+=3)for(var n=0;n<3;n++)r.push(t[n+0]*e[i+0]+t[n+3]*e[i+1]+t[n+6]*e[i+2]);return r}function r(t,e){return[t[0]-e[0],t[1]-e[1]]}function i(t,e){return t[0]*e[1]-t[1]*e[0]}var n=t.prototype.getContext;t.prototype.getContext=function(t,a){var o=this;if("morph"!==t)return n.apply(o,[t,a]);var h,l=o.getContext("webgl",{preserveDrawingBuffer:!0}),u=this.pg=l.createProgram();if(h=l.createShader(l.VERTEX_SHADER),l.shaderSource(h,"attribute vec4 p;varying vec2 a;uniform vec4 m;void main(){vec4 q=m*p;gl_Position=vec4(q.zw,0,1)+vec4(-1,1,0,0);a=q.xy;}"),l.compileShader(h),l.attachShader(u,h),function(t){l.shaderSource(t,"precision mediump float;uniform sampler2D i;varying vec2 a;void main(){gl_FragColor=texture2D(i,a);}"),l.compileShader(t),l.attachShader(u,t)}(l.createShader(l.FRAGMENT_SHADER)),l.linkProgram(u),!l.getProgramParameter(u,l.LINK_STATUS))throw new Error(l.getProgramInfoLog(u));return l.useProgram(u),{_coords:null,canvas:o,drawImage:function(t,e){var r;r=l.createTexture(),l.bindTexture(l.TEXTURE_2D,r),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.NEAREST),l.texImage2D(l.TEXTURE_2D,0,l.RGBA,l.RGBA,l.UNSIGNED_BYTE,t),function(e){l.uniform4f(e,1/t.naturalWidth,1/t.naturalHeight,2/o.width,-2/o.height)}(l.getUniformLocation(u,"m"));var i=[];s.from(e).triangles.forEach((function(t){Array.prototype.push.apply(i,e[t])})),this._coords=i;var n=l.createBuffer();l.bindBuffer(l.ARRAY_BUFFER,n),l.bufferData(l.ARRAY_BUFFER,new Float32Array(i),l.STATIC_DRAW);var a=l.getAttribLocation(u,"p");l.enableVertexAttribArray(a),l.vertexAttribPointer(a,4,l.FLOAT,!1,0,0),l.drawArrays(l.TRIANGLES,0,i.length/4)},clear:function(){l.viewport(0,0,l.drawingBufferWidth,l.drawingBufferHeight),l.clearColor(0,0,0,0),l.clear(l.COLOR_BUFFER_BIT)},getTexturePointAt:function(t,n){for(var s,a,o,h,l,u,c,f,_,d,g,y,v,T,E,p,A=this._coords,m=0;m<A.length;m+=12){var b=[[A[m+2],A[m+3]],[A[m+6],A[m+7]],[A[m+10],A[m+11]]],w=[[A[m+0],A[m+1]],[A[m+4],A[m+5]],[A[m+8],A[m+9]]];if(u=[t,n],f=void 0,_=void 0,d=void 0,g=void 0,y=void 0,v=void 0,T=void 0,E=void 0,p=void 0,f=r((c=b)[1],c[0]),_=r(c[2],c[1]),d=r(c[0],c[2]),g=r(u,c[0]),y=r(u,c[1]),v=r(u,c[2]),T=i(f,y),E=i(_,v),p=i(d,g),T>0&&E>0&&p>0||T<0&&E<0&&p<0){var S=(a=w,o=void 0,h=void 0,l=void 0,l=[(s=b)[0][0],s[0][1],1,s[1][0],s[1][1],1,s[2][0],s[2][1],1],e([a[0][0],a[0][1],1,a[1][0],a[1][1],1,a[2][0],a[2][1],1],(h=(o=l)[0]*o[4]*o[8]+o[3]*o[7]*o[2]+o[6]*o[1]*o[5]-o[0]*o[7]*o[5]-o[6]*o[4]*o[2]-o[3]*o[1]*o[8],[(o[4]*o[8]-o[7]*o[5])/h,(o[7]*o[2]-o[1]*o[8])/h,(o[1]*o[5]-o[4]*o[2])/h,(o[6]*o[5]-o[3]*o[8])/h,(o[0]*o[8]-o[6]*o[2])/h,(o[3]*o[2]-o[0]*o[5])/h,(o[3]*o[7]-o[6]*o[4])/h,(o[6]*o[1]-o[0]*o[7])/h,(o[0]*o[4]-o[1]*o[3])/h]))),R=e(S,[t,n,1]);return[R[0],R[1]]}}return null}}}}(HTMLCanvasElement)}]);