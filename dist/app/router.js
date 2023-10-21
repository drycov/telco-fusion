"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware "));
const aclMiddleware_1 = __importDefault(require("./middlewares/aclMiddleware"));
const indexController_1 = __importDefault(require("./controllers/indexController"));
const authController_1 = __importDefault(require("./controllers/authController"));
const usersController_1 = require("./controllers/usersController");
function default_1(app) {
    app.get('/', (req, res) => {
        res.redirect('/index');
    });
    app.route('/index').get(authMiddleware_1.default, (0, aclMiddleware_1.default)(['any']), indexController_1.default);
    app.route('/login').get(authController_1.default.getLogin).post(authController_1.default.postLogin
    //   (req, res) => {
    //   const { username, password } = req.body;
    //   if ((username === 'admin' && password === 'admin') || (username === 'user' && password === 'password')) {
    //     const token = jwt.sign({ username }, process.env.sesionKey || config.sesionKey, { expiresIn: '1h' });
    //     res.cookie('token', token, { httpOnly: true, secure: true });
    //     // Assign values to session properties
    //     req.session!.isAuthenticated = true;
    //     req.session!.token = token;
    //     req.session!.user = { username }; // Set your user object here
    //     res.redirect('/index');
    //   } else {
    //     res.redirect('/login');
    //   }
    // }
    );
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
            title: req.t('labelpageTitles.LabelError'),
            name: req.t('labelpageTitles.LabelError'),
            breadcrumbs: [{ label: req.t('labelpageTitles.labelHome'), url: '/' }, { label: res.statusCode, url: null }],
            messages: {
                pageTitle: req.t('erorMesages.404.pageTitle'),
                status: res.statusCode,
                text: req.t('erorMesages.404.text'),
            },
        });
    });
}
exports.default = default_1;
