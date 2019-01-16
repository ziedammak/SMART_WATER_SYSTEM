const config = require('./env.config.js');

const express = require('express');
const main = express();
const bodyParser = require('body-parser');

const SecurityRouter = require('./security/routes.config');
const IdentityRouter = require('./identity/routes.config');

config.initRefreshSecret();

//voir Helmet.md
const tls = require('spdy'); //http2 + https (tls)
const fs = require('fs');
let helmet = require('helmet');

const options = {
    key: fs.readFileSync('./tls/test-key.pem'),
    cert: fs.readFileSync('./tls/test-cert.pem')
};

main.use(helmet());

main.use(function (req, res, next) {
    whiteList = ['http://localhost:8100']; 
    res.header('Access-Control-Allow-Origin', whiteList);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

main.use(bodyParser.json());
SecurityRouter.routesConfig(main);
IdentityRouter.routesConfig(main);

tls.createServer(options, main).listen(config.port, (error) => {
        if (error) {
            console.error(error);
            return process.exit(1)
        } else {
            console.log('express main configured with HTTP2 and TLSv1.2 and listening on port: ' + config.port + '.')
        }
    });
