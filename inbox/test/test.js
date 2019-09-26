const fs = require('fs')

const abi = JSON.parse(fs.readFileSync('../contracts/InboxAbi'))

console.log(abi)
