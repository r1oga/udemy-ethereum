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
    const player = await lottery.methods.players(0).call()
    assert.equal(player, accounts[0], 'No player was added')

    const players = await lottery.methods.getPlayers().call()
    assert.equal(players[0], accounts[0], 'could not pick player')
    assert.equal(players.length, 1, 'wrong length of players array')
  })

  it('can enter multiple players', async () => {
    // enter 3  players
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
      assert.equal(
        players[i],
        act,
        'could not get player or wrong player entered')
    })
    assert.equal(players.length, 3, 'wrong length of players array')
  })

  it('can pick a winner', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.1', 'ether')
    })

    const balanceBefore = await web3.eth.getBalance(accounts[0])
    const tx = await lottery.methods.pickWinner().send({ from: accounts[0] })
    const balanceAfter = await web3.eth.getBalance(accounts[0])

    assert.equal(
      tx.events.winner.returnValues[0],
      accounts[0],
      'wrong event emitted')
    assert(balanceBefore < balanceAfter, 'no money transfer')
  })
})
