/*!
 * CanJS - 2.3.27
 * http://canjs.com/
 * Copyright (c) 2017 Bitovi
 * Wed, 11 Jan 2017 15:25:23 GMT
 * Licensed MIT

 * Includes: can/component/component,can/construct/construct,can/map/map,can/list/list,can/compute/compute,can/model/model,can/view/view,can/view/href/href,can/control/control,can/route/route,can/control/route/route,can/view/mustache/mustache
 * Download from: http://bitbuilder.herokuapp.com/can.custom.js?configuration=jquery&includes=can/construct/construct.js,can/map/map.js,can/list/list.js,can/compute/compute.js,can/model/model.js
 */
/*[global-shim-start]*/
(function (exports, global){
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		modules[moduleName] = module && module.exports ? module.exports : result;
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				eval("(function() { " + __load.source + " \n }).call(global);");
			}
		};
	});
})({},window)
/*can/util/can*/
define('can/util/can', [], function () {
    var glbl = typeof window !== 'undefined' ? window : typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : global;
    var can = {};
    if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
        glbl.can = can;
    }
    can.global = glbl;
    can.k = function () {
    };
    can.isDeferred = function (obj) {
        if (!!can.dev) {
            can.dev.warn('can.isDeferred: this function is deprecated and will be removed in a future release. can.isPromise replaces the functionality of can.isDeferred.');
        }
        return obj && typeof obj.then === 'function' && typeof obj.pipe === 'function';
    };
    can.isPromise = function (obj) {
        return !!obj && (window.Promise && obj instanceof Promise || can.isFunction(obj.then) && (can.List === undefined || !(obj instanceof can.List)));
    };
    can.isMapLike = function (obj) {
        return can.Map && (obj instanceof can.Map || obj && obj.___get);
    };
    var cid = 0;
    can.cid = function (object, name) {
        if (!object._cid) {
            cid++;
            object._cid = (name || '') + cid;
        }
        return object._cid;
    };
    can.VERSION = '@EDGE';
    can.simpleExtend = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
    can.last = function (arr) {
        return arr && arr[arr.length - 1];
    };
    can.isDOM = function (el) {
        return (el.ownerDocument || el) === can.global.document;
    };
    can.childNodes = function (node) {
        var childNodes = node.childNodes;
        if ('length' in childNodes) {
            return childNodes;
        } else {
            var cur = node.firstChild;
            var nodes = [];
            while (cur) {
                nodes.push(cur);
                cur = cur.nextSibling;
            }
            return nodes;
        }
    };
    var protoBind = Function.prototype.bind;
    if (protoBind) {
        can.proxy = function (fn, context) {
            return protoBind.call(fn, context);
        };
    } else {
        can.proxy = function (fn, context) {
            return function () {
                return fn.apply(context, arguments);
            };
        };
    }
    can.frag = function (item, doc) {
        var document = doc || can.document || can.global.document;
        var frag;
        if (!item || typeof item === 'string') {
            frag = can.buildFragment(item == null ? '' : '' + item, document);
            if (!frag.childNodes.length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        } else if (item.nodeType === 11) {
            return item;
        } else if (typeof item.nodeType === 'number') {
            frag = document.createDocumentFragment();
            frag.appendChild(item);
            return frag;
        } else if (typeof item.length === 'number') {
            frag = document.createDocumentFragment();
            can.each(item, function (item) {
                frag.appendChild(can.frag(item));
            });
            if (!can.childNodes(frag).length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        } else {
            frag = can.buildFragment('' + item, document);
            if (!can.childNodes(frag).length) {
                frag.appendChild(document.createTextNode(''));
            }
            return frag;
        }
    };
    can.scope = can.viewModel = function (el, attr, val) {
        el = can.$(el);
        var scope = can.data(el, 'scope') || can.data(el, 'viewModel');
        if (!scope) {
            scope = new can.Map();
            can.data(el, 'scope', scope);
            can.data(el, 'viewModel', scope);
        }
        switch (arguments.length) {
        case 0:
        case 1:
            return scope;
        case 2:
            return scope.attr(attr);
        default:
            scope.attr(attr, val);
            return el;
        }
    };
    var parseURI = function (url) {
        var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
        return m ? {
            href: m[0] || '',
            protocol: m[1] || '',
            authority: m[2] || '',
            host: m[3] || '',
            hostname: m[4] || '',
            port: m[5] || '',
            pathname: m[6] || '',
            search: m[7] || '',
            hash: m[8] || ''
        } : null;
    };
    can.joinURIs = function (base, href) {
        function removeDotSegments(input) {
            var output = [];
            input.replace(/^(\.\.?(\/|$))+/, '').replace(/\/(\.(\/|$))+/g, '/').replace(/\/\.\.$/, '/../').replace(/\/?[^\/]*/g, function (p) {
                if (p === '/..') {
                    output.pop();
                } else {
                    output.push(p);
                }
            });
            return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
        }
        href = parseURI(href || '');
        base = parseURI(base || '');
        return !href || !base ? null : (href.protocol || base.protocol) + (href.protocol || href.authority ? href.authority : base.authority) + removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : href.pathname ? (base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname : base.pathname) + (href.protocol || href.authority || href.pathname ? href.search : href.search || base.search) + href.hash;
    };
    can['import'] = function (moduleName, parentName) {
        var deferred = new can.Deferred();
        if (typeof window.System === 'object' && can.isFunction(window.System['import'])) {
            window.System['import'](moduleName, { name: parentName }).then(can.proxy(deferred.resolve, deferred), can.proxy(deferred.reject, deferred));
        } else if (window.define && window.define.amd) {
            window.require([moduleName], function (value) {
                deferred.resolve(value);
            });
        } else if (window.steal) {
            steal.steal(moduleName, function (value) {
                deferred.resolve(value);
            });
        } else if (window.require) {
            deferred.resolve(window.require(moduleName));
        } else {
            deferred.resolve();
        }
        return deferred.promise();
    };
    can.__observe = function () {
    };
    can.isNode = typeof process === 'object' && {}.toString.call(process) === '[object process]';
    can.isBrowserWindow = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof SimpleDOM === 'undefined';
    can.isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
    return can;
});
/*can/util/attr/attr*/
define('can/util/attr/attr', ['can/util/can'], function (can) {
    var setImmediate = can.global.setImmediate || function (cb) {
            return setTimeout(cb, 0);
        }, formElements = {
            'input': true,
            'textarea': true,
            'select': true
        }, hasProperty = function (el, attrName) {
            return attrName in el || can.document && formElements[el.nodeName.toLowerCase()];
        }, attr = {
            MutationObserver: can.global.MutationObserver || can.global.WebKitMutationObserver || can.global.MozMutationObserver,
            map: {
                'class': function (el, val) {
                    val = val || '';
                    if (el.namespaceURI === 'http://www.w3.org/2000/svg') {
                        el.setAttribute('class', val);
                    } else {
                        el.className = val;
                    }
                    return val;
                },
                'value': 'value',
                'innertext': 'innerText',
                'innerhtml': 'innerHTML',
                'textcontent': 'textContent',
                'for': 'htmlFor',
                'checked': true,
                'disabled': true,
                'readonly': function (el, val) {
                    el.readOnly = val || typeof val === 'string' ? true : false;
                    return val;
                },
                'required': true,
                src: function (el, val) {
                    if (val == null || val === '') {
                        el.removeAttribute('src');
                        return null;
                    } else {
                        el.setAttribute('src', val);
                        return val;
                    }
                },
                style: function () {
                    var el = can.global.document && document.createElement('div');
                    if (el && el.style && 'cssText' in el.style) {
                        return function (el, val) {
                            return el.style.cssText = val || '';
                        };
                    } else {
                        return function (el, val) {
                            return el.setAttribute('style', val);
                        };
                    }
                }()
            },
            defaultValue: [
                'input',
                'textarea'
            ],
            setAttrOrProp: function (el, attrName, val) {
                attrName = attrName.toLowerCase();
                var prop = attr.map[attrName];
                if (prop === true && !val) {
                    this.remove(el, attrName);
                } else {
                    this.set(el, attrName, val);
                }
            },
            setSelectValue: function (el, val) {
                if (val != null) {
                    var options = el.getElementsByTagName('option');
                    for (var i = 0; i < options.length; i++) {
                        if (val == options[i].value) {
                            options[i].selected = true;
                            return;
                        }
                    }
                }
                el.selectedIndex = -1;
            },
            set: function (el, attrName, val) {
                var usingMutationObserver = can.isDOM(el) && attr.MutationObserver;
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!usingMutationObserver) {
                    oldValue = attr.get(el, attrName);
                }
                var prop = attr.map[attrName], newValue;
                if (typeof prop === 'function') {
                    newValue = prop(el, val);
                } else if (prop === true && hasProperty(el, attrName)) {
                    newValue = el[attrName] = true;
                    if (attrName === 'checked' && el.type === 'radio') {
                        if (can.inArray((el.nodeName + '').toLowerCase(), attr.defaultValue) >= 0) {
                            el.defaultChecked = true;
                        }
                    }
                } else if (typeof prop === 'string' && hasProperty(el, prop)) {
                    newValue = val;
                    if (el[prop] !== val || el.nodeName.toUpperCase() === 'OPTION') {
                        el[prop] = val;
                    }
                    if (prop === 'value' && can.inArray((el.nodeName + '').toLowerCase(), attr.defaultValue) >= 0) {
                        el.defaultValue = val;
                    }
                } else {
                    attr.setAttribute(el, attrName, val);
                }
                if (!usingMutationObserver && newValue !== oldValue) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            setAttribute: function () {
                var doc = can.global.document;
                if (doc && document.createAttribute) {
                    try {
                        doc.createAttribute('{}');
                    } catch (e) {
                        var invalidNodes = {}, attributeDummy = document.createElement('div');
                        return function (el, attrName, val) {
                            var first = attrName.charAt(0), cachedNode, node;
                            if ((first === '{' || first === '(' || first === '*') && el.setAttributeNode) {
                                cachedNode = invalidNodes[attrName];
                                if (!cachedNode) {
                                    attributeDummy.innerHTML = '<div ' + attrName + '=""></div>';
                                    cachedNode = invalidNodes[attrName] = attributeDummy.childNodes[0].attributes[0];
                                }
                                node = cachedNode.cloneNode();
                                node.value = val;
                                el.setAttributeNode(node);
                            } else {
                                el.setAttribute(attrName, val);
                            }
                        };
                    }
                }
                return function (el, attrName, val) {
                    el.setAttribute(attrName, val);
                };
            }(),
            trigger: function (el, attrName, oldValue) {
                if (can.data(can.$(el), 'canHasAttributesBindings')) {
                    attrName = attrName.toLowerCase();
                    return setImmediate(function () {
                        can.trigger(el, {
                            type: 'attributes',
                            attributeName: attrName,
                            target: el,
                            oldValue: oldValue,
                            bubbles: false
                        }, []);
                    });
                }
            },
            get: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var prop = attr.map[attrName];
                if (typeof prop === 'string' && hasProperty(el, prop)) {
                    return el[prop];
                } else if (prop === true && hasProperty(el, attrName)) {
                    return el[attrName];
                }
                return el.getAttribute(attrName);
            },
            remove: function (el, attrName) {
                attrName = attrName.toLowerCase();
                var oldValue;
                if (!attr.MutationObserver) {
                    oldValue = attr.get(el, attrName);
                }
                var setter = attr.map[attrName];
                if (typeof setter === 'function') {
                    setter(el, undefined);
                }
                if (setter === true && hasProperty(el, attrName)) {
                    el[attrName] = false;
                } else if (typeof setter === 'string' && hasProperty(el, setter)) {
                    el[setter] = '';
                } else {
                    el.removeAttribute(attrName);
                }
                if (!attr.MutationObserver && oldValue != null) {
                    attr.trigger(el, attrName, oldValue);
                }
            },
            has: function () {
                var el = can.global.document && document.createElement('div');
                if (el && el.hasAttribute) {
                    return function (el, name) {
                        return el.hasAttribute(name);
                    };
                } else {
                    return function (el, name) {
                        return el.getAttribute(name) !== null;
                    };
                }
            }()
        };
    return attr;
});
/*can/event/event*/
define('can/event/event', ['can/util/can'], function (can) {
    can.addEvent = function (event, handler) {
        var allEvents = this.__bindEvents || (this.__bindEvents = {}), eventList = allEvents[event] || (allEvents[event] = []);
        eventList.push({
            handler: handler,
            name: event
        });
        return this;
    };
    can.listenTo = function (other, event, handler) {
        var idedEvents = this.__listenToEvents;
        if (!idedEvents) {
            idedEvents = this.__listenToEvents = {};
        }
        var otherId = can.cid(other);
        var othersEvents = idedEvents[otherId];
        if (!othersEvents) {
            othersEvents = idedEvents[otherId] = {
                obj: other,
                events: {}
            };
        }
        var eventsEvents = othersEvents.events[event];
        if (!eventsEvents) {
            eventsEvents = othersEvents.events[event] = [];
        }
        eventsEvents.push(handler);
        can.bind.call(other, event, handler);
    };
    can.stopListening = function (other, event, handler) {
        var idedEvents = this.__listenToEvents, iterIdedEvents = idedEvents, i = 0;
        if (!idedEvents) {
            return this;
        }
        if (other) {
            var othercid = can.cid(other);
            (iterIdedEvents = {})[othercid] = idedEvents[othercid];
            if (!idedEvents[othercid]) {
                return this;
            }
        }
        for (var cid in iterIdedEvents) {
            var othersEvents = iterIdedEvents[cid], eventsEvents;
            other = idedEvents[cid].obj;
            if (!event) {
                eventsEvents = othersEvents.events;
            } else {
                (eventsEvents = {})[event] = othersEvents.events[event];
            }
            for (var eventName in eventsEvents) {
                var handlers = eventsEvents[eventName] || [];
                i = 0;
                while (i < handlers.length) {
                    if (handler && handler === handlers[i] || !handler) {
                        can.unbind.call(other, eventName, handlers[i]);
                        handlers.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                if (!handlers.length) {
                    delete othersEvents.events[eventName];
                }
            }
            if (can.isEmptyObject(othersEvents.events)) {
                delete idedEvents[cid];
            }
        }
        return this;
    };
    can.removeEvent = function (event, fn, __validate) {
        if (!this.__bindEvents) {
            return this;
        }
        var events = this.__bindEvents[event] || [], i = 0, ev, isFunction = typeof fn === 'function';
        while (i < events.length) {
            ev = events[i];
            if (__validate ? __validate(ev, event, fn) : isFunction && ev.handler === fn || !isFunction && (ev.cid === fn || !fn)) {
                events.splice(i, 1);
            } else {
                i++;
            }
        }
        return this;
    };
    can.dispatch = function (event, args) {
        var events = this.__bindEvents;
        if (!events) {
            return;
        }
        var eventName;
        if (typeof event === 'string') {
            eventName = event;
            event = { type: event };
        } else {
            eventName = event.type;
        }
        var handlers = events[eventName];
        if (!handlers) {
            return;
        } else {
            handlers = handlers.slice(0);
        }
        var passed = [event];
        if (args) {
            passed.push.apply(passed, args);
        }
        for (var i = 0, len = handlers.length; i < len; i++) {
            handlers[i].handler.apply(this, passed);
        }
        return event;
    };
    can.one = function (event, handler) {
        var one = function () {
            can.unbind.call(this, event, one);
            return handler.apply(this, arguments);
        };
        can.bind.call(this, event, one);
        return this;
    };
    can.event = {
        on: function () {
            if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                return can.Control.prototype.on.call(this);
            } else {
                return can.addEvent.apply(this, arguments);
            }
        },
        off: function () {
            if (arguments.length === 0 && can.Control && this instanceof can.Control) {
                return can.Control.prototype.off.call(this);
            } else {
                return can.removeEvent.apply(this, arguments);
            }
        },
        bind: can.addEvent,
        unbind: can.removeEvent,
        delegate: function (selector, event, handler) {
            return can.addEvent.call(this, event, handler);
        },
        undelegate: function (selector, event, handler) {
            return can.removeEvent.call(this, event, handler);
        },
        trigger: can.dispatch,
        one: can.one,
        addEvent: can.addEvent,
        removeEvent: can.removeEvent,
        listenTo: can.listenTo,
        stopListening: can.stopListening,
        dispatch: can.dispatch
    };
    return can.event;
});
/*can/util/fragment*/
define('can/util/fragment', ['can/util/can'], function (can) {
    var fragmentRE = /^\s*<(\w+)[^>]*>/, toString = {}.toString, fragment = function (html, name, doc) {
            if (name === undefined) {
                name = fragmentRE.test(html) && RegExp.$1;
            }
            if (html && toString.call(html.replace) === '[object Function]') {
                html = html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, '<$1></$2>');
            }
            var container = doc.createElement('div'), temp = doc.createElement('div');
            if (name === 'tbody' || name === 'tfoot' || name === 'thead' || name === 'colgroup') {
                temp.innerHTML = '<table>' + html + '</table>';
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
            } else if (name === 'col') {
                temp.innerHTML = '<table><colgroup>' + html + '</colgroup></table>';
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild;
            } else if (name === 'tr') {
                temp.innerHTML = '<table><tbody>' + html + '</tbody></table>';
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild;
            } else if (name === 'td' || name === 'th') {
                temp.innerHTML = '<table><tbody><tr>' + html + '</tr></tbody></table>';
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild.firstChild;
            } else if (name === 'option') {
                temp.innerHTML = '<select>' + html + '</select>';
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
            } else {
                container.innerHTML = '' + html;
            }
            var tmp = {}, children = can.childNodes(container);
            tmp.length = children.length;
            for (var i = 0; i < children.length; i++) {
                tmp[i] = children[i];
            }
            return [].slice.call(tmp);
        };
    can.buildFragment = function (html, doc) {
        if (html && html.nodeType === 11) {
            return html;
        }
        if (!doc) {
            doc = document;
        } else if (doc.length) {
            doc = doc[0];
        }
        var parts = fragment(html, undefined, doc), frag = (doc || document).createDocumentFragment();
        for (var i = 0, length = parts.length; i < length; i++) {
            frag.appendChild(parts[i]);
        }
        return frag;
    };
    (function () {
        var text = '<-\n>', frag = can.buildFragment(text, document);
        if (text !== frag.firstChild.nodeValue) {
            var oldBuildFragment = can.buildFragment;
            can.buildFragment = function (html, nodes) {
                var res = oldBuildFragment(html, nodes);
                if (res.childNodes.length === 1 && res.childNodes[0].nodeType === 3) {
                    res.childNodes[0].nodeValue = html;
                }
                return res;
            };
        }
    }());
    return can;
});
/*can/util/array/isArrayLike*/
define('can/util/array/isArrayLike', ['can/util/can'], function (can) {
    can.isArrayLike = function (obj) {
        var length = obj && typeof obj !== 'boolean' && typeof obj !== 'number' && 'length' in obj && obj.length;
        return typeof arr !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    };
});
/*can/util/array/each*/
define('can/util/array/each', [
    'can/util/can',
    'can/util/array/isArrayLike'
], function (can) {
    can.each = function (elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (can.isArrayLike(elements)) {
                if (can.List && elements instanceof can.List) {
                    for (len = elements.attr('length'); i < len; i++) {
                        item = elements.attr(i);
                        if (callback.call(context || item, item, i, elements) === false) {
                            break;
                        }
                    }
                } else {
                    for (len = elements.length; i < len; i++) {
                        item = elements[i];
                        if (callback.call(context || item, item, i, elements) === false) {
                            break;
                        }
                    }
                }
            } else if (typeof elements === 'object') {
                if (can.Map && elements instanceof can.Map || elements === can.route) {
                    var keys = can.Map.keys(elements);
                    for (i = 0, len = keys.length; i < len; i++) {
                        key = keys[i];
                        item = elements.attr(key);
                        if (callback.call(context || item, item, key, elements) === false) {
                            break;
                        }
                    }
                } else {
                    for (key in elements) {
                        if (Object.prototype.hasOwnProperty.call(elements, key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                            break;
                        }
                    }
                }
            }
        }
        return elements;
    };
    return can;
});
/*can/util/inserted/inserted*/
define('can/util/inserted/inserted', ['can/util/can'], function (can) {
    can.inserted = function (elems, document) {
        if (!elems.length) {
            return;
        }
        elems = can.makeArray(elems);
        var doc = document || elems[0].ownerDocument || elems[0], inDocument = false, root = can.$(doc.contains ? doc : doc.body), children;
        for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
            if (!inDocument) {
                if (elem.getElementsByTagName) {
                    if (can.has(root, elem).length) {
                        inDocument = true;
                    } else {
                        return;
                    }
                } else {
                    continue;
                }
            }
            if (inDocument && elem.getElementsByTagName) {
                children = can.makeArray(elem.getElementsByTagName('*'));
                can.trigger(elem, 'inserted', [], false);
                for (var j = 0, child; (child = children[j]) !== undefined; j++) {
                    can.trigger(child, 'inserted', [], false);
                }
            }
        }
    };
    can.appendChild = function (el, child, document) {
        var children;
        if (child.nodeType === 11) {
            children = can.makeArray(can.childNodes(child));
        } else {
            children = [child];
        }
        el.appendChild(child);
        can.inserted(children, document);
    };
    can.insertBefore = function (el, child, ref, document) {
        var children;
        if (child.nodeType === 11) {
            children = can.makeArray(can.childNodes(child));
        } else {
            children = [child];
        }
        el.insertBefore(child, ref);
        can.inserted(children, document);
    };
});
/*can/util/jquery/jquery*/
define('can/util/jquery/jquery', [
    'jquery/dist/jquery',
    'can/util/can',
    'can/util/attr/attr',
    'can/event/event',
    'can/util/fragment',
    'can/util/array/each',
    'can/util/inserted/inserted'
], function ($, can, attr, event) {
    var isBindableElement = function (node) {
        return node.nodeName && (node.nodeType === 1 || node.nodeType === 9) || node == window || node.addEventListener;
    };
    $ = $ || window.jQuery;
    $.extend(can, $, {
        trigger: function (obj, event, args, bubbles) {
            if (isBindableElement(obj)) {
                $.event.trigger(event, args, obj, !bubbles);
            } else if (obj.trigger) {
                obj.trigger(event, args);
            } else {
                if (typeof event === 'string') {
                    event = { type: event };
                }
                event.target = event.target || obj;
                if (args) {
                    if (args.length && typeof args === 'string') {
                        args = [args];
                    } else if (!args.length) {
                        args = [args];
                    }
                }
                if (!args) {
                    args = [];
                }
                can.dispatch.call(obj, event, args);
            }
        },
        event: can.event,
        addEvent: can.addEvent,
        removeEvent: can.removeEvent,
        buildFragment: can.buildFragment,
        $: $,
        each: can.each,
        bind: function (ev, cb) {
            if (this.bind && this.bind !== can.bind) {
                this.bind(ev, cb);
            } else if (isBindableElement(this)) {
                $.event.add(this, ev, cb);
            } else {
                can.addEvent.call(this, ev, cb);
            }
            return this;
        },
        unbind: function (ev, cb) {
            if (this.unbind && this.unbind !== can.unbind) {
                this.unbind(ev, cb);
            } else if (isBindableElement(this)) {
                $.event.remove(this, ev, cb);
            } else {
                can.removeEvent.call(this, ev, cb);
            }
            return this;
        },
        delegate: function (selector, ev, cb) {
            if (this.delegate) {
                this.delegate(selector, ev, cb);
            } else if (isBindableElement(this)) {
                $(this).delegate(selector, ev, cb);
            } else {
                can.bind.call(this, ev, cb);
            }
            return this;
        },
        undelegate: function (selector, ev, cb) {
            if (this.undelegate) {
                this.undelegate(selector, ev, cb);
            } else if (isBindableElement(this)) {
                $(this).undelegate(selector, ev, cb);
            } else {
                can.unbind.call(this, ev, cb);
            }
            return this;
        },
        proxy: can.proxy,
        attr: attr
    });
    can.on = can.bind;
    can.off = can.unbind;
    $.each([
        'append',
        'filter',
        'addClass',
        'remove',
        'data',
        'get',
        'has'
    ], function (i, name) {
        can[name] = function (wrapped) {
            return wrapped[name].apply(wrapped, can.makeArray(arguments).slice(1));
        };
    });
    var oldClean = $.cleanData;
    $.cleanData = function (elems) {
        $.each(elems, function (i, elem) {
            if (elem) {
                can.trigger(elem, 'removed', [], false);
            }
        });
        oldClean(elems);
    };
    var oldDomManip = $.fn.domManip, cbIndex;
    $.fn.domManip = function (args, cb1, cb2) {
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] === 'function') {
                cbIndex = i;
                break;
            }
        }
        return oldDomManip.apply(this, arguments);
    };
    $(document.createElement('div')).append(document.createElement('div'));
    var getChildNodes = function (node) {
        var childNodes = node.childNodes;
        if ('length' in childNodes) {
            return can.makeArray(childNodes);
        } else {
            var cur = node.firstChild;
            var nodes = [];
            while (cur) {
                nodes.push(cur);
                cur = cur.nextSibling;
            }
            return nodes;
        }
    };
    if (cbIndex === undefined) {
        $.fn.domManip = oldDomManip;
        can.each([
            'after',
            'prepend',
            'before',
            'append',
            'replaceWith'
        ], function (name) {
            var original = $.fn[name];
            $.fn[name] = function () {
                var elems = [], args = can.makeArray(arguments);
                if (args[0] != null) {
                    if (typeof args[0] === 'string') {
                        args[0] = can.buildFragment(args[0]);
                    }
                    if (args[0].nodeType === 11) {
                        elems = getChildNodes(args[0]);
                    } else if (can.isArrayLike(args[0])) {
                        elems = can.makeArray(args[0]);
                    } else {
                        elems = [args[0]];
                    }
                }
                var ret = original.apply(this, args);
                can.inserted(elems);
                return ret;
            };
        });
    } else {
        $.fn.domManip = cbIndex === 2 ? function (args, table, callback) {
            return oldDomManip.call(this, args, table, function (elem) {
                var elems;
                if (elem.nodeType === 11) {
                    elems = can.makeArray(can.childNodes(elem));
                }
                var ret = callback.apply(this, arguments);
                can.inserted(elems ? elems : [elem]);
                return ret;
            });
        } : function (args, callback) {
            return oldDomManip.call(this, args, function (elem) {
                var elems;
                if (elem.nodeType === 11) {
                    elems = can.makeArray(can.childNodes(elem));
                }
                var ret = callback.apply(this, arguments);
                can.inserted(elems ? elems : [elem]);
                return ret;
            });
        };
    }
    var oldAttr = $.attr;
    $.attr = function (el, attrName) {
        if (can.isDOM(el) && can.attr.MutationObserver) {
            return oldAttr.apply(this, arguments);
        } else {
            var oldValue, newValue;
            if (arguments.length >= 3) {
                oldValue = oldAttr.call(this, el, attrName);
            }
            var res = oldAttr.apply(this, arguments);
            if (arguments.length >= 3) {
                newValue = oldAttr.call(this, el, attrName);
            }
            if (newValue !== oldValue) {
                can.attr.trigger(el, attrName, oldValue);
            }
            return res;
        }
    };
    var oldRemove = $.removeAttr;
    $.removeAttr = function (el, attrName) {
        if (can.isDOM(el) && can.attr.MutationObserver) {
            return oldRemove.apply(this, arguments);
        } else {
            var oldValue = oldAttr.call(this, el, attrName), res = oldRemove.apply(this, arguments);
            if (oldValue != null) {
                can.attr.trigger(el, attrName, oldValue);
            }
            return res;
        }
    };
    $.event.special.attributes = {
        setup: function () {
            if (can.isDOM(this) && can.attr.MutationObserver) {
                var self = this;
                var observer = new can.attr.MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                        var copy = can.simpleExtend({}, mutation);
                        can.trigger(self, copy, []);
                    });
                });
                observer.observe(this, {
                    attributes: true,
                    attributeOldValue: true
                });
                can.data(can.$(this), 'canAttributesObserver', observer);
            } else {
                can.data(can.$(this), 'canHasAttributesBindings', true);
            }
        },
        teardown: function () {
            if (can.isDOM(this) && can.attr.MutationObserver) {
                can.data(can.$(this), 'canAttributesObserver').disconnect();
                $.removeData(this, 'canAttributesObserver');
            } else {
                $.removeData(this, 'canHasAttributesBindings');
            }
        }
    };
    $.event.special.inserted = {};
    $.event.special.removed = {};
    return can;
});
/*can/util/util*/
define('can/util/util', ['can/util/jquery/jquery'], function (can) {
    return can;
});
/*can/view/view*/
define('can/view/view', ['can/util/util'], function (can) {
    var isFunction = can.isFunction, makeArray = can.makeArray, hookupId = 1;
    var makeRenderer = function (textRenderer) {
        var renderer = function () {
            return $view.frag(textRenderer.apply(this, arguments));
        };
        renderer.render = function () {
            return textRenderer.apply(textRenderer, arguments);
        };
        return renderer;
    };
    var checkText = function (text, url) {
        if (!text.length) {
            throw new Error('can.view: No template or empty template:' + url);
        }
    };
    var getRenderer = function (obj, async) {
        if (isFunction(obj)) {
            var def = can.Deferred();
            return def.resolve(obj);
        }
        var url = typeof obj === 'string' ? obj : obj.url, suffix = obj.engine && '.' + obj.engine || url.match(/\.[\w\d]+$/), type, el, id;
        if (url.match(/^#/)) {
            url = url.substr(1);
        }
        if (el = document.getElementById(url)) {
            suffix = '.' + el.type.match(/\/(x\-)?(.+)/)[2];
        }
        if (!suffix && !$view.cached[url]) {
            url += suffix = $view.ext;
        }
        if (can.isArray(suffix)) {
            suffix = suffix[0];
        }
        id = $view.toId(url);
        if (url.match(/^\/\//)) {
            url = url.substr(2);
            url = !window.steal ? url : steal.config().root.mapJoin('' + steal.id(url));
        }
        if (window.require) {
            if (require.toUrl) {
                url = require.toUrl(url);
            }
        }
        type = $view.types[suffix];
        if ($view.cached[id]) {
            return $view.cached[id];
        } else if (el) {
            return $view.registerView(id, el.innerHTML, type);
        } else {
            var d = new can.Deferred();
            can.ajax({
                async: async,
                url: url,
                dataType: 'text',
                error: function (jqXHR) {
                    checkText('', url);
                    d.reject(jqXHR);
                },
                success: function (text) {
                    checkText(text, url);
                    $view.registerView(id, text, type, d);
                }
            });
            return d;
        }
    };
    var getDeferreds = function (data) {
        var deferreds = [];
        if (can.isPromise(data)) {
            return [data];
        } else {
            for (var prop in data) {
                if (can.isPromise(data[prop])) {
                    deferreds.push(data[prop]);
                }
            }
        }
        return deferreds;
    };
    var usefulPart = function (resolved) {
        return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved;
    };
    var $view = can.view = can.template = function (view, data, helpers, callback) {
        if (isFunction(helpers)) {
            callback = helpers;
            helpers = undefined;
        }
        return $view.renderAs('fragment', view, data, helpers, callback);
    };
    can.extend($view, {
        frag: function (result, parentNode) {
            return $view.hookup($view.fragment(result), parentNode);
        },
        fragment: function (result) {
            return can.frag(result, document);
        },
        toId: function (src) {
            return can.map(src.toString().split(/\/|\./g), function (part) {
                if (part) {
                    return part;
                }
            }).join('_');
        },
        toStr: function (txt) {
            return txt == null ? '' : '' + txt;
        },
        hookup: function (fragment, parentNode) {
            var hookupEls = [], id, func;
            can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (node) {
                if (node.nodeType === 1) {
                    hookupEls.push(node);
                    hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                }
            });
            can.each(hookupEls, function (el) {
                if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                    func(el, parentNode, id);
                    delete $view.hookups[id];
                    el.removeAttribute('data-view-id');
                }
            });
            return fragment;
        },
        hookups: {},
        hook: function (cb) {
            $view.hookups[++hookupId] = cb;
            return ' data-view-id=\'' + hookupId + '\'';
        },
        cached: {},
        cachedRenderers: {},
        cache: true,
        register: function (info) {
            this.types['.' + info.suffix] = info;
            can[info.suffix] = $view[info.suffix] = function (id, text) {
                var renderer, renderFunc;
                if (!text) {
                    renderFunc = function () {
                        if (!renderer) {
                            if (info.fragRenderer) {
                                renderer = info.fragRenderer(null, id);
                            } else {
                                renderer = makeRenderer(info.renderer(null, id));
                            }
                        }
                        return renderer.apply(this, arguments);
                    };
                    renderFunc.render = function () {
                        var textRenderer = info.renderer(null, id);
                        return textRenderer.apply(textRenderer, arguments);
                    };
                    return renderFunc;
                }
                var registeredRenderer = function () {
                    if (!renderer) {
                        if (info.fragRenderer) {
                            renderer = info.fragRenderer(id, text);
                        } else {
                            renderer = info.renderer(id, text);
                        }
                    }
                    return renderer.apply(this, arguments);
                };
                if (info.fragRenderer) {
                    return $view.preload(id, registeredRenderer);
                } else {
                    return $view.preloadStringRenderer(id, registeredRenderer);
                }
            };
        },
        types: {},
        ext: '.ejs',
        registerScript: function (type, id, src) {
            return 'can.view.preloadStringRenderer(\'' + id + '\',' + $view.types['.' + type].script(id, src) + ');';
        },
        preload: function (id, renderer) {
            var def = $view.cached[id] = new can.Deferred().resolve(function (data, helpers) {
                return renderer.call(data, data, helpers);
            });
            def.__view_id = id;
            $view.cachedRenderers[id] = renderer;
            return renderer;
        },
        preloadStringRenderer: function (id, stringRenderer) {
            return this.preload(id, makeRenderer(stringRenderer));
        },
        render: function (view, data, helpers, callback, nodelist) {
            return can.view.renderAs('string', view, data, helpers, callback, nodelist);
        },
        renderTo: function (format, renderer, data, helpers, nodelist) {
            return (format === 'string' && renderer.render ? renderer.render : renderer)(data, helpers, nodelist);
        },
        renderAs: function (format, view, data, helpers, callback, nodelist) {
            if (callback !== undefined && typeof callback.expression === 'string') {
                nodelist = callback;
                callback = undefined;
            }
            if (isFunction(helpers)) {
                callback = helpers;
                helpers = undefined;
            }
            var deferreds = getDeferreds(data);
            var deferred, dataCopy, async, response;
            if (deferreds.length) {
                deferred = new can.Deferred();
                dataCopy = can.extend({}, data);
                deferreds.push(getRenderer(view, true));
                can.when.apply(can, deferreds).then(function (resolved) {
                    var objs = makeArray(arguments), renderer = objs.pop(), result;
                    if (can.isPromise(data)) {
                        dataCopy = usefulPart(resolved);
                    } else {
                        for (var prop in data) {
                            if (can.isPromise(data[prop])) {
                                dataCopy[prop] = usefulPart(objs.shift());
                            }
                        }
                    }
                    result = can.view.renderTo(format, renderer, dataCopy, helpers, nodelist);
                    deferred.resolve(result, dataCopy);
                    if (callback) {
                        callback(result, dataCopy);
                    }
                }, function () {
                    deferred.reject.apply(deferred, arguments);
                });
                return deferred;
            } else {
                async = isFunction(callback);
                deferred = can.__notObserve(getRenderer)(view, async);
                if (async) {
                    response = deferred;
                    deferred.then(function (renderer) {
                        callback(data ? can.view.renderTo(format, renderer, data, helpers, nodelist) : renderer);
                    });
                } else {
                    if (deferred.state() === 'resolved' && deferred.__view_id) {
                        var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                        return data ? can.view.renderTo(format, currentRenderer, data, helpers, nodelist) : currentRenderer;
                    } else {
                        deferred.then(function (renderer) {
                            response = data ? can.view.renderTo(format, renderer, data, helpers, nodelist) : renderer;
                        });
                    }
                }
                return response;
            }
        },
        registerView: function (id, text, type, def) {
            var info = typeof type === 'object' ? type : $view.types[type || $view.ext], renderer;
            if (info.fragRenderer) {
                renderer = info.fragRenderer(id, text);
            } else {
                renderer = makeRenderer(info.renderer(id, text));
            }
            def = def || new can.Deferred();
            if ($view.cache) {
                $view.cached[id] = def;
                def.__view_id = id;
                $view.cachedRenderers[id] = renderer;
            }
            return def.resolve(renderer);
        },
        simpleHelper: function (fn) {
            return function () {
                var realArgs = [];
                var fnArgs = arguments;
                can.each(fnArgs, function (val, i) {
                    if (i <= fnArgs.length) {
                        while (val && val.isComputed) {
                            val = val();
                        }
                        realArgs.push(val);
                    }
                });
                return fn.apply(this, realArgs);
            };
        }
    });
    return can;
});
/*can/view/callbacks/callbacks*/
define('can/view/callbacks/callbacks', [
    'can/util/util',
    'can/view/view'
], function (can) {
    var attr = can.view.attr = function (attributeName, attrHandler) {
        if (attrHandler) {
            if (typeof attributeName === 'string') {
                attributes[attributeName] = attrHandler;
            } else {
                regExpAttributes.push({
                    match: attributeName,
                    handler: attrHandler
                });
            }
        } else {
            var cb = attributes[attributeName];
            if (!cb) {
                for (var i = 0, len = regExpAttributes.length; i < len; i++) {
                    var attrMatcher = regExpAttributes[i];
                    if (attrMatcher.match.test(attributeName)) {
                        cb = attrMatcher.handler;
                        break;
                    }
                }
            }
            return cb;
        }
    };
    var attributes = {}, regExpAttributes = [], automaticCustomElementCharacters = /[-\:]/;
    var tag = can.view.tag = function (tagName, tagHandler) {
        if (tagHandler) {
            if (can.global.html5) {
                can.global.html5.elements += ' ' + tagName;
                can.global.html5.shivDocument();
            }
            tags[tagName.toLowerCase()] = tagHandler;
        } else {
            var cb = tags[tagName.toLowerCase()];
            if (!cb && automaticCustomElementCharacters.test(tagName)) {
                cb = function () {
                };
            }
            return cb;
        }
    };
    var tags = {};
    can.view.callbacks = {
        _tags: tags,
        _attributes: attributes,
        _regExpAttributes: regExpAttributes,
        tag: tag,
        attr: attr,
        tagHandler: function (el, tagName, tagData) {
            var helperTagCallback = tagData.options.get('tags.' + tagName, { proxyMethods: false }), tagCallback = helperTagCallback || tags[tagName];
            var scope = tagData.scope, res;
            if (tagCallback) {
                res = can.__notObserve(tagCallback)(el, tagData);
            } else {
                res = scope;
            }
            if (res && tagData.subtemplate) {
                if (scope !== res) {
                    scope = scope.add(res);
                }
                var result = tagData.subtemplate(scope, tagData.options);
                var frag = typeof result === 'string' ? can.view.frag(result) : result;
                can.appendChild(el, frag);
            }
        }
    };
    return can.view.callbacks;
});
/*can/view/elements*/
define('can/view/elements', [
    'can/util/util',
    'can/view/view'
], function (can) {
    var doc = typeof document !== 'undefined' ? document : null;
    var selectsCommentNodes = doc && function () {
        return can.$(document.createComment('~')).length === 1;
    }();
    var elements = {
        tagToContentPropMap: {
            option: doc && 'textContent' in document.createElement('option') ? 'textContent' : 'innerText',
            textarea: 'value'
        },
        attrMap: can.attr.map,
        attrReg: /([^\s=]+)[\s]*=[\s]*/,
        defaultValue: can.attr.defaultValue,
        tagMap: {
            '': 'span',
            colgroup: 'col',
            table: 'tbody',
            tr: 'td',
            ol: 'li',
            ul: 'li',
            tbody: 'tr',
            thead: 'tr',
            tfoot: 'tr',
            select: 'option',
            optgroup: 'option'
        },
        reverseTagMap: {
            col: 'colgroup',
            tr: 'tbody',
            option: 'select',
            td: 'tr',
            th: 'tr',
            li: 'ul'
        },
        selfClosingTags: { col: true },
        getParentNode: function (el, defaultParentNode) {
            return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
        },
        setAttr: can.attr.set,
        getAttr: can.attr.get,
        removeAttr: can.attr.remove,
        contentText: function (text) {
            if (typeof text === 'string') {
                return text;
            }
            if (!text && text !== 0) {
                return '';
            }
            return '' + text;
        },
        after: function (oldElements, newFrag) {
            var last = oldElements[oldElements.length - 1];
            if (last.nextSibling) {
                can.insertBefore(last.parentNode, newFrag, last.nextSibling, can.document);
            } else {
                can.appendChild(last.parentNode, newFrag, can.document);
            }
        },
        replace: function (oldElements, newFrag) {
            var selectedValue, parentNode = oldElements[0].parentNode;
            if (parentNode.nodeName.toUpperCase() === 'SELECT' && parentNode.selectedIndex >= 0) {
                selectedValue = parentNode.value;
            }
            elements.after(oldElements, newFrag);
            if (can.remove(can.$(oldElements)).length < oldElements.length && !selectsCommentNodes) {
                can.each(oldElements, function (el) {
                    if (el.nodeType === 8) {
                        el.parentNode.removeChild(el);
                    }
                });
            }
            if (selectedValue !== undefined) {
                parentNode.value = selectedValue;
            }
        }
    };
    can.view.elements = elements;
    return elements;
});
/*can/util/bind/bind*/
define('can/util/bind/bind', ['can/util/util'], function (can) {
    can.bindAndSetup = function () {
        can.addEvent.apply(this, arguments);
        if (!this.__inSetup) {
            if (!this._bindings) {
                this._bindings = 1;
                if (this._bindsetup) {
                    this._bindsetup();
                }
            } else {
                this._bindings++;
            }
        }
        return this;
    };
    can.unbindAndTeardown = function (event, handler) {
        if (!this.__bindEvents) {
            return this;
        }
        var handlers = this.__bindEvents[event] || [];
        var handlerCount = handlers.length;
        can.removeEvent.apply(this, arguments);
        if (this._bindings === null) {
            this._bindings = 0;
        } else {
            this._bindings = this._bindings - (handlerCount - handlers.length);
        }
        if (!this._bindings && this._bindteardown) {
            this._bindteardown();
        }
        return this;
    };
    return can;
});
/*can/util/batch/batch*/
define('can/util/batch/batch', ['can/util/can'], function (can) {
    var batchNum = 1, transactions = 0, dispatchingBatch = null, collectingBatch = null, batches = [], dispatchingBatches = false;
    can.batch = {
        start: function (batchStopHandler) {
            transactions++;
            if (transactions === 1) {
                var batch = {
                    events: [],
                    callbacks: [],
                    number: batchNum++
                };
                batches.push(batch);
                if (batchStopHandler) {
                    batch.callbacks.push(batchStopHandler);
                }
                collectingBatch = batch;
            }
        },
        stop: function (force, callStart) {
            if (force) {
                transactions = 0;
            } else {
                transactions--;
            }
            if (transactions === 0) {
                collectingBatch = null;
                var batch;
                if (dispatchingBatches === false) {
                    dispatchingBatches = true;
                    var callbacks = [], i;
                    while (batch = batches.shift()) {
                        var events = batch.events;
                        callbacks.push.apply(callbacks, batch.callbacks);
                        dispatchingBatch = batch;
                        can.batch.batchNum = batch.number;
                        var len;
                        if (callStart) {
                            can.batch.start();
                        }
                        for (i = 0, len = events.length; i < len; i++) {
                            can.dispatch.apply(events[i][0], events[i][1]);
                        }
                        can.batch._onDispatchedEvents(batch.number);
                        dispatchingBatch = null;
                        can.batch.batchNum = undefined;
                    }
                    for (i = callbacks.length - 1; i >= 0; i--) {
                        callbacks[i]();
                    }
                    dispatchingBatches = false;
                }
            }
        },
        _onDispatchedEvents: function () {
        },
        trigger: function (item, event, args) {
            if (!item.__inSetup) {
                event = typeof event === 'string' ? { type: event } : event;
                if (collectingBatch) {
                    event.batchNum = collectingBatch.number;
                    collectingBatch.events.push([
                        item,
                        [
                            event,
                            args
                        ]
                    ]);
                } else if (event.batchNum) {
                    can.dispatch.call(item, event, args);
                } else if (batches.length) {
                    can.batch.start();
                    event.batchNum = collectingBatch.number;
                    collectingBatch.events.push([
                        item,
                        [
                            event,
                            args
                        ]
                    ]);
                    can.batch.stop();
                } else {
                    can.dispatch.call(item, event, args);
                }
            }
        },
        afterPreviousEvents: function (handler) {
            var batch = can.last(batches);
            if (batch) {
                var obj = {};
                can.bind.call(obj, 'ready', handler);
                batch.events.push([
                    obj,
                    [
                        { type: 'ready' },
                        []
                    ]
                ]);
            } else {
                handler({});
            }
        },
        after: function (handler) {
            var batch = collectingBatch || dispatchingBatch;
            if (batch) {
                batch.callbacks.push(handler);
            } else {
                handler({});
            }
        }
    };
});
/*can/compute/read*/
define('can/compute/read', ['can/util/util'], function (can) {
    var read = function (parent, reads, options) {
        options = options || {};
        var state = { foundObservable: false };
        var cur = readValue(parent, 0, reads, options, state), type, prev, readLength = reads.length, i = 0;
        while (i < readLength) {
            prev = cur;
            for (var r = 0, readersLength = read.propertyReaders.length; r < readersLength; r++) {
                var reader = read.propertyReaders[r];
                if (reader.test(cur)) {
                    cur = reader.read(cur, reads[i], i, options, state);
                    break;
                }
            }
            i = i + 1;
            cur = readValue(cur, i, reads, options, state, prev);
            type = typeof cur;
            if (i < reads.length && (cur === null || type !== 'function' && type !== 'object')) {
                if (options.earlyExit) {
                    options.earlyExit(prev, i - 1, cur);
                }
                return {
                    value: undefined,
                    parent: prev
                };
            }
        }
        if (cur === undefined) {
            if (options.earlyExit) {
                options.earlyExit(prev, i - 1);
            }
        }
        return {
            value: cur,
            parent: prev
        };
    };
    var isAt = function (index, reads) {
        var prevRead = reads[index - 1];
        return prevRead && prevRead.at;
    };
    var readValue = function (value, index, reads, options, state, prev) {
        var usedValueReader;
        do {
            usedValueReader = false;
            for (var i = 0, len = read.valueReaders.length; i < len; i++) {
                if (read.valueReaders[i].test(value, index, reads, options)) {
                    value = read.valueReaders[i].read(value, index, reads, options, state, prev);
                }
            }
        } while (usedValueReader);
        return value;
    };
    read.valueReaders = [
        {
            name: 'compute',
            test: function (value, i, reads, options) {
                return value && value.isComputed && !isAt(i, reads);
            },
            read: function (value, i, reads, options, state) {
                if (options.readCompute === false && i === reads.length) {
                    return value;
                }
                if (!state.foundObservable && options.foundObservable) {
                    options.foundObservable(value, i);
                    state.foundObservable = true;
                }
                return value instanceof can.Compute ? value.get() : value();
            }
        },
        {
            name: 'function',
            test: function (value, i, reads, options) {
                var type = typeof value;
                return type === 'function' && !value.isComputed && !(can.Construct && value.prototype instanceof can.Construct) && !(can.route && value === can.route);
            },
            read: function (value, i, reads, options, state, prev) {
                if (isAt(i, reads)) {
                    return i === reads.length ? can.proxy(value, prev) : value;
                } else if (options.callMethodsOnObservables && can.isMapLike(prev)) {
                    return value.apply(prev, options.args || []);
                } else if (options.isArgument && i === reads.length) {
                    return options.proxyMethods !== false ? can.proxy(value, prev) : value;
                }
                return value.apply(prev, options.args || []);
            }
        }
    ];
    read.propertyReaders = [
        {
            name: 'map',
            test: can.isMapLike,
            read: function (value, prop, index, options, state) {
                if (!state.foundObservable && options.foundObservable) {
                    options.foundObservable(value, index);
                    state.foundObservable = true;
                }
                var res = value.attr(prop.key);
                if (res !== undefined) {
                    return res;
                } else {
                    return value[prop.key];
                }
            }
        },
        {
            name: 'promise',
            test: function (value) {
                return can.isPromise(value);
            },
            read: function (value, prop, index, options, state) {
                if (!state.foundObservable && options.foundObservable) {
                    options.foundObservable(value, index);
                    state.foundObservable = true;
                }
                var observeData = value.__observeData;
                if (!value.__observeData) {
                    observeData = value.__observeData = {
                        isPending: true,
                        state: 'pending',
                        isResolved: false,
                        isRejected: false,
                        value: undefined,
                        reason: undefined
                    };
                    can.cid(observeData);
                    can.simpleExtend(observeData, can.event);
                    value.then(function (value) {
                        observeData.isPending = false;
                        observeData.isResolved = true;
                        observeData.value = value;
                        observeData.state = 'resolved';
                        observeData.dispatch('state', [
                            'resolved',
                            'pending'
                        ]);
                    }, function (reason) {
                        observeData.isPending = false;
                        observeData.isRejected = true;
                        observeData.reason = reason;
                        observeData.state = 'rejected';
                        observeData.dispatch('state', [
                            'rejected',
                            'pending'
                        ]);
                    });
                }
                can.__observe(observeData, 'state');
                return prop.key in observeData ? observeData[prop.key] : value[prop.key];
            }
        },
        {
            name: 'object',
            test: function () {
                return true;
            },
            read: function (value, prop) {
                if (value == null) {
                    return undefined;
                } else {
                    if (prop.key in value) {
                        return value[prop.key];
                    } else if (prop.at && specialRead[prop.key] && '@' + prop.key in value) {
                        prop.at = false;
                        return value['@' + prop.key];
                    }
                }
            }
        }
    ];
    var specialRead = {
        index: true,
        key: true,
        event: true,
        element: true,
        viewModel: true
    };
    read.write = function (parent, key, value, options) {
        options = options || {};
        if (can.isMapLike(parent)) {
            if (!options.isArgument && parent._data && parent._data[key] && parent._data[key].isComputed) {
                return parent._data[key](value);
            } else {
                return parent.attr(key, value);
            }
        }
        if (parent[key] && parent[key].isComputed) {
            return parent[key](value);
        }
        if (typeof parent === 'object') {
            parent[key] = value;
        }
    };
    read.reads = function (key) {
        var keys = [];
        var last = 0;
        var at = false;
        if (key.charAt(0) === '@') {
            last = 1;
            at = true;
        }
        var keyToAdd = '';
        for (var i = last; i < key.length; i++) {
            var character = key.charAt(i);
            if (character === '.' || character === '@') {
                if (key.charAt(i - 1) !== '\\') {
                    keys.push({
                        key: keyToAdd,
                        at: at
                    });
                    at = character === '@';
                    keyToAdd = '';
                } else {
                    keyToAdd = keyToAdd.substr(0, keyToAdd.length - 1) + '.';
                }
            } else {
                keyToAdd += character;
            }
        }
        keys.push({
            key: keyToAdd,
            at: at
        });
        return keys;
    };
    return read;
});
/*can/compute/get_value_and_bind*/
define('can/compute/get_value_and_bind', ['can/util/util'], function (can) {
    function ObservedInfo(func, context, compute) {
        this.newObserved = {};
        this.oldObserved = null;
        this.func = func;
        this.context = context;
        this.compute = compute;
        this.onDependencyChange = can.proxy(this.onDependencyChange, this);
        this.depth = null;
        this.childDepths = {};
        this.ignore = 0;
        this.inBatch = false;
        this.ready = false;
        compute.observedInfo = this;
        this.setReady = can.proxy(this._setReady, this);
    }
    can.simpleExtend(ObservedInfo.prototype, {
        getPrimaryDepth: function () {
            return this.compute._primaryDepth;
        },
        _setReady: function () {
            this.ready = true;
        },
        getDepth: function () {
            if (this.depth !== null) {
                return this.depth;
            } else {
                return this.depth = this._getDepth();
            }
        },
        _getDepth: function () {
            var max = 0, childDepths = this.childDepths;
            for (var cid in childDepths) {
                if (childDepths[cid] > max) {
                    max = childDepths[cid];
                }
            }
            return max + 1;
        },
        addEdge: function (objEv) {
            objEv.obj.bind(objEv.event, this.onDependencyChange);
            if (objEv.obj.observedInfo) {
                this.childDepths[objEv.obj._cid] = objEv.obj.observedInfo.getDepth();
                this.depth = null;
            }
        },
        removeEdge: function (objEv) {
            objEv.obj.unbind(objEv.event, this.onDependencyChange);
            if (objEv.obj.observedInfo) {
                delete this.childDepths[objEv.obj._cid];
                this.depth = null;
            }
        },
        dependencyChange: function (ev) {
            if (this.bound && this.ready) {
                if (ev.batchNum !== undefined) {
                    if (ev.batchNum !== this.batchNum) {
                        ObservedInfo.registerUpdate(this);
                        this.batchNum = ev.batchNum;
                    }
                } else {
                    this.updateCompute(ev.batchNum);
                }
            }
        },
        onDependencyChange: function (ev, newVal, oldVal) {
            this.dependencyChange(ev, newVal, oldVal);
        },
        updateCompute: function (batchNum) {
            if (this.bound) {
                var oldValue = this.value;
                this.getValueAndBind();
                this.compute.updater(this.value, oldValue, batchNum);
            }
        },
        getValueAndBind: function () {
            this.bound = true;
            this.oldObserved = this.newObserved || {};
            this.ignore = 0;
            this.newObserved = {};
            this.ready = false;
            observedInfoStack.push(this);
            this.value = this.func.call(this.context);
            observedInfoStack.pop();
            this.updateBindings();
            can.batch.afterPreviousEvents(this.setReady);
        },
        updateBindings: function () {
            var newObserved = this.newObserved, oldObserved = this.oldObserved, name, obEv;
            for (name in newObserved) {
                obEv = newObserved[name];
                if (!oldObserved[name]) {
                    this.addEdge(obEv);
                } else {
                    oldObserved[name] = null;
                }
            }
            for (name in oldObserved) {
                obEv = oldObserved[name];
                if (obEv) {
                    this.removeEdge(obEv);
                }
            }
        },
        teardown: function () {
            this.bound = false;
            for (var name in this.newObserved) {
                var ob = this.newObserved[name];
                this.removeEdge(ob);
            }
            this.newObserved = {};
        }
    });
    var updateOrder = [], curPrimaryDepth = Infinity, maxPrimaryDepth = 0, currentBatchNum;
    ObservedInfo.registerUpdate = function (observeInfo, batchNum) {
        var depth = observeInfo.getDepth() - 1;
        var primaryDepth = observeInfo.getPrimaryDepth();
        curPrimaryDepth = Math.min(primaryDepth, curPrimaryDepth);
        maxPrimaryDepth = Math.max(primaryDepth, maxPrimaryDepth);
        var primary = updateOrder[primaryDepth] || (updateOrder[primaryDepth] = {
            observeInfos: [],
            current: Infinity,
            max: 0
        });
        var objs = primary.observeInfos[depth] || (primary.observeInfos[depth] = []);
        objs.push(observeInfo);
        primary.current = Math.min(depth, primary.current);
        primary.max = Math.max(depth, primary.max);
    };
    ObservedInfo.updateUntil = function (primaryDepth, depth) {
        var cur;
        while (true) {
            if (curPrimaryDepth <= maxPrimaryDepth && curPrimaryDepth <= primaryDepth) {
                var primary = updateOrder[curPrimaryDepth];
                if (primary && primary.current <= primary.max) {
                    if (primary.current > depth) {
                        return;
                    }
                    var last = primary.observeInfos[primary.current];
                    if (last && (cur = last.pop())) {
                        cur.updateCompute(currentBatchNum);
                    } else {
                        primary.current++;
                    }
                } else {
                    curPrimaryDepth++;
                }
            } else {
                return;
            }
        }
    };
    ObservedInfo.batchEnd = function (batchNum) {
        var cur;
        currentBatchNum = batchNum;
        while (true) {
            if (curPrimaryDepth <= maxPrimaryDepth) {
                var primary = updateOrder[curPrimaryDepth];
                if (primary && primary.current <= primary.max) {
                    var last = primary.observeInfos[primary.current];
                    if (last && (cur = last.pop())) {
                        cur.updateCompute(batchNum);
                    } else {
                        primary.current++;
                    }
                } else {
                    curPrimaryDepth++;
                }
            } else {
                updateOrder = [];
                curPrimaryDepth = Infinity;
                maxPrimaryDepth = 0;
                return;
            }
        }
    };
    var observedInfoStack = [];
    can.__observe = function (obj, event) {
        var top = observedInfoStack[observedInfoStack.length - 1];
        if (top && !top.ignore) {
            var evStr = event + '', name = obj._cid + '|' + evStr;
            if (top.traps) {
                top.traps.push({
                    obj: obj,
                    event: evStr,
                    name: name
                });
            } else if (!top.newObserved[name]) {
                top.newObserved[name] = {
                    obj: obj,
                    event: evStr
                };
            }
        }
    };
    can.__reading = can.__observe;
    can.__trapObserves = function () {
        if (observedInfoStack.length) {
            var top = observedInfoStack[observedInfoStack.length - 1];
            var traps = top.traps = [];
            return function () {
                top.traps = null;
                return traps;
            };
        } else {
            return function () {
                return [];
            };
        }
    };
    can.__observes = function (observes) {
        var top = observedInfoStack[observedInfoStack.length - 1];
        if (top) {
            for (var i = 0, len = observes.length; i < len; i++) {
                var trap = observes[i], name = trap.name;
                if (!top.newObserved[name]) {
                    top.newObserved[name] = trap;
                }
            }
        }
    };
    can.__isRecordingObserves = function () {
        var len = observedInfoStack.length, last = observedInfoStack[len - 1];
        return len && last.ignore === 0 && last;
    };
    can.__notObserve = function (fn) {
        return function () {
            if (observedInfoStack.length) {
                var top = observedInfoStack[observedInfoStack.length - 1];
                top.ignore++;
                var res = fn.apply(this, arguments);
                top.ignore--;
                return res;
            } else {
                return fn.apply(this, arguments);
            }
        };
    };
    can.batch._onDispatchedEvents = ObservedInfo.batchEnd;
    return ObservedInfo;
});
/*can/compute/proto_compute*/
define('can/compute/proto_compute', [
    'can/util/util',
    'can/util/bind/bind',
    'can/compute/read',
    'can/compute/get_value_and_bind',
    'can/util/batch/batch'
], function (can, bind, read, ObservedInfo) {
    can.Compute = function (getterSetter, context, eventName, bindOnce) {
        can.cid(this, 'compute');
        var args = [];
        for (var i = 0, arglen = arguments.length; i < arglen; i++) {
            args[i] = arguments[i];
        }
        var contextType = typeof args[1];
        if (typeof args[0] === 'function') {
            this._setupGetterSetterFn(args[0], args[1], args[2], args[3]);
        } else if (args[1]) {
            if (contextType === 'string') {
                this._setupProperty(args[0], args[1], args[2]);
            } else if (contextType === 'function') {
                this._setupSetter(args[0], args[1], args[2]);
            } else {
                if (args[1] && args[1].fn) {
                    this._setupAsyncCompute(args[0], args[1]);
                } else {
                    this._setupSettings(args[0], args[1]);
                }
            }
        } else {
            this._setupSimpleValue(args[0]);
        }
        this._args = args;
        this._primaryDepth = 0;
        this.isComputed = true;
    };
    can.simpleExtend(can.Compute.prototype, {
        setPrimaryDepth: function (depth) {
            this._primaryDepth = depth;
        },
        _setupGetterSetterFn: function (getterSetter, context, eventName) {
            this._set = context ? can.proxy(getterSetter, context) : getterSetter;
            this._get = context ? can.proxy(getterSetter, context) : getterSetter;
            this._canObserve = eventName === false ? false : true;
            var handlers = setupComputeHandlers(this, getterSetter, context || this);
            can.simpleExtend(this, handlers);
        },
        _setupProperty: function (target, propertyName, eventName) {
            var isObserve = can.isMapLike(target), self = this, handler;
            if (isObserve) {
                handler = function (ev, newVal, oldVal) {
                    self.updater(newVal, oldVal, ev.batchNum);
                };
                this.hasDependencies = true;
                this._get = function () {
                    return target.attr(propertyName);
                };
                this._set = function (val) {
                    target.attr(propertyName, val);
                };
            } else {
                handler = function () {
                    self.updater(self._get(), self.value);
                };
                this._get = function () {
                    return can.getObject(propertyName, [target]);
                };
                this._set = function (value) {
                    var properties = propertyName.split('.'), leafPropertyName = properties.pop(), targetProperty = can.getObject(properties.join('.'), [target]);
                    targetProperty[leafPropertyName] = value;
                };
            }
            this._on = function (update) {
                can.bind.call(target, eventName || propertyName, handler);
                this.value = this._get();
            };
            this._off = function () {
                return can.unbind.call(target, eventName || propertyName, handler);
            };
        },
        _setupSetter: function (initialValue, setter, eventName) {
            this.value = initialValue;
            this._set = setter;
            can.simpleExtend(this, eventName);
        },
        _setupSettings: function (initialValue, settings) {
            this.value = initialValue;
            this._set = settings.set || this._set;
            this._get = settings.get || this._get;
            if (!settings.__selfUpdater) {
                var self = this, oldUpdater = this.updater;
                this.updater = function () {
                    oldUpdater.call(self, self._get(), self.value);
                };
            }
            this._on = settings.on ? settings.on : this._on;
            this._off = settings.off ? settings.off : this._off;
        },
        _setupAsyncCompute: function (initialValue, settings) {
            var self = this;
            this.value = initialValue;
            this._setUpdates = true;
            this.lastSetValue = new can.Compute(initialValue);
            this._set = function (newVal) {
                if (newVal === self.lastSetValue.get()) {
                    return this.value;
                }
                return self.lastSetValue.set(newVal);
            };
            this._get = function () {
                return getter.call(settings.context, self.lastSetValue.get());
            };
            var getter = settings.fn, bindings;
            if (getter.length === 0) {
                bindings = setupComputeHandlers(this, getter, settings.context);
            } else if (getter.length === 1) {
                bindings = setupComputeHandlers(this, function () {
                    return getter.call(settings.context, self.lastSetValue.get());
                }, settings);
            } else {
                var oldUpdater = this.updater, setValue = function (newVal) {
                        oldUpdater.call(self, newVal, self.value);
                    };
                this.updater = function (newVal) {
                    oldUpdater.call(self, newVal, self.value);
                };
                bindings = setupComputeHandlers(this, function () {
                    var res = getter.call(settings.context, self.lastSetValue.get(), setValue);
                    return res !== undefined ? res : this.value;
                }, this);
            }
            can.simpleExtend(this, bindings);
        },
        _setupSimpleValue: function (initialValue) {
            this.value = initialValue;
        },
        _bindsetup: can.__notObserve(function () {
            this.bound = true;
            this._on(this.updater);
        }),
        _bindteardown: function () {
            this._off(this.updater);
            this.bound = false;
        },
        bind: can.bindAndSetup,
        unbind: can.unbindAndTeardown,
        clone: function (context) {
            if (context && typeof this._args[0] === 'function') {
                this._args[1] = context;
            } else if (context) {
                this._args[2] = context;
            }
            return new can.Compute(this._args[0], this._args[1], this._args[2], this._args[3]);
        },
        _on: can.k,
        _off: can.k,
        get: function () {
            var recordingObservation = can.__isRecordingObserves();
            if (recordingObservation && this._canObserve !== false) {
                can.__observe(this, 'change');
                if (!this.bound) {
                    can.Compute.temporarilyBind(this);
                }
            }
            if (this.bound) {
                if (recordingObservation && this.getDepth && this.getDepth() >= recordingObservation.getDepth()) {
                    ObservedInfo.updateUntil(this.getPrimaryDepth(), this.getDepth());
                }
                return this.value;
            } else {
                return this._get();
            }
        },
        _get: function () {
            return this.value;
        },
        set: function (newVal) {
            var old = this.value;
            var setVal = this._set(newVal, old);
            if (this._setUpdates) {
                return this.value;
            }
            if (this.hasDependencies) {
                return this._get();
            }
            if (setVal === undefined) {
                this.value = this._get();
            } else {
                this.value = setVal;
            }
            updateOnChange(this, this.value, old);
            return this.value;
        },
        _set: function (newVal) {
            return this.value = newVal;
        },
        updater: function (newVal, oldVal, batchNum) {
            this.value = newVal;
            updateOnChange(this, newVal, oldVal, batchNum);
        },
        toFunction: function () {
            return can.proxy(this._computeFn, this);
        },
        _computeFn: function (newVal) {
            if (arguments.length) {
                return this.set(newVal);
            }
            return this.get();
        }
    });
    var updateOnChange = function (compute, newValue, oldValue, batchNum) {
        var valueChanged = newValue !== oldValue && !(newValue !== newValue && oldValue !== oldValue);
        if (valueChanged) {
            can.batch.trigger(compute, {
                type: 'change',
                batchNum: batchNum
            }, [
                newValue,
                oldValue
            ]);
        }
    };
    var setupComputeHandlers = function (compute, func, context) {
        var readInfo = new ObservedInfo(func, context, compute);
        return {
            readInfo: readInfo,
            _on: function () {
                readInfo.getValueAndBind();
                compute.value = readInfo.value;
                compute.hasDependencies = !can.isEmptyObject(readInfo.newObserved);
            },
            _off: function () {
                readInfo.teardown();
            },
            getDepth: function () {
                return readInfo.getDepth();
            },
            getPrimaryDepth: function () {
                return readInfo.getPrimaryDepth();
            }
        };
    };
    can.Compute.temporarilyBind = function (compute) {
        var computeInstance = compute.computeInstance || compute;
        computeInstance.bind('change', can.k);
        if (!computes) {
            computes = [];
            setTimeout(unbindComputes, 10);
        }
        computes.push(computeInstance);
    };
    var computes, unbindComputes = function () {
            for (var i = 0, len = computes.length; i < len; i++) {
                computes[i].unbind('change', can.k);
            }
            computes = null;
        };
    can.Compute.async = function (initialValue, asyncComputer, context) {
        return new can.Compute(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    can.Compute.truthy = function (compute) {
        return new can.Compute(function () {
            var res = compute.get();
            if (typeof res === 'function') {
                res = res.get();
            }
            return !!res;
        });
    };
    can.Compute.read = read;
    can.Compute.set = read.write;
    return can.Compute;
});
/*can/compute/compute*/
define('can/compute/compute', [
    'can/util/util',
    'can/util/bind/bind',
    'can/util/batch/batch',
    'can/compute/proto_compute'
], function (can, bind) {
    can.compute = function (getterSetter, context, eventName, bindOnce) {
        var internalCompute = new can.Compute(getterSetter, context, eventName, bindOnce);
        var bind = internalCompute.bind;
        var unbind = internalCompute.unbind;
        var compute = function (val) {
            if (arguments.length) {
                return internalCompute.set(val);
            }
            return internalCompute.get();
        };
        var cid = can.cid(compute, 'compute');
        var handlerKey = '__handler' + cid;
        compute.bind = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (handler && !computeHandler) {
                computeHandler = handler[handlerKey] = function () {
                    handler.apply(compute, arguments);
                };
            }
            return bind.call(internalCompute, ev, computeHandler);
        };
        compute.unbind = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (computeHandler) {
                delete handler[handlerKey];
                return internalCompute.unbind(ev, computeHandler);
            }
            return unbind.apply(internalCompute, arguments);
        };
        compute.isComputed = internalCompute.isComputed;
        compute.clone = function (ctx) {
            if (typeof getterSetter === 'function') {
                context = ctx;
            }
            return can.compute(getterSetter, context, ctx, bindOnce);
        };
        compute.computeInstance = internalCompute;
        return compute;
    };
    can.compute.truthy = function (compute) {
        return can.compute(function () {
            var res = compute();
            if (typeof res === 'function') {
                res = res();
            }
            return !!res;
        });
    };
    can.compute.async = function (initialValue, asyncComputer, context) {
        return can.compute(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    can.compute.read = can.Compute.read;
    can.compute.set = can.Compute.set;
    can.compute.temporarilyBind = can.Compute.temporarilyBind;
    return can.compute;
});
/*can/view/scope/compute_data*/
define('can/view/scope/compute_data', [
    'can/util/util',
    'can/compute/compute',
    'can/compute/get_value_and_bind'
], function (can, compute, ObservedInfo) {
    var isFastPath = function (computeData) {
        return computeData.reads && computeData.reads.length === 1 && computeData.root instanceof can.Map && !can.isFunction(computeData.root[computeData.reads[0].key]);
    };
    var scopeReader = function (scope, key, options, computeData, newVal) {
        if (arguments.length > 4) {
            var root = computeData.root || computeData.setRoot;
            if (root) {
                if (root.isComputed) {
                    root(newVal);
                } else if (computeData.reads.length) {
                    var last = computeData.reads.length - 1;
                    var obj = computeData.reads.length ? can.compute.read(root, computeData.reads.slice(0, last)).value : root;
                    can.compute.set(obj, computeData.reads[last].key, newVal, options);
                }
            } else {
            }
        } else {
            if (computeData.root) {
                return can.compute.read(computeData.root, computeData.reads, options).value;
            }
            var data = scope.read(key, options);
            computeData.scope = data.scope;
            computeData.initialValue = data.value;
            computeData.reads = data.reads;
            computeData.root = data.rootObserve;
            computeData.setRoot = data.setRoot;
            return data.value;
        }
    };
    return function (scope, key, options) {
        options = options || { args: [] };
        var computeData = {}, scopeRead = function (newVal) {
                if (arguments.length) {
                    return scopeReader(scope, key, options, computeData, newVal);
                } else {
                    return scopeReader(scope, key, options, computeData);
                }
            }, compute = can.compute(undefined, {
                on: function () {
                    readInfo.getValueAndBind();
                    if (isFastPath(computeData)) {
                        readInfo.dependencyChange = function (ev, newVal) {
                            if (typeof newVal !== 'function') {
                                this.newVal = newVal;
                            } else {
                                readInfo.dependencyChange = ObservedInfo.prototype.dependencyChange;
                                readInfo.getValueAndBind = ObservedInfo.prototype.getValueAndBind;
                            }
                            return ObservedInfo.prototype.dependencyChange.call(this, ev);
                        };
                        readInfo.getValueAndBind = function () {
                            this.value = this.newVal;
                        };
                    }
                    compute.computeInstance.value = readInfo.value;
                    compute.computeInstance.hasDependencies = !can.isEmptyObject(readInfo.newObserved);
                },
                off: function () {
                    readInfo.dependencyChange = ObservedInfo.prototype.dependencyChange;
                    readInfo.getValueAndBind = ObservedInfo.prototype.getValueAndBind;
                    readInfo.teardown();
                },
                set: scopeRead,
                get: scopeRead,
                __selfUpdater: true
            }), readInfo = new ObservedInfo(scopeRead, null, compute.computeInstance);
        computeData.compute = compute;
        return computeData;
    };
});
/*can/util/string/string*/
define('can/util/string/string', ['can/util/util'], function (can) {
    var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strReplacer = /\{([^\}]+)\}/g, strQuote = /"/g, strSingleQuote = /'/g, strHyphenMatch = /-+(.)?/g, strCamelMatch = /[a-z][A-Z]/g, getNext = function (obj, prop, add) {
            var result = obj[prop];
            if (result === undefined && add === true) {
                result = obj[prop] = {};
            }
            return result;
        }, isContainer = function (current) {
            return /^f|^o/.test(typeof current);
        }, convertBadValues = function (content) {
            var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
            return '' + (isInvalid ? '' : content);
        };
    can.extend(can, {
        esc: function (content) {
            return convertBadValues(content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, '&#39;');
        },
        getObject: function (name, roots, add) {
            var parts = name ? name.split('.') : [], length = parts.length, current, r = 0, i, container, rootsLength;
            roots = can.isArray(roots) ? roots : [roots || window];
            rootsLength = roots.length;
            if (!length) {
                return roots[0];
            }
            for (r; r < rootsLength; r++) {
                current = roots[r];
                container = undefined;
                for (i = 0; i < length && isContainer(current); i++) {
                    container = current;
                    current = getNext(container, parts[i]);
                }
                if (container !== undefined && current !== undefined) {
                    break;
                }
            }
            if (add === false && current !== undefined) {
                delete container[parts[i - 1]];
            }
            if (add === true && current === undefined) {
                current = roots[0];
                for (i = 0; i < length && isContainer(current); i++) {
                    current = getNext(current, parts[i], true);
                }
            }
            return current;
        },
        capitalize: function (s, cache) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        camelize: function (str) {
            return convertBadValues(str).replace(strHyphenMatch, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        hyphenate: function (str) {
            return convertBadValues(str).replace(strCamelMatch, function (str, offset) {
                return str.charAt(0) + '-' + str.charAt(1).toLowerCase();
            });
        },
        underscore: function (s) {
            return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
        },
        sub: function (str, data, remove) {
            var obs = [];
            str = str || '';
            obs.push(str.replace(strReplacer, function (whole, inside) {
                var ob = can.getObject(inside, data, remove === true ? false : undefined);
                if (ob === undefined || ob === null) {
                    obs = null;
                    return '';
                }
                if (isContainer(ob) && obs) {
                    obs.push(ob);
                    return '';
                }
                return '' + ob;
            }));
            return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
        },
        replacer: strReplacer,
        undHash: strUndHash
    });
    return can;
});
/*can/construct/construct*/
define('can/construct/construct', ['can/util/string/string'], function (can) {
    var initializing = 0;
    var canGetDescriptor;
    try {
        Object.getOwnPropertyDescriptor({});
        canGetDescriptor = true;
    } catch (e) {
        canGetDescriptor = false;
    }
    var getDescriptor = function (newProps, name) {
            var descriptor = Object.getOwnPropertyDescriptor(newProps, name);
            if (descriptor && (descriptor.get || descriptor.set)) {
                return descriptor;
            }
            return null;
        }, inheritGetterSetter = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            var descriptor;
            for (var name in newProps) {
                if (descriptor = getDescriptor(newProps, name)) {
                    this._defineProperty(addTo, oldProps, name, descriptor);
                } else {
                    can.Construct._overwrite(addTo, oldProps, name, newProps[name]);
                }
            }
        }, simpleInherit = function (newProps, oldProps, addTo) {
            addTo = addTo || newProps;
            for (var name in newProps) {
                can.Construct._overwrite(addTo, oldProps, name, newProps[name]);
            }
        };
    can.Construct = function () {
        if (arguments.length) {
            return can.Construct.extend.apply(can.Construct, arguments);
        }
    };
    can.extend(can.Construct, {
        constructorExtends: true,
        newInstance: function () {
            var inst = this.instance(), args;
            if (inst.setup) {
                inst.__inSetup = true;
                args = inst.setup.apply(inst, arguments);
                delete inst.__inSetup;
            }
            if (inst.init) {
                inst.init.apply(inst, args || arguments);
            }
            return inst;
        },
        _inherit: canGetDescriptor ? inheritGetterSetter : simpleInherit,
        _defineProperty: function (what, oldProps, propName, descriptor) {
            Object.defineProperty(what, propName, descriptor);
        },
        _overwrite: function (what, oldProps, propName, val) {
            what[propName] = val;
        },
        setup: function (base, fullName) {
            this.defaults = can.extend(true, {}, base.defaults, this.defaults);
        },
        instance: function () {
            initializing = 1;
            var inst = new this();
            initializing = 0;
            return inst;
        },
        extend: function (name, staticProperties, instanceProperties) {
            var fullName = name, klass = staticProperties, proto = instanceProperties;
            if (typeof fullName !== 'string') {
                proto = klass;
                klass = fullName;
                fullName = null;
            }
            if (!proto) {
                proto = klass;
                klass = null;
            }
            proto = proto || {};
            var _super_class = this, _super = this.prototype, Constructor, parts, current, _fullName, _shortName, propName, shortName, namespace, prototype;
            prototype = this.instance();
            can.Construct._inherit(proto, _super, prototype);
            if (fullName) {
                parts = fullName.split('.');
                shortName = parts.pop();
            } else if (klass && klass.shortName) {
                shortName = klass.shortName;
            } else if (this.shortName) {
                shortName = this.shortName;
            }
            if (typeof constructorName === 'undefined') {
                Constructor = function () {
                    return init.apply(this, arguments);
                };
            }
            function init() {
                if (!initializing) {
                    return this.constructor !== Constructor && arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) : Constructor.newInstance.apply(Constructor, arguments);
                }
            }
            for (propName in _super_class) {
                if (_super_class.hasOwnProperty(propName)) {
                    Constructor[propName] = _super_class[propName];
                }
            }
            can.Construct._inherit(klass, _super_class, Constructor);
            if (fullName) {
                current = can.getObject(parts.join('.'), window, true);
                namespace = current;
                _fullName = can.underscore(fullName.replace(/\./g, '_'));
                _shortName = can.underscore(shortName);
                current[shortName] = Constructor;
            }
            can.extend(Constructor, {
                constructor: Constructor,
                prototype: prototype,
                namespace: namespace,
                _shortName: _shortName,
                fullName: fullName,
                _fullName: _fullName
            });
            if (shortName !== undefined) {
                Constructor.shortName = shortName;
            }
            Constructor.prototype.constructor = Constructor;
            var t = [_super_class].concat(can.makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);
            if (Constructor.init) {
                Constructor.init.apply(Constructor, args || t);
            }
            return Constructor;
        }
    });
    can.Construct.prototype.setup = function () {
    };
    can.Construct.prototype.init = function () {
    };
    return can.Construct;
});
/*can/map/bubble*/
define('can/map/bubble', ['can/util/util'], function (can) {
    var bubble = can.bubble = {
        bind: function (parent, eventName) {
            if (!parent.__inSetup) {
                var bubbleEvents = bubble.events(parent, eventName), len = bubbleEvents.length, bubbleEvent;
                if (!parent._bubbleBindings) {
                    parent._bubbleBindings = {};
                }
                for (var i = 0; i < len; i++) {
                    bubbleEvent = bubbleEvents[i];
                    if (!parent._bubbleBindings[bubbleEvent]) {
                        parent._bubbleBindings[bubbleEvent] = 1;
                        bubble.childrenOf(parent, bubbleEvent);
                    } else {
                        parent._bubbleBindings[bubbleEvent]++;
                    }
                }
            }
        },
        unbind: function (parent, eventName) {
            var bubbleEvents = bubble.events(parent, eventName), len = bubbleEvents.length, bubbleEvent;
            for (var i = 0; i < len; i++) {
                bubbleEvent = bubbleEvents[i];
                if (parent._bubbleBindings) {
                    parent._bubbleBindings[bubbleEvent]--;
                }
                if (parent._bubbleBindings && !parent._bubbleBindings[bubbleEvent]) {
                    delete parent._bubbleBindings[bubbleEvent];
                    bubble.teardownChildrenFrom(parent, bubbleEvent);
                    if (can.isEmptyObject(parent._bubbleBindings)) {
                        delete parent._bubbleBindings;
                    }
                }
            }
        },
        add: function (parent, child, prop) {
            if (child instanceof can.Map && parent._bubbleBindings) {
                for (var eventName in parent._bubbleBindings) {
                    if (parent._bubbleBindings[eventName]) {
                        bubble.teardownFromParent(parent, child, eventName);
                        bubble.toParent(child, parent, prop, eventName);
                    }
                }
            }
        },
        addMany: function (parent, children) {
            for (var i = 0, len = children.length; i < len; i++) {
                bubble.add(parent, children[i], i);
            }
        },
        remove: function (parent, child) {
            if (child instanceof can.Map && parent._bubbleBindings) {
                for (var eventName in parent._bubbleBindings) {
                    if (parent._bubbleBindings[eventName]) {
                        bubble.teardownFromParent(parent, child, eventName);
                    }
                }
            }
        },
        removeMany: function (parent, children) {
            for (var i = 0, len = children.length; i < len; i++) {
                bubble.remove(parent, children[i]);
            }
        },
        set: function (parent, prop, value, current) {
            if (can.isMapLike(value)) {
                bubble.add(parent, value, prop);
            }
            if (can.isMapLike(current)) {
                bubble.remove(parent, current);
            }
            return value;
        },
        events: function (map, boundEventName) {
            return map.constructor._bubbleRule(boundEventName, map);
        },
        toParent: function (child, parent, prop, eventName) {
            can.listenTo.call(parent, child, eventName, function () {
                var args = can.makeArray(arguments), ev = args.shift();
                args[0] = (can.List && parent instanceof can.List ? parent.indexOf(child) : prop) + (args[0] ? '.' + args[0] : '');
                ev.triggeredNS = ev.triggeredNS || {};
                if (ev.triggeredNS[parent._cid]) {
                    return;
                }
                ev.triggeredNS[parent._cid] = true;
                can.trigger(parent, ev, args);
                if (eventName === 'change') {
                    can.trigger(parent, args[0], [
                        args[2],
                        args[3]
                    ]);
                }
            });
        },
        childrenOf: function (parent, eventName) {
            parent._each(function (child, prop) {
                if (child && child.bind) {
                    bubble.toParent(child, parent, prop, eventName);
                }
            });
        },
        teardownFromParent: function (parent, child, eventName) {
            if (child && child.unbind) {
                can.stopListening.call(parent, child, eventName);
            }
        },
        teardownChildrenFrom: function (parent, eventName) {
            parent._each(function (child) {
                bubble.teardownFromParent(parent, child, eventName);
            });
        },
        isBubbling: function (parent, eventName) {
            return parent._bubbleBindings && parent._bubbleBindings[eventName];
        }
    };
    return bubble;
});
/*can/util/object/isplain/isplain*/
define('can/util/object/isplain/isplain', ['can/util/can'], function (can) {
    var core_hasOwn = Object.prototype.hasOwnProperty, isWindow = function (obj) {
            return obj !== null && obj == obj.window;
        }, isPlainObject = function (obj) {
            if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            var key;
            for (key in obj) {
            }
            return key === undefined || core_hasOwn.call(obj, key);
        };
    can.isPlainObject = isPlainObject;
    return can;
});
/*can/map/map_helpers*/
define('can/map/map_helpers', [
    'can/util/util',
    'can/util/object/isplain/isplain'
], function (can) {
    var mapHelpers = {
        attrParts: function (attr, keepKey) {
            if (keepKey) {
                return [attr];
            }
            return typeof attr === 'object' ? attr : ('' + attr).split('.');
        },
        canMakeObserve: function (obj) {
            return obj && !can.isPromise(obj) && (can.isArray(obj) || can.isPlainObject(obj));
        },
        serialize: function () {
            var serializeMap = null;
            return function (map, how, where) {
                var cid = can.cid(map), firstSerialize = false;
                if (!serializeMap) {
                    firstSerialize = true;
                    serializeMap = {
                        attr: {},
                        serialize: {}
                    };
                }
                serializeMap[how][cid] = where;
                map.each(function (val, name) {
                    var result, isObservable = can.isMapLike(val), serialized = isObservable && serializeMap[how][can.cid(val)];
                    if (serialized) {
                        result = serialized;
                    } else {
                        if (map['___' + how]) {
                            result = map['___' + how](name, val);
                        } else {
                            result = mapHelpers.getValue(map, name, val, how);
                        }
                    }
                    if (result !== undefined) {
                        where[name] = result;
                    }
                });
                if (firstSerialize) {
                    serializeMap = null;
                }
                return where;
            };
        }(),
        getValue: function (map, name, val, how) {
            if (can.isMapLike(val)) {
                return val[how]();
            } else {
                return val;
            }
        },
        define: null,
        addComputedAttr: function (map, attrName, compute) {
            map._computedAttrs[attrName] = {
                compute: compute,
                count: 0,
                handler: function (ev, newVal, oldVal) {
                    map._triggerChange(attrName, 'set', newVal, oldVal, ev.batchNum);
                }
            };
        },
        addToMap: function addToMap(obj, instance) {
            var teardown;
            if (!madeMap) {
                teardown = teardownMap;
                madeMap = {};
            }
            var hasCid = obj._cid;
            var cid = can.cid(obj);
            if (!madeMap[cid]) {
                madeMap[cid] = {
                    obj: obj,
                    instance: instance,
                    added: !hasCid
                };
            }
            return teardown;
        },
        getMapFromObject: function (obj) {
            return madeMap && madeMap[obj._cid] && madeMap[obj._cid].instance;
        }
    };
    var madeMap = null;
    var teardownMap = function () {
        for (var cid in madeMap) {
            if (madeMap[cid].added) {
                delete madeMap[cid].obj._cid;
            }
        }
        madeMap = null;
    };
    return mapHelpers;
});
/*can/map/map*/
define('can/map/map', [
    'can/util/util',
    'can/util/bind/bind',
    'can/map/bubble',
    'can/map/map_helpers',
    'can/construct/construct',
    'can/util/batch/batch',
    'can/compute/get_value_and_bind'
], function (can, bind, bubble, mapHelpers) {
    var unobservable = { 'constructor': true };
    var Map = can.Map = can.Construct.extend({
        setup: function () {
            can.Construct.setup.apply(this, arguments);
            this._computedPropertyNames = [];
            if (can.Map) {
                if (!this.defaults) {
                    this.defaults = {};
                }
                for (var prop in this.prototype) {
                    if (prop !== 'define' && prop !== 'constructor' && (typeof this.prototype[prop] !== 'function' || this.prototype[prop].prototype instanceof can.Construct)) {
                        this.defaults[prop] = this.prototype[prop];
                    } else if (this.prototype[prop].isComputed) {
                        this._computedPropertyNames.push(prop);
                    }
                }
                if (mapHelpers.define) {
                    mapHelpers.define(this);
                }
            }
            if (can.List && !(this.prototype instanceof can.List)) {
                this.List = Map.List.extend({ Map: this }, {});
            }
        },
        shortName: 'Map',
        _bubbleRule: function (eventName) {
            return eventName === 'change' || eventName.indexOf('.') >= 0 ? ['change'] : [];
        },
        bind: can.bindAndSetup,
        unbind: can.unbindAndTeardown,
        id: 'id',
        keys: function (map) {
            var keys = [];
            can.__observe(map, '__keys');
            for (var keyName in map._data) {
                keys.push(keyName);
            }
            return keys;
        }
    }, {
        setup: function (obj) {
            if (obj instanceof can.Map) {
                obj = obj.serialize();
            }
            this._data = {};
            can.cid(this, '.map');
            this._setupComputedProperties();
            var teardownMapping = obj && mapHelpers.addToMap(obj, this);
            var defaultValues = this._setupDefaults(obj);
            var data = can.extend(can.extend(true, {}, defaultValues), obj);
            this.attr(data);
            if (teardownMapping) {
                teardownMapping();
            }
        },
        _setupComputedProperties: function () {
            this._computedAttrs = {};
            var computes = this.constructor._computedPropertyNames;
            for (var i = 0, len = computes.length; i < len; i++) {
                var attrName = computes[i];
                mapHelpers.addComputedAttr(this, attrName, this[attrName].clone(this));
            }
        },
        _setupDefaults: function () {
            return this.constructor.defaults || {};
        },
        attr: function (attr, val) {
            var type = typeof attr;
            if (attr === undefined) {
                return this._getAttrs();
            } else if (type !== 'string' && type !== 'number') {
                return this._setAttrs(attr, val);
            } else if (arguments.length === 1) {
                return this._get(attr + '');
            } else {
                this._set(attr + '', val);
                return this;
            }
        },
        _get: function (attr) {
            var dotIndex = attr.indexOf('.');
            if (dotIndex >= 0) {
                var value = this.___get(attr);
                if (value !== undefined) {
                    can.__observe(this, attr);
                    return value;
                }
                var first = attr.substr(0, dotIndex), second = attr.substr(dotIndex + 1);
                var current = this.__get(first);
                return current && current._get ? current._get(second) : undefined;
            } else {
                return this.__get(attr);
            }
        },
        __get: function (attr) {
            if (!unobservable[attr] && !this._computedAttrs[attr]) {
                can.__observe(this, attr);
            }
            return this.___get(attr);
        },
        ___get: function (attr) {
            if (attr !== undefined) {
                var computedAttr = this._computedAttrs[attr];
                if (computedAttr && computedAttr.compute) {
                    return computedAttr.compute();
                } else {
                    return this._data.hasOwnProperty(attr) ? this._data[attr] : undefined;
                }
            } else {
                return this._data;
            }
        },
        _set: function (attr, value, keepKey) {
            var dotIndex = attr.indexOf('.'), current;
            if (dotIndex >= 0 && !keepKey) {
                var first = attr.substr(0, dotIndex), second = attr.substr(dotIndex + 1);
                current = this.__inSetup ? undefined : this.___get(first);
                if (can.isMapLike(current)) {
                    current._set(second, value);
                } else {
                    throw new Error('can.Map: Object does not exist');
                }
            } else {
                current = this.__inSetup ? undefined : this.___get(attr);
                if (this.__convert) {
                    value = this.__convert(attr, value);
                }
                this.__set(attr, this.__type(value, attr), current);
            }
        },
        __type: function (value, prop) {
            if (typeof value === 'object' && !(value instanceof can.Map) && mapHelpers.canMakeObserve(value)) {
                var cached = mapHelpers.getMapFromObject(value);
                if (cached) {
                    return cached;
                }
                if (can.isArray(value)) {
                    var List = can.List;
                    return new List(value);
                } else {
                    var Map = this.constructor.Map || can.Map;
                    return new Map(value);
                }
            }
            return value;
        },
        __set: function (prop, value, current) {
            if (value !== current) {
                var computedAttr = this._computedAttrs[prop];
                var changeType = computedAttr || current !== undefined || this.___get().hasOwnProperty(prop) ? 'set' : 'add';
                this.___set(prop, typeof value === 'object' ? bubble.set(this, prop, value, current) : value);
                if (!computedAttr || !computedAttr.count) {
                    this._triggerChange(prop, changeType, value, current);
                }
                if (typeof current === 'object') {
                    bubble.teardownFromParent(this, current);
                }
            }
        },
        ___set: function (prop, val) {
            var computedAttr = this._computedAttrs[prop];
            if (computedAttr && computedAttr.compute) {
                computedAttr.compute(val);
            } else {
                this._data[prop] = val;
            }
            if (typeof this.constructor.prototype[prop] !== 'function' && !computedAttr) {
                this[prop] = val;
            }
        },
        removeAttr: function (attr) {
            return this._remove(attr);
        },
        _remove: function (attr) {
            var parts = mapHelpers.attrParts(attr), prop = parts.shift(), current = this.___get(prop);
            if (parts.length && current) {
                return current.removeAttr(parts);
            } else {
                if (typeof attr === 'string' && !!~attr.indexOf('.')) {
                    prop = attr;
                }
                this.__remove(prop, current);
                return current;
            }
        },
        __remove: function (prop, current) {
            if (prop in this._data) {
                this.___remove(prop);
                this._triggerChange(prop, 'remove', undefined, current);
            }
        },
        ___remove: function (prop) {
            delete this._data[prop];
            if (!(prop in this.constructor.prototype)) {
                delete this[prop];
            }
        },
        ___serialize: function (name, val) {
            return mapHelpers.getValue(this, name, val, 'serialize');
        },
        _getAttrs: function () {
            return mapHelpers.serialize(this, 'attr', {});
        },
        _setAttrs: function (props, remove) {
            props = can.simpleExtend({}, props);
            var prop, self = this, newVal;
            can.batch.start();
            this._each(function (curVal, prop) {
                if (prop === '_cid') {
                    return;
                }
                newVal = props[prop];
                if (newVal === undefined) {
                    if (remove) {
                        self.removeAttr(prop);
                    }
                    return;
                }
                if (self.__convert) {
                    newVal = self.__convert(prop, newVal);
                }
                if (can.isMapLike(curVal) && mapHelpers.canMakeObserve(newVal)) {
                    curVal.attr(newVal, remove);
                } else if (curVal !== newVal) {
                    self.__set(prop, self.__type(newVal, prop), curVal);
                }
                delete props[prop];
            });
            for (prop in props) {
                if (prop !== '_cid') {
                    newVal = props[prop];
                    this._set(prop, newVal, true);
                }
            }
            can.batch.stop();
            return this;
        },
        serialize: function () {
            return mapHelpers.serialize(this, 'serialize', {});
        },
        _triggerChange: function (attr, how, newVal, oldVal, batchNum) {
            if (bubble.isBubbling(this, 'change')) {
                can.batch.trigger(this, {
                    type: 'change',
                    target: this,
                    batchNum: batchNum
                }, [
                    attr,
                    how,
                    newVal,
                    oldVal
                ]);
            }
            can.batch.trigger(this, {
                type: attr,
                target: this,
                batchNum: batchNum
            }, [
                newVal,
                oldVal
            ]);
            if (how === 'remove' || how === 'add') {
                can.batch.trigger(this, {
                    type: '__keys',
                    target: this,
                    batchNum: batchNum
                });
            }
        },
        _bindsetup: function () {
        },
        _bindteardown: function () {
        },
        one: can.one,
        bind: function (eventName, handler) {
            var computedBinding = this._computedAttrs && this._computedAttrs[eventName];
            if (computedBinding && computedBinding.compute) {
                if (!computedBinding.count) {
                    computedBinding.count = 1;
                    computedBinding.compute.bind('change', computedBinding.handler);
                } else {
                    computedBinding.count++;
                }
            }
            bubble.bind(this, eventName);
            return can.bindAndSetup.apply(this, arguments);
        },
        unbind: function (eventName, handler) {
            var computedBinding = this._computedAttrs && this._computedAttrs[eventName];
            if (computedBinding) {
                if (computedBinding.count === 1) {
                    computedBinding.count = 0;
                    computedBinding.compute.unbind('change', computedBinding.handler);
                } else {
                    computedBinding.count--;
                }
            }
            bubble.unbind(this, eventName);
            return can.unbindAndTeardown.apply(this, arguments);
        },
        compute: function (prop) {
            if (can.isFunction(this.constructor.prototype[prop])) {
                return can.compute(this[prop], this);
            } else {
                var reads = can.compute.read.reads(prop), last = reads.length - 1;
                return can.compute(function (newVal) {
                    if (arguments.length) {
                        can.compute.read(this, reads.slice(0, last)).value.attr(reads[last].key, newVal);
                    } else {
                        return can.compute.read(this, reads, { args: [] }).value;
                    }
                }, this);
            }
        },
        each: function () {
            return can.each.apply(undefined, [this].concat(can.makeArray(arguments)));
        },
        _each: function (callback) {
            var data = this.___get();
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    callback(data[prop], prop);
                }
            }
        },
        dispatch: can.dispatch
    });
    Map.prototype.on = Map.prototype.bind;
    Map.prototype.off = Map.prototype.unbind;
    Map.on = Map.bind;
    Map.off = Map.unbind;
    return Map;
});
/*can/list/list*/
define('can/list/list', [
    'can/util/util',
    'can/map/map',
    'can/map/bubble',
    'can/map/map_helpers'
], function (can, Map, bubble, mapHelpers) {
    var splice = [].splice, spliceRemovesProps = function () {
            var obj = {
                0: 'a',
                length: 1
            };
            splice.call(obj, 0, 1);
            return !obj[0];
        }();
    var list = Map.extend({ Map: Map }, {
            setup: function (instances, options) {
                this.length = 0;
                can.cid(this, '.map');
                this._setupComputedProperties();
                instances = instances || [];
                var teardownMapping;
                if (can.isPromise(instances)) {
                    this.replace(instances);
                } else {
                    teardownMapping = instances.length && mapHelpers.addToMap(instances, this);
                    this.push.apply(this, can.makeArray(instances || []));
                }
                if (teardownMapping) {
                    teardownMapping();
                }
                can.simpleExtend(this, options);
            },
            _triggerChange: function (attr, how, newVal, oldVal) {
                Map.prototype._triggerChange.apply(this, arguments);
                var index = +attr;
                if (!~('' + attr).indexOf('.') && !isNaN(index)) {
                    if (how === 'add') {
                        can.batch.trigger(this, how, [
                            newVal,
                            index
                        ]);
                        can.batch.trigger(this, 'length', [this.length]);
                    } else if (how === 'remove') {
                        can.batch.trigger(this, how, [
                            oldVal,
                            index
                        ]);
                        can.batch.trigger(this, 'length', [this.length]);
                    } else {
                        can.batch.trigger(this, how, [
                            newVal,
                            index
                        ]);
                    }
                }
            },
            ___get: function (attr) {
                if (attr) {
                    var computedAttr = this._computedAttrs[attr];
                    if (computedAttr && computedAttr.compute) {
                        return computedAttr.compute();
                    } else {
                        return this[attr];
                    }
                } else {
                    return this;
                }
            },
            __set: function (prop, value, current) {
                prop = isNaN(+prop) || prop % 1 ? prop : +prop;
                if (typeof prop === 'number' && prop > this.length - 1) {
                    var newArr = new Array(prop + 1 - this.length);
                    newArr[newArr.length - 1] = value;
                    this.push.apply(this, newArr);
                    return newArr;
                }
                return can.Map.prototype.__set.call(this, '' + prop, value, current);
            },
            ___set: function (attr, val) {
                this[attr] = val;
                if (+attr >= this.length) {
                    this.length = +attr + 1;
                }
            },
            __remove: function (prop, current) {
                if (isNaN(+prop)) {
                    delete this[prop];
                    this._triggerChange(prop, 'remove', undefined, current);
                } else {
                    this.splice(prop, 1);
                }
            },
            _each: function (callback) {
                var data = this.___get();
                for (var i = 0; i < data.length; i++) {
                    callback(data[i], i);
                }
            },
            serialize: function () {
                return mapHelpers.serialize(this, 'serialize', []);
            },
            splice: function (index, howMany) {
                var args = can.makeArray(arguments), added = [], i, len, listIndex, allSame = args.length > 2;
                index = index || 0;
                for (i = 0, len = args.length - 2; i < len; i++) {
                    listIndex = i + 2;
                    args[listIndex] = this.__type(args[listIndex], listIndex);
                    added.push(args[listIndex]);
                    if (this[i + index] !== args[listIndex]) {
                        allSame = false;
                    }
                }
                if (allSame && this.length <= added.length) {
                    return added;
                }
                if (howMany === undefined) {
                    howMany = args[1] = this.length - index;
                }
                var removed = splice.apply(this, args);
                if (!spliceRemovesProps) {
                    for (i = this.length; i < removed.length + this.length; i++) {
                        delete this[i];
                    }
                }
                can.batch.start();
                if (howMany > 0) {
                    bubble.removeMany(this, removed);
                    this._triggerChange('' + index, 'remove', undefined, removed);
                }
                if (args.length > 2) {
                    bubble.addMany(this, added);
                    this._triggerChange('' + index, 'add', added, removed);
                }
                can.batch.stop();
                return removed;
            },
            _getAttrs: function () {
                return mapHelpers.serialize(this, 'attr', []);
            },
            _setAttrs: function (items, remove) {
                items = can.makeArray(items);
                can.batch.start();
                this._updateAttrs(items, remove);
                can.batch.stop();
            },
            _updateAttrs: function (items, remove) {
                var len = Math.min(items.length, this.length);
                for (var prop = 0; prop < len; prop++) {
                    var curVal = this[prop], newVal = items[prop];
                    if (can.isMapLike(curVal) && mapHelpers.canMakeObserve(newVal)) {
                        curVal.attr(newVal, remove);
                    } else if (curVal !== newVal) {
                        this._set(prop + '', newVal);
                    } else {
                    }
                }
                if (items.length > this.length) {
                    this.push.apply(this, items.slice(this.length));
                } else if (items.length < this.length && remove) {
                    this.splice(items.length);
                }
            }
        }), getArgs = function (args) {
            return args[0] && can.isArray(args[0]) ? args[0] : can.makeArray(args);
        };
    can.each({
        push: 'length',
        unshift: 0
    }, function (where, name) {
        var orig = [][name];
        list.prototype[name] = function () {
            can.batch.start();
            var args = [], len = where ? this.length : 0, i = arguments.length, res, val;
            while (i--) {
                val = arguments[i];
                args[i] = bubble.set(this, i, this.__type(val, i));
            }
            res = orig.apply(this, args);
            if (!this.comparator || args.length) {
                this._triggerChange('' + len, 'add', args, undefined);
            }
            can.batch.stop();
            return res;
        };
    });
    can.each({
        pop: 'length',
        shift: 0
    }, function (where, name) {
        list.prototype[name] = function () {
            if (!this.length) {
                return undefined;
            }
            var args = getArgs(arguments), len = where && this.length ? this.length - 1 : 0;
            var res = [][name].apply(this, args);
            can.batch.start();
            this._triggerChange('' + len, 'remove', undefined, [res]);
            if (res && res.unbind) {
                bubble.remove(this, res);
            }
            can.batch.stop();
            return res;
        };
    });
    can.extend(list.prototype, {
        indexOf: function (item, fromIndex) {
            can.__observe(this, 'length');
            return can.inArray(item, this, fromIndex);
        },
        join: function () {
            can.__observe(this, 'length');
            return [].join.apply(this, arguments);
        },
        reverse: function () {
            var list = [].reverse.call(can.makeArray(this));
            return this.replace(list);
        },
        slice: function () {
            can.__observe(this, 'length');
            var temp = Array.prototype.slice.apply(this, arguments);
            return new this.constructor(temp);
        },
        concat: function () {
            var args = [];
            can.each(can.makeArray(arguments), function (arg, i) {
                args[i] = arg instanceof can.List ? arg.serialize() : arg;
            });
            return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
        },
        forEach: function (cb, thisarg) {
            return can.each(this, cb, thisarg || this);
        },
        replace: function (newList) {
            if (can.isPromise(newList)) {
                if (this._promise) {
                    this._promise.__isCurrentPromise = false;
                }
                var promise = this._promise = newList;
                promise.__isCurrentPromise = true;
                var self = this;
                newList.then(function (newList) {
                    if (promise.__isCurrentPromise) {
                        self.replace(newList);
                    }
                });
            } else {
                this.splice.apply(this, [
                    0,
                    this.length
                ].concat(can.makeArray(newList || [])));
            }
            return this;
        },
        filter: function (callback, thisArg) {
            var filteredList = new this.constructor(), self = this, filtered;
            this.each(function (item, index, list) {
                filtered = callback.call(thisArg | self, item, index, self);
                if (filtered) {
                    filteredList.push(item);
                }
            });
            return filteredList;
        },
        map: function (callback, thisArg) {
            var filteredList = new can.List(), self = this;
            this.each(function (item, index, list) {
                var mapped = callback.call(thisArg | self, item, index, self);
                filteredList.push(mapped);
            });
            return filteredList;
        }
    });
    can.List = Map.List = list;
    return can.List;
});
/*can/view/scope/scope*/
define('can/view/scope/scope', [
    'can/util/util',
    'can/view/scope/compute_data',
    'can/construct/construct',
    'can/map/map',
    'can/list/list',
    'can/view/view',
    'can/compute/compute'
], function (can, makeComputeData) {
    function Scope(context, parent, meta) {
        this._context = context;
        this._parent = parent;
        this._meta = meta || {};
        this.__cache = {};
    }
    can.simpleExtend(Scope, {
        read: can.compute.read,
        Refs: can.Map.extend({ shortName: 'ReferenceMap' }, {}),
        refsScope: function () {
            return new can.view.Scope(new this.Refs());
        }
    });
    can.simpleExtend(Scope.prototype, {
        add: function (context, meta) {
            if (context !== this._context) {
                return new this.constructor(context, this, meta);
            } else {
                return this;
            }
        },
        read: function (attr, options) {
            if (attr === '%root') {
                return { value: this.getRoot() };
            }
            var isInCurrentContext = attr.substr(0, 2) === './', isInParentContext = attr.substr(0, 3) === '../', isCurrentContext = attr === '.' || attr === 'this', isParentContext = attr === '..', isContextBased = isInCurrentContext || isInParentContext || isCurrentContext || isParentContext;
            if (isContextBased && this._meta.notContext) {
                return this._parent.read(attr, options);
            }
            var currentScopeOnly;
            if (isInCurrentContext) {
                currentScopeOnly = true;
                attr = attr.substr(2);
            } else if (isInParentContext) {
                var parent = this._parent;
                while (parent._meta.notContext) {
                    parent = parent._parent;
                }
                return parent.read(attr.substr(3) || '.', options);
            } else if (isCurrentContext) {
                return { value: this._context };
            } else if (isParentContext) {
                return { value: this._parent._context };
            }
            var keyReads = can.compute.read.reads(attr);
            if (keyReads[0].key.charAt(0) === '*') {
                return this.getRefs()._read(keyReads, options, true);
            } else {
                return this._read(keyReads, options, currentScopeOnly);
            }
        },
        _read: function (keyReads, options, currentScopeOnly) {
            var currentScope = this, currentContext, undefinedObserves = [], currentObserve, currentReads, setObserveDepth = -1, currentSetReads, currentSetObserve, readOptions = can.simpleExtend({
                    foundObservable: function (observe, nameIndex) {
                        currentObserve = observe;
                        currentReads = keyReads.slice(nameIndex);
                    },
                    earlyExit: function (parentValue, nameIndex) {
                        if (nameIndex > setObserveDepth) {
                            currentSetObserve = currentObserve;
                            currentSetReads = currentReads;
                            setObserveDepth = nameIndex;
                        }
                    }
                }, options);
            while (currentScope) {
                currentContext = currentScope._context;
                if (currentContext !== null && (typeof currentContext === 'object' || typeof currentContext === 'function')) {
                    var getObserves = can.__trapObserves();
                    var data = can.compute.read(currentContext, keyReads, readOptions);
                    var observes = getObserves();
                    if (data.value !== undefined) {
                        can.__observes(observes);
                        return {
                            scope: currentScope,
                            rootObserve: currentObserve,
                            value: data.value,
                            reads: currentReads
                        };
                    } else {
                        undefinedObserves.push.apply(undefinedObserves, observes);
                    }
                }
                if (currentScopeOnly) {
                    currentScope = null;
                } else {
                    currentScope = currentScope._parent;
                }
            }
            can.__observes(undefinedObserves);
            return {
                setRoot: currentSetObserve,
                reads: currentSetReads,
                value: undefined
            };
        },
        get: can.__notObserve(function (key, options) {
            options = can.simpleExtend({ isArgument: true }, options);
            var res = this.read(key, options);
            return res.value;
        }),
        getScope: function (tester) {
            var scope = this;
            while (scope) {
                if (tester(scope)) {
                    return scope;
                }
                scope = scope._parent;
            }
        },
        getContext: function (tester) {
            var res = this.getScope(tester);
            return res && res._context;
        },
        getRefs: function () {
            return this.getScope(function (scope) {
                return scope._context instanceof Scope.Refs;
            });
        },
        getRoot: function () {
            var cur = this, child = this;
            while (cur._parent) {
                child = cur;
                cur = cur._parent;
            }
            if (cur._context instanceof Scope.Refs) {
                cur = child;
            }
            return cur._context;
        },
        set: function (key, value, options) {
            var dotIndex = key.lastIndexOf('.'), slashIndex = key.lastIndexOf('/'), contextPath, propName;
            if (slashIndex > dotIndex) {
                contextPath = key.substring(0, slashIndex);
                propName = key.substring(slashIndex + 1, key.length);
            } else {
                if (dotIndex !== -1) {
                    contextPath = key.substring(0, dotIndex);
                    propName = key.substring(dotIndex + 1, key.length);
                } else {
                    contextPath = '.';
                    propName = key;
                }
            }
            if (key.charAt(0) === '*') {
                can.compute.set(this.getRefs()._context, key, value, options);
            } else {
                var context = this.read(contextPath, options).value;
                can.compute.set(context, propName, value, options);
            }
        },
        attr: can.__notObserve(function (key, value, options) {
            options = can.simpleExtend({ isArgument: true }, options);
            if (arguments.length === 2) {
                return this.set(key, value, options);
            } else {
                return this.get(key, options);
            }
        }),
        computeData: function (key, options) {
            return makeComputeData(this, key, options);
        },
        compute: function (key, options) {
            return this.computeData(key, options).compute;
        },
        cloneFromRef: function () {
            var contexts = [];
            var scope = this, context, parent;
            while (scope) {
                context = scope._context;
                if (context instanceof Scope.Refs) {
                    parent = scope._parent;
                    break;
                }
                contexts.unshift(context);
                scope = scope._parent;
            }
            if (parent) {
                can.each(contexts, function (context) {
                    parent = parent.add(context);
                });
                return parent;
            } else {
                return this;
            }
        }
    });
    can.view.Scope = Scope;
    function Options(data, parent, meta) {
        if (!data.helpers && !data.partials && !data.tags) {
            data = { helpers: data };
        }
        Scope.call(this, data, parent, meta);
    }
    Options.prototype = new Scope();
    Options.prototype.constructor = Options;
    can.view.Options = Options;
    return Scope;
});
/*can/view/stache/utils*/
define('can/view/stache/utils', [
    'can/util/util',
    'can/view/scope/scope'
], function (can) {
    var Options = can.view.Options;
    return {
        isArrayLike: function (obj) {
            return obj && obj.splice && typeof obj.length === 'number';
        },
        isObserveLike: function (obj) {
            return obj instanceof can.Map || obj && !!obj._get;
        },
        emptyHandler: function () {
        },
        jsonParse: function (str) {
            if (str[0] === '\'') {
                return str.substr(1, str.length - 2);
            } else if (str === 'undefined') {
                return undefined;
            } else if (can.global.JSON) {
                return JSON.parse(str);
            } else {
                return eval('(' + str + ')');
            }
        },
        mixins: {
            last: function () {
                return this.stack[this.stack.length - 1];
            },
            add: function (chars) {
                this.last().add(chars);
            },
            subSectionDepth: function () {
                return this.stack.length - 1;
            }
        },
        convertToScopes: function (helperOptions, scope, options, nodeList, truthyRenderer, falseyRenderer, isStringOnly) {
            if (truthyRenderer) {
                helperOptions.fn = this.makeRendererConvertScopes(truthyRenderer, scope, options, nodeList, isStringOnly);
            }
            if (falseyRenderer) {
                helperOptions.inverse = this.makeRendererConvertScopes(falseyRenderer, scope, options, nodeList, isStringOnly);
            }
        },
        makeRendererConvertScopes: function (renderer, parentScope, parentOptions, nodeList, observeObservables) {
            var rendererWithScope = function (ctx, opts, parentNodeList) {
                return renderer(ctx || parentScope, opts, parentNodeList);
            };
            var convertedRenderer = function (newScope, newOptions, parentNodeList) {
                if (newScope !== undefined && !(newScope instanceof can.view.Scope)) {
                    newScope = parentScope.add(newScope);
                }
                if (newOptions !== undefined && !(newOptions instanceof Options)) {
                    newOptions = parentOptions.add(newOptions);
                }
                var result = rendererWithScope(newScope, newOptions || parentOptions, parentNodeList || nodeList);
                return result;
            };
            return observeObservables ? convertedRenderer : can.__notObserve(convertedRenderer);
        },
        Options: Options
    };
});
/*can/view/node_lists/node_lists*/
define('can/view/node_lists/node_lists', [
    'can/util/util',
    'can/view/elements'
], function (can) {
    var canExpando = true;
    try {
        document.createTextNode('')._ = 0;
    } catch (ex) {
        canExpando = false;
    }
    var nodeMap = {}, textNodeMap = {}, expando = 'ejs_' + Math.random(), _id = 0, id = function (node, localMap) {
            var _textNodeMap = localMap || textNodeMap;
            var id = readId(node, _textNodeMap);
            if (id) {
                return id;
            } else {
                if (canExpando || node.nodeType !== 3) {
                    ++_id;
                    return node[expando] = (node.nodeName ? 'element_' : 'obj_') + _id;
                } else {
                    ++_id;
                    _textNodeMap['text_' + _id] = node;
                    return 'text_' + _id;
                }
            }
        }, readId = function (node, textNodeMap) {
            if (canExpando || node.nodeType !== 3) {
                return node[expando];
            } else {
                for (var textNodeID in textNodeMap) {
                    if (textNodeMap[textNodeID] === node) {
                        return textNodeID;
                    }
                }
            }
        }, splice = [].splice, push = [].push, itemsInChildListTree = function (list) {
            var count = 0;
            for (var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                if (item.nodeType) {
                    count++;
                } else {
                    count += itemsInChildListTree(item);
                }
            }
            return count;
        }, replacementMap = function (replacements, idMap) {
            var map = {};
            for (var i = 0, len = replacements.length; i < len; i++) {
                var node = nodeLists.first(replacements[i]);
                map[id(node, idMap)] = replacements[i];
            }
            return map;
        }, addUnfoundAsDeepChildren = function (list, rMap, foundIds) {
            for (var repId in rMap) {
                if (!foundIds[repId]) {
                    list.newDeepChildren.push(rMap[repId]);
                }
            }
        };
    var nodeLists = {
        id: id,
        update: function (nodeList, newNodes) {
            var oldNodes = nodeLists.unregisterChildren(nodeList);
            newNodes = can.makeArray(newNodes);
            var oldListLength = nodeList.length;
            splice.apply(nodeList, [
                0,
                oldListLength
            ].concat(newNodes));
            if (nodeList.replacements) {
                nodeLists.nestReplacements(nodeList);
                nodeList.deepChildren = nodeList.newDeepChildren;
                nodeList.newDeepChildren = [];
            } else {
                nodeLists.nestList(nodeList);
            }
            return oldNodes;
        },
        nestReplacements: function (list) {
            var index = 0, idMap = {}, rMap = replacementMap(list.replacements, idMap), rCount = list.replacements.length, foundIds = {};
            while (index < list.length && rCount) {
                var node = list[index], nodeId = readId(node, idMap), replacement = rMap[nodeId];
                if (replacement) {
                    list.splice(index, itemsInChildListTree(replacement), replacement);
                    foundIds[nodeId] = true;
                    rCount--;
                }
                index++;
            }
            if (rCount) {
                addUnfoundAsDeepChildren(list, rMap, foundIds);
            }
            list.replacements = [];
        },
        nestList: function (list) {
            var index = 0;
            while (index < list.length) {
                var node = list[index], childNodeList = nodeMap[id(node)];
                if (childNodeList) {
                    if (childNodeList !== list) {
                        list.splice(index, itemsInChildListTree(childNodeList), childNodeList);
                    }
                } else {
                    nodeMap[id(node)] = list;
                }
                index++;
            }
        },
        last: function (nodeList) {
            var last = nodeList[nodeList.length - 1];
            if (last.nodeType) {
                return last;
            } else {
                return nodeLists.last(last);
            }
        },
        first: function (nodeList) {
            var first = nodeList[0];
            if (first.nodeType) {
                return first;
            } else {
                return nodeLists.first(first);
            }
        },
        flatten: function (nodeList) {
            var items = [];
            for (var i = 0; i < nodeList.length; i++) {
                var item = nodeList[i];
                if (item.nodeType) {
                    items.push(item);
                } else {
                    items.push.apply(items, nodeLists.flatten(item));
                }
            }
            return items;
        },
        register: function (nodeList, unregistered, parent, directlyNested) {
            can.cid(nodeList);
            nodeList.unregistered = unregistered;
            nodeList.parentList = parent;
            nodeList.nesting = parent && typeof parent.nesting !== 'undefined' ? parent.nesting + 1 : 0;
            if (parent) {
                nodeList.deepChildren = [];
                nodeList.newDeepChildren = [];
                nodeList.replacements = [];
                if (parent !== true) {
                    if (directlyNested) {
                        parent.replacements.push(nodeList);
                    } else {
                        parent.newDeepChildren.push(nodeList);
                    }
                }
            } else {
                nodeLists.nestList(nodeList);
            }
            return nodeList;
        },
        unregisterChildren: function (nodeList) {
            var nodes = [];
            can.each(nodeList, function (node) {
                if (node.nodeType) {
                    if (!nodeList.replacements) {
                        delete nodeMap[id(node)];
                    }
                    nodes.push(node);
                } else {
                    push.apply(nodes, nodeLists.unregister(node, true));
                }
            });
            can.each(nodeList.deepChildren, function (nodeList) {
                nodeLists.unregister(nodeList, true);
            });
            return nodes;
        },
        unregister: function (nodeList, isChild) {
            var nodes = nodeLists.unregisterChildren(nodeList, true);
            if (nodeList.unregistered) {
                var unregisteredCallback = nodeList.unregistered;
                nodeList.replacements = nodeList.unregistered = null;
                if (!isChild) {
                    var deepChildren = nodeList.parentList && nodeList.parentList.deepChildren;
                    if (deepChildren) {
                        var index = deepChildren.indexOf(nodeList);
                        if (index !== -1) {
                            deepChildren.splice(index, 1);
                        }
                    }
                }
                unregisteredCallback();
            }
            return nodes;
        },
        nodeMap: nodeMap
    };
    can.view.nodeLists = nodeLists;
    return nodeLists;
});
/*can/view/parser/parser*/
define('can/view/parser/parser', [], function () {
    function each(items, callback) {
        for (var i = 0; i < items.length; i++) {
            callback(items[i], i);
        }
    }
    function makeMap(str) {
        var obj = {}, items = str.split(',');
        each(items, function (name) {
            obj[name] = true;
        });
        return obj;
    }
    function handleIntermediate(intermediate, handler) {
        for (var i = 0, len = intermediate.length; i < len; i++) {
            var item = intermediate[i];
            handler[item.tokenType].apply(handler, item.args);
        }
        return intermediate;
    }
    var alphaNumeric = 'A-Za-z0-9', alphaNumericHU = '-:_' + alphaNumeric, attributeNames = '[^=>\\s\\/]+', spaceEQspace = '\\s*=\\s*', singleCurly = '\\{[^\\}\\{]\\}', doubleCurly = '\\{\\{[^\\}]\\}\\}\\}?', attributeEqAndValue = '(?:' + spaceEQspace + '(?:' + '(?:' + doubleCurly + ')|(?:' + singleCurly + ')|(?:"[^"]*")|(?:\'[^\']*\')|[^>\\s]+))?', matchStash = '\\{\\{[^\\}]*\\}\\}\\}?', stash = '\\{\\{([^\\}]*)\\}\\}\\}?', startTag = new RegExp('^<([' + alphaNumeric + '][' + alphaNumericHU + ']*)' + '(' + '(?:\\s*' + '(?:(?:' + '(?:' + attributeNames + ')?' + attributeEqAndValue + ')|' + '(?:' + matchStash + ')+)' + ')*' + ')\\s*(\\/?)>'), endTag = new RegExp('^<\\/([' + alphaNumericHU + ']+)[^>]*>'), mustache = new RegExp(stash, 'g'), txtBreak = /<|\{\{/, space = /\s/;
    var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');
    var block = makeMap('a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');
    var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
    var caseMatters = makeMap('altGlyph,altGlyphDef,altGlyphItem,animateColor,animateMotion,animateTransform,clipPath,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,foreignObject,glyphRef,linearGradient,radialGradient,textPath');
    var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');
    var special = makeMap('script');
    var tokenTypes = 'start,end,close,attrStart,attrEnd,attrValue,chars,comment,special,done'.split(',');
    var fn = function () {
    };
    var HTMLParser = function (html, handler, returnIntermediate) {
        if (typeof html === 'object') {
            return handleIntermediate(html, handler);
        }
        var intermediate = [];
        handler = handler || {};
        if (returnIntermediate) {
            each(tokenTypes, function (name) {
                var callback = handler[name] || fn;
                handler[name] = function () {
                    if (callback.apply(this, arguments) !== false) {
                        intermediate.push({
                            tokenType: name,
                            args: [].slice.call(arguments, 0)
                        });
                    }
                };
            });
        }
        function parseStartTag(tag, tagName, rest, unary) {
            tagName = caseMatters[tagName] ? tagName : tagName.toLowerCase();
            if (block[tagName] && !inline[tagName]) {
                var last = stack.last();
                while (last && inline[last] && !block[last]) {
                    parseEndTag('', last);
                    last = stack.last();
                }
            }
            if (closeSelf[tagName] && stack.last() === tagName) {
                parseEndTag('', tagName);
            }
            unary = empty[tagName] || !!unary;
            handler.start(tagName, unary);
            if (!unary) {
                stack.push(tagName);
            }
            HTMLParser.parseAttrs(rest, handler);
            handler.end(tagName, unary);
        }
        function parseEndTag(tag, tagName) {
            var pos;
            if (!tagName) {
                pos = 0;
            } else {
                tagName = caseMatters[tagName] ? tagName : tagName.toLowerCase();
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] === tagName) {
                        break;
                    }
                }
            }
            if (pos >= 0) {
                for (var i = stack.length - 1; i >= pos; i--) {
                    if (handler.close) {
                        handler.close(stack[i]);
                    }
                }
                stack.length = pos;
            }
        }
        function parseMustache(mustache, inside) {
            if (handler.special) {
                handler.special(inside);
            }
        }
        var callChars = function () {
            if (charsText) {
                if (handler.chars) {
                    handler.chars(charsText);
                }
            }
            charsText = '';
        };
        var index, chars, match, stack = [], last = html, charsText = '';
        stack.last = function () {
            return this[this.length - 1];
        };
        while (html) {
            chars = true;
            if (!stack.last() || !special[stack.last()]) {
                if (html.indexOf('<!--') === 0) {
                    index = html.indexOf('-->');
                    if (index >= 0) {
                        callChars();
                        if (handler.comment) {
                            handler.comment(html.substring(4, index));
                        }
                        html = html.substring(index + 3);
                        chars = false;
                    }
                } else if (html.indexOf('</') === 0) {
                    match = html.match(endTag);
                    if (match) {
                        callChars();
                        html = html.substring(match[0].length);
                        match[0].replace(endTag, parseEndTag);
                        chars = false;
                    }
                } else if (html.indexOf('<') === 0) {
                    match = html.match(startTag);
                    if (match) {
                        callChars();
                        html = html.substring(match[0].length);
                        match[0].replace(startTag, parseStartTag);
                        chars = false;
                    }
                } else if (html.indexOf('{{') === 0) {
                    match = html.match(mustache);
                    if (match) {
                        callChars();
                        html = html.substring(match[0].length);
                        match[0].replace(mustache, parseMustache);
                    }
                }
                if (chars) {
                    index = html.search(txtBreak);
                    if (index === 0 && html === last) {
                        charsText += html.charAt(0);
                        html = html.substr(1);
                        index = html.search(txtBreak);
                    }
                    var text = index < 0 ? html : html.substring(0, index);
                    html = index < 0 ? '' : html.substring(index);
                    if (text) {
                        charsText += text;
                    }
                }
            } else {
                html = html.replace(new RegExp('([\\s\\S]*?)</' + stack.last() + '[^>]*>'), function (all, text) {
                    text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
                    if (handler.chars) {
                        handler.chars(text);
                    }
                    return '';
                });
                parseEndTag('', stack.last());
            }
            if (html === last) {
                throw new Error('Parse Error: ' + html);
            }
            last = html;
        }
        callChars();
        parseEndTag();
        handler.done();
        return intermediate;
    };
    var callAttrStart = function (state, curIndex, handler, rest) {
        state.attrStart = rest.substring(typeof state.nameStart === 'number' ? state.nameStart : curIndex, curIndex);
        handler.attrStart(state.attrStart);
        state.inName = false;
    };
    var callAttrEnd = function (state, curIndex, handler, rest) {
        if (state.valueStart !== undefined && state.valueStart < curIndex) {
            handler.attrValue(rest.substring(state.valueStart, curIndex));
        } else if (!state.inValue) {
        }
        handler.attrEnd(state.attrStart);
        state.attrStart = undefined;
        state.valueStart = undefined;
        state.inValue = false;
        state.inName = false;
        state.lookingForEq = false;
        state.inQuote = false;
        state.lookingForName = true;
    };
    HTMLParser.parseAttrs = function (rest, handler) {
        if (!rest) {
            return;
        }
        var i = 0;
        var curIndex;
        var state = {
            inDoubleCurly: false,
            inName: false,
            nameStart: undefined,
            inValue: false,
            valueStart: undefined,
            inQuote: false,
            attrStart: undefined,
            lookingForName: true,
            lookingForValue: false,
            lookingForEq: false
        };
        while (i < rest.length) {
            curIndex = i;
            var cur = rest.charAt(i);
            var next = rest.charAt(i + 1);
            var nextNext = rest.charAt(i + 2);
            i++;
            if (cur === '{' && next === '{') {
                if (state.inValue && curIndex > state.valueStart) {
                    handler.attrValue(rest.substring(state.valueStart, curIndex));
                } else if (state.inName && state.nameStart < curIndex) {
                    callAttrStart(state, curIndex, handler, rest);
                    callAttrEnd(state, curIndex, handler, rest);
                } else if (state.lookingForValue) {
                    state.inValue = true;
                } else if (state.lookingForEq && state.attrStart) {
                    callAttrEnd(state, curIndex, handler, rest);
                }
                state.inDoubleCurly = true;
                state.doubleCurlyStart = curIndex + 2;
                i++;
            } else if (state.inDoubleCurly) {
                if (cur === '}' && next === '}') {
                    var isTriple = nextNext === '}' ? 1 : 0;
                    handler.special(rest.substring(state.doubleCurlyStart, curIndex));
                    state.inDoubleCurly = false;
                    if (state.inValue) {
                        state.valueStart = curIndex + 2 + isTriple;
                    }
                    i += 1 + isTriple;
                }
            } else if (state.inValue) {
                if (state.inQuote) {
                    if (cur === state.inQuote) {
                        callAttrEnd(state, curIndex, handler, rest);
                    }
                } else if (space.test(cur)) {
                    callAttrEnd(state, curIndex, handler, rest);
                }
            } else if (cur === '=' && (state.lookingForEq || state.lookingForName || state.inName)) {
                if (!state.attrStart) {
                    callAttrStart(state, curIndex, handler, rest);
                }
                state.lookingForValue = true;
                state.lookingForEq = false;
                state.lookingForName = false;
            } else if (state.inName) {
                if (space.test(cur)) {
                    callAttrStart(state, curIndex, handler, rest);
                    state.lookingForEq = true;
                }
            } else if (state.lookingForName) {
                if (!space.test(cur)) {
                    if (state.attrStart) {
                        callAttrEnd(state, curIndex, handler, rest);
                    }
                    state.nameStart = curIndex;
                    state.inName = true;
                }
            } else if (state.lookingForValue) {
                if (!space.test(cur)) {
                    state.lookingForValue = false;
                    state.inValue = true;
                    if (cur === '\'' || cur === '"') {
                        state.inQuote = cur;
                        state.valueStart = curIndex + 1;
                    } else {
                        state.valueStart = curIndex;
                    }
                }
            }
        }
        if (state.inName) {
            callAttrStart(state, curIndex + 1, handler, rest);
            callAttrEnd(state, curIndex + 1, handler, rest);
        } else if (state.lookingForEq) {
            callAttrEnd(state, curIndex + 1, handler, rest);
        } else if (state.inValue) {
            callAttrEnd(state, curIndex + 1, handler, rest);
        }
    };
    return HTMLParser;
});
/*can/util/array/diff*/
define('can/util/array/diff', [], function () {
    var slice = [].slice;
    return function (oldList, newList) {
        var oldIndex = 0, newIndex = 0, oldLength = oldList.length, newLength = newList.length, patches = [];
        while (oldIndex < oldLength && newIndex < newLength) {
            var oldItem = oldList[oldIndex], newItem = newList[newIndex];
            if (oldItem === newItem) {
                oldIndex++;
                newIndex++;
                continue;
            }
            if (newIndex + 1 < newLength && newList[newIndex + 1] === oldItem) {
                patches.push({
                    index: newIndex,
                    deleteCount: 0,
                    insert: [newList[newIndex]]
                });
                oldIndex++;
                newIndex += 2;
                continue;
            } else if (oldIndex + 1 < oldLength && oldList[oldIndex + 1] === newItem) {
                patches.push({
                    index: newIndex,
                    deleteCount: 1,
                    insert: []
                });
                oldIndex += 2;
                newIndex++;
                continue;
            } else {
                patches.push({
                    index: newIndex,
                    deleteCount: oldLength - oldIndex,
                    insert: slice.call(newList, newIndex)
                });
                return patches;
            }
        }
        if (newIndex === newLength && oldIndex === oldLength) {
            return patches;
        }
        patches.push({
            index: newIndex,
            deleteCount: oldLength - oldIndex,
            insert: slice.call(newList, newIndex)
        });
        return patches;
    };
});
/*can/view/live/live*/
define('can/view/live/live', [
    'can/util/util',
    'can/view/elements',
    'can/view/view',
    'can/view/node_lists/node_lists',
    'can/view/parser/parser',
    'can/util/array/diff'
], function (can, elements, view, nodeLists, parser, diff) {
    elements = elements || can.view.elements;
    nodeLists = nodeLists || can.view.NodeLists;
    parser = parser || can.view.parser;
    var setup = function (el, bind, unbind) {
            var tornDown = false, teardown = function () {
                    if (!tornDown) {
                        tornDown = true;
                        unbind(data);
                        can.unbind.call(el, 'removed', teardown);
                    }
                    return true;
                }, data = {
                    teardownCheck: function (parent) {
                        return parent ? false : teardown();
                    }
                };
            can.bind.call(el, 'removed', teardown);
            bind(data);
            return data;
        }, getChildNodes = function (node) {
            var childNodes = node.childNodes;
            if ('length' in childNodes) {
                return childNodes;
            } else {
                var cur = node.firstChild;
                var nodes = [];
                while (cur) {
                    nodes.push(cur);
                    cur = cur.nextSibling;
                }
                return nodes;
            }
        }, listen = function (el, compute, change) {
            return setup(el, function () {
                compute.computeInstance.bind('change', change);
            }, function (data) {
                compute.computeInstance.unbind('change', change);
                if (data.nodeList) {
                    nodeLists.unregister(data.nodeList);
                }
            });
        }, getAttributeParts = function (newVal) {
            var attrs = {}, attr;
            parser.parseAttrs(newVal, {
                attrStart: function (name) {
                    attrs[name] = '';
                    attr = name;
                },
                attrValue: function (value) {
                    attrs[attr] += value;
                },
                attrEnd: function () {
                }
            });
            return attrs;
        }, splice = [].splice, isNode = function (obj) {
            return obj && obj.nodeType;
        }, addTextNodeIfNoChildren = function (frag) {
            if (!frag.firstChild) {
                frag.appendChild(frag.ownerDocument.createTextNode(''));
            }
        }, getLiveFragment = function (itemHTML) {
            var gotText = typeof itemHTML === 'string', itemFrag = can.frag(itemHTML);
            return gotText ? can.view.hookup(itemFrag) : itemFrag;
        }, renderAndAddToNodeLists = function (newNodeLists, parentNodeList, render, context, args) {
            var itemNodeList = [];
            if (parentNodeList) {
                nodeLists.register(itemNodeList, null, true, true);
                itemNodeList.parentList = parentNodeList;
                itemNodeList.expression = '#each SUBEXPRESSION';
            }
            var itemHTML = render.apply(context, args.concat([itemNodeList])), itemFrag = getLiveFragment(itemHTML);
            var childNodes = can.makeArray(getChildNodes(itemFrag));
            if (parentNodeList) {
                nodeLists.update(itemNodeList, childNodes);
                newNodeLists.push(itemNodeList);
            } else {
                newNodeLists.push(nodeLists.register(childNodes));
            }
            return itemFrag;
        }, removeFromNodeList = function (masterNodeList, index, length) {
            var removedMappings = masterNodeList.splice(index + 1, length), itemsToRemove = [];
            can.each(removedMappings, function (nodeList) {
                var nodesToRemove = nodeLists.unregister(nodeList);
                [].push.apply(itemsToRemove, nodesToRemove);
            });
            return itemsToRemove;
        }, addFalseyIfEmpty = function (list, falseyRender, masterNodeList, nodeList) {
            if (falseyRender && list.length === 0) {
                var falseyNodeLists = [];
                var falseyFrag = renderAndAddToNodeLists(falseyNodeLists, nodeList, falseyRender, list, [list]);
                elements.after([masterNodeList[0]], falseyFrag);
                masterNodeList.push(falseyNodeLists[0]);
            }
        }, childMutationCallbacks = {};
    var live = {
        registerChildMutationCallback: function (tag, callback) {
            if (callback) {
                childMutationCallbacks[tag] = callback;
            } else {
                return childMutationCallbacks[tag];
            }
        },
        callChildMutationCallback: function (el) {
            var callback = el && childMutationCallbacks[el.nodeName.toLowerCase()];
            if (callback) {
                callback(el);
            }
        },
        list: function (el, compute, render, context, parentNode, nodeList, falseyRender) {
            var masterNodeList = nodeList || [el], indexMap = [], afterPreviousEvents = false, isTornDown = false, add = function (ev, items, index) {
                    if (!afterPreviousEvents) {
                        return;
                    }
                    var frag = text.ownerDocument.createDocumentFragment(), newNodeLists = [], newIndicies = [];
                    can.each(items, function (item, key) {
                        var itemIndex = can.compute(key + index), itemFrag = renderAndAddToNodeLists(newNodeLists, nodeList, render, context, [
                                item,
                                itemIndex
                            ]);
                        frag.appendChild(itemFrag);
                        newIndicies.push(itemIndex);
                    });
                    var masterListIndex = index + 1;
                    if (!indexMap.length) {
                        var falseyItemsToRemove = removeFromNodeList(masterNodeList, 0, masterNodeList.length - 1);
                        can.remove(can.$(falseyItemsToRemove));
                    }
                    if (!masterNodeList[masterListIndex]) {
                        elements.after(masterListIndex === 1 ? [text] : [nodeLists.last(masterNodeList[masterListIndex - 1])], frag);
                    } else {
                        var el = nodeLists.first(masterNodeList[masterListIndex]);
                        can.insertBefore(el.parentNode, frag, el);
                    }
                    splice.apply(masterNodeList, [
                        masterListIndex,
                        0
                    ].concat(newNodeLists));
                    splice.apply(indexMap, [
                        index,
                        0
                    ].concat(newIndicies));
                    for (var i = index + newIndicies.length, len = indexMap.length; i < len; i++) {
                        indexMap[i](i);
                    }
                    if (ev.callChildMutationCallback !== false) {
                        live.callChildMutationCallback(text.parentNode);
                    }
                }, set = function (ev, newVal, index) {
                    remove({}, { length: 1 }, index, true);
                    add({}, [newVal], index);
                }, remove = function (ev, items, index, duringTeardown, fullTeardown) {
                    if (!afterPreviousEvents) {
                        return;
                    }
                    if (!duringTeardown && data.teardownCheck(text.parentNode)) {
                        return;
                    }
                    if (index < 0) {
                        index = indexMap.length + index;
                    }
                    var itemsToRemove = removeFromNodeList(masterNodeList, index, items.length);
                    indexMap.splice(index, items.length);
                    for (var i = index, len = indexMap.length; i < len; i++) {
                        indexMap[i](i);
                    }
                    if (!fullTeardown) {
                        addFalseyIfEmpty(list, falseyRender, masterNodeList, nodeList);
                        can.remove(can.$(itemsToRemove));
                        if (ev.callChildMutationCallback !== false) {
                            live.callChildMutationCallback(text.parentNode);
                        }
                    } else {
                        nodeLists.unregister(masterNodeList);
                    }
                }, move = function (ev, item, newIndex, currentIndex) {
                    if (!afterPreviousEvents) {
                        return;
                    }
                    newIndex = newIndex + 1;
                    currentIndex = currentIndex + 1;
                    var referenceNodeList = masterNodeList[newIndex];
                    var movedElements = can.frag(nodeLists.flatten(masterNodeList[currentIndex]));
                    var referenceElement;
                    if (currentIndex < newIndex) {
                        referenceElement = nodeLists.last(referenceNodeList).nextSibling;
                    } else {
                        referenceElement = nodeLists.first(referenceNodeList);
                    }
                    var parentNode = masterNodeList[0].parentNode;
                    parentNode.insertBefore(movedElements, referenceElement);
                    var temp = masterNodeList[currentIndex];
                    [].splice.apply(masterNodeList, [
                        currentIndex,
                        1
                    ]);
                    [].splice.apply(masterNodeList, [
                        newIndex,
                        0,
                        temp
                    ]);
                    newIndex = newIndex - 1;
                    currentIndex = currentIndex - 1;
                    var indexCompute = indexMap[currentIndex];
                    [].splice.apply(indexMap, [
                        currentIndex,
                        1
                    ]);
                    [].splice.apply(indexMap, [
                        newIndex,
                        0,
                        indexCompute
                    ]);
                    var i = Math.min(currentIndex, newIndex);
                    var len = indexMap.length;
                    for (i, len; i < len; i++) {
                        indexMap[i](i);
                    }
                    if (ev.callChildMutationCallback !== false) {
                        live.callChildMutationCallback(text.parentNode);
                    }
                }, text = el.ownerDocument.createTextNode(''), list, teardownList = function (fullTeardown) {
                    if (list && list.unbind) {
                        list.unbind('add', add).unbind('set', set).unbind('remove', remove).unbind('move', move);
                    }
                    remove({ callChildMutationCallback: !!fullTeardown }, { length: masterNodeList.length - 1 }, 0, true, fullTeardown);
                }, updateList = function (ev, newList, oldList) {
                    if (isTornDown) {
                        return;
                    }
                    afterPreviousEvents = true;
                    if (newList && oldList) {
                        list = newList || [];
                        var patches = diff(oldList, newList);
                        if (oldList.unbind) {
                            oldList.unbind('add', add).unbind('set', set).unbind('remove', remove).unbind('move', move);
                        }
                        for (var i = 0, patchLen = patches.length; i < patchLen; i++) {
                            var patch = patches[i];
                            if (patch.deleteCount) {
                                remove({ callChildMutationCallback: false }, { length: patch.deleteCount }, patch.index, true);
                            }
                            if (patch.insert.length) {
                                add({ callChildMutationCallback: false }, patch.insert, patch.index);
                            }
                        }
                    } else {
                        if (oldList) {
                            teardownList();
                        }
                        list = newList || [];
                        add({ callChildMutationCallback: false }, list, 0);
                        addFalseyIfEmpty(list, falseyRender, masterNodeList, nodeList);
                    }
                    live.callChildMutationCallback(text.parentNode);
                    afterPreviousEvents = false;
                    if (list.bind) {
                        list.bind('add', add).bind('set', set).bind('remove', remove).bind('move', move);
                    }
                    can.batch.afterPreviousEvents(function () {
                        afterPreviousEvents = true;
                    });
                };
            parentNode = elements.getParentNode(el, parentNode);
            var data = setup(parentNode, function () {
                if (can.isFunction(compute)) {
                    compute.bind('change', updateList);
                }
            }, function () {
                if (can.isFunction(compute)) {
                    compute.unbind('change', updateList);
                }
                teardownList(true);
            });
            if (!nodeList) {
                live.replace(masterNodeList, text, data.teardownCheck);
            } else {
                elements.replace(masterNodeList, text);
                nodeLists.update(masterNodeList, [text]);
                nodeList.unregistered = function () {
                    data.teardownCheck();
                    isTornDown = true;
                };
            }
            updateList({}, can.isFunction(compute) ? compute() : compute);
        },
        html: function (el, compute, parentNode, nodeList) {
            var data;
            parentNode = elements.getParentNode(el, parentNode);
            data = listen(parentNode, compute, function (ev, newVal, oldVal) {
                var attached = nodeLists.first(nodes).parentNode;
                if (attached) {
                    makeAndPut(newVal);
                }
                var pn = nodeLists.first(nodes).parentNode;
                data.teardownCheck(pn);
                live.callChildMutationCallback(pn);
            });
            var nodes = nodeList || [el], makeAndPut = function (val) {
                    var isFunction = typeof val === 'function', aNode = isNode(val), frag = can.frag(isFunction ? '' : val), oldNodes = can.makeArray(nodes);
                    addTextNodeIfNoChildren(frag);
                    if (!aNode && !isFunction) {
                        frag = can.view.hookup(frag, parentNode);
                    }
                    oldNodes = nodeLists.update(nodes, getChildNodes(frag));
                    if (isFunction) {
                        val(frag.firstChild);
                    }
                    elements.replace(oldNodes, frag);
                };
            data.nodeList = nodes;
            if (!nodeList) {
                nodeLists.register(nodes, data.teardownCheck);
            } else {
                nodeList.unregistered = data.teardownCheck;
            }
            makeAndPut(compute());
        },
        replace: function (nodes, val, teardown) {
            var oldNodes = nodes.slice(0), frag = can.frag(val);
            nodeLists.register(nodes, teardown);
            if (typeof val === 'string') {
                frag = can.view.hookup(frag, nodes[0].parentNode);
            }
            nodeLists.update(nodes, getChildNodes(frag));
            elements.replace(oldNodes, frag);
            return nodes;
        },
        text: function (el, compute, parentNode, nodeList) {
            var parent = elements.getParentNode(el, parentNode);
            var data = listen(parent, compute, function (ev, newVal, oldVal) {
                if (typeof node.nodeValue !== 'unknown') {
                    node.nodeValue = can.view.toStr(newVal);
                }
                data.teardownCheck(node.parentNode);
            });
            var node = el.ownerDocument.createTextNode(can.view.toStr(compute()));
            if (nodeList) {
                nodeList.unregistered = data.teardownCheck;
                data.nodeList = nodeList;
                nodeLists.update(nodeList, [node]);
                elements.replace([el], node);
            } else {
                data.nodeList = live.replace([el], node, data.teardownCheck);
            }
        },
        setAttributes: function (el, newVal) {
            var attrs = getAttributeParts(newVal);
            for (var name in attrs) {
                can.attr.set(el, name, attrs[name]);
            }
        },
        attributes: function (el, compute, currentValue) {
            var oldAttrs = {};
            var setAttrs = function (newVal) {
                var newAttrs = getAttributeParts(newVal), name;
                for (name in newAttrs) {
                    var newValue = newAttrs[name], oldValue = oldAttrs[name];
                    if (newValue !== oldValue) {
                        can.attr.set(el, name, newValue);
                    }
                    delete oldAttrs[name];
                }
                for (name in oldAttrs) {
                    elements.removeAttr(el, name);
                }
                oldAttrs = newAttrs;
            };
            listen(el, compute, function (ev, newVal) {
                setAttrs(newVal);
            });
            if (arguments.length >= 3) {
                oldAttrs = getAttributeParts(currentValue);
            } else {
                setAttrs(compute());
            }
        },
        attributePlaceholder: '__!!__',
        attributeReplace: /__!!__/g,
        attribute: function (el, attributeName, compute) {
            listen(el, compute, function (ev, newVal) {
                elements.setAttr(el, attributeName, hook.render());
            });
            var wrapped = can.$(el), hooks;
            hooks = can.data(wrapped, 'hooks');
            if (!hooks) {
                can.data(wrapped, 'hooks', hooks = {});
            }
            var attr = String(elements.getAttr(el, attributeName)), parts = attr.split(live.attributePlaceholder), goodParts = [], hook;
            goodParts.push(parts.shift(), parts.join(live.attributePlaceholder));
            if (hooks[attributeName]) {
                hooks[attributeName].computes.push(compute);
            } else {
                hooks[attributeName] = {
                    render: function () {
                        var i = 0, newAttr = attr ? attr.replace(live.attributeReplace, function () {
                                return elements.contentText(hook.computes[i++]());
                            }) : elements.contentText(hook.computes[i++]());
                        return newAttr;
                    },
                    computes: [compute],
                    batchNum: undefined
                };
            }
            hook = hooks[attributeName];
            goodParts.splice(1, 0, compute());
            elements.setAttr(el, attributeName, goodParts.join(''));
        },
        specialAttribute: function (el, attributeName, compute) {
            listen(el, compute, function (ev, newVal) {
                elements.setAttr(el, attributeName, getValue(newVal));
            });
            elements.setAttr(el, attributeName, getValue(compute()));
        },
        simpleAttribute: function (el, attributeName, compute) {
            listen(el, compute, function (ev, newVal) {
                elements.setAttr(el, attributeName, newVal);
            });
            elements.setAttr(el, attributeName, compute());
        }
    };
    live.attr = live.simpleAttribute;
    live.attrs = live.attributes;
    live.getAttributeParts = getAttributeParts;
    var newLine = /(\r|\n)+/g;
    var getValue = function (val) {
        var regexp = /^["'].*["']$/;
        val = val.replace(elements.attrReg, '').replace(newLine, '');
        return regexp.test(val) ? val.substr(1, val.length - 2) : val;
    };
    can.view.live = live;
    return live;
});
/*can/view/stache/mustache_helpers*/
define('can/view/stache/mustache_helpers', [
    'can/util/util',
    'can/view/stache/utils',
    'can/view/live/live'
], function (can, utils, live) {
    live = live || can.view.live;
    var resolve = function (value) {
        if (utils.isObserveLike(value) && utils.isArrayLike(value) && value.attr('length')) {
            return value;
        } else if (can.isFunction(value)) {
            return value();
        } else {
            return value;
        }
    };
    var resolveHash = function (hash) {
        var params = {};
        for (var prop in hash) {
            var value = hash[prop];
            if (value && value.isComputed) {
                params[prop] = value();
            } else {
                params[prop] = value;
            }
        }
        return params;
    };
    var looksLikeOptions = function (options) {
        return options && typeof options.fn === 'function' && typeof options.inverse === 'function';
    };
    var helpers = {
        'each': function (items, options) {
            var resolved = resolve(items), result = [], keys, key, i;
            if (resolved instanceof can.List && !options.stringOnly) {
                return function (el) {
                    var nodeList = [el];
                    nodeList.expression = 'live.list';
                    can.view.nodeLists.register(nodeList, null, options.nodeList, true);
                    can.view.nodeLists.update(options.nodeList, [el]);
                    var cb = function (item, index, parentNodeList) {
                        return options.fn(options.scope.add({
                            '%index': index,
                            '@index': index
                        }, { notContext: true }).add(item), options.options, parentNodeList);
                    };
                    live.list(el, items, cb, options.context, el.parentNode, nodeList, function (list, parentNodeList) {
                        return options.inverse(options.scope.add(list), options.options, parentNodeList);
                    });
                };
            }
            var expr = resolved;
            if (!!expr && utils.isArrayLike(expr)) {
                var isCanList = expr instanceof can.List;
                for (i = 0; i < (isCanList ? expr.attr('length') : expr.length); i++) {
                    var item = isCanList ? expr.attr(i) : expr[i];
                    result.push(options.fn(options.scope.add({
                        '%index': i,
                        '@index': i
                    }, { notContext: true }).add(item)));
                }
            } else if (utils.isObserveLike(expr)) {
                keys = can.Map.keys(expr);
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    result.push(options.fn(options.scope.add({
                        '%key': key,
                        '@key': key
                    }, { notContext: true }).add(expr[key])));
                }
            } else if (expr instanceof Object) {
                for (key in expr) {
                    result.push(options.fn(options.scope.add({
                        '%key': key,
                        '@key': key
                    }, { notContext: true }).add(expr[key])));
                }
            }
            return !options.stringOnly ? result : result.join('');
        },
        '@index': function (offset, options) {
            if (!options) {
                options = offset;
                offset = 0;
            }
            var index = options.scope.attr('@index');
            return '' + ((can.isFunction(index) ? index() : index) + offset);
        },
        'if': function (expr, options) {
            var value;
            if (can.isFunction(expr)) {
                value = can.compute.truthy(expr)();
            } else {
                value = !!resolve(expr);
            }
            if (value) {
                return options.fn(options.scope || this);
            } else {
                return options.inverse(options.scope || this);
            }
        },
        'is': function () {
            var lastValue, curValue, options = arguments[arguments.length - 1];
            if (arguments.length - 2 <= 0) {
                return options.inverse();
            }
            var args = arguments;
            var callFn = can.compute(function () {
                for (var i = 0; i < args.length - 1; i++) {
                    curValue = resolve(args[i]);
                    curValue = can.isFunction(curValue) ? curValue() : curValue;
                    if (i > 0) {
                        if (curValue !== lastValue) {
                            return false;
                        }
                    }
                    lastValue = curValue;
                }
                return true;
            });
            return callFn() ? options.fn() : options.inverse();
        },
        'eq': function () {
            return helpers.is.apply(this, arguments);
        },
        'unless': function (expr, options) {
            return helpers['if'].apply(this, [
                expr,
                can.extend({}, options, {
                    fn: options.inverse,
                    inverse: options.fn
                })
            ]);
        },
        'with': function (expr, options) {
            var ctx = expr;
            expr = resolve(expr);
            if (!!expr) {
                return options.fn(ctx);
            }
        },
        'log': function (expr, options) {
            if (typeof console !== 'undefined' && console.log) {
                if (!options) {
                    console.log(expr.context);
                } else {
                    console.log(expr, options.context);
                }
            }
        },
        'data': function (attr) {
            var data = arguments.length === 2 ? this : arguments[1];
            return function (el) {
                can.data(can.$(el), attr, data || this.context);
            };
        },
        'switch': function (expression, options) {
            resolve(expression);
            var found = false;
            var newOptions = options.helpers.add({
                'case': function (value, options) {
                    if (!found && resolve(expression) === resolve(value)) {
                        found = true;
                        return options.fn(options.scope || this);
                    }
                },
                'default': function (options) {
                    if (!found) {
                        return options.fn(options.scope || this);
                    }
                }
            });
            return options.fn(options.scope, newOptions);
        },
        'joinBase': function (firstExpr) {
            var args = [].slice.call(arguments);
            var options = args.pop();
            var moduleReference = can.map(args, function (expr) {
                var value = resolve(expr);
                return can.isFunction(value) ? value() : value;
            }).join('');
            var templateModule = options.helpers.attr('helpers.module');
            var parentAddress = templateModule ? templateModule.uri : undefined;
            var isRelative = moduleReference[0] === '.';
            if (isRelative && parentAddress) {
                return can.joinURIs(parentAddress, moduleReference);
            } else {
                var baseURL = can.baseURL || typeof System !== 'undefined' && (System.renderingLoader && System.renderingLoader.baseURL || System.baseURL) || location.pathname;
                if (moduleReference[0] !== '/' && baseURL[baseURL.length - 1] !== '/') {
                    baseURL += '/';
                }
                return can.joinURIs(baseURL, moduleReference);
            }
        },
        routeUrl: function (params, merge) {
            if (!params) {
                params = {};
            }
            if (typeof params.fn === 'function' && typeof params.inverse === 'function') {
                params = resolveHash(params.hash);
            }
            return can.route.url(params, typeof merge === 'boolean' ? merge : undefined);
        },
        routeCurrent: function (params) {
            var last = can.last(arguments), isOptions = last && looksLikeOptions(last);
            if (last && isOptions && !(last.exprData instanceof can.expression.Call)) {
                if (can.route.current(resolveHash(params.hash || {}))) {
                    return params.fn();
                } else {
                    return params.inverse();
                }
            } else {
                return can.route.current(looksLikeOptions(params) ? {} : params || {});
            }
        }
    };
    helpers.routeCurrent.callAsMethod = true;
    helpers.eachOf = helpers.each;
    var registerHelper = function (name, callback) {
        helpers[name] = callback;
    };
    return {
        registerHelper: registerHelper,
        registerSimpleHelper: function (name, callback) {
            registerHelper(name, can.view.simpleHelper(callback));
        },
        getHelper: function (name, options) {
            var helper = options && options.get('helpers.' + name, { proxyMethods: false });
            if (!helper) {
                helper = helpers[name];
            }
            if (helper) {
                return { fn: helper };
            }
        }
    };
});
/*can/view/stache/expression*/
define('can/view/stache/expression', [
    'can/util/util',
    'can/view/stache/utils',
    'can/view/stache/mustache_helpers',
    'can/view/scope/scope'
], function (can, utils, mustacheHelpers, Scope) {
    var getKeyComputeData = function (key, scope, readOptions) {
            var data = scope.computeData(key, readOptions);
            can.compute.temporarilyBind(data.compute);
            return data;
        }, lookupValue = function (key, scope, helperOptions, readOptions) {
            var computeData = getKeyComputeData(key, scope, readOptions);
            if (!computeData.compute.computeInstance.hasDependencies) {
                return {
                    value: computeData.initialValue,
                    computeData: computeData
                };
            } else {
                return {
                    value: computeData.compute,
                    computeData: computeData
                };
            }
        }, lookupValueOrHelper = function (key, scope, helperOptions, readOptions) {
            var res = lookupValue(key, scope, helperOptions, readOptions);
            if (res.computeData.initialValue === undefined) {
                if (key.charAt(0) === '@' && key !== '@index') {
                    key = key.substr(1);
                }
                var helper = mustacheHelpers.getHelper(key, helperOptions);
                res.helper = helper && helper.fn;
            }
            return res;
        }, convertToArgExpression = function (expr) {
            if (!(expr instanceof Arg) && !(expr instanceof Literal) && !(expr instanceof Hashes)) {
                return new Arg(expr);
            } else {
                return expr;
            }
        };
    var Literal = function (value) {
        this._value = value;
    };
    Literal.prototype.value = function () {
        return this._value;
    };
    var Lookup = function (key, root) {
        this.key = key;
        this.rootExpr = root;
    };
    Lookup.prototype.value = function (scope, helperOptions) {
        var result = lookupValueOrHelper(this.key, scope, helperOptions);
        this.isHelper = result.helper && !result.helper.callAsMethod;
        return result.helper || result.value;
    };
    var ScopeLookup = function (key, root) {
        Lookup.apply(this, arguments);
    };
    ScopeLookup.prototype.value = function (scope, helperOptions) {
        return lookupValue(this.key, scope, helperOptions).value;
    };
    var Arg = function (expression, modifiers) {
        this.expr = expression;
        this.modifiers = modifiers || {};
        this.isCompute = false;
    };
    Arg.prototype.value = function () {
        return this.expr.value.apply(this.expr, arguments);
    };
    var Hashes = function (hashExpressions) {
        this.hashExprs = hashExpressions;
    };
    Hashes.prototype.value = function () {
        var hash = {};
        for (var prop in this.hashExprs) {
            var val = this.hashExprs[prop], value = val.value.apply(val, arguments);
            hash[prop] = {
                call: value && value.isComputed && (!val.modifiers || !val.modifiers.compute),
                value: value
            };
        }
        return can.compute(function () {
            var finalHash = {};
            for (var prop in hash) {
                finalHash[prop] = hash[prop].call ? hash[prop].value() : hash[prop].value;
            }
            return finalHash;
        });
    };
    var Call = function (methodExpression, argExpressions, hashes) {
        if (hashes && !can.isEmptyObject(hashes)) {
            argExpressions.push(new Hashes(hashes));
        }
        this.methodExpr = methodExpression;
        this.argExprs = can.map(argExpressions, convertToArgExpression);
    };
    Call.prototype.args = function (scope, helperOptions) {
        var args = [];
        for (var i = 0, len = this.argExprs.length; i < len; i++) {
            var arg = this.argExprs[i];
            var value = arg.value.apply(arg, arguments);
            args.push({
                call: value && value.isComputed && (!arg.modifiers || !arg.modifiers.compute),
                value: value
            });
        }
        return function () {
            var finalArgs = [];
            for (var i = 0, len = args.length; i < len; i++) {
                finalArgs[i] = args[i].call ? args[i].value() : args[i].value;
            }
            return finalArgs;
        };
    };
    Call.prototype.value = function (scope, helperScope, helperOptions) {
        var method = this.methodExpr.value(scope, helperScope);
        this.isHelper = this.methodExpr.isHelper;
        var getArgs = this.args(scope, helperScope);
        return can.compute(function (newVal) {
            var func = method;
            if (func && func.isComputed) {
                func = func();
            }
            if (typeof func === 'function') {
                var args = getArgs();
                if (helperOptions) {
                    args.push(helperOptions);
                }
                if (arguments.length) {
                    args.unshift(new expression.SetIdentifier(newVal));
                }
                return func.apply(null, args);
            }
        });
    };
    var HelperLookup = function () {
        Lookup.apply(this, arguments);
    };
    HelperLookup.prototype.value = function (scope, helperOptions) {
        var result = lookupValueOrHelper(this.key, scope, helperOptions, {
            isArgument: true,
            args: [
                scope.attr('.'),
                scope
            ]
        });
        return result.helper || result.value;
    };
    var HelperScopeLookup = function () {
        Lookup.apply(this, arguments);
    };
    HelperScopeLookup.prototype.value = function (scope, helperOptions) {
        return lookupValue(this.key, scope, helperOptions, {
            callMethodsOnObservables: true,
            isArgument: true,
            args: [
                scope.attr('.'),
                scope
            ]
        }).value;
    };
    var Helper = function (methodExpression, argExpressions, hashExpressions) {
        this.methodExpr = methodExpression;
        this.argExprs = argExpressions;
        this.hashExprs = hashExpressions;
        this.mode = null;
    };
    Helper.prototype.args = function (scope, helperOptions) {
        var args = [];
        for (var i = 0, len = this.argExprs.length; i < len; i++) {
            var arg = this.argExprs[i];
            args.push(arg.value.apply(arg, arguments));
        }
        return args;
    };
    Helper.prototype.hash = function (scope, helperOptions) {
        var hash = {};
        for (var prop in this.hashExprs) {
            var val = this.hashExprs[prop];
            hash[prop] = val.value.apply(val, arguments);
        }
        return hash;
    };
    Helper.prototype.helperAndValue = function (scope, helperOptions) {
        var looksLikeAHelper = this.argExprs.length || !can.isEmptyObject(this.hashExprs), helper, value, methodKey = this.methodExpr instanceof Literal ? '' + this.methodExpr._value : this.methodExpr.key, initialValue, args;
        if (looksLikeAHelper) {
            helper = mustacheHelpers.getHelper(methodKey, helperOptions);
            var context = scope.attr('.');
            if (!helper && typeof context[methodKey] === 'function') {
                helper = { fn: context[methodKey] };
            }
        }
        if (!helper) {
            args = this.args(scope, helperOptions);
            var computeData = getKeyComputeData(methodKey, scope, {
                    isArgument: false,
                    args: args && args.length ? args : [
                        scope.attr('.'),
                        scope
                    ]
                }), compute = computeData.compute;
            initialValue = computeData.initialValue;
            if (computeData.compute.computeInstance.hasDependencies) {
                value = compute;
            } else {
                value = initialValue;
            }
            if (!looksLikeAHelper && initialValue === undefined) {
                helper = mustacheHelpers.getHelper(methodKey, helperOptions);
            }
        }
        return {
            value: value,
            args: args,
            helper: helper && helper.fn
        };
    };
    Helper.prototype.evaluator = function (helper, scope, helperOptions, readOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly) {
        var helperOptionArg = {
                fn: function () {
                },
                inverse: function () {
                },
                stringOnly: stringOnly
            }, context = scope.attr('.'), args = this.args(scope, helperOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly), hash = this.hash(scope, helperOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly);
        utils.convertToScopes(helperOptionArg, scope, helperOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly);
        can.simpleExtend(helperOptionArg, {
            context: context,
            scope: scope,
            contexts: scope,
            hash: hash,
            nodeList: nodeList,
            exprData: this,
            helperOptions: helperOptions,
            helpers: helperOptions
        });
        args.push(helperOptionArg);
        return function () {
            return helper.apply(context, args);
        };
    };
    Helper.prototype.value = function (scope, helperOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly) {
        var helperAndValue = this.helperAndValue(scope, helperOptions);
        var helper = helperAndValue.helper;
        if (!helper) {
            return helperAndValue.value;
        }
        var fn = this.evaluator(helper, scope, helperOptions, nodeList, truthyRenderer, falseyRenderer, stringOnly);
        var compute = can.compute(fn);
        can.compute.temporarilyBind(compute);
        if (!compute.computeInstance.hasDependencies) {
            return compute();
        } else {
            return compute;
        }
    };
    var keyRegExp = /[\w\.\\\-_@\/\&%]+/, tokensRegExp = /('.*?'|".*?"|=|[\w\.\\\-_@\/*%\$:]+|[\(\)]|,|\~)/g, literalRegExp = /^('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)$/;
    var isTokenKey = function (token) {
        return keyRegExp.test(token);
    };
    var testDot = /^[\.@]\w/;
    var isAddingToExpression = function (token) {
        return isTokenKey(token) && testDot.test(token);
    };
    var ensureChildren = function (type) {
        if (!type.children) {
            type.children = [];
        }
        return type;
    };
    var Stack = function () {
        this.root = {
            children: [],
            type: 'Root'
        };
        this.current = this.root;
        this.stack = [this.root];
    };
    can.simpleExtend(Stack.prototype, {
        top: function () {
            return can.last(this.stack);
        },
        isRootTop: function () {
            return this.top() === this.root;
        },
        popTo: function (types) {
            this.popUntil(types);
            if (!this.isRootTop()) {
                this.stack.pop();
            }
        },
        firstParent: function (types) {
            var curIndex = this.stack.length - 2;
            while (curIndex > 0 && can.inArray(this.stack[curIndex].type, types) === -1) {
                curIndex--;
            }
            return this.stack[curIndex];
        },
        popUntil: function (types) {
            while (can.inArray(this.top().type, types) === -1 && !this.isRootTop()) {
                this.stack.pop();
            }
            return this.top();
        },
        addTo: function (types, type) {
            var cur = this.popUntil(types);
            ensureChildren(cur).children.push(type);
        },
        addToAndPush: function (types, type) {
            this.addTo(types, type);
            this.stack.push(type);
        },
        topLastChild: function () {
            return can.last(this.top().children);
        },
        replaceTopLastChild: function (type) {
            var children = ensureChildren(this.top()).children;
            children.pop();
            children.push(type);
            return type;
        },
        replaceTopLastChildAndPush: function (type) {
            this.replaceTopLastChild(type);
            this.stack.push(type);
        },
        replaceTopAndPush: function (type) {
            var children;
            if (this.top() === this.root) {
                children = ensureChildren(this.top()).children;
            } else {
                this.stack.pop();
                children = ensureChildren(this.top()).children;
            }
            children.pop();
            children.push(type);
            this.stack.push(type);
            return type;
        }
    });
    var convertKeyToLookup = function (key) {
        var lastPath = key.lastIndexOf('./');
        var lastDot = key.lastIndexOf('.');
        if (lastDot > lastPath) {
            return key.substr(0, lastDot) + '@' + key.substr(lastDot + 1);
        }
        var firstNonPathCharIndex = lastPath === -1 ? 0 : lastPath + 2;
        var firstNonPathChar = key.charAt(firstNonPathCharIndex);
        if (firstNonPathChar === '.' || firstNonPathChar === '@') {
            return key.substr(0, firstNonPathCharIndex) + '@' + key.substr(firstNonPathCharIndex + 1);
        } else {
            return key.substr(0, firstNonPathCharIndex) + '@' + key.substr(firstNonPathCharIndex);
        }
    };
    var convertToAtLookup = function (ast) {
        if (ast.type === 'Lookup') {
            ast.key = convertKeyToLookup(ast.key);
        }
        return ast;
    };
    var convertToHelperIfTopIsLookup = function (stack) {
        var top = stack.top();
        if (top && top.type === 'Lookup') {
            var base = stack.stack[stack.stack.length - 2];
            if (base.type !== 'Helper' && base) {
                stack.replaceTopAndPush({
                    type: 'Helper',
                    method: top
                });
            }
        }
    };
    var expression = {
        convertKeyToLookup: convertKeyToLookup,
        Literal: Literal,
        Lookup: Lookup,
        ScopeLookup: ScopeLookup,
        Arg: Arg,
        Hashes: Hashes,
        Call: Call,
        Helper: Helper,
        HelperLookup: HelperLookup,
        HelperScopeLookup: HelperScopeLookup,
        SetIdentifier: function (value) {
            this.value = value;
        },
        tokenize: function (expression) {
            var tokens = [];
            (can.trim(expression) + ' ').replace(tokensRegExp, function (whole, arg) {
                tokens.push(arg);
            });
            return tokens;
        },
        lookupRules: {
            'default': function (ast, methodType, isArg) {
                var name = (methodType === 'Helper' && !ast.root ? 'Helper' : '') + (isArg ? 'Scope' : '') + 'Lookup';
                return expression[name];
            },
            'method': function (ast, methodType, isArg) {
                return ScopeLookup;
            }
        },
        methodRules: {
            'default': function (ast) {
                return ast.type === 'Call' ? Call : Helper;
            },
            'call': function (ast) {
                return Call;
            }
        },
        parse: function (expressionString, options) {
            options = options || {};
            var ast = this.ast(expressionString);
            if (!options.lookupRule) {
                options.lookupRule = 'default';
            }
            if (typeof options.lookupRule === 'string') {
                options.lookupRule = expression.lookupRules[options.lookupRule];
            }
            if (!options.methodRule) {
                options.methodRule = 'default';
            }
            if (typeof options.methodRule === 'string') {
                options.methodRule = expression.methodRules[options.methodRule];
            }
            var expr = this.hydrateAst(ast, options, options.baseMethodType || 'Helper');
            return expr;
        },
        hydrateAst: function (ast, options, methodType, isArg) {
            var hashes, self = this;
            if (ast.type === 'Lookup') {
                return new (options.lookupRule(ast, methodType, isArg))(ast.key, ast.root && this.hydrateAst(ast.root, options, methodType));
            } else if (ast.type === 'Literal') {
                return new Literal(ast.value);
            } else if (ast.type === 'Arg') {
                return new Arg(this.hydrateAst(ast.children[0], options, methodType, isArg), { compute: true });
            } else if (ast.type === 'Hashes') {
                hashes = {};
                can.each(ast.children, function (child) {
                    hashes[child.prop] = self.hydrateAst(child.children[0], options, ast.type, true);
                });
                return new Hashes(hashes);
            } else if (ast.type === 'Hash') {
                throw new Error('');
            } else if (ast.type === 'Call' || ast.type === 'Helper') {
                var args = [];
                hashes = {};
                can.each(ast.children, function (child) {
                    if (child.type === 'Hash') {
                        hashes[child.prop] = self.hydrateAst(child.children[0], options, ast.type, true);
                    } else {
                        args.push(self.hydrateAst(child, options, ast.type, true));
                    }
                });
                return new (options.methodRule(ast))(this.hydrateAst(ast.method, options, ast.type), args, hashes);
            }
        },
        ast: function (expression) {
            var tokens = this.tokenize(expression);
            return this.parseAst(tokens, { index: 0 });
        },
        parseAst: function (tokens, cursor) {
            var stack = new Stack(), top;
            while (cursor.index < tokens.length) {
                var token = tokens[cursor.index], nextToken = tokens[cursor.index + 1];
                cursor.index++;
                if (literalRegExp.test(token)) {
                    convertToHelperIfTopIsLookup(stack);
                    stack.addTo([
                        'Helper',
                        'Call',
                        'Hash'
                    ], {
                        type: 'Literal',
                        value: utils.jsonParse(token)
                    });
                } else if (nextToken === '=') {
                    top = stack.top();
                    if (top && top.type === 'Lookup') {
                        var firstParent = stack.firstParent([
                            'Call',
                            'Helper',
                            'Hash'
                        ]);
                        if (firstParent.type === 'Call' || firstParent.type === 'Root') {
                            stack.popUntil(['Call']);
                            top = stack.top();
                            stack.replaceTopAndPush({
                                type: 'Helper',
                                method: top.type === 'Root' ? can.last(top.children) : top
                            });
                        }
                    }
                    top = stack.popUntil([
                        'Helper',
                        'Call',
                        'Hashes'
                    ]);
                    if (top.type === 'Call') {
                        stack.addToAndPush(['Call'], { type: 'Hashes' });
                    }
                    stack.addToAndPush([
                        'Helper',
                        'Hashes'
                    ], {
                        type: 'Hash',
                        prop: token
                    });
                    cursor.index++;
                } else if (keyRegExp.test(token)) {
                    var last = stack.topLastChild();
                    if (last && last.type === 'Call' && isAddingToExpression(token)) {
                        stack.replaceTopLastChildAndPush({
                            type: 'Lookup',
                            root: last,
                            key: token
                        });
                    } else {
                        convertToHelperIfTopIsLookup(stack);
                        stack.addToAndPush([
                            'Helper',
                            'Call',
                            'Hash',
                            'Arg'
                        ], {
                            type: 'Lookup',
                            key: token
                        });
                    }
                } else if (token === '~') {
                    convertToHelperIfTopIsLookup(stack);
                    stack.addToAndPush([
                        'Helper',
                        'Call',
                        'Hash'
                    ], {
                        type: 'Arg',
                        key: token
                    });
                } else if (token === '(') {
                    top = stack.top();
                    if (top.type === 'Lookup') {
                        stack.replaceTopAndPush({
                            type: 'Call',
                            method: convertToAtLookup(top)
                        });
                    } else {
                        throw new Error('Unable to understand expression ' + tokens.join(''));
                    }
                } else if (token === ')') {
                    stack.popTo(['Call']);
                } else if (token === ',') {
                    stack.popUntil(['Call']);
                }
            }
            return stack.root.children[0];
        }
    };
    can.expression = expression;
    return expression;
});
/*can/view/href/href*/
define('can/view/href/href', [
    'can/util/util',
    'can/view/stache/expression',
    'can/view/callbacks/callbacks',
    'can/view/scope/scope'
], function (can, expression) {
    var removeCurly = function (value) {
        if (value[0] === '{' && value[value.length - 1] === '}') {
            return value.substr(1, value.length - 2);
        }
        return value;
    };
    can.view.attr('can-href', function (el, attrData) {
        var attrInfo = expression.parse('tmp(' + removeCurly(el.getAttribute('can-href')) + ')', { baseMethodType: 'Call' });
        var getHash = attrInfo.argExprs[0].value(attrData.scope, null);
        var routeHref = can.compute(function () {
            return can.route.url(getHash());
        });
        el.setAttribute('href', routeHref());
        var handler = function (ev, newVal) {
            el.setAttribute('href', newVal);
        };
        routeHref.bind('change', handler);
        can.bind.call(el, 'removed', function () {
            routeHref.unbind('change', handler);
        });
    });
});
/*can/view/bindings/bindings*/
define('can/view/bindings/bindings', [
    'can/util/util',
    'can/view/stache/expression',
    'can/view/callbacks/callbacks',
    'can/view/live/live',
    'can/view/scope/scope',
    'can/view/href/href'
], function (can, expression, viewCallbacks, live) {
    var behaviors = {
        viewModel: function (el, tagData, makeViewModel, initialViewModelData) {
            initialViewModelData = initialViewModelData || {};
            var bindingsSemaphore = {}, viewModel, onCompleteBindings = [], onTeardowns = {}, bindingInfos = {}, attributeViewModelBindings = can.extend({}, initialViewModelData);
            can.each(can.makeArray(el.attributes), function (node) {
                var dataBinding = makeDataBinding(node, el, {
                    templateType: tagData.templateType,
                    scope: tagData.scope,
                    semaphore: bindingsSemaphore,
                    getViewModel: function () {
                        return viewModel;
                    },
                    attributeViewModelBindings: attributeViewModelBindings,
                    alreadyUpdatedChild: true,
                    nodeList: tagData.parentNodeList
                });
                if (dataBinding) {
                    if (dataBinding.onCompleteBinding) {
                        if (dataBinding.bindingInfo.parentToChild && dataBinding.value !== undefined) {
                            initialViewModelData[cleanVMName(dataBinding.bindingInfo.childName)] = dataBinding.value;
                        }
                        onCompleteBindings.push(dataBinding.onCompleteBinding);
                    }
                    onTeardowns[node.name] = dataBinding.onTeardown;
                }
            });
            viewModel = makeViewModel(initialViewModelData);
            for (var i = 0, len = onCompleteBindings.length; i < len; i++) {
                onCompleteBindings[i]();
            }
            can.bind.call(el, 'attributes', function (ev) {
                var attrName = ev.attributeName, value = el.getAttribute(attrName);
                if (onTeardowns[attrName]) {
                    onTeardowns[attrName]();
                }
                var parentBindingWasAttribute = bindingInfos[attrName] && bindingInfos[attrName].parent === 'attribute';
                if (value !== null || parentBindingWasAttribute) {
                    var dataBinding = makeDataBinding({
                        name: attrName,
                        value: value
                    }, el, {
                        templateType: tagData.templateType,
                        scope: tagData.scope,
                        semaphore: {},
                        getViewModel: function () {
                            return viewModel;
                        },
                        attributeViewModelBindings: attributeViewModelBindings,
                        initializeValues: true,
                        nodeList: tagData.parentNodeList
                    });
                    if (dataBinding) {
                        if (dataBinding.onCompleteBinding) {
                            dataBinding.onCompleteBinding();
                        }
                        bindingInfos[attrName] = dataBinding.bindingInfo;
                        onTeardowns[attrName] = dataBinding.onTeardown;
                    }
                }
            });
            return function () {
                for (var attrName in onTeardowns) {
                    onTeardowns[attrName]();
                }
            };
        },
        data: function (el, attrData) {
            if (can.data(can.$(el), 'preventDataBindings')) {
                return;
            }
            var viewModel = can.viewModel(el), semaphore = {}, teardown;
            var dataBinding = makeDataBinding({
                name: attrData.attributeName,
                value: el.getAttribute(attrData.attributeName),
                nodeList: attrData.nodeList
            }, el, {
                templateType: attrData.templateType,
                scope: attrData.scope,
                semaphore: semaphore,
                getViewModel: function () {
                    return viewModel;
                }
            });
            if (dataBinding.onCompleteBinding) {
                dataBinding.onCompleteBinding();
            }
            teardown = dataBinding.onTeardown;
            can.one.call(el, 'removed', function () {
                teardown();
            });
            can.bind.call(el, 'attributes', function (ev) {
                var attrName = ev.attributeName, value = el.getAttribute(attrName);
                if (attrName === attrData.attributeName) {
                    if (teardown) {
                        teardown();
                    }
                    if (value !== null) {
                        var dataBinding = makeDataBinding({
                            name: attrName,
                            value: value
                        }, el, {
                            templateType: attrData.templateType,
                            scope: attrData.scope,
                            semaphore: semaphore,
                            getViewModel: function () {
                                return viewModel;
                            },
                            initializeValues: true,
                            nodeList: attrData.nodeList
                        });
                        if (dataBinding) {
                            if (dataBinding.onCompleteBinding) {
                                dataBinding.onCompleteBinding();
                            }
                            teardown = dataBinding.onTeardown;
                        }
                    }
                }
            });
        },
        reference: function (el, attrData) {
            if (el.getAttribute(attrData.attributeName)) {
                console.warn('*reference attributes can only export the view model.');
            }
            var name = can.camelize(attrData.attributeName.substr(1).toLowerCase());
            var viewModel = can.viewModel(el);
            var refs = attrData.scope.getRefs();
            refs._context.attr('*' + name, viewModel);
        },
        event: function (el, data) {
            var attributeName = data.attributeName, legacyBinding = attributeName.indexOf('can-') === 0, event = attributeName.indexOf('can-') === 0 ? attributeName.substr('can-'.length) : can.camelize(removeBrackets(attributeName, '(', ')')), onBindElement = legacyBinding;
            if (event.charAt(0) === '$') {
                event = event.substr(1);
                onBindElement = true;
            }
            var handler = function (ev) {
                var attrVal = el.getAttribute(attributeName);
                if (!attrVal) {
                    return;
                }
                var $el = can.$(el), viewModel = can.viewModel($el[0]);
                var expr = expression.parse(removeBrackets(attrVal), {
                    lookupRule: 'method',
                    methodRule: 'call'
                });
                if (!(expr instanceof expression.Call) && !(expr instanceof expression.Helper)) {
                    var defaultArgs = can.map([
                        data.scope._context,
                        $el
                    ].concat(can.makeArray(arguments)), function (data) {
                        return new expression.Literal(data);
                    });
                    expr = new expression.Call(expr, defaultArgs, {});
                }
                var localScope = data.scope.add({
                    '@element': $el,
                    '@event': ev,
                    '@viewModel': viewModel,
                    '@scope': data.scope,
                    '@context': data.scope._context,
                    '%element': this,
                    '$element': $el,
                    '%event': ev,
                    '%viewModel': viewModel,
                    '%scope': data.scope,
                    '%context': data.scope._context
                }, { notContext: true });
                var scopeData = localScope.read(expr.methodExpr.key, { isArgument: true });
                if (!scopeData.value) {
                    scopeData = localScope.read(expr.methodExpr.key, { isArgument: true });
                    return null;
                }
                var args = expr.args(localScope, null)();
                return scopeData.value.apply(scopeData.parent, args);
            };
            if (special[event]) {
                var specialData = special[event](data, el, handler);
                handler = specialData.handler;
                event = specialData.event;
            }
            can.bind.call(onBindElement ? el : can.viewModel(el), event, handler);
            var attributesHandler = function (ev) {
                if (ev.attributeName === attributeName && !this.getAttribute(attributeName)) {
                    can.unbind.call(onBindElement ? el : can.viewModel(el), event, handler);
                    can.unbind.call(el, 'attributes', attributesHandler);
                }
            };
            can.bind.call(el, 'attributes', attributesHandler);
        },
        value: function (el, data) {
            var propName = '$value', attrValue = can.trim(removeBrackets(el.getAttribute('can-value'))), getterSetter;
            if (el.nodeName.toLowerCase() === 'input' && (el.type === 'checkbox' || el.type === 'radio')) {
                var property = getComputeFrom.scope(el, data.scope, attrValue, {}, true);
                if (el.type === 'checkbox') {
                    var trueValue = can.attr.has(el, 'can-true-value') ? el.getAttribute('can-true-value') : true, falseValue = can.attr.has(el, 'can-false-value') ? el.getAttribute('can-false-value') : false;
                    getterSetter = can.compute(function (newValue) {
                        if (arguments.length) {
                            property(newValue ? trueValue : falseValue);
                        } else {
                            return property() == trueValue;
                        }
                    });
                } else if (el.type === 'radio') {
                    getterSetter = can.compute(function (newValue) {
                        if (arguments.length) {
                            if (newValue) {
                                property(el.value);
                            }
                        } else {
                            return property() == el.value;
                        }
                    });
                }
                propName = '$checked';
                attrValue = 'getterSetter';
                data.scope = new can.view.Scope({ getterSetter: getterSetter });
            } else if (isContentEditable(el)) {
                propName = '$innerHTML';
            }
            var dataBinding = makeDataBinding({
                name: '{(' + propName + '})',
                value: attrValue
            }, el, {
                templateType: data.templateType,
                scope: data.scope,
                semaphore: {},
                initializeValues: true,
                legacyBindings: true,
                syncChildWithParent: true
            });
            can.one.call(el, 'removed', function () {
                dataBinding.onTeardown();
            });
        }
    };
    can.view.attr(/^\{[^\}]+\}$/, behaviors.data);
    can.view.attr(/\*[\w\.\-_]+/, behaviors.reference);
    can.view.attr(/^\([\$?\w\.\-]+\)$/, behaviors.event);
    can.view.attr(/can-[\w\.]+/, behaviors.event);
    can.view.attr('can-value', behaviors.value);
    var getComputeFrom = {
        scope: function (el, scope, scopeProp, bindingData, mustBeACompute, stickyCompute) {
            if (!scopeProp) {
                return can.compute();
            } else {
                if (mustBeACompute) {
                    var parentExpression = expression.parse(scopeProp, { baseMethodType: 'Call' });
                    return parentExpression.value(scope, new can.view.Options({}));
                } else {
                    return function (newVal) {
                        scope.attr(cleanVMName(scopeProp), newVal);
                    };
                }
            }
        },
        viewModel: function (el, scope, vmName, bindingData, mustBeACompute, stickyCompute) {
            var setName = cleanVMName(vmName);
            if (mustBeACompute) {
                return can.compute(function (newVal) {
                    var viewModel = bindingData.getViewModel();
                    if (arguments.length) {
                        viewModel.attr(setName, newVal);
                    } else {
                        return vmName === '.' ? viewModel : can.compute.read(viewModel, can.compute.read.reads(vmName), {}).value;
                    }
                });
            } else {
                return function (newVal) {
                    var childCompute;
                    var viewModel = bindingData.getViewModel();
                    if (stickyCompute) {
                        childCompute = viewModel._get(setName, { readCompute: false });
                        if (!childCompute || !childCompute.isComputed) {
                            childCompute = can.compute();
                            viewModel._set(setName, childCompute, { readCompute: false });
                        }
                        childCompute(newVal);
                    } else {
                        viewModel.attr(setName, newVal);
                    }
                };
            }
        },
        attribute: function (el, scope, prop, bindingData, mustBeACompute, stickyCompute, event) {
            var hasChildren = el.nodeName.toLowerCase() === 'select', isMultiselectValue = prop === 'value' && hasChildren && el.multiple, isStringValue, lastSet, scheduledAsyncSet = false, timer, parentEvents, originalValue;
            if (!event) {
                if (prop === 'innerHTML') {
                    event = [
                        'blur',
                        'change'
                    ];
                } else {
                    event = 'change';
                }
            }
            if (!can.isArray(event)) {
                event = [event];
            }
            var set = function (newVal) {
                    if (hasChildren && !scheduledAsyncSet) {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            set(newVal);
                        }, 1);
                    }
                    lastSet = newVal;
                    if (isMultiselectValue) {
                        if (newVal && typeof newVal === 'string') {
                            newVal = newVal.split(';');
                            isStringValue = true;
                        } else if (newVal) {
                            newVal = can.makeArray(newVal);
                        } else {
                            newVal = [];
                        }
                        var isSelected = {};
                        can.each(newVal, function (val) {
                            isSelected[val] = true;
                        });
                        can.each(el.childNodes, function (option) {
                            if (option.value) {
                                option.selected = !!isSelected[option.value];
                            }
                        });
                    } else {
                        if (!bindingData.legacyBindings && hasChildren && 'selectedIndex' in el && prop === 'value') {
                            can.attr.setSelectValue(el, newVal);
                        } else {
                            can.attr.setAttrOrProp(el, prop, newVal == null ? '' : newVal);
                        }
                    }
                    return newVal;
                }, get = function () {
                    if (isMultiselectValue) {
                        var values = [], children = el.childNodes;
                        can.each(children, function (child) {
                            if (child.selected && child.value) {
                                values.push(child.value);
                            }
                        });
                        return isStringValue ? values.join(';') : values;
                    } else if (hasChildren && 'selectedIndex' in el && el.selectedIndex === -1) {
                        return undefined;
                    }
                    return can.attr.get(el, prop);
                };
            if (hasChildren) {
                setTimeout(function () {
                    scheduledAsyncSet = true;
                }, 1);
            }
            if (el.tagName && el.tagName.toLowerCase() === 'input' && el.form) {
                parentEvents = [{
                        el: el.form,
                        eventName: 'reset',
                        handler: function () {
                            set(originalValue);
                        }
                    }];
            }
            var observer;
            originalValue = get();
            return can.compute(originalValue, {
                on: function (updater) {
                    can.each(event, function (eventName) {
                        can.bind.call(el, eventName, updater);
                    });
                    can.each(parentEvents, function (parentEvent) {
                        can.bind.call(parentEvent.el, parentEvent.eventName, parentEvent.handler);
                    });
                    if (hasChildren) {
                        var onMutation = function (mutations) {
                            if (stickyCompute) {
                                set(stickyCompute());
                            }
                            updater();
                        };
                        if (can.attr.MutationObserver) {
                            observer = new can.attr.MutationObserver(onMutation);
                            observer.observe(el, {
                                childList: true,
                                subtree: true
                            });
                        } else {
                            can.data(can.$(el), 'canBindingCallback', { onMutation: onMutation });
                        }
                    }
                },
                off: function (updater) {
                    can.each(event, function (eventName) {
                        can.unbind.call(el, eventName, updater);
                    });
                    can.each(parentEvents, function (parentEvent) {
                        can.unbind.call(parentEvent.el, parentEvent.eventName, parentEvent.handler);
                    });
                    if (hasChildren) {
                        if (can.attr.MutationObserver) {
                            observer.disconnect();
                        } else {
                            can.data(can.$(el), 'canBindingCallback', null);
                        }
                    }
                },
                get: get,
                set: set
            });
        }
    };
    var bind = {
        childToParent: function (el, parentCompute, childCompute, bindingsSemaphore, attrName, syncChild) {
            var parentUpdateIsFunction = typeof parentCompute === 'function';
            var updateParent = function (ev, newVal) {
                if (!bindingsSemaphore[attrName]) {
                    if (parentUpdateIsFunction) {
                        parentCompute(newVal);
                        if (syncChild) {
                            if (parentCompute() !== childCompute()) {
                                bindingsSemaphore[attrName] = (bindingsSemaphore[attrName] || 0) + 1;
                                can.batch.start();
                                childCompute(parentCompute());
                                can.batch.after(function () {
                                    --bindingsSemaphore[attrName];
                                });
                                can.batch.stop();
                            }
                        }
                    } else if (parentCompute instanceof can.Map) {
                        parentCompute.attr(newVal, true);
                    }
                }
            };
            if (childCompute && childCompute.isComputed) {
                childCompute.bind('change', updateParent);
            }
            return updateParent;
        },
        parentToChild: function (el, parentCompute, childUpdate, bindingsSemaphore, attrName) {
            var updateChild = function (ev, newValue) {
                bindingsSemaphore[attrName] = (bindingsSemaphore[attrName] || 0) + 1;
                can.batch.start();
                childUpdate(newValue);
                can.batch.after(function () {
                    --bindingsSemaphore[attrName];
                });
                can.batch.stop();
            };
            if (parentCompute && parentCompute.isComputed) {
                parentCompute.bind('change', updateChild);
            }
            return updateChild;
        }
    };
    var getBindingInfo = function (node, attributeViewModelBindings, templateType, tagName) {
        var bindingInfo, attributeName = node.name, attributeValue = node.value || '';
        var matches = attributeName.match(bindingsRegExp);
        if (!matches) {
            var ignoreAttribute = ignoreAttributesRegExp.test(attributeName);
            var vmName = can.camelize(attributeName);
            if (ignoreAttribute || viewCallbacks.attr(attributeName)) {
                return;
            }
            var syntaxRight = attributeValue[0] === '{' && can.last(attributeValue) === '}';
            var isAttributeToChild = templateType === 'legacy' ? attributeViewModelBindings[vmName] : !syntaxRight;
            var scopeName = syntaxRight ? attributeValue.substr(1, attributeValue.length - 2) : attributeValue;
            if (isAttributeToChild) {
                return {
                    bindingAttributeName: attributeName,
                    parent: 'attribute',
                    parentName: attributeName,
                    child: 'viewModel',
                    childName: vmName,
                    parentToChild: true,
                    childToParent: true
                };
            } else {
                return {
                    bindingAttributeName: attributeName,
                    parent: 'scope',
                    parentName: scopeName,
                    child: 'viewModel',
                    childName: vmName,
                    parentToChild: true,
                    childToParent: true
                };
            }
        }
        var twoWay = !!matches[1], childToParent = twoWay || !!matches[2], parentToChild = twoWay || !childToParent;
        var childName = matches[3];
        var isDOM = childName.charAt(0) === '$';
        if (isDOM) {
            bindingInfo = {
                parent: 'scope',
                child: 'attribute',
                childToParent: childToParent,
                parentToChild: parentToChild,
                bindingAttributeName: attributeName,
                childName: childName.substr(1),
                parentName: attributeValue,
                initializeValues: true
            };
            if (tagName === 'select') {
                bindingInfo.stickyParentToChild = true;
            }
            return bindingInfo;
        } else {
            bindingInfo = {
                parent: 'scope',
                child: 'viewModel',
                childToParent: childToParent,
                parentToChild: parentToChild,
                bindingAttributeName: attributeName,
                childName: can.camelize(childName),
                parentName: attributeValue,
                initializeValues: true
            };
            if (attributeValue.trim().charAt(0) === '~') {
                bindingInfo.stickyParentToChild = true;
            }
            return bindingInfo;
        }
    };
    var bindingsRegExp = /\{(\()?(\^)?([^\}\)]+)\)?\}/, ignoreAttributesRegExp = /^(data-view-id|class|id|\[[\w\.-]+\]|#[\w\.-])$/i;
    var makeDataBinding = function (node, el, bindingData) {
        var bindingInfo = getBindingInfo(node, bindingData.attributeViewModelBindings, bindingData.templateType, el.nodeName.toLowerCase());
        if (!bindingInfo) {
            return;
        }
        bindingInfo.alreadyUpdatedChild = bindingData.alreadyUpdatedChild;
        if (bindingData.initializeValues) {
            bindingInfo.initializeValues = true;
        }
        var parentCompute = getComputeFrom[bindingInfo.parent](el, bindingData.scope, bindingInfo.parentName, bindingData, bindingInfo.parentToChild), childCompute = getComputeFrom[bindingInfo.child](el, bindingData.scope, bindingInfo.childName, bindingData, bindingInfo.childToParent, bindingInfo.stickyParentToChild && parentCompute), updateParent, updateChild, childLifecycle;
        if (bindingData.nodeList) {
            if (parentCompute && parentCompute.isComputed) {
                parentCompute.computeInstance.setPrimaryDepth(bindingData.nodeList.nesting + 1);
            }
            if (childCompute && childCompute.isComputed) {
                childCompute.computeInstance.setPrimaryDepth(bindingData.nodeList.nesting + 1);
            }
        }
        if (bindingInfo.parentToChild) {
            updateChild = bind.parentToChild(el, parentCompute, childCompute, bindingData.semaphore, bindingInfo.bindingAttributeName);
        }
        var completeBinding = function () {
            if (bindingInfo.childToParent) {
                updateParent = bind.childToParent(el, parentCompute, childCompute, bindingData.semaphore, bindingInfo.bindingAttributeName, bindingData.syncChildWithParent);
            } else if (bindingInfo.stickyParentToChild) {
                childCompute.bind('change', childLifecycle = can.k);
            }
            if (bindingInfo.initializeValues) {
                initializeValues(bindingInfo, childCompute, parentCompute, updateChild, updateParent);
            }
        };
        var onTeardown = function () {
            unbindUpdate(parentCompute, updateChild);
            unbindUpdate(childCompute, updateParent);
            unbindUpdate(childCompute, childLifecycle);
        };
        if (bindingInfo.child === 'viewModel') {
            return {
                value: getValue(parentCompute),
                onCompleteBinding: completeBinding,
                bindingInfo: bindingInfo,
                onTeardown: onTeardown
            };
        } else {
            completeBinding();
            return {
                bindingInfo: bindingInfo,
                onTeardown: onTeardown
            };
        }
    };
    var initializeValues = function (bindingInfo, childCompute, parentCompute, updateChild, updateParent) {
        var doUpdateParent = false;
        if (bindingInfo.parentToChild && !bindingInfo.childToParent) {
            if (bindingInfo.stickyParentToChild) {
                updateChild({}, getValue(parentCompute));
            }
        } else if (!bindingInfo.parentToChild && bindingInfo.childToParent) {
            doUpdateParent = true;
        } else if (getValue(childCompute) === undefined) {
        } else if (getValue(parentCompute) === undefined) {
            doUpdateParent = true;
        }
        if (doUpdateParent) {
            updateParent({}, getValue(childCompute));
        } else {
            if (!bindingInfo.alreadyUpdatedChild) {
                updateChild({}, getValue(parentCompute));
            }
        }
    };
    if (!can.attr.MutationObserver) {
        var updateSelectValue = function (el) {
            var bindingCallback = can.data(can.$(el), 'canBindingCallback');
            if (bindingCallback) {
                bindingCallback.onMutation(el);
            }
        };
        live.registerChildMutationCallback('select', updateSelectValue);
        live.registerChildMutationCallback('optgroup', function (el) {
            updateSelectValue(el.parentNode);
        });
    }
    var isContentEditable = function () {
            var values = {
                '': true,
                'true': true,
                'false': false
            };
            var editable = function (el) {
                if (!el || !el.getAttribute) {
                    return;
                }
                var attr = el.getAttribute('contenteditable');
                return values[attr];
            };
            return function (el) {
                var val = editable(el);
                if (typeof val === 'boolean') {
                    return val;
                } else {
                    return !!editable(el.parentNode);
                }
            };
        }(), removeBrackets = function (value, open, close) {
            open = open || '{';
            close = close || '}';
            if (value[0] === open && value[value.length - 1] === close) {
                return value.substr(1, value.length - 2);
            }
            return value;
        }, getValue = function (value) {
            return value && value.isComputed ? value() : value;
        }, unbindUpdate = function (compute, updateOther) {
            if (compute && compute.isComputed && typeof updateOther === 'function') {
                compute.unbind('change', updateOther);
            }
        }, cleanVMName = function (name) {
            return name.replace(/@/g, '');
        };
    var special = {
        enter: function (data, el, original) {
            return {
                event: 'keyup',
                handler: function (ev) {
                    if (ev.keyCode === 13) {
                        return original.call(this, ev);
                    }
                }
            };
        }
    };
    can.bindings = {
        behaviors: behaviors,
        getBindingInfo: getBindingInfo,
        special: special
    };
    return can.bindings;
});
/*can/control/control*/
define('can/control/control', [
    'can/util/util',
    'can/construct/construct'
], function (can) {
    var bind = function (el, ev, callback) {
            can.bind.call(el, ev, callback);
            return function () {
                can.unbind.call(el, ev, callback);
            };
        }, isFunction = can.isFunction, extend = can.extend, each = can.each, slice = [].slice, paramReplacer = /\{([^\}]+)\}/g, special = can.getObject('$.event.special', [can]) || {}, delegate = function (el, selector, ev, callback) {
            can.delegate.call(el, selector, ev, callback);
            return function () {
                can.undelegate.call(el, selector, ev, callback);
            };
        }, binder = function (el, ev, callback, selector) {
            return selector ? delegate(el, can.trim(selector), ev, callback) : bind(el, ev, callback);
        }, basicProcessor;
    var Control = can.Control = can.Construct({
        setup: function () {
            can.Construct.setup.apply(this, arguments);
            if (can.Control) {
                var control = this, funcName;
                control.actions = {};
                for (funcName in control.prototype) {
                    if (control._isAction(funcName)) {
                        control.actions[funcName] = control._action(funcName);
                    }
                }
            }
        },
        _shifter: function (context, name) {
            var method = typeof name === 'string' ? context[name] : name;
            if (!isFunction(method)) {
                method = context[method];
            }
            return function () {
                context.called = name;
                return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
            };
        },
        _isAction: function (methodName) {
            var val = this.prototype[methodName], type = typeof val;
            return methodName !== 'constructor' && (type === 'function' || type === 'string' && isFunction(this.prototype[val])) && !!(special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
        },
        _action: function (methodName, options) {
            paramReplacer.lastIndex = 0;
            if (options || !paramReplacer.test(methodName)) {
                var convertedName = options ? can.sub(methodName, this._lookup(options)) : methodName;
                if (!convertedName) {
                    return null;
                }
                var arr = can.isArray(convertedName), name = arr ? convertedName[1] : convertedName, parts = name.split(/\s+/g), event = parts.pop();
                return {
                    processor: processors[event] || basicProcessor,
                    parts: [
                        name,
                        parts.join(' '),
                        event
                    ],
                    delegate: arr ? convertedName[0] : undefined
                };
            }
        },
        _lookup: function (options) {
            return [
                options,
                window
            ];
        },
        processors: {},
        defaults: {}
    }, {
        setup: function (element, options) {
            var cls = this.constructor, pluginname = cls.pluginName || cls._fullName, arr;
            this.element = can.$(element);
            if (pluginname && pluginname !== 'can_control') {
                this.element.addClass(pluginname);
            }
            arr = can.data(this.element, 'controls');
            if (!arr) {
                arr = [];
                can.data(this.element, 'controls', arr);
            }
            arr.push(this);
            this.options = extend({}, cls.defaults, options);
            this.on();
            return [
                this.element,
                this.options
            ];
        },
        on: function (el, selector, eventName, func) {
            if (!el) {
                this.off();
                var cls = this.constructor, bindings = this._bindings, actions = cls.actions, element = this.element, destroyCB = can.Control._shifter(this, 'destroy'), funcName, ready;
                for (funcName in actions) {
                    if (actions.hasOwnProperty(funcName)) {
                        ready = actions[funcName] || cls._action(funcName, this.options, this);
                        if (ready) {
                            bindings.control[funcName] = ready.processor(ready.delegate || element, ready.parts[2], ready.parts[1], funcName, this);
                        }
                    }
                }
                can.bind.call(element, 'removed', destroyCB);
                bindings.user.push(function (el) {
                    can.unbind.call(el, 'removed', destroyCB);
                });
                return bindings.user.length;
            }
            if (typeof el === 'string') {
                func = eventName;
                eventName = selector;
                selector = el;
                el = this.element;
            }
            if (func === undefined) {
                func = eventName;
                eventName = selector;
                selector = null;
            }
            if (typeof func === 'string') {
                func = can.Control._shifter(this, func);
            }
            this._bindings.user.push(binder(el, eventName, func, selector));
            return this._bindings.user.length;
        },
        off: function () {
            var el = this.element[0], bindings = this._bindings;
            if (bindings) {
                each(bindings.user || [], function (value) {
                    value(el);
                });
                each(bindings.control || {}, function (value) {
                    value(el);
                });
            }
            this._bindings = {
                user: [],
                control: {}
            };
        },
        destroy: function () {
            if (this.element === null) {
                return;
            }
            var Class = this.constructor, pluginName = Class.pluginName || Class._fullName, controls;
            this.off();
            if (pluginName && pluginName !== 'can_control') {
                this.element.removeClass(pluginName);
            }
            controls = can.data(this.element, 'controls');
            controls.splice(can.inArray(this, controls), 1);
            can.trigger(this, 'destroyed');
            this.element = null;
        }
    });
    var processors = can.Control.processors;
    basicProcessor = function (el, event, selector, methodName, control) {
        return binder(el, event, can.Control._shifter(control, methodName), selector);
    };
    each([
        'change',
        'click',
        'contextmenu',
        'dblclick',
        'keydown',
        'keyup',
        'keypress',
        'mousedown',
        'mousemove',
        'mouseout',
        'mouseover',
        'mouseup',
        'reset',
        'resize',
        'scroll',
        'select',
        'submit',
        'focusin',
        'focusout',
        'mouseenter',
        'mouseleave',
        'touchstart',
        'touchmove',
        'touchcancel',
        'touchend',
        'touchleave',
        'inserted',
        'removed',
        'dragstart',
        'dragenter',
        'dragover',
        'dragleave',
        'drag',
        'drop',
        'dragend'
    ], function (v) {
        processors[v] = basicProcessor;
    });
    return Control;
});
/*can/observe/observe*/
define('can/observe/observe', [
    'can/util/util',
    'can/map/map',
    'can/list/list',
    'can/compute/compute'
], function (can) {
    can.Observe = can.Map;
    can.Observe.startBatch = can.batch.start;
    can.Observe.stopBatch = can.batch.stop;
    can.Observe.triggerBatch = can.batch.trigger;
    return can;
});
/*can/view/scanner*/
define('can/view/scanner', [
    'can/view/view',
    'can/view/elements',
    'can/view/callbacks/callbacks'
], function (can, elements, viewCallbacks) {
    var newLine = /(\r|\n)+/g, notEndTag = /\//, clean = function (content) {
            return content.split('\\').join('\\\\').split('\n').join('\\n').split('"').join('\\"').split('\t').join('\\t');
        }, getTag = function (tagName, tokens, i) {
            if (tagName) {
                return tagName;
            } else {
                while (i < tokens.length) {
                    if (tokens[i] === '<' && !notEndTag.test(tokens[i + 1])) {
                        return elements.reverseTagMap[tokens[i + 1]] || 'span';
                    }
                    i++;
                }
            }
            return '';
        }, bracketNum = function (content) {
            return --content.split('{').length - --content.split('}').length;
        }, myEval = function (script) {
            eval(script);
        }, attrReg = /([^\s]+)[\s]*=[\s]*$/, startTxt = 'var ___v1ew = [];', finishTxt = 'return ___v1ew.join(\'\')', put_cmd = '___v1ew.push(\n', insert_cmd = put_cmd, htmlTag = null, quote = null, beforeQuote = null, rescan = null, getAttrName = function () {
            var matches = beforeQuote.match(attrReg);
            return matches && matches[1];
        }, status = function () {
            return quote ? '\'' + getAttrName() + '\'' : htmlTag ? 1 : 0;
        }, top = function (stack) {
            return stack[stack.length - 1];
        }, Scanner;
    can.view.Scanner = Scanner = function (options) {
        can.extend(this, {
            text: {},
            tokens: []
        }, options);
        this.text.options = this.text.options || '';
        this.tokenReg = [];
        this.tokenSimple = {
            '<': '<',
            '>': '>',
            '"': '"',
            '\'': '\''
        };
        this.tokenComplex = [];
        this.tokenMap = {};
        for (var i = 0, token; token = this.tokens[i]; i++) {
            if (token[2]) {
                this.tokenReg.push(token[2]);
                this.tokenComplex.push({
                    abbr: token[1],
                    re: new RegExp(token[2]),
                    rescan: token[3]
                });
            } else {
                this.tokenReg.push(token[1]);
                this.tokenSimple[token[1]] = token[0];
            }
            this.tokenMap[token[0]] = token[1];
        }
        this.tokenReg = new RegExp('(' + this.tokenReg.slice(0).concat([
            '<',
            '>',
            '"',
            '\''
        ]).join('|') + ')', 'g');
    };
    Scanner.prototype = {
        helpers: [],
        scan: function (source, name) {
            var tokens = [], last = 0, simple = this.tokenSimple, complex = this.tokenComplex;
            source = source.replace(newLine, '\n');
            if (this.transform) {
                source = this.transform(source);
            }
            source.replace(this.tokenReg, function (whole, part) {
                var offset = arguments[arguments.length - 2];
                if (offset > last) {
                    tokens.push(source.substring(last, offset));
                }
                if (simple[whole]) {
                    tokens.push(whole);
                } else {
                    for (var i = 0, token; token = complex[i]; i++) {
                        if (token.re.test(whole)) {
                            tokens.push(token.abbr);
                            if (token.rescan) {
                                tokens.push(token.rescan(part));
                            }
                            break;
                        }
                    }
                }
                last = offset + part.length;
            });
            if (last < source.length) {
                tokens.push(source.substr(last));
            }
            var content = '', buff = [startTxt + (this.text.start || '')], put = function (content, bonus) {
                    buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                }, endStack = [], lastToken, startTag = null, magicInTag = false, specialStates = {
                    attributeHookups: [],
                    tagHookups: [],
                    lastTagHookup: ''
                }, popTagHookup = function () {
                    specialStates.lastTagHookup = specialStates.tagHookups.pop() + specialStates.tagHookups.length;
                }, tagName = '', tagNames = [], popTagName = false, bracketCount, specialAttribute = false, i = 0, token, tmap = this.tokenMap, attrName;
            htmlTag = quote = beforeQuote = null;
            for (; (token = tokens[i++]) !== undefined;) {
                if (startTag === null) {
                    switch (token) {
                    case tmap.left:
                    case tmap.escapeLeft:
                    case tmap.returnLeft:
                        magicInTag = htmlTag && 1;
                    case tmap.commentLeft:
                        startTag = token;
                        if (content.length) {
                            put(content);
                        }
                        content = '';
                        break;
                    case tmap.escapeFull:
                        magicInTag = htmlTag && 1;
                        rescan = 1;
                        startTag = tmap.escapeLeft;
                        if (content.length) {
                            put(content);
                        }
                        rescan = tokens[i++];
                        content = rescan.content || rescan;
                        if (rescan.before) {
                            put(rescan.before);
                        }
                        tokens.splice(i, 0, tmap.right);
                        break;
                    case tmap.commentFull:
                        break;
                    case tmap.templateLeft:
                        content += tmap.left;
                        break;
                    case '<':
                        if (tokens[i].indexOf('!--') !== 0) {
                            htmlTag = 1;
                            magicInTag = 0;
                        }
                        content += token;
                        break;
                    case '>':
                        htmlTag = 0;
                        var emptyElement = content.substr(content.length - 1) === '/' || content.substr(content.length - 2) === '--', attrs = '';
                        if (specialStates.attributeHookups.length) {
                            attrs = 'attrs: [\'' + specialStates.attributeHookups.join('\',\'') + '\'], ';
                            specialStates.attributeHookups = [];
                        }
                        if (tagName + specialStates.tagHookups.length !== specialStates.lastTagHookup && tagName === top(specialStates.tagHookups)) {
                            if (emptyElement) {
                                content = content.substr(0, content.length - 1);
                            }
                            buff.push(put_cmd, '"', clean(content), '"', ',can.view.pending({tagName:\'' + tagName + '\',' + attrs + 'scope: ' + (this.text.scope || 'this') + this.text.options);
                            if (emptyElement) {
                                buff.push('}));');
                                content = '/>';
                                popTagHookup();
                            } else if (tokens[i] === '<' && tokens[i + 1] === '/' + tagName) {
                                buff.push('}));');
                                content = token;
                                popTagHookup();
                            } else {
                                buff.push(',subtemplate: function(' + this.text.argNames + '){\n' + startTxt + (this.text.start || ''));
                                content = '';
                            }
                        } else if (magicInTag || !popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]] || attrs) {
                            var pendingPart = ',can.view.pending({' + attrs + 'scope: ' + (this.text.scope || 'this') + this.text.options + '}),"';
                            if (emptyElement) {
                                put(content.substr(0, content.length - 1), pendingPart + '/>"');
                            } else {
                                put(content, pendingPart + '>"');
                            }
                            content = '';
                            magicInTag = 0;
                        } else {
                            content += token;
                        }
                        if (emptyElement || popTagName) {
                            tagNames.pop();
                            tagName = tagNames[tagNames.length - 1];
                            popTagName = false;
                        }
                        specialStates.attributeHookups = [];
                        break;
                    case '\'':
                    case '"':
                        if (htmlTag) {
                            if (quote && quote === token) {
                                quote = null;
                                var attr = getAttrName();
                                if (viewCallbacks.attr(attr)) {
                                    specialStates.attributeHookups.push(attr);
                                }
                                if (specialAttribute) {
                                    content += token;
                                    put(content);
                                    buff.push(finishTxt, '}));\n');
                                    content = '';
                                    specialAttribute = false;
                                    break;
                                }
                            } else if (quote === null) {
                                quote = token;
                                beforeQuote = lastToken;
                                attrName = getAttrName();
                                if (tagName === 'img' && attrName === 'src' || attrName === 'style') {
                                    put(content.replace(attrReg, ''));
                                    content = '';
                                    specialAttribute = true;
                                    buff.push(insert_cmd, 'can.view.txt(2,\'' + getTag(tagName, tokens, i) + '\',' + status() + ',this,function(){', startTxt);
                                    put(attrName + '=' + token);
                                    break;
                                }
                            }
                        }
                    default:
                        if (lastToken === '<') {
                            tagName = token.substr(0, 3) === '!--' ? '!--' : token.split(/\s/)[0];
                            var isClosingTag = false, cleanedTagName;
                            if (tagName.indexOf('/') === 0) {
                                isClosingTag = true;
                                cleanedTagName = tagName.substr(1);
                            }
                            if (isClosingTag) {
                                if (top(tagNames) === cleanedTagName) {
                                    tagName = cleanedTagName;
                                    popTagName = true;
                                }
                                if (top(specialStates.tagHookups) === cleanedTagName) {
                                    put(content.substr(0, content.length - 1));
                                    buff.push(finishTxt + '}}) );');
                                    content = '><';
                                    popTagHookup();
                                }
                            } else {
                                if (tagName.lastIndexOf('/') === tagName.length - 1) {
                                    tagName = tagName.substr(0, tagName.length - 1);
                                }
                                if (tagName !== '!--' && viewCallbacks.tag(tagName)) {
                                    if (tagName === 'content' && elements.tagMap[top(tagNames)]) {
                                        token = token.replace('content', elements.tagMap[top(tagNames)]);
                                    }
                                    specialStates.tagHookups.push(tagName);
                                }
                                tagNames.push(tagName);
                            }
                        }
                        content += token;
                        break;
                    }
                } else {
                    switch (token) {
                    case tmap.right:
                    case tmap.returnRight:
                        switch (startTag) {
                        case tmap.left:
                            bracketCount = bracketNum(content);
                            if (bracketCount === 1) {
                                buff.push(insert_cmd, 'can.view.txt(0,\'' + getTag(tagName, tokens, i) + '\',' + status() + ',this,function(){', startTxt, content);
                                endStack.push({
                                    before: '',
                                    after: finishTxt + '}));\n'
                                });
                            } else {
                                last = endStack.length && bracketCount === -1 ? endStack.pop() : { after: ';' };
                                if (last.before) {
                                    buff.push(last.before);
                                }
                                buff.push(content, ';', last.after);
                            }
                            break;
                        case tmap.escapeLeft:
                        case tmap.returnLeft:
                            bracketCount = bracketNum(content);
                            if (bracketCount) {
                                endStack.push({
                                    before: finishTxt,
                                    after: '}));\n'
                                });
                            }
                            var escaped = startTag === tmap.escapeLeft ? 1 : 0, commands = {
                                    insert: insert_cmd,
                                    tagName: getTag(tagName, tokens, i),
                                    status: status(),
                                    specialAttribute: specialAttribute
                                };
                            for (var ii = 0; ii < this.helpers.length; ii++) {
                                var helper = this.helpers[ii];
                                if (helper.name.test(content)) {
                                    content = helper.fn(content, commands);
                                    if (helper.name.source === /^>[\s]*\w*/.source) {
                                        escaped = 0;
                                    }
                                    break;
                                }
                            }
                            if (typeof content === 'object') {
                                if (content.startTxt && content.end && specialAttribute) {
                                    buff.push(insert_cmd, 'can.view.toStr( ', content.content, '() ) );');
                                } else {
                                    if (content.startTxt) {
                                        buff.push(insert_cmd, 'can.view.txt(\n' + (typeof status() === 'string' || (content.escaped != null ? content.escaped : escaped)) + ',\n\'' + tagName + '\',\n' + status() + ',\nthis,\n');
                                    } else if (content.startOnlyTxt) {
                                        buff.push(insert_cmd, 'can.view.onlytxt(this,\n');
                                    }
                                    buff.push(content.content);
                                    if (content.end) {
                                        buff.push('));');
                                    }
                                }
                            } else if (specialAttribute) {
                                buff.push(insert_cmd, content, ');');
                            } else {
                                buff.push(insert_cmd, 'can.view.txt(\n' + (typeof status() === 'string' || escaped) + ',\n\'' + tagName + '\',\n' + status() + ',\nthis,\nfunction(){ ' + (this.text.escape || '') + 'return ', content, bracketCount ? startTxt : '}));\n');
                            }
                            if (rescan && rescan.after && rescan.after.length) {
                                put(rescan.after.length);
                                rescan = null;
                            }
                            break;
                        }
                        startTag = null;
                        content = '';
                        break;
                    case tmap.templateLeft:
                        content += tmap.left;
                        break;
                    default:
                        content += token;
                        break;
                    }
                }
                lastToken = token;
            }
            if (content.length) {
                put(content);
            }
            buff.push(';');
            var template = buff.join(''), out = { out: (this.text.outStart || '') + template + ' ' + finishTxt + (this.text.outEnd || '') };
            myEval.call(out, 'this.fn = (function(' + this.text.argNames + '){' + out.out + '});\r\n//# sourceURL=' + name + '.js');
            return out;
        }
    };
    can.view.pending = function (viewData) {
        var hooks = can.view.getHooks();
        return can.view.hook(function (el) {
            can.each(hooks, function (fn) {
                fn(el);
            });
            viewData.templateType = 'legacy';
            if (viewData.tagName) {
                viewCallbacks.tagHandler(el, viewData.tagName, viewData);
            }
            can.each(viewData && viewData.attrs || [], function (attributeName) {
                viewData.attributeName = attributeName;
                var callback = viewCallbacks.attr(attributeName);
                if (callback) {
                    callback(el, viewData);
                }
            });
        });
    };
    can.view.tag('content', function (el, tagData) {
        return tagData.scope;
    });
    can.view.Scanner = Scanner;
    return Scanner;
});
/*can/view/render*/
define('can/view/render', [
    'can/view/view',
    'can/view/elements',
    'can/view/live/live',
    'can/util/string/string'
], function (can, elements, live) {
    var pendingHookups = [], tagChildren = function (tagName) {
            var newTag = elements.tagMap[tagName] || 'span';
            if (newTag === 'span') {
                return '@@!!@@';
            }
            return '<' + newTag + '>' + tagChildren(newTag) + '</' + newTag + '>';
        }, contentText = function (input, tag) {
            if (typeof input === 'string') {
                return input;
            }
            if (!input && input !== 0) {
                return '';
            }
            var hook = input.hookup && function (el, id) {
                input.hookup.call(input, el, id);
            } || typeof input === 'function' && input;
            if (hook) {
                if (tag) {
                    return '<' + tag + ' ' + can.view.hook(hook) + '></' + tag + '>';
                } else {
                    pendingHookups.push(hook);
                }
                return '';
            }
            return '' + input;
        }, contentEscape = function (txt, tag) {
            return typeof txt === 'string' || typeof txt === 'number' ? can.esc(txt) : contentText(txt, tag);
        }, withinTemplatedSectionWithinAnElement = false, emptyHandler = function () {
        };
    var lastHookups;
    can.extend(can.view, {
        live: live,
        setupLists: function () {
            var old = can.view.lists, data;
            can.view.lists = function (list, renderer) {
                data = {
                    list: list,
                    renderer: renderer
                };
                return Math.random();
            };
            return function () {
                can.view.lists = old;
                return data;
            };
        },
        getHooks: function () {
            var hooks = pendingHookups.slice(0);
            lastHookups = hooks;
            pendingHookups = [];
            return hooks;
        },
        onlytxt: function (self, func) {
            return contentEscape(func.call(self));
        },
        txt: function (escape, tagName, status, self, func) {
            var tag = elements.tagMap[tagName] || 'span', setupLiveBinding = false, value, listData, compute, unbind = emptyHandler, attributeName;
            if (withinTemplatedSectionWithinAnElement) {
                value = func.call(self);
            } else {
                if (typeof status === 'string' || status === 1) {
                    withinTemplatedSectionWithinAnElement = true;
                }
                var listTeardown = can.view.setupLists();
                unbind = function () {
                    compute.unbind('change', emptyHandler);
                };
                compute = can.compute(func, self, false);
                compute.bind('change', emptyHandler);
                listData = listTeardown();
                value = compute();
                withinTemplatedSectionWithinAnElement = false;
                setupLiveBinding = compute.computeInstance.hasDependencies;
            }
            if (listData) {
                unbind();
                return '<' + tag + can.view.hook(function (el, parentNode) {
                    live.list(el, listData.list, listData.renderer, self, parentNode);
                }) + '></' + tag + '>';
            }
            if (!setupLiveBinding || typeof value === 'function') {
                unbind();
                return (withinTemplatedSectionWithinAnElement || escape === 2 || !escape ? contentText : contentEscape)(value, status === 0 && tag);
            }
            var contentProp = elements.tagToContentPropMap[tagName];
            if (status === 0 && !contentProp) {
                var selfClosing = !!elements.selfClosingTags[tag];
                return '<' + tag + can.view.hook(escape && typeof value !== 'object' ? function (el, parentNode) {
                    live.text(el, compute, parentNode);
                    unbind();
                } : function (el, parentNode) {
                    live.html(el, compute, parentNode);
                    unbind();
                }) + (selfClosing ? '/>' : '>' + tagChildren(tag) + '</' + tag + '>');
            } else if (status === 1) {
                pendingHookups.push(function (el) {
                    live.attributes(el, compute, compute());
                    unbind();
                });
                return compute();
            } else if (escape === 2) {
                attributeName = status;
                pendingHookups.push(function (el) {
                    live.specialAttribute(el, attributeName, compute);
                    unbind();
                });
                return compute();
            } else {
                attributeName = status === 0 ? contentProp : status;
                (status === 0 ? lastHookups : pendingHookups).push(function (el) {
                    live.attribute(el, attributeName, compute);
                    unbind();
                });
                return live.attributePlaceholder;
            }
        }
    });
    return can;
});
/*can/view/mustache/mustache*/
define('can/view/mustache/mustache', [
    'can/util/util',
    'can/view/scope/scope',
    'can/view/view',
    'can/view/scanner',
    'can/compute/compute',
    'can/view/render',
    'can/view/bindings/bindings'
], function (can) {
    can.view.ext = '.mustache';
    var SCOPE = 'scope', HASH = '___h4sh', CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options}', SPECIAL_CONTEXT_OBJ = '{scope:' + SCOPE + ',options:options, special: true}', ARG_NAMES = SCOPE + ',options', argumentsRegExp = /((([^'"\s]+?=)?('.*?'|".*?"))|.*?)\s/g, literalNumberStringBooleanRegExp = /^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false|null|undefined)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/, makeLookupLiteral = function (type) {
            return '{get:"' + type.replace(/"/g, '\\"') + '"}';
        }, isLookup = function (obj) {
            return obj && typeof obj.get === 'string';
        }, isObserveLike = function (obj) {
            return obj instanceof can.Map || obj && !!obj._get;
        }, isArrayLike = function (obj) {
            return obj && obj.splice && typeof obj.length === 'number';
        }, makeConvertToScopes = function (original, scope, options) {
            var originalWithScope = function (ctx, opts) {
                return original(ctx || scope, opts);
            };
            return function (updatedScope, updatedOptions) {
                if (updatedScope !== undefined && !(updatedScope instanceof can.view.Scope)) {
                    updatedScope = scope.add(updatedScope);
                }
                if (updatedOptions !== undefined && !(updatedOptions instanceof can.view.Options)) {
                    updatedOptions = options.add(updatedOptions);
                }
                return originalWithScope(updatedScope, updatedOptions || options);
            };
        };
    var Mustache = function (options, helpers) {
        if (this.constructor !== Mustache) {
            var mustache = new Mustache(options);
            return function (data, options) {
                return mustache.render(data, options);
            };
        }
        if (typeof options === 'function') {
            this.template = { fn: options };
            return;
        }
        can.extend(this, options);
        this.template = this.scanner.scan(this.text, this.name);
    };
    can.Mustache = can.global.Mustache = Mustache;
    Mustache.prototype.render = function (data, options) {
        if (!(data instanceof can.view.Scope)) {
            data = new can.view.Scope(data || {});
        }
        if (!(options instanceof can.view.Options)) {
            options = new can.view.Options(options || {});
        }
        options = options || {};
        return this.template.fn.call(data, data, options);
    };
    can.extend(Mustache.prototype, {
        scanner: new can.view.Scanner({
            text: {
                start: '',
                scope: SCOPE,
                options: ',options: options',
                argNames: ARG_NAMES
            },
            tokens: [
                [
                    'returnLeft',
                    '{{{',
                    '{{[{&]'
                ],
                [
                    'commentFull',
                    '{{!}}',
                    '^[\\s\\t]*{{!.+?}}\\n'
                ],
                [
                    'commentLeft',
                    '{{!',
                    '(\\n[\\s\\t]*{{!|{{!)'
                ],
                [
                    'escapeFull',
                    '{{}}',
                    '(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)',
                    function (content) {
                        return {
                            before: /^\n.+?\n$/.test(content) ? '\n' : '',
                            content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                        };
                    }
                ],
                [
                    'escapeLeft',
                    '{{'
                ],
                [
                    'returnRight',
                    '}}}'
                ],
                [
                    'right',
                    '}}'
                ]
            ],
            helpers: [
                {
                    name: /^>[\s]*\w*/,
                    fn: function (content, cmd) {
                        var templateName = can.trim(content.replace(/^>\s?/, '')).replace(/["|']/g, '');
                        return 'can.Mustache.renderPartial(\'' + templateName + '\',' + ARG_NAMES + ')';
                    }
                },
                {
                    name: /^\s*data\s/,
                    fn: function (content, cmd) {
                        var attr = content.match(/["|'](.*)["|']/)[1];
                        return 'can.proxy(function(__){' + 'can.data(can.$(__),\'' + attr + '\', this.attr(\'.\')); }, ' + SCOPE + ')';
                    }
                },
                {
                    name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                    fn: function (content) {
                        var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/, parts = content.match(quickFunc);
                        return 'can.proxy(function(__){var ' + parts[1] + '=can.$(__);with(' + SCOPE + '.attr(\'.\')){' + parts[2] + '}}, this);';
                    }
                },
                {
                    name: /^.*$/,
                    fn: function (content, cmd) {
                        var mode = false, result = {
                                content: '',
                                startTxt: false,
                                startOnlyTxt: false,
                                end: false
                            };
                        content = can.trim(content);
                        if (content.length && (mode = content.match(/^([#^\/]|else$)/))) {
                            mode = mode[0];
                            switch (mode) {
                            case '#':
                            case '^':
                                if (cmd.specialAttribute) {
                                    result.startOnlyTxt = true;
                                } else {
                                    result.startTxt = true;
                                    result.escaped = 0;
                                }
                                break;
                            case '/':
                                result.end = true;
                                result.content += 'return ___v1ew.join("");}}])';
                                return result;
                            }
                            content = content.substring(1);
                        }
                        if (mode !== 'else') {
                            var args = [], hashes = [], i = 0, m;
                            result.content += 'can.Mustache.txt(\n' + (cmd.specialAttribute ? SPECIAL_CONTEXT_OBJ : CONTEXT_OBJ) + ',\n' + (mode ? '"' + mode + '"' : 'null') + ',';
                            (can.trim(content) + ' ').replace(argumentsRegExp, function (whole, arg) {
                                if (i && (m = arg.match(literalNumberStringBooleanRegExp))) {
                                    if (m[2]) {
                                        args.push(m[0]);
                                    } else {
                                        hashes.push(m[4] + ':' + (m[6] ? m[6] : makeLookupLiteral(m[5])));
                                    }
                                } else {
                                    args.push(makeLookupLiteral(arg));
                                }
                                i++;
                            });
                            result.content += args.join(',');
                            if (hashes.length) {
                                result.content += ',{' + HASH + ':{' + hashes.join(',') + '}}';
                            }
                        }
                        if (mode && mode !== 'else') {
                            result.content += ',[\n\n';
                        }
                        switch (mode) {
                        case '^':
                        case '#':
                            result.content += '{fn:function(' + ARG_NAMES + '){var ___v1ew = [];';
                            break;
                        case 'else':
                            result.content += 'return ___v1ew.join("");}},\n{inverse:function(' + ARG_NAMES + '){\nvar ___v1ew = [];';
                            break;
                        default:
                            result.content += ')';
                            break;
                        }
                        if (!mode) {
                            result.startTxt = true;
                            result.end = true;
                        }
                        return result;
                    }
                }
            ]
        })
    });
    var helpers = can.view.Scanner.prototype.helpers;
    for (var i = 0; i < helpers.length; i++) {
        Mustache.prototype.scanner.helpers.unshift(helpers[i]);
    }
    Mustache.txt = function (scopeAndOptions, mode, name) {
        var scope = scopeAndOptions.scope, options = scopeAndOptions.options, args = [], helperOptions = {
                fn: function () {
                },
                inverse: function () {
                }
            }, hash, context = scope.attr('.'), getHelper = true, helper;
        for (var i = 3; i < arguments.length; i++) {
            var arg = arguments[i];
            if (mode && can.isArray(arg)) {
                helperOptions = can.extend.apply(can, [helperOptions].concat(arg));
            } else if (arg && arg[HASH]) {
                hash = arg[HASH];
                for (var prop in hash) {
                    if (isLookup(hash[prop])) {
                        hash[prop] = Mustache.get(hash[prop].get, scopeAndOptions, false, true);
                    }
                }
            } else if (arg && isLookup(arg)) {
                args.push(Mustache.get(arg.get, scopeAndOptions, false, true, true));
            } else {
                args.push(arg);
            }
        }
        if (isLookup(name)) {
            var get = name.get;
            name = Mustache.get(name.get, scopeAndOptions, args.length, false);
            getHelper = get === name;
        }
        helperOptions.fn = makeConvertToScopes(helperOptions.fn, scope, options);
        helperOptions.inverse = makeConvertToScopes(helperOptions.inverse, scope, options);
        if (mode === '^') {
            var tmp = helperOptions.fn;
            helperOptions.fn = helperOptions.inverse;
            helperOptions.inverse = tmp;
        }
        if (helper = getHelper && (typeof name === 'string' && Mustache.getHelper(name, options)) || can.isFunction(name) && !name.isComputed && { fn: name }) {
            can.extend(helperOptions, {
                context: context,
                scope: scope,
                contexts: scope,
                hash: hash
            });
            args.push(helperOptions);
            return function () {
                var result = helper.fn.apply(context, args);
                return result == null ? '' : result;
            };
        }
        return function () {
            var value;
            if (can.isFunction(name) && name.isComputed) {
                value = name();
            } else {
                value = name;
            }
            var validArgs = args.length ? args : [value], valid = true, result = [], i, argIsObserve, arg;
            if (mode) {
                for (i = 0; i < validArgs.length; i++) {
                    arg = validArgs[i];
                    argIsObserve = typeof arg !== 'undefined' && isObserveLike(arg);
                    if (isArrayLike(arg)) {
                        if (mode === '#') {
                            valid = valid && !!(argIsObserve ? arg.attr('length') : arg.length);
                        } else if (mode === '^') {
                            valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                        }
                    } else {
                        valid = mode === '#' ? valid && !!arg : mode === '^' ? valid && !arg : valid;
                    }
                }
            }
            if (valid) {
                if (mode === '#') {
                    if (isArrayLike(value)) {
                        var isObserveList = isObserveLike(value);
                        for (i = 0; i < value.length; i++) {
                            result.push(helperOptions.fn(isObserveList ? value.attr('' + i) : value[i]));
                        }
                        return result.join('');
                    } else {
                        return helperOptions.fn(value || {}) || '';
                    }
                } else if (mode === '^') {
                    return helperOptions.inverse(value || {}) || '';
                } else {
                    return '' + (value != null ? value : '');
                }
            }
            return '';
        };
    };
    Mustache.get = function (key, scopeAndOptions, isHelper, isArgument, isLookup) {
        var context = scopeAndOptions.scope.attr('.'), options = scopeAndOptions.options || {};
        if (isHelper) {
            if (Mustache.getHelper(key, options)) {
                return key;
            }
            if (scopeAndOptions.scope && can.isFunction(context[key])) {
                return context[key];
            }
        }
        var computeData = scopeAndOptions.scope.computeData(key, {
                isArgument: isArgument,
                args: [
                    context,
                    scopeAndOptions.scope
                ]
            }), compute = computeData.compute;
        can.compute.temporarilyBind(compute);
        var initialValue = computeData.initialValue, helperObj = Mustache.getHelper(key, options);
        if (!isLookup && (initialValue === undefined || computeData.scope !== scopeAndOptions.scope) && Mustache.getHelper(key, options)) {
            return key;
        }
        if (!compute.computeInstance.hasDependencies) {
            return initialValue;
        } else {
            return compute;
        }
    };
    Mustache.resolve = function (value) {
        if (isObserveLike(value) && isArrayLike(value) && value.attr('length')) {
            return value;
        } else if (can.isFunction(value)) {
            return value();
        } else {
            return value;
        }
    };
    Mustache._helpers = {};
    Mustache.registerHelper = function (name, fn) {
        this._helpers[name] = {
            name: name,
            fn: fn
        };
    };
    Mustache.registerSimpleHelper = function (name, fn) {
        Mustache.registerHelper(name, can.view.simpleHelper(fn));
    };
    Mustache.getHelper = function (name, options) {
        var helper;
        if (options) {
            helper = options.get('helpers.' + name, { proxyMethods: false });
        }
        return helper ? { fn: helper } : this._helpers[name];
    };
    Mustache.render = function (partial, scope, options) {
        if (!can.view.cached[partial]) {
            can.__notObserve(function () {
                var scopePartialName = scope.attr(partial);
                if (scopePartialName) {
                    partial = scopePartialName;
                }
            })();
        }
        return can.view.render(partial, scope, options);
    };
    Mustache.safeString = function (str) {
        return {
            toString: function () {
                return str;
            }
        };
    };
    Mustache.renderPartial = function (partialName, scope, options) {
        var partial = options.get('partials.' + partialName, { proxyMethods: false });
        if (partial) {
            return partial.render ? partial.render(scope, options) : partial(scope, options);
        } else {
            return can.Mustache.render(partialName, scope, options);
        }
    };
    can.each({
        'if': function (expr, options) {
            var value;
            if (can.isFunction(expr)) {
                value = can.compute.truthy(expr)();
            } else {
                value = !!Mustache.resolve(expr);
            }
            if (value) {
                return options.fn(options.contexts || this);
            } else {
                return options.inverse(options.contexts || this);
            }
        },
        'is': function () {
            var lastValue, curValue, options = arguments[arguments.length - 1];
            if (arguments.length - 2 <= 0) {
                return options.inverse();
            }
            for (var i = 0; i < arguments.length - 1; i++) {
                curValue = Mustache.resolve(arguments[i]);
                curValue = can.isFunction(curValue) ? curValue() : curValue;
                if (i > 0) {
                    if (curValue !== lastValue) {
                        return options.inverse();
                    }
                }
                lastValue = curValue;
            }
            return options.fn();
        },
        'eq': function () {
            return Mustache._helpers.is.fn.apply(this, arguments);
        },
        'unless': function (expr, options) {
            return Mustache._helpers['if'].fn.apply(this, [
                expr,
                can.extend({}, options, {
                    fn: options.inverse,
                    inverse: options.fn
                })
            ]);
        },
        'each': function (expr, options) {
            var resolved = Mustache.resolve(expr), result = [], keys, key, i;
            if (can.view.lists && (resolved instanceof can.List || expr && expr.isComputed && resolved === undefined)) {
                return can.view.lists(expr, function (item, index) {
                    return options.fn(options.scope.add({ '@index': index }).add(item));
                });
            }
            expr = resolved;
            if (!!expr && isArrayLike(expr)) {
                for (i = 0; i < expr.length; i++) {
                    result.push(options.fn(options.scope.add({ '@index': i }).add(expr[i])));
                }
                return result.join('');
            } else if (isObserveLike(expr)) {
                keys = can.Map.keys(expr);
                for (i = 0; i < keys.length; i++) {
                    key = keys[i];
                    result.push(options.fn(options.scope.add({ '@key': key }).add(expr[key])));
                }
                return result.join('');
            } else if (expr instanceof Object) {
                for (key in expr) {
                    result.push(options.fn(options.scope.add({ '@key': key }).add(expr[key])));
                }
                return result.join('');
            }
        },
        'with': function (expr, options) {
            var ctx = expr;
            expr = Mustache.resolve(expr);
            if (!!expr) {
                return options.fn(ctx);
            }
        },
        'log': function (expr, options) {
            if (typeof console !== 'undefined' && console.log) {
                if (!options) {
                    console.log(expr.context);
                } else {
                    console.log(expr, options.context);
                }
            }
        },
        '@index': function (offset, options) {
            if (!options) {
                options = offset;
                offset = 0;
            }
            var index = options.scope.read('@index', { isArgument: true }).value;
            return '' + ((can.isFunction(index) ? index() : index) + offset);
        }
    }, function (fn, name) {
        Mustache.registerHelper(name, fn);
    });
    can.view.register({
        suffix: 'mustache',
        contentType: 'x-mustache-template',
        script: function (id, src) {
            return 'can.Mustache(function(' + ARG_NAMES + ') { ' + new Mustache({
                text: src,
                name: id
            }).template.out + ' })';
        },
        renderer: function (id, text) {
            return Mustache({
                text: text,
                name: id
            });
        }
    });
    can.mustache.registerHelper = can.proxy(can.Mustache.registerHelper, can.Mustache);
    can.mustache.safeString = can.Mustache.safeString;
    return can;
});
/*can/util/view_model/view_model*/
define('can/util/view_model/view_model', ['can/util/util'], function (can) {
    var $ = can.$;
    if ($.fn) {
        $.fn.scope = $.fn.viewModel = function () {
            return can.viewModel.apply(can, [this].concat(can.makeArray(arguments)));
        };
    }
});
/*can/component/component*/
define('can/component/component', [
    'can/util/util',
    'can/view/callbacks/callbacks',
    'can/view/elements',
    'can/view/bindings/bindings',
    'can/control/control',
    'can/observe/observe',
    'can/view/mustache/mustache',
    'can/util/view_model/view_model'
], function (can, viewCallbacks, elements, bindings) {
    var paramReplacer = /\{([^\}]+)\}/g;
    var Component = can.Component = can.Construct.extend({
        setup: function () {
            can.Construct.setup.apply(this, arguments);
            if (can.Component) {
                var self = this, protoViewModel = this.prototype.scope || this.prototype.viewModel;
                this.Control = ComponentControl.extend(this.prototype.events);
                if (!protoViewModel || typeof protoViewModel === 'object' && !(protoViewModel instanceof can.Map)) {
                    this.Map = can.Map.extend(protoViewModel || {});
                } else if (protoViewModel.prototype instanceof can.Map) {
                    this.Map = protoViewModel;
                }
                this.attributeScopeMappings = {};
                can.each(this.Map ? this.Map.defaults : {}, function (val, prop) {
                    if (val === '@') {
                        self.attributeScopeMappings[prop] = prop;
                    }
                });
                if (this.prototype.template) {
                    if (typeof this.prototype.template === 'function') {
                        var temp = this.prototype.template;
                        this.renderer = function () {
                            return can.view.frag(temp.apply(null, arguments));
                        };
                    } else {
                        this.renderer = can.view.mustache(this.prototype.template);
                    }
                }
                can.view.tag(this.prototype.tag, function (el, options) {
                    new self(el, options);
                });
            }
        }
    }, {
        setup: function (el, componentTagData) {
            var initialViewModelData = {}, component = this, lexicalContent = (typeof this.leakScope === 'undefined' ? false : !this.leakScope) && !!this.template, viewModel, frag, teardownFunctions = [], callTeardownFunctions = function () {
                    for (var i = 0, len = teardownFunctions.length; i < len; i++) {
                        teardownFunctions[i]();
                    }
                }, $el = can.$(el), setupBindings = !can.data($el, 'preventDataBindings');
            can.each(this.constructor.attributeScopeMappings, function (val, prop) {
                initialViewModelData[prop] = el.getAttribute(can.hyphenate(val));
            });
            if (setupBindings) {
                teardownFunctions.push(bindings.behaviors.viewModel(el, componentTagData, function (initialViewModelData) {
                    initialViewModelData['%root'] = componentTagData.scope.attr('%root');
                    var protoViewModel = component.scope || component.viewModel;
                    if (component.constructor.Map) {
                        viewModel = new component.constructor.Map(initialViewModelData);
                    } else if (protoViewModel instanceof can.Map) {
                        viewModel = protoViewModel;
                    } else if (can.isFunction(protoViewModel)) {
                        var scopeResult = protoViewModel.call(component, initialViewModelData, componentTagData.scope, el);
                        if (scopeResult instanceof can.Map) {
                            viewModel = scopeResult;
                        } else if (scopeResult.prototype instanceof can.Map) {
                            viewModel = new scopeResult(initialViewModelData);
                        } else {
                            viewModel = new (can.Map.extend(scopeResult))(initialViewModelData);
                        }
                    }
                    var oldSerialize = viewModel.serialize;
                    viewModel.serialize = function () {
                        var result = oldSerialize.apply(this, arguments);
                        delete result['%root'];
                        return result;
                    };
                    return viewModel;
                }, initialViewModelData));
            }
            this.scope = this.viewModel = viewModel;
            can.data($el, 'scope', this.viewModel);
            can.data($el, 'viewModel', this.viewModel);
            can.data($el, 'preventDataBindings', true);
            var shadowScope;
            if (lexicalContent) {
                shadowScope = can.view.Scope.refsScope().add(this.viewModel, { viewModel: true });
            } else {
                shadowScope = (this.constructor.renderer ? componentTagData.scope.add(new can.view.Scope.Refs()) : componentTagData.scope).add(this.viewModel, { viewModel: true });
            }
            var options = { helpers: {} }, addHelper = function (name, fn) {
                    options.helpers[name] = function () {
                        return fn.apply(viewModel, arguments);
                    };
                };
            can.each(this.helpers || {}, function (val, prop) {
                if (can.isFunction(val)) {
                    addHelper(prop, val);
                }
            });
            can.each(this.simpleHelpers || {}, function (val, prop) {
                addHelper(prop, can.view.simpleHelper(val));
            });
            this._control = new this.constructor.Control(el, {
                scope: this.viewModel,
                viewModel: this.viewModel,
                destroy: callTeardownFunctions
            });
            var nodeList = can.view.nodeLists.register([], undefined, componentTagData.parentNodeList || true, false);
            nodeList.expression = '<' + this.tag + '>';
            teardownFunctions.push(function () {
                can.view.nodeLists.unregister(nodeList);
            });
            if (this.constructor.renderer) {
                if (!options.tags) {
                    options.tags = {};
                }
                options.tags.content = function contentHookup(el, contentTagData) {
                    var subtemplate = componentTagData.subtemplate || contentTagData.subtemplate, renderingLightContent = subtemplate === componentTagData.subtemplate;
                    if (subtemplate) {
                        delete options.tags.content;
                        var lightTemplateData;
                        if (renderingLightContent) {
                            if (lexicalContent) {
                                lightTemplateData = componentTagData;
                            } else {
                                lightTemplateData = {
                                    scope: contentTagData.scope.cloneFromRef(),
                                    options: contentTagData.options
                                };
                            }
                        } else {
                            lightTemplateData = contentTagData;
                        }
                        if (contentTagData.parentNodeList) {
                            var frag = subtemplate(lightTemplateData.scope, lightTemplateData.options, contentTagData.parentNodeList);
                            elements.replace([el], frag);
                        } else {
                            can.view.live.replace([el], subtemplate(lightTemplateData.scope, lightTemplateData.options));
                        }
                        options.tags.content = contentHookup;
                    }
                };
                frag = this.constructor.renderer(shadowScope, componentTagData.options.add(options), nodeList);
            } else {
                if (componentTagData.templateType === 'legacy') {
                    frag = can.view.frag(componentTagData.subtemplate ? componentTagData.subtemplate(shadowScope, componentTagData.options.add(options)) : '');
                } else {
                    frag = componentTagData.subtemplate ? componentTagData.subtemplate(shadowScope, componentTagData.options.add(options), nodeList) : document.createDocumentFragment();
                }
            }
            can.appendChild(el, frag, can.document);
            can.view.nodeLists.update(nodeList, can.childNodes(el));
        }
    });
    var ComponentControl = can.Control.extend({
        _lookup: function (options) {
            return [
                options.scope,
                options,
                window
            ];
        },
        _action: function (methodName, options, controlInstance) {
            var hasObjectLookup, readyCompute;
            paramReplacer.lastIndex = 0;
            hasObjectLookup = paramReplacer.test(methodName);
            if (!controlInstance && hasObjectLookup) {
                return;
            } else if (!hasObjectLookup) {
                return can.Control._action.apply(this, arguments);
            } else {
                readyCompute = can.compute(function () {
                    var delegate;
                    var name = methodName.replace(paramReplacer, function (matched, key) {
                        var value;
                        if (key === 'scope' || key === 'viewModel') {
                            delegate = options.viewModel;
                            return '';
                        }
                        key = key.replace(/^(scope|^viewModel)\./, '');
                        value = can.compute.read(options.viewModel, can.compute.read.reads(key), { readCompute: false }).value;
                        if (value === undefined) {
                            value = can.getObject(key);
                        }
                        if (typeof value === 'string') {
                            return value;
                        } else {
                            delegate = value;
                            return '';
                        }
                    });
                    var parts = name.split(/\s+/g), event = parts.pop();
                    return {
                        processor: this.processors[event] || this.processors.click,
                        parts: [
                            name,
                            parts.join(' '),
                            event
                        ],
                        delegate: delegate || undefined
                    };
                }, this);
                var handler = function (ev, ready) {
                    controlInstance._bindings.control[methodName](controlInstance.element);
                    controlInstance._bindings.control[methodName] = ready.processor(ready.delegate || controlInstance.element, ready.parts[2], ready.parts[1], methodName, controlInstance);
                };
                readyCompute.bind('change', handler);
                controlInstance._bindings.readyComputes[methodName] = {
                    compute: readyCompute,
                    handler: handler
                };
                return readyCompute();
            }
        }
    }, {
        setup: function (el, options) {
            this.scope = options.scope;
            this.viewModel = options.viewModel;
            return can.Control.prototype.setup.call(this, el, options);
        },
        off: function () {
            if (this._bindings) {
                can.each(this._bindings.readyComputes || {}, function (value) {
                    value.compute.unbind('change', value.handler);
                });
            }
            can.Control.prototype.off.apply(this, arguments);
            this._bindings.readyComputes = {};
        },
        destroy: function () {
            can.Control.prototype.destroy.apply(this, arguments);
            if (typeof this.options.destroy === 'function') {
                this.options.destroy.apply(this, arguments);
            }
        }
    });
    var $ = can.$;
    if ($.fn) {
        $.fn.scope = $.fn.viewModel = function () {
            return can.viewModel.apply(can, [this].concat(can.makeArray(arguments)));
        };
    }
    return Component;
});
/*can/model/model*/
define('can/model/model', [
    'can/util/util',
    'can/map/map',
    'can/list/list'
], function (can) {
    var pipe = function (def, thisArg, func) {
            var d = new can.Deferred();
            def.then(function () {
                var args = can.makeArray(arguments), success = true;
                try {
                    args[0] = func.apply(thisArg, args);
                } catch (e) {
                    success = false;
                    d.rejectWith(d, [e].concat(args));
                }
                if (success) {
                    d.resolveWith(d, args);
                }
            }, function () {
                d.rejectWith(this, arguments);
            });
            if (typeof def.abort === 'function') {
                d.abort = function () {
                    return def.abort();
                };
            }
            return d;
        }, modelNum = 0, getId = function (inst) {
            can.__observe(inst, inst.constructor.id);
            return inst.___get(inst.constructor.id);
        }, ajax = function (ajaxOb, data, type, dataType, success, error) {
            var params = {};
            if (typeof ajaxOb === 'string') {
                var parts = ajaxOb.split(/\s+/);
                params.url = parts.pop();
                if (parts.length) {
                    params.type = parts.pop();
                }
            } else {
                can.extend(params, ajaxOb);
            }
            params.data = typeof data === 'object' && !can.isArray(data) ? can.extend(params.data || {}, data) : data;
            params.url = can.sub(params.url, params.data, true);
            return can.ajax(can.extend({
                type: type || 'post',
                dataType: dataType || 'json',
                success: success,
                error: error
            }, params));
        }, makeRequest = function (modelObj, type, success, error, method) {
            var args;
            if (can.isArray(modelObj)) {
                args = modelObj[1];
                modelObj = modelObj[0];
            } else {
                args = modelObj.serialize();
            }
            args = [args];
            var deferred, model = modelObj.constructor, jqXHR;
            if (type === 'update' || type === 'destroy') {
                args.unshift(getId(modelObj));
            }
            jqXHR = model[type].apply(model, args);
            deferred = pipe(jqXHR, modelObj, function (data) {
                modelObj[method || type + 'd'](data, jqXHR);
                return modelObj;
            });
            if (jqXHR.abort) {
                deferred.abort = function () {
                    jqXHR.abort();
                };
            }
            deferred.then(success, error);
            return deferred;
        }, converters = {
            models: function (instancesRawData, oldList, xhr) {
                can.Model._reqs++;
                if (!instancesRawData) {
                    return;
                }
                if (instancesRawData instanceof this.List) {
                    return instancesRawData;
                }
                var self = this, tmp = [], ListClass = self.List || ML, modelList = oldList instanceof can.List ? oldList : new ListClass(), rawDataIsList = instancesRawData instanceof ML, raw = rawDataIsList ? instancesRawData.serialize() : instancesRawData;
                raw = self.parseModels(raw, xhr);
                if (raw.data) {
                    instancesRawData = raw;
                    raw = raw.data;
                }
                if (typeof raw === 'undefined' || !can.isArray(raw)) {
                    throw new Error('Could not get any raw data while converting using .models');
                }
                if (modelList.length) {
                    modelList.splice(0);
                }
                can.each(raw, function (rawPart) {
                    tmp.push(self.model(rawPart, xhr));
                });
                modelList.push.apply(modelList, tmp);
                if (!can.isArray(instancesRawData)) {
                    can.each(instancesRawData, function (val, prop) {
                        if (prop !== 'data') {
                            modelList.attr(prop, val);
                        }
                    });
                }
                setTimeout(can.proxy(this._clean, this), 1);
                return modelList;
            },
            model: function (attributes, oldModel, xhr) {
                if (!attributes) {
                    return;
                }
                if (typeof attributes.serialize === 'function') {
                    attributes = attributes.serialize();
                } else {
                    attributes = this.parseModel(attributes, xhr);
                }
                var id = attributes[this.id];
                if ((id || id === 0) && this.store[id]) {
                    oldModel = this.store[id];
                }
                var model = oldModel && can.isFunction(oldModel.attr) ? oldModel.attr(attributes, this.removeAttr || false) : new this(attributes);
                return model;
            }
        }, makeParser = {
            parseModel: function (prop) {
                return function (attributes) {
                    return prop ? can.getObject(prop, attributes) : attributes;
                };
            },
            parseModels: function (prop) {
                return function (attributes) {
                    if (can.isArray(attributes)) {
                        return attributes;
                    }
                    prop = prop || 'data';
                    var result = can.getObject(prop, attributes);
                    if (!can.isArray(result)) {
                        throw new Error('Could not get any raw data while converting using .models');
                    }
                    return result;
                };
            }
        }, ajaxMethods = {
            create: {
                url: '_shortName',
                type: 'post'
            },
            update: {
                data: function (id, attrs) {
                    attrs = attrs || {};
                    var identity = this.id;
                    if (attrs[identity] && attrs[identity] !== id) {
                        attrs['new' + can.capitalize(id)] = attrs[identity];
                        delete attrs[identity];
                    }
                    attrs[identity] = id;
                    return attrs;
                },
                type: 'put'
            },
            destroy: {
                type: 'delete',
                data: function (id, attrs) {
                    attrs = attrs || {};
                    attrs.id = attrs[this.id] = id;
                    return attrs;
                }
            },
            findAll: { url: '_shortName' },
            findOne: {}
        }, ajaxMaker = function (ajaxMethod, str) {
            return function (data) {
                data = ajaxMethod.data ? ajaxMethod.data.apply(this, arguments) : data;
                return ajax(str || this[ajaxMethod.url || '_url'], data, ajaxMethod.type || 'get');
            };
        }, createURLFromResource = function (model, name) {
            if (!model.resource) {
                return;
            }
            var resource = model.resource.replace(/\/+$/, '');
            if (name === 'findAll' || name === 'create') {
                return resource;
            } else {
                return resource + '/{' + model.id + '}';
            }
        };
    can.Model = can.Map.extend({
        fullName: 'can.Model',
        _reqs: 0,
        setup: function (base, fullName, staticProps, protoProps) {
            if (typeof fullName !== 'string') {
                protoProps = staticProps;
                staticProps = fullName;
            }
            if (!protoProps) {
                protoProps = staticProps;
            }
            this.store = {};
            can.Map.setup.apply(this, arguments);
            if (!can.Model) {
                return;
            }
            if (staticProps && staticProps.List) {
                this.List = staticProps.List;
                this.List.Map = this;
            } else {
                this.List = base.List.extend({ Map: this }, {});
            }
            var self = this, clean = can.proxy(this._clean, self);
            can.each(ajaxMethods, function (method, name) {
                if (staticProps && staticProps[name] && (typeof staticProps[name] === 'string' || typeof staticProps[name] === 'object')) {
                    self[name] = ajaxMaker(method, staticProps[name]);
                } else if (staticProps && staticProps.resource && !can.isFunction(staticProps[name])) {
                    self[name] = ajaxMaker(method, createURLFromResource(self, name));
                }
                if (self['make' + can.capitalize(name)]) {
                    var newMethod = self['make' + can.capitalize(name)](self[name]);
                    can.Construct._overwrite(self, base, name, function () {
                        can.Model._reqs++;
                        var def = newMethod.apply(this, arguments);
                        var then = def.then(clean, clean);
                        then.abort = def.abort;
                        return then;
                    });
                }
            });
            var hasCustomConverter = {};
            can.each(converters, function (converter, name) {
                var parseName = 'parse' + can.capitalize(name), dataProperty = staticProps && staticProps[name] || self[name];
                if (typeof dataProperty === 'string') {
                    self[parseName] = dataProperty;
                    can.Construct._overwrite(self, base, name, converter);
                } else if (staticProps && staticProps[name]) {
                    hasCustomConverter[parseName] = true;
                }
            });
            can.each(makeParser, function (maker, parseName) {
                var prop = staticProps && staticProps[parseName] || self[parseName];
                if (typeof prop === 'string') {
                    can.Construct._overwrite(self, base, parseName, maker(prop));
                } else if ((!staticProps || !can.isFunction(staticProps[parseName])) && !self[parseName]) {
                    var madeParser = maker();
                    madeParser.useModelConverter = hasCustomConverter[parseName];
                    can.Construct._overwrite(self, base, parseName, madeParser);
                }
            });
            if (self.fullName === 'can.Model' || !self.fullName) {
                self.fullName = 'Model' + ++modelNum;
            }
            can.Model._reqs = 0;
            this._url = this._shortName + '/{' + this.id + '}';
        },
        _ajax: ajaxMaker,
        _makeRequest: makeRequest,
        _clean: function () {
            can.Model._reqs--;
            if (!can.Model._reqs) {
                for (var id in this.store) {
                    if (!this.store[id]._bindings) {
                        delete this.store[id];
                    }
                }
            }
            return arguments[0];
        },
        models: converters.models,
        model: converters.model
    }, {
        setup: function (attrs) {
            var id = attrs && attrs[this.constructor.id];
            if (can.Model._reqs && id != null) {
                this.constructor.store[id] = this;
            }
            can.Map.prototype.setup.apply(this, arguments);
        },
        isNew: function () {
            var id = getId(this);
            return !(id || id === 0);
        },
        save: function (success, error) {
            return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
        },
        destroy: function (success, error) {
            if (this.isNew()) {
                var self = this;
                var def = can.Deferred();
                def.then(success, error);
                return def.done(function (data) {
                    self.destroyed(data);
                }).resolve(self);
            }
            return makeRequest(this, 'destroy', success, error, 'destroyed');
        },
        _bindsetup: function () {
            var modelInstance = this.___get(this.constructor.id);
            if (modelInstance != null) {
                this.constructor.store[modelInstance] = this;
            }
            return can.Map.prototype._bindsetup.apply(this, arguments);
        },
        _bindteardown: function () {
            delete this.constructor.store[getId(this)];
            return can.Map.prototype._bindteardown.apply(this, arguments);
        },
        ___set: function (prop, val) {
            can.Map.prototype.___set.call(this, prop, val);
            if (prop === this.constructor.id && this._bindings) {
                this.constructor.store[getId(this)] = this;
            }
        }
    });
    var makeGetterHandler = function (name) {
            return function (data, readyState, xhr) {
                return this[name](data, null, xhr);
            };
        }, createUpdateDestroyHandler = function (data) {
            if (this.parseModel.useModelConverter) {
                return this.model(data);
            }
            return this.parseModel(data);
        };
    var responseHandlers = {
        makeFindAll: makeGetterHandler('models'),
        makeFindOne: makeGetterHandler('model'),
        makeCreate: createUpdateDestroyHandler,
        makeUpdate: createUpdateDestroyHandler,
        makeDestroy: createUpdateDestroyHandler
    };
    can.each(responseHandlers, function (method, name) {
        can.Model[name] = function (oldMethod) {
            return function () {
                var args = can.makeArray(arguments), oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2), def = pipe(oldMethod.apply(this, oldArgs), this, method);
                def.then(args[0], args[1]);
                return def;
            };
        };
    });
    can.each([
        'created',
        'updated',
        'destroyed'
    ], function (funcName) {
        can.Model.prototype[funcName] = function (attrs) {
            var self = this, constructor = self.constructor;
            if (attrs && typeof attrs === 'object') {
                this.attr(can.isFunction(attrs.attr) ? attrs.attr() : attrs);
            }
            can.dispatch.call(this, {
                type: funcName,
                target: this
            }, []);
            can.dispatch.call(constructor, funcName, [this]);
        };
    });
    var ML = can.Model.List = can.List.extend({
        _bubbleRule: function (eventName, list) {
            var bubbleRules = can.List._bubbleRule(eventName, list);
            bubbleRules.push('destroyed');
            return bubbleRules;
        }
    }, {
        setup: function (params) {
            if (can.isPlainObject(params) && !can.isArray(params)) {
                can.List.prototype.setup.apply(this);
                this.replace(can.isPromise(params) ? params : this.constructor.Map.findAll(params));
            } else {
                can.List.prototype.setup.apply(this, arguments);
            }
            this.bind('destroyed', can.proxy(this._destroyed, this));
        },
        _destroyed: function (ev, attr) {
            if (/\w+/.test(attr)) {
                var index;
                while ((index = this.indexOf(ev.target)) > -1) {
                    this.splice(index, 1);
                }
            }
        }
    });
    return can.Model;
});
/*can/util/string/deparam/deparam*/
define('can/util/string/deparam/deparam', [
    'can/util/util',
    'can/util/string/string'
], function (can) {
    var digitTest = /^\d+$/, keyBreaker = /([^\[\]]+)|(\[\])/g, paramTest = /([^?#]*)(#.*)?$/, prep = function (str) {
            return decodeURIComponent(str.replace(/\+/g, ' '));
        };
    can.extend(can, {
        deparam: function (params) {
            var data = {}, pairs, lastPart;
            if (params && paramTest.test(params)) {
                pairs = params.split('&');
                can.each(pairs, function (pair) {
                    var parts = pair.split('='), key = prep(parts.shift()), value = prep(parts.join('=')), current = data;
                    if (key) {
                        parts = key.match(keyBreaker);
                        for (var j = 0, l = parts.length - 1; j < l; j++) {
                            if (!current[parts[j]]) {
                                current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
                            }
                            current = current[parts[j]];
                        }
                        lastPart = parts.pop();
                        if (lastPart === '[]') {
                            current.push(value);
                        } else {
                            current[lastPart] = value;
                        }
                    }
                });
            }
            return data;
        }
    });
    return can;
});
/*can/route/route*/
define('can/route/route', [
    'can/util/util',
    'can/map/map',
    'can/list/list',
    'can/util/string/deparam/deparam'
], function (can) {
    var matcher = /\:([\w\.]+)/g, paramsMatcher = /^(?:&[^=]+=[^&]*)+/, makeProps = function (props) {
            var tags = [];
            can.each(props, function (val, name) {
                tags.push((name === 'className' ? 'class' : name) + '="' + (name === 'href' ? val : can.esc(val)) + '"');
            });
            return tags.join(' ');
        }, matchesData = function (route, data) {
            var count = 0, i = 0, defaults = {};
            for (var name in route.defaults) {
                if (route.defaults[name] === data[name]) {
                    defaults[name] = 1;
                    count++;
                }
            }
            for (; i < route.names.length; i++) {
                if (!data.hasOwnProperty(route.names[i])) {
                    return -1;
                }
                if (!defaults[route.names[i]]) {
                    count++;
                }
            }
            return count;
        }, location = window.location, wrapQuote = function (str) {
            return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, '\\$1');
        }, each = can.each, extend = can.extend, definedToString = function (obj) {
            return obj.toString.toString() !== Object.prototype.toString.toString();
        }, stringify = function (obj) {
            if (obj && typeof obj === 'object' && !definedToString(obj)) {
                if (obj instanceof can.Map) {
                    obj = obj;
                } else {
                    obj = can.isFunction(obj.slice) ? obj.slice() : can.extend({}, obj);
                }
                can.each(obj, function (val, prop) {
                    obj[prop] = stringify(val);
                });
            } else if (obj !== undefined && obj !== null && can.isFunction(obj.toString)) {
                obj = obj.toString();
            }
            return obj;
        }, removeBackslash = function (str) {
            return str.replace(/\\/g, '');
        }, timer, curParams, lastHash, changingData, changedAttrs = [], onRouteDataChange = function (ev, attr, how, newval) {
            changingData = 1;
            changedAttrs.push(attr);
            clearTimeout(timer);
            timer = setTimeout(function () {
                changingData = 0;
                var serialized = can.route.data.serialize(), path = can.route.param(serialized, true);
                can.route._call('setURL', path, changedAttrs);
                can.batch.trigger(eventsObject, '__url', [
                    path,
                    lastHash
                ]);
                lastHash = path;
                changedAttrs = [];
            }, 10);
        }, eventsObject = can.extend({}, can.event), stringCoercingMapDecorator = function (map) {
            var attrSuper = map.attr;
            map.attr = function (prop, val) {
                var serializable = this.define === undefined || this.define[prop] === undefined || !!this.define[prop].serialize, args;
                if (serializable) {
                    args = stringify(Array.apply(null, arguments));
                } else {
                    args = arguments;
                }
                return attrSuper.apply(this, args);
            };
            return map;
        };
    can.route = function (url, defaults) {
        var root = can.route._call('root');
        if (root.lastIndexOf('/') === root.length - 1 && url.indexOf('/') === 0) {
            url = url.substr(1);
        }
        defaults = defaults || {};
        var names = [], res, test = '', lastIndex = matcher.lastIndex = 0, next, querySeparator = can.route._call('querySeparator'), matchSlashes = can.route._call('matchSlashes');
        while (res = matcher.exec(url)) {
            names.push(res[1]);
            test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
            next = '\\' + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator + (matchSlashes ? '' : '|/'));
            test += '([^' + next + ']' + (defaults[res[1]] ? '*' : '+') + ')';
            lastIndex = matcher.lastIndex;
        }
        test += url.substr(lastIndex).replace('\\', '');
        can.route.routes[url] = {
            test: new RegExp('^' + test + '($|' + wrapQuote(querySeparator) + ')'),
            route: url,
            names: names,
            defaults: defaults,
            length: url.split('/').length
        };
        return can.route;
    };
    extend(can.route, {
        param: function (data, _setRoute) {
            var route, matches = 0, matchCount, routeName = data.route, propCount = 0;
            delete data.route;
            each(data, function () {
                propCount++;
            });
            each(can.route.routes, function (temp, name) {
                matchCount = matchesData(temp, data);
                if (matchCount > matches) {
                    route = temp;
                    matches = matchCount;
                }
                if (matchCount >= propCount) {
                    return false;
                }
            });
            if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
                route = can.route.routes[routeName];
            }
            if (route) {
                var cpy = extend({}, data), res = route.route.replace(matcher, function (whole, name) {
                        delete cpy[name];
                        return data[name] === route.defaults[name] ? '' : encodeURIComponent(data[name]);
                    }).replace('\\', ''), after;
                each(route.defaults, function (val, name) {
                    if (cpy[name] === val) {
                        delete cpy[name];
                    }
                });
                after = can.param(cpy);
                if (_setRoute) {
                    can.route.attr('route', route.route);
                }
                return res + (after ? can.route._call('querySeparator') + after : '');
            }
            return can.isEmptyObject(data) ? '' : can.route._call('querySeparator') + can.param(data);
        },
        deparam: function (url) {
            var root = can.route._call('root');
            if (root.lastIndexOf('/') === root.length - 1 && url.indexOf('/') === 0) {
                url = url.substr(1);
            }
            var route = { length: -1 }, querySeparator = can.route._call('querySeparator'), paramsMatcher = can.route._call('paramsMatcher');
            each(can.route.routes, function (temp, name) {
                if (temp.test.test(url) && temp.length > route.length) {
                    route = temp;
                }
            });
            if (route.length > -1) {
                var parts = url.match(route.test), start = parts.shift(), remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)), obj = remainder && paramsMatcher.test(remainder) ? can.deparam(remainder.slice(1)) : {};
                obj = extend(true, {}, route.defaults, obj);
                each(parts, function (part, i) {
                    if (part && part !== querySeparator) {
                        obj[route.names[i]] = decodeURIComponent(part);
                    }
                });
                obj.route = route.route;
                return obj;
            }
            if (url.charAt(0) !== querySeparator) {
                url = querySeparator + url;
            }
            return paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
        },
        data: stringCoercingMapDecorator(new can.Map({})),
        map: function (data) {
            var appState;
            if (data.prototype instanceof can.Map) {
                appState = new data();
            } else {
                appState = data;
            }
            can.route.data = stringCoercingMapDecorator(appState);
        },
        routes: {},
        ready: function (val) {
            if (val !== true) {
                can.route._setup();
                if (can.isBrowserWindow || can.isWebWorker) {
                    can.route.setState();
                }
            }
            return can.route;
        },
        url: function (options, merge) {
            if (merge) {
                can.__observe(eventsObject, '__url');
                options = can.extend({}, can.route.deparam(can.route._call('matchingPartOfURL')), options);
            }
            return can.route._call('root') + can.route.param(options);
        },
        link: function (name, options, props, merge) {
            return '<a ' + makeProps(extend({ href: can.route.url(options, merge) }, props)) + '>' + name + '</a>';
        },
        current: function (options) {
            can.__observe(eventsObject, '__url');
            return this._call('matchingPartOfURL') === can.route.param(options);
        },
        bindings: {
            hashchange: {
                paramsMatcher: paramsMatcher,
                querySeparator: '&',
                matchSlashes: false,
                bind: function () {
                    can.bind.call(window, 'hashchange', setState);
                },
                unbind: function () {
                    can.unbind.call(window, 'hashchange', setState);
                },
                matchingPartOfURL: function () {
                    var loc = can.route.location || location;
                    return loc.href.split(/#!?/)[1] || '';
                },
                setURL: function (path) {
                    if (location.hash !== '#' + path) {
                        location.hash = '!' + path;
                    }
                    return path;
                },
                root: '#!'
            }
        },
        defaultBinding: 'hashchange',
        currentBinding: null,
        _setup: function () {
            if (!can.route.currentBinding) {
                can.route._call('bind');
                can.route.bind('change', onRouteDataChange);
                can.route.currentBinding = can.route.defaultBinding;
            }
        },
        _teardown: function () {
            if (can.route.currentBinding) {
                can.route._call('unbind');
                can.route.unbind('change', onRouteDataChange);
                can.route.currentBinding = null;
            }
            clearTimeout(timer);
            changingData = 0;
        },
        _call: function () {
            var args = can.makeArray(arguments), prop = args.shift(), binding = can.route.bindings[can.route.currentBinding || can.route.defaultBinding], method = binding[prop];
            if (method.apply) {
                return method.apply(binding, args);
            } else {
                return method;
            }
        }
    });
    each([
        'bind',
        'unbind',
        'on',
        'off',
        'delegate',
        'undelegate',
        'removeAttr',
        'compute',
        '_get',
        '___get',
        'each'
    ], function (name) {
        can.route[name] = function () {
            if (!can.route.data[name]) {
                return;
            }
            return can.route.data[name].apply(can.route.data, arguments);
        };
    });
    can.route.attr = function () {
        return can.route.data.attr.apply(can.route.data, arguments);
    };
    can.route.batch = can.batch;
    var setState = can.route.setState = function () {
        var hash = can.route._call('matchingPartOfURL');
        var oldParams = curParams;
        curParams = can.route.deparam(hash);
        if (!changingData || hash !== lastHash) {
            can.route.batch.start();
            recursiveClean(oldParams, curParams, can.route.data);
            can.route.attr(curParams);
            can.route.batch.trigger(eventsObject, '__url', [
                hash,
                lastHash
            ]);
            can.route.batch.stop();
        }
    };
    var recursiveClean = function (old, cur, data) {
        for (var attr in old) {
            if (cur[attr] === undefined) {
                data.removeAttr(attr);
            } else if (Object.prototype.toString.call(old[attr]) === '[object Object]') {
                recursiveClean(old[attr], cur[attr], data.attr(attr));
            }
        }
    };
    return can.route;
});
/*can/control/route/route*/
define('can/control/route/route', [
    'can/util/util',
    'can/route/route',
    'can/control/control'
], function (can) {
    can.Control.processors.route = function (el, event, selector, funcName, controller) {
        selector = selector || '';
        if (!can.route.routes[selector]) {
            if (selector[0] === '/') {
                selector = selector.substring(1);
            }
            can.route(selector);
        }
        var batchNum, check = function (ev, attr, how) {
                if (can.route.attr('route') === selector && (ev.batchNum === undefined || ev.batchNum !== batchNum)) {
                    batchNum = ev.batchNum;
                    var d = can.route.attr();
                    delete d.route;
                    if (can.isFunction(controller[funcName])) {
                        controller[funcName](d);
                    } else {
                        controller[controller[funcName]](d);
                    }
                }
            };
        can.route.bind('change', check);
        return function () {
            can.route.unbind('change', check);
        };
    };
    return can;
});
/*[global-shim-end]*/
(function (){
	window._define = window.define;
	window.define = window.define.orig;
})();