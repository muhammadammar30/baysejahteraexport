// ============================================================
// HELPER: Ambil elemen dengan aman (tidak crash jika null)
// ============================================================
function el(id) { return document.getElementById(id); }

// ============================================================
// 1. HAMBURGER MENU (hanya jika elemen ada di halaman ini)
// ============================================================
const hamburger   = el('hamburger');
const navMenu     = el('nav-menu');
const navActions  = el('nav-actions');

if (hamburger && navMenu && navActions) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
    });
}

// ============================================================
// 2. MODAL LOGIN (hanya jika elemen ada)
// ============================================================
const loginBtnModal    = document.querySelector('.btn-login');
const loginModal       = el('loginModal');
const closeModalBtn    = el('closeModal');

if (loginBtnModal && loginModal) {
    loginBtnModal.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('show');
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu)   navMenu.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
    });
}

if (closeModalBtn && loginModal) {
    closeModalBtn.addEventListener('click', () => loginModal.classList.remove('show'));
}

window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) loginModal.classList.remove('show');
});

// ============================================================
// 3. TOGGLE PASSWORD (hanya jika elemen ada)
// ============================================================
const togglePassword = el('togglePassword');
const passwordInput  = el('passwordInput');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });
}

// ============================================================
// 4. MOBILE DRAWER (hanya jika elemen ada)
// ============================================================
const mobileMenuBtn = el('mobileMenuBtn');
const closeMenuBtn  = el('closeMenuBtn');
const mobileDrawer  = el('mobileDrawer');
const brandLogo     = el('brandLogo');

function toggleMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn)  closeMenuBtn.addEventListener('click', toggleMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) toggleMenu();
    });
});

