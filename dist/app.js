"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json()); // รับส่งข้อมูลแบบ JSON
app.use((0, cors_1.default)()); // frontend เรียกใช้ API ได้
// Base Routes
app.use("/api/employees", employeeRoutes_1.default);
app.use("/api/reservation", reservationRoutes_1.default);
app.use("/api/services", serviceRoutes_1.default);
exports.default = app;
