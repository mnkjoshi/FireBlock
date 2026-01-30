import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LedgerPage.css';

const LedgerPage = () => {
  const navigate = useNavigate();
  const [ledgerData, setLedgerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('fireblock_auth');
    if (!auth) {
      navigate('/login');
      return;
    }

    // Fetch ledger data
    fetchLedgerData();
  }, [navigate]);

  const fetchLedgerData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ledger', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ledger data');
      }

      const data = await response.json();
      
      if (data.success) {
        setLedgerData(data.entries);
      } else {
        throw new Error(data.message || 'Failed to load ledger');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Ledger fetch error:', err);
      setError('Failed to load ledger data');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fireblock_auth');
    navigate('/');
  };

  const getSeverityClass = (severity) => {
    if (severity >= 8) return 'severity-high';
    if (severity >= 4) return 'severity-med';
    return 'severity-low';
  };

  const formatData = (data) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="ledger-page">
      {/* Header */}
      <header className="ledger-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🔥</span>
              <span className="logo-text">FireBlock</span>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/threat')} 
                className="btn btn-outline"
              >
                Threat Assessment
              </button>
              <button 
                onClick={() => navigate('/admin')} 
                className="btn btn-outline"
              >
                Admin Panel
              </button>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ledger-main">
        <div className="container">
          {/* Title and Status */}
          <div className="ledger-title-section">
            <div>
              <h1>Ledger Monitor</h1>
              <p className="ledger-description">
                Real-time immutable record of all sensor events
              </p>
            </div>
            <div className="live-indicator">
              <span className="status-dot status-live"></span>
              <span>Live Monitoring</span>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="table-container">
              <div className="skeleton-loader">
                <div className="skeleton skeleton-header"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">⚠️</div>
                <h3>{error}</h3>
                <button onClick={fetchLedgerData} className="btn btn-primary mt-lg">
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && ledgerData.length === 0 && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No Ledger Entries</h3>
                <p>The blockchain ledger is empty. Entries will appear here as sensors report events.</p>
              </div>
            </div>
          )}

          {/* Ledger Table */}
          {!isLoading && !error && ledgerData.length > 0 && (
            <div className="table-container">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Block ID</th>
                    <th>Timestamp</th>
                    <th>Sensor Name</th>
                    <th>Event Type</th>
                    <th>Data</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.map((entry) => (
                    <tr key={entry.id} className={entry.nullified || entry.eventType === 'Nullification' ? 'nullified-entry' : ''}>
                      <td className="mono">
                        {entry.id}
                        {entry.nullified && <span className="nullified-badge">NULLIFIED</span>}
                        {entry.eventType === 'Nullification' && <span className="nullification-badge">NULLIFICATION</span>}
                      </td>
                      <td className="mono">{entry.timestamp}</td>
                      <td><strong>{entry.sensorName}</strong></td>
                      <td>
                        <span className={`badge badge-${entry.eventType.toLowerCase()}`}>
                          {entry.eventType}
                        </span>
                      </td>
                      <td>
                        <pre className="data-payload">{formatData(entry.data)}</pre>
                      </td>
                      <td>
                        <span className={`severity-indicator ${getSeverityClass(entry.severity)}`}>
                          {entry.severity >= 8 && `${entry.severity} - HIGH`}
                          {entry.severity >= 4 && entry.severity < 8 && entry.severity}
                          {entry.severity < 4 && entry.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LedgerPage;
