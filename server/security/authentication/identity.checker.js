const IdentityModel = require('../../identity/models/identity.model');
const uuidv4 = require('uuid/v4');
const validityTime = require('../../env.config.js').jwtValidityTimeInSeconds;

exports.hasAuthValidFields = (req, res, next) => {
    let errors = [];
    if (req.body) {
        if (!req.body.email) {
            errors.push('Missing email field');
        }
        if (!req.body.password) {
            errors.push('Missing password field');
        }
        if (errors.length) {
            return res.status(400).send({errors: errors.join(',')});
        } else {
            return next();
        }
    } else {
        return res.status(400).send({errors: 'Missing email and password fields'});
    }
};

const bcrypt = require('bcrypt'); 
exports.isPasswordAndUserMatch = (req, res, next) => {
    IdentityModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }else{
               // console.log('1111');
                let passwordFields = user[0].password.split('@');
                let salt = passwordFields[0];
                let hash = bcrypt.hash(req.body.password,salt,null);
                
                hash.
                then((resultat)=>{ 
                if (resultat.toString("base64") === passwordFields[1]) {
                    var now = Math.floor(Date.now() / 1000);
                    req.body = {
                        iss: 'urn:malekzied.xyz',
                        aud: 'urn:'+(req.get('origin')?req.get('origin'):"malekzied.xyz"),
                        sub: user[0].email,
                        name: user[0].firstName + ' ' + user[0].lastName,
                        userId: user[0]._id,
                        roles: user[0].permissionLevel,
                        jti: uuidv4(),
                        iat: now,
                        exp: now+validityTime
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid e-mail or password']});
                }
            });
            }
        });
};

exports.isUserStillExistsWithSamePrivileges = (req, res, next) => {
    IdentityModel.findByEmail(req.body.sub)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }
            req.body.roles = user[0].permissionLevel;
            return next();
        });
};