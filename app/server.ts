//libs import
import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import useragent from "express-useragent";
import http from "http";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import process from "process";
import favicon from "serve-favicon";
//fuctions import
import config from "./configs/web.config";
import corsMiddleware from "./middlewares/corsMiddleware";
import errorHandler from "./middlewares/errorHandler";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import removeCommentsMiddleware from "./middlewares/removeCommentsMiddleware";
import router from "./router";

const app = express();

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en", // Default language if translation not available for user's preferred language
    ns: ["en", "ru"], // Namespace for translation keys
    defaultNS: "en",
    backend: {
      loadPath: __dirname + "/locales/{{lng}}.json",
    },
  });

app.use(i18nextMiddleware.handle(i18next));

app.use(
  session({
    secret: process.env.SESSION_KEY || config.sesionKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
  })
);

app.set("view engine", "ejs");

app.use(expressLayouts);
app.enable("view cache");
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);
app.set("views", path.join(__dirname, "views"));
// app.use(favicon(path.join(__dirname, "../public", "favicon.ico")));
app.use(favicon(path.join(__dirname, "../public/favicon.ico")));

// app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../public")));

// node_modules\@popperjs\core\dist\umd
app.use(
  "/static/popperjs",
  express.static(path.join(__dirname, "../node_modules/@popperjs/core/dist/umd"))
);
// node_modules\bootstrap-icons\font\bootstrap-icons.css
app.use(
  "/static/bootstrap-icons",
  express.static(path.join(__dirname, "../node_modules/bootstrap-icons/font"))
);
app.use(
  "/static/bootstrap",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist"))
);
app.use(
  "/static/coreui/icon",
  express.static(path.join(__dirname, "../node_modules/@coreui/icons"))
);
// vendors/@coreui/utils/js/coreui-utils.js
app.use(
  "/static/coreui/utils",
  express.static(path.join(__dirname, "../node_modules/@coreui/utils/dist/umd"))
);
app.use(
  "/static/coreui/coreui",
  express.static(path.join(__dirname, "../node_modules/@coreui/coreui/dist"))
);
app.use(
  "/static/chart.js",
  express.static(path.join(__dirname, "../node_modules/chart.js/dist"))
);
app.use(
  "/static/fortawesome",
  express.static(
    path.join(__dirname, "../node_modules/@fortawesome/fontawesome-free")
  )
);
app.use(
  "/static/jquery",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);


// node_modules/simplebar/dist/simplebar.css
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(removeCommentsMiddleware);

app.use(compression());
app.use(useragent.express());

app.use(loggerMiddleware);
app.disable("x-powered-by");
app.disable("expires");
app.use(corsMiddleware);

router(app);

app.use(errorHandler);

const server = http.createServer(app);

export default server;
