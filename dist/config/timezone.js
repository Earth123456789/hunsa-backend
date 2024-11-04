"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHour = exports.getDate = exports.getGMT7 = exports.getCurrentTime = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getCurrentTime = () => {
    return (0, moment_timezone_1.default)().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};
exports.getCurrentTime = getCurrentTime;
const getGMT7 = (date) => {
    return (0, moment_timezone_1.default)(date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};
exports.getGMT7 = getGMT7;
const getDate = (date) => {
    return (0, moment_timezone_1.default)(date, "YYYY-MM-DD").tz("Asia/Bangkok").format("YYYY-MM-DD");
};
exports.getDate = getDate;
const getHour = (time) => {
    return (0, moment_timezone_1.default)(time, "HH:mm:ss").tz("Asia/Bangkok").format("HH:mm:ss");
};
exports.getHour = getHour;
