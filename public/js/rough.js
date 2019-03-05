var rough=function(){"use strict";const t="undefined"!=typeof self;class s{constructor(t,s){this.defaultOptions={maxRandomnessOffset:2,roughness:1,bowing:1,stroke:"#000",strokeWidth:1,curveTightness:0,curveStepCount:9,fillStyle:"hachure",fillWeight:-1,hachureAngle:-41,hachureGap:-1},this.config=t||{},this.surface=s,this.config.options&&(this.defaultOptions=this._options(this.config.options))}_options(t){return t?Object.assign({},this.defaultOptions,t):this.defaultOptions}_drawable(t,s,e){return{shape:t,sets:s||[],options:e||this.defaultOptions}}getCanvasSize(){const t=t=>t&&"object"==typeof t&&t.baseVal&&t.baseVal.value?t.baseVal.value:t||100;return this.surface?[t(this.surface.width),t(this.surface.height)]:[100,100]}computePolygonSize(t){if(t.length){let s=t[0][0],e=t[0][0],i=t[0][1],h=t[0][1];for(let n=1;n<t.length;n++)s=Math.min(s,t[n][0]),e=Math.max(e,t[n][0]),i=Math.min(i,t[n][1]),h=Math.max(h,t[n][1]);return[e-s,h-i]}return[0,0]}polygonPath(t){let s="";if(t.length){s=`M${t[0][0]},${t[0][1]}`;for(let e=1;e<t.length;e++)s=`${s} L${t[e][0]},${t[e][1]}`}return s}computePathSize(s){let e=[0,0];if(t&&self.document)try{const t="http://www.w3.org/2000/svg",i=self.document.createElementNS(t,"svg");i.setAttribute("width","0"),i.setAttribute("height","0");const h=self.document.createElementNS(t,"path");h.setAttribute("d",s),i.appendChild(h),self.document.body.appendChild(i);const n=h.getBBox();n&&(e[0]=n.width||0,e[1]=n.height||0),self.document.body.removeChild(i)}catch(t){}const i=this.getCanvasSize();return e[0]*e[1]||(e=i),e}toPaths(t){const s=t.sets||[],e=t.options||this.defaultOptions,i=[];for(const t of s){let s=null;switch(t.type){case"path":s={d:this.opsToPath(t),stroke:e.stroke,strokeWidth:e.strokeWidth,fill:"none"};break;case"fillPath":s={d:this.opsToPath(t),stroke:"none",strokeWidth:0,fill:e.fill||"none"};break;case"fillSketch":s=this.fillSketch(t,e);break;case"path2Dfill":s={d:t.path||"",stroke:"none",strokeWidth:0,fill:e.fill||"none"};break;case"path2Dpattern":{const i=t.size,h={x:0,y:0,width:1,height:1,viewBox:`0 0 ${Math.round(i[0])} ${Math.round(i[1])}`,patternUnits:"objectBoundingBox",path:this.fillSketch(t,e)};s={d:t.path,stroke:"none",strokeWidth:0,pattern:h};break}}s&&i.push(s)}return i}fillSketch(t,s){let e=s.fillWeight;return e<0&&(e=s.strokeWidth/2),{d:this.opsToPath(t),stroke:s.fill||"none",strokeWidth:e,fill:"none"}}opsToPath(t){let s="";for(const e of t.ops){const t=e.data;switch(e.op){case"move":s+=`M${t[0]} ${t[1]} `;break;case"bcurveTo":s+=`C${t[0]} ${t[1]}, ${t[2]} ${t[3]}, ${t[4]} ${t[5]} `;break;case"qcurveTo":s+=`Q${t[0]} ${t[1]}, ${t[2]} ${t[3]} `;break;case"lineTo":s+=`L${t[0]} ${t[1]} `}}return s.trim()}}function e(t,s){return t.type===s}const i={A:7,a:7,C:6,c:6,H:1,h:1,L:2,l:2,M:2,m:2,Q:4,q:4,S:4,s:4,T:4,t:2,V:1,v:1,Z:0,z:0};class h{constructor(t){this.COMMAND=0,this.NUMBER=1,this.EOD=2,this.segments=[],this.parseData(t),this.processPoints()}tokenize(t){const s=new Array;for(;""!==t;)if(t.match(/^([ \t\r\n,]+)/))t=t.substr(RegExp.$1.length);else if(t.match(/^([aAcChHlLmMqQsStTvVzZ])/))s[s.length]={type:this.COMMAND,text:RegExp.$1},t=t.substr(RegExp.$1.length);else{if(!t.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))return console.error("Unrecognized segment command: "+t),[];s[s.length]={type:this.NUMBER,text:`${parseFloat(RegExp.$1)}`},t=t.substr(RegExp.$1.length)}return s[s.length]={type:this.EOD,text:""},s}parseData(t){const s=this.tokenize(t);let h=0,n=s[h],a="BOD";for(this.segments=new Array;!e(n,this.EOD);){let o;const r=new Array;if("BOD"===a){if("M"!==n.text&&"m"!==n.text)return void this.parseData("M0,0"+t);h++,o=i[n.text],a=n.text}else e(n,this.NUMBER)?o=i[a]:(h++,o=i[n.text],a=n.text);if(h+o<s.length){for(let t=h;t<h+o;t++){const i=s[t];if(!e(i,this.NUMBER))return void console.error("Parameter type is not a number: "+a+","+i.text);r[r.length]=+i.text}if("number"!=typeof i[a])return void console.error("Unsupported segment type: "+a);{const t={key:a,data:r};this.segments.push(t),n=s[h+=o],"M"===a&&(a="L"),"m"===a&&(a="l")}}else console.error("Path data ended before all parameters were found")}}get closed(){if(void 0===this._closed){this._closed=!1;for(const t of this.segments)"z"===t.key.toLowerCase()&&(this._closed=!0)}return this._closed}processPoints(){let t=null,s=[0,0];for(let e=0;e<this.segments.length;e++){const i=this.segments[e];switch(i.key){case"M":case"L":case"T":i.point=[i.data[0],i.data[1]];break;case"m":case"l":case"t":i.point=[i.data[0]+s[0],i.data[1]+s[1]];break;case"H":i.point=[i.data[0],s[1]];break;case"h":i.point=[i.data[0]+s[0],s[1]];break;case"V":i.point=[s[0],i.data[0]];break;case"v":i.point=[s[0],i.data[0]+s[1]];break;case"z":case"Z":t&&(i.point=[t[0],t[1]]);break;case"C":i.point=[i.data[4],i.data[5]];break;case"c":i.point=[i.data[4]+s[0],i.data[5]+s[1]];break;case"S":i.point=[i.data[2],i.data[3]];break;case"s":i.point=[i.data[2]+s[0],i.data[3]+s[1]];break;case"Q":i.point=[i.data[2],i.data[3]];break;case"q":i.point=[i.data[2]+s[0],i.data[3]+s[1]];break;case"A":i.point=[i.data[5],i.data[6]];break;case"a":i.point=[i.data[5]+s[0],i.data[6]+s[1]]}"m"!==i.key&&"M"!==i.key||(t=null),i.point&&(s=i.point,t||(t=i.point)),"z"!==i.key&&"Z"!==i.key||(t=null)}}}class n{constructor(t){this._position=[0,0],this._first=null,this.bezierReflectionPoint=null,this.quadReflectionPoint=null,this.parsed=new h(t)}get segments(){return this.parsed.segments}get closed(){return this.parsed.closed}get linearPoints(){if(!this._linearPoints){const t=[];let s=[];for(const e of this.parsed.segments){const i=e.key.toLowerCase();("m"!==i&&"z"!==i||(s.length&&(t.push(s),s=[]),"z"!==i))&&(e.point&&s.push(e.point))}s.length&&(t.push(s),s=[]),this._linearPoints=t}return this._linearPoints}get first(){return this._first}set first(t){this._first=t}setPosition(t,s){this._position=[t,s],this._first||(this._first=[t,s])}get position(){return this._position}get x(){return this._position[0]}get y(){return this._position[1]}}class a{constructor(t,s,e,i,h,n){if(this._segIndex=0,this._numSegs=0,this._rx=0,this._ry=0,this._sinPhi=0,this._cosPhi=0,this._C=[0,0],this._theta=0,this._delta=0,this._T=0,this._from=t,t[0]===s[0]&&t[1]===s[1])return;const a=Math.PI/180;this._rx=Math.abs(e[0]),this._ry=Math.abs(e[1]),this._sinPhi=Math.sin(i*a),this._cosPhi=Math.cos(i*a);const o=this._cosPhi*(t[0]-s[0])/2+this._sinPhi*(t[1]-s[1])/2,r=-this._sinPhi*(t[0]-s[0])/2+this._cosPhi*(t[1]-s[1])/2;let l=0;const c=this._rx*this._rx*this._ry*this._ry-this._rx*this._rx*r*r-this._ry*this._ry*o*o;if(c<0){const t=Math.sqrt(1-c/(this._rx*this._rx*this._ry*this._ry));this._rx=this._rx*t,this._ry=this._ry*t,l=0}else l=(h===n?-1:1)*Math.sqrt(c/(this._rx*this._rx*r*r+this._ry*this._ry*o*o));const p=l*this._rx*r/this._ry,u=-l*this._ry*o/this._rx;this._C=[0,0],this._C[0]=this._cosPhi*p-this._sinPhi*u+(t[0]+s[0])/2,this._C[1]=this._sinPhi*p+this._cosPhi*u+(t[1]+s[1])/2,this._theta=this.calculateVectorAngle(1,0,(o-p)/this._rx,(r-u)/this._ry);let f=this.calculateVectorAngle((o-p)/this._rx,(r-u)/this._ry,(-o-p)/this._rx,(-r-u)/this._ry);!n&&f>0?f-=2*Math.PI:n&&f<0&&(f+=2*Math.PI),this._numSegs=Math.ceil(Math.abs(f/(Math.PI/2))),this._delta=f/this._numSegs,this._T=8/3*Math.sin(this._delta/4)*Math.sin(this._delta/4)/Math.sin(this._delta/2)}getNextSegment(){if(this._segIndex===this._numSegs)return null;const t=Math.cos(this._theta),s=Math.sin(this._theta),e=this._theta+this._delta,i=Math.cos(e),h=Math.sin(e),n=[this._cosPhi*this._rx*i-this._sinPhi*this._ry*h+this._C[0],this._sinPhi*this._rx*i+this._cosPhi*this._ry*h+this._C[1]],a=[this._from[0]+this._T*(-this._cosPhi*this._rx*s-this._sinPhi*this._ry*t),this._from[1]+this._T*(-this._sinPhi*this._rx*s+this._cosPhi*this._ry*t)],o=[n[0]+this._T*(this._cosPhi*this._rx*h+this._sinPhi*this._ry*i),n[1]+this._T*(this._sinPhi*this._rx*h-this._cosPhi*this._ry*i)];return this._theta=e,this._from=[n[0],n[1]],this._segIndex++,{cp1:a,cp2:o,to:n}}calculateVectorAngle(t,s,e,i){const h=Math.atan2(s,t),n=Math.atan2(i,e);return n>=h?n-h:2*Math.PI-(h-n)}}class o{constructor(t,s){this.sets=t,this.closed=s}fit(t){const s=[];for(const e of this.sets){const i=e.length;let h=Math.floor(t*i);if(h<5){if(i<=5)continue;h=5}s.push(this.reduce(e,h))}let e="";for(const t of s){for(let s=0;s<t.length;s++){const i=t[s];e+=0===s?"M"+i[0]+","+i[1]:"L"+i[0]+","+i[1]}this.closed&&(e+="z ")}return e}distance(t,s){return Math.sqrt(Math.pow(t[0]-s[0],2)+Math.pow(t[1]-s[1],2))}reduce(t,s){if(t.length<=s)return t;const e=t.slice(0);for(;e.length>s;){let t=-1,s=-1;for(let i=1;i<e.length-1;i++){const h=this.distance(e[i-1],e[i]),n=this.distance(e[i],e[i+1]),a=this.distance(e[i-1],e[i+1]),o=(h+n+a)/2,r=Math.sqrt(o*(o-h)*(o-n)*(o-a));(t<0||r<t)&&(t=r,s=i)}if(!(s>0))break;e.splice(s,1)}return e}}class r{constructor(t,s){this.xi=Number.MAX_VALUE,this.yi=Number.MAX_VALUE,this.px1=t[0],this.py1=t[1],this.px2=s[0],this.py2=s[1],this.a=this.py2-this.py1,this.b=this.px1-this.px2,this.c=this.px2*this.py1-this.px1*this.py2,this._undefined=0===this.a&&0===this.b&&0===this.c}isUndefined(){return this._undefined}intersects(t){if(this.isUndefined()||t.isUndefined())return!1;let s=Number.MAX_VALUE,e=Number.MAX_VALUE,i=0,h=0;const n=this.a,a=this.b,o=this.c;return Math.abs(a)>1e-5&&(s=-n/a,i=-o/a),Math.abs(t.b)>1e-5&&(e=-t.a/t.b,h=-t.c/t.b),s===Number.MAX_VALUE?e===Number.MAX_VALUE?-o/n==-t.c/t.a&&(this.py1>=Math.min(t.py1,t.py2)&&this.py1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.py2>=Math.min(t.py1,t.py2)&&this.py2<=Math.max(t.py1,t.py2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=this.px1,this.yi=e*this.xi+h,!((this.py1-this.yi)*(this.yi-this.py2)<-1e-5||(t.py1-this.yi)*(this.yi-t.py2)<-1e-5)&&(!(Math.abs(t.a)<1e-5)||!((t.px1-this.xi)*(this.xi-t.px2)<-1e-5))):e===Number.MAX_VALUE?(this.xi=t.px1,this.yi=s*this.xi+i,!((t.py1-this.yi)*(this.yi-t.py2)<-1e-5||(this.py1-this.yi)*(this.yi-this.py2)<-1e-5)&&(!(Math.abs(n)<1e-5)||!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5))):s===e?i===h&&(this.px1>=Math.min(t.px1,t.px2)&&this.px1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.px2>=Math.min(t.px1,t.px2)&&this.px2<=Math.max(t.px1,t.px2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=(h-i)/(s-e),this.yi=s*this.xi+i,!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5||(t.px1-this.xi)*(this.xi-t.px2)<-1e-5))}}class l{constructor(t,s,e,i,h,n,a,o){this.deltaX=0,this.hGap=0,this.top=t,this.bottom=s,this.left=e,this.right=i,this.gap=h,this.sinAngle=n,this.tanAngle=o,Math.abs(n)<1e-4?this.pos=e+h:Math.abs(n)>.9999?this.pos=t+h:(this.deltaX=(s-t)*Math.abs(o),this.pos=e-Math.abs(this.deltaX),this.hGap=Math.abs(h/a),this.sLeft=new r([e,s],[e,t]),this.sRight=new r([i,s],[i,t]))}nextLine(){if(Math.abs(this.sinAngle)<1e-4){if(this.pos<this.right){const t=[this.pos,this.top,this.pos,this.bottom];return this.pos+=this.gap,t}}else if(Math.abs(this.sinAngle)>.9999){if(this.pos<this.bottom){const t=[this.left,this.pos,this.right,this.pos];return this.pos+=this.gap,t}}else{let t=this.pos-this.deltaX/2,s=this.pos+this.deltaX/2,e=this.bottom,i=this.top;if(this.pos<this.right+this.deltaX){for(;t<this.left&&s<this.left||t>this.right&&s>this.right;)if(this.pos+=this.hGap,t=this.pos-this.deltaX/2,s=this.pos+this.deltaX/2,this.pos>this.right+this.deltaX)return null;const h=new r([t,e],[s,i]);this.sLeft&&h.intersects(this.sLeft)&&(t=h.xi,e=h.yi),this.sRight&&h.intersects(this.sRight)&&(s=h.xi,i=h.yi),this.tanAngle>0&&(t=this.right-(t-this.left),s=this.right-(s-this.left));const n=[t,e,s,i];return this.pos+=this.hGap,n}}return null}}function c(t){const s=t[0],e=t[1];return Math.sqrt(Math.pow(s[0]-e[0],2)+Math.pow(s[1]-e[1],2))}function p(t,s){const e=[],i=new r([t[0],t[1]],[t[2],t[3]]);for(let t=0;t<s.length;t++){const h=new r(s[t],s[(t+1)%s.length]);i.intersects(h)&&e.push([i.xi,i.yi])}return e}function u(t,s,e,i,h,n,a){return[-e*n-i*h+e+n*t+h*s,a*(e*h-i*n)+i+-a*h*t+a*n*s]}function f(t,s){const e=[];if(t&&t.length){let i=t[0][0],h=t[0][0],n=t[0][1],a=t[0][1];for(let s=1;s<t.length;s++)i=Math.min(i,t[s][0]),h=Math.max(h,t[s][0]),n=Math.min(n,t[s][1]),a=Math.max(a,t[s][1]);const o=s.hachureAngle;let r=s.hachureGap;r<0&&(r=4*s.strokeWidth),r=Math.max(r,.1);const c=o%180*(Math.PI/180),u=Math.cos(c),f=Math.sin(c),d=Math.tan(c),g=new l(n-1,a+1,i-1,h+1,r,f,u,d);let y;for(;null!=(y=g.nextLine());){const s=p(y,t);for(let t=0;t<s.length;t++)if(t<s.length-1){const i=s[t],h=s[t+1];e.push([i,h])}}}return e}function d(t,s,e,i,h,n){const a=[];let o=Math.abs(i/2),r=Math.abs(h/2);o+=t.randOffset(.05*o,n),r+=t.randOffset(.05*r,n);const l=n.hachureAngle;let c=n.hachureGap;c<=0&&(c=4*n.strokeWidth);let p=n.fillWeight;p<0&&(p=n.strokeWidth/2);const f=l%180*(Math.PI/180),d=Math.tan(f),g=r/o,y=Math.sqrt(g*d*g*d+1),x=g*d/y,_=1/y,M=c/(o*r/Math.sqrt(r*_*(r*_)+o*x*(o*x))/o);let b=Math.sqrt(o*o-(s-o+M)*(s-o+M));for(let t=s-o+M;t<s+o;t+=M){const i=u(t,e-(b=Math.sqrt(o*o-(s-t)*(s-t))),s,e,x,_,g),h=u(t,e+b,s,e,x,_,g);a.push([i,h])}return a}class g{constructor(t){this.helper=t}fillPolygon(t,s){return this._fillPolygon(t,s)}fillEllipse(t,s,e,i,h){return this._fillEllipse(t,s,e,i,h)}_fillPolygon(t,s,e=!1){const i=f(t,s);return{type:"fillSketch",ops:this.renderLines(i,s,e)}}_fillEllipse(t,s,e,i,h,n=!1){const a=d(this.helper,t,s,e,i,h);return{type:"fillSketch",ops:this.renderLines(a,h,n)}}renderLines(t,s,e){let i=[],h=null;for(const n of t)i=i.concat(this.helper.doubleLineOps(n[0][0],n[0][1],n[1][0],n[1][1],s)),e&&h&&(i=i.concat(this.helper.doubleLineOps(h[0],h[1],n[0][0],n[0][1],s))),h=n[1];return i}}class y extends g{fillPolygon(t,s){return this._fillPolygon(t,s,!0)}fillEllipse(t,s,e,i,h){return this._fillEllipse(t,s,e,i,h,!0)}}class x extends g{fillPolygon(t,s){const e=this._fillPolygon(t,s),i=Object.assign({},s,{hachureAngle:s.hachureAngle+90}),h=this._fillPolygon(t,i);return e.ops=e.ops.concat(h.ops),e}fillEllipse(t,s,e,i,h){const n=this._fillEllipse(t,s,e,i,h),a=Object.assign({},h,{hachureAngle:h.hachureAngle+90}),o=this._fillEllipse(t,s,e,i,a);return n.ops=n.ops.concat(o.ops),n}}class _{constructor(t){this.helper=t}fillPolygon(t,s){const e=f(t,s=Object.assign({},s,{curveStepCount:4,hachureAngle:0}));return this.dotsOnLines(e,s)}fillEllipse(t,s,e,i,h){h=Object.assign({},h,{curveStepCount:4,hachureAngle:0});const n=d(this.helper,t,s,e,i,h);return this.dotsOnLines(n,h)}dotsOnLines(t,s){let e=[],i=s.hachureGap;i<0&&(i=4*s.strokeWidth),i=Math.max(i,.1);let h=s.fillWeight;h<0&&(h=s.strokeWidth/2);for(const n of t){const t=c(n)/i,a=Math.ceil(t)-1,o=Math.atan((n[1][1]-n[0][1])/(n[1][0]-n[0][0]));for(let t=0;t<a;t++){const a=i*(t+1),r=a*Math.sin(o),l=a*Math.cos(o),c=[n[0][0]-l,n[0][1]+r],p=this.helper.randOffsetWithRange(c[0]-i/4,c[0]+i/4,s),u=this.helper.randOffsetWithRange(c[1]-i/4,c[1]+i/4,s),f=this.helper.ellipse(p,u,h,h,s);e=e.concat(f.ops)}}return{type:"fillSketch",ops:e}}}const M={};function b(t,s){let e=t.fillStyle||"hachure";if(!M[e])switch(e){case"zigzag":M[e]||(M[e]=new y(s));break;case"cross-hatch":M[e]||(M[e]=new x(s));break;case"dots":M[e]||(M[e]=new _(s));break;case"hachure":default:M[e="hachure"]||(M[e]=new g(s))}return M[e]}const m={randOffset:function(t,s){return O(t,s)},randOffsetWithRange:function(t,s,e){return E(t,s,e)},ellipse:S,doubleLineOps:function(t,s,e,i,h){return R(t,s,e,i,h)}};function w(t,s,e,i,h){return{type:"path",ops:R(t,s,e,i,h)}}function k(t,s,e){const i=(t||[]).length;if(i>2){let h=[];for(let s=0;s<i-1;s++)h=h.concat(R(t[s][0],t[s][1],t[s+1][0],t[s+1][1],e));return s&&(h=h.concat(R(t[i-1][0],t[i-1][1],t[0][0],t[0][1],e))),{type:"path",ops:h}}return 2===i?w(t[0][0],t[0][1],t[1][0],t[1][1],e):{type:"path",ops:[]}}function P(t,s,e,i,h){return function(t,s){return k(t,!0,s)}([[t,s],[t+e,s],[t+e,s+i],[t,s+i]],h)}function v(t,s){const e=N(t,1*(1+.2*s.roughness),s),i=N(t,1.5*(1+.22*s.roughness),s);return{type:"path",ops:e.concat(i)}}function S(t,s,e,i,h){const n=2*Math.PI/h.curveStepCount;let a=Math.abs(e/2),o=Math.abs(i/2);const r=$(n,t,s,a+=O(.05*a,h),o+=O(.05*o,h),1,n*E(.1,E(.4,1,h),h),h),l=$(n,t,s,a,o,1.5,0,h);return{type:"path",ops:r.concat(l)}}function A(t,s,e,i,h,n,a,o,r){const l=t,c=s;let p=Math.abs(e/2),u=Math.abs(i/2);p+=O(.01*p,r),u+=O(.01*u,r);let f=h,d=n;for(;f<0;)f+=2*Math.PI,d+=2*Math.PI;d-f>2*Math.PI&&(f=0,d=2*Math.PI);const g=2*Math.PI/r.curveStepCount,y=Math.min(g/2,(d-f)/2),x=z(y,l,c,p,u,f,d,1,r),_=z(y,l,c,p,u,f,d,1.5,r);let M=x.concat(_);return a&&(o?M=(M=M.concat(R(l,c,l+p*Math.cos(f),c+u*Math.sin(f),r))).concat(R(l,c,l+p*Math.cos(d),c+u*Math.sin(d),r)):(M.push({op:"lineTo",data:[l,c]}),M.push({op:"lineTo",data:[l+p*Math.cos(f),c+u*Math.sin(f)]}))),{type:"path",ops:M}}function T(t,s){const e=[];if(t.length){const i=s.maxRandomnessOffset||0,h=t.length;if(h>2){e.push({op:"move",data:[t[0][0]+O(i,s),t[0][1]+O(i,s)]});for(let n=1;n<h;n++)e.push({op:"lineTo",data:[t[n][0]+O(i,s),t[n][1]+O(i,s)]})}}return{type:"fillPath",ops:e}}function C(t,s){return b(s,m).fillPolygon(t,s)}function E(t,s,e){return e.roughness*(Math.random()*(s-t)+t)}function O(t,s){return E(-t,t,s)}function R(t,s,e,i,h){const n=W(t,s,e,i,h,!0,!1),a=W(t,s,e,i,h,!0,!0);return n.concat(a)}function W(t,s,e,i,h,n,a){const o=Math.pow(t-e,2)+Math.pow(s-i,2);let r=h.maxRandomnessOffset||0;r*r*100>o&&(r=Math.sqrt(o)/10);const l=r/2,c=.2+.2*Math.random();let p=h.bowing*h.maxRandomnessOffset*(i-s)/200,u=h.bowing*h.maxRandomnessOffset*(t-e)/200;p=O(p,h),u=O(u,h);const f=[],d=()=>O(l,h),g=()=>O(r,h);return n&&(a?f.push({op:"move",data:[t+d(),s+d()]}):f.push({op:"move",data:[t+O(r,h),s+O(r,h)]})),a?f.push({op:"bcurveTo",data:[p+t+(e-t)*c+d(),u+s+(i-s)*c+d(),p+t+2*(e-t)*c+d(),u+s+2*(i-s)*c+d(),e+d(),i+d()]}):f.push({op:"bcurveTo",data:[p+t+(e-t)*c+g(),u+s+(i-s)*c+g(),p+t+2*(e-t)*c+g(),u+s+2*(i-s)*c+g(),e+g(),i+g()]}),f}function N(t,s,e){const i=[];i.push([t[0][0]+O(s,e),t[0][1]+O(s,e)]),i.push([t[0][0]+O(s,e),t[0][1]+O(s,e)]);for(let h=1;h<t.length;h++)i.push([t[h][0]+O(s,e),t[h][1]+O(s,e)]),h===t.length-1&&i.push([t[h][0]+O(s,e),t[h][1]+O(s,e)]);return L(i,null,e)}function L(t,s,e){const i=t.length;let h=[];if(i>3){const n=[],a=1-e.curveTightness;h.push({op:"move",data:[t[1][0],t[1][1]]});for(let s=1;s+2<i;s++){const e=t[s];n[0]=[e[0],e[1]],n[1]=[e[0]+(a*t[s+1][0]-a*t[s-1][0])/6,e[1]+(a*t[s+1][1]-a*t[s-1][1])/6],n[2]=[t[s+1][0]+(a*t[s][0]-a*t[s+2][0])/6,t[s+1][1]+(a*t[s][1]-a*t[s+2][1])/6],n[3]=[t[s+1][0],t[s+1][1]],h.push({op:"bcurveTo",data:[n[1][0],n[1][1],n[2][0],n[2][1],n[3][0],n[3][1]]})}if(s&&2===s.length){const t=e.maxRandomnessOffset;h.push({op:"lineTo",data:[s[0]+O(t,e),s[1]+O(t,e)]})}}else 3===i?(h.push({op:"move",data:[t[1][0],t[1][1]]}),h.push({op:"bcurveTo",data:[t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1]]})):2===i&&(h=h.concat(R(t[0][0],t[0][1],t[1][0],t[1][1],e)));return h}function $(t,s,e,i,h,n,a,o){const r=O(.5,o)-Math.PI/2,l=[];l.push([O(n,o)+s+.9*i*Math.cos(r-t),O(n,o)+e+.9*h*Math.sin(r-t)]);for(let a=r;a<2*Math.PI+r-.01;a+=t)l.push([O(n,o)+s+i*Math.cos(a),O(n,o)+e+h*Math.sin(a)]);return l.push([O(n,o)+s+i*Math.cos(r+2*Math.PI+.5*a),O(n,o)+e+h*Math.sin(r+2*Math.PI+.5*a)]),l.push([O(n,o)+s+.98*i*Math.cos(r+a),O(n,o)+e+.98*h*Math.sin(r+a)]),l.push([O(n,o)+s+.9*i*Math.cos(r+.5*a),O(n,o)+e+.9*h*Math.sin(r+.5*a)]),L(l,null,o)}function z(t,s,e,i,h,n,a,o,r){const l=n+O(.1,r),c=[];c.push([O(o,r)+s+.9*i*Math.cos(l-t),O(o,r)+e+.9*h*Math.sin(l-t)]);for(let n=l;n<=a;n+=t)c.push([O(o,r)+s+i*Math.cos(n),O(o,r)+e+h*Math.sin(n)]);return c.push([s+i*Math.cos(a),e+h*Math.sin(a)]),c.push([s+i*Math.cos(a),e+h*Math.sin(a)]),L(c,null,r)}function D(t,s,e,i,h,n,a,o){const r=[],l=[o.maxRandomnessOffset||1,(o.maxRandomnessOffset||1)+.5];let c=[0,0];for(let p=0;p<2;p++)0===p?r.push({op:"move",data:[a.x,a.y]}):r.push({op:"move",data:[a.x+O(l[0],o),a.y+O(l[0],o)]}),c=[h+O(l[p],o),n+O(l[p],o)],r.push({op:"bcurveTo",data:[t+O(l[p],o),s+O(l[p],o),e+O(l[p],o),i+O(l[p],o),c[0],c[1]]});return a.setPosition(c[0],c[1]),r}function q(t,s,e,i){let h=[];switch(s.key){case"M":case"m":{const e="m"===s.key;if(s.data.length>=2){let n=+s.data[0],a=+s.data[1];e&&(n+=t.x,a+=t.y);const o=1*(i.maxRandomnessOffset||0);n+=O(o,i),a+=O(o,i),t.setPosition(n,a),h.push({op:"move",data:[n,a]})}break}case"L":case"l":{const e="l"===s.key;if(s.data.length>=2){let n=+s.data[0],a=+s.data[1];e&&(n+=t.x,a+=t.y),h=h.concat(R(t.x,t.y,n,a,i)),t.setPosition(n,a)}break}case"H":case"h":{const e="h"===s.key;if(s.data.length){let n=+s.data[0];e&&(n+=t.x),h=h.concat(R(t.x,t.y,n,t.y,i)),t.setPosition(n,t.y)}break}case"V":case"v":{const e="v"===s.key;if(s.data.length){let n=+s.data[0];e&&(n+=t.y),h=h.concat(R(t.x,t.y,t.x,n,i)),t.setPosition(t.x,n)}break}case"Z":case"z":t.first&&(h=h.concat(R(t.x,t.y,t.first[0],t.first[1],i)),t.setPosition(t.first[0],t.first[1]),t.first=null);break;case"C":case"c":{const e="c"===s.key;if(s.data.length>=6){let n=+s.data[0],a=+s.data[1],o=+s.data[2],r=+s.data[3],l=+s.data[4],c=+s.data[5];e&&(n+=t.x,o+=t.x,l+=t.x,a+=t.y,r+=t.y,c+=t.y);const p=D(n,a,o,r,l,c,t,i);h=h.concat(p),t.bezierReflectionPoint=[l+(l-o),c+(c-r)]}break}case"S":case"s":{const n="s"===s.key;if(s.data.length>=4){let a=+s.data[0],o=+s.data[1],r=+s.data[2],l=+s.data[3];n&&(a+=t.x,r+=t.x,o+=t.y,l+=t.y);let c=a,p=o;const u=e?e.key:"";let f=null;"c"!==u&&"C"!==u&&"s"!==u&&"S"!==u||(f=t.bezierReflectionPoint),f&&(c=f[0],p=f[1]);const d=D(c,p,a,o,r,l,t,i);h=h.concat(d),t.bezierReflectionPoint=[r+(r-a),l+(l-o)]}break}case"Q":case"q":{const e="q"===s.key;if(s.data.length>=4){let n=+s.data[0],a=+s.data[1],o=+s.data[2],r=+s.data[3];e&&(n+=t.x,o+=t.x,a+=t.y,r+=t.y);const l=1*(1+.2*i.roughness),c=1.5*(1+.22*i.roughness);h.push({op:"move",data:[t.x+O(l,i),t.y+O(l,i)]});let p=[o+O(l,i),r+O(l,i)];h.push({op:"qcurveTo",data:[n+O(l,i),a+O(l,i),p[0],p[1]]}),h.push({op:"move",data:[t.x+O(c,i),t.y+O(c,i)]}),p=[o+O(c,i),r+O(c,i)],h.push({op:"qcurveTo",data:[n+O(c,i),a+O(c,i),p[0],p[1]]}),t.setPosition(p[0],p[1]),t.quadReflectionPoint=[o+(o-n),r+(r-a)]}break}case"T":case"t":{const n="t"===s.key;if(s.data.length>=2){let a=+s.data[0],o=+s.data[1];n&&(a+=t.x,o+=t.y);let r=a,l=o;const c=e?e.key:"";let p=null;"q"!==c&&"Q"!==c&&"t"!==c&&"T"!==c||(p=t.quadReflectionPoint),p&&(r=p[0],l=p[1]);const u=1*(1+.2*i.roughness),f=1.5*(1+.22*i.roughness);h.push({op:"move",data:[t.x+O(u,i),t.y+O(u,i)]});let d=[a+O(u,i),o+O(u,i)];h.push({op:"qcurveTo",data:[r+O(u,i),l+O(u,i),d[0],d[1]]}),h.push({op:"move",data:[t.x+O(f,i),t.y+O(f,i)]}),d=[a+O(f,i),o+O(f,i)],h.push({op:"qcurveTo",data:[r+O(f,i),l+O(f,i),d[0],d[1]]}),t.setPosition(d[0],d[1]),t.quadReflectionPoint=[a+(a-r),o+(o-l)]}break}case"A":case"a":{const e="a"===s.key;if(s.data.length>=7){const n=+s.data[0],o=+s.data[1],r=+s.data[2],l=+s.data[3],c=+s.data[4];let p=+s.data[5],u=+s.data[6];if(e&&(p+=t.x,u+=t.y),p===t.x&&u===t.y)break;if(0===n||0===o)h=h.concat(R(t.x,t.y,p,u,i)),t.setPosition(p,u);else for(let s=0;s<1;s++){const s=new a([t.x,t.y],[p,u],[n,o],r,!!l,!!c);let e=s.getNextSegment();for(;e;){const n=D(e.cp1[0],e.cp1[1],e.cp2[0],e.cp2[1],e.to[0],e.to[1],t,i);h=h.concat(n),e=s.getNextSegment()}}}break}}return h}class I extends s{line(t,s,e,i,h){const n=this._options(h);return this._drawable("line",[w(t,s,e,i,n)],n)}rectangle(t,s,e,i,h){const n=this._options(h),a=[];if(n.fill){const h=[[t,s],[t+e,s],[t+e,s+i],[t,s+i]];"solid"===n.fillStyle?a.push(T(h,n)):a.push(C(h,n))}return a.push(P(t,s,e,i,n)),this._drawable("rectangle",a,n)}ellipse(t,s,e,i,h){const n=this._options(h),a=[];if(n.fill)if("solid"===n.fillStyle){const h=S(t,s,e,i,n);h.type="fillPath",a.push(h)}else a.push(function(t,s,e,i,h){return b(h,m).fillEllipse(t,s,e,i,h)}(t,s,e,i,n));return a.push(S(t,s,e,i,n)),this._drawable("ellipse",a,n)}circle(t,s,e,i){const h=this.ellipse(t,s,e,e,i);return h.shape="circle",h}linearPath(t,s){const e=this._options(s);return this._drawable("linearPath",[k(t,!1,e)],e)}arc(t,s,e,i,h,n,a=!1,o){const r=this._options(o),l=[];if(a&&r.fill)if("solid"===r.fillStyle){const a=A(t,s,e,i,h,n,!0,!1,r);a.type="fillPath",l.push(a)}else l.push(function(t,s,e,i,h,n,a){const o=t,r=s;let l=Math.abs(e/2),c=Math.abs(i/2);l+=O(.01*l,a),c+=O(.01*c,a);let p=h,u=n;for(;p<0;)p+=2*Math.PI,u+=2*Math.PI;u-p>2*Math.PI&&(p=0,u=2*Math.PI);const f=(u-p)/a.curveStepCount,d=[];for(let t=p;t<=u;t+=f)d.push([o+l*Math.cos(t),r+c*Math.sin(t)]);return d.push([o+l*Math.cos(u),r+c*Math.sin(u)]),d.push([o,r]),C(d,a)}(t,s,e,i,h,n,r));return l.push(A(t,s,e,i,h,n,a,!0,r)),this._drawable("arc",l,r)}curve(t,s){const e=this._options(s);return this._drawable("curve",[v(t,e)],e)}polygon(t,s){const e=this._options(s),i=[];if(e.fill)if("solid"===e.fillStyle)i.push(T(t,e));else{const s=this.computePolygonSize(t),h=C([[0,0],[s[0],0],[s[0],s[1]],[0,s[1]]],e);h.type="path2Dpattern",h.size=s,h.path=this.polygonPath(t),i.push(h)}return i.push(k(t,!0,e)),this._drawable("polygon",i,e)}path(t,s){const e=this._options(s),i=[];if(!t)return this._drawable("path",i,e);if(e.fill)if("solid"===e.fillStyle){const s={type:"path2Dfill",path:t,ops:[]};i.push(s)}else{const s=this.computePathSize(t),h=C([[0,0],[s[0],0],[s[0],s[1]],[0,s[1]]],e);h.type="path2Dpattern",h.size=s,h.path=t,i.push(h)}return i.push(function(t,s){t=(t||"").replace(/\n/g," ").replace(/(-\s)/g,"-").replace("/(ss)/g"," ");let e=new n(t);if(s.simplification){const t=new o(e.linearPoints,e.closed).fit(s.simplification);e=new n(t)}let i=[];const h=e.segments||[];for(let t=0;t<h.length;t++){const n=q(e,h[t],t>0?h[t-1]:null,s);n&&n.length&&(i=i.concat(n))}return{type:"path",ops:i}}(t,e)),this._drawable("path",i,e)}}const B="undefined"!=typeof document;class U{constructor(t){this.canvas=t,this.ctx=this.canvas.getContext("2d")}draw(t){const s=t.sets||[],e=t.options||this.getDefaultOptions(),i=this.ctx;for(const t of s)switch(t.type){case"path":i.save(),i.strokeStyle=e.stroke,i.lineWidth=e.strokeWidth,this._drawToContext(i,t),i.restore();break;case"fillPath":i.save(),i.fillStyle=e.fill||"",this._drawToContext(i,t),i.restore();break;case"fillSketch":this.fillSketch(i,t,e);break;case"path2Dfill":{this.ctx.save(),this.ctx.fillStyle=e.fill||"";const s=new Path2D(t.path);this.ctx.fill(s),this.ctx.restore();break}case"path2Dpattern":{const s=this.canvas.ownerDocument||B&&document;if(s){const i=t.size,h=s.createElement("canvas"),n=h.getContext("2d"),a=this.computeBBox(t.path);a&&(a.width||a.height)?(h.width=this.canvas.width,h.height=this.canvas.height,n.translate(a.x||0,a.y||0)):(h.width=i[0],h.height=i[1]),this.fillSketch(n,t,e),this.ctx.save(),this.ctx.fillStyle=this.ctx.createPattern(h,"repeat");const o=new Path2D(t.path);this.ctx.fill(o),this.ctx.restore()}else console.error("Cannot render path2Dpattern. No defs/document defined.");break}}}computeBBox(t){if(B)try{const s="http://www.w3.org/2000/svg",e=document.createElementNS(s,"svg");e.setAttribute("width","0"),e.setAttribute("height","0");const i=self.document.createElementNS(s,"path");i.setAttribute("d",t),e.appendChild(i),document.body.appendChild(e);const h=i.getBBox();return document.body.removeChild(e),h}catch(t){}return null}fillSketch(t,s,e){let i=e.fillWeight;i<0&&(i=e.strokeWidth/2),t.save(),t.strokeStyle=e.fill||"",t.lineWidth=i,this._drawToContext(t,s),t.restore()}_drawToContext(t,s){t.beginPath();for(const e of s.ops){const s=e.data;switch(e.op){case"move":t.moveTo(s[0],s[1]);break;case"bcurveTo":t.bezierCurveTo(s[0],s[1],s[2],s[3],s[4],s[5]);break;case"qcurveTo":t.quadraticCurveTo(s[0],s[1],s[2],s[3]);break;case"lineTo":t.lineTo(s[0],s[1])}}"fillPath"===s.type?t.fill():t.stroke()}}class V extends U{constructor(t,s){super(t),this.gen=new I(s||null,this.canvas)}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}line(t,s,e,i,h){const n=this.gen.line(t,s,e,i,h);return this.draw(n),n}rectangle(t,s,e,i,h){const n=this.gen.rectangle(t,s,e,i,h);return this.draw(n),n}ellipse(t,s,e,i,h){const n=this.gen.ellipse(t,s,e,i,h);return this.draw(n),n}circle(t,s,e,i){const h=this.gen.circle(t,s,e,i);return this.draw(h),h}linearPath(t,s){const e=this.gen.linearPath(t,s);return this.draw(e),e}polygon(t,s){const e=this.gen.polygon(t,s);return this.draw(e),e}arc(t,s,e,i,h,n,a=!1,o){const r=this.gen.arc(t,s,e,i,h,n,a,o);return this.draw(r),r}curve(t,s){const e=this.gen.curve(t,s);return this.draw(e),e}path(t,s){const e=this.gen.path(t,s);return this.draw(e),e}}const X="undefined"!=typeof document;class G{constructor(t){this.svg=t}get defs(){const t=this.svg.ownerDocument||X&&document;if(t&&!this._defs){const s=t.createElementNS("http://www.w3.org/2000/svg","defs");this.svg.firstChild?this.svg.insertBefore(s,this.svg.firstChild):this.svg.appendChild(s),this._defs=s}return this._defs||null}draw(t){const s=t.sets||[],e=t.options||this.getDefaultOptions(),i=this.svg.ownerDocument||window.document,h=i.createElementNS("http://www.w3.org/2000/svg","g");for(const t of s){let s=null;switch(t.type){case"path":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",this.opsToPath(t)),s.style.stroke=e.stroke,s.style.strokeWidth=e.strokeWidth+"",s.style.fill="none";break;case"fillPath":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",this.opsToPath(t)),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=e.fill||null;break;case"fillSketch":s=this.fillSketch(i,t,e);break;case"path2Dfill":(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",t.path||""),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=e.fill||null;break;case"path2Dpattern":if(this.defs){const h=t.size,n=i.createElementNS("http://www.w3.org/2000/svg","pattern"),a=`rough-${Math.floor(Math.random()*(Number.MAX_SAFE_INTEGER||999999))}`;n.setAttribute("id",a),n.setAttribute("x","0"),n.setAttribute("y","0"),n.setAttribute("width","1"),n.setAttribute("height","1"),n.setAttribute("height","1"),n.setAttribute("viewBox",`0 0 ${Math.round(h[0])} ${Math.round(h[1])}`),n.setAttribute("patternUnits","objectBoundingBox");const o=this.fillSketch(i,t,e);n.appendChild(o),this.defs.appendChild(n),(s=i.createElementNS("http://www.w3.org/2000/svg","path")).setAttribute("d",t.path||""),s.style.stroke="none",s.style.strokeWidth="0",s.style.fill=`url(#${a})`}else console.error("Cannot render path2Dpattern. No defs/document defined.")}s&&h.appendChild(s)}return h}fillSketch(t,s,e){let i=e.fillWeight;i<0&&(i=e.strokeWidth/2);const h=t.createElementNS("http://www.w3.org/2000/svg","path");return h.setAttribute("d",this.opsToPath(s)),h.style.stroke=e.fill||null,h.style.strokeWidth=i+"",h.style.fill="none",h}}class j extends G{constructor(t,s){super(t),this.gen=new I(s||null,this.svg)}get generator(){return this.gen}getDefaultOptions(){return this.gen.defaultOptions}opsToPath(t){return this.gen.opsToPath(t)}line(t,s,e,i,h){const n=this.gen.line(t,s,e,i,h);return this.draw(n)}rectangle(t,s,e,i,h){const n=this.gen.rectangle(t,s,e,i,h);return this.draw(n)}ellipse(t,s,e,i,h){const n=this.gen.ellipse(t,s,e,i,h);return this.draw(n)}circle(t,s,e,i){const h=this.gen.circle(t,s,e,i);return this.draw(h)}linearPath(t,s){const e=this.gen.linearPath(t,s);return this.draw(e)}polygon(t,s){const e=this.gen.polygon(t,s);return this.draw(e)}arc(t,s,e,i,h,n,a=!1,o){const r=this.gen.arc(t,s,e,i,h,n,a,o);return this.draw(r)}curve(t,s){const e=this.gen.curve(t,s);return this.draw(e)}path(t,s){const e=this.gen.path(t,s);return this.draw(e)}}return{canvas:(t,s)=>new V(t,s),svg:(t,s)=>new j(t,s),generator:(t,s)=>new I(t,s)}}();
