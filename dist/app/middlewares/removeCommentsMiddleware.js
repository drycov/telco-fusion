"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeCommentsMiddleware(req, res, next) {
    const originalRender = res.render;
    res.render = function (view, options, callback) {
        const newCallback = (err, html) => {
            if (callback) {
                // Удалить комментарии из HTML перед вызовом callback
                callback(err, removeComments(html));
            }
            else {
                // Удалить комментарии из HTML и отправить клиенту
                res.send(removeComments(html));
            }
        };
        originalRender.call(res, view, options, newCallback);
    };
    next();
}
function removeComments(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
}
exports.default = removeCommentsMiddleware;
