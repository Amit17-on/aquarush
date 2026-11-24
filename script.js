// AquaRush: beginner-friendly JavaScript for the frontend prototype.
// Browser localStorage stores demo data on this device and browser only.

const KEYS = {
  tankers: "aquaRushTankers",
  cart: "aquaRushCart",
  bookings: "aquaRushBookings",
  admin: "aquaRushAdminLoggedIn"
};

const DEFAULT_TANKERS = [
  { id: "t2000", name: "2,000 Litre Water Tanker", capacity: 2000, price: 1200, stock: 5, emoji: "🚛" },
  { id: "t3000", name: "3,000 Litre Water Tanker", capacity: 3000, price: 1800, stock: 5, emoji: "🚚" },
  { id: "t5000", name: "5,000 Litre Water Tanker", capacity: 5000, price: 2800, stock: 4, emoji: "🚛" },
  { id: "t10000", name: "10,000 Litre Water Tanker", capacity: 10000, price: 5000, stock: 3, emoji: "🚚" }
];

const DELIVERY_OPTIONS = {
  normal: { label: "Normal Delivery", fee: 0, description: "Standard requested schedule" },
  fast: { label: "Fast Delivery", fee: 100, description: "Priority handling" },
  emergency: { label: "Emergency Delivery", fee: 500, description: "Urgent priority handling" }
};

function getData(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTankers() {
  let list = getData(KEYS.tankers, null);
  if (!Array.isArray(list)) {
    list = DEFAULT_TANKERS;
    saveData(KEYS.tankers, list);
  }
  return list;
}

function getCart() {
  const list = getData(KEYS.cart, []);
  return Array.isArray(list) ? list : [];
}

function getBookings() {
  const list = getData(KEYS.bookings, []);
  return Array.isArray(list) ? list : [];
}

function money(amount) {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function cartCount() {
  return getCart().reduce((total, item) => total + Number(item.quantity), 0);
}

function cartSubtotal() {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cartCount();
}

function buildHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const currentPage = document.body.dataset.page;
  header.className = "site-header";
  header.innerHTML = `
    <div class="nav-inner">
      <a class="brand" href="index.html"><span class="brand-mark">💧</span>AquaRush</a>
      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">☰</button>
      <nav class="nav-links" id="nav-links">
        <a class="${currentPage === "home" ? "active" : ""}" href="index.html">Home</a>
        <a class="${currentPage === "tankers" ? "active" : ""}" href="tankers.html">Tankers</a>
        <a class="${currentPage === "orders" ? "active" : ""}" href="orders.html">Track Booking</a>
        <a class="${currentPage === "admin" ? "active" : ""}" href="admin.html">Admin</a>
      </nav>
      <div class="nav-actions"><a class="cart-link" href="cart.html">🛒 Cart <span class="cart-count" id="cart-count">0</span></a></div>
    </div>`;
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("open");
  });
  updateCartBadge();
}

