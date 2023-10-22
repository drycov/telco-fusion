"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("./controllers/authController"));
const indexController_1 = __importDefault(require("./controllers/indexController"));
const usersController_1 = require("./controllers/usersController");
const aclMiddleware_1 = __importDefault(require("./middlewares/aclMiddleware"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware "));
function default_1(app) {
    app.get('/', (req, res) => {
        res.redirect('/index');
    });
    app.route('/index').get(authMiddleware_1.default, (0, aclMiddleware_1.default)(['any']), indexController_1.default);
    app.route('/login').get(authController_1.default.getLogin).post(authController_1.default.postLogin);
    app.get('/setLanguage/:lng', (req, res) => {
        const { lng } = req.params;
        req.session.lang = lng;
        // i18n.setLocale(req, lang); // Set the language in the request
        res.redirect('back'); // Redirect back to the previous page
    });
    app.get('/logout', (req, res) => {
        // Clear the session (assuming you're using express-session)
        req.session = null;
        // Clear the cookie
        res.clearCookie('token');
        res.clearCookie('session');
        res.clearCookie('session.sig');
        // Redirect or respond as needed
        res.redirect('/login');
    });
    app.route('/tu').get(usersController_1.getUsers);
    app.route('*').get((req, res) => {
        res.status(404).render('error', {
            error: true,
            title: req.__('labelpageTitles.LabelError'),
            name: req.__('labelpageTitles.LabelError'),
            breadcrumbs: [{ label: req.__('labelpageTitles.labelHome'), url: '/' }, { label: res.statusCode, url: null }],
            messages: {
                pageTitle: req.__('erorMesages.404.pageTitle'),
                status: res.statusCode,
                text: req.__('erorMesages.404.text'),
            },
        });
    });
}
exports.default = default_1;
