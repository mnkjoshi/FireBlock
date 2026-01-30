import express from 'express';
import blockchain from '../blockchain.js';

const router = express.Router();

/**
 * GET /api/ledger
 * Get all blockchain entries
 */
router.get('/', (request, response) => {
  try {
    const chain = blockchain.getChain();
    
    // Format blockchain data for frontend
    const ledgerEntries = chain
      .filter(block => block.index > 0) // Skip genesis block
      .map(block => ({
        id: `BLK${String(block.index).padStart(3, '0')}`,
        timestamp: block.timestamp,
        sensorName: block.data.sensorName || 'N/A',
        eventType: block.data.eventType || 'Unknown',
        data: block.data.data || block.data,
        severity: block.data.severity || 0,
        hash: block.hash,
        previousHash: block.previousHash,
        nullified: block.data.nullified || false,
        nullifiedBy: block.data.nullifiedBy || null
      }))
      .reverse(); // Most recent first

    response.json({
      success: true,
      count: ledgerEntries.length,
      entries: ledgerEntries,
      chainValid: blockchain.isChainValid()
    });
  } catch (error) {
    console.error('Ledger fetch error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve ledger data',
      error: error.message
    });
  }
});

/**
 * GET /api/ledger/validate/chain
 * Validate blockchain integrity
 */
router.get('/validate/chain', (request, response) => {
  try {
    const isValid = blockchain.isChainValid();
    
    response.json({
      success: true,
      valid: isValid,
      message: isValid 
        ? 'Blockchain integrity verified' 
        : 'Blockchain integrity compromised',
      totalBlocks: blockchain.chain.length
    });
  } catch (error) {
    console.error('Validation error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to validate blockchain',
      error: error.message
    });
  }
});

/**
 * GET /api/ledger/threat-score
 * Calculate wildfire threat score based on recent blocks
 */
router.get('/threat-score', (request, response) => {
  try {
    const chain = blockchain.getChain();
    const recentBlocks = chain
      .filter(block => block.index > 0 && !block.data.nullified) // Exclude genesis and nullified
      .slice(-10); // Get last 10 blocks

    if (recentBlocks.length === 0) {
      return response.json({
        success: true,
        score: 1000,
        recentBlocks: 0,
        highSeverityCount: 0,
        averageSeverity: 0,
        timeWindow: 'Insufficient data',
        message: 'No recent events to analyze'
      });
    }

    // Calculate average severity
    const severities = recentBlocks
      .map(block => block.data.severity || 0)
      .filter(s => s > 0);
    
    const averageSeverity = severities.length > 0 
      ? severities.reduce((sum, s) => sum + s, 0) / severities.length 
      : 0;

    // Count high severity events (8-10)
    const highSeverityCount = severities.filter(s => s >= 8).length;

    // Calculate threat score (inverted: higher severity = lower score)
    // Score ranges from 0-1000, where 1000 is safest
    let score = 1000;

    // Reduce score based on average severity (max -500 points)
    score -= (averageSeverity / 10) * 500;

    // Extra penalty for high severity events (-50 points each)
    score -= highSeverityCount * 50;

    // Bonus for low average severity
    if (averageSeverity < 3) {
      score += 100;
    }

    // Ensure score stays within bounds
    score = Math.max(0, Math.min(1000, Math.round(score)));

    // Calculate time window
    const oldestBlock = recentBlocks[0];
    const newestBlock = recentBlocks[recentBlocks.length - 1];
    const timeWindow = recentBlocks.length < 2 
      ? 'Current' 
      : 'Last 10 events';

    response.json({
      success: true,
      score,
      recentBlocks: recentBlocks.length,
      highSeverityCount,
      averageSeverity: parseFloat(averageSeverity.toFixed(2)),
      timeWindow,
      oldestTimestamp: oldestBlock.timestamp,
      newestTimestamp: newestBlock.timestamp
    });
  } catch (error) {
    console.error('Threat score error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to calculate threat score',
      error: error.message
    });
  }
});

/**
 * GET /api/ledger/:id
 * Get specific blockchain entry by ID
 */
router.get('/:id', (request, response) => {
  try {
    const { id } = request.params;
    const block = blockchain.getBlockById(id);

    if (!block) {
      return response.status(404).json({
        success: false,
        message: `Block ${id} not found`
      });
    }

    response.json({
      success: true,
      entry: {
        id: `BLK${String(block.index).padStart(3, '0')}`,
        timestamp: block.timestamp,
        sensorName: block.data.sensorName || 'N/A',
        eventType: block.data.eventType || 'Unknown',
        data: block.data.data || block.data,
        severity: block.data.severity || 0,
        hash: block.hash,
        previousHash: block.previousHash,
        nullified: block.data.nullified || false
      }
    });
  } catch (error) {
    console.error('Block fetch error:', error);
    response.status(500).json({
      success: false,
      message: 'Failed to retrieve block data',
      error: error.message
    });
  }
});

export default router;
