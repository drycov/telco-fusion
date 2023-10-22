"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebaseConfig_1 = require("../utils/firebaseConfig");
const web_config_1 = __importDefault(require("../configs/web.config"));
const getLogin = (req, res) => {
    // Ваш код для обработки запроса на страницу "index" здесь
    res.render('pages/login', {
        title: req.__('labelpageTitles.labelLogin'),
    });
};
const postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await firebaseConfig_1.db.collection('users').doc(username).get();
        if (!userDoc.exists) {
            return res.redirect('/login');
        }
        const userData = userDoc.data();
        if (!userData || !userData.password) {
            return res.redirect('/login');
        }
        const isMatch = await bcryptjs_1.default.compare(password, userData.password);
        if (!isMatch) {
            return res.redirect('/login');
        }
        const payload = { username: userData.username };
        jsonwebtoken_1.default.sign(payload, process.env.sesionKey || web_config_1.default.sesionKey, { expiresIn: 3600 }, (err, token) => {
            if (err)
                throw err;
            res.cookie('token', token, { httpOnly: true, secure: true });
            // const detectedLng = req.language; // Это свойство будет доступно благодаря i18nextMiddleware
            // if (req.session) {
            //     req.session.lng = detectedLng;
            // }
            req.session.isAuthenticated = true;
            req.session.token = token;
            req.session.user = { username }; // Set your user object here
            res.redirect('/index');
        });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).render("error", {
            error: true,
            title: req.__("labelpageTitles.LabelError"),
            name: req.__("labelpageTitles.LabelError"),
            breadcrumbs: [
                { label: req.__("labelpageTitles.labelHome"), url: "/" },
                { label: res.statusCode.toString(), url: null },
            ],
            messages: {
                pageTitle: req.__("erorMesages.500.pageTitle"),
                status: res.statusCode,
                text: req.__("erorMesages.500.text"),
            },
        });
    }
};
exports.default = { getLogin, postLogin };
