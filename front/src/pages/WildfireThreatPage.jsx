import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './WildfireThreatPage.css';

const WildfireThreatPage = () => {
  const navigate = useNavigate();
  const [threatData, setThreatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem('fireblock_auth');
    if (!auth) {
      navigate('/login');
      return;
    }

    fetchThreatData();
  }, [navigate]);

  const fetchThreatData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/ledger/threat-score`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch threat data');
      }

      const data = await response.json();
      
      if (data.success) {
        setThreatData(data);
      } else {
        throw new Error(data.message || 'Failed to calculate threat');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Threat fetch error:', err);
      setError('Failed to load threat data');
      setIsLoading(false);
    }
  };

  const getThreatLevel = (score) => {
    if (score >= 800) return { level: 'Minimal', color: '#4CAF50', description: 'Low risk of wildfire events' };
    if (score >= 600) return { level: 'Low', color: '#8BC34A', description: 'Slightly elevated monitoring needed' };
    if (score >= 400) return { level: 'Moderate', color: '#FFC107', description: 'Increased vigilance recommended' };
    if (score >= 200) return { level: 'High', color: '#FF9800', description: 'High alert - potential fire risk' };
    return { level: 'Critical', color: '#FF4500', description: 'Extreme danger - immediate action required' };
  };

  const handleLogout = () => {
    localStorage.removeItem('fireblock_auth');
    navigate('/');
  };

  return (
    <div className="threat-page">
      {/* Header */}
      <header className="threat-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🔥</span>
              <span className="logo-text">FireBlock</span>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/ledger')} 
                className="btn btn-outline"
              >
                View Ledger
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
      <main className="threat-main">
        <div className="container">
          <div className="threat-title-section">
            <h1>Wildfire Threat Assessment</h1>
            <p className="threat-description">
              Real-time risk analysis based on recent sensor activity
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="card">
              <div className="skeleton-loader">
                <div className="skeleton skeleton-header"></div>
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
                <button onClick={fetchThreatData} className="btn btn-primary mt-lg">
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Threat Score Display */}
          {!isLoading && !error && threatData && (
            <>
              <div className="threat-score-card card">
                <div className="score-gauge-container">
                  <div className="score-gauge">
                    <svg viewBox="0 0 200 120" className="gauge-svg">
                      {/* Background arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#E0E0E0"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />
                      {/* Score arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke={getThreatLevel(threatData.score).color}
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray={`${(threatData.score / 1000) * 251.2} 251.2`}
                        className="score-arc"
                      />
                      {/* Needle */}
                      <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="30"
                        stroke={getThreatLevel(threatData.score).color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        transform={`rotate(${(threatData.score / 1000) * 180 - 90} 100 100)`}
                        className="gauge-needle"
                      />
                      <circle cx="100" cy="100" r="8" fill={getThreatLevel(threatData.score).color} />
                    </svg>
                    
                    <div className="score-value">
                      <div className="score-number">{threatData.score}</div>
                      <div className="score-max">/ 1000</div>
                    </div>
                  </div>

                  <div className="threat-level-badge" style={{ backgroundColor: getThreatLevel(threatData.score).color }}>
                    <div className="threat-level-text">{getThreatLevel(threatData.score).level} Risk</div>
                    <div className="threat-level-description">{getThreatLevel(threatData.score).description}</div>
                  </div>
                </div>

                <div className="score-explanation">
                  <h3>How is this calculated?</h3>
                  <p>
                    The Wildfire Threat Score analyzes the {threatData.recentBlocks} most recent sensor events,
                    weighing severity levels and frequency. A score of 1000 represents minimal threat,
                    while lower scores indicate increasing risk based on high-severity events.
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="threat-stats-grid">
                <div className="stat-card card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">{threatData.recentBlocks}</div>
                  <div className="stat-label">Recent Events Analyzed</div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{threatData.highSeverityCount || 0}</div>
                  <div className="stat-label">High Severity Events</div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{threatData.averageSeverity ? threatData.averageSeverity.toFixed(1) : '0.0'}</div>
                  <div className="stat-label">Average Severity</div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon">⏱️</div>
                  <div className="stat-value">{threatData.timeWindow}</div>
                  <div className="stat-label">Analysis Window</div>
                </div>
              </div>

              {/* Refresh */}
              <div className="threat-actions">
                <button onClick={fetchThreatData} className="btn btn-outline">
                  🔄 Refresh Assessment
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WildfireThreatPage;
