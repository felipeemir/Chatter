//Arquivo onde será feita a conexão com o BD

"use strict";
const mongodb = require('mongodb');
const assert = require('assert');

class Db{
    
    constructor(){
        this.mongoClient = mongodb.MongoClient;
        this.objectId = mongodb.ObjectId;
        this.mongoUrl = `mongodb://127.0.0.1:27017/db_teste`;
    }
    
    onConnect(callback){
        this.mongoClient.connect(this.mongoUrl, (err, db) => {
            assert.equal(null, err);
            callback(db, this.objectId);
        });
    }
    
}

module.exports = new Db();