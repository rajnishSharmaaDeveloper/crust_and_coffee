import React, { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import CategoryNav from "./components/CategoryNav";
import MenuItemCard from "./components/MenuItemCard";
import QRCodeGenerator from "./components/QRCodeGenerator";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import { MENU_CATEGORIES, MENU_ITEMS, CAFE_INFO } from "./data/menuData";
import {
  ShoppingBag,
  ArrowRight,
  Flame,
  Star,
  Sparkles,
  QrCode,
  Coffee,
  CheckCircle2,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("menu"); // "menu" | "qr"
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dietFilter, setDietFilter] = useState("all"); // "all" | "bestseller" | "special"
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tbl = params.get("table");
      const mode = params.get("mode");

      if (tbl) {
        setTableNumber(tbl);
      }
      if (mode === "qr") {
        setActiveTab("qr");
      }
    }
  }, []);

  // Filtered items logic
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.categoryId !== activeCategory) {
        return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.categoryId.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // Diet / Tag filter
      if (dietFilter === "bestseller") {
        const tag = (item.tag || "").toLowerCase();
        if (!tag.includes("bestseller") && !tag.includes("popular")) return false;
      }
      if (dietFilter === "special") {
        const tag = (item.tag || "").toLowerCase();
        if (!tag.includes("special") && !tag.includes("signature") && !tag.includes("must try"))
          return false;
      }

      return true;
    });
  }, [activeCategory, searchTerm, dietFilter]);

  // Compute category counts for badge counters
  const categoryCounts = useMemo(() => {
    const counts = { all: MENU_ITEMS.length };
    MENU_CATEGORIES.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = MENU_ITEMS.filter((i) => i.categoryId === cat.id).length;
      }
    });
    return counts;
  }, []);

  // Cart operations
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const currentQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: currentQty + 1,
        },
      };
    });
  };

  const handleRemoveFromCart = (item) => {
    setCart((prev) => {
      const currentQty = prev[item.id]?.quantity || 0;
      if (currentQty <= 1) {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      }
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: currentQty - 1,
        },
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const cartList = Object.values(cart);
  const totalCartCount = cartList.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCartAmount = cartList.reduce((acc, curr) => {
    const p = typeof curr.item.price === "number" ? curr.item.price : 0;
    return acc + p * curr.quantity;
  }, 0);

  // Group items by category if "all" category is selected and no active search
  const renderCategorizedSections = () => {
    if (activeCategory !== "all" || searchTerm.trim()) {
      return (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={cart[item.id]?.quantity || 0}
              onAdd={handleAddToCart}
              onRemove={handleRemoveFromCart}
            />
          ))}
        </div>
      );
    }

    // Grouped layout for "All"
    return (
      <div className="category-sections-wrapper">
        {MENU_CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
          const itemsInCat = filteredItems.filter((i) => i.categoryId === cat.id);
          if (itemsInCat.length === 0) return null;

          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="menu-category-section">
              <div className="section-title-bar">
                <div className="section-title-wrap">
                  <h2 className="section-category-title">{cat.name}</h2>
                  <span className="section-item-count">{itemsInCat.length} items</span>
                </div>
                <div className="section-deco-line"></div>
              </div>

              <div className="menu-grid">
                {itemsInCat.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={cart[item.id]?.quantity || 0}
                    onAdd={handleAddToCart}
                    onRemove={handleRemoveFromCart}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalItemsInCart={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        tableNumber={tableNumber}
      />

      <main className="main-content">
        {activeTab === "qr" ? (
          <QRCodeGenerator
            currentTable={tableNumber}
            onSelectTable={setTableNumber}
            onSwitchToMenu={() => setActiveTab("menu")}
          />
        ) : (
          <div className="menu-view-container">
            {/* Hero Cafe Banner */}
            <div className="hero-banner">
              <div className="hero-content">
                <span className="hero-sub">{CAFE_INFO.tagline}</span>
                <h1 className="hero-title">{CAFE_INFO.name}</h1>
                <p className="hero-tagline">
                  Artisan Handcrafted Teas, Cold Blends & Stone-Oven Crusts
                </p>
                <div className="hero-meta-badges">
                  <span className="meta-pill">
                    <CheckCircle2 size={14} className="pill-check" /> 100% Pure Veg
                  </span>
                  <span className="meta-pill">
                    <Coffee size={14} /> Freshly Brewed
                  </span>
                  {tableNumber && (
                    <span className="meta-pill table-highlight">
                      📍 Ordering for Table #{tableNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="quick-filter-toolbar">
              <CategoryNav
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                categoryCounts={categoryCounts}
              />

              <div className="sub-filters-row">
                <div className="filter-tags">
                  <button
                    onClick={() => setDietFilter("all")}
                    className={`tag-filter-btn ${dietFilter === "all" ? "active" : ""}`}
                  >
                    All Items
                  </button>
                  <button
                    onClick={() => setDietFilter("bestseller")}
                    className={`tag-filter-btn ${dietFilter === "bestseller" ? "active" : ""}`}
                  >
                    <Star size={13} />
                    <span>Bestsellers</span>
                  </button>
                  <button
                    onClick={() => setDietFilter("special")}
                    className={`tag-filter-btn ${dietFilter === "special" ? "active" : ""}`}
                  >
                    <Flame size={13} />
                    <span>Chef Specials</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab("qr")}
                  className="quick-qr-link-btn"
                  title="Generate QR code for this table"
                >
                  <QrCode size={15} />
                  <span>Get Table QR</span>
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="menu-items-container">
              {filteredItems.length === 0 ? (
                <div className="no-items-state">
                  <div className="no-items-icon">🔍</div>
                  <h3>No items match your filter</h3>
                  <p>Try clearing your search query or selecting a different category.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                      setDietFilter("all");
                    }}
                    className="reset-search-btn"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                renderCategorizedSections()
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (Mobile & Desktop) */}
      {totalCartCount > 0 && activeTab === "menu" && (
        <aside className="floating-cart-bar" aria-label="Order Tray Bar">
          <div className="floating-cart-inner">
            <div className="floating-cart-info">
              <div className="cart-badge-icon">
                <ShoppingBag size={20} />
                <span className="floating-count">{totalCartCount}</span>
              </div>
              <div className="floating-cart-text">
                <span className="cart-total-amount">
                  {CAFE_INFO.currency}{totalCartAmount}
                </span>
                <span className="cart-item-label">
                  {totalCartCount} item{totalCartCount === 1 ? "" : "s"} in tray
                  {tableNumber ? ` • Table #${tableNumber}` : ""}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="view-order-btn"
            >
              <span>View Order</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartList}
        onAdd={handleAddToCart}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
