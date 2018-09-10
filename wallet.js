var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')
var novochain = require('./novo.chain')

var makePublicKey = (account) => {
  if (privateKey.time < moment().format('x')) {
    var keypairs  = {
      publicKey : novochain.calculateHash(account.address, currentTime),
    }
    account.publicKey = keypairs.publicKey
    console.log('\n makePublicKey\n', account, '\n');
    return account
  } else {
    return 'time error'
  }
}

var makePrivateKey = (yourAccount) => {
  const secret = currentTime.toString();
  const hash = crypto.createHmac('sha256', yourAccount.publicKey + currentTime)
                   .update(yourAccount.address + yourAccount.publicKey)
                   .digest('hex');
   var obj = {
         hash:hash,
         time:yourAccount.timestamp.toString()
       }
     console.log('\nprivateKey\n', hash, '\n');
     return obj
}

var makePublicAddress = (account) => {
  account.publicWalletAddress = calculateHash(currentTime.toString() + account.privateKey, account.publicKey + account.privateKey) // theaddress frm the users account object and the private key are used to encrypt the target public key in order to make the wallrt adress shareable without exposing keys
  console.log('\nmakePublicAddress', account, '\n');
  return account
}

var shareableWallet = (account) => {
  var shareable = {
    address: account.publicWalletAddress,
    publicKey: account.publicKey
  }
}

var openWallet = (wallet, privateKey) => {
  var hashCreated = novchain.calculateHash(wallet.address.toString() + privateKey, wallet.publicKey)
  if (hashCreated === wallet) {
    return true
  }
  else {
    return false
  }
}

var restoreWallet = () => { // should requst block data from a peer and save all records. Each record belonging to the user will need to be signed with the privaate key yto create a spendable transaction

}
