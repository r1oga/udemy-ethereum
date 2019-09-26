const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec

const compile = async () => {
  await exec('vyper -f abi contracts/Inbox.vy > contracts/InboxAbi',
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log('exec error ' + error)
      }
    }
  )

  await exec('vyper contracts/Inbox.vy > contracts/InboxBytecode',
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log('exec error ' + error)
      }
    }
  )
}

compile()
exports.interface = fs.readFileSync(path.join(
  __dirname,
  'contracts',
  'InboxAbi'
))
exports.bytecode = fs.readFileSync(path.join(
  __dirname,
  'contracts',
  'InboxAbi'
))
