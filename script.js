// Totya Shop — Vanilla JS front-end project
// Features: products array (20), search, filter, sort, pagination, product page, cart (localStorage), wishlist.
// Images referenced with relative paths: ./assets/images/p1.png ... p20.png

/* ======================
   Data
   ====================== */
const products = [
  {id:1,title:"Aurora Headphones",description:"Wireless over-ear headphones with deep bass and long battery life.",price:79.99,category:"Audio",image:"./assets/images/p1.png"},
  {id:2,title:"Nebula Desk Lamp",description:"Ambient RGB lamp with color temperature control.",price:34.99,category:"Home",image:"./assets/images/p2.png"},
  {id:3,title:"Skyline Backpack",description:"Durable travel backpack with waterproof fabric.",price:49.99,category:"Bags",image:"./assets/images/p3.png"},
  {id:4,title:"Pulse Gaming Mouse",description:"High precision gaming mouse with RGB lighting.",price:29.99,category:"Gaming",image:"./assets/images/p4.png"},
  {id:5,title:"Vortex Keyboard",description:"Mechanical keyboard with tactile switches and aluminum frame.",price:89.99,category:"Gaming",image:"./assets/images/p5.png"},
  {id:6,title:"Comet Sneakers",description:"Lightweight sneakers for everyday comfort and urban style.",price:59.99,category:"Fashion",image:"./assets/images/p6.png"},
  {id:7,title:"Orbit Sunglasses",description:"Polarized sunglasses with UV protection and metal hinges.",price:24.99,category:"Fashion",image:"./assets/images/p7.png"},
  {id:8,title:"Flux Portable Charger",description:"10000mAh compact power bank with fast charging support.",price:22.99,category:"Gadgets",image:"./assets/images/p8.png"},
  {id:9,title:"Lumen Smartwatch",description:"Fitness smartwatch with heart-rate monitor and notifications.",price:129.99,category:"Wearables",image:"./assets/images/p9.png"},
  {id:10,title:"Canvas Messenger Bag",description:"Retro messenger bag with adjustable strap and padded interior.",price:39.99,category:"Bags",image:"./assets/images/p10.png"},
  {id:11,title:"Echo Bluetooth Speaker",description:"Portable speaker with 12 hours playtime and rich bass.",price:45.00,category:"Audio",image:"./assets/images/p11.png"},
  {id:12,title:"Halo Desk Mat",description:"Large desk mat with smooth fabric surface for mouse and keyboard.",price:18.50,category:"Accessories",image:"./assets/images/p12.png"},
  {id:13,title:"Atlas Travel Mug",description:"Insulated stainless steel mug keeps drinks hot for hours.",price:16.99,category:"Home",image:"./assets/images/p13.png"},
  {id:14,title:"Nexus Webcam",description:"1080p webcam with autofocus and built-in microphone.",price:49.49,category:"Gadgets",image:"./assets/images/p14.png"},
  {id:15,title:"Stratus Hoodie",description:"Comfort hoodie with soft fleece lining and front pocket.",price:34.00,category:"Fashion",image:"./assets/images/p15.png"},
  {id:16,title:"Pulse Pro Controller",description:"Wireless controller compatible with PC and consoles.",price:64.99,category:"Gaming",image:"./assets/images/p16.png"},
  {id:17,title:"Arc Phone Case",description:"Durable phone case with shock absorption and slim profile.",price:12.99,category:"Accessories",image:"./assets/images/p17.png"},
  {id:18,title:"Boreal Jacket",description:"Water-resistant jacket with breathable lining and hood.",price:99.99,category:"Fashion",image:"./assets/images/p18.png"},
  {id:19,title:"Prism Monitor Arm",description:"Ergonomic monitor arm supporting up to 32\" displays.",price:74.99,category:"Office",image:"./assets/images/p19.png"},
  {id:20,title:"Quasar USB-C Hub",description:"Multiport USB-C hub with HDMI, Ethernet and card reader.",price:39.90,category:"Gadgets",image:"./assets/images/p20.png"}
];

/* ======================
   State & DOM
   ====================== */
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");
const paginationEl = document.getElementById("pagination");
const productDetailEl = document.getElementById("productDetail");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const PAGE_SIZE = 9;
let currentPage = 1;
let filteredList = [...products];

/* ======================
   Utilities
   ====================== */
function saveState(){ localStorage.setItem("cart", JSON.stringify(cart)); localStorage.setItem("wishlist", JSON.stringify(wishlist)); }
function formatPrice(v){ return v.toFixed(2) + " $"; }
function getQueryParam(name){ const url = new URL(window.location.href); return url.searchParams.get(name); }

/* ======================
   Cart functions
   ====================== */