function buildFooter() {
  const footer = document.getElementById("site-footer");
  if (!footer) return;
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-inner">
      <div><a class="brand" href="index.html"><span class="brand-mark">💧</span>AquaRush</a><p>Emergency Drinking Water Tanker Supply Booking System</p></div>
      <div><p>Built using HTML5, CSS3 and JavaScript</p><p>Educational frontend prototype · © ${new Date().getFullYear()}</p></div>
    </div>`;
}

function tankerCard(tanker) {
  return `
    <article class="product-card">
      <div class="product-visual"><span class="truck-emoji">${escapeHTML(tanker.emoji || "🚛")}</span></div>
      <h3>${escapeHTML(tanker.name)}</h3>
      <div class="muted">${Number(tanker.capacity).toLocaleString("en-IN")} litres capacity</div>
      <div class="product-meta"><span class="price">${money(tanker.price)} <small>/ tanker</small></span><span class="muted">${tanker.stock > 0 ? tanker.stock + " available" : "Unavailable"}</span></div>
      <button class="btn btn-primary" onclick="addToCart('${escapeHTML(tanker.id)}')" ${tanker.stock <= 0 ? "disabled" : ""}>Add to cart</button>
    </article>`;
}

function showHomeTankers() {
  const area = document.getElementById("home-products");
  if (area) area.innerHTML = getTankers().slice(0, 3).map(tankerCard).join("");
}

function showTankerCatalogue(searchText = "") {
  const area = document.getElementById("tanker-products");
  if (!area) return;
  const matching = getTankers().filter(tanker =>
    tanker.name.toLowerCase().includes(searchText.toLowerCase()) ||
    String(tanker.capacity).includes(searchText)
  );
  area.innerHTML = matching.length
    ? matching.map(tankerCard).join("")
    : `<div class="empty-state"><h2>No tanker found</h2><p>Try searching another capacity.</p></div>`;
  const count = document.getElementById("tanker-count");
  if (count) count.textContent = `${matching.length} tanker option(s)`;
}

function addToCart(tankerId) {
  const tanker = getTankers().find(item => item.id === tankerId);
  if (!tanker || tanker.stock <= 0) return showToast("This tanker is not available.");
  const list = getCart();
  const existing = list.find(item => item.tankerId === tankerId);
  if (existing) {
    if (existing.quantity >= tanker.stock) return showToast("Maximum available quantity reached.");
    existing.quantity += 1;
  } else {
    list.push({
      tankerId: tanker.id, name: tanker.name, capacity: tanker.capacity,
      price: tanker.price, quantity: 1, emoji: tanker.emoji
    });
  }
  saveData(KEYS.cart, list);
  updateCartBadge();
  showToast("Tanker added to your cart.");
}

function changeCartQuantity(tankerId, change) {
  const list = getCart();
  const item = list.find(entry => entry.tankerId === tankerId);
  const tanker = getTankers().find(entry => entry.id === tankerId);
  if (!item) return;
  const nextQuantity = item.quantity + change;
  if (nextQuantity < 1) return;
  if (tanker && nextQuantity > tanker.stock) return showToast("Maximum available quantity reached.");
  item.quantity = nextQuantity;
  saveData(KEYS.cart, list);
  renderCart();
  updateCartBadge();
}

function removeCartItem(tankerId) {
  if (!confirm("Remove this tanker from your cart?")) return;
  saveData(KEYS.cart, getCart().filter(item => item.tankerId !== tankerId));
  renderCart();
  updateCartBadge();
}

function renderCart() {
  const area = document.getElementById("cart-area");
  if (!area) return;
  const list = getCart();
  if (!list.length) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🚛</div><h2>Your cart is empty</h2><p>Choose a tanker capacity to start a booking.</p><a class="btn btn-primary" href="tankers.html">Browse tankers</a></div>`;
    return;
  }
  const totalCapacity = list.reduce((sum, item) => sum + item.capacity * item.quantity, 0);
  area.innerHTML = `
    <div class="cart-layout">
      <section class="panel">
        ${list.map(item => `
          <div class="cart-item">
            <div class="mini-visual">${escapeHTML(item.emoji || "🚛")}</div>
            <div><h3>${escapeHTML(item.name)}</h3><span class="muted">${Number(item.capacity).toLocaleString("en-IN")} L · ${money(item.price)} each</span>
              <div class="qty-control"><button onclick="changeCartQuantity('${escapeHTML(item.tankerId)}', -1)">−</button><b>${item.quantity}</b><button onclick="changeCartQuantity('${escapeHTML(item.tankerId)}', 1)">+</button></div>
              <button class="remove-btn" onclick="removeCartItem('${escapeHTML(item.tankerId)}')">Remove</button>
            </div><b>${money(item.price * item.quantity)}</b>
          </div>`).join("")}
      </section>
      <aside class="panel summary-panel"><h2>Order summary</h2>
        <div class="summary-line"><span>Number of tankers</span><b>${cartCount()}</b></div>
        <div class="summary-line"><span>Total water capacity</span><b>${totalCapacity.toLocaleString("en-IN")} L</b></div>
        <div class="summary-line summary-total"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
        <p class="small-note">Delivery charge will be calculated after you choose Normal, Fast or Emergency delivery.</p>
        <a class="btn btn-primary" href="checkout.html">Continue to booking →</a><a class="btn btn-light" href="tankers.html">Add more tankers</a>
      </aside>
    </div>`;
}

function createBookingId() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `AQR-${datePart}-${String(Date.now()).slice(-5)}`;
}

