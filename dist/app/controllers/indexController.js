"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIndexPage = (req, res) => {
    const breadcrumbs = [{ label: req.t('labelpageTitles.labelHome'), url: '/' }];
    const htmlData = '<strong>This is bold HTML content.</strong>';
    // Ваш код для обработки запроса на страницу "index" здесь
    res.render('pages/index', {
        title: req.t('labelpageTitles.labelHome'),
        name: req.t('labelpageTitles.labelHome'),
        breadcrumbs: breadcrumbs,
        htmlData
        // Другие данные, которые нужно передать в представление
    });
};
exports.default = getIndexPage;
