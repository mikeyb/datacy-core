var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var compression = require('lzutf8')
var Math = require('math.js')
var os = require('os')
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
          data:{
            transactions:[]
          },
          contract:this.contract
        }
        this.hash = hash;
    }
}

var blockchain = [
  {
    index: 0,
    from:'genisis',
    to:user.address,
    data: 'test',
    metadata: {
      data: {
      transactions: []
    },
    contract:{
      hardRules: {
        isPrivate:'',
        restrictAccess: [],
        allowAccess:['jordan'],
      },
      abilities: []
}
},}]

var baseContract = () => { // returns a json object that can be used to add functions to when creating contracts
  var template = {
    hardRules: {},
    abilities: [],
    workerBots: []
  }

  return template
}

console.log(baseContract());

/*
lockData {function} - encrypts data with aes192
@params
- key {string} - a string used to lock data
- data {string} - a string o data
*/

exports.lockData = (key, data) => { // encrypts or locks data with a key. The data can be unlocked with the same key
  // console.log(`\nData Length : ${data.toString().length}`);

  const cipher = crypto.createCipher('aes192', key.toString());
  let encrypted = cipher.update(data.toString(), 'utf8', 'hex');

  encrypted += cipher.final('hex');

  console.log(`Encrypted Length : ${encrypted.length}`);

  return encrypted
}

/*
unlockData {function} - unlocks aes192 encrypted data with the key
@params
key {string} - the key used to lock the data
data {string} the encrypted string of data
*/

var unlockData = (key, encrypted) => {
  var decipher = crypto.createDecipher('aes192', 'a password');

  var  encrypted = encrypted
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  console.log(decrypted);

  return decrypted
}

var allowAccess = (record, ...peers) => {
  var peers = peers
  for (var i = 0; i < peers.length; i++) {
    record.metadata.contract.hardRules.allowAccess.push(peers[i])
  }
  return
}

// console.log('allowAccess', allowAccess(blockchain[0],'jordan'));
// console.log('lockData', lockData('accessKeys', blockchain[0]));

var contractAbilities = {
  restrictAccess: function (peer, index) {
    blockchain[index].metadata.contract.hardRules.restrictAccess.push(peer) // puts the restricted wallet address into the restrictAccess array
    return blockchain[index] //returns block
  },
  // allowAccess: allowAccess,
  //
  // lockData:lockData,
}

exports.makePrivate = (record) => { // turns the record private
  record.metadata.contract.hardRules.isPrivate = true
  record.metadata.contract.hardRules.allowAccess = []
  return record
}

// console.log('makePrivate', makePrivate(blockchain[0]));

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

var compress = (data) => {
  var data = data
  var output = compression.compress(data, {outputEncoding: 'StorageBinaryString'})
  console.log(`\nData Size : ${data.length} \nCompressed Size : ${output.length}`);
  return data
}
// var compressData =compress(lockData('key', blockchain.toString()))

var decompress = (input, inputEncoding, outputEncoding) => {
  var decompressed = compression.decompress(input, {outputEncoding:outputEncoding, inputEncoding:inputEncoding})
  console.log(`Decompression, ${decompressed}\n`);
  return decompressed
}


// console.log(decompress(compressData, 'StorageBinaryString', 'ByteArray'));
// console.log('mostreceent', mostRecentOwner('test', blockchain), '\n');
// console.log('findData', findData('test', blockchain), '\n');
// console.log('isOwner', isOwner('0x0000fff', 'test', blockchain), '\n');
// console.log('isThisUserOwner', isThisUserOwner(blockchain[0]), '\n');
// console.log('cpus\n', os.cpus());
var contractWorkers = {
}

// console.log(contractAbilities.restrictAccess('some', 0))

app.get('/tests/compress/:data', (req,res) => {
  res.send(compress(req.params.data))
})

app.on(3011, () => {
  console.log('server listening...');
})
