// Shared helpers for the Shop pages. Products come from the practice API
// (/api/products). If the API is not running (e.g. a plain static server),
// the same catalogue below is used so the UI still works.
window.Store = (function () {
  const FALLBACK = [
    ["Backpack", 29.99, "Bags", 25, 4.5, "Water-resistant 20L daypack with a padded laptop sleeve."],
    ["Bike Light", 9.99, "Accessories", 40, 4.1, "USB rechargeable front light with three brightness modes."],
    ["Bolt T-Shirt", 15.99, "Clothing", 60, 4.3, "Soft cotton crew-neck tee with the Bolt logo."],
    ["Fleece Jacket", 49.99, "Clothing", 0, 4.7, "Mid-weight fleece for cool mornings. Currently out of stock."],
    ["Onesie", 7.99, "Clothing", 15, 3.9, "Infant onesie in breathable organic cotton."],
    ["Red T-Shirt", 15.99, "Clothing", 33, 4.0, "Classic red tee, relaxed fit."],
    ["Water Bottle", 12.49, "Accessories", 80, 4.6, "750 ml insulated steel bottle, keeps drinks cold for 24 hours."],
    ["Wireless Headphones", 79.0, "Electronics", 12, 4.4, "Over-ear Bluetooth headphones with 30-hour battery life."],
    ["Smart Watch", 129.0, "Electronics", 8, 4.2, "Fitness tracking, notifications and heart-rate monitoring."],
    ["Running Shoes", 64.5, "Footwear", 20, 4.5, "Lightweight trainers with responsive cushioning."],
    ["Coffee Mug", 8.99, "Home", 50, 4.8, "350 ml ceramic mug, dishwasher safe."],
    ["Mechanical Keyboard", 89.99, "Electronics", 5, 4.6, "Tenkeyless keyboard with hot-swappable switches."],
  ].map(([name, price, category, stock, rating, description], i) => ({
    id: i + 1, name, price, category, stock, rating, description,
    image: `/images/products/${slug(name)}.svg`,
  }));

  function slug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function products() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error();
      return (await res.json()).data;
    } catch {
      return FALLBACK;
    }
  }

  async function product(id) {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return FALLBACK.find((p) => p.id === Number(id)) || null;
    }
  }

  function stars(r) {
    const full = Math.round(r);
    return `<span class="small" style="color:#f59e0b" aria-label="Rated ${r} out of 5">${"★".repeat(full)}${"☆".repeat(5 - full)}</span> <span class="small muted">${r}</span>`;
  }

  const TAX_RATE = 0.08;
  function totals(items) {
    const subtotal = +items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    return { subtotal, tax, total: +(subtotal + tax).toFixed(2) };
  }

  return { products, product, slug, stars, totals, TAX_RATE };
})();
