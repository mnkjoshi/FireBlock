import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const BLOCKCHAIN_FILE = path.join(process.cwd(), 'blockchain-data.json');

/**
 * Simple Private Blockchain Implementation
 * No gas fees, self-contained blockchain for FireBlock
 */

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Low difficulty for private blockchain
    this.loadFromFile(); // Load existing blockchain if available
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), {
      type: 'genesis',
      message: 'FireBlock Genesis Block - Immutable Fire Safety Records'
    }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const latestBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      data,
      latestBlock.hash
    );
    
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveToFile(); // Save after adding block
    return newBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChain() {
    return this.chain;
  }

  getBlock(index) {
    return this.chain[index];
  }

  getBlockById(blockId) {
    return this.chain.find(block => `BLK${String(block.index).padStart(3, '0')}` === blockId);
  }

  searchBlocks(query) {
    return this.chain.filter(block => {
      const blockStr = JSON.stringify(block).toLowerCase();
      return blockStr.includes(query.toLowerCase());
    });
  }

  saveToFile() {
    try {
      const data = JSON.stringify(this.chain, null, 2);
      fs.writeFileSync(BLOCKCHAIN_FILE, data, 'utf8');
    } catch (error) {
      console.error('Failed to save blockchain:', error.message);
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(BLOCKCHAIN_FILE)) {
        const data = fs.readFileSync(BLOCKCHAIN_FILE, 'utf8');
        const loadedChain = JSON.parse(data);
        
        // Reconstruct Block objects from plain objects
        this.chain = loadedChain.map(blockData => {
          const block = new Block(
            blockData.index,
            blockData.timestamp,
            blockData.data,
            blockData.previousHash
          );
          block.hash = blockData.hash;
          block.nonce = blockData.nonce;
          return block;
        });
        
        console.log(`🔗 Loaded blockchain from file: ${this.chain.length} blocks`);
        return true;
      }
    } catch (error) {
      console.error('Failed to load blockchain:', error.message);
      console.log('Starting with fresh blockchain');
    }
    return false;
  }
}

// Create singleton blockchain instance
const fireBlockChain = new Blockchain();

// Add some initial demo data only if blockchain is empty
if (fireBlockChain.chain.length === 1) {
  console.log('Initializing blockchain with demo data...');
  
  const initialBlocks = [
    {
      sensorName: 'Sensor-A-Floor2',
      eventType: 'Status',
      data: { temperature: 72, smoke_level: 0 },
      severity: 1
    },
    {
      sensorName: 'Sensor-B-Floor1',
      eventType: 'Status',
      data: { temperature: 68, smoke_level: 0 },
      severity: 2
    },
    {
      sensorName: 'Sensor-C-Floor3',
      eventType: 'Trigger',
      data: { temperature: 85, smoke_level: 5 },
      severity: 6
    }
  ];

  initialBlocks.forEach(blockData => {
    fireBlockChain.addBlock(blockData);
  });

  console.log('🔗 Private Blockchain initialized with demo data');
} else {
  console.log('🔗 Using existing blockchain data');
}

export default fireBlockChain;
