import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  
  // Manual Entry State
  const [manualEntry, setManualEntry] = useState({
    sensorName: '',
    eventType: 'Status',
    temperature: '',
    smokeLevel: '',
    severity: '1'
  });
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);

  // Nullify Entry State
  const [blockId, setBlockId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [nullifySubmitting, setNullifySubmitting] = useState(false);
  const [nullifySuccess, setNullifySuccess] = useState(false);

  const handleManualChange = (e) => {
    setManualEntry({
      ...manualEntry,
      [e.target.name]: e.target.value
    });
    setManualSuccess(false);
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualSubmitting(true);

    try {
      const token = localStorage.getItem('fireblock_auth');
      const response = await fetch('/api/admin/entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(manualEntry)
      });

      const data = await response.json();

      if (data.success) {
        setManualSuccess(true);
        // Reset form
        setManualEntry({
          sensorName: '',
          eventType: 'Status',
          temperature: '',
          smokeLevel: '',
          severity: '1'
        });
        setTimeout(() => setManualSuccess(false), 3000);
      } else {
        console.error('Failed to submit:', data.message);
      }
    } catch (err) {
      console.error('Failed to submit entry', err);
    } finally {
      setManualSubmitting(false);
    }
  };

  const handleNullifyClick = () => {
    if (!blockId) return;
    setShowConfirmModal(true);
  };

  const handleNullifyConfirm = async () => {
    setShowConfirmModal(false);
    setNullifySubmitting(true);

    try {
      const token = localStorage.getItem('fireblock_auth');
      const response = await fetch(`/api/admin/nullify/${blockId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Administrative nullification' })
      });

      const data = await response.json();

      if (data.success) {
        setNullifySuccess(true);
        setBlockId('');
        setTimeout(() => setNullifySuccess(false), 3000);
      } else {
        console.error('Failed to nullify:', data.message);
      }
    } catch (err) {
      console.error('Failed to nullify entry', err);
    } finally {
      setNullifySubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🔥</span>
              <span className="logo-text">FireBlock</span>
              <span className="admin-badge">Admin</span>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/threat')} 
                className="btn btn-outline"
              >
                Threat Assessment
              </button>
              <button 
                onClick={() => navigate('/ledger')} 
                className="btn btn-outline"
              >
                View Ledger
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('fireblock_auth');
                  navigate('/');
                }} 
                className="btn btn-outline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="container">
          <div className="admin-title-section">
            <h1>Admin Panel</h1>
            <p className="admin-description">
              Manage ledger entries with high friction controls for data integrity
            </p>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              Manual Entry
            </button>
            <button
              className={`tab ${activeTab === 'nullify' ? 'active' : ''}`}
              onClick={() => setActiveTab('nullify')}
            >
              Nullify Entry
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Manual Entry Tab */}
            {activeTab === 'manual' && (
              <div className="card">
                <h2>Add Manual Ledger Entry</h2>
                <p className="section-description">
                  Create a new block in the ledger. This action is permanent and immutable.
                </p>

                <form onSubmit={handleManualSubmit} className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="sensorName">Sensor Name *</label>
                      <input
                        type="text"
                        id="sensorName"
                        name="sensorName"
                        value={manualEntry.sensorName}
                        onChange={handleManualChange}
                        placeholder="e.g., Sensor-A-Floor2"
                        required
                        disabled={manualSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="eventType">Event Type *</label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={manualEntry.eventType}
                        onChange={handleManualChange}
                        required
                        disabled={manualSubmitting}
                      >
                        <option value="Status">Status</option>
                        <option value="Trigger">Trigger</option>
                        <option value="Error">Error</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="temperature">Temperature (°F) *</label>
                      <input
                        type="number"
                        id="temperature"
                        name="temperature"
                        value={manualEntry.temperature}
                        onChange={handleManualChange}
                        placeholder="72"
                        required
                        disabled={manualSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="smokeLevel">Smoke Level (0-10) *</label>
                      <input
                        type="number"
                        id="smokeLevel"
                        name="smokeLevel"
                        min="0"
                        max="10"
                        value={manualEntry.smokeLevel}
                        onChange={handleManualChange}
                        placeholder="0"
                        required
                        disabled={manualSubmitting}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="severity">Severity (1-10) *</label>
                      <input
                        type="number"
                        id="severity"
                        name="severity"
                        min="1"
                        max="10"
                        value={manualEntry.severity}
                        onChange={handleManualChange}
                        required
                        disabled={manualSubmitting}
                      />
                    </div>
                  </div>

                  {manualSuccess && (
                    <div className="success-message">
                      ✓ Block successfully added to ledger
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={manualSubmitting}
                  >
                    {manualSubmitting ? 'Submitting to Ledger...' : 'Submit Block'}
                  </button>
                </form>
              </div>
            )}

            {/* Nullify Entry Tab */}
            {activeTab === 'nullify' && (
              <div className="card">
                <h2>Nullify Ledger Entry</h2>
                <div className="warning-box">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <strong>High Friction Action</strong>
                    <p>
                      This will add a new block to the ledger indicating that Block ID should be ignored. 
                      This action cannot be undone and will be permanently visible in the audit trail.
                    </p>
                  </div>
                </div>

                <div className="nullify-form">
                  <div className="form-group">
                    <label htmlFor="blockId">Block ID to Nullify *</label>
                    <input
                      type="text"
                      id="blockId"
                      name="blockId"
                      value={blockId}
                      onChange={(e) => {
                        setBlockId(e.target.value);
                        setNullifySuccess(false);
                      }}
                      placeholder="e.g., BLK001"
                      className="mono"
                      disabled={nullifySubmitting}
                    />
                    <small className="form-hint">
                      Enter the exact Block ID from the ledger that should be nullified
                    </small>
                  </div>

                  {nullifySuccess && (
                    <div className="success-message">
                      ✓ Nullification block added to ledger
                    </div>
                  )}

                  <button
                    onClick={handleNullifyClick}
                    className="btn btn-outline-red"
                    disabled={!blockId || nullifySubmitting}
                  >
                    {nullifySubmitting ? 'Processing...' : 'Nullify Entry'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          title="Confirm Nullification"
          message={`Are you sure you want to nullify Block ID: ${blockId}? This will permanently add a nullification record to the ledger.`}
          onConfirm={handleNullifyConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default AdminPage;
