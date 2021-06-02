"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigureError = void 0;
class ConfigureError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ConfigureError = ConfigureError;
