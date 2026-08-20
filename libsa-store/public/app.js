// ==========================================================
// LIBSA — منطق الواجهة (front-end logic)
// غادي يقرا PRODUCTS من products.js ويبني الصفحة كاملة
// ==========================================================

// عنوان الـ API ديال الباك-اند. فاش تشغل السيرفر محلياً (npm run dev)
// خليه http://https://4w4hxqz6-3000.uks1.devtunnels.ms/
///api/orders، وفاش ترفع السيت للإنترنت
// بدلو برابط السيرفر ديالك (مثلا فـ Render).
const API_BASE = "https://libsa-store.vercel.app.vercel.app/api/orders";
const state = {
  activeCat: "الكل",
  cart: []
};

const grid = document.getElementById("productGrid");
const rack = document.getElementById("rack");
const overlay = document.getElementById("overlay");
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const cartPanel = document.getElementById("cartPanel");
const cartBtn = document.getElementById("cartBtn");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutForm = document.getElementById("checkoutForm");
const formStatus = document.getElementById("formStatus");
const confirmBtn = document.getElementById("confirmBtn");

// ---------- render catalog ----------
function renderGrid() {
  const items = state.activeCat === "الكل"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.cat === state.activeCat);

  grid.innerHTML = items.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="card-photo" style="background:${p.swatch}">
  <img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; z-index:1;">
        ${p.tag ? `<span class="card-tag">${p.tag}</span>` : ""}
        <span class="price-tag">${p.price} د.م.</span>
      </div>
      <div class="card-info">
        <span class="card-cat">${p.cat}</span>
        <span class="card-name">${p.name}</span>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openQuickView(card.dataset.id));
  });
}

// ---------- category filter ----------
rack.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    rack.querySelectorAll(".pill").forEach(p => p.classList.remove("is-active"));
    pill.classList.add("is-active");
    state.activeCat = pill.dataset.cat;
    renderGrid();
  });
});

// ---------- quick view modal ----------
let quickViewState = { product: null, size: null, color: null, qty: 1 };

function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  quickViewState = { product: p, size: p.sizes[0], color: p.colors[0], qty: 1 };
  renderModal();
  overlay.classList.add("is-open");
  productModal.classList.add("is-open");
}

function renderModal() {
  const { product, size, color, qty } = quickViewState;

  // 1. كايجيب الصور كاملين
  const imgs = (product.images && product.images.length > 0) ? product.images : [product.image];

  // 2. كايصاوب الصور الصغار
  const galleryThumbs = imgs.map((imgUrl, index) => `
    <img 
      src="${imgUrl}" 
      data-img="${imgUrl}"
      class="thumb-img"
      style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid ${index === 0 ? '#eab308' : '#ddd'}; margin-top: 8px;"
    />
  `).join('');

  // 3. كايعمر الـ HTML ديال النافذة
  modalBody.innerHTML = `
    <div class="modal-photo" style="background-image: url('${imgs[0]}'); background-size: contain; background-repeat: no-repeat; background-position: center; height: 250px;"></div>
    <div class="thumbs-container" style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
      ${galleryThumbs}
    </div>
    <h3>${product.name}</h3>
    <p class="modal-price">${product.price} د.م.</p>

    <div class="option-group">
      <span class="option-label">المقاس</span>
      <div class="option-btns" id="sizeBtns">
        ${product.sizes.map(s => `<button type="button" class="opt-btn ${s === size ? 'is-active' : ''}" data-size="${s}">${s}</button>`).join('')}
      </div>
    </div>

    <div class="option-group">
      <span class="option-label">اللون</span>
      <div class="option-btns" id="colorBtns">
        ${product.colors.map(c => `<button type="button" class="opt-btn ${c === color ? 'is-active' : ''}" data-color="${c}">${c}</button>`).join('')}
      </div>
    </div>

    <div class="option-group qty-group">
      <span class="option-label">الكمية</span>
      <div class="qty-picker">
        <button type="button" class="qty-btn" id="qtyMinus">-</button>
        <span class="qty-val" id="qtyVal">${qty}</span>
        <button type="button" class="qty-btn" id="qtyPlus">+</button>
      </div>
    </div>

    <button type="button" class="btn-primary btn-full" id="addToCartBtn">زيد للسلة</button>
  `;

  // 4. كايزيد حدث الضغط (Click) على التصاوير الصغار باش تبدل الصورة الكبيرة
  modalBody.querySelectorAll(".thumb-img").forEach(thumb => {
    thumb.addEventListener("click", (e) => {
      const newImg = e.target.dataset.img;
      const mainPhoto = modalBody.querySelector(".modal-photo");
      if (mainPhoto) {
        mainPhoto.style.backgroundImage = `url('${newImg}')`;
      }
      modalBody.querySelectorAll(".thumb-img").forEach(t => t.style.borderColor = "#ddd");
      e.target.style.borderColor = "#eab308";
    });
  });

  // Events القدام ديال المقاس والكمية والسلة
  modalBody.querySelectorAll("#sizeBtns .opt-btn").forEach(btn => {
    btn.addEventListener("click", () => { quickViewState.size = btn.dataset.size; renderModal(); });
  });
  modalBody.querySelectorAll("#colorBtns .opt-btn").forEach(btn => {
    btn.addEventListener("click", () => { quickViewState.color = btn.dataset.color; renderModal(); });
  });
  modalBody.querySelector("#qtyMinus").addEventListener("click", () => {
    quickViewState.qty = Math.max(1, quickViewState.qty - 1);
    renderModal();
  });
  modalBody.querySelector("#qtyPlus").addEventListener("click", () => {
    quickViewState.qty += 1;
    renderModal();
  });
  modalBody.querySelector("#addToCartBtn").addEventListener("click", addToCart);
}
function closeQuickView() {
  overlay.classList.remove("is-open");
  productModal.classList.remove("is-open");
}
modalClose.addEventListener("click", closeQuickView);
overlay.addEventListener("click", () => { closeQuickView(); closeCart(); });

