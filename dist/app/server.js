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
const cookie_session_1 = __importDefault(require("cookie-session"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const i18n_1 = __importDefault(require("i18n"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
//fuctions import
const web_config_1 = __importDefault(require("./configs/web.config"));
const corsMiddleware_1 = __importDefault(require("./middlewares/corsMiddleware"));
const loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
const sessionMiddleware_1 = __importDefault(require("./middlewares/sessionMiddleware"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
i18n_1.default.configure({
    locales: ['gb', 'ua', 'kz', 'ru'],
    defaultLocale: 'ru',
    directory: path_1.default.join(__dirname, 'locales'),
    objectNotation: true, // Allows nested translation objects
    updateFiles: false, // Don't save missing translations to files
});
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [process_1.default.env.SESSION_KEY || web_config_1.default.sesionKey,], // Replace with your secret keys
    maxAge: 60 * 60 * 1000, // 1 hours
}));
app.use((0, cookie_parser_1.default)());
app.use(express_useragent_1.default.express());
app.use((0, compression_1.default)());
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "../public", "favicon.ico")));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
const staticResourceFolders = [
    "@popperjs/core/dist/umd",
    "bootstrap/dist",
    "@coreui/icons",
    "@coreui/chartjs/dist",
    "@coreui/coreui/dist",
    // "@coreui/utils/dist/umd",
    "chart.js/dist",
    "@fortawesome/fontawesome-free",
    "jquery/dist",
    "tippy.js/dist",
    "bootstrap-notify",
    "select2/dist",
    "flag-icons"
    // Добавьте остальные папки с ресурсами здесь
];
// node_modules\fontawesome-6-pro node_modules\ifontawesome.pro
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(i18n_1.default.init);
app.set("view engine", "ejs");
app.use((req, res, next) => {
    // Pass i18n as a local variable for all rendered templates
    res.locals.i18n = i18n_1.default;
    next();
});
staticResourceFolders.forEach((folder) => {
    let folderName;
    if (folder.indexOf('dist') === -1 && folder.split('/').length === 2) {
        folderName = folder;
        app.use(`/static/${folderName}`, express_1.default.static(path_1.default.join(__dirname, `../../node_modules/${folder}`)));
    }
    else if (folder.indexOf('dist') !== -1) {
        folderName = folder.split('/dist')[0]; // Получить первый элемент от начала строки
        app.use(`/static/${folderName}`, express_1.default.static(path_1.default.join(__dirname, `../../node_modules/${folder}`)));
    }
    else {
        folderName = folder.split('/').shift(); // Получить первый элемент от начала строки
        app.use(`/static/${folderName}`, express_1.default.static(path_1.default.join(__dirname, `../../node_modules/${folder}`)));
    }
    app.use(`/static/${folderName}`, express_1.default.static(path_1.default.join(__dirname, `../../node_modules/${folder}`)));
});
app.use((req, res, next) => {
    const cssFiles = [
        '/public/css/main.css',
        '/public/vendor/flags/flags.css',
        '/static/bootstrap/css/bootstrap.min.css',
        '/static/@fortawesome/fontawesome-free/css/all.min.css',
        '/static/@coreui/coreui/css/coreui.min.css',
        '/static/@coreui/chartjs/css/coreui-chartjs.min.css',
        '/static/@coreui/icons/css/all.min.css',
        '/static/tippy.js/tippy.css',
        '/static/select2/css/select2.min.css',
        '/static/flag-icons/css/flag-icons.min.css'
    ];
    const jsLibs = [
        '/static/jquery/jquery.min.js',
        '/static/@popperjs/core/popper.min.js',
        '/static/bootstrap/js/bootstrap.min.js',
        '/static/@coreui/coreui/js/coreui.min.js',
        '/static/@coreui/chartjs/js/coreui-chartjs.min.js',
        '/static/@fortawesome/fontawesome-free/js/all.min.js',
        // '/static/@coreui/utils/umd/index.js',
        '/static/tippy.js/tippy-bundle.umd.js',
        '/static/bootstrap-notify/bootstrap-notify.min.js',
        '/static/select2/js/select2.full.min.js',
        '/public/js/chart.js/chart.min.js',
        '/public/vendor/flags/extra/flags.js',
    ];
    res.locals.jsLibs = jsLibs;
    res.locals.cssFiles = cssFiles;
    next();
});
app.use((req, res, next) => {
    if (req.session.lang) {
        console.log(req.path, i18n_1.default.getLocale(req));
        i18n_1.default.removeLocale(i18n_1.default.getLocale(req));
        // Установите язык из сессии в i18n
        i18n_1.default.setLocale(req, req.session.lang);
        console.log(req.path, i18n_1.default.getLocale(req));
    }
    else {
        i18n_1.default.setLocale(req, 'en');
        console.log(req.path, i18n_1.default.getLocale(req));
    }
    next();
});
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
});
exports.default = app;
