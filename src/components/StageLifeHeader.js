import React from 'react';
import './StageLifeHeader.css';

function StageLifeHeader() {
  return (
    <header className="stage-life-header">
      <nav className="header-nav">
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#download">Download</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default StageLifeHeader;