// ---------- cart ----------
function addToCart() {
  const { product, size, color, qty } = quickViewState;
  state.cart.push({
    id: product.id + "-" + size + "-" + color,
    name: product.name,
    price: product.price,
    size, color, qty
  });
  renderCart();
  closeQuickView();
  openCart();
}

function renderCart() {
  if (state.cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">السلة ديالك فارغة، زيد شي حاجة من المجموعة 🛍️</p>`;
  } else {
    cartItemsEl.innerHTML = state.cart.map((item, i) => `
      <div class="cart-item">
        <div>
          <div>${item.name}</div>
          <div class="cart-item-meta">${item.size} · ${item.color} · x${item.qty}</div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:end; gap:6px;">
          <span class="mono">${item.price * item.qty} د.م.</span>
          <button class="cart-item-remove" data-idx="${i}">حيد</button>
        </div>
      </div>
    `).join("");
    cartItemsEl.querySelectorAll(".cart-item-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        state.cart.splice(Number(btn.dataset.idx), 1);
        renderCart();
      });
    });
  }

  const total = state.cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  cartTotalEl.textContent = total + " د.م.";
  cartCountEl.textContent = state.cart.reduce((s, it) => s + it.qty, 0);
}

function openCart() {
  cartPanel.classList.add("is-open");
  overlay.classList.add("is-open");
}
function closeCart() {
  cartPanel.classList.remove("is-open");
  if (!productModal.classList.contains("is-open")) overlay.classList.remove("is-open");
}
cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);

// ---------- checkout submit ----------
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (state.cart.length === 0) {
    formStatus.textContent = "زيد شي منتج للسلة قبل ما تأكد الطلب.";
    formStatus.classList.add("err");
    return;
  }

  const fd = new FormData(checkoutForm);
  const order = {
    fullName: fd.get("fullName"),
    phone: fd.get("phone"),
    city: fd.get("city"),
    address: fd.get("address"),
    items: state.cart,
    total: state.cart.reduce((s, it) => s + it.price * it.qty, 0)
  };

  confirmBtn.disabled = true;
  confirmBtn.textContent = "كنأكدو الطلب...";

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error("server error");

    formStatus.textContent = "تم تأكيد طلبك ✅ غنتصلو بيك قريباً!";
    formStatus.classList.add("ok");
    state.cart = [];
    renderCart();
    checkoutForm.reset();
  } catch (err) {
    // السيرفر ماشي خدام دابا (محلي ولا فالإنترنت) — راجع README.md
    formStatus.textContent = "ماقدرناش نأكدو الطلب. تأكد بلي السيرفر (server.js) خدام، شوف README.md.";
    formStatus.classList.add("err");
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.textContent = "تأكيد الطلب";
  }
});

// ---------- init ----------
renderGrid();
renderCart();
