const path = require('path')
const fs = require('fs')
const solc = require('solc')

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol')
const source = fs.readFileSync(lotteryPath, 'utf8')

// Compile statements
const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
const output = JSON.parse(solc.compile(JSON.stringify(input)))
  .contracts['Lottery.sol']
  .Lottery
const { abi, evm: { bytecode: { object } } } = output

exports.abi = abi
exports.bytecode = object
