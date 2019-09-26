const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const { interface, bytecode } = require('../compileVyper')
const web3 = new Web3(ganache.provider())

let accounts
let inbox
beforeEach(async () => {
  // get accounts
  accounts = await web3.eth.getAccounts()

  // use one account for deployment
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // argument= ABI as JS (needs to be parsed). Tells web3 about what methods an inbox contract has. But tells nothing about what data is in the contract or when it was deployed...
    .deploy({ data: bytecode, arguments: ['Hi There'] }) // tells web3 we want to deploy a new contract, arguments= array of arguments for the constructor of the contract
    .send({ from: accounts[0], gas: '1000000' }) // instructs web3 to send out tx to actually create instance of contract
})

describe('Inbox', () => {
  it('can deploy contract', () => {
    assert.ok(inbox.options.address)
  })

  it('initializes with default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hi There')
  })

  it('can modify the message', async () => {
    const newMessage = 'Bye'
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0]})
    assert.equal(await inbox.methods.message().call(), newMessage)
  })
})
