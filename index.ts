import crypto from 'crypto'
const SHA256 = (message: string): string => crypto.createHash("SHA256").update(message).digest('hex')

interface Data {
  from: string
  to: string
  amount: number
}

class BlockChain {
  chain: Block[]
  constructor() {
    this.chain = [new Block(Date.now().toString(), {from:"",to:"",amount:0})]
  }
  getLastBlock(): Block {
    return this.chain[this.chain.length-1]
  }
  addBlock(block: Block) {
    block.prevHash = this.getLastBlock().hash
    block.hash = block.getHash()
    this.chain.push(Object.freeze(block))
  }
  validateChain(blockchain=this): boolean | undefined {
    for(let i=1; i<blockchain.chain.length; i++) {
      if(blockchain.chain[i].prevHash !== blockchain.chain[i-1].hash || blockchain.chain[i].hash !== blockchain.chain[i].getHash()) {
        return false
      } else {
        return true
      }
    }
  }
}

class Block {
  timestamp: string
  data: Data
  hash: string
  prevHash: string
  constructor(timestamp:string="", data: Data) {
    this.timestamp = timestamp
    this.data = data
    this.hash = this.getHash()
    this.prevHash = ""
  }
  getHash(): string {
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data))
  }
}

let chain = new BlockChain()
chain.addBlock(new Block(Date.now().toString(), {from: "Alex", to: "Tim", amount: 12}))
chain.addBlock(new Block(Date.now().toString(), {from: "Justin", to: "Alex", amount: 4}))
chain.addBlock(new Block(Date.now().toString(), {from: "Oleg", to: "Justin", amount: 40}))
chain.addBlock(new Block(Date.now().toString(), {from: "Ida", to: "Oleg", amount: 1}))
console.log(chain)
console.log(chain.validateChain())