// ======= Data (images reference local assets/images/p1.png .. p20.png) =======
const products = [
  {id:1, title:"Aurora Headphones", description:"Wireless over-ear headphones with deep bass and long battery life.", price:79.99, category:"Audio", image:"image: "./assets/images/p1.png""},
  {id:2, title:"Nebula Desk Lamp", description:"Ambient RGB lamp with color temperature control and USB-C power.", price:34.99, category:"Home", image:"./assets/images/p2.png"},
  {id:3, title:"Skyline Backpack", description:"Durable travel backpack with waterproof fabric and laptop compartment.", price:49.99, category:"Bags", image:"./assets/images/p3.png"},
  {id:4, title:"Pulse Gaming Mouse", description:"High precision gaming mouse with RGB lighting and programmable buttons.", price:29.99, category:"Gaming", image:"assets/images/p4.png"},
  {id:5, title:"Vortex Keyboard", description:"Mechanical keyboard with tactile switches and aluminum frame.", price:89.99, category:"Gaming", image:"assets/images/p5.png"},
  {id:6, title:"Comet Sneakers", description:"Lightweight sneakers for everyday comfort and urban style.", price:59.99, category:"Fashion", image:"assets/images/p6.png"},
  {id:7, title:"Orbit Sunglasses", description:"Polarized sunglasses with UV protection and metal hinges.", price:24.99, category:"Fashion", image:"assets/images/p7.png"},
  {id:8, title:"Flux Portable Charger", description:"10000mAh compact power bank with fast charging support.", price:22.99, category:"Gadgets", image:"assets/images/p8.png"},
  {id:9, title:"Lumen Smartwatch", description:"Fitness smartwatch with heart-rate monitor and notifications.", price:129.99, category:"Wearables", image:"assets/images/p9.png"},
  {id:10, title:"Canvas Messenger Bag", description:"Retro messenger bag with adjustable strap and padded interior.", price:39.99, category:"Bags", image:"assets/images/p10.png"},
  {id:11, title:"Echo Bluetooth Speaker", description:"Portable speaker with 12 hours playtime and rich bass.", price:45.00, category:"Audio", image:"assets/images/p11.png"},
  {id:12, title:"Halo Desk Mat", description:"Large desk mat with smooth fabric surface for mouse and keyboard.", price:18.50, category:"Accessories", image:"assets/images/p12.png"},
  {id:13, title:"Atlas Travel Mug", description:"Insulated stainless steel mug keeps drinks hot for hours.", price:16.99, category:"Home", image:"assets/images/p13.png"},
  {id:14, title:"Nexus Webcam", description:"1080p webcam with autofocus and built-in microphone.", price:49.49, category:"Gadgets", image:"assets/images/p14.png"},
  {id:15, title:"Stratus Hoodie", description:"Comfort hoodie with soft fleece lining and front pocket.", price:34.00, category:"Fashion", image:"assets/images/p15.png"},
  {id:16, title:"Pulse Pro Controller", description:"Wireless controller compatible with PC and consoles.", price:64.99, category:"Gaming", image:"assets/images/p16.png"},
  {id:17, title:"Arc Phone Case", description:"Durable phone case with shock absorption and slim profile.", price:12.99, category:"Accessories", image:"assets/images/p17.png"},
  {id:18, title:"Boreal Jacket", description:"Water-resistant jacket with breathable lining and hood.", price:99.99, category:"Fashion", image:"assets/images/p18.png"},
  {id:19, title:"Prism Monitor Arm", description:"Ergonomic monitor arm supporting up to 32\" displays.", price:74.99, category:"Office", image:"assets/images/p19.png"},
  {id:20, title:"Quasar USB-C Hub", description:"Multiport USB-C hub with HDMI, Ethernet and card reader.", price:39.90, category:"Gadgets", image:"assets/images/p20.png"}
];

// ======= DOM & State =======
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

// ======= Utilities =======
function saveState() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
function formatPrice(v){ return v.toFixed(2) + " $"; }
function getQueryParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// ======= Cart =======
function updateCartUI(){
  if(!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
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

function removeFromCart(id){
  cart = cart.filter(i=>i.id !== id);
  updateCartUI();
}

// qty click handler on cart items
if(cartItems){
  cartItems.addEventListener("click", (e)=>{
    if(!e.target.classList.contains("qty-btn")) return;
    const id = Number(e.target.dataset.id);
    const action = e.target.dataset.action;
    const item = cart.find(i=>i.id===id);
    if(!item) return;
    if(action === "inc") item.qty++;
    else {
      item.qty--;
      if(item.qty <= 0) cart = cart.filter(i=>i.id !== id);
    }
    updateCartUI();
  });
}

// ======= Rendering Products (Index) =======
function renderProductCard(product){
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="card-media"><img src="${product.image}" alt="${product.title}"></div>
    <h4>${product.title}</h4>
    <p>${product.description.substring(0,90)}${product.description.length>90?"...":""}</p>
    <div class="price-row">
      <div class="price-left">
        <span class="badge">${product.category}</span>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <strong class="price">${formatPrice(product.price)}</strong>
        <a class="btn" href="product.html?id=${product.id}">Details</a>
        <button class="btn primary add-cart" data-id="${product.id}">Add</button>
      </div>
    </div>
  `;
  return el;
}

def write_remaining():
    pass
