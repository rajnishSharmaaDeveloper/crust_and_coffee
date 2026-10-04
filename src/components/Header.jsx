import React from "react";
import { Coffee, QrCode, UtensilsCrossed, ShoppingBag, Search, X } from "lucide-react";
import { CAFE_INFO } from "../data/menuData";

export default function Header({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  totalItemsInCart,
  setIsCartOpen,
  tableNumber,
}) {
  return (
    <header className="header-root">
      <div className="header-top">
        <div className="brand-container">
          <div className="brand-logo-badge">
            <Coffee className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">{CAFE_INFO.name}</h1>
              <span className="brand-tagline">{CAFE_INFO.tagline}</span>
            </div>
            {tableNumber && (
              <span className="table-badge">
                📍 Table #{tableNumber}
              </span>
            )}
          </div>
        </div>

        {/* Tab switch & Cart */}
        <div className="header-actions">
          <div className="tab-pill-toggle">
            <button
              onClick={() => setActiveTab("menu")}
              className={`pill-btn ${activeTab === "menu" ? "active" : ""}`}
            >
              <UtensilsCrossed size={16} />
              <span className="pill-text-desktop">Digital Menu</span>
              <span className="pill-text-mobile">Menu</span>
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`pill-btn ${activeTab === "qr" ? "active" : ""}`}
            >
              <QrCode size={16} />
              <span className="pill-text-desktop">QR Standee</span>
              <span className="pill-text-mobile">QR</span>
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="cart-btn"
            aria-label="View Order"
          >
            <ShoppingBag size={20} />
            {totalItemsInCart > 0 && (
              <span className="cart-badge-count">{totalItemsInCart}</span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "menu" && (
        <div className="header-search-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search coffee, pizza, maggi, shakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
