const IdentityModel = require('../models/identity.model');
const crypto = require('crypto');
const bcrypt = require ('bcrypt'); 
exports.insert = (req, res) => {
    let salt = bcrypt.genSaltSync(16).toString();
    let hash = bcrypt.hash(req.body.password,salt,null);
    hash.
    then((resultat)=>{
        req.body.password = salt + "@" + resultat.toString("base64");
        req.body.permissionLevel = 1;
        IdentityModel.createIdentity(req.body)
            .then((result) => {
                res.status(201).send({id: result._id});
            }).catch((err)=>{ res.status(404).send("exists already");});

    });

};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    IdentityModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    IdentityModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.putById = (req, res) => {
    if (req.body.password) {
        let salt = bcrypt.genSaltSync(16).toString();
        let hash = bcrypt.hash(req.body.password,salt,null).toString("base64");
        req.body.password = salt + "@" + hash;
    }
    IdentityModel.putIdentity(req.params.userId, req.body)
        .then((result)=>{
            req.status(204).send({});
        });
};

exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = bcrypt.genSaltSync(16).toString();
        let hash = bcrypt.hash(req.body.password,salt,null).toString("base64");
        req.body.password = salt + "@" + hash;
    }
    IdentityModel.patchIdentity(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    IdentityModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};