if (brandLogo) {
    brandLogo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============================================================
// 5. LOGIN BTN (id="loginBtn") — hanya jika ada
// ============================================================
const loginBtnId = el('loginBtn');
if (loginBtnId) {
    loginBtnId.addEventListener('click', () => {
        alert('Membuka menu Login Sistem...');
    });
}

// ============================================================
// 6. CATALOG SLIDER (hanya jika elemen ada)
// ============================================================
const catalogGrid = el('catalogGrid');
const slideNext   = el('slideNext');

if (catalogGrid && slideNext) {
    slideNext.addEventListener('click', () => {
        const cardEl = document.querySelector('.product-card');
        if (!cardEl) return;
        const cardWidth = cardEl.offsetWidth + 24;
        if (catalogGrid.scrollLeft + catalogGrid.clientWidth >= catalogGrid.scrollWidth - 10) {
            catalogGrid.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            catalogGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    });
}

// ============================================================
// 7. VIDEO GUDANG (hanya jika elemen ada)
// ============================================================
const playVideoBtn  = el('playVideoBtn');
const videoWrapper  = el('videoWrapper');
const companyVideo  = el('companyVideo');

if (playVideoBtn && videoWrapper && companyVideo) {
    playVideoBtn.addEventListener('click', () => {
        videoWrapper.classList.add('playing');
        const currentSrc = companyVideo.getAttribute('src');
        if (!currentSrc.includes('autoplay=1')) {
            companyVideo.setAttribute('src', currentSrc + '&autoplay=1');
        }
    });
}

// ============================================================
// 8. SMOOTH SCROLL FOOTER LINKS
// ============================================================
document.querySelectorAll('.footer-links-list a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================================
// 9. FITUR GANTI BAHASA
// ============================================================
function applyLanguage(lang) {
    document.querySelectorAll("[data-id][data-en]").forEach(function (elem) {
        const newText = (lang === "en")
            ? elem.getAttribute("data-en")
            : elem.getAttribute("data-id");

        if (!newText) return;

        // Elemen <option> — ganti textContent langsung (tidak ada child element)
        if (elem.tagName === "OPTION") {
            elem.textContent = newText;
            return;
        }

        // Cari text node pertama (langsung di dalam elemen, bukan di dalam child element)
        const firstTextNode = Array.from(elem.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== "");

        if (firstTextNode) {
            // Ganti hanya text node-nya, child elements tetap aman
            firstTextNode.textContent = newText;
        } else if (elem.querySelector('*') === null) {
            // Tidak ada child element sama sekali, aman ganti seluruh teks
            elem.textContent = newText;
        } else {
            // Ada child element tapi tidak ada text node langsung
            // Sisipkan text node baru di awal
            const textNode = document.createTextNode(newText);
            elem.insertBefore(textNode, elem.firstChild);
        }
    });

    // Update tampilan flag & label aktif
    document.querySelectorAll('.flag-icon[alt="ID"]').forEach(f => f.style.opacity = lang === "id" ? "1" : "0.4");
    document.querySelectorAll('.flag-icon[alt="EN"]').forEach(f => f.style.opacity = lang === "en" ? "1" : "0.4");

    const labels = document.querySelectorAll('.lang-label');
    if (labels.length >= 2) {
        labels[0].style.fontWeight = lang === "id" ? "700" : "400";
        labels[1].style.fontWeight = lang === "en" ? "700" : "400";
    }

    // Update count-label sesuai bahasa
    const countLabel = document.getElementById('count-label');
    if (countLabel) {
        const num = countLabel.textContent.match(/\d+/)?.[0] || '0';
        countLabel.textContent = lang === "en" ? num + ' products' : num + ' produk';
    }

    // Update teks "terjual" di kartu produk
    document.querySelectorAll('.card-sold').forEach(el => {
        const num = el.textContent.match(/[\d.]+/)?.[0] || '0';
        el.textContent = lang === "en" ? num + ' sold' : num + ' terjual';
    });

    // Simpan pilihan bahasa & update atribut lang pada <html>
    localStorage.setItem("selectedLanguage", lang);
    document.documentElement.lang = lang;

    // Beri tahu bagian lain halaman (misalnya modal produk) bahwa bahasa berubah
    window.dispatchEvent(new CustomEvent("languagechange-bse", { detail: { lang: lang } }));
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
    const langToggle = el("lang-toggle");
    if (!langToggle) return;

    const savedLang = localStorage.getItem("selectedLanguage") || "id";
    langToggle.checked = (savedLang === "en");
    applyLanguage(savedLang);

    langToggle.addEventListener("change", function () {
        applyLanguage(this.checked ? "en" : "id");
    });
});

// ============================================================
// 10. DATA & RENDER PRODUK
// ============================================================
const products = [
  { name: "Briket Arang Tempurung Kelapa", price: 18000, rating: 4.2, sold: 8100, category: "Briket", origin: "Cirebon, Jabar", image: "https://via.placeholder.com/150" },
  { name: "Biji Kopi Robusta Pilihan", price: 47500, rating: 0.0, sold: 100, category: "Biji Kopi", origin: "Garut, Jabar", image: "https://via.placeholder.com/150" },
  { name: "Biji Kopi Roast Cappuccino", price: 3500, rating: 3.5, sold: 44, category: "Biji Kopi", origin: "Temanggung, Jateng", image: "https://via.placeholder.com/150" },
  { name: "Jamur Tiram Segar", price: 30000, rating: 0.0, sold: 0, category: "Jamur Kering", origin: "Magelang, Jateng", image: "https://via.placeholder.com/150" },
  { name: "Jagung Pipil Kering", price: 8500, rating: 4.0, sold: 230, category: "Jagung", origin: "Madura, Jatim", image: "https://via.placeholder.com/150" },
  { name: "Beras Pandan Wangi", price: 12000, rating: 0.0, sold: 0, category: "Beras", origin: "Cianjur, Jabar", image: "https://via.placeholder.com/150" },
  { name: "Briket Shisha Premium", price: 15000, rating: 0.0, sold: 0, category: "Briket", origin: "Sukabumi, Jabar", image: "https://via.placeholder.com/150" },
  { name: "Ikan Asin Jambal Kering", price: 35000, rating: 4.5, sold: 560, category: "Ikan Asin", origin: "Cirebon, Jabar", image: "https://via.placeholder.com/150" }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid        = el('productGrid');
    const chipRow     = el('categoryChips');
    const sortSelect  = el('sortSelect');
    const priceMin    = el('priceMin');
    const priceMax    = el('priceMax');
    const priceSlider = el('priceSlider');
    const resultCount = el('resultCount');

    if (!grid) return; // Halaman ini tidak punya grid produk, berhenti di sini

    let state = { category: 'all', sort: 'popular', minPrice: 0, maxPrice: 1000000, minRating: 0 };

    const formatRupiah = n => 'Rp ' + n.toLocaleString('id-ID');
    const formatSold   = n => n >= 1000
        ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'rb+ terjual'
        : n + ' terjual';

    const pinIcon = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:10px;height:10px;display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/></svg>`;

    function render() {
        const currentMin = priceMin ? (Number(priceMin.value) || 0) : state.minPrice;
        const currentMax = priceMax ? (Number(priceMax.value) || 1000000) : state.maxPrice;

        let list = products.filter(p =>
            (state.category === 'all' || p.category === state.category) &&
            p.price >= currentMin &&
            p.price <= currentMax &&
            p.rating >= state.minRating
        );

        switch (state.sort) {
            case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
            case 'price-desc': list.sort((a, b) => b.price - a.price); break;
            case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
            default:           list.sort((a, b) => b.sold - a.sold);
        }

        if (resultCount) resultCount.textContent = list.length + ' produk ditemukan';

        grid.innerHTML = '';

        if (list.length === 0) {
            grid.innerHTML = '<div class="empty-state">Belum ada hasil produk yang cocok.</div>';
            return;
        }

        list.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-media">
                    <span class="card-tag">${p.category}</span>
                    <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/150'">
                    <span class="card-origin">${pinIcon}${p.origin}</span>
                </div>
                <div class="card-body">
                    <p class="card-title">${p.name}</p>
                    <div class="card-price-row">
                        <span class="card-price">${formatRupiah(p.price)}</span>
                        <span class="card-unit">/ kg</span>
                    </div>
                    <div class="card-foot">
                        <span class="card-rating"><span class="star" style="color:#B68A3C;">★</span> ${p.rating.toFixed(1)}</span>
                        <span>${formatSold(p.sold)}</span>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    if (chipRow) {
        chipRow.addEventListener('click', (e) => {
            const chip = e.target.closest('.cat-item');
            if (!chip) return;
            chipRow.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.category = chip.dataset.category;
            render();
        });
    }

    if (sortSelect) sortSelect.addEventListener('change', e => { state.sort = e.target.value; render(); });

    function syncPrice(fromSlider) {
        if (fromSlider && priceMax && priceSlider) priceMax.value = priceSlider.value;
        else if (!fromSlider && priceSlider && priceMax) priceSlider.value = priceMax.value;
        render();
    }

    if (priceMin)    priceMin.addEventListener('input', () => syncPrice(false));
    if (priceMax)    priceMax.addEventListener('input', () => syncPrice(false));
    if (priceSlider) priceSlider.addEventListener('input', () => syncPrice(true));

    document.querySelectorAll('input[name="rating"]').forEach(r =>
        r.addEventListener('change', e => { state.minRating = Number(e.target.value); render(); })
    );

    render();
});
