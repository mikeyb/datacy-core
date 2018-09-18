var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
var novochain = require('./novo.chain')

console.log('_______________\n\nPRIVA\n');


var send = (host, peer, to, amount) => { // performs a post request to your peers address
  var options = { method: 'POST',
  url: `http://${host}:${peer}/blocks/${to}/${amount}`,
  headers:{ 'Postman-Token': 'd6b43245-53a3-063a-7b94-85aff6374e69',
     'Cache-Control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    return body.toString()
    console.log('body', body);
  });

}

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

exports.makeBlock = (index, data) => {
  var block = new Block(index, novochain.blockchain[novochain.blockchain.length - 1].hash, moment().format('x'), data)
  block.hash = novochain.calculateHash(index.toString() + block.metadata.toString() + block.timestamp.toString(), data)
  return block
}
// console.log(makeBlock(1,'0'));



var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var day = moment().format('ll')
    var hour = moment().format('LTS')
    var nextTimestamp = day + ' ' + hour;

    var block = new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData)
    var nextHash = calculateHash(block);
    block.hash = nextHash
    return block
};

var createBlockWithTransaction = (blockData) => {
  var block = generateNextBlock(blockData)
  return block
}

var lockData = (key, data) => { // encrypts or locks data with a key. The data can be unlocked with the same key
  console.log(`\nData Length : ${data.length}`);
  var cryptr = new Cryptr(key.toString())
  var encrypted = cryptr.encrypt(key, data + moment().format('X'))
  console.log(`Encrypted Length : ${encrypted.length}`);
  return encrypted
}

console.log(lockData('test', '00000000000000000000000000000000000000000'));

var compressData = (key, data) => {
  console.log(`\nData Length : ${data.length}`);
  var cryptr = new Cryptr(key.toString()) // place key in here MUST BE STRING
  var encrypted = cryptr.encrypt(key, data) // encrypts data
  var compressAmount = (encrypted.length / data.length) * 100 // calculates what % smaller the encrypted data is compared to the raw data
  console.log(`Encrypted Length : ${encrypted.length}`);
  console.log(`Compression Amount (%) : ${compressAmount}%`);
  return encrypted // encrypted string
}

console.log(compressData('testKey', 'l'));

app.get('/tests/compress/:key/:data', (req, res) => {
  console.log('data compression');
  res.send(compressData(req.params.key, req.params.data.toString()))
})
app.get('tests/createData/:wallet/:data/:restrictions/:isPrivate', (req, res) => {

})

app.listen(3010, (req, res) => {
  console.log('priva listening on port 3010');
})
