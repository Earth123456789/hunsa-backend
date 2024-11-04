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
exports.deleteService = exports.updateService = exports.getServiceById = exports.getAllServices = exports.createService = void 0;
const Service_1 = __importDefault(require("../models/Service"));
const timezone_1 = require("../config/timezone");
// สร้างบริการใหม่
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, category, imgSrc } = req.body;
    try {
        if (!title || !description || !price || !category || !imgSrc) {
            return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
        }
        const service = new Service_1.default({
            title,
            description,
            price,
            category,
            imgSrc,
            createdAt: (0, timezone_1.getCurrentTime)(),
            updatedAt: (0, timezone_1.getCurrentTime)(),
        });
        yield service.save();
        res.status(201).json({ message: "สร้างบริการสำเร็จ", service: service });
    }
    catch (error) {
        res.status(500).json({ message: "ไม่สามารถสร้างบริการได้", error });
    }
});
exports.createService = createService;
// ดึงข้อมูลบริการทั้งหมด
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield Service_1.default.find();
        res.status(200).json(services);
    }
    catch (error) {
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลบริการได้", error });
    }
});
exports.getAllServices = getAllServices;
// ดึงข้อมูลบริการตาม ID
const getServiceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield Service_1.default.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "ไม่พบบริการนี้" });
        }
        res.status(200).json(service);
    }
    catch (error) {
        res.status(500).json({ message: "ไม่สามารถดึงข้อมูลบริการได้", error });
    }
});
exports.getServiceById = getServiceById;
// อัปเดตข้อมูลบริการ
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedData = Object.assign(Object.assign({}, req.body), { updatedAt: (0, timezone_1.getCurrentTime)() });
        const updatedService = yield Service_1.default.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: "ไม่พบบริการนี้" });
        }
        res
            .status(200)
            .json({ message: "อัปเดตข้อมูลบริการสำเร็จ", updatedService });
    }
    catch (error) {
        res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลบริการได้", error });
    }
});
exports.updateService = updateService;
// ลบบริการ
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedService = yield Service_1.default.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({ message: "ไม่พบบริการนี้" });
        }
        res.status(200).json({ message: "ลบบริการสำเร็จ" });
    }
    catch (error) {
        res.status(500).json({ message: "ไม่สามารถลบบริการได้", error });
    }
});
exports.deleteService = deleteService;
