var moment = require('moment')
var crypto = require('crypto')
var express = require('express')
var Cryptr = require('cryptr')
var _ = require('underscore')
var Math = require('math.js')

// copy of a transaction that is sent to the sender
class TxIn {
  constructor(data, timestamp, from, to, id){
    this.id = id
    this.data = data
    this.timestamp = timestamp
    this.from = from
    this.to = to
  }
}

// copy of a transaction that is sent to the new owner
class TxOut {
  constructor(data, timestamp, from, to, id) {
    this.id = id
    this.data = data
    this.timestamp = timestamp
    this.from = from
    this.to = to

  }
}
