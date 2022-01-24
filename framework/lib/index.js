"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.LocalRuntime = exports.PlatformRuntime = void 0;
var platform_1 = require("./runtime/platform");
Object.defineProperty(exports, "PlatformRuntime", { enumerable: true, get: function () { return platform_1.PlatformRuntime; } });
var local_1 = require("./runtime/local");
Object.defineProperty(exports, "LocalRuntime", { enumerable: true, get: function () { return local_1.LocalRuntime; } });
var meroxa_js_1 = require("meroxa-js");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return meroxa_js_1.Client; } });