function showCheckout() {
  const area = document.getElementById("checkout-area");
  if (!area) return;
  const list = getCart();
  if (!list.length) {
    area.innerHTML = `<div class="empty-state"><h2>No tanker selected</h2><p>Add a tanker to your cart before checkout.</p><a class="btn btn-primary" href="tankers.html">Choose a tanker</a></div>`;
    return;
  }
  area.innerHTML = `
    <div class="checkout-layout">
      <form class="panel" id="booking-form">
        <h2>Customer information</h2>
        <div class="form-grid">
          <label>Full name<input name="name" required placeholder="Enter your name"></label>
          <label>Email address<input name="email" type="email" required placeholder="you@example.com"></label>
          <label>Mobile number<input name="phone" type="tel" pattern="[0-9]{10}" required placeholder="10-digit mobile number"></label>
          <label>Booking type<select name="bookingType"><option>Individual home</option><option>Apartment society</option><option>Hostel / institution</option><option>Business</option></select></label>
          <label class="full">Complete delivery address<textarea name="address" rows="3" required placeholder="House / society, street, city and PIN code"></textarea></label>
          <label>Preferred delivery date<input type="date" id="delivery-date" name="deliveryDate" required></label>
          <label>Preferred time slot<select name="timeSlot" required><option value="">Select time slot</option><option>Morning (7 AM – 11 AM)</option><option>Afternoon (11 AM – 3 PM)</option><option>Evening (3 PM – 7 PM)</option><option>Urgent – earliest available</option></select></label>
        </div>
        <h2>Choose delivery speed</h2>
        <div class="delivery-choice">
          <label class="delivery-option"><input type="radio" name="delivery" value="normal" checked><b>Normal</b><span>Standard schedule</span><strong>Free</strong></label>
          <label class="delivery-option"><input type="radio" name="delivery" value="fast"><b>Fast</b><span>Priority handling</span><strong>+ ₹100</strong></label>
          <label class="delivery-option"><input type="radio" name="delivery" value="emergency"><b>Emergency</b><span>Urgent priority</span><strong>+ ₹500</strong></label>
        </div>
        <label class="form-grid full">Additional instructions (optional)<textarea name="notes" rows="2" placeholder="Landmark, access details or other instructions"></textarea></label>
        <p class="small-note">The date and time are requested preferences in this demo. This website does not contact a real tanker operator.</p>
        <button class="btn btn-primary" type="submit">Confirm booking</button>
      </form>
      <aside class="panel summary-panel" id="checkout-summary"></aside>
    </div>`;
  const dateInput = document.getElementById("delivery-date");
  dateInput.min = new Date().toISOString().slice(0, 10);
  dateInput.value = dateInput.min;
  document.querySelectorAll('input[name="delivery"]').forEach(radio => radio.addEventListener("change", updateCheckoutSummary));
  updateCheckoutSummary();
  document.getElementById("booking-form").addEventListener("submit", submitBooking);
}

function selectedDelivery() {
  const chosen = document.querySelector('input[name="delivery"]:checked');
  return DELIVERY_OPTIONS[chosen ? chosen.value : "normal"];
}

function updateCheckoutSummary() {
  const area = document.getElementById("checkout-summary");
  if (!area) return;
  const delivery = selectedDelivery();
  const base = cartSubtotal();
  const total = base + delivery.fee;
  area.innerHTML = `<h2>Price breakdown</h2>
    ${getCart().map(item => `<div class="summary-line"><span>${escapeHTML(item.name)} × ${item.quantity}</span><b>${money(item.price * item.quantity)}</b></div>`).join("")}
    <div class="summary-line"><span>Tanker subtotal</span><b>${money(base)}</b></div>
    <div class="summary-line"><span>${delivery.label}</span><b>${delivery.fee === 0 ? "Free" : money(delivery.fee)}</b></div>
    <div class="summary-line summary-total"><span>Total payable</span><strong>${money(total)}</strong></div>
    <div class="delivery-summary"><b>${delivery.label}</b><br>${delivery.description}. ${delivery.fee === 0 ? "No extra charge." : "Additional charge: " + money(delivery.fee) + "."}</div>
    <p class="small-note">Sample educational pricing. Actual supplier charges may differ.</p>`;
}

