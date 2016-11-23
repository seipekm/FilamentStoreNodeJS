/**
 * Created by marti on 20.11.2016.
 */

function ROUTER(router) {
    var self = this;
    self.handleRoutes(router);
}

ROUTER.prototype.handleRoutes= function(router) {
    router.get('/', function (req, res, next) {
        res.render('index.html');
    });
};

module.exports = ROUTER;