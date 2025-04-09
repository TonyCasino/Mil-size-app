/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';

import MWBScannerSDK from './cmbweb/bundle.js';

class Trigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeWidthInches: "3.125", // default to 3 1/8 inches
      modulesX: null,
      milSize: null,
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
        if (result.type === "Error") {
          console.error("❌ Scanner error:", result.errorDetails);
        } else if (result.type === "Cancel") {
          console.log("📭 Scan canceled");
        } else if (result.type === "NoResult") {
          console.log("🔍 No barcode detected.");
        } else if (result.type === "Multicode") {
          console.log("📦 Multicode scanned");
          result.codes.forEach((code) => {
            console.log("Type:", code.type);
            console.log("Data:", code.code);
            console.log("PPM:", code.ppm);
          });
        } else {
          console.log("✅ Barcode scanned:");
          console.log("Type:", result.type);
          console.log("Code:", result.code);
          console.log("📐 PPM:", result.ppm ?? "N/A");
          console.log("🖼️ Image Width:", result.imageWidth ?? "N/A");
          console.log("🖼️ Image Height:", result.imageHeight ?? "N/A");
          console.log("📏 Modules X:", result.modulesCountX ?? "N/A");
          console.log("📏 Modules Y:", result.modulesCountY ?? "N/A");
          console.log("📐 Module Size X:", result.moduleSizeX ?? "N/A");
          console.log("📐 Module Size Y:", result.moduleSizeY ?? "N/A");

          this.setState(
            { modulesX: result.modulesCountX },
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
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={this.start}>Start Scanner</button>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Barcode Width (inches):{" "}
            <input
              type="number"
              step="0.001"
              value={this.state.barcodeWidthInches}
              onChange={this.handleInputChange}
              placeholder="e.g. 3.125"
            />
          </label>
        </div>

        {this.state.milSize && (
          <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            ✅ <strong>Mil Size:</strong> {this.state.milSize} mil
          </div>
        )}
      </div>
    );
  }
}

class Container extends React.Component {
  id = "cmbweb-preview-container";
  divStyle = {
    border: 'blue',
    position: 'fixed',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '30%',
    backgroundColor: 'gray'
  };
  render() {
    return <div id={this.id} style={this.divStyle} />;
  }
}

class SampleApp extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Trigger />
        <br />
        <Container />
      </React.Fragment>
    );
  }
}

export default SampleApp;
