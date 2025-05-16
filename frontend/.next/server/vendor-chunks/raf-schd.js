"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/raf-schd";
exports.ids = ["vendor-chunks/raf-schd"];
exports.modules = {

/***/ "(ssr)/../node_modules/raf-schd/dist/raf-schd.cjs.js":
/*!*****************************************************!*\
  !*** ../node_modules/raf-schd/dist/raf-schd.cjs.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\nvar rafSchd = function rafSchd(fn) {\n  var lastArgs = [];\n  var frameId = null;\n\n  var wrapperFn = function wrapperFn() {\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    lastArgs = args;\n\n    if (frameId) {\n      return;\n    }\n\n    frameId = requestAnimationFrame(function () {\n      frameId = null;\n      fn.apply(void 0, lastArgs);\n    });\n  };\n\n  wrapperFn.cancel = function () {\n    if (!frameId) {\n      return;\n    }\n\n    cancelAnimationFrame(frameId);\n    frameId = null;\n  };\n\n  return wrapperFn;\n};\n\nmodule.exports = rafSchd;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3JhZi1zY2hkL2Rpc3QvcmFmLXNjaGQuY2pzLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUF3RSxhQUFhO0FBQ3JGO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NvdXJzZS1jb25uZWN0LWZyb250ZW5kLy4uL25vZGVfbW9kdWxlcy9yYWYtc2NoZC9kaXN0L3JhZi1zY2hkLmNqcy5qcz81OGJhIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHJhZlNjaGQgPSBmdW5jdGlvbiByYWZTY2hkKGZuKSB7XG4gIHZhciBsYXN0QXJncyA9IFtdO1xuICB2YXIgZnJhbWVJZCA9IG51bGw7XG5cbiAgdmFyIHdyYXBwZXJGbiA9IGZ1bmN0aW9uIHdyYXBwZXJGbigpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgbGFzdEFyZ3MgPSBhcmdzO1xuXG4gICAgaWYgKGZyYW1lSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmcmFtZUlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZyYW1lSWQgPSBudWxsO1xuICAgICAgZm4uYXBwbHkodm9pZCAwLCBsYXN0QXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgd3JhcHBlckZuLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIWZyYW1lSWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShmcmFtZUlkKTtcbiAgICBmcmFtZUlkID0gbnVsbDtcbiAgfTtcblxuICByZXR1cm4gd3JhcHBlckZuO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByYWZTY2hkO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/raf-schd/dist/raf-schd.cjs.js\n");

/***/ })

};
;