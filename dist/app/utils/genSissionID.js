"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Генератор идентификатора сессии
const generateSessionID = (req) => {
    const { username } = req.session;
    const timestamp = Date.now();
    return `${username}-${timestamp}`;
};
exports.default = generateSessionID;
