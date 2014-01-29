var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    a.length || void 0 === b ? c = c[d] ? c[d] : c[d] = {} : c[d] = b
  }
};
goog.define = function(a, b) {
  var c = b;
  COMPILED || goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]);
  goog.exportPath_(a, c)
};
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(goog.DEPENDENCIES_ENABLED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
  for(var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift()
  }
  return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "\x26amp;").replace(goog.string.ltRe_, "\x26lt;").replace(goog.string.gtRe_, "\x26gt;").replace(goog.string.quotRe_, "\x26quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("\x26") && (a = a.replace(goog.string.amperRe_, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.ltRe_, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.gtRe_, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "\x26quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"\x26";
      case "lt":
        return"\x3c";
      case "gt":
        return"\x3e";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), m = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = l.exec(h) || ["", "", ""], p = m.exec(k) || ["", "", ""];
      if(0 == n[0].length && 0 == p[0].length) {
        break
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), q = 0 == p[1].length ? 0 : parseInt(p[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
  return/^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
  return/^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for(var d = [];0 < c && a.length;) {
    d.push(a.shift()), c--
  }
  a.length && d.push(a.join(b));
  return d
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d
  }, c);
  return d
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
  for(var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
  }
  return d
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e
  });
  return d
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if(0 > c * (f - e)) {
    return[]
  }
  if(0 < c) {
    for(a = e;a < f;a += c) {
      d.push(a)
    }
  }else {
    for(a = e;a > f;a += c) {
      d.push(a)
    }
  }
  return d
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.moveItem = function(a, b, c) {
  b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
  goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b
  };
  d = d || function(b, c) {
    return a[b]
  };
  for(var e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var k = 0;k < f + 1;k++) {
    g[0][k] = 0
  }
  for(h = 1;h <= e;h++) {
    for(k = 1;k <= f;k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1])
    }
  }
  for(var l = [], h = e, k = f;0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--
  }
  return l
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.safeFloor = function(a, b) {
  return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
  return Math.ceil(a - (b || 2E-15))
};
var ol = {coordinate:{}};
ol.coordinate.add = function(a, b) {
  a[0] += b[0];
  a[1] += b[1];
  return a
};
ol.coordinate.closestOnSegment = function(a, b) {
  var c = a[0], d = a[1], e = b[0], f = b[1], g = e[0], e = e[1], h = f[0], f = f[1], k = h - g, l = f - e, c = 0 == k && 0 == l ? 0 : (k * (c - g) + l * (d - e)) / (k * k + l * l || 0);
  0 >= c || (1 <= c ? (g = h, e = f) : (g += c * k, e += c * l));
  return[g, e]
};
ol.coordinate.createStringXY = function(a) {
  return function(b) {
    return ol.coordinate.toStringXY(b, a)
  }
};
ol.coordinate.degreesToStringHDMS_ = function(a, b) {
  var c = goog.math.modulo(a + 180, 360) - 180, d = Math.abs(Math.round(3600 * c));
  return Math.floor(d / 3600) + "\u00b0 " + Math.floor(d / 60 % 60) + "\u2032 " + Math.floor(d % 60) + "\u2033 " + b.charAt(0 > c ? 1 : 0)
};
ol.coordinate.format = function(a, b, c) {
  return goog.isDef(a) ? b.replace("{x}", a[0].toFixed(c)).replace("{y}", a[1].toFixed(c)) : ""
};
ol.coordinate.equals = function(a, b) {
  for(var c = !0, d = a.length - 1;0 <= d;--d) {
    if(a[d] != b[d]) {
      c = !1;
      break
    }
  }
  return c
};
ol.coordinate.rotate = function(a, b) {
  var c = Math.cos(b), d = Math.sin(b), e = a[1] * c + a[0] * d;
  a[0] = a[0] * c - a[1] * d;
  a[1] = e;
  return a
};
ol.coordinate.scale = function(a, b) {
  a[0] *= b;
  a[1] *= b;
  return a
};
ol.coordinate.squaredDistance = function(a, b) {
  var c = a[0] - b[0], d = a[1] - b[1];
  return c * c + d * d
};
ol.coordinate.squaredDistanceToSegment = function(a, b) {
  return ol.coordinate.squaredDistance(a, ol.coordinate.closestOnSegment(a, b))
};
ol.coordinate.toStringHDMS = function(a) {
  return goog.isDef(a) ? ol.coordinate.degreesToStringHDMS_(a[1], "NS") + " " + ol.coordinate.degreesToStringHDMS_(a[0], "EW") : ""
};
ol.coordinate.toStringXY = function(a, b) {
  return ol.coordinate.format(a, "{x}, {y}", b)
};
ol.coordinate.fromProjectedArray = function(a, b) {
  var c = b.charAt(0);
  return"n" === c || "s" === c ? [a[1], a[0]] : a
};
ol.size = {};
ol.size.equals = function(a, b) {
  return a[0] == b[0] && a[1] == b[1]
};
ol.extent = {};
ol.extent.boundingExtent = function(a) {
  for(var b = ol.extent.createEmpty(), c = 0, d = a.length;c < d;++c) {
    ol.extent.extendCoordinate(b, a[c])
  }
  return b
};
ol.extent.boundingExtentXYs_ = function(a, b, c) {
  var d = Math.min.apply(null, a), e = Math.min.apply(null, b);
  a = Math.max.apply(null, a);
  b = Math.max.apply(null, b);
  return ol.extent.createOrUpdate(d, e, a, b, c)
};
ol.extent.buffer = function(a, b, c) {
  return goog.isDef(c) ? (c[0] = a[0] - b, c[1] = a[1] - b, c[2] = a[2] + b, c[3] = a[3] + b, c) : [a[0] - b, a[1] - b, a[2] + b, a[3] + b]
};
ol.extent.clone = function(a, b) {
  return goog.isDef(b) ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b) : a.slice()
};
ol.extent.closestSquaredDistanceXY = function(a, b, c) {
  b = b < a[0] ? a[0] - b : a[2] < b ? b - a[2] : 0;
  a = c < a[1] ? a[1] - c : a[3] < c ? c - a[3] : 0;
  return b * b + a * a
};
ol.extent.containsCoordinate = function(a, b) {
  return a[0] <= b[0] && b[0] <= a[2] && a[1] <= b[1] && b[1] <= a[3]
};
ol.extent.containsExtent = function(a, b) {
  return a[0] <= b[0] && b[2] <= a[2] && a[1] <= b[1] && b[3] <= a[3]
};
ol.extent.createEmpty = function() {
  return[Infinity, Infinity, -Infinity, -Infinity]
};
ol.extent.createOrUpdate = function(a, b, c, d, e) {
  return goog.isDef(e) ? (e[0] = a, e[1] = b, e[2] = c, e[3] = d, e) : [a, b, c, d]
};
ol.extent.createOrUpdateEmpty = function(a) {
  return ol.extent.createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, a)
};
ol.extent.createOrUpdateFromCoordinate = function(a, b) {
  var c = a[0], d = a[1];
  return ol.extent.createOrUpdate(c, d, c, d, b)
};
ol.extent.createOrUpdateFromCoordinates = function(a, b) {
  var c = ol.extent.createOrUpdateEmpty(b);
  return ol.extent.extendCoordinates(c, a)
};
ol.extent.createOrUpdateFromFlatCoordinates = function(a, b, c) {
  c = ol.extent.createOrUpdateEmpty(c);
  return ol.extent.extendFlatCoordinates(c, a, b)
};
ol.extent.createOrUpdateFromRings = function(a, b) {
  var c = ol.extent.createOrUpdateEmpty(b);
  return ol.extent.extendRings(c, a)
};
ol.extent.empty = function(a) {
  a[0] = a[1] = Infinity;
  a[2] = a[3] = -Infinity;
  return a
};
ol.extent.equals = function(a, b) {
  return a[0] == b[0] && a[2] == b[2] && a[1] == b[1] && a[3] == b[3]
};
ol.extent.extend = function(a, b) {
  b[0] < a[0] && (a[0] = b[0]);
  b[2] > a[2] && (a[2] = b[2]);
  b[1] < a[1] && (a[1] = b[1]);
  b[3] > a[3] && (a[3] = b[3]);
  return a
};
ol.extent.extendCoordinate = function(a, b) {
  b[0] < a[0] && (a[0] = b[0]);
  b[0] > a[2] && (a[2] = b[0]);
  b[1] < a[1] && (a[1] = b[1]);
  b[1] > a[3] && (a[3] = b[1])
};
ol.extent.extendCoordinates = function(a, b) {
  var c, d;
  c = 0;
  for(d = b.length;c < d;++c) {
    ol.extent.extendCoordinate(a, b[c])
  }
  return a
};
ol.extent.extendFlatCoordinates = function(a, b, c) {
  var d, e;
  d = 0;
  for(e = b.length;d < e;d += c) {
    ol.extent.extendXY(a, b[d], b[d + 1])
  }
  return a
};
ol.extent.extendRings = function(a, b) {
  var c, d;
  c = 0;
  for(d = b.length;c < d;++c) {
    ol.extent.extendCoordinates(a, b[c])
  }
  return a
};
ol.extent.extendXY = function(a, b, c) {
  a[0] = Math.min(a[0], b);
  a[1] = Math.min(a[1], c);
  a[2] = Math.max(a[2], b);
  a[3] = Math.max(a[3], c)
};
ol.extent.getArea = function(a) {
  return ol.extent.getWidth(a) * ol.extent.getHeight(a)
};
ol.extent.getBottomLeft = function(a) {
  return[a[0], a[1]]
};
ol.extent.getBottomRight = function(a) {
  return[a[2], a[1]]
};
ol.extent.getCenter = function(a) {
  return[(a[0] + a[2]) / 2, (a[1] + a[3]) / 2]
};
ol.extent.getEnlargedArea = function(a, b) {
  var c = Math.min(a[0], b[0]), d = Math.min(a[1], b[1]), e = Math.max(a[2], b[2]), f = Math.max(a[3], b[3]);
  return(e - c) * (f - d)
};
ol.extent.getForView2DAndSize = function(a, b, c, d, e) {
  var f = b * d[0] / 2;
  d = b * d[1] / 2;
  b = Math.cos(c);
  c = Math.sin(c);
  f = [-f, -f, f, f];
  d = [-d, d, -d, d];
  var g, h, k;
  for(g = 0;4 > g;++g) {
    h = f[g], k = d[g], f[g] = a[0] + h * b - k * c, d[g] = a[1] + h * c + k * b
  }
  return ol.extent.boundingExtentXYs_(f, d, e)
};
ol.extent.getHeight = function(a) {
  return a[3] - a[1]
};
ol.extent.getIntersectionArea = function(a, b) {
  var c = Math.max(a[0], b[0]), d = Math.max(a[1], b[1]), e = Math.min(a[2], b[2]), f = Math.min(a[3], b[3]);
  return Math.max(0, e - c) * Math.max(0, f - d)
};
ol.extent.getMargin = function(a) {
  return ol.extent.getWidth(a) + ol.extent.getHeight(a)
};
ol.extent.getSize = function(a) {
  return[a[2] - a[0], a[3] - a[1]]
};
ol.extent.getTopLeft = function(a) {
  return[a[0], a[3]]
};
ol.extent.getTopRight = function(a) {
  return[a[2], a[3]]
};
ol.extent.getWidth = function(a) {
  return a[2] - a[0]
};
ol.extent.intersects = function(a, b) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
};
ol.extent.isEmpty = function(a) {
  return a[2] < a[0] || a[3] < a[1]
};
ol.extent.normalize = function(a, b) {
  return[(b[0] - a[0]) / (a[2] - a[0]), (b[1] - a[1]) / (a[3] - a[1])]
};
ol.extent.returnOrUpdate = function(a, b) {
  return goog.isDef(b) ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b) : a
};
ol.extent.scaleFromCenter = function(a, b) {
  var c = (a[2] - a[0]) / 2 * (b - 1), d = (a[3] - a[1]) / 2 * (b - 1);
  a[0] -= c;
  a[2] += c;
  a[1] -= d;
  a[3] += d
};
ol.extent.touches = function(a, b) {
  return ol.extent.intersects(a, b) && (a[0] == b[2] || a[2] == b[0] || a[1] == b[3] || a[3] == b[1])
};
ol.extent.transform = function(a, b, c) {
  a = [a[0], a[1], a[0], a[3], a[2], a[1], a[2], a[3]];
  b(a, a, 2);
  return ol.extent.boundingExtentXYs_([a[0], a[2], a[4], a[6]], [a[1], a[3], a[5], a[7]], c)
};
/*

 Latitude/longitude spherical geodesy formulae taken from
 http://www.movable-type.co.uk/scripts/latlong.html
 Licenced under CC-BY-3.0.
*/
ol.Sphere = function(a) {
  this.ol_Sphere$radius = a
};
ol.Sphere.prototype.cosineDistance = function(a, b) {
  var c = goog.math.toRadians(a[1]), d = goog.math.toRadians(b[1]), e = goog.math.toRadians(b[0] - a[0]);
  return this.ol_Sphere$radius * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(e))
};
ol.Sphere.prototype.crossTrackDistance = function(a, b, c) {
  var d = this.cosineDistance(a, b);
  b = goog.math.toRadians(this.initialBearing(a, b));
  a = goog.math.toRadians(this.initialBearing(a, c));
  return this.ol_Sphere$radius * Math.asin(Math.sin(d / this.ol_Sphere$radius) * Math.sin(a - b))
};
ol.Sphere.prototype.equirectangularDistance = function(a, b) {
  var c = goog.math.toRadians(a[1]), d = goog.math.toRadians(b[1]), e = goog.math.toRadians(b[0] - a[0]) * Math.cos((c + d) / 2), c = d - c;
  return this.ol_Sphere$radius * Math.sqrt(e * e + c * c)
};
ol.Sphere.prototype.finalBearing = function(a, b) {
  return(this.initialBearing(b, a) + 180) % 360
};
ol.Sphere.prototype.haversineDistance = function(a, b) {
  var c = goog.math.toRadians(a[1]), d = goog.math.toRadians(b[1]), e = (d - c) / 2, f = goog.math.toRadians(b[0] - a[0]) / 2, c = Math.sin(e) * Math.sin(e) + Math.sin(f) * Math.sin(f) * Math.cos(c) * Math.cos(d);
  return 2 * this.ol_Sphere$radius * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
};
ol.Sphere.prototype.initialBearing = function(a, b) {
  var c = goog.math.toRadians(a[1]), d = goog.math.toRadians(b[1]), e = goog.math.toRadians(b[0] - a[0]), f = Math.sin(e) * Math.cos(d), c = Math.cos(c) * Math.sin(d) - Math.sin(c) * Math.cos(d) * Math.cos(e);
  return goog.math.toDegrees(Math.atan2(f, c))
};
ol.Sphere.prototype.maximumLatitude = function(a, b) {
  return Math.cos(Math.abs(Math.sin(goog.math.toRadians(a)) * Math.cos(goog.math.toRadians(b))))
};
ol.Sphere.prototype.midpoint = function(a, b) {
  var c = goog.math.toRadians(a[1]), d = goog.math.toRadians(b[1]), e = goog.math.toRadians(a[0]), f = goog.math.toRadians(b[0] - a[0]), g = Math.cos(d) * Math.cos(f), f = Math.cos(d) * Math.sin(f), g = Math.cos(c) + g, c = Math.atan2(Math.sin(c) + Math.sin(d), Math.sqrt(g * g + f * f)), e = e + Math.atan2(f, g);
  return[goog.math.toDegrees(e), goog.math.toDegrees(c)]
};
ol.Sphere.prototype.ol_Sphere_prototype$offset = function(a, b, c) {
  var d = goog.math.toRadians(a[1]);
  a = goog.math.toRadians(a[0]);
  var e = b / this.ol_Sphere$radius;
  b = Math.asin(Math.sin(d) * Math.cos(e) + Math.cos(d) * Math.sin(e) * Math.cos(c));
  c = a + Math.atan2(Math.sin(c) * Math.sin(e) * Math.cos(d), Math.cos(e) - Math.sin(d) * Math.sin(b));
  return[goog.math.toDegrees(c), goog.math.toDegrees(b)]
};
ol.sphere = {};
ol.sphere.NORMAL = new ol.Sphere(6370997);
ol.proj = {};
ol.ENABLE_PROJ4JS = !0;
ol.HAVE_PROJ4JS = ol.ENABLE_PROJ4JS && "object" == typeof Proj4js;
ol.proj.Units = {DEGREES:"degrees", FEET:"ft", METERS:"m", PIXELS:"pixels"};
ol.METERS_PER_UNIT = {};
ol.METERS_PER_UNIT[ol.proj.Units.DEGREES] = 2 * Math.PI * ol.sphere.NORMAL.ol_Sphere$radius / 360;
ol.METERS_PER_UNIT[ol.proj.Units.FEET] = 0.3048;
ol.METERS_PER_UNIT[ol.proj.Units.METERS] = 1;
ol.proj.Projection = function(a) {
  this.code_ = a.code;
  this.units_ = a.units;
  this.ol_proj_Projection$extent_ = goog.isDef(a.extent) ? a.extent : null;
  this.axisOrientation_ = goog.isDef(a.axisOrientation) ? a.axisOrientation : "enu";
  this.global_ = goog.isDef(a.global) ? a.global : !1;
  this.defaultTileGrid_ = null
};
ol.proj.Projection.prototype.getCode = function() {
  return this.code_
};
ol.proj.Projection.prototype.ol_proj_Projection_prototype$getExtent = function() {
  return this.ol_proj_Projection$extent_
};
ol.proj.Projection.prototype.getUnits = function() {
  return this.units_
};
ol.proj.Projection.prototype.getMetersPerUnit = function() {
  return ol.METERS_PER_UNIT[this.units_]
};
ol.proj.Projection.prototype.getAxisOrientation = function() {
  return this.axisOrientation_
};
ol.proj.Projection.prototype.isGlobal = function() {
  return this.global_
};
ol.proj.Projection.prototype.getDefaultTileGrid = function() {
  return this.defaultTileGrid_
};
ol.proj.Projection.prototype.setDefaultTileGrid = function(a) {
  this.defaultTileGrid_ = a
};
ol.Proj4jsProjection_ = function(a, b) {
  var c = {units:a.units, axisOrientation:a.axis};
  goog.object.extend(c, b);
  ol.proj.Projection.call(this, c);
  this.proj4jsProj_ = a;
  this.toEPSG4326_ = null
};
goog.inherits(ol.Proj4jsProjection_, ol.proj.Projection);
ol.Proj4jsProjection_.prototype.getMetersPerUnit = function() {
  var a = this.proj4jsProj_.to_meter;
  goog.isDef(a) || (a = ol.METERS_PER_UNIT[this.units_]);
  return a
};
ol.Proj4jsProjection_.prototype.getPointResolution = function(a, b) {
  if(this.getUnits() == ol.proj.Units.DEGREES) {
    return a
  }
  goog.isNull(this.toEPSG4326_) && (this.toEPSG4326_ = ol.proj.getTransformFromProjections(this, ol.proj.getProj4jsProjectionFromCode_({code:"EPSG:4326", extent:null})));
  var c = [b[0] - a / 2, b[1], b[0] + a / 2, b[1], b[0], b[1] - a / 2, b[0], b[1] + a / 2], c = this.toEPSG4326_(c, c, 2), d = ol.sphere.NORMAL.haversineDistance(c.slice(0, 2), c.slice(2, 4)), c = ol.sphere.NORMAL.haversineDistance(c.slice(4, 6), c.slice(6, 8)), d = (d + c) / 2;
  this.getUnits() == ol.proj.Units.FEET && (d /= 0.3048);
  return d
};
ol.Proj4jsProjection_.prototype.getProj4jsProj = function() {
  return this.proj4jsProj_
};
ol.proj.proj4jsProjections_ = {};
ol.proj.projections_ = {};
ol.proj.transforms_ = {};
ol.proj.addEquivalentProjections = function(a) {
  ol.proj.addProjections(a);
  goog.array.forEach(a, function(b) {
    goog.array.forEach(a, function(a) {
      b !== a && ol.proj.addTransform(b, a, ol.proj.cloneTransform)
    })
  })
};
ol.proj.addEquivalentTransforms = function(a, b, c, d) {
  goog.array.forEach(a, function(a) {
    goog.array.forEach(b, function(b) {
      ol.proj.addTransform(a, b, c);
      ol.proj.addTransform(b, a, d)
    })
  })
};
ol.proj.addProj4jsProjection_ = function(a) {
  var b = ol.proj.proj4jsProjections_, c = a.getCode();
  b[c] = a
};
ol.proj.addProjection = function(a) {
  var b = ol.proj.projections_, c = a.getCode();
  b[c] = a;
  ol.proj.addTransform(a, a, ol.proj.cloneTransform)
};
ol.proj.addProjections = function(a) {
  goog.array.forEach(a, function(a) {
    ol.proj.addProjection(a)
  })
};
ol.proj.clearAllProjections = function() {
  ol.ENABLE_PROJ4JS && (ol.proj.proj4jsProjections_ = {});
  ol.proj.projections_ = {};
  ol.proj.transforms_ = {}
};
ol.proj.createProjection = function(a, b) {
  return goog.isDefAndNotNull(a) ? goog.isString(a) ? ol.proj.get(a) : a : ol.proj.get(b)
};
ol.proj.addTransform = function(a, b, c) {
  a = a.getCode();
  b = b.getCode();
  var d = ol.proj.transforms_;
  goog.object.containsKey(d, a) || (d[a] = {});
  d[a][b] = c
};
ol.proj.removeTransform = function(a, b) {
  var c = a.getCode(), d = b.getCode(), e = ol.proj.transforms_, f = e[c][d];
  delete e[c][d];
  0 === goog.object.getKeys(e[c]).length && delete e[c];
  return f
};
ol.proj.get = function(a) {
  var b;
  a instanceof ol.proj.Projection ? b = a : goog.isString(a) ? (b = ol.proj.projections_[a], ol.HAVE_PROJ4JS && !goog.isDef(b) && (b = ol.proj.getProj4jsProjectionFromCode_({code:a, extent:null})), goog.isDef(b) || (b = null)) : b = null;
  return b
};
ol.proj.getProj4jsProjectionFromCode_ = function(a) {
  var b = a.code, c = ol.proj.proj4jsProjections_, d = c[b];
  if(!goog.isDef(d)) {
    var e = new Proj4js.Proj(b), f = e.srsCode, d = c[f];
    goog.isDef(d) || (a = goog.object.clone(a), a.code = f, d = new ol.Proj4jsProjection_(e, a), c[f] = d);
    c[b] = d
  }
  return d
};
ol.proj.equivalent = function(a, b) {
  return a === b ? !0 : a.getUnits() != b.getUnits() ? !1 : ol.proj.getTransformFromProjections(a, b) === ol.proj.cloneTransform
};
ol.proj.getTransform = function(a, b) {
  var c = ol.proj.get(a), d = ol.proj.get(b);
  return ol.proj.getTransformFromProjections(c, d)
};
ol.proj.getTransformFromProjections = function(a, b) {
  var c = ol.proj.transforms_, d = a.getCode(), e = b.getCode(), f;
  goog.object.containsKey(c, d) && goog.object.containsKey(c[d], e) && (f = c[d][e]);
  if(ol.HAVE_PROJ4JS && !goog.isDef(f)) {
    var g = (a instanceof ol.Proj4jsProjection_ ? a : ol.proj.getProj4jsProjectionFromCode_({code:d, extent:null})).getProj4jsProj(), h = (b instanceof ol.Proj4jsProjection_ ? b : ol.proj.getProj4jsProjectionFromCode_({code:e, extent:null})).getProj4jsProj();
    f = function(a, b, c) {
      var d = a.length;
      c = 1 < c ? c : 2;
      goog.isDef(b) || (b = 2 < c ? a.slice() : Array(d));
      for(var e, f = 0;f < d;f += c) {
        e = new Proj4js.Point(a[f], a[f + 1]), e = Proj4js.transform(g, h, e), b[f] = e.x, b[f + 1] = e.y
      }
      return b
    };
    ol.proj.addTransform(a, b, f)
  }
  goog.isDef(f) || (f = ol.proj.identityTransform);
  return f
};
ol.proj.identityTransform = function(a, b, c) {
  if(goog.isDef(b) && a !== b) {
    c = 0;
    for(var d = a.length;c < d;++c) {
      b[c] = a[c]
    }
    a = b
  }
  return a
};
ol.proj.cloneTransform = function(a, b, c) {
  if(goog.isDef(b)) {
    c = 0;
    for(var d = a.length;c < d;++c) {
      b[c] = a[c]
    }
    a = b
  }else {
    a = a.slice()
  }
  return a
};
ol.proj.transform = function(a, b, c) {
  return ol.proj.getTransform(b, c)(a)
};
ol.proj.transformWithProjections = function(a, b, c) {
  return ol.proj.getTransformFromProjections(b, c)(a)
};
ol.proj.configureProj4jsProjection = function(a) {
  return ol.proj.getProj4jsProjectionFromCode_(a)
};
ol.CenterConstraint = {};
ol.CenterConstraint.createExtent = function(a) {
  return function(b) {
    if(goog.isDef(b)) {
      return[goog.math.clamp(b[0], a[0], a[2]), goog.math.clamp(b[1], a[1], a[3])]
    }
  }
};
ol.CenterConstraint.none = function(a) {
  return a
};
ol.array = {};
ol.array.binaryFindNearest = function(a, b) {
  var c = goog.array.binarySearch(a, b, function(a, b) {
    return b - a
  });
  if(0 <= c) {
    return c
  }
  if(-1 == c) {
    return 0
  }
  if(c == -a.length - 1) {
    return a.length - 1
  }
  var d = -c - 2, c = -c - 1;
  return a[d] - b < b - a[c] ? d : c
};
ol.array.linearFindNearest = function(a, b, c) {
  var d = a.length;
  if(a[0] <= b) {
    return 0
  }
  if(!(b <= a[d - 1])) {
    if(0 < c) {
      for(c = 1;c < d;++c) {
        if(a[c] < b) {
          return c - 1
        }
      }
    }else {
      if(0 > c) {
        for(c = 1;c < d;++c) {
          if(a[c] <= b) {
            return c
          }
        }
      }else {
        for(c = 1;c < d;++c) {
          if(a[c] == b) {
            return c
          }
          if(a[c] < b) {
            return a[c - 1] - b < b - a[c] ? c - 1 : c
          }
        }
      }
    }
  }
  return d - 1
};
ol.array.reverseSubArray = function(a, b, c) {
  for(;b < c;) {
    var d = a[b];
    a[b] = a[c];
    a[c] = d;
    ++b;
    --c
  }
};
ol.ResolutionConstraint = {};
ol.ResolutionConstraint.createSnapToResolutions = function(a) {
  return function(b, c, d) {
    if(goog.isDef(b)) {
      return b = ol.array.linearFindNearest(a, b, d), b = goog.math.clamp(b + c, 0, a.length - 1), a[b]
    }
  }
};
ol.ResolutionConstraint.createSnapToPower = function(a, b, c) {
  return function(d, e, f) {
    if(goog.isDef(d)) {
      return f = 0 < f ? 0 : 0 > f ? 1 : 0.5, d = Math.floor(Math.log(b / d) / Math.log(a) + f), e = Math.max(d + e, 0), goog.isDef(c) && (e = Math.min(e, c)), b / Math.pow(a, e)
    }
  }
};
ol.RotationConstraint = {};
ol.RotationConstraint.none = function(a, b) {
  if(goog.isDef(a)) {
    return a + b
  }
};
ol.RotationConstraint.createSnapToN = function(a) {
  var b = 2 * Math.PI / a;
  return function(a, d) {
    if(goog.isDef(a)) {
      return a = Math.floor((a + d) / b + 0.5) * b
    }
  }
};
ol.RotationConstraint.createSnapToZero = function(a) {
  var b = a || 0.1;
  return function(a, d) {
    if(goog.isDef(a)) {
      return Math.abs(a + d) <= b ? 0 : a + d
    }
  }
};
ol.Constraints = function(a, b, c) {
  this.center = a;
  this.resolution = b;
  this.rotation = c
};
ol.IView2D = function() {
};
ol.IView2D.prototype.getCenter = function() {
};
ol.IView2D.prototype.ol_IView2D_prototype$getProjection = function() {
};
ol.IView2D.prototype.ol_IView2D_prototype$getResolution = function() {
};
ol.IView2D.prototype.ol_IView2D_prototype$getRotation = function() {
};
ol.IView2D.prototype.getView2DState = function() {
};
ol.IView2D.prototype.isDef = function() {
};
ol.IView3D = function() {
};
ol.IView3D.prototype.isDef = function() {
};
ol.IView = function() {
};
ol.IView.prototype.getView2D = function() {
};
ol.IView.prototype.getView3D = function() {
};
ol.IView.prototype.isDef = function() {
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = goog.string.startsWith(a, "Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && (goog.string.contains(a, "MSIE") || goog.string.contains(a, "Trident"));
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && goog.string.contains(a, "WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && goog.string.contains(a, "Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && !goog.userAgent.detectedIe_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var a = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!a && goog.string.contains(a, "Android");
  goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
  goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document;
  return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || 
!goog.global.navigator.msMaxTouchPoints)};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.goog_Disposable_prototype$creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for(b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_ && (this.disposed_ = !0, this.goog_Disposable_prototype$disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a]
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, a))
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.bind(a, b))
};
goog.Disposable.prototype.goog_Disposable_prototype$disposeInternal = function() {
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
  for(var b = 0, c = arguments.length;b < c;++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
  }
};
goog.events.Event = function(a, b) {
  this.type = a;
  this.goog_events_Event$currentTarget = this.target = b
};
goog.events.Event.prototype.goog_events_Event_prototype$disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.goog_events_Event_prototype$defaultPrevented = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.goog_events_Event_prototype$stopPropagation = function() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.goog_events_Event_prototype$preventDefault = function() {
  this.goog_events_Event_prototype$defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.function__new_goog_events_Event__string___Object_null_____undefined$stopPropagation = function(a) {
  a.goog_events_Event_prototype$stopPropagation()
};
goog.events.Event.function__new_goog_events_Event__string___Object_null_____undefined$preventDefault = function(a) {
  a.goog_events_Event_prototype$preventDefault()
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", 
HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", 
MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROVER:"MSPointerOver", MSPOINTEROUT:"MSPointerOut", MSPOINTERUP:"MSPointerUp", TEXTINPUT:"textinput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", EXIT:"exit", LOADABORT:"loadabort", 
LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive"};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0
  }catch(c) {
  }
  return!1
};
goog.events.BrowserEvent = function(a, b) {
  a && this.init(a, b)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$relatedTarget = null;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$offsetX = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$screenX = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$screenY = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$button = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$keyCode = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$charCode = 0;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$ctrlKey = !1;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$altKey = !1;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$shiftKey = !1;
goog.events.BrowserEvent.prototype.goog_events_BrowserEvent_prototype$metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type;
  goog.events.Event.call(this, c);
  this.target = a.target || a.srcElement;
  this.goog_events_Event$currentTarget = b;
  var d = a.relatedTarget;
  d ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(d, "nodeName") || (d = null)) : c == goog.events.EventType.MOUSEOVER ? d = a.fromElement : c == goog.events.EventType.MOUSEOUT && (d = a.toElement);
  this.goog_events_BrowserEvent_prototype$relatedTarget = d;
  this.goog_events_BrowserEvent_prototype$offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.goog_events_BrowserEvent_prototype$offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.goog_events_BrowserEvent_prototype$screenX = a.screenX || 0;
  this.goog_events_BrowserEvent_prototype$screenY = a.screenY || 0;
  this.goog_events_BrowserEvent_prototype$button = a.button;
  this.goog_events_BrowserEvent_prototype$keyCode = a.keyCode || 0;
  this.goog_events_BrowserEvent_prototype$charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.goog_events_BrowserEvent_prototype$ctrlKey = a.ctrlKey;
  this.goog_events_BrowserEvent_prototype$altKey = a.altKey;
  this.goog_events_BrowserEvent_prototype$shiftKey = a.shiftKey;
  this.goog_events_BrowserEvent_prototype$metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.goog_events_Event_prototype$preventDefault();
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.goog_events_BrowserEvent_prototype$ctrlKey)
};
goog.events.BrowserEvent.prototype.goog_events_Event_prototype$stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.goog_events_Event_prototype$stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.goog_events_Event_prototype$preventDefault = function() {
  goog.events.BrowserEvent.superClass_.goog_events_Event_prototype$preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.goog_events_Event_prototype$disposeInternal = function() {
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1E6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
  a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0
};
goog.events.Listenable.isImplementedBy = function(a) {
  return!(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP])
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return++goog.events.ListenableKey.counter_
};
goog.events.Listener = function(a, b, c, d, e, f) {
  goog.events.Listener.ENABLE_MONITORING && (this.goog_events_Listener_prototype$creationStack = Error().stack);
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.goog_events_ListenableKey_prototype$key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listen(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener_(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listen(b, c, d, e) : goog.events.listen_(a, b, c, !1, d, e)
};
goog.events.listen_ = function(a, b, c, d, e, f) {
  if(!b) {
    throw Error("Invalid event type");
  }
  e = !!e;
  var g = goog.events.listenerTree_;
  b in g || (g[b] = {count_:0});
  g = g[b];
  e in g || (g[e] = {count_:0}, g.count_++);
  var g = g[e], h = goog.getUid(a), k;
  if(g[h]) {
    k = g[h];
    for(var l = 0;l < k.length;l++) {
      if(g = k[l], g.listener == c && g.handler == f) {
        if(g.removed) {
          break
        }
        d || (k[l].callOnce = !1);
        return k[l]
      }
    }
  }else {
    k = g[h] = [], g.count_++
  }
  l = goog.events.getProxy();
  g = new goog.events.Listener(c, l, a, b, e, f);
  g.callOnce = d;
  l.src = a;
  l.listener = g;
  k.push(g);
  goog.events.sources_[h] || (goog.events.sources_[h] = []);
  goog.events.sources_[h].push(g);
  a.addEventListener ? a.addEventListener(b, l, e) : a.attachEvent(goog.events.getOnString_(b), l);
  return goog.events.listeners_[g.goog_events_ListenableKey_prototype$key] = g
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
    return a.call(b.src, b.listener, c)
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if(!c) {
      return c
    }
  };
  return b
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.listenOnce(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener_(c);
  return goog.events.Listenable.isImplementedBy(a) ? a.listenOnce(b, c, d, e) : goog.events.listen_(a, b, c, !0, d, e)
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e)
};
goog.events.unlisten = function(a, b, c, d, e) {
  if(goog.isArray(b)) {
    for(var f = 0;f < b.length;f++) {
      goog.events.unlisten(a, b[f], c, d, e)
    }
    return null
  }
  c = goog.events.wrapListener_(c);
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.unlisten(b, c, d, e)
  }
  d = !!d;
  a = goog.events.getListeners_(a, b, d);
  if(!a) {
    return!1
  }
  for(f = 0;f < a.length;f++) {
    if(a[f].listener == c && a[f].capture == d && a[f].handler == e) {
      return goog.events.unlistenByKey(a[f])
    }
  }
  return!1
};
goog.events.unlistenByKey = function(a) {
  if(goog.isNumber(a) || !a || a.removed) {
    return!1
  }
  var b = a.src;
  if(goog.events.Listenable.isImplementedBy(b)) {
    return b.unlistenByKey(a)
  }
  var c = a.type, d = a.proxy, e = a.capture;
  b.removeEventListener ? b.removeEventListener(c, d, e) : b.detachEvent && b.detachEvent(goog.events.getOnString_(c), d);
  b = goog.getUid(b);
  goog.events.sources_[b] && (d = goog.events.sources_[b], goog.array.remove(d, a), 0 == d.length && delete goog.events.sources_[b]);
  a.markAsRemoved();
  if(d = goog.events.listenerTree_[c][e][b]) {
    goog.array.remove(d, a), 0 == d.length && (delete goog.events.listenerTree_[c][e][b], goog.events.listenerTree_[c][e].count_--), 0 == goog.events.listenerTree_[c][e].count_ && (delete goog.events.listenerTree_[c][e], goog.events.listenerTree_[c].count_--), 0 == goog.events.listenerTree_[c].count_ && delete goog.events.listenerTree_[c]
  }
  delete goog.events.listeners_[a.goog_events_ListenableKey_prototype$key];
  return!0
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e)
};
goog.events.removeAll = function(a, b) {
  var c = 0, d = null == b;
  if(null != a) {
    if(a && goog.events.Listenable.isImplementedBy(a)) {
      return a.removeAllListeners(b)
    }
    var e = goog.getUid(a);
    if(goog.events.sources_[e]) {
      for(var e = goog.events.sources_[e], f = e.length - 1;0 <= f;f--) {
        var g = e[f];
        if(d || b == g.type) {
          goog.events.unlistenByKey(g), c++
        }
      }
    }
  }else {
    goog.object.forEach(goog.events.listeners_, function(a) {
      goog.events.unlistenByKey(a);
      c++
    })
  }
  return c
};
goog.events.removeAllNativeListeners = function() {
  var a = 0;
  goog.object.forEach(goog.events.listeners_, function(b) {
    goog.events.unlistenByKey(b);
    a++
  });
  return a
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : goog.events.getListeners_(a, b, c) || []
};
goog.events.getListeners_ = function(a, b, c) {
  var d = goog.events.listenerTree_;
  return b in d && (d = d[b], c in d && (d = d[c], a = goog.getUid(a), d[a])) ? d[a] : null
};
goog.events.getListener = function(a, b, c, d, e) {
  d = !!d;
  c = goog.events.wrapListener_(c);
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.getListener(b, c, d, e)
  }
  if(a = goog.events.getListeners_(a, b, d)) {
    for(b = 0;b < a.length;b++) {
      if(!a[b].removed && a[b].listener == c && a[b].capture == d && a[b].handler == e) {
        return a[b]
      }
    }
  }
  return null
};
goog.events.hasListener = function(a, b, c) {
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.hasListener(b, c)
  }
  a = goog.getUid(a);
  var d = goog.events.sources_[a];
  if(d) {
    var e = goog.isDef(b), f = goog.isDef(c);
    return e && f ? (d = goog.events.listenerTree_[b], !!d && !!d[c] && a in d[c]) : e || f ? goog.array.some(d, function(a) {
      return e && a.type == b || f && a.capture == c
    }) : !0
  }
  return!1
};
goog.events.expose = function(a) {
  var b = [], c;
  for(c in a) {
    a[c] && a[c].id ? b.push(c + " \x3d " + a[c] + " (" + a[c].id + ")") : b.push(c + " \x3d " + a[c])
  }
  return b.join("\n")
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, b, c, d) {
  if(goog.events.Listenable.isImplementedBy(a)) {
    return a.fireListeners(b, c, d)
  }
  var e = goog.events.listenerTree_;
  return b in e && (e = e[b], c in e) ? goog.events.fireListeners_(e[c], a, b, c, d) : !0
};
goog.events.fireListeners_ = function(a, b, c, d, e) {
  c = 1;
  b = goog.getUid(b);
  if(a[b]) {
    for(a = goog.array.clone(a[b]), b = 0;b < a.length;b++) {
      (d = a[b]) && !d.removed && (c &= !1 !== goog.events.fireListener(d, e))
    }
  }
  return Boolean(c)
};
goog.events.fireListener = function(a, b) {
  var c = a.listener, d = a.handler || a.src;
  a.callOnce && goog.events.unlistenByKey(a);
  return c.call(d, b)
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, b) {
  return a.dispatchEvent(b)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if(a.removed) {
    return!0
  }
  var c = a.type, d = goog.events.listenerTree_;
  if(!(c in d)) {
    return!0
  }
  var d = d[c], e, f;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    e = b || goog.getObjectByName("window.event");
    var g = !0 in d, h = !1 in d;
    if(g) {
      if(goog.events.isMarkedIeEvent_(e)) {
        return!0
      }
      goog.events.markIeEvent_(e)
    }
    var k = new goog.events.BrowserEvent;
    k.init(e, this);
    e = !0;
    try {
      if(g) {
        for(var l = [], m = k.goog_events_Event$currentTarget;m;m = m.parentNode) {
          l.push(m)
        }
        f = d[!0];
        for(var n = l.length - 1;!k.propagationStopped_ && 0 <= n;n--) {
          k.goog_events_Event$currentTarget = l[n], e &= goog.events.fireListeners_(f, l[n], c, !0, k)
        }
        if(h) {
          for(f = d[!1], n = 0;!k.propagationStopped_ && n < l.length;n++) {
            k.goog_events_Event$currentTarget = l[n], e &= goog.events.fireListeners_(f, l[n], c, !1, k)
          }
        }
      }else {
        e = goog.events.fireListener(a, k)
      }
    }finally {
      l && (l.length = 0)
    }
    return e
  }
  c = new goog.events.BrowserEvent(b, this);
  return e = goog.events.fireListener(a, c)
};
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if(0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return
    }catch(c) {
      b = !0
    }
  }
  if(b || void 0 == a.returnValue) {
    a.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
goog.events.wrapListener_ = function(a) {
  return goog.isFunction(a) ? a : a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
    return a.handleEvent(b)
  })
};
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a
  }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
  return a
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  }
};
goog.functions.fail = function(a) {
  return function() {
    throw a;
  }
};
goog.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
  }
};
goog.functions.withReturnValue = function(a, b) {
  return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for(var b = d - 2;0 <= b;b--) {
      a = c[b].call(this, a)
    }
    return a
  }
};
goog.functions.sequence = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a, e = 0;e < c;e++) {
      a = b[e].apply(this, arguments)
    }
    return a
  }
};
goog.functions.and = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(!b[a].apply(this, arguments)) {
        return!1
      }
    }
    return!0
  }
};
goog.functions.or = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for(var a = 0;a < c;a++) {
      if(b[a].apply(this, arguments)) {
        return!0
      }
    }
    return!1
  }
};
goog.functions.not = function(a) {
  return function() {
    return!a.apply(this, arguments)
  }
};
goog.functions.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c
};
goog.events.ListenerMap = function(a) {
  this.src = a;
  this.listeners = {};
  this.typeCount_ = 0
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var a = 0, b;
  for(b in this.listeners) {
    a += this.listeners[b].length
  }
  return a
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
  var f = this.listeners[a];
  f || (f = this.listeners[a] = [], this.typeCount_++);
  var g = goog.events.ListenerMap.findListenerIndex_(f, b, d, e);
  -1 < g ? (a = f[g], c || (a.callOnce = !1)) : (a = new goog.events.Listener(b, null, this.src, a, !!d, e), a.callOnce = c, f.push(a));
  return a
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
  if(!(a in this.listeners)) {
    return!1
  }
  var e = this.listeners[a];
  b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
  return-1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
  var b = a.type;
  if(!(b in this.listeners)) {
    return!1
  }
  var c = goog.array.remove(this.listeners[b], a);
  c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
  return c
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
  var b = 0, c;
  for(c in this.listeners) {
    if(!a || c == a) {
      for(var d = this.listeners[c], e = 0;e < d.length;e++) {
        ++b, d[e].removed = !0
      }
      delete this.listeners[c];
      this.typeCount_--
    }
  }
  return b
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
  var c = this.listeners[a], d = [];
  if(c) {
    for(var e = 0;e < c.length;++e) {
      var f = c[e];
      f.capture == b && d.push(f)
    }
  }
  return d
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
  a = this.listeners[a];
  var e = -1;
  a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
  return-1 < e ? a[e] : null
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a), d = goog.isDef(b);
  return goog.object.some(this.listeners, function(e, f) {
    for(var g = 0;g < e.length;++g) {
      if(!(c && e[g].type != a || d && e[g].capture != b)) {
        return!0
      }
    }
    return!1
  })
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
  for(var e = 0;e < a.length;++e) {
    var f = a[e];
    if(!f.removed && f.listener == b && f.capture == !!c && f.handler == d) {
      return e
    }
  }
  return-1
};
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1E3;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  this.assertInitialized_();
  var b, c = this.getParentEventTarget();
  if(c) {
    for(b = [];c;c = c.getParentEventTarget()) {
      b.push(c)
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, b)
};
goog.events.EventTarget.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.events.EventTarget.superClass_.goog_Disposable_prototype$disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(a, b, !1, c, d)
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
  return this.eventTargetListeners_.add(a, b, !0, c, d)
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
  return this.eventTargetListeners_.remove(a, b, c, d)
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
  return this.eventTargetListeners_.removeByKey(a)
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
  a = this.eventTargetListeners_.listeners[a];
  if(!a) {
    return!0
  }
  a = goog.array.clone(a);
  for(var d = !0, e = 0;e < a.length;++e) {
    var f = a[e];
    if(f && !f.removed && f.capture == b) {
      var g = f.listener, h = f.handler || f.src;
      f.callOnce && this.unlistenByKey(f);
      d = !1 !== g.call(h, c) && d
    }
  }
  return d && !1 != c.returnValue_
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
  return this.eventTargetListeners_.getListeners(a, b)
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
  return this.eventTargetListeners_.getListener(a, b, c, d)
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
  return this.eventTargetListeners_.hasListener(a, b)
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
  this.actualEventTarget_ = a
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
  var d = b.type || b;
  if(goog.isString(b)) {
    b = new goog.events.Event(b, a)
  }else {
    if(b instanceof goog.events.Event) {
      b.target = b.target || a
    }else {
      var e = b;
      b = new goog.events.Event(d, a);
      goog.object.extend(b, e)
    }
  }
  var e = !0, f;
  if(c) {
    for(var g = c.length - 1;!b.propagationStopped_ && 0 <= g;g--) {
      f = b.goog_events_Event$currentTarget = c[g], e = f.fireListeners(d, !0, b) && e
    }
  }
  b.propagationStopped_ || (f = b.goog_events_Event$currentTarget = a, e = f.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = f.fireListeners(d, !1, b) && e));
  if(c) {
    for(g = 0;!b.propagationStopped_ && g < c.length;g++) {
      f = b.goog_events_Event$currentTarget = c[g], e = f.fireListeners(d, !1, b) && e
    }
  }
  return e
};
ol.Observable = function() {
  goog.events.EventTarget.call(this);
  this.revision_ = 0
};
goog.inherits(ol.Observable, goog.events.EventTarget);
ol.Observable.prototype.ol_Observable_prototype$dispatchChangeEvent = function() {
  ++this.revision_;
  this.dispatchEvent(goog.events.EventType.CHANGE)
};
ol.Observable.prototype.getRevision = function() {
  return this.revision_
};
ol.Observable.prototype.on = function(a, b, c) {
  return goog.events.listen(this, a, b, !1, c)
};
ol.Observable.prototype.once = function(a, b, c) {
  return goog.events.listenOnce(this, a, b, !1, c)
};
ol.Observable.prototype.un = function(a, b, c) {
  goog.events.unlisten(this, a, b, !1, c)
};
ol.Observable.prototype.unByKey = function(a) {
  goog.events.unlistenByKey(a)
};
ol.ObjectEventType = {BEFOREPROPERTYCHANGE:"beforepropertychange", PROPERTYCHANGE:"propertychange"};
ol.ObjectEvent = function(a, b) {
  goog.events.Event.call(this, a);
  this.key_ = b
};
goog.inherits(ol.ObjectEvent, goog.events.Event);
ol.ObjectEvent.prototype.ol_ObjectEvent_prototype$getKey = function() {
  return this.key_
};
ol.ObjectAccessor = function(a, b) {
  this.target = a;
  this.ol_ObjectAccessor$key = b;
  this.to = this.from = goog.functions.identity
};
ol.ObjectAccessor.prototype.transform = function(a, b) {
  this.from = a;
  this.to = b;
  this.target.notify(this.ol_ObjectAccessor$key)
};
ol.Object = function(a) {
  ol.Observable.call(this);
  this.values_ = {};
  this.accessors_ = {};
  this.beforeChangeListeners_ = {};
  this.listeners_ = {};
  goog.isDef(a) && this.ol_Object_prototype$setValues(a)
};
goog.inherits(ol.Object, ol.Observable);
ol.Object.changeEventTypeCache_ = {};
ol.Object.getterNameCache_ = {};
ol.Object.setterNameCache_ = {};
ol.Object.capitalize = function(a) {
  return a.substr(0, 1).toUpperCase() + a.substr(1)
};
ol.Object.getChangeEventType = function(a) {
  return ol.Object.changeEventTypeCache_.hasOwnProperty(a) ? ol.Object.changeEventTypeCache_[a] : ol.Object.changeEventTypeCache_[a] = "change:" + a.toLowerCase()
};
ol.Object.getGetterName = function(a) {
  return ol.Object.getterNameCache_.hasOwnProperty(a) ? ol.Object.getterNameCache_[a] : ol.Object.getterNameCache_[a] = "get" + ol.Object.capitalize(a)
};
ol.Object.getSetterName = function(a) {
  return ol.Object.setterNameCache_.hasOwnProperty(a) ? ol.Object.setterNameCache_[a] : ol.Object.setterNameCache_[a] = "set" + ol.Object.capitalize(a)
};
ol.Object.prototype.bindTo = function(a, b, c) {
  c = c || a;
  this.unbind(a);
  var d = ol.Object.getChangeEventType(c);
  this.listeners_[a] = goog.events.listen(b, d, function() {
    this.notifyInternal_(a)
  }, void 0, this);
  this.beforeChangeListeners_[a] = goog.events.listen(b, ol.ObjectEventType.BEFOREPROPERTYCHANGE, this.createBeforeChangeListener_(a, c), void 0, this);
  b = new ol.ObjectAccessor(b, c);
  this.accessors_[a] = b;
  this.notifyInternal_(a);
  return b
};
ol.Object.prototype.createBeforeChangeListener_ = function(a, b) {
  return function(c) {
    c.ol_ObjectEvent_prototype$getKey() === b && this.dispatchEvent(new ol.ObjectEvent(ol.ObjectEventType.BEFOREPROPERTYCHANGE, a))
  }
};
ol.Object.prototype.get = function(a) {
  var b, c = this.accessors_;
  if(c.hasOwnProperty(a)) {
    a = c[a];
    b = a.target;
    var c = a.ol_ObjectAccessor$key, d = ol.Object.getGetterName(c), d = goog.object.get(b, d);
    b = goog.isDef(d) ? d.call(b) : b.get(c);
    b = a.to(b)
  }else {
    this.values_.hasOwnProperty(a) && (b = this.values_[a])
  }
  return b
};
ol.Object.prototype.getKeys = function() {
  var a = this.accessors_, b;
  if(goog.object.isEmpty(this.values_)) {
    if(goog.object.isEmpty(a)) {
      return[]
    }
    b = a
  }else {
    if(goog.object.isEmpty(a)) {
      b = this.values_
    }else {
      b = {};
      for(var c in this.values_) {
        b[c] = !0
      }
      for(c in a) {
        b[c] = !0
      }
    }
  }
  return goog.object.getKeys(b)
};
ol.Object.prototype.getProperties = function() {
  var a = {}, b;
  for(b in this.values_) {
    a[b] = this.values_[b]
  }
  for(b in this.accessors_) {
    a[b] = this.get(b)
  }
  return a
};
ol.Object.prototype.notify = function(a) {
  var b = this.accessors_;
  b.hasOwnProperty(a) ? (a = b[a], a.target.notify(a.ol_ObjectAccessor$key)) : this.notifyInternal_(a)
};
ol.Object.prototype.notifyInternal_ = function(a) {
  var b = ol.Object.getChangeEventType(a);
  this.dispatchEvent(b);
  this.dispatchEvent(new ol.ObjectEvent(ol.ObjectEventType.PROPERTYCHANGE, a))
};
ol.Object.prototype.set = function(a, b) {
  this.dispatchEvent(new ol.ObjectEvent(ol.ObjectEventType.BEFOREPROPERTYCHANGE, a));
  var c = this.accessors_;
  if(c.hasOwnProperty(a)) {
    var d = c[a], c = d.target, e = d.ol_ObjectAccessor$key;
    b = d.from(b);
    d = ol.Object.getSetterName(e);
    d = goog.object.get(c, d);
    goog.isDef(d) ? d.call(c, b) : c.set(e, b)
  }else {
    this.values_[a] = b, this.notifyInternal_(a)
  }
};
ol.Object.prototype.ol_Object_prototype$setValues = function(a) {
  for(var b in a) {
    var c = a[b], d = ol.Object.getSetterName(b), d = goog.object.get(this, d);
    goog.isDef(d) ? d.call(this, c) : this.set(b, c)
  }
};
ol.Object.prototype.unbind = function(a) {
  var b = this.listeners_, c = b[a];
  c && (delete b[a], goog.events.unlistenByKey(c), b = this.get(a), delete this.accessors_[a], this.values_[a] = b);
  if(b = this.beforeChangeListeners_[a]) {
    goog.events.unlistenByKey(b), delete this.beforeChangeListeners_[a]
  }
};
ol.Object.prototype.unbindAll = function() {
  for(var a in this.listeners_) {
    this.unbind(a)
  }
};
ol.ViewHint = {ANIMATING:0, INTERACTING:1};
ol.View = function() {
  ol.Object.call(this);
  this.hints_ = [0, 0]
};
goog.inherits(ol.View, ol.Object);
ol.View.prototype.getHints = function() {
  return goog.array.clone(this.hints_)
};
ol.View.prototype.getView2D = function() {
  return null
};
ol.View.prototype.getView3D = function() {
  return null
};
ol.View.prototype.isDef = function() {
  return!1
};
ol.View.prototype.setHint = function(a, b) {
  this.hints_[a] += b;
  return this.hints_[a]
};
ol.View2DProperty = {CENTER:"center", PROJECTION:"projection", RESOLUTION:"resolution", ROTATION:"rotation"};
ol.View2D = function(a) {
  ol.View.call(this);
  a = a || {};
  var b = {};
  b[ol.View2DProperty.CENTER] = goog.isDef(a.center) ? a.center : null;
  b[ol.View2DProperty.PROJECTION] = ol.proj.createProjection(a.projection, "EPSG:3857");
  var c = ol.View2D.createResolutionConstraint_(a);
  this.maxResolution_ = c.maxResolution;
  this.minResolution_ = c.minResolution;
  var d = ol.View2D.createCenterConstraint_(a), c = c.constraint, e = ol.View2D.createRotationConstraint_(a);
  this.constraints_ = new ol.Constraints(d, c, e);
  goog.isDef(a.resolution) ? b[ol.View2DProperty.RESOLUTION] = a.resolution : goog.isDef(a.zoom) && (b[ol.View2DProperty.RESOLUTION] = this.constrainResolution(this.maxResolution_, a.zoom));
  b[ol.View2DProperty.ROTATION] = goog.isDef(a.rotation) ? a.rotation : 0;
  this.ol_Object_prototype$setValues(b)
};
goog.inherits(ol.View2D, ol.View);
ol.View2D.prototype.calculateCenterRotate = function(a, b) {
  var c, d = this.getCenter();
  goog.isDef(d) && (c = [d[0] - b[0], d[1] - b[1]], ol.coordinate.rotate(c, a - this.ol_IView2D_prototype$getRotation()), ol.coordinate.add(c, b));
  return c
};
ol.View2D.prototype.calculateCenterZoom = function(a, b) {
  var c, d = this.getCenter(), e = this.ol_IView2D_prototype$getResolution();
  goog.isDef(d) && goog.isDef(e) && (c = [b[0] - a * (b[0] - d[0]) / e, b[1] - a * (b[1] - d[1]) / e]);
  return c
};
ol.View2D.prototype.constrainCenter = function(a) {
  return this.constraints_.center(a)
};
ol.View2D.prototype.constrainResolution = function(a, b, c) {
  return this.constraints_.resolution(a, b || 0, c || 0)
};
ol.View2D.prototype.constrainRotation = function(a, b) {
  return this.constraints_.rotation(a, b || 0)
};
ol.View2D.prototype.getCenter = function() {
  return this.get(ol.View2DProperty.CENTER)
};
goog.exportProperty(ol.View2D.prototype, "getCenter", ol.View2D.prototype.getCenter);
ol.View2D.prototype.calculateExtent = function(a) {
  var b = this.getCenter(), c = this.ol_IView2D_prototype$getResolution();
  return[b[0] - c * a[0] / 2, b[1] - c * a[1] / 2, b[0] + c * a[0] / 2, b[1] + c * a[1] / 2]
};
ol.View2D.prototype.ol_IView2D_prototype$getProjection = function() {
  return this.get(ol.View2DProperty.PROJECTION)
};
goog.exportProperty(ol.View2D.prototype, "getProjection", ol.View2D.prototype.ol_IView2D_prototype$getProjection);
ol.View2D.prototype.ol_IView2D_prototype$getResolution = function() {
  return this.get(ol.View2DProperty.RESOLUTION)
};
goog.exportProperty(ol.View2D.prototype, "getResolution", ol.View2D.prototype.ol_IView2D_prototype$getResolution);
ol.View2D.prototype.getResolutionForExtent = function(a, b) {
  return Math.max((a[2] - a[0]) / b[0], (a[3] - a[1]) / b[1])
};
ol.View2D.prototype.getResolutionForValueFunction = function(a) {
  var b = a || 2, c = this.maxResolution_, d = Math.log(c / this.minResolution_) / Math.log(b);
  return function(a) {
    return c / Math.pow(b, a * d)
  }
};
ol.View2D.prototype.ol_IView2D_prototype$getRotation = function() {
  return this.get(ol.View2DProperty.ROTATION)
};
goog.exportProperty(ol.View2D.prototype, "getRotation", ol.View2D.prototype.ol_IView2D_prototype$getRotation);
ol.View2D.prototype.getValueForResolutionFunction = function(a) {
  var b = a || 2, c = this.maxResolution_, d = Math.log(c / this.minResolution_) / Math.log(b);
  return function(a) {
    return Math.log(c / a) / Math.log(b) / d
  }
};
ol.View2D.prototype.getView2D = function() {
  return this
};
ol.View2D.prototype.getView2DState = function() {
  var a = this.getCenter(), b = this.ol_IView2D_prototype$getProjection(), c = this.ol_IView2D_prototype$getResolution(), d = this.ol_IView2D_prototype$getRotation();
  return{center:a.slice(), projection:goog.isDef(b) ? b : null, resolution:c, rotation:goog.isDef(d) ? d : 0}
};
ol.View2D.prototype.getView3D = function() {
};
ol.View2D.prototype.getZoom = function() {
  var a, b = this.ol_IView2D_prototype$getResolution();
  if(goog.isDef(b)) {
    var c, d = 0;
    do {
      c = this.constrainResolution(this.maxResolution_, d);
      if(c == b) {
        a = d;
        break
      }
      ++d
    }while(c > this.minResolution_)
  }
  return a
};
ol.View2D.prototype.fitExtent = function(a, b) {
  if(!ol.extent.isEmpty(a)) {
    this.ol_View2D_prototype$setCenter(ol.extent.getCenter(a));
    var c = this.getResolutionForExtent(a, b), d = this.constrainResolution(c, 0, 0);
    d < c && (d = this.constrainResolution(d, -1, 0));
    this.setResolution(d)
  }
};
ol.View2D.prototype.isDef = function() {
  return goog.isDefAndNotNull(this.getCenter()) && goog.isDef(this.ol_IView2D_prototype$getResolution())
};
ol.View2D.prototype.ol_View2D_prototype$setCenter = function(a) {
  this.set(ol.View2DProperty.CENTER, a)
};
goog.exportProperty(ol.View2D.prototype, "setCenter", ol.View2D.prototype.ol_View2D_prototype$setCenter);
ol.View2D.prototype.ol_View2D_prototype$setProjection = function(a) {
  this.set(ol.View2DProperty.PROJECTION, a)
};
goog.exportProperty(ol.View2D.prototype, "setProjection", ol.View2D.prototype.ol_View2D_prototype$setProjection);
ol.View2D.prototype.setResolution = function(a) {
  this.set(ol.View2DProperty.RESOLUTION, a)
};
goog.exportProperty(ol.View2D.prototype, "setResolution", ol.View2D.prototype.setResolution);
ol.View2D.prototype.setRotation = function(a) {
  this.set(ol.View2DProperty.ROTATION, a)
};
goog.exportProperty(ol.View2D.prototype, "setRotation", ol.View2D.prototype.setRotation);
ol.View2D.prototype.setZoom = function(a) {
  a = this.constrainResolution(this.maxResolution_, a, 0);
  this.setResolution(a)
};
ol.View2D.createCenterConstraint_ = function(a) {
  return goog.isDef(a.extent) ? ol.CenterConstraint.createExtent(a.extent) : ol.CenterConstraint.none
};
ol.View2D.createResolutionConstraint_ = function(a) {
  var b, c;
  if(goog.isDef(a.resolutions)) {
    b = a.resolutions, c = b[0], a = b[b.length - 1], b = ol.ResolutionConstraint.createSnapToResolutions(b)
  }else {
    c = a.maxResolution;
    goog.isDef(c) || (c = a.projection, b = ol.proj.createProjection(c, "EPSG:3857").ol_proj_Projection_prototype$getExtent(), c = (goog.isNull(b) ? 360 * ol.METERS_PER_UNIT[ol.proj.Units.DEGREES] / ol.METERS_PER_UNIT[c.getUnits()] : Math.max(b[2] - b[0], b[3] - b[1])) / ol.DEFAULT_TILE_SIZE);
    b = a.maxZoom;
    goog.isDef(b) || (b = 28);
    var d = a.zoomFactor;
    goog.isDef(d) || (d = 2);
    a = c / Math.pow(d, b);
    b = ol.ResolutionConstraint.createSnapToPower(d, c, b)
  }
  return{constraint:b, maxResolution:c, minResolution:a}
};
ol.View2D.createRotationConstraint_ = function(a) {
  return ol.RotationConstraint.createSnapToZero()
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return"function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if("function" == typeof a.getValues) {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var b = [], c = a.length, d = 0;d < c;d++) {
      b.push(a[d])
    }
    return b
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if("function" == typeof a.getKeys) {
    return a.getKeys()
  }
  if("function" != typeof a.getValues) {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for(var c = 0;c < a;c++) {
        b.push(c)
      }
      return b
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, b) {
  return"function" == typeof a.contains ? a.contains(b) : "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b)
};
goog.structs.isEmpty = function(a) {
  return"function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, b, c) {
  if("function" == typeof a.forEach) {
    a.forEach(b, c)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c)
    }else {
      for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
        b.call(c, e[g], d && d[g], a)
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if("function" == typeof a.filter) {
    return a.filter(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      b.call(c, f[h], e[h], a) && (d[e[h]] = f[h])
    }
  }else {
    for(d = [], h = 0;h < g;h++) {
      b.call(c, f[h], void 0, a) && d.push(f[h])
    }
  }
  return d
};
goog.structs.map = function(a, b, c) {
  if("function" == typeof a.map) {
    return a.map(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c)
  }
  var d, e = goog.structs.getKeys(a), f = goog.structs.getValues(a), g = f.length;
  if(e) {
    d = {};
    for(var h = 0;h < g;h++) {
      d[e[h]] = b.call(c, f[h], e[h], a)
    }
  }else {
    for(d = [], h = 0;h < g;h++) {
      d[h] = b.call(c, f[h], void 0, a)
    }
  }
  return d
};
goog.structs.some = function(a, b, c) {
  if("function" == typeof a.some) {
    return a.some(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(b.call(c, e[g], d && d[g], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, b, c) {
  if("function" == typeof a.every) {
    return a.every(b, c)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c)
  }
  for(var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0;g < f;g++) {
    if(!b.call(c, e[g], d && d[g], a)) {
      return!1
    }
  }
  return!0
};
goog.iter = {};
"StopIteration" in goog.global ? goog.iter.StopIteration = goog.global.StopIteration : goog.iter.StopIteration = Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if("function" == typeof a.__iterator__) {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for(;;) {
        if(b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(b in a) {
          return a[b++]
        }
        b++
      }
    };
    return c
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c)
    }catch(d) {
      if(d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        b.call(c, a.next(), void 0, a)
      }
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(b.call(c, a, void 0, d)) {
        return a
      }
    }
  };
  return a
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = b);
  if(0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if(0 < f && d >= e || 0 > f && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a
  };
  return g
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b)
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = d.next();
      return b.call(c, a, void 0, d)
    }
  };
  return a
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a)
  });
  return e
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(b.call(c, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!1
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!b.call(c, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(d) {
    if(d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return!0
};
goog.iter.chain = function(a) {
  var b = arguments, c = b.length, d = 0, e = new goog.iter.Iterator;
  e.next = function() {
    try {
      if(d >= c) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(b[d]).next()
    }catch(a) {
      if(a !== goog.iter.StopIteration || d >= c) {
        throw a;
      }
      d++;
      return this.next()
    }
  };
  return e
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for(;;) {
      var a = d.next();
      if(!e || !b.call(c, a, void 0, d)) {
        return e = !1, a
      }
    }
  };
  return a
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for(;;) {
      if(e) {
        var a = d.next();
        if(b.call(c, a, void 0, d)) {
          return a
        }
        e = !1
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return a
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a)
  });
  return b
};
goog.iter.equals = function(a, b) {
  a = goog.iter.toIterator(a);
  b = goog.iter.toIterator(b);
  var c, d;
  try {
    for(;;) {
      c = d = !1;
      var e = a.next();
      c = !0;
      var f = b.next();
      d = !0;
      if(e != f) {
        break
      }
    }
  }catch(g) {
    if(g !== goog.iter.StopIteration) {
      throw g;
    }
    if(c && !d) {
      return!1
    }
    if(!d) {
      try {
        b.next()
      }catch(h) {
        if(h !== goog.iter.StopIteration) {
          throw h;
        }
        return!0
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(c) {
    if(c != goog.iter.StopIteration) {
      throw c;
    }
    return b
  }
};
goog.iter.product = function(a) {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if(d) {
      for(var a = goog.array.map(d, function(a, b) {
        return c[b][a]
      }), b = d.length - 1;0 <= b;b--) {
        if(d[b] < c[b].length - 1) {
          d[b]++;
          break
        }
        if(0 == b) {
          d = null;
          break
        }
        d[b] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return b
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0;
  a = new goog.iter.Iterator;
  var e = !1;
  a.next = function() {
    var a = null;
    if(!e) {
      try {
        return a = b.next(), c.push(a), a
      }catch(g) {
        if(g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a
  };
  return a
};
goog.structs.Map = function(a, b) {
  this.goog_structs_Map$map_ = {};
  this.keys_ = [];
  var c = arguments.length;
  if(1 < c) {
    if(c % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var d = 0;d < c;d += 2) {
      this.set(arguments[d], arguments[d + 1])
    }
  }else {
    a && this.goog_structs_Map_prototype$addAll(a)
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for(var a = [], b = 0;b < this.keys_.length;b++) {
    a.push(this.goog_structs_Map$map_[this.keys_[b]])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.goog_structs_Map$map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    if(goog.structs.Map.hasKey_(this.goog_structs_Map$map_, c) && this.goog_structs_Map$map_[c] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, b) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var c = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var d, e = 0;d = this.keys_[e];e++) {
    if(!c(this.get(d), a.get(d))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
  this.goog_structs_Map$map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.goog_structs_Map$map_, a) ? (delete this.goog_structs_Map$map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    for(var a = 0, b = 0;a < this.keys_.length;) {
      var c = this.keys_[a];
      goog.structs.Map.hasKey_(this.goog_structs_Map$map_, c) && (this.keys_[b++] = c);
      a++
    }
    this.keys_.length = b
  }
  if(this.count_ != this.keys_.length) {
    for(var d = {}, b = a = 0;a < this.keys_.length;) {
      c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++
    }
    this.keys_.length = b
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.goog_structs_Map$map_, a) ? this.goog_structs_Map$map_[a] : b
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.goog_structs_Map$map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.goog_structs_Map$map_[a] = b
};
goog.structs.Map.prototype.goog_structs_Map_prototype$addAll = function(a) {
  var b;
  a instanceof goog.structs.Map ? (b = a.getKeys(), a = a.getValues()) : (b = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var c = 0;c < b.length;c++) {
    this.set(b[c], a[c])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  for(var a = new goog.structs.Map, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a.set(this.goog_structs_Map$map_[c], c)
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for(var a = {}, b = 0;b < this.keys_.length;b++) {
    var c = this.keys_[b];
    a[c] = this.goog_structs_Map$map_[c]
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.keys_, d = this.goog_structs_Map$map_, e = this.version_, f = this, g = new goog.iter.Iterator;
  g.next = function() {
    for(;;) {
      if(e != f.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(b >= c.length) {
        throw goog.iter.StopIteration;
      }
      var g = c[b++];
      return a ? g : d[g]
    }
  };
  return g
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b)
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = "";
  a && (h += a + ":");
  c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
  e && (h += e);
  f && (h += "?" + f);
  g && (h += "#" + g);
  return h
};
goog.uri.utils.splitRe_ = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?\x3d[/#?]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$");
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  goog.uri.utils.phishingProtection_();
  return a.match(goog.uri.utils.splitRe_)
};
goog.uri.utils.needsPhishingProtection_ = goog.userAgent.WEBKIT;
goog.uri.utils.phishingProtection_ = function() {
  if(goog.uri.utils.needsPhishingProtection_) {
    goog.uri.utils.needsPhishingProtection_ = !1;
    var a = goog.global.location;
    if(a) {
      var b = a.href;
      if(b && (b = goog.uri.utils.getDomain(b)) && b != a.hostname) {
        throw goog.uri.utils.needsPhishingProtection_ = !0, Error();
      }
    }
  }
};
goog.uri.utils.decodeIfPossible_ = function(a) {
  return a && decodeURIComponent(a)
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a)
};
goog.uri.utils.getEffectiveScheme = function(a) {
  a = goog.uri.utils.getScheme(a);
  !a && self.location && (a = self.location.protocol, a = a.substr(0, a.length - 1));
  return a ? a.toLowerCase() : ""
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a)
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a))
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a)
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a))
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a)
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a))
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a)
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? null : a.substr(b + 1)
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "")
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a))
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT])
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT])
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? a : a.substr(0, b)
};
goog.uri.utils.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.SCHEME] == d[goog.uri.utils.ComponentIndex.SCHEME] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  if(goog.DEBUG && (0 <= a.indexOf("#") || 0 <= a.indexOf("?"))) {
    throw Error("goog.uri.utils: Fragment or query identifiers are not supported: [" + a + "]");
  }
};
goog.uri.utils.appendQueryData_ = function(a) {
  if(a[1]) {
    var b = a[0], c = b.indexOf("#");
    0 <= c && (a.push(b.substr(c)), a[0] = b = b.substr(0, c));
    c = b.indexOf("?");
    0 > c ? a[1] = "?" : c == b.length - 1 && (a[1] = void 0)
  }
  return a.join("")
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  if(goog.isArray(b)) {
    for(var d = 0;d < b.length;d++) {
      goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c)
    }
  }else {
    null != b && c.push("\x26", a, "" === b ? "" : "\x3d", goog.string.urlEncode(b))
  }
};
goog.uri.utils.buildQueryDataBuffer_ = function(a, b, c) {
  for(c = c || 0;c < b.length;c += 2) {
    goog.uri.utils.appendKeyValuePairs_(b[c], b[c + 1], a)
  }
  return a
};
goog.uri.utils.buildQueryData = function(a, b) {
  var c = goog.uri.utils.buildQueryDataBuffer_([], a, b);
  c[0] = "";
  return c.join("")
};
goog.uri.utils.buildQueryDataBufferFromMap_ = function(a, b) {
  for(var c in b) {
    goog.uri.utils.appendKeyValuePairs_(c, b[c], a)
  }
  return a
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  a = goog.uri.utils.buildQueryDataBufferFromMap_([], a);
  a[0] = "";
  return a.join("")
};
goog.uri.utils.appendParams = function(a, b) {
  return goog.uri.utils.appendQueryData_(2 == arguments.length ? goog.uri.utils.buildQueryDataBuffer_([a], arguments[1], 0) : goog.uri.utils.buildQueryDataBuffer_([a], arguments, 1))
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  return goog.uri.utils.appendQueryData_(goog.uri.utils.buildQueryDataBufferFromMap_([a], b))
};
goog.uri.utils.appendParam = function(a, b, c) {
  a = [a, "\x26", b];
  goog.isDefAndNotNull(c) && a.push("\x3d", goog.string.urlEncode(c));
  return goog.uri.utils.appendQueryData_(a)
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  for(var e = c.length;0 <= (b = a.indexOf(c, b)) && b < d;) {
    var f = a.charCodeAt(b - 1);
    if(f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      if(f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b
      }
    }
    b += e + 1
  }
  return-1
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_))
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if(0 > d) {
    return null
  }
  var e = a.indexOf("\x26", d);
  if(0 > e || e > c) {
    e = c
  }
  d += b.length + 1;
  return goog.string.urlDecode(a.substr(d, e - d))
};
goog.uri.utils.getParamValues = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    d = a.indexOf("\x26", e);
    if(0 > d || d > c) {
      d = c
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)))
  }
  return f
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  for(var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = [];0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    f.push(a.substring(d, e)), d = Math.min(a.indexOf("\x26", e) + 1 || c, c)
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1")
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c)
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  goog.string.startsWith(b, "/") && (b = b.substr(1));
  return goog.string.buildString(a, "/", b)
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString())
};
goog.Uri = function(a, b) {
  var c;
  a instanceof goog.Uri ? (this.goog_Uri_prototype$ignoreCase_ = goog.isDef(b) ? b : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.goog_Uri_prototype$ignoreCase_ = !!b, this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] || 
  "", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.goog_Uri_prototype$ignoreCase_ = !!b, this.queryData_ = new goog.Uri.QueryData(null, null, this.goog_Uri_prototype$ignoreCase_))
};
goog.Uri.preserveParameterTypesCompatibilityFlag = !1;
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.scheme_ = "";
goog.Uri.prototype.userInfo_ = "";
goog.Uri.prototype.domain_ = "";
goog.Uri.prototype.port_ = null;
goog.Uri.prototype.path_ = "";
goog.Uri.prototype.fragment_ = "";
goog.Uri.prototype.isReadOnly_ = !1;
goog.Uri.prototype.goog_Uri_prototype$ignoreCase_ = !1;
goog.Uri.prototype.toString = function() {
  var a = [], b = this.getScheme();
  b && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_), ":");
  if(b = this.getDomain()) {
    a.push("//");
    var c = this.getUserInfo();
    c && a.push(goog.Uri.encodeSpecialChars_(c, goog.Uri.reDisallowedInSchemeOrUserInfo_), "@");
    a.push(goog.string.urlEncode(b));
    b = this.getPort();
    null != b && a.push(":", String(b))
  }
  if(b = this.getPath()) {
    this.hasDomain() && "/" != b.charAt(0) && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(b, "/" == b.charAt(0) ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_))
  }
  (b = this.getEncodedQuery()) && a.push("?", b);
  (b = this.getFragment()) && a.push("#", goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInFragment_));
  return a.join("")
};
goog.Uri.prototype.goog_Uri_prototype$resolve = function(a) {
  var b = this.clone(), c = a.hasScheme();
  c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
  c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
  c ? b.setDomain(a.getDomain()) : c = a.hasPort();
  var d = a.getPath();
  if(c) {
    b.setPort(a.getPort())
  }else {
    if(c = a.hasPath()) {
      if("/" != d.charAt(0)) {
        if(this.hasDomain() && !this.hasPath()) {
          d = "/" + d
        }else {
          var e = b.getPath().lastIndexOf("/");
          -1 != e && (d = b.getPath().substr(0, e + 1) + d)
        }
      }
      d = goog.Uri.removeDotSegments(d)
    }
  }
  c ? b.setPath(d) : c = a.hasQuery();
  c ? b.setQueryData(a.getDecodedQuery()) : c = a.hasFragment();
  c && b.setFragment(a.getFragment());
  return b
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this)
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_
};
goog.Uri.prototype.setScheme = function(a, b) {
  this.enforceReadOnly();
  if(this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a) : a) {
    this.scheme_ = this.scheme_.replace(/:$/, "")
  }
  return this
};
goog.Uri.prototype.hasScheme = function() {
  return!!this.scheme_
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_
};
goog.Uri.prototype.setUserInfo = function(a, b) {
  this.enforceReadOnly();
  this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasUserInfo = function() {
  return!!this.userInfo_
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_
};
goog.Uri.prototype.setDomain = function(a, b) {
  this.enforceReadOnly();
  this.domain_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasDomain = function() {
  return!!this.domain_
};
goog.Uri.prototype.getPort = function() {
  return this.port_
};
goog.Uri.prototype.setPort = function(a) {
  this.enforceReadOnly();
  if(a) {
    a = Number(a);
    if(isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.port_ = a
  }else {
    this.port_ = null
  }
  return this
};
goog.Uri.prototype.hasPort = function() {
  return null != this.port_
};
goog.Uri.prototype.getPath = function() {
  return this.path_
};
goog.Uri.prototype.setPath = function(a, b) {
  this.enforceReadOnly();
  this.path_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasPath = function() {
  return!!this.path_
};
goog.Uri.prototype.hasQuery = function() {
  return"" !== this.queryData_.toString()
};
goog.Uri.prototype.setQueryData = function(a, b) {
  this.enforceReadOnly();
  a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.goog_Uri_QueryData_prototype$setIgnoreCase(this.goog_Uri_prototype$ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, null, this.goog_Uri_prototype$ignoreCase_));
  return this
};
goog.Uri.prototype.setQuery = function(a, b) {
  return this.setQueryData(a, b)
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString()
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString()
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery()
};
goog.Uri.prototype.setParameterValue = function(a, b) {
  this.enforceReadOnly();
  this.queryData_.set(a, b);
  return this
};
goog.Uri.prototype.setParameterValues = function(a, b) {
  this.enforceReadOnly();
  goog.isArray(b) || (b = [String(b)]);
  this.queryData_.goog_Uri_QueryData_prototype$setValues(a, b);
  return this
};
goog.Uri.prototype.getParameterValues = function(a) {
  return this.queryData_.getValues(a)
};
goog.Uri.prototype.getParameterValue = function(a) {
  return this.queryData_.get(a)
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_
};
goog.Uri.prototype.setFragment = function(a, b) {
  this.enforceReadOnly();
  this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this
};
goog.Uri.prototype.hasFragment = function() {
  return!!this.fragment_
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
  return(!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort())
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this
};
goog.Uri.prototype.removeParameter = function(a) {
  this.enforceReadOnly();
  this.queryData_.remove(a);
  return this
};
goog.Uri.prototype.setReadOnly = function(a) {
  this.isReadOnly_ = a;
  return this
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_
};
goog.Uri.prototype.enforceReadOnly = function() {
  if(this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.goog_Uri_prototype$setIgnoreCase = function(a) {
  this.goog_Uri_prototype$ignoreCase_ = a;
  this.queryData_ && this.queryData_.goog_Uri_QueryData_prototype$setIgnoreCase(a);
  return this
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.goog_Uri_prototype$ignoreCase_
};
goog.Uri.parse = function(a, b) {
  return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b)
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
  h = new goog.Uri(null, h);
  a && h.setScheme(a);
  b && h.setUserInfo(b);
  c && h.setDomain(c);
  d && h.setPort(d);
  e && h.setPath(e);
  f && h.setQueryData(f);
  g && h.setFragment(g);
  return h
};
goog.Uri.function__new_goog_Uri______boolean____undefined$resolve = function(a, b) {
  a instanceof goog.Uri || (a = goog.Uri.parse(a));
  b instanceof goog.Uri || (b = goog.Uri.parse(b));
  return a.goog_Uri_prototype$resolve(b)
};
goog.Uri.removeDotSegments = function(a) {
  if(".." == a || "." == a) {
    return""
  }
  if(goog.string.contains(a, "./") || goog.string.contains(a, "/.")) {
    var b = goog.string.startsWith(a, "/");
    a = a.split("/");
    for(var c = [], d = 0;d < a.length;) {
      var e = a[d++];
      "." == e ? b && d == a.length && c.push("") : ".." == e ? ((1 < c.length || 1 == c.length && "" != c[0]) && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0)
    }
    return c.join("/")
  }
  return a
};
goog.Uri.decodeOrEmpty_ = function(a) {
  return a ? decodeURIComponent(a) : ""
};
goog.Uri.encodeSpecialChars_ = function(a, b) {
  return goog.isString(a) ? encodeURI(a).replace(b, goog.Uri.encodeChar_) : null
};
goog.Uri.encodeChar_ = function(a) {
  a = a.charCodeAt(0);
  return"%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[\#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[\#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[\#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
  var c = goog.uri.utils.split(a), d = goog.uri.utils.split(b);
  return c[goog.uri.utils.ComponentIndex.DOMAIN] == d[goog.uri.utils.ComponentIndex.DOMAIN] && c[goog.uri.utils.ComponentIndex.PORT] == d[goog.uri.utils.ComponentIndex.PORT]
};
goog.Uri.QueryData = function(a, b, c) {
  this.encodedQuery_ = a || null;
  this.goog_Uri_QueryData$ignoreCase_ = !!c
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if(!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    for(var a = this.encodedQuery_.split("\x26"), b = 0;b < a.length;b++) {
      var c = a[b].indexOf("\x3d"), d = null, e = null;
      0 <= c ? (d = a[b].substring(0, c), e = a[b].substring(c + 1)) : d = a[b];
      d = goog.string.urlDecode(d);
      d = this.getKeyName_(d);
      this.add(d, e ? goog.string.urlDecode(e) : "")
    }
  }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
  b = goog.structs.getKeys(a);
  if("undefined" == typeof b) {
    throw Error("Keys are undefined");
  }
  c = new goog.Uri.QueryData(null, null, c);
  a = goog.structs.getValues(a);
  for(var d = 0;d < b.length;d++) {
    var e = b[d], f = a[d];
    goog.isArray(f) ? c.goog_Uri_QueryData_prototype$setValues(e, f) : c.add(e, f)
  }
  return c
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
  if(a.length != b.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  c = new goog.Uri.QueryData(null, null, d);
  for(d = 0;d < a.length;d++) {
    c.add(a[d], b[d])
  }
  return c
};
goog.Uri.QueryData.prototype.keyMap_ = null;
goog.Uri.QueryData.prototype.count_ = null;
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_
};
goog.Uri.QueryData.prototype.add = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  var c = this.keyMap_.get(a);
  c || this.keyMap_.set(a, c = []);
  c.push(b);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.remove = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ -= this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return 0 == this.count_
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a)
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
  var b = this.getValues();
  return goog.array.contains(b, a)
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for(var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0;d < b.length;d++) {
    for(var e = a[d], f = 0;f < e.length;f++) {
      c.push(b[d])
    }
  }
  return c
};
goog.Uri.QueryData.prototype.getValues = function(a) {
  this.ensureKeyMapInitialized_();
  var b = [];
  if(a) {
    this.containsKey(a) && (b = goog.array.concat(b, this.keyMap_.get(this.getKeyName_(a))))
  }else {
    a = this.keyMap_.getValues();
    for(var c = 0;c < a.length;c++) {
      b = goog.array.concat(b, a[c])
    }
  }
  return b
};
goog.Uri.QueryData.prototype.set = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  this.containsKey(a) && (this.count_ -= this.keyMap_.get(a).length);
  this.keyMap_.set(a, [b]);
  this.count_++;
  return this
};
goog.Uri.QueryData.prototype.get = function(a, b) {
  var c = a ? this.getValues(a) : [];
  return goog.Uri.preserveParameterTypesCompatibilityFlag ? 0 < c.length ? c[0] : b : 0 < c.length ? String(c[0]) : b
};
goog.Uri.QueryData.prototype.goog_Uri_QueryData_prototype$setValues = function(a, b) {
  this.remove(a);
  0 < b.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), goog.array.clone(b)), this.count_ += b.length)
};
goog.Uri.QueryData.prototype.toString = function() {
  if(this.encodedQuery_) {
    return this.encodedQuery_
  }
  if(!this.keyMap_) {
    return""
  }
  for(var a = [], b = this.keyMap_.getKeys(), c = 0;c < b.length;c++) {
    for(var d = b[c], e = goog.string.urlEncode(d), d = this.getValues(d), f = 0;f < d.length;f++) {
      var g = e;
      "" !== d[f] && (g += "\x3d" + goog.string.urlEncode(d[f]));
      a.push(g)
    }
  }
  return this.encodedQuery_ = a.join("\x26")
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString())
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
  this.ensureKeyMapInitialized_();
  goog.structs.forEach(this.keyMap_, function(b, c, d) {
    goog.array.contains(a, c) || this.remove(c)
  }, this);
  return this
};
goog.Uri.QueryData.prototype.clone = function() {
  var a = new goog.Uri.QueryData;
  a.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this.count_);
  return a
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
  a = String(a);
  this.goog_Uri_QueryData$ignoreCase_ && (a = a.toLowerCase());
  return a
};
goog.Uri.QueryData.prototype.goog_Uri_QueryData_prototype$setIgnoreCase = function(a) {
  a && !this.goog_Uri_QueryData$ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), goog.structs.forEach(this.keyMap_, function(a, c) {
    var d = c.toLowerCase();
    c != d && (this.remove(c), this.goog_Uri_QueryData_prototype$setValues(d, a))
  }, this));
  this.goog_Uri_QueryData$ignoreCase_ = a
};
goog.Uri.QueryData.prototype.extend = function(a) {
  for(var b = 0;b < arguments.length;b++) {
    goog.structs.forEach(arguments[b], function(a, b) {
      this.add(b, a)
    }, this)
  }
};
goog.async = {};
goog.async.AnimationDelay = function(a, b, c) {
  goog.Disposable.call(this);
  this.listener_ = a;
  this.handler_ = c;
  this.win_ = b || window;
  this.callback_ = goog.bind(this.doAction_, this)
};
goog.inherits(goog.async.AnimationDelay, goog.Disposable);
goog.async.AnimationDelay.prototype.goog_async_AnimationDelay_prototype$id_ = null;
goog.async.AnimationDelay.prototype.usingListeners_ = !1;
goog.async.AnimationDelay.function__new_goog_async_AnimationDelay__function__number_______Window_null_____Object_null_____undefined$TIMEOUT = 20;
goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = "MozBeforePaint";
goog.async.AnimationDelay.prototype.start = function() {
  this.goog_async_AnimationDelay_prototype$stop();
  this.usingListeners_ = !1;
  var a = this.getRaf_(), b = this.getCancelRaf_();
  a && !b && this.win_.mozRequestAnimationFrame ? (this.goog_async_AnimationDelay_prototype$id_ = goog.events.listen(this.win_, goog.async.AnimationDelay.MOZ_BEFORE_PAINT_EVENT_, this.callback_), this.win_.mozRequestAnimationFrame(null), this.usingListeners_ = !0) : this.goog_async_AnimationDelay_prototype$id_ = a && b ? a.call(this.win_, this.callback_) : this.win_.setTimeout(goog.functions.lock(this.callback_), goog.async.AnimationDelay.function__new_goog_async_AnimationDelay__function__number_______Window_null_____Object_null_____undefined$TIMEOUT)
};
goog.async.AnimationDelay.prototype.goog_async_AnimationDelay_prototype$stop = function() {
  if(this.isActive()) {
    var a = this.getRaf_(), b = this.getCancelRaf_();
    a && !b && this.win_.mozRequestAnimationFrame ? goog.events.unlistenByKey(this.goog_async_AnimationDelay_prototype$id_) : a && b ? b.call(this.win_, this.goog_async_AnimationDelay_prototype$id_) : this.win_.clearTimeout(this.goog_async_AnimationDelay_prototype$id_)
  }
  this.goog_async_AnimationDelay_prototype$id_ = null
};
goog.async.AnimationDelay.prototype.fire = function() {
  this.goog_async_AnimationDelay_prototype$stop();
  this.doAction_()
};
goog.async.AnimationDelay.prototype.fireIfActive = function() {
  this.isActive() && this.fire()
};
goog.async.AnimationDelay.prototype.isActive = function() {
  return null != this.goog_async_AnimationDelay_prototype$id_
};
goog.async.AnimationDelay.prototype.doAction_ = function() {
  this.usingListeners_ && this.goog_async_AnimationDelay_prototype$id_ && goog.events.unlistenByKey(this.goog_async_AnimationDelay_prototype$id_);
  this.goog_async_AnimationDelay_prototype$id_ = null;
  this.listener_.call(this.handler_, goog.now())
};
goog.async.AnimationDelay.prototype.goog_Disposable_prototype$disposeInternal = function() {
  this.goog_async_AnimationDelay_prototype$stop();
  goog.async.AnimationDelay.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
goog.async.AnimationDelay.prototype.getRaf_ = function() {
  var a = this.win_;
  return a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame || null
};
goog.async.AnimationDelay.prototype.getCancelRaf_ = function() {
  var a = this.win_;
  return a.cancelRequestAnimationFrame || a.webkitCancelRequestAnimationFrame || a.mozCancelRequestAnimationFrame || a.oCancelRequestAnimationFrame || a.msCancelRequestAnimationFrame || null
};
goog.async.nextTick = function(a, b) {
  var c = a;
  b && (c = goog.bind(a, b));
  c = goog.async.nextTick.wrapCallback_(c);
  goog.isFunction(goog.global.setImmediate) ? goog.global.setImmediate(c) : (goog.async.nextTick.setImmediate_ || (goog.async.nextTick.setImmediate_ = goog.async.nextTick.getSetImmediateEmulator_()), goog.async.nextTick.setImmediate_(c))
};
goog.async.nextTick.getSetImmediateEmulator_ = function() {
  var a = goog.global.MessageChannel;
  "undefined" === typeof a && ("undefined" !== typeof window && window.postMessage && window.addEventListener) && (a = function() {
    var a = document.createElement("iframe");
    a.style.display = "none";
    a.src = "";
    document.body.appendChild(a);
    var b = a.contentWindow, a = b.document;
    a.open();
    a.write("");
    a.close();
    var c = "callImmediate" + Math.random(), d = b.location.protocol + "//" + b.location.host, a = goog.bind(function(a) {
      if(a.origin == d || a.data == c) {
        this.port1.onmessage()
      }
    }, this);
    b.addEventListener("message", a, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      b.postMessage(c, d)
    }}
  });
  if("undefined" !== typeof a) {
    var b = new a, c = {}, d = c;
    b.port1.onmessage = function() {
      c = c.next;
      var a = c.cb;
      c.cb = null;
      a()
    };
    return function(a) {
      d.next = {cb:a};
      d = d.next;
      b.port2.postMessage(0)
    }
  }
  return"undefined" !== typeof document && "onreadystatechange" in document.createElement("script") ? function(a) {
    var b = document.createElement("script");
    b.onreadystatechange = function() {
      b.onreadystatechange = null;
      b.parentNode.removeChild(b);
      b = null;
      a();
      a = null
    };
    document.documentElement.appendChild(b)
  } : function(a) {
    goog.global.setTimeout(a, 0)
  }
};
goog.async.nextTick.wrapCallback_ = goog.functions.identity;
goog.structs.Collection = function() {
};
goog.structs.Set = function(a) {
  this.goog_structs_Set$map_ = new goog.structs.Map;
  a && this.goog_structs_Set_prototype$addAll(a)
};
goog.structs.Set.function__new_goog_structs_Set___Object_null_____undefined$getKey_ = function(a) {
  var b = typeof a;
  return"object" == b && a || "function" == b ? "o" + goog.getUid(a) : b.substr(0, 1) + a
};
goog.structs.Set.prototype.getCount = function() {
  return this.goog_structs_Set$map_.getCount()
};
goog.structs.Set.prototype.add = function(a) {
  this.goog_structs_Set$map_.set(goog.structs.Set.function__new_goog_structs_Set___Object_null_____undefined$getKey_(a), a)
};
goog.structs.Set.prototype.goog_structs_Set_prototype$addAll = function(a) {
  a = goog.structs.getValues(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.add(a[c])
  }
};
goog.structs.Set.prototype.removeAll = function(a) {
  a = goog.structs.getValues(a);
  for(var b = a.length, c = 0;c < b;c++) {
    this.remove(a[c])
  }
};
goog.structs.Set.prototype.remove = function(a) {
  return this.goog_structs_Set$map_.remove(goog.structs.Set.function__new_goog_structs_Set___Object_null_____undefined$getKey_(a))
};
goog.structs.Set.prototype.clear = function() {
  this.goog_structs_Set$map_.clear()
};
goog.structs.Set.prototype.isEmpty = function() {
  return this.goog_structs_Set$map_.isEmpty()
};
goog.structs.Set.prototype.contains = function(a) {
  return this.goog_structs_Set$map_.containsKey(goog.structs.Set.function__new_goog_structs_Set___Object_null_____undefined$getKey_(a))
};
goog.structs.Set.prototype.containsAll = function(a) {
  return goog.structs.every(a, this.contains, this)
};
goog.structs.Set.prototype.goog_structs_Set_prototype$intersection = function(a) {
  var b = new goog.structs.Set;
  a = goog.structs.getValues(a);
  for(var c = 0;c < a.length;c++) {
    var d = a[c];
    this.contains(d) && b.add(d)
  }
  return b
};
goog.structs.Set.prototype.goog_structs_Set_prototype$difference = function(a) {
  var b = this.clone();
  b.removeAll(a);
  return b
};
goog.structs.Set.prototype.getValues = function() {
  return this.goog_structs_Set$map_.getValues()
};
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this)
};
goog.structs.Set.prototype.equals = function(a) {
  return this.getCount() == goog.structs.getCount(a) && this.isSubsetOf(a)
};
goog.structs.Set.prototype.isSubsetOf = function(a) {
  var b = goog.structs.getCount(a);
  if(this.getCount() > b) {
    return!1
  }
  !(a instanceof goog.structs.Set) && 5 < b && (a = new goog.structs.Set(a));
  return goog.structs.every(this, function(b) {
    return goog.structs.contains(a, b)
  })
};
goog.structs.Set.prototype.__iterator__ = function(a) {
  return this.goog_structs_Set$map_.__iterator__(!1)
};
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a
};
goog.debug.fnNameCache_ = {};
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  goog.dom.classes.set(a, c.join(" "));
  return c.length == e
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  goog.dom.classes.set(a, e.join(" "));
  return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0;c < b.length;c++) {
    goog.array.contains(a, b[c]) || a.push(b[c])
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(b, a)
  })
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.function__new_goog_math_Coordinate__number___number____undefined$azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.function__new_goog_math_Coordinate__number___number____undefined$difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
  return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= c;
  return this
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= c;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !0;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      d = {};
      for(var e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    a = goog.dom.getViewportSize_(a).height;
    var c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["\x3c", c];
    d.name && c.push(' name\x3d"', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type\x3d"', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e
    }
    c.push("\x3e");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["\x3ctr\x3e"], f = 0;f < c;f++) {
    e.push(d ? "\x3ctd\x3e\x26nbsp;\x3c/td\x3e" : "\x3ctd\x3e\x3c/td\x3e")
  }
  e.push("\x3c/tr\x3e");
  e = e.join("");
  c = ["\x3ctable\x3e"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("\x3c/table\x3e");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "\x3cbr\x3e" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement)) {
    return a.parentElement
  }
  a = a.parentNode;
  return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if(a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(!c) {
    return null
  }
  if(1 == c) {
    return arguments[0]
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(String(b)))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for(var d = 0, e = null;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  if(!b && !c) {
    return null
  }
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  c = null == d;
  for(var e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.dom.ViewportSizeMonitor = function(a) {
  goog.events.EventTarget.call(this);
  this.window_ = a || window;
  this.listenerKey_ = goog.events.listen(this.window_, goog.events.EventType.RESIZE, this.handleResize_, !1, this);
  this.size_ = goog.dom.getViewportSize(this.window_)
};
goog.inherits(goog.dom.ViewportSizeMonitor, goog.events.EventTarget);
goog.dom.ViewportSizeMonitor.getInstanceForWindow = function(a) {
  a = a || window;
  var b = goog.getUid(a);
  return goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] = goog.dom.ViewportSizeMonitor.windowInstanceMap_[b] || new goog.dom.ViewportSizeMonitor(a)
};
goog.dom.ViewportSizeMonitor.removeInstanceForWindow = function(a) {
  a = goog.getUid(a || window);
  goog.dispose(goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]);
  delete goog.dom.ViewportSizeMonitor.windowInstanceMap_[a]
};
goog.dom.ViewportSizeMonitor.windowInstanceMap_ = {};
goog.dom.ViewportSizeMonitor.prototype.listenerKey_ = null;
goog.dom.ViewportSizeMonitor.prototype.window_ = null;
goog.dom.ViewportSizeMonitor.prototype.size_ = null;
goog.dom.ViewportSizeMonitor.prototype.getSize = function() {
  return this.size_ ? this.size_.clone() : null
};
goog.dom.ViewportSizeMonitor.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.dom.ViewportSizeMonitor.superClass_.goog_Disposable_prototype$disposeInternal.call(this);
  this.listenerKey_ && (goog.events.unlistenByKey(this.listenerKey_), this.listenerKey_ = null);
  this.size_ = this.window_ = null
};
goog.dom.ViewportSizeMonitor.prototype.handleResize_ = function(a) {
  a = goog.dom.getViewportSize(this.window_);
  goog.math.Size.equals(a, this.size_) || (this.size_ = a, this.dispatchEvent(goog.events.EventType.RESIZE))
};
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, 
N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, FIRST_MEDIA_KEY:166, LAST_MEDIA_KEY:183, 
SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, WIN_IME:229, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
  if(a.goog_events_BrowserEvent_prototype$altKey && !a.goog_events_BrowserEvent_prototype$ctrlKey || a.goog_events_BrowserEvent_prototype$metaKey || a.goog_events_BrowserEvent_prototype$keyCode >= goog.events.KeyCodes.F1 && a.goog_events_BrowserEvent_prototype$keyCode <= goog.events.KeyCodes.F12) {
    return!1
  }
  switch(a.goog_events_BrowserEvent_prototype$keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SCROLL_LOCK:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.WIN_KEY:
    ;
    case goog.events.KeyCodes.WIN_KEY_RIGHT:
      return!1;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return!goog.userAgent.GECKO;
    default:
      return a.goog_events_BrowserEvent_prototype$keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || a.goog_events_BrowserEvent_prototype$keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e) {
  if(!(goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525"))) {
    return!0
  }
  if(goog.userAgent.MAC && e) {
    return goog.events.KeyCodes.isCharacterKey(a)
  }
  if(e && !d || !c && (b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT || goog.userAgent.MAC && b == goog.events.KeyCodes.META)) {
    return!1
  }
  if(goog.userAgent.WEBKIT && d && c) {
    switch(a) {
      case goog.events.KeyCodes.BACKSLASH:
      ;
      case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      ;
      case goog.events.KeyCodes.TILDE:
      ;
      case goog.events.KeyCodes.SEMICOLON:
      ;
      case goog.events.KeyCodes.DASH:
      ;
      case goog.events.KeyCodes.EQUALS:
      ;
      case goog.events.KeyCodes.COMMA:
      ;
      case goog.events.KeyCodes.PERIOD:
      ;
      case goog.events.KeyCodes.SLASH:
      ;
      case goog.events.KeyCodes.APOSTROPHE:
      ;
      case goog.events.KeyCodes.SINGLE_QUOTE:
        return!1
    }
  }
  if(goog.userAgent.IE && d && b == a) {
    return!1
  }
  switch(a) {
    case goog.events.KeyCodes.ENTER:
      return!(goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9));
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT
  }
  return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
  if(a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE || a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY || a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z || goog.userAgent.WEBKIT && 0 == a) {
    return!0
  }
  switch(a) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.FF_SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.FF_EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return!0;
    default:
      return!1
  }
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(a) {
  switch(a) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return a
  }
};
goog.events.KeyHandler = function(a, b) {
  goog.events.EventTarget.call(this);
  a && this.attach(a, b)
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.goog_events_KeyHandler_prototype$element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.prototype.altKey_ = !1;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {Up:goog.events.KeyCodes.UP, Down:goog.events.KeyCodes.DOWN, Left:goog.events.KeyCodes.LEFT, Right:goog.events.KeyCodes.RIGHT, Enter:goog.events.KeyCodes.ENTER, F1:goog.events.KeyCodes.F1, F2:goog.events.KeyCodes.F2, F3:goog.events.KeyCodes.F3, F4:goog.events.KeyCodes.F4, F5:goog.events.KeyCodes.F5, F6:goog.events.KeyCodes.F6, F7:goog.events.KeyCodes.F7, F8:goog.events.KeyCodes.F8, F9:goog.events.KeyCodes.F9, F10:goog.events.KeyCodes.F10, F11:goog.events.KeyCodes.F11, 
F12:goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, Home:goog.events.KeyCodes.HOME, End:goog.events.KeyCodes.END, PageUp:goog.events.KeyCodes.PAGE_UP, PageDown:goog.events.KeyCodes.PAGE_DOWN, Insert:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(a) {
  goog.userAgent.WEBKIT && (this.lastKey_ == goog.events.KeyCodes.CTRL && !a.goog_events_BrowserEvent_prototype$ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !a.goog_events_BrowserEvent_prototype$altKey || goog.userAgent.MAC && this.lastKey_ == goog.events.KeyCodes.META && !a.goog_events_BrowserEvent_prototype$metaKey) && (this.keyCode_ = this.lastKey_ = -1);
  -1 == this.lastKey_ && (a.goog_events_BrowserEvent_prototype$ctrlKey && a.goog_events_BrowserEvent_prototype$keyCode != goog.events.KeyCodes.CTRL ? this.lastKey_ = goog.events.KeyCodes.CTRL : a.goog_events_BrowserEvent_prototype$altKey && a.goog_events_BrowserEvent_prototype$keyCode != goog.events.KeyCodes.ALT ? this.lastKey_ = goog.events.KeyCodes.ALT : a.goog_events_BrowserEvent_prototype$metaKey && a.goog_events_BrowserEvent_prototype$keyCode != goog.events.KeyCodes.META && (this.lastKey_ = 
  goog.events.KeyCodes.META));
  goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(a.goog_events_BrowserEvent_prototype$keyCode, this.lastKey_, a.goog_events_BrowserEvent_prototype$shiftKey, a.goog_events_BrowserEvent_prototype$ctrlKey, a.goog_events_BrowserEvent_prototype$altKey) ? this.handleEvent(a) : (this.keyCode_ = goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(a.goog_events_BrowserEvent_prototype$keyCode) : a.goog_events_BrowserEvent_prototype$keyCode, goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && 
  (this.altKey_ = a.goog_events_BrowserEvent_prototype$altKey))
};
goog.events.KeyHandler.prototype.resetState = function() {
  this.keyCode_ = this.lastKey_ = -1
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(a) {
  this.resetState();
  this.altKey_ = a.goog_events_BrowserEvent_prototype$altKey
};
goog.events.KeyHandler.prototype.handleEvent = function(a) {
  var b = a.getBrowserEvent(), c, d, e = b.altKey;
  goog.userAgent.IE && a.type == goog.events.EventType.KEYPRESS ? (c = this.keyCode_, d = c != goog.events.KeyCodes.ENTER && c != goog.events.KeyCodes.ESC ? b.keyCode : 0) : goog.userAgent.WEBKIT && a.type == goog.events.EventType.KEYPRESS ? (c = this.keyCode_, d = 0 <= b.charCode && 63232 > b.charCode && goog.events.KeyCodes.isCharacterKey(c) ? b.charCode : 0) : goog.userAgent.OPERA ? (c = this.keyCode_, d = goog.events.KeyCodes.isCharacterKey(c) ? b.keyCode : 0) : (c = b.keyCode || this.keyCode_, 
  d = b.charCode || 0, goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && (e = this.altKey_), goog.userAgent.MAC && (d == goog.events.KeyCodes.QUESTION_MARK && c == goog.events.KeyCodes.WIN_KEY) && (c = goog.events.KeyCodes.SLASH));
  var f = c, g = b.keyIdentifier;
  c ? 63232 <= c && c in goog.events.KeyHandler.safariKey_ ? f = goog.events.KeyHandler.safariKey_[c] : 25 == c && a.goog_events_BrowserEvent_prototype$shiftKey && (f = 9) : g && g in goog.events.KeyHandler.keyIdentifier_ && (f = goog.events.KeyHandler.keyIdentifier_[g]);
  a = f == this.lastKey_;
  this.lastKey_ = f;
  b = new goog.events.KeyEvent(f, d, a, b);
  b.goog_events_BrowserEvent_prototype$altKey = e;
  this.dispatchEvent(b)
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.goog_events_KeyHandler_prototype$element_
};
goog.events.KeyHandler.prototype.attach = function(a, b) {
  this.keyUpKey_ && this.goog_events_KeyHandler_prototype$detach();
  this.goog_events_KeyHandler_prototype$element_ = a;
  this.keyPressKey_ = goog.events.listen(this.goog_events_KeyHandler_prototype$element_, goog.events.EventType.KEYPRESS, this, b);
  this.keyDownKey_ = goog.events.listen(this.goog_events_KeyHandler_prototype$element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, b, this);
  this.keyUpKey_ = goog.events.listen(this.goog_events_KeyHandler_prototype$element_, goog.events.EventType.KEYUP, this.handleKeyup_, b, this)
};
goog.events.KeyHandler.prototype.goog_events_KeyHandler_prototype$detach = function() {
  this.keyPressKey_ && (goog.events.unlistenByKey(this.keyPressKey_), goog.events.unlistenByKey(this.keyDownKey_), goog.events.unlistenByKey(this.keyUpKey_), this.keyUpKey_ = this.keyDownKey_ = this.keyPressKey_ = null);
  this.goog_events_KeyHandler_prototype$element_ = null;
  this.keyCode_ = this.lastKey_ = -1
};
goog.events.KeyHandler.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.events.KeyHandler.superClass_.goog_Disposable_prototype$disposeInternal.call(this);
  this.goog_events_KeyHandler_prototype$detach()
};
goog.events.KeyEvent = function(a, b, c, d) {
  goog.events.BrowserEvent.call(this, d);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.goog_events_BrowserEvent_prototype$keyCode = a;
  this.goog_events_BrowserEvent_prototype$charCode = b;
  this.repeat = c
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d
};
goog.math.Box.boundingBox = function(a) {
  for(var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1;c < arguments.length;c++) {
    var d = arguments[c];
    b.top = Math.min(b.top, d.y);
    b.right = Math.max(b.right, d.x);
    b.bottom = Math.max(b.bottom, d.y);
    b.left = Math.min(b.left, d.x)
  }
  return b
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.goog_math_Box_prototype$expand = function(a, b, c, d) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
};
goog.math.Box.contains = function(a, b) {
  return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b), d = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this
};
goog.math.Box.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
  return this
};
goog.math.Box.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.right *= a;
  this.top *= c;
  this.bottom *= c;
  return this
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1
};
goog.math.Rect.prototype.goog_math_Rect_prototype$intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if(b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if(d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
  }
  return!1
};
goog.math.Rect.function__new_goog_math_Rect__number__number__number__number___undefined$intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if(c <= d) {
    var e = Math.max(a.top, b.top), f = Math.min(a.top + a.height, b.top + b.height);
    if(e <= f) {
      return new goog.math.Rect(c, e, d - c, f - e)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.function__new_goog_math_Rect__number__number__number__number___undefined$difference = function(a, b) {
  var c = goog.math.Rect.function__new_goog_math_Rect__number__number__number__number___undefined$intersection(a, b);
  if(!c || !c.height || !c.width) {
    return[a.clone()]
  }
  var c = [], d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, k = b.top + b.height;
  b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
  k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c
};
goog.math.Rect.prototype.goog_math_Rect_prototype$difference = function(a) {
  return goog.math.Rect.function__new_goog_math_Rect__number__number__number__number___undefined$difference(this, a)
};
goog.math.Rect.prototype.goog_math_Rect_prototype$boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top
};
goog.math.Rect.function__new_goog_math_Rect__number__number__number__number___undefined$boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var c = a.clone();
  c.goog_math_Rect_prototype$boundingRect(b);
  return c
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
  var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
  a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
  return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
  return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Rect.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
  return this
};
goog.math.Rect.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.width *= a;
  this.top *= c;
  this.height *= c;
  return this
};
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
  goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
  (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  if(void 0 === a.style[c]) {
    var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b);
    if(void 0 !== a.style[d]) {
      return d
    }
  }
  return c
};
goog.style.getVendorStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
  var c = a.style[goog.string.toCamelCase(b)];
  return"undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
  var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
  b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
  a.style.left = goog.style.getPixelStyleValue_(d, e);
  a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body;
  a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
  var b;
  try {
    b = a.getBoundingClientRect()
  }catch(c) {
    return{left:0, top:0, right:0, bottom:0}
  }
  goog.userAgent.IE && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return a.offsetParent
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c;
  for(a = a.parentNode;a && a != b;a = a.parentNode) {
    if(c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if(!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d || a == d || a == e || "visible" == goog.style.getStyle_(a, "overflow"))) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x)
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = goog.style.getPageOffset(a), e = goog.style.getPageOffset(b), f = goog.style.getBorderBox(b), g = d.x - e.x - f.left, d = d.y - e.y - f.top, e = b.clientWidth - a.offsetWidth;
  a = b.clientHeight - a.offsetHeight;
  f = b.scrollLeft;
  b = b.scrollTop;
  c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
  return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
    var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), b = b + c
    }
    return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var b, c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position"), e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY), f = new goog.math.Coordinate(0, 0), g = goog.style.getClientViewportElement(c);
  if(a == g) {
    return f
  }
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y
  }else {
    if(c.getBoxObjectFor && !e) {
      b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY
    }else {
      b = a;
      do {
        f.x += b.offsetLeft;
        f.y += b.offsetTop;
        b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
          f.x += c.body.scrollLeft;
          f.y += c.body.scrollTop;
          break
        }
        b = b.offsetParent
      }while(b && b != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) {
        f.y -= c.body.offsetTop
      }
      for(b = a;(b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) {
        f.x -= b.scrollLeft, goog.userAgent.OPERA && "TR" == b.tagName || (f.y -= b.scrollTop)
      }
    }
  }
  return f
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), e = a;
  do {
    var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(null);
    c.x += f.x;
    c.y += f.y
  }while(d && d != b && (e = d.frameElement) && (d = d.parent));
  return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if(b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.function__new_goog_math_Coordinate__number___number____undefined$difference(c, goog.style.getPageOffset(d));
    goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.function__new_goog_math_Coordinate__number___number____undefined$difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var c = goog.style.getClientPosition(a), d = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
  var b;
  if(goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) {
    b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top)
  }else {
    b = goog.dom.getDomHelper(a).getDocumentScroll();
    var c = goog.style.getPageOffset(a);
    b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
  }
  return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(a)
  }
  var b = goog.isFunction(a.getBrowserEvent), c = a;
  a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
  return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
  if(b instanceof goog.math.Size) {
    c = b.height, b = b.width
  }else {
    if(void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a)
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
  if("none" != goog.style.getStyle_(b, "display")) {
    return a(b)
  }
  var c = b.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  var g = a(b);
  c.display = d;
  c.position = f;
  c.visibility = e;
  return g
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top))
};
goog.style.getTransformedSize = function(a) {
  if(!a.getBoundingClientRect) {
    return null
  }
  a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
  return new goog.math.Size(a.right - a.left, a.bottom - a.top)
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var b = a.style;
  a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
  var c = a.style;
  "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity\x3d" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  var c = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src\x3d"' + b + '", sizingMethod\x3d"crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
  goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
  a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, b) {
  var c = goog.dom.getDomHelper(b), d = null;
  if(goog.userAgent.IE) {
    d = c.getDocument().createStyleSheet(), goog.style.setStyles(d, a)
  }else {
    var e = c.getElementsByTagNameAndClass("head")[0];
    e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d));
    d = c.createDom("style");
    goog.style.setStyles(d, a);
    c.appendChild(e, d)
  }
  return d
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
  goog.userAgent.IE ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
  c = c ? null : a.getElementsByTagName("*");
  var d = goog.style.unselectableStyle_;
  if(d) {
    if(b = b ? "none" : "", a.style[d] = b, c) {
      a = 0;
      for(var e;e = c[a];a++) {
        e.style[d] = b
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for(a = 0;e = c[a];a++) {
          e.setAttribute("unselectable", b)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(a, b, "border-box")
  }else {
    if(c = a.style, d) {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
      c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    }else {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }
  }
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if(c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a)
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  if(!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) {
    goog.style.setBoxSizingSize_(a, b, "content-box")
  }else {
    if(c = a.style, d) {
      c.pixelWidth = b.width, c.pixelHeight = b.height
    }else {
      var d = goog.style.getPaddingBox(a), e = goog.style.getBorderBox(a);
      c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
      c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
  }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if(/^\d+px?$/.test(b)) {
    return parseInt(b, 10)
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return b
};
goog.style.getIePixelDistance_ = function(a, b) {
  var c = goog.style.getCascadedStyle(a, b);
  return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top"), f = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, f, c)
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  f = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f), parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0
  }
  var c = goog.style.getCascadedStyle(a, b + "Width");
  return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b)
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if(b.body.createTextRange) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName")
    }catch(d) {
      c = ""
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if(b && "px" == c) {
    return parseInt(b, 10)
  }
  if(goog.userAgent.IE) {
    if(c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
  }
  c = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return b
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";")
  });
  return b.join("")
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("div");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  var b;
  goog.userAgent.IE ? b = "-ms-transform" : goog.userAgent.WEBKIT ? b = "-webkit-transform" : goog.userAgent.OPERA ? b = "-o-transform" : goog.userAgent.GECKO && (b = "-moz-transform");
  var c;
  b && (c = goog.style.getStyle_(a, b));
  c || (c = goog.style.getStyle_(a, "transform"));
  return c ? (a = c.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0)
};
goog.events.MouseWheelHandler = function(a, b) {
  goog.events.EventTarget.call(this);
  this.goog_events_MouseWheelHandler$element_ = a;
  var c = goog.dom.isElement(this.goog_events_MouseWheelHandler$element_) ? this.goog_events_MouseWheelHandler$element_ : this.goog_events_MouseWheelHandler$element_ ? this.goog_events_MouseWheelHandler$element_.body : null;
  this.isRtl_ = !!c && goog.style.isRightToLeft(c);
  this.listenKey_ = goog.events.listen(this.goog_events_MouseWheelHandler$element_, goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", this, b)
};
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);
goog.events.MouseWheelHandler.EventType = {MOUSEWHEEL:"mousewheel"};
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(a) {
  this.maxDeltaX_ = a
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(a) {
  this.maxDeltaY_ = a
};
goog.events.MouseWheelHandler.prototype.handleEvent = function(a) {
  var b = 0, c = 0, d = 0;
  a = a.getBrowserEvent();
  if("mousewheel" == a.type) {
    c = 1;
    if(goog.userAgent.IE || goog.userAgent.WEBKIT && (goog.userAgent.WINDOWS || goog.userAgent.isVersionOrHigher("532.0"))) {
      c = 40
    }
    d = goog.events.MouseWheelHandler.smartScale_(-a.wheelDelta, c);
    goog.isDef(a.wheelDeltaX) ? (b = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaX, c), c = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaY, c)) : c = d
  }else {
    d = a.detail, 100 < d ? d = 3 : -100 > d && (d = -3), goog.isDef(a.axis) && a.axis === a.HORIZONTAL_AXIS ? b = d : c = d
  }
  goog.isNumber(this.maxDeltaX_) && (b = goog.math.clamp(b, -this.maxDeltaX_, this.maxDeltaX_));
  goog.isNumber(this.maxDeltaY_) && (c = goog.math.clamp(c, -this.maxDeltaY_, this.maxDeltaY_));
  this.isRtl_ && (b = -b);
  b = new goog.events.MouseWheelEvent(d, a, b, c);
  this.dispatchEvent(b)
};
goog.events.MouseWheelHandler.smartScale_ = function(a, b) {
  return goog.userAgent.WEBKIT && (goog.userAgent.MAC || goog.userAgent.LINUX) && 0 != a % b ? a : a / b
};
goog.events.MouseWheelHandler.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.events.MouseWheelHandler.superClass_.goog_Disposable_prototype$disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  this.listenKey_ = null
};
goog.events.MouseWheelEvent = function(a, b, c, d) {
  goog.events.BrowserEvent.call(this, b);
  this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;
  this.goog_events_MouseWheelEvent$detail = a;
  this.goog_events_MouseWheelEvent$deltaX = c;
  this.goog_events_MouseWheelEvent$deltaY = d
};
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
goog.vec = {};
goog.vec.Float32Array = function(a) {
  this.length = a.length || a;
  for(var b = 0;b < this.length;b++) {
    this[b] = a[b] || 0
  }
};
goog.vec.Float32Array.function__new_goog_vec_Float32Array___Array_ArrayBuffer_goog_vec_Float32Array_null_number____undefined$BYTES_PER_ELEMENT = 4;
goog.vec.Float32Array.prototype.goog_vec_Float32Array_prototype$BYTES_PER_ELEMENT = 4;
goog.vec.Float32Array.prototype.set = function(a, b) {
  b = b || 0;
  for(var c = 0;c < a.length && b + c < this.length;c++) {
    this[b + c] = a[c]
  }
};
goog.vec.Float32Array.prototype.toString = Array.prototype.join;
"undefined" == typeof Float32Array && (goog.exportProperty(goog.vec.Float32Array, "BYTES_PER_ELEMENT", goog.vec.Float32Array.function__new_goog_vec_Float32Array___Array_ArrayBuffer_goog_vec_Float32Array_null_number____undefined$BYTES_PER_ELEMENT), goog.exportProperty(goog.vec.Float32Array.prototype, "BYTES_PER_ELEMENT", goog.vec.Float32Array.prototype.goog_vec_Float32Array_prototype$BYTES_PER_ELEMENT), goog.exportProperty(goog.vec.Float32Array.prototype, "set", goog.vec.Float32Array.prototype.set), 
goog.exportProperty(goog.vec.Float32Array.prototype, "toString", goog.vec.Float32Array.prototype.toString), goog.exportSymbol("Float32Array", goog.vec.Float32Array));
goog.vec.Float64Array = function(a) {
  this.length = a.length || a;
  for(var b = 0;b < this.length;b++) {
    this[b] = a[b] || 0
  }
};
goog.vec.Float64Array.function__new_goog_vec_Float64Array___Array_ArrayBuffer_goog_vec_Float64Array_null_number____undefined$BYTES_PER_ELEMENT = 8;
goog.vec.Float64Array.prototype.goog_vec_Float64Array_prototype$BYTES_PER_ELEMENT = 8;
goog.vec.Float64Array.prototype.set = function(a, b) {
  b = b || 0;
  for(var c = 0;c < a.length && b + c < this.length;c++) {
    this[b + c] = a[c]
  }
};
goog.vec.Float64Array.prototype.toString = Array.prototype.join;
if("undefined" == typeof Float64Array) {
  try {
    goog.exportProperty(goog.vec.Float64Array, "BYTES_PER_ELEMENT", goog.vec.Float64Array.function__new_goog_vec_Float64Array___Array_ArrayBuffer_goog_vec_Float64Array_null_number____undefined$BYTES_PER_ELEMENT)
  }catch(float64ArrayError) {
  }
  goog.exportProperty(goog.vec.Float64Array.prototype, "BYTES_PER_ELEMENT", goog.vec.Float64Array.prototype.goog_vec_Float64Array_prototype$BYTES_PER_ELEMENT);
  goog.exportProperty(goog.vec.Float64Array.prototype, "set", goog.vec.Float64Array.prototype.set);
  goog.exportProperty(goog.vec.Float64Array.prototype, "toString", goog.vec.Float64Array.prototype.toString);
  goog.exportSymbol("Float64Array", goog.vec.Float64Array)
}
;goog.vec.EPSILON = 1E-6;
goog.vec.Vec3 = {};
goog.vec.Vec3.createFloat32 = function() {
  return new Float32Array(3)
};
goog.vec.Vec3.createFloat64 = function() {
  return new Float64Array(3)
};
goog.vec.Vec3.createNumber = function() {
  var a = Array(3);
  goog.vec.Vec3.setFromValues(a, 0, 0, 0);
  return a
};
goog.vec.Vec3.create = function() {
  return new Float32Array(3)
};
goog.vec.Vec3.createFloat32FromArray = function(a) {
  var b = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromArray(b, a);
  return b
};
goog.vec.Vec3.createFloat32FromValues = function(a, b, c) {
  var d = goog.vec.Vec3.createFloat32();
  goog.vec.Vec3.setFromValues(d, a, b, c);
  return d
};
goog.vec.Vec3.cloneFloat32 = goog.vec.Vec3.createFloat32FromArray;
goog.vec.Vec3.createFloat64FromArray = function(a) {
  var b = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromArray(b, a);
  return b
};
goog.vec.Vec3.createFloat64FromValues = function(a, b, c) {
  var d = goog.vec.Vec3.createFloat64();
  goog.vec.Vec3.setFromValues(d, a, b, c);
  return d
};
goog.vec.Vec3.cloneFloat64 = goog.vec.Vec3.createFloat64FromArray;
goog.vec.Vec3.createFromArray = function(a) {
  var b = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(b, a);
  return b
};
goog.vec.Vec3.createFromValues = function(a, b, c) {
  var d = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromValues(d, a, b, c);
  return d
};
goog.vec.Vec3.clone = function(a) {
  var b = goog.vec.Vec3.create();
  goog.vec.Vec3.setFromArray(b, a);
  return b
};
goog.vec.Vec3.setFromValues = function(a, b, c, d) {
  a[0] = b;
  a[1] = c;
  a[2] = d;
  return a
};
goog.vec.Vec3.setFromArray = function(a, b) {
  a[0] = b[0];
  a[1] = b[1];
  a[2] = b[2];
  return a
};
goog.vec.Vec3.add = function(a, b, c) {
  c[0] = a[0] + b[0];
  c[1] = a[1] + b[1];
  c[2] = a[2] + b[2];
  return c
};
goog.vec.Vec3.subtract = function(a, b, c) {
  c[0] = a[0] - b[0];
  c[1] = a[1] - b[1];
  c[2] = a[2] - b[2];
  return c
};
goog.vec.Vec3.negate = function(a, b) {
  b[0] = -a[0];
  b[1] = -a[1];
  b[2] = -a[2];
  return b
};
goog.vec.Vec3.scale = function(a, b, c) {
  c[0] = a[0] * b;
  c[1] = a[1] * b;
  c[2] = a[2] * b;
  return c
};
goog.vec.Vec3.magnitudeSquared = function(a) {
  var b = a[0], c = a[1];
  a = a[2];
  return b * b + c * c + a * a
};
goog.vec.Vec3.magnitude = function(a) {
  var b = a[0], c = a[1];
  a = a[2];
  return Math.sqrt(b * b + c * c + a * a)
};
goog.vec.Vec3.normalize = function(a, b) {
  var c = 1 / goog.vec.Vec3.magnitude(a);
  b[0] = a[0] * c;
  b[1] = a[1] * c;
  b[2] = a[2] * c;
  return b
};
goog.vec.Vec3.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
};
goog.vec.Vec3.cross = function(a, b, c) {
  var d = a[0], e = a[1];
  a = a[2];
  var f = b[0], g = b[1];
  b = b[2];
  c[0] = e * b - a * g;
  c[1] = a * f - d * b;
  c[2] = d * g - e * f;
  return c
};
goog.vec.Vec3.distanceSquared = function(a, b) {
  var c = a[0] - b[0], d = a[1] - b[1], e = a[2] - b[2];
  return c * c + d * d + e * e
};
goog.vec.Vec3.distance = function(a, b) {
  return Math.sqrt(goog.vec.Vec3.distanceSquared(a, b))
};
goog.vec.Vec3.direction = function(a, b, c) {
  var d = b[0] - a[0], e = b[1] - a[1];
  a = b[2] - a[2];
  (b = Math.sqrt(d * d + e * e + a * a)) ? (b = 1 / b, c[0] = d * b, c[1] = e * b, c[2] = a * b) : c[0] = c[1] = c[2] = 0;
  return c
};
goog.vec.Vec3.lerp = function(a, b, c, d) {
  var e = a[0], f = a[1];
  a = a[2];
  d[0] = (b[0] - e) * c + e;
  d[1] = (b[1] - f) * c + f;
  d[2] = (b[2] - a) * c + a;
  return d
};
goog.vec.Vec3.equals = function(a, b) {
  return a.length == b.length && a[0] == b[0] && a[1] == b[1] && a[2] == b[2]
};
goog.vec.Vec4 = {};
goog.vec.Vec4.createFloat32 = function() {
  return new Float32Array(4)
};
goog.vec.Vec4.createFloat64 = function() {
  return new Float64Array(4)
};
goog.vec.Vec4.createNumber = function() {
  var a = Array(4);
  goog.vec.Vec4.setFromValues(a, 0, 0, 0, 0);
  return a
};
goog.vec.Vec4.create = function() {
  return new Float32Array(4)
};
goog.vec.Vec4.createFromArray = function(a) {
  var b = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromArray(b, a);
  return b
};
goog.vec.Vec4.createFloat32FromArray = function(a) {
  var b = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromArray(b, a);
  return b
};
goog.vec.Vec4.createFloat32FromValues = function(a, b, c, d) {
  var e = goog.vec.Vec4.createFloat32();
  goog.vec.Vec4.setFromValues(e, a, b, c, d);
  return e
};
goog.vec.Vec4.cloneFloat32 = goog.vec.Vec4.createFloat32FromArray;
goog.vec.Vec4.createFloat64FromArray = function(a) {
  var b = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromArray(b, a);
  return b
};
goog.vec.Vec4.createFloat64FromValues = function(a, b, c, d) {
  var e = goog.vec.Vec4.createFloat64();
  goog.vec.Vec4.setFromValues(e, a, b, c, d);
  return e
};
goog.vec.Vec4.cloneFloat64 = goog.vec.Vec4.createFloat64FromArray;
goog.vec.Vec4.createFromValues = function(a, b, c, d) {
  var e = goog.vec.Vec4.create();
  goog.vec.Vec4.setFromValues(e, a, b, c, d);
  return e
};
goog.vec.Vec4.clone = goog.vec.Vec4.createFromArray;
goog.vec.Vec4.setFromValues = function(a, b, c, d, e) {
  a[0] = b;
  a[1] = c;
  a[2] = d;
  a[3] = e;
  return a
};
goog.vec.Vec4.setFromArray = function(a, b) {
  a[0] = b[0];
  a[1] = b[1];
  a[2] = b[2];
  a[3] = b[3];
  return a
};
goog.vec.Vec4.add = function(a, b, c) {
  c[0] = a[0] + b[0];
  c[1] = a[1] + b[1];
  c[2] = a[2] + b[2];
  c[3] = a[3] + b[3];
  return c
};
goog.vec.Vec4.subtract = function(a, b, c) {
  c[0] = a[0] - b[0];
  c[1] = a[1] - b[1];
  c[2] = a[2] - b[2];
  c[3] = a[3] - b[3];
  return c
};
goog.vec.Vec4.negate = function(a, b) {
  b[0] = -a[0];
  b[1] = -a[1];
  b[2] = -a[2];
  b[3] = -a[3];
  return b
};
goog.vec.Vec4.scale = function(a, b, c) {
  c[0] = a[0] * b;
  c[1] = a[1] * b;
  c[2] = a[2] * b;
  c[3] = a[3] * b;
  return c
};
goog.vec.Vec4.magnitudeSquared = function(a) {
  var b = a[0], c = a[1], d = a[2];
  a = a[3];
  return b * b + c * c + d * d + a * a
};
goog.vec.Vec4.magnitude = function(a) {
  var b = a[0], c = a[1], d = a[2];
  a = a[3];
  return Math.sqrt(b * b + c * c + d * d + a * a)
};
goog.vec.Vec4.normalize = function(a, b) {
  var c = 1 / goog.vec.Vec4.magnitude(a);
  b[0] = a[0] * c;
  b[1] = a[1] * c;
  b[2] = a[2] * c;
  b[3] = a[3] * c;
  return b
};
goog.vec.Vec4.dot = function(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
};
goog.vec.Vec4.lerp = function(a, b, c, d) {
  var e = a[0], f = a[1], g = a[2];
  a = a[3];
  d[0] = (b[0] - e) * c + e;
  d[1] = (b[1] - f) * c + f;
  d[2] = (b[2] - g) * c + g;
  d[3] = (b[3] - a) * c + a;
  return d
};
goog.vec.Vec4.equals = function(a, b) {
  return a.length == b.length && a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3]
};
goog.vec.Mat4 = {};
goog.vec.Mat4.createFloat32 = function() {
  return new Float32Array(16)
};
goog.vec.Mat4.createFloat64 = function() {
  return new Float64Array(16)
};
goog.vec.Mat4.createNumber = function() {
  var a = Array(16);
  goog.vec.Mat4.setFromValues(a, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  return a
};
goog.vec.Mat4.create = function() {
  return goog.vec.Mat4.createFloat32()
};
goog.vec.Mat4.createFloat32Identity = function() {
  var a = goog.vec.Mat4.createFloat32();
  a[0] = a[5] = a[10] = a[15] = 1;
  return a
};
goog.vec.Mat4.createFloat64Identity = function() {
  var a = goog.vec.Mat4.createFloat64();
  a[0] = a[5] = a[10] = a[15] = 1;
  return a
};
goog.vec.Mat4.createNumberIdentity = function() {
  var a = Array(16);
  goog.vec.Mat4.setFromValues(a, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  return a
};
goog.vec.Mat4.createIdentity = function() {
  return goog.vec.Mat4.createFloat32Identity()
};
goog.vec.Mat4.createFloat32FromArray = function(a) {
  var b = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromArray(b, a);
  return b
};
goog.vec.Mat4.createFloat32FromValues = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x) {
  var s = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromValues(s, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x);
  return s
};
goog.vec.Mat4.cloneFloat32 = goog.vec.Mat4.createFloat32FromArray;
goog.vec.Mat4.createFloat64FromArray = function(a) {
  var b = goog.vec.Mat4.createFloat64();
  goog.vec.Mat4.setFromArray(b, a);
  return b
};
goog.vec.Mat4.createFloat64FromValues = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x) {
  var s = goog.vec.Mat4.createFloat64();
  goog.vec.Mat4.setFromValues(s, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x);
  return s
};
goog.vec.Mat4.cloneFloat64 = goog.vec.Mat4.createFloat64FromArray;
goog.vec.Mat4.createFromArray = function(a) {
  var b = goog.vec.Mat4.createFloat32();
  goog.vec.Mat4.setFromArray(b, a);
  return b
};
goog.vec.Mat4.createFromValues = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x) {
  return goog.vec.Mat4.createFloat32FromValues(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x)
};
goog.vec.Mat4.clone = goog.vec.Mat4.createFromArray;
goog.vec.Mat4.getElement = function(a, b, c) {
  return a[b + 4 * c]
};
goog.vec.Mat4.setElement = function(a, b, c, d) {
  a[b + 4 * c] = d;
  return a
};
goog.vec.Mat4.setFromValues = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, x, s) {
  a[0] = b;
  a[1] = c;
  a[2] = d;
  a[3] = e;
  a[4] = f;
  a[5] = g;
  a[6] = h;
  a[7] = k;
  a[8] = l;
  a[9] = m;
  a[10] = n;
  a[11] = p;
  a[12] = q;
  a[13] = r;
  a[14] = x;
  a[15] = s;
  return a
};
goog.vec.Mat4.setFromArray = function(a, b) {
  a[0] = b[0];
  a[1] = b[1];
  a[2] = b[2];
  a[3] = b[3];
  a[4] = b[4];
  a[5] = b[5];
  a[6] = b[6];
  a[7] = b[7];
  a[8] = b[8];
  a[9] = b[9];
  a[10] = b[10];
  a[11] = b[11];
  a[12] = b[12];
  a[13] = b[13];
  a[14] = b[14];
  a[15] = b[15];
  return a
};
goog.vec.Mat4.setFromRowMajorArray = function(a, b) {
  a[0] = b[0];
  a[1] = b[4];
  a[2] = b[8];
  a[3] = b[12];
  a[4] = b[1];
  a[5] = b[5];
  a[6] = b[9];
  a[7] = b[13];
  a[8] = b[2];
  a[9] = b[6];
  a[10] = b[10];
  a[11] = b[14];
  a[12] = b[3];
  a[13] = b[7];
  a[14] = b[11];
  a[15] = b[15];
  return a
};
goog.vec.Mat4.setDiagonalValues = function(a, b, c, d, e) {
  a[0] = b;
  a[5] = c;
  a[10] = d;
  a[15] = e;
  return a
};
goog.vec.Mat4.setDiagonal = function(a, b) {
  a[0] = b[0];
  a[5] = b[1];
  a[10] = b[2];
  a[15] = b[3];
  return a
};
goog.vec.Mat4.getDiagonal = function(a, b, c) {
  if(c) {
    for(var d = 0 < c ? 4 * c : -c, e = 0;e < 4 - Math.abs(c);e++) {
      b[e] = a[d + 5 * e]
    }
  }else {
    b[0] = a[0], b[1] = a[5], b[2] = a[10], b[3] = a[15]
  }
  return b
};
goog.vec.Mat4.setColumnValues = function(a, b, c, d, e, f) {
  b *= 4;
  a[b] = c;
  a[b + 1] = d;
  a[b + 2] = e;
  a[b + 3] = f;
  return a
};
goog.vec.Mat4.setColumn = function(a, b, c) {
  b *= 4;
  a[b] = c[0];
  a[b + 1] = c[1];
  a[b + 2] = c[2];
  a[b + 3] = c[3];
  return a
};
goog.vec.Mat4.getColumn = function(a, b, c) {
  b *= 4;
  c[0] = a[b];
  c[1] = a[b + 1];
  c[2] = a[b + 2];
  c[3] = a[b + 3];
  return c
};
goog.vec.Mat4.setColumns = function(a, b, c, d, e) {
  goog.vec.Mat4.setColumn(a, 0, b);
  goog.vec.Mat4.setColumn(a, 1, c);
  goog.vec.Mat4.setColumn(a, 2, d);
  goog.vec.Mat4.setColumn(a, 3, e);
  return a
};
goog.vec.Mat4.getColumns = function(a, b, c, d, e) {
  goog.vec.Mat4.getColumn(a, 0, b);
  goog.vec.Mat4.getColumn(a, 1, c);
  goog.vec.Mat4.getColumn(a, 2, d);
  goog.vec.Mat4.getColumn(a, 3, e)
};
goog.vec.Mat4.setRowValues = function(a, b, c, d, e, f) {
  a[b] = c;
  a[b + 4] = d;
  a[b + 8] = e;
  a[b + 12] = f;
  return a
};
goog.vec.Mat4.setRow = function(a, b, c) {
  a[b] = c[0];
  a[b + 4] = c[1];
  a[b + 8] = c[2];
  a[b + 12] = c[3];
  return a
};
goog.vec.Mat4.getRow = function(a, b, c) {
  c[0] = a[b];
  c[1] = a[b + 4];
  c[2] = a[b + 8];
  c[3] = a[b + 12];
  return c
};
goog.vec.Mat4.setRows = function(a, b, c, d, e) {
  goog.vec.Mat4.setRow(a, 0, b);
  goog.vec.Mat4.setRow(a, 1, c);
  goog.vec.Mat4.setRow(a, 2, d);
  goog.vec.Mat4.setRow(a, 3, e);
  return a
};
goog.vec.Mat4.getRows = function(a, b, c, d, e) {
  goog.vec.Mat4.getRow(a, 0, b);
  goog.vec.Mat4.getRow(a, 1, c);
  goog.vec.Mat4.getRow(a, 2, d);
  goog.vec.Mat4.getRow(a, 3, e)
};
goog.vec.Mat4.makeZero = function(a) {
  a[0] = 0;
  a[1] = 0;
  a[2] = 0;
  a[3] = 0;
  a[4] = 0;
  a[5] = 0;
  a[6] = 0;
  a[7] = 0;
  a[8] = 0;
  a[9] = 0;
  a[10] = 0;
  a[11] = 0;
  a[12] = 0;
  a[13] = 0;
  a[14] = 0;
  a[15] = 0;
  return a
};
goog.vec.Mat4.makeIdentity = function(a) {
  a[0] = 1;
  a[1] = 0;
  a[2] = 0;
  a[3] = 0;
  a[4] = 0;
  a[5] = 1;
  a[6] = 0;
  a[7] = 0;
  a[8] = 0;
  a[9] = 0;
  a[10] = 1;
  a[11] = 0;
  a[12] = 0;
  a[13] = 0;
  a[14] = 0;
  a[15] = 1;
  return a
};
goog.vec.Mat4.addMat = function(a, b, c) {
  c[0] = a[0] + b[0];
  c[1] = a[1] + b[1];
  c[2] = a[2] + b[2];
  c[3] = a[3] + b[3];
  c[4] = a[4] + b[4];
  c[5] = a[5] + b[5];
  c[6] = a[6] + b[6];
  c[7] = a[7] + b[7];
  c[8] = a[8] + b[8];
  c[9] = a[9] + b[9];
  c[10] = a[10] + b[10];
  c[11] = a[11] + b[11];
  c[12] = a[12] + b[12];
  c[13] = a[13] + b[13];
  c[14] = a[14] + b[14];
  c[15] = a[15] + b[15];
  return c
};
goog.vec.Mat4.subMat = function(a, b, c) {
  c[0] = a[0] - b[0];
  c[1] = a[1] - b[1];
  c[2] = a[2] - b[2];
  c[3] = a[3] - b[3];
  c[4] = a[4] - b[4];
  c[5] = a[5] - b[5];
  c[6] = a[6] - b[6];
  c[7] = a[7] - b[7];
  c[8] = a[8] - b[8];
  c[9] = a[9] - b[9];
  c[10] = a[10] - b[10];
  c[11] = a[11] - b[11];
  c[12] = a[12] - b[12];
  c[13] = a[13] - b[13];
  c[14] = a[14] - b[14];
  c[15] = a[15] - b[15];
  return c
};
goog.vec.Mat4.multScalar = function(a, b, c) {
  c[0] = a[0] * b;
  c[1] = a[1] * b;
  c[2] = a[2] * b;
  c[3] = a[3] * b;
  c[4] = a[4] * b;
  c[5] = a[5] * b;
  c[6] = a[6] * b;
  c[7] = a[7] * b;
  c[8] = a[8] * b;
  c[9] = a[9] * b;
  c[10] = a[10] * b;
  c[11] = a[11] * b;
  c[12] = a[12] * b;
  c[13] = a[13] * b;
  c[14] = a[14] * b;
  c[15] = a[15] * b;
  return c
};
goog.vec.Mat4.multMat = function(a, b, c) {
  var d = a[0], e = a[1], f = a[2], g = a[3], h = a[4], k = a[5], l = a[6], m = a[7], n = a[8], p = a[9], q = a[10], r = a[11], x = a[12], s = a[13], t = a[14];
  a = a[15];
  var v = b[0], y = b[1], w = b[2], u = b[3], A = b[4], D = b[5], C = b[6], G = b[7], F = b[8], z = b[9], B = b[10], H = b[11], E = b[12], J = b[13], I = b[14];
  b = b[15];
  c[0] = d * v + h * y + n * w + x * u;
  c[1] = e * v + k * y + p * w + s * u;
  c[2] = f * v + l * y + q * w + t * u;
  c[3] = g * v + m * y + r * w + a * u;
  c[4] = d * A + h * D + n * C + x * G;
  c[5] = e * A + k * D + p * C + s * G;
  c[6] = f * A + l * D + q * C + t * G;
  c[7] = g * A + m * D + r * C + a * G;
  c[8] = d * F + h * z + n * B + x * H;
  c[9] = e * F + k * z + p * B + s * H;
  c[10] = f * F + l * z + q * B + t * H;
  c[11] = g * F + m * z + r * B + a * H;
  c[12] = d * E + h * J + n * I + x * b;
  c[13] = e * E + k * J + p * I + s * b;
  c[14] = f * E + l * J + q * I + t * b;
  c[15] = g * E + m * J + r * I + a * b;
  return c
};
goog.vec.Mat4.transpose = function(a, b) {
  if(b == a) {
    var c = a[1], d = a[2], e = a[3], f = a[6], g = a[7], h = a[11];
    b[1] = a[4];
    b[2] = a[8];
    b[3] = a[12];
    b[4] = c;
    b[6] = a[9];
    b[7] = a[13];
    b[8] = d;
    b[9] = f;
    b[11] = a[14];
    b[12] = e;
    b[13] = g;
    b[14] = h
  }else {
    b[0] = a[0], b[1] = a[4], b[2] = a[8], b[3] = a[12], b[4] = a[1], b[5] = a[5], b[6] = a[9], b[7] = a[13], b[8] = a[2], b[9] = a[6], b[10] = a[10], b[11] = a[14], b[12] = a[3], b[13] = a[7], b[14] = a[11], b[15] = a[15]
  }
  return b
};
goog.vec.Mat4.determinant = function(a) {
  var b = a[0], c = a[1], d = a[2], e = a[3], f = a[4], g = a[5], h = a[6], k = a[7], l = a[8], m = a[9], n = a[10], p = a[11], q = a[12], r = a[13], x = a[14];
  a = a[15];
  return(b * g - c * f) * (n * a - p * x) - (b * h - d * f) * (m * a - p * r) + (b * k - e * f) * (m * x - n * r) + (c * h - d * g) * (l * a - p * q) - (c * k - e * g) * (l * x - n * q) + (d * k - e * h) * (l * r - m * q)
};
goog.vec.Mat4.invert = function(a, b) {
  var c = a[0], d = a[1], e = a[2], f = a[3], g = a[4], h = a[5], k = a[6], l = a[7], m = a[8], n = a[9], p = a[10], q = a[11], r = a[12], x = a[13], s = a[14], t = a[15], v = c * h - d * g, y = c * k - e * g, w = c * l - f * g, u = d * k - e * h, A = d * l - f * h, D = e * l - f * k, C = m * x - n * r, G = m * s - p * r, F = m * t - q * r, z = n * s - p * x, B = n * t - q * x, H = p * t - q * s, E = v * H - y * B + w * z + u * F - A * G + D * C;
  if(0 == E) {
    return!1
  }
  E = 1 / E;
  b[0] = (h * H - k * B + l * z) * E;
  b[1] = (-d * H + e * B - f * z) * E;
  b[2] = (x * D - s * A + t * u) * E;
  b[3] = (-n * D + p * A - q * u) * E;
  b[4] = (-g * H + k * F - l * G) * E;
  b[5] = (c * H - e * F + f * G) * E;
  b[6] = (-r * D + s * w - t * y) * E;
  b[7] = (m * D - p * w + q * y) * E;
  b[8] = (g * B - h * F + l * C) * E;
  b[9] = (-c * B + d * F - f * C) * E;
  b[10] = (r * A - x * w + t * v) * E;
  b[11] = (-m * A + n * w - q * v) * E;
  b[12] = (-g * z + h * G - k * C) * E;
  b[13] = (c * z - d * G + e * C) * E;
  b[14] = (-r * u + x * y - s * v) * E;
  b[15] = (m * u - n * y + p * v) * E;
  return!0
};
goog.vec.Mat4.equals = function(a, b) {
  return a.length == b.length && a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3] && a[4] == b[4] && a[5] == b[5] && a[6] == b[6] && a[7] == b[7] && a[8] == b[8] && a[9] == b[9] && a[10] == b[10] && a[11] == b[11] && a[12] == b[12] && a[13] == b[13] && a[14] == b[14] && a[15] == b[15]
};
goog.vec.Mat4.multVec3 = function(a, b, c) {
  var d = b[0], e = b[1];
  b = b[2];
  c[0] = d * a[0] + e * a[4] + b * a[8] + a[12];
  c[1] = d * a[1] + e * a[5] + b * a[9] + a[13];
  c[2] = d * a[2] + e * a[6] + b * a[10] + a[14];
  return c
};
goog.vec.Mat4.multVec3NoTranslate = function(a, b, c) {
  var d = b[0], e = b[1];
  b = b[2];
  c[0] = d * a[0] + e * a[4] + b * a[8];
  c[1] = d * a[1] + e * a[5] + b * a[9];
  c[2] = d * a[2] + e * a[6] + b * a[10];
  return c
};
goog.vec.Mat4.multVec3Projective = function(a, b, c) {
  var d = b[0], e = b[1];
  b = b[2];
  var f = 1 / (d * a[3] + e * a[7] + b * a[11] + a[15]);
  c[0] = (d * a[0] + e * a[4] + b * a[8] + a[12]) * f;
  c[1] = (d * a[1] + e * a[5] + b * a[9] + a[13]) * f;
  c[2] = (d * a[2] + e * a[6] + b * a[10] + a[14]) * f;
  return c
};
goog.vec.Mat4.multVec4 = function(a, b, c) {
  var d = b[0], e = b[1], f = b[2];
  b = b[3];
  c[0] = d * a[0] + e * a[4] + f * a[8] + b * a[12];
  c[1] = d * a[1] + e * a[5] + f * a[9] + b * a[13];
  c[2] = d * a[2] + e * a[6] + f * a[10] + b * a[14];
  c[3] = d * a[3] + e * a[7] + f * a[11] + b * a[15];
  return c
};
goog.vec.Mat4.makeTranslate = function(a, b, c, d) {
  goog.vec.Mat4.makeIdentity(a);
  return goog.vec.Mat4.setColumnValues(a, 3, b, c, d, 1)
};
goog.vec.Mat4.makeScale = function(a, b, c, d) {
  goog.vec.Mat4.makeIdentity(a);
  return goog.vec.Mat4.setDiagonalValues(a, b, c, d, 1)
};
goog.vec.Mat4.makeRotate = function(a, b, c, d, e) {
  var f = Math.cos(b), g = 1 - f;
  b = Math.sin(b);
  return goog.vec.Mat4.setFromValues(a, c * c * g + f, c * d * g + e * b, c * e * g - d * b, 0, c * d * g - e * b, d * d * g + f, d * e * g + c * b, 0, c * e * g + d * b, d * e * g - c * b, e * e * g + f, 0, 0, 0, 0, 1)
};
goog.vec.Mat4.makeRotateX = function(a, b) {
  var c = Math.cos(b), d = Math.sin(b);
  return goog.vec.Mat4.setFromValues(a, 1, 0, 0, 0, 0, c, d, 0, 0, -d, c, 0, 0, 0, 0, 1)
};
goog.vec.Mat4.makeRotateY = function(a, b) {
  var c = Math.cos(b), d = Math.sin(b);
  return goog.vec.Mat4.setFromValues(a, c, 0, -d, 0, 0, 1, 0, 0, d, 0, c, 0, 0, 0, 0, 1)
};
goog.vec.Mat4.makeRotateZ = function(a, b) {
  var c = Math.cos(b), d = Math.sin(b);
  return goog.vec.Mat4.setFromValues(a, c, d, 0, 0, -d, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
};
goog.vec.Mat4.makeFrustum = function(a, b, c, d, e, f, g) {
  return goog.vec.Mat4.setFromValues(a, 2 * f / (c - b), 0, 0, 0, 0, 2 * f / (e - d), 0, 0, (c + b) / (c - b), (e + d) / (e - d), -(g + f) / (g - f), -1, 0, 0, -(2 * g * f) / (g - f), 0)
};
goog.vec.Mat4.makePerspective = function(a, b, c, d, e) {
  var f = b / 2;
  b = e - d;
  var g = Math.sin(f);
  if(0 == b || 0 == g || 0 == c) {
    return a
  }
  f = Math.cos(f) / g;
  return goog.vec.Mat4.setFromValues(a, f / c, 0, 0, 0, 0, f, 0, 0, 0, 0, -(e + d) / b, -1, 0, 0, -(2 * d * e) / b, 0)
};
goog.vec.Mat4.makeOrtho = function(a, b, c, d, e, f, g) {
  return goog.vec.Mat4.setFromValues(a, 2 / (c - b), 0, 0, 0, 0, 2 / (e - d), 0, 0, 0, 0, -2 / (g - f), 0, -(c + b) / (c - b), -(e + d) / (e - d), -(g + f) / (g - f), 1)
};
goog.vec.Mat4.makeLookAt = function(a, b, c, d) {
  var e = goog.vec.Mat4.tmpVec4_[0];
  goog.vec.Vec3.subtract(c, b, e);
  goog.vec.Vec3.normalize(e, e);
  e[3] = 0;
  c = goog.vec.Mat4.tmpVec4_[1];
  goog.vec.Vec3.cross(e, d, c);
  goog.vec.Vec3.normalize(c, c);
  c[3] = 0;
  d = goog.vec.Mat4.tmpVec4_[2];
  goog.vec.Vec3.cross(c, e, d);
  goog.vec.Vec3.normalize(d, d);
  d[3] = 0;
  goog.vec.Vec3.negate(e, e);
  goog.vec.Mat4.setRow(a, 0, c);
  goog.vec.Mat4.setRow(a, 1, d);
  goog.vec.Mat4.setRow(a, 2, e);
  goog.vec.Mat4.setRowValues(a, 3, 0, 0, 0, 1);
  goog.vec.Mat4.translate(a, -b[0], -b[1], -b[2]);
  return a
};
goog.vec.Mat4.toLookAt = function(a, b, c, d) {
  var e = goog.vec.Mat4.tmpMat4_[0];
  if(!goog.vec.Mat4.invert(a, e)) {
    return!1
  }
  b && (b[0] = e[12], b[1] = e[13], b[2] = e[14]);
  if(c || d) {
    c || (c = goog.vec.Mat4.tmpVec3_[0]), c[0] = -a[2], c[1] = -a[6], c[2] = -a[10], goog.vec.Vec3.normalize(c, c)
  }
  d && (b = goog.vec.Mat4.tmpVec3_[1], b[0] = a[0], b[1] = a[4], b[2] = a[8], goog.vec.Vec3.cross(b, c, d), goog.vec.Vec3.normalize(d, d));
  return!0
};
goog.vec.Mat4.makeEulerZXZ = function(a, b, c, d) {
  var e = Math.cos(b);
  b = Math.sin(b);
  var f = Math.cos(c);
  c = Math.sin(c);
  var g = Math.cos(d);
  d = Math.sin(d);
  a[0] = e * g - f * b * d;
  a[1] = f * e * d + g * b;
  a[2] = d * c;
  a[3] = 0;
  a[4] = -e * d - g * f * b;
  a[5] = e * f * g - b * d;
  a[6] = g * c;
  a[7] = 0;
  a[8] = c * b;
  a[9] = -e * c;
  a[10] = f;
  a[11] = 0;
  a[12] = 0;
  a[13] = 0;
  a[14] = 0;
  a[15] = 1;
  return a
};
goog.vec.Mat4.toEulerZXZ = function(a, b, c) {
  var d = Math.sqrt(a[2] * a[2] + a[6] * a[6]);
  c = c ? -1 : 1;
  d > goog.vec.EPSILON ? (b[2] = Math.atan2(a[2] * c, a[6] * c), b[1] = Math.atan2(d * c, a[10]), b[0] = Math.atan2(a[8] * c, -a[9] * c)) : (b[0] = 0, b[1] = Math.atan2(d * c, a[10]), b[2] = Math.atan2(a[1], a[0]));
  b[0] = (b[0] + 2 * Math.PI) % (2 * Math.PI);
  b[2] = (b[2] + 2 * Math.PI) % (2 * Math.PI);
  b[1] = (b[1] * c + 2 * Math.PI) % (2 * Math.PI) * c;
  return b
};
goog.vec.Mat4.translate = function(a, b, c, d) {
  return goog.vec.Mat4.setColumnValues(a, 3, a[0] * b + a[4] * c + a[8] * d + a[12], a[1] * b + a[5] * c + a[9] * d + a[13], a[2] * b + a[6] * c + a[10] * d + a[14], a[3] * b + a[7] * c + a[11] * d + a[15])
};
goog.vec.Mat4.scale = function(a, b, c, d) {
  return goog.vec.Mat4.setFromValues(a, a[0] * b, a[1] * b, a[2] * b, a[3] * b, a[4] * c, a[5] * c, a[6] * c, a[7] * c, a[8] * d, a[9] * d, a[10] * d, a[11] * d, a[12], a[13], a[14], a[15])
};
goog.vec.Mat4.rotate = function(a, b, c, d, e) {
  var f = a[0], g = a[1], h = a[2], k = a[3], l = a[4], m = a[5], n = a[6], p = a[7], q = a[8], r = a[9], x = a[10], s = a[11], t = a[12], v = a[13], y = a[14], w = a[15], u = Math.cos(b), A = Math.sin(b), D = 1 - u;
  b = c * c * D + u;
  var C = c * d * D + e * A, G = c * e * D - d * A, F = c * d * D - e * A, z = d * d * D + u, B = d * e * D + c * A, H = c * e * D + d * A;
  c = d * e * D - c * A;
  e = e * e * D + u;
  return goog.vec.Mat4.setFromValues(a, f * b + l * C + q * G, g * b + m * C + r * G, h * b + n * C + x * G, k * b + p * C + s * G, f * F + l * z + q * B, g * F + m * z + r * B, h * F + n * z + x * B, k * F + p * z + s * B, f * H + l * c + q * e, g * H + m * c + r * e, h * H + n * c + x * e, k * H + p * c + s * e, t, v, y, w)
};
goog.vec.Mat4.rotateX = function(a, b) {
  var c = a[4], d = a[5], e = a[6], f = a[7], g = a[8], h = a[9], k = a[10], l = a[11], m = Math.cos(b), n = Math.sin(b);
  a[4] = c * m + g * n;
  a[5] = d * m + h * n;
  a[6] = e * m + k * n;
  a[7] = f * m + l * n;
  a[8] = c * -n + g * m;
  a[9] = d * -n + h * m;
  a[10] = e * -n + k * m;
  a[11] = f * -n + l * m;
  return a
};
goog.vec.Mat4.rotateY = function(a, b) {
  var c = a[0], d = a[1], e = a[2], f = a[3], g = a[8], h = a[9], k = a[10], l = a[11], m = Math.cos(b), n = Math.sin(b);
  a[0] = c * m + g * -n;
  a[1] = d * m + h * -n;
  a[2] = e * m + k * -n;
  a[3] = f * m + l * -n;
  a[8] = c * n + g * m;
  a[9] = d * n + h * m;
  a[10] = e * n + k * m;
  a[11] = f * n + l * m;
  return a
};
goog.vec.Mat4.rotateZ = function(a, b) {
  var c = a[0], d = a[1], e = a[2], f = a[3], g = a[4], h = a[5], k = a[6], l = a[7], m = Math.cos(b), n = Math.sin(b);
  a[0] = c * m + g * n;
  a[1] = d * m + h * n;
  a[2] = e * m + k * n;
  a[3] = f * m + l * n;
  a[4] = c * -n + g * m;
  a[5] = d * -n + h * m;
  a[6] = e * -n + k * m;
  a[7] = f * -n + l * m;
  return a
};
goog.vec.Mat4.getTranslation = function(a, b) {
  b[0] = a[12];
  b[1] = a[13];
  b[2] = a[14];
  return b
};
goog.vec.Mat4.tmpVec3_ = [goog.vec.Vec3.createFloat64(), goog.vec.Vec3.createFloat64()];
goog.vec.Mat4.tmpVec4_ = [goog.vec.Vec4.createFloat64(), goog.vec.Vec4.createFloat64(), goog.vec.Vec4.createFloat64()];
goog.vec.Mat4.tmpMat4_ = [goog.vec.Mat4.createFloat64()];
ol.webgl = {};
ol.webgl.CONTEXT_IDS_ = ["experimental-webgl", "webgl", "webkit-3d", "moz-webgl"];
ol.webgl.WebGLContextEventType = {LOST:"webglcontextlost", RESTORED:"webglcontextrestored"};
ol.webgl.getContext = function(a, b) {
  var c, d, e = ol.webgl.CONTEXT_IDS_.length;
  for(d = 0;d < e;++d) {
    try {
      if(c = a.getContext(ol.webgl.CONTEXT_IDS_[d], b), !goog.isNull(c)) {
        return c
      }
    }catch(f) {
    }
  }
  return null
};
ol.BrowserFeature = {};
ol.ASSUME_TOUCH = !1;
ol.ENABLE_CANVAS = !0;
ol.ENABLE_DOM = !0;
ol.ENABLE_WEBGL = !0;
ol.BrowserFeature.DEVICE_PIXEL_RATIO = goog.global.devicePixelRatio || 1;
ol.BrowserFeature.HAS_CANVAS = ol.ENABLE_CANVAS && function() {
  if(!("HTMLCanvasElement" in goog.global)) {
    return!1
  }
  try {
    var a = goog.dom.createElement(goog.dom.TagName.CANVAS);
    return!goog.isNull(a.getContext("2d"))
  }catch(b) {
    return!1
  }
}();
ol.BrowserFeature.HAS_DEVICE_ORIENTATION = "DeviceOrientationEvent" in goog.global;
ol.BrowserFeature.HAS_DOM = ol.ENABLE_DOM;
ol.BrowserFeature.HAS_GEOLOCATION = "geolocation" in goog.global.navigator;
ol.BrowserFeature.HAS_TOUCH = ol.ASSUME_TOUCH || goog.global.document && "ontouchstart" in goog.global.document.documentElement || !!goog.global.navigator.msPointerEnabled;
ol.BrowserFeature.HAS_WEBGL = ol.ENABLE_WEBGL && function() {
  if(!("WebGLRenderingContext" in goog.global)) {
    return!1
  }
  try {
    var a = goog.dom.createElement(goog.dom.TagName.CANVAS);
    return!goog.isNull(ol.webgl.getContext(a, {failIfMajorPerformanceCaveat:!0}))
  }catch(b) {
    return!1
  }
}();
ol.CollectionEventType = {ADD:"add", REMOVE:"remove"};
ol.CollectionEvent = function(a, b, c) {
  goog.events.Event.call(this, a, c);
  this.elem_ = b
};
goog.inherits(ol.CollectionEvent, goog.events.Event);
ol.CollectionEvent.prototype.getElement = function() {
  return this.elem_
};
ol.CollectionProperty = {LENGTH:"length"};
ol.Collection = function(a) {
  ol.Object.call(this);
  this.array_ = a || [];
  this.updateLength_()
};
goog.inherits(ol.Collection, ol.Object);
ol.Collection.prototype.clear = function() {
  for(;0 < this.ol_Collection_prototype$getLength();) {
    this.ol_Collection_prototype$pop()
  }
};
ol.Collection.prototype.extend = function(a) {
  var b, c;
  b = 0;
  for(c = a.length;b < c;++b) {
    this.push(a[b])
  }
  return this
};
ol.Collection.prototype.forEach = function(a, b) {
  goog.array.forEach(this.array_, a, b)
};
ol.Collection.prototype.ol_Collection_prototype$getArray = function() {
  return this.array_
};
ol.Collection.prototype.getAt = function(a) {
  return this.array_[a]
};
ol.Collection.prototype.ol_Collection_prototype$getLength = function() {
  return this.get(ol.CollectionProperty.LENGTH)
};
ol.Collection.prototype.insertAt = function(a, b) {
  goog.array.insertAt(this.array_, b, a);
  this.updateLength_();
  this.dispatchEvent(new ol.CollectionEvent(ol.CollectionEventType.ADD, b, this))
};
ol.Collection.prototype.ol_Collection_prototype$pop = function() {
  return this.removeAt(this.ol_Collection_prototype$getLength() - 1)
};
ol.Collection.prototype.push = function(a) {
  var b = this.array_.length;
  this.insertAt(b, a);
  return b
};
ol.Collection.prototype.remove = function(a) {
  var b = this.array_, c, d;
  c = 0;
  for(d = b.length;c < d;++c) {
    if(b[c] === a) {
      return this.removeAt(c)
    }
  }
};
ol.Collection.prototype.removeAt = function(a) {
  var b = this.array_[a];
  goog.array.removeAt(this.array_, a);
  this.updateLength_();
  this.dispatchEvent(new ol.CollectionEvent(ol.CollectionEventType.REMOVE, b, this));
  return b
};
ol.Collection.prototype.setAt = function(a, b) {
  var c = this.ol_Collection_prototype$getLength();
  if(a < c) {
    c = this.array_[a], this.array_[a] = b, this.dispatchEvent(new ol.CollectionEvent(ol.CollectionEventType.REMOVE, c, this)), this.dispatchEvent(new ol.CollectionEvent(ol.CollectionEventType.ADD, b, this))
  }else {
    for(;c < a;++c) {
      this.insertAt(c, void 0)
    }
    this.insertAt(a, b)
  }
};
ol.Collection.prototype.updateLength_ = function() {
  this.set(ol.CollectionProperty.LENGTH, this.array_.length)
};
ol.QuadKeyCharCode = {ZERO:48, ONE:49, TWO:50, THREE:51};
ol.TileCoord = function(a, b, c) {
  this.ol_TileCoord$z = a;
  this.x = b;
  this.y = c
};
ol.TileCoord.createFromQuadKey = function(a) {
  var b = a.length, c = 0, d = 0, e = 1 << b - 1, f;
  for(f = 0;f < b;++f) {
    switch(a.charCodeAt(f)) {
      case ol.QuadKeyCharCode.ONE:
        c += e;
        break;
      case ol.QuadKeyCharCode.TWO:
        d += e;
        break;
      case ol.QuadKeyCharCode.THREE:
        c += e, d += e
    }
    e >>= 1
  }
  return new ol.TileCoord(b, c, d)
};
ol.TileCoord.createFromString = function(a) {
  a = a.split("/");
  a = goog.array.map(a, function(a, c, d) {
    return parseInt(a, 10)
  });
  return new ol.TileCoord(a[0], a[1], a[2])
};
ol.TileCoord.createOrUpdate = function(a, b, c, d) {
  return goog.isDef(d) ? (d.ol_TileCoord$z = a, d.x = b, d.y = c, d) : new ol.TileCoord(a, b, c)
};
ol.TileCoord.function__new_ol_TileCoord__number__number__number___undefined$getKeyZXY = function(a, b, c) {
  return a + "/" + b + "/" + c
};
ol.TileCoord.prototype.getZXY = function(a) {
  return goog.isDef(a) ? (a[0] = this.ol_TileCoord$z, a[1] = this.x, a[2] = this.y, a) : [this.ol_TileCoord$z, this.x, this.y]
};
ol.TileCoord.prototype.ol_TileCoord_prototype$hash = function() {
  return(this.x << this.ol_TileCoord$z) + this.y
};
ol.TileCoord.prototype.quadKey = function() {
  var a = Array(this.ol_TileCoord$z), b = 1 << this.ol_TileCoord$z - 1, c, d;
  for(c = 0;c < this.ol_TileCoord$z;++c) {
    d = ol.QuadKeyCharCode.ZERO, this.x & b && (d += 1), this.y & b && (d += 2), a[c] = String.fromCharCode(d), b >>= 1
  }
  return a.join("")
};
ol.TileCoord.prototype.toString = function() {
  return ol.TileCoord.function__new_ol_TileCoord__number__number__number___undefined$getKeyZXY(this.ol_TileCoord$z, this.x, this.y)
};
ol.TileRange = function(a, b, c, d) {
  this.minX = a;
  this.maxX = b;
  this.minY = c;
  this.maxY = d
};
ol.TileRange.boundingTileRange = function(a) {
  var b = arguments[0], b = new ol.TileRange(b.x, b.x, b.y, b.y), c, d, e;
  c = 1;
  for(d = arguments.length;c < d;++c) {
    e = arguments[c], b.minX = Math.min(b.minX, e.x), b.maxX = Math.max(b.maxX, e.x), b.minY = Math.min(b.minY, e.y), b.maxY = Math.max(b.maxY, e.y)
  }
  return b
};
ol.TileRange.createOrUpdate = function(a, b, c, d, e) {
  return goog.isDef(e) ? (e.minX = a, e.maxX = b, e.minY = c, e.maxY = d, e) : new ol.TileRange(a, b, c, d)
};
ol.TileRange.prototype.contains = function(a) {
  return this.minX <= a.x && a.x <= this.maxX && this.minY <= a.y && a.y <= this.maxY
};
ol.TileRange.prototype.containsTileRange = function(a) {
  return this.minX <= a.minX && a.maxX <= this.maxX && this.minY <= a.minY && a.maxY <= this.maxY
};
ol.TileRange.prototype.equals = function(a) {
  return this.minX == a.minX && this.minY == a.minY && this.maxX == a.maxX && this.maxY == a.maxY
};
ol.TileRange.prototype.extend = function(a) {
  a.minX < this.minX && (this.minX = a.minX);
  a.maxX > this.maxX && (this.maxX = a.maxX);
  a.minY < this.minY && (this.minY = a.minY);
  a.maxY > this.maxY && (this.maxY = a.maxY)
};
ol.TileRange.prototype.getHeight = function() {
  return this.maxY - this.minY + 1
};
ol.TileRange.prototype.getSize = function() {
  return[this.getWidth(), this.getHeight()]
};
ol.TileRange.prototype.getWidth = function() {
  return this.maxX - this.minX + 1
};
ol.TileRange.prototype.intersects = function(a) {
  return this.minX <= a.maxX && this.maxX >= a.minX && this.minY <= a.maxY && this.maxY >= a.minY
};
ol.Attribution = function(a) {
  this.html_ = a.html;
  this.tileRanges_ = goog.isDef(a.tileRanges) ? a.tileRanges : null
};
ol.Attribution.prototype.getHTML = function() {
  return this.html_
};
ol.Attribution.prototype.intersectsAnyTileRange = function(a) {
  if(goog.isNull(this.tileRanges_)) {
    return!0
  }
  var b, c, d, e;
  for(e in a) {
    if(e in this.tileRanges_) {
      for(d = a[e], b = 0, c = this.tileRanges_[e].length;b < c;++b) {
        if(this.tileRanges_[e][b].intersects(d)) {
          return!0
        }
      }
    }
  }
  return!1
};
ol.TileState = {IDLE:0, LOADING:1, LOADED:2, ERROR:3, EMPTY:4};
ol.Tile = function(a, b) {
  goog.events.EventTarget.call(this);
  this.tileCoord = a;
  this.state = b
};
goog.inherits(ol.Tile, goog.events.EventTarget);
ol.Tile.prototype.ol_Tile_prototype$dispatchChangeEvent = function() {
  this.dispatchEvent(goog.events.EventType.CHANGE)
};
ol.Tile.prototype.ol_Tile_prototype$getKey = function() {
  return goog.getUid(this).toString()
};
ol.Tile.prototype.getTileCoord = function() {
  return this.tileCoord
};
ol.Tile.prototype.ol_Tile_prototype$getState = function() {
  return this.state
};
ol.structs = {};
ol.structs.PriorityQueue = function(a, b) {
  this.priorityFunction_ = a;
  this.keyFunction_ = b;
  this.elements_ = [];
  this.priorities_ = [];
  this.queuedElements_ = {}
};
ol.structs.PriorityQueue.function__new_ol_structs_PriorityQueue__function__T___number__function__T___string___undefined$DROP = Infinity;
ol.structs.PriorityQueue.prototype.ol_structs_PriorityQueue_prototype$assertValid = function() {
  var a = this.elements_.length, b;
  for(b = 0;b < (a >> 1) - 1;++b) {
  }
};
ol.structs.PriorityQueue.prototype.clear = function() {
  this.elements_.length = 0;
  this.priorities_.length = 0;
  goog.object.clear(this.queuedElements_)
};
ol.structs.PriorityQueue.prototype.dequeue = function() {
  var a = this.elements_, b = this.priorities_, c = a[0];
  1 == a.length ? (a.length = 0, b.length = 0) : (a[0] = a.pop(), b[0] = b.pop(), this.siftUp_(0));
  a = this.keyFunction_(c);
  delete this.queuedElements_[a];
  return c
};
ol.structs.PriorityQueue.prototype.enqueue = function(a) {
  var b = this.priorityFunction_(a);
  b != ol.structs.PriorityQueue.function__new_ol_structs_PriorityQueue__function__T___number__function__T___string___undefined$DROP && (this.elements_.push(a), this.priorities_.push(b), this.queuedElements_[this.keyFunction_(a)] = !0, this.siftDown_(0, this.elements_.length - 1))
};
ol.structs.PriorityQueue.prototype.getCount = function() {
  return this.elements_.length
};
ol.structs.PriorityQueue.prototype.getLeftChildIndex_ = function(a) {
  return 2 * a + 1
};
ol.structs.PriorityQueue.prototype.getRightChildIndex_ = function(a) {
  return 2 * a + 2
};
ol.structs.PriorityQueue.prototype.getParentIndex_ = function(a) {
  return a - 1 >> 1
};
ol.structs.PriorityQueue.prototype.heapify_ = function() {
  var a;
  for(a = (this.elements_.length >> 1) - 1;0 <= a;a--) {
    this.siftUp_(a)
  }
};
ol.structs.PriorityQueue.prototype.isEmpty = function() {
  return 0 === this.elements_.length
};
ol.structs.PriorityQueue.prototype.isKeyQueued = function(a) {
  return a in this.queuedElements_
};
ol.structs.PriorityQueue.prototype.isQueued = function(a) {
  return this.isKeyQueued(this.keyFunction_(a))
};
ol.structs.PriorityQueue.prototype.siftUp_ = function(a) {
  for(var b = this.elements_, c = this.priorities_, d = b.length, e = b[a], f = c[a], g = a;a < d >> 1;) {
    var h = this.getLeftChildIndex_(a), k = this.getRightChildIndex_(a), h = k < d && c[k] < c[h] ? k : h;
    b[a] = b[h];
    c[a] = c[h];
    a = h
  }
  b[a] = e;
  c[a] = f;
  this.siftDown_(g, a)
};
ol.structs.PriorityQueue.prototype.siftDown_ = function(a, b) {
  for(var c = this.elements_, d = this.priorities_, e = c[b], f = d[b];b > a;) {
    var g = this.getParentIndex_(b);
    if(d[g] > f) {
      c[b] = c[g], d[b] = d[g], b = g
    }else {
      break
    }
  }
  c[b] = e;
  d[b] = f
};
ol.structs.PriorityQueue.prototype.reprioritize = function() {
  var a = this.priorityFunction_, b = this.elements_, c = this.priorities_, d = 0, e = b.length, f, g, h;
  for(g = 0;g < e;++g) {
    f = b[g], h = a(f), h == ol.structs.PriorityQueue.function__new_ol_structs_PriorityQueue__function__T___number__function__T___string___undefined$DROP ? delete this.queuedElements_[this.keyFunction_(f)] : (c[d] = h, b[d++] = f)
  }
  b.length = d;
  c.length = d;
  this.heapify_()
};
ol.TileQueue = function(a, b) {
  ol.structs.PriorityQueue.call(this, function(b) {
    return a.apply(null, b)
  }, function(a) {
    return a[0].ol_Tile_prototype$getKey()
  });
  this.tileChangeCallback_ = b;
  this.tilesLoading_ = 0
};
goog.inherits(ol.TileQueue, ol.structs.PriorityQueue);
ol.TileQueue.prototype.getTilesLoading = function() {
  return this.tilesLoading_
};
ol.TileQueue.prototype.handleTileChange = function() {
  --this.tilesLoading_;
  this.tileChangeCallback_()
};
ol.TileQueue.prototype.loadMoreTiles = function(a, b) {
  var c = Math.min(a - this.getTilesLoading(), b, this.getCount()), d, e;
  for(d = 0;d < c;++d) {
    e = this.dequeue()[0], goog.events.listenOnce(e, goog.events.EventType.CHANGE, this.handleTileChange, !1, this), e.ol_Tile_prototype$load()
  }
  this.tilesLoading_ += c
};
ol.source = {};
ol.source.State = {LOADING:0, READY:1, ERROR:2};
ol.source.Source = function(a) {
  ol.Observable.call(this);
  this.projection_ = ol.proj.get(a.projection);
  this.ol_source_Source$extent_ = goog.isDef(a.extent) ? a.extent : goog.isDef(a.projection) ? this.projection_.ol_proj_Projection_prototype$getExtent() : null;
  this.ol_source_Source$attributions_ = goog.isDef(a.attributions) ? a.attributions : null;
  this.logo_ = a.logo;
  this.ol_source_Source$state_ = goog.isDef(a.state) ? a.state : ol.source.State.READY
};
goog.inherits(ol.source.Source, ol.Observable);
ol.source.Source.prototype.ol_source_Source_prototype$forEachFeatureAtPixel = goog.nullFunction;
ol.source.Source.prototype.ol_source_Source_prototype$getAttributions = function() {
  return this.ol_source_Source$attributions_
};
ol.source.Source.prototype.ol_source_Source_prototype$getExtent = function() {
  return this.ol_source_Source$extent_
};
ol.source.Source.prototype.getLogo = function() {
  return this.logo_
};
ol.source.Source.prototype.ol_source_Source_prototype$getProjection = function() {
  return this.projection_
};
ol.source.Source.prototype.ol_source_Source_prototype$getState = function() {
  return this.ol_source_Source$state_
};
ol.source.Source.prototype.setAttributions = function(a) {
  this.ol_source_Source$attributions_ = a
};
ol.source.Source.prototype.setExtent = function(a) {
  this.ol_source_Source$extent_ = a
};
ol.source.Source.prototype.setLogo = function(a) {
  this.logo_ = a
};
ol.source.Source.prototype.setState = function(a) {
  this.ol_source_Source$state_ = a;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Source.prototype.ol_source_Source_prototype$setProjection = function(a) {
  this.projection_ = a
};
ol.layer = {};
ol.layer.LayerProperty = {BRIGHTNESS:"brightness", CONTRAST:"contrast", HUE:"hue", OPACITY:"opacity", SATURATION:"saturation", VISIBLE:"visible", MAX_RESOLUTION:"maxResolution", MIN_RESOLUTION:"minResolution"};
ol.layer.Base = function(a) {
  ol.Object.call(this);
  a = goog.object.clone(a);
  a.brightness = goog.isDef(a.brightness) ? a.brightness : 0;
  a.contrast = goog.isDef(a.contrast) ? a.contrast : 1;
  a.hue = goog.isDef(a.hue) ? a.hue : 0;
  a.opacity = goog.isDef(a.opacity) ? a.opacity : 1;
  a.saturation = goog.isDef(a.saturation) ? a.saturation : 1;
  a.visible = goog.isDef(a.visible) ? a.visible : !0;
  a.maxResolution = goog.isDef(a.maxResolution) ? a.maxResolution : Infinity;
  a.minResolution = goog.isDef(a.minResolution) ? a.minResolution : 0;
  this.ol_Object_prototype$setValues(a)
};
goog.inherits(ol.layer.Base, ol.Object);
ol.layer.Base.prototype.getBrightness = function() {
  return this.get(ol.layer.LayerProperty.BRIGHTNESS)
};
goog.exportProperty(ol.layer.Base.prototype, "getBrightness", ol.layer.Base.prototype.getBrightness);
ol.layer.Base.prototype.getContrast = function() {
  return this.get(ol.layer.LayerProperty.CONTRAST)
};
goog.exportProperty(ol.layer.Base.prototype, "getContrast", ol.layer.Base.prototype.getContrast);
ol.layer.Base.prototype.getHue = function() {
  return this.get(ol.layer.LayerProperty.HUE)
};
goog.exportProperty(ol.layer.Base.prototype, "getHue", ol.layer.Base.prototype.getHue);
ol.layer.Base.prototype.getLayerState = function() {
  var a = this.getBrightness(), b = this.getContrast(), c = this.getHue(), d = this.getOpacity(), e = this.getSaturation(), f = this.getSourceState(), g = this.getVisible(), h = this.getMaxResolution(), k = this.getMinResolution();
  return{brightness:goog.isDef(a) ? goog.math.clamp(a, -1, 1) : 0, contrast:goog.isDef(b) ? Math.max(b, 0) : 1, hue:goog.isDef(c) ? c : 0, opacity:goog.isDef(d) ? goog.math.clamp(d, 0, 1) : 1, saturation:goog.isDef(e) ? Math.max(e, 0) : 1, sourceState:f, visible:goog.isDef(g) ? !!g : !0, maxResolution:goog.isDef(h) ? h : Infinity, minResolution:goog.isDef(k) ? Math.max(k, 0) : 0}
};
ol.layer.Base.prototype.getMaxResolution = function() {
  return this.get(ol.layer.LayerProperty.MAX_RESOLUTION)
};
goog.exportProperty(ol.layer.Base.prototype, "getMaxResolution", ol.layer.Base.prototype.getMaxResolution);
ol.layer.Base.prototype.getMinResolution = function() {
  return this.get(ol.layer.LayerProperty.MIN_RESOLUTION)
};
goog.exportProperty(ol.layer.Base.prototype, "getMinResolution", ol.layer.Base.prototype.getMinResolution);
ol.layer.Base.prototype.getOpacity = function() {
  return this.get(ol.layer.LayerProperty.OPACITY)
};
goog.exportProperty(ol.layer.Base.prototype, "getOpacity", ol.layer.Base.prototype.getOpacity);
ol.layer.Base.prototype.getSaturation = function() {
  return this.get(ol.layer.LayerProperty.SATURATION)
};
goog.exportProperty(ol.layer.Base.prototype, "getSaturation", ol.layer.Base.prototype.getSaturation);
ol.layer.Base.prototype.getVisible = function() {
  return this.get(ol.layer.LayerProperty.VISIBLE)
};
goog.exportProperty(ol.layer.Base.prototype, "getVisible", ol.layer.Base.prototype.getVisible);
ol.layer.Base.prototype.setBrightness = function(a) {
  this.set(ol.layer.LayerProperty.BRIGHTNESS, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setBrightness", ol.layer.Base.prototype.setBrightness);
ol.layer.Base.prototype.setContrast = function(a) {
  this.set(ol.layer.LayerProperty.CONTRAST, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setContrast", ol.layer.Base.prototype.setContrast);
ol.layer.Base.prototype.setHue = function(a) {
  this.set(ol.layer.LayerProperty.HUE, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setHue", ol.layer.Base.prototype.setHue);
ol.layer.Base.prototype.setMaxResolution = function(a) {
  this.set(ol.layer.LayerProperty.MAX_RESOLUTION, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setMaxResolution", ol.layer.Base.prototype.setMaxResolution);
ol.layer.Base.prototype.setMinResolution = function(a) {
  this.set(ol.layer.LayerProperty.MIN_RESOLUTION, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setMinResolution", ol.layer.Base.prototype.setMinResolution);
ol.layer.Base.prototype.setOpacity = function(a) {
  this.set(ol.layer.LayerProperty.OPACITY, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setOpacity", ol.layer.Base.prototype.setOpacity);
ol.layer.Base.prototype.setSaturation = function(a) {
  this.set(ol.layer.LayerProperty.SATURATION, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setSaturation", ol.layer.Base.prototype.setSaturation);
ol.layer.Base.prototype.setVisible = function(a) {
  this.set(ol.layer.LayerProperty.VISIBLE, a)
};
goog.exportProperty(ol.layer.Base.prototype, "setVisible", ol.layer.Base.prototype.setVisible);
ol.layer.Layer = function(a) {
  var b = goog.object.clone(a);
  delete b.source;
  ol.layer.Base.call(this, b);
  this.ol_layer_Layer$source_ = a.source;
  goog.events.listen(this.ol_layer_Layer$source_, goog.events.EventType.CHANGE, this.handleSourceChange_, !1, this)
};
goog.inherits(ol.layer.Layer, ol.layer.Base);
ol.layer.Layer.prototype.getLayersArray = function(a) {
  a = goog.isDef(a) ? a : [];
  a.push(this);
  return a
};
ol.layer.Layer.prototype.getLayerStatesArray = function(a) {
  a = goog.isDef(a) ? a : {layers:[], layerStates:[]};
  a.layers.push(this);
  a.layerStates.push(this.getLayerState());
  return a
};
ol.layer.Layer.prototype.ol_layer_Layer_prototype$getSource = function() {
  return this.ol_layer_Layer$source_
};
ol.layer.Layer.prototype.getSourceState = function() {
  return this.ol_layer_Layer_prototype$getSource().ol_source_Source_prototype$getState()
};
ol.layer.Layer.prototype.handleSourceChange_ = function() {
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.MapEventType = {POSTRENDER:"postrender", MOVEEND:"moveend"};
ol.MapEvent = function(a, b, c) {
  goog.events.Event.call(this, a);
  this.map = b;
  this.frameState = goog.isDef(c) ? c : null
};
goog.inherits(ol.MapEvent, goog.events.Event);
ol.MapBrowserEvent = function(a, b, c, d) {
  ol.MapEvent.call(this, a, b, d);
  this.browserEvent = c;
  this.pixel_ = this.ol_MapBrowserEvent$coordinate_ = null
};
goog.inherits(ol.MapBrowserEvent, ol.MapEvent);
ol.MapBrowserEvent.prototype.getBrowserEvent = function() {
  return this.browserEvent.getBrowserEvent()
};
ol.MapBrowserEvent.prototype.ol_MapBrowserEvent_prototype$getCoordinate = function() {
  goog.isNull(this.ol_MapBrowserEvent$coordinate_) && (this.ol_MapBrowserEvent$coordinate_ = this.map.getEventCoordinate(this.browserEvent.getBrowserEvent()));
  return this.ol_MapBrowserEvent$coordinate_
};
ol.MapBrowserEvent.prototype.getPixel = function() {
  goog.isNull(this.pixel_) && (this.pixel_ = this.map.getEventPixel(this.browserEvent.getBrowserEvent()));
  return this.pixel_
};
ol.MapBrowserEvent.prototype.goog_events_Event_prototype$preventDefault = function() {
  ol.MapBrowserEvent.superClass_.goog_events_Event_prototype$preventDefault.call(this);
  this.browserEvent.goog_events_Event_prototype$preventDefault()
};
ol.MapBrowserEvent.prototype.goog_events_Event_prototype$stopPropagation = function() {
  ol.MapBrowserEvent.superClass_.goog_events_Event_prototype$stopPropagation.call(this);
  this.browserEvent.goog_events_Event_prototype$stopPropagation()
};
ol.MapBrowserEventHandler = function(a) {
  goog.events.EventTarget.call(this);
  this.ol_MapBrowserEventHandler$map_ = a;
  this.clickTimeoutId_ = 0;
  this.dragged_ = !1;
  this.down_ = this.touchstartListenerKey_ = this.pointerdownListenerKey_ = this.mousedownListenerKey_ = this.dragListenerKeys_ = null;
  a = this.ol_MapBrowserEventHandler$map_.getViewport();
  this.relayedListenerKeys_ = [goog.events.listen(a, goog.events.EventType.MOUSEMOVE, this.relayEvent_, !1, this), goog.events.listen(a, goog.events.EventType.CLICK, this.relayEvent_, !1, this)];
  this.mousedownListenerKey_ = goog.events.listen(a, goog.events.EventType.MOUSEDOWN, this.handleMouseDown_, !1, this);
  this.pointerdownListenerKey_ = goog.events.listen(a, goog.events.EventType.MSPOINTERDOWN, this.handlePointerDown_, !1, this);
  this.touchstartListenerKey_ = goog.events.listen(a, goog.events.EventType.TOUCHSTART, this.handleTouchStart_, !1, this)
};
goog.inherits(ol.MapBrowserEventHandler, goog.events.EventTarget);
ol.MapBrowserEventHandler.prototype.getDown = function() {
  return this.down_
};
ol.MapBrowserEventHandler.prototype.emulateClick_ = function(a) {
  if(0 !== this.clickTimeoutId_) {
    goog.global.clearTimeout(this.clickTimeoutId_);
    this.clickTimeoutId_ = 0;
    var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.DBLCLICK, this.ol_MapBrowserEventHandler$map_, a);
    this.dispatchEvent(b)
  }else {
    this.clickTimeoutId_ = goog.global.setTimeout(goog.bind(function() {
      this.clickTimeoutId_ = 0;
      var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.SINGLECLICK, this.ol_MapBrowserEventHandler$map_, a);
      this.dispatchEvent(b)
    }, this), 250)
  }
};
ol.MapBrowserEventHandler.prototype.handleMouseUp_ = function(a) {
  this.down_ && (goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey), this.dragListenerKeys_ = null, this.dragged_ ? (a = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.DRAGEND, this.ol_MapBrowserEventHandler$map_, a), this.dispatchEvent(a)) : a.isMouseActionButton() && this.emulateClick_(a))
};
ol.MapBrowserEventHandler.prototype.handleMouseDown_ = function(a) {
  goog.isNull(this.pointerdownListenerKey_) || (goog.events.unlistenByKey(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null, goog.events.unlistenByKey(this.touchstartListenerKey_), this.touchstartListenerKey_ = null);
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.DOWN, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  this.down_ = a;
  this.dragged_ = !1;
  this.dragListenerKeys_ = [goog.events.listen(goog.global.document, goog.events.EventType.MOUSEMOVE, this.handleMouseMove_, !1, this), goog.events.listen(goog.global.document, goog.events.EventType.MOUSEUP, this.handleMouseUp_, !1, this)];
  a.goog_events_Event_prototype$preventDefault()
};
ol.MapBrowserEventHandler.prototype.handleMouseMove_ = function(a) {
  var b;
  this.dragged_ || (this.dragged_ = !0, b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.DRAGSTART, this.ol_MapBrowserEventHandler$map_, this.down_), this.dispatchEvent(b));
  b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.DRAG, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b)
};
ol.MapBrowserEventHandler.prototype.handlePointerDown_ = function(a) {
  goog.isNull(this.mousedownListenerKey_) || (goog.events.unlistenByKey(this.mousedownListenerKey_), this.mousedownListenerKey_ = null, goog.events.unlistenByKey(this.touchstartListenerKey_), this.touchstartListenerKey_ = null);
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHSTART, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  this.down_ = a;
  this.dragged_ = !1;
  this.dragListenerKeys_ = [goog.events.listen(goog.global.document, goog.events.EventType.MSPOINTERMOVE, this.handlePointerMove_, !1, this), goog.events.listen(goog.global.document, goog.events.EventType.MSPOINTERUP, this.handlePointerUp_, !1, this)];
  a.goog_events_Event_prototype$preventDefault()
};
ol.MapBrowserEventHandler.prototype.handlePointerMove_ = function(a) {
  if(a.clientX != this.down_.clientX || a.clientY != this.down_.clientY) {
    this.dragged_ = !0, a = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHMOVE, this.ol_MapBrowserEventHandler$map_, a), this.dispatchEvent(a)
  }
};
ol.MapBrowserEventHandler.prototype.handlePointerUp_ = function(a) {
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHEND, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey);
  !this.dragged_ && a.isMouseActionButton() && this.emulateClick_(this.down_)
};
ol.MapBrowserEventHandler.prototype.handleTouchStart_ = function(a) {
  goog.isNull(this.mousedownListenerKey_) || (goog.events.unlistenByKey(this.mousedownListenerKey_), this.mousedownListenerKey_ = null, goog.events.unlistenByKey(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null);
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHSTART, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  this.down_ = a;
  this.dragged_ = !1;
  goog.isNull(this.dragListenerKeys_) && (this.dragListenerKeys_ = [goog.events.listen(goog.global.document, goog.events.EventType.TOUCHMOVE, this.handleTouchMove_, !1, this), goog.events.listen(goog.global.document, goog.events.EventType.TOUCHEND, this.handleTouchEnd_, !1, this)]);
  a.goog_events_Event_prototype$preventDefault()
};
ol.MapBrowserEventHandler.prototype.handleTouchMove_ = function(a) {
  this.dragged_ = !0;
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHMOVE, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  a.goog_events_Event_prototype$preventDefault()
};
ol.MapBrowserEventHandler.prototype.handleTouchEnd_ = function(a) {
  var b = new ol.MapBrowserEvent(ol.MapBrowserEvent.EventType.TOUCHEND, this.ol_MapBrowserEventHandler$map_, a);
  this.dispatchEvent(b);
  0 === a.getBrowserEvent().targetTouches.length && (goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey), this.dragListenerKeys_ = null);
  this.dragged_ || this.emulateClick_(this.down_)
};
ol.MapBrowserEventHandler.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.isNull(this.relayedListenerKeys_) || (goog.array.forEach(this.relayedListenerKeys_, goog.events.unlistenByKey), this.relayedListenerKeys_ = null);
  goog.isNull(this.mousedownListenerKey_) || (goog.events.unlistenByKey(this.mousedownListenerKey_), this.mousedownListenerKey_ = null);
  goog.isNull(this.pointerdownListenerKey_) || (goog.events.unlistenByKey(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null);
  goog.isNull(this.touchstartListenerKey_) || (goog.events.unlistenByKey(this.touchstartListenerKey_), this.touchstartListenerKey_ = null);
  goog.isNull(this.dragListenerKeys_) || (goog.array.forEach(this.dragListenerKeys_, goog.events.unlistenByKey), this.dragListenerKeys_ = null);
  ol.MapBrowserEventHandler.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.MapBrowserEventHandler.prototype.relayEvent_ = function(a) {
  this.dispatchEvent(new ol.MapBrowserEvent(a.type, this.ol_MapBrowserEventHandler$map_, a))
};
ol.MapBrowserEvent.EventType = {CLICK:goog.events.EventType.CLICK, DBLCLICK:goog.events.EventType.DBLCLICK, MOUSEMOVE:goog.events.EventType.MOUSEMOVE, DOWN:"down", DRAGSTART:"dragstart", DRAG:"drag", DRAGEND:"dragend", SINGLECLICK:"singleclick", TOUCHSTART:goog.events.EventType.TOUCHSTART, TOUCHMOVE:goog.events.EventType.TOUCHMOVE, TOUCHEND:goog.events.EventType.TOUCHEND};
ol.control = {};
ol.control.Control = function(a) {
  ol.Object.call(this);
  this.element = goog.isDef(a.element) ? a.element : null;
  this.target_ = goog.isDef(a.target) ? goog.dom.getElement(a.target) : null;
  this.ol_control_Control$map_ = null;
  this.listenerKeys = []
};
goog.inherits(ol.control.Control, ol.Object);
ol.control.Control.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.dom.removeNode(this.element);
  ol.control.Control.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.control.Control.prototype.ol_control_Control_prototype$getMap = function() {
  return this.ol_control_Control$map_
};
ol.control.Control.prototype.handleMapPostrender = goog.nullFunction;
ol.control.Control.prototype.setMap = function(a) {
  goog.isNull(this.ol_control_Control$map_) || goog.dom.removeNode(this.element);
  goog.array.isEmpty(this.listenerKeys) || (goog.array.forEach(this.listenerKeys, goog.events.unlistenByKey), this.listenerKeys.length = 0);
  this.ol_control_Control$map_ = a;
  if(!goog.isNull(this.ol_control_Control$map_)) {
    var b = goog.isNull(this.target_) ? a.getOverlayContainerStopEvent() : this.target_;
    goog.dom.appendChild(b, this.element);
    this.handleMapPostrender !== goog.nullFunction && this.listenerKeys.push(goog.events.listen(a, ol.MapEventType.POSTRENDER, this.handleMapPostrender, !1, this));
    a.render()
  }
};
ol.css = {};
ol.css.CLASS_UNSELECTABLE = "ol-unselectable";
ol.css.CLASS_UNSUPPORTED = "ol-unsupported";
ol.control.Attribution = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_control_Attribution$ulElement_ = goog.dom.createElement(goog.dom.TagName.UL);
  var b = goog.isDef(a.className) ? a.className : "ol-attribution", b = goog.dom.createDom(goog.dom.TagName.DIV, {"class":b + " " + ol.css.CLASS_UNSELECTABLE}, this.ol_control_Attribution$ulElement_);
  ol.control.Control.call(this, {element:b, target:a.target});
  this.ol_control_Attribution$renderedVisible_ = !0;
  this.attributionElements_ = {};
  this.attributionElementRenderedVisible_ = {}
};
goog.inherits(ol.control.Attribution, ol.control.Control);
ol.control.Attribution.prototype.getSourceAttributions = function(a) {
  var b, c, d, e, f, g, h, k, l, m = a.layersArray, n = goog.object.clone(a.attributions), p = {};
  b = 0;
  for(c = m.length;b < c;b++) {
    if(d = m[b].ol_layer_Layer_prototype$getSource(), l = goog.getUid(d).toString(), k = d.ol_source_Source_prototype$getAttributions(), !goog.isNull(k)) {
      for(d = 0, e = k.length;d < e;d++) {
        g = k[d], h = goog.getUid(g).toString(), h in n || (f = a.usedTiles[l], goog.isDef(f) && g.intersectsAnyTileRange(f) ? (h in p && delete p[h], n[h] = g) : p[h] = g)
      }
    }
  }
  return[n, p]
};
ol.control.Attribution.prototype.handleMapPostrender = function(a) {
  this.ol_control_Attribution_prototype$updateElement_(a.frameState)
};
ol.control.Attribution.prototype.ol_control_Attribution_prototype$updateElement_ = function(a) {
  if(goog.isNull(a)) {
    this.ol_control_Attribution$renderedVisible_ && (goog.style.setElementShown(this.element, !1), this.ol_control_Attribution$renderedVisible_ = !1)
  }else {
    var b = this.getSourceAttributions(a);
    a = b[0];
    var b = b[1], c, d;
    for(d in this.attributionElements_) {
      d in a ? (this.attributionElementRenderedVisible_[d] || (goog.style.setElementShown(this.attributionElements_[d], !0), this.attributionElementRenderedVisible_[d] = !0), delete a[d]) : d in b ? (this.attributionElementRenderedVisible_[d] && (goog.style.setElementShown(this.attributionElements_[d], !1), delete this.attributionElementRenderedVisible_[d]), delete b[d]) : (goog.dom.removeNode(this.attributionElements_[d]), delete this.attributionElements_[d], delete this.attributionElementRenderedVisible_[d])
    }
    for(d in a) {
      c = goog.dom.createElement(goog.dom.TagName.LI), c.innerHTML = a[d].getHTML(), goog.dom.appendChild(this.ol_control_Attribution$ulElement_, c), this.attributionElements_[d] = c, this.attributionElementRenderedVisible_[d] = !0
    }
    for(d in b) {
      c = goog.dom.createElement(goog.dom.TagName.LI), c.innerHTML = b[d].getHTML(), goog.style.setElementShown(c, !1), goog.dom.appendChild(this.ol_control_Attribution$ulElement_, c), this.attributionElements_[d] = c
    }
    d = !goog.object.isEmpty(this.attributionElementRenderedVisible_);
    this.ol_control_Attribution$renderedVisible_ != d && (goog.style.setElementShown(this.element, d), this.ol_control_Attribution$renderedVisible_ = d)
  }
};
ol.control.Logo = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_control_Logo$ulElement_ = goog.dom.createElement(goog.dom.TagName.UL);
  var b = goog.isDef(a.className) ? a.className : "ol-logo", b = goog.dom.createDom(goog.dom.TagName.DIV, {"class":b + " " + ol.css.CLASS_UNSELECTABLE}, this.ol_control_Logo$ulElement_);
  ol.control.Control.call(this, {element:b, target:a.target});
  this.ol_control_Logo$renderedVisible_ = !0;
  this.logoElements_ = {}
};
goog.inherits(ol.control.Logo, ol.control.Control);
ol.control.Logo.prototype.handleMapPostrender = function(a) {
  this.ol_control_Logo_prototype$updateElement_(a.frameState)
};
ol.control.Logo.prototype.ol_control_Logo_prototype$updateElement_ = function(a) {
  if(goog.isNull(a)) {
    this.ol_control_Logo$renderedVisible_ && (goog.style.setElementShown(this.element, !1), this.ol_control_Logo$renderedVisible_ = !1)
  }else {
    var b;
    a = a.logos;
    var c = this.logoElements_;
    for(b in c) {
      b in a || (goog.dom.removeNode(c[b]), delete c[b])
    }
    for(var d in a) {
      if(!(d in c)) {
        b = new Image;
        b.src = d;
        var e = a[d];
        "" === e ? e = b : (e = goog.dom.createDom(goog.dom.TagName.A, {href:e, target:"_blank"}), e.appendChild(b));
        b = goog.dom.createDom(goog.dom.TagName.LI, void 0, e);
        goog.dom.appendChild(this.ol_control_Logo$ulElement_, b);
        c[d] = b
      }
    }
    d = !goog.object.isEmpty(a);
    this.ol_control_Logo$renderedVisible_ != d && (goog.style.setElementShown(this.element, d), this.ol_control_Logo$renderedVisible_ = d)
  }
};
goog.fx = {};
goog.fx.easing = {};
goog.fx.easing.easeIn = function(a) {
  return a * a * a
};
goog.fx.easing.easeOut = function(a) {
  return 1 - Math.pow(1 - a, 3)
};
goog.fx.easing.inAndOut = function(a) {
  return 3 * a * a - 2 * a * a * a
};
ol.easing = {};
ol.easing.bounce = function(a) {
  a < 1 / 2.75 ? a *= 7.5625 * a : a < 2 / 2.75 ? (a -= 1.5 / 2.75, a = 7.5625 * a * a + 0.75) : a < 2.5 / 2.75 ? (a -= 2.25 / 2.75, a = 7.5625 * a * a + 0.9375) : (a -= 2.625 / 2.75, a = 7.5625 * a * a + 0.984375);
  return a
};
ol.easing.easeIn = goog.fx.easing.easeIn;
ol.easing.easeOut = goog.fx.easing.easeOut;
ol.easing.elastic = function(a) {
  return Math.pow(2, -10 * a) * Math.sin((a - 0.075) * 2 * Math.PI / 0.3) + 1
};
ol.easing.inAndOut = goog.fx.easing.inAndOut;
ol.easing.linear = function(a) {
  return a
};
ol.easing.upAndDown = function(a) {
  return 0.5 > a ? ol.easing.inAndOut(2 * a) : 1 - ol.easing.inAndOut(2 * (a - 0.5))
};
ol.animation = {};
ol.animation.bounce = function(a) {
  var b = a.resolution, c = goog.isDef(a.start) ? a.start : goog.now(), d = goog.isDef(a.duration) ? a.duration : 1E3, e = goog.isDef(a.easing) ? a.easing : ol.easing.upAndDown;
  return function(a, g) {
    if(g.time < c) {
      return g.animate = !0, g.viewHints[ol.ViewHint.ANIMATING] += 1, !0
    }
    if(g.time < c + d) {
      var h = e((g.time - c) / d), k = b - g.view2DState.resolution;
      g.animate = !0;
      g.view2DState.resolution += h * k;
      g.viewHints[ol.ViewHint.ANIMATING] += 1;
      return!0
    }
    return!1
  }
};
ol.animation.pan = function(a) {
  var b = a.source, c = goog.isDef(a.start) ? a.start : goog.now(), d = b[0], e = b[1], f = goog.isDef(a.duration) ? a.duration : 1E3, g = goog.isDef(a.easing) ? a.easing : ol.easing.inAndOut;
  return function(a, b) {
    if(b.time < c) {
      return b.animate = !0, b.viewHints[ol.ViewHint.ANIMATING] += 1, !0
    }
    if(b.time < c + f) {
      var l = 1 - g((b.time - c) / f), m = d - b.view2DState.center[0], n = e - b.view2DState.center[1];
      b.animate = !0;
      b.view2DState.center[0] += l * m;
      b.view2DState.center[1] += l * n;
      b.viewHints[ol.ViewHint.ANIMATING] += 1;
      return!0
    }
    return!1
  }
};
ol.animation.rotate = function(a) {
  var b = a.rotation, c = goog.isDef(a.start) ? a.start : goog.now(), d = goog.isDef(a.duration) ? a.duration : 1E3, e = goog.isDef(a.easing) ? a.easing : ol.easing.inAndOut;
  return function(a, g) {
    if(g.time < c) {
      return g.animate = !0, g.viewHints[ol.ViewHint.ANIMATING] += 1, !0
    }
    if(g.time < c + d) {
      var h = 1 - e((g.time - c) / d), k = b - g.view2DState.rotation;
      g.animate = !0;
      g.view2DState.rotation += h * k;
      g.viewHints[ol.ViewHint.ANIMATING] += 1;
      return!0
    }
    return!1
  }
};
ol.animation.zoom = function(a) {
  var b = a.resolution, c = goog.isDef(a.start) ? a.start : goog.now(), d = goog.isDef(a.duration) ? a.duration : 1E3, e = goog.isDef(a.easing) ? a.easing : ol.easing.inAndOut;
  return function(a, g) {
    if(g.time < c) {
      return g.animate = !0, g.viewHints[ol.ViewHint.ANIMATING] += 1, !0
    }
    if(g.time < c + d) {
      var h = 1 - e((g.time - c) / d), k = b - g.view2DState.resolution;
      g.animate = !0;
      g.view2DState.resolution += h * k;
      g.viewHints[ol.ViewHint.ANIMATING] += 1;
      return!0
    }
    return!1
  }
};
ol.control.Zoom = function(a) {
  a = goog.isDef(a) ? a : {};
  var b = goog.isDef(a.className) ? a.className : "ol-zoom", c = goog.isDef(a.delta) ? a.delta : 1, d = goog.dom.createDom(goog.dom.TagName.A, {href:"#zoomIn", "class":b + "-in"});
  goog.events.listen(d, [goog.events.EventType.TOUCHEND, goog.events.EventType.CLICK], goog.partial(ol.control.Zoom.prototype.zoomByDelta_, c), !1, this);
  var e = goog.dom.createDom(goog.dom.TagName.A, {href:"#zoomOut", "class":b + "-out"});
  goog.events.listen(e, [goog.events.EventType.TOUCHEND, goog.events.EventType.CLICK], goog.partial(ol.control.Zoom.prototype.zoomByDelta_, -c), !1, this);
  b = goog.dom.createDom(goog.dom.TagName.DIV, b + " " + ol.css.CLASS_UNSELECTABLE, d, e);
  ol.control.Control.call(this, {element:b, target:a.target});
  this.ol_control_Zoom$duration_ = goog.isDef(a.duration) ? a.duration : 250
};
goog.inherits(ol.control.Zoom, ol.control.Control);
ol.control.Zoom.prototype.zoomByDelta_ = function(a, b) {
  b.goog_events_Event_prototype$preventDefault();
  var c = this.ol_control_Control_prototype$getMap(), d = c.getView().getView2D(), e = d.ol_IView2D_prototype$getResolution();
  goog.isDef(e) && (0 < this.ol_control_Zoom$duration_ && c.beforeRender(ol.animation.zoom({resolution:e, duration:this.ol_control_Zoom$duration_, easing:ol.easing.easeOut})), c = d.constrainResolution(e, a), d.setResolution(c))
};
ol.control.defaults = function(a) {
  var b = goog.isDef(a) ? a : {};
  a = new ol.Collection;
  if(goog.isDef(b.attribution) ? b.attribution : 1) {
    var c = goog.isDef(b.attributionOptions) ? b.attributionOptions : void 0;
    a.push(new ol.control.Attribution(c))
  }
  if(goog.isDef(b.logo) ? b.logo : 1) {
    c = goog.isDef(b.logoOptions) ? b.logoOptions : void 0, a.push(new ol.control.Logo(c))
  }
  if(goog.isDef(b.zoom) ? b.zoom : 1) {
    b = goog.isDef(b.zoomOptions) ? b.zoomOptions : void 0, a.push(new ol.control.Zoom(b))
  }
  return a
};
ol.Kinetic = function(a, b, c) {
  this.decay_ = a;
  this.minVelocity_ = b;
  this.delay_ = c;
  this.points_ = [];
  this.initialVelocity_ = this.angle_ = 0
};
ol.Kinetic.prototype.begin = function() {
  this.initialVelocity_ = this.angle_ = this.points_.length = 0
};
ol.Kinetic.prototype.ol_Kinetic_prototype$update = function(a, b) {
  this.points_.push(a, b, goog.now())
};
ol.Kinetic.prototype.ol_Kinetic_prototype$end = function() {
  var a = goog.now() - this.delay_, b = this.points_.length - 3;
  if(this.points_[b + 2] < a) {
    return!1
  }
  for(var c = b - 3;0 <= c && this.points_[c + 2] > a;) {
    c -= 3
  }
  if(0 <= c) {
    var a = this.points_[b + 2] - this.points_[c + 2], d = this.points_[b] - this.points_[c], b = this.points_[b + 1] - this.points_[c + 1];
    this.angle_ = Math.atan2(b, d);
    this.initialVelocity_ = Math.sqrt(d * d + b * b) / a;
    return this.initialVelocity_ > this.minVelocity_
  }
  return!1
};
ol.Kinetic.prototype.pan = function(a) {
  var b = this.decay_, c = this.initialVelocity_, d = this.minVelocity_, e = this.getDuration_();
  return ol.animation.pan({source:a, duration:e, easing:function(a) {
    return c * (Math.exp(b * a * e) - 1) / (d - c)
  }})
};
ol.Kinetic.prototype.getDuration_ = function() {
  return Math.log(this.minVelocity_ / this.initialVelocity_) / this.decay_
};
ol.Kinetic.prototype.getDistance = function() {
  return(this.minVelocity_ - this.initialVelocity_) / this.decay_
};
ol.Kinetic.prototype.getAngle = function() {
  return this.angle_
};
ol.interaction = {};
ol.interaction.Interaction = function() {
  ol.Observable.call(this);
  this.ol_interaction_Interaction$map_ = null
};
goog.inherits(ol.interaction.Interaction, ol.Observable);
ol.interaction.Interaction.prototype.ol_interaction_Interaction_prototype$getMap = function() {
  return this.ol_interaction_Interaction$map_
};
ol.interaction.Interaction.prototype.setMap = function(a) {
  this.ol_interaction_Interaction$map_ = a
};
ol.interaction.Interaction.pan = function(a, b, c, d) {
  var e = b.getCenter();
  goog.isDef(e) && (goog.isDef(d) && 0 < d && a.beforeRender(ol.animation.pan({source:e, duration:d, easing:ol.easing.linear})), a = b.constrainCenter([e[0] + c[0], e[1] + c[1]]), b.ol_View2D_prototype$setCenter(a))
};
ol.interaction.Interaction.rotate = function(a, b, c, d, e) {
  c = b.constrainRotation(c, 0);
  ol.interaction.Interaction.rotateWithoutConstraints(a, b, c, d, e)
};
ol.interaction.Interaction.rotateWithoutConstraints = function(a, b, c, d, e) {
  if(goog.isDefAndNotNull(c)) {
    var f = b.ol_IView2D_prototype$getRotation(), g = b.getCenter();
    goog.isDef(f) && (goog.isDef(g) && goog.isDef(e) && 0 < e) && (a.beforeRender(ol.animation.rotate({rotation:f, duration:e, easing:ol.easing.easeOut})), goog.isDef(d) && a.beforeRender(ol.animation.pan({source:g, duration:e, easing:ol.easing.easeOut})));
    if(goog.isDefAndNotNull(d)) {
      var h = b.calculateCenterRotate(c, d);
      a.withFrozenRendering(function() {
        b.ol_View2D_prototype$setCenter(h);
        b.setRotation(c)
      })
    }else {
      b.setRotation(c)
    }
  }
};
ol.interaction.Interaction.zoom = function(a, b, c, d, e, f) {
  c = b.constrainResolution(c, 0, f);
  ol.interaction.Interaction.zoomWithoutConstraints(a, b, c, d, e)
};
ol.interaction.Interaction.zoomByDelta = function(a, b, c, d, e) {
  var f = b.ol_IView2D_prototype$getResolution();
  c = b.constrainResolution(f, c, 0);
  ol.interaction.Interaction.zoomWithoutConstraints(a, b, c, d, e)
};
ol.interaction.Interaction.zoomWithoutConstraints = function(a, b, c, d, e) {
  if(goog.isDefAndNotNull(c)) {
    var f = b.ol_IView2D_prototype$getResolution(), g = b.getCenter();
    goog.isDef(f) && (goog.isDef(g) && goog.isDef(e) && 0 < e) && (a.beforeRender(ol.animation.zoom({resolution:f, duration:e, easing:ol.easing.easeOut})), goog.isDef(d) && a.beforeRender(ol.animation.pan({source:g, duration:e, easing:ol.easing.easeOut})));
    if(goog.isDefAndNotNull(d)) {
      var h = b.calculateCenterZoom(c, d);
      a.withFrozenRendering(function() {
        b.ol_View2D_prototype$setCenter(h);
        b.setResolution(c)
      })
    }else {
      b.setResolution(c)
    }
  }
};
ol.interaction.DoubleClickZoom = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_interaction_DoubleClickZoom$delta_ = goog.isDef(a.delta) ? a.delta : 1;
  ol.interaction.Interaction.call(this);
  this.ol_interaction_DoubleClickZoom$duration_ = goog.isDef(a.duration) ? a.duration : 250
};
goog.inherits(ol.interaction.DoubleClickZoom, ol.interaction.Interaction);
ol.interaction.DoubleClickZoom.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = !1, c = a.browserEvent;
  if(a.type == ol.MapBrowserEvent.EventType.DBLCLICK) {
    var b = a.map, d = a.ol_MapBrowserEvent_prototype$getCoordinate(), c = c.goog_events_BrowserEvent_prototype$shiftKey ? -this.ol_interaction_DoubleClickZoom$delta_ : this.ol_interaction_DoubleClickZoom$delta_, e = b.getView().getView2D();
    ol.interaction.Interaction.zoomByDelta(b, e, c, d, this.ol_interaction_DoubleClickZoom$duration_);
    a.goog_events_Event_prototype$preventDefault();
    b = !0
  }
  return!b
};
ol.events = {};
ol.events.condition = {};
ol.events.condition.altKeyOnly = function(a) {
  a = a.browserEvent;
  return a.goog_events_BrowserEvent_prototype$altKey && !a.platformModifierKey && !a.goog_events_BrowserEvent_prototype$shiftKey
};
ol.events.condition.altShiftKeysOnly = function(a) {
  a = a.browserEvent;
  return a.goog_events_BrowserEvent_prototype$altKey && !a.platformModifierKey && a.goog_events_BrowserEvent_prototype$shiftKey
};
ol.events.condition.always = goog.functions.TRUE;
ol.events.condition.singleClick = function(a) {
  return a.type == ol.MapBrowserEvent.EventType.SINGLECLICK
};
ol.events.condition.noModifierKeys = function(a) {
  a = a.browserEvent;
  return!a.goog_events_BrowserEvent_prototype$altKey && !a.platformModifierKey && !a.goog_events_BrowserEvent_prototype$shiftKey
};
ol.events.condition.platformModifierKeyOnly = function(a) {
  a = a.browserEvent;
  return!a.goog_events_BrowserEvent_prototype$altKey && a.platformModifierKey && !a.goog_events_BrowserEvent_prototype$shiftKey
};
ol.events.condition.shiftKeyOnly = function(a) {
  a = a.browserEvent;
  return!a.goog_events_BrowserEvent_prototype$altKey && !a.platformModifierKey && a.goog_events_BrowserEvent_prototype$shiftKey
};
ol.events.condition.targetNotEditable = function(a) {
  a = a.browserEvent.target.tagName;
  return a !== goog.dom.TagName.INPUT && a !== goog.dom.TagName.SELECT && a !== goog.dom.TagName.TEXTAREA
};
ol.interaction.Drag = function() {
  ol.interaction.Interaction.call(this);
  this.dragging_ = !1;
  this.ol_interaction_Drag$deltaY = this.ol_interaction_Drag$deltaX = this.startY = this.startX = 0;
  this.startCoordinate = this.startCenter = null
};
goog.inherits(ol.interaction.Drag, ol.interaction.Interaction);
ol.interaction.Drag.prototype.getDragging = function() {
  return this.dragging_
};
ol.interaction.Drag.prototype.handleDrag = goog.nullFunction;
ol.interaction.Drag.prototype.handleDragEnd = goog.nullFunction;
ol.interaction.Drag.prototype.handleDragStart = goog.functions.FALSE;
ol.interaction.Drag.prototype.handleDown = goog.nullFunction;
ol.interaction.Drag.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = a.map;
  if(!b.isDef()) {
    return!0
  }
  var c = !1, d = b.getView(), b = a.browserEvent;
  a.type == ol.MapBrowserEvent.EventType.DOWN && this.handleDown(a);
  this.dragging_ ? a.type == ol.MapBrowserEvent.EventType.DRAG ? (this.ol_interaction_Drag$deltaX = b.clientX - this.startX, this.ol_interaction_Drag$deltaY = b.clientY - this.startY, this.handleDrag(a)) : a.type == ol.MapBrowserEvent.EventType.DRAGEND && (this.ol_interaction_Drag$deltaX = b.clientX - this.startX, this.ol_interaction_Drag$deltaY = b.clientY - this.startY, this.dragging_ = !1, this.handleDragEnd(a)) : a.type == ol.MapBrowserEvent.EventType.DRAGSTART && (d = d.getView2D().getView2DState(), 
  this.startX = b.clientX, this.startY = b.clientY, this.ol_interaction_Drag$deltaY = this.ol_interaction_Drag$deltaX = 0, this.startCenter = d.center, this.startCoordinate = a.ol_MapBrowserEvent_prototype$getCoordinate(), this.handleDragStart(a) && (this.dragging_ = !0, a.goog_events_Event_prototype$preventDefault(), c = !0));
  return!c
};
ol.interaction.DragPan = function(a) {
  ol.interaction.Drag.call(this);
  a = goog.isDef(a) ? a : {};
  this.ol_interaction_DragPan$condition_ = goog.isDef(a.condition) ? a.condition : ol.events.condition.noModifierKeys;
  this.ol_interaction_DragPan$kinetic_ = a.kinetic;
  this.ol_interaction_DragPan$kineticPreRenderFn_ = null
};
goog.inherits(ol.interaction.DragPan, ol.interaction.Drag);
ol.interaction.DragPan.prototype.handleDrag = function(a) {
  this.ol_interaction_DragPan$kinetic_ && this.ol_interaction_DragPan$kinetic_.ol_Kinetic_prototype$update(a.browserEvent.clientX, a.browserEvent.clientY);
  a = a.map;
  var b = a.getView(), c = b.getView2DState(), d = [-c.resolution * this.ol_interaction_Drag$deltaX, c.resolution * this.ol_interaction_Drag$deltaY];
  ol.coordinate.rotate(d, c.rotation);
  ol.coordinate.add(d, this.startCenter);
  d = b.constrainCenter(d);
  a.requestRenderFrame();
  b.ol_View2D_prototype$setCenter(d)
};
ol.interaction.DragPan.prototype.handleDragEnd = function(a) {
  a = a.map;
  var b = a.getView();
  b.setHint(ol.ViewHint.INTERACTING, -1);
  if(this.ol_interaction_DragPan$kinetic_ && this.ol_interaction_DragPan$kinetic_.ol_Kinetic_prototype$end()) {
    var b = b.getView2D(), c = b.getView2DState(), d = this.ol_interaction_DragPan$kinetic_.getDistance(), e = this.ol_interaction_DragPan$kinetic_.getAngle();
    this.ol_interaction_DragPan$kineticPreRenderFn_ = this.ol_interaction_DragPan$kinetic_.pan(c.center);
    a.beforeRender(this.ol_interaction_DragPan$kineticPreRenderFn_);
    c = a.getPixelFromCoordinate(c.center);
    d = a.getCoordinateFromPixel([c[0] - d * Math.cos(e), c[1] - d * Math.sin(e)]);
    d = b.constrainCenter(d);
    b.ol_View2D_prototype$setCenter(d)
  }
  a.requestRenderFrame()
};
ol.interaction.DragPan.prototype.handleDragStart = function(a) {
  var b = a.browserEvent;
  return b.isMouseActionButton() && this.ol_interaction_DragPan$condition_(a) ? (this.ol_interaction_DragPan$kinetic_ && (this.ol_interaction_DragPan$kinetic_.begin(), this.ol_interaction_DragPan$kinetic_.ol_Kinetic_prototype$update(b.clientX, b.clientY)), a = a.map, a.getView().setHint(ol.ViewHint.INTERACTING, 1), a.requestRenderFrame(), !0) : !1
};
ol.interaction.DragPan.prototype.handleDown = function(a) {
  var b = a.map, c = b.getView();
  !goog.isNull(this.ol_interaction_DragPan$kineticPreRenderFn_) && b.removePreRenderFunction(this.ol_interaction_DragPan$kineticPreRenderFn_) && (b.requestRenderFrame(), c.ol_View2D_prototype$setCenter(a.frameState.view2DState.center), this.ol_interaction_DragPan$kineticPreRenderFn_ = null)
};
ol.interaction.DRAGROTATE_ANIMATION_DURATION = 250;
ol.interaction.DragRotate = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.interaction.Drag.call(this);
  this.ol_interaction_DragRotate$condition_ = goog.isDef(a.condition) ? a.condition : ol.events.condition.altShiftKeysOnly;
  this.ol_interaction_DragRotate$lastAngle_ = void 0
};
goog.inherits(ol.interaction.DragRotate, ol.interaction.Drag);
ol.interaction.DragRotate.prototype.handleDrag = function(a) {
  var b = a.map, c = b.getSize();
  a = a.getPixel();
  c = Math.atan2(c[1] / 2 - a[1], a[0] - c[0] / 2);
  if(goog.isDef(this.ol_interaction_DragRotate$lastAngle_)) {
    a = c - this.ol_interaction_DragRotate$lastAngle_;
    var d = b.getView().getView2D(), e = d.getView2DState();
    b.requestRenderFrame();
    ol.interaction.Interaction.rotateWithoutConstraints(b, d, e.rotation - a)
  }
  this.ol_interaction_DragRotate$lastAngle_ = c
};
ol.interaction.DragRotate.prototype.handleDragEnd = function(a) {
  a = a.map;
  var b = a.getView();
  b.setHint(ol.ViewHint.INTERACTING, -1);
  var b = b.getView2D(), c = b.getView2DState();
  ol.interaction.Interaction.rotate(a, b, c.rotation, void 0, ol.interaction.DRAGROTATE_ANIMATION_DURATION)
};
ol.interaction.DragRotate.prototype.handleDragStart = function(a) {
  return a.browserEvent.isMouseActionButton() && this.ol_interaction_DragRotate$condition_(a) ? (a = a.map, a.getView().setHint(ol.ViewHint.INTERACTING, 1), a.requestRenderFrame(), this.ol_interaction_DragRotate$lastAngle_ = void 0, !0) : !1
};
ol.geom = {};
ol.geom.GeometryType = {POINT:"Point", LINE_STRING:"LineString", LINEAR_RING:"LinearRing", POLYGON:"Polygon", MULTI_POINT:"MultiPoint", MULTI_LINE_STRING:"MultiLineString", MULTI_POLYGON:"MultiPolygon", GEOMETRY_COLLECTION:"GeometryCollection", CIRCLE:"Circle"};
ol.geom.GeometryLayout = {XY:"XY", XYZ:"XYZ", XYM:"XYM", XYZM:"XYZM"};
ol.geom.Geometry = function() {
  ol.Observable.call(this);
  this.extent = void 0;
  this.extentRevision = -1;
  this.simplifiedGeometryCache = {};
  this.simplifiedGeometryRevision = this.simplifiedGeometryMaxMinSquaredTolerance = 0
};
goog.inherits(ol.geom.Geometry, ol.Observable);
ol.geom.Geometry.prototype.getClosestPoint = function(a, b) {
  var c = goog.isDef(b) ? b : [NaN, NaN];
  this.closestPointXY(a[0], a[1], c, Infinity);
  return c
};
ol.geom.Geometry.prototype.containsCoordinate = function(a) {
  return this.containsXY(a[0], a[1])
};
ol.geom.Geometry.prototype.containsXY = goog.functions.FALSE;
ol.geom.flat = {};
ol.geom.flat.closestPoint = function(a, b, c, d, e, f, g) {
  var h = a[b], k = a[b + 1], l = a[c] - h, m = a[c + 1] - k;
  if(0 !== l || 0 !== m) {
    if(f = ((e - h) * l + (f - k) * m) / (l * l + m * m), 1 < f) {
      b = c
    }else {
      if(0 < f) {
        for(e = 0;e < d;++e) {
          g[e] = goog.math.lerp(a[b + e], a[c + e], f)
        }
        g.length = d;
        return
      }
    }
  }
  for(e = 0;e < d;++e) {
    g[e] = a[b + e]
  }
  g.length = d
};
ol.geom.flat.deflateCoordinate = function(a, b, c, d) {
  var e;
  d = 0;
  for(e = c.length;d < e;++d) {
    a[b++] = c[d]
  }
  return b
};
ol.geom.flat.deflateCoordinates = function(a, b, c, d) {
  var e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    var g = c[e], h;
    for(h = 0;h < d;++h) {
      a[b++] = g[h]
    }
  }
  return b
};
ol.geom.flat.deflateCoordinatess = function(a, b, c, d, e) {
  e = goog.isDef(e) ? e : [];
  var f = 0, g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    b = ol.geom.flat.deflateCoordinates(a, b, c[g], d), e[f++] = b
  }
  e.length = f;
  return e
};
ol.geom.flat.deflateCoordinatesss = function(a, b, c, d, e) {
  e = goog.isDef(e) ? e : [];
  var f = 0, g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    b = ol.geom.flat.deflateCoordinatess(a, b, c[g], d, e[f]), e[f++] = b, b = b[b.length - 1]
  }
  e.length = f;
  return e
};
ol.geom.flat.flipXY = function(a, b, c, d, e, f) {
  goog.isDef(e) ? f = goog.isDef(f) ? f : 0 : (e = [], f = 0);
  for(var g;b < c;) {
    for(g = a[b++], e[f++] = a[b++], e[f++] = g, g = 2;g < d;++g) {
      e[f++] = a[b++]
    }
  }
  e.length = f;
  return e
};
ol.geom.flat.inflateCoordinates = function(a, b, c, d, e) {
  e = goog.isDef(e) ? e : [];
  for(var f = 0;b < c;b += d) {
    e[f++] = a.slice(b, b + d)
  }
  e.length = f;
  return e
};
ol.geom.flat.inflateCoordinatess = function(a, b, c, d, e) {
  e = goog.isDef(e) ? e : [];
  var f = 0, g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    var k = c[g];
    e[f++] = ol.geom.flat.inflateCoordinates(a, b, k, d, e[f]);
    b = k
  }
  e.length = f;
  return e
};
ol.geom.flat.inflateCoordinatesss = function(a, b, c, d, e) {
  e = goog.isDef(e) ? e : [];
  var f = 0, g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    var k = c[g];
    e[f++] = ol.geom.flat.inflateCoordinatess(a, b, k, d, e[f]);
    b = k[k.length - 1]
  }
  e.length = f;
  return e
};
ol.geom.flat.lineStringInterpolate = function(a, b, c, d, e, f) {
  f = goog.isDef(f) ? f : [NaN, NaN];
  var g = (c - b) / d;
  if(0 !== g) {
    if(1 == g) {
      f[0] = a[b], f[1] = a[b + 1]
    }else {
      if(2 == g) {
        f[0] = (1 - e) * a[b] + e * a[b + d], f[1] = (1 - e) * a[b + 1] + e * a[b + d + 1]
      }else {
        var h = a[b], k = a[b + 1], l = 0, g = [0], m;
        for(m = b + d;m < c;m += d) {
          var n = a[m], p = a[m + 1], l = l + Math.sqrt((n - h) * (n - h) + (p - k) * (p - k));
          g.push(l);
          h = n;
          k = p
        }
        e *= l;
        c = goog.array.binarySearch(g, e);
        0 > c ? (e = (e - g[-c - 2]) / (g[-c - 1] - g[-c - 2]), b += (-c - 2) * d, f[0] = (1 - e) * a[b] + e * a[b + d], f[1] = (1 - e) * a[b + 1] + e * a[b + d + 1]) : (f[0] = a[b + c * d], f[1] = a[b + c * d + 1])
      }
    }
  }
  return f
};
ol.geom.flat.lineStringLength = function(a, b, c, d) {
  var e = a[b], f = a[b + 1], g = 0;
  for(b += d;b < c;b += d) {
    var h = a[b], k = a[b + 1], g = g + Math.sqrt((h - e) * (h - e) + (k - f) * (k - f)), e = h, f = k
  }
  return g
};
ol.geom.flat.linearRingArea = function(a, b, c, d) {
  for(var e = 0, f = a[c - d], g = a[c - d + 1];b < c;b += d) {
    var h = a[b], k = a[b + 1], e = e + (g * h - f * k), f = h, g = k
  }
  return e / 2
};
ol.geom.flat.linearRingContainsXY = function(a, b, c, d, e, f) {
  for(var g = !1, h = a[c - d], k = a[c - d + 1];b < c;b += d) {
    var l = a[b], m = a[b + 1];
    k > f != m > f && e < (l - h) * (f - k) / (m - k) + h && (g = !g);
    h = l;
    k = m
  }
  return g
};
ol.geom.flat.linearRingIsClockwise = function(a, b, c, d) {
  for(var e = 0, f = a[c - d], g = a[c - d + 1];b < c;b += d) {
    var h = a[b], k = a[b + 1], e = e + (h - f) * (k + g), f = h, g = k
  }
  return 0 < e
};
ol.geom.flat.linearRingMidY = function(a, b, c, d) {
  for(var e = Infinity, f = -Infinity;b < c;b += d) {
    var g = a[b + 1], e = Math.min(e, g), f = Math.max(f, g)
  }
  return(e + f) / 2
};
ol.geom.flat.linearRingPerimeter = function(a, b, c, d) {
  var e = ol.geom.flat.lineStringLength(a, b, c, d), f = a[c - d] - a[b];
  a = a[c - d + 1] - a[b + 1];
  return e += Math.sqrt(f * f + a * a)
};
ol.geom.flat.linearRingsArea = function(a, b, c, d) {
  var e = 0, f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f], e = e + ol.geom.flat.linearRingArea(a, b, h, d);
    b = h
  }
  return e
};
ol.geom.flat.linearRingsContainsXY = function(a, b, c, d, e, f) {
  if(0 === c.length || !ol.geom.flat.linearRingContainsXY(a, b, c[0], d, e, f)) {
    return!1
  }
  var g;
  b = 1;
  for(g = c.length;b < g;++b) {
    if(ol.geom.flat.linearRingContainsXY(a, c[b - 1], c[b], d, e, f)) {
      return!1
    }
  }
  return!0
};
ol.geom.flat.linearRingsGetInteriorPoint = function(a, b, c, d, e, f) {
  var g, h, k, l, m, n = [], p = c[0];
  h = a[p - d];
  l = a[p - d + 1];
  for(g = b;g < p;g += d) {
    k = a[g];
    m = a[g + 1];
    if(e <= l && m <= e || l <= e && e <= m) {
      h = (e - l) / (m - l) * (k - h) + h, n.push(h)
    }
    h = k;
    l = m
  }
  goog.isDef(f) ? (m = f, m[0] = NaN, m[1] = e) : m = [NaN, e];
  p = -Infinity;
  n.sort();
  h = n[0];
  g = 1;
  for(f = n.length;g < f;++g) {
    k = n[g], l = Math.abs(k - h), l > p && (h = (h + k) / 2, ol.geom.flat.linearRingsContainsXY(a, b, c, d, h, e) && (m[0] = h, p = l)), h = k
  }
  return m
};
ol.geom.flat.linearRingsAreOriented = function(a, b, c, d) {
  var e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    var g = c[e];
    b = ol.geom.flat.linearRingIsClockwise(a, b, g, d);
    if(0 === e ? !b : b) {
      return!1
    }
    b = g
  }
  return!0
};
ol.geom.flat.linearRingssAreOriented = function(a, b, c, d) {
  var e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    if(!ol.geom.flat.linearRingsAreOriented(a, b, c[e], d)) {
      return!1
    }
  }
  return!0
};
ol.geom.flat.linearRingssArea = function(a, b, c, d) {
  var e = 0, f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f], e = e + ol.geom.flat.linearRingsArea(a, b, h, d);
    b = h[h.length - 1]
  }
  return e
};
ol.geom.flat.linearRingssContainsXY = function(a, b, c, d, e, f) {
  if(0 === c.length) {
    return!1
  }
  var g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    var k = c[g];
    if(ol.geom.flat.linearRingsContainsXY(a, b, k, d, e, f)) {
      return!0
    }
    b = k[k.length - 1]
  }
  return!1
};
ol.geom.flat.linearRingssGetInteriorPoints = function(a, b, c, d, e) {
  var f = [], g, h;
  g = 0;
  for(h = c.length;g < h;++g) {
    var k = c[g];
    f.push(ol.geom.flat.linearRingsGetInteriorPoint(a, b, k, d, e[g]));
    b = k[k.length - 1]
  }
  return f
};
ol.geom.flat.linearRingssMidYs = function(a, b, c, d) {
  var e = [], f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f];
    e.push(ol.geom.flat.linearRingMidY(a, b, h[0], d));
    b = h[h.length - 1]
  }
  return e
};
ol.geom.flat.orientLinearRings = function(a, b, c, d) {
  var e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    var g = c[e], h = ol.geom.flat.linearRingIsClockwise(a, b, g, d);
    (0 === e ? !h : h) && ol.geom.flat.reverseCoordinates(a, b, g, d);
    b = g
  }
  return b
};
ol.geom.flat.orientLinearRingss = function(a, b, c, d) {
  var e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    b = ol.geom.flat.orientLinearRings(a, b, c[e], d)
  }
  return b
};
ol.geom.flat.reverseCoordinates = function(a, b, c, d) {
  for(;b < c - d;) {
    var e;
    for(e = 0;e < d;++e) {
      var f = a[b + e];
      a[b + e] = a[c - d + e];
      a[c - d + e] = f
    }
    b += d;
    c -= d
  }
};
ol.geom.flat.squaredSegmentDistance = function(a, b, c, d, e, f) {
  var g = e - c, h = f - d;
  if(0 !== g || 0 !== h) {
    var k = ((a - c) * g + (b - d) * h) / (g * g + h * h);
    1 < k ? (c = e, d = f) : 0 < k && (c += g * k, d += h * k)
  }
  return ol.geom.flat.squaredDistance(a, b, c, d)
};
ol.geom.flat.squaredDistance = function(a, b, c, d) {
  a = c - a;
  b = d - b;
  return a * a + b * b
};
ol.geom.flat.transform2D = function(a, b, c, d) {
  var e = goog.vec.Mat4.getElement(c, 0, 0), f = goog.vec.Mat4.getElement(c, 1, 0), g = goog.vec.Mat4.getElement(c, 0, 1), h = goog.vec.Mat4.getElement(c, 1, 1), k = goog.vec.Mat4.getElement(c, 0, 3);
  c = goog.vec.Mat4.getElement(c, 1, 3);
  var l = goog.isDef(d) ? d : [], m = 0, n, p;
  n = 0;
  for(p = a.length;n < p;n += b) {
    var q = a[n], r = a[n + 1];
    l[m++] = e * q + g * r + k;
    l[m++] = f * q + h * r + c
  }
  goog.isDef(d) && l.length != m && (l.length = m);
  return l
};
ol.geom.SimpleGeometry = function() {
  ol.geom.Geometry.call(this);
  this.layout = ol.geom.GeometryLayout.XY;
  this.stride = 2;
  this.flatCoordinates = null
};
goog.inherits(ol.geom.SimpleGeometry, ol.geom.Geometry);
ol.geom.SimpleGeometry.getLayoutForStride_ = function(a) {
  if(2 == a) {
    return ol.geom.GeometryLayout.XY
  }
  if(3 == a) {
    return ol.geom.GeometryLayout.XYZ
  }
  if(4 == a) {
    return ol.geom.GeometryLayout.XYZM
  }
  throw Error("unsupported stride: " + a);
};
ol.geom.SimpleGeometry.getStrideForLayout_ = function(a) {
  if(a == ol.geom.GeometryLayout.XY) {
    return 2
  }
  if(a == ol.geom.GeometryLayout.XYZ || a == ol.geom.GeometryLayout.XYM) {
    return 3
  }
  if(a == ol.geom.GeometryLayout.XYZM) {
    return 4
  }
  throw Error("unsupported layout: " + a);
};
ol.geom.SimpleGeometry.prototype.containsXY = goog.functions.FALSE;
ol.geom.SimpleGeometry.prototype.ol_geom_Geometry_prototype$getExtent = function(a) {
  this.extentRevision != this.getRevision() && (this.extent = ol.extent.createOrUpdateFromFlatCoordinates(this.flatCoordinates, this.stride, this.extent), this.extentRevision = this.getRevision());
  return ol.extent.returnOrUpdate(this.extent, a)
};
ol.geom.SimpleGeometry.prototype.getFlatCoordinates = function() {
  return this.flatCoordinates
};
ol.geom.SimpleGeometry.prototype.getLayout = function() {
  return this.layout
};
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometry = function(a) {
  this.simplifiedGeometryRevision != this.getRevision() && (goog.object.clear(this.simplifiedGeometryCache), this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision());
  if(0 > a || 0 !== this.simplifiedGeometryMaxMinSquaredTolerance && a <= this.simplifiedGeometryMaxMinSquaredTolerance) {
    return this
  }
  var b = a.toString();
  if(this.simplifiedGeometryCache.hasOwnProperty(b)) {
    return this.simplifiedGeometryCache[b]
  }
  var c = this.getSimplifiedGeometryInternal(a);
  if(c.getFlatCoordinates().length < this.flatCoordinates.length) {
    return this.simplifiedGeometryCache[b] = c
  }
  this.simplifiedGeometryMaxMinSquaredTolerance = a;
  return this
};
ol.geom.SimpleGeometry.prototype.getSimplifiedGeometryInternal = function(a) {
  return this
};
ol.geom.SimpleGeometry.prototype.getStride = function() {
  return this.stride
};
ol.geom.SimpleGeometry.prototype.setFlatCoordinatesInternal = function(a, b) {
  this.stride = ol.geom.SimpleGeometry.getStrideForLayout_(a);
  this.layout = a;
  this.flatCoordinates = b
};
ol.geom.SimpleGeometry.prototype.setLayout = function(a, b, c) {
  if(goog.isDef(a)) {
    b = ol.geom.SimpleGeometry.getStrideForLayout_(a)
  }else {
    for(a = 0;a < c;++a) {
      if(0 === b.length) {
        this.layout = ol.geom.GeometryLayout.XY;
        this.stride = 2;
        return
      }
      b = b[0]
    }
    b = b.length;
    a = ol.geom.SimpleGeometry.getLayoutForStride_(b)
  }
  this.layout = a;
  this.stride = b
};
ol.geom.SimpleGeometry.prototype.transform = function(a) {
  goog.isNull(this.flatCoordinates) || (a(this.flatCoordinates, this.flatCoordinates, this.stride), this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.geom.transformSimpleGeometry2D = function(a, b, c) {
  var d = a.getFlatCoordinates();
  if(goog.isNull(d)) {
    return null
  }
  a = a.getStride();
  return ol.geom.flat.transform2D(d, a, b, c)
};
ol.geom.closest = {};
ol.geom.closest.getMaxSquaredDelta = function(a, b, c, d, e) {
  var f = a[b], g = a[b + 1];
  for(b += d;b < c;b += d) {
    var h = a[b], k = a[b + 1], f = ol.geom.flat.squaredDistance(f, g, h, k);
    f > e && (e = f);
    f = h;
    g = k
  }
  return e
};
ol.geom.closest.getsMaxSquaredDelta = function(a, b, c, d, e) {
  var f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f];
    e = ol.geom.closest.getMaxSquaredDelta(a, b, h, d, e);
    b = h
  }
  return e
};
ol.geom.closest.getssMaxSquaredDelta = function(a, b, c, d, e) {
  var f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f];
    e = ol.geom.closest.getsMaxSquaredDelta(a, b, h, d, e);
    b = h[h.length - 1]
  }
  return e
};
ol.geom.closest.getClosestPoint = function(a, b, c, d, e, f, g, h, k, l, m) {
  if(b == c) {
    return l
  }
  var n;
  if(0 === e) {
    n = ol.geom.flat.squaredDistance(g, h, a[b], a[b + 1]);
    if(n < l) {
      for(m = 0;m < d;++m) {
        k[m] = a[b + m]
      }
      k.length = d;
      return n
    }
    return l
  }
  for(var p = goog.isDef(m) ? m : [NaN, NaN], q = b + d;q < c;) {
    if(ol.geom.flat.closestPoint(a, q - d, q, d, g, h, p), n = ol.geom.flat.squaredDistance(g, h, p[0], p[1]), n < l) {
      l = n;
      for(m = 0;m < d;++m) {
        k[m] = p[m]
      }
      k.length = d;
      q += d
    }else {
      q += d * Math.max((Math.sqrt(n) - Math.sqrt(l)) / e | 0, 1)
    }
  }
  if(f && (ol.geom.flat.closestPoint(a, c - d, b, d, g, h, p), n = ol.geom.flat.squaredDistance(g, h, p[0], p[1]), n < l)) {
    l = n;
    for(m = 0;m < d;++m) {
      k[m] = p[m]
    }
    k.length = d
  }
  return l
};
ol.geom.closest.getsClosestPoint = function(a, b, c, d, e, f, g, h, k, l, m) {
  m = goog.isDef(m) ? m : [NaN, NaN];
  var n, p;
  n = 0;
  for(p = c.length;n < p;++n) {
    var q = c[n];
    l = ol.geom.closest.getClosestPoint(a, b, q, d, e, f, g, h, k, l, m);
    b = q
  }
  return l
};
ol.geom.closest.getssClosestPoint = function(a, b, c, d, e, f, g, h, k, l, m) {
  m = goog.isDef(m) ? m : [NaN, NaN];
  var n, p;
  n = 0;
  for(p = c.length;n < p;++n) {
    var q = c[n];
    l = ol.geom.closest.getsClosestPoint(a, b, q, d, e, f, g, h, k, l, m);
    b = q[q.length - 1]
  }
  return l
};
ol.geom.simplify = {};
ol.geom.simplify.lineString = function(a, b, c, d, e, f, g) {
  g = goog.isDef(g) ? g : [];
  f || (c = ol.geom.simplify.radialDistance(a, b, c, d, e, g, 0), a = g, b = 0, d = 2);
  g.length = ol.geom.simplify.douglasPeucker(a, b, c, d, e, g, 0);
  return g
};
ol.geom.simplify.douglasPeucker = function(a, b, c, d, e, f, g) {
  var h = (c - b) / d;
  if(3 > h) {
    for(;b < c;b += d) {
      f[g++] = a[b], f[g++] = a[b + 1]
    }
    return g
  }
  var k = new (goog.global.Uint8Array ? Uint8Array : Array)(h);
  k[0] = 1;
  k[h - 1] = 1;
  c = [b, c - d];
  for(var l = 0, m;0 < c.length;) {
    var n = c.pop(), p = c.pop(), q = 0, r = a[p], x = a[p + 1], s = a[n], t = a[n + 1];
    for(m = p + d;m < n;m += d) {
      var v = ol.geom.flat.squaredSegmentDistance(a[m], a[m + 1], r, x, s, t);
      v > q && (l = m, q = v)
    }
    q > e && (k[(l - b) / d] = 1, p + d < l && c.push(p, l), l + d < n && c.push(l, n))
  }
  for(m = 0;m < h;++m) {
    k[m] && (f[g++] = a[b + m * d], f[g++] = a[b + m * d + 1])
  }
  return g
};
ol.geom.simplify.douglasPeuckers = function(a, b, c, d, e, f, g, h) {
  var k, l;
  k = 0;
  for(l = c.length;k < l;++k) {
    var m = c[k];
    g = ol.geom.simplify.douglasPeucker(a, b, m, d, e, f, g);
    h.push(g);
    b = m
  }
  return g
};
ol.geom.simplify.douglasPeuckerss = function(a, b, c, d, e, f, g, h) {
  var k, l;
  k = 0;
  for(l = c.length;k < l;++k) {
    var m = c[k], n = [];
    g = ol.geom.simplify.douglasPeuckers(a, b, m, d, e, f, g, n);
    h.push(n);
    b = m[m.length - 1]
  }
  return g
};
ol.geom.simplify.radialDistance = function(a, b, c, d, e, f, g) {
  if(c <= b + d) {
    for(;b < c;b += d) {
      f[g++] = a[b], f[g++] = a[b + 1]
    }
    return g
  }
  var h = a[b], k = a[b + 1];
  f[g++] = h;
  f[g++] = k;
  var l = h, m = k;
  for(b += d;b < c;b += d) {
    l = a[b], m = a[b + 1], ol.geom.flat.squaredDistance(h, k, l, m) > e && (f[g++] = l, f[g++] = m, h = l, k = m)
  }
  if(l != h || m != k) {
    f[g++] = l, f[g++] = m
  }
  return g
};
ol.geom.simplify.snap = function(a, b) {
  return b * Math.round(a / b)
};
ol.geom.simplify.quantize = function(a, b, c, d, e, f, g) {
  if(b == c) {
    return g
  }
  var h = ol.geom.simplify.snap(a[b], e), k = ol.geom.simplify.snap(a[b + 1], e);
  b += d;
  f[g++] = h;
  f[g++] = k;
  var l, m;
  do {
    if(l = ol.geom.simplify.snap(a[b], e), m = ol.geom.simplify.snap(a[b + 1], e), b += d, b == c) {
      return f[g++] = l, f[g++] = m, g
    }
  }while(l == h && m == k);
  for(;b < c;) {
    var n, p;
    n = ol.geom.simplify.snap(a[b], e);
    p = ol.geom.simplify.snap(a[b + 1], e);
    b += d;
    if(n != l || p != m) {
      var q = l - h, r = m - k, x = n - h, s = p - k;
      q * s == r * x && (0 > q && x < q || q == x || 0 < q && x > q) && (0 > r && s < r || r == s || 0 < r && s > r) || (f[g++] = l, f[g++] = m, h = l, k = m);
      l = n;
      m = p
    }
  }
  f[g++] = l;
  f[g++] = m;
  return g
};
ol.geom.simplify.quantizes = function(a, b, c, d, e, f, g, h) {
  var k, l;
  k = 0;
  for(l = c.length;k < l;++k) {
    var m = c[k];
    g = ol.geom.simplify.quantize(a, b, m, d, e, f, g);
    h.push(g);
    b = m
  }
  return g
};
ol.geom.simplify.quantizess = function(a, b, c, d, e, f, g, h) {
  var k, l;
  k = 0;
  for(l = c.length;k < l;++k) {
    var m = c[k], n = [];
    g = ol.geom.simplify.quantizes(a, b, m, d, e, f, g, n);
    h.push(n);
    b = m[m.length - 1]
  }
  return g
};
ol.geom.LinearRing = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_LinearRing$maxDeltaRevision_ = this.ol_geom_LinearRing$maxDelta_ = -1;
  this.ol_geom_LinearRing_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.LinearRing, ol.geom.SimpleGeometry);
ol.geom.LinearRing.prototype.clone = function() {
  var a = new ol.geom.LinearRing(null);
  a.ol_geom_LinearRing_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return a
};
ol.geom.LinearRing.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  this.ol_geom_LinearRing$maxDeltaRevision_ != this.getRevision() && (this.ol_geom_LinearRing$maxDelta_ = Math.sqrt(ol.geom.closest.getMaxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)), this.ol_geom_LinearRing$maxDeltaRevision_ = this.getRevision());
  return ol.geom.closest.getClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.ol_geom_LinearRing$maxDelta_, !0, a, b, c, d)
};
ol.geom.LinearRing.prototype.getArea = function() {
  return ol.geom.flat.linearRingArea(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
};
ol.geom.LinearRing.prototype.ol_geom_LinearRing_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
};
ol.geom.LinearRing.prototype.getSimplifiedGeometryInternal = function(a) {
  var b = [];
  b.length = ol.geom.simplify.douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, a, b, 0);
  a = new ol.geom.LinearRing(null);
  a.ol_geom_LinearRing_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, b);
  return a
};
ol.geom.LinearRing.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.LINEAR_RING
};
ol.geom.LinearRing.prototype.ol_geom_LinearRing_prototype$setCoordinates = function(a, b) {
  goog.isNull(a) ? this.ol_geom_LinearRing_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null) : (this.setLayout(b, a, 1), goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []), this.flatCoordinates.length = ol.geom.flat.deflateCoordinates(this.flatCoordinates, 0, a, this.stride), this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.geom.LinearRing.prototype.ol_geom_LinearRing_prototype$setFlatCoordinates = function(a, b) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.Polygon = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_Polygon$ends_ = [];
  this.interiorPointRevision_ = -1;
  this.interiorPoint_ = null;
  this.ol_geom_Polygon$orientedRevision_ = this.ol_geom_Polygon$maxDeltaRevision_ = this.ol_geom_Polygon$maxDelta_ = -1;
  this.ol_geom_Polygon$orientedFlatCoordinates_ = null;
  this.ol_geom_Polygon_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.Polygon, ol.geom.SimpleGeometry);
ol.geom.Polygon.prototype.clone = function() {
  var a = new ol.geom.Polygon(null);
  a.ol_geom_Polygon_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice(), this.ol_geom_Polygon$ends_.slice());
  return a
};
ol.geom.Polygon.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  this.ol_geom_Polygon$maxDeltaRevision_ != this.getRevision() && (this.ol_geom_Polygon$maxDelta_ = Math.sqrt(ol.geom.closest.getsMaxSquaredDelta(this.flatCoordinates, 0, this.ol_geom_Polygon$ends_, this.stride, 0)), this.ol_geom_Polygon$maxDeltaRevision_ = this.getRevision());
  return ol.geom.closest.getsClosestPoint(this.flatCoordinates, 0, this.ol_geom_Polygon$ends_, this.stride, this.ol_geom_Polygon$maxDelta_, !0, a, b, c, d)
};
ol.geom.Polygon.prototype.containsXY = function(a, b) {
  return ol.geom.flat.linearRingsContainsXY(this.ol_geom_Polygon_prototype$getOrientedFlatCoordinates(), 0, this.ol_geom_Polygon$ends_, this.stride, a, b)
};
ol.geom.Polygon.prototype.getArea = function() {
  return ol.geom.flat.linearRingsArea(this.ol_geom_Polygon_prototype$getOrientedFlatCoordinates(), 0, this.ol_geom_Polygon$ends_, this.stride)
};
ol.geom.Polygon.prototype.ol_geom_Polygon_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinatess(this.flatCoordinates, 0, this.ol_geom_Polygon$ends_, this.stride)
};
ol.geom.Polygon.prototype.ol_geom_Polygon_prototype$getEnds = function() {
  return this.ol_geom_Polygon$ends_
};
ol.geom.Polygon.prototype.getInteriorPoint = function() {
  if(this.interiorPointRevision_ != this.getRevision()) {
    var a = this.ol_geom_Geometry_prototype$getExtent(), a = (a[1] + a[3]) / 2;
    this.interiorPoint_ = ol.geom.flat.linearRingsGetInteriorPoint(this.ol_geom_Polygon_prototype$getOrientedFlatCoordinates(), 0, this.ol_geom_Polygon$ends_, this.stride, a);
    this.interiorPointRevision_ = this.getRevision()
  }
  return this.interiorPoint_
};
ol.geom.Polygon.prototype.getLinearRings = function() {
  var a = this.layout, b = this.flatCoordinates, c = this.ol_geom_Polygon$ends_, d = [], e = 0, f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f], k = new ol.geom.LinearRing(null);
    k.ol_geom_LinearRing_prototype$setFlatCoordinates(a, b.slice(e, h));
    d.push(k);
    e = h
  }
  return d
};
ol.geom.Polygon.prototype.ol_geom_Polygon_prototype$getOrientedFlatCoordinates = function() {
  if(this.ol_geom_Polygon$orientedRevision_ != this.getRevision()) {
    var a = this.flatCoordinates;
    ol.geom.flat.linearRingsAreOriented(a, 0, this.ol_geom_Polygon$ends_, this.stride) ? this.ol_geom_Polygon$orientedFlatCoordinates_ = a : (this.ol_geom_Polygon$orientedFlatCoordinates_ = a.slice(), this.ol_geom_Polygon$orientedFlatCoordinates_.length = ol.geom.flat.orientLinearRings(this.ol_geom_Polygon$orientedFlatCoordinates_, 0, this.ol_geom_Polygon$ends_, this.stride));
    this.ol_geom_Polygon$orientedRevision_ = this.getRevision()
  }
  return this.ol_geom_Polygon$orientedFlatCoordinates_
};
ol.geom.Polygon.prototype.getSimplifiedGeometryInternal = function(a) {
  var b = [], c = [];
  b.length = ol.geom.simplify.quantizes(this.flatCoordinates, 0, this.ol_geom_Polygon$ends_, this.stride, Math.sqrt(a), b, 0, c);
  a = new ol.geom.Polygon(null);
  a.ol_geom_Polygon_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, b, c);
  return a
};
ol.geom.Polygon.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.POLYGON
};
ol.geom.Polygon.prototype.ol_geom_Polygon_prototype$setCoordinates = function(a, b) {
  if(goog.isNull(a)) {
    this.ol_geom_Polygon_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ol_geom_Polygon$ends_)
  }else {
    this.setLayout(b, a, 2);
    goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []);
    var c = ol.geom.flat.deflateCoordinatess(this.flatCoordinates, 0, a, this.stride, this.ol_geom_Polygon$ends_);
    this.flatCoordinates.length = 0 === c.length ? 0 : c[c.length - 1];
    this.ol_Observable_prototype$dispatchChangeEvent()
  }
};
ol.geom.Polygon.prototype.ol_geom_Polygon_prototype$setFlatCoordinates = function(a, b, c) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_geom_Polygon$ends_ = c;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.render = {};
ol.render.IRender = function() {
};
ol.render.IRender.prototype.drawAsync = function(a, b) {
};
ol.render.IRender.prototype.drawCircleGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawFeature = function(a, b) {
};
ol.render.IRender.prototype.drawGeometryCollectionGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawPointGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawLineStringGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawMultiLineStringGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawMultiPointGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawMultiPolygonGeometry = function(a, b) {
};
ol.render.IRender.prototype.drawPolygonGeometry = function(a, b) {
};
ol.render.IRender.prototype.setFillStrokeStyle = function(a, b) {
};
ol.render.IRender.prototype.setImageStyle = function(a) {
};
ol.render.IRender.prototype.setTextStyle = function(a) {
};
ol.render.EventType = {POSTCOMPOSE:"postcompose", PRECOMPOSE:"precompose"};
ol.render.Event = function(a, b, c, d, e, f) {
  goog.events.Event.call(this, a, b);
  this.render_ = c;
  this.ol_render_Event$frameState_ = d;
  this.ol_render_Event$context_ = e;
  this.glContext_ = f
};
goog.inherits(ol.render.Event, goog.events.Event);
ol.render.Event.prototype.getContext = function() {
  return this.ol_render_Event$context_
};
ol.render.Event.prototype.getFrameState = function() {
  return this.ol_render_Event$frameState_
};
ol.render.Event.prototype.getGlContext = function() {
  return this.glContext_
};
ol.render.Event.prototype.getRender = function() {
  return this.render_
};
ol.render.Box = function(a) {
  this.geometry_ = this.endPixel_ = this.ol_render_Box$startPixel_ = this.postComposeListenerKey_ = this.ol_render_Box$map_ = null;
  this.style_ = a
};
goog.inherits(ol.render.Box, goog.Disposable);
ol.render.Box.prototype.createGeometry_ = function() {
  var a = this.ol_render_Box$startPixel_, b = this.endPixel_, a = goog.array.map([a, [a[0], b[1]], b, [b[0], a[1]]], this.ol_render_Box$map_.getCoordinateFromPixel, this.ol_render_Box$map_);
  return new ol.geom.Polygon([a])
};
ol.render.Box.prototype.goog_Disposable_prototype$disposeInternal = function() {
  this.setMap(null)
};
ol.render.Box.prototype.handleMapPostCompose_ = function(a) {
  var b = this.geometry_, c = this.style_;
  a.getRender().drawAsync(Infinity, function(a) {
    a.setFillStrokeStyle(c.ol_style_Style_prototype$getFill(), c.ol_style_Style_prototype$getStroke());
    a.drawPolygonGeometry(b, null)
  })
};
ol.render.Box.prototype.ol_render_Box_prototype$getGeometry = function() {
  return this.geometry_
};
ol.render.Box.prototype.requestMapRenderFrame_ = function() {
  goog.isNull(this.ol_render_Box$map_) || (goog.isNull(this.ol_render_Box$startPixel_) || goog.isNull(this.endPixel_)) || this.ol_render_Box$map_.requestRenderFrame()
};
ol.render.Box.prototype.setMap = function(a) {
  goog.isNull(this.postComposeListenerKey_) || (goog.events.unlistenByKey(this.postComposeListenerKey_), this.postComposeListenerKey_ = null, this.ol_render_Box$map_.requestRenderFrame(), this.ol_render_Box$map_ = null);
  this.ol_render_Box$map_ = a;
  goog.isNull(this.ol_render_Box$map_) || (this.postComposeListenerKey_ = goog.events.listen(a, ol.render.EventType.POSTCOMPOSE, this.handleMapPostCompose_, !1, this), this.requestMapRenderFrame_())
};
ol.render.Box.prototype.setPixels = function(a, b) {
  this.ol_render_Box$startPixel_ = a;
  this.endPixel_ = b;
  this.geometry_ = this.createGeometry_();
  this.requestMapRenderFrame_()
};
ol.DRAG_BOX_HYSTERESIS_PIXELS = 8;
ol.DRAG_BOX_HYSTERESIS_PIXELS_SQUARED = ol.DRAG_BOX_HYSTERESIS_PIXELS * ol.DRAG_BOX_HYSTERESIS_PIXELS;
ol.DragBoxEventType = {BOXSTART:"boxstart", BOXEND:"boxend"};
ol.DragBoxEvent = function(a, b) {
  goog.events.Event.call(this, a);
  this.ol_DragBoxEvent$coordinate_ = b
};
goog.inherits(ol.DragBoxEvent, goog.events.Event);
ol.DragBoxEvent.prototype.ol_DragBoxEvent_prototype$getCoordinate = function() {
  return this.ol_DragBoxEvent$coordinate_
};
ol.interaction.DragBox = function(a) {
  ol.interaction.Drag.call(this);
  a = goog.isDef(a) ? a : {};
  var b = goog.isDef(a.style) ? a.style : null;
  this.box_ = new ol.render.Box(b);
  this.ol_interaction_DragBox$startPixel_ = null;
  this.ol_interaction_DragBox$condition_ = goog.isDef(a.condition) ? a.condition : ol.events.condition.always
};
goog.inherits(ol.interaction.DragBox, ol.interaction.Drag);
ol.interaction.DragBox.prototype.handleDrag = function(a) {
  this.box_.setPixels(this.ol_interaction_DragBox$startPixel_, a.getPixel())
};
ol.interaction.DragBox.prototype.ol_interaction_DragBox_prototype$getGeometry = function() {
  return this.box_.ol_render_Box_prototype$getGeometry()
};
ol.interaction.DragBox.prototype.onBoxEnd = goog.nullFunction;
ol.interaction.DragBox.prototype.handleDragEnd = function(a) {
  this.box_.setMap(null);
  this.ol_interaction_Drag$deltaX * this.ol_interaction_Drag$deltaX + this.ol_interaction_Drag$deltaY * this.ol_interaction_Drag$deltaY >= ol.DRAG_BOX_HYSTERESIS_PIXELS_SQUARED && (this.onBoxEnd(a), this.dispatchEvent(new ol.DragBoxEvent(ol.DragBoxEventType.BOXEND, a.ol_MapBrowserEvent_prototype$getCoordinate())))
};
ol.interaction.DragBox.prototype.handleDragStart = function(a) {
  return a.browserEvent.isMouseActionButton() && this.ol_interaction_DragBox$condition_(a) ? (this.ol_interaction_DragBox$startPixel_ = a.getPixel(), this.box_.setMap(a.map), this.box_.setPixels(this.ol_interaction_DragBox$startPixel_, this.ol_interaction_DragBox$startPixel_), this.dispatchEvent(new ol.DragBoxEvent(ol.DragBoxEventType.BOXSTART, a.ol_MapBrowserEvent_prototype$getCoordinate())), !0) : !1
};
goog.color = {};
goog.color.names = {aliceblue:"#f0f8ff", antiquewhite:"#faebd7", aqua:"#00ffff", aquamarine:"#7fffd4", azure:"#f0ffff", beige:"#f5f5dc", bisque:"#ffe4c4", black:"#000000", blanchedalmond:"#ffebcd", blue:"#0000ff", blueviolet:"#8a2be2", brown:"#a52a2a", burlywood:"#deb887", cadetblue:"#5f9ea0", chartreuse:"#7fff00", chocolate:"#d2691e", coral:"#ff7f50", cornflowerblue:"#6495ed", cornsilk:"#fff8dc", crimson:"#dc143c", cyan:"#00ffff", darkblue:"#00008b", darkcyan:"#008b8b", darkgoldenrod:"#b8860b", 
darkgray:"#a9a9a9", darkgreen:"#006400", darkgrey:"#a9a9a9", darkkhaki:"#bdb76b", darkmagenta:"#8b008b", darkolivegreen:"#556b2f", darkorange:"#ff8c00", darkorchid:"#9932cc", darkred:"#8b0000", darksalmon:"#e9967a", darkseagreen:"#8fbc8f", darkslateblue:"#483d8b", darkslategray:"#2f4f4f", darkslategrey:"#2f4f4f", darkturquoise:"#00ced1", darkviolet:"#9400d3", deeppink:"#ff1493", deepskyblue:"#00bfff", dimgray:"#696969", dimgrey:"#696969", dodgerblue:"#1e90ff", firebrick:"#b22222", floralwhite:"#fffaf0", 
forestgreen:"#228b22", fuchsia:"#ff00ff", gainsboro:"#dcdcdc", ghostwhite:"#f8f8ff", gold:"#ffd700", goldenrod:"#daa520", gray:"#808080", green:"#008000", greenyellow:"#adff2f", grey:"#808080", honeydew:"#f0fff0", hotpink:"#ff69b4", indianred:"#cd5c5c", indigo:"#4b0082", ivory:"#fffff0", khaki:"#f0e68c", lavender:"#e6e6fa", lavenderblush:"#fff0f5", lawngreen:"#7cfc00", lemonchiffon:"#fffacd", lightblue:"#add8e6", lightcoral:"#f08080", lightcyan:"#e0ffff", lightgoldenrodyellow:"#fafad2", lightgray:"#d3d3d3", 
lightgreen:"#90ee90", lightgrey:"#d3d3d3", lightpink:"#ffb6c1", lightsalmon:"#ffa07a", lightseagreen:"#20b2aa", lightskyblue:"#87cefa", lightslategray:"#778899", lightslategrey:"#778899", lightsteelblue:"#b0c4de", lightyellow:"#ffffe0", lime:"#00ff00", limegreen:"#32cd32", linen:"#faf0e6", magenta:"#ff00ff", maroon:"#800000", mediumaquamarine:"#66cdaa", mediumblue:"#0000cd", mediumorchid:"#ba55d3", mediumpurple:"#9370db", mediumseagreen:"#3cb371", mediumslateblue:"#7b68ee", mediumspringgreen:"#00fa9a", 
mediumturquoise:"#48d1cc", mediumvioletred:"#c71585", midnightblue:"#191970", mintcream:"#f5fffa", mistyrose:"#ffe4e1", moccasin:"#ffe4b5", navajowhite:"#ffdead", navy:"#000080", oldlace:"#fdf5e6", olive:"#808000", olivedrab:"#6b8e23", orange:"#ffa500", orangered:"#ff4500", orchid:"#da70d6", palegoldenrod:"#eee8aa", palegreen:"#98fb98", paleturquoise:"#afeeee", palevioletred:"#db7093", papayawhip:"#ffefd5", peachpuff:"#ffdab9", peru:"#cd853f", pink:"#ffc0cb", plum:"#dda0dd", powderblue:"#b0e0e6", 
purple:"#800080", red:"#ff0000", rosybrown:"#bc8f8f", royalblue:"#4169e1", saddlebrown:"#8b4513", salmon:"#fa8072", sandybrown:"#f4a460", seagreen:"#2e8b57", seashell:"#fff5ee", sienna:"#a0522d", silver:"#c0c0c0", skyblue:"#87ceeb", slateblue:"#6a5acd", slategray:"#708090", slategrey:"#708090", snow:"#fffafa", springgreen:"#00ff7f", steelblue:"#4682b4", tan:"#d2b48c", teal:"#008080", thistle:"#d8bfd8", tomato:"#ff6347", turquoise:"#40e0d0", violet:"#ee82ee", wheat:"#f5deb3", white:"#ffffff", whitesmoke:"#f5f5f5", 
yellow:"#ffff00", yellowgreen:"#9acd32"};
goog.color.parse = function(a) {
  var b = {};
  a = String(a);
  var c = goog.color.prependHashIfNecessaryHelper(a);
  if(goog.color.isValidHexColor_(c)) {
    return b.hex = goog.color.normalizeHex(c), b.type = "hex", b
  }
  c = goog.color.isValidRgbColor_(a);
  if(c.length) {
    return b.hex = goog.color.rgbArrayToHex(c), b.type = "rgb", b
  }
  if(goog.color.names && (c = goog.color.names[a.toLowerCase()])) {
    return b.hex = c, b.type = "named", b
  }
  throw Error(a + " is not a valid color string");
};
goog.color.isValidColor = function(a) {
  var b = goog.color.prependHashIfNecessaryHelper(a);
  return!!(goog.color.isValidHexColor_(b) || goog.color.isValidRgbColor_(a).length || goog.color.names && goog.color.names[a.toLowerCase()])
};
goog.color.parseRgb = function(a) {
  var b = goog.color.isValidRgbColor_(a);
  if(!b.length) {
    throw Error(a + " is not a valid RGB color");
  }
  return b
};
goog.color.hexToRgbStyle = function(a) {
  return goog.color.rgbStyle_(goog.color.hexToRgb(a))
};
goog.color.hexTripletRe_ = /#(.)(.)(.)/;
goog.color.normalizeHex = function(a) {
  if(!goog.color.isValidHexColor_(a)) {
    throw Error("'" + a + "' is not a valid hex color");
  }
  4 == a.length && (a = a.replace(goog.color.hexTripletRe_, "#$1$1$2$2$3$3"));
  return a.toLowerCase()
};
goog.color.hexToRgb = function(a) {
  a = goog.color.normalizeHex(a);
  var b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16);
  a = parseInt(a.substr(5, 2), 16);
  return[b, c, a]
};
goog.color.rgbToHex = function(a, b, c) {
  a = Number(a);
  b = Number(b);
  c = Number(c);
  if(isNaN(a) || 0 > a || 255 < a || isNaN(b) || 0 > b || 255 < b || isNaN(c) || 0 > c || 255 < c) {
    throw Error('"(' + a + "," + b + "," + c + '") is not a valid RGB color');
  }
  a = goog.color.prependZeroIfNecessaryHelper(a.toString(16));
  b = goog.color.prependZeroIfNecessaryHelper(b.toString(16));
  c = goog.color.prependZeroIfNecessaryHelper(c.toString(16));
  return"#" + a + b + c
};
goog.color.rgbArrayToHex = function(a) {
  return goog.color.rgbToHex(a[0], a[1], a[2])
};
goog.color.rgbToHsl = function(a, b, c) {
  a /= 255;
  b /= 255;
  c /= 255;
  var d = Math.max(a, b, c), e = Math.min(a, b, c), f = 0, g = 0, h = 0.5 * (d + e);
  d != e && (d == a ? f = 60 * (b - c) / (d - e) : d == b ? f = 60 * (c - a) / (d - e) + 120 : d == c && (f = 60 * (a - b) / (d - e) + 240), g = 0 < h && 0.5 >= h ? (d - e) / (2 * h) : (d - e) / (2 - 2 * h));
  return[Math.round(f + 360) % 360, g, h]
};
goog.color.rgbArrayToHsl = function(a) {
  return goog.color.rgbToHsl(a[0], a[1], a[2])
};
goog.color.hueToRgb_ = function(a, b, c) {
  0 > c ? c += 1 : 1 < c && (c -= 1);
  return 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + 6 * (b - a) * (2 / 3 - c) : a
};
goog.color.hslToRgb = function(a, b, c) {
  var d = 0, e = 0, f = 0;
  a /= 360;
  if(0 == b) {
    d = e = f = 255 * c
  }else {
    var g = f = 0, g = 0.5 > c ? c * (1 + b) : c + b - b * c, f = 2 * c - g, d = 255 * goog.color.hueToRgb_(f, g, a + 1 / 3), e = 255 * goog.color.hueToRgb_(f, g, a), f = 255 * goog.color.hueToRgb_(f, g, a - 1 / 3)
  }
  return[Math.round(d), Math.round(e), Math.round(f)]
};
goog.color.hslArrayToRgb = function(a) {
  return goog.color.hslToRgb(a[0], a[1], a[2])
};
goog.color.validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
goog.color.isValidHexColor_ = function(a) {
  return goog.color.validHexColorRe_.test(a)
};
goog.color.normalizedHexColorRe_ = /^#[0-9a-f]{6}$/;
goog.color.isNormalizedHexColor_ = function(a) {
  return goog.color.normalizedHexColorRe_.test(a)
};
goog.color.rgbColorRe_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
goog.color.isValidRgbColor_ = function(a) {
  var b = a.match(goog.color.rgbColorRe_);
  if(b) {
    a = Number(b[1]);
    var c = Number(b[2]), b = Number(b[3]);
    if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b) {
      return[a, c, b]
    }
  }
  return[]
};
goog.color.prependZeroIfNecessaryHelper = function(a) {
  return 1 == a.length ? "0" + a : a
};
goog.color.prependHashIfNecessaryHelper = function(a) {
  return"#" == a.charAt(0) ? a : "#" + a
};
goog.color.rgbStyle_ = function(a) {
  return"rgb(" + a.join(",") + ")"
};
goog.color.hsvToRgb = function(a, b, c) {
  var d = 0, e = 0, f = 0;
  if(0 == b) {
    f = e = d = c
  }else {
    var g = Math.floor(a / 60), h = a / 60 - g;
    a = c * (1 - b);
    var k = c * (1 - b * h);
    b = c * (1 - b * (1 - h));
    switch(g) {
      case 1:
        d = k;
        e = c;
        f = a;
        break;
      case 2:
        d = a;
        e = c;
        f = b;
        break;
      case 3:
        d = a;
        e = k;
        f = c;
        break;
      case 4:
        d = b;
        e = a;
        f = c;
        break;
      case 5:
        d = c;
        e = a;
        f = k;
        break;
      case 6:
      ;
      case 0:
        d = c, e = b, f = a
    }
  }
  return[Math.floor(d), Math.floor(e), Math.floor(f)]
};
goog.color.rgbToHsv = function(a, b, c) {
  var d = Math.max(Math.max(a, b), c), e = Math.min(Math.min(a, b), c);
  if(e == d) {
    e = a = 0
  }else {
    var f = d - e, e = f / d;
    a = 60 * (a == d ? (b - c) / f : b == d ? 2 + (c - a) / f : 4 + (a - b) / f);
    0 > a && (a += 360);
    360 < a && (a -= 360)
  }
  return[a, e, d]
};
goog.color.rgbArrayToHsv = function(a) {
  return goog.color.rgbToHsv(a[0], a[1], a[2])
};
goog.color.hsvArrayToRgb = function(a) {
  return goog.color.hsvToRgb(a[0], a[1], a[2])
};
goog.color.hexToHsl = function(a) {
  a = goog.color.hexToRgb(a);
  return goog.color.rgbToHsl(a[0], a[1], a[2])
};
goog.color.hslToHex = function(a, b, c) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(a, b, c))
};
goog.color.hslArrayToHex = function(a) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(a[0], a[1], a[2]))
};
goog.color.hexToHsv = function(a) {
  return goog.color.rgbArrayToHsv(goog.color.hexToRgb(a))
};
goog.color.hsvToHex = function(a, b, c) {
  return goog.color.rgbArrayToHex(goog.color.hsvToRgb(a, b, c))
};
goog.color.hsvArrayToHex = function(a) {
  return goog.color.hsvToHex(a[0], a[1], a[2])
};
goog.color.hslDistance = function(a, b) {
  var c, d;
  c = 0.5 >= a[2] ? a[1] * a[2] : a[1] * (1 - a[2]);
  d = 0.5 >= b[2] ? b[1] * b[2] : b[1] * (1 - b[2]);
  return(a[2] - b[2]) * (a[2] - b[2]) + c * c + d * d - 2 * c * d * Math.cos(2 * (a[0] / 360 - b[0] / 360) * Math.PI)
};
goog.color.blend = function(a, b, c) {
  c = goog.math.clamp(c, 0, 1);
  return[Math.round(c * a[0] + (1 - c) * b[0]), Math.round(c * a[1] + (1 - c) * b[1]), Math.round(c * a[2] + (1 - c) * b[2])]
};
goog.color.darken = function(a, b) {
  return goog.color.blend([0, 0, 0], a, b)
};
goog.color.lighten = function(a, b) {
  return goog.color.blend([255, 255, 255], a, b)
};
goog.color.highContrast = function(a, b) {
  for(var c = [], d = 0;d < b.length;d++) {
    c.push({color:b[d], diff:goog.color.yiqBrightnessDiff_(b[d], a) + goog.color.colorDiff_(b[d], a)})
  }
  c.sort(function(a, b) {
    return b.diff - a.diff
  });
  return c[0].color
};
goog.color.yiqBrightness_ = function(a) {
  return Math.round((299 * a[0] + 587 * a[1] + 114 * a[2]) / 1E3)
};
goog.color.yiqBrightnessDiff_ = function(a, b) {
  return Math.abs(goog.color.yiqBrightness_(a) - goog.color.yiqBrightness_(b))
};
goog.color.colorDiff_ = function(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])
};
ol.color = {};
ol.color.ENABLE_NAMED_COLORS = !0;
ol.color.hexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i;
ol.color.rgbColorRe_ = /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;
ol.color.rgbaColorRe_ = /^(?:rgba)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|1|0\.\d{0,10})\)$/i;
ol.color.blend = function(a, b, c) {
  c = goog.isDef(c) ? c : [];
  var d = a[3], e = a[3];
  if(1 == d) {
    c[0] = b[0] * e + a[0] * (1 - e) + 0.5 | 0, c[1] = b[1] * e + a[1] * (1 - e) + 0.5 | 0, c[2] = b[2] * e + a[2] * (1 - e) + 0.5 | 0, c[4] = 1
  }else {
    if(0 === e) {
      c[0] = a[0], c[1] = a[1], c[2] = a[2], c[3] = d
    }else {
      var f = e + d * (1 - e);
      0 === f ? (c[0] = 0, c[1] = 0, c[2] = 0, c[3] = 0) : (c[0] = (b[0] * e + a[0] * d * (1 - e)) / f + 0.5 | 0, c[1] = (b[1] * e + a[1] * d * (1 - e)) / f + 0.5 | 0, c[2] = (b[2] * e + a[2] * d * (1 - e)) / f + 0.5 | 0, c[3] = f)
    }
  }
  return c
};
ol.color.asArray = function(a) {
  return goog.isArray(a) ? a : ol.color.fromString(a)
};
ol.color.asString = function(a) {
  return goog.isString(a) ? a : ol.color.toString(a)
};
ol.color.equals = function(a, b) {
  return a === b || a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3]
};
ol.color.fromString = function() {
  var a = {}, b = 0;
  return function(c, d) {
    var e;
    if(a.hasOwnProperty(c)) {
      e = a[c]
    }else {
      if(1024 <= b) {
        e = 0;
        for(var f in a) {
          e++ & 0 && (delete a[f], --b)
        }
      }
      e = ol.color.fromStringInternal_(c);
      a[c] = e;
      ++b
    }
    return ol.color.returnOrUpdate(e, d)
  }
}();
ol.color.fromStringInternal_ = function(a) {
  var b = !1;
  ol.color.ENABLE_NAMED_COLORS && goog.color.names.hasOwnProperty(a) && (a = goog.color.names[a], b = !0);
  var c, d;
  if(b || ol.color.hexColorRe_.exec(a)) {
    return d = 3 == a.length - 1 ? 1 : 2, b = parseInt(a.substr(1 + 0 * d, d), 16), c = parseInt(a.substr(1 + 1 * d, d), 16), a = parseInt(a.substr(1 + 2 * d, d), 16), 1 == d && (b = (b << 4) + b, c = (c << 4) + c, a = (a << 4) + a), b = [b, c, a, 1]
  }
  if(d = ol.color.rgbaColorRe_.exec(a)) {
    return b = Number(d[1]), c = Number(d[2]), a = Number(d[3]), d = Number(d[4]), b = [b, c, a, d], ol.color.normalize(b, b)
  }
  if(d = ol.color.rgbColorRe_.exec(a)) {
    return b = Number(d[1]), c = Number(d[2]), a = Number(d[3]), b = [b, c, a, 1], ol.color.normalize(b, b)
  }
  throw Error(a + " is not a valid color");
};
ol.color.isValid = function(a) {
  return 0 <= a[0] && 256 > a[0] && 0 <= a[1] && 256 > a[1] && 0 <= a[2] && 256 > a[2] && 0 <= a[3] && 1 >= a[3]
};
ol.color.normalize = function(a, b) {
  var c = goog.isDef(b) ? b : [];
  c[0] = goog.math.clamp(a[0] + 0.5 | 0, 0, 255);
  c[1] = goog.math.clamp(a[1] + 0.5 | 0, 0, 255);
  c[2] = goog.math.clamp(a[2] + 0.5 | 0, 0, 255);
  c[3] = goog.math.clamp(a[3], 0, 1);
  return c
};
ol.color.returnOrUpdate = function(a, b) {
  return goog.isDef(b) ? (b[0] = a[0], b[1] = a[1], b[2] = a[2], b[3] = a[3], b) : a
};
ol.color.toString = function(a) {
  var b = a[0];
  b != (b | 0) && (b = b + 0.5 | 0);
  var c = a[1];
  c != (c | 0) && (c = c + 0.5 | 0);
  var d = a[2];
  d != (d | 0) && (d = d + 0.5 | 0);
  return"rgba(" + b + "," + c + "," + d + "," + a[3] + ")"
};
ol.color.transform = function(a, b, c) {
  c = goog.isDef(c) ? c : [];
  c = goog.vec.Mat4.multVec3(b, a, c);
  c[3] = a[3];
  return ol.color.normalize(c, c)
};
ol.color.stringOrColorEquals = function(a, b) {
  if(a === b || a == b) {
    return!0
  }
  goog.isString(a) && (a = ol.color.fromString(a));
  goog.isString(b) && (b = ol.color.fromString(b));
  return ol.color.equals(a, b)
};
ol.style = {};
ol.style.Stroke = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_style_Stroke$color_ = goog.isDef(a.color) ? a.color : null;
  this.lineCap_ = a.lineCap;
  this.lineDash_ = goog.isDef(a.lineDash) ? a.lineDash : null;
  this.lineJoin_ = a.lineJoin;
  this.miterLimit_ = a.miterLimit;
  this.ol_style_Stroke$width_ = a.width
};
ol.style.Stroke.prototype.ol_style_Stroke_prototype$getColor = function() {
  return this.ol_style_Stroke$color_
};
ol.style.Stroke.prototype.getLineCap = function() {
  return this.lineCap_
};
ol.style.Stroke.prototype.ol_style_Stroke_prototype$getLineDash = function() {
  return this.lineDash_
};
ol.style.Stroke.prototype.getLineJoin = function() {
  return this.lineJoin_
};
ol.style.Stroke.prototype.getMiterLimit = function() {
  return this.miterLimit_
};
ol.style.Stroke.prototype.getWidth = function() {
  return this.ol_style_Stroke$width_
};
ol.style.Fill = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_style_Fill$color_ = goog.isDef(a.color) ? a.color : null
};
ol.style.Fill.prototype.ol_style_Fill_prototype$getColor = function() {
  return this.ol_style_Fill$color_
};
ol.style.ImageState = {IDLE:0, LOADING:1, LOADED:2, ERROR:3};
ol.style.Image = function(a) {
  goog.events.EventTarget.call(this);
  this.anchor = a.anchor;
  this.imageState = a.imageState;
  this.ol_style_Image$rotation_ = a.rotation;
  this.ol_style_Image$scale_ = a.scale;
  this.size = a.size;
  this.ol_style_Image$snapToPixel_ = a.snapToPixel;
  this.subtractViewRotation_ = a.subtractViewRotation
};
goog.inherits(ol.style.Image, goog.events.EventTarget);
ol.style.Image.prototype.ol_style_Image_prototype$dispatchChangeEvent = function() {
  this.dispatchEvent(goog.events.EventType.CHANGE)
};
ol.style.Image.prototype.getAnchor = function() {
  return this.anchor
};
ol.style.Image.prototype.getImageState = function() {
  return this.imageState
};
ol.style.Image.prototype.ol_style_Image_prototype$getRotation = function() {
  return this.ol_style_Image$rotation_
};
ol.style.Image.prototype.getScale = function() {
  return this.ol_style_Image$scale_
};
ol.style.Image.prototype.getSize = function() {
  return this.size
};
ol.style.Image.prototype.getSnapToPixel = function() {
  return this.ol_style_Image$snapToPixel_
};
ol.style.Image.prototype.getSubtractViewRotation = function() {
  return this.subtractViewRotation_
};
ol.style.Style = function(a) {
  a = goog.isDef(a) ? a : {};
  this.ol_style_Style$fill_ = goog.isDef(a.fill) ? a.fill : null;
  this.ol_style_Style$image_ = goog.isDef(a.image) ? a.image : null;
  this.ol_style_Style$stroke_ = goog.isDef(a.stroke) ? a.stroke : null;
  this.ol_style_Style$text_ = goog.isDef(a.text) ? a.text : null;
  this.zIndex_ = a.zIndex
};
ol.style.Style.prototype.ol_style_Style_prototype$getFill = function() {
  return this.ol_style_Style$fill_
};
ol.style.Style.prototype.ol_style_Style_prototype$getImage = function() {
  return this.ol_style_Style$image_
};
ol.style.Style.prototype.ol_style_Style_prototype$getStroke = function() {
  return this.ol_style_Style$stroke_
};
ol.style.Style.prototype.ol_style_Style_prototype$getText = function() {
  return this.ol_style_Style$text_
};
ol.style.Style.prototype.getZIndex = function() {
  return this.zIndex_
};
ol.interaction.DRAGZOOM_ANIMATION_DURATION = 200;
ol.interaction.DragZoom = function(a) {
  var b = goog.isDef(a) ? a : {};
  a = goog.isDef(b.condition) ? b.condition : ol.events.condition.shiftKeyOnly;
  b = goog.isDef(b.style) ? b.style : new ol.style.Style({stroke:new ol.style.Stroke({color:[0, 0, 255, 1]})});
  ol.interaction.DragBox.call(this, {condition:a, style:b})
};
goog.inherits(ol.interaction.DragZoom, ol.interaction.DragBox);
ol.interaction.DragZoom.prototype.onBoxEnd = function() {
  var a = this.ol_interaction_Interaction_prototype$getMap(), b = a.getView().getView2D(), c = this.ol_interaction_DragBox_prototype$getGeometry().ol_geom_Geometry_prototype$getExtent(), d = ol.extent.getCenter(c);
  ol.interaction.Interaction.zoom(a, b, b.getResolutionForExtent(c, a.getSize()), d, ol.interaction.DRAGZOOM_ANIMATION_DURATION)
};
ol.interaction.KEYBOARD_PAN_DURATION = 100;
ol.interaction.KeyboardPan = function(a) {
  ol.interaction.Interaction.call(this);
  a = goog.isDef(a) ? a : {};
  this.ol_interaction_KeyboardPan$condition_ = goog.isDef(a.condition) ? a.condition : goog.functions.and(ol.events.condition.noModifierKeys, ol.events.condition.targetNotEditable);
  this.ol_interaction_KeyboardPan$delta_ = goog.isDef(a.delta) ? a.delta : 128
};
goog.inherits(ol.interaction.KeyboardPan, ol.interaction.Interaction);
ol.interaction.KeyboardPan.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = !1;
  if(a.type == goog.events.KeyHandler.EventType.KEY) {
    var c = a.browserEvent.goog_events_BrowserEvent_prototype$keyCode;
    if(this.ol_interaction_KeyboardPan$condition_(a) && (c == goog.events.KeyCodes.DOWN || c == goog.events.KeyCodes.LEFT || c == goog.events.KeyCodes.RIGHT || c == goog.events.KeyCodes.UP)) {
      var b = a.map, d = b.getView(), e = d.getView2DState(), f = e.resolution * this.ol_interaction_KeyboardPan$delta_, g = 0, h = 0;
      c == goog.events.KeyCodes.DOWN ? h = -f : c == goog.events.KeyCodes.LEFT ? g = -f : c == goog.events.KeyCodes.RIGHT ? g = f : h = f;
      c = [g, h];
      ol.coordinate.rotate(c, e.rotation);
      ol.interaction.Interaction.pan(b, d, c, ol.interaction.KEYBOARD_PAN_DURATION);
      a.goog_events_Event_prototype$preventDefault();
      b = !0
    }
  }
  return!b
};
ol.interaction.KeyboardZoom = function(a) {
  ol.interaction.Interaction.call(this);
  a = goog.isDef(a) ? a : {};
  this.ol_interaction_KeyboardZoom$condition_ = goog.isDef(a.condition) ? a.condition : ol.events.condition.targetNotEditable;
  this.ol_interaction_KeyboardZoom$delta_ = goog.isDef(a.delta) ? a.delta : 1;
  this.ol_interaction_KeyboardZoom$duration_ = goog.isDef(a.duration) ? a.duration : 100
};
goog.inherits(ol.interaction.KeyboardZoom, ol.interaction.Interaction);
ol.interaction.KeyboardZoom.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = !1;
  if(a.type == goog.events.KeyHandler.EventType.KEY) {
    var c = a.browserEvent.goog_events_BrowserEvent_prototype$charCode;
    if(this.ol_interaction_KeyboardZoom$condition_(a) && (43 == c || 45 == c)) {
      b = a.map;
      c = 43 == c ? this.ol_interaction_KeyboardZoom$delta_ : -this.ol_interaction_KeyboardZoom$delta_;
      b.requestRenderFrame();
      var d = b.getView().getView2D();
      ol.interaction.Interaction.zoomByDelta(b, d, c, void 0, this.ol_interaction_KeyboardZoom$duration_);
      a.goog_events_Event_prototype$preventDefault();
      b = !0
    }
  }
  return!b
};
ol.interaction.MOUSEWHEELZOOM_MAXDELTA = 1;
ol.interaction.MOUSEWHEELZOOM_TIMEOUT_DURATION = 80;
ol.interaction.MouseWheelZoom = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.interaction.Interaction.call(this);
  this.ol_interaction_MouseWheelZoom$delta_ = 0;
  this.ol_interaction_MouseWheelZoom$duration_ = goog.isDef(a.duration) ? a.duration : 250;
  this.lastAnchor_ = null;
  this.timeoutId_ = this.startTime_ = void 0
};
goog.inherits(ol.interaction.MouseWheelZoom, ol.interaction.Interaction);
ol.interaction.MouseWheelZoom.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = !1;
  if(a.type == goog.events.MouseWheelHandler.EventType.MOUSEWHEEL) {
    var b = a.map, c = a.browserEvent;
    this.lastAnchor_ = a.ol_MapBrowserEvent_prototype$getCoordinate();
    this.ol_interaction_MouseWheelZoom$delta_ += c.goog_events_MouseWheelEvent$deltaY / 3;
    goog.isDef(this.startTime_) || (this.startTime_ = goog.now());
    c = Math.max(ol.interaction.MOUSEWHEELZOOM_TIMEOUT_DURATION - (goog.now() - this.startTime_), 0);
    goog.global.clearTimeout(this.timeoutId_);
    this.timeoutId_ = goog.global.setTimeout(goog.bind(this.doZoom_, this, b), c);
    a.goog_events_Event_prototype$preventDefault();
    b = !0
  }
  return!b
};
ol.interaction.MouseWheelZoom.prototype.doZoom_ = function(a) {
  var b = ol.interaction.MOUSEWHEELZOOM_MAXDELTA, b = goog.math.clamp(this.ol_interaction_MouseWheelZoom$delta_, -b, b), c = a.getView().getView2D();
  a.requestRenderFrame();
  ol.interaction.Interaction.zoomByDelta(a, c, -b, this.lastAnchor_, this.ol_interaction_MouseWheelZoom$duration_);
  this.ol_interaction_MouseWheelZoom$delta_ = 0;
  this.lastAnchor_ = null;
  this.timeoutId_ = this.startTime_ = void 0
};
ol.interaction.Touch = function() {
  ol.interaction.Interaction.call(this);
  this.handled_ = !1;
  this.trackedTouches_ = {};
  this.targetTouches = []
};
goog.inherits(ol.interaction.Touch, ol.interaction.Interaction);
ol.interaction.Touch.centroid = function(a) {
  for(var b = a.length, c = 0, d = 0, e = 0;e < b;e++) {
    c += a[e].clientX, d += a[e].clientY
  }
  return[c / b, d / b]
};
ol.interaction.Touch.isTouchEvent_ = function(a) {
  a = a.type;
  return a === ol.MapBrowserEvent.EventType.TOUCHSTART || a === ol.MapBrowserEvent.EventType.TOUCHMOVE || a === ol.MapBrowserEvent.EventType.TOUCHEND
};
ol.interaction.Touch.prototype.updateTrackedTouches_ = function(a) {
  if(ol.interaction.Touch.isTouchEvent_(a)) {
    var b = a.browserEvent.getBrowserEvent();
    goog.isDef(b.targetTouches) ? this.targetTouches = b.targetTouches : goog.isDef(b.pointerId) && (a.type == ol.MapBrowserEvent.EventType.TOUCHEND ? delete this.trackedTouches_[b.pointerId] : this.trackedTouches_[b.pointerId] = b, this.targetTouches = goog.object.getValues(this.trackedTouches_))
  }
};
ol.interaction.Touch.prototype.handleTouchMove = goog.nullFunction;
ol.interaction.Touch.prototype.handleTouchEnd = goog.functions.FALSE;
ol.interaction.Touch.prototype.handleTouchStart = goog.functions.FALSE;
ol.interaction.Touch.prototype.ol_interaction_Interaction_prototype$handleMapBrowserEvent = function(a) {
  var b = a.map.getView();
  this.updateTrackedTouches_(a);
  this.handled_ && (a.type == ol.MapBrowserEvent.EventType.TOUCHMOVE ? this.handleTouchMove(a) : a.type == ol.MapBrowserEvent.EventType.TOUCHEND && ((this.handled_ = this.handleTouchEnd(a)) || b.setHint(ol.ViewHint.INTERACTING, -1)));
  a.type == ol.MapBrowserEvent.EventType.TOUCHSTART && (a = this.handleTouchStart(a), !this.handled_ && a && b.setHint(ol.ViewHint.INTERACTING, 1), this.handled_ = a);
  return!0
};
ol.interaction.TouchPan = function(a) {
  ol.interaction.Touch.call(this);
  this.ol_interaction_TouchPan$kinetic_ = (goog.isDef(a) ? a : {}).kinetic;
  this.lastCentroid = this.ol_interaction_TouchPan$kineticPreRenderFn_ = null;
  this.noKinetic_ = !1
};
goog.inherits(ol.interaction.TouchPan, ol.interaction.Touch);
ol.interaction.TouchPan.prototype.handleTouchMove = function(a) {
  var b = ol.interaction.Touch.centroid(this.targetTouches);
  if(!goog.isNull(this.lastCentroid)) {
    this.ol_interaction_TouchPan$kinetic_ && this.ol_interaction_TouchPan$kinetic_.ol_Kinetic_prototype$update(b[0], b[1]);
    var c = this.lastCentroid[0] - b[0], d = b[1] - this.lastCentroid[1];
    a = a.map;
    var e = a.getView().getView2D(), f = e.getView2DState(), c = [c, d];
    ol.coordinate.scale(c, f.resolution);
    ol.coordinate.rotate(c, f.rotation);
    ol.coordinate.add(c, f.center);
    c = e.constrainCenter(c);
    a.requestRenderFrame();
    e.ol_View2D_prototype$setCenter(c)
  }
  this.lastCentroid = b
};
ol.interaction.TouchPan.prototype.handleTouchEnd = function(a) {
  a = a.map;
  var b = a.getView().getView2D();
  if(0 === this.targetTouches.length) {
    if(!this.noKinetic_ && this.ol_interaction_TouchPan$kinetic_ && this.ol_interaction_TouchPan$kinetic_.ol_Kinetic_prototype$end()) {
      var c = this.ol_interaction_TouchPan$kinetic_.getDistance(), d = this.ol_interaction_TouchPan$kinetic_.getAngle(), e = b.getCenter();
      this.ol_interaction_TouchPan$kineticPreRenderFn_ = this.ol_interaction_TouchPan$kinetic_.pan(e);
      a.beforeRender(this.ol_interaction_TouchPan$kineticPreRenderFn_);
      e = a.getPixelFromCoordinate(e);
      c = a.getCoordinateFromPixel([e[0] - c * Math.cos(d), e[1] - c * Math.sin(d)]);
      c = b.constrainCenter(c);
      b.ol_View2D_prototype$setCenter(c)
    }
    a.requestRenderFrame();
    return!1
  }
  this.lastCentroid = null;
  return!0
};
ol.interaction.TouchPan.prototype.handleTouchStart = function(a) {
  if(0 < this.targetTouches.length) {
    var b = a.map, c = b.getView().getView2D();
    this.lastCentroid = null;
    b.requestRenderFrame();
    !goog.isNull(this.ol_interaction_TouchPan$kineticPreRenderFn_) && b.removePreRenderFunction(this.ol_interaction_TouchPan$kineticPreRenderFn_) && (c.ol_View2D_prototype$setCenter(a.frameState.view2DState.center), this.ol_interaction_TouchPan$kineticPreRenderFn_ = null);
    this.ol_interaction_TouchPan$kinetic_ && this.ol_interaction_TouchPan$kinetic_.begin();
    this.noKinetic_ = 1 < this.targetTouches.length;
    return!0
  }
  return!1
};
ol.interaction.TOUCHROTATE_ANIMATION_DURATION = 250;
ol.interaction.TouchRotate = function(a) {
  ol.interaction.Touch.call(this);
  a = goog.isDef(a) ? a : {};
  this.ol_interaction_TouchRotate$anchor_ = null;
  this.ol_interaction_TouchRotate$lastAngle_ = void 0;
  this.rotating_ = !1;
  this.rotationDelta_ = 0;
  this.threshold_ = goog.isDef(a.threshold) ? a.threshold : 0.3
};
goog.inherits(ol.interaction.TouchRotate, ol.interaction.Touch);
ol.interaction.TouchRotate.prototype.handleTouchMove = function(a) {
  var b = 0, c = this.targetTouches[0], d = this.targetTouches[1], c = Math.atan2(d.clientY - c.clientY, d.clientX - c.clientX);
  goog.isDef(this.ol_interaction_TouchRotate$lastAngle_) && (b = c - this.ol_interaction_TouchRotate$lastAngle_, this.rotationDelta_ += b, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0));
  this.ol_interaction_TouchRotate$lastAngle_ = c;
  a = a.map;
  c = goog.style.getClientPosition(a.getViewport());
  d = ol.interaction.Touch.centroid(this.targetTouches);
  d[0] -= c.x;
  d[1] -= c.y;
  this.ol_interaction_TouchRotate$anchor_ = a.getCoordinateFromPixel(d);
  this.rotating_ && (c = a.getView().getView2D(), d = c.getView2DState(), a.requestRenderFrame(), ol.interaction.Interaction.rotateWithoutConstraints(a, c, d.rotation + b, this.ol_interaction_TouchRotate$anchor_))
};
ol.interaction.TouchRotate.prototype.handleTouchEnd = function(a) {
  if(2 > this.targetTouches.length) {
    a = a.map;
    var b = a.getView().getView2D(), c = b.getView2DState();
    this.rotating_ && ol.interaction.Interaction.rotate(a, b, c.rotation, this.ol_interaction_TouchRotate$anchor_, ol.interaction.TOUCHROTATE_ANIMATION_DURATION);
    return!1
  }
  return!0
};
ol.interaction.TouchRotate.prototype.handleTouchStart = function(a) {
  return 2 <= this.targetTouches.length ? (a = a.map, this.ol_interaction_TouchRotate$anchor_ = null, this.ol_interaction_TouchRotate$lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, a.requestRenderFrame(), !0) : !1
};
ol.interaction.TouchZoom = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.interaction.Touch.call(this);
  this.ol_interaction_TouchZoom$anchor_ = null;
  this.ol_interaction_TouchZoom$duration_ = goog.isDef(a.duration) ? a.duration : 400;
  this.lastDistance_ = void 0;
  this.lastScaleDelta_ = 1
};
goog.inherits(ol.interaction.TouchZoom, ol.interaction.Touch);
ol.interaction.TouchZoom.prototype.handleTouchMove = function(a) {
  var b = 1, c = this.targetTouches[0], d = this.targetTouches[1], e = c.clientX - d.clientX, c = c.clientY - d.clientY, e = Math.sqrt(e * e + c * c);
  goog.isDef(this.lastDistance_) && (b = this.lastDistance_ / e);
  this.lastDistance_ = e;
  1 != b && (this.lastScaleDelta_ = b);
  a = a.map;
  var e = a.getView().getView2D(), c = e.getView2DState(), d = goog.style.getClientPosition(a.getViewport()), f = ol.interaction.Touch.centroid(this.targetTouches);
  f[0] -= d.x;
  f[1] -= d.y;
  this.ol_interaction_TouchZoom$anchor_ = a.getCoordinateFromPixel(f);
  a.requestRenderFrame();
  ol.interaction.Interaction.zoomWithoutConstraints(a, e, c.resolution * b, this.ol_interaction_TouchZoom$anchor_)
};
ol.interaction.TouchZoom.prototype.handleTouchEnd = function(a) {
  if(2 > this.targetTouches.length) {
    a = a.map;
    var b = a.getView().getView2D(), c = b.getView2DState();
    ol.interaction.Interaction.zoom(a, b, c.resolution, this.ol_interaction_TouchZoom$anchor_, this.ol_interaction_TouchZoom$duration_, this.lastScaleDelta_ - 1);
    return!1
  }
  return!0
};
ol.interaction.TouchZoom.prototype.handleTouchStart = function(a) {
  return 2 <= this.targetTouches.length ? (a = a.map, this.ol_interaction_TouchZoom$anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, a.requestRenderFrame(), !0) : !1
};
ol.interaction.defaults = function(a) {
  a = goog.isDef(a) ? a : {};
  var b = new ol.Collection, c = new ol.Kinetic(-0.005, 0.05, 100);
  (goog.isDef(a.altShiftDragRotate) ? a.altShiftDragRotate : 1) && b.push(new ol.interaction.DragRotate);
  (goog.isDef(a.doubleClickZoom) ? a.doubleClickZoom : 1) && b.push(new ol.interaction.DoubleClickZoom({delta:a.zoomDelta, duration:a.zoomDuration}));
  (goog.isDef(a.touchPan) ? a.touchPan : 1) && b.push(new ol.interaction.TouchPan({kinetic:c}));
  (goog.isDef(a.touchRotate) ? a.touchRotate : 1) && b.push(new ol.interaction.TouchRotate);
  (goog.isDef(a.touchZoom) ? a.touchZoom : 1) && b.push(new ol.interaction.TouchZoom({duration:a.zoomDuration}));
  (goog.isDef(a.dragPan) ? a.dragPan : 1) && b.push(new ol.interaction.DragPan({kinetic:c}));
  if(goog.isDef(a.keyboard) ? a.keyboard : 1) {
    b.push(new ol.interaction.KeyboardPan), b.push(new ol.interaction.KeyboardZoom({delta:a.zoomDelta, duration:a.zoomDuration}))
  }
  (goog.isDef(a.mouseWheelZoom) ? a.mouseWheelZoom : 1) && b.push(new ol.interaction.MouseWheelZoom({duration:a.zoomDuration}));
  (goog.isDef(a.shiftDragZoom) ? a.shiftDragZoom : 1) && b.push(new ol.interaction.DragZoom);
  return b
};
ol.layer.GroupProperty = {LAYERS:"layers"};
ol.layer.Group = function(a) {
  var b = goog.isDef(a) ? a : {};
  a = goog.object.clone(b);
  delete a.layers;
  b = b.layers;
  ol.layer.Base.call(this, a);
  this.listenerKeys_ = null;
  goog.events.listen(this, ol.Object.getChangeEventType(ol.layer.GroupProperty.LAYERS), this.handleLayersChanged_, !1, this);
  goog.isDef(b) ? goog.isArray(b) && (b = new ol.Collection(goog.array.clone(b))) : b = new ol.Collection;
  this.setLayers(b)
};
goog.inherits(ol.layer.Group, ol.layer.Base);
ol.layer.Group.prototype.handleLayerChange_ = function() {
  this.getVisible() && this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.layer.Group.prototype.handleLayersChanged_ = function(a) {
  goog.isNull(this.listenerKeys_) || (goog.array.forEach(goog.object.getValues(this.listenerKeys_), goog.events.unlistenByKey), this.listenerKeys_ = null);
  a = this.ol_layer_Group_prototype$getLayers();
  if(goog.isDefAndNotNull(a)) {
    this.listenerKeys_ = {add:goog.events.listen(a, ol.CollectionEventType.ADD, this.handleLayersAdd_, !1, this), remove:goog.events.listen(a, ol.CollectionEventType.REMOVE, this.handleLayersRemove_, !1, this)};
    a = a.ol_Collection_prototype$getArray();
    var b, c, d;
    b = 0;
    for(c = a.length;b < c;b++) {
      d = a[b], this.listenerKeys_[goog.getUid(d).toString()] = goog.events.listen(d, [ol.ObjectEventType.PROPERTYCHANGE, goog.events.EventType.CHANGE], this.handleLayerChange_, !1, this)
    }
  }
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.layer.Group.prototype.handleLayersAdd_ = function(a) {
  a = a.getElement();
  this.listenerKeys_[goog.getUid(a).toString()] = goog.events.listen(a, [ol.ObjectEventType.PROPERTYCHANGE, goog.events.EventType.CHANGE], this.handleLayerChange_, !1, this);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.layer.Group.prototype.handleLayersRemove_ = function(a) {
  a = a.getElement();
  a = goog.getUid(a).toString();
  goog.events.unlistenByKey(this.listenerKeys_[a]);
  delete this.listenerKeys_[a];
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.layer.Group.prototype.ol_layer_Group_prototype$getLayers = function() {
  return this.get(ol.layer.GroupProperty.LAYERS)
};
goog.exportProperty(ol.layer.Group.prototype, "getLayers", ol.layer.Group.prototype.ol_layer_Group_prototype$getLayers);
ol.layer.Group.prototype.setLayers = function(a) {
  this.set(ol.layer.GroupProperty.LAYERS, a)
};
goog.exportProperty(ol.layer.Group.prototype, "setLayers", ol.layer.Group.prototype.setLayers);
ol.layer.Group.prototype.getLayersArray = function(a) {
  var b = goog.isDef(a) ? a : [];
  this.ol_layer_Group_prototype$getLayers().forEach(function(a) {
    a.getLayersArray(b)
  });
  return b
};
ol.layer.Group.prototype.getLayerStatesArray = function(a) {
  var b = goog.isDef(a) ? a : {layers:[], layerStates:[]}, c = b.layers.length;
  this.ol_layer_Group_prototype$getLayers().forEach(function(a) {
    a.getLayerStatesArray(b)
  });
  a = this.getLayerState();
  var d, e;
  for(d = b.layerStates.length;c < d;c++) {
    e = b.layerStates[c], e.brightness = goog.math.clamp(e.brightness + a.brightness, -1, 1), e.contrast *= a.contrast, e.hue += a.hue, e.opacity *= a.opacity, e.saturation *= a.saturation, e.visible = e.visible && a.visible, e.maxResolution = Math.min(e.maxResolution, a.maxResolution), e.minResolution = Math.max(e.minResolution, a.minResolution)
  }
  return b
};
ol.layer.Group.prototype.getSourceState = function() {
  return ol.source.State.READY
};
ol.math = {};
ol.math.cosh = function(a) {
  return(Math.exp(a) + Math.exp(-a)) / 2
};
ol.math.coth = function(a) {
  a = Math.exp(-2 * a);
  return(1 + a) / (1 - a)
};
ol.math.csch = function(a) {
  return 2 / (Math.exp(a) - Math.exp(-a))
};
ol.math.roundUpToPowerOfTwo = function(a) {
  return Math.pow(2, Math.ceil(Math.log(a) / Math.LN2))
};
ol.math.sech = function(a) {
  return 2 / (Math.exp(a) + Math.exp(-a))
};
ol.math.sinh = function(a) {
  return(Math.exp(a) - Math.exp(-a)) / 2
};
ol.math.tanh = function(a) {
  a = Math.exp(-2 * a);
  return(1 - a) / (1 + a)
};
ol.proj.EPSG3857 = function(a) {
  ol.proj.Projection.call(this, {code:a, units:ol.proj.Units.METERS, extent:ol.proj.EPSG3857.function__new_ol_proj_EPSG3857__string___undefined$EXTENT, global:!0})
};
goog.inherits(ol.proj.EPSG3857, ol.proj.Projection);
ol.proj.EPSG3857.RADIUS = 6378137;
ol.proj.EPSG3857.HALF_SIZE = Math.PI * ol.proj.EPSG3857.RADIUS;
ol.proj.EPSG3857.function__new_ol_proj_EPSG3857__string___undefined$EXTENT = [-ol.proj.EPSG3857.HALF_SIZE, -ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE, ol.proj.EPSG3857.HALF_SIZE];
ol.proj.EPSG3857.CODES = ["EPSG:3857", "EPSG:102100", "EPSG:102113", "EPSG:900913", "urn:ogc:def:crs:EPSG:6.18:3:3857"];
ol.proj.EPSG3857.function__new_ol_proj_EPSG3857__string___undefined$PROJECTIONS = goog.array.map(ol.proj.EPSG3857.CODES, function(a) {
  return new ol.proj.EPSG3857(a)
});
ol.proj.EPSG3857.fromEPSG4326 = function(a, b, c) {
  var d = a.length;
  c = 1 < c ? c : 2;
  goog.isDef(b) || (b = 2 < c ? a.slice() : Array(d));
  for(var e = 0;e < d;e += c) {
    b[e] = ol.proj.EPSG3857.RADIUS * Math.PI * a[e] / 180, b[e + 1] = ol.proj.EPSG3857.RADIUS * Math.log(Math.tan(Math.PI * (a[e + 1] + 90) / 360))
  }
  return b
};
ol.proj.EPSG3857.toEPSG4326 = function(a, b, c) {
  var d = a.length;
  c = 1 < c ? c : 2;
  goog.isDef(b) || (b = 2 < c ? a.slice() : Array(d));
  for(var e = 0;e < d;e += c) {
    b[e] = 180 * a[e] / (ol.proj.EPSG3857.RADIUS * Math.PI), b[e + 1] = 360 * Math.atan(Math.exp(a[e + 1] / ol.proj.EPSG3857.RADIUS)) / Math.PI - 90
  }
  return b
};
ol.proj.EPSG3857.prototype.getPointResolution = function(a, b) {
  return a / ol.math.cosh(b[1] / ol.proj.EPSG3857.RADIUS)
};
ol.proj.EPSG4326 = function(a, b) {
  ol.proj.Projection.call(this, {code:a, units:ol.proj.Units.DEGREES, extent:ol.proj.EPSG4326.function__new_ol_proj_EPSG4326__string__string____undefined$EXTENT, axisOrientation:b, global:!0})
};
goog.inherits(ol.proj.EPSG4326, ol.proj.Projection);
ol.proj.EPSG4326.function__new_ol_proj_EPSG4326__string__string____undefined$EXTENT = [-180, -90, 180, 90];
ol.proj.EPSG4326.function__new_ol_proj_EPSG4326__string__string____undefined$PROJECTIONS = [new ol.proj.EPSG4326("CRS:84"), new ol.proj.EPSG4326("EPSG:4326", "neu"), new ol.proj.EPSG4326("urn:ogc:def:crs:EPSG:6.6:4326", "neu"), new ol.proj.EPSG4326("urn:ogc:def:crs:OGC:1.3:CRS84"), new ol.proj.EPSG4326("urn:ogc:def:crs:OGC:2:84"), new ol.proj.EPSG4326("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"), new ol.proj.EPSG4326("urn:x-ogc:def:crs:EPSG:4326", "neu")];
ol.proj.EPSG4326.prototype.getPointResolution = function(a, b) {
  return a
};
ol.proj.common = {};
ol.proj.common.add = function() {
  ol.proj.addEquivalentProjections(ol.proj.EPSG3857.function__new_ol_proj_EPSG3857__string___undefined$PROJECTIONS);
  ol.proj.addEquivalentProjections(ol.proj.EPSG4326.function__new_ol_proj_EPSG4326__string__string____undefined$PROJECTIONS);
  ol.proj.addEquivalentTransforms(ol.proj.EPSG4326.function__new_ol_proj_EPSG4326__string__string____undefined$PROJECTIONS, ol.proj.EPSG3857.function__new_ol_proj_EPSG3857__string___undefined$PROJECTIONS, ol.proj.EPSG3857.fromEPSG4326, ol.proj.EPSG3857.toEPSG4326)
};
ol.ImageState = {IDLE:0, LOADING:1, LOADED:2, ERROR:3};
ol.ImageBase = function(a, b, c, d, e) {
  goog.events.EventTarget.call(this);
  this.ol_ImageBase$attributions_ = e;
  this.ol_ImageBase$extent_ = a;
  this.ol_ImageBase$pixelRatio_ = c;
  this.ol_ImageBase$resolution_ = b;
  this.state = d
};
goog.inherits(ol.ImageBase, goog.events.EventTarget);
ol.ImageBase.prototype.ol_ImageBase_prototype$dispatchChangeEvent = function() {
  this.dispatchEvent(goog.events.EventType.CHANGE)
};
ol.ImageBase.prototype.ol_ImageBase_prototype$getAttributions = function() {
  return this.ol_ImageBase$attributions_
};
ol.ImageBase.prototype.ol_ImageBase_prototype$getExtent = function() {
  return this.ol_ImageBase$extent_
};
ol.ImageBase.prototype.getPixelRatio = function() {
  return this.ol_ImageBase$pixelRatio_
};
ol.ImageBase.prototype.ol_ImageBase_prototype$getResolution = function() {
  return this.ol_ImageBase$resolution_
};
ol.ImageBase.prototype.ol_ImageBase_prototype$getState = function() {
  return this.state
};
ol.Image = function(a, b, c, d, e, f) {
  ol.ImageBase.call(this, a, b, c, ol.ImageState.IDLE, d);
  this.ol_Image$src_ = e;
  this.ol_Image$image_ = new Image;
  goog.isNull(f) || (this.ol_Image$image_.crossOrigin = f);
  this.ol_Image$imageByContext_ = {};
  this.ol_Image$imageListenerKeys_ = null;
  this.state = ol.ImageState.IDLE
};
goog.inherits(ol.Image, ol.ImageBase);
ol.Image.prototype.getImageElement = function(a) {
  if(goog.isDef(a)) {
    var b = goog.getUid(a);
    if(b in this.ol_Image$imageByContext_) {
      return this.ol_Image$imageByContext_[b]
    }
    a = goog.object.isEmpty(this.ol_Image$imageByContext_) ? this.ol_Image$image_ : this.ol_Image$image_.cloneNode(!1);
    return this.ol_Image$imageByContext_[b] = a
  }
  return this.ol_Image$image_
};
ol.Image.prototype.ol_Image_prototype$handleImageError_ = function() {
  this.state = ol.ImageState.ERROR;
  this.ol_Image_prototype$unlistenImage_();
  this.ol_ImageBase_prototype$dispatchChangeEvent()
};
ol.Image.prototype.ol_Image_prototype$handleImageLoad_ = function() {
  this.state = ol.ImageState.LOADED;
  this.ol_Image_prototype$unlistenImage_();
  this.ol_ImageBase_prototype$dispatchChangeEvent()
};
ol.Image.prototype.ol_ImageBase_prototype$load = function() {
  this.state == ol.ImageState.IDLE && (this.state = ol.ImageState.LOADING, this.ol_Image$imageListenerKeys_ = [goog.events.listenOnce(this.ol_Image$image_, goog.events.EventType.ERROR, this.ol_Image_prototype$handleImageError_, !1, this), goog.events.listenOnce(this.ol_Image$image_, goog.events.EventType.LOAD, this.ol_Image_prototype$handleImageLoad_, !1, this)], this.ol_Image$image_.src = this.ol_Image$src_)
};
ol.Image.prototype.ol_Image_prototype$unlistenImage_ = function() {
  goog.array.forEach(this.ol_Image$imageListenerKeys_, goog.events.unlistenByKey);
  this.ol_Image$imageListenerKeys_ = null
};
ol.tilegrid = {};
ol.DEFAULT_TILE_SIZE = 256;
ol.DEFAULT_MAX_ZOOM = 42;
ol.tilegrid.TileGrid = function(a) {
  this.minZoom = goog.isDef(a.minZoom) ? a.minZoom : 0;
  this.ol_tilegrid_TileGrid$resolutions_ = a.resolutions;
  this.maxZoom = this.ol_tilegrid_TileGrid$resolutions_.length - 1;
  this.ol_tilegrid_TileGrid$origin_ = goog.isDef(a.origin) ? a.origin : null;
  this.origins_ = null;
  goog.isDef(a.origins) && (this.origins_ = a.origins);
  this.tileSizes_ = null;
  goog.isDef(a.tileSizes) && (this.tileSizes_ = a.tileSizes);
  this.tileSize_ = goog.isDef(a.tileSize) ? a.tileSize : goog.isNull(this.tileSizes_) ? ol.DEFAULT_TILE_SIZE : void 0
};
ol.tilegrid.TileGrid.tmpTileCoord_ = new ol.TileCoord(0, 0, 0);
ol.tilegrid.TileGrid.prototype.forEachTileCoordParentTileRange = function(a, b, c, d, e) {
  e = this.getTileCoordExtent(a, e);
  for(a = a.ol_TileCoord$z - 1;a >= this.minZoom;) {
    if(b.call(c, a, this.getTileRangeForExtentAndZ(e, a, d))) {
      return!0
    }
    --a
  }
  return!1
};
ol.tilegrid.TileGrid.prototype.getMaxZoom = function() {
  return this.maxZoom
};
ol.tilegrid.TileGrid.prototype.getMinZoom = function() {
  return this.minZoom
};
ol.tilegrid.TileGrid.prototype.ol_tilegrid_TileGrid_prototype$getOrigin = function(a) {
  return goog.isNull(this.ol_tilegrid_TileGrid$origin_) ? this.origins_[a] : this.ol_tilegrid_TileGrid$origin_
};
ol.tilegrid.TileGrid.prototype.ol_tilegrid_TileGrid_prototype$getResolution = function(a) {
  return this.ol_tilegrid_TileGrid$resolutions_[a]
};
ol.tilegrid.TileGrid.prototype.ol_tilegrid_TileGrid_prototype$getResolutions = function() {
  return this.ol_tilegrid_TileGrid$resolutions_
};
ol.tilegrid.TileGrid.prototype.getTileCoordChildTileRange = function(a, b, c) {
  return a.ol_TileCoord$z < this.maxZoom ? (c = this.getTileCoordExtent(a, c), this.getTileRangeForExtentAndZ(c, a.ol_TileCoord$z + 1, b)) : null
};
ol.tilegrid.TileGrid.prototype.getTileRangeExtent = function(a, b, c) {
  var d = this.ol_tilegrid_TileGrid_prototype$getOrigin(a), e = this.ol_tilegrid_TileGrid_prototype$getResolution(a);
  a = this.getTileSize(a);
  return ol.extent.createOrUpdate(d[0] + b.minX * a * e, d[1] + b.minY * a * e, d[0] + (b.maxX + 1) * a * e, d[1] + (b.maxY + 1) * a * e, c)
};
ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndResolution = function(a, b, c) {
  var d = ol.tilegrid.TileGrid.tmpTileCoord_;
  this.getTileCoordForXYAndResolution_(a[0], a[1], b, !1, d);
  var e = d.x, f = d.y;
  this.getTileCoordForXYAndResolution_(a[2], a[3], b, !0, d);
  return ol.TileRange.createOrUpdate(e, d.x, f, d.y, c)
};
ol.tilegrid.TileGrid.prototype.getTileRangeForExtentAndZ = function(a, b, c) {
  b = this.ol_tilegrid_TileGrid_prototype$getResolution(b);
  return this.getTileRangeForExtentAndResolution(a, b, c)
};
ol.tilegrid.TileGrid.prototype.getTileCoordCenter = function(a) {
  var b = this.ol_tilegrid_TileGrid_prototype$getOrigin(a.ol_TileCoord$z), c = this.ol_tilegrid_TileGrid_prototype$getResolution(a.ol_TileCoord$z), d = this.getTileSize(a.ol_TileCoord$z);
  return[b[0] + (a.x + 0.5) * d * c, b[1] + (a.y + 0.5) * d * c]
};
ol.tilegrid.TileGrid.prototype.getTileCoordExtent = function(a, b) {
  var c = this.ol_tilegrid_TileGrid_prototype$getOrigin(a.ol_TileCoord$z), d = this.ol_tilegrid_TileGrid_prototype$getResolution(a.ol_TileCoord$z), e = this.getTileSize(a.ol_TileCoord$z), f = c[0] + a.x * e * d, c = c[1] + a.y * e * d;
  return ol.extent.createOrUpdate(f, c, f + e * d, c + e * d, b)
};
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndResolution = function(a, b, c) {
  return this.getTileCoordForXYAndResolution_(a[0], a[1], b, !1, c)
};
ol.tilegrid.TileGrid.prototype.getTileCoordForXYAndResolution_ = function(a, b, c, d, e) {
  var f = this.getZForResolution(c), g = c / this.ol_tilegrid_TileGrid_prototype$getResolution(f), h = this.ol_tilegrid_TileGrid_prototype$getOrigin(f), k = this.getTileSize(f);
  a = g * (a - h[0]) / (c * k);
  b = g * (b - h[1]) / (c * k);
  d ? (a = Math.ceil(a) - 1, b = Math.ceil(b) - 1) : (a = Math.floor(a), b = Math.floor(b));
  return ol.TileCoord.createOrUpdate(f, a, b, e)
};
ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndZ = function(a, b, c) {
  b = this.ol_tilegrid_TileGrid_prototype$getResolution(b);
  return this.getTileCoordForXYAndResolution_(a[0], a[1], b, !1, c)
};
ol.tilegrid.TileGrid.prototype.getTileCoordResolution = function(a) {
  return this.ol_tilegrid_TileGrid$resolutions_[a.ol_TileCoord$z]
};
ol.tilegrid.TileGrid.prototype.getTileSize = function(a) {
  return goog.isDef(this.tileSize_) ? this.tileSize_ : this.tileSizes_[a]
};
ol.tilegrid.TileGrid.prototype.getZForResolution = function(a) {
  return ol.array.linearFindNearest(this.ol_tilegrid_TileGrid$resolutions_, a, 0)
};
ol.tilegrid.getForProjection = function(a) {
  var b = a.getDefaultTileGrid();
  goog.isNull(b) && (b = ol.tilegrid.createForProjection(a), a.setDefaultTileGrid(b));
  return b
};
ol.tilegrid.createForProjection = function(a, b, c) {
  var d = a.ol_proj_Projection_prototype$getExtent();
  a = goog.isNull(d) ? 360 * ol.METERS_PER_UNIT[ol.proj.Units.DEGREES] / a.getMetersPerUnit() : Math.max(d[2] - d[0], d[3] - d[1]);
  b = goog.isDef(b) ? b : ol.DEFAULT_MAX_ZOOM;
  c = goog.isDef(c) ? c : ol.DEFAULT_TILE_SIZE;
  b = Array(b + 1);
  a /= c;
  for(var e = 0, f = b.length;e < f;++e) {
    b[e] = a / Math.pow(2, e)
  }
  return new ol.tilegrid.TileGrid({origin:goog.isNull(d) ? [0, 0] : ol.extent.getBottomLeft(d), resolutions:b, tileSize:c})
};
ol.source.Tile = function(a) {
  ol.source.Source.call(this, {attributions:a.attributions, extent:a.extent, logo:a.logo, projection:a.projection});
  this.opaque_ = goog.isDef(a.opaque) ? a.opaque : !1;
  this.tileGrid = goog.isDef(a.tileGrid) ? a.tileGrid : null
};
goog.inherits(ol.source.Tile, ol.source.Source);
ol.source.Tile.prototype.ol_source_Tile_prototype$canExpireCache = goog.functions.FALSE;
ol.source.Tile.prototype.findLoadedTiles = function(a, b, c, d) {
  var e = !0, f, g, h, k;
  for(h = d.minX;h <= d.maxX;++h) {
    for(k = d.minY;k <= d.maxY;++k) {
      g = this.ol_source_Tile_prototype$getKeyZXY(c, h, k), a[c] && a[c][g] || (f = b(c, h, k), goog.isNull(f) ? e = !1 : (a[c] || (a[c] = {}), a[c][g] = f))
    }
  }
  return e
};
ol.source.Tile.prototype.getGutter = function() {
  return 0
};
ol.source.Tile.prototype.ol_source_Tile_prototype$getKeyZXY = ol.TileCoord.function__new_ol_TileCoord__number__number__number___undefined$getKeyZXY;
ol.source.Tile.prototype.getOpaque = function() {
  return this.opaque_
};
ol.source.Tile.prototype.ol_source_Source_prototype$getResolutions = function() {
  return this.tileGrid.ol_tilegrid_TileGrid_prototype$getResolutions()
};
ol.source.Tile.prototype.getTileGrid = function() {
  return this.tileGrid
};
ol.source.Tile.prototype.getTileGridForProjection = function(a) {
  return goog.isNull(this.tileGrid) ? ol.tilegrid.getForProjection(a) : this.tileGrid
};
ol.source.Tile.prototype.getTilePixelSize = function(a, b, c) {
  return this.getTileGridForProjection(c).getTileSize(a)
};
ol.source.Tile.prototype.useTile = goog.nullFunction;
ol.renderer = {};
ol.renderer.Layer = function(a, b) {
  goog.Disposable.call(this);
  this.mapRenderer_ = a;
  this.layer_ = b
};
goog.inherits(ol.renderer.Layer, goog.Disposable);
ol.renderer.Layer.prototype.ol_renderer_Layer_prototype$forEachFeatureAtPixel = goog.nullFunction;
ol.renderer.Layer.prototype.getLayer = function() {
  return this.layer_
};
ol.renderer.Layer.prototype.ol_renderer_Layer_prototype$getMap = function() {
  return this.mapRenderer_.ol_renderer_Map_prototype$getMap()
};
ol.renderer.Layer.prototype.getMapRenderer = function() {
  return this.mapRenderer_
};
ol.renderer.Layer.prototype.handleImageChange = function(a) {
  a.target.ol_ImageBase_prototype$getState() === ol.ImageState.LOADED && this.renderIfReadyAndVisible()
};
ol.renderer.Layer.prototype.renderIfReadyAndVisible = function() {
  var a = this.getLayer();
  a.getVisible() && a.getSourceState() == ol.source.State.READY && this.ol_renderer_Layer_prototype$getMap().render()
};
ol.renderer.Layer.prototype.scheduleExpireCache = function(a, b) {
  b.ol_source_Tile_prototype$canExpireCache() && a.postRenderFunctions.push(goog.partial(function(a, b, e) {
    b = goog.getUid(a).toString();
    a.ol_source_Tile_prototype$expireCache(e.usedTiles[b])
  }, b))
};
ol.renderer.Layer.prototype.updateAttributions = function(a, b) {
  if(goog.isDefAndNotNull(b)) {
    var c, d, e;
    d = 0;
    for(e = b.length;d < e;++d) {
      c = b[d], a[goog.getUid(c).toString()] = c
    }
  }
};
ol.renderer.Layer.prototype.updateLogos = function(a, b) {
  var c = b.getLogo();
  goog.isDef(c) && (a.logos[c] = "")
};
ol.renderer.Layer.prototype.updateUsedTiles = function(a, b, c, d) {
  b = goog.getUid(b).toString();
  c = c.toString();
  b in a ? c in a[b] ? a[b][c].extend(d) : a[b][c] = d : (a[b] = {}, a[b][c] = d)
};
ol.renderer.Layer.prototype.createGetTileIfLoadedFunction = function(a, b, c, d) {
  return function(e, f, g) {
    e = b.getTile(e, f, g, c, d);
    return a(e) ? e : null
  }
};
ol.renderer.Layer.prototype.snapCenterToPixel = function(a, b, c) {
  return[b * (Math.round(a[0] / b) + c[0] % 2 / 2), b * (Math.round(a[1] / b) + c[1] % 2 / 2)]
};
ol.renderer.Layer.prototype.manageTilePyramid = function(a, b, c, d, e, f, g, h, k, l) {
  var m = goog.getUid(b).toString();
  m in a.wantedTiles || (a.wantedTiles[m] = {});
  var n = a.wantedTiles[m];
  a = a.tileQueue;
  var p = c.getMinZoom(), q, r, x, s, t, v;
  for(v = g;v >= p;--v) {
    for(r = c.getTileRangeForExtentAndZ(f, v), x = c.ol_tilegrid_TileGrid_prototype$getResolution(v), s = r.minX;s <= r.maxX;++s) {
      for(t = r.minY;t <= r.maxY;++t) {
        g - v <= h ? (q = b.getTile(v, s, t, d, e), q.ol_Tile_prototype$getState() == ol.TileState.IDLE && (n[q.tileCoord.toString()] = !0, a.isKeyQueued(q.ol_Tile_prototype$getKey()) || a.enqueue([q, m, c.getTileCoordCenter(q.tileCoord), x])), goog.isDef(k) && k.call(l, q)) : b.useTile(v, s, t)
      }
    }
  }
};
ol.vec = {};
ol.vec.Mat4 = {};
ol.vec.Mat4.makeTransform2D = function(a, b, c, d, e, f, g, h) {
  goog.vec.Mat4.makeIdentity(a);
  0 === b && 0 === c || goog.vec.Mat4.translate(a, b, c, 0);
  1 == d && 1 == e || goog.vec.Mat4.scale(a, d, e, 1);
  0 !== f && goog.vec.Mat4.rotateZ(a, f);
  0 === g && 0 === h || goog.vec.Mat4.translate(a, g, h, 0);
  return a
};
ol.vec.Mat4.equals2D = function(a, b) {
  return goog.vec.Mat4.getElement(a, 0, 0) == goog.vec.Mat4.getElement(b, 0, 0) && goog.vec.Mat4.getElement(a, 1, 0) == goog.vec.Mat4.getElement(b, 1, 0) && goog.vec.Mat4.getElement(a, 0, 1) == goog.vec.Mat4.getElement(b, 0, 1) && goog.vec.Mat4.getElement(a, 1, 1) == goog.vec.Mat4.getElement(b, 1, 1) && goog.vec.Mat4.getElement(a, 0, 3) == goog.vec.Mat4.getElement(b, 0, 3) && goog.vec.Mat4.getElement(a, 1, 3) == goog.vec.Mat4.getElement(b, 1, 3)
};
ol.vec.Mat4.multVec2 = function(a, b, c) {
  var d = goog.vec.Mat4.getElement(a, 0, 0), e = goog.vec.Mat4.getElement(a, 1, 0), f = goog.vec.Mat4.getElement(a, 0, 1), g = goog.vec.Mat4.getElement(a, 1, 1), h = goog.vec.Mat4.getElement(a, 0, 3);
  a = goog.vec.Mat4.getElement(a, 1, 3);
  var k = b[0];
  b = b[1];
  c[0] = d * k + f * b + h;
  c[1] = e * k + g * b + a;
  return c
};
ol.renderer.Map = function(a, b) {
  goog.Disposable.call(this);
  this.ol_renderer_Map$map_ = b;
  this.layerRenderers_ = {}
};
goog.inherits(ol.renderer.Map, goog.Disposable);
ol.renderer.Map.prototype.calculateMatrices2D = function(a) {
  var b = a.view2DState, c = a.coordinateToPixelMatrix;
  ol.vec.Mat4.makeTransform2D(c, a.size[0] / 2, a.size[1] / 2, 1 / b.resolution, -1 / b.resolution, -b.rotation, -b.center[0], -b.center[1]);
  goog.vec.Mat4.invert(c, a.pixelToCoordinateMatrix)
};
ol.renderer.Map.prototype.createLayerRenderer = function(a) {
  return new ol.renderer.Layer(this, a)
};
ol.renderer.Map.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.object.forEach(this.layerRenderers_, function(a) {
    goog.dispose(a)
  });
  ol.renderer.Map.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.renderer.Map.prototype.ol_renderer_Map_prototype$forEachFeatureAtPixel = function(a, b, c, d, e, f) {
  var g = this.ol_renderer_Map$map_.getLayerGroup().getLayersArray(), h;
  for(h = g.length - 1;0 <= h;--h) {
    var k = g[h];
    if(k.getVisible() && e.call(f, k) && (k = this.getLayerRenderer(k).ol_renderer_Layer_prototype$forEachFeatureAtPixel(a, b, c, d))) {
      return k
    }
  }
};
ol.renderer.Map.prototype.getLayerRenderer = function(a) {
  var b = goog.getUid(a).toString();
  if(b in this.layerRenderers_) {
    return this.layerRenderers_[b]
  }
  a = this.createLayerRenderer(a);
  return this.layerRenderers_[b] = a
};
ol.renderer.Map.prototype.getLayerRendererByKey = function(a) {
  return this.layerRenderers_[a]
};
ol.renderer.Map.prototype.getLayerRenderers = function() {
  return this.layerRenderers_
};
ol.renderer.Map.prototype.ol_renderer_Map_prototype$getMap = function() {
  return this.ol_renderer_Map$map_
};
ol.renderer.Map.prototype.removeLayerRendererByKey_ = function(a) {
  var b = this.layerRenderers_[a];
  delete this.layerRenderers_[a];
  return b
};
ol.renderer.Map.prototype.renderFrame = goog.nullFunction;
ol.renderer.Map.prototype.removeUnusedLayerRenderers_ = function(a, b) {
  for(var c in this.layerRenderers_) {
    !goog.isNull(b) && c in b.layerStates || goog.dispose(this.removeLayerRendererByKey_(c))
  }
};
ol.renderer.Map.prototype.scheduleRemoveUnusedLayerRenderers = function(a) {
  for(var b in this.layerRenderers_) {
    if(!(b in a.layerStates)) {
      a.postRenderFunctions.push(goog.bind(this.removeUnusedLayerRenderers_, this));
      break
    }
  }
};
ol.layer.Image = function(a) {
  ol.layer.Layer.call(this, a)
};
goog.inherits(ol.layer.Image, ol.layer.Layer);
ol.layer.TileProperty = {PRELOAD:"preload"};
ol.layer.Tile = function(a) {
  ol.layer.Layer.call(this, a);
  this.setPreload(goog.isDef(a.preload) ? a.preload : 0)
};
goog.inherits(ol.layer.Tile, ol.layer.Layer);
ol.layer.Tile.prototype.getPreload = function() {
  return this.get(ol.layer.TileProperty.PRELOAD)
};
goog.exportProperty(ol.layer.Tile.prototype, "getPreload", ol.layer.Tile.prototype.getPreload);
ol.layer.Tile.prototype.setPreload = function(a) {
  this.set(ol.layer.TileProperty.PRELOAD, a)
};
goog.exportProperty(ol.layer.Tile.prototype, "setPreload", ol.layer.Tile.prototype.setPreload);
ol.feature = {};
ol.FeatureProperty = {STYLE_FUNCTION:"styleFunction"};
ol.Feature = function(a) {
  ol.Object.call(this);
  this.ol_Feature$id_ = void 0;
  this.geometryName_ = "geometry";
  this.geometryChangeKey_ = null;
  goog.events.listen(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, !1, this);
  goog.events.listen(this, ol.Object.getChangeEventType(ol.FeatureProperty.STYLE_FUNCTION), this.handleStyleFunctionChange_, !1, this);
  goog.isDefAndNotNull(a) ? a instanceof ol.geom.Geometry ? this.setGeometry(a) : this.ol_Object_prototype$setValues(a) : this.setGeometry(null)
};
goog.inherits(ol.Feature, ol.Object);
ol.Feature.prototype.ol_Feature_prototype$getGeometry = function() {
  return this.get(this.geometryName_)
};
goog.exportProperty(ol.Feature.prototype, "getGeometry", ol.Feature.prototype.ol_Feature_prototype$getGeometry);
ol.Feature.prototype.getId = function() {
  return this.ol_Feature$id_
};
ol.Feature.prototype.getGeometryName = function() {
  return this.geometryName_
};
ol.Feature.prototype.ol_Feature_prototype$getStyleFunction = function() {
  return this.get(ol.FeatureProperty.STYLE_FUNCTION)
};
goog.exportProperty(ol.Feature.prototype, "getStyleFunction", ol.Feature.prototype.ol_Feature_prototype$getStyleFunction);
ol.Feature.prototype.handleGeometryChange_ = function() {
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.Feature.prototype.handleGeometryChanged_ = function() {
  goog.isNull(this.geometryChangeKey_) || (goog.events.unlistenByKey(this.geometryChangeKey_), this.geometryChangeKey_ = null);
  var a = this.ol_Feature_prototype$getGeometry();
  goog.isDefAndNotNull(a) && (this.geometryChangeKey_ = goog.events.listen(a, goog.events.EventType.CHANGE, this.handleGeometryChange_, !1, this));
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.Feature.prototype.handleStyleFunctionChange_ = function() {
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.Feature.prototype.setGeometry = function(a) {
  this.set(this.geometryName_, a)
};
goog.exportProperty(ol.Feature.prototype, "setGeometry", ol.Feature.prototype.setGeometry);
ol.Feature.prototype.ol_Feature_prototype$setStyleFunction = function(a) {
  this.set(ol.FeatureProperty.STYLE_FUNCTION, a)
};
goog.exportProperty(ol.Feature.prototype, "setStyleFunction", ol.Feature.prototype.ol_Feature_prototype$setStyleFunction);
ol.Feature.prototype.setId = function(a) {
  this.ol_Feature$id_ = a
};
ol.Feature.prototype.setGeometryName = function(a) {
  goog.events.unlisten(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, !1, this);
  this.geometryName_ = a;
  goog.events.listen(this, ol.Object.getChangeEventType(this.geometryName_), this.handleGeometryChanged_, !1, this);
  this.handleGeometryChanged_()
};
ol.feature.defaultFeatureStyleFunction = goog.functions.constant([]);
ol.feature.defaultStyleFunction = function(a, b) {
  var c = a.ol_Feature_prototype$getStyleFunction();
  goog.isDef(c) || (c = ol.feature.defaultFeatureStyleFunction);
  return c.call(a, b)
};
ol.layer.VectorProperty = {RENDER_GEOMETRY_FUNCTIONS:"renderGeometryFunctions", STYLE_FUNCTION:"styleFunction"};
ol.layer.Vector = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.layer.Layer.call(this, a);
  goog.isDef(a.styleFunction) && this.ol_layer_Vector_prototype$setStyleFunction(a.styleFunction)
};
goog.inherits(ol.layer.Vector, ol.layer.Layer);
ol.layer.Vector.prototype.getRenderGeometryFunctions = function() {
  return this.get(ol.layer.VectorProperty.RENDER_GEOMETRY_FUNCTIONS)
};
goog.exportProperty(ol.layer.Vector.prototype, "getRenderGeometryFunctions", ol.layer.Vector.prototype.getRenderGeometryFunctions);
ol.layer.Vector.prototype.ol_layer_Vector_prototype$getStyleFunction = function() {
  return this.get(ol.layer.VectorProperty.STYLE_FUNCTION)
};
goog.exportProperty(ol.layer.Vector.prototype, "getStyleFunction", ol.layer.Vector.prototype.ol_layer_Vector_prototype$getStyleFunction);
ol.layer.Vector.prototype.setRenderGeometryFunctions = function(a) {
  this.set(ol.layer.VectorProperty.RENDER_GEOMETRY_FUNCTIONS, a)
};
goog.exportProperty(ol.layer.Vector.prototype, "setRenderGeometryFunctions", ol.layer.Vector.prototype.setRenderGeometryFunctions);
ol.layer.Vector.prototype.ol_layer_Vector_prototype$setStyleFunction = function(a) {
  this.set(ol.layer.VectorProperty.STYLE_FUNCTION, a)
};
goog.exportProperty(ol.layer.Vector.prototype, "setStyleFunction", ol.layer.Vector.prototype.ol_layer_Vector_prototype$setStyleFunction);
ol.render.canvas = {};
ol.render.canvas.defaultFont = "10px sans-serif";
ol.render.canvas.defaultFillStyle = ol.color.fromString("black");
ol.render.canvas.defaultLineCap = "round";
ol.render.canvas.defaultLineDash = [];
ol.render.canvas.defaultLineJoin = "round";
ol.render.canvas.defaultMiterLimit = 10;
ol.render.canvas.defaultStrokeStyle = ol.color.fromString("black");
ol.render.canvas.defaultTextAlign = "start";
ol.render.canvas.defaultTextBaseline = "alphabetic";
ol.render.canvas.defaultLineWidth = 1;
ol.style.Text = function(a) {
  a = goog.isDef(a) ? a : {};
  this.font_ = a.font;
  this.ol_style_Text$rotation_ = a.rotation;
  this.ol_style_Text$text_ = a.text;
  this.textAlign_ = a.textAlign;
  this.textBaseline_ = a.textBaseline;
  this.ol_style_Text$fill_ = goog.isDef(a.fill) ? a.fill : null;
  this.ol_style_Text$stroke_ = goog.isDef(a.stroke) ? a.stroke : null
};
ol.style.Text.equals = function(a, b) {
  return goog.isNull(a) ? goog.isNull(b) ? !0 : !1 : goog.isNull(b) ? !1 : a === b || a.getFont() == b.getFont() && a.ol_style_Text_prototype$getText() == b.ol_style_Text_prototype$getText() && a.getTextAlign() == b.getTextAlign() && a.getTextBaseline() == b.getTextBaseline()
};
ol.style.Text.prototype.getFont = function() {
  return this.font_
};
ol.style.Text.prototype.ol_style_Text_prototype$getFill = function() {
  return this.ol_style_Text$fill_
};
ol.style.Text.prototype.ol_style_Text_prototype$getRotation = function() {
  return this.ol_style_Text$rotation_
};
ol.style.Text.prototype.ol_style_Text_prototype$getStroke = function() {
  return this.ol_style_Text$stroke_
};
ol.style.Text.prototype.ol_style_Text_prototype$getText = function() {
  return this.ol_style_Text$text_
};
ol.style.Text.prototype.getTextAlign = function() {
  return this.textAlign_
};
ol.style.Text.prototype.getTextBaseline = function() {
  return this.textBaseline_
};
ol.render.canvas.Immediate = function(a, b, c, d) {
  this.callbacksByZIndex_ = {};
  this.ol_render_canvas_Immediate$context_ = a;
  this.ol_render_canvas_Immediate$pixelRatio_ = b;
  this.ol_render_canvas_Immediate$extent_ = c;
  this.ol_render_canvas_Immediate$transform_ = d;
  this.ol_render_canvas_Immediate$state_ = {currentFillStyle:void 0, currentStrokeStyle:void 0, currentLineCap:void 0, currentLineDash:null, currentLineJoin:void 0, currentLineWidth:void 0, currentMiterLimit:void 0, fillStyle:void 0, strokeStyle:void 0, lineWidth:void 0, image:null, anchorX:void 0, anchorY:void 0, height:void 0, rotation:0, scale:1, width:void 0, lineCap:void 0, lineDash:null, lineJoin:void 0, miterLimit:void 0, snapToPixel:void 0, textStyle:null};
  this.ol_render_canvas_Immediate$pixelCoordinates_ = [];
  this.ol_render_canvas_Immediate$tmpLocalTransform_ = goog.vec.Mat4.createNumber()
};
ol.render.canvas.Immediate.prototype.drawImages_ = function(a) {
  var b = this.ol_render_canvas_Immediate$state_, c = this.ol_render_canvas_Immediate$context_;
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent()) && !goog.isNull(b.image)) {
    a = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_);
    var d = this.ol_render_canvas_Immediate$tmpLocalTransform_, e, f;
    e = 0;
    for(f = a.length;e < f;e += 2) {
      var g = a[e] - b.anchorX, h = a[e + 1] - b.anchorY;
      b.snapToPixel && (g = g + 0.5 | 0, h = h + 0.5 | 0);
      if(1 != b.scale || 0 !== b.rotation) {
        var k = g + b.anchorX, l = h + b.anchorY;
        ol.vec.Mat4.makeTransform2D(d, k, l, b.scale, b.scale, b.rotation, -k, -l);
        c.setTransform(goog.vec.Mat4.getElement(d, 0, 0), goog.vec.Mat4.getElement(d, 1, 0), goog.vec.Mat4.getElement(d, 0, 1), goog.vec.Mat4.getElement(d, 1, 1), goog.vec.Mat4.getElement(d, 0, 3), goog.vec.Mat4.getElement(d, 1, 3))
      }
      c.drawImage(b.image, g, h, b.width, b.height)
    }
    1 == b.scale && 0 === b.rotation || c.setTransform(1, 0, 0, 1, 0, 0)
  }
};
ol.render.canvas.Immediate.prototype.drawText_ = function(a) {
  var b = this.ol_render_canvas_Immediate$context_, c = this.ol_render_canvas_Immediate$state_, d = c.fillStyle, e = c.strokeStyle, c = c.textStyle;
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent()) && goog.isDefAndNotNull(c) && goog.isDef(c.text) && (goog.isDef(d) || goog.isDef(e))) {
    this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
    a = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_);
    var f, g;
    f = 0;
    for(g = a.length;f < g;f += 2) {
      var h = a[f], k = a[f + 1];
      goog.isDef(e) && b.strokeText(c.text, h, k);
      goog.isDef(d) && b.fillText(c.text, h, k)
    }
  }
};
ol.render.canvas.Immediate.prototype.moveToLineTo_ = function(a, b, c, d) {
  var e = this.ol_render_canvas_Immediate$context_;
  e.moveTo(a[b], a[b + 1]);
  var f;
  for(f = b + 2;f < c;f += 2) {
    e.lineTo(a[f], a[f + 1])
  }
  d && e.lineTo(a[b], a[b + 1]);
  return c
};
ol.render.canvas.Immediate.prototype.drawRings_ = function(a, b, c) {
  var d = this.ol_render_canvas_Immediate$context_, e, f;
  e = 0;
  for(f = c.length;e < f;++e) {
    b = this.moveToLineTo_(a, b, c[e], !0), d.closePath()
  }
  return b
};
ol.render.canvas.Immediate.prototype.drawAsync = function(a, b) {
  var c = a.toString(), d = this.callbacksByZIndex_[c];
  goog.isDef(d) ? d.push(b) : this.callbacksByZIndex_[c] = [b]
};
ol.render.canvas.Immediate.prototype.drawCircleGeometry = function(a, b) {
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent())) {
    var c = this.ol_render_canvas_Immediate$state_;
    if(goog.isDef(c.fillStyle) || goog.isDef(c.strokeStyle)) {
      this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
      var d = this.ol_render_canvas_Immediate$context_, e = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_), f = e[2] - e[0], g = e[3] - e[1], f = Math.sqrt(f * f + g * g);
      d.beginPath();
      d.arc(e[0], e[1], f, 0, 2 * Math.PI);
      goog.isDef(c.fillStyle) && d.fill();
      goog.isDef(c.strokeStyle) && d.stroke()
    }
  }
};
ol.render.canvas.Immediate.prototype.drawFeature = function(a, b) {
  var c = a.ol_Feature_prototype$getGeometry();
  if(!goog.isNull(c) && ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, c.ol_geom_Geometry_prototype$getExtent())) {
    var d = b.getZIndex();
    goog.isDef(d) || (d = 0);
    this.drawAsync(d, function(a) {
      a.setFillStrokeStyle(b.ol_style_Style_prototype$getFill(), b.ol_style_Style_prototype$getStroke());
      a.setImageStyle(b.ol_style_Style_prototype$getImage());
      ol.render.canvas.Immediate.GEOMETRY_RENDERES_[c.ol_geom_Geometry_prototype$getType()].call(a, c, null)
    })
  }
};
ol.render.canvas.Immediate.prototype.drawGeometryCollectionGeometry = function(a, b) {
  var c = a.getGeometriesArray(), d, e;
  d = 0;
  for(e = c.length;d < e;++d) {
    var f = c[d];
    ol.render.canvas.Immediate.GEOMETRY_RENDERES_[f.ol_geom_Geometry_prototype$getType()].call(this, f, b)
  }
};
ol.render.canvas.Immediate.prototype.drawPointGeometry = function(a, b) {
  this.drawImages_(a);
  this.drawText_(a)
};
ol.render.canvas.Immediate.prototype.drawMultiPointGeometry = function(a, b) {
  this.drawImages_(a);
  this.drawText_(a)
};
ol.render.canvas.Immediate.prototype.drawLineStringGeometry = function(a, b) {
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent()) && goog.isDef(this.ol_render_canvas_Immediate$state_.strokeStyle)) {
    this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
    var c = this.ol_render_canvas_Immediate$context_, d = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_);
    c.beginPath();
    this.moveToLineTo_(d, 0, d.length, !1);
    c.stroke()
  }
};
ol.render.canvas.Immediate.prototype.drawMultiLineStringGeometry = function(a, b) {
  var c = a.ol_geom_Geometry_prototype$getExtent();
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, c) && goog.isDef(this.ol_render_canvas_Immediate$state_.strokeStyle)) {
    this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
    var c = this.ol_render_canvas_Immediate$context_, d = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_);
    c.beginPath();
    var e = a.ol_geom_MultiLineString_prototype$getEnds(), f = 0, g, h;
    g = 0;
    for(h = e.length;g < h;++g) {
      f = this.moveToLineTo_(d, f, e[g], !1)
    }
    c.stroke()
  }
};
ol.render.canvas.Immediate.prototype.drawPolygonGeometry = function(a, b) {
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent())) {
    var c = this.ol_render_canvas_Immediate$state_;
    if(goog.isDef(c.fillStyle) || goog.isDef(c.strokeStyle)) {
      this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
      var d = this.ol_render_canvas_Immediate$context_, e = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_), f = a.ol_geom_Polygon_prototype$getEnds();
      d.beginPath();
      this.drawRings_(e, 0, f);
      goog.isDef(c.fillStyle) && d.fill();
      goog.isDef(c.strokeStyle) && d.stroke()
    }
  }
};
ol.render.canvas.Immediate.prototype.drawMultiPolygonGeometry = function(a, b) {
  if(ol.extent.intersects(this.ol_render_canvas_Immediate$extent_, a.ol_geom_Geometry_prototype$getExtent())) {
    var c = this.ol_render_canvas_Immediate$state_;
    if(goog.isDef(c.fillStyle) || goog.isDef(c.strokeStyle)) {
      this.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_();
      var d = this.ol_render_canvas_Immediate$context_, e = ol.geom.transformSimpleGeometry2D(a, this.ol_render_canvas_Immediate$transform_, this.ol_render_canvas_Immediate$pixelCoordinates_), f = a.getEndss(), g = 0, h, k;
      h = 0;
      for(k = f.length;h < k;++h) {
        var l = f[h];
        d.beginPath();
        g = this.drawRings_(e, g, l);
        goog.isDef(c.fillStyle) && d.fill();
        goog.isDef(c.strokeStyle) && d.stroke()
      }
    }
  }
};
ol.render.canvas.Immediate.prototype.ol_render_canvas_Immediate_prototype$flush = function() {
  var a = goog.array.map(goog.object.getKeys(this.callbacksByZIndex_), Number);
  goog.array.sort(a);
  var b, c, d, e, f;
  b = 0;
  for(c = a.length;b < c;++b) {
    for(d = this.callbacksByZIndex_[a[b].toString()], e = 0, f = d.length;e < f;++e) {
      d[e](this)
    }
  }
};
ol.render.canvas.Immediate.prototype.setFillStrokeStyle = function(a, b) {
  var c = this.ol_render_canvas_Immediate$state_;
  if(goog.isNull(a)) {
    c.fillStyle = void 0
  }else {
    var d = a.ol_style_Fill_prototype$getColor();
    c.fillStyle = ol.color.asString(goog.isNull(d) ? ol.render.canvas.defaultFillStyle : d)
  }
  goog.isNull(b) ? (c.strokeStyle = void 0, c.lineCap = void 0, c.lineDash = null, c.lineJoin = void 0, c.lineWidth = void 0, c.miterLimit = void 0) : (d = b.ol_style_Stroke_prototype$getColor(), c.strokeStyle = ol.color.asString(goog.isNull(d) ? ol.render.canvas.defaultStrokeStyle : d), d = b.getLineCap(), c.lineCap = goog.isDef(d) ? d : ol.render.canvas.defaultLineCap, d = b.ol_style_Stroke_prototype$getLineDash(), c.lineDash = goog.isNull(d) ? ol.render.canvas.defaultLineDash : d, d = b.getLineJoin(), 
  c.lineJoin = goog.isDef(d) ? d : ol.render.canvas.defaultLineJoin, d = b.getWidth(), c.lineWidth = this.ol_render_canvas_Immediate$pixelRatio_ * (goog.isDef(d) ? d : ol.render.canvas.defaultLineWidth), d = b.getMiterLimit(), c.miterLimit = goog.isDef(d) ? d : ol.render.canvas.defaultMiterLimit)
};
ol.render.canvas.Immediate.prototype.ol_render_canvas_Immediate_prototype$setFillStrokeStyles_ = function() {
  var a = this.ol_render_canvas_Immediate$state_, b = this.ol_render_canvas_Immediate$context_, c = a.fillStyle, d = a.strokeStyle, e = a.lineCap, f = a.lineDash, g = a.lineJoin, h = a.lineWidth, k = a.miterLimit;
  goog.isDef(c) && a.currentFillStyle != c && (b.fillStyle = c, a.currentFillStyle = c);
  !goog.isDef(d) || a.currentStrokeStyle == d && a.currentLineCap == e && a.currentLineDash == f && a.currentLineJoin == g && a.currentMiterLimit == k && a.currentLineWidth == h || (b.strokeStyle = d, b.lineCap = e, goog.isDef(b.setLineDash) && b.setLineDash(f), b.lineJoin = g, b.miterLimit = k, b.lineWidth = h)
};
ol.render.canvas.Immediate.prototype.setImageStyle = function(a) {
  if(!goog.isNull(a)) {
    var b = a.getAnchor(), c = a.getSize(), d = a.ol_style_Image_prototype$getImage(1), e = this.ol_render_canvas_Immediate$state_;
    e.image = d;
    e.anchorX = b[0];
    e.anchorY = b[1];
    e.height = c[1];
    e.rotation = a.ol_style_Image_prototype$getRotation();
    e.scale = a.getScale();
    e.snapToPixel = a.getSnapToPixel();
    e.width = c[0]
  }
};
ol.render.canvas.Immediate.prototype.setTextStyle = function(a) {
  var b = this.ol_render_canvas_Immediate$context_, c = this.ol_render_canvas_Immediate$state_;
  if(!ol.style.Text.equals(c.textStyle, a)) {
    if(goog.isDefAndNotNull(a)) {
      var d = a.getFont();
      b.font = goog.isDef(d) ? d : ol.render.canvas.defaultFont;
      d = a.getTextAlign();
      b.textAlign = goog.isDef(d) ? d : ol.render.canvas.defaultTextAlign;
      d = a.getTextBaseline();
      b.textBaseline = goog.isDef(d) ? d : ol.render.canvas.defaultTextBaseline
    }
    c.textStyle = a
  }
};
ol.render.canvas.Immediate.GEOMETRY_RENDERES_ = {Point:ol.render.canvas.Immediate.prototype.drawPointGeometry, LineString:ol.render.canvas.Immediate.prototype.drawLineStringGeometry, Polygon:ol.render.canvas.Immediate.prototype.drawPolygonGeometry, MultiPoint:ol.render.canvas.Immediate.prototype.drawMultiPointGeometry, MultiLineString:ol.render.canvas.Immediate.prototype.drawMultiLineStringGeometry, MultiPolygon:ol.render.canvas.Immediate.prototype.drawMultiPolygonGeometry, GeometryCollection:ol.render.canvas.Immediate.prototype.drawGeometryCollectionGeometry, 
Circle:ol.render.canvas.Immediate.prototype.drawCircleGeometry};
ol.renderer.canvas = {};
ol.renderer.canvas.Layer = function(a, b) {
  ol.renderer.Layer.call(this, a, b);
  this.ol_renderer_canvas_Layer$transform_ = goog.vec.Mat4.createNumber()
};
goog.inherits(ol.renderer.canvas.Layer, ol.renderer.Layer);
ol.renderer.canvas.Layer.prototype.ol_renderer_canvas_Layer_prototype$composeFrame = function(a, b, c) {
  this.dispatchPreComposeEvent(c, a);
  var d = this.ol_renderer_canvas_Layer_prototype$getImage();
  if(!goog.isNull(d)) {
    var e = this.getImageTransform();
    c.globalAlpha = b.opacity;
    if(0 === a.view2DState.rotation) {
      b = goog.vec.Mat4.getElement(e, 0, 3);
      var f = goog.vec.Mat4.getElement(e, 1, 3), g = d.width * goog.vec.Mat4.getElement(e, 0, 0), e = d.height * goog.vec.Mat4.getElement(e, 1, 1);
      c.drawImage(d, 0, 0, +d.width, +d.height, Math.round(b), Math.round(f), Math.round(g), Math.round(e))
    }else {
      c.setTransform(goog.vec.Mat4.getElement(e, 0, 0), goog.vec.Mat4.getElement(e, 1, 0), goog.vec.Mat4.getElement(e, 0, 1), goog.vec.Mat4.getElement(e, 1, 1), goog.vec.Mat4.getElement(e, 0, 3), goog.vec.Mat4.getElement(e, 1, 3)), c.drawImage(d, 0, 0), c.setTransform(1, 0, 0, 1, 0, 0)
    }
  }
  this.dispatchPostComposeEvent(c, a)
};
ol.renderer.canvas.Layer.prototype.ol_renderer_canvas_Layer_prototype$dispatchComposeEvent_ = function(a, b, c, d) {
  var e = this.getLayer();
  e.hasListener(a) && (d = goog.isDef(d) ? d : this.getTransform(c), d = new ol.render.canvas.Immediate(b, c.pixelRatio, c.extent, d), a = new ol.render.Event(a, e, d, c, b, null), e.dispatchEvent(a), d.ol_render_canvas_Immediate_prototype$flush())
};
ol.renderer.canvas.Layer.prototype.dispatchPostComposeEvent = function(a, b, c) {
  this.ol_renderer_canvas_Layer_prototype$dispatchComposeEvent_(ol.render.EventType.POSTCOMPOSE, a, b, c)
};
ol.renderer.canvas.Layer.prototype.dispatchPreComposeEvent = function(a, b, c) {
  this.ol_renderer_canvas_Layer_prototype$dispatchComposeEvent_(ol.render.EventType.PRECOMPOSE, a, b, c)
};
ol.renderer.canvas.Layer.prototype.getTransform = function(a) {
  var b = a.view2DState, c = a.pixelRatio;
  return ol.vec.Mat4.makeTransform2D(this.ol_renderer_canvas_Layer$transform_, c * a.size[0] / 2, c * a.size[1] / 2, c / b.resolution, -c / b.resolution, -b.rotation, -b.center[0], -b.center[1])
};
ol.source.Image = function(a) {
  ol.source.Source.call(this, {attributions:a.attributions, extent:a.extent, logo:a.logo, projection:a.projection, state:a.state});
  this.ol_source_Image$resolutions_ = goog.isDef(a.resolutions) ? a.resolutions : null
};
goog.inherits(ol.source.Image, ol.source.Source);
ol.source.Image.prototype.ol_source_Source_prototype$getResolutions = function() {
  return this.ol_source_Image$resolutions_
};
ol.source.Image.prototype.findNearestResolution = function(a) {
  goog.isNull(this.ol_source_Image$resolutions_) || (a = ol.array.linearFindNearest(this.ol_source_Image$resolutions_, a, 0), a = this.ol_source_Image$resolutions_[a]);
  return a
};
ol.renderer.canvas.ImageLayer = function(a, b) {
  ol.renderer.canvas.Layer.call(this, a, b);
  this.ol_renderer_canvas_ImageLayer$image_ = null;
  this.ol_renderer_canvas_ImageLayer$imageTransform_ = goog.vec.Mat4.createNumber()
};
goog.inherits(ol.renderer.canvas.ImageLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.ImageLayer.prototype.ol_renderer_Layer_prototype$forEachFeatureAtPixel = function(a, b, c, d) {
  var e = this.getLayer();
  return e.ol_layer_Layer_prototype$getSource().ol_source_Source_prototype$forEachFeatureAtPixel(b.extent, b.view2DState.resolution, b.view2DState.rotation, a, function(a) {
    return c.call(d, a, e)
  })
};
ol.renderer.canvas.ImageLayer.prototype.ol_renderer_canvas_Layer_prototype$getImage = function() {
  return goog.isNull(this.ol_renderer_canvas_ImageLayer$image_) ? null : this.ol_renderer_canvas_ImageLayer$image_.getImageElement()
};
ol.renderer.canvas.ImageLayer.prototype.getImageTransform = function() {
  return this.ol_renderer_canvas_ImageLayer$imageTransform_
};
ol.renderer.canvas.ImageLayer.prototype.prepareFrame = function(a, b) {
  var c = a.pixelRatio, d = a.view2DState, e = d.center, f = d.resolution, g = d.rotation, h = this.getLayer().ol_layer_Layer_prototype$getSource(), k = a.viewHints;
  k[ol.ViewHint.ANIMATING] || k[ol.ViewHint.INTERACTING] || (d = h.ol_source_Image_prototype$getImage(a.extent, f, c, d.projection), goog.isNull(d) || (k = d.ol_ImageBase_prototype$getState(), k == ol.ImageState.IDLE ? (goog.events.listenOnce(d, goog.events.EventType.CHANGE, this.handleImageChange, !1, this), d.ol_ImageBase_prototype$load()) : k == ol.ImageState.LOADED && (this.ol_renderer_canvas_ImageLayer$image_ = d)));
  if(!goog.isNull(this.ol_renderer_canvas_ImageLayer$image_)) {
    var d = this.ol_renderer_canvas_ImageLayer$image_, k = d.ol_ImageBase_prototype$getExtent(), l = d.ol_ImageBase_prototype$getResolution(), m = d.getPixelRatio(), f = c * l / (f * m);
    ol.vec.Mat4.makeTransform2D(this.ol_renderer_canvas_ImageLayer$imageTransform_, c * a.size[0] / 2, c * a.size[1] / 2, f, f, g, m * (k[0] - e[0]) / l, m * (e[1] - k[3]) / l);
    this.updateAttributions(a.attributions, d.ol_ImageBase_prototype$getAttributions());
    this.updateLogos(a, h)
  }
};
ol.renderer.canvas.TileLayer = function(a, b) {
  ol.renderer.canvas.Layer.call(this, a, b);
  this.ol_renderer_canvas_TileLayer$context_ = this.canvasSize_ = this.ol_renderer_canvas_TileLayer$canvas_ = null;
  this.ol_renderer_canvas_TileLayer$imageTransform_ = goog.vec.Mat4.createNumber();
  this.renderedCanvasZ_ = NaN;
  this.renderedTiles_ = this.renderedCanvasTileRange_ = null
};
goog.inherits(ol.renderer.canvas.TileLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.TileLayer.prototype.ol_renderer_canvas_Layer_prototype$getImage = function() {
  return this.ol_renderer_canvas_TileLayer$canvas_
};
ol.renderer.canvas.TileLayer.prototype.getImageTransform = function() {
  return this.ol_renderer_canvas_TileLayer$imageTransform_
};
ol.renderer.canvas.TileLayer.prototype.prepareFrame = function(a, b) {
  var c = a.pixelRatio, d = a.view2DState, e = d.projection, f = this.getLayer(), g = f.ol_layer_Layer_prototype$getSource(), h = g.getTileGridForProjection(e), k = g.getGutter(), l = h.getZForResolution(d.resolution), m = g.getTilePixelSize(l, a.pixelRatio, e), n = m / h.getTileSize(l), p = h.ol_tilegrid_TileGrid_prototype$getResolution(l), n = p / n, q = d.center, r;
  p == d.resolution ? (q = this.snapCenterToPixel(q, p, a.size), r = ol.extent.getForView2DAndSize(q, p, d.rotation, a.size)) : r = a.extent;
  var x = h.getTileRangeForExtentAndResolution(r, p), s = m * x.getWidth(), t = m * x.getHeight(), v, y;
  goog.isNull(this.ol_renderer_canvas_TileLayer$canvas_) ? (v = goog.dom.createElement(goog.dom.TagName.CANVAS), v.width = s, v.height = t, y = v.getContext("2d"), this.ol_renderer_canvas_TileLayer$canvas_ = v, this.canvasSize_ = [s, t], this.ol_renderer_canvas_TileLayer$context_ = y) : (v = this.ol_renderer_canvas_TileLayer$canvas_, y = this.ol_renderer_canvas_TileLayer$context_, this.canvasSize_[0] < s || this.canvasSize_[1] < t ? (v.width = s, v.height = t, this.canvasSize_ = [s, t], this.renderedCanvasTileRange_ = 
  null) : (s = this.canvasSize_[0], t = this.canvasSize_[1], l == this.renderedCanvasZ_ && this.renderedCanvasTileRange_.containsTileRange(x) || (this.renderedCanvasTileRange_ = null)));
  var w, u;
  goog.isNull(this.renderedCanvasTileRange_) ? (s /= m, t /= m, w = x.minX - Math.floor((s - x.getWidth()) / 2), u = x.minY - Math.floor((t - x.getHeight()) / 2), this.renderedCanvasZ_ = l, this.renderedCanvasTileRange_ = new ol.TileRange(w, w + s - 1, u, u + t - 1), this.renderedTiles_ = Array(s * t), t = this.renderedCanvasTileRange_) : (t = this.renderedCanvasTileRange_, s = t.getWidth());
  v = {};
  v[l] = {};
  var A = [], D = this.createGetTileIfLoadedFunction(function(a) {
    return!goog.isNull(a) && a.ol_Tile_prototype$getState() == ol.TileState.LOADED
  }, g, c, e), C = goog.bind(g.findLoadedTiles, g, v, D), D = ol.extent.createEmpty(), G = new ol.TileRange(0, 0, 0, 0), F, z, B;
  for(u = x.minX;u <= x.maxX;++u) {
    for(B = x.minY;B <= x.maxY;++B) {
      z = g.getTile(l, u, B, c, e), w = z.ol_Tile_prototype$getState(), w == ol.TileState.LOADED || w == ol.TileState.EMPTY || w == ol.TileState.ERROR ? v[l][z.tileCoord.toString()] = z : (F = h.forEachTileCoordParentTileRange(z.tileCoord, C, null, G, D), F || (A.push(z), F = h.getTileCoordChildTileRange(z.tileCoord, G, D), goog.isNull(F) || C(l + 1, F)))
    }
  }
  C = 0;
  for(F = A.length;C < F;++C) {
    z = A[C], u = m * (z.tileCoord.x - t.minX), B = m * (t.maxY - z.tileCoord.y), y.clearRect(u, B, m, m)
  }
  A = goog.array.map(goog.object.getKeys(v), Number);
  goog.array.sort(A);
  var H = g.getOpaque(), E = ol.extent.getTopLeft(h.getTileCoordExtent(new ol.TileCoord(l, t.minX, t.maxY), D)), J, I, M, L, K, N, C = 0;
  for(F = A.length;C < F;++C) {
    if(J = A[C], m = g.getTilePixelSize(J, c, e), L = v[J], J == l) {
      for(M in L) {
        z = L[M], I = (z.tileCoord.y - t.minY) * s + (z.tileCoord.x - t.minX), this.renderedTiles_[I] != z && (u = m * (z.tileCoord.x - t.minX), B = m * (t.maxY - z.tileCoord.y), w = z.ol_Tile_prototype$getState(), w != ol.TileState.EMPTY && w != ol.TileState.ERROR && H || y.clearRect(u, B, m, m), w == ol.TileState.LOADED && y.drawImage(z.ol_Tile_prototype$getImage(), k, k, m, m, u, B, m, m), this.renderedTiles_[I] = z)
      }
    }else {
      for(M in J = h.ol_tilegrid_TileGrid_prototype$getResolution(J) / p, L) {
        for(z = L[M], I = h.getTileCoordExtent(z.tileCoord, D), u = (I[0] - E[0]) / n, B = (E[1] - I[3]) / n, N = J * m, K = J * m, w = z.ol_Tile_prototype$getState(), w != ol.TileState.EMPTY && H || y.clearRect(u, B, N, K), w == ol.TileState.LOADED && y.drawImage(z.ol_Tile_prototype$getImage(), k, k, m, m, u, B, N, K), z = h.getTileRangeForExtentAndZ(I, l, G), w = Math.max(z.minX, t.minX), B = Math.min(z.maxX, t.maxX), u = Math.max(z.minY, t.minY), z = Math.min(z.maxY, t.maxY);w <= B;++w) {
          for(K = u;K <= z;++K) {
            I = (K - t.minY) * s + (w - t.minX), this.renderedTiles_[I] = void 0
          }
        }
      }
    }
  }
  this.updateUsedTiles(a.usedTiles, g, l, x);
  this.manageTilePyramid(a, g, h, c, e, r, l, f.getPreload());
  this.scheduleExpireCache(a, g);
  this.updateLogos(a, g);
  ol.vec.Mat4.makeTransform2D(this.ol_renderer_canvas_TileLayer$imageTransform_, c * a.size[0] / 2, c * a.size[1] / 2, c * n / d.resolution, c * n / d.resolution, d.rotation, (E[0] - q[0]) / n, (q[1] - E[1]) / n)
};
ol.render.ReplayType = {IMAGE:"Image", LINE_STRING:"LineString", POLYGON:"Polygon"};
ol.render.REPLAY_ORDER = [ol.render.ReplayType.POLYGON, ol.render.ReplayType.LINE_STRING, ol.render.ReplayType.IMAGE];
ol.render.IReplayGroup = function() {
};
ol.render.IReplayGroup.prototype.ol_render_IReplayGroup_prototype$finish = function() {
};
ol.render.IReplayGroup.prototype.getReplay = function(a, b) {
};
ol.render.IReplayGroup.prototype.isEmpty = function() {
};
ol.render.canvas.Instruction = {BEGIN_GEOMETRY:0, BEGIN_PATH:1, CIRCLE:2, CLOSE_PATH:3, DRAW_IMAGE:4, END_GEOMETRY:5, FILL:6, MOVE_TO_LINE_TO:7, SET_FILL_STYLE:8, SET_STROKE_STYLE:9, STROKE:10};
ol.render.canvas.Replay = function(a) {
  this.tolerance = a;
  this.beginGeometryInstruction2_ = this.beginGeometryInstruction1_ = null;
  this.instructions = [];
  this.ol_render_canvas_Replay$coordinates = [];
  this.renderedTransform_ = goog.vec.Mat4.createNumber();
  this.hitDetectionInstructions = [];
  this.ol_render_canvas_Replay$pixelCoordinates_ = [];
  this.ol_render_canvas_Replay$extent_ = ol.extent.createEmpty();
  this.ol_render_canvas_Replay$tmpLocalTransform_ = goog.vec.Mat4.createNumber()
};
ol.render.canvas.Replay.prototype.appendFlatCoordinates = function(a, b, c, d, e) {
  var f = this.ol_render_canvas_Replay$coordinates.length, g;
  for(g = b;g < c;g += d) {
    this.ol_render_canvas_Replay$coordinates[f++] = a[g], this.ol_render_canvas_Replay$coordinates[f++] = a[g + 1]
  }
  e && (this.ol_render_canvas_Replay$coordinates[f++] = a[b], this.ol_render_canvas_Replay$coordinates[f++] = a[b + 1]);
  return f
};
ol.render.canvas.Replay.prototype.beginGeometry = function(a) {
  this.beginGeometryInstruction1_ = [ol.render.canvas.Instruction.BEGIN_GEOMETRY, a, 0];
  this.instructions.push(this.beginGeometryInstruction1_);
  this.beginGeometryInstruction2_ = [ol.render.canvas.Instruction.BEGIN_GEOMETRY, a, 0];
  this.hitDetectionInstructions.push(this.beginGeometryInstruction2_)
};
ol.render.canvas.Replay.prototype.ol_render_canvas_Replay_prototype$replay_ = function(a, b, c, d, e, f) {
  var g;
  ol.vec.Mat4.equals2D(c, this.renderedTransform_) ? g = this.ol_render_canvas_Replay$pixelCoordinates_ : (g = ol.geom.flat.transform2D(this.ol_render_canvas_Replay$coordinates, 2, c, this.ol_render_canvas_Replay$pixelCoordinates_), goog.vec.Mat4.setFromArray(this.renderedTransform_, c));
  c = 0;
  for(var h = e.length, k = 0, l, m = this.ol_render_canvas_Replay$tmpLocalTransform_;c < h;) {
    var n = e[c];
    switch(n[0]) {
      case ol.render.canvas.Instruction.BEGIN_GEOMETRY:
        l = n[1];
        d(l) ? ++c : c = n[2];
        break;
      case ol.render.canvas.Instruction.BEGIN_PATH:
        a.beginPath();
        ++c;
        break;
      case ol.render.canvas.Instruction.CIRCLE:
        l = g[k];
        var p = g[k + 1], q = g[k + 2] - l, r = g[k + 3] - p, q = Math.sqrt(q * q + r * r);
        a.arc(l, p, q, 0, 2 * Math.PI, !0);
        k += 4;
        ++c;
        break;
      case ol.render.canvas.Instruction.CLOSE_PATH:
        a.closePath();
        ++c;
        break;
      case ol.render.canvas.Instruction.DRAW_IMAGE:
        k = n[1];
        l = n[2];
        for(var p = n[3], q = n[4] * b, r = n[5] * b, x = n[6] * b, s = n[7], t = n[8], v = n[9], n = n[10] * b;k < l;k += 2) {
          var y = g[k] - q, w = g[k + 1] - r;
          v && (y = y + 0.5 | 0, w = w + 0.5 | 0);
          if(1 != t || 0 !== s) {
            var u = y + q, A = w + r;
            ol.vec.Mat4.makeTransform2D(m, u, A, t, t, s, -u, -A);
            a.setTransform(goog.vec.Mat4.getElement(m, 0, 0), goog.vec.Mat4.getElement(m, 1, 0), goog.vec.Mat4.getElement(m, 0, 1), goog.vec.Mat4.getElement(m, 1, 1), goog.vec.Mat4.getElement(m, 0, 3), goog.vec.Mat4.getElement(m, 1, 3))
          }
          a.drawImage(p, y, w, n, x);
          1 == t && 0 === s || a.setTransform(1, 0, 0, 1, 0, 0)
        }
        ++c;
        break;
      case ol.render.canvas.Instruction.END_GEOMETRY:
        if(goog.isDef(f) && (l = n[1], l = f(l, n[2]))) {
          return l
        }
        ++c;
        break;
      case ol.render.canvas.Instruction.FILL:
        a.fill();
        ++c;
        break;
      case ol.render.canvas.Instruction.MOVE_TO_LINE_TO:
        k = n[1];
        l = n[2];
        a.moveTo(g[k], g[k + 1]);
        for(k += 2;k < l;k += 2) {
          a.lineTo(g[k], g[k + 1])
        }
        ++c;
        break;
      case ol.render.canvas.Instruction.SET_FILL_STYLE:
        a.fillStyle = n[1];
        ++c;
        break;
      case ol.render.canvas.Instruction.SET_STROKE_STYLE:
        a.strokeStyle = n[1];
        a.lineWidth = n[2] * b;
        a.lineCap = n[3];
        a.lineJoin = n[4];
        a.miterLimit = n[5];
        goog.isDef(a.setLineDash) && a.setLineDash(n[6]);
        ++c;
        break;
      case ol.render.canvas.Instruction.STROKE:
        a.stroke();
        ++c;
        break;
      default:
        ++c
    }
  }
};
ol.render.canvas.Replay.prototype.ol_render_canvas_Replay_prototype$replay = function(a, b, c, d) {
  return this.ol_render_canvas_Replay_prototype$replay_(a, b, c, d, this.instructions, void 0)
};
ol.render.canvas.Replay.prototype.replayHitDetection = function(a, b, c, d) {
  return this.ol_render_canvas_Replay_prototype$replay_(a, 1, b, c, this.hitDetectionInstructions, d)
};
ol.render.canvas.Replay.prototype.reverseHitDetectionInstructions_ = function() {
  var a = this.hitDetectionInstructions;
  a.reverse();
  var b, c = a.length, d, e = -1;
  for(b = 0;b < c;++b) {
    d = a[b], d = d[0], d == ol.render.canvas.Instruction.END_GEOMETRY ? e = b : d == ol.render.canvas.Instruction.BEGIN_GEOMETRY && (ol.array.reverseSubArray(this.hitDetectionInstructions, e, b), e = -1)
  }
};
ol.render.canvas.Replay.prototype.endGeometry = function(a, b) {
  this.beginGeometryInstruction1_[2] = this.instructions.length;
  this.beginGeometryInstruction1_ = null;
  this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length;
  this.beginGeometryInstruction2_ = null;
  var c = [ol.render.canvas.Instruction.END_GEOMETRY, a, b];
  this.instructions.push(c);
  this.hitDetectionInstructions.push(c)
};
ol.render.canvas.Replay.prototype.ol_render_canvas_Replay_prototype$finish = goog.nullFunction;
ol.render.canvas.Replay.prototype.ol_render_canvas_Replay_prototype$getExtent = function() {
  return this.ol_render_canvas_Replay$extent_
};
ol.render.canvas.ImageReplay = function(a) {
  ol.render.canvas.Replay.call(this, a);
  this.ol_render_canvas_ImageReplay$image_ = this.hitDetectionImage_ = null;
  this.ol_render_canvas_ImageReplay$width_ = this.ol_render_canvas_ImageReplay$snapToPixel_ = this.ol_render_canvas_ImageReplay$scale_ = this.ol_render_canvas_ImageReplay$rotation_ = this.height_ = this.anchorY_ = this.anchorX_ = void 0
};
goog.inherits(ol.render.canvas.ImageReplay, ol.render.canvas.Replay);
ol.render.canvas.ImageReplay.prototype.drawCoordinates_ = function(a, b, c, d) {
  return this.appendFlatCoordinates(a, b, c, d, !1)
};
ol.render.canvas.ImageReplay.prototype.drawPointGeometry = function(a, b) {
  if(!goog.isNull(this.ol_render_canvas_ImageReplay$image_)) {
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.beginGeometry(a);
    var c = a.getFlatCoordinates(), d = a.getStride(), e = this.ol_render_canvas_Replay$coordinates.length, c = this.drawCoordinates_(c, 0, c.length, d);
    this.instructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, e, c, this.ol_render_canvas_ImageReplay$image_, this.anchorX_, this.anchorY_, this.height_, this.ol_render_canvas_ImageReplay$rotation_, this.ol_render_canvas_ImageReplay$scale_, this.ol_render_canvas_ImageReplay$snapToPixel_, this.ol_render_canvas_ImageReplay$width_]);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, e, c, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.ol_render_canvas_ImageReplay$rotation_, this.ol_render_canvas_ImageReplay$scale_, this.ol_render_canvas_ImageReplay$snapToPixel_, this.ol_render_canvas_ImageReplay$width_]);
    this.endGeometry(a, b)
  }
};
ol.render.canvas.ImageReplay.prototype.drawMultiPointGeometry = function(a, b) {
  if(!goog.isNull(this.ol_render_canvas_ImageReplay$image_)) {
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.beginGeometry(a);
    var c = a.getFlatCoordinates(), d = a.getStride(), e = this.ol_render_canvas_Replay$coordinates.length, c = this.drawCoordinates_(c, 0, c.length, d);
    this.instructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, e, c, this.ol_render_canvas_ImageReplay$image_, this.anchorX_, this.anchorY_, this.height_, this.ol_render_canvas_ImageReplay$rotation_, this.ol_render_canvas_ImageReplay$scale_, this.ol_render_canvas_ImageReplay$snapToPixel_, this.ol_render_canvas_ImageReplay$width_]);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.DRAW_IMAGE, e, c, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.ol_render_canvas_ImageReplay$rotation_, this.ol_render_canvas_ImageReplay$scale_, this.ol_render_canvas_ImageReplay$snapToPixel_, this.ol_render_canvas_ImageReplay$width_]);
    this.endGeometry(a, b)
  }
};
ol.render.canvas.ImageReplay.prototype.ol_render_canvas_Replay_prototype$finish = function() {
  this.reverseHitDetectionInstructions_();
  this.anchorY_ = this.anchorX_ = void 0;
  this.ol_render_canvas_ImageReplay$image_ = this.hitDetectionImage_ = null;
  this.ol_render_canvas_ImageReplay$width_ = this.ol_render_canvas_ImageReplay$snapToPixel_ = this.ol_render_canvas_ImageReplay$rotation_ = this.ol_render_canvas_ImageReplay$scale_ = this.height_ = void 0
};
ol.render.canvas.ImageReplay.prototype.setImageStyle = function(a) {
  var b = a.getAnchor(), c = a.getSize(), d = a.getHitDetectionImage(1), e = a.ol_style_Image_prototype$getImage(1);
  this.anchorX_ = b[0];
  this.anchorY_ = b[1];
  this.hitDetectionImage_ = d;
  this.ol_render_canvas_ImageReplay$image_ = e;
  this.height_ = c[1];
  this.ol_render_canvas_ImageReplay$rotation_ = a.ol_style_Image_prototype$getRotation();
  this.ol_render_canvas_ImageReplay$scale_ = a.getScale();
  this.ol_render_canvas_ImageReplay$snapToPixel_ = a.getSnapToPixel();
  this.ol_render_canvas_ImageReplay$width_ = c[0]
};
ol.render.canvas.LineStringReplay = function(a) {
  ol.render.canvas.Replay.call(this, a);
  this.ol_render_canvas_LineStringReplay$state_ = {currentStrokeStyle:void 0, currentLineCap:void 0, currentLineDash:null, currentLineJoin:void 0, currentLineWidth:void 0, currentMiterLimit:void 0, lastStroke:0, strokeStyle:void 0, lineCap:void 0, lineDash:null, lineJoin:void 0, lineWidth:void 0, miterLimit:void 0}
};
goog.inherits(ol.render.canvas.LineStringReplay, ol.render.canvas.Replay);
ol.render.canvas.LineStringReplay.prototype.drawFlatCoordinates_ = function(a, b, c, d) {
  var e = this.ol_render_canvas_Replay$coordinates.length;
  a = this.appendFlatCoordinates(a, b, c, d, !1);
  e = [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, e, a];
  this.instructions.push(e);
  this.hitDetectionInstructions.push(e);
  return c
};
ol.render.canvas.LineStringReplay.prototype.setStrokeStyle_ = function() {
  var a = this.ol_render_canvas_LineStringReplay$state_, b = a.strokeStyle, c = a.lineCap, d = a.lineDash, e = a.lineJoin, f = a.lineWidth, g = a.miterLimit;
  if(a.currentStrokeStyle != b || a.currentLineCap != c || a.currentLineDash != d || a.currentLineJoin != e || a.currentLineWidth != f || a.currentMiterLimit != g) {
    a.lastStroke != this.ol_render_canvas_Replay$coordinates.length && (this.instructions.push([ol.render.canvas.Instruction.STROKE]), a.lastStroke = this.ol_render_canvas_Replay$coordinates.length), this.instructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, b, f, c, e, g, d], [ol.render.canvas.Instruction.BEGIN_PATH]), a.currentStrokeStyle = b, a.currentLineCap = c, a.currentLineDash = d, a.currentLineJoin = e, a.currentLineWidth = f, a.currentMiterLimit = g
  }
};
ol.render.canvas.LineStringReplay.prototype.drawLineStringGeometry = function(a, b) {
  var c = this.ol_render_canvas_LineStringReplay$state_, d = c.lineWidth;
  goog.isDef(c.strokeStyle) && goog.isDef(d) && (ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent()), this.setStrokeStyle_(), this.beginGeometry(a), this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c.strokeStyle, c.lineWidth, c.lineCap, c.lineJoin, c.miterLimit, c.lineDash], [ol.render.canvas.Instruction.BEGIN_PATH]), c = a.getFlatCoordinates(), d = a.getStride(), this.drawFlatCoordinates_(c, 0, c.length, d), this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]), 
  this.endGeometry(a, b))
};
ol.render.canvas.LineStringReplay.prototype.drawMultiLineStringGeometry = function(a, b) {
  var c = this.ol_render_canvas_LineStringReplay$state_, d = c.lineWidth;
  if(goog.isDef(c.strokeStyle) && goog.isDef(d)) {
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.setStrokeStyle_();
    this.beginGeometry(a);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c.strokeStyle, c.lineWidth, c.lineCap, c.lineJoin, c.miterLimit, c.lineDash], [ol.render.canvas.Instruction.BEGIN_PATH]);
    var c = a.ol_geom_MultiLineString_prototype$getEnds(), d = a.getFlatCoordinates(), e = a.getStride(), f = 0, g, h;
    g = 0;
    for(h = c.length;g < h;++g) {
      f = this.drawFlatCoordinates_(d, f, c[g], e)
    }
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.STROKE]);
    this.endGeometry(a, b)
  }
};
ol.render.canvas.LineStringReplay.prototype.ol_render_canvas_Replay_prototype$finish = function() {
  this.ol_render_canvas_LineStringReplay$state_.lastStroke != this.ol_render_canvas_Replay$coordinates.length && this.instructions.push([ol.render.canvas.Instruction.STROKE]);
  this.reverseHitDetectionInstructions_();
  this.ol_render_canvas_LineStringReplay$state_ = null
};
ol.render.canvas.LineStringReplay.prototype.setFillStrokeStyle = function(a, b) {
  var c = b.ol_style_Stroke_prototype$getColor();
  this.ol_render_canvas_LineStringReplay$state_.strokeStyle = ol.color.asString(goog.isNull(c) ? ol.render.canvas.defaultStrokeStyle : c);
  c = b.getLineCap();
  this.ol_render_canvas_LineStringReplay$state_.lineCap = goog.isDef(c) ? c : ol.render.canvas.defaultLineCap;
  c = b.ol_style_Stroke_prototype$getLineDash();
  this.ol_render_canvas_LineStringReplay$state_.lineDash = goog.isNull(c) ? ol.render.canvas.defaultLineDash : c;
  c = b.getLineJoin();
  this.ol_render_canvas_LineStringReplay$state_.lineJoin = goog.isDef(c) ? c : ol.render.canvas.defaultLineJoin;
  c = b.getWidth();
  this.ol_render_canvas_LineStringReplay$state_.lineWidth = goog.isDef(c) ? c : ol.render.canvas.defaultLineWidth;
  c = b.getMiterLimit();
  this.ol_render_canvas_LineStringReplay$state_.miterLimit = goog.isDef(c) ? c : ol.render.canvas.defaultMiterLimit
};
ol.render.canvas.PolygonReplay = function(a) {
  ol.render.canvas.Replay.call(this, a);
  this.ol_render_canvas_PolygonReplay$state_ = {currentFillStyle:void 0, currentStrokeStyle:void 0, currentLineCap:void 0, currentLineDash:null, currentLineJoin:void 0, currentLineWidth:void 0, currentMiterLimit:void 0, fillStyle:void 0, strokeStyle:void 0, lineCap:void 0, lineDash:null, lineJoin:void 0, lineWidth:void 0, miterLimit:void 0}
};
goog.inherits(ol.render.canvas.PolygonReplay, ol.render.canvas.Replay);
ol.render.canvas.PolygonReplay.prototype.drawFlatCoordinatess_ = function(a, b, c, d) {
  var e = this.ol_render_canvas_PolygonReplay$state_, f = [ol.render.canvas.Instruction.BEGIN_PATH];
  this.instructions.push(f);
  this.hitDetectionInstructions.push(f);
  var g, f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f], k = this.ol_render_canvas_Replay$coordinates.length;
    b = this.appendFlatCoordinates(a, b, h, d, !0);
    b = [ol.render.canvas.Instruction.MOVE_TO_LINE_TO, k, b];
    k = [ol.render.canvas.Instruction.CLOSE_PATH];
    this.instructions.push(b, k);
    this.hitDetectionInstructions.push(b, k);
    b = h
  }
  a = [ol.render.canvas.Instruction.FILL];
  this.hitDetectionInstructions.push(a);
  goog.isDef(e.fillStyle) && this.instructions.push(a);
  goog.isDef(e.strokeStyle) && (e = [ol.render.canvas.Instruction.STROKE], this.instructions.push(e), this.hitDetectionInstructions.push(e));
  return b
};
ol.render.canvas.PolygonReplay.prototype.drawCircleGeometry = function(a, b) {
  var c = this.ol_render_canvas_PolygonReplay$state_, d = c.strokeStyle;
  if(goog.isDef(c.fillStyle) || goog.isDef(d)) {
    goog.isDef(d);
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.ol_render_canvas_PolygonReplay_prototype$setFillStrokeStyles_();
    this.beginGeometry(a);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
    goog.isDef(c.strokeStyle) && this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c.strokeStyle, c.lineWidth, c.lineCap, c.lineJoin, c.miterLimit, c.lineDash]);
    var d = a.getFlatCoordinates(), e = a.getStride();
    this.appendFlatCoordinates(d, 0, d.length, e, !1);
    d = [ol.render.canvas.Instruction.BEGIN_PATH];
    e = [ol.render.canvas.Instruction.CIRCLE];
    this.instructions.push(d, e);
    this.hitDetectionInstructions.push(d, e);
    this.endGeometry(a, b);
    d = [ol.render.canvas.Instruction.FILL];
    this.hitDetectionInstructions.push(d);
    goog.isDef(c.fillStyle) && this.instructions.push(d);
    goog.isDef(c.strokeStyle) && (c = [ol.render.canvas.Instruction.STROKE], this.instructions.push(c), this.hitDetectionInstructions.push(c))
  }
};
ol.render.canvas.PolygonReplay.prototype.drawPolygonGeometry = function(a, b) {
  var c = this.ol_render_canvas_PolygonReplay$state_, d = c.strokeStyle;
  if(goog.isDef(c.fillStyle) || goog.isDef(d)) {
    goog.isDef(d);
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.ol_render_canvas_PolygonReplay_prototype$setFillStrokeStyles_();
    this.beginGeometry(a);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
    goog.isDef(c.strokeStyle) && this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c.strokeStyle, c.lineWidth, c.lineCap, c.lineJoin, c.miterLimit, c.lineDash]);
    var c = a.ol_geom_Polygon_prototype$getEnds(), d = a.ol_geom_Polygon_prototype$getOrientedFlatCoordinates(), e = a.getStride();
    this.drawFlatCoordinatess_(d, 0, c, e);
    this.endGeometry(a, b)
  }
};
ol.render.canvas.PolygonReplay.prototype.drawMultiPolygonGeometry = function(a, b) {
  var c = this.ol_render_canvas_PolygonReplay$state_, d = c.strokeStyle;
  if(goog.isDef(c.fillStyle) || goog.isDef(d)) {
    goog.isDef(d);
    ol.extent.extend(this.ol_render_canvas_Replay$extent_, a.ol_geom_Geometry_prototype$getExtent());
    this.ol_render_canvas_PolygonReplay_prototype$setFillStrokeStyles_();
    this.beginGeometry(a);
    this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, ol.color.asString(ol.render.canvas.defaultFillStyle)]);
    goog.isDef(c.strokeStyle) && this.hitDetectionInstructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c.strokeStyle, c.lineWidth, c.lineCap, c.lineJoin, c.miterLimit, c.lineDash]);
    var c = a.getEndss(), d = a.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates(), e = a.getStride(), f = 0, g, h;
    g = 0;
    for(h = c.length;g < h;++g) {
      f = this.drawFlatCoordinatess_(d, f, c[g], e)
    }
    this.endGeometry(a, b)
  }
};
ol.render.canvas.PolygonReplay.prototype.ol_render_canvas_Replay_prototype$finish = function() {
  this.reverseHitDetectionInstructions_();
  this.ol_render_canvas_PolygonReplay$state_ = null;
  var a = this.tolerance;
  if(0 !== a) {
    var b = this.ol_render_canvas_Replay$coordinates, c, d;
    c = 0;
    for(d = b.length;c < d;++c) {
      b[c] = ol.geom.simplify.snap(b[c], a)
    }
  }
};
ol.render.canvas.PolygonReplay.prototype.setFillStrokeStyle = function(a, b) {
  var c = this.ol_render_canvas_PolygonReplay$state_;
  if(goog.isNull(a)) {
    c.fillStyle = void 0
  }else {
    var d = a.ol_style_Fill_prototype$getColor();
    c.fillStyle = ol.color.asString(goog.isNull(d) ? ol.render.canvas.defaultFillStyle : d)
  }
  goog.isNull(b) ? (c.strokeStyle = void 0, c.lineCap = void 0, c.lineDash = null, c.lineJoin = void 0, c.lineWidth = void 0, c.miterLimit = void 0) : (d = b.ol_style_Stroke_prototype$getColor(), c.strokeStyle = ol.color.asString(goog.isNull(d) ? ol.render.canvas.defaultStrokeStyle : d), d = b.getLineCap(), c.lineCap = goog.isDef(d) ? d : ol.render.canvas.defaultLineCap, d = b.ol_style_Stroke_prototype$getLineDash(), c.lineDash = goog.isNull(d) ? ol.render.canvas.defaultLineDash : d, d = b.getLineJoin(), 
  c.lineJoin = goog.isDef(d) ? d : ol.render.canvas.defaultLineJoin, d = b.getWidth(), c.lineWidth = goog.isDef(d) ? d : ol.render.canvas.defaultLineWidth, d = b.getMiterLimit(), c.miterLimit = goog.isDef(d) ? d : ol.render.canvas.defaultMiterLimit)
};
ol.render.canvas.PolygonReplay.prototype.ol_render_canvas_PolygonReplay_prototype$setFillStrokeStyles_ = function() {
  var a = this.ol_render_canvas_PolygonReplay$state_, b = a.fillStyle, c = a.strokeStyle, d = a.lineCap, e = a.lineDash, f = a.lineJoin, g = a.lineWidth, h = a.miterLimit;
  goog.isDef(b) && a.currentFillStyle != b && (this.instructions.push([ol.render.canvas.Instruction.SET_FILL_STYLE, b]), a.currentFillStyle = a.fillStyle);
  !goog.isDef(c) || a.currentStrokeStyle == c && a.currentLineCap == d && a.currentLineDash == e && a.currentLineJoin == f && a.currentLineWidth == g && a.currentMiterLimit == h || (this.instructions.push([ol.render.canvas.Instruction.SET_STROKE_STYLE, c, g, d, f, h, e]), a.currentStrokeStyle = c, a.currentLineCap = d, a.currentLineDash = e, a.currentLineJoin = f, a.currentLineWidth = g, a.currentMiterLimit = h)
};
ol.render.canvas.ReplayGroup = function(a) {
  this.tolerance_ = a;
  this.replaysByZIndex_ = {};
  a = goog.dom.createElement(goog.dom.TagName.CANVAS);
  a.width = 1;
  a.height = 1;
  this.hitDetectionContext_ = a.getContext("2d");
  this.hitDetectionTransform_ = goog.vec.Mat4.createNumber()
};
ol.render.canvas.ReplayGroup.prototype.ol_render_canvas_ReplayGroup_prototype$replay = function(a, b, c, d, e) {
  var f = goog.array.map(goog.object.getKeys(this.replaysByZIndex_), Number);
  goog.array.sort(f);
  return this.ol_render_canvas_ReplayGroup_prototype$replay_(f, a, b, c, d, e)
};
ol.render.canvas.ReplayGroup.prototype.replayHitDetection_ = function(a, b, c, d, e, f) {
  var g, h, k, l, m;
  g = 0;
  for(h = a.length;g < h;++g) {
    for(l in k = this.replaysByZIndex_[a[g].toString()], k) {
      if(m = k[l], ol.extent.intersects(c, m.ol_render_canvas_Replay_prototype$getExtent()) && (m = m.replayHitDetection(b, d, e, f))) {
        return m
      }
    }
  }
};
ol.render.canvas.ReplayGroup.prototype.ol_render_canvas_ReplayGroup_prototype$replay_ = function(a, b, c, d, e, f) {
  var g, h, k, l, m, n;
  g = 0;
  for(h = a.length;g < h;++g) {
    for(m = this.replaysByZIndex_[a[g].toString()], k = 0, l = ol.render.REPLAY_ORDER.length;k < l;++k) {
      if(n = m[ol.render.REPLAY_ORDER[k]], goog.isDef(n) && ol.extent.intersects(c, n.ol_render_canvas_Replay_prototype$getExtent()) && (n = n.ol_render_canvas_Replay_prototype$replay(b, d, e, f))) {
        return n
      }
    }
  }
};
ol.render.canvas.ReplayGroup.prototype.forEachGeometryAtPixel = function(a, b, c, d, e, f) {
  var g = this.hitDetectionTransform_;
  ol.vec.Mat4.makeTransform2D(g, 0.5, 0.5, 1 / b, -1 / b, -c, -d[0], -d[1]);
  b = goog.array.map(goog.object.getKeys(this.replaysByZIndex_), Number);
  goog.array.sort(b, function(a, b) {
    return b - a
  });
  var h = this.hitDetectionContext_;
  h.clearRect(0, 0, 1, 1);
  return this.replayHitDetection_(b, h, a, g, e, function(a, b) {
    if(0 < h.getImageData(0, 0, 1, 1).data[3]) {
      var c = f(a, b);
      if(c) {
        return c
      }
      h.clearRect(0, 0, 1, 1)
    }
  })
};
ol.render.canvas.ReplayGroup.prototype.ol_render_IReplayGroup_prototype$finish = function() {
  for(var a in this.replaysByZIndex_) {
    var b = this.replaysByZIndex_[a], c;
    for(c in b) {
      b[c].ol_render_canvas_Replay_prototype$finish()
    }
  }
};
ol.render.canvas.ReplayGroup.prototype.getReplay = function(a, b) {
  var c = goog.isDef(a) ? a.toString() : "0", d = this.replaysByZIndex_[c];
  goog.isDef(d) || (d = {}, this.replaysByZIndex_[c] = d);
  c = d[b];
  goog.isDef(c) || (c = new ol.render.canvas.BATCH_CONSTRUCTORS_[b](this.tolerance_), d[b] = c);
  return c
};
ol.render.canvas.ReplayGroup.prototype.isEmpty = function() {
  return goog.object.isEmpty(this.replaysByZIndex_)
};
ol.render.canvas.BATCH_CONSTRUCTORS_ = {Image:ol.render.canvas.ImageReplay, LineString:ol.render.canvas.LineStringReplay, Polygon:ol.render.canvas.PolygonReplay};
ol.geom.Circle = function(a, b, c) {
  ol.geom.SimpleGeometry.call(this);
  b = goog.isDef(b) ? b : 0;
  this.setCenterAndRadius(a, b, c)
};
goog.inherits(ol.geom.Circle, ol.geom.SimpleGeometry);
ol.geom.Circle.prototype.clone = function() {
  var a = new ol.geom.Circle(null);
  a.ol_geom_Circle_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return a
};
ol.geom.Circle.prototype.closestPointXY = function(a, b, c, d) {
  var e = this.flatCoordinates;
  a -= e[0];
  var f = b - e[1];
  b = a * a + f * f;
  if(b < d) {
    if(0 === b) {
      for(d = 0;d < this.stride;++d) {
        c[d] = e[d]
      }
    }else {
      for(d = this.getRadius() / Math.sqrt(b), c[0] = e[0] + d * a, c[1] = e[1] + d * f, d = 2;d < this.stride;++d) {
        c[d] = e[d]
      }
    }
    c.length = this.stride;
    return b
  }
  return d
};
ol.geom.Circle.prototype.containsXY = function(a, b) {
  var c = this.flatCoordinates, d = a - c[0], e = b - c[1];
  return d * d + e * e <= c[this.stride] - c[0]
};
ol.geom.Circle.prototype.getCenter = function() {
  return this.flatCoordinates.slice(0, this.stride)
};
ol.geom.Circle.prototype.ol_geom_Geometry_prototype$getExtent = function(a) {
  if(this.extentRevision != this.getRevision()) {
    var b = this.flatCoordinates, c = b[this.stride] - b[0];
    this.extent = ol.extent.createOrUpdate(b[0] - c, b[1] - c, b[0] + c, b[1] + c, this.extent);
    this.extentRevision = this.getRevision()
  }
  return ol.extent.returnOrUpdate(this.extent, a)
};
ol.geom.Circle.prototype.getRadius = function() {
  var a = this.flatCoordinates[this.stride] - this.flatCoordinates[0], b = this.flatCoordinates[this.stride + 1] - this.flatCoordinates[1];
  return Math.sqrt(a * a + b * b)
};
ol.geom.Circle.prototype.getSimplifiedGeometry = function(a) {
  return this
};
ol.geom.Circle.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.CIRCLE
};
ol.geom.Circle.prototype.ol_geom_Circle_prototype$setCenter = function(a) {
  var b = this.stride, c = this.flatCoordinates[b] - this.flatCoordinates[0], d = a.slice();
  d[b] = d[0] + c;
  for(c = 1;c < b;++c) {
    d[b + c] = a[c]
  }
  this.ol_geom_Circle_prototype$setFlatCoordinates(this.layout, d)
};
ol.geom.Circle.prototype.setCenterAndRadius = function(a, b, c) {
  if(goog.isNull(a)) {
    this.ol_geom_Circle_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null)
  }else {
    this.setLayout(c, a, 0);
    goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []);
    c = this.flatCoordinates;
    a = ol.geom.flat.deflateCoordinate(c, 0, a, this.stride);
    c[a++] = c[0] + b;
    var d;
    b = 1;
    for(d = this.stride;b < d;++b) {
      c[a++] = c[b]
    }
    c.length = a;
    this.ol_Observable_prototype$dispatchChangeEvent()
  }
};
ol.geom.Circle.prototype.ol_geom_Circle_prototype$setFlatCoordinates = function(a, b) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.Circle.prototype.setRadius = function(a) {
  this.flatCoordinates[this.stride] = this.flatCoordinates[0] + a;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.GeometryCollection = function(a) {
  ol.geom.Geometry.call(this);
  this.geometries_ = goog.isDef(a) ? a : null
};
goog.inherits(ol.geom.GeometryCollection, ol.geom.Geometry);
ol.geom.GeometryCollection.cloneGeometries_ = function(a) {
  var b = [], c, d;
  c = 0;
  for(d = a.length;c < d;++c) {
    b.push(a[c].clone())
  }
  return b
};
ol.geom.GeometryCollection.prototype.clone = function() {
  var a = new ol.geom.GeometryCollection(null);
  a.setGeometries(this.geometries_);
  return a
};
ol.geom.GeometryCollection.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  var e = this.geometries_, f, g;
  f = 0;
  for(g = e.length;f < g;++f) {
    d = e[f].closestPointXY(a, b, c, d)
  }
  return d
};
ol.geom.GeometryCollection.prototype.containsXY = function(a, b) {
  var c = this.geometries_, d, e;
  d = 0;
  for(e = c.length;d < e;++d) {
    if(c[d].containsXY(a, b)) {
      return!0
    }
  }
  return!1
};
ol.geom.GeometryCollection.prototype.ol_geom_Geometry_prototype$getExtent = function(a) {
  if(this.extentRevision != this.getRevision()) {
    var b = ol.extent.createOrUpdateEmpty(this.extent), c = this.geometries_, d, e;
    d = 0;
    for(e = c.length;d < e;++d) {
      ol.extent.extend(b, c[d].ol_geom_Geometry_prototype$getExtent())
    }
    this.extent = b;
    this.extentRevision = this.getRevision()
  }
  return ol.extent.returnOrUpdate(this.extent, a)
};
ol.geom.GeometryCollection.prototype.getGeometries = function() {
  return ol.geom.GeometryCollection.cloneGeometries_(this.geometries_)
};
ol.geom.GeometryCollection.prototype.getGeometriesArray = function() {
  return this.geometries_
};
ol.geom.GeometryCollection.prototype.getSimplifiedGeometry = function(a) {
  this.simplifiedGeometryRevision != this.getRevision() && (goog.object.clear(this.simplifiedGeometryCache), this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision());
  if(0 > a || 0 !== this.simplifiedGeometryMaxMinSquaredTolerance && a < this.simplifiedGeometryMaxMinSquaredTolerance) {
    return this
  }
  var b = a.toString();
  if(this.simplifiedGeometryCache.hasOwnProperty(b)) {
    return this.simplifiedGeometryCache[b]
  }
  var c = [], d = this.geometries_, e = !1, f, g;
  f = 0;
  for(g = d.length;f < g;++f) {
    var h = d[f], k = h.getSimplifiedGeometry(a);
    c.push(k);
    k !== h && (e = !0)
  }
  if(e) {
    return a = new ol.geom.GeometryCollection(null), a.setGeometriesArray(c), this.simplifiedGeometryCache[b] = a
  }
  this.simplifiedGeometryMaxMinSquaredTolerance = a;
  return this
};
ol.geom.GeometryCollection.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.GEOMETRY_COLLECTION
};
ol.geom.GeometryCollection.prototype.isEmpty = function() {
  return goog.array.isEmpty(this.geometries_)
};
ol.geom.GeometryCollection.prototype.setGeometries = function(a) {
  this.setGeometriesArray(ol.geom.GeometryCollection.cloneGeometries_(a))
};
ol.geom.GeometryCollection.prototype.setGeometriesArray = function(a) {
  this.geometries_ = a;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.GeometryCollection.prototype.transform = function(a) {
  var b = this.geometries_, c, d;
  c = 0;
  for(d = b.length;c < d;++c) {
    b[c].transform(a)
  }
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.LineString = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_LineString$maxDeltaRevision_ = this.ol_geom_LineString$maxDelta_ = -1;
  this.ol_geom_LineString_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.LineString, ol.geom.SimpleGeometry);
ol.geom.LineString.prototype.clone = function() {
  var a = new ol.geom.LineString(null);
  a.ol_geom_LineString_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return a
};
ol.geom.LineString.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  this.ol_geom_LineString$maxDeltaRevision_ != this.getRevision() && (this.ol_geom_LineString$maxDelta_ = Math.sqrt(ol.geom.closest.getMaxSquaredDelta(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)), this.ol_geom_LineString$maxDeltaRevision_ = this.getRevision());
  return ol.geom.closest.getClosestPoint(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.ol_geom_LineString$maxDelta_, !1, a, b, c, d)
};
ol.geom.LineString.prototype.ol_geom_LineString_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
};
ol.geom.LineString.prototype.ol_geom_LineString_prototype$getLength = function() {
  return ol.geom.flat.lineStringLength(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
};
ol.geom.LineString.prototype.getSimplifiedGeometryInternal = function(a) {
  var b = [];
  b.length = ol.geom.simplify.douglasPeucker(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, a, b, 0);
  a = new ol.geom.LineString(null);
  a.ol_geom_LineString_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, b);
  return a
};
ol.geom.LineString.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.LINE_STRING
};
ol.geom.LineString.prototype.ol_geom_LineString_prototype$setCoordinates = function(a, b) {
  goog.isNull(a) ? this.ol_geom_LineString_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null) : (this.setLayout(b, a, 1), goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []), this.flatCoordinates.length = ol.geom.flat.deflateCoordinates(this.flatCoordinates, 0, a, this.stride), this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.geom.LineString.prototype.ol_geom_LineString_prototype$setFlatCoordinates = function(a, b) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.MultiLineString = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_MultiLineString$ends_ = [];
  this.ol_geom_MultiLineString$maxDeltaRevision_ = this.ol_geom_MultiLineString$maxDelta_ = -1;
  this.ol_geom_MultiLineString_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.MultiLineString, ol.geom.SimpleGeometry);
ol.geom.MultiLineString.prototype.clone = function() {
  var a = new ol.geom.MultiLineString(null);
  a.ol_geom_MultiLineString_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice(), this.ol_geom_MultiLineString$ends_.slice());
  return a
};
ol.geom.MultiLineString.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  this.ol_geom_MultiLineString$maxDeltaRevision_ != this.getRevision() && (this.ol_geom_MultiLineString$maxDelta_ = Math.sqrt(ol.geom.closest.getsMaxSquaredDelta(this.flatCoordinates, 0, this.ol_geom_MultiLineString$ends_, this.stride, 0)), this.ol_geom_MultiLineString$maxDeltaRevision_ = this.getRevision());
  return ol.geom.closest.getsClosestPoint(this.flatCoordinates, 0, this.ol_geom_MultiLineString$ends_, this.stride, this.ol_geom_MultiLineString$maxDelta_, !1, a, b, c, d)
};
ol.geom.MultiLineString.prototype.ol_geom_MultiLineString_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinatess(this.flatCoordinates, 0, this.ol_geom_MultiLineString$ends_, this.stride)
};
ol.geom.MultiLineString.prototype.ol_geom_MultiLineString_prototype$getEnds = function() {
  return this.ol_geom_MultiLineString$ends_
};
ol.geom.MultiLineString.prototype.getLineStrings = function() {
  var a = this.ol_geom_MultiLineString_prototype$getCoordinates(), b = [], c, d;
  c = 0;
  for(d = a.length;c < d;++c) {
    b.push(new ol.geom.LineString(a[c]))
  }
  return b
};
ol.geom.MultiLineString.prototype.getSimplifiedGeometryInternal = function(a) {
  var b = [], c = [];
  b.length = ol.geom.simplify.douglasPeuckers(this.flatCoordinates, 0, this.ol_geom_MultiLineString$ends_, this.stride, a, b, 0, c);
  a = new ol.geom.MultiLineString(null);
  a.ol_geom_MultiLineString_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, b, c);
  return a
};
ol.geom.MultiLineString.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.MULTI_LINE_STRING
};
ol.geom.MultiLineString.prototype.ol_geom_MultiLineString_prototype$setCoordinates = function(a, b) {
  if(goog.isNull(a)) {
    this.ol_geom_MultiLineString_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.ol_geom_MultiLineString$ends_)
  }else {
    this.setLayout(b, a, 2);
    goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []);
    var c = ol.geom.flat.deflateCoordinatess(this.flatCoordinates, 0, a, this.stride, this.ol_geom_MultiLineString$ends_);
    this.flatCoordinates.length = 0 === c.length ? 0 : c[c.length - 1];
    this.ol_Observable_prototype$dispatchChangeEvent()
  }
};
ol.geom.MultiLineString.prototype.ol_geom_MultiLineString_prototype$setFlatCoordinates = function(a, b, c) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_geom_MultiLineString$ends_ = c;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.MultiLineString.prototype.setLineStrings = function(a) {
  var b = ol.geom.GeometryLayout.XY, c = [], d = [], e, f;
  e = 0;
  for(f = a.length;e < f;++e) {
    var g = a[e];
    0 === e && (b = g.getLayout());
    goog.array.extend(c, g.getFlatCoordinates());
    d.push(c.length)
  }
  this.ol_geom_MultiLineString_prototype$setFlatCoordinates(b, c, d)
};
ol.geom.Point = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_Point_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.Point, ol.geom.SimpleGeometry);
ol.geom.Point.prototype.clone = function() {
  var a = new ol.geom.Point(null);
  a.ol_geom_Point_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return a
};
ol.geom.Point.prototype.closestPointXY = function(a, b, c, d) {
  var e = this.flatCoordinates;
  a = ol.geom.flat.squaredDistance(a, b, e[0], e[1]);
  if(a < d) {
    d = this.stride;
    for(b = 0;b < d;++b) {
      c[b] = e[b]
    }
    c.length = d;
    return a
  }
  return d
};
ol.geom.Point.prototype.ol_geom_Point_prototype$getCoordinates = function() {
  return this.flatCoordinates.slice()
};
ol.geom.Point.prototype.ol_geom_Geometry_prototype$getExtent = function(a) {
  this.extentRevision != this.getRevision() && (this.extent = ol.extent.createOrUpdateFromCoordinate(this.flatCoordinates, this.extent), this.extentRevision = this.getRevision());
  return ol.extent.returnOrUpdate(this.extent, a)
};
ol.geom.Point.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.POINT
};
ol.geom.Point.prototype.ol_geom_Point_prototype$setCoordinates = function(a, b) {
  goog.isNull(a) ? this.ol_geom_Point_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null) : (this.setLayout(b, a, 0), goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []), this.flatCoordinates.length = ol.geom.flat.deflateCoordinate(this.flatCoordinates, 0, a, this.stride), this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.geom.Point.prototype.ol_geom_Point_prototype$setFlatCoordinates = function(a, b) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.MultiPoint = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.ol_geom_MultiPoint_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.MultiPoint, ol.geom.SimpleGeometry);
ol.geom.MultiPoint.prototype.clone = function() {
  var a = new ol.geom.MultiPoint(null);
  a.ol_geom_MultiPoint_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice());
  return a
};
ol.geom.MultiPoint.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  var e = this.flatCoordinates, f = this.stride, g, h, k;
  g = 0;
  for(h = e.length;g < h;g += f) {
    if(k = ol.geom.flat.squaredDistance(a, b, e[g], e[g + 1]), k < d) {
      d = k;
      for(k = 0;k < f;++k) {
        c[k] = e[g + k]
      }
      c.length = f
    }
  }
  return d
};
ol.geom.MultiPoint.prototype.ol_geom_MultiPoint_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinates(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
};
ol.geom.MultiPoint.prototype.getPoints = function() {
  var a = this.ol_geom_MultiPoint_prototype$getCoordinates(), b = [], c, d;
  c = 0;
  for(d = a.length;c < d;++c) {
    b.push(new ol.geom.Point(a[c]))
  }
  return b
};
ol.geom.MultiPoint.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.MULTI_POINT
};
ol.geom.MultiPoint.prototype.ol_geom_MultiPoint_prototype$setCoordinates = function(a, b) {
  goog.isNull(a) ? this.ol_geom_MultiPoint_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null) : (this.setLayout(b, a, 1), goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []), this.flatCoordinates.length = ol.geom.flat.deflateCoordinates(this.flatCoordinates, 0, a, this.stride), this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.geom.MultiPoint.prototype.ol_geom_MultiPoint_prototype$setFlatCoordinates = function(a, b) {
  this.setFlatCoordinatesInternal(a, b);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.geom.MultiPolygon = function(a, b) {
  ol.geom.SimpleGeometry.call(this);
  this.endss_ = [];
  this.interiorPointsRevision_ = -1;
  this.interiorPoints_ = null;
  this.ol_geom_MultiPolygon$orientedRevision_ = this.ol_geom_MultiPolygon$maxDeltaRevision_ = this.ol_geom_MultiPolygon$maxDelta_ = -1;
  this.ol_geom_MultiPolygon$orientedFlatCoordinates_ = null;
  this.ol_geom_MultiPolygon_prototype$setCoordinates(a, b)
};
goog.inherits(ol.geom.MultiPolygon, ol.geom.SimpleGeometry);
ol.geom.MultiPolygon.prototype.clone = function() {
  var a = new ol.geom.MultiPolygon(null);
  a.ol_geom_MultiPolygon_prototype$setFlatCoordinates(this.layout, this.flatCoordinates.slice(), this.endss_.slice());
  return a
};
ol.geom.MultiPolygon.prototype.closestPointXY = function(a, b, c, d) {
  if(d < ol.extent.closestSquaredDistanceXY(this.ol_geom_Geometry_prototype$getExtent(), a, b)) {
    return d
  }
  this.ol_geom_MultiPolygon$maxDeltaRevision_ != this.getRevision() && (this.ol_geom_MultiPolygon$maxDelta_ = Math.sqrt(ol.geom.closest.getssMaxSquaredDelta(this.flatCoordinates, 0, this.endss_, this.stride, 0)), this.ol_geom_MultiPolygon$maxDeltaRevision_ = this.getRevision());
  return ol.geom.closest.getssClosestPoint(this.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates(), 0, this.endss_, this.stride, this.ol_geom_MultiPolygon$maxDelta_, !0, a, b, c, d)
};
ol.geom.MultiPolygon.prototype.containsXY = function(a, b) {
  return ol.geom.flat.linearRingssContainsXY(this.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates(), 0, this.endss_, this.stride, a, b)
};
ol.geom.MultiPolygon.prototype.getArea = function() {
  return ol.geom.flat.linearRingssArea(this.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates(), 0, this.endss_, this.stride)
};
ol.geom.MultiPolygon.prototype.ol_geom_MultiPolygon_prototype$getCoordinates = function() {
  return ol.geom.flat.inflateCoordinatesss(this.flatCoordinates, 0, this.endss_, this.stride)
};
ol.geom.MultiPolygon.prototype.getEndss = function() {
  return this.endss_
};
ol.geom.MultiPolygon.prototype.getInteriorPoints = function() {
  if(this.interiorPointsRevision_ != this.getRevision()) {
    var a = ol.geom.flat.linearRingssMidYs(this.flatCoordinates, 0, this.endss_, this.stride);
    this.interiorPoints_ = ol.geom.flat.linearRingssGetInteriorPoints(this.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates(), 0, this.endss_, this.stride, a);
    this.interiorPointsRevision_ = this.getRevision()
  }
  return this.interiorPoints_
};
ol.geom.MultiPolygon.prototype.ol_geom_MultiPolygon_prototype$getOrientedFlatCoordinates = function() {
  if(this.ol_geom_MultiPolygon$orientedRevision_ != this.getRevision()) {
    var a = this.flatCoordinates;
    ol.geom.flat.linearRingssAreOriented(a, 0, this.endss_, this.stride) ? this.ol_geom_MultiPolygon$orientedFlatCoordinates_ = a : (this.ol_geom_MultiPolygon$orientedFlatCoordinates_ = a.slice(), this.ol_geom_MultiPolygon$orientedFlatCoordinates_.length = ol.geom.flat.orientLinearRingss(this.ol_geom_MultiPolygon$orientedFlatCoordinates_, 0, this.endss_, this.stride));
    this.ol_geom_MultiPolygon$orientedRevision_ = this.getRevision()
  }
  return this.ol_geom_MultiPolygon$orientedFlatCoordinates_
};
ol.geom.MultiPolygon.prototype.getSimplifiedGeometryInternal = function(a) {
  var b = [], c = [];
  b.length = ol.geom.simplify.quantizess(this.flatCoordinates, 0, this.endss_, this.stride, Math.sqrt(a), b, 0, c);
  a = new ol.geom.MultiPolygon(null);
  a.ol_geom_MultiPolygon_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, b, c);
  return a
};
ol.geom.MultiPolygon.prototype.getPolygons = function() {
  var a = this.layout, b = this.flatCoordinates, c = this.endss_, d = [], e = 0, f, g;
  f = 0;
  for(g = c.length;f < g;++f) {
    var h = c[f], k = h[h.length - 1], l = new ol.geom.Polygon(null);
    l.ol_geom_Polygon_prototype$setFlatCoordinates(a, b.slice(e, k), h.slice());
    d.push(l);
    e = k
  }
  return d
};
ol.geom.MultiPolygon.prototype.ol_geom_Geometry_prototype$getType = function() {
  return ol.geom.GeometryType.MULTI_POLYGON
};
ol.geom.MultiPolygon.prototype.ol_geom_MultiPolygon_prototype$setCoordinates = function(a, b) {
  if(goog.isNull(a)) {
    this.ol_geom_MultiPolygon_prototype$setFlatCoordinates(ol.geom.GeometryLayout.XY, null, this.endss_)
  }else {
    this.setLayout(b, a, 3);
    goog.isNull(this.flatCoordinates) && (this.flatCoordinates = []);
    var c = ol.geom.flat.deflateCoordinatesss(this.flatCoordinates, 0, a, this.stride, this.endss_), c = c[c.length - 1];
    this.flatCoordinates.length = 0 === c.length ? 0 : c[c.length - 1];
    this.ol_Observable_prototype$dispatchChangeEvent()
  }
};
ol.geom.MultiPolygon.prototype.ol_geom_MultiPolygon_prototype$setFlatCoordinates = function(a, b, c) {
  this.setFlatCoordinatesInternal(a, b);
  this.endss_ = c;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.renderer.vector = {};
ol.renderer.vector.renderCircleGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getFill(), f = c.ol_style_Style_prototype$getStroke();
  goog.isNull(e) && goog.isNull(f) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.POLYGON), a.setFillStrokeStyle(e, f), a.drawCircleGeometry(b, d))
};
ol.renderer.vector.renderFeature = function(a, b, c, d, e) {
  b = b.ol_Feature_prototype$getGeometry();
  goog.isNull(b) || (d = b.getSimplifiedGeometry(d), (0,ol.renderer.vector.GEOMETRY_RENDERERS_[d.ol_geom_Geometry_prototype$getType()])(a, d, c, e))
};
ol.renderer.vector.renderGeometryCollectionGeometry_ = function(a, b, c, d) {
  b = b.getGeometriesArray();
  var e, f;
  e = 0;
  for(f = b.length;e < f;++e) {
    (0,ol.renderer.vector.GEOMETRY_RENDERERS_[b[e].ol_geom_Geometry_prototype$getType()])(a, b[e], c, d)
  }
};
ol.renderer.vector.renderLineStringGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getStroke();
  goog.isNull(e) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.LINE_STRING), a.setFillStrokeStyle(null, e), a.drawLineStringGeometry(b, d))
};
ol.renderer.vector.renderMultiLineStringGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getStroke();
  goog.isNull(e) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.LINE_STRING), a.setFillStrokeStyle(null, e), a.drawMultiLineStringGeometry(b, d))
};
ol.renderer.vector.renderMultiPolygonGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getFill(), f = c.ol_style_Style_prototype$getStroke();
  goog.isNull(f) && goog.isNull(e) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.POLYGON), a.setFillStrokeStyle(e, f), a.drawMultiPolygonGeometry(b, d))
};
ol.renderer.vector.renderPointGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getImage();
  goog.isNull(e) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.IMAGE), a.setImageStyle(e), a.drawPointGeometry(b, d))
};
ol.renderer.vector.renderMultiPointGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getImage();
  goog.isNull(e) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.IMAGE), a.setImageStyle(e), a.drawMultiPointGeometry(b, d))
};
ol.renderer.vector.renderPolygonGeometry_ = function(a, b, c, d) {
  var e = c.ol_style_Style_prototype$getFill(), f = c.ol_style_Style_prototype$getStroke();
  goog.isNull(e) && goog.isNull(f) || (a = a.getReplay(c.getZIndex(), ol.render.ReplayType.POLYGON), a.setFillStrokeStyle(e, f), a.drawPolygonGeometry(b, d))
};
ol.renderer.vector.GEOMETRY_RENDERERS_ = {Point:ol.renderer.vector.renderPointGeometry_, LineString:ol.renderer.vector.renderLineStringGeometry_, Polygon:ol.renderer.vector.renderPolygonGeometry_, MultiPoint:ol.renderer.vector.renderMultiPointGeometry_, MultiLineString:ol.renderer.vector.renderMultiLineStringGeometry_, MultiPolygon:ol.renderer.vector.renderMultiPolygonGeometry_, GeometryCollection:ol.renderer.vector.renderGeometryCollectionGeometry_, Circle:ol.renderer.vector.renderCircleGeometry_};
ol.structs.RBushNode = function(a, b, c, d) {
  this.extent = a;
  this.height = b;
  this.ol_structs_RBushNode$children = c;
  this.value = d
};
ol.structs.RBushNode.compareMinX = function(a, b) {
  return a.extent[0] - b.extent[0]
};
ol.structs.RBushNode.compareMinY = function(a, b) {
  return a.extent[1] - b.extent[1]
};
ol.structs.RBushNode.prototype.ol_structs_RBushNode_prototype$assertValid = function(a) {
  if(0 !== this.height) {
    var b, c;
    b = 0;
    for(c = this.ol_structs_RBushNode$children.length;b < c;++b) {
      this.ol_structs_RBushNode$children[b].ol_structs_RBushNode_prototype$assertValid(a)
    }
  }
};
ol.structs.RBushNode.prototype.getChildrenExtent = function(a, b, c) {
  var d = this.ol_structs_RBushNode$children;
  for(c = ol.extent.createOrUpdateEmpty(c);a < b;++a) {
    ol.extent.extend(c, d[a].extent)
  }
  return c
};
ol.structs.RBushNode.prototype.updateExtent = function() {
  var a = ol.extent.createOrUpdateEmpty(this.extent), b = this.ol_structs_RBushNode$children, c, d;
  c = 0;
  for(d = b.length;c < d;++c) {
    ol.extent.extend(a, b[c].extent)
  }
};
ol.structs.RBushNode.prototype.isLeaf = function() {
  return goog.isNull(this.ol_structs_RBushNode$children)
};
ol.structs.RBush = function(a) {
  this.maxEntries_ = Math.max(4, goog.isDef(a) ? a : 9);
  this.minEntries_ = Math.max(2, Math.ceil(0.4 * this.maxEntries_));
  this.root_ = new ol.structs.RBushNode(ol.extent.createEmpty(), 1, [], null);
  this.valueExtent_ = {};
  goog.DEBUG && (this.readers_ = 0)
};
ol.structs.RBush.prototype.allDistMargin_ = function(a, b) {
  var c = a.ol_structs_RBushNode$children, d = this.minEntries_, e = c.length, f;
  goog.array.sort(c, b);
  var g = a.getChildrenExtent(0, d), h = a.getChildrenExtent(e - d, e), k = ol.extent.getMargin(g) + ol.extent.getMargin(h);
  for(f = d;f < e - d;++f) {
    ol.extent.extend(g, c[f].extent), k += ol.extent.getMargin(g)
  }
  for(f = e - d - 1;f >= d;--f) {
    ol.extent.extend(h, c[f].extent), k += ol.extent.getMargin(h)
  }
  return k
};
ol.structs.RBush.prototype.ol_structs_RBush_prototype$assertValid = function() {
  this.root_.ol_structs_RBushNode_prototype$assertValid(this.maxEntries_)
};
ol.structs.RBush.prototype.chooseSplitAxis_ = function(a) {
  var b = this.allDistMargin_(a, ol.structs.RBushNode.compareMinX), c = this.allDistMargin_(a, ol.structs.RBushNode.compareMinY);
  b < c && goog.array.sort(a.ol_structs_RBushNode$children, ol.structs.RBushNode.compareMinX)
};
ol.structs.RBush.prototype.chooseSplitIndex_ = function(a) {
  var b = this.minEntries_, c = a.ol_structs_RBushNode$children.length, d = Infinity, e = Infinity, f = ol.extent.createEmpty(), g = ol.extent.createEmpty(), h = 0, k;
  for(k = b;k <= c - b;++k) {
    var f = a.getChildrenExtent(0, k, f), g = a.getChildrenExtent(k, c, g), l = ol.extent.getIntersectionArea(f, g), m = ol.extent.getArea(f) + ol.extent.getArea(g);
    l < d ? (d = l, e = Math.min(m, e), h = k) : l == d && m < e && (e = m, h = k)
  }
  return h
};
ol.structs.RBush.prototype.chooseSubtree_ = function(a, b, c, d) {
  for(;!b.isLeaf() && d.length - 1 != c;) {
    var e = Infinity, f = Infinity;
    b = b.ol_structs_RBushNode$children;
    var g = null, h, k;
    h = 0;
    for(k = b.length;h < k;++h) {
      var l = b[h], m = ol.extent.getArea(l.extent), n = ol.extent.getEnlargedArea(l.extent, a) - m;
      n < f ? (f = n, e = Math.min(m, e), g = l) : n == f && m < e && (e = m, g = l)
    }
    b = g;
    d.push(b)
  }
  return b
};
ol.structs.RBush.prototype.clear = function() {
  var a = this.root_;
  a.extent = ol.extent.createOrUpdateEmpty(this.root_.extent);
  a.height = 1;
  a.ol_structs_RBushNode$children.length = 0;
  a.value = null;
  goog.object.clear(this.valueExtent_)
};
ol.structs.RBush.prototype.condense_ = function(a) {
  var b;
  for(b = a.length - 1;0 <= b;--b) {
    var c = a[b];
    0 === c.ol_structs_RBushNode$children.length ? 0 < b ? goog.array.remove(a[b - 1].ol_structs_RBushNode$children, c) : this.clear() : c.updateExtent()
  }
};
ol.structs.RBush.prototype.forEach = function(a, b) {
  if(goog.DEBUG) {
    ++this.readers_;
    try {
      return this.forEach_(this.root_, a, b)
    }finally {
      --this.readers_
    }
  }else {
    return this.forEach_(this.root_, a, b)
  }
};
ol.structs.RBush.prototype.forEach_ = function(a, b, c) {
  for(var d = [a], e, f, g;0 < d.length;) {
    if(a = d.pop(), e = a.ol_structs_RBushNode$children, 1 == a.height) {
      for(a = 0, f = e.length;a < f;++a) {
        if(g = b.call(c, e[a].value)) {
          return g
        }
      }
    }else {
      d.push.apply(d, e)
    }
  }
};
ol.structs.RBush.prototype.forEachInExtent = function(a, b, c) {
  if(goog.DEBUG) {
    ++this.readers_;
    try {
      return this.forEachInExtent_(a, b, c)
    }finally {
      --this.readers_
    }
  }else {
    return this.forEachInExtent_(a, b, c)
  }
};
ol.structs.RBush.prototype.forEachInExtent_ = function(a, b, c) {
  for(var d = [this.root_], e;0 < d.length;) {
    if(e = d.pop(), ol.extent.intersects(a, e.extent)) {
      if(e.isLeaf()) {
        if(e = b.call(c, e.value)) {
          return e
        }
      }else {
        if(ol.extent.containsExtent(a, e.extent)) {
          if(e = this.forEach_(e, b, c)) {
            return e
          }
        }else {
          d.push.apply(d, e.ol_structs_RBushNode$children)
        }
      }
    }
  }
};
ol.structs.RBush.prototype.forEachNode = function(a, b) {
  for(var c = [this.root_];0 < c.length;) {
    var d = c.pop(), e = a.call(b, d);
    if(e) {
      return e
    }
    d.isLeaf() || c.push.apply(c, d.ol_structs_RBushNode$children)
  }
};
ol.structs.RBush.prototype.getAll = function() {
  var a = [];
  this.forEach(function(b) {
    a.push(b)
  });
  return a
};
ol.structs.RBush.prototype.getAllInExtent = function(a) {
  var b = [];
  this.forEachInExtent(a, function(a) {
    b.push(a)
  });
  return b
};
ol.structs.RBush.prototype.ol_structs_RBush_prototype$getExtent = function(a) {
  return ol.extent.returnOrUpdate(this.root_.extent, a)
};
ol.structs.RBush.prototype.ol_structs_RBush_prototype$getKey_ = function(a) {
  return goog.getUid(a).toString()
};
ol.structs.RBush.prototype.insert = function(a, b) {
  if(goog.DEBUG && this.readers_) {
    throw Error("cannot insert value while reading");
  }
  var c = this.ol_structs_RBush_prototype$getKey_(b);
  this.insert_(a, b, this.root_.height - 1);
  this.valueExtent_[c] = ol.extent.clone(a)
};
ol.structs.RBush.prototype.insert_ = function(a, b, c) {
  var d = [this.root_];
  c = this.chooseSubtree_(a, this.root_, c, d);
  c.ol_structs_RBushNode$children.push(new ol.structs.RBushNode(a, 0, null, b));
  ol.extent.extend(c.extent, a);
  for(b = d.length - 1;0 <= b;--b) {
    if(d[b].ol_structs_RBushNode$children.length > this.maxEntries_) {
      this.split_(d, b)
    }else {
      break
    }
  }
  for(;0 <= b;--b) {
    ol.extent.extend(d[b].extent, a)
  }
  return c
};
ol.structs.RBush.prototype.isEmpty = function() {
  return 0 === this.root_.ol_structs_RBushNode$children.length
};
ol.structs.RBush.prototype.remove = function(a) {
  if(goog.DEBUG && this.readers_) {
    throw Error("cannot remove value while reading");
  }
  var b = this.ol_structs_RBush_prototype$getKey_(a), c = this.valueExtent_[b];
  delete this.valueExtent_[b];
  this.remove_(c, a)
};
ol.structs.RBush.prototype.remove_ = function(a, b) {
  for(var c = this.root_, d = 0, e = [c], f = [0], g, h, k, l;0 < e.length;) {
    g = !1;
    if(1 == c.height) {
      g = c.ol_structs_RBushNode$children;
      k = 0;
      for(l = g.length;k < l;++k) {
        if(h = g[k], h.value === b) {
          goog.array.removeAt(g, k);
          this.condense_(e);
          return
        }
      }
      g = !0
    }else {
      d < c.ol_structs_RBushNode$children.length ? (h = c.ol_structs_RBushNode$children[d], ol.extent.containsExtent(h.extent, a) ? (e.push(h), f.push(d + 1), c = h, d = 0) : ++d) : g = !0
    }
    g && (d = e.length - 1, c = e[d], d = ++f[d], d > c.ol_structs_RBushNode$children.length && (e.pop(), f.pop()))
  }
};
ol.structs.RBush.prototype.split_ = function(a, b) {
  var c = a[b];
  this.chooseSplitAxis_(c);
  var d = this.chooseSplitIndex_(c), d = c.ol_structs_RBushNode$children.splice(d), d = new ol.structs.RBushNode(ol.extent.createEmpty(), c.height, d, null);
  c.updateExtent();
  d.updateExtent();
  b ? a[b - 1].ol_structs_RBushNode$children.push(d) : this.splitRoot_(c, d)
};
ol.structs.RBush.prototype.splitRoot_ = function(a, b) {
  var c = a.height + 1, d = ol.extent.extend(a.extent.slice(), b.extent);
  this.root_ = new ol.structs.RBushNode(d, c, [a, b], null)
};
ol.structs.RBush.prototype.ol_structs_RBush_prototype$update = function(a, b) {
  if(goog.DEBUG && this.readers_) {
    throw Error("cannot update value while reading");
  }
  var c = this.ol_structs_RBush_prototype$getKey_(b), d = this.valueExtent_[c];
  ol.extent.equals(d, a) || (this.remove_(d, b), this.insert_(a, b, this.root_.height - 1), this.valueExtent_[c] = ol.extent.clone(a, d))
};
ol.source.VectorEventType = {ADDFEATURE:"addfeature", REMOVEFEATURE:"removefeature"};
ol.source.Vector = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.source.Source.call(this, {attributions:a.attributions, extent:a.extent, logo:a.logo, projection:a.projection, state:a.state});
  this.rBush_ = new ol.structs.RBush;
  this.nullGeometryFeatures_ = {};
  this.featureChangeKeys_ = {};
  goog.isDef(a.features) && this.addFeaturesInternal(a.features)
};
goog.inherits(ol.source.Vector, ol.source.Source);
ol.source.Vector.prototype.addFeature = function(a) {
  this.addFeatureInternal(a);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Vector.prototype.addFeatureInternal = function(a) {
  var b = goog.getUid(a).toString();
  this.featureChangeKeys_[b] = goog.events.listen(a, goog.events.EventType.CHANGE, this.handleFeatureChange_, !1, this);
  b = a.ol_Feature_prototype$getGeometry();
  goog.isNull(b) ? this.nullGeometryFeatures_[goog.getUid(a).toString()] = a : (b = b.ol_geom_Geometry_prototype$getExtent(), this.rBush_.insert(b, a));
  this.dispatchEvent(new ol.source.VectorEvent(ol.source.VectorEventType.ADDFEATURE, a))
};
ol.source.Vector.prototype.addFeatures = function(a) {
  this.addFeaturesInternal(a);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Vector.prototype.addFeaturesInternal = function(a) {
  var b, c;
  b = 0;
  for(c = a.length;b < c;++b) {
    this.addFeatureInternal(a[b])
  }
};
ol.source.Vector.prototype.clear = function() {
  this.rBush_.forEach(this.removeFeatureInternal, this);
  this.rBush_.clear();
  goog.object.forEach(this.nullGeometryFeatures_, this.removeFeatureInternal, this);
  goog.object.clear(this.nullGeometryFeatures_);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Vector.prototype.forEachFeature = function(a, b) {
  return this.rBush_.forEach(a, b)
};
ol.source.Vector.prototype.forEachFeatureAtCoordinate = function(a, b, c) {
  return this.forEachFeatureInExtent([a[0], a[1], a[0], a[1]], function(d) {
    if(d.ol_Feature_prototype$getGeometry().containsCoordinate(a)) {
      return b.call(c, d)
    }
  })
};
ol.source.Vector.prototype.forEachFeatureInExtent = function(a, b, c) {
  return this.rBush_.forEachInExtent(a, b, c)
};
ol.source.Vector.prototype.getAllFeatures = function() {
  var a = this.rBush_.getAll();
  goog.object.isEmpty(this.nullGeometryFeatures_) || goog.array.extend(a, goog.object.getValues(this.nullGeometryFeatures_));
  return a
};
ol.source.Vector.prototype.getAllFeaturesAtCoordinate = function(a) {
  var b = [];
  this.forEachFeatureAtCoordinate(a, function(a) {
    b.push(a)
  });
  return b
};
ol.source.Vector.prototype.getAllFeaturesInExtent = function(a) {
  return this.rBush_.getAllInExtent(a)
};
ol.source.Vector.prototype.getClosestFeatureToCoordinate = function(a) {
  var b = a[0], c = a[1], d = null, e = [NaN, NaN], f = Infinity, g = [-Infinity, -Infinity, Infinity, Infinity];
  this.rBush_.forEachInExtent(g, function(a) {
    var k = a.ol_Feature_prototype$getGeometry(), l = f;
    f = k.closestPointXY(b, c, e, f);
    f < l && (d = a, a = Math.sqrt(f), g[0] = b - a, g[1] = c - a, g[2] = b + a, g[3] = c + a)
  });
  return d
};
ol.source.Vector.prototype.ol_source_Source_prototype$getExtent = function() {
  return this.rBush_.ol_structs_RBush_prototype$getExtent()
};
ol.source.Vector.prototype.handleFeatureChange_ = function(a) {
  a = a.target;
  var b = goog.getUid(a).toString(), c = a.ol_Feature_prototype$getGeometry();
  goog.isNull(c) ? b in this.nullGeometryFeatures_ || (this.rBush_.remove(a), this.nullGeometryFeatures_[b] = a) : (c = c.ol_geom_Geometry_prototype$getExtent(), b in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[b], this.rBush_.insert(c, a)) : this.rBush_.ol_structs_RBush_prototype$update(c, a));
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Vector.prototype.isEmpty = function() {
  return this.rBush_.isEmpty() && goog.object.isEmpty(this.nullGeometryFeatures_)
};
ol.source.Vector.prototype.removeFeature = function(a) {
  var b = goog.getUid(a).toString();
  b in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[b] : this.rBush_.remove(a);
  this.removeFeatureInternal(a);
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.Vector.prototype.removeFeatureInternal = function(a) {
  var b = goog.getUid(a).toString();
  goog.events.unlistenByKey(this.featureChangeKeys_[b]);
  delete this.featureChangeKeys_[b];
  this.dispatchEvent(new ol.source.VectorEvent(ol.source.VectorEventType.REMOVEFEATURE, a))
};
ol.source.VectorEvent = function(a, b) {
  goog.events.Event.call(this, a);
  this.feature_ = b
};
goog.inherits(ol.source.VectorEvent, goog.events.Event);
ol.source.VectorEvent.prototype.ol_source_VectorEvent_prototype$getFeature = function() {
  return this.feature_
};
ol.renderer.canvas.VectorLayer = function(a, b) {
  ol.renderer.canvas.Layer.call(this, a, b);
  this.dirty_ = !1;
  this.ol_renderer_canvas_VectorLayer$renderedRevision_ = -1;
  this.ol_renderer_canvas_VectorLayer$renderedResolution_ = NaN;
  this.renderedExtent_ = ol.extent.createEmpty();
  this.replayGroup_ = null
};
goog.inherits(ol.renderer.canvas.VectorLayer, ol.renderer.canvas.Layer);
ol.renderer.canvas.VectorLayer.prototype.ol_renderer_canvas_Layer_prototype$composeFrame = function(a, b, c) {
  var d = this.getTransform(a);
  this.dispatchPreComposeEvent(c, a, d);
  var e = this.replayGroup_;
  if(!goog.isNull(e)) {
    var f = this.getRenderGeometryFunction_();
    c.globalAlpha = b.opacity;
    e.ol_render_canvas_ReplayGroup_prototype$replay(c, a.extent, a.pixelRatio, d, f)
  }
  this.dispatchPostComposeEvent(c, a, d)
};
ol.renderer.canvas.VectorLayer.prototype.ol_renderer_Layer_prototype$forEachFeatureAtPixel = function(a, b, c, d) {
  if(!goog.isNull(this.replayGroup_)) {
    var e = b.extent, f = b.view2DState.resolution;
    b = b.view2DState.rotation;
    var g = this.getLayer(), h = this.getRenderGeometryFunction_();
    return this.replayGroup_.forEachGeometryAtPixel(e, f, b, a, h, function(a, b) {
      return c.call(d, b, g)
    })
  }
};
ol.renderer.canvas.VectorLayer.prototype.getRenderGeometryFunction_ = function() {
  var a = this.getLayer().getRenderGeometryFunctions();
  if(!goog.isDef(a)) {
    return goog.functions.TRUE
  }
  var b = a.ol_Collection_prototype$getArray();
  switch(b.length) {
    case 0:
      return goog.functions.TRUE;
    case 1:
      return b[0];
    default:
      return function(a) {
        var d, e;
        d = 0;
        for(e = b.length;d < e;++d) {
          if(!b[d](a)) {
            return!1
          }
        }
        return!0
      }
  }
};
ol.renderer.canvas.VectorLayer.prototype.handleImageStyleChange_ = function(a) {
  a.target.getImageState() == ol.style.ImageState.LOADED && this.renderIfReadyAndVisible()
};
ol.renderer.canvas.VectorLayer.prototype.prepareFrame = function(a, b) {
  var c = this.getLayer(), d = c.ol_layer_Layer_prototype$getSource();
  this.updateAttributions(a.attributions, d.ol_source_Source_prototype$getAttributions());
  this.updateLogos(a, d);
  if(this.dirty_ || !a.viewHints[ol.ViewHint.ANIMATING] && !a.viewHints[ol.ViewHint.INTERACTING]) {
    var e = a.extent, f = a.view2DState.resolution, g = a.pixelRatio;
    if(this.dirty_ || this.ol_renderer_canvas_VectorLayer$renderedResolution_ != f || this.ol_renderer_canvas_VectorLayer$renderedRevision_ != d.getRevision() || !ol.extent.containsExtent(this.renderedExtent_, e)) {
      var h = this.renderedExtent_, k = ol.extent.getWidth(e) / 4, l = ol.extent.getHeight(e) / 4;
      h[0] = e[0] - k;
      h[1] = e[1] - l;
      h[2] = e[2] + k;
      h[3] = e[3] + l;
      goog.dispose(this.replayGroup_);
      this.replayGroup_ = null;
      this.dirty_ = !1;
      var m = c.ol_layer_Vector_prototype$getStyleFunction();
      goog.isDef(m) || (m = ol.feature.defaultStyleFunction);
      var n = new ol.render.canvas.ReplayGroup(f / (2 * g));
      d.forEachFeatureInExtent(h, function(a) {
        a = this.renderFeature(a, f, g, m, n);
        this.dirty_ = this.dirty_ || a
      }, this);
      n.ol_render_IReplayGroup_prototype$finish();
      this.ol_renderer_canvas_VectorLayer$renderedResolution_ = f;
      this.ol_renderer_canvas_VectorLayer$renderedRevision_ = d.getRevision();
      n.isEmpty() || (this.replayGroup_ = n)
    }
  }
};
ol.renderer.canvas.VectorLayer.prototype.renderFeature = function(a, b, c, d, e) {
  var f = !1;
  d = d(a, b);
  if(!goog.isDefAndNotNull(d)) {
    return!1
  }
  b = b * b / (4 * c * c);
  var g, h, k;
  c = 0;
  for(g = d.length;c < g;++c) {
    h = d[c], k = h.ol_style_Style_prototype$getImage(), goog.isNull(k) ? ol.renderer.vector.renderFeature(e, a, h, b, a) : (k.getImageState() == ol.style.ImageState.IDLE ? (goog.events.listenOnce(k, goog.events.EventType.CHANGE, this.handleImageStyleChange_, !1, this), k.ol_style_Image_prototype$load()) : k.getImageState() == ol.style.ImageState.LOADED && ol.renderer.vector.renderFeature(e, a, h, b, a), f = k.getImageState() == ol.style.ImageState.LOADING)
  }
  return f
};
ol.renderer.canvas.Map = function(a, b) {
  ol.renderer.Map.call(this, a, b);
  this.ol_renderer_canvas_Map$canvas_ = goog.dom.createElement(goog.dom.TagName.CANVAS);
  this.ol_renderer_canvas_Map$canvas_.style.width = "100%";
  this.ol_renderer_canvas_Map$canvas_.style.height = "100%";
  this.ol_renderer_canvas_Map$canvas_.className = ol.css.CLASS_UNSELECTABLE;
  goog.dom.insertChildAt(a, this.ol_renderer_canvas_Map$canvas_, 0);
  this.ol_renderer_canvas_Map$renderedVisible_ = !0;
  this.ol_renderer_canvas_Map$context_ = this.ol_renderer_canvas_Map$canvas_.getContext("2d");
  this.ol_renderer_canvas_Map$transform_ = goog.vec.Mat4.createNumber()
};
goog.inherits(ol.renderer.canvas.Map, ol.renderer.Map);
ol.renderer.canvas.Map.prototype.createLayerRenderer = function(a) {
  return a instanceof ol.layer.Image ? new ol.renderer.canvas.ImageLayer(this, a) : a instanceof ol.layer.Tile ? new ol.renderer.canvas.TileLayer(this, a) : a instanceof ol.layer.Vector ? new ol.renderer.canvas.VectorLayer(this, a) : null
};
ol.renderer.canvas.Map.prototype.ol_renderer_canvas_Map_prototype$dispatchComposeEvent_ = function(a, b) {
  var c = this.ol_renderer_Map_prototype$getMap(), d = this.ol_renderer_canvas_Map$context_;
  if(c.hasListener(a)) {
    var e = b.view2DState, f = b.pixelRatio;
    ol.vec.Mat4.makeTransform2D(this.ol_renderer_canvas_Map$transform_, this.ol_renderer_canvas_Map$canvas_.width / 2, this.ol_renderer_canvas_Map$canvas_.height / 2, f / e.resolution, -f / e.resolution, -e.rotation, -e.center[0], -e.center[1]);
    e = new ol.render.canvas.Immediate(d, f, b.extent, this.ol_renderer_canvas_Map$transform_);
    d = new ol.render.Event(a, c, e, b, d, null);
    c.dispatchEvent(d);
    e.ol_render_canvas_Immediate_prototype$flush()
  }
};
ol.renderer.canvas.Map.prototype.getCanvasLayerRenderer = function(a) {
  return this.getLayerRenderer(a)
};
ol.renderer.canvas.Map.prototype.renderFrame = function(a) {
  if(goog.isNull(a)) {
    this.ol_renderer_canvas_Map$renderedVisible_ && (goog.style.setElementShown(this.ol_renderer_canvas_Map$canvas_, !1), this.ol_renderer_canvas_Map$renderedVisible_ = !1)
  }else {
    var b = this.ol_renderer_canvas_Map$context_, c = a.size[0] * a.pixelRatio, d = a.size[1] * a.pixelRatio;
    this.ol_renderer_canvas_Map$canvas_.width != c || this.ol_renderer_canvas_Map$canvas_.height != d ? (this.ol_renderer_canvas_Map$canvas_.width = c, this.ol_renderer_canvas_Map$canvas_.height = d) : b.clearRect(0, 0, this.ol_renderer_canvas_Map$canvas_.width, this.ol_renderer_canvas_Map$canvas_.height);
    this.calculateMatrices2D(a);
    this.ol_renderer_canvas_Map_prototype$dispatchComposeEvent_(ol.render.EventType.PRECOMPOSE, a);
    var c = a.layerStates, d = a.layersArray, e = a.view2DState.resolution, f, g, h, k;
    f = 0;
    for(g = d.length;f < g;++f) {
      h = d[f], k = this.getLayerRenderer(h), h = c[goog.getUid(h)], !h.visible || (h.sourceState != ol.source.State.READY || e >= h.maxResolution || e < h.minResolution) || (k.prepareFrame(a, h), k.ol_renderer_canvas_Layer_prototype$composeFrame(a, h, b))
    }
    this.ol_renderer_canvas_Map_prototype$dispatchComposeEvent_(ol.render.EventType.POSTCOMPOSE, a);
    this.ol_renderer_canvas_Map$renderedVisible_ || (goog.style.setElementShown(this.ol_renderer_canvas_Map$canvas_, !0), this.ol_renderer_canvas_Map$renderedVisible_ = !0);
    this.scheduleRemoveUnusedLayerRenderers(a)
  }
};
ol.dom = {};
ol.dom.BrowserFeature = {CAN_USE_CSS_TRANSFORM:!1, CAN_USE_CSS_TRANSFORM3D:!0};
ol.dom.setTransform = function(a, b) {
  var c = a.style;
  c.WebkitTransform = b;
  c.MozTransform = b;
  c.OTransform = b;
  c.transform = b
};
ol.dom.transformElement2D = function(a, b, c) {
  var d;
  if(ol.dom.BrowserFeature.CAN_USE_CSS_TRANSFORM3D) {
    if(goog.isDef(c)) {
      var e = Array(16);
      for(d = 0;16 > d;++d) {
        e[d] = b[d].toFixed(c)
      }
      c = e.join(",")
    }else {
      c = b.join(",")
    }
    ol.dom.setTransform(a, "matrix3d(" + c + ")")
  }else {
    if(ol.dom.BrowserFeature.CAN_USE_CSS_TRANSFORM) {
      b = [goog.vec.Mat4.getElement(b, 0, 0), goog.vec.Mat4.getElement(b, 1, 0), goog.vec.Mat4.getElement(b, 0, 1), goog.vec.Mat4.getElement(b, 1, 1), goog.vec.Mat4.getElement(b, 0, 3), goog.vec.Mat4.getElement(b, 1, 3)];
      if(goog.isDef(c)) {
        e = Array(6);
        for(d = 0;6 > d;++d) {
          e[d] = b[d].toFixed(c)
        }
        c = e.join(",")
      }else {
        c = b.join(",")
      }
      ol.dom.setTransform(a, "matrix(" + c + ")")
    }else {
      a = a.style, a.left = Math.round(goog.vec.Mat4.getElement(b, 0, 3)) + "px", a.top = Math.round(goog.vec.Mat4.getElement(b, 1, 3)) + "px"
    }
  }
};
ol.renderer.dom = {};
ol.renderer.dom.Layer = function(a, b, c) {
  ol.renderer.Layer.call(this, a, b);
  this.target = c
};
goog.inherits(ol.renderer.dom.Layer, ol.renderer.Layer);
ol.renderer.dom.Layer.prototype.ol_renderer_dom_Layer_prototype$getTarget = function() {
  return this.target
};
ol.renderer.dom.ImageLayer = function(a, b) {
  var c = goog.dom.createElement(goog.dom.TagName.DIV);
  c.style.position = "absolute";
  ol.renderer.dom.Layer.call(this, a, b, c);
  this.ol_renderer_dom_ImageLayer$image_ = null;
  this.ol_renderer_dom_ImageLayer$transform_ = goog.vec.Mat4.createNumberIdentity()
};
goog.inherits(ol.renderer.dom.ImageLayer, ol.renderer.dom.Layer);
ol.renderer.dom.ImageLayer.prototype.ol_renderer_Layer_prototype$forEachFeatureAtPixel = function(a, b, c, d) {
  var e = this.getLayer();
  return e.ol_layer_Layer_prototype$getSource().ol_source_Source_prototype$forEachFeatureAtPixel(b.extent, b.view2DState.resolution, b.view2DState.rotation, a, function(a) {
    return c.call(d, a, e)
  })
};
ol.renderer.dom.ImageLayer.prototype.prepareFrame = function(a, b) {
  var c = a.view2DState, d = c.center, e = c.resolution, f = c.rotation, g = this.ol_renderer_dom_ImageLayer$image_, h = this.getLayer().ol_layer_Layer_prototype$getSource(), k = a.viewHints;
  k[ol.ViewHint.ANIMATING] || k[ol.ViewHint.INTERACTING] || (c = h.ol_source_Image_prototype$getImage(a.extent, e, a.pixelRatio, c.projection), goog.isNull(c) || (k = c.ol_ImageBase_prototype$getState(), k == ol.ImageState.IDLE ? (goog.events.listenOnce(c, goog.events.EventType.CHANGE, this.handleImageChange, !1, this), c.ol_ImageBase_prototype$load()) : k == ol.ImageState.LOADED && (g = c)));
  if(!goog.isNull(g)) {
    var k = g.ol_ImageBase_prototype$getExtent(), l = g.ol_ImageBase_prototype$getResolution(), c = goog.vec.Mat4.createNumber();
    ol.vec.Mat4.makeTransform2D(c, a.size[0] / 2, a.size[1] / 2, l / e, l / e, f, (k[0] - d[0]) / l, (d[1] - k[3]) / l);
    g != this.ol_renderer_dom_ImageLayer$image_ && (d = g.getImageElement(this), d.style.maxWidth = "none", d.style.position = "absolute", goog.dom.removeChildren(this.target), goog.dom.appendChild(this.target, d), this.ol_renderer_dom_ImageLayer$image_ = g);
    this.setTransform_(c);
    this.updateAttributions(a.attributions, g.ol_ImageBase_prototype$getAttributions());
    this.updateLogos(a, h)
  }
};
ol.renderer.dom.ImageLayer.prototype.setTransform_ = function(a) {
  ol.vec.Mat4.equals2D(a, this.ol_renderer_dom_ImageLayer$transform_) || (ol.dom.transformElement2D(this.target, a, 6), goog.vec.Mat4.setFromArray(this.ol_renderer_dom_ImageLayer$transform_, a))
};
ol.renderer.dom.TileLayer = function(a, b) {
  var c = goog.dom.createElement(goog.dom.TagName.DIV);
  c.style.position = "absolute";
  ol.renderer.dom.Layer.call(this, a, b, c);
  this.ol_renderer_dom_TileLayer$renderedVisible_ = !0;
  this.renderedOpacity_ = 1;
  this.ol_renderer_dom_TileLayer$renderedRevision_ = 0;
  this.tileLayerZs_ = {}
};
goog.inherits(ol.renderer.dom.TileLayer, ol.renderer.dom.Layer);
ol.renderer.dom.TileLayer.prototype.prepareFrame = function(a, b) {
  if(b.visible) {
    var c = a.pixelRatio, d = a.view2DState, e = d.projection, f = this.getLayer(), g = f.ol_layer_Layer_prototype$getSource(), h = g.getTileGridForProjection(e), k = g.getGutter(), l = h.getZForResolution(d.resolution), m = h.ol_tilegrid_TileGrid_prototype$getResolution(l), n = d.center, p;
    m == d.resolution ? (n = this.snapCenterToPixel(n, m, a.size), p = ol.extent.getForView2DAndSize(n, m, d.rotation, a.size)) : p = a.extent;
    var m = h.getTileRangeForExtentAndResolution(p, m), q = {};
    q[l] = {};
    var r = this.createGetTileIfLoadedFunction(function(a) {
      return!goog.isNull(a) && a.ol_Tile_prototype$getState() == ol.TileState.LOADED
    }, g, c, e), x = goog.bind(g.findLoadedTiles, g, q, r), s = ol.extent.createEmpty(), r = new ol.TileRange(0, 0, 0, 0), t, v, y, w;
    for(y = m.minX;y <= m.maxX;++y) {
      for(w = m.minY;w <= m.maxY;++w) {
        t = g.getTile(l, y, w, c, e), v = t.ol_Tile_prototype$getState(), v == ol.TileState.LOADED ? q[l][t.tileCoord.toString()] = t : v != ol.TileState.ERROR && v != ol.TileState.EMPTY && (v = h.forEachTileCoordParentTileRange(t.tileCoord, x, null, r, s), v || (t = h.getTileCoordChildTileRange(t.tileCoord, r, s), goog.isNull(t) || x(l + 1, t)))
      }
    }
    var u;
    if(this.ol_renderer_dom_TileLayer$renderedRevision_ != g.getRevision()) {
      for(u in this.tileLayerZs_) {
        s = this.tileLayerZs_[+u], goog.dom.removeNode(s.target)
      }
      this.tileLayerZs_ = {};
      this.ol_renderer_dom_TileLayer$renderedRevision_ = g.getRevision()
    }
    y = goog.array.map(goog.object.getKeys(q), Number);
    goog.array.sort(y);
    var x = {}, A;
    w = 0;
    for(t = y.length;w < t;++w) {
      u = y[w];
      u in this.tileLayerZs_ ? s = this.tileLayerZs_[u] : (s = h.getTileCoordForCoordAndZ(n, u), s = new ol.renderer.dom.TileLayerZ_(h, s), x[u] = !0, this.tileLayerZs_[u] = s);
      u = q[u];
      for(A in u) {
        s.addTile(u[A], k)
      }
      s.finalizeAddTiles()
    }
    k = goog.array.map(goog.object.getKeys(this.tileLayerZs_), Number);
    goog.array.sort(k);
    w = goog.vec.Mat4.createNumber();
    A = 0;
    for(y = k.length;A < y;++A) {
      if(u = k[A], s = this.tileLayerZs_[u], u in q) {
        if(v = s.ol_renderer_dom_TileLayerZ__prototype$getResolution(), t = s.ol_renderer_dom_TileLayerZ__prototype$getOrigin(), ol.vec.Mat4.makeTransform2D(w, a.size[0] / 2, a.size[1] / 2, v / d.resolution, v / d.resolution, d.rotation, (t[0] - n[0]) / v, (n[1] - t[1]) / v), s.setTransform(w), u in x) {
          for(u -= 1;0 <= u;--u) {
            if(u in this.tileLayerZs_) {
              goog.dom.insertSiblingAfter(s.target, this.tileLayerZs_[u].target);
              break
            }
          }
          0 > u && goog.dom.insertChildAt(this.target, s.target, 0)
        }else {
          a.viewHints[ol.ViewHint.ANIMATING] || a.viewHints[ol.ViewHint.INTERACTING] || s.removeTilesOutsideExtent(p, r)
        }
      }else {
        goog.dom.removeNode(s.target), delete this.tileLayerZs_[u]
      }
    }
    b.opacity != this.renderedOpacity_ && (goog.style.setOpacity(this.target, b.opacity), this.renderedOpacity_ = b.opacity);
    b.visible && !this.ol_renderer_dom_TileLayer$renderedVisible_ && (goog.style.setElementShown(this.target, !0), this.ol_renderer_dom_TileLayer$renderedVisible_ = !0);
    this.updateUsedTiles(a.usedTiles, g, l, m);
    this.manageTilePyramid(a, g, h, c, e, p, l, f.getPreload());
    this.scheduleExpireCache(a, g);
    this.updateLogos(a, g)
  }else {
    this.ol_renderer_dom_TileLayer$renderedVisible_ && (goog.style.setElementShown(this.target, !1), this.ol_renderer_dom_TileLayer$renderedVisible_ = !1)
  }
};
ol.renderer.dom.TileLayerZ_ = function(a, b) {
  this.target = goog.dom.createElement(goog.dom.TagName.DIV);
  this.target.style.position = "absolute";
  this.tileGrid_ = a;
  this.tileCoordOrigin_ = b;
  this.ol_renderer_dom_TileLayerZ_$origin_ = ol.extent.getTopLeft(a.getTileCoordExtent(b));
  this.ol_renderer_dom_TileLayerZ_$resolution_ = a.ol_tilegrid_TileGrid_prototype$getResolution(b.ol_TileCoord$z);
  this.tiles_ = {};
  this.documentFragment_ = null;
  this.ol_renderer_dom_TileLayerZ_$transform_ = goog.vec.Mat4.createNumberIdentity()
};
ol.renderer.dom.TileLayerZ_.prototype.addTile = function(a, b) {
  var c = a.tileCoord, d = c.toString();
  if(!(d in this.tiles_)) {
    var e = this.tileGrid_.getTileSize(c.ol_TileCoord$z), f = a.ol_Tile_prototype$getImage(this), g = f.style;
    g.maxWidth = "none";
    var h, k;
    0 < b ? (h = goog.dom.createElement(goog.dom.TagName.DIV), k = h.style, k.overflow = "hidden", k.width = e + "px", k.height = e + "px", g.position = "absolute", g.left = -b + "px", g.top = -b + "px", g.width = e + 2 * b + "px", g.height = e + 2 * b + "px", goog.dom.appendChild(h, f)) : (g.width = e + "px", g.height = e + "px", h = f, k = g);
    k.position = "absolute";
    k.left = (c.x - this.tileCoordOrigin_.x) * e + "px";
    k.top = (this.tileCoordOrigin_.y - c.y) * e + "px";
    goog.isNull(this.documentFragment_) && (this.documentFragment_ = document.createDocumentFragment());
    goog.dom.appendChild(this.documentFragment_, h);
    this.tiles_[d] = a
  }
};
ol.renderer.dom.TileLayerZ_.prototype.finalizeAddTiles = function() {
  goog.isNull(this.documentFragment_) || (goog.dom.appendChild(this.target, this.documentFragment_), this.documentFragment_ = null)
};
ol.renderer.dom.TileLayerZ_.prototype.ol_renderer_dom_TileLayerZ__prototype$getOrigin = function() {
  return this.ol_renderer_dom_TileLayerZ_$origin_
};
ol.renderer.dom.TileLayerZ_.prototype.ol_renderer_dom_TileLayerZ__prototype$getResolution = function() {
  return this.ol_renderer_dom_TileLayerZ_$resolution_
};
ol.renderer.dom.TileLayerZ_.prototype.removeTilesOutsideExtent = function(a, b) {
  var c = this.tileGrid_.getTileRangeForExtentAndZ(a, this.tileCoordOrigin_.ol_TileCoord$z, b), d = [], e, f;
  for(f in this.tiles_) {
    e = this.tiles_[f], c.contains(e.tileCoord) || d.push(e)
  }
  var g, c = 0;
  for(g = d.length;c < g;++c) {
    e = d[c], f = e.tileCoord.toString(), goog.dom.removeNode(e.ol_Tile_prototype$getImage(this)), delete this.tiles_[f]
  }
};
ol.renderer.dom.TileLayerZ_.prototype.setTransform = function(a) {
  ol.vec.Mat4.equals2D(a, this.ol_renderer_dom_TileLayerZ_$transform_) || (ol.dom.transformElement2D(this.target, a, 6), goog.vec.Mat4.setFromArray(this.ol_renderer_dom_TileLayerZ_$transform_, a))
};
ol.renderer.dom.Map = function(a, b) {
  ol.renderer.Map.call(this, a, b);
  this.layersPane_ = goog.dom.createElement(goog.dom.TagName.DIV);
  this.layersPane_.className = ol.css.CLASS_UNSELECTABLE;
  var c = this.layersPane_.style;
  c.position = "absolute";
  c.width = "100%";
  c.height = "100%";
  goog.dom.insertChildAt(a, this.layersPane_, 0);
  this.ol_renderer_dom_Map$renderedVisible_ = !0
};
goog.inherits(ol.renderer.dom.Map, ol.renderer.Map);
ol.renderer.dom.Map.prototype.createLayerRenderer = function(a) {
  if(a instanceof ol.layer.Tile) {
    a = new ol.renderer.dom.TileLayer(this, a)
  }else {
    if(a instanceof ol.layer.Image) {
      a = new ol.renderer.dom.ImageLayer(this, a)
    }else {
      return null
    }
  }
  goog.dom.appendChild(this.layersPane_, a.ol_renderer_dom_Layer_prototype$getTarget());
  return a
};
ol.renderer.dom.Map.prototype.renderFrame = function(a) {
  if(goog.isNull(a)) {
    this.ol_renderer_dom_Map$renderedVisible_ && (goog.style.setElementShown(this.layersPane_, !1), this.ol_renderer_dom_Map$renderedVisible_ = !1)
  }else {
    var b = a.layerStates, c = a.layersArray, d, e, f, g;
    d = 0;
    for(e = c.length;d < e;++d) {
      f = c[d], g = this.getLayerRenderer(f), f = a.layerStates[goog.getUid(f)], f.sourceState == ol.source.State.READY && g.prepareFrame(a, f)
    }
    for(var h in this.getLayerRenderers()) {
      h in b || (g = this.getLayerRendererByKey(h), goog.dom.removeNode(g.ol_renderer_dom_Layer_prototype$getTarget()))
    }
    this.ol_renderer_dom_Map$renderedVisible_ || (goog.style.setElementShown(this.layersPane_, !0), this.ol_renderer_dom_Map$renderedVisible_ = !0);
    this.calculateMatrices2D(a);
    this.scheduleRemoveUnusedLayerRenderers(a)
  }
};
goog.webgl = {};
goog.webgl.DEPTH_BUFFER_BIT = 256;
goog.webgl.STENCIL_BUFFER_BIT = 1024;
goog.webgl.COLOR_BUFFER_BIT = 16384;
goog.webgl.POINTS = 0;
goog.webgl.LINES = 1;
goog.webgl.LINE_LOOP = 2;
goog.webgl.LINE_STRIP = 3;
goog.webgl.TRIANGLES = 4;
goog.webgl.TRIANGLE_STRIP = 5;
goog.webgl.TRIANGLE_FAN = 6;
goog.webgl.ZERO = 0;
goog.webgl.ONE = 1;
goog.webgl.SRC_COLOR = 768;
goog.webgl.ONE_MINUS_SRC_COLOR = 769;
goog.webgl.SRC_ALPHA = 770;
goog.webgl.ONE_MINUS_SRC_ALPHA = 771;
goog.webgl.DST_ALPHA = 772;
goog.webgl.ONE_MINUS_DST_ALPHA = 773;
goog.webgl.DST_COLOR = 774;
goog.webgl.ONE_MINUS_DST_COLOR = 775;
goog.webgl.SRC_ALPHA_SATURATE = 776;
goog.webgl.FUNC_ADD = 32774;
goog.webgl.BLEND_EQUATION = 32777;
goog.webgl.BLEND_EQUATION_RGB = 32777;
goog.webgl.BLEND_EQUATION_ALPHA = 34877;
goog.webgl.FUNC_SUBTRACT = 32778;
goog.webgl.FUNC_REVERSE_SUBTRACT = 32779;
goog.webgl.BLEND_DST_RGB = 32968;
goog.webgl.BLEND_SRC_RGB = 32969;
goog.webgl.BLEND_DST_ALPHA = 32970;
goog.webgl.BLEND_SRC_ALPHA = 32971;
goog.webgl.CONSTANT_COLOR = 32769;
goog.webgl.ONE_MINUS_CONSTANT_COLOR = 32770;
goog.webgl.CONSTANT_ALPHA = 32771;
goog.webgl.ONE_MINUS_CONSTANT_ALPHA = 32772;
goog.webgl.BLEND_COLOR = 32773;
goog.webgl.ARRAY_BUFFER = 34962;
goog.webgl.ELEMENT_ARRAY_BUFFER = 34963;
goog.webgl.ARRAY_BUFFER_BINDING = 34964;
goog.webgl.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
goog.webgl.STREAM_DRAW = 35040;
goog.webgl.STATIC_DRAW = 35044;
goog.webgl.DYNAMIC_DRAW = 35048;
goog.webgl.BUFFER_SIZE = 34660;
goog.webgl.BUFFER_USAGE = 34661;
goog.webgl.CURRENT_VERTEX_ATTRIB = 34342;
goog.webgl.FRONT = 1028;
goog.webgl.BACK = 1029;
goog.webgl.FRONT_AND_BACK = 1032;
goog.webgl.CULL_FACE = 2884;
goog.webgl.BLEND = 3042;
goog.webgl.DITHER = 3024;
goog.webgl.STENCIL_TEST = 2960;
goog.webgl.DEPTH_TEST = 2929;
goog.webgl.SCISSOR_TEST = 3089;
goog.webgl.POLYGON_OFFSET_FILL = 32823;
goog.webgl.SAMPLE_ALPHA_TO_COVERAGE = 32926;
goog.webgl.SAMPLE_COVERAGE = 32928;
goog.webgl.NO_ERROR = 0;
goog.webgl.INVALID_ENUM = 1280;
goog.webgl.INVALID_VALUE = 1281;
goog.webgl.INVALID_OPERATION = 1282;
goog.webgl.OUT_OF_MEMORY = 1285;
goog.webgl.CW = 2304;
goog.webgl.CCW = 2305;
goog.webgl.LINE_WIDTH = 2849;
goog.webgl.ALIASED_POINT_SIZE_RANGE = 33901;
goog.webgl.ALIASED_LINE_WIDTH_RANGE = 33902;
goog.webgl.CULL_FACE_MODE = 2885;
goog.webgl.FRONT_FACE = 2886;
goog.webgl.DEPTH_RANGE = 2928;
goog.webgl.DEPTH_WRITEMASK = 2930;
goog.webgl.DEPTH_CLEAR_VALUE = 2931;
goog.webgl.DEPTH_FUNC = 2932;
goog.webgl.STENCIL_CLEAR_VALUE = 2961;
goog.webgl.STENCIL_FUNC = 2962;
goog.webgl.STENCIL_FAIL = 2964;
goog.webgl.STENCIL_PASS_DEPTH_FAIL = 2965;
goog.webgl.STENCIL_PASS_DEPTH_PASS = 2966;
goog.webgl.STENCIL_REF = 2967;
goog.webgl.STENCIL_VALUE_MASK = 2963;
goog.webgl.STENCIL_WRITEMASK = 2968;
goog.webgl.STENCIL_BACK_FUNC = 34816;
goog.webgl.STENCIL_BACK_FAIL = 34817;
goog.webgl.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
goog.webgl.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
goog.webgl.STENCIL_BACK_REF = 36003;
goog.webgl.STENCIL_BACK_VALUE_MASK = 36004;
goog.webgl.STENCIL_BACK_WRITEMASK = 36005;
goog.webgl.VIEWPORT = 2978;
goog.webgl.SCISSOR_BOX = 3088;
goog.webgl.COLOR_CLEAR_VALUE = 3106;
goog.webgl.COLOR_WRITEMASK = 3107;
goog.webgl.UNPACK_ALIGNMENT = 3317;
goog.webgl.PACK_ALIGNMENT = 3333;
goog.webgl.MAX_TEXTURE_SIZE = 3379;
goog.webgl.MAX_VIEWPORT_DIMS = 3386;
goog.webgl.SUBPIXEL_BITS = 3408;
goog.webgl.RED_BITS = 3410;
goog.webgl.GREEN_BITS = 3411;
goog.webgl.BLUE_BITS = 3412;
goog.webgl.ALPHA_BITS = 3413;
goog.webgl.DEPTH_BITS = 3414;
goog.webgl.STENCIL_BITS = 3415;
goog.webgl.POLYGON_OFFSET_UNITS = 10752;
goog.webgl.POLYGON_OFFSET_FACTOR = 32824;
goog.webgl.TEXTURE_BINDING_2D = 32873;
goog.webgl.SAMPLE_BUFFERS = 32936;
goog.webgl.SAMPLES = 32937;
goog.webgl.SAMPLE_COVERAGE_VALUE = 32938;
goog.webgl.SAMPLE_COVERAGE_INVERT = 32939;
goog.webgl.COMPRESSED_TEXTURE_FORMATS = 34467;
goog.webgl.DONT_CARE = 4352;
goog.webgl.FASTEST = 4353;
goog.webgl.NICEST = 4354;
goog.webgl.GENERATE_MIPMAP_HINT = 33170;
goog.webgl.BYTE = 5120;
goog.webgl.UNSIGNED_BYTE = 5121;
goog.webgl.SHORT = 5122;
goog.webgl.UNSIGNED_SHORT = 5123;
goog.webgl.INT = 5124;
goog.webgl.UNSIGNED_INT = 5125;
goog.webgl.FLOAT = 5126;
goog.webgl.DEPTH_COMPONENT = 6402;
goog.webgl.ALPHA = 6406;
goog.webgl.RGB = 6407;
goog.webgl.RGBA = 6408;
goog.webgl.LUMINANCE = 6409;
goog.webgl.LUMINANCE_ALPHA = 6410;
goog.webgl.UNSIGNED_SHORT_4_4_4_4 = 32819;
goog.webgl.UNSIGNED_SHORT_5_5_5_1 = 32820;
goog.webgl.UNSIGNED_SHORT_5_6_5 = 33635;
goog.webgl.FRAGMENT_SHADER = 35632;
goog.webgl.VERTEX_SHADER = 35633;
goog.webgl.MAX_VERTEX_ATTRIBS = 34921;
goog.webgl.MAX_VERTEX_UNIFORM_VECTORS = 36347;
goog.webgl.MAX_VARYING_VECTORS = 36348;
goog.webgl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
goog.webgl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
goog.webgl.MAX_TEXTURE_IMAGE_UNITS = 34930;
goog.webgl.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
goog.webgl.SHADER_TYPE = 35663;
goog.webgl.DELETE_STATUS = 35712;
goog.webgl.LINK_STATUS = 35714;
goog.webgl.VALIDATE_STATUS = 35715;
goog.webgl.ATTACHED_SHADERS = 35717;
goog.webgl.ACTIVE_UNIFORMS = 35718;
goog.webgl.ACTIVE_ATTRIBUTES = 35721;
goog.webgl.SHADING_LANGUAGE_VERSION = 35724;
goog.webgl.CURRENT_PROGRAM = 35725;
goog.webgl.NEVER = 512;
goog.webgl.LESS = 513;
goog.webgl.EQUAL = 514;
goog.webgl.LEQUAL = 515;
goog.webgl.GREATER = 516;
goog.webgl.NOTEQUAL = 517;
goog.webgl.GEQUAL = 518;
goog.webgl.ALWAYS = 519;
goog.webgl.KEEP = 7680;
goog.webgl.REPLACE = 7681;
goog.webgl.INCR = 7682;
goog.webgl.DECR = 7683;
goog.webgl.INVERT = 5386;
goog.webgl.INCR_WRAP = 34055;
goog.webgl.DECR_WRAP = 34056;
goog.webgl.VENDOR = 7936;
goog.webgl.RENDERER = 7937;
goog.webgl.VERSION = 7938;
goog.webgl.NEAREST = 9728;
goog.webgl.LINEAR = 9729;
goog.webgl.NEAREST_MIPMAP_NEAREST = 9984;
goog.webgl.LINEAR_MIPMAP_NEAREST = 9985;
goog.webgl.NEAREST_MIPMAP_LINEAR = 9986;
goog.webgl.LINEAR_MIPMAP_LINEAR = 9987;
goog.webgl.TEXTURE_MAG_FILTER = 10240;
goog.webgl.TEXTURE_MIN_FILTER = 10241;
goog.webgl.TEXTURE_WRAP_S = 10242;
goog.webgl.TEXTURE_WRAP_T = 10243;
goog.webgl.TEXTURE_2D = 3553;
goog.webgl.TEXTURE = 5890;
goog.webgl.TEXTURE_CUBE_MAP = 34067;
goog.webgl.TEXTURE_BINDING_CUBE_MAP = 34068;
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
goog.webgl.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
goog.webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
goog.webgl.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
goog.webgl.TEXTURE0 = 33984;
goog.webgl.TEXTURE1 = 33985;
goog.webgl.TEXTURE2 = 33986;
goog.webgl.TEXTURE3 = 33987;
goog.webgl.TEXTURE4 = 33988;
goog.webgl.TEXTURE5 = 33989;
goog.webgl.TEXTURE6 = 33990;
goog.webgl.TEXTURE7 = 33991;
goog.webgl.TEXTURE8 = 33992;
goog.webgl.TEXTURE9 = 33993;
goog.webgl.TEXTURE10 = 33994;
goog.webgl.TEXTURE11 = 33995;
goog.webgl.TEXTURE12 = 33996;
goog.webgl.TEXTURE13 = 33997;
goog.webgl.TEXTURE14 = 33998;
goog.webgl.TEXTURE15 = 33999;
goog.webgl.TEXTURE16 = 34E3;
goog.webgl.TEXTURE17 = 34001;
goog.webgl.TEXTURE18 = 34002;
goog.webgl.TEXTURE19 = 34003;
goog.webgl.TEXTURE20 = 34004;
goog.webgl.TEXTURE21 = 34005;
goog.webgl.TEXTURE22 = 34006;
goog.webgl.TEXTURE23 = 34007;
goog.webgl.TEXTURE24 = 34008;
goog.webgl.TEXTURE25 = 34009;
goog.webgl.TEXTURE26 = 34010;
goog.webgl.TEXTURE27 = 34011;
goog.webgl.TEXTURE28 = 34012;
goog.webgl.TEXTURE29 = 34013;
goog.webgl.TEXTURE30 = 34014;
goog.webgl.TEXTURE31 = 34015;
goog.webgl.ACTIVE_TEXTURE = 34016;
goog.webgl.REPEAT = 10497;
goog.webgl.CLAMP_TO_EDGE = 33071;
goog.webgl.MIRRORED_REPEAT = 33648;
goog.webgl.FLOAT_VEC2 = 35664;
goog.webgl.FLOAT_VEC3 = 35665;
goog.webgl.FLOAT_VEC4 = 35666;
goog.webgl.INT_VEC2 = 35667;
goog.webgl.INT_VEC3 = 35668;
goog.webgl.INT_VEC4 = 35669;
goog.webgl.BOOL = 35670;
goog.webgl.BOOL_VEC2 = 35671;
goog.webgl.BOOL_VEC3 = 35672;
goog.webgl.BOOL_VEC4 = 35673;
goog.webgl.FLOAT_MAT2 = 35674;
goog.webgl.FLOAT_MAT3 = 35675;
goog.webgl.FLOAT_MAT4 = 35676;
goog.webgl.SAMPLER_2D = 35678;
goog.webgl.SAMPLER_CUBE = 35680;
goog.webgl.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
goog.webgl.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
goog.webgl.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
goog.webgl.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
goog.webgl.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
goog.webgl.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
goog.webgl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
goog.webgl.COMPILE_STATUS = 35713;
goog.webgl.LOW_FLOAT = 36336;
goog.webgl.MEDIUM_FLOAT = 36337;
goog.webgl.HIGH_FLOAT = 36338;
goog.webgl.LOW_INT = 36339;
goog.webgl.MEDIUM_INT = 36340;
goog.webgl.HIGH_INT = 36341;
goog.webgl.FRAMEBUFFER = 36160;
goog.webgl.RENDERBUFFER = 36161;
goog.webgl.RGBA4 = 32854;
goog.webgl.RGB5_A1 = 32855;
goog.webgl.RGB565 = 36194;
goog.webgl.DEPTH_COMPONENT16 = 33189;
goog.webgl.STENCIL_INDEX = 6401;
goog.webgl.STENCIL_INDEX8 = 36168;
goog.webgl.DEPTH_STENCIL = 34041;
goog.webgl.RENDERBUFFER_WIDTH = 36162;
goog.webgl.RENDERBUFFER_HEIGHT = 36163;
goog.webgl.RENDERBUFFER_INTERNAL_FORMAT = 36164;
goog.webgl.RENDERBUFFER_RED_SIZE = 36176;
goog.webgl.RENDERBUFFER_GREEN_SIZE = 36177;
goog.webgl.RENDERBUFFER_BLUE_SIZE = 36178;
goog.webgl.RENDERBUFFER_ALPHA_SIZE = 36179;
goog.webgl.RENDERBUFFER_DEPTH_SIZE = 36180;
goog.webgl.RENDERBUFFER_STENCIL_SIZE = 36181;
goog.webgl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
goog.webgl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
goog.webgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
goog.webgl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
goog.webgl.COLOR_ATTACHMENT0 = 36064;
goog.webgl.DEPTH_ATTACHMENT = 36096;
goog.webgl.STENCIL_ATTACHMENT = 36128;
goog.webgl.DEPTH_STENCIL_ATTACHMENT = 33306;
goog.webgl.NONE = 0;
goog.webgl.FRAMEBUFFER_COMPLETE = 36053;
goog.webgl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
goog.webgl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
goog.webgl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
goog.webgl.FRAMEBUFFER_UNSUPPORTED = 36061;
goog.webgl.FRAMEBUFFER_BINDING = 36006;
goog.webgl.RENDERBUFFER_BINDING = 36007;
goog.webgl.MAX_RENDERBUFFER_SIZE = 34024;
goog.webgl.INVALID_FRAMEBUFFER_OPERATION = 1286;
goog.webgl.UNPACK_FLIP_Y_WEBGL = 37440;
goog.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
goog.webgl.CONTEXT_LOST_WEBGL = 37442;
goog.webgl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
goog.webgl.BROWSER_DEFAULT_WEBGL = 37444;
goog.webgl.HALF_FLOAT_OES = 36193;
goog.webgl.FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 35723;
goog.webgl.VERTEX_ARRAY_BINDING_OES = 34229;
goog.webgl.UNMASKED_VENDOR_WEBGL = 37445;
goog.webgl.UNMASKED_RENDERER_WEBGL = 37446;
goog.webgl.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776;
goog.webgl.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777;
goog.webgl.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778;
goog.webgl.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779;
goog.webgl.TEXTURE_MAX_ANISOTROPY_EXT = 34046;
goog.webgl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047;
ol.render.webgl = {};
ol.render.webgl.Immediate = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawAsync = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawCircleGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawFeature = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawGeometryCollectionGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawPointGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawLineStringGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawMultiLineStringGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawMultiPointGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawMultiPolygonGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.drawPolygonGeometry = function(a, b) {
};
ol.render.webgl.Immediate.prototype.setFillStrokeStyle = function(a, b) {
};
ol.render.webgl.Immediate.prototype.setImageStyle = function(a) {
};
ol.render.webgl.Immediate.prototype.setTextStyle = function(a) {
};
ol.color.Matrix = function() {
  this.ol_color_Matrix$colorMatrix_ = goog.vec.Mat4.createNumber();
  this.brightness_ = void 0;
  this.brightnessMatrix_ = goog.vec.Mat4.createNumber();
  this.contrast_ = void 0;
  this.contrastMatrix_ = goog.vec.Mat4.createNumber();
  this.hue_ = void 0;
  this.hueMatrix_ = goog.vec.Mat4.createNumber();
  this.saturation_ = void 0;
  this.saturationMatrix_ = goog.vec.Mat4.createNumber()
};
ol.color.Matrix.makeBrightness = function(a, b) {
  goog.vec.Mat4.makeTranslate(a, b, b, b);
  return a
};
ol.color.Matrix.makeContrast = function(a, b) {
  goog.vec.Mat4.makeScale(a, b, b, b);
  var c = -0.5 * b + 0.5;
  goog.vec.Mat4.setColumnValues(a, 3, c, c, c, 1);
  return a
};
ol.color.Matrix.makeHue = function(a, b) {
  var c = Math.cos(b), d = Math.sin(b);
  goog.vec.Mat4.setFromValues(a, 0.213 + 0.787 * c - 0.213 * d, 0.213 - 0.213 * c + 0.143 * d, 0.213 - 0.213 * c - 0.787 * d, 0, 0.715 - 0.715 * c - 0.715 * d, 0.715 + 0.285 * c + 0.14 * d, 0.715 - 0.715 * c + 0.715 * d, 0, 0.072 - 0.072 * c + 0.928 * d, 0.072 - 0.072 * c - 0.283 * d, 0.072 + 0.928 * c + 0.072 * d, 0, 0, 0, 0, 1);
  return a
};
ol.color.Matrix.makeSaturation = function(a, b) {
  goog.vec.Mat4.setFromValues(a, 0.213 + 0.787 * b, 0.213 - 0.213 * b, 0.213 - 0.213 * b, 0, 0.715 - 0.715 * b, 0.715 + 0.285 * b, 0.715 - 0.715 * b, 0, 0.072 - 0.072 * b, 0.072 - 0.072 * b, 0.072 + 0.928 * b, 0, 0, 0, 0, 1);
  return a
};
ol.color.Matrix.prototype.getMatrix = function(a, b, c, d) {
  var e = !1;
  goog.isDef(a) && a !== this.brightness_ && (ol.color.Matrix.makeBrightness(this.brightnessMatrix_, a), this.brightness_ = a, e = !0);
  goog.isDef(b) && b !== this.contrast_ && (ol.color.Matrix.makeContrast(this.contrastMatrix_, b), this.contrast_ = b, e = !0);
  goog.isDef(c) && c !== this.hue_ && (ol.color.Matrix.makeHue(this.hueMatrix_, c), this.hue_ = c, e = !0);
  goog.isDef(d) && d !== this.saturation_ && (ol.color.Matrix.makeSaturation(this.saturationMatrix_, d), this.saturation_ = d, e = !0);
  e && (e = this.ol_color_Matrix$colorMatrix_, goog.vec.Mat4.makeIdentity(e), goog.isDef(b) && goog.vec.Mat4.multMat(e, this.contrastMatrix_, e), goog.isDef(a) && goog.vec.Mat4.multMat(e, this.brightnessMatrix_, e), goog.isDef(d) && goog.vec.Mat4.multMat(e, this.saturationMatrix_, e), goog.isDef(c) && goog.vec.Mat4.multMat(e, this.hueMatrix_, e));
  return this.ol_color_Matrix$colorMatrix_
};
ol.webgl.shader = {};
ol.webgl.Shader = function(a) {
  this.ol_webgl_Shader$source_ = a
};
ol.webgl.Shader.prototype.ol_webgl_Shader_prototype$getSource = function() {
  return this.ol_webgl_Shader$source_
};
ol.webgl.Shader.prototype.isAnimated = goog.functions.FALSE;
ol.webgl.shader.Fragment = function(a) {
  ol.webgl.Shader.call(this, a)
};
goog.inherits(ol.webgl.shader.Fragment, ol.webgl.Shader);
ol.webgl.shader.Fragment.prototype.ol_webgl_Shader_prototype$getType = function() {
  return goog.webgl.FRAGMENT_SHADER
};
ol.webgl.shader.Vertex = function(a) {
  ol.webgl.Shader.call(this, a)
};
goog.inherits(ol.webgl.shader.Vertex, ol.webgl.Shader);
ol.webgl.shader.Vertex.prototype.ol_webgl_Shader_prototype$getType = function() {
  return goog.webgl.VERTEX_SHADER
};
ol.renderer.webgl = {};
ol.renderer.webgl.map = {};
ol.renderer.webgl.map.shader = {};
ol.renderer.webgl.map.shader.Color = {};
ol.renderer.webgl.map.shader.ColorFragment = function() {
  ol.webgl.shader.Fragment.call(this, ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.map.shader.ColorFragment, ol.webgl.shader.Fragment);
goog.addSingletonGetter(ol.renderer.webgl.map.shader.ColorFragment);
ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\n\n\n// @see https://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/filters/skia/SkiaImageFilterBuilder.cpp\nuniform mat4 u_colorMatrix;\nuniform float u_opacity;\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  vec4 texColor \x3d texture2D(u_texture, v_texCoord);\n  gl_FragColor.rgb \x3d (u_colorMatrix * vec4(texColor.rgb, 1.)).rgb;\n  gl_FragColor.a \x3d texColor.a * u_opacity;\n}\n";
ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;uniform mat4 f;uniform float g;uniform sampler2D h;void main(void){vec4 texColor\x3dtexture2D(h,a);gl_FragColor.rgb\x3d(f*vec4(texColor.rgb,1.)).rgb;gl_FragColor.a\x3dtexColor.a*g;}";
ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$DEBUG_SOURCE : ol.renderer.webgl.map.shader.ColorFragment.function__new_ol_renderer_webgl_map_shader_ColorFragment___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.map.shader.ColorVertex = function() {
  ol.webgl.shader.Vertex.call(this, ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.map.shader.ColorVertex, ol.webgl.shader.Vertex);
goog.addSingletonGetter(ol.renderer.webgl.map.shader.ColorVertex);
ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$DEBUG_SOURCE = "varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nuniform mat4 u_texCoordMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main(void) {\n  gl_Position \x3d u_projectionMatrix * vec4(a_position, 0., 1.);\n  v_texCoord \x3d (u_texCoordMatrix * vec4(a_texCoord, 0., 1.)).st;\n}\n\n\n";
ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$OPTIMIZED_SOURCE = "varying vec2 a;attribute vec2 b;attribute vec2 c;uniform mat4 d;uniform mat4 e;void main(void){gl_Position\x3de*vec4(b,0.,1.);a\x3d(d*vec4(c,0.,1.)).st;}";
ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$DEBUG_SOURCE : ol.renderer.webgl.map.shader.ColorVertex.function__new_ol_renderer_webgl_map_shader_ColorVertex___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.map.shader.Color.Locations = function(a, b) {
  this.u_colorMatrix = a.getUniformLocation(b, goog.DEBUG ? "u_colorMatrix" : "f");
  this.u_opacity = a.getUniformLocation(b, goog.DEBUG ? "u_opacity" : "g");
  this.u_projectionMatrix = a.getUniformLocation(b, goog.DEBUG ? "u_projectionMatrix" : "e");
  this.u_texCoordMatrix = a.getUniformLocation(b, goog.DEBUG ? "u_texCoordMatrix" : "d");
  this.ol_renderer_webgl_map_shader_Color_Locations$u_texture = a.getUniformLocation(b, goog.DEBUG ? "u_texture" : "h");
  this.ol_renderer_webgl_map_shader_Color_Locations$a_position = a.getAttribLocation(b, goog.DEBUG ? "a_position" : "b");
  this.ol_renderer_webgl_map_shader_Color_Locations$a_texCoord = a.getAttribLocation(b, goog.DEBUG ? "a_texCoord" : "c")
};
ol.renderer.webgl.map.shader.Default = {};
ol.renderer.webgl.map.shader.DefaultFragment = function() {
  ol.webgl.shader.Fragment.call(this, ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.map.shader.DefaultFragment, ol.webgl.shader.Fragment);
goog.addSingletonGetter(ol.renderer.webgl.map.shader.DefaultFragment);
ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform float u_opacity;\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  vec4 texColor \x3d texture2D(u_texture, v_texCoord);\n  gl_FragColor.rgb \x3d texColor.rgb;\n  gl_FragColor.a \x3d texColor.a * u_opacity;\n}\n";
ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;uniform float f;uniform sampler2D g;void main(void){vec4 texColor\x3dtexture2D(g,a);gl_FragColor.rgb\x3dtexColor.rgb;gl_FragColor.a\x3dtexColor.a*f;}";
ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$DEBUG_SOURCE : ol.renderer.webgl.map.shader.DefaultFragment.function__new_ol_renderer_webgl_map_shader_DefaultFragment___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.map.shader.DefaultVertex = function() {
  ol.webgl.shader.Vertex.call(this, ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.map.shader.DefaultVertex, ol.webgl.shader.Vertex);
goog.addSingletonGetter(ol.renderer.webgl.map.shader.DefaultVertex);
ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$DEBUG_SOURCE = "varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\n\nuniform mat4 u_texCoordMatrix;\nuniform mat4 u_projectionMatrix;\n\nvoid main(void) {\n  gl_Position \x3d u_projectionMatrix * vec4(a_position, 0., 1.);\n  v_texCoord \x3d (u_texCoordMatrix * vec4(a_texCoord, 0., 1.)).st;\n}\n\n\n";
ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$OPTIMIZED_SOURCE = "varying vec2 a;attribute vec2 b;attribute vec2 c;uniform mat4 d;uniform mat4 e;void main(void){gl_Position\x3de*vec4(b,0.,1.);a\x3d(d*vec4(c,0.,1.)).st;}";
ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$DEBUG_SOURCE : ol.renderer.webgl.map.shader.DefaultVertex.function__new_ol_renderer_webgl_map_shader_DefaultVertex___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.map.shader.Default.Locations = function(a, b) {
  this.u_opacity = a.getUniformLocation(b, goog.DEBUG ? "u_opacity" : "f");
  this.u_projectionMatrix = a.getUniformLocation(b, goog.DEBUG ? "u_projectionMatrix" : "e");
  this.u_texCoordMatrix = a.getUniformLocation(b, goog.DEBUG ? "u_texCoordMatrix" : "d");
  this.ol_renderer_webgl_map_shader_Color_Locations$u_texture = a.getUniformLocation(b, goog.DEBUG ? "u_texture" : "g");
  this.ol_renderer_webgl_map_shader_Color_Locations$a_position = a.getAttribLocation(b, goog.DEBUG ? "a_position" : "b");
  this.ol_renderer_webgl_map_shader_Color_Locations$a_texCoord = a.getAttribLocation(b, goog.DEBUG ? "a_texCoord" : "c")
};
ol.structs.IntegerSet = function(a) {
  this.ol_structs_IntegerSet$arr_ = goog.isDef(a) ? a : [];
  goog.DEBUG && this.ol_structs_IntegerSet_prototype$assertValid()
};
ol.structs.IntegerSet.prototype.ol_structs_IntegerSet_prototype$addRange = function(a, b) {
  if(a != b) {
    var c = this.ol_structs_IntegerSet$arr_, d = c.length, e;
    for(e = 0;e < d;e += 2) {
      if(a <= c[e]) {
        c.splice(e, 0, a, b);
        this.compactRanges_();
        return
      }
    }
    c.push(a, b);
    this.compactRanges_()
  }
};
ol.structs.IntegerSet.prototype.ol_structs_IntegerSet_prototype$assertValid = function() {
  var a = this.ol_structs_IntegerSet$arr_.length, b;
  for(b = 1;b < a;++b) {
  }
};
ol.structs.IntegerSet.prototype.clear = function() {
  this.ol_structs_IntegerSet$arr_.length = 0
};
ol.structs.IntegerSet.prototype.compactRanges_ = function() {
  var a = this.ol_structs_IntegerSet$arr_, b = a.length, c = 0, d;
  for(d = 0;d < b;d += 2) {
    a[d] != a[d + 1] && (0 < c && a[c - 2] <= a[d] && a[d] <= a[c - 1] ? a[c - 1] = Math.max(a[c - 1], a[d + 1]) : (a[c++] = a[d], a[c++] = a[d + 1]))
  }
  a.length = c
};
ol.structs.IntegerSet.prototype.findRange = function(a) {
  var b = this.ol_structs_IntegerSet$arr_, c = b.length, d = -1, e, f, g;
  for(f = 0;f < c;f += 2) {
    g = b[f + 1] - b[f];
    if(g == a) {
      return b[f]
    }
    g > a && (-1 == d || g < e) && (d = b[f], e = g)
  }
  return d
};
ol.structs.IntegerSet.prototype.ol_structs_IntegerSet_prototype$forEachRange = function(a, b) {
  var c = this.ol_structs_IntegerSet$arr_, d = c.length, e;
  for(e = 0;e < d;e += 2) {
    a.call(b, c[e], c[e + 1])
  }
};
ol.structs.IntegerSet.prototype.forEachRangeInverted = function(a, b, c, d) {
  var e = this.ol_structs_IntegerSet$arr_, f = e.length;
  if(0 === f) {
    c.call(d, a, b)
  }else {
    a < e[0] && c.call(d, a, e[0]);
    for(a = 1;a < f - 1;a += 2) {
      c.call(d, e[a], e[a + 1])
    }
    e[f - 1] < b && c.call(d, e[f - 1], b)
  }
};
ol.structs.IntegerSet.prototype.ol_structs_IntegerSet_prototype$getArray = function() {
  return this.ol_structs_IntegerSet$arr_
};
ol.structs.IntegerSet.prototype.getFirst = function() {
  return 0 === this.ol_structs_IntegerSet$arr_.length ? -1 : this.ol_structs_IntegerSet$arr_[0]
};
ol.structs.IntegerSet.prototype.getLast = function() {
  var a = this.ol_structs_IntegerSet$arr_.length;
  return 0 === a ? -1 : this.ol_structs_IntegerSet$arr_[a - 1]
};
ol.structs.IntegerSet.prototype.getSize = function() {
  var a = this.ol_structs_IntegerSet$arr_, b = a.length, c = 0, d;
  for(d = 0;d < b;d += 2) {
    c += a[d + 1] - a[d]
  }
  return c
};
ol.structs.IntegerSet.prototype.intersectsRange = function(a, b) {
  if(a != b) {
    for(var c = this.ol_structs_IntegerSet$arr_, d = c.length, e = 0, e = 0;e < d;e += 2) {
      if(c[e] <= a && a < c[e + 1] || c[e] < b && b - 1 < c[e + 1] || a < c[e] && c[e + 1] <= b) {
        return!0
      }
    }
  }
  return!1
};
ol.structs.IntegerSet.prototype.isEmpty = function() {
  return 0 === this.ol_structs_IntegerSet$arr_.length
};
ol.structs.IntegerSet.prototype.pack = function() {
  return this.ol_structs_IntegerSet$arr_
};
ol.structs.IntegerSet.prototype.ol_structs_IntegerSet_prototype$removeRange = function(a, b) {
  var c = this.ol_structs_IntegerSet$arr_, d = c.length, e;
  for(e = 0;e < d;e += 2) {
    if(!(b < c[e] || c[e + 1] < a)) {
      if(c[e] > b) {
        break
      }
      if(a < c[e]) {
        if(b == c[e]) {
          break
        }else {
          if(b < c[e + 1]) {
            c[e] = Math.max(c[e], b);
            break
          }else {
            c.splice(e, 2), e -= 2, d -= 2
          }
        }
      }else {
        if(a == c[e]) {
          if(b < c[e + 1]) {
            c[e] = b;
            break
          }else {
            if(b == c[e + 1]) {
              c.splice(e, 2);
              break
            }else {
              c.splice(e, 2), e -= 2, d -= 2
            }
          }
        }else {
          if(b < c[e + 1]) {
            c.splice(e, 2, c[e], a, b, c[e + 1]);
            break
          }else {
            if(b == c[e + 1]) {
              c[e + 1] = a;
              break
            }else {
              c[e + 1] = a
            }
          }
        }
      }
    }
  }
  this.compactRanges_()
};
goog.DEBUG && (ol.structs.IntegerSet.prototype.toString = function() {
  var a = this.ol_structs_IntegerSet$arr_, b = a.length, c = Array(b / 2), d = 0, e;
  for(e = 0;e < b;e += 2) {
    c[d++] = a[e] + "-" + a[e + 1]
  }
  return c.join(", ")
});
ol.structs.BufferUsage = {STATIC_DRAW:goog.webgl.STATIC_DRAW, STREAM_DRAW:goog.webgl.STREAM_DRAW, DYNAMIC_DRAW:goog.webgl.DYNAMIC_DRAW};
ol.BUFFER_REPLACE_UNUSED_ENTRIES_WITH_NANS = goog.DEBUG;
ol.structs.Buffer = function(a, b, c) {
  this.ol_structs_Buffer$arr_ = goog.isDef(a) ? a : [];
  this.dirtySets_ = [];
  this.freeSet_ = new ol.structs.IntegerSet;
  var d = goog.isDef(b) ? b : this.ol_structs_Buffer$arr_.length;
  d < this.ol_structs_Buffer$arr_.length && this.freeSet_.ol_structs_IntegerSet_prototype$addRange(d, this.ol_structs_Buffer$arr_.length);
  if(ol.BUFFER_REPLACE_UNUSED_ENTRIES_WITH_NANS) {
    for(a = this.ol_structs_Buffer$arr_, b = a.length;d < b;++d) {
      a[d] = NaN
    }
  }
  this.split32DirtySet_ = this.split32_ = null;
  this.usage_ = goog.isDef(c) ? c : ol.structs.BufferUsage.STATIC_DRAW
};
ol.structs.Buffer.prototype.allocate = function(a) {
  var b = this.freeSet_.findRange(a);
  this.freeSet_.ol_structs_IntegerSet_prototype$removeRange(b, b + a);
  return b
};
ol.structs.Buffer.prototype.add = function(a) {
  var b = a.length, c = this.allocate(b), d;
  for(d = 0;d < b;++d) {
    this.ol_structs_Buffer$arr_[c + d] = a[d]
  }
  this.markDirty(b, c);
  return c
};
ol.structs.Buffer.prototype.addDirtySet = function(a) {
  this.dirtySets_.push(a)
};
ol.structs.Buffer.prototype.ol_structs_Buffer_prototype$forEachRange = function(a, b) {
  0 !== this.ol_structs_Buffer$arr_.length && this.freeSet_.forEachRangeInverted(0, this.ol_structs_Buffer$arr_.length, a, b)
};
ol.structs.Buffer.prototype.ol_structs_Buffer_prototype$getArray = function() {
  return this.ol_structs_Buffer$arr_
};
ol.structs.Buffer.prototype.getCount = function() {
  return this.ol_structs_Buffer$arr_.length - this.freeSet_.getSize()
};
ol.structs.Buffer.prototype.getFreeSet = function() {
  return this.freeSet_
};
ol.structs.Buffer.prototype.getSplit32 = function() {
  var a = this.ol_structs_Buffer$arr_, b = a.length;
  goog.isNull(this.split32DirtySet_) && (this.split32DirtySet_ = new ol.structs.IntegerSet([0, b]), this.addDirtySet(this.split32DirtySet_));
  goog.isNull(this.split32_) && (this.split32_ = new Float32Array(2 * b));
  var c = this.split32_;
  this.split32DirtySet_.ol_structs_IntegerSet_prototype$forEachRange(function(b, e) {
    var f, g, h, k;
    g = b;
    for(h = 2 * b;g < e;++g, h += 2) {
      k = a[g], 0 > k ? (f = 65536 * Math.floor(-k / 65536), c[h] = -f, c[h + 1] = k + f) : (f = 65536 * Math.floor(k / 65536), c[h] = f, c[h + 1] = k - f)
    }
  });
  this.split32DirtySet_.clear();
  return this.split32_
};
ol.structs.Buffer.prototype.getUsage = function() {
  return this.usage_
};
ol.structs.Buffer.prototype.markDirty = function(a, b) {
  var c, d;
  c = 0;
  for(d = this.dirtySets_.length;c < d;++c) {
    this.dirtySets_[c].ol_structs_IntegerSet_prototype$addRange(b, b + a)
  }
};
ol.structs.Buffer.prototype.remove = function(a, b) {
  var c, d;
  this.freeSet_.ol_structs_IntegerSet_prototype$addRange(b, b + a);
  c = 0;
  for(d = this.dirtySets_.length;c < d;++c) {
    this.dirtySets_[c].ol_structs_IntegerSet_prototype$removeRange(b, b + a)
  }
  if(ol.BUFFER_REPLACE_UNUSED_ENTRIES_WITH_NANS) {
    for(d = this.ol_structs_Buffer$arr_, c = 0;c < a;++c) {
      d[b + c] = NaN
    }
  }
};
ol.structs.Buffer.prototype.removeDirtySet = function(a) {
  goog.array.remove(this.dirtySets_, a)
};
ol.structs.Buffer.prototype.set = function(a, b) {
  var c = this.ol_structs_Buffer$arr_, d = a.length, e;
  for(e = 0;e < d;++e) {
    c[b + e] = a[e]
  }
  this.markDirty(d, b)
};
ol.renderer.webgl.Layer = function(a, b) {
  ol.renderer.Layer.call(this, a, b);
  this.arrayBuffer_ = new ol.structs.Buffer([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);
  this.framebuffer = this.texture = null;
  this.framebufferDimension = void 0;
  this.texCoordMatrix = goog.vec.Mat4.createNumber();
  this.projectionMatrix = goog.vec.Mat4.createNumberIdentity();
  this.ol_renderer_webgl_Layer$colorMatrix_ = new ol.color.Matrix;
  this.defaultLocations_ = this.colorLocations_ = null
};
goog.inherits(ol.renderer.webgl.Layer, ol.renderer.Layer);
ol.renderer.webgl.Layer.prototype.ol_renderer_webgl_Layer_prototype$bindFramebuffer = function(a, b) {
  var c = this.getWebGLMapRenderer().ol_renderer_webgl_Map_prototype$getGL();
  if(goog.isDef(this.framebufferDimension) && this.framebufferDimension == b) {
    c.bindFramebuffer(goog.webgl.FRAMEBUFFER, this.framebuffer)
  }else {
    a.postRenderFunctions.push(goog.partial(function(a, b, c) {
      a.isContextLost() || (a.deleteFramebuffer(b), a.deleteTexture(c))
    }, c, this.framebuffer, this.texture));
    var d = c.createTexture();
    c.bindTexture(goog.webgl.TEXTURE_2D, d);
    c.texImage2D(goog.webgl.TEXTURE_2D, 0, goog.webgl.RGBA, b, b, 0, goog.webgl.RGBA, goog.webgl.UNSIGNED_BYTE, null);
    c.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MAG_FILTER, goog.webgl.LINEAR);
    c.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MIN_FILTER, goog.webgl.LINEAR);
    var e = c.createFramebuffer();
    c.bindFramebuffer(goog.webgl.FRAMEBUFFER, e);
    c.framebufferTexture2D(goog.webgl.FRAMEBUFFER, goog.webgl.COLOR_ATTACHMENT0, goog.webgl.TEXTURE_2D, d, 0);
    this.texture = d;
    this.framebuffer = e;
    this.framebufferDimension = b
  }
};
ol.renderer.webgl.Layer.prototype.ol_renderer_webgl_Layer_prototype$composeFrame = function(a, b, c) {
  this.ol_renderer_webgl_Layer_prototype$dispatchComposeEvent_(ol.render.EventType.PRECOMPOSE, c, a);
  c.ol_webgl_Context_prototype$bindBuffer(goog.webgl.ARRAY_BUFFER, this.arrayBuffer_);
  var d = c.ol_webgl_Context_prototype$getGL(), e = b.brightness || 1 != b.contrast || b.hue || 1 != b.saturation, f, g;
  e ? (f = ol.renderer.webgl.map.shader.ColorFragment.getInstance(), g = ol.renderer.webgl.map.shader.ColorVertex.getInstance()) : (f = ol.renderer.webgl.map.shader.DefaultFragment.getInstance(), g = ol.renderer.webgl.map.shader.DefaultVertex.getInstance());
  f = c.getProgram(f, g);
  e ? goog.isNull(this.colorLocations_) ? this.colorLocations_ = g = new ol.renderer.webgl.map.shader.Color.Locations(d, f) : g = this.colorLocations_ : goog.isNull(this.defaultLocations_) ? this.defaultLocations_ = g = new ol.renderer.webgl.map.shader.Default.Locations(d, f) : g = this.defaultLocations_;
  c.ol_webgl_Context_prototype$useProgram(f) && (d.enableVertexAttribArray(g.ol_renderer_webgl_map_shader_Color_Locations$a_position), d.vertexAttribPointer(g.ol_renderer_webgl_map_shader_Color_Locations$a_position, 2, goog.webgl.FLOAT, !1, 16, 0), d.enableVertexAttribArray(g.ol_renderer_webgl_map_shader_Color_Locations$a_texCoord), d.vertexAttribPointer(g.ol_renderer_webgl_map_shader_Color_Locations$a_texCoord, 2, goog.webgl.FLOAT, !1, 16, 8), d.uniform1i(g.ol_renderer_webgl_map_shader_Color_Locations$u_texture, 
  0));
  d.uniformMatrix4fv(g.u_texCoordMatrix, !1, this.getTexCoordMatrix());
  d.uniformMatrix4fv(g.u_projectionMatrix, !1, this.getProjectionMatrix());
  e && d.uniformMatrix4fv(g.u_colorMatrix, !1, this.ol_renderer_webgl_Layer$colorMatrix_.getMatrix(b.brightness, b.contrast, b.hue, b.saturation));
  d.uniform1f(g.u_opacity, b.opacity);
  d.bindTexture(goog.webgl.TEXTURE_2D, this.getTexture());
  d.drawArrays(goog.webgl.TRIANGLE_STRIP, 0, 4);
  this.ol_renderer_webgl_Layer_prototype$dispatchComposeEvent_(ol.render.EventType.POSTCOMPOSE, c, a)
};
ol.renderer.webgl.Layer.prototype.ol_renderer_webgl_Layer_prototype$dispatchComposeEvent_ = function(a, b, c) {
  var d = this.getLayer();
  if(d.hasListener(a)) {
    var e = new ol.render.webgl.Immediate(b, c.pixelRatio);
    a = new ol.render.Event(a, d, e, c, null, b);
    d.dispatchEvent(a)
  }
};
ol.renderer.webgl.Layer.prototype.getWebGLMapRenderer = function() {
  return this.getMapRenderer()
};
ol.renderer.webgl.Layer.prototype.getTexCoordMatrix = function() {
  return this.texCoordMatrix
};
ol.renderer.webgl.Layer.prototype.getTexture = function() {
  return this.texture
};
ol.renderer.webgl.Layer.prototype.getProjectionMatrix = function() {
  return this.projectionMatrix
};
ol.renderer.webgl.Layer.prototype.ol_renderer_webgl_Layer_prototype$handleWebGLContextLost = function() {
  this.framebuffer = this.texture = null;
  this.framebufferDimension = void 0
};
ol.renderer.webgl.ImageLayer = function(a, b) {
  ol.renderer.webgl.Layer.call(this, a, b);
  this.ol_renderer_webgl_ImageLayer$image_ = null
};
goog.inherits(ol.renderer.webgl.ImageLayer, ol.renderer.webgl.Layer);
ol.renderer.webgl.ImageLayer.prototype.createTexture_ = function(a) {
  a = a.getImageElement();
  var b = this.getWebGLMapRenderer().ol_renderer_webgl_Map_prototype$getGL(), c = b.createTexture();
  b.bindTexture(goog.webgl.TEXTURE_2D, c);
  b.texImage2D(goog.webgl.TEXTURE_2D, 0, goog.webgl.RGBA, goog.webgl.RGBA, goog.webgl.UNSIGNED_BYTE, a);
  b.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_S, goog.webgl.CLAMP_TO_EDGE);
  b.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_T, goog.webgl.CLAMP_TO_EDGE);
  b.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MIN_FILTER, goog.webgl.LINEAR);
  b.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MAG_FILTER, goog.webgl.LINEAR);
  return c
};
ol.renderer.webgl.ImageLayer.prototype.ol_renderer_Layer_prototype$forEachFeatureAtPixel = function(a, b, c, d) {
  var e = this.getLayer();
  return e.ol_layer_Layer_prototype$getSource().ol_source_Source_prototype$forEachFeatureAtPixel(b.extent, b.view2DState.resolution, b.view2DState.rotation, a, function(a) {
    return c.call(d, a, e)
  })
};
ol.renderer.webgl.ImageLayer.prototype.prepareFrame = function(a, b) {
  var c = this.getWebGLMapRenderer().ol_renderer_webgl_Map_prototype$getGL(), d = a.view2DState, e = d.center, f = d.resolution, g = d.rotation, h = this.ol_renderer_webgl_ImageLayer$image_, k = this.texture, l = this.getLayer().ol_layer_Layer_prototype$getSource(), m = a.viewHints;
  m[ol.ViewHint.ANIMATING] || m[ol.ViewHint.INTERACTING] || (d = l.ol_source_Image_prototype$getImage(a.extent, f, a.pixelRatio, d.projection), goog.isNull(d) || (m = d.ol_ImageBase_prototype$getState(), m == ol.ImageState.IDLE ? (goog.events.listenOnce(d, goog.events.EventType.CHANGE, this.handleImageChange, !1, this), d.ol_ImageBase_prototype$load()) : m == ol.ImageState.LOADED && (h = d, k = this.createTexture_(d), goog.isNull(this.texture) || a.postRenderFunctions.push(goog.partial(function(a, 
  b) {
    a.isContextLost() || a.deleteTexture(b)
  }, c, this.texture)))));
  goog.isNull(h) || (c = this.getWebGLMapRenderer().getContext().getCanvas(), this.updateProjectionMatrix_(c.width, c.height, e, f, g, h.ol_ImageBase_prototype$getExtent()), e = this.texCoordMatrix, goog.vec.Mat4.makeIdentity(e), goog.vec.Mat4.scale(e, 1, -1, 1), goog.vec.Mat4.translate(e, 0, -1, 0), this.ol_renderer_webgl_ImageLayer$image_ = h, this.texture = k, this.updateAttributions(a.attributions, h.ol_ImageBase_prototype$getAttributions()), this.updateLogos(a, l))
};
ol.renderer.webgl.ImageLayer.prototype.updateProjectionMatrix_ = function(a, b, c, d, e, f) {
  a *= d;
  b *= d;
  d = this.projectionMatrix;
  goog.vec.Mat4.makeIdentity(d);
  goog.vec.Mat4.scale(d, 2 / a, 2 / b, 1);
  goog.vec.Mat4.rotateZ(d, -e);
  goog.vec.Mat4.translate(d, f[0] - c[0], f[1] - c[1], 0);
  goog.vec.Mat4.scale(d, (f[2] - f[0]) / 2, (f[3] - f[1]) / 2, 1);
  goog.vec.Mat4.translate(d, 1, 1, 0)
};
ol.renderer.webgl.tilelayer = {};
ol.renderer.webgl.tilelayer.shader = {};
ol.renderer.webgl.tilelayer.shader.Fragment = function() {
  ol.webgl.shader.Fragment.call(this, ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.tilelayer.shader.Fragment, ol.webgl.shader.Fragment);
goog.addSingletonGetter(ol.renderer.webgl.tilelayer.shader.Fragment);
ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$DEBUG_SOURCE = "precision mediump float;\nvarying vec2 v_texCoord;\n\n\nuniform sampler2D u_texture;\n\nvoid main(void) {\n  gl_FragColor \x3d texture2D(u_texture, v_texCoord);\n}\n";
ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$OPTIMIZED_SOURCE = "precision mediump float;varying vec2 a;uniform sampler2D e;void main(void){gl_FragColor\x3dtexture2D(e,a);}";
ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$DEBUG_SOURCE : ol.renderer.webgl.tilelayer.shader.Fragment.function__new_ol_renderer_webgl_tilelayer_shader_Fragment___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.tilelayer.shader.Vertex = function() {
  ol.webgl.shader.Vertex.call(this, ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$SOURCE)
};
goog.inherits(ol.renderer.webgl.tilelayer.shader.Vertex, ol.webgl.shader.Vertex);
goog.addSingletonGetter(ol.renderer.webgl.tilelayer.shader.Vertex);
ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$DEBUG_SOURCE = "varying vec2 v_texCoord;\n\n\nattribute vec2 a_position;\nattribute vec2 a_texCoord;\nuniform vec4 u_tileOffset;\n\nvoid main(void) {\n  gl_Position \x3d vec4(a_position * u_tileOffset.xy + u_tileOffset.zw, 0., 1.);\n  v_texCoord \x3d a_texCoord;\n}\n\n\n";
ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$OPTIMIZED_SOURCE = "varying vec2 a;attribute vec2 b;attribute vec2 c;uniform vec4 d;void main(void){gl_Position\x3dvec4(b*d.xy+d.zw,0.,1.);a\x3dc;}";
ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$SOURCE = goog.DEBUG ? ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$DEBUG_SOURCE : ol.renderer.webgl.tilelayer.shader.Vertex.function__new_ol_renderer_webgl_tilelayer_shader_Vertex___undefined$OPTIMIZED_SOURCE;
ol.renderer.webgl.tilelayer.shader.Locations = function(a, b) {
  this.ol_renderer_webgl_tilelayer_shader_Locations$u_texture = a.getUniformLocation(b, goog.DEBUG ? "u_texture" : "e");
  this.u_tileOffset = a.getUniformLocation(b, goog.DEBUG ? "u_tileOffset" : "d");
  this.ol_renderer_webgl_tilelayer_shader_Locations$a_position = a.getAttribLocation(b, goog.DEBUG ? "a_position" : "b");
  this.ol_renderer_webgl_tilelayer_shader_Locations$a_texCoord = a.getAttribLocation(b, goog.DEBUG ? "a_texCoord" : "c")
};
ol.renderer.webgl.TileLayer = function(a, b) {
  ol.renderer.webgl.Layer.call(this, a, b);
  this.fragmentShader_ = ol.renderer.webgl.tilelayer.shader.Fragment.getInstance();
  this.vertexShader_ = ol.renderer.webgl.tilelayer.shader.Vertex.getInstance();
  this.locations_ = null;
  this.renderArrayBuffer_ = new ol.structs.Buffer([0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0]);
  this.renderedFramebufferExtent_ = this.renderedTileRange_ = null;
  this.ol_renderer_webgl_TileLayer$renderedRevision_ = -1
};
goog.inherits(ol.renderer.webgl.TileLayer, ol.renderer.webgl.Layer);
ol.renderer.webgl.TileLayer.prototype.goog_Disposable_prototype$disposeInternal = function() {
  this.getWebGLMapRenderer().getContext().ol_webgl_Context_prototype$deleteBuffer(this.renderArrayBuffer_);
  ol.renderer.webgl.TileLayer.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.renderer.webgl.TileLayer.prototype.ol_renderer_webgl_Layer_prototype$handleWebGLContextLost = function() {
  ol.renderer.webgl.TileLayer.superClass_.ol_renderer_webgl_Layer_prototype$handleWebGLContextLost.call(this);
  this.locations_ = null
};
ol.renderer.webgl.TileLayer.prototype.prepareFrame = function(a, b) {
  var c = this.getWebGLMapRenderer(), d = c.getContext(), e = c.ol_renderer_webgl_Map_prototype$getGL(), f = a.view2DState, g = f.projection, h = this.getLayer(), k = h.ol_layer_Layer_prototype$getSource(), l = k.getTileGridForProjection(g), m = l.getZForResolution(f.resolution), n = l.ol_tilegrid_TileGrid_prototype$getResolution(m), p = k.getTilePixelSize(m, a.pixelRatio, g), q = p / l.getTileSize(m), r = n / q, x = k.getGutter(), s = f.center, t;
  n == f.resolution ? (s = this.snapCenterToPixel(s, n, a.size), t = ol.extent.getForView2DAndSize(s, n, f.rotation, a.size)) : t = a.extent;
  n = l.getTileRangeForExtentAndResolution(t, n);
  if(!goog.isNull(this.renderedTileRange_) && this.renderedTileRange_.equals(n) && this.ol_renderer_webgl_TileLayer$renderedRevision_ == k.getRevision()) {
    r = this.renderedFramebufferExtent_
  }else {
    var v = n.getSize(), v = Math.max(v[0] * p, v[1] * p), y = ol.math.roundUpToPowerOfTwo(v), v = r * y, w = l.ol_tilegrid_TileGrid_prototype$getOrigin(m), u = w[0] + n.minX * p * r, r = w[1] + n.minY * p * r, r = [u, r, u + v, r + v];
    this.ol_renderer_webgl_Layer_prototype$bindFramebuffer(a, y);
    e.viewport(0, 0, y, y);
    e.clearColor(0, 0, 0, 0);
    e.clear(goog.webgl.COLOR_BUFFER_BIT);
    e.disable(goog.webgl.BLEND);
    y = d.getProgram(this.fragmentShader_, this.vertexShader_);
    d.ol_webgl_Context_prototype$useProgram(y);
    goog.isNull(this.locations_) && (this.locations_ = new ol.renderer.webgl.tilelayer.shader.Locations(e, y));
    d.ol_webgl_Context_prototype$bindBuffer(goog.webgl.ARRAY_BUFFER, this.renderArrayBuffer_);
    e.enableVertexAttribArray(this.locations_.ol_renderer_webgl_tilelayer_shader_Locations$a_position);
    e.vertexAttribPointer(this.locations_.ol_renderer_webgl_tilelayer_shader_Locations$a_position, 2, goog.webgl.FLOAT, !1, 16, 0);
    e.enableVertexAttribArray(this.locations_.ol_renderer_webgl_tilelayer_shader_Locations$a_texCoord);
    e.vertexAttribPointer(this.locations_.ol_renderer_webgl_tilelayer_shader_Locations$a_texCoord, 2, goog.webgl.FLOAT, !1, 16, 8);
    e.uniform1i(this.locations_.ol_renderer_webgl_tilelayer_shader_Locations$u_texture, 0);
    d = {};
    d[m] = {};
    var y = this.createGetTileIfLoadedFunction(function(a) {
      return!goog.isNull(a) && a.ol_Tile_prototype$getState() == ol.TileState.LOADED && c.isTileTextureLoaded(a)
    }, k, q, g), A = goog.bind(k.findLoadedTiles, k, d, y), y = !0, u = ol.extent.createEmpty(), D = new ol.TileRange(0, 0, 0, 0), C, G, F;
    for(G = n.minX;G <= n.maxX;++G) {
      for(F = n.minY;F <= n.maxY;++F) {
        w = k.getTile(m, G, F, q, g);
        C = w.ol_Tile_prototype$getState();
        if(C == ol.TileState.LOADED) {
          if(c.isTileTextureLoaded(w)) {
            d[m][w.tileCoord.toString()] = w;
            continue
          }
        }else {
          if(C == ol.TileState.ERROR || C == ol.TileState.EMPTY) {
            continue
          }
        }
        y = !1;
        C = l.forEachTileCoordParentTileRange(w.tileCoord, A, null, D, u);
        C || (w = l.getTileCoordChildTileRange(w.tileCoord, D, u), goog.isNull(w) || A(m + 1, w))
      }
    }
    A = goog.array.map(goog.object.getKeys(d), Number);
    goog.array.sort(A);
    var D = goog.vec.Vec4.createFloat32(), z, B, H, E, J;
    G = 0;
    for(F = A.length;G < F;++G) {
      for(H in E = d[A[G]], E) {
        w = E[H], B = l.getTileCoordExtent(w.tileCoord, u), C = 2 * (B[2] - B[0]) / v, z = 2 * (B[3] - B[1]) / v, J = 2 * (B[0] - r[0]) / v - 1, B = 2 * (B[1] - r[1]) / v - 1, goog.vec.Vec4.setFromValues(D, C, z, J, B), e.uniform4fv(this.locations_.u_tileOffset, D), c.bindTileTexture(w, p, x * q, goog.webgl.LINEAR, goog.webgl.LINEAR), e.drawArrays(goog.webgl.TRIANGLE_STRIP, 0, 4)
      }
    }
    y ? (this.renderedTileRange_ = n, this.renderedFramebufferExtent_ = r, this.ol_renderer_webgl_TileLayer$renderedRevision_ = k.getRevision()) : (this.renderedFramebufferExtent_ = this.renderedTileRange_ = null, this.ol_renderer_webgl_TileLayer$renderedRevision_ = -1, a.animate = !0)
  }
  this.updateUsedTiles(a.usedTiles, k, m, n);
  var I = c.getTileTextureQueue();
  this.manageTilePyramid(a, k, l, q, g, t, m, h.getPreload(), function(a) {
    a.ol_Tile_prototype$getState() != ol.TileState.LOADED || (c.isTileTextureLoaded(a) || I.isKeyQueued(a.ol_Tile_prototype$getKey())) || I.enqueue([a, l.getTileCoordCenter(a.tileCoord), l.ol_tilegrid_TileGrid_prototype$getResolution(a.tileCoord.ol_TileCoord$z), p, x * q])
  }, this);
  this.scheduleExpireCache(a, k);
  this.updateLogos(a, k);
  e = this.texCoordMatrix;
  goog.vec.Mat4.makeIdentity(e);
  goog.vec.Mat4.translate(e, (s[0] - r[0]) / (r[2] - r[0]), (s[1] - r[1]) / (r[3] - r[1]), 0);
  0 !== f.rotation && goog.vec.Mat4.rotateZ(e, f.rotation);
  goog.vec.Mat4.scale(e, a.size[0] * f.resolution / (r[2] - r[0]), a.size[1] * f.resolution / (r[3] - r[1]), 1);
  goog.vec.Mat4.translate(e, -0.5, -0.5, 0)
};
ol.structs.LRUCache = function() {
  this.count_ = 0;
  this.entries_ = {};
  this.newest_ = this.oldest_ = null
};
ol.structs.LRUCache.prototype.ol_structs_LRUCache_prototype$assertValid = function() {
  if(0 !== this.count_) {
    var a, b;
    a = 0;
    for(b = this.oldest_;!goog.isNull(b);b = b.newer) {
      ++a
    }
    a = 0;
    for(b = this.newest_;!goog.isNull(b);b = b.older) {
      ++a
    }
  }
};
ol.structs.LRUCache.prototype.clear = function() {
  this.count_ = 0;
  this.entries_ = {};
  this.newest_ = this.oldest_ = null
};
ol.structs.LRUCache.prototype.containsKey = function(a) {
  return this.entries_.hasOwnProperty(a)
};
ol.structs.LRUCache.prototype.forEach = function(a, b) {
  for(var c = this.oldest_;!goog.isNull(c);) {
    a.call(b, c.value_, c.key_, this), c = c.newer
  }
};
ol.structs.LRUCache.prototype.get = function(a) {
  a = this.entries_[a];
  if(a === this.newest_) {
    return a.value_
  }
  a === this.oldest_ ? (this.oldest_ = this.oldest_.newer, this.oldest_.older = null) : (a.newer.older = a.older, a.older.newer = a.newer);
  a.newer = null;
  a.older = this.newest_;
  this.newest_ = this.newest_.newer = a;
  return a.value_
};
ol.structs.LRUCache.prototype.getCount = function() {
  return this.count_
};
ol.structs.LRUCache.prototype.getKeys = function() {
  var a = Array(this.count_), b = 0, c;
  for(c = this.newest_;!goog.isNull(c);c = c.older) {
    a[b++] = c.key_
  }
  return a
};
ol.structs.LRUCache.prototype.getValues = function() {
  var a = Array(this.count_), b = 0, c;
  for(c = this.newest_;!goog.isNull(c);c = c.older) {
    a[b++] = c.value_
  }
  return a
};
ol.structs.LRUCache.prototype.peekLast = function() {
  return this.oldest_.value_
};
ol.structs.LRUCache.prototype.peekLastKey = function() {
  return this.oldest_.key_
};
ol.structs.LRUCache.prototype.ol_structs_LRUCache_prototype$pop = function() {
  var a = this.oldest_;
  delete this.entries_[a.key_];
  goog.isNull(a.newer) || (a.newer.older = null);
  this.oldest_ = a.newer;
  goog.isNull(this.oldest_) && (this.newest_ = null);
  --this.count_;
  return a.value_
};
ol.structs.LRUCache.prototype.set = function(a, b) {
  var c = {key_:a, newer:null, older:this.newest_, value_:b};
  goog.isNull(this.newest_) ? this.oldest_ = c : this.newest_.newer = c;
  this.newest_ = c;
  this.entries_[a] = c;
  ++this.count_
};
ol.webgl.Context = function(a, b) {
  this.ol_webgl_Context$canvas_ = a;
  this.ol_webgl_Context$gl_ = b;
  this.bufferCache_ = {};
  this.shaderCache_ = {};
  this.programCache_ = {};
  this.currentProgram_ = null;
  goog.events.listen(this.ol_webgl_Context$canvas_, ol.webgl.WebGLContextEventType.LOST, this.ol_webgl_Context_prototype$handleWebGLContextLost, !1, this);
  goog.events.listen(this.ol_webgl_Context$canvas_, ol.webgl.WebGLContextEventType.RESTORED, this.ol_webgl_Context_prototype$handleWebGLContextRestored, !1, this)
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$bindBuffer = function(a, b) {
  var c = this.ol_webgl_Context_prototype$getGL(), d = b.ol_structs_Buffer_prototype$getArray(), e = goog.getUid(b);
  if(e in this.bufferCache_) {
    e = this.bufferCache_[e], c.bindBuffer(a, e.buffer), e.dirtySet.ol_structs_IntegerSet_prototype$forEachRange(function(b, e) {
      var f = d.slice(b, e);
      c.bufferSubData(a, b, a == goog.webgl.ARRAY_BUFFER ? new Float32Array(f) : new Uint16Array(f))
    }), e.dirtySet.clear()
  }else {
    var f = c.createBuffer();
    c.bindBuffer(a, f);
    c.bufferData(a, a == goog.webgl.ARRAY_BUFFER ? new Float32Array(d) : new Uint16Array(d), b.getUsage());
    var g = new ol.structs.IntegerSet;
    b.addDirtySet(g);
    this.bufferCache_[e] = {buf:b, buffer:f, dirtySet:g}
  }
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$deleteBuffer = function(a) {
  var b = this.ol_webgl_Context_prototype$getGL();
  a = goog.getUid(a);
  var c = this.bufferCache_[a];
  c.buf.removeDirtySet(c.dirtySet);
  b.isContextLost() || b.deleteBuffer(c.buffer);
  delete this.bufferCache_[a]
};
ol.webgl.Context.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.object.forEach(this.bufferCache_, function(a) {
    a.buf.removeDirtySet(a.dirtySet)
  });
  var a = this.ol_webgl_Context_prototype$getGL();
  a.isContextLost() || (goog.object.forEach(this.bufferCache_, function(b) {
    a.deleteBuffer(b.buffer)
  }), goog.object.forEach(this.programCache_, function(b) {
    a.deleteProgram(b)
  }), goog.object.forEach(this.shaderCache_, function(b) {
    a.deleteShader(b)
  }))
};
ol.webgl.Context.prototype.getCanvas = function() {
  return this.ol_webgl_Context$canvas_
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$getGL = function() {
  return this.ol_webgl_Context$gl_
};
ol.webgl.Context.prototype.getShader = function(a) {
  var b = goog.getUid(a);
  if(b in this.shaderCache_) {
    return this.shaderCache_[b]
  }
  var c = this.ol_webgl_Context_prototype$getGL(), d = c.createShader(a.ol_webgl_Shader_prototype$getType());
  c.shaderSource(d, a.ol_webgl_Shader_prototype$getSource());
  c.compileShader(d);
  goog.DEBUG && (c.getShaderParameter(d, goog.webgl.COMPILE_STATUS) || c.isContextLost());
  return this.shaderCache_[b] = d
};
ol.webgl.Context.prototype.getProgram = function(a, b) {
  var c = goog.getUid(a) + "/" + goog.getUid(b);
  if(c in this.programCache_) {
    return this.programCache_[c]
  }
  var d = this.ol_webgl_Context_prototype$getGL(), e = d.createProgram();
  d.attachShader(e, this.getShader(a));
  d.attachShader(e, this.getShader(b));
  d.linkProgram(e);
  goog.DEBUG && (d.getProgramParameter(e, goog.webgl.LINK_STATUS) || d.isContextLost());
  return this.programCache_[c] = e
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$handleWebGLContextLost = function() {
  goog.object.clear(this.bufferCache_);
  goog.object.clear(this.shaderCache_);
  goog.object.clear(this.programCache_);
  this.currentProgram_ = null
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$handleWebGLContextRestored = function() {
};
ol.webgl.Context.prototype.ol_webgl_Context_prototype$useProgram = function(a) {
  if(a == this.currentProgram_) {
    return!1
  }
  this.ol_webgl_Context_prototype$getGL().useProgram(a);
  this.currentProgram_ = a;
  return!0
};
ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK = 1024;
ol.renderer.webgl.Map = function(a, b) {
  ol.renderer.Map.call(this, a, b);
  this.ol_renderer_webgl_Map$canvas_ = goog.dom.createElement(goog.dom.TagName.CANVAS);
  this.ol_renderer_webgl_Map$canvas_.style.width = "100%";
  this.ol_renderer_webgl_Map$canvas_.style.height = "100%";
  this.ol_renderer_webgl_Map$canvas_.className = ol.css.CLASS_UNSELECTABLE;
  goog.dom.insertChildAt(a, this.ol_renderer_webgl_Map$canvas_, 0);
  this.clipTileCanvas_ = goog.dom.createElement(goog.dom.TagName.CANVAS);
  this.clipTileCanvasSize_ = 0;
  this.clipTileContext_ = this.clipTileCanvas_.getContext("2d");
  this.ol_renderer_webgl_Map$renderedVisible_ = !0;
  this.ol_renderer_webgl_Map$gl_ = ol.webgl.getContext(this.ol_renderer_webgl_Map$canvas_, {antialias:!0, depth:!1, failIfMajorPerformanceCaveat:!0, preserveDrawingBuffer:!1, stencil:!0});
  this.ol_renderer_webgl_Map$context_ = new ol.webgl.Context(this.ol_renderer_webgl_Map$canvas_, this.ol_renderer_webgl_Map$gl_);
  goog.events.listen(this.ol_renderer_webgl_Map$canvas_, ol.webgl.WebGLContextEventType.LOST, this.ol_renderer_webgl_Map_prototype$handleWebGLContextLost, !1, this);
  goog.events.listen(this.ol_renderer_webgl_Map$canvas_, ol.webgl.WebGLContextEventType.RESTORED, this.ol_renderer_webgl_Map_prototype$handleWebGLContextRestored, !1, this);
  this.textureCache_ = new ol.structs.LRUCache;
  this.ol_renderer_webgl_Map$focus_ = null;
  this.tileTextureQueue_ = new ol.structs.PriorityQueue(goog.bind(function(a) {
    var b = a[1];
    a = a[2];
    var e = b[0] - this.ol_renderer_webgl_Map$focus_[0], b = b[1] - this.ol_renderer_webgl_Map$focus_[1];
    return 65536 * Math.log(a) + Math.sqrt(e * e + b * b) / a
  }, this), function(a) {
    return a[0].ol_Tile_prototype$getKey()
  });
  this.loadNextTileTexture_ = goog.bind(function(a, b) {
    if(!this.tileTextureQueue_.isEmpty()) {
      this.tileTextureQueue_.reprioritize();
      var e = this.tileTextureQueue_.dequeue();
      this.bindTileTexture(e[0], e[3], e[4], goog.webgl.LINEAR, goog.webgl.LINEAR)
    }
  }, this);
  this.textureCacheFrameMarkerCount_ = 0;
  this.initializeGL_()
};
goog.inherits(ol.renderer.webgl.Map, ol.renderer.Map);
ol.renderer.webgl.Map.prototype.bindTileTexture = function(a, b, c, d, e) {
  var f = this.ol_renderer_webgl_Map_prototype$getGL(), g = a.ol_Tile_prototype$getKey();
  if(this.textureCache_.containsKey(g)) {
    a = this.textureCache_.get(g), f.bindTexture(goog.webgl.TEXTURE_2D, a.texture), a.magFilter != d && (f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MAG_FILTER, d), a.magFilter = d), a.minFilter != e && (f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MAG_FILTER, e), a.minFilter = e)
  }else {
    var h = f.createTexture();
    f.bindTexture(goog.webgl.TEXTURE_2D, h);
    if(0 < c) {
      var k = this.clipTileCanvas_, l = this.clipTileContext_;
      this.clipTileCanvasSize_ != b ? (k.width = b, this.clipTileCanvasSize_ = k.height = b) : l.clearRect(0, 0, b, b);
      l.drawImage(a.ol_Tile_prototype$getImage(), c, c, b, b, 0, 0, b, b);
      f.texImage2D(goog.webgl.TEXTURE_2D, 0, goog.webgl.RGBA, goog.webgl.RGBA, goog.webgl.UNSIGNED_BYTE, k)
    }else {
      f.texImage2D(goog.webgl.TEXTURE_2D, 0, goog.webgl.RGBA, goog.webgl.RGBA, goog.webgl.UNSIGNED_BYTE, a.ol_Tile_prototype$getImage())
    }
    f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MAG_FILTER, d);
    f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_MIN_FILTER, e);
    f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_S, goog.webgl.CLAMP_TO_EDGE);
    f.texParameteri(goog.webgl.TEXTURE_2D, goog.webgl.TEXTURE_WRAP_T, goog.webgl.CLAMP_TO_EDGE);
    this.textureCache_.set(g, {texture:h, magFilter:d, minFilter:e})
  }
};
ol.renderer.webgl.Map.prototype.createLayerRenderer = function(a) {
  return a instanceof ol.layer.Tile ? new ol.renderer.webgl.TileLayer(this, a) : a instanceof ol.layer.Image ? new ol.renderer.webgl.ImageLayer(this, a) : null
};
ol.renderer.webgl.Map.prototype.ol_renderer_webgl_Map_prototype$dispatchComposeEvent_ = function(a, b) {
  var c = this.ol_renderer_Map_prototype$getMap();
  if(c.hasListener(a)) {
    var d = this.getContext(), e = new ol.render.webgl.Immediate(d, b.pixelRatio), d = new ol.render.Event(a, c, e, b, null, d);
    c.dispatchEvent(d)
  }
};
ol.renderer.webgl.Map.prototype.goog_Disposable_prototype$disposeInternal = function() {
  var a = this.ol_renderer_webgl_Map_prototype$getGL();
  a.isContextLost() || this.textureCache_.forEach(function(b) {
    goog.isNull(b) || a.deleteTexture(b.texture)
  });
  goog.dispose(this.ol_renderer_webgl_Map$context_);
  ol.renderer.webgl.Map.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.renderer.webgl.Map.prototype.expireCache_ = function(a, b) {
  for(var c = this.ol_renderer_webgl_Map_prototype$getGL(), d;this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK;) {
    d = this.textureCache_.peekLast();
    if(goog.isNull(d)) {
      if(+this.textureCache_.peekLastKey() == b.index) {
        break
      }else {
        --this.textureCacheFrameMarkerCount_
      }
    }else {
      c.deleteTexture(d.texture)
    }
    this.textureCache_.ol_structs_LRUCache_prototype$pop()
  }
};
ol.renderer.webgl.Map.prototype.getContext = function() {
  return this.ol_renderer_webgl_Map$context_
};
ol.renderer.webgl.Map.prototype.ol_renderer_webgl_Map_prototype$getGL = function() {
  return this.ol_renderer_webgl_Map$gl_
};
ol.renderer.webgl.Map.prototype.getTileTextureQueue = function() {
  return this.tileTextureQueue_
};
ol.renderer.webgl.Map.prototype.ol_renderer_webgl_Map_prototype$handleWebGLContextLost = function(a) {
  a.goog_events_Event_prototype$preventDefault();
  this.textureCache_.clear();
  this.textureCacheFrameMarkerCount_ = 0;
  goog.object.forEach(this.getLayerRenderers(), function(a, c, d) {
    a.ol_renderer_webgl_Layer_prototype$handleWebGLContextLost()
  })
};
ol.renderer.webgl.Map.prototype.ol_renderer_webgl_Map_prototype$handleWebGLContextRestored = function() {
  this.initializeGL_();
  this.ol_renderer_Map_prototype$getMap().render()
};
ol.renderer.webgl.Map.prototype.initializeGL_ = function() {
  var a = this.ol_renderer_webgl_Map$gl_;
  a.activeTexture(goog.webgl.TEXTURE0);
  a.blendFuncSeparate(goog.webgl.SRC_ALPHA, goog.webgl.ONE_MINUS_SRC_ALPHA, goog.webgl.ONE, goog.webgl.ONE_MINUS_SRC_ALPHA);
  a.disable(goog.webgl.CULL_FACE);
  a.disable(goog.webgl.DEPTH_TEST);
  a.disable(goog.webgl.SCISSOR_TEST);
  a.disable(goog.webgl.STENCIL_TEST)
};
ol.renderer.webgl.Map.prototype.isTileTextureLoaded = function(a) {
  return this.textureCache_.containsKey(a.ol_Tile_prototype$getKey())
};
ol.renderer.webgl.Map.prototype.renderFrame = function(a) {
  var b = this.getContext(), c = this.ol_renderer_webgl_Map_prototype$getGL();
  if(c.isContextLost()) {
    return!1
  }
  if(goog.isNull(a)) {
    return this.ol_renderer_webgl_Map$renderedVisible_ && (goog.style.setElementShown(this.ol_renderer_webgl_Map$canvas_, !1), this.ol_renderer_webgl_Map$renderedVisible_ = !1), !1
  }
  this.ol_renderer_webgl_Map$focus_ = a.focus;
  this.textureCache_.set((-a.index).toString(), null);
  ++this.textureCacheFrameMarkerCount_;
  var d = [], e = a.layersArray, f = a.view2DState.resolution, g, h, k, l;
  g = 0;
  for(h = e.length;g < h;++g) {
    k = e[g], l = a.layerStates[goog.getUid(k)], l.visible && (l.sourceState == ol.source.State.READY && f < l.maxResolution && f >= l.minResolution) && d.push(k)
  }
  g = 0;
  for(h = d.length;g < h;++g) {
    k = d[g], e = this.getLayerRenderer(k), l = a.layerStates[goog.getUid(k)], e.prepareFrame(a, l)
  }
  g = a.size[0] * a.pixelRatio;
  h = a.size[1] * a.pixelRatio;
  if(this.ol_renderer_webgl_Map$canvas_.width != g || this.ol_renderer_webgl_Map$canvas_.height != h) {
    this.ol_renderer_webgl_Map$canvas_.width = g, this.ol_renderer_webgl_Map$canvas_.height = h
  }
  c.bindFramebuffer(goog.webgl.FRAMEBUFFER, null);
  c.clearColor(0, 0, 0, 0);
  c.clear(goog.webgl.COLOR_BUFFER_BIT);
  c.enable(goog.webgl.BLEND);
  c.viewport(0, 0, this.ol_renderer_webgl_Map$canvas_.width, this.ol_renderer_webgl_Map$canvas_.height);
  this.ol_renderer_webgl_Map_prototype$dispatchComposeEvent_(ol.render.EventType.PRECOMPOSE, a);
  g = 0;
  for(h = d.length;g < h;++g) {
    k = d[g], l = a.layerStates[goog.getUid(k)], e = this.getLayerRenderer(k), e.ol_renderer_webgl_Layer_prototype$composeFrame(a, l, b)
  }
  this.ol_renderer_webgl_Map$renderedVisible_ || (goog.style.setElementShown(this.ol_renderer_webgl_Map$canvas_, !0), this.ol_renderer_webgl_Map$renderedVisible_ = !0);
  this.calculateMatrices2D(a);
  this.textureCache_.getCount() - this.textureCacheFrameMarkerCount_ > ol.WEBGL_TEXTURE_CACHE_HIGH_WATER_MARK && a.postRenderFunctions.push(goog.bind(this.expireCache_, this));
  this.tileTextureQueue_.isEmpty() || (a.postRenderFunctions.push(this.loadNextTileTexture_), a.animate = !0);
  this.ol_renderer_webgl_Map_prototype$dispatchComposeEvent_(ol.render.EventType.POSTCOMPOSE, a);
  this.scheduleRemoveUnusedLayerRenderers(a)
};
ol.RendererHints = {};
ol.OL3_URL = "http://ol3js.org/";
ol.OL3_LOGO_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHGAAABxgEXwfpGAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAhNQTFRF////AP//AICAgP//AFVVQECA////K1VVSbbbYL/fJ05idsTYJFtbbcjbJllmZszWWMTOIFhoHlNiZszTa9DdUcHNHlNlV8XRIVdiasrUHlZjIVZjaMnVH1RlIFRkH1RkH1ZlasvYasvXVsPQH1VkacnVa8vWIVZjIFRjVMPQa8rXIVVkXsXRsNveIFVkIFZlIVVj3eDeh6GmbMvXH1ZkIFRka8rWbMvXIFVkIFVjIFVkbMvWH1VjbMvWIFVlbcvWIFVla8vVIFVkbMvWbMvVH1VkbMvWIFVlbcvWIFVkbcvVbMvWjNPbIFVkU8LPwMzNIFVkbczWIFVkbsvWbMvXIFVkRnB8bcvW2+TkW8XRIFVkIlZlJVloJlpoKlxrLl9tMmJwOWd0Omh1RXF8TneCT3iDUHiDU8LPVMLPVcLPVcPQVsPPVsPQV8PQWMTQWsTQW8TQXMXSXsXRX4SNX8bSYMfTYcfTYsfTY8jUZcfSZsnUaIqTacrVasrVa8jTa8rWbI2VbMvWbcvWdJObdcvUdszUd8vVeJaee87Yfc3WgJyjhqGnitDYjaarldPZnrK2oNbborW5o9bbo9fbpLa6q9ndrL3ArtndscDDutzfu8fJwN7gwt7gxc/QyuHhy+HizeHi0NfX0+Pj19zb1+Tj2uXk29/e3uLg3+Lh3+bl4uXj4ufl4+fl5Ofl5ufl5ujm5+jmySDnBAAAAFp0Uk5TAAECAgMEBAYHCA0NDg4UGRogIiMmKSssLzU7PkJJT1JTVFliY2hrdHZ3foSFhYeJjY2QkpugqbG1tre5w8zQ09XY3uXn6+zx8vT09vf4+Pj5+fr6/P39/f3+gz7SsAAAAVVJREFUOMtjYKA7EBDnwCPLrObS1BRiLoJLnte6CQy8FLHLCzs2QUG4FjZ5GbcmBDDjxJBXDWxCBrb8aM4zbkIDzpLYnAcE9VXlJSWlZRU13koIeW57mGx5XjoMZEUqwxWYQaQbSzLSkYGfKFSe0QMsX5WbjgY0YS4MBplemI4BdGBW+DQ11eZiymfqQuXZIjqwyadPNoSZ4L+0FVM6e+oGI6g8a9iKNT3o8kVzNkzRg5lgl7p4wyRUL9Yt2jAxVh6mQCogae6GmflI8p0r13VFWTHBQ0rWPW7ahgWVcPm+9cuLoyy4kCJDzCm6d8PSFoh0zvQNC5OjDJhQopPPJqph1doJBUD5tnkbZiUEqaCnB3bTqLTFG1bPn71kw4b+GFdpLElKIzRxxgYgWNYc5SCENVHKeUaltHdXx0dZ8uBI1hJ2UUDgq82CM2MwKeibqAvSO7MCABq0wXEPiqWEAAAAAElFTkSuQmCC";
ol.RendererHint = {CANVAS:"canvas", DOM:"dom", WEBGL:"webgl"};
ol.DEFAULT_RENDERER_HINTS = [ol.RendererHint.WEBGL, ol.RendererHint.CANVAS, ol.RendererHint.DOM];
ol.MapProperty = {LAYERGROUP:"layergroup", SIZE:"size", TARGET:"target", VIEW:"view"};
ol.Map = function(a) {
  ol.Object.call(this);
  var b = ol.Map.createOptionsInternal(a);
  this.ol_Map$pixelRatio_ = goog.isDef(a.pixelRatio) ? a.pixelRatio : ol.BrowserFeature.DEVICE_PIXEL_RATIO;
  this.ol3Logo_ = b.ol3Logo;
  this.animationDelay_ = new goog.async.AnimationDelay(this.renderFrame_, void 0, this);
  this.registerDisposable(this.animationDelay_);
  this.coordinateToPixelMatrix_ = goog.vec.Mat4.createNumber();
  this.pixelToCoordinateMatrix_ = goog.vec.Mat4.createNumber();
  this.frameIndex_ = 0;
  this.ol_Map$frameState_ = null;
  this.freezeRenderingCount_ = 0;
  this.dirty_ = !1;
  this.layerGroupPropertyListenerKeys_ = this.viewPropertyListenerKey_ = null;
  this.viewport_ = goog.dom.createDom(goog.dom.TagName.DIV, "ol-viewport");
  this.viewport_.style.position = "relative";
  this.viewport_.style.overflow = "hidden";
  this.viewport_.style.width = "100%";
  this.viewport_.style.height = "100%";
  this.viewport_.style.msTouchAction = "none";
  ol.BrowserFeature.HAS_TOUCH && (this.viewport_.className = "ol-touch");
  this.overlayContainer_ = goog.dom.createDom(goog.dom.TagName.DIV, "ol-overlaycontainer");
  goog.dom.appendChild(this.viewport_, this.overlayContainer_);
  this.overlayContainerStopEvent_ = goog.dom.createDom(goog.dom.TagName.DIV, "ol-overlaycontainer-stopevent");
  goog.events.listen(this.overlayContainerStopEvent_, [goog.events.EventType.CLICK, goog.events.EventType.DBLCLICK, goog.events.EventType.MOUSEDOWN, goog.events.EventType.TOUCHSTART, goog.events.EventType.MSPOINTERDOWN], goog.events.Event.function__new_goog_events_Event__string___Object_null_____undefined$stopPropagation);
  goog.dom.appendChild(this.viewport_, this.overlayContainerStopEvent_);
  a = new ol.MapBrowserEventHandler(this);
  goog.events.listen(a, goog.object.getValues(ol.MapBrowserEvent.EventType), this.ol_Map_prototype$handleMapBrowserEvent, !1, this);
  this.registerDisposable(a);
  this.keyHandler_ = new goog.events.KeyHandler;
  goog.events.listen(this.keyHandler_, goog.events.KeyHandler.EventType.KEY, this.handleBrowserEvent, !1, this);
  this.registerDisposable(this.keyHandler_);
  a = new goog.events.MouseWheelHandler(this.viewport_);
  goog.events.listen(a, goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.handleBrowserEvent, !1, this);
  this.registerDisposable(a);
  this.controls_ = b.controls;
  this.interactions_ = b.interactions;
  this.overlays_ = b.overlays;
  this.renderer_ = new b.rendererConstructor(this.viewport_, this);
  this.registerDisposable(this.renderer_);
  this.viewportSizeMonitor_ = new goog.dom.ViewportSizeMonitor;
  goog.events.listen(this.viewportSizeMonitor_, goog.events.EventType.RESIZE, this.updateSize, !1, this);
  this.ol_Map$focus_ = null;
  this.preRenderFunctions_ = [];
  this.postRenderFunctions_ = [];
  this.tileQueue_ = new ol.TileQueue(goog.bind(this.getTilePriority, this), goog.bind(this.handleTileChange_, this));
  goog.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.LAYERGROUP), this.handleLayerGroupChanged_, !1, this);
  goog.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.VIEW), this.handleViewChanged_, !1, this);
  goog.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.SIZE), this.handleSizeChanged_, !1, this);
  goog.events.listen(this, ol.Object.getChangeEventType(ol.MapProperty.TARGET), this.handleTargetChanged_, !1, this);
  this.ol_Object_prototype$setValues(b.values);
  this.controls_.forEach(function(a) {
    a.setMap(this)
  }, this);
  this.interactions_.forEach(function(a) {
    a.setMap(this)
  }, this);
  this.overlays_.forEach(function(a) {
    a.setMap(this)
  }, this)
};
goog.inherits(ol.Map, ol.Object);
ol.Map.prototype.addControl = function(a) {
  this.getControls().push(a);
  a.setMap(this)
};
ol.Map.prototype.addInteraction = function(a) {
  this.getInteractions().push(a);
  a.setMap(this)
};
ol.Map.prototype.addLayer = function(a) {
  this.getLayerGroup().ol_layer_Group_prototype$getLayers().push(a)
};
ol.Map.prototype.addOverlay = function(a) {
  this.getOverlays().push(a);
  a.setMap(this)
};
ol.Map.prototype.beforeRender = function(a) {
  this.requestRenderFrame();
  Array.prototype.push.apply(this.preRenderFunctions_, arguments)
};
ol.Map.prototype.removePreRenderFunction = function(a) {
  return goog.array.remove(this.preRenderFunctions_, a)
};
ol.Map.prototype.goog_Disposable_prototype$disposeInternal = function() {
  goog.dom.removeNode(this.viewport_);
  ol.Map.superClass_.goog_Disposable_prototype$disposeInternal.call(this)
};
ol.Map.prototype.ol_Map_prototype$forEachFeatureAtPixel = function(a, b, c, d, e) {
  if(!goog.isNull(this.ol_Map$frameState_)) {
    return a = this.getCoordinateFromPixel(a), c = goog.isDef(c) ? c : null, d = goog.isDef(d) ? d : goog.functions.TRUE, e = goog.isDef(e) ? e : null, this.renderer_.ol_renderer_Map_prototype$forEachFeatureAtPixel(a, this.ol_Map$frameState_, b, c, d, e)
  }
};
ol.Map.prototype.freezeRendering = function() {
  ++this.freezeRenderingCount_
};
ol.Map.prototype.getEventCoordinate = function(a) {
  return this.getCoordinateFromPixel(this.getEventPixel(a))
};
ol.Map.prototype.getEventPixel = function(a) {
  if(goog.isDef(a.changedTouches)) {
    a = a.changedTouches.item(0);
    var b = goog.style.getClientPosition(this.viewport_);
    return[a.clientX - b.x, a.clientY - b.y]
  }
  a = goog.style.getRelativePosition(a, this.viewport_);
  return[a.x, a.y]
};
ol.Map.prototype.ol_Map_prototype$getTarget = function() {
  return this.get(ol.MapProperty.TARGET)
};
goog.exportProperty(ol.Map.prototype, "getTarget", ol.Map.prototype.ol_Map_prototype$getTarget);
ol.Map.prototype.getCoordinateFromPixel = function(a) {
  var b = this.ol_Map$frameState_;
  if(goog.isNull(b)) {
    return null
  }
  a = a.slice();
  return ol.vec.Mat4.multVec2(b.pixelToCoordinateMatrix, a, a)
};
ol.Map.prototype.getControls = function() {
  return this.controls_
};
ol.Map.prototype.getOverlays = function() {
  return this.overlays_
};
ol.Map.prototype.getInteractions = function() {
  return this.interactions_
};
ol.Map.prototype.getLayerGroup = function() {
  return this.get(ol.MapProperty.LAYERGROUP)
};
goog.exportProperty(ol.Map.prototype, "getLayerGroup", ol.Map.prototype.getLayerGroup);
ol.Map.prototype.ol_Map_prototype$getLayers = function() {
  var a = this.getLayerGroup();
  if(goog.isDef(a)) {
    return a.ol_layer_Group_prototype$getLayers()
  }
};
ol.Map.prototype.getPixelFromCoordinate = function(a) {
  var b = this.ol_Map$frameState_;
  if(goog.isNull(b)) {
    return null
  }
  a = a.slice(0, 2);
  return ol.vec.Mat4.multVec2(b.coordinateToPixelMatrix, a, a)
};
ol.Map.prototype.getSize = function() {
  return this.get(ol.MapProperty.SIZE)
};
goog.exportProperty(ol.Map.prototype, "getSize", ol.Map.prototype.getSize);
ol.Map.prototype.getView = function() {
  return this.get(ol.MapProperty.VIEW)
};
goog.exportProperty(ol.Map.prototype, "getView", ol.Map.prototype.getView);
ol.Map.prototype.getViewport = function() {
  return this.viewport_
};
ol.Map.prototype.getOverlayContainer = function() {
  return this.overlayContainer_
};
ol.Map.prototype.getOverlayContainerStopEvent = function() {
  return this.overlayContainerStopEvent_
};
ol.Map.prototype.getTilePriority = function(a, b, c, d) {
  var e = this.ol_Map$frameState_;
  if(goog.isNull(e) || !(b in e.wantedTiles) || !e.wantedTiles[b][a.tileCoord.toString()]) {
    return ol.structs.PriorityQueue.function__new_ol_structs_PriorityQueue__function__T___number__function__T___string___undefined$DROP
  }
  a = c[0] - e.focus[0];
  c = c[1] - e.focus[1];
  return 65536 * Math.log(d) + Math.sqrt(a * a + c * c) / d
};
ol.Map.prototype.handleBrowserEvent = function(a, b) {
  var c = new ol.MapBrowserEvent(b || a.type, this, a);
  this.ol_Map_prototype$handleMapBrowserEvent(c)
};
ol.Map.prototype.ol_Map_prototype$handleMapBrowserEvent = function(a) {
  if(!goog.isNull(this.ol_Map$frameState_)) {
    this.ol_Map$focus_ = a.ol_MapBrowserEvent_prototype$getCoordinate();
    a.frameState = this.ol_Map$frameState_;
    var b = this.getInteractions().ol_Collection_prototype$getArray(), c;
    if(!1 !== this.dispatchEvent(a)) {
      for(c = b.length - 1;0 <= c && b[c].ol_interaction_Interaction_prototype$handleMapBrowserEvent(a);c--) {
      }
    }
  }
};
ol.Map.prototype.handlePostRender = function() {
  var a = this.ol_Map$frameState_, b = this.tileQueue_;
  if(!b.isEmpty()) {
    var c = 16, d = c, e = 0;
    if(!goog.isNull(a)) {
      e = a.viewHints;
      if(e[ol.ViewHint.ANIMATING] || e[ol.ViewHint.INTERACTING]) {
        c = 8, d = 2
      }
      e = goog.object.getCount(a.wantedTiles)
    }
    c *= e;
    d *= e;
    b.getTilesLoading() < c && (b.reprioritize(), b.loadMoreTiles(c, d))
  }
  b = this.postRenderFunctions_;
  c = 0;
  for(d = b.length;c < d;++c) {
    b[c](this, a)
  }
  b.length = 0
};
ol.Map.prototype.handleSizeChanged_ = function() {
  this.render()
};
ol.Map.prototype.handleTargetChanged_ = function() {
  var a = this.ol_Map_prototype$getTarget(), a = goog.isDef(a) ? goog.dom.getElement(a) : null;
  this.keyHandler_.goog_events_KeyHandler_prototype$detach();
  goog.isNull(a) ? goog.dom.removeNode(this.viewport_) : (goog.dom.appendChild(a, this.viewport_), this.keyHandler_.attach(a));
  this.updateSize()
};
ol.Map.prototype.handleTileChange_ = function() {
  this.requestRenderFrame()
};
ol.Map.prototype.handleViewPropertyChanged_ = function() {
  this.render()
};
ol.Map.prototype.handleViewChanged_ = function() {
  goog.isNull(this.viewPropertyListenerKey_) || (goog.events.unlistenByKey(this.viewPropertyListenerKey_), this.viewPropertyListenerKey_ = null);
  var a = this.getView();
  goog.isDefAndNotNull(a) && (this.viewPropertyListenerKey_ = goog.events.listen(a, ol.ObjectEventType.PROPERTYCHANGE, this.handleViewPropertyChanged_, !1, this));
  this.render()
};
ol.Map.prototype.handleLayerGroupMemberChanged_ = function(a) {
  this.render()
};
ol.Map.prototype.handleLayerGroupPropertyChanged_ = function(a) {
  this.render()
};
ol.Map.prototype.handleLayerGroupChanged_ = function() {
  if(!goog.isNull(this.layerGroupPropertyListenerKeys_)) {
    for(var a = this.layerGroupPropertyListenerKeys_.length, b = 0;b < a;++b) {
      goog.events.unlistenByKey(this.layerGroupPropertyListenerKeys_[b])
    }
    this.layerGroupPropertyListenerKeys_ = null
  }
  a = this.getLayerGroup();
  goog.isDefAndNotNull(a) && (this.layerGroupPropertyListenerKeys_ = [goog.events.listen(a, ol.ObjectEventType.PROPERTYCHANGE, this.handleLayerGroupPropertyChanged_, !1, this), goog.events.listen(a, goog.events.EventType.CHANGE, this.handleLayerGroupMemberChanged_, !1, this)]);
  this.render()
};
ol.Map.prototype.isDef = function() {
  var a = this.getView();
  return goog.isDef(a) && a.isDef() && goog.isDefAndNotNull(this.getSize())
};
ol.Map.prototype.render = function() {
  this.animationDelay_.isActive() || (0 === this.freezeRenderingCount_ ? this.animationDelay_.fire() : this.dirty_ = !0)
};
ol.Map.prototype.requestRenderFrame = function() {
  0 === this.freezeRenderingCount_ ? this.animationDelay_.isActive() || this.animationDelay_.start() : this.dirty_ = !0
};
ol.Map.prototype.removeControl = function(a) {
  var b = this.getControls();
  if(goog.isDef(b.remove(a))) {
    return a.setMap(null), a
  }
};
ol.Map.prototype.removeInteraction = function(a) {
  var b, c = this.getInteractions();
  goog.isDef(c.remove(a)) && (a.setMap(null), b = a);
  return b
};
ol.Map.prototype.removeLayer = function(a) {
  return this.getLayerGroup().ol_layer_Group_prototype$getLayers().remove(a)
};
ol.Map.prototype.removeOverlay = function(a) {
  var b = this.getOverlays();
  if(goog.isDef(b.remove(a))) {
    return a.setMap(null), a
  }
};
ol.Map.prototype.renderFrame_ = function(a) {
  var b, c, d;
  if(0 === this.freezeRenderingCount_) {
    var e = this.getSize();
    b = this.getView();
    var f = goog.isDef(b) ? this.getView().getView2D() : void 0, g = null;
    if(goog.isDef(e) && 0 < e[0] && 0 < e[1] && goog.isDef(f) && f.isDef()) {
      g = b.getHints();
      b = this.getLayerGroup().getLayerStatesArray();
      var h = b.layers;
      d = b.layerStates;
      var k = {}, l;
      b = 0;
      for(c = h.length;b < c;++b) {
        l = h[b], k[goog.getUid(l)] = d[b]
      }
      d = f.getView2DState();
      g = {animate:!1, attributions:{}, coordinateToPixelMatrix:this.coordinateToPixelMatrix_, extent:null, focus:goog.isNull(this.ol_Map$focus_) ? d.center : this.ol_Map$focus_, index:this.frameIndex_++, layersArray:h, layerStates:k, logos:{}, pixelRatio:this.ol_Map$pixelRatio_, pixelToCoordinateMatrix:this.pixelToCoordinateMatrix_, postRenderFunctions:[], size:e, tileQueue:this.tileQueue_, time:a, usedTiles:{}, view2DState:d, viewHints:g, wantedTiles:{}};
      this.ol3Logo_ && (g.logos[ol.OL3_LOGO_URL] = ol.OL3_URL)
    }
    a = this.preRenderFunctions_;
    b = e = 0;
    for(c = a.length;b < c;++b) {
      f = a[b], f(this, g) && (a[e++] = f)
    }
    a.length = e;
    goog.isNull(g) || (g.extent = ol.extent.getForView2DAndSize(d.center, d.resolution, d.rotation, g.size));
    this.ol_Map$frameState_ = g;
    this.renderer_.renderFrame(g);
    this.dirty_ = !1;
    goog.isNull(g) || (g.animate && this.requestRenderFrame(), Array.prototype.push.apply(this.postRenderFunctions_, g.postRenderFunctions), 0 != this.preRenderFunctions_.length || (g.animate || g.viewHints[ol.ViewHint.ANIMATING] || g.viewHints[ol.ViewHint.INTERACTING]) || this.dispatchEvent(new ol.MapEvent(ol.MapEventType.MOVEEND, this)));
    this.dispatchEvent(new ol.MapEvent(ol.MapEventType.POSTRENDER, this, g));
    goog.async.nextTick(this.handlePostRender, this)
  }
};
ol.Map.prototype.setLayerGroup = function(a) {
  this.set(ol.MapProperty.LAYERGROUP, a)
};
goog.exportProperty(ol.Map.prototype, "setLayerGroup", ol.Map.prototype.setLayerGroup);
ol.Map.prototype.setSize = function(a) {
  this.set(ol.MapProperty.SIZE, a)
};
goog.exportProperty(ol.Map.prototype, "setSize", ol.Map.prototype.setSize);
ol.Map.prototype.setTarget = function(a) {
  this.set(ol.MapProperty.TARGET, a)
};
goog.exportProperty(ol.Map.prototype, "setTarget", ol.Map.prototype.setTarget);
ol.Map.prototype.setView = function(a) {
  this.set(ol.MapProperty.VIEW, a)
};
goog.exportProperty(ol.Map.prototype, "setView", ol.Map.prototype.setView);
ol.Map.prototype.unfreezeRendering = function() {
  0 === --this.freezeRenderingCount_ && this.dirty_ && this.animationDelay_.fire()
};
ol.Map.prototype.updateSize = function() {
  var a = this.ol_Map_prototype$getTarget(), a = goog.isDef(a) ? goog.dom.getElement(a) : null;
  goog.isNull(a) ? this.setSize(void 0) : (a = goog.style.getContentBoxSize(a), this.setSize([a.width, a.height]))
};
ol.Map.prototype.withFrozenRendering = function(a, b) {
  this.freezeRendering();
  try {
    a.call(b)
  }finally {
    this.unfreezeRendering()
  }
};
ol.Map.createOptionsInternal = function(a) {
  var b = {}, c = goog.isDef(a.ol3Logo) ? a.ol3Logo : !0, d = a.layers instanceof ol.layer.Group ? a.layers : new ol.layer.Group({layers:a.layers});
  b[ol.MapProperty.LAYERGROUP] = d;
  b[ol.MapProperty.TARGET] = a.target;
  b[ol.MapProperty.VIEW] = goog.isDef(a.view) ? a.view : new ol.View2D;
  var d = ol.renderer.Map, e;
  e = goog.isDef(a.renderers) ? a.renderers : goog.isDef(a.renderer) ? [a.renderer] : ol.DEFAULT_RENDERER_HINTS;
  var f = e.length, g, h;
  for(g = 0;g < f;++g) {
    if(h = e[g], h == ol.RendererHint.CANVAS) {
      if(ol.BrowserFeature.HAS_CANVAS) {
        d = ol.renderer.canvas.Map;
        break
      }
    }else {
      if(h == ol.RendererHint.DOM) {
        if(ol.BrowserFeature.HAS_DOM) {
          d = ol.renderer.dom.Map;
          break
        }
      }else {
        if(h == ol.RendererHint.WEBGL && ol.BrowserFeature.HAS_WEBGL) {
          d = ol.renderer.webgl.Map;
          break
        }
      }
    }
  }
  e = goog.isDef(a.controls) ? goog.isArray(a.controls) ? new ol.Collection(goog.array.clone(a.controls)) : a.controls : ol.control.defaults();
  f = goog.isDef(a.interactions) ? goog.isArray(a.interactions) ? new ol.Collection(goog.array.clone(a.interactions)) : a.interactions : ol.interaction.defaults();
  a = goog.isDef(a.overlays) ? goog.isArray(a.overlays) ? new ol.Collection(goog.array.clone(a.overlays)) : a.overlays : new ol.Collection;
  return{controls:e, interactions:f, ol3Logo:c, overlays:a, rendererConstructor:d, values:b}
};
ol.RendererHints.createFromQueryData = function(a) {
  var b = goog.global.location.search.substring(1);
  a = goog.isDef(a) ? a : new goog.Uri.QueryData(b);
  return a.containsKey("renderers") ? a.get("renderers").split(",") : a.containsKey("renderer") ? [a.get("renderer")] : ol.DEFAULT_RENDERER_HINTS
};
ol.proj.common.add();
goog.DEBUG && function() {
}();
ol.control.MousePositionProperty = {PROJECTION:"projection", COORDINATE_FORMAT:"coordinateFormat"};
ol.control.MousePosition = function(a) {
  a = goog.isDef(a) ? a : {};
  var b = goog.isDef(a.className) ? a.className : "ol-mouse-position", b = goog.dom.createDom(goog.dom.TagName.DIV, {"class":b});
  ol.control.Control.call(this, {element:b, target:a.target});
  goog.events.listen(this, ol.Object.getChangeEventType(ol.control.MousePositionProperty.PROJECTION), this.handleProjectionChanged_, !1, this);
  goog.isDef(a.coordinateFormat) && this.setCoordinateFormat(a.coordinateFormat);
  goog.isDef(a.projection) && this.ol_control_MousePosition_prototype$setProjection(ol.proj.get(a.projection));
  this.undefinedHTML_ = goog.isDef(a.undefinedHTML) ? a.undefinedHTML : "";
  this.renderedHTML_ = b.innerHTML;
  this.lastMouseMovePixel_ = this.ol_control_MousePosition$transform_ = this.mapProjection_ = null
};
goog.inherits(ol.control.MousePosition, ol.control.Control);
ol.control.MousePosition.prototype.handleMapPostrender = function(a) {
  a = a.frameState;
  goog.isNull(a) ? this.mapProjection_ = null : this.mapProjection_ != a.view2DState.projection && (this.mapProjection_ = a.view2DState.projection, this.ol_control_MousePosition$transform_ = null);
  this.updateHTML_(this.lastMouseMovePixel_)
};
ol.control.MousePosition.prototype.handleProjectionChanged_ = function() {
  this.ol_control_MousePosition$transform_ = null
};
ol.control.MousePosition.prototype.getCoordinateFormat = function() {
  return this.get(ol.control.MousePositionProperty.COORDINATE_FORMAT)
};
goog.exportProperty(ol.control.MousePosition.prototype, "getCoordinateFormat", ol.control.MousePosition.prototype.getCoordinateFormat);
ol.control.MousePosition.prototype.ol_control_MousePosition_prototype$getProjection = function() {
  return this.get(ol.control.MousePositionProperty.PROJECTION)
};
goog.exportProperty(ol.control.MousePosition.prototype, "getProjection", ol.control.MousePosition.prototype.ol_control_MousePosition_prototype$getProjection);
ol.control.MousePosition.prototype.handleMouseMove = function(a) {
  var b = this.ol_control_Control_prototype$getMap();
  a = goog.style.getRelativePosition(a, b.getViewport());
  this.lastMouseMovePixel_ = [a.x, a.y];
  this.updateHTML_(this.lastMouseMovePixel_)
};
ol.control.MousePosition.prototype.handleMouseOut = function(a) {
  this.updateHTML_(null);
  this.lastMouseMovePixel_ = null
};
ol.control.MousePosition.prototype.setMap = function(a) {
  ol.control.MousePosition.superClass_.setMap.call(this, a);
  goog.isNull(a) || (a = a.getViewport(), this.listenerKeys.push(goog.events.listen(a, goog.events.EventType.MOUSEMOVE, this.handleMouseMove, !1, this), goog.events.listen(a, goog.events.EventType.MOUSEOUT, this.handleMouseOut, !1, this)))
};
ol.control.MousePosition.prototype.setCoordinateFormat = function(a) {
  this.set(ol.control.MousePositionProperty.COORDINATE_FORMAT, a)
};
goog.exportProperty(ol.control.MousePosition.prototype, "setCoordinateFormat", ol.control.MousePosition.prototype.setCoordinateFormat);
ol.control.MousePosition.prototype.ol_control_MousePosition_prototype$setProjection = function(a) {
  this.set(ol.control.MousePositionProperty.PROJECTION, a)
};
goog.exportProperty(ol.control.MousePosition.prototype, "setProjection", ol.control.MousePosition.prototype.ol_control_MousePosition_prototype$setProjection);
ol.control.MousePosition.prototype.updateHTML_ = function(a) {
  var b = this.undefinedHTML_;
  if(!goog.isNull(a) && !goog.isNull(this.mapProjection_)) {
    if(goog.isNull(this.ol_control_MousePosition$transform_)) {
      var c = this.ol_control_MousePosition_prototype$getProjection();
      goog.isDef(c) ? this.ol_control_MousePosition$transform_ = ol.proj.getTransformFromProjections(this.mapProjection_, c) : this.ol_control_MousePosition$transform_ = ol.proj.identityTransform
    }
    a = this.ol_control_Control_prototype$getMap().getCoordinateFromPixel(a);
    goog.isNull(a) || (this.ol_control_MousePosition$transform_(a, a), b = this.getCoordinateFormat(), b = goog.isDef(b) ? b(a) : a.toString())
  }
  goog.isDef(this.renderedHTML_) && b == this.renderedHTML_ || (this.renderedHTML_ = this.element.innerHTML = b)
};
ol.source.wms = {};
ol.source.wms.DEFAULT_VERSION = "1.3.0";
ol.source.wms.ServerType = {GEOSERVER:"geoserver", MAPSERVER:"mapserver", QGIS:"qgis"};
ol.source.ImageWMS = function(a) {
  a = goog.isDef(a) ? a : {};
  ol.source.Image.call(this, {attributions:a.attributions, extent:a.extent, logo:a.logo, projection:a.projection, resolutions:a.resolutions});
  this.crossOrigin_ = goog.isDef(a.crossOrigin) ? a.crossOrigin : null;
  this.url_ = a.url;
  this.ol_source_ImageWMS$params_ = a.params;
  this.ol_source_ImageWMS$v13_ = !0;
  this.ol_source_ImageWMS_prototype$updateV13_();
  this.ol_source_ImageWMS$serverType_ = a.serverType;
  this.ol_source_ImageWMS$hidpi_ = goog.isDef(a.hidpi) ? a.hidpi : !0;
  this.ol_source_ImageWMS$image_ = null;
  this.imageSize_ = [0, 0];
  this.renderedProjection_ = null;
  this.ol_source_ImageWMS$renderedResolution_ = NaN;
  this.ol_source_ImageWMS$renderedRevision_ = 0;
  this.ratio_ = goog.isDef(a.ratio) ? a.ratio : 1.5
};
goog.inherits(ol.source.ImageWMS, ol.source.Image);
ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$getGetFeatureInfoUrl = function(a, b, c, d) {
  if(goog.isDef(this.url_) && !goog.isNull(this.ol_source_ImageWMS$image_) && b == this.ol_source_ImageWMS$renderedResolution_ && ol.proj.equivalent(c, this.renderedProjection_)) {
    var e = this.ol_source_ImageWMS$image_.ol_ImageBase_prototype$getExtent(), f = this.ol_source_ImageWMS$image_.getPixelRatio(), g = {SERVICE:"WMS", VERSION:ol.source.wms.DEFAULT_VERSION, REQUEST:"GetFeatureInfo", FORMAT:"image/png", TRANSPARENT:!0, QUERY_LAYERS:goog.object.get(this.ol_source_ImageWMS$params_, "LAYERS")};
    goog.object.extend(g, this.ol_source_ImageWMS$params_, d);
    b /= f;
    d = Math.floor((e[3] - a[1]) / b);
    goog.object.set(g, this.ol_source_ImageWMS$v13_ ? "I" : "X", Math.floor((a[0] - e[0]) / b));
    goog.object.set(g, this.ol_source_ImageWMS$v13_ ? "J" : "Y", d);
    return this.ol_source_ImageWMS_prototype$getRequestUrl_(e, this.imageSize_, f, c, g)
  }
};
ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$getParams = function() {
  return this.ol_source_ImageWMS$params_
};
ol.source.ImageWMS.prototype.ol_source_Image_prototype$getImage = function(a, b, c, d) {
  if(!goog.isDef(this.url_)) {
    return null
  }
  b = this.findNearestResolution(b);
  1 == c || this.ol_source_ImageWMS$hidpi_ && goog.isDef(this.ol_source_ImageWMS$serverType_) || (c = 1);
  var e = this.ol_source_ImageWMS$image_;
  if(!goog.isNull(e) && this.ol_source_ImageWMS$renderedRevision_ == this.getRevision() && e.ol_ImageBase_prototype$getResolution() == b && e.getPixelRatio() == c && ol.extent.containsExtent(e.ol_ImageBase_prototype$getExtent(), a)) {
    return e
  }
  e = {SERVICE:"WMS", VERSION:ol.source.wms.DEFAULT_VERSION, REQUEST:"GetMap", FORMAT:"image/png", TRANSPARENT:!0};
  goog.object.extend(e, this.ol_source_ImageWMS$params_);
  a = a.slice();
  var f = (a[0] + a[2]) / 2, g = (a[1] + a[3]) / 2;
  if(1 != this.ratio_) {
    var h = this.ratio_ * (a[2] - a[0]) / 2, k = this.ratio_ * (a[3] - a[1]) / 2;
    a[0] = f - h;
    a[1] = g - k;
    a[2] = f + h;
    a[3] = g + k
  }
  var h = b / c, k = Math.ceil((a[2] - a[0]) / h), l = Math.ceil((a[3] - a[1]) / h);
  a[0] = f - h * k / 2;
  a[2] = f + h * k / 2;
  a[1] = g - h * l / 2;
  a[3] = g + h * l / 2;
  this.imageSize_[0] = k;
  this.imageSize_[1] = l;
  e = this.ol_source_ImageWMS_prototype$getRequestUrl_(a, this.imageSize_, c, d, e);
  this.ol_source_ImageWMS$image_ = new ol.Image(a, b, c, this.ol_source_Source_prototype$getAttributions(), e, this.crossOrigin_);
  this.renderedProjection_ = d;
  this.ol_source_ImageWMS$renderedResolution_ = b;
  this.ol_source_ImageWMS$renderedRevision_ = this.getRevision();
  return this.ol_source_ImageWMS$image_
};
ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$getRequestUrl_ = function(a, b, c, d, e) {
  e[this.ol_source_ImageWMS$v13_ ? "CRS" : "SRS"] = d.getCode();
  "STYLES" in this.ol_source_ImageWMS$params_ || goog.object.set(e, "STYLES", new String(""));
  if(1 != c) {
    switch(this.ol_source_ImageWMS$serverType_) {
      case ol.source.wms.ServerType.GEOSERVER:
        goog.object.set(e, "FORMAT_OPTIONS", "dpi:" + (90 * c + 0.5 | 0));
        break;
      case ol.source.wms.ServerType.MAPSERVER:
        goog.object.set(e, "MAP_RESOLUTION", 90 * c);
        break;
      case ol.source.wms.ServerType.QGIS:
        goog.object.set(e, "DPI", 90 * c)
    }
  }
  goog.object.set(e, "WIDTH", b[0]);
  goog.object.set(e, "HEIGHT", b[1]);
  b = d.getAxisOrientation();
  a = this.ol_source_ImageWMS$v13_ && "ne" == b.substr(0, 2) ? [a[1], a[0], a[3], a[2]] : a;
  goog.object.set(e, "BBOX", a.join(","));
  return goog.uri.utils.appendParamsFromMap(this.url_, e)
};
ol.source.ImageWMS.prototype.setUrl = function(a) {
  a != this.url_ && (this.url_ = a, this.ol_source_ImageWMS$image_ = null, this.ol_Observable_prototype$dispatchChangeEvent())
};
ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$updateParams = function(a) {
  goog.object.extend(this.ol_source_ImageWMS$params_, a);
  this.ol_source_ImageWMS_prototype$updateV13_();
  this.ol_source_ImageWMS$image_ = null;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$updateV13_ = function() {
  var a = goog.object.get(this.ol_source_ImageWMS$params_, "VERSION", ol.source.wms.DEFAULT_VERSION);
  this.ol_source_ImageWMS$v13_ = 0 <= goog.string.compareVersions(a, "1.3")
};
ol.TileUrlFunction = {};
ol.TileUrlFunction.createFromTemplate = function(a) {
  return function(b, c, d) {
    return goog.isNull(b) ? void 0 : a.replace("{z}", b.ol_TileCoord$z.toString()).replace("{x}", b.x.toString()).replace("{y}", b.y.toString())
  }
};
ol.TileUrlFunction.createFromTemplates = function(a) {
  return ol.TileUrlFunction.createFromTileUrlFunctions(goog.array.map(a, ol.TileUrlFunction.createFromTemplate))
};
ol.TileUrlFunction.createFromTileUrlFunctions = function(a) {
  return 1 === a.length ? a[0] : function(b, c, d) {
    if(!goog.isNull(b)) {
      var e = goog.math.modulo(b.ol_TileCoord_prototype$hash(), a.length);
      return a[e].call(this, b, c, d)
    }
  }
};
ol.TileUrlFunction.nullTileUrlFunction = function(a, b, c) {
};
ol.TileUrlFunction.withTileCoordTransform = function(a, b) {
  var c = new ol.TileCoord(0, 0, 0);
  return function(d, e, f) {
    return goog.isNull(d) ? void 0 : b.call(this, a.call(this, d, f, c), e, f)
  }
};
ol.TileUrlFunction.expandUrl = function(a) {
  var b = [], c = /\{(\d)-(\d)\}/.exec(a) || /\{([a-z])-([a-z])\}/.exec(a);
  if(c) {
    for(var d = c[1].charCodeAt(0), e = c[2].charCodeAt(0);d <= e;++d) {
      b.push(a.replace(c[0], String.fromCharCode(d)))
    }
  }else {
    b.push(a)
  }
  return b
};
ol.ImageTile = function(a, b, c, d, e) {
  ol.Tile.call(this, a, b);
  this.ol_ImageTile$src_ = c;
  this.ol_ImageTile$image_ = new Image;
  goog.isNull(d) || (this.ol_ImageTile$image_.crossOrigin = d);
  this.ol_ImageTile$imageByContext_ = {};
  this.ol_ImageTile$imageListenerKeys_ = null;
  this.tileLoadFunction_ = e
};
goog.inherits(ol.ImageTile, ol.Tile);
ol.ImageTile.prototype.ol_Tile_prototype$getImage = function(a) {
  if(goog.isDef(a)) {
    var b = goog.getUid(a);
    if(b in this.ol_ImageTile$imageByContext_) {
      return this.ol_ImageTile$imageByContext_[b]
    }
    a = goog.object.isEmpty(this.ol_ImageTile$imageByContext_) ? this.ol_ImageTile$image_ : this.ol_ImageTile$image_.cloneNode(!1);
    return this.ol_ImageTile$imageByContext_[b] = a
  }
  return this.ol_ImageTile$image_
};
ol.ImageTile.prototype.ol_Tile_prototype$getKey = function() {
  return this.ol_ImageTile$src_
};
ol.ImageTile.prototype.ol_ImageTile_prototype$handleImageError_ = function() {
  this.state = ol.TileState.ERROR;
  this.ol_ImageTile_prototype$unlistenImage_();
  this.ol_Tile_prototype$dispatchChangeEvent()
};
ol.ImageTile.prototype.ol_ImageTile_prototype$handleImageLoad_ = function() {
  this.state = this.ol_ImageTile$image_.naturalWidth && this.ol_ImageTile$image_.naturalHeight ? ol.TileState.LOADED : ol.TileState.EMPTY;
  this.ol_ImageTile_prototype$unlistenImage_();
  this.ol_Tile_prototype$dispatchChangeEvent()
};
ol.ImageTile.prototype.ol_Tile_prototype$load = function() {
  this.state == ol.TileState.IDLE && (this.state = ol.TileState.LOADING, this.ol_ImageTile$imageListenerKeys_ = [goog.events.listenOnce(this.ol_ImageTile$image_, goog.events.EventType.ERROR, this.ol_ImageTile_prototype$handleImageError_, !1, this), goog.events.listenOnce(this.ol_ImageTile$image_, goog.events.EventType.LOAD, this.ol_ImageTile_prototype$handleImageLoad_, !1, this)], this.tileLoadFunction_(this, this.ol_ImageTile$src_))
};
ol.ImageTile.prototype.ol_ImageTile_prototype$unlistenImage_ = function() {
  goog.array.forEach(this.ol_ImageTile$imageListenerKeys_, goog.events.unlistenByKey);
  this.ol_ImageTile$imageListenerKeys_ = null
};
ol.DEFAULT_TILE_CACHE_HIGH_WATER_MARK = 2048;
ol.TileCache = function(a) {
  ol.structs.LRUCache.call(this);
  this.highWaterMark_ = goog.isDef(a) ? a : ol.DEFAULT_TILE_CACHE_HIGH_WATER_MARK
};
goog.inherits(ol.TileCache, ol.structs.LRUCache);
ol.TileCache.prototype.ol_TileCache_prototype$canExpireCache = function() {
  return this.getCount() > this.highWaterMark_
};
ol.TileCache.prototype.ol_TileCache_prototype$expireCache = function(a) {
  for(var b, c;this.ol_TileCache_prototype$canExpireCache() && !(b = this.peekLast(), c = b.tileCoord.ol_TileCoord$z.toString(), c in a && a[c].contains(b.tileCoord));) {
    this.ol_structs_LRUCache_prototype$pop()
  }
};
ol.TileCache.prototype.pruneTileRange = function(a) {
  for(var b = this.getCount(), c;b--;) {
    c = this.peekLastKey(), a.contains(ol.TileCoord.createFromString(c)) ? this.ol_structs_LRUCache_prototype$pop() : this.get(c)
  }
};
ol.source.TileImage = function(a) {
  ol.source.Tile.call(this, {attributions:a.attributions, extent:a.extent, logo:a.logo, opaque:a.opaque, projection:a.projection, tileGrid:a.tileGrid});
  this.tileUrlFunction = goog.isDef(a.tileUrlFunction) ? a.tileUrlFunction : ol.TileUrlFunction.nullTileUrlFunction;
  this.crossOrigin = goog.isDef(a.crossOrigin) ? a.crossOrigin : null;
  this.tileCache = new ol.TileCache;
  this.tileLoadFunction = goog.isDef(a.tileLoadFunction) ? a.tileLoadFunction : ol.source.TileImage.defaultTileLoadFunction;
  this.tileClass = goog.isDef(a.tileClass) ? a.tileClass : ol.ImageTile
};
goog.inherits(ol.source.TileImage, ol.source.Tile);
ol.source.TileImage.defaultTileLoadFunction = function(a, b) {
  a.ol_Tile_prototype$getImage().src = b
};
ol.source.TileImage.prototype.ol_source_Tile_prototype$canExpireCache = function() {
  return this.tileCache.ol_TileCache_prototype$canExpireCache()
};
ol.source.TileImage.prototype.ol_source_Tile_prototype$expireCache = function(a) {
  this.tileCache.ol_TileCache_prototype$expireCache(a)
};
ol.source.TileImage.prototype.getTile = function(a, b, c, d, e) {
  var f = this.ol_source_Tile_prototype$getKeyZXY(a, b, c);
  if(this.tileCache.containsKey(f)) {
    return this.tileCache.get(f)
  }
  a = new ol.TileCoord(a, b, c);
  d = this.tileUrlFunction(a, d, e);
  d = new this.tileClass(a, goog.isDef(d) ? ol.TileState.IDLE : ol.TileState.EMPTY, goog.isDef(d) ? d : "", this.crossOrigin, this.tileLoadFunction);
  this.tileCache.set(f, d);
  return d
};
ol.source.TileImage.prototype.setTileUrlFunction = function(a) {
  this.tileCache.clear();
  this.tileUrlFunction = a;
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.TileImage.prototype.useTile = function(a, b, c) {
  a = this.ol_source_Tile_prototype$getKeyZXY(a, b, c);
  this.tileCache.containsKey(a) && this.tileCache.get(a)
};
ol.source.TileWMS = function(a) {
  a = goog.isDef(a) ? a : {};
  var b = goog.isDef(a.params) ? a.params : {}, c = goog.object.get(b, "TRANSPARENT", !0);
  ol.source.TileImage.call(this, {attributions:a.attributions, crossOrigin:a.crossOrigin, extent:a.extent, logo:a.logo, opaque:!c, projection:a.projection, tileGrid:a.tileGrid, tileLoadFunction:a.tileLoadFunction, tileUrlFunction:goog.bind(this.tileUrlFunction_, this)});
  c = a.urls;
  !goog.isDef(c) && goog.isDef(a.url) && (c = ol.TileUrlFunction.expandUrl(a.url));
  this.urls_ = c;
  this.gutter_ = goog.isDef(a.gutter) ? a.gutter : 0;
  this.ol_source_TileWMS$params_ = b;
  this.ol_source_TileWMS$pixelRatio_ = NaN;
  this.ol_source_TileWMS$v13_ = !0;
  this.ol_source_TileWMS$serverType_ = a.serverType;
  this.ol_source_TileWMS$hidpi_ = goog.isDef(a.hidpi) ? a.hidpi : !0;
  this.coordKeyPrefix_ = "";
  this.resetCoordKeyPrefix_();
  this.tmpExtent_ = ol.extent.createEmpty();
  this.ol_source_TileWMS_prototype$updateV13_()
};
goog.inherits(ol.source.TileWMS, ol.source.TileImage);
ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$getGetFeatureInfoUrl = function(a, b, c, d) {
  var e = this.ol_source_TileWMS$pixelRatio_;
  if(!isNaN(this.ol_source_TileWMS$pixelRatio_)) {
    var f = this.getTileGrid();
    goog.isNull(f) && (f = this.getTileGridForProjection(c));
    b = f.getTileCoordForCoordAndResolution(a, b);
    if(!(f.ol_tilegrid_TileGrid_prototype$getResolutions().length <= b.ol_TileCoord$z)) {
      var g = f.ol_tilegrid_TileGrid_prototype$getResolution(b.ol_TileCoord$z), h = f.getTileCoordExtent(b, this.tmpExtent_), f = f.getTileSize(b.ol_TileCoord$z), k = this.gutter_;
      0 !== k && (f += 2 * k, h = ol.extent.buffer(h, g * k, h));
      1 != e && (f = f * e + 0.5 | 0);
      k = {SERVICE:"WMS", VERSION:ol.source.wms.DEFAULT_VERSION, REQUEST:"GetFeatureInfo", FORMAT:"image/png", TRANSPARENT:!0, QUERY_LAYERS:goog.object.get(this.ol_source_TileWMS$params_, "LAYERS")};
      goog.object.extend(k, this.ol_source_TileWMS$params_, d);
      d = Math.floor((h[3] - a[1]) / (g / e));
      goog.object.set(k, this.ol_source_TileWMS$v13_ ? "I" : "X", Math.floor((a[0] - h[0]) / (g / e)));
      goog.object.set(k, this.ol_source_TileWMS$v13_ ? "J" : "Y", d);
      return this.ol_source_TileWMS_prototype$getRequestUrl_(b, f, h, e, c, k)
    }
  }
};
ol.source.TileWMS.prototype.getGutter = function() {
  return this.gutter_
};
ol.source.TileWMS.prototype.ol_source_Tile_prototype$getKeyZXY = function(a, b, c) {
  return this.coordKeyPrefix_ + ol.source.TileWMS.superClass_.ol_source_Tile_prototype$getKeyZXY.call(this, a, b, c)
};
ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$getParams = function() {
  return this.ol_source_TileWMS$params_
};
ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$getRequestUrl_ = function(a, b, c, d, e, f) {
  var g = this.urls_;
  if(goog.isDef(g) && !goog.array.isEmpty(g)) {
    goog.object.set(f, "WIDTH", b);
    goog.object.set(f, "HEIGHT", b);
    f[this.ol_source_TileWMS$v13_ ? "CRS" : "SRS"] = e.getCode();
    "STYLES" in this.ol_source_TileWMS$params_ || goog.object.set(f, "STYLES", new String(""));
    if(1 != d) {
      switch(this.ol_source_TileWMS$serverType_) {
        case ol.source.wms.ServerType.GEOSERVER:
          goog.object.set(f, "FORMAT_OPTIONS", "dpi:" + (90 * d + 0.5 | 0));
          break;
        case ol.source.wms.ServerType.MAPSERVER:
          goog.object.set(f, "MAP_RESOLUTION", 90 * d);
          break;
        case ol.source.wms.ServerType.QGIS:
          goog.object.set(f, "DPI", 90 * d)
      }
    }
    b = e.getAxisOrientation();
    this.ol_source_TileWMS$v13_ && "ne" == b.substr(0, 2) && (b = c[0], c[0] = c[1], c[1] = b, b = c[2], c[2] = c[3], c[3] = b);
    goog.object.set(f, "BBOX", c.join(","));
    1 == g.length ? g = g[0] : (a = goog.math.modulo(a.ol_TileCoord_prototype$hash(), this.urls_.length), g = g[a]);
    return goog.uri.utils.appendParamsFromMap(g, f)
  }
};
ol.source.TileWMS.prototype.getTilePixelSize = function(a, b, c) {
  a = ol.source.TileWMS.superClass_.getTilePixelSize.call(this, a, b, c);
  return 1 != b && this.ol_source_TileWMS$hidpi_ && goog.isDef(this.ol_source_TileWMS$serverType_) ? a * b + 0.5 | 0 : a
};
ol.source.TileWMS.prototype.resetCoordKeyPrefix_ = function() {
  var a = 0, b = [], c;
  for(c in this.ol_source_TileWMS$params_) {
    b[a++] = c + "-" + this.ol_source_TileWMS$params_[c]
  }
  this.coordKeyPrefix_ = b.join("/")
};
ol.source.TileWMS.prototype.tileUrlFunction_ = function(a, b, c) {
  var d = this.getTileGrid();
  goog.isNull(d) && (d = this.getTileGridForProjection(c));
  if(!(d.ol_tilegrid_TileGrid_prototype$getResolutions().length <= a.ol_TileCoord$z)) {
    var e = d.ol_tilegrid_TileGrid_prototype$getResolution(a.ol_TileCoord$z), f = d.getTileCoordExtent(a, this.tmpExtent_), d = d.getTileSize(a.ol_TileCoord$z), g = this.gutter_;
    0 !== g && (d += 2 * g, f = ol.extent.buffer(f, e * g, f));
    1 != b && (d = d * b + 0.5 | 0);
    e = {SERVICE:"WMS", VERSION:ol.source.wms.DEFAULT_VERSION, REQUEST:"GetMap", FORMAT:"image/png", TRANSPARENT:!0};
    goog.object.extend(e, this.ol_source_TileWMS$params_);
    1 == b || this.ol_source_TileWMS$hidpi_ && goog.isDef(this.ol_source_TileWMS$serverType_) || (b = 1);
    this.ol_source_TileWMS$pixelRatio_ = b;
    return this.ol_source_TileWMS_prototype$getRequestUrl_(a, d, f, b, c, e)
  }
};
ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$updateParams = function(a) {
  goog.object.extend(this.ol_source_TileWMS$params_, a);
  this.resetCoordKeyPrefix_();
  this.ol_source_TileWMS_prototype$updateV13_();
  this.ol_Observable_prototype$dispatchChangeEvent()
};
ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$updateV13_ = function() {
  var a = goog.object.get(this.ol_source_TileWMS$params_, "VERSION", ol.source.wms.DEFAULT_VERSION);
  this.ol_source_TileWMS$v13_ = 0 <= goog.string.compareVersions(a, "1.3")
};
goog.exportProperty(ol.source.TileWMS.prototype, "updateParams", ol.source.TileWMS.prototype.ol_source_TileWMS_prototype$updateParams);
goog.exportProperty(ol.source.ImageWMS.prototype, "updateParams", ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$updateParams);
goog.exportProperty(ol.Collection.prototype, "forEach", ol.Collection.prototype.forEach);
goog.exportProperty(ol.Map.prototype, "getLayers", ol.Map.prototype.ol_Map_prototype$getLayers);
goog.exportProperty(ol.Object.prototype, "set", ol.Object.prototype.set);
goog.exportProperty(ol.Map.prototype, "updateSize", ol.Map.prototype.updateSize);
goog.exportSymbol("ol.METERS_PER_UNIT", ol.METERS_PER_UNIT);
goog.exportProperty(ol.source.ImageWMS.prototype, "getGetFeatureInfoUrl", ol.source.ImageWMS.prototype.ol_source_ImageWMS_prototype$getGetFeatureInfoUrl);
goog.exportProperty(ol.MapBrowserEvent.prototype, "getCoordinate", ol.MapBrowserEvent.prototype.ol_MapBrowserEvent_prototype$getCoordinate);
goog.exportProperty(ol.layer.Layer.prototype, "getSource", ol.layer.Layer.prototype.ol_layer_Layer_prototype$getSource);
goog.exportProperty(ol.proj.Projection.prototype, "getUnits", ol.proj.Projection.prototype.getUnits);
goog.exportProperty(ol.Object.prototype, "get", ol.Object.prototype.get);
goog.exportProperty(ol.View2D.prototype, "fitExtent", ol.View2D.prototype.fitExtent);
goog.exportProperty(ol.Observable.prototype, "on", ol.Observable.prototype.on);
goog.exportSymbol("ol.RendererHint", ol.RendererHint);
goog.exportProperty(ol.RendererHint, "CANVAS", ol.RendererHint.CANVAS);
goog.exportSymbol("ol.proj.Units", ol.proj.Units);
goog.exportSymbol("ol.control.defaults", ol.control.defaults);
goog.exportProperty(ol.Collection.prototype, "extend", ol.Collection.prototype.extend);
goog.exportSymbol("ol.Map", ol.Map);
goog.exportSymbol("ol.View2D", ol.View2D);
goog.exportSymbol("ol.control.MousePosition", ol.control.MousePosition);
goog.exportSymbol("ol.layer.Image", ol.layer.Image);
goog.exportSymbol("ol.source.ImageWMS", ol.source.ImageWMS);
goog.exportSymbol("ol.layer.Tile", ol.layer.Tile);
goog.exportSymbol("ol.source.TileWMS", ol.source.TileWMS);
goog.exportSymbol("ol.coordinate.createStringXY", ol.coordinate.createStringXY);
goog.exportSymbol("ol.proj.Projection", ol.proj.Projection);

