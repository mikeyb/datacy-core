var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
// var datacy = require('./novo.chain')
// var priva = require('./priva')
var app = new express();

var user = {
  port: 3000,
  host:'111.1.1.1.1',
  address:'0x0000fff'
}

class Block {
    constructor(index, previousHash, timestamp, data, contract, hash) {
        this.index = index;
        this.previousHash = previousHash
        this.timestamp = timestamp;
        this.metadata = {
          data:data,
          contract:this.contract
        }
        this.hash = hash;
    }
}

var blockchain = [{index: 0, from:'genisis', to:user.address, data: 'test', metadata: {restrictAccess: [], allowAccess:['jordan']}, contract: { hardRules:{ isPrivate:'' }, abilities:[]}}]

var baseContract = () => { // returns a json object that can be used to add functions to when creating contracts
  var template = {
    hardRules: {},
    abilities: [],
    workerBots: []
  }

  return template
}

console.log(baseContract());

var lockData = (key, data) => { // encrypts or locks data with a key. The data can be unlocked with the same key
  console.log(`\nData Length : ${data.length}`);

  const cipher = crypto.createCipher('aes192', 'a password');
  let encrypted = cipher.update('some clear text data', 'utf8', 'hex');

  encrypted += cipher.final('hex');

  console.log(`Encrypted Length : ${encrypted.length}`);

  return encrypted
}

var allowAccess = (record, ...peers) => {
  var peers = peers
  for (var i = 0; i < peers.length; i++) {
    record.metadata.allowAccess.push(peers[i])
  }
  return
}

console.log('allowAccess', allowAccess(blockchain[0],'jordan'));
console.log('lockData', lockData('accessKeys', blockchain[0]));

var contractAbilities = {
  restrictAccess: function (peer, index) {
    blockchain[index].metadata.restrictAccess.push(peer) // puts the restricted wallet address into the restrictAccess array
    return blockchain[index] //returns block
  },
  allowAccess: allowAccess,

  lockData:lockData,
}

var makePrivate = (record) => { // turns the record private
  record.contract.hardRules.isPrivate = true
  record.metadata.allowAccess = []
  return record
}

console.log('makePrivate', makePrivate(blockchain[0]));

var isThisUserOwner = (record) => {
  if (record.to === user.address) {
    console.log('this user is the owner');
    return true
  }
  else {
    console.log('this user is not the owner');
    return false
  }
}

var isOwner = (peer, data, blockchain) => {
  var refRecord = _.findWhere(blockchain, { data:data, to:peer })
  return refRecord
}

var findData = (data, blockchain) => {
  var db = blockchain
  var match = _.where(db, {data:data})
  console.log(match);
  return match
}

var findPayment = (address) => {
  var match = _.where(blockchain, {to: address})
  if (match.length === 0) {
    return false
  }
  else {
    console.log('match found');
    return match
  }
}

var mostRecentOwner = (data, blockchain) => {
  var record = _.findWhere(blockchain, { data:data })
  return record.to
}


console.log('mostreceent', mostRecentOwner('test', blockchain), '\n');
console.log('findData', findData('test', blockchain), '\n');
console.log('isOwner', isOwner('0x0000fff', 'test', blockchain), '\n');
console.log('isThisUserOwner', isThisUserOwner(blockchain[0]), '\n');

var contractWorkers = {
}

console.log(contractAbilities.restrictAccess('some', 0))
