"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const web_config_1 = __importDefault(require("../configs/web.config"));
const getUserRole_1 = __importDefault(require("../utils/getUserRole"));
const getUserData_1 = __importDefault(require("../utils/getUserData"));
const authMiddleware = (req, res, next) => {
    // Проверка авторизации пользователя
    // Здесь вы можете реализовать логику проверки авторизации,
    // например, проверка наличия токена авторизации в куках запроса
    // или проверка наличия сессии пользователя
    // Если пользователь авторизован, вызываем next() для передачи управления следующему middleware или обработчику маршрута
    // Если пользователь не авторизован, можно отправить ошибку или выполнить перенаправление на страницу входа
    // Пример проверки наличия токена авторизации в куках
    const token = req.session.token;
    if (!token || !req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    // Проверка действительности токена
    // Здесь можно использовать любую выбранную вами стратегию проверки токена, например, проверку в базе данных или использование сторонней библиотеки для проверки JWT
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.sesionKey || web_config_1.default.sesionKey);
        req.user = decoded;
        const userdata = (0, getUserData_1.default)(decoded.username);
        req.user = {
            ...req.user,
            role: (0, getUserRole_1.default)(decoded.username),
            ...userdata,
            // другие свойства пользователя
        }; // Добавляем информацию о пользователе в объект запроса
        req.session.user = req.user;
        next();
    }
    catch (err) {
        return res.redirect('/login');
    }
};
exports.default = authMiddleware;
