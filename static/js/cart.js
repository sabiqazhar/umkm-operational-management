// ── POS Cart State ────────────────────────────────────────────────────────
// ponytail: simple array, no observables, no framework
var cart = [];

function addToCart(item) {
    var existing = cart.find(function(i) { return i.item_id === item.item_id; });
    if (existing) {
        if (existing.qty < item.stok_sekarang) { existing.qty++; }
        else { alert('Stok tidak mencukupi!'); return; }
    } else {
        if (item.stok_sekarang > 0) { cart.push({ item_id: item.item_id, barcode: item.barcode, nama_barang: item.nama_barang, harga_jual: Number(item.harga_jual), stok_sekarang: Number(item.stok_sekarang), qty: 1 }); }
        else { alert('Stok habis!'); return; }
    }
    renderCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(function(i) { return i.item_id !== itemId; });
    renderCart();
}

function updateQty(itemId, qty) {
    var item = cart.find(function(i) { return i.item_id === itemId; });
    if (!item) return;
    if (qty <= 0) { removeFromCart(itemId); return; }
    if (qty > item.stok_sekarang) { alert('Stok tidak mencukupi!'); return; }
    item.qty = qty;
    renderCart();
}

function renderCart() {
    var container = document.getElementById('cart-items');
    var totalEl = document.getElementById('cart-total');
    var checkoutBtn = document.getElementById('checkout-btn');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Keranjang kosong</p>';
        if (totalEl) totalEl.textContent = 'Rp 0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    var total = 0;
    var html = '';
    cart.forEach(function(item) {
        var subtotal = item.harga_jual * item.qty;
        total += subtotal;
        html += '<div class="flex justify-between items-center bg-gray-50 p-3 rounded">' +
            '<div class="flex-1">' +
                '<h4 class="font-medium text-sm">' + item.nama_barang + '</h4>' +
                '<p class="text-xs text-gray-500">Rp ' + Number(item.harga_jual).toLocaleString() + ' x ' + item.qty + '</p>' +
            '</div>' +
            '<div class="flex items-center gap-1">' +
                '<button onclick="updateQty(' + item.item_id + ', ' + (item.qty - 1) + ')" class="px-2 py-1 bg-gray-200 rounded text-sm">-</button>' +
                '<span class="w-8 text-center text-sm">' + item.qty + '</span>' +
                '<button onclick="updateQty(' + item.item_id + ', ' + (item.qty + 1) + ')" class="px-2 py-1 bg-gray-200 rounded text-sm">+</button>' +
                '<button onclick="removeFromCart(' + item.item_id + ')" class="ml-1 text-red-500 text-sm">✕</button>' +
            '</div>' +
        '</div>';
    });
    container.innerHTML = html;
    if (totalEl) totalEl.textContent = 'Rp ' + total.toLocaleString();
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function getCartTotal() {
    return cart.reduce(function(sum, item) { return sum + (item.harga_jual * item.qty); }, 0);
}

function clearCart() {
    cart = [];
    renderCart();
}
