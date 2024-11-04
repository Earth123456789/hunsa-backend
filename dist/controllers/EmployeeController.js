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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateEmployee = exports.updateEmployeeStatus = exports.getAllEmployees = exports.loginEmployee = exports.registerEmployee = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const timezone_1 = require("../config/timezone");
// ช่างลงทะเบียนสร้างบัญชีผู้ใช้
const registerEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const existingEmployee = yield Employee_1.default.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
        }
        const employee = new Employee_1.default({
            username,
            email,
            password,
            status: "available",
            createAt: (0, timezone_1.getCurrentTime)(),
            updatedAt: (0, timezone_1.getCurrentTime)(),
        });
        yield employee.save();
        res.status(201).json({
            message: "สมัครสมาชิกสำเร็จ",
            employee: {
                username: employee.username,
                email: employee.email,
                description: employee.description,
                imgSrc: employee.imgSrc,
                status: employee.status,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก", error });
    }
});
exports.registerEmployee = registerEmployee;
// ช่างเข้าสู่ระบบ
const loginEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email_username, password } = req.body;
    try {
        const employee = yield Employee_1.default.findOne({
            $or: [{ email: email_username }, { username: email_username }],
        });
        if (!employee) {
            return res
                .status(400)
                .json({ message: "ไม่พบอีเมลหรือชื่อผู้ใช้ในระบบ" });
        }
        if (employee.password !== password) {
            return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
        }
        res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", employee });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
    }
});
exports.loginEmployee = loginEmployee;
// แสดงข้อมูลช่างทุกคน
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield Employee_1.default.find();
        res.status(200).json(employees);
    }
    catch (error) {
        // หากมีข้อผิดพลาด
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error });
    }
});
exports.getAllEmployees = getAllEmployees;
// ฟังก์ชันเปลี่ยนสถานะ 'ว่าง/ไม่ว่าง' ของช่าง
const updateEmployeeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const employeeId = req.params.id;
        const employee = yield Employee_1.default.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
        }
        employee.status = status;
        yield employee.save();
        res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", employee });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
    }
});
exports.updateEmployeeStatus = updateEmployeeStatus;
// อัปเดตช่าง (ชื่อ,อีเมล,รูปโปรไฟล์)
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, email, description, imgSrc } = req.body;
    try {
        const employee = yield Employee_1.default.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
        }
        // ตรวจสอบว่ามีการอัปเดตอีเมล และอีเมลนี้ยังไม่ได้ใช้ในระบบ
        if (email) {
            const emailExists = yield Employee_1.default.findOne({ email });
            if (emailExists && emailExists._id.toString() !== id) {
                return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
            }
            employee.email = email;
        }
        if (username) {
            employee.username = username;
        }
        if (imgSrc) {
            employee.imgSrc = imgSrc;
        }
        if (description !== undefined) {
            employee.description = description;
        }
        employee.updatedAt = (0, timezone_1.getCurrentTime)();
        yield employee.save();
        res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", employee });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error });
    }
});
exports.updateEmployee = updateEmployee;
// ฟังก์ชันสำหรับเปลี่ยนรหัสผ่าน
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const employee = yield Employee_1.default.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
        }
        employee.password = password;
        employee.updatedAt = (0, timezone_1.getCurrentTime)();
        yield employee.save();
        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน", error });
    }
});
exports.changePassword = changePassword;
