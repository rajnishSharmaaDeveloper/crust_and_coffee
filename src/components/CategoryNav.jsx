import React from "react";
import {
  Utensils,
  CupSoda,
  Coffee,
  IceCream,
  Milk,
  GlassWater,
  Sandwich,
  Pizza,
  Soup,
  Wheat,
  Sparkles,
} from "lucide-react";
import { MENU_CATEGORIES } from "../data/menuData";

const iconMap = {
  Utensils: Utensils,
  CupSoda: CupSoda,
  Coffee: Coffee,
  IceCream: IceCream,
  Milk: Milk,
  GlassWater: GlassWater,
  Sandwich: Sandwich,
  Pizza: Pizza,
  Soup: Soup,
  Wheat: Wheat,
  Sparkles: Sparkles,
};

export default function CategoryNav({ activeCategory, setActiveCategory, categoryCounts }) {
  return (
    <nav className="category-nav-bar" aria-label="Menu Categories">
      <div className="category-scroll-container">
        {MENU_CATEGORIES.map((cat) => {
          const IconComp = iconMap[cat.icon] || Utensils;
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? cat.count;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-pill ${isActive ? "active" : ""}`}
            >
              <div className="pill-icon-wrap">
                <IconComp size={16} />
              </div>
              <span className="pill-name">{cat.name}</span>
              <span className="pill-count-bubble">{count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
