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
exports.sendEmail = void 0;
const client_ses_1 = require("@aws-sdk/client-ses");
// กำหนดภูมิภาค (region)
const sesClient = new client_ses_1.SESClient({ region: "ap-southeast-1" });
// ฟังก์ชันสำหรับส่งอีเมลยืนยันการจองพร้อมลิงก์ยกเลิก
const sendEmail = (reservation) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Destination: {
            ToAddresses: [reservation.customerEmail], // ส่งอีเมลไปยังลูกค้า
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
            <h1>ยืนยันการจองคิว</h1>
            <p>ชื่อ: ${reservation.customerName}</p>
            <p>วันเวลาจอง: ${reservation.reservationDate} ${reservation.reservationTime}</p>
            <p>บริการ: ${reservation.serviceId}</p>
            <p>คุณสามารถยกเลิกการจองได้โดยคลิกที่ลิงก์ด้านล่าง:</p>
            <a href="http://yourdomain.com/api/reservations/${reservation._id}/cancel">ยกเลิกการจอง</a>
          `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "ยืนยันการจองคิว",
            },
        },
        Source: "your-verified-email@example.com", // อีเมลที่คุณยืนยันใน AWS SES
    };
    // ส่งอีเมล
    try {
        const command = new client_ses_1.SendEmailCommand(params);
        const response = yield sesClient.send(command);
        console.log("Email sent:", response);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