function updateCartUI(){
  if(!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item=>{
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="meta">
        <h5>${item.title}</h5>
        <p>${formatPrice(item.price)}</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        <span>${item.qty}</span>
        <button class="qty-btn" data-action="dec" data-id="${item.id}">-</button>
      </div>
    `;
    cartItems.appendChild(div);
    total += item.price * item.qty;
  });
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
  saveState();
}

function addToCart(product, qty=1){
  const found = cart.find(i=>i.id === product.id);
  if(found) found.qty += qty;
  else cart.push({...product, qty});
  updateCartUI();
}

/* delegated cart qty handler */
if(cartItems){
  cartItems.addEventListener("click", (e)=>{
    if(!e.target.classList.contains("qty-btn")) return;
    const id = Number(e.target.dataset.id); const action = e.target.dataset.action;
    const item = cart.find(i=>i.id===id); if(!item) return;
    if(action === "inc") item.qty++; else { item.qty--; if(item.qty<=0) cart = cart.filter(i=>i.id!==id); }
    updateCartUI();
  });
}

/* ======================
   Render product cards
   ====================== */
function renderProductCard(product){
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="card-media"><img src="${product.image}" alt="${product.title}"></div>
    <h4>${product.title}</h4>
    <p>${product.description.substring(0,90)}${product.description.length>90?"...":""}</p>
    <div class="price-row">
      <div class="price-left"><span class="badge">${product.category}</span></div>
      <div style="display:flex;gap:10px;align-items:center">
        <strong class="price">${formatPrice(product.price)}</strong>
        <a class="btn" href="product.html?id=${product.id}">Details</a>
        <button class="btn primary add-cart" data-id="${product.id}">Add</button>
      </div>
    </div>
  `;
  return el;
}

function renderProductsList(list, page=1){
  if(!productsGrid) return;
  productsGrid.innerHTML = "";
  const start = (page-1)*PAGE_SIZE;
  const pageItems = list.slice(start, start+PAGE_SIZE);
  pageItems.forEach(p => productsGrid.appendChild(renderProductCard(p)));
  renderPagination(list.length, page);
}

/* ======================
   Pagination
   ====================== */
function renderPagination(totalItems, page){
  if(!paginationEl) return;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  paginationEl.innerHTML = "";
  if(totalPages <= 1) return;
  for(let i=1;i<=totalPages;i++){
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i===page ? " active" : "");
    btn.textContent = i; btn.onclick = ()=>{ currentPage = i; renderProductsList(filteredList, currentPage); };
    paginationEl.appendChild(btn);
  }
}

/* ======================
   Filters & sort
   ====================== */
function loadCategories(){
  if(!categorySelect) return;
  const cats = [...new Set(products.map(p=>p.category))];
  cats.forEach(c=>{
    const opt = document.createElement("option"); opt.value = c; opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}

function sortList(list, type){
  if(type === "price-asc") return list.sort((a,b)=>a.price-b.price);
  if(type === "price-desc") return list.sort((a,b)=>b.price-a.price);
  if(type === "name-asc") return list.sort((a,b)=>a.title.localeCompare(b.title));
  return list;
}

function applyFilters(){
  let list = [...products];
  const q = searchInput ? searchInput.value.toLowerCase() : "";
  if(q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  if(categorySelect && categorySelect.value !== "all") list = list.filter(p => p.category === categorySelect.value);
  list = sortList(list, sortSelect ? sortSelect.value : "default");
  filteredList = list; currentPage = 1; renderProductsList(filteredList, currentPage);
}

/* delegated add-to-cart */
if(productsGrid){
  productsGrid.addEventListener("click", (e)=>{
    const btn = e.target.closest(".add-cart");
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const product = products.find(p=>p.id===id);
    if(product) {
      addToCart(product,1);
      // subtle animation feedback
      btn.animate([{transform:'scale(1)'},{transform:'scale(0.94)'},{transform:'scale(1)'}],{duration:220});
    }
  });
}

/* ======================
   Product page
   ====================== */
function renderProductPage(id){
  if(!productDetailEl) return;
  const product = products.find(p=>p.id === Number(id));
  if(!product){ productDetailEl.innerHTML = "<p>Product not found.</p>"; return; }

  productDetailEl.innerHTML = `
    <div class="product-detail-inner">
      <div class="product-grid">
        <div class="product-media"><img src="${product.image}" alt="${product.title}"></div>
        <div class="product-info">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <div class="product-meta"><span class="badge">${product.category}</span><strong>${formatPrice(product.price)}</strong></div>
          <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px">
            <input id="qtyInput" type="number" value="1" min="1" style="width:84px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:var(--text)">
            <button id="addProductCart" class="btn primary">Add to cart</button>
            <button id="toggleWishlist" class="btn ghost">${ wishlist.includes(product.id) ? "Remove wishlist" : "Add to wishlist" }</button>
          </div>
          <div class="small">SKU: P-${product.id.toString().padStart(4,"0")}</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById("addProductCart").onclick = ()=>{
    const qty = Number(document.getElementById("qtyInput").value) || 1;
    addToCart(product, qty);
    // feedback
    alert("Added to cart");
  };

  document.getElementById("toggleWishlist").onclick = (e)=>{
    if(wishlist.includes(product.id)){ wishlist = wishlist.filter(i=>i!==product.id); e.target.textContent = "Add to wishlist"; }
    else { wishlist.push(product.id); e.target.textContent = "Remove wishlist"; }
    saveState();
  };
}

/* ======================
   Sidebar & actions
   ====================== */
if(cartBtn) cartBtn.onclick = ()=> cartSidebar.classList.add("open");
if(closeCart) closeCart.onclick = ()=> cartSidebar.classList.remove("open");
if(clearCart) clearCart.onclick = ()=> { cart = []; updateCartUI(); };
if(checkoutBtn) checkoutBtn.onclick = ()=> {
  if(cart.length===0) return alert("Cart is empty.");
  const summary = cart.map(i=>`${i.title} x${i.qty}`).join("\n");
  alert("Demo order placed:\n" + summary);
  cart = []; updateCartUI();
};

/* ======================
   Init
   ====================== */
function init(){
  loadCategories();
  applyFilters();
  updateCartUI();

  if(searchInput) searchInput.oninput = applyFilters;
  if(categorySelect) categorySelect.onchange = applyFilters;
  if(sortSelect) sortSelect.onchange = applyFilters;

  const productId = getQueryParam("id");
  if(productDetailEl && productId) renderProductPage(productId);
}

document.addEventListener("DOMContentLoaded", init);
