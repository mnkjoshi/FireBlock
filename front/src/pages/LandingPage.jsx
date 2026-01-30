import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <span className="logo-icon">🔥</span>
              <span className="logo-text">FireBlock</span>
            </div>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Immutable Fire Safety Records
            </h1>
            <p className="hero-subtitle">
              Blockchain-powered integrity for sensor networks. 
              Ensuring tamper-proof audit trails for high-compliance fire safety monitoring.
            </p>
            <Link to="/login" className="btn btn-primary btn-large">
              Access Ledger
            </Link>
          </div>
          
          {/* Visual: Abstract blockchain nodes */}
          <div className="blockchain-visual">
            <div className="node node-1">
              <div className="node-inner"></div>
            </div>
            <div className="node node-2">
              <div className="node-inner"></div>
            </div>
            <div className="node node-3">
              <div className="node-inner"></div>
            </div>
            <div className="node node-4">
              <div className="node-inner"></div>
            </div>
            <svg className="connections" viewBox="0 0 400 400">
              <line x1="100" y1="100" x2="300" y2="100" stroke="#FF4500" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="100" x2="100" y2="300" stroke="#FF4500" strokeWidth="2" opacity="0.6" />
              <line x1="300" y1="100" x2="300" y2="300" stroke="#FF4500" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="300" x2="300" y2="300" stroke="#FF4500" strokeWidth="2" opacity="0.6" />
              <line x1="100" y1="100" x2="300" y2="300" stroke="#FF4500" strokeWidth="2" opacity="0.3" />
              <line x1="300" y1="100" x2="100" y2="300" stroke="#FF4500" strokeWidth="2" opacity="0.3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Immutable Records</h3>
              <p>
                Every sensor event is permanently recorded on the ledger. 
                No deletion, no modification—only verifiable truth.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Monitoring</h3>
              <p>
                Live updates from your sensor network with instant severity classification 
                and automated alerting.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <h3>Compliance Ready</h3>
              <p>
                Built for high-compliance environments where data integrity 
                is non-negotiable and audits are frequent.
              </p>
            </div>
          </div>

          <div className="mission-statement">
            <h2>FireSafe's Mission</h2>
            <p>
              FireBlock provides an immutable audit trail for fire safety sensor networks, 
              ensuring that every event—from routine status checks to critical fire alerts—is 
              permanently and verifiably recorded. Our blockchain-backed system eliminates 
              concerns about data tampering, giving safety inspectors and compliance officers 
              the confidence they need.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