function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  const list = getCart();
  if (!list.length) return showToast("Your cart is empty.");
  const deliveryKey = formData.get("delivery");
  const delivery = DELIVERY_OPTIONS[deliveryKey];
  const subtotal = cartSubtotal();
  const booking = {
    id: createBookingId(),
    customer: {
      name: formData.get("name").trim(),
      email: formData.get("email").trim().toLowerCase(),
      phone: formData.get("phone").trim(),
      bookingType: formData.get("bookingType"),
      address: formData.get("address").trim()
    },
    items: list,
    capacity: list.reduce((sum, item) => sum + item.capacity * item.quantity, 0),
    subtotal,
    deliveryType: deliveryKey,
    deliveryLabel: delivery.label,
    deliveryFee: delivery.fee,
    total: subtotal + delivery.fee,
    deliveryDate: formData.get("deliveryDate"),
    timeSlot: formData.get("timeSlot"),
    notes: formData.get("notes"),
    status: "Pending",
    createdAt: new Date().toISOString()
  };
  const allBookings = getBookings();
  allBookings.push(booking);
  saveData(KEYS.bookings, allBookings);
  saveData(KEYS.cart, []);
  updateCartBadge();
  document.getElementById("checkout-area").innerHTML = `
    <div class="success-box"><div style="font-size:44px">✓</div><h2>Booking submitted successfully!</h2>
      <p>Your demo booking ID is <b>${escapeHTML(booking.id)}</b></p>
      <p>Delivery: <b>${escapeHTML(booking.deliveryLabel)}</b> · ${money(booking.deliveryFee)} extra charge</p>
      <p>Requested schedule: <b>${escapeHTML(booking.deliveryDate)} · ${escapeHTML(booking.timeSlot)}</b></p>
      <p>Total: <b>${money(booking.total)}</b> · Status: <b>Pending</b></p>
      <p class="small-note">Remember your booking email and ID to track this request.</p>
      <a class="btn btn-primary" href="orders.html">Track booking</a>
    </div>`;
}

function renderCustomerBookings(email) {
  const area = document.getElementById("orders-area");
  if (!area) return;
  const cleanedEmail = email.trim().toLowerCase();
  if (!cleanedEmail) {
    area.innerHTML = `<p class="muted">Enter the email address used when making your booking.</p>`;
    return;
  }
  const list = getBookings().filter(booking => booking.customer.email.toLowerCase() === cleanedEmail);
  if (!list.length) {
    area.innerHTML = `<div class="empty-state"><h2>No bookings found</h2><p>Check your email address or make a new tanker booking.</p><a class="btn btn-primary" href="tankers.html">Book a tanker</a></div>`;
    return;
  }
  area.innerHTML = list.slice().reverse().map(booking => `
    <article class="order-card">
      <div class="order-top"><div><div class="order-id">${escapeHTML(booking.id)}</div><span class="muted">Booked ${new Date(booking.createdAt).toLocaleString("en-IN")}</span></div><span class="status ${booking.status.toLowerCase().replaceAll(" ", "-")}">${escapeHTML(booking.status)}</span></div>
      <div class="order-details"><span>${booking.items.map(item => `${escapeHTML(item.name)} × ${item.quantity}`).join("<br>")}<br>Total capacity: ${Number(booking.capacity).toLocaleString("en-IN")} L</span><span>${escapeHTML(booking.deliveryLabel)}<br>Requested: ${escapeHTML(booking.deliveryDate)}<br>${escapeHTML(booking.timeSlot)}</span><b>${money(booking.total)}</b></div>
      <div class="order-actions">${booking.status === "Pending" ? `<button class="btn btn-light btn-small" onclick="cancelBooking('${escapeHTML(booking.id)}')">Cancel booking</button>` : ""}<button class="btn btn-outline btn-small" onclick="viewBooking('${escapeHTML(booking.id)}')">View details</button></div>
    </article>`).join("");
}

function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this pending booking?")) return;
  const list = getBookings();
  const booking = list.find(item => item.id === bookingId);
  if (!booking || booking.status !== "Pending") return showToast("Only pending bookings can be cancelled.");
  booking.status = "Cancelled";
  saveData(KEYS.bookings, list);
  renderCustomerBookings(document.getElementById("track-email").value);
  showToast("Booking cancelled.");
}

function viewBooking(bookingId) {
  const booking = getBookings().find(item => item.id === bookingId);
  if (!booking) return;
  alert(`Booking ID: ${booking.id}\nCustomer: ${booking.customer.name}\nAddress: ${booking.customer.address}\nCapacity: ${booking.capacity} litres\nDelivery: ${booking.deliveryLabel}\nRequested: ${booking.deliveryDate} - ${booking.timeSlot}\nTotal: ${money(booking.total)}\nStatus: ${booking.status}`);
}

