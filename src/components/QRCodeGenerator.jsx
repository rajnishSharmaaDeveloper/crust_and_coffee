import React, { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Printer,
  Copy,
  ExternalLink,
  Check,
  Coffee,
  Sparkles,
  Wifi,
  Sliders,
  UtensilsCrossed,
} from "lucide-react";
import { CAFE_INFO } from "../data/menuData";

export default function QRCodeGenerator({ currentTable, onSelectTable, onSwitchToMenu }) {
  const [tableNum, setTableNum] = useState(currentTable || "1");
  const [customUrl, setCustomUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrFgColor, setQrFgColor] = useState("#23150d");
  const [qrSize, setQrSize] = useState(200);
  const [includeMargin, setIncludeMargin] = useState(true);

  // Auto-generate target URL based on window location or custom input
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = `${window.location.origin}${window.location.pathname}`;
      setCustomUrl(`${baseUrl}?table=${tableNum}`);
    }
  }, [tableNum]);

  const targetUrl = customUrl || `${typeof window !== "undefined" ? window.location.origin : ""}?table=${tableNum}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-generator-section">
      <div className="qr-controls-panel">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <Sliders size={20} className="panel-title-icon" />
            <h2>Cafe QR Standee Settings</h2>
          </div>
          <p className="panel-subtitle">
            Generate printable QR codes for tables or cafe counter. Customers scan this QR to see the full category-wise menu.
          </p>
        </div>

        {/* Table Number Selector */}
        <div className="control-group">
          <label className="control-label">Select Table Number</label>
          <div className="table-chip-list">
            {["General", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "15"].map((tbl) => (
              <button
                key={tbl}
                type="button"
                onClick={() => {
                  setTableNum(tbl);
                  onSelectTable(tbl === "General" ? "" : tbl);
                }}
                className={`table-chip ${tableNum === tbl ? "active" : ""}`}
              >
                {tbl === "General" ? "Counter / Takeaway" : `Table ${tbl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Target URL */}
        <div className="control-group">
          <label className="control-label">Target Menu URL</label>
          <div className="url-input-wrap">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="url-input"
              placeholder="e.g. http://192.168.1.10:5173?table=1"
            />
            <button
              onClick={handleCopy}
              className={`url-copy-btn ${copied ? "copied" : ""}`}
              title="Copy URL"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <span className="control-hint">
            💡 When scanned on any mobile camera or Google Lens, this exact URL opens.
          </span>
        </div>

        {/* Color picker */}
        <div className="control-row">
          <div className="control-group">
            <label className="control-label">QR Code Color</label>
            <div className="color-options">
              {[
                { label: "Espresso Dark", color: "#23150d" },
                { label: "Caramel Brown", color: "#6f3e1b" },
                { label: "Roasted Gold", color: "#8a5719" },
                { label: "Classic Black", color: "#000000" },
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setQrFgColor(c.color)}
                  className={`color-swatch ${qrFgColor === c.color ? "active" : ""}`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Standee Actions</label>
            <div className="action-buttons-row">
              <button onClick={handlePrint} className="btn-primary-action print-btn">
                <Printer size={18} />
                <span>Print Standee Card</span>
              </button>
              <button
                onClick={() => {
                  onSelectTable(tableNum === "General" ? "" : tableNum);
                  onSwitchToMenu();
                }}
                className="btn-secondary-action test-menu-btn"
              >
                <UtensilsCrossed size={18} />
                <span>Open This Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Standee Preview for Printing & Display */}
      <div className="standee-preview-container">
        <div className="preview-label">Live Acrylic Table Standee Preview</div>

        <div className="standee-card printable-standee" id="printable-standee-card">
          <div className="standee-top-arch">
            <div className="standee-coffee-icon">
              <Coffee size={32} />
            </div>
            <div className="standee-brand-name">{CAFE_INFO.name}</div>
            <div className="standee-tagline">— {CAFE_INFO.tagline} —</div>
          </div>

          <div className="standee-divider">
            <span className="divider-diamond">◆</span>
          </div>

          {tableNum && tableNum !== "General" ? (
            <div className="standee-table-box">
              <span className="table-box-label">TABLE</span>
              <span className="table-box-number">{tableNum}</span>
            </div>
          ) : (
            <div className="standee-table-box general-box">
              <span className="table-box-label">TAKEAWAY & DINE-IN</span>
              <span className="table-box-number">MENU</span>
            </div>
          )}

          {/* QR Code Container */}
          <div className="standee-qr-frame">
            <div className="qr-wrapper">
              <QRCodeSVG
                value={targetUrl}
                size={qrSize}
                fgColor={qrFgColor}
                bgColor="#ffffff"
                level="H"
                includeMargin={includeMargin}
                imageSettings={{
                  src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23c88a35'><path d='M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3'/></svg>",
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }}
              />
            </div>
            <div className="scan-instruction">
              <Sparkles size={14} className="sparkle-icon" />
              <span>Scan with phone camera to view full category menu & order</span>
            </div>
          </div>

          <div className="standee-footer-info">
            <div className="wifi-line">
              <Wifi size={14} />
              <span>Free Cafe WiFi: <strong>{CAFE_INFO.wifi}</strong></span>
            </div>
            <div className="footer-small">Specialty Tea • Handcrafted Coffee • Artisan Pizza • Shakes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
