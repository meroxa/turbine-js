"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poller = void 0;
function poller({ fn, validate, interval, maxAttempts, }) {
    return __awaiter(this, void 0, void 0, function* () {
        let attempts = 0;
        const executePoll = (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const result = yield fn();
            attempts++;
            if (validate(result)) {
                return resolve(result);
            }
            else if (attempts === maxAttempts) {
                return reject(new Error("Exceeded max attempts"));
            }
            else {
                setTimeout(executePoll, interval, resolve, reject);
            }
        });
        return new Promise(executePoll);
    });
}
exports.poller = poller;
//# sourceMappingURL=poller.js.map