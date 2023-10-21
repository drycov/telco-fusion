"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getIndexPage = (req, res) => {
    const breadcrumbs = [{ label: req.t('labelpageTitles.labelHome'), url: '/' }];
    const htmlData = `<div class="card mb-4">
    <div class="card-body p-4">
      <div class="row">
        <div class="col">
          <div class="card-title fs-4 fw-semibold">Sale</div>
          <div class="card-subtitle text-disabled">January - July 2022</div>
        </div>
        <div class="col text-end text-primary fs-4 fw-semibold">$613.200</div>
      </div>
    </div>
    <div class="chart-wrapper mt-3" style="height:150px;">
      <canvas class="chart" id="card-chart-new1" height="150" style="display: block; box-sizing: border-box; height: 150px; width: 416px;" width="416"></canvas>
    </div>
  </div>`;
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
