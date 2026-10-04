import React from "react";
import { Plus, Minus, Flame, Star, Sparkles } from "lucide-react";
import { CAFE_INFO } from "../data/menuData";

export default function MenuItemCard({ item, quantity, onAdd, onRemove }) {
  const getBadgeIcon = (tag) => {
    if (!tag) return null;
    const lower = tag.toLowerCase();
    if (lower.includes("bestseller") || lower.includes("popular")) {
      return <Star size={12} className="tag-icon" />;
    }
    if (lower.includes("spicy") || lower.includes("must try")) {
      return <Flame size={12} className="tag-icon" />;
    }
    return <Sparkles size={12} className="tag-icon" />;
  };

  const formattedPrice =
    typeof item.price === "number" ? `${CAFE_INFO.currency}${item.price}` : item.price;

  return (
    <div className={`menu-card ${quantity > 0 ? "in-order" : ""}`}>
      <div className="menu-card-body">
        <div className="card-top-row">
          <div className="card-indicators">
            {item.isVeg && (
              <span className="veg-badge" title="100% Vegetarian">
                <span className="veg-dot"></span>
              </span>
            )}
            {item.tag && (
              <span className={`item-tag-badge tag-${item.tag.toLowerCase().replace(/\s+/g, "-")}`}>
                {getBadgeIcon(item.tag)}
                <span>{item.tag}</span>
              </span>
            )}
          </div>
          <span className="card-price">{formattedPrice}</span>
        </div>

        <h3 className="card-item-title">{item.name}</h3>
        <p className="card-item-desc">{item.description}</p>
      </div>

      <div className="menu-card-footer">
        {quantity === 0 ? (
          <button
            onClick={() => onAdd(item)}
            className="add-btn"
            aria-label={`Add ${item.name} to order`}
          >
            <Plus size={16} />
            <span>ADD</span>
          </button>
        ) : (
          <div className="qty-stepper">
            <button
              onClick={() => onRemove(item)}
              className="qty-btn minus"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              onClick={() => onAdd(item)}
              className="qty-btn plus"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
