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

  it('can enter one player', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    })
    assert.equal(
      await lottery.methods.players(0).call(),
      accounts[0]
    )
  })

  it('can enter multiple players', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    })
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.1', 'ether')
    })
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.1', 'ether')
    })

    const players = await lottery.methods.getPlayers().call()
    accounts.slice(0, 3).forEach((act, i) => {
      assert.equal(act, players[i])
    })
  })

  it('require a minimum of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.001', 'ether')
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('require to be manager to pick a winner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('manager can pick a winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.1', 'ether')
    })
    const balanceBefore = await web3.eth.getBalance(accounts[1])
    const { events: { winner: { returnValues } } } = await lottery.methods.pickWinner().send({ from: accounts[0] })
    const balanceAfter = await web3.eth.getBalance(accounts[1])

    assert.equal(returnValues[0], accounts[1])
    assert(balanceBefore < balanceAfter)
  })
})
