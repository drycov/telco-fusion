//libs import
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from "express";

import cookieSession from 'cookie-session';
import expressLayouts from "express-ejs-layouts";

import useragent from "express-useragent";
import i18n from "i18n";
import path from "path";
import process from "process";
import favicon from "serve-favicon";

//fuctions import
import config from "./configs/web.config";
import corsMiddleware from "./middlewares/corsMiddleware";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import sessionMiddleware from "./middlewares/sessionMiddleware";
import router from "./router";

const app = express();
i18n.configure({
  locales: ['gb', 'ua', 'kz', 'ru'],
  defaultLocale: 'gb',
  directory: path.join(__dirname, 'locales'),
  objectNotation: true, // Allows nested translation objects
  updateFiles: false, // Don't save missing translations to files
});

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY || config.sesionKey,], // Replace with your secret keys
    maxAge: 60 * 60 * 1000, // 1 hours
  })
);



app.use(cookieParser());
app.use(useragent.express());
app.use(compression());
app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "../public")));

const staticResourceFolders = [
  "@popperjs/core/dist/umd",
  "bootstrap/dist",
  "@coreui/icons",
  "@coreui/chartjs/dist",
  "@coreui/coreui/dist",
  "@coreui/utils/dist/umd",
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(i18n.init);

app.set("view engine", "ejs");
app.use((req, res, next) => {
  // Pass i18n as a local variable for all rendered templates
  res.locals.i18n = i18n;
  next();
});
staticResourceFolders.forEach((folder) => {
  let folderName;
  if (folder.indexOf('dist') === -1 && folder.split('/').length === 2) {
    folderName = folder;
    app.use(`/static/${folderName}`, express.static(path.join(__dirname, `../../node_modules/${folder}`)));
  } else if (folder.indexOf('dist') !== -1) {
    folderName = folder.split('/dist')[0]; // Получить первый элемент от начала строки
    app.use(`/static/${folderName}`, express.static(path.join(__dirname, `../../node_modules/${folder}`)));

  } else {
    folderName = folder.split('/').shift(); // Получить первый элемент от начала строки
    app.use(`/static/${folderName}`, express.static(path.join(__dirname, `../../node_modules/${folder}`)));
  }
  app.use(`/static/${folderName}`, express.static(path.join(__dirname, `../../node_modules/${folder}`)));
});

app.use((req: Request, res: Response, next: NextFunction)  => {
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
    '/static/@coreui/utils/umd/index.js',
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

app.use((req: Request, res: Response, next: NextFunction)  => {
  if (req.session!.lang) {
    console.log(i18n.getLocale(req))
    i18n.removeLocale(i18n.getLocale(req))

    // Установите язык из сессии в i18n
    i18n.setLocale(req, req.session!.lang);
    console.log(i18n.getLocale(req))

  } else {
    i18n.setLocale(req, 'en');
    console.log(i18n.getLocale())
  }
  next();
});
app.use(expressLayouts);
app.enable("view cache");
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);
app.set("views", path.join(__dirname, "views"));



app.use(loggerMiddleware);
app.disable("x-powered-by");
app.disable("expires");
app.use(corsMiddleware);
app.use(sessionMiddleware);
router(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
export default app;
