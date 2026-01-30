import express from 'express';
import blockchain from '../blockchain.js';

const router = express.Router();

/**
 * Middleware to verify admin authentication
 * In production, verify JWT token or session
 */
const verifyAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  
  // Simplified auth check - in production, verify JWT
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Admin access required'
    });
  }
  
  next();
};

/**
 * POST /api/admin/entry
 * Manually add a new entry to the blockchain
 */
router.post('/entry', verifyAdmin, (request, response) => {
  try {
    const { sensorName, eventType, temperature, smokeLevel, severity } = request.body;

    // Validate required fields
    if (!sensorName || !eventType || temperature === undefined || smokeLevel === undefined || severity === undefined) {
      return response.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['sensorName', 'eventType', 'temperature', 'smokeLevel', 'severity']
      });
    }

    // Create block data
    const blockData = {
      sensorName,
      eventType,
      data: {
        temperature: parseFloat(temperature),
        smoke_level: parseInt(smokeLevel)
      },
      severity: parseInt(severity),
      manualEntry: true,
      createdBy: 'admin' // In production, get from auth token
    };

    // Add to blockchain
    const newBlock = blockchain.addBlock(blockData);

    response.status(201).json({
      success: true,
      message: 'Block successfully added to ledger',
      block: {
        id: `BLK${String(newBlock.index).padStart(3, '0')}`,
        timestamp: newBlock.timestamp,
        hash: newBlock.hash,
        data: blockData
      }
    });
  } catch (error) {
    console.error('Manual entry error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to add block to ledger',
      error: error.message
    });
  }
});

/**
 * PATCH /api/admin/nullify/:id
 * Nullify a blockchain entry (adds a nullification block)
 */
router.patch('/nullify/:id', verifyAdmin, (request, response) => {
  try {
    const { id } = request.params;
    const { reason } = request.body;

    // Find the block to nullify
    const targetBlock = blockchain.getBlockById(id);

    if (!targetBlock) {
      return response.status(404).json({
        success: false,
        message: `Block ${id} not found`
      });
    }

    // Check if already nullified
    if (targetBlock.data.nullified) {
      return response.status(400).json({
        success: false,
        message: `Block ${id} is already nullified`
      });
    }

    // Create nullification block
    const nullificationData = {
      type: 'NULLIFICATION',
      eventType: 'Nullification',
      sensorName: 'System',
      data: {
        action: 'nullify',
        targetBlockId: id,
        targetBlockHash: targetBlock.hash,
        reason: reason || 'Administrative nullification'
      },
      severity: 0,
      nullifies: id,
      createdBy: 'admin' // In production, get from auth token
    };

    // Add nullification block to blockchain
    const nullificationBlock = blockchain.addBlock(nullificationData);

    // Mark original block as nullified (metadata only, doesn't modify original block)
    targetBlock.data.nullified = true;
    targetBlock.data.nullifiedBy = `BLK${String(nullificationBlock.index).padStart(3, '0')}`;

    response.json({
      success: true,
      message: `Nullification block created for ${id}`,
      nullificationBlock: {
        id: `BLK${String(nullificationBlock.index).padStart(3, '0')}`,
        timestamp: nullificationBlock.timestamp,
        hash: nullificationBlock.hash,
        nullifies: id
      }
    });
  } catch (error) {
    console.error('Nullification error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to nullify block',
      error: error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * Get blockchain statistics
 */
router.get('/stats', verifyAdmin, (request, response) => {
  try {
    const chain = blockchain.getChain();
    
    const stats = {
      totalBlocks: chain.length - 1, // Exclude genesis
      highSeverityCount: chain.filter(b => b.data.severity >= 8).length,
      mediumSeverityCount: chain.filter(b => b.data.severity >= 4 && b.data.severity < 8).length,
      lowSeverityCount: chain.filter(b => b.data.severity < 4 && b.data.severity > 0).length,
      nullifiedCount: chain.filter(b => b.data.nullified).length,
      manualEntriesCount: chain.filter(b => b.data.manualEntry).length,
      chainValid: blockchain.isChainValid(),
      lastBlockTimestamp: chain[chain.length - 1].timestamp
    };

    response.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
});

export default router;
