/**
 * Created by marti on 20.11.2016.
 */
var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var md5 = require('MD5');
var rest = require('./routes/rest');
var index = require('./routes/index');
var app = express();

var PORT = 3000;

function REST() {
    var self = this;
    self.connectMysql();
}

REST.prototype.connectMysql = function () {
    var self = this;

    var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'msipek.lima-db.de',
        user     : 'USER345765',
        password : 'YQ7sKVgbD',
        database : 'db_345765_7',
        debug    :  false
    });

    pool.getConnection(function(err,connection){
        if(err) {
            self.stop(err);
        } else {
            self.configureExpress(connection);
        }
    });
};

REST.prototype.configureExpress = function(connection) {
    var self = this;

    //View Engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    // Set Static Folder
    app.use(express.static(path.join(__dirname, 'client')));

    // Body Parser MW
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    var router = express.Router();
    app.use('/api', router);
    app.use('/', router);
    var rest_router = new rest(router,connection,md5);
    var router_ = new index(router);
    self.startServer();
};

REST.prototype.startServer = function() {
    app.listen(PORT,function(){
        console.log("All right ! I am alive at Port "+PORT+". Timestamp: "+ Date.now());
    });
};

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
};

new REST();