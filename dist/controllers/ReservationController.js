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
exports.cancelReservation = exports.updateReservationStatus = exports.getReservationsByEmployee = exports.bookReservation = void 0;
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Service_1 = __importDefault(require("../models/Service"));
const Employee_1 = __importDefault(require("../models/Employee"));
const timezone_1 = require("../config/timezone");
const client_sns_1 = require("@aws-sdk/client-sns");
// ฟังก์ชันจองคิว
const bookReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, customerEmail, customerPhone, employeeId, serviceId, reservationDate, reservationTime, } = req.body;
    try {
        const employee = yield Employee_1.default.findById(employeeId);
        const service = yield Service_1.default.findById(serviceId);
        if (!employee || employee.status === "unavailable") {
            return res.status(400).json({ message: "ช่างไม่ว่างหรือไม่พบช่าง" });
        }
        if (!service) {
            return res.status(400).json({ message: "บริการไม่ถูกต้อง" });
        }
        // สร้างการจองคิวใหม่
        const reservation = new Reservation_1.default({
            customerName,
            customerEmail,
            customerPhone,
            serviceId,
            employeeId,
            reservationDate: (0, timezone_1.getDate)(reservationDate),
            reservationTime: (0, timezone_1.getHour)(reservationTime),
        });
        yield reservation.save();
        // await sendEmail(reservation);
        res.status(201).json({ message: "จองคิวสำเร็จ", reservation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการจองคิว" });
    }
});
exports.bookReservation = bookReservation;
// แสดงข้อมูลการจองคิวที่ลูกค้าจองช่างคนนั้น (employeeId)
const getReservationsByEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.params;
    try {
        const reservations = yield Reservation_1.default.find({ employeeId });
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: "ไม่พบการจองคิวสำหรับช่างคนนี้" });
        }
        res.status(200).json({ reservations });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจอง", error });
    }
});
exports.getReservationsByEmployee = getReservationsByEmployee;
// หลังลูกค้าเข้ารับบริการแล้ว ช่างเปลี่ยนสถานะการจองเป็น confirm
const updateReservationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationId } = req.params;
    try {
        const reservation = yield Reservation_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: "ไม่พบการจองคิว" });
        }
        reservation.status = "confirm";
        reservation.updatedAt = (0, timezone_1.getCurrentTime)();
        yield reservation.save();
        res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", reservation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ", error });
    }
});
exports.updateReservationStatus = updateReservationStatus;
// สร้างฟังก์ชันสำหรับส่งการแจ้งเตือนผ่าน SNS
const snsClient = new client_sns_1.SNSClient({ region: "ap-southeast-1" });
const sendCancelNotification = (reservation) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Message: `การจองของคุณถูกยกเลิก: ${reservation._id}`,
        PhoneNumber: reservation.customerPhone, // ใช้หมายเลขโทรศัพท์ของลูกค้าจากการจอง
    };
    try {
        const command = new client_sns_1.PublishCommand(params);
        const result = yield snsClient.send(command);
        console.log("SMS sent:", result);
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
});
// ฟังก์ชันยกเลิกการจอง
const cancelReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reservationId } = req.params;
    try {
        const reservation = yield Reservation_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: "ไม่พบการจองคิว" });
        }
        reservation.status = "cancel";
        reservation.updatedAt = (0, timezone_1.getCurrentTime)();
        yield reservation.save();
        // await sendCancelNotification(reservation);
        res.status(200).json({ message: "ยกเลิกการจองคิวสำเร็จ", reservation });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการยกเลิกการจองคิว" });
    }
});
exports.cancelReservation = cancelReservation;
