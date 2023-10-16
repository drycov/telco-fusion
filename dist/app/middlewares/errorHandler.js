"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
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
    // res.status(500).send('Internal Server Error');
};
exports.default = errorHandler;
