var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
var novochain = require('./novo.chain')
var Contracts = require('./data.contracts')

var app = new express()


class UserData {
  constructor(data, sign, address, timestamp, keys) {
    this.data = data
    this.keys = {
      privateDataKey:'privateDataKey',
      makePublicDataKey: 'makePublicDataKey'
    }
    this.address = address
    this.timestamp = moment().format('x'),
    this.hash = novochain.calculateHash(this.timestamp.toString() + this.sign, data)
  }
}



// copy of a transaction that is sent to the sender
class TxIn {
  constructor(userData, from, to, id, sign, contract, timestamp){
    this.id = id
    this.userData = Contracts.lockData(userData.keys.makePublicDataKey, userData)
    this.timestamp = moment().format('x')
    this.from = from
    this.to = to
    this.sign = sign
    this.contract = Contracts.baseContract()
  }
}

// copy of a transaction that is sent to the new owner
class TxOut {
  constructor(data, from, to, id, timestamp) {
    this.id = id
    this.data = data
    this.timestamp = moment().format('x')
    this.from = from
    this.to = to

  }
}

var createUploadTX = (data, sign, address, isPrivate) => {
  var obj = new UserData(data, sign, address)
  obj.keys.makePublicDataKey = '0000'
  var txIn = new TxIn(obj, address)
  return txIn
}

var shardArray = []
var createShards = (userData, numberOfPeers) => {
  var size = userData.data.length
  var shardSize = size / numberOfPeers
  for (var i = 0; i < userData.data.length; i++) {
    if (i < shardSize) {
      shardArray.push(userData.data[i])
      console.log(shardArray);
    }
  }
}
console.log(createShards({data:'hello'}, 3));
console.log(createUploadTX('hello', 'j', '0000000', '','','00'));

app.get('/createShards/:data/:numberOfPeers', (req, res) => {
  res.send(createShards(req.params.data, req.params.numberOfPeers))
})

app.listen(3001, () => {
  console.log('server listening...\n');
})
