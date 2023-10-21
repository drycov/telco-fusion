import { Request, Response, NextFunction } from 'express';

const getIndexPage = (req: Request, res: Response) => {
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

export default getIndexPage;
