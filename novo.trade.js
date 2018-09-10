var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
var novochain = require('./novo.chain')
var currentTime = moment().format('x')

// An array that stores a mock blockchain, in production it should read from novo.chain
var blockchain = [
  {index:0, data: ['',{
  from:'jordan',
  to: 'test',
  asset:'dollars',
  value: 1,
  spent: {
    from:'ico',
    to:'jordan',
    value:10000,
    asset:'dollars'
  },
  timestamp: moment().format('x'),
  signature: '0xk30303'

}],
    hash: 'ee183d1e0c62bb55bfbf69f268fd6c08c42f86248de529b9298bd27750836577'
    },
    {index:0, data: ['',{
      name:'jordan',
      address: '950 a deleware ave',
      timestamp: moment().format('x'),
      isPostOfficeEmployee: 0,
      signature: '0xk30303'

    }],
      hash: 'ee183d1e0c62bb55bfbf69f268fd6c08c42f86248de529b9298bd27750836577'
    }]



var getBits = (data) => {
  var data = data.toString()
  return data.length
}

var sellData = (from, data, isPrivate, get, getAmt, signature) => {
  var asset = {
    from: from,
    sell:'bytes',
    sellAmt: getBits(data),
    private: isPrivate,
    get: get,
    getAmt:getAmt,
  }
  if (asset.private === true) {
    var cryptr = new Cryptr(signature)
    asset.data = cryptr.encrypt(data)
    return asset

  } else {
    return asset
  }
}

// console.log('selldata',sellData('jordan', 'name', true, 'gold', 0.003, '0xodpnb9898'));

var createSell = (from, to, sell, get, sellAmt, getAmt, marketType) => {
  var TradeRecord = {
    from:from,
    to: to,
    sell: sell,
    sellAmt:sellAmt,
    get: get,
    getAmt: getAmt,
    marketType: marketType,
    timestamp: currentTime,
    signatures: []
  }
  TradeRecord.hash = novochain.calculateHash(sell + get + sellAmt + from + to + currentTime + TradeRecord.signatures.length, TradeRecord.signatures.toString())
  return TradeRecord
}

// console.log('\nNew Trade\n', createSell('USDollars', 'gold', 40, 2, 'limit'));

// create sent record to send to peer create remaining record to send to self and peer
var createReceipts = (send, signature) => {
  var remaining = send.spent.value - send.value
  // the remaining balance for the sender must be converted to ustxo for spending
  var obj = {
    from : send,
    to: send.from,
    asset:send.asset,
    value: remaining,
    signature: signature,
    timestamp:currentTime,

    hash: novochain.calculateHash([`to`] + [`timestamp`] + [`value`], signature)

  }

  //the additional balance to send to receiver to turn to USTXO
  var obj2 = {
    from : send.from,
    to: send.to,
    asset:send.asset,
    value: send.value,
    spent: send.spent,
    signature: signature,
    timestamp:currentTime,
    hash: novochain.calculateHash([`to`] + [`timestamp`] + [`value`], signature)


  }
  return [obj, obj2]
}

// creates a transactionOut object
class txOut {
  constructor(from, to, asset, value, signature, spent, hash) {
    this.from = from
    this.to = to
    this.asset = asset
    this.value = value
    this.signature = signature
    this.timestamp = currentTime
    this.spent = spent
    this.hash = novochain.calculateHash(from + to + currentTime.toString(), signature)
    this.contract = {
      createReceipts: createReceipts,
    }
  }
}

var testtx = (new txOut('jordan', 'test', 'dollars', 1, '0xc', blockchain[0].data[1].spent));

console.log(testtx);

console.log('receipts', createReceipts(testtx, '0xc'));

// returns the block data from a single block
var getBlockData = (block) => {
  console.log(`\n Block Data  ${block.data}`);
  return block.data
}

console.log(novochain.newLetter('1','1'));

var findDirectExchange = (ledger, search) => {
  for (var i = 0; i < ledger.length; i++) {
    if(ledger[i].get == search.sell && ledger[i].sell == search.get) {
      console.log(ledger[i], search);
      return true
    }
  }
}

// calculates the price of an asset in return for another based on matching records that can exchange
var calculateAssetPrice = (sell, get, sellAmt, getAmt) => {
  var sellAsset = getAmt / sellAmt
  var getAsset = sellAmt / getAmt
  console.log(`1 of ${sell} is worth ${sellAsset} of ${get}`);
  return {sellAssetPrice:sellAsset}
}

// converts block data to a single array of records
var convertBlockToMarket = (blockchain) => {
  var MARKET = []
  for (var i = 0; i < blockchain.length; i++) {
    var block = blockchain[i]
    var marketData = getBlockData(block)
    for (var k = 0; k < marketData.length; k++) {
      MARKET.push(marketData[k])
    }
  }
  return MARKET
}

var dataMarketRatio = (data, market) => {
  var dataSize = getBits(data)
  var marketSize = getBits(market)
  var decimal = dataSize / marketSize
  return decimal*100
}

var dataMarketValueRatio = (data, market) => {
  return data / market * 100
}
console.log('dataMarketValueRatio',dataMarketValueRatio(50, 1000));
var marketArray = convertBlockToMarket(blockchain)

console.log(`\nData to Market Ratio\n`, dataMarketRatio('0', marketArray), '%\n');

console.log(calculateAssetPrice('usd', 'gold', 10, 1));

var getFee = (amount, ratio) => {
  var decimal = ratio / 100
  var fee = amount * decimal
  return fee
}

console.log(getFee(11, dataMarketRatio('0', marketArray)));

var exchangeContract = {
  findDirectExchange: findDirectExchange,
  createReceipts: createReceipts,
}
