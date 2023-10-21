"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//libs import
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
//fuctions import
const web_config_1 = __importDefault(require("./configs/web.config"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const sessionMiddleware_1 = __importDefault(require("./middlewares/sessionMiddleware"));
const router_1 = __importDefault(require("./router"));
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.default.LanguageDetector)
    .init({
    fallbackLng: "en",
    ns: ["en", "ru"],
    defaultNS: "en",
    backend: {
        loadPath: __dirname + "/locales/{{lng}}.json",
    },
});
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [process_1.default.env.SESSION_KEY || web_config_1.default.sesionKey,],
    maxAge: 60 * 60 * 1000, // 1 hours
}));
// app.use(
//   session({
//     secret: process.env.SESSION_KEY || config.sesionKey,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: true,
//     },
//   })
// );
app.use((0, cookie_parser_1.default)());
app.use(express_useragent_1.default.express());
app.use((0, compression_1.default)());
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "../public", "favicon.ico")));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/static/popperjs", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@popperjs/core/dist/umd")));
// node_modules\bootstrap-icons\font\bootstrap-icons.css
app.use("/static/bootstrap-icons", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/bootstrap-icons/font")));
app.use("/static/bootstrap", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/bootstrap/dist")));
app.use("/static/coreui/icon", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@coreui/icons")));
app.use("/static/coreui/chartjs", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@coreui/chartjs")));
// vendors/@coreui/utils/js/coreui-utils.js
app.use("/static/coreui/utils", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@coreui/utils/dist/umd")));
app.use("/static/coreui/coreui", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@coreui/coreui/dist")));
app.use("/static/chart.js", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/chart.js/dist")));
app.use("/static/fortawesome", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/@fortawesome/fontawesome-free")));
app.use("/static/jquery", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/jquery/dist")));
app.use("/static/tippy.js", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/tippy.js/dist")));
app.use("/static/bootstrap-notify", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/bootstrap-notify")));
app.use("/static/select2", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/select2/dist")));
// node_modules\fontawesome-6-pro node_modules\ifontawesome.pro
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
app.set("view engine", "ejs");
app.use(express_ejs_layouts_1.default);
app.enable("view cache");
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);
app.set("views", path_1.default.join(__dirname, "views"));
app.use(loggerMiddleware_1.default);
app.disable("x-powered-by");
app.disable("expires");
app.use(corsMiddleware_1.default);
app.use(sessionMiddleware_1.default);
(0, router_1.default)(app);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
        error: true,
        title: req.t("labelpageTitles.LabelError"),
        name: req.t("labelpageTitles.LabelError"),
        breadcrumbs: [
            { label: req.t("labelpageTitles.labelHome"), url: "/" },
            { label: res.statusCode.toString(), url: null },
        ],
        messages: {
            pageTitle: req.t("erorMesages.500.pageTitle"),
            status: res.statusCode,
            text: req.t("erorMesages.500.text"),
        },
    });
});
exports.default = app;
