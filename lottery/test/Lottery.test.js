const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const { abi, bytecode } = require('../compile')

const web3 = new Web3(ganache.provider())

let accounts
let lottery
beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottery', () => {
  it('can deploy the contract', () => {
    assert.ok(lottery.options.address)
  })
})
