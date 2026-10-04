import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Send,
  CheckCircle,
  Receipt,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { CAFE_INFO } from "../data/menuData";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onAdd,
  onRemove,
  onClear,
  tableNumber,
  setTableNumber,
}) {
  const [customerNote, setCustomerNote] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const calculateTotal = () => {
    return cartItems.reduce((acc, cartItem) => {
      const p = typeof cartItem.item.price === "number" ? cartItem.item.price : 0;
      return acc + p * cartItem.quantity;
    }, 0);
  };

  const totalAmount = calculateTotal();

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      onClear();
      onClose();
    }, 3000);
  };

  const handleSendWhatsApp = () => {
    const tableStr = tableNumber ? `Table #${tableNumber}` : "Takeaway / Counter";
    let message = `*☕ NEW ORDER - CRUST N COFFEE*\n`;
    message += `📍 *Order Type:* ${tableStr}\n`;
    message += `──────────────────────\n`;

    cartItems.forEach((ci) => {
      const priceStr =
        typeof ci.item.price === "number"
          ? `${CAFE_INFO.currency}${ci.item.price * ci.quantity}`
          : ci.item.price;
      message += `• ${ci.item.name} x ${ci.quantity} = ${priceStr}\n`;
    });

    message += `──────────────────────\n`;
    message += `*Total Estimate:* ${CAFE_INFO.currency}${totalAmount}\n`;
    if (customerNote.trim()) {
      message += `📝 *Notes:* ${customerNote.trim()}\n`;
    }
    message += `\nThank you! Please prepare our order.`;

    const encoded = encodeURIComponent(message);
    const cleanPhone = CAFE_INFO.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <Receipt size={22} className="receipt-icon" />
            <div>
              <h3>Your Cafe Order</h3>
              <span className="cart-subtitle">
                {cartItems.length} item{cartItems.length === 1 ? "" : "s"} selected
              </span>
            </div>
          </div>
          <button onClick={onClose} className="drawer-close-btn" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {orderPlaced ? (
          <div className="order-success-state">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="success-icon" />
            </div>
            <h3>Order Received!</h3>
            <p>
              Your order for <strong>Table #{tableNumber || "Direct"}</strong> has been sent to our barista and kitchen counter.
            </p>
            <div className="success-badge">
              <Sparkles size={16} /> Freshly preparing with love
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <div className="empty-icon-wrap">☕</div>
            <h4>Your tray is empty</h4>
            <p>Browse our categories and add your favorite hot coffee, pizza, or shakes!</p>
            <button onClick={onClose} className="browse-menu-btn">
              Explore Menu
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-scroll">
              {/* Table assignment selector */}
              <div className="cart-table-selector">
                <label className="selector-label">Serving Location</label>
                <div className="table-quick-inputs">
                  <span className="table-input-label">Table:</span>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. 4"
                    className="table-number-input"
                  />
                  <span className="table-hint">
                    {tableNumber ? `Assigned to Table ${tableNumber}` : "Counter Order"}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="order-items-list">
                {cartItems.map(({ item, quantity }) => {
                  const itemPrice =
                    typeof item.price === "number"
                      ? `${CAFE_INFO.currency}${item.price * quantity}`
                      : item.price;

                  return (
                    <div key={item.id} className="order-item-row">
                      <div className="order-item-info">
                        <div className="order-item-name-row">
                          <span className="order-veg-dot"></span>
                          <span className="order-item-name">{item.name}</span>
                        </div>
                        <span className="order-unit-price">
                          {typeof item.price === "number" ? `${CAFE_INFO.currency}${item.price} each` : item.price}
                        </span>
                      </div>

                      <div className="order-item-actions">
                        <div className="mini-qty-stepper">
                          <button
                            onClick={() => onRemove(item)}
                            className="mini-qty-btn minus"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="mini-qty-num">{quantity}</span>
                          <button
                            onClick={() => onAdd(item)}
                            className="mini-qty-btn plus"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="order-total-price">{itemPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Note Input */}
              <div className="kitchen-note-box">
                <label className="note-label">
                  <MessageSquare size={14} />
                  <span>Special Request / Cooking Notes</span>
                </label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="e.g. Less sugar in tea, extra cheese on pizza, spicy..."
                  rows={2}
                  className="kitchen-note-input"
                />
              </div>
            </div>

            {/* Cart Footer */}
            <div className="cart-drawer-footer">
              <div className="bill-summary">
                <div className="bill-row">
                  <span>Items Total</span>
                  <span className="bill-val">{CAFE_INFO.currency}{totalAmount}</span>
                </div>
                <div className="bill-row taxes">
                  <span>Taxes & Service</span>
                  <span className="bill-val-free">Included</span>
                </div>
                <div className="bill-divider"></div>
                <div className="bill-row total">
                  <span>Grand Total</span>
                  <span className="bill-grand-val">{CAFE_INFO.currency}{totalAmount}</span>
                </div>
              </div>

              <div className="cart-cta-actions">
                <button
                  onClick={handleSendWhatsApp}
                  className="whatsapp-order-btn"
                  title="Send order via WhatsApp"
                >
                  <Send size={16} />
                  <span>Order via WhatsApp</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  className="place-order-btn"
                >
                  <span>Confirm Table Order</span>
                </button>
              </div>

              <button onClick={onClear} className="clear-cart-link">
                <Trash2 size={13} />
                <span>Clear Tray</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
