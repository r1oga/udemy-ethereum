const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const fs = require('fs')
const path = require('path')
const { abi, bytecode } = require('./compile')

const mnemonic = fs.readFileSync('../.mnemonic').toString().trim()
const infuraKey = fs.readFileSync('../.infuraKey').toString().trim()

const provider = new HDWalletProvider(
  mnemonic,
  `https://rinkeby.infura.io/${infuraKey}`
)
const web3 = new Web3(provider)
// define function so that we can use await/async syntax (optional)
const deploy = async () => {
  const accounts = await web3.eth.getAccounts()
  console.log('Trying to deploy from account', accounts[0])
  const inbox = await new web3.eth.Contract(abi)
    .deploy({ data: '0x' + bytecode })
    .send({ from: accounts[0], gas: '1000000' })
  console.log(JSON.stringify(abi))
  console.log('Contract deployed to', inbox.options.address)
}
deploy()
