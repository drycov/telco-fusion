"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//libs import
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const express_session_1 = __importDefault(require("express-session"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const http_1 = __importDefault(require("http"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
//fuctions import
const web_config_1 = __importDefault(require("./configs/web.config"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
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
app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
app.use((0, express_session_1.default)({
    secret: process_1.default.env.SESSION_KEY || web_config_1.default.sesionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
    },
}));
app.set("view engine", "ejs");
app.use(express_ejs_layouts_1.default);
app.enable("view cache");
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);
app.set("views", path_1.default.join(__dirname, "views"));
// app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "../public/favicon.ico")));
// app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// node_modules\@popperjs\core\dist\umd
app.use("/static/popperjs", express_1.default.static(path_1.default.join(__dirname, "../node_modules/@popperjs/core/dist/umd")));
// node_modules\bootstrap-icons\font\bootstrap-icons.css
app.use("/static/bootstrap-icons", express_1.default.static(path_1.default.join(__dirname, "../node_modules/bootstrap-icons/font")));
app.use("/static/bootstrap", express_1.default.static(path_1.default.join(__dirname, "../node_modules/bootstrap/dist")));
app.use("/static/coreui/icon", express_1.default.static(path_1.default.join(__dirname, "../node_modules/@coreui/icons")));
// vendors/@coreui/utils/js/coreui-utils.js
app.use("/static/coreui/utils", express_1.default.static(path_1.default.join(__dirname, "../node_modules/@coreui/utils/dist/umd")));
app.use("/static/coreui/coreui", express_1.default.static(path_1.default.join(__dirname, "../node_modules/@coreui/coreui/dist")));
app.use("/static/chart.js", express_1.default.static(path_1.default.join(__dirname, "../node_modules/chart.js/dist")));
app.use("/static/fortawesome", express_1.default.static(path_1.default.join(__dirname, "../node_modules/@fortawesome/fontawesome-free")));
app.use("/static/jquery", express_1.default.static(path_1.default.join(__dirname, "../node_modules/jquery/dist")));
// node_modules/simplebar/dist/simplebar.css
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(removeCommentsMiddleware);
app.use((0, compression_1.default)());
app.use(express_useragent_1.default.express());
app.use(loggerMiddleware_1.default);
app.disable("x-powered-by");
app.disable("expires");
app.use(corsMiddleware_1.default);
(0, router_1.default)(app);
app.use(errorHandler_1.default);
const server = http_1.default.createServer(app);
exports.default = server;
