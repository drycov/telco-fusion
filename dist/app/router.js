"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sessionMiddleware_1 = __importDefault(require("./middlewares/sessionMiddleware"));
function default_1(app) {
    app.get("/", sessionMiddleware_1.default, (req, res) => {
        res.redirect('/index');
    });
    app.route("/index").get(sessionMiddleware_1.default, (req, res) => {
        res.render("pages/index", {
            title: req.t("labelpageTitles.labelHome"),
            name: req.t("labelpageTitles.labelHome"),
            breadcrumbs: [{ label: req.t("labelpageTitles.labelHome"), url: "/" }],
        });
        // res.send('Hello, '+ req.user.username + '! Your role: ' + req.user.role + ' : \n'+JSON.stringify(req.user));
    });
    app.route('/login')
        .get(sessionMiddleware_1.default, (req, res) => {
        res.render('pages/login', { title: req.t('labelpageTitles.labelLogin') });
    });
    app.route("*").get(sessionMiddleware_1.default, (req, res) => {
        res.status(404).render("error", {
            title: req.t("labelpageTitles.LabelError"),
            name: req.t("labelpageTitles.LabelError"),
            breadcrumbs: [
                { label: req.t("labelpageTitles.labelHome"), url: "/" },
                { label: res.statusCode, url: null },
            ],
            messages: {
                pageTitle: req.t("erorMesages.404.pageTitle"),
                status: res.statusCode,
                text: req.t("erorMesages.404.text"),
            },
        });
    });
}
exports.default = default_1;
