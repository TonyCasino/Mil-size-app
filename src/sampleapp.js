/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';

import MWBScannerSDK from './cmbweb/bundle.js';

class Trigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeWidthInches: "3.125",
      modulesX: null,
      milSize: null,
      ppm: null,
      barcode: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({ barcodeWidthInches: e.target.value }, this.updateMilSize);
  };

  updateMilSize = () => {
    const { barcodeWidthInches, modulesX } = this.state;
    if (barcodeWidthInches && modulesX) {
      const mil = (parseFloat(barcodeWidthInches) / modulesX) * 1000;
      this.setState({ milSize: mil.toFixed(2) });
    }
  };

  start = () => {
    mwbScanner.startScanning(
      (result) => {
        if (result && result.modulesCountX) {
          this.setState(
            {
              modulesX: result.modulesCountX
            },
            this.updateMilSize
          );
        }
      },
      (err) => {
        console.error("❌ startScanning error:", err);
      }
    );
  };
  
  render() {
    return (
      <div className="app-container">
        <label>
          Barcode Width (inches):
          <input
            type="number"
            value={this.state.barcodeWidthInches}
            onChange={this.handleInputChange}
            placeholder="e.g. 3.125"
          />
        </label>
        <button onClick={this.start}>🚀 Start Scanner</button>
        {this.state.milSize && (
          <div className="result-box">
            <p>
              <strong>Mil Size:</strong> {this.state.milSize} mil
            </p>
          </div>
        )}
      </div>
    );
  }
}



class Container extends React.Component {
  id = "cmbweb-preview-container";
  divStyle = {
  border: "2px solid #ccc",
  borderRadius: "10px",
  marginTop: "20px",
  width: "100%",
  maxWidth: "640px",
  height: "360px",
  backgroundColor: "#eee",
  overflow: "hidden",
  position: "relative",
};

    render() {
    return <div id={this.id} style={this.divStyle} />;
  }
}


class SampleApp extends React.Component {
  render() {
    return (
      <div className="page-wrapper">
        <div className="app-container">
          <h1>📦 Barcode Mil Size Scanner</h1>
          <Trigger />
          <Container />
        </div>
      </div>
    );
  }
}

export default SampleApp;
