var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
var datacy = require('./novo.chain')
var priva = require('./priva')
var app = new express();

class Block {
    constructor(index, previousHash, timestamp, data, isPublic, restrictAccess, hash) {
        this.index = index;
        this.previousHash = previousHash
        this.timestamp = timestamp;
        this.metadata = {
          userData : data,
          restrictAccess : restrictAccess,
          isPublic : isPublic
        }
        this.hash = hash;
    }
}
