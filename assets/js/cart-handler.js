/**
 * MewTea Cart Handler - Professional Vanilla JS Shopping Cart Module
 * Author: Senior JavaScript Developer
 * Compatibility: Index.html, chitietsanpham.html, giohang.html
 * Storage Keys: 'mewtea_cart', 'mewtea_active_voucher'
 */

const MewTeaCart = (function () {
    'use strict';
  
    // ==========================================
    // CONFIG & CONSTANTS
    // ==========================================
    const STORAGE_KEY = "mewtea_cart";
    const VOUCHER_KEY = "mewtea_active_voucher";
    const TAX_RATE = 0.08; // 8% VAT
    const DEFAULT_SHIP = 20000; // Phí ship mặc định: 20.000 đ
    const FREE_SHIP_THRESHOLD = 200000; // Miễn phí ship từ 200.000 đ
  
    // Hệ thống voucher hợp lệ
    const VALID_VOUCHERS = {
      "MEW10": { type: "percent", value: 0.10, description: "Giảm 10% tổng tiền món" },
      "MEW20": { type: "percent", value: 0.20, description: "Giảm 20% tổng tiền món" },
      "FREESHIP": { type: "freeship", value: 0, description: "Miễn phí vận chuyển" }
    };
  
    // ==========================================
    // UTILITY METHODS (HELPERS)
    // ==========================================
    
    /**
     * Định dạng tiền tệ: 45000 -> 45.000 đ
     */
    function formatPrice(amount) {
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      return `${formatter.format(amount)} đ`;
    }
  
    /**
     * Tạo chuỗi hash key duy nhất dựa trên cấu hình sản phẩm được chọn
     * Giúp phân biệt các ly trùng ID sản phẩm gốc nhưng khác Size hoặc Topping
     */
    function generateCartId(item) {
      const toppingsStr = Array.isArray(item.topping) 
        ? item.topping.slice().sort().join("-") 
        : "";
      return `${item.id}_${item.size || 'M'}_${item.sweetness || '100%'}_${item.ice || 'Vừa'}_${toppingsStr}`;
    }
  
    // ==========================================
    // API METHODS (GET/SET STORAGE)
    // ==========================================
  
    function getCart() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        console.error("Lỗi khi đọc dữ liệu giỏ hàng:", e);
        return [];
      }
    }
  
    function saveCart(cart) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      renderBadge();
    }
  
    function getActiveVoucher() {
      return localStorage.getItem(VOUCHER_KEY) || null;
    }
  
    function saveActiveVoucher(code) {
      if (code) {
        localStorage.setItem(VOUCHER_KEY, code.toUpperCase().trim());
      } else {
        localStorage.removeItem(VOUCHER_KEY);
      }
    }
  
    // ==========================================
    // CORE BUSINESS LOGIC
    // ==========================================
  
    function addItem(item) {
      const cart = getCart();
      
      // Đảm bảo kiểu dữ liệu và tính toán subtotal
      item.price = parseInt(item.price) || 0;
      item.quantity = parseInt(item.quantity) || 1;
      item.subtotal = item.price * item.quantity;
      
      // Tạo mã duy nhất cho item
      const cartId = generateCartId(item);
      item.cartId = cartId; 
  
      // Kiểm tra xem sản phẩm có cùng cấu hình này đã có trong giỏ hàng chưa
      const existingIndex = cart.findIndex(cartItem => cartItem.cartId === cartId);
  
      if (existingIndex > -1) {
        // Trùng cấu hình hoàn toàn => Tăng số lượng & cập nhật thành tiền
        cart[existingIndex].quantity += item.quantity;
        cart[existingIndex].subtotal = cart[existingIndex].quantity * cart[existingIndex].price;
      } else {
        // Khác cấu hình hoặc chưa có => Thêm item mới
        cart.push(item);
      }
  
      saveCart(cart);
    }
  
    function removeItem(cartId) {
      let cart = getCart();
      cart = cart.filter(item => item.cartId !== cartId);
      saveCart(cart);
      
      if (cart.length === 0) {
        saveActiveVoucher(null);
      }
  
      renderCart();
      calculateTotals();
    }
  
    function updateQuantity(cartId, newQty) {
      if (newQty < 1) return removeItem(cartId);
  
      const cart = getCart();
      const itemIndex = cart.findIndex(item => item.cartId === cartId);
  
      if (itemIndex > -1) {
        cart[itemIndex].quantity = newQty;
        cart[itemIndex].subtotal = newQty * cart[itemIndex].price;
        saveCart(cart);
        
        // Hiệu năng cao: Cập nhật cục bộ DOM của dòng đó để tránh render lại toàn trang
        updateItemRowDOM(cartId, cart[itemIndex]);
        calculateTotals();
      }
    }
  
    function clearCart() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOUCHER_KEY);
      renderBadge();
      renderCart();
      calculateTotals();
    }
  
    function calculateTotals() {
      const cart = getCart();
      const activeVoucherCode = getActiveVoucher();
      
      // 1. Tính tổng tạm tính (Subtotal)
      const subtotal = cart.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  
      // 2. Tính phí ship ban đầu
      let shipping = 0;
      if (subtotal > 0) {
        shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : DEFAULT_SHIP;
      }
  
      // 3. Xử lý giảm giá từ Voucher
      let discount = 0;
      let voucherApplied = null;
  
      if (activeVoucherCode && VALID_VOUCHERS[activeVoucherCode] && subtotal > 0) {
        const voucher = VALID_VOUCHERS[activeVoucherCode];
        voucherApplied = { code: activeVoucherCode, ...voucher };
  
        if (voucher.type === "percent") {
          discount = Math.round(subtotal * voucher.value);
        } else if (voucher.type === "freeship") {
          discount = shipping; // Giá trị giảm tương ứng với tiền ship ban đầu
          shipping = 0;        // Triệt tiêu tiền ship thực tế xuống 0
        }
      }
  
      // 4. Thuế VAT 8% (Tính trên tổng tiền hàng tạm tính)
      const vat = Math.round(subtotal * TAX_RATE);
  
      // 5. Tính tổng thanh toán (Total)
      const total = Math.max(0, subtotal + shipping + vat - discount);
  
      const summary = { subtotal, shipping, vat, discount, total, voucherApplied };
      
      renderSummary(summary);
      return summary;
    }
  
    function applyVoucher(code) {
      const cleanCode = code ? code.toUpperCase().trim() : "";
      const cart = getCart();
  
      if (cart.length === 0) {
        return { success: false, message: "Giỏ hàng của bạn đang trống." };
      }
  
      if (VALID_VOUCHERS[cleanCode]) {
        saveActiveVoucher(cleanCode);
        calculateTotals();
        return { 
          success: true, 
          message: `Áp dụng thành công! ${VALID_VOUCHERS[cleanCode].description}.` 
        };
      } else {
        return { success: false, message: "Mã giảm giá không chính xác hoặc đã hết hạn." };
      }
    }
  
    // ==========================================
    // UI RENDERING ENGINE (REALTIME DOM)
    // ==========================================
  
    function renderBadge() {
      const badges = document.querySelectorAll("#header-cart-badge, .cart-badge");
      const cart = getCart();
      const totalQty = cart.reduce((total, item) => total + (item.quantity || 0), 0);
      
      badges.forEach(badge => {
        if (badge) badge.textContent = totalQty;
      });
    }
  
    function updateItemRowDOM(cartId, updatedItem) {
      const row = document.querySelector(`.cart-item-row[data-cart-id="${cartId}"]`);
      if (row) {
        // Cập nhật text hoặc giá trị input hiển thị số lượng
        const qtyNum = row.querySelector('.cart-item__qty-num');
        const qtyInput = row.querySelector('.cart-item__qty-input');
        if (qtyNum) qtyNum.textContent = updatedItem.quantity;
        if (qtyInput) qtyInput.value = updatedItem.quantity;
        
        // Cập nhật thành tiền riêng của hàng
        const subtotalEl = row.querySelector('.cart-item-subtotal, .item-price-subtotal, .cart-item__price-total');
        if (subtotalEl) {
          subtotalEl.textContent = formatPrice(updatedItem.subtotal);
        }
      }
    }
  
    function renderCart() {
      const container = document.getElementById("cart-items-container");
      const cartGrid = document.getElementById("cart-grid");
      if (!container) return; // Không ở giao diện trang giỏ hàng thì dừng lại
  
      const cart = getCart();
  
      if (cart.length === 0) {
        // Empty State: Trạng thái giỏ hàng rỗng
        container.innerHTML = `
          <div class="empty-cart" style="text-align: center; padding: var(--sp-6) var(--sp-3);">
            <div style="font-size: 4rem; color: var(--s-400); margin-bottom: var(--sp-2);">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: var(--sp-1);">Giỏ hàng trống</h3>
            <p style="color: var(--p-500); margin-bottom: var(--sp-4);">Hiện tại bạn chưa chọn món nào. Hãy ghé Menu để chọn món yêu thích nhé!</p>
            <a href="index.html#menu" class="btn btn--gold">Quay lại thực đơn</a>
          </div>
        `;
        if (cartGrid) cartGrid.style.display = 'none';
        
        // Ẩn bảng Summary hoàn toàn
        const summarySection = document.getElementById("cart-summary-section") || document.querySelector(".cart-summary");
        if (summarySection) summarySection.style.display = "none";
        return;
      }
  
      // Nếu có hàng, hiển thị lại Grid giỏ hàng
      if (cartGrid) cartGrid.style.display = 'grid';
      const summarySection = document.getElementById("cart-summary-section") || document.querySelector(".cart-summary");
      if (summarySection) summarySection.style.display = "block";
  
      // Khởi tạo và tạo cấu trúc HTML
      let html = "";
      cart.forEach(item => {
        const formattedOptions = [
          item.size ? `Size ${item.size}` : '',
          item.sweetness ? `Đường: ${item.sweetness}` : '',
          item.ice ? `Đá: ${item.ice}` : '',
          (item.topping && item.topping.length > 0) ? `Topping: ${item.topping.join(", ")}` : ''
        ].filter(Boolean).join(" | ");
  
        html += `
          <div class="cart-item-row" data-cart-id="${item.cartId}" style="display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2); padding-block: var(--sp-2); border-bottom: 1px solid var(--s-100);">
            <div style="display: flex; align-items: center; gap: var(--sp-2); flex: 1;">
              <div class="item-img-wrapper" style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; background: var(--bg-200); border-radius: var(--r-sm); overflow: hidden;">
                <img src="${item.image}" alt="${item.name}" class="item-img" style="max-height: 100%; object-fit: contain;">
              </div>
              <div class="item-details">
                <h4 class="item-name" style="font-family: var(--font-body); font-size: 1rem; font-weight: 600; color: var(--p-900);">${item.name}</h4>
                <p class="item-options" style="font-size: 0.8rem; color: var(--p-500); margin-top: 2px;">${formattedOptions}</p>
                ${item.note ? `<p class="item-note" style="font-size: 0.78rem; color: var(--gold-dark); font-style: italic; margin-top: 2px;"><i class="fa-solid fa-pencil"></i> Ghi chú: ${item.note}</p>` : ''}
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: var(--sp-3);">
              <div class="p-qty" style="height: 40px; border-color: var(--s-200); display: flex; align-items: center;">
                <button type="button" class="p-qty__btn btn-qty-dec" data-cart-id="${item.cartId}"><i class="fa-solid fa-minus"></i></button>
                <span class="p-qty__num cart-item__qty-num" style="width: 30px; text-align: center; display: inline-block;">${item.quantity}</span>
                <button type="button" class="p-qty__btn btn-qty-inc" data-cart-id="${item.cartId}"><i class="fa-solid fa-plus"></i></button>
              </div>
              
              <div style="width: 110px; text-align: right;">
                <span class="cart-item-subtotal" style="font-weight: 700; color: var(--p-900); font-size: 0.95rem;">${formatPrice(item.subtotal)}</span>
              </div>
              
              <button type="button" class="btn-remove-item" data-cart-id="${item.cartId}" style="color: var(--p-500); transition: color var(--t-fast); padding: 5px;" title="Xóa món này">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      });
  
      container.innerHTML = html;
      attachCartRowEvents();
    }
  
    function renderSummary(summary) {
      const subtotalEl = document.getElementById("summary-subtotal");
      const shippingEl = document.getElementById("summary-shipping");
      const vatEl = document.getElementById("summary-vat");
      const discountEl = document.getElementById("summary-discount");
      const totalEl = document.getElementById("summary-total");
      
      const discountRow = document.getElementById("summary-discount-row") || (discountEl ? discountEl.parentElement : null);
      const shipDiscountRow = document.getElementById("shipping-discount-row");
  
      if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);
      if (vatEl) vatEl.textContent = formatPrice(summary.vat);
      if (totalEl) totalEl.textContent = formatPrice(summary.total);
      
      if (shippingEl) {
        shippingEl.textContent = summary.shipping === 0 && summary.subtotal >= FREE_SHIP_THRESHOLD 
          ? "Miễn phí" 
          : formatPrice(summary.shipping === 0 && summary.voucherApplied?.type === 'freeship' ? DEFAULT_SHIP : summary.shipping);
      }
  
      // Hiển thị thông tin giảm giá tiền món ăn
      if (discountEl) {
        discountEl.textContent = `-${formatPrice(summary.discount)}`;
        if (discountRow) {
          discountRow.style.display = summary.discount > 0 && summary.voucherApplied?.type !== 'freeship' ? "flex" : "none";
        }
      }
  
      // Hiển thị thông tin hỗ trợ phí ship nếu áp dụng mã FREESHIP
      if (shipDiscountRow) {
        if (summary.voucherApplied && summary.voucherApplied.type === "freeship") {
          shipDiscountRow.style.display = "flex";
          const shipDiscountVal = document.getElementById("summary-shipping-discount");
          if (shipDiscountVal) shipDiscountVal.textContent = `-${formatPrice(DEFAULT_SHIP)}`;
        } else {
          shipDiscountRow.style.display = "none";
        }
      }
  
      // Hiển thị tin nhắn voucher trạng thái kích hoạt sẵn có từ trước
      const promoMsg = document.getElementById("voucher-message") || document.getElementById("promo-msg");
      if (promoMsg && summary.voucherApplied) {
        promoMsg.className = "promo-message success";
        promoMsg.textContent = `Đang áp dụng mã: ${summary.voucherApplied.code} (${summary.voucherApplied.description})`;
      }
    }
  
    // ==========================================
    // EVENT HANDLERS & REGISTRATION
    // ==========================================
  
    function attachCartRowEvents() {
      // Sự kiện tăng số lượng trong giỏ hàng
      document.querySelectorAll(".btn-qty-inc").forEach(btn => {
        btn.onclick = function() {
          const id = this.getAttribute("data-cart-id");
          const row = this.closest(".cart-item-row");
          const current = parseInt(row.querySelector(".cart-item__qty-num").textContent) || 1;
          updateQuantity(id, current + 1);
        };
      });
  
      // Sự kiện giảm số lượng trong giỏ hàng
      document.querySelectorAll(".btn-qty-dec").forEach(btn => {
        btn.onclick = function() {
          const id = this.getAttribute("data-cart-id");
          const row = this.closest(".cart-item-row");
          const current = parseInt(row.querySelector(".cart-item__qty-num").textContent) || 1;
          updateQuantity(id, current - 1);
        };
      });
  
      // Sự kiện click nút xóa
      document.querySelectorAll(".btn-remove-item").forEach(btn => {
        btn.onclick = function() {
          const id = this.getAttribute("data-cart-id");
          if (confirm("Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            removeItem(id);
          }
        };
      });
    }
  
    function setupDOMEvents() {
      
      // --- 1. LOGIC TẬP TRUNG TRÊN TRANG CHI TIẾT SẢN PHẨM ---
      const detailContainer = document.getElementById("product-detail-container") || document.querySelector(".p-detail-grid");
      if (detailContainer) {
        const btnDec = document.getElementById("btn-decrease-qty") || document.querySelector(".p-qty__btn:first-of-type");
        const btnInc = document.getElementById("btn-increase-qty") || document.querySelector(".p-qty__btn:last-of-type");
        const displayQty = document.getElementById("display-qty") || document.querySelector(".p-qty__num");
        const currentPriceEl = document.querySelector(".p-price-current");
        
        // Lấy giá trị cơ bản từ attribute để tính toán chuẩn xác
        const basePrice = parseInt(detailContainer.getAttribute("data-price")) || (currentPriceEl ? parseInt(currentPriceEl.textContent.replace(/\D/g, "")) : 0);
  
        function updateDetailRealtimePrice() {
          if (!displayQty) return;
          const qty = parseInt(displayQty.textContent) || 1;
          
          let toppingExtra = 0;
          document.querySelectorAll('input[name="topping"]:checked').forEach(el => {
            toppingExtra += parseInt(el.getAttribute("data-price")) || 0;
          });
  
          const totalPerUnit = basePrice + toppingExtra;
          if (currentPriceEl) {
            currentPriceEl.textContent = formatPrice(totalPerUnit * qty);
          }
        }
  
        // Đăng ký event thay đổi checkbox Topping -> Cập nhật tiền ngay lập tức
        document.querySelectorAll('input[name="topping"]').forEach(input => {
          input.addEventListener("change", updateDetailRealtimePrice);
        });
  
        // Đăng ký event cho các nút tăng giảm số lượng mua tại trang chi tiết
        if (btnDec && displayQty) {
          btnDec.onclick = function() {
            let val = parseInt(displayQty.textContent) || 1;
            if (val > 1) {
              displayQty.textContent = val - 1;
              updateDetailRealtimePrice();
            }
          };
        }
  
        if (btnInc && displayQty) {
          btnInc.onclick = function() {
            let val = parseInt(displayQty.textContent) || 1;
            displayQty.textContent = val + 1;
            updateDetailRealtimePrice();
          };
        }
  
        // Xử lý sự kiện "Thêm vào giỏ" & "Mua ngay"
        const handleAddFlow = (redirectToCart = false) => {
          const id = detailContainer.getAttribute("data-id") || "sp-hokkaido";
          const name = detailContainer.getAttribute("data-name") || document.querySelector(".p-info__title")?.textContent.trim();
          const image = detailContainer.getAttribute("data-image") || document.querySelector(".p-gallery__main img")?.getAttribute("src");
          
          const sizeInput = document.querySelector('input[name="size"]:checked');
          const size = sizeInput ? sizeInput.value : "M";
  
          const topping = [];
          let toppingPrice = 0;
          document.querySelectorAll('input[name="topping"]:checked').forEach(el => {
            topping.push(el.value);
            toppingPrice += parseInt(el.getAttribute("data-price")) || 0;
          });
  
          const sugarInput = document.querySelector('input[name="sugar"]:checked');
          const sweetness = sugarInput ? sugarInput.value : "100%";
  
          const iceInput = document.querySelector('input[name="ice"]:checked');
          const ice = iceInput ? iceInput.value : "Vừa đá";
  
          const noteEl = document.getElementById("product-note") || document.querySelector(".p-note__input");
          const note = noteEl ? noteEl.value : "";
          
          const quantity = parseInt(displayQty ? displayQty.textContent : 1) || 1;
          const finalPrice = basePrice + toppingPrice;
  
          addItem({
            id, name, image, price: finalPrice, size, topping, sweetness, ice, quantity, note
          });
  
          if (redirectToCart) {
            window.location.href = "giohang.html";
          } else {
            alert(`Đã thêm thành công ${quantity} ly ${name} vào giỏ hàng!`);
          }
        };
  
        const btnAddToCart = document.getElementById("btn-add-to-cart") || document.querySelector(".btn--outline-gold");
        if (btnAddToCart) {
          btnAddToCart.onclick = function(e) {
            e.preventDefault();
            handleAddFlow(false);
          };
        }
  
        const btnBuyNow = document.getElementById("btn-buy-now") || document.querySelector(".btn--gold");
        if (btnBuyNow) {
          btnBuyNow.onclick = function(e) {
            e.preventDefault();
            handleAddFlow(true);
          };
        }
      }
  
      // --- 2. LOGIC ĐĂNG KÝ FORM VOUCHER TẠI TRANG GIỎ HÀNG ---
      const btnPromo = document.getElementById("btn-apply-voucher") || document.querySelector(".promo-code-container button");
      if (btnPromo) {
        btnPromo.onclick = function(e) {
          e.preventDefault();
          const input = document.getElementById("voucher-input") || document.querySelector(".promo-code-container input");
          const promoMsg = document.getElementById("voucher-message") || document.getElementById("promo-msg");
          
          if (input) {
            const res = applyVoucher(input.value);
            if (promoMsg) {
              promoMsg.textContent = res.message;
              promoMsg.className = res.success ? "promo-message success" : "promo-message error";
            }
          }
        };
      }
  
      // --- 3. THÊM NHANH SẢN PHẨM TỪ TRANG MENU/DANH SÁCH (QUICK ADD) ---
      document.querySelectorAll(".btn-quick-add, .product-card__buy, .rec-quick-add").forEach(btn => {
        btn.onclick = function(e) {
          e.preventDefault();
          
          // Quét phần tử bao bọc gần nhất để bóc tách thông tin thẻ
          const card = this.closest(".product-card") || this.closest("article") || this.closest(".rec-card");
          if (card) {
            const id = card.getAttribute("data-id") || "sp-quick";
            const name = card.getAttribute("data-name") || card.querySelector("h4")?.textContent.trim() || card.querySelector(".product-card__name")?.textContent.trim();
            const image = card.getAttribute("data-image") || card.querySelector("img")?.getAttribute("src");
            
            let priceText = card.getAttribute("data-price") || card.querySelector(".product-card__price, .rec-card__price")?.textContent;
            const price = parseInt(priceText.replace(/\D/g, "")) || 0;
  
            addItem({
              id,
              name,
              image,
              price,
              size: "M",
              topping: [],
              sweetness: "100%",
              ice: "Vừa đá",
              quantity: 1,
              note: ""
            });
  
            alert(`Đã thêm nhanh 1 ly ${name} vào giỏ hàng!`);
          }
        };
      });
  
      // --- 4. BẬT EVENT LẮNG NGHE STORAGE SYNC LIÊN TAB ---
      window.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY || e.key === VOUCHER_KEY) {
          renderBadge();
          renderCart();
          calculateTotals();
        }
      });
    }
  
    // ==========================================
    // MODULE INITIALIZER
    // ==========================================
    function init() {
      renderBadge();
      renderCart();
      calculateTotals();
      setupDOMEvents();
    }
  
    // Khởi tạo chạy ngay khi DOM sẵn sàng tải
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  
    // Expose các API công khai phục vụ kiểm tra và mở rộng hệ thống
    return {
      getCart,
      saveCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      calculateTotals,
      renderBadge,
      renderCart,
      renderSummary,
      applyVoucher,
      formatPrice
    };
  
  })();