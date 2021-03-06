const moment = require('moment')
const crypto = require('crypto')
const express = require('express')
const Cryptr = require('cryptr')
const _ = require('underscore')
const Math = require('math.js')
const compression = require('lzutf8')
const bodyParser = require('body-parser')
var app = new express();

var urlEncodedParser = bodyParser.urlencoded({ extended: false})

app.use(urlEncodedParser)

var user = {
  port: 3000,
  host:'111.1.1.1.1',
  address:'0x0000fff'
}

// Displays the current time
var currentTime = moment().format('x')

// Gets the tx  signature by encryption, using the address as the key, and the public key and current tine, as the target
var getSignature = (publicKey, address) => {
  var cryptr = new Cryptr(address.toString())
  return cryptr.encrypt(publicKey, moment().format('x'))
}

// Calculates the has by using a key and data to digest a  hash using sha256
exports.calculateHash = (key, data) => {
  const secret = key.toString();
  return crypto.createHmac('sha256', data)
                   .update(key.toString())
                   .digest('hex');
}

var calculateHash = (key, x) => {
  const secret = key.toString();
  const hash = crypto.createHmac('sha256', x)
                   .update(key.toString())
                   .digest('hex');
  return hash
}

// An array that stores blocks
exports.blockchain = [{index: 0, from:'genisis', to:user.address, data: 'test', metadata: {restrictAccess: [], allowAccess:['jordan']}, contract: { hardRules:{ isPrivate:'' }, abilities:[]}}]

var blockchain = [{index: 0, from:'genisis', to:user.address, data: 'test', metadata: {restrictAccess: [], allowAccess:['jordan']}, contract: { hardRules:{ isPrivate:'' }, abilities:[]}}]

var accounts = []

// finds block with data containing < 3 objects
var findEmptyBlock = () => {
  for (var i = 0; i < blockchain.length; i++) {
    if (blockchain[i].data.length < 3) {
      console.log('\nempty block\n');
      return i
    }
  }
}

class Account {
  constructor(name, address, willBuyData) {
    this.name = name
    this.address = address
    this.timestamp = moment().format('x');
    this.willBuyData = willBuyData
  }
}

// adds the created account data to a block in the ledger and can be used to reference the user info
var addAccount = (account) => {
  var empty = findEmptyBlock()
  blockchain[empty].data.push(account)
  console.log('\naccount created\n');
  return blockchain[empty]
}

// creates a block that can store data
class Block {
  constructor(index, previousHash, data, contract, hash, metadata, nonce) {

      this.index = index
      this.nonce = nonce
      this.signers = []
      this.previousHash = previousHash
      this.timestamp = moment().format('LLL')
      this.timestampMilliseconds = moment().format('x')
      this.metadata = {
          data: {
            transactions:[],
            },
          contract: this.contract,
        },
      this.hash = hash
  }
}

var calculateNonce = (latestBlock, numberOfPeers, blocks) => {
  return latestBlock.nonce * numberOfPeers * blocks
}

// creates the genisis block
var createGenisisBlock = () => {
  var newBlock = new Block('0', '', 'genisis', 'genisis', '', '', 1)
  newBlock.hash = calculateHash(newBlock.index.toString() + newBlock.timestamp.toString(), newBlock.metadata.toString())
  return newBlock
}

console.log(`Genisis Block\n ${createGenisisBlock()}`);

var getBits = (data) => {
  var data = data.toString()
  return data.length
}

var makePublicKey = (privateKey, account) => {
  if (privateKey.time < moment().format('x')) {
    var keypairs  = {
      publicKey : calculateHash(privateKey.hash.toString(), moment().format('x')),
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
  const hash = crypto.createHmac('sha256', secret)
                   .update(yourAccount.address + yourAccount.name)
                   .digest('hex');
   var obj = {
         hash:hash,
         time:yourAccount.timestamp.toString()
       }
     console.log('\nprivateKey\n', hash, '\n');
     return obj
}

var makePublicAddress = (account) => {
  account.publicWalletAddress = calculateHash(account.address.toString() + account.privateKey, account.publicKey) // theaddress frm the users account object and the private key are used to encrypt the target public key in order to make the wallrt adress shareable without exposing keys
  console.log('\nmakePublicAddress', account, '\n');
  return account
}

/*
mockPeers is a mock hard coded example network of peers and some of their data for test purposes.
*/
var mockPeers = [
  {
    port:3000,
    name: 'jordan',
    chain: [{index:0, data: ['',{
      name:'mailman',
      address: '',
      timestamp: moment().format('x'),
      isPostOfficeEmployee: 0,
      signature: getSignature([`publicKey`], [`publicAddress`])
    }]}]
  },
  {
    port:3001,
    name: 'brian',
    chain: [{index:0, data: ['',{
      name:'mailman',
      address: '',
      timestamp: moment().format('x'),
      isPostOfficeEmployee: 0,
      signature: getSignature([`publicKey`], [`publicAddress`])
    }]}]
  },
  {
    port:3002,
    name: 'neetesh',
    chain: [{index:0, data: ['',{
      name:'mailman',
      address: '',
      timestamp: moment().format('x'),
      isPostOfficeEmployee: 0,
      signature: getSignature([`publicKey`], [`publicAddress`])
    }]}]
  }
]

var baseEncrypt = (data, x) => {
  var cryptr = new Cryptr(x)
  var encrypt = cryptr.encrypt(data)
  return encrypt
}

var getLatestBlock = () => {
  return blockchain[blockchain.length - 1]
}

var newBlock = (index, previousBlock, name, toAddress, fromAddress, data, contract, metadata ) => {
  var block = new Block(index, previousBlock.hash, name, toAddress, fromAddress, data, contract, metadata)

  block.hash = calculateHash(index + block.previousHash.toString() + signers, block.timestamp + block.metadata)
  console.log('\nnew block', block);
  return block
}



// adds a block if the blockchain is determined valid by the isNewBlockValid function which is yet to be added
var addBlock = (block, isNewBlockValid) => {
  if (isNewBlockValid === true) {
    blockchain.push(block)
    console.log(blockchain);
    return 'added'
  } else {
    return 'invalid block. function addBlock'
  }
}

// function test
// addBlock(newBlock(1, 'jordan', '157 hazelwood rd', '950 a deleware ave', []), true)

// a mock letter
// var letter1 = newLetter(0, 'jordan', '157 hazelwood rd', 'dayton', '', 'hello old home', 1)

var signBlock = (block, x) => {
  var cryptr = new Cryptr(x)

  block.hash = cryptr.encrypt(block.hash)
  block.signers.push(x)
  return block
}

// console.log(measureContents(1, 2.4));

var compareSize =(received, blockchain) => {
  if (received.length === blockchain.length) {
    return true
  }
  else {
    return false
  }
}

var generateNextBlock = () => {
  var latest = getLatestBlock()
  var latestIndex = latest.index
  var thisIndex = latestIndex + 1
  return new Block(thisIndex)
}

var scanBlock = (block, signature) => {
  var signed = signLetter(block.hash, signature)
  return signed
}

var getPeerChains = () => {
  var peerChains = []

  for (var i = 0; i < mockPeers.length; i++) {
    peerChains.push(mockPeers[i].chain)
  }
  return peerChains
}

var allChains = getPeerChains()

var majority = (peers) => { // determines the majority as a number being 51% of the network
  var size = peers.length
  var half = size / 2
  var number = ''

  half = half.toString()

  console.log('majority', parseInt(half) + 1);
  return number + 1
}

var compareChainLength = (allChains) => {
  var most = majority(allChains) // gets the number of perople required for majority
  var matched = 1 // we start this at 1 because when the peer is checked there would be 2 matches if they match
  var matchIndexes = [] // indexes of the matching records
  var f = 0
  for (var i = 1; i <= most;) {
    if (allChains[i].length === allChains[f].length) { // if chain 0 == chain 1 then 1 is incrementally increased to the next whole number and tecord 0 is compared to 2
      matched + 1 // if they match the # of matches increment 1
      matchIndexes.push(i)
      matchIndexes.push(f)
      i++ // i increases if there is a match
      console.log(matchIndexes);

    }
  }
  if (matched == most) { // if the number of matches === the number required for majority
    return 'consensus' // return consensus
  }
  else {
    return 'majority disagree on copy' // if anything else return majority disagree
  }
}

var verificationData = ''

var verifyNewBlock = (newBlock, blockchain) => {
  var latestBlock = getLatestBlock()
  if (newBlock.index === 0) { // checks to see if block created is genesis block
    var indexDiff = newBlock.index - latestBlock.index - 1
    console.log('cannot change data in the genisis block (index : 0) or add data behind it.');
    return '0 index'
  }
  else if (newBlock.timestamp < latestBlock.timestamp && newBlock.index <= latestBlock.index) { // if new blocks timestamp is before the last blocks timestamp then it throws a time err
    console.log('time err : new block has earlier time than latest');
    return 'time err'
  } else if (latestBlock.index > newBlock.index){ // verifies if the new blocks index is less than the last blocks and throws a dispute
    console.log('earlier block being disputed');
    var dispute = {
      disputed: blockchain[newBlock.index],
      suggested: newBlock
    };
    verificationData = dispute
    return 'dispute'
  }
  else if (latestBlock.index + 1 != newBlock.index && latestBlock.index <= newBlock.index) {
    var indexDiff = newBlock.index - latestBlock.index - 1
    console.log(`index err : ${latestBlock.index} not equal to ${newBlock.index} : search for ${indexDiff} missing block(s) with the indexes between ${latestBlock.index} & ${newBlock.index}`);
    return {
      action: 'blockSearch',
      data: {
        indexDiff: indexDiff,
        latestBlockIndex: latestBlock.index,
        newBlockIndex: newBlock.index,
        findBlocks: function (peer, ...blocks) {

        }

      }
    }
  }
}

//Calculates the amount of verifications that will take place
var calcVerification = (amountUsers, chainLength) => {
    var fullAmount = amountUsers * (chainLength) * amountUsers
    var fullAmountReduced = amountUsers / 2 * (chainLength) * (amountUsers / 2)

    var amountVerifications = amountUsers / 2 * (chainLength) + 1
    var percentReduced = 100 - fullAmountReduced / fullAmount * 100
    console.log( `Percent reduced is ${percentReduced}%,  ${amountVerifications} comparisons for 50% of the users to verify ${chainLength} records.. ${fullAmount} comparisons for all users to verify ${chainLength} records for 50% users , ${fullAmountReduced} comparisons for 50% of the users to verify ${chainLength} records by pinging 50% of the users`
  );
    return fullAmountReduced
}

// checks to see if the sender sending data is the owner of the block
var verifySenderSentData = {
  byName: function (block) {
    for (var i = 0; i < mockPeers.length; i++) {
      if (mockPeers[i].name === block.name && mockPeers[i].chain[block.index].name == mockPeers[i].name) {
        console.log('name match. check for time error');
        return mockPeers[i].chain[block.index]
      } else if (mockPeers[i].name === block.name && mockPeers[i].chain[block.index].name !== mockPeers[i].name) {
        console.log('found peer. no match in chain');
        return 'no match'
      } else {
        return 'no data found'
      }
    }
  },

}

// Finds the difference between 2 blocks
var findBlockDifference = (a, b) => {
  var different = _.difference(a,b)
  return different
}

// An object containing all the consensus mechanisms (functions)
var consensusMechanisms = {
  compareChainLength: compareChainLength,
  verifySenderSentData: verifySenderSentData,
  verifyNewBlock: verifyNewBlock,
  findBlockDifference: findBlockDifference
}


var compareLast = (peer, peers) => {
  var lastIndex = peers[peers.length - 1]

}

app.get('/blocks/:data', (req, res) => {
  var latestBlock = getLatestBlock()
  var newblock = new Block(getLatestBlock(), blockchain[latestBlock.index].hash, req.params.data)
  console.log('new block test', newblock);
  res.send(newblock)
})

app.post('/blocks/:data', urlEncodedParser, (req, res) => {

	const block = somefunction (req.body.data);
	console.log()
	res.redirect('/blocks');

})

app.get('/verifySenderSentData/:block', (req, res) => {
  res.send(verifySenderSentData.byName(req.params.block))
})

app.get('/verifyNewBlock/:block', (req, res) => {
  res.send(verifyNewBlock(req.params.block, blockchain))
})

app.get('/findBlockDifference/:block1/:block2', (req, res) => {
  res.send(findBlockDifference(req.params.block1, req.params.block2))
})

app.get('/addBlock/:block', (req, res) => {
  res.send(addBlock(req.params.block, isNewBlockValid))
})

app.get('/calculateNonce/:numberOfPeers/:block', (req, res) => {
  res.send(calculateNonce(getLatestBlock(), req.params.numberOfPeers, req.params.block))
})

app.get('/generateNextBlock', (req, res) => {
  res.send(generateNextBlock())
})

app.get('/getBits/:data', (req, res) => {
  res.send(getBits(req.params.data))
})

//sign block
// console.log('\n',signLetter(blockchain[1], getSignature('jordan', moment().format('x'))));
// starts server

app.listen(3000, () => {
  console.log('\npost.chain : active...');
})
