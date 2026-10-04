import React from "react";
import { Coffee, Phone, Wifi, MapPin } from "lucide-react";
import { CAFE_INFO } from "../data/menuData";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Coffee size={24} className="footer-coffee-icon" />
            <span className="footer-name">{CAFE_INFO.name}</span>
          </div>
          <p className="footer-tagline">— {CAFE_INFO.tagline} —</p>
          <p className="footer-desc">
            Freshly brewed artisan teas, rich hot and cold espresso coffees, loaded thick shakes, cheesy pizzas and gourmet cafe bites.
          </p>
        </div>

        <div className="footer-info-col">
          <div className="info-item">
            <MapPin size={16} />
            <span>{CAFE_INFO.address}</span>
          </div>
          <div className="info-item">
            <Phone size={16} />
            <span>{CAFE_INFO.phone}</span>
          </div>
          <div className="info-item">
            <Wifi size={16} />
            <span>WiFi: {CAFE_INFO.wifi}</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} {CAFE_INFO.name} • {CAFE_INFO.tagline}</span>
      </div>
    </footer>
  );
}