function seedDemoBookings() {
  if (getBookings().length) return;
  const today = new Date();
  const date = today.toISOString().slice(0, 10);
  const examples = [
    { id: "AQR-DEMO-1001", customer: { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", bookingType: "Apartment society", address: "Sample Apartment, Phagwara" }, items: [{ name: "5,000 Litre Water Tanker", capacity: 5000, price: 2800, quantity: 1 }], capacity: 5000, subtotal: 2800, deliveryType: "emergency", deliveryLabel: "Emergency Delivery", deliveryFee: 500, total: 3300, deliveryDate: date, timeSlot: "Urgent – earliest available", status: "Pending", createdAt: today.toISOString() },
    { id: "AQR-DEMO-1002", customer: { name: "Priya Singh", email: "priya@example.com", phone: "9876501234", bookingType: "Individual home", address: "Sample Street, Phagwara" }, items: [{ name: "2,000 Litre Water Tanker", capacity: 2000, price: 1200, quantity: 1 }], capacity: 2000, subtotal: 1200, deliveryType: "fast", deliveryLabel: "Fast Delivery", deliveryFee: 100, total: 1300, deliveryDate: date, timeSlot: "Morning (7 AM – 11 AM)", status: "Scheduled", createdAt: new Date(today.getTime() - 86400000).toISOString() }
  ];
  saveData(KEYS.bookings, examples);
}

function showAdminStats() {
  const area = document.getElementById("admin-stats");
  if (!area) return;
  const bookings = getBookings();
  const stats = [
    ["Total bookings", bookings.length, "📋"],
    ["Pending", bookings.filter(item => item.status === "Pending").length, "⏳"],
    ["Scheduled", bookings.filter(item => item.status === "Scheduled").length, "🗓️"],
    ["Delivered value", money(bookings.filter(item => item.status === "Delivered").reduce((sum, item) => sum + item.total, 0)), "₹"]
  ];
  area.innerHTML = stats.map(item => `<div class="stat-card"><span>${item[2]} ${item[0]}</span><strong>${item[1]}</strong></div>`).join("");
}

function showAdminBookings(search = "") {
  const area = document.getElementById("admin-bookings");
  if (!area) return;
  const bookings = getBookings().filter(item => `${item.id} ${item.customer.name} ${item.customer.phone}`.toLowerCase().includes(search.toLowerCase()));
  area.innerHTML = bookings.length ? bookings.map(booking => `
    <tr><td><b>${escapeHTML(booking.id)}</b></td><td>${escapeHTML(booking.customer.name)}<br><span class="muted">${escapeHTML(booking.customer.phone)}</span></td>
    <td>${Number(booking.capacity).toLocaleString("en-IN")} L<br><span class="muted">${escapeHTML(booking.deliveryLabel)}</span></td>
    <td>${escapeHTML(booking.deliveryDate)}<br>${escapeHTML(booking.timeSlot)}</td><td>${money(booking.total)}</td>
    <td><span class="status ${booking.status.toLowerCase().replaceAll(" ", "-")}">${escapeHTML(booking.status)}</span></td>
    <td><select onchange="updateBookingStatus('${escapeHTML(booking.id)}', this.value)" ${["Delivered", "Cancelled"].includes(booking.status) ? "disabled" : ""}>${["Pending", "Confirmed", "Scheduled", "Out for Delivery", "Delivered", "Cancelled"].map(status => `<option ${booking.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td></tr>`).join("") : `<tr><td colspan="7">No bookings found.</td></tr>`;
}

function updateBookingStatus(bookingId, newStatus) {
  const list = getBookings();
  const booking = list.find(item => item.id === bookingId);
  if (!booking) return;
  const allowed = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Scheduled", "Cancelled"],
    Scheduled: ["Out for Delivery", "Cancelled"],
    "Out for Delivery": ["Delivered"],
    Delivered: [],
    Cancelled: []
  };
  if (!allowed[booking.status].includes(newStatus)) {
    showToast("That status change is not allowed.");
    renderAdmin();
    return;
  }
  booking.status = newStatus;
  saveData(KEYS.bookings, list);
  renderAdmin();
  showToast("Booking status updated.");
}

function showAdminTankers() {
  const area = document.getElementById("admin-tanker-list");
  if (!area) return;
  area.innerHTML = getTankers().map(tanker => `
    <div class="admin-list-row"><div><strong>${escapeHTML(tanker.name)}</strong><small>${Number(tanker.capacity).toLocaleString("en-IN")} L · ${money(tanker.price)} per tanker · ${tanker.stock} available</small></div>
    <div class="row-actions"><button class="btn btn-light btn-small" onclick="editTanker('${escapeHTML(tanker.id)}')">Edit</button><button class="btn btn-outline btn-small" onclick="deleteTanker('${escapeHTML(tanker.id)}')">Delete</button></div></div>`).join("");
}

function saveTanker(event) {
  event.preventDefault();
  const id = document.getElementById("edit-tanker-id").value;
  const tanker = {
    id: id || "tanker-" + Date.now(),
    name: document.getElementById("admin-tanker-name").value.trim(),
    capacity: Number(document.getElementById("admin-tanker-capacity").value),
    price: Number(document.getElementById("admin-tanker-price").value),
    stock: Number(document.getElementById("admin-tanker-stock").value),
    emoji: "🚛"
  };
  if (!tanker.name || tanker.capacity <= 0 || tanker.price <= 0 || tanker.stock < 0) return showToast("Enter valid tanker details.");
  const list = getTankers();
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) list[index] = tanker;
  else list.push(tanker);
  saveData(KEYS.tankers, list);
  document.getElementById("tanker-form").reset();
  document.getElementById("edit-tanker-id").value = "";
  showAdminTankers();
  showToast("Tanker details saved.");
}

function editTanker(id) {
  const tanker = getTankers().find(item => item.id === id);
  if (!tanker) return;
  document.getElementById("edit-tanker-id").value = tanker.id;
  document.getElementById("admin-tanker-name").value = tanker.name;
  document.getElementById("admin-tanker-capacity").value = tanker.capacity;
  document.getElementById("admin-tanker-price").value = tanker.price;
  document.getElementById("admin-tanker-stock").value = tanker.stock;
  window.scrollTo({ top: document.getElementById("tanker-form").offsetTop - 100, behavior: "smooth" });
}

function deleteTanker(id) {
  if (!confirm("Delete this tanker option?")) return;
  saveData(KEYS.tankers, getTankers().filter(item => item.id !== id));
  saveData(KEYS.cart, getCart().filter(item => item.tankerId !== id));
  showAdminTankers();
  updateCartBadge();
  showToast("Tanker option deleted.");
}

function showAdminCustomers() {
  const area = document.getElementById("admin-customers");
  if (!area) return;
  const customers = {};
  getBookings().forEach(booking => {
    const email = booking.customer.email;
    if (!customers[email]) customers[email] = { ...booking.customer, count: 0 };
    customers[email].count += 1;
  });
  area.innerHTML = Object.values(customers).map(customer => `<tr><td>${escapeHTML(customer.name)}</td><td>${escapeHTML(customer.email)}</td><td>${escapeHTML(customer.phone)}</td><td>${customer.count}</td></tr>`).join("") || `<tr><td colspan="4">No customers found.</td></tr>`;
}

function renderAdmin() {
  showAdminStats();
  showAdminBookings(document.getElementById("admin-search")?.value || "");
  showAdminTankers();
  showAdminCustomers();
}

function setupAdmin() {
  seedDemoBookings();
  const login = document.getElementById("admin-login");
  const dashboard = document.getElementById("admin-dashboard");
  if (getData(KEYS.admin, false)) {
    login.hidden = true;
    dashboard.hidden = false;
    renderAdmin();
  }
  document.getElementById("admin-login-button").addEventListener("click", () => {
    if (document.getElementById("admin-password").value === "admin123") {
      saveData(KEYS.admin, true);
      login.hidden = true;
      dashboard.hidden = false;
      renderAdmin();
    } else {
      showToast("Incorrect demo password.");
    }
  });
  document.getElementById("admin-search").addEventListener("input", event => showAdminBookings(event.target.value));
  document.getElementById("tanker-form").addEventListener("submit", saveTanker);
  document.getElementById("clear-tanker-form").addEventListener("click", () => {
    document.getElementById("tanker-form").reset();
    document.getElementById("edit-tanker-id").value = "";
  });
  document.querySelectorAll(".tab-button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      ["bookings", "tankers", "customers"].forEach(tab => {
        document.getElementById("tab-" + tab).hidden = tab !== button.dataset.tab;
      });
    });
  });
}

function initializePage() {
  buildHeader();
  buildFooter();
  getTankers();
  const page = document.body.dataset.page;
  if (page === "home") showHomeTankers();
  if (page === "tankers") {
    showTankerCatalogue();
    document.getElementById("tanker-search").addEventListener("input", event => showTankerCatalogue(event.target.value));
  }
  if (page === "cart") renderCart();
  if (page === "checkout") showCheckout();
  if (page === "orders") {
    document.getElementById("track-button").addEventListener("click", () => renderCustomerBookings(document.getElementById("track-email").value));
    document.getElementById("track-email").addEventListener("keydown", event => {
      if (event.key === "Enter") renderCustomerBookings(event.target.value);
    });
  }
  if (page === "admin") setupAdmin();
}

document.addEventListener("DOMContentLoaded", initializePage);
