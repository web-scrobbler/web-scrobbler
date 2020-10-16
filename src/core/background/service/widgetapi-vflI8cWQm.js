/* eslint-disable */
(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var p;function aa(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}
var ba="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};
function ca(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");}
var t=ca(this);function u(a,b){if(b)a:{for(var c=t,d=a.split("."),e=0;e<d.length-1;e++){var f=d[e];if(!(f in c))break a;c=c[f]}d=d[d.length-1];e=c[d];f=b(e);f!=e&&null!=f&&ba(c,d,{configurable:!0,writable:!0,value:f})}}
u("Symbol",function(a){function b(e){if(this instanceof b)throw new TypeError("Symbol is not a constructor");return new c("jscomp_symbol_"+(e||"")+"_"+d++,e)}
function c(e,f){this.f=e;ba(this,"description",{configurable:!0,writable:!0,value:f})}
if(a)return a;c.prototype.toString=function(){return this.f};
var d=0;return b});
u("Symbol.iterator",function(a){if(a)return a;a=Symbol("Symbol.iterator");for(var b="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),c=0;c<b.length;c++){var d=t[b[c]];"function"===typeof d&&"function"!=typeof d.prototype[a]&&ba(d.prototype,a,{configurable:!0,writable:!0,value:function(){return da(aa(this))}})}return a});
function da(a){a={next:a};a[Symbol.iterator]=function(){return this};
return a}
function x(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:aa(a)}}
function fa(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}
var ha="function"==typeof Object.create?Object.create:function(a){function b(){}
b.prototype=a;return new b},ia;
if("function"==typeof Object.setPrototypeOf)ia=Object.setPrototypeOf;else{var ja;a:{var ka={a:!0},la={};try{la.__proto__=ka;ja=la.a;break a}catch(a){}ja=!1}ia=ja?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var oa=ia;
function pa(a,b){a.prototype=ha(b.prototype);a.prototype.constructor=a;if(oa)oa(a,b);else for(var c in b)if("prototype"!=c)if(Object.defineProperties){var d=Object.getOwnPropertyDescriptor(b,c);d&&Object.defineProperty(a,c,d)}else a[c]=b[c];a.A=b.prototype}
function qa(){this.l=!1;this.h=null;this.o=void 0;this.g=1;this.i=this.j=0;this.v=this.f=null}
function ra(a){if(a.l)throw new TypeError("Generator is already running");a.l=!0}
qa.prototype.m=function(a){this.o=a};
function sa(a,b){a.f={la:b,X:!0};a.g=a.j||a.i}
qa.prototype["return"]=function(a){this.f={"return":a};this.g=this.i};
function ta(a,b){a.g=5;return{value:b}}
qa.prototype.S=function(a){this.g=a};
function ua(a){a.j=2;a.i=3}
function va(a){a.j=0;a.f=null}
function wa(a){a.v=[a.f];a.j=0;a.i=0}
function xa(a){var b=a.v.splice(0)[0];(b=a.f=a.f||b)?b.X?a.g=a.j||a.i:void 0!=b.S&&a.i<b.S?(a.g=b.S,a.f=null):a.g=a.i:a.g=4}
function ya(a){this.f=new qa;this.g=a}
function Ca(a,b){ra(a.f);var c=a.f.h;if(c)return Ea(a,"return"in c?c["return"]:function(d){return{value:d,done:!0}},b,a.f["return"]);
a.f["return"](b);return Fa(a)}
function Ea(a,b,c,d){try{var e=b.call(a.f.h,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.f.l=!1,e;var f=e.value}catch(g){return a.f.h=null,sa(a.f,g),Fa(a)}a.f.h=null;d.call(a.f,f);return Fa(a)}
function Fa(a){for(;a.f.g;)try{var b=a.g(a.f);if(b)return a.f.l=!1,{value:b.value,done:!1}}catch(c){a.f.o=void 0,sa(a.f,c)}a.f.l=!1;if(a.f.f){b=a.f.f;a.f.f=null;if(b.X)throw b.la;return{value:b["return"],done:!0}}return{value:void 0,done:!0}}
function Ga(a){this.next=function(b){ra(a.f);a.f.h?b=Ea(a,a.f.h.next,b,a.f.m):(a.f.m(b),b=Fa(a));return b};
this["throw"]=function(b){ra(a.f);a.f.h?b=Ea(a,a.f.h["throw"],b,a.f.m):(sa(a.f,b),b=Fa(a));return b};
this["return"]=function(b){return Ca(a,b)};
this[Symbol.iterator]=function(){return this}}
function Ha(a,b){var c=new Ga(new ya(b));oa&&a.prototype&&oa(c,a.prototype);return c}
u("Reflect.setPrototypeOf",function(a){return a?a:oa?function(b,c){try{return oa(b,c),!0}catch(d){return!1}}:null});
u("Object.setPrototypeOf",function(a){return a||oa});
function y(a,b){return Object.prototype.hasOwnProperty.call(a,b)}
var Ia="function"==typeof Object.assign?Object.assign:function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)y(d,e)&&(a[e]=d[e])}return a};
u("Object.assign",function(a){return a||Ia});
u("Promise",function(a){function b(g){this.f=0;this.h=void 0;this.g=[];this.m=!1;var h=this.i();try{g(h.resolve,h.reject)}catch(k){h.reject(k)}}
function c(){this.f=null}
function d(g){return g instanceof b?g:new b(function(h){h(g)})}
if(a)return a;c.prototype.g=function(g){if(null==this.f){this.f=[];var h=this;this.h(function(){h.j()})}this.f.push(g)};
var e=t.setTimeout;c.prototype.h=function(g){e(g,0)};
c.prototype.j=function(){for(;this.f&&this.f.length;){var g=this.f;this.f=[];for(var h=0;h<g.length;++h){var k=g[h];g[h]=null;try{k()}catch(l){this.i(l)}}}this.f=null};
c.prototype.i=function(g){this.h(function(){throw g;})};
b.prototype.i=function(){function g(l){return function(m){k||(k=!0,l.call(h,m))}}
var h=this,k=!1;return{resolve:g(this.ga),reject:g(this.j)}};
b.prototype.ga=function(g){if(g===this)this.j(new TypeError("A Promise cannot resolve to itself"));else if(g instanceof b)this.ia(g);else{a:switch(typeof g){case "object":var h=null!=g;break a;case "function":h=!0;break a;default:h=!1}h?this.va(g):this.l(g)}};
b.prototype.va=function(g){var h=void 0;try{h=g.then}catch(k){this.j(k);return}"function"==typeof h?this.ja(h,g):this.l(g)};
b.prototype.j=function(g){this.o(2,g)};
b.prototype.l=function(g){this.o(1,g)};
b.prototype.o=function(g,h){if(0!=this.f)throw Error("Cannot settle("+g+", "+h+"): Promise already settled in state"+this.f);this.f=g;this.h=h;2===this.f&&this.ha();this.v()};
b.prototype.ha=function(){var g=this;e(function(){if(g.G()){var h=t.console;"undefined"!==typeof h&&h.error(g.h)}},1)};
b.prototype.G=function(){if(this.m)return!1;var g=t.CustomEvent,h=t.Event,k=t.dispatchEvent;if("undefined"===typeof k)return!0;"function"===typeof g?g=new g("unhandledrejection",{cancelable:!0}):"function"===typeof h?g=new h("unhandledrejection",{cancelable:!0}):(g=t.document.createEvent("CustomEvent"),g.initCustomEvent("unhandledrejection",!1,!0,g));g.promise=this;g.reason=this.h;return k(g)};
b.prototype.v=function(){if(null!=this.g){for(var g=0;g<this.g.length;++g)f.g(this.g[g]);this.g=null}};
var f=new c;b.prototype.ia=function(g){var h=this.i();g.J(h.resolve,h.reject)};
b.prototype.ja=function(g,h){var k=this.i();try{g.call(h,k.resolve,k.reject)}catch(l){k.reject(l)}};
b.prototype.then=function(g,h){function k(r,q){return"function"==typeof r?function(v){try{l(r(v))}catch(w){m(w)}}:q}
var l,m,n=new b(function(r,q){l=r;m=q});
this.J(k(g,l),k(h,m));return n};
b.prototype["catch"]=function(g){return this.then(void 0,g)};
b.prototype.J=function(g,h){function k(){switch(l.f){case 1:g(l.h);break;case 2:h(l.h);break;default:throw Error("Unexpected state: "+l.f);}}
var l=this;null==this.g?f.g(k):this.g.push(k);this.m=!0};
b.resolve=d;b.reject=function(g){return new b(function(h,k){k(g)})};
b.race=function(g){return new b(function(h,k){for(var l=x(g),m=l.next();!m.done;m=l.next())d(m.value).J(h,k)})};
b.all=function(g){var h=x(g),k=h.next();return k.done?d([]):new b(function(l,m){function n(v){return function(w){r[v]=w;q--;0==q&&l(r)}}
var r=[],q=0;do r.push(void 0),q++,d(k.value).J(n(r.length-1),m),k=h.next();while(!k.done)})};
return b});
function Ja(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""}
u("String.prototype.endsWith",function(a){return a?a:function(b,c){var d=Ja(this,b,"endsWith");b+="";void 0===c&&(c=d.length);for(var e=Math.max(0,Math.min(c|0,d.length)),f=b.length;0<f&&0<e;)if(d[--e]!=b[--f])return!1;return 0>=f}});
u("String.prototype.startsWith",function(a){return a?a:function(b,c){var d=Ja(this,b,"startsWith");b+="";for(var e=d.length,f=b.length,g=Math.max(0,Math.min(c|0,d.length)),h=0;h<f&&g<e;)if(d[g++]!=b[h++])return!1;return h>=f}});
function Ka(a,b){a instanceof String&&(a+="");var c=0,d=!1,e={next:function(){if(!d&&c<a.length){var f=c++;return{value:b(f,a[f]),done:!1}}d=!0;return{done:!0,value:void 0}}};
e[Symbol.iterator]=function(){return e};
return e}
u("Array.prototype.keys",function(a){return a?a:function(){return Ka(this,function(b){return b})}});
u("Array.prototype.values",function(a){return a?a:function(){return Ka(this,function(b,c){return c})}});
u("Object.is",function(a){return a?a:function(b,c){return b===c?0!==b||1/b===1/c:b!==b&&c!==c}});
u("Array.prototype.includes",function(a){return a?a:function(b,c){var d=this;d instanceof String&&(d=String(d));var e=d.length,f=c||0;for(0>f&&(f=Math.max(f+e,0));f<e;f++){var g=d[f];if(g===b||Object.is(g,b))return!0}return!1}});
u("String.prototype.includes",function(a){return a?a:function(b,c){return-1!==Ja(this,b,"includes").indexOf(b,c||0)}});
u("Object.entries",function(a){return a?a:function(b){var c=[],d;for(d in b)y(b,d)&&c.push([d,b[d]]);return c}});
u("Array.prototype.entries",function(a){return a?a:function(){return Ka(this,function(b,c){return[b,c]})}});
u("WeakMap",function(a){function b(k){this.f=(h+=Math.random()+1).toString();if(k){k=x(k);for(var l;!(l=k.next()).done;)l=l.value,this.set(l[0],l[1])}}
function c(){}
function d(k){var l=typeof k;return"object"===l&&null!==k||"function"===l}
function e(k){if(!y(k,g)){var l=new c;ba(k,g,{value:l})}}
function f(k){var l=Object[k];l&&(Object[k]=function(m){if(m instanceof c)return m;Object.isExtensible(m)&&e(m);return l(m)})}
if(function(){if(!a||!Object.seal)return!1;try{var k=Object.seal({}),l=Object.seal({}),m=new a([[k,2],[l,3]]);if(2!=m.get(k)||3!=m.get(l))return!1;m["delete"](k);m.set(l,4);return!m.has(k)&&4==m.get(l)}catch(n){return!1}}())return a;
var g="$jscomp_hidden_"+Math.random();f("freeze");f("preventExtensions");f("seal");var h=0;b.prototype.set=function(k,l){if(!d(k))throw Error("Invalid WeakMap key");e(k);if(!y(k,g))throw Error("WeakMap key fail: "+k);k[g][this.f]=l;return this};
b.prototype.get=function(k){return d(k)&&y(k,g)?k[g][this.f]:void 0};
b.prototype.has=function(k){return d(k)&&y(k,g)&&y(k[g],this.f)};
b.prototype["delete"]=function(k){return d(k)&&y(k,g)&&y(k[g],this.f)?delete k[g][this.f]:!1};
return b});
u("Map",function(a){function b(){var h={};return h.previous=h.next=h.head=h}
function c(h,k){var l=h.f;return da(function(){if(l){for(;l.head!=h.f;)l=l.previous;for(;l.next!=l.head;)return l=l.next,{done:!1,value:k(l)};l=null}return{done:!0,value:void 0}})}
function d(h,k){var l=k&&typeof k;"object"==l||"function"==l?f.has(k)?l=f.get(k):(l=""+ ++g,f.set(k,l)):l="p_"+k;var m=h.g[l];if(m&&y(h.g,l))for(var n=0;n<m.length;n++){var r=m[n];if(k!==k&&r.key!==r.key||k===r.key)return{id:l,list:m,index:n,s:r}}return{id:l,list:m,index:-1,s:void 0}}
function e(h){this.g={};this.f=b();this.size=0;if(h){h=x(h);for(var k;!(k=h.next()).done;)k=k.value,this.set(k[0],k[1])}}
if(function(){if(!a||"function"!=typeof a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var h=Object.seal({x:4}),k=new a(x([[h,"s"]]));if("s"!=k.get(h)||1!=k.size||k.get({x:4})||k.set({x:4},"t")!=k||2!=k.size)return!1;var l=k.entries(),m=l.next();if(m.done||m.value[0]!=h||"s"!=m.value[1])return!1;m=l.next();return m.done||4!=m.value[0].x||"t"!=m.value[1]||!l.next().done?!1:!0}catch(n){return!1}}())return a;
var f=new WeakMap;e.prototype.set=function(h,k){h=0===h?0:h;var l=d(this,h);l.list||(l.list=this.g[l.id]=[]);l.s?l.s.value=k:(l.s={next:this.f,previous:this.f.previous,head:this.f,key:h,value:k},l.list.push(l.s),this.f.previous.next=l.s,this.f.previous=l.s,this.size++);return this};
e.prototype["delete"]=function(h){h=d(this,h);return h.s&&h.list?(h.list.splice(h.index,1),h.list.length||delete this.g[h.id],h.s.previous.next=h.s.next,h.s.next.previous=h.s.previous,h.s.head=null,this.size--,!0):!1};
e.prototype.clear=function(){this.g={};this.f=this.f.previous=b();this.size=0};
e.prototype.has=function(h){return!!d(this,h).s};
e.prototype.get=function(h){return(h=d(this,h).s)&&h.value};
e.prototype.entries=function(){return c(this,function(h){return[h.key,h.value]})};
e.prototype.keys=function(){return c(this,function(h){return h.key})};
e.prototype.values=function(){return c(this,function(h){return h.value})};
e.prototype.forEach=function(h,k){for(var l=this.entries(),m;!(m=l.next()).done;)m=m.value,h.call(k,m[1],m[0],this)};
e.prototype[Symbol.iterator]=e.prototype.entries;var g=0;return e});
u("Set",function(a){function b(c){this.f=new Map;if(c){c=x(c);for(var d;!(d=c.next()).done;)this.add(d.value)}this.size=this.f.size}
if(function(){if(!a||"function"!=typeof a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var c=Object.seal({x:4}),d=new a(x([c]));if(!d.has(c)||1!=d.size||d.add(c)!=d||1!=d.size||d.add({x:4})!=d||2!=d.size)return!1;var e=d.entries(),f=e.next();if(f.done||f.value[0]!=c||f.value[1]!=c)return!1;f=e.next();return f.done||f.value[0]==c||4!=f.value[0].x||f.value[1]!=f.value[0]?!1:e.next().done}catch(g){return!1}}())return a;
b.prototype.add=function(c){c=0===c?0:c;this.f.set(c,c);this.size=this.f.size;return this};
b.prototype["delete"]=function(c){c=this.f["delete"](c);this.size=this.f.size;return c};
b.prototype.clear=function(){this.f.clear();this.size=0};
b.prototype.has=function(c){return this.f.has(c)};
b.prototype.entries=function(){return this.f.entries()};
b.prototype.values=function(){return this.f.values()};
b.prototype.keys=b.prototype.values;b.prototype[Symbol.iterator]=b.prototype.values;b.prototype.forEach=function(c,d){var e=this;this.f.forEach(function(f){return c.call(d,f,f,e)})};
return b});
var z=this||self;function A(a,b){for(var c=a.split("."),d=b||z,e=0;e<c.length;e++)if(d=d[c[e]],null==d)return null;return d}
function Oa(){}
function Pa(a){var b=typeof a;b="object"!=b?b:a?Array.isArray(a)?"array":b:"null";return"array"==b||"object"==b&&"number"==typeof a.length}
function B(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}
function Qa(a){return Object.prototype.hasOwnProperty.call(a,Ra)&&a[Ra]||(a[Ra]=++Sa)}
var Ra="closure_uid_"+(1E9*Math.random()>>>0),Sa=0;function Ua(a,b,c){return a.call.apply(a.bind,arguments)}
function Va(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var e=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(e,d);return a.apply(b,e)}}return function(){return a.apply(b,arguments)}}
function Wa(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?Wa=Ua:Wa=Va;return Wa.apply(null,arguments)}
function Xa(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var d=c.slice();d.push.apply(d,arguments);return a.apply(this,d)}}
function C(a,b){var c=a.split("."),d=z;c[0]in d||"undefined"==typeof d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d[e]&&d[e]!==Object.prototype[e]?d=d[e]:d=d[e]={}:d[e]=b}
function D(a,b){function c(){}
c.prototype=b.prototype;a.A=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Ja=function(d,e,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[e].apply(d,g)}}
function Ya(a){return a}
;function Za(a,b){var c=void 0;return new (c||(c=Promise))(function(d,e){function f(k){try{h(b.next(k))}catch(l){e(l)}}
function g(k){try{h(b["throw"](k))}catch(l){e(l)}}
function h(k){k.done?d(k.value):(new c(function(l){l(k.value)})).then(f,g)}
h((b=b.apply(a,void 0)).next())})}
;function $a(a){if(Error.captureStackTrace)Error.captureStackTrace(this,$a);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}
D($a,Error);$a.prototype.name="CustomError";var ab=Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b,void 0)}:function(a,b){if("string"===typeof a)return"string"!==typeof b||1!=b.length?-1:a.indexOf(b,0);
for(var c=0;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},F=Array.prototype.forEach?function(a,b,c){Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},bb=Array.prototype.reduce?function(a,b,c){return Array.prototype.reduce.call(a,b,c)}:function(a,b,c){var d=c;
F(a,function(e,f){d=b.call(void 0,d,e,f,a)});
return d};
function cb(a,b){a:{var c=a.length;for(var d="string"===typeof a?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){c=e;break a}c=-1}return 0>c?null:"string"===typeof a?a.charAt(c):a[c]}
function db(a,b){var c=ab(a,b),d;(d=0<=c)&&Array.prototype.splice.call(a,c,1);return d}
function eb(a){return Array.prototype.concat.apply([],arguments)}
function fb(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]}
function gb(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(Pa(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}}
;function mb(a){var b=!1,c;return function(){b||(c=a(),b=!0);return c}}
;function nb(a,b){for(var c in a)b.call(void 0,a[c],c,a)}
function ob(a){var b=pb,c;for(c in b)if(a.call(void 0,b[c],c,b))return c}
function qb(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(var d in b)if(!(d in a))return!1;return!0}
function rb(a){if(!a||"object"!==typeof a)return a;if("function"===typeof a.clone)return a.clone();var b=Array.isArray(a)?[]:"function"!==typeof ArrayBuffer||"function"!==typeof ArrayBuffer.isView||!ArrayBuffer.isView(a)||a instanceof DataView?{}:new a.constructor(a.length),c;for(c in a)b[c]=rb(a[c]);return b}
var sb="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function tb(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<sb.length;f++)c=sb[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}
;var ub;var vb=String.prototype.trim?function(a){return a.trim()}:function(a){return/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]},wb=/&/g,xb=/</g,yb=/>/g,zb=/"/g,Ab=/'/g,Bb=/\x00/g,Cb=/[\x00&<>"']/;
function Db(a,b){return a<b?-1:a>b?1:0}
;var G;a:{var Eb=z.navigator;if(Eb){var Fb=Eb.userAgent;if(Fb){G=Fb;break a}}G=""}function H(a){return-1!=G.indexOf(a)}
;function Gb(){}
;function Hb(a){Hb[" "](a);return a}
Hb[" "]=Oa;var Ib=H("Opera"),Jb=H("Trident")||H("MSIE"),Kb=H("Edge"),Lb=H("Gecko")&&!(-1!=G.toLowerCase().indexOf("webkit")&&!H("Edge"))&&!(H("Trident")||H("MSIE"))&&!H("Edge"),Mb=-1!=G.toLowerCase().indexOf("webkit")&&!H("Edge");function Nb(){var a=z.document;return a?a.documentMode:void 0}
var Ob;a:{var Pb="",Qb=function(){var a=G;if(Lb)return/rv:([^\);]+)(\)|;)/.exec(a);if(Kb)return/Edge\/([\d\.]+)/.exec(a);if(Jb)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Mb)return/WebKit\/(\S+)/.exec(a);if(Ib)return/(?:Version)[ \/]?(\S+)/.exec(a)}();
Qb&&(Pb=Qb?Qb[1]:"");if(Jb){var Rb=Nb();if(null!=Rb&&Rb>parseFloat(Pb)){Ob=String(Rb);break a}}Ob=Pb}var Zb=Ob,$b={},ac;if(z.document&&Jb){var bc=Nb();ac=bc?bc:parseInt(Zb,10)||void 0}else ac=void 0;var cc=ac;var dc=H("iPhone")&&!H("iPod")&&!H("iPad")||H("iPod"),ec=H("iPad");var fc={},gc=null;var I=window;function hc(a){var b=A("window.location.href");null==a&&(a='Unknown Error of type "null/undefined"');if("string"===typeof a)return{message:a,name:"Unknown error",lineNumber:"Not available",fileName:b,stack:"Not available"};var c=!1;try{var d=a.lineNumber||a.line||"Not available"}catch(g){d="Not available",c=!0}try{var e=a.fileName||a.filename||a.sourceURL||z.$googDebugFname||b}catch(g){e="Not available",c=!0}b=ic(a);if(!(!c&&a.lineNumber&&a.fileName&&a.stack&&a.message&&a.name)){c=a.message;if(null==
c){if(a.constructor&&a.constructor instanceof Function){if(a.constructor.name)c=a.constructor.name;else if(c=a.constructor,jc[c])c=jc[c];else{c=String(c);if(!jc[c]){var f=/function\s+([^\(]+)/m.exec(c);jc[c]=f?f[1]:"[Anonymous]"}c=jc[c]}c='Unknown Error of type "'+c+'"'}else c="Unknown Error of unknown type";"function"===typeof a.toString&&Object.prototype.toString!==a.toString&&(c+=": "+a.toString())}return{message:c,name:a.name||"UnknownError",lineNumber:d,fileName:e,stack:b||"Not available"}}a.stack=
b;return a}
function ic(a,b){b||(b={});b[kc(a)]=!0;var c=a.stack||"",d=a.Ka;d&&!b[kc(d)]&&(c+="\nCaused by: ",d.stack&&0==d.stack.indexOf(d.toString())||(c+="string"===typeof d?d:d.message+"\n"),c+=ic(d,b));return c}
function kc(a){var b="";"function"===typeof a.toString&&(b=""+a);return b+a.stack}
var jc={};function lc(a){this.f=a||{cookie:""}}
p=lc.prototype;p.isEnabled=function(){return navigator.cookieEnabled};
p.set=function(a,b,c){var d=!1;if("object"===typeof c){var e=c.Ta;d=c.secure||!1;var f=c.domain||void 0;var g=c.path||void 0;var h=c.Y}if(/[;=\s]/.test(a))throw Error('Invalid cookie name "'+a+'"');if(/[;\r\n]/.test(b))throw Error('Invalid cookie value "'+b+'"');void 0===h&&(h=-1);this.f.cookie=a+"="+b+(f?";domain="+f:"")+(g?";path="+g:"")+(0>h?"":0==h?";expires="+(new Date(1970,1,1)).toUTCString():";expires="+(new Date(Date.now()+1E3*h)).toUTCString())+(d?";secure":"")+(null!=e?";samesite="+e:"")};
p.get=function(a,b){for(var c=a+"=",d=(this.f.cookie||"").split(";"),e=0,f;e<d.length;e++){f=vb(d[e]);if(0==f.lastIndexOf(c,0))return f.substr(c.length);if(f==a)return""}return b};
p.remove=function(a,b,c){var d=void 0!==this.get(a);this.set(a,"",{Y:0,path:b,domain:c});return d};
p.isEmpty=function(){return!this.f.cookie};
p.clear=function(){for(var a=(this.f.cookie||"").split(";"),b=[],c=[],d,e,f=0;f<a.length;f++)e=vb(a[f]),d=e.indexOf("="),-1==d?(b.push(""),c.push(e)):(b.push(e.substring(0,d)),c.push(e.substring(d+1)));for(a=b.length-1;0<=a;a--)this.remove(b[a])};
var mc=new lc("undefined"==typeof document?null:document);function nc(a,b){this.width=a;this.height=b}
p=nc.prototype;p.clone=function(){return new nc(this.width,this.height)};
p.aspectRatio=function(){return this.width/this.height};
p.isEmpty=function(){return!(this.width*this.height)};
p.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};
p.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};
p.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};function oc(a,b){var c,d;var e=document;e=b||e;if(e.querySelectorAll&&e.querySelector&&a)return e.querySelectorAll(a?"."+a:"");if(a&&e.getElementsByClassName){var f=e.getElementsByClassName(a);return f}f=e.getElementsByTagName("*");if(a){var g={};for(c=d=0;e=f[c];c++){var h=e.className,k;if(k="function"==typeof h.split)k=0<=ab(h.split(/\s+/),a);k&&(g[d++]=e)}g.length=d;return g}return f}
function pc(){var a=document;var b="IFRAME";"application/xhtml+xml"===a.contentType&&(b=b.toLowerCase());return a.createElement(b)}
function qc(a,b){for(var c=0;a;){if(b(a))return a;a=a.parentNode;c++}return null}
;var rc=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function sc(a){return a?decodeURI(a):a}
function J(a){return sc(a.match(rc)[3]||null)}
function tc(a){var b=a.match(rc);a=b[1];var c=b[2],d=b[3];b=b[4];var e="";a&&(e+=a+":");d&&(e+="//",c&&(e+=c+"@"),e+=d,b&&(e+=":"+b));return e}
function uc(a,b,c){if(Array.isArray(b))for(var d=0;d<b.length;d++)uc(a,String(b[d]),c);else null!=b&&c.push(a+(""===b?"":"="+encodeURIComponent(String(b))))}
function vc(a){var b=[],c;for(c in a)uc(c,a[c],b);return b.join("&")}
var wc=/#|$/;function xc(a){var b=yc;if(b)for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&a.call(void 0,b[c],c,b)}
function zc(){var a=[];xc(function(b){a.push(b)});
return a}
var yc={wa:"allow-forms",xa:"allow-modals",ya:"allow-orientation-lock",za:"allow-pointer-lock",Aa:"allow-popups",Ba:"allow-popups-to-escape-sandbox",Ca:"allow-presentation",Da:"allow-same-origin",Ea:"allow-scripts",Fa:"allow-top-navigation",Ga:"allow-top-navigation-by-user-activation"},Ac=mb(function(){return zc()});
function Bc(){var a=pc(),b={};F(Ac(),function(c){a.sandbox&&a.sandbox.supports&&a.sandbox.supports(c)&&(b[c]=!0)});
return b}
;function Cc(){this.h=this.h;this.i=this.i}
Cc.prototype.h=!1;Cc.prototype.dispose=function(){this.h||(this.h=!0,this.H())};
Cc.prototype.H=function(){if(this.i)for(;this.i.length;)this.i.shift()()};var Dc={};function Ec(){}
function Fc(a,b){if(b!==Dc)throw Error("Bad secret");this.f=a}
pa(Fc,Ec);Fc.prototype.toString=function(){return this.f};new Fc("about:blank",Dc);new Fc("about:invalid#zTSz",Dc);var Gc=(new Date).getTime();function Hc(a){if(!a)return"";a=a.split("#")[0].split("?")[0];a=a.toLowerCase();0==a.indexOf("//")&&(a=window.location.protocol+a);/^[\w\-]*:\/\//.test(a)||(a=window.location.href);var b=a.substring(a.indexOf("://")+3),c=b.indexOf("/");-1!=c&&(b=b.substring(0,c));a=a.substring(0,a.indexOf("://"));if("http"!==a&&"https"!==a&&"chrome-extension"!==a&&"moz-extension"!==a&&"file"!==a&&"android-app"!==a&&"chrome-search"!==a&&"chrome-untrusted"!==a&&"chrome"!==a&&"app"!==a&&"devtools"!==a)throw Error("Invalid URI scheme in origin: "+
a);c="";var d=b.indexOf(":");if(-1!=d){var e=b.substring(d+1);b=b.substring(0,d);if("http"===a&&"80"!==e||"https"===a&&"443"!==e)c=":"+e}return a+"://"+b+c}
;function Ic(){function a(){e[0]=1732584193;e[1]=4023233417;e[2]=2562383102;e[3]=271733878;e[4]=3285377520;m=l=0}
function b(n){for(var r=g,q=0;64>q;q+=4)r[q/4]=n[q]<<24|n[q+1]<<16|n[q+2]<<8|n[q+3];for(q=16;80>q;q++)n=r[q-3]^r[q-8]^r[q-14]^r[q-16],r[q]=(n<<1|n>>>31)&4294967295;n=e[0];var v=e[1],w=e[2],E=e[3],Ta=e[4];for(q=0;80>q;q++){if(40>q)if(20>q){var ea=E^v&(w^E);var Da=1518500249}else ea=v^w^E,Da=1859775393;else 60>q?(ea=v&w|E&(v|w),Da=2400959708):(ea=v^w^E,Da=3395469782);ea=((n<<5|n>>>27)&4294967295)+ea+Ta+Da+r[q]&4294967295;Ta=E;E=w;w=(v<<30|v>>>2)&4294967295;v=n;n=ea}e[0]=e[0]+n&4294967295;e[1]=e[1]+
v&4294967295;e[2]=e[2]+w&4294967295;e[3]=e[3]+E&4294967295;e[4]=e[4]+Ta&4294967295}
function c(n,r){if("string"===typeof n){n=unescape(encodeURIComponent(n));for(var q=[],v=0,w=n.length;v<w;++v)q.push(n.charCodeAt(v));n=q}r||(r=n.length);q=0;if(0==l)for(;q+64<r;)b(n.slice(q,q+64)),q+=64,m+=64;for(;q<r;)if(f[l++]=n[q++],m++,64==l)for(l=0,b(f);q+64<r;)b(n.slice(q,q+64)),q+=64,m+=64}
function d(){var n=[],r=8*m;56>l?c(h,56-l):c(h,64-(l-56));for(var q=63;56<=q;q--)f[q]=r&255,r>>>=8;b(f);for(q=r=0;5>q;q++)for(var v=24;0<=v;v-=8)n[r++]=e[q]>>v&255;return n}
for(var e=[],f=[],g=[],h=[128],k=1;64>k;++k)h[k]=0;var l,m;a();return{reset:a,update:c,digest:d,ka:function(){for(var n=d(),r="",q=0;q<n.length;q++)r+="0123456789ABCDEF".charAt(Math.floor(n[q]/16))+"0123456789ABCDEF".charAt(n[q]%16);return r}}}
;function Jc(a,b,c){var d=[],e=[];if(1==(Array.isArray(c)?2:1))return e=[b,a],F(d,function(h){e.push(h)}),Kc(e.join(" "));
var f=[],g=[];F(c,function(h){g.push(h.key);f.push(h.value)});
c=Math.floor((new Date).getTime()/1E3);e=0==f.length?[c,b,a]:[f.join(":"),c,b,a];F(d,function(h){e.push(h)});
a=Kc(e.join(" "));a=[c,a];0==g.length||a.push(g.join(""));return a.join("_")}
function Kc(a){var b=Ic();b.update(a);return b.ka().toLowerCase()}
;function Lc(a){var b=Hc(String(z.location.href)),c;(c=z.__SAPISID||z.__APISID||z.__OVERRIDE_SID)?c=!0:(c=new lc(document),c=c.get("SAPISID")||c.get("APISID")||c.get("__Secure-3PAPISID")||c.get("SID"),c=!!c);if(c&&(c=(b=0==b.indexOf("https:")||0==b.indexOf("chrome-extension:")||0==b.indexOf("moz-extension:"))?z.__SAPISID:z.__APISID,c||(c=new lc(document),c=c.get(b?"SAPISID":"APISID")||c.get("__Secure-3PAPISID")),c)){b=b?"SAPISIDHASH":"APISIDHASH";var d=String(z.location.href);return d&&c&&b?[b,Jc(Hc(d),
c,a||null)].join(" "):null}return null}
;function Mc(){this.g=[];this.f=-1}
Mc.prototype.set=function(a,b){b=void 0===b?!0:b;0<=a&&52>a&&0===a%1&&this.g[a]!=b&&(this.g[a]=b,this.f=-1)};
Mc.prototype.get=function(a){return!!this.g[a]};
function Nc(a){-1==a.f&&(a.f=bb(a.g,function(b,c,d){return c?b+Math.pow(2,d):b},0));
return a.f}
;function Oc(a,b){this.h=a;this.i=b;this.g=0;this.f=null}
Oc.prototype.get=function(){if(0<this.g){this.g--;var a=this.f;this.f=a.next;a.next=null}else a=this.h();return a};
function Pc(a,b){a.i(b);100>a.g&&(a.g++,b.next=a.f,a.f=b)}
;function Qc(a){z.setTimeout(function(){throw a;},0)}
var Rc;function Sc(){var a=z.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!H("Presto")&&(a=function(){var e=pc();e.style.display="none";document.documentElement.appendChild(e);var f=e.contentWindow;e=f.document;e.open();e.close();var g="callImmediate"+Math.random(),h="file:"==f.location.protocol?"*":f.location.protocol+"//"+f.location.host;e=Wa(function(k){if(("*"==h||k.origin==h)&&k.data==g)this.port1.onmessage()},this);
f.addEventListener("message",e,!1);this.port1={};this.port2={postMessage:function(){f.postMessage(g,h)}}});
if("undefined"!==typeof a&&!H("Trident")&&!H("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var e=c.W;c.W=null;e()}};
return function(e){d.next={W:e};d=d.next;b.port2.postMessage(0)}}return function(e){z.setTimeout(e,0)}}
;function Tc(){this.g=this.f=null}
var Vc=new Oc(function(){return new Uc},function(a){a.reset()});
Tc.prototype.add=function(a,b){var c=Vc.get();c.set(a,b);this.g?this.g.next=c:this.f=c;this.g=c};
Tc.prototype.remove=function(){var a=null;this.f&&(a=this.f,this.f=this.f.next,this.f||(this.g=null),a.next=null);return a};
function Uc(){this.next=this.scope=this.f=null}
Uc.prototype.set=function(a,b){this.f=a;this.scope=b;this.next=null};
Uc.prototype.reset=function(){this.next=this.scope=this.f=null};function Wc(a,b){Xc||Yc();Zc||(Xc(),Zc=!0);$c.add(a,b)}
var Xc;function Yc(){if(z.Promise&&z.Promise.resolve){var a=z.Promise.resolve(void 0);Xc=function(){a.then(ud)}}else Xc=function(){var b=ud;
"function"!==typeof z.setImmediate||z.Window&&z.Window.prototype&&!H("Edge")&&z.Window.prototype.setImmediate==z.setImmediate?(Rc||(Rc=Sc()),Rc(b)):z.setImmediate(b)}}
var Zc=!1,$c=new Tc;function ud(){for(var a;a=$c.remove();){try{a.f.call(a.scope)}catch(b){Qc(b)}Pc(Vc,a)}Zc=!1}
;function vd(){this.g=-1}
;function wd(){this.g=64;this.f=[];this.l=[];this.m=[];this.i=[];this.i[0]=128;for(var a=1;a<this.g;++a)this.i[a]=0;this.j=this.h=0;this.reset()}
D(wd,vd);wd.prototype.reset=function(){this.f[0]=1732584193;this.f[1]=4023233417;this.f[2]=2562383102;this.f[3]=271733878;this.f[4]=3285377520;this.j=this.h=0};
function xd(a,b,c){c||(c=0);var d=a.m;if("string"===typeof b)for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.f[0];c=a.f[1];var g=a.f[2],h=a.f[3],k=a.f[4];for(e=0;80>e;e++){if(40>e)if(20>e){f=h^c&(g^h);var l=1518500249}else f=c^g^h,l=1859775393;else 60>e?(f=c&g|h&(c|g),l=2400959708):
(f=c^g^h,l=3395469782);f=(b<<5|b>>>27)+f+k+l+d[e]&4294967295;k=h;h=g;g=(c<<30|c>>>2)&4294967295;c=b;b=f}a.f[0]=a.f[0]+b&4294967295;a.f[1]=a.f[1]+c&4294967295;a.f[2]=a.f[2]+g&4294967295;a.f[3]=a.f[3]+h&4294967295;a.f[4]=a.f[4]+k&4294967295}
wd.prototype.update=function(a,b){if(null!=a){void 0===b&&(b=a.length);for(var c=b-this.g,d=0,e=this.l,f=this.h;d<b;){if(0==f)for(;d<=c;)xd(this,a,d),d+=this.g;if("string"===typeof a)for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.g){xd(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.g){xd(this,e);f=0;break}}this.h=f;this.j+=b}};
wd.prototype.digest=function(){var a=[],b=8*this.j;56>this.h?this.update(this.i,56-this.h):this.update(this.i,this.g-(this.h-56));for(var c=this.g-1;56<=c;c--)this.l[c]=b&255,b/=256;xd(this,this.l);for(c=b=0;5>c;c++)for(var d=24;0<=d;d-=8)a[b]=this.f[c]>>d&255,++b;return a};var yd="StopIteration"in z?z.StopIteration:{message:"StopIteration",stack:""};function zd(){}
zd.prototype.next=function(){throw yd;};
zd.prototype.B=function(){return this};
function Ad(a){if(a instanceof zd)return a;if("function"==typeof a.B)return a.B(!1);if(Pa(a)){var b=0,c=new zd;c.next=function(){for(;;){if(b>=a.length)throw yd;if(b in a)return a[b++];b++}};
return c}throw Error("Not implemented");}
function Bd(a,b){if(Pa(a))try{F(a,b,void 0)}catch(c){if(c!==yd)throw c;}else{a=Ad(a);try{for(;;)b.call(void 0,a.next(),void 0,a)}catch(c){if(c!==yd)throw c;}}}
function Cd(a){if(Pa(a))return fb(a);a=Ad(a);var b=[];Bd(a,function(c){b.push(c)});
return b}
;function Dd(a,b){this.h={};this.f=[];this.i=this.g=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a)if(a instanceof Dd)for(c=Ed(a),d=0;d<c.length;d++)this.set(c[d],a.get(c[d]));else for(d in a)this.set(d,a[d])}
function Ed(a){Fd(a);return a.f.concat()}
p=Dd.prototype;p.equals=function(a,b){if(this===a)return!0;if(this.g!=a.g)return!1;var c=b||Gd;Fd(this);for(var d,e=0;d=this.f[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};
function Gd(a,b){return a===b}
p.isEmpty=function(){return 0==this.g};
p.clear=function(){this.h={};this.i=this.g=this.f.length=0};
p.remove=function(a){return Object.prototype.hasOwnProperty.call(this.h,a)?(delete this.h[a],this.g--,this.i++,this.f.length>2*this.g&&Fd(this),!0):!1};
function Fd(a){if(a.g!=a.f.length){for(var b=0,c=0;b<a.f.length;){var d=a.f[b];Object.prototype.hasOwnProperty.call(a.h,d)&&(a.f[c++]=d);b++}a.f.length=c}if(a.g!=a.f.length){var e={};for(c=b=0;b<a.f.length;)d=a.f[b],Object.prototype.hasOwnProperty.call(e,d)||(a.f[c++]=d,e[d]=1),b++;a.f.length=c}}
p.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.h,a)?this.h[a]:b};
p.set=function(a,b){Object.prototype.hasOwnProperty.call(this.h,a)||(this.g++,this.f.push(a),this.i++);this.h[a]=b};
p.forEach=function(a,b){for(var c=Ed(this),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};
p.clone=function(){return new Dd(this)};
p.B=function(a){Fd(this);var b=0,c=this.i,d=this,e=new zd;e.next=function(){if(c!=d.i)throw Error("The map has changed since the iterator was created");if(b>=d.f.length)throw yd;var f=d.f[b++];return a?f:d.h[f]};
return e};var Hd=!Jb||9<=Number(cc),Id;
if(Id=Jb){var Jd;if(Object.prototype.hasOwnProperty.call($b,"9"))Jd=$b["9"];else{for(var Kd=0,Ld=vb(String(Zb)).split("."),Md=vb("9").split("."),Nd=Math.max(Ld.length,Md.length),Od=0;0==Kd&&Od<Nd;Od++){var Pd=Ld[Od]||"",Qd=Md[Od]||"";do{var Rd=/(\d*)(\D*)(.*)/.exec(Pd)||["","","",""],Sd=/(\d*)(\D*)(.*)/.exec(Qd)||["","","",""];if(0==Rd[0].length&&0==Sd[0].length)break;Kd=Db(0==Rd[1].length?0:parseInt(Rd[1],10),0==Sd[1].length?0:parseInt(Sd[1],10))||Db(0==Rd[2].length,0==Sd[2].length)||Db(Rd[2],Sd[2]);
Pd=Rd[3];Qd=Sd[3]}while(0==Kd)}Jd=$b["9"]=0<=Kd}Id=!Jd}var Td=Id,Ud=function(){if(!z.addEventListener||!Object.defineProperty)return!1;var a=!1,b=Object.defineProperty({},"passive",{get:function(){a=!0}});
try{z.addEventListener("test",Oa,b),z.removeEventListener("test",Oa,b)}catch(c){}return a}();function Vd(a,b){this.type=a;this.f=this.target=b;this.defaultPrevented=this.g=!1}
Vd.prototype.stopPropagation=function(){this.g=!0};
Vd.prototype.preventDefault=function(){this.defaultPrevented=!0};function Wd(a,b){Vd.call(this,a?a.type:"");this.relatedTarget=this.f=this.target=null;this.button=this.screenY=this.screenX=this.clientY=this.clientX=0;this.key="";this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.state=null;this.pointerId=0;this.pointerType="";this.h=null;a&&this.init(a,b)}
D(Wd,Vd);var Xd={2:"touch",3:"pen",4:"mouse"};
Wd.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.f=b;var e=a.relatedTarget;if(e){if(Lb){a:{try{Hb(e.nodeName);var f=!0;break a}catch(g){}f=!1}f||(e=null)}}else"mouseover"==c?e=a.fromElement:"mouseout"==c&&(e=a.toElement);this.relatedTarget=e;d?(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||
0):(this.clientX=void 0!==a.clientX?a.clientX:a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.key=a.key||"";this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.pointerId=a.pointerId||0;this.pointerType="string"===typeof a.pointerType?a.pointerType:Xd[a.pointerType]||"";this.state=a.state;
this.h=a;a.defaultPrevented&&this.preventDefault()};
Wd.prototype.stopPropagation=function(){Wd.A.stopPropagation.call(this);this.h.stopPropagation?this.h.stopPropagation():this.h.cancelBubble=!0};
Wd.prototype.preventDefault=function(){Wd.A.preventDefault.call(this);var a=this.h;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Td)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Yd="closure_listenable_"+(1E6*Math.random()|0),Zd=0;function $d(a,b,c,d,e){this.listener=a;this.f=null;this.src=b;this.type=c;this.capture=!!d;this.K=e;this.key=++Zd;this.F=this.I=!1}
function ae(a){a.F=!0;a.listener=null;a.f=null;a.src=null;a.K=null}
;function be(a){this.src=a;this.listeners={};this.f=0}
be.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.listeners[f];a||(a=this.listeners[f]=[],this.f++);var g=ce(a,b,d,e);-1<g?(b=a[g],c||(b.I=!1)):(b=new $d(b,this.src,f,!!d,e),b.I=c,a.push(b));return b};
be.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.listeners))return!1;var e=this.listeners[a];b=ce(e,b,c,d);return-1<b?(ae(e[b]),Array.prototype.splice.call(e,b,1),0==e.length&&(delete this.listeners[a],this.f--),!0):!1};
function de(a,b){var c=b.type;c in a.listeners&&db(a.listeners[c],b)&&(ae(b),0==a.listeners[c].length&&(delete a.listeners[c],a.f--))}
function ce(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.F&&f.listener==b&&f.capture==!!c&&f.K==d)return e}return-1}
;var ee="closure_lm_"+(1E6*Math.random()|0),fe={},ge=0;function he(a,b,c,d,e){if(d&&d.once)ie(a,b,c,d,e);else if(Array.isArray(b))for(var f=0;f<b.length;f++)he(a,b[f],c,d,e);else c=je(c),a&&a[Yd]?a.f.add(String(b),c,!1,B(d)?!!d.capture:!!d,e):ke(a,b,c,!1,d,e)}
function ke(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=B(e)?!!e.capture:!!e,h=le(a);h||(a[ee]=h=new be(a));c=h.add(b,c,d,g,f);if(!c.f){d=me();c.f=d;d.src=a;d.listener=c;if(a.addEventListener)Ud||(e=g),void 0===e&&(e=!1),a.addEventListener(b.toString(),d,e);else if(a.attachEvent)a.attachEvent(ne(b.toString()),d);else if(a.addListener&&a.removeListener)a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");ge++}}
function me(){var a=oe,b=Hd?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);
if(!c)return c};
return b}
function ie(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)ie(a,b[f],c,d,e);else c=je(c),a&&a[Yd]?a.f.add(String(b),c,!0,B(d)?!!d.capture:!!d,e):ke(a,b,c,!0,d,e)}
function pe(a,b,c,d,e){if(Array.isArray(b))for(var f=0;f<b.length;f++)pe(a,b[f],c,d,e);else(d=B(d)?!!d.capture:!!d,c=je(c),a&&a[Yd])?a.f.remove(String(b),c,d,e):a&&(a=le(a))&&(b=a.listeners[b.toString()],a=-1,b&&(a=ce(b,c,d,e)),(c=-1<a?b[a]:null)&&qe(c))}
function qe(a){if("number"!==typeof a&&a&&!a.F){var b=a.src;if(b&&b[Yd])de(b.f,a);else{var c=a.type,d=a.f;b.removeEventListener?b.removeEventListener(c,d,a.capture):b.detachEvent?b.detachEvent(ne(c),d):b.addListener&&b.removeListener&&b.removeListener(d);ge--;(c=le(b))?(de(c,a),0==c.f&&(c.src=null,b[ee]=null)):ae(a)}}}
function ne(a){return a in fe?fe[a]:fe[a]="on"+a}
function re(a,b,c,d){var e=!0;if(a=le(a))if(b=a.listeners[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.capture==c&&!f.F&&(f=se(f,d),e=e&&!1!==f)}return e}
function se(a,b){var c=a.listener,d=a.K||a.src;a.I&&qe(a);return c.call(d,b)}
function oe(a,b){if(a.F)return!0;if(!Hd){var c=b||A("window.event"),d=new Wd(c,this),e=!0;if(!(0>c.keyCode||void 0!=c.returnValue)){a:{var f=!1;if(0==c.keyCode)try{c.keyCode=-1;break a}catch(k){f=!0}if(f||void 0==c.returnValue)c.returnValue=!0}c=[];for(f=d.f;f;f=f.parentNode)c.push(f);f=a.type;for(var g=c.length-1;!d.g&&0<=g;g--){d.f=c[g];var h=re(c[g],f,!0,d);e=e&&h}for(g=0;!d.g&&g<c.length;g++)d.f=c[g],h=re(c[g],f,!1,d),e=e&&h}return e}return se(a,new Wd(b,this))}
function le(a){a=a[ee];return a instanceof be?a:null}
var te="__closure_events_fn_"+(1E9*Math.random()>>>0);function je(a){if("function"===typeof a)return a;a[te]||(a[te]=function(b){return a.handleEvent(b)});
return a[te]}
;function K(){Cc.call(this);this.f=new be(this);this.l=this;this.j=null}
D(K,Cc);K.prototype[Yd]=!0;K.prototype.addEventListener=function(a,b,c,d){he(this,a,b,c,d)};
K.prototype.removeEventListener=function(a,b,c,d){pe(this,a,b,c,d)};
K.prototype.dispatchEvent=function(a){var b=this.j;if(b){var c=[];for(var d=1;b;b=b.j)c.push(b),++d}b=this.l;d=a.type||a;if("string"===typeof a)a=new Vd(a,b);else if(a instanceof Vd)a.target=a.target||b;else{var e=a;a=new Vd(d,b);tb(a,e)}e=!0;if(c)for(var f=c.length-1;!a.g&&0<=f;f--){var g=a.f=c[f];e=ue(g,d,!0,a)&&e}a.g||(g=a.f=b,e=ue(g,d,!0,a)&&e,a.g||(e=ue(g,d,!1,a)&&e));if(c)for(f=0;!a.g&&f<c.length;f++)g=a.f=c[f],e=ue(g,d,!1,a)&&e;return e};
K.prototype.H=function(){K.A.H.call(this);if(this.f){var a=this.f,b=0,c;for(c in a.listeners){for(var d=a.listeners[c],e=0;e<d.length;e++)++b,ae(d[e]);delete a.listeners[c];a.f--}}this.j=null};
function ue(a,b,c,d){b=a.f.listeners[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.F&&g.capture==c){var h=g.listener,k=g.K||g.src;g.I&&de(a.f,g);e=!1!==h.call(k,d)&&e}}return e&&!d.defaultPrevented}
;var ve=z.JSON.stringify;function M(a){this.f=0;this.m=void 0;this.i=this.g=this.h=null;this.j=this.l=!1;if(a!=Oa)try{var b=this;a.call(void 0,function(c){we(b,2,c)},function(c){we(b,3,c)})}catch(c){we(this,3,c)}}
function xe(){this.next=this.context=this.onRejected=this.g=this.f=null;this.h=!1}
xe.prototype.reset=function(){this.context=this.onRejected=this.g=this.f=null;this.h=!1};
var ye=new Oc(function(){return new xe},function(a){a.reset()});
function ze(a,b,c){var d=ye.get();d.g=a;d.onRejected=b;d.context=c;return d}
function Ae(a){if(a instanceof M)return a;var b=new M(Oa);we(b,2,a);return b}
function Be(a,b,c){Ce(a,b,c,null)||Wc(Xa(b,a))}
function De(a){return new M(function(b,c){var d=a.length,e=[];if(d)for(var f=function(l,m){d--;e[l]=m;0==d&&b(e)},g=function(l){c(l)},h=0,k;h<a.length;h++)k=a[h],Be(k,Xa(f,h),g);
else b(e)})}
M.prototype.then=function(a,b,c){return Ee(this,"function"===typeof a?a:null,"function"===typeof b?b:null,c)};
M.prototype.$goog_Thenable=!0;function Fe(a){var b=void 0===b?{}:b;b=Ge(b);return Ee(b,null,a,void 0)}
M.prototype.cancel=function(a){if(0==this.f){var b=new He(a);Wc(function(){Ie(this,b)},this)}};
function Ie(a,b){if(0==a.f)if(a.h){var c=a.h;if(c.g){for(var d=0,e=null,f=null,g=c.g;g&&(g.h||(d++,g.f==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.f&&1==d?Ie(c,b):(f?(d=f,d.next==c.i&&(c.i=d),d.next=d.next.next):Je(c),Ke(c,e,3,b)))}a.h=null}else we(a,3,b)}
function Le(a,b){a.g||2!=a.f&&3!=a.f||Me(a);a.i?a.i.next=b:a.g=b;a.i=b}
function Ee(a,b,c,d){var e=ze(null,null,null);e.f=new M(function(f,g){e.g=b?function(h){try{var k=b.call(d,h);f(k)}catch(l){g(l)}}:f;
e.onRejected=c?function(h){try{var k=c.call(d,h);void 0===k&&h instanceof He?g(h):f(k)}catch(l){g(l)}}:g});
e.f.h=a;Le(a,e);return e.f}
M.prototype.v=function(a){this.f=0;we(this,2,a)};
M.prototype.G=function(a){this.f=0;we(this,3,a)};
function we(a,b,c){0==a.f&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.f=1,Ce(c,a.v,a.G,a)||(a.m=c,a.f=b,a.h=null,Me(a),3!=b||c instanceof He||Ne(a,c)))}
function Ce(a,b,c,d){if(a instanceof M)return Le(a,ze(b||Oa,c||null,d)),!0;if(a)try{var e=!!a.$goog_Thenable}catch(g){e=!1}else e=!1;if(e)return a.then(b,c,d),!0;if(B(a))try{var f=a.then;if("function"===typeof f)return Oe(a,f,b,c,d),!0}catch(g){return c.call(d,g),!0}return!1}
function Oe(a,b,c,d,e){function f(k){h||(h=!0,d.call(e,k))}
function g(k){h||(h=!0,c.call(e,k))}
var h=!1;try{b.call(a,g,f)}catch(k){f(k)}}
function Me(a){a.l||(a.l=!0,Wc(a.o,a))}
function Je(a){var b=null;a.g&&(b=a.g,a.g=b.next,b.next=null);a.g||(a.i=null);return b}
M.prototype.o=function(){for(var a;a=Je(this);)Ke(this,a,this.f,this.m);this.l=!1};
function Ke(a,b,c,d){if(3==c&&b.onRejected&&!b.h)for(;a&&a.j;a=a.h)a.j=!1;if(b.f)b.f.h=null,Pe(b,c,d);else try{b.h?b.g.call(b.context):Pe(b,c,d)}catch(e){Qe.call(null,e)}Pc(ye,b)}
function Pe(a,b,c){2==b?a.g.call(a.context,c):a.onRejected&&a.onRejected.call(a.context,c)}
function Ne(a,b){a.j=!0;Wc(function(){a.j&&Qe.call(null,b)})}
var Qe=Qc;function He(a){$a.call(this,a)}
D(He,$a);He.prototype.name="cancel";function O(a){Cc.call(this);this.m=1;this.j=[];this.l=0;this.f=[];this.g={};this.o=!!a}
D(O,Cc);p=O.prototype;p.subscribe=function(a,b,c){var d=this.g[a];d||(d=this.g[a]=[]);var e=this.m;this.f[e]=a;this.f[e+1]=b;this.f[e+2]=c;this.m=e+3;d.push(e);return e};
function Re(a,b,c){var d=Se;if(a=d.g[a]){var e=d.f;(a=cb(a,function(f){return e[f+1]==b&&e[f+2]==c}))&&d.O(a)}}
p.O=function(a){var b=this.f[a];if(b){var c=this.g[b];0!=this.l?(this.j.push(a),this.f[a+1]=Oa):(c&&db(c,a),delete this.f[a],delete this.f[a+1],delete this.f[a+2])}return!!b};
p.M=function(a,b){var c=this.g[a];if(c){for(var d=Array(arguments.length-1),e=1,f=arguments.length;e<f;e++)d[e-1]=arguments[e];if(this.o)for(e=0;e<c.length;e++){var g=c[e];Te(this.f[g+1],this.f[g+2],d)}else{this.l++;try{for(e=0,f=c.length;e<f;e++)g=c[e],this.f[g+1].apply(this.f[g+2],d)}finally{if(this.l--,0<this.j.length&&0==this.l)for(;c=this.j.pop();)this.O(c)}}return 0!=e}return!1};
function Te(a,b,c){Wc(function(){a.apply(b,c)})}
p.clear=function(a){if(a){var b=this.g[a];b&&(F(b,this.O,this),delete this.g[a])}else this.f.length=0,this.g={}};
p.H=function(){O.A.H.call(this);this.clear();this.j.length=0};function Ue(a){this.f=a}
Ue.prototype.set=function(a,b){void 0===b?this.f.remove(a):this.f.set(a,ve(b))};
Ue.prototype.get=function(a){try{var b=this.f.get(a)}catch(c){return}if(null!==b)try{return JSON.parse(b)}catch(c){throw"Storage: Invalid value was encountered";}};
Ue.prototype.remove=function(a){this.f.remove(a)};function Ve(a){this.f=a}
D(Ve,Ue);function We(a){this.data=a}
function Xe(a){return void 0===a||a instanceof We?a:new We(a)}
Ve.prototype.set=function(a,b){Ve.A.set.call(this,a,Xe(b))};
Ve.prototype.g=function(a){a=Ve.A.get.call(this,a);if(void 0===a||a instanceof Object)return a;throw"Storage: Invalid value was encountered";};
Ve.prototype.get=function(a){if(a=this.g(a)){if(a=a.data,void 0===a)throw"Storage: Invalid value was encountered";}else a=void 0;return a};function Ye(a){this.f=a}
D(Ye,Ve);Ye.prototype.set=function(a,b,c){if(b=Xe(b)){if(c){if(c<Date.now()){Ye.prototype.remove.call(this,a);return}b.expiration=c}b.creation=Date.now()}Ye.A.set.call(this,a,b)};
Ye.prototype.g=function(a){var b=Ye.A.g.call(this,a);if(b){var c=b.creation,d=b.expiration;if(d&&d<Date.now()||c&&c>Date.now())Ye.prototype.remove.call(this,a);else return b}};function Ze(){}
;function $e(){}
D($e,Ze);$e.prototype.clear=function(){var a=Cd(this.B(!0)),b=this;F(a,function(c){b.remove(c)})};function af(a){this.f=a}
D(af,$e);p=af.prototype;p.isAvailable=function(){if(!this.f)return!1;try{return this.f.setItem("__sak","1"),this.f.removeItem("__sak"),!0}catch(a){return!1}};
p.set=function(a,b){try{this.f.setItem(a,b)}catch(c){if(0==this.f.length)throw"Storage mechanism: Storage disabled";throw"Storage mechanism: Quota exceeded";}};
p.get=function(a){a=this.f.getItem(a);if("string"!==typeof a&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};
p.remove=function(a){this.f.removeItem(a)};
p.B=function(a){var b=0,c=this.f,d=new zd;d.next=function(){if(b>=c.length)throw yd;var e=c.key(b++);if(a)return e;e=c.getItem(e);if("string"!==typeof e)throw"Storage mechanism: Invalid value was encountered";return e};
return d};
p.clear=function(){this.f.clear()};
p.key=function(a){return this.f.key(a)};function bf(){var a=null;try{a=window.localStorage||null}catch(b){}this.f=a}
D(bf,af);function cf(a,b){this.g=a;this.f=null;if(Jb&&!(9<=Number(cc))){df||(df=new Dd);this.f=df.get(a);this.f||(b?this.f=document.getElementById(b):(this.f=document.createElement("userdata"),this.f.addBehavior("#default#userData"),document.body.appendChild(this.f)),df.set(a,this.f));try{this.f.load(this.g)}catch(c){this.f=null}}}
D(cf,$e);var ef={".":".2E","!":".21","~":".7E","*":".2A","'":".27","(":".28",")":".29","%":"."},df=null;function ff(a){return"_"+encodeURIComponent(a).replace(/[.!~*'()%]/g,function(b){return ef[b]})}
p=cf.prototype;p.isAvailable=function(){return!!this.f};
p.set=function(a,b){this.f.setAttribute(ff(a),b);gf(this)};
p.get=function(a){a=this.f.getAttribute(ff(a));if("string"!==typeof a&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};
p.remove=function(a){this.f.removeAttribute(ff(a));gf(this)};
p.B=function(a){var b=0,c=this.f.XMLDocument.documentElement.attributes,d=new zd;d.next=function(){if(b>=c.length)throw yd;var e=c[b++];if(a)return decodeURIComponent(e.nodeName.replace(/\./g,"%")).substr(1);e=e.nodeValue;if("string"!==typeof e)throw"Storage mechanism: Invalid value was encountered";return e};
return d};
p.clear=function(){for(var a=this.f.XMLDocument.documentElement,b=a.attributes.length;0<b;b--)a.removeAttribute(a.attributes[b-1].nodeName);gf(this)};
function gf(a){try{a.f.save(a.g)}catch(b){throw"Storage mechanism: Quota exceeded";}}
;function hf(a,b){this.g=a;this.f=b+"::"}
D(hf,$e);hf.prototype.set=function(a,b){this.g.set(this.f+a,b)};
hf.prototype.get=function(a){return this.g.get(this.f+a)};
hf.prototype.remove=function(a){this.g.remove(this.f+a)};
hf.prototype.B=function(a){var b=this.g.B(!0),c=this,d=new zd;d.next=function(){for(var e=b.next();e.substr(0,c.f.length)!=c.f;)e=b.next();return a?e.substr(c.f.length):c.g.get(e)};
return d};var jf=window.yt&&window.yt.config_||window.ytcfg&&window.ytcfg.data_||{};C("yt.config_",jf);function kf(a){var b=arguments;1<b.length?jf[b[0]]=b[1]:1===b.length&&Object.assign(jf,b[0])}
function P(a,b){return a in jf?jf[a]:b}
;var lf=[];function mf(a){lf.forEach(function(b){return b(a)})}
function nf(a){return a&&window.yterr?function(){try{return a.apply(this,arguments)}catch(b){of(b),mf(b)}}:a}
function of(a){var b=A("yt.logging.errors.log");b?b(a,"ERROR",void 0,void 0,void 0):(b=P("ERRORS",[]),b.push([a,"ERROR",void 0,void 0,void 0]),kf("ERRORS",b))}
function pf(a){var b=A("yt.logging.errors.log");b?b(a,"WARNING",void 0,void 0,void 0):(b=P("ERRORS",[]),b.push([a,"WARNING",void 0,void 0,void 0]),kf("ERRORS",b))}
;var qf=0;C("ytDomDomGetNextId",A("ytDomDomGetNextId")||function(){return++qf});var rf={stopImmediatePropagation:1,stopPropagation:1,preventMouseEvent:1,preventManipulation:1,preventDefault:1,layerX:1,layerY:1,screenX:1,screenY:1,scale:1,rotation:1,webkitMovementX:1,webkitMovementY:1};
function sf(a){this.type="";this.state=this.source=this.data=this.currentTarget=this.relatedTarget=this.target=null;this.charCode=this.keyCode=0;this.metaKey=this.shiftKey=this.ctrlKey=this.altKey=!1;this.clientY=this.clientX=0;this.changedTouches=this.touches=null;try{if(a=a||window.event){this.event=a;for(var b in a)b in rf||(this[b]=a[b]);var c=a.target||a.srcElement;c&&3==c.nodeType&&(c=c.parentNode);this.target=c;var d=a.relatedTarget;if(d)try{d=d.nodeName?d:null}catch(e){d=null}else"mouseover"==
this.type?d=a.fromElement:"mouseout"==this.type&&(d=a.toElement);this.relatedTarget=d;this.clientX=void 0!=a.clientX?a.clientX:a.pageX;this.clientY=void 0!=a.clientY?a.clientY:a.pageY;this.keyCode=a.keyCode?a.keyCode:a.which;this.charCode=a.charCode||("keypress"==this.type?this.keyCode:0);this.altKey=a.altKey;this.ctrlKey=a.ctrlKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey}}catch(e){}}
sf.prototype.preventDefault=function(){this.event&&(this.event.returnValue=!1,this.event.preventDefault&&this.event.preventDefault())};
sf.prototype.stopPropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopPropagation&&this.event.stopPropagation())};
sf.prototype.stopImmediatePropagation=function(){this.event&&(this.event.cancelBubble=!0,this.event.stopImmediatePropagation&&this.event.stopImmediatePropagation())};var pb=z.ytEventsEventsListeners||{};C("ytEventsEventsListeners",pb);var tf=z.ytEventsEventsCounter||{count:0};C("ytEventsEventsCounter",tf);
function uf(a,b,c,d){d=void 0===d?{}:d;a.addEventListener&&("mouseenter"!=b||"onmouseenter"in document?"mouseleave"!=b||"onmouseenter"in document?"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"):b="mouseout":b="mouseover");return ob(function(e){var f="boolean"===typeof e[4]&&e[4]==!!d,g=B(e[4])&&B(d)&&qb(e[4],d);return!!e.length&&e[0]==a&&e[1]==b&&e[2]==c&&(f||g)})}
function vf(a){a&&("string"==typeof a&&(a=[a]),F(a,function(b){if(b in pb){var c=pb[b],d=c[0],e=c[1],f=c[3];c=c[4];d.removeEventListener?wf()||"boolean"===typeof c?d.removeEventListener(e,f,c):d.removeEventListener(e,f,!!c.capture):d.detachEvent&&d.detachEvent("on"+e,f);delete pb[b]}}))}
var wf=mb(function(){var a=!1;try{var b=Object.defineProperty({},"capture",{get:function(){a=!0}});
window.addEventListener("test",null,b)}catch(c){}return a});
function xf(a,b,c){var d=void 0===d?{}:d;if(a&&(a.addEventListener||a.attachEvent)){var e=uf(a,b,c,d);if(!e){e=++tf.count+"";var f=!("mouseenter"!=b&&"mouseleave"!=b||!a.addEventListener||"onmouseenter"in document);var g=f?function(h){h=new sf(h);if(!qc(h.relatedTarget,function(k){return k==a}))return h.currentTarget=a,h.type=b,c.call(a,h)}:function(h){h=new sf(h);
h.currentTarget=a;return c.call(a,h)};
g=nf(g);a.addEventListener?("mouseenter"==b&&f?b="mouseover":"mouseleave"==b&&f?b="mouseout":"mousewheel"==b&&"MozBoxSizing"in document.documentElement.style&&(b="MozMousePixelScroll"),wf()||"boolean"===typeof d?a.addEventListener(b,g,d):a.addEventListener(b,g,!!d.capture)):a.attachEvent("on"+b,g);pb[e]=[a,b,c,g,d]}}}
;function yf(a,b){"function"===typeof a&&(a=nf(a));return window.setTimeout(a,b)}
function zf(a){"function"===typeof a&&(a=nf(a));return window.setInterval(a,250)}
;function fg(a){var b=[];nb(a,function(c,d){var e=encodeURIComponent(String(d)),f;Array.isArray(c)?f=c:f=[c];F(f,function(g){""==g?b.push(e):b.push(e+"="+encodeURIComponent(String(g)))})});
return b.join("&")}
function gg(a){"?"==a.charAt(0)&&(a=a.substr(1));a=a.split("&");for(var b={},c=0,d=a.length;c<d;c++){var e=a[c].split("=");if(1==e.length&&e[0]||2==e.length)try{var f=decodeURIComponent((e[0]||"").replace(/\+/g," ")),g=decodeURIComponent((e[1]||"").replace(/\+/g," "));f in b?Array.isArray(b[f])?gb(b[f],g):b[f]=[b[f],g]:b[f]=g}catch(k){if("q"!=e[0]){var h=Error("Error decoding URL component");h.params={key:e[0],value:e[1]};of(h)}}}return b}
function hg(a,b,c){var d=a.split("#",2);a=d[0];d=1<d.length?"#"+d[1]:"";var e=a.split("?",2);a=e[0];e=gg(e[1]||"");for(var f in b)!c&&null!==e&&f in e||(e[f]=b[f]);b=a;a=vc(e);a?(c=b.indexOf("#"),0>c&&(c=b.length),f=b.indexOf("?"),0>f||f>c?(f=c,e=""):e=b.substring(f+1,c),b=[b.substr(0,f),e,b.substr(c)],c=b[1],b[1]=a?c?c+"&"+a:a:c,a=b[0]+(b[1]?"?"+b[1]:"")+b[2]):a=b;return a+d}
;var ig={};function jg(a){return ig[a]||(ig[a]=String(a).replace(/\-([a-z])/g,function(b,c){return c.toUpperCase()}))}
;var kg={},lg=[],Se=new O,mg={};function ng(){for(var a=x(lg),b=a.next();!b.done;b=a.next())b=b.value,b()}
function og(a,b){b||(b=document);var c=fb(b.getElementsByTagName("yt:"+a));var d="yt-"+a;var e=b||document;d=e.querySelectorAll&&e.querySelector?e.querySelectorAll("."+d):oc(d,b);d=fb(d);return eb(c,d)}
function Q(a,b){var c;"yt:"==a.tagName.toLowerCase().substr(0,3)?c=a.getAttribute(b):c=a?a.dataset?a.dataset[jg(b)]:a.getAttribute("data-"+b):null;return c}
function pg(a,b){Se.M.apply(Se,arguments)}
;function qg(a){this.g=a||{};this.h=this.f=!1;a=document.getElementById("www-widgetapi-script");if(this.f=!!("https:"==document.location.protocol||a&&0==a.src.indexOf("https:"))){a=[this.g,window.YTConfig||{}];for(var b=0;b<a.length;b++)a[b].host&&(a[b].host=a[b].host.replace("http://","https://"))}}
function R(a,b){for(var c=[a.g,window.YTConfig||{}],d=0;d<c.length;d++){var e=c[d][b];if(void 0!=e)return e}return null}
function rg(a,b,c){sg||(sg={},xf(window,"message",Wa(a.i,a)));sg[c]=b}
qg.prototype.i=function(a){if(a.origin==R(this,"host")||a.origin==R(this,"host").replace(/^http:/,"https:")){try{var b=JSON.parse(a.data)}catch(c){return}this.h=!0;this.f||0!=a.origin.indexOf("https:")||(this.f=!0);if(a=sg[b.id])a.o=!0,a.o&&(F(a.m,a.V,a),a.m.length=0),a.ea(b)}};
var sg=null;function T(a){a=tg(a);return"string"===typeof a&&"false"===a?!1:!!a}
function ug(a,b){var c=tg(a);return void 0===c&&void 0!==b?b:Number(c||0)}
function tg(a){var b=P("EXPERIMENTS_FORCED_FLAGS",{});return void 0!==b[a]?b[a]:P("EXPERIMENT_FLAGS",{})[a]}
;function vg(){}
function wg(a){var b=5E3;isNaN(b)&&(b=void 0);var c=A("yt.scheduler.instance.addJob");c?c(a,0,b):void 0===b?a():yf(a,b||0)}
;function xg(){}
pa(xg,vg);xg.prototype.start=function(){var a=A("yt.scheduler.instance.start");a&&a()};
xg.f=void 0;xg.g=function(){xg.f||(xg.f=new xg)};
xg.g();var yg=z.ytPubsubPubsubInstance||new O,zg=z.ytPubsubPubsubSubscribedKeys||{},Ag=z.ytPubsubPubsubTopicToKeys||{},Bg=z.ytPubsubPubsubIsSynchronous||{};O.prototype.subscribe=O.prototype.subscribe;O.prototype.unsubscribeByKey=O.prototype.O;O.prototype.publish=O.prototype.M;O.prototype.clear=O.prototype.clear;C("ytPubsubPubsubInstance",yg);C("ytPubsubPubsubTopicToKeys",Ag);C("ytPubsubPubsubIsSynchronous",Bg);C("ytPubsubPubsubSubscribedKeys",zg);var U=window,Cg=U.ytcsi&&U.ytcsi.now?U.ytcsi.now:U.performance&&U.performance.timing&&U.performance.now&&U.performance.timing.navigationStart?function(){return U.performance.timing.navigationStart+U.performance.now()}:function(){return(new Date).getTime()};var Dg=ug("initial_gel_batch_timeout",1E3),Eg=Math.pow(2,16)-1,Fg=null,Gg=0,Hg=void 0,Ig=0,Jg=0,Kg=0,Lg=!0,Mg=z.ytLoggingTransportGELQueue_||new Map;C("ytLoggingTransportGELQueue_",Mg);var Ng=z.ytLoggingTransportTokensToCttTargetIds_||{};C("ytLoggingTransportTokensToCttTargetIds_",Ng);function Og(){return new M(function(a){window.clearTimeout(Ig);window.clearTimeout(Jg);Jg=0;Hg&&Hg.isReady()?(Pg(a),Mg.clear()):(Qg(),a())})}
function Qg(){T("web_gel_timeout_cap")&&!Jg&&(Jg=yf(Og,6E4));window.clearTimeout(Ig);var a=P("LOGGING_BATCH_TIMEOUT",ug("web_gel_debounce_ms",1E4));T("shorten_initial_gel_batch_timeout")&&Lg&&(a=Dg);Ig=yf(Og,a)}
function Pg(a){for(var b=Hg,c=Math.round(Cg()),d=Mg.size,e=x(Mg),f=e.next();!f.done;f=e.next()){var g=x(f.value);f=g.next().value;var h=g.next().value;g=rb({context:Rg(b.f||Sg())});g.events=h;(h=Ng[f])&&Tg(g,f,h);delete Ng[f];Ug(g,c);Vg(b,"log_event",g,{retry:!0,onSuccess:function(){d--;d||a();Gg=Math.round(Cg()-c)},
onError:function(){d--;d||a()}});
Lg=!1}}
function Ug(a,b){a.requestTimeMs=String(b);T("unsplit_gel_payloads_in_logs")&&(a.unsplitGelPayloadsInLogs=!0);var c=P("EVENT_ID",void 0);if(c){var d=P("BATCH_CLIENT_COUNTER",void 0)||0;!d&&T("web_client_counter_random_seed")&&(d=Math.floor(Math.random()*Eg/2));d++;d>Eg&&(d=1);kf("BATCH_CLIENT_COUNTER",d);c={serializedEventId:c,clientCounter:String(d)};a.serializedClientEventId=c;Fg&&Gg&&T("log_gel_rtt_web")&&(a.previousBatchInfo={serializedClientEventId:Fg,roundtripMs:String(Gg)});Fg=c;Gg=0}}
function Tg(a,b,c){if(c.videoId)var d="VIDEO";else if(c.playlistId)d="PLAYLIST";else return;a.credentialTransferTokenTargetId=c;a.context=a.context||{};a.context.user=a.context.user||{};a.context.user.credentialTransferTokens=[{token:b,scope:d}]}
;var Wg=z.ytLoggingGelSequenceIdObj_||{};C("ytLoggingGelSequenceIdObj_",Wg);function Xg(a){var b=Yg;a=void 0===a?A("yt.ads.biscotti.lastId_")||"":a;b=Object.assign(Zg(b),$g(b));b.ca_type="image";a&&(b.bid=a);return b}
function Zg(a){var b={};b.dt=Gc;b.flash="0";a:{try{var c=a.f.top.location.href}catch(f){a=2;break a}a=c?c===a.g.location.href?0:1:2}b=(b.frm=a,b);b.u_tz=-(new Date).getTimezoneOffset();var d=void 0===d?I:d;try{var e=d.history.length}catch(f){e=0}b.u_his=e;b.u_java=!!I.navigator&&"unknown"!==typeof I.navigator.javaEnabled&&!!I.navigator.javaEnabled&&I.navigator.javaEnabled();I.screen&&(b.u_h=I.screen.height,b.u_w=I.screen.width,b.u_ah=I.screen.availHeight,b.u_aw=I.screen.availWidth,b.u_cd=I.screen.colorDepth);
I.navigator&&I.navigator.plugins&&(b.u_nplug=I.navigator.plugins.length);I.navigator&&I.navigator.mimeTypes&&(b.u_nmime=I.navigator.mimeTypes.length);return b}
function $g(a){var b=a.f;try{var c=b.screenX;var d=b.screenY}catch(n){}try{var e=b.outerWidth;var f=b.outerHeight}catch(n){}try{var g=b.innerWidth;var h=b.innerHeight}catch(n){}b=[b.screenLeft,b.screenTop,c,d,b.screen?b.screen.availWidth:void 0,b.screen?b.screen.availTop:void 0,e,f,g,h];c=a.f.top;try{var k=(c||window).document,l="CSS1Compat"==k.compatMode?k.documentElement:k.body;var m=(new nc(l.clientWidth,l.clientHeight)).round()}catch(n){m=new nc(-12245933,-12245933)}k=m;m={};l=new Mc;z.SVGElement&&
z.document.createElementNS&&l.set(0);c=Bc();c["allow-top-navigation-by-user-activation"]&&l.set(1);c["allow-popups-to-escape-sandbox"]&&l.set(2);z.crypto&&z.crypto.subtle&&l.set(3);z.TextDecoder&&z.TextEncoder&&l.set(4);l=Nc(l);m.bc=l;m.bih=k.height;m.biw=k.width;m.brdim=b.join();a=a.g;return m.vis={visible:1,hidden:2,prerender:3,preview:4,unloaded:5}[a.visibilityState||a.webkitVisibilityState||a.mozVisibilityState||""]||0,m.wgl=!!I.WebGLRenderingContext,m}
var Yg=new function(){var a=window.document;this.f=window;this.g=a};
C("yt.ads_.signals_.getAdSignalsString",function(a){return fg(Xg(a))});var ah="XMLHttpRequest"in z?function(){return new XMLHttpRequest}:null;
function bh(){if(!ah)return null;var a=ah();return"open"in a?a:null}
;var ch={Authorization:"AUTHORIZATION","X-Goog-Visitor-Id":"SANDBOXED_VISITOR_ID","X-YouTube-Client-Name":"INNERTUBE_CONTEXT_CLIENT_NAME","X-YouTube-Client-Version":"INNERTUBE_CONTEXT_CLIENT_VERSION","X-YouTube-Device":"DEVICE","X-Youtube-Identity-Token":"ID_TOKEN","X-YouTube-Page-CL":"PAGE_CL","X-YouTube-Page-Label":"PAGE_BUILD_LABEL","X-YouTube-Variants-Checksum":"VARIANTS_CHECKSUM"},dh="app debugcss debugjs expflag force_ad_params force_viral_ad_response_params forced_experiments innertube_snapshots innertube_goldens internalcountrycode internalipoverride absolute_experiments conditional_experiments sbb sr_bns_address client_dev_root_url".split(" "),
eh=!1;
function fh(a,b){b=void 0===b?{}:b;if(!c)var c=window.location.href;var d=a.match(rc)[1]||null,e=J(a);d&&e?(d=c,c=a.match(rc),d=d.match(rc),c=c[3]==d[3]&&c[1]==d[1]&&c[4]==d[4]):c=e?J(c)==e&&(Number(c.match(rc)[4]||null)||null)==(Number(a.match(rc)[4]||null)||null):!0;d=T("web_ajax_ignore_global_headers_if_set");for(var f in ch)e=P(ch[f]),!e||!c&&J(a)||d&&void 0!==b[f]||(b[f]=e);if(c||!J(a))b["X-YouTube-Utc-Offset"]=String(-(new Date).getTimezoneOffset());(c||!J(a))&&(f="undefined"!=typeof Intl?(new Intl.DateTimeFormat).resolvedOptions().timeZone:
null)&&(b["X-YouTube-Time-Zone"]=f);if(c||!J(a))b["X-YouTube-Ad-Signals"]=fg(Xg(void 0));return b}
function gh(a){var b=window.location.search,c=J(a),d=sc(a.match(rc)[5]||null);d=(c=c&&(c.endsWith("youtube.com")||c.endsWith("youtube-nocookie.com")))&&d&&d.startsWith("/api/");if(!c||d)return a;var e=gg(b),f={};F(dh,function(g){e[g]&&(f[g]=e[g])});
return hg(a,f||{},!1)}
function hh(a,b){if(window.fetch&&"XML"!=b.format){var c={method:b.method||"GET",credentials:"same-origin"};b.headers&&(c.headers=b.headers);a=ih(a,b);var d=jh(a,b);d&&(c.body=d);b.withCredentials&&(c.credentials="include");var e=!1,f;fetch(a,c).then(function(g){if(!e){e=!0;f&&window.clearTimeout(f);var h=g.ok,k=function(l){l=l||{};var m=b.context||z;h?b.onSuccess&&b.onSuccess.call(m,l,g):b.onError&&b.onError.call(m,l,g);b.T&&b.T.call(m,l,g)};
"JSON"==(b.format||"JSON")&&(h||400<=g.status&&500>g.status)?g.json().then(k,function(){k(null)}):k(null)}});
b.ba&&0<b.timeout&&(f=yf(function(){e||(e=!0,window.clearTimeout(f),b.ba.call(b.context||z))},b.timeout))}else kh(a,b)}
function kh(a,b){var c=b.format||"JSON";a=ih(a,b);var d=jh(a,b),e=!1,f=lh(a,function(k){if(!e){e=!0;h&&window.clearTimeout(h);a:switch(k&&"status"in k?k.status:-1){case 200:case 201:case 202:case 203:case 204:case 205:case 206:case 304:var l=!0;break a;default:l=!1}var m=null,n=400<=k.status&&500>k.status,r=500<=k.status&&600>k.status;if(l||n||r)m=mh(a,c,k,b.La);if(l)a:if(k&&204==k.status)l=!0;else{switch(c){case "XML":l=0==parseInt(m&&m.return_code,10);break a;case "RAW":l=!0;break a}l=!!m}m=m||
{};n=b.context||z;l?b.onSuccess&&b.onSuccess.call(n,k,m):b.onError&&b.onError.call(n,k,m);b.T&&b.T.call(n,k,m)}},b.method,d,b.headers,b.responseType,b.withCredentials);
if(b.L&&0<b.timeout){var g=b.L;var h=yf(function(){e||(e=!0,f.abort(),window.clearTimeout(h),g.call(b.context||z,f))},b.timeout)}}
function ih(a,b){b.Pa&&(a=document.location.protocol+"//"+document.location.hostname+(document.location.port?":"+document.location.port:"")+a);var c=P("XSRF_FIELD_NAME",void 0),d=b.ua;d&&(d[c]&&delete d[c],a=hg(a,d||{},!0));return a}
function jh(a,b){var c=P("XSRF_FIELD_NAME",void 0),d=P("XSRF_TOKEN",void 0),e=b.postBody||"",f=b.u,g=P("XSRF_FIELD_NAME",void 0),h;b.headers&&(h=b.headers["Content-Type"]);b.Oa||J(a)&&!b.withCredentials&&J(a)!=document.location.hostname||"POST"!=b.method||h&&"application/x-www-form-urlencoded"!=h||b.u&&b.u[g]||(f||(f={}),f[c]=d);f&&"string"===typeof e&&(e=gg(e),tb(e,f),e=b.da&&"JSON"==b.da?JSON.stringify(e):vc(e));if(!(c=e)&&(c=f)){a:{for(var k in f){f=!1;break a}f=!0}c=!f}!eh&&c&&"POST"!=b.method&&
(eh=!0,of(Error("AJAX request with postData should use POST")));return e}
function mh(a,b,c,d){var e=null;switch(b){case "JSON":try{var f=c.responseText}catch(g){throw d=Error("Error reading responseText"),d.params=a,pf(d),g;}a=c.getResponseHeader("Content-Type")||"";f&&0<=a.indexOf("json")&&(e=JSON.parse(f));break;case "XML":if(a=(a=c.responseXML)?nh(a):null)e={},F(a.getElementsByTagName("*"),function(g){e[g.tagName]=oh(g)})}d&&ph(e);
return e}
function ph(a){if(B(a))for(var b in a){var c;(c="html_content"==b)||(c=b.length-5,c=0<=c&&b.indexOf("_html",c)==c);if(c){c=b;var d=a[b];if(void 0===ub){var e=null;var f=z.trustedTypes;if(f&&f.createPolicy){try{e=f.createPolicy("goog#html",{createHTML:Ya,createScript:Ya,createScriptURL:Ya})}catch(g){z.console&&z.console.error(g.message)}ub=e}else ub=e}(e=ub)&&e.createHTML(d);a[c]=new Gb}else ph(a[b])}}
function nh(a){return a?(a=("responseXML"in a?a.responseXML:a).getElementsByTagName("root"))&&0<a.length?a[0]:null:null}
function oh(a){var b="";F(a.childNodes,function(c){b+=c.nodeValue});
return b}
function lh(a,b,c,d,e,f,g){function h(){4==(k&&"readyState"in k?k.readyState:0)&&b&&nf(b)(k)}
c=void 0===c?"GET":c;d=void 0===d?"":d;var k=bh();if(!k)return null;"onloadend"in k?k.addEventListener("loadend",h,!1):k.onreadystatechange=h;T("debug_forward_web_query_parameters")&&(a=gh(a));k.open(c,a,!0);f&&(k.responseType=f);g&&(k.withCredentials=!0);c="POST"==c&&(void 0===window.FormData||!(d instanceof FormData));if(e=fh(a,e))for(var l in e)k.setRequestHeader(l,e[l]),"content-type"==l.toLowerCase()&&(c=!1);c&&k.setRequestHeader("Content-Type","application/x-www-form-urlencoded");k.send(d);
return k}
;function qh(){for(var a={},b=x(Object.entries(gg(P("DEVICE","")))),c=b.next();!c.done;c=b.next()){var d=x(c.value);c=d.next().value;d=d.next().value;"cbrand"===c?a.deviceMake=d:"cmodel"===c?a.deviceModel=d:"cbr"===c?a.browserName=d:"cbrver"===c?a.browserVersion=d:"cos"===c?a.osName=d:"cosver"===c?a.osVersion=d:"cplatform"===c&&(a.platform=d)}return a}
;function rh(){return"INNERTUBE_API_KEY"in jf&&"INNERTUBE_API_VERSION"in jf}
function Sg(){return{innertubeApiKey:P("INNERTUBE_API_KEY",void 0),innertubeApiVersion:P("INNERTUBE_API_VERSION",void 0),ma:P("INNERTUBE_CONTEXT_CLIENT_CONFIG_INFO"),na:P("INNERTUBE_CONTEXT_CLIENT_NAME","WEB"),innertubeContextClientVersion:P("INNERTUBE_CONTEXT_CLIENT_VERSION",void 0),pa:P("INNERTUBE_CONTEXT_HL",void 0),oa:P("INNERTUBE_CONTEXT_GL",void 0),qa:P("INNERTUBE_HOST_OVERRIDE",void 0)||"",sa:!!P("INNERTUBE_USE_THIRD_PARTY_AUTH",!1),ra:!!P("INNERTUBE_OMIT_API_KEY_WHEN_AUTH_HEADER_IS_PRESENT",
!1),appInstallData:P("SERIALIZED_CLIENT_CONFIG_DATA",void 0)}}
function Rg(a){var b={client:{hl:a.pa,gl:a.oa,clientName:a.na,clientVersion:a.innertubeContextClientVersion,configInfo:a.ma}},c=window.devicePixelRatio;c&&1!=c&&(b.client.screenDensityFloat=String(c));c=P("EXPERIMENTS_TOKEN","");""!==c&&(b.client.experimentsToken=c);c=[];var d=P("EXPERIMENTS_FORCED_FLAGS",{});for(e in d)c.push({key:e,value:String(d[e])});var e=P("EXPERIMENT_FLAGS",{});for(var f in e)f.startsWith("force_")&&void 0===d[f]&&c.push({key:f,value:String(e[f])});0<c.length&&(b.request={internalExperimentFlags:c});
a.appInstallData&&T("web_log_app_install_experiments")&&(b.client.configInfo=b.client.configInfo||{},b.client.configInfo.appInstallData=a.appInstallData);P("DELEGATED_SESSION_ID")&&!T("pageid_as_header_web")&&(b.user={onBehalfOfUser:P("DELEGATED_SESSION_ID")});b.client=Object.assign(b.client,qh());return b}
function sh(a,b,c){c=void 0===c?{}:c;var d={"X-Goog-Visitor-Id":c.visitorData||P("VISITOR_DATA","")};if(b&&b.includes("www.youtube-nocookie.com"))return d;(b=c.Ia||P("AUTHORIZATION"))||(a?b="Bearer "+A("gapi.auth.getToken")().Ha:b=Lc([]));b&&(d.Authorization=b,d["X-Goog-AuthUser"]=P("SESSION_INDEX",0),T("pageid_as_header_web")&&(d["X-Goog-PageId"]=P("DELEGATED_SESSION_ID")));return d}
;function th(a){a=Object.assign({},a);delete a.Authorization;var b=Lc();if(b){var c=new wd;c.update(P("INNERTUBE_API_KEY",void 0));c.update(b);b=c.digest();c=3;Pa(b);void 0===c&&(c=0);if(!gc){gc={};for(var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"],f=0;5>f;f++){var g=d.concat(e[f].split(""));fc[f]=g;for(var h=0;h<g.length;h++){var k=g[h];void 0===gc[k]&&(gc[k]=h)}}}c=fc[c];d=[];for(e=0;e<b.length;e+=3){var l=b[e],m=(f=e+1<b.length)?
b[e+1]:0;k=(g=e+2<b.length)?b[e+2]:0;h=l>>2;l=(l&3)<<4|m>>4;m=(m&15)<<2|k>>6;k&=63;g||(k=64,f||(m=64));d.push(c[h],c[l],c[m]||"",c[k]||"")}a.hash=d.join("")}return a}
;function uh(){var a=new bf;(a=a.isAvailable()?new hf(a,"yt.innertube"):null)||(a=new cf("yt.innertube"),a=a.isAvailable()?a:null);this.f=a?new Ye(a):null;this.g=document.domain||window.location.hostname}
uh.prototype.set=function(a,b,c,d){c=c||31104E3;this.remove(a);if(this.f)try{this.f.set(a,b,Date.now()+1E3*c);return}catch(f){}var e="";if(d)try{e=escape(ve(b))}catch(f){return}else e=escape(b);b=this.g;mc.set(""+a,e,{Y:c,path:"/",domain:void 0===b?"youtube.com":b,secure:!1})};
uh.prototype.get=function(a,b){var c=void 0,d=!this.f;if(!d)try{c=this.f.get(a)}catch(e){d=!0}if(d&&(c=mc.get(""+a,void 0))&&(c=unescape(c),b))try{c=JSON.parse(c)}catch(e){this.remove(a),c=void 0}return c};
uh.prototype.remove=function(a){this.f&&this.f.remove(a);var b=this.g;mc.remove(""+a,"/",void 0===b?"youtube.com":b)};var vh;function wh(){vh||(vh=new uh);return vh}
function xh(a,b,c,d){if(d)return null;d=wh().get("nextId",!0)||1;var e=wh().get("requests",!0)||{};e[d]={method:a,request:b,authState:th(c),requestTime:Math.round(Cg())};wh().set("nextId",d+1,86400,!0);wh().set("requests",e,86400,!0);return d}
function yh(a){var b=wh().get("requests",!0)||{};delete b[a];wh().set("requests",b,86400,!0)}
function zh(a){var b=wh().get("requests",!0);if(b){for(var c in b){var d=b[c];if(!(6E4>Math.round(Cg())-d.requestTime)){var e=d.authState,f=th(sh(!1));qb(e,f)&&(e=d.request,"requestTimeMs"in e&&(e.requestTimeMs=Math.round(Cg())),Vg(a,d.method,e,{}));delete b[c]}}wh().set("requests",b,86400,!0)}}
;new K;var Ah=dc||ec;function Bh(){var a=/WebKit\/([0-9]+)/.exec(G);return!!(a&&600<=parseInt(a[1],10))}
function Ch(){var a=/WebKit\/([0-9]+)/.exec(G);return!!(a&&602<=parseInt(a[1],10))}
;function Dh(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];d=Error.call(this,a);this.message=d.message;"stack"in d&&(this.stack=d.stack);this.args=[].concat(c instanceof Array?c:fa(x(c)))}
pa(Dh,Error);var Eh={},Fh=(Eh.AUTH_INVALID="No user identifier specified.",Eh.EXPLICIT_ABORT="Transaction was explicitly aborted.",Eh.IDB_NOT_SUPPORTED="IndexedDB is not supported.",Eh.MISSING_OBJECT_STORE="Object store not created.",Eh.UNKNOWN_ABORT="Transaction was aborted for unknown reasons.",Eh.QUOTA_EXCEEDED="The current transaction exceeded its quota limitations.",Eh.QUOTA_MAYBE_EXCEEDED="The current transaction may have failed because of exceeding quota limitations.",Eh);
function Gh(a,b,c){b=void 0===b?{}:b;c=void 0===c?Fh[a]:c;Dh.call(this,c,Object.assign({name:"YtIdbKnownError",Ra:void 0===self.document,Qa:self!==self.top,type:a},b));this.type=a;this.message=c;Object.setPrototypeOf(this,Gh.prototype)}
pa(Gh,Dh);function Hh(a,b){Gh.call(this,"UNKNOWN_ABORT",{objectStoreNames:a.join(),dbName:b});Object.setPrototypeOf(this,Hh.prototype)}
pa(Hh,Gh);function Ih(a){if(!a)throw Error();throw a;}
function Jh(a){return a}
function V(a){var b=this;this.g=a;this.state={status:"PENDING"};this.f=[];this.onRejected=[];this.g(function(c){if("PENDING"===b.state.status){b.state={status:"FULFILLED",value:c};c=x(b.f);for(var d=c.next();!d.done;d=c.next())d=d.value,d()}},function(c){if("PENDING"===b.state.status){b.state={status:"REJECTED",
reason:c};c=x(b.onRejected);for(var d=c.next();!d.done;d=c.next())d=d.value,d()}})}
V.all=function(a){return new V(function(b,c){var d=[],e=a.length;0===e&&b(d);for(var f={D:0};f.D<a.length;f={D:f.D},++f.D)Kh(V.resolve(a[f.D]).then(function(g){return function(h){d[g.D]=h;e--;0===e&&b(d)}}(f)),function(g){c(g)})})};
V.resolve=function(a){return new V(function(b,c){a instanceof V?a.then(b,c):b(a)})};
V.reject=function(a){return new V(function(b,c){c(a)})};
V.prototype.then=function(a,b){var c=this,d=null!==a&&void 0!==a?a:Jh,e=null!==b&&void 0!==b?b:Ih;return new V(function(f,g){"PENDING"===c.state.status?(c.f.push(function(){Lh(c,c,d,f,g)}),c.onRejected.push(function(){Mh(c,c,e,f,g)})):"FULFILLED"===c.state.status?Lh(c,c,d,f,g):"REJECTED"===c.state.status&&Mh(c,c,e,f,g)})};
function Kh(a,b){a.then(void 0,b)}
function Lh(a,b,c,d,e){try{if("FULFILLED"!==a.state.status)throw Error("calling handleResolve before the promise is fulfilled.");var f=c(a.state.value);f instanceof V?Nh(a,b,f,d,e):d(f)}catch(g){e(g)}}
function Mh(a,b,c,d,e){try{if("REJECTED"!==a.state.status)throw Error("calling handleReject before the promise is rejected.");var f=c(a.state.reason);f instanceof V?Nh(a,b,f,d,e):d(f)}catch(g){e(g)}}
function Nh(a,b,c,d,e){b===c?e(new TypeError("Circular promise chain detected.")):c.then(function(f){f instanceof V?Nh(a,b,f,d,e):d(f)},function(f){e(f)})}
;function Oh(a,b,c){function d(){c(a.error);f()}
function e(){b(a.result);f()}
function f(){try{a.removeEventListener("success",e),a.removeEventListener("error",d)}catch(g){}}
a.addEventListener("success",e);a.addEventListener("error",d)}
function Ph(a){return new M(function(b,c){Oh(a,b,c)})}
function Qh(a){return new V(function(b,c){Oh(a,b,c)})}
;function Rh(a,b){this.f=a;this.options=b}
p=Rh.prototype;p.add=function(a,b,c){return Sh(this,[a],"readwrite",function(d){return Th(d,a).add(b,c)})};
p.clear=function(a){return Sh(this,[a],"readwrite",function(b){return Th(b,a).clear()})};
p.close=function(){var a;this.f.close();(null===(a=this.options)||void 0===a?0:a.closed)&&this.options.closed()};
p.count=function(a,b){return Sh(this,[a],"readonly",function(c){return Th(c,a).count(b)})};
p["delete"]=function(a,b){return Sh(this,[a],"readwrite",function(c){return Th(c,a)["delete"](b)})};
p.get=function(a,b){return Sh(this,[a],"readwrite",function(c){return Th(c,a).get(b)})};
function Sh(a,b,c,d){a=a.f.transaction(b,void 0===c?"readonly":c);a=new Uh(a);return Vh(a,d)}
function Wh(a){this.f=a}
p=Wh.prototype;p.add=function(a,b){return Qh(this.f.add(a,b))};
p.clear=function(){return Qh(this.f.clear()).then(function(){})};
p.count=function(a){return Qh(this.f.count(a))};
p["delete"]=function(a){return Qh(this.f["delete"](a))};
p.get=function(a){return Qh(this.f.get(a))};
p.index=function(a){return new Xh(this.f.index(a))};
p.getName=function(){return this.f.name};
function Uh(a){var b=this;this.f=a;this.g=new Map;this.aborted=!1;this.done=new M(function(c,d){b.f.addEventListener("complete",function(){c()});
b.f.addEventListener("error",function(e){e.currentTarget===e.target&&d(b.f.error)});
b.f.addEventListener("abort",function(){var e=b.f.error;if(e)"QuotaExceededError"===e.name?pf(new Gh("QUOTA_EXCEEDED")):"UnknownError"===e.name&&pf(new Gh("QUOTA_MAYBE_EXCEEDED")),d(e);else if(!b.aborted){e=Hh;for(var f=b.f.objectStoreNames,g=[],h=0;h<f.length;h++){var k=f.item(h);if(null===k)throw Error("Invariant: item in DOMStringList is null");g.push(k)}e=new e(g,b.f.db.name);pf(e);d(e)}})})}
function Vh(a,b){var c=new M(function(d,e){Kh(b(a).then(function(f){try{a.commit(),d(f)}catch(g){e(g)}}),e)});
return De([c,a.done]).then(function(d){return x(d).next().value})}
Uh.prototype.abort=function(){this.f.abort();this.aborted=!0;var a=new Gh("EXPLICIT_ABORT");a.sampleWeight=0;throw a;};
Uh.prototype.commit=function(){var a=this.f;a.commit&&!this.aborted&&a.commit()};
function Th(a,b){var c=a.f.objectStore(b),d=a.g.get(c);d||(d=new Wh(c),a.g.set(c,d));return d}
function Xh(a){this.f=a}
Xh.prototype.count=function(a){return Qh(this.f.count(a))};
Xh.prototype.get=function(a){return Qh(this.f.get(a))};function Ge(a){function b(){m||(m=new c(e.result,{closed:l}));return m}
var c=Rh,d=Uh,e=self.indexedDB.open("yt-idb-test-do-not-use",void 0),f=a.blocked,g=a.blocking,h=a.Ua,k=a.upgrade,l=a.closed,m;k&&e.addEventListener("upgradeneeded",function(n){if(null===n.newVersion)throw Error("Invariant: newVersion on IDbVersionChangeEvent is null");if(null===e.transaction)throw Error("Invariant: transaction on IDbOpenDbRequest is null");var r=b(),q=new d(e.transaction);k(r,n.oldVersion,n.newVersion,q)});
f&&e.addEventListener("blocked",function(){f()});
return Ph(e).then(function(n){g&&n.addEventListener("versionchange",function(){g(b())});
h&&n.addEventListener("close",function(){h()});
return b()})}
;var Yh,Zh,$h=["getAll","getAllKeys","getKey","openKeyCursor"],ai=["getAll","getAllKeys","getKey","openKeyCursor"];function bi(){return Za(this,function b(){var c,d;return Ha(b,function(e){switch(e.g){case 1:if(Ah&&Bh()&&!Ch()&&!T("ytidb_allow_on_ios_safari_v8_and_v9")||Kb)return e["return"](!1);try{if(c=self,!(c.indexedDB&&c.IDBIndex&&c.IDBKeyRange&&c.IDBObjectStore))return e["return"](!1)}catch(f){return e["return"](!1)}ua(e);return ta(e,Fe(function(){}));
case 5:if(d=e.o,!d)return e["return"](!1);case 3:wa(e);if(d)try{d.close()}catch(f){}xa(e);break;case 2:return va(e),e["return"](!1);case 4:return e["return"](!0)}})})}
function ci(){return void 0!==Yh?Ae(Yh):new M(function(a){bi().then(function(b){Yh=b;a(b)})})}
function di(){return void 0!==Zh?Ae(Zh):ci().then(function(a){if(!a)return!1;var b=x($h);for(a=b.next();!a.done;a=b.next())if(!IDBObjectStore.prototype[a.value])return!1;b=x(ai);for(a=b.next();!a.done;a=b.next())if(!IDBIndex.prototype[a.value])return!1;return IDBObjectStore.prototype.getKey?!0:!1}).then(function(a){return Zh=a})}
;function ei(){K.call(this);this.g=fi();gi(this);hi(this)}
pa(ei,K);function fi(){var a=window.navigator.onLine;return void 0===a?!0:a}
function hi(a){window.addEventListener("online",function(){a.g=!0;a.o&&a.o()})}
function gi(a){window.addEventListener("offline",function(){a.g=!1;a.m&&a.m()})}
;function ii(a,b){b=void 0===b?{}:b;ji().then(function(){ei.f||(ei.f=new ei);ei.f.g!==fi()&&of(Error("NetworkStatusManager isOnline does not match window status"));kh(a,b)})}
function ji(){return Za(this,function b(){return Ha(b,function(c){return T("networkless_logging")?(2===ug("networkless_ytidb_version")&&di().then(function(d){return d}),c["return"](ci())):c["return"](!1)})})}
;function ki(a){var b=this;this.f=null;a?this.f=a:rh()&&(this.f=Sg());wg(function(){zh(b)})}
ki.prototype.isReady=function(){!this.f&&rh()&&(this.f=Sg());return!!this.f};
function Vg(a,b,c,d){!P("VISITOR_DATA")&&"visitor_id"!==b&&.01>Math.random()&&pf(new Dh("Missing VISITOR_DATA when sending innertube request.",b,c,d));if(!a.isReady()){var e=new Dh("innertube xhrclient not ready",b,c,d);of(e);e.sampleWeight=0;throw e;}var f={headers:{"Content-Type":"application/json"},method:"POST",u:c,da:"JSON",L:function(){d.L()},
ba:d.L,onSuccess:function(n,r){if(d.onSuccess)d.onSuccess(r)},
aa:function(n){if(d.onSuccess)d.onSuccess(n)},
onError:function(n,r){if(d.onError)d.onError(r)},
Sa:function(n){if(d.onError)d.onError(n)},
timeout:d.timeout,withCredentials:!0},g="";(e=a.f.qa)&&(g=e);var h=a.f.sa||!1,k=sh(h,g,d);Object.assign(f.headers,k);f.headers.Authorization&&!g&&(f.headers["x-origin"]=window.location.origin);e="/youtubei/"+a.f.innertubeApiVersion+"/"+b;var l={alt:"json"};a.f.ra&&f.headers.Authorization||(l.key=a.f.innertubeApiKey);var m=hg(""+g+e,l||{},!0);ji().then(function(n){if(d.retry&&T("retry_web_logging_batches")&&"www.youtube-nocookie.com"!=g){if(T("networkless_gel")&&!n||!T("networkless_gel"))var r=xh(b,
c,k,h);if(r){var q=f.onSuccess,v=f.aa;f.onSuccess=function(w,E){yh(r);q(w,E)};
c.aa=function(w,E){yh(r);v(w,E)}}}try{T("use_fetch_for_op_xhr")?hh(m,f):T("networkless_gel")&&d.retry?(f.method="POST",ii(m,f)):(f.method="POST",f.u||(f.u={}),kh(m,f))}catch(w){if("InvalidAccessError"==w.name)r&&(yh(r),r=0),pf(Error("An extension is blocking network request."));
else throw w;}r&&wg(function(){zh(a)})})}
;var li=[{Z:function(a){return"Cannot read property '"+a.key+"'"},
U:{TypeError:[{regexp:/Cannot read property '([^']+)' of (null|undefined)/,groups:["key","value"]},{regexp:/\u65e0\u6cd5\u83b7\u53d6\u672a\u5b9a\u4e49\u6216 (null|undefined) \u5f15\u7528\u7684\u5c5e\u6027\u201c([^\u201d]+)\u201d/,groups:["value","key"]},{regexp:/\uc815\uc758\ub418\uc9c0 \uc54a\uc74c \ub610\ub294 (null|undefined) \ucc38\uc870\uc778 '([^']+)' \uc18d\uc131\uc744 \uac00\uc838\uc62c \uc218 \uc5c6\uc2b5\ub2c8\ub2e4./,groups:["value","key"]},{regexp:/No se puede obtener la propiedad '([^']+)' de referencia nula o sin definir/,
groups:["key"]},{regexp:/Unable to get property '([^']+)' of (undefined or null) reference/,groups:["key","value"]}],Error:[{regexp:/(Permission denied) to access property "([^']+)"/,groups:["reason","key"]}]}},{Z:function(a){return"Cannot call '"+a.key+"'"},
U:{TypeError:[{regexp:/(?:([^ ]+)?\.)?([^ ]+) is not a function/,groups:["base","key"]},{regexp:/([^ ]+) called on (null or undefined)/,groups:["key","value"]},{regexp:/Object (.*) has no method '([^ ]+)'/,groups:["base","key"]},{regexp:/Object doesn't support property or method '([^ ]+)'/,groups:["key"]},{regexp:/\u30aa\u30d6\u30b8\u30a7\u30af\u30c8\u306f '([^']+)' \u30d7\u30ed\u30d1\u30c6\u30a3\u307e\u305f\u306f\u30e1\u30bd\u30c3\u30c9\u3092\u30b5\u30dd\u30fc\u30c8\u3057\u3066\u3044\u307e\u305b\u3093/,
groups:["key"]},{regexp:/\uac1c\uccb4\uac00 '([^']+)' \uc18d\uc131\uc774\ub098 \uba54\uc11c\ub4dc\ub97c \uc9c0\uc6d0\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4./,groups:["key"]}]}}];function mi(){this.f=[];this.g=[]}
var ni;var oi=new O;var pi=new Set,qi=0,ri=["PhantomJS","Googlebot","TO STOP THIS SECURITY SCAN go/scan"];function si(a,b,c,d){c+="."+a;a=String(JSON.stringify(b)).substr(0,500);d[c]=a;return c.length+a.length}
;function W(a,b,c){this.l=this.f=this.g=null;this.j=Qa(this);this.h=0;this.o=!1;this.m=[];this.i=null;this.v=c;this.G={};c=document;if(a="string"===typeof a?c.getElementById(a):a)if(c="iframe"==a.tagName.toLowerCase(),b.host||(b.host=c?tc(a.src):"https://www.youtube.com"),this.g=new qg(b),c||(b=ti(this,a),this.l=a,(c=a.parentNode)&&c.replaceChild(b,a),a=b),this.f=a,this.f.id||(this.f.id="widget"+Qa(this.f)),kg[this.f.id]=this,window.postMessage){this.i=new O;ui(this);b=R(this.g,"events");for(var d in b)b.hasOwnProperty(d)&&
this.addEventListener(d,b[d]);for(var e in mg)vi(this,e)}}
p=W.prototype;p.setSize=function(a,b){this.f.width=a;this.f.height=b;return this};
p.ta=function(){return this.f};
p.ea=function(a){this.N(a.event,a)};
p.addEventListener=function(a,b){var c=b;"string"==typeof b&&(c=function(){window[b].apply(window,arguments)});
if(!c)return this;this.i.subscribe(a,c);wi(this,a);return this};
function vi(a,b){var c=b.split(".");if(2==c.length){var d=c[1];a.v==c[0]&&wi(a,d)}}
p.destroy=function(){this.f.id&&(kg[this.f.id]=null);var a=this.i;a&&"function"==typeof a.dispose&&a.dispose();if(this.l){a=this.f;var b=a.parentNode;b&&b.replaceChild(this.l,a)}else(a=this.f)&&a.parentNode&&a.parentNode.removeChild(a);sg&&(sg[this.j]=null);this.g=null;a=this.f;for(var c in pb)pb[c][0]==a&&vf(c);this.l=this.f=null};
p.P=function(){return{}};
function xi(a,b,c){c=c||[];c=Array.prototype.slice.call(c);b={event:"command",func:b,args:c};a.o?a.V(b):a.m.push(b)}
p.N=function(a,b){if(!this.i.h){var c={target:this,data:b};this.i.M(a,c);pg(this.v+"."+a,c)}};
function ti(a,b){for(var c=document.createElement("iframe"),d=b.attributes,e=0,f=d.length;e<f;e++){var g=d[e].value;null!=g&&""!=g&&"null"!=g&&c.setAttribute(d[e].name,g)}c.setAttribute("frameBorder",0);c.setAttribute("allowfullscreen",1);c.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");c.setAttribute("title","YouTube "+R(a.g,"title"));(d=R(a.g,"width"))&&c.setAttribute("width",d);(d=R(a.g,"height"))&&c.setAttribute("height",d);var h=
a.P();h.enablejsapi=window.postMessage?1:0;window.location.host&&(h.origin=window.location.protocol+"//"+window.location.host);h.widgetid=a.j;window.location.href&&F(["debugjs","debugcss"],function(k){var l=window.location.href;var m=l.search(wc);b:{var n=0;for(var r=k.length;0<=(n=l.indexOf(k,n))&&n<m;){var q=l.charCodeAt(n-1);if(38==q||63==q)if(q=l.charCodeAt(n+r),!q||61==q||38==q||35==q)break b;n+=r+1}n=-1}if(0>n)l=null;else{r=l.indexOf("&",n);if(0>r||r>m)r=m;n+=k.length+1;l=decodeURIComponent(l.substr(n,
r-n).replace(/\+/g," "))}null!==l&&(h[k]=l)});
c.src=R(a.g,"host")+a.R()+"?"+vc(h);return c}
p.ca=function(){this.f&&this.f.contentWindow?this.V({event:"listening"}):window.clearInterval(this.h)};
function ui(a){rg(a.g,a,a.j);a.h=zf(Wa(a.ca,a));xf(a.f,"load",Wa(function(){window.clearInterval(this.h);this.h=zf(Wa(this.ca,this))},a))}
function wi(a,b){a.G[b]||(a.G[b]=!0,xi(a,"addEventListener",[b]))}
p.V=function(a){a.id=this.j;a.channel="widget";var b=ve(a),c=this.g,d=tc(this.f.src||"");var e=0==d.indexOf("https:")?[d]:c.f?[d.replace("http:","https:")]:c.h?[d]:[d,d.replace("http:","https:")];if(this.f.contentWindow)for(var f=0;f<e.length;f++)try{this.f.contentWindow.postMessage(b,e[f])}catch(La){if(La.name&&"SyntaxError"==La.name){if(!(La.message&&0<La.message.indexOf("target origin ''"))){var g=void 0,h=void 0,k=La;h=void 0===h?{}:h;h.name=P("INNERTUBE_CONTEXT_CLIENT_NAME",1);h.version=P("INNERTUBE_CONTEXT_CLIENT_VERSION",
void 0);var l=h||{},m="WARNING";m=void 0===m?"ERROR":m;g=void 0===g?!1:g;if(k){if(T("console_log_js_exceptions")){var n=k,r=[];r.push("Name: "+n.name);r.push("Message: "+n.message);n.hasOwnProperty("params")&&r.push("Error Params: "+JSON.stringify(n.params));r.push("File name: "+n.fileName);r.push("Stacktrace: "+n.stack);window.console.log(r.join("\n"),n)}if((window&&window.yterr||g)&&!(5<=qi)&&0!==k.sampleWeight){var q=void 0,v=k,w=l,E=hc(v),Ta=E.message||"Unknown Error",ea=E.name||"UnknownError",
Da=E.lineNumber||"Not available",Di=E.fileName||"Not available",Ei=E.stack||v.f||"Not available";if(v.hasOwnProperty("args")&&v.args&&v.args.length)for(var ma=0,Sb=0;Sb<v.args.length;Sb++){var N=v.args[Sb],za="params."+Sb;ma+=za.length;if(N)if(Array.isArray(N)){for(var Fi=w,ad=ma,hb=0;hb<N.length&&!(N[hb]&&(ad+=si(hb,N[hb],za,Fi),500<ad));hb++);ma=ad}else if("object"===typeof N){var Tb=void 0,Gi=w,bd=ma;for(Tb in N)if(N[Tb]&&(bd+=si(Tb,N[Tb],za,Gi),500<bd))break;ma=bd}else w[za]=String(JSON.stringify(N)).substring(0,
500),ma+=w[za].length;else w[za]=String(JSON.stringify(N)).substring(0,500),ma+=w[za].length;if(500<=ma)break}else if(v.hasOwnProperty("params")&&v.params){var Ub=v.params;if("object"===typeof v.params){var Af=0;for(q in Ub)if(Ub[q]){var Bf="params."+q,Cf=String(JSON.stringify(Ub[q])).substr(0,500);w[Bf]=Cf;Af+=Bf.length+Cf.length;if(500<Af)break}}else w.params=String(JSON.stringify(Ub)).substr(0,500)}navigator.vendor&&!w.hasOwnProperty("vendor")&&(w.vendor=navigator.vendor);var cd={message:Ta,name:ea,
lineNumber:Da,fileName:Di,stack:Ei,params:w},Df=Number(v.columnNumber);isNaN(Df)||(cd.lineNumber=cd.lineNumber+":"+Df);for(var X,Aa=cd,Ef=x(li),dd=Ef.next();!dd.done;dd=Ef.next()){var ed=dd.value;if(ed.U[Aa.name])for(var Ff=x(ed.U[Aa.name]),fd=Ff.next();!fd.done;fd=Ff.next()){var Gf=fd.value,Vb=Aa.message.match(Gf.regexp);if(Vb){Aa.params["error.original"]=Vb[0];for(var gd=Gf.groups,Hf={},Ma=0;Ma<gd.length;Ma++)Hf[gd[Ma]]=Vb[Ma+1],Aa.params["error."+gd[Ma]]=Vb[Ma+1];Aa.message=ed.Z(Hf);break}}}X=
Aa;window.yterr&&"function"===typeof window.yterr&&window.yterr(X);if(!(pi.has(X.message)||0<=X.stack.indexOf("/YouTubeCenter.js")||0<=X.stack.indexOf("/mytube.js"))){oi.M("handleError",X);if(T("kevlar_gel_error_routing")){var Wb=void 0,If=m,L=X;a:{for(var Jf=x(ri),hd=Jf.next();!hd.done;hd=Jf.next()){var Kf=G;if(Kf&&0<=Kf.toLowerCase().indexOf(hd.value.toLowerCase())){var Lf=!0;break a}}Lf=!1}if(!Lf){var ib={stackTrace:L.stack};L.fileName&&(ib.filename=L.fileName);var Y=L.lineNumber&&L.lineNumber.split?
L.lineNumber.split(":"):[];0!==Y.length&&(1!==Y.length||isNaN(Number(Y[0]))?2!==Y.length||isNaN(Number(Y[0]))||isNaN(Number(Y[1]))||(ib.lineNumber=Number(Y[0]),ib.columnNumber=Number(Y[1])):ib.lineNumber=Number(Y[0]));var Hi=L.message,Ii=L.name;ni||(ni=new mi);var Mf=ni;a:{for(var Nf=x(Mf.g),id=Nf.next();!id.done;id=Nf.next()){var Of=id.value;if(L.message&&L.message.match(Of.f)){var jd=Of.weight;break a}}for(var Pf=x(Mf.f),kd=Pf.next();!kd.done;kd=Pf.next()){var Qf=kd.value;if(Qf.f(L)){jd=Qf.weight;
break a}}jd=1}var ld={level:"ERROR_LEVEL_UNKNOWN",message:Hi,errorClassName:Ii,sampleWeight:jd};"ERROR"===If?ld.level="ERROR_LEVEL_ERROR":"WARNING"===If&&(ld.level="ERROR_LEVEL_WARNNING");var Ji={isObfuscated:!0,browserStackInfo:ib},Na={pageUrl:window.location.href};P("FEXP_EXPERIMENTS")&&(Na.experimentIds=P("FEXP_EXPERIMENTS"));Na.kvPairs=[];var md=L.params;if(md)for(var Rf=x(Object.keys(md)),nd=Rf.next();!nd.done;nd=Rf.next()){var Sf=nd.value;Na.kvPairs.push({key:"client."+Sf,value:String(md[Sf])})}var Tf=
P("SERVER_NAME",void 0),Uf=P("SERVER_VERSION",void 0);Tf&&Uf&&(Na.kvPairs.push({key:"server.name",value:Tf}),Na.kvPairs.push({key:"server.version",value:Uf}));var Ki={errorMetadata:Na,stackTrace:Ji,logMessage:ld};Wb=void 0===Wb?{}:Wb;var Vf=ki;P("ytLoggingEventsDefaultDisabled",!1)&&ki==ki&&(Vf=null);var Li=Vf,S=Wb;S=void 0===S?{}:S;var jb={};jb.eventTimeMs=Math.round(S.timestamp||Cg());jb.clientError=Ki;var Mi=String;if(S.timestamp)var Wf=-1;else{var Xf=A("_lact",window);Wf=null==Xf?-1:Math.max(Date.now()-
Xf,0)}jb.context={lastActivityMs:Mi(Wf)};if(T("log_sequence_info_on_gel_web")&&S.fa){var Ni=jb.context,kb=S.fa;Wg[kb]=kb in Wg?Wg[kb]+1:0;Ni.sequence={index:Wg[kb],groupKey:kb};S.Na&&delete Wg[S.fa]}var Oi=jb,Xb=S.Ma,Yf=Li,od="";if(Xb){var Yb=Xb,pd={};Yb.videoId?pd.videoId=Yb.videoId:Yb.playlistId&&(pd.playlistId=Yb.playlistId);Ng[Xb.token]=pd;od=Xb.token}var qd=Mg.get(od)||[];Mg.set(od,qd);qd.push(Oi);Yf&&(Hg=new Yf);var Pi=ug("web_logging_max_batch")||100,Zf=Cg();qd.length>=Pi?Og():10<=Zf-Kg&&(Qg(),
Kg=Zf);Og()}}if(!T("suppress_error_204_logging")){var rd,Ba=X,lb=Ba.params||{},na={ua:{a:"logerror",t:"jserror",type:Ba.name,msg:Ba.message.substr(0,250),line:Ba.lineNumber,level:m,"client.name":lb.name},u:{url:P("PAGE_NAME",window.location.href),file:Ba.fileName},method:"POST"};lb.version&&(na["client.version"]=lb.version);if(na.u){Ba.stack&&(na.u.stack=Ba.stack);for(var $f=x(Object.keys(lb)),sd=$f.next();!sd.done;sd=$f.next()){var ag=sd.value;na.u["client."+ag]=lb[ag]}if(rd=P("LATEST_ECATCHER_SERVICE_TRACKING_PARAMS",
void 0))for(var bg=x(Object.keys(rd)),td=bg.next();!td.done;td=bg.next()){var cg=td.value;na.u[cg]=rd[cg]}var dg=P("SERVER_NAME",void 0),eg=P("SERVER_VERSION",void 0);dg&&eg&&(na.u["server.name"]=dg,na.u["server.version"]=eg)}kh(P("ECATCHER_REPORT_HOST","")+"/error_204",na)}pi.add(X.message);qi++}}}}}else throw La;}else console&&console.warn&&console.warn("The YouTube player is not attached to the DOM. API calls should be made after the onReady event. See more: https://developers.google.com/youtube/iframe_api_reference#Events")};function yi(a){return(0===a.search("cue")||0===a.search("load"))&&"loadModule"!==a}
function zi(a){return 0===a.search("get")||0===a.search("is")}
;function Z(a,b){if(!a)throw Error("YouTube player element ID required.");var c={title:"video player",videoId:"",width:640,height:360};if(b)for(var d in b)c[d]=b[d];W.call(this,a,c,"player");this.C={};this.playerInfo={}}
pa(Z,W);p=Z.prototype;p.R=function(){return"/embed/"+R(this.g,"videoId")};
p.P=function(){var a=R(this.g,"playerVars");if(a){var b={},c;for(c in a)b[c]=a[c];a=b}else a={};window!=window.top&&document.referrer&&(a.widget_referrer=document.referrer.substring(0,256));if(c=R(this.g,"embedConfig")){if(B(c))try{c=JSON.stringify(c)}catch(d){console.error("Invalid embed config JSON",d)}a.embed_config=c}return a};
p.ea=function(a){var b=a.event;a=a.info;switch(b){case "apiInfoDelivery":if(B(a))for(var c in a)this.C[c]=a[c];break;case "infoDelivery":Ai(this,a);break;case "initialDelivery":window.clearInterval(this.h);this.playerInfo={};this.C={};Bi(this,a.apiInterface);Ai(this,a);break;default:this.N(b,a)}};
function Ai(a,b){if(B(b))for(var c in b)a.playerInfo[c]=b[c]}
function Bi(a,b){F(b,function(c){this[c]||("getCurrentTime"==c?this[c]=function(){var d=this.playerInfo.currentTime;if(1==this.playerInfo.playerState){var e=(Date.now()/1E3-this.playerInfo.currentTimeLastUpdated_)*this.playerInfo.playbackRate;0<e&&(d+=Math.min(e,1))}return d}:yi(c)?this[c]=function(){this.playerInfo={};
this.C={};xi(this,c,arguments);return this}:zi(c)?this[c]=function(){var d=0;
0===c.search("get")?d=3:0===c.search("is")&&(d=2);return this.playerInfo[c.charAt(d).toLowerCase()+c.substr(d+1)]}:this[c]=function(){xi(this,c,arguments);
return this})},a)}
p.getVideoEmbedCode=function(){var a=parseInt(R(this.g,"width"),10),b=parseInt(R(this.g,"height"),10),c=R(this.g,"host")+this.R();Cb.test(c)&&(-1!=c.indexOf("&")&&(c=c.replace(wb,"&amp;")),-1!=c.indexOf("<")&&(c=c.replace(xb,"&lt;")),-1!=c.indexOf(">")&&(c=c.replace(yb,"&gt;")),-1!=c.indexOf('"')&&(c=c.replace(zb,"&quot;")),-1!=c.indexOf("'")&&(c=c.replace(Ab,"&#39;")),-1!=c.indexOf("\x00")&&(c=c.replace(Bb,"&#0;")));return'<iframe width="'+a+'" height="'+b+'" src="'+c+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'};
p.getOptions=function(a){return this.C.namespaces?a?this.C[a].options||[]:this.C.namespaces||[]:[]};
p.getOption=function(a,b){if(this.C.namespaces&&a&&b)return this.C[a][b]};
function Ci(a){if("iframe"!=a.tagName.toLowerCase()){var b=Q(a,"videoid");b&&(b={videoId:b,width:Q(a,"width"),height:Q(a,"height")},new Z(a,b))}}
;function Qi(a,b){var c={title:"Thumbnail",videoId:"",width:120,height:68};if(b)for(var d in b)c[d]=b[d];W.call(this,a,c,"thumbnail")}
pa(Qi,W);Qi.prototype.R=function(){return"/embed/"+R(this.g,"videoId")};
Qi.prototype.P=function(){return{player:0,thumb_width:R(this.g,"thumbWidth"),thumb_height:R(this.g,"thumbHeight"),thumb_align:R(this.g,"thumbAlign")}};
Qi.prototype.N=function(a,b){W.prototype.N.call(this,a,b?b.info:void 0)};
function Ri(a){if("iframe"!=a.tagName.toLowerCase()){var b=Q(a,"videoid");if(b){b={videoId:b,events:{},width:Q(a,"width"),height:Q(a,"height"),thumbWidth:Q(a,"thumb-width"),thumbHeight:Q(a,"thumb-height"),thumbAlign:Q(a,"thumb-align")};var c=Q(a,"onclick");c&&(b.events.onClick=c);new Qi(a,b)}}}
;C("YT.PlayerState.UNSTARTED",-1);C("YT.PlayerState.ENDED",0);C("YT.PlayerState.PLAYING",1);C("YT.PlayerState.PAUSED",2);C("YT.PlayerState.BUFFERING",3);C("YT.PlayerState.CUED",5);C("YT.get",function(a){return kg[a]});
C("YT.scan",ng);C("YT.subscribe",function(a,b,c){Se.subscribe(a,b,c);mg[a]=!0;for(var d in kg)vi(kg[d],a)});
C("YT.unsubscribe",function(a,b,c){Re(a,b,c)});
C("YT.Player",Z);C("YT.Thumbnail",Qi);W.prototype.destroy=W.prototype.destroy;W.prototype.setSize=W.prototype.setSize;W.prototype.getIframe=W.prototype.ta;W.prototype.addEventListener=W.prototype.addEventListener;Z.prototype.getVideoEmbedCode=Z.prototype.getVideoEmbedCode;Z.prototype.getOptions=Z.prototype.getOptions;Z.prototype.getOption=Z.prototype.getOption;lg.push(function(a){a=og("player",a);F(a,Ci)});
lg.push(function(){var a=og("thumbnail");F(a,Ri)});
"undefined"!=typeof YTConfig&&YTConfig.parsetags&&"onload"!=YTConfig.parsetags||ng();var Si=z.onYTReady;Si&&Si();var Ti=z.onYouTubeIframeAPIReady;Ti&&Ti();var Ui=z.onYouTubePlayerAPIReady;Ui&&Ui();}).call(this);
