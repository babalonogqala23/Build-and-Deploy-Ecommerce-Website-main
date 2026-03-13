// ============================================================
// CART.JS - Shared cart logic for Tech2etc Ecommerce
// ============================================================

const Cart = {
  // --- Read/Write localStorage ---
  getItems() {
    return JSON.parse(localStorage.getItem("tech2etc_cart") || "[]");
  },
  saveItems(items) {
    localStorage.setItem("tech2etc_cart", JSON.stringify(items));
    Cart.updateBadge();
  },

  // --- Add item ---
  addItem(product) {
    const items = Cart.getItems();
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    Cart.saveItems(items);
    Cart.showToast(`"${product.name}" added to cart!`);
  },

  // --- Remove item ---
  removeItem(id) {
    const items = Cart.getItems().filter((i) => i.id !== id);
    Cart.saveItems(items);
  },

  // --- Update quantity ---
  updateQty(id, qty) {
    const items = Cart.getItems();
    const item = items.find((i) => i.id === id);
    if (item) {
      item.qty = Math.max(1, parseInt(qty) || 1);
      Cart.saveItems(items);
    }
  },

  // --- Clear all ---
  clearCart() {
    localStorage.removeItem("tech2etc_cart");
    Cart.updateBadge();
  },

  // --- Update cart badge count in header ---
  updateBadge() {
    const items = Cart.getItems();
    const total = items.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? "flex" : "none";
    }
  },

  // --- Toast notification ---
  showToast(msg) {
    let toast = document.getElementById("cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cart-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(Cart._toastTimer);
    Cart._toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  },
};

// Init badge on every page load
document.addEventListener("DOMContentLoaded", () => Cart.updateBadge());
