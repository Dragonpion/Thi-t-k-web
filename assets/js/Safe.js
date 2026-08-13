/**
 * Safe.html — MewTea Khuyến Mãi
 * 1) Chọn ngẫu nhiên 8/15 sản phẩm, ghép mỗi sản phẩm với 1 voucher riêng (không trùng nhau)
 *    và render vào lưới "Danh Sách Sản Phẩm Sale" + lưới "Voucher".
 * 2) Flash Sale đếm ngược thời gian thực đến 23:59:59 ngày 22/07/2026, tự cập nhật mỗi giây,
 *    tự chuyển trạng thái "Đã kết thúc" và vô hiệu hóa nút mua khi hết giờ.
 */
(function () {
  'use strict';

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function computeSalePrice(product, voucher) {
    var m = /(-?\d+)\s*%/.exec(voucher.val);
    var percent = m ? Math.abs(parseInt(m[1], 10)) : 10; // ưu đãi không theo % vẫn hiển thị mức giảm tham khảo 10%
    var raw = product.price * (1 - percent / 100);
    return Math.max(1000, Math.round(raw / 1000) * 1000);
  }

  function saleCardHtml(product, voucher, stats) {
    var salePrice = computeSalePrice(product, voucher);
    return '' +
      '<article class="sale-card" data-id="' + product.id + '" data-name="' + product.name + '" data-price="' + salePrice + '" data-image="' + product.image + '">' +
        '<div class="sale-card__img-container">' +
          '<span class="sale-badge">' + voucher.badge + ' ' + voucher.val + '</span>' +
          '<img src="' + product.image + '" alt="' + product.name + '">' +
        '</div>' +
        '<div class="sale-card__body">' +
          '<h3 class="sale-card__title">' + product.name + '</h3>' +
          '<p class="sale-card__desc">' + product.shortDesc + '</p>' +
          '<div class="sale-card__meta">' +
            '<span class="sale-card__stars"><i class="fa-solid fa-star"></i> ' + product.rating.toFixed(1) + '</span>' +
            '<span>Đã bán ' + stats.sold + '</span>' +
          '</div>' +
          '<div class="sale-card__pricing">' +
            '<span class="sale-card__price-original"><del>' + formatVnd(product.price) + '</del></span>' +
            '<div class="sale-card__price-sale-box"><span class="sale-card__price-sale">' + formatVnd(salePrice) + '</span></div>' +
          '</div>' +
          '<div class="sale-card__promo-tag"><i class="fa-solid fa-ticket"></i> ' + voucher.title + '</div>' +
          '<div class="sale-card__action">' +
            '<a href="Chitietsanpham.html?id=' + product.id + '" class="btn btn--outline btn--block">Xem Chi Tiết</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function voucherCardHtml(product, voucher) {
    return '' +
      '<div class="voucher-card" data-code="' + voucher.code + '">' +
        '<div class="voucher-card__left">' +
          '<div class="voucher-card__val">' + voucher.val + '</div>' +
          '<div class="voucher-card__title">' + voucher.title + ' — ' + product.name + '</div>' +
          '<p class="voucher-card__rules">' + voucher.rules + '</p>' +
        '</div>' +
        '<div class="voucher-card__right">' +
          '<span class="voucher-card__code">' + voucher.code + '</span>' +
          '<button type="button" class="btn btn--dark btn--sm voucher-copy-btn" data-code="' + voucher.code + '">Sao chép</button>' +
        '</div>' +
      '</div>';
  }

  function renderSaleAndVouchers() {
    if (typeof MEWTEA_PRODUCTS === 'undefined') return;

    var products = getRandomProducts(8);
    var vouchers = mewteaShuffle(MEWTEA_VOUCHER_TEMPLATES).slice(0, 8);

    var saleGrid = document.getElementById('sale-products-grid');
    var voucherGrid = document.getElementById('vouchers-grid');
    var saleHtml = '', voucherHtml = '';

    products.forEach(function (product, i) {
      var voucher = vouchers[i];
      var stats = getStableStats(product.id);
      saleHtml += saleCardHtml(product, voucher, stats);
      voucherHtml += voucherCardHtml(product, voucher);
    });

    if (saleGrid) saleGrid.innerHTML = saleHtml;
    if (voucherGrid) voucherGrid.innerHTML = voucherHtml;

    // Gắn chức năng "Sao chép mã" cho từng voucher
    document.querySelectorAll('.voucher-copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var code = this.getAttribute('data-code');
        var done = function () {
          var original = btn.textContent;
          btn.textContent = 'Đã chép!';
          btn.disabled = true;
          setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(done).catch(function () {
            window.prompt('Sao chép mã voucher:', code);
          });
        } else {
          window.prompt('Sao chép mã voucher:', code);
        }
      });
    });
  }

  function startFlashSaleCountdown() {
    var deadline = new Date(2026, 6, 22, 23, 59, 59); // 23:59:59 ngày 22/07/2026 (giờ địa phương)
    var banner = document.getElementById('flash-sale-banner');
    var statusEl = document.getElementById('flash-sale-status');
    var descEl = document.getElementById('flash-sale-desc');
    var titleEl = document.getElementById('countdown-title');
    var buyBtn = document.getElementById('flash-sale-buy-btn');
    var hoursEl = document.getElementById('fs-hours');
    var minutesEl = document.getElementById('fs-minutes');
    var secondsEl = document.getElementById('fs-seconds');
    if (!banner || !hoursEl || !minutesEl || !secondsEl) return;

    var timer = null;

    function setExpiredState() {
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (statusEl) statusEl.textContent = 'ĐÃ KẾT THÚC';
      if (titleEl) titleEl.textContent = 'Chương trình đã kết thúc:';
      if (descEl) descEl.innerHTML = 'Flash Sale đã kết thúc. Hẹn gặp lại bạn ở đợt sale tiếp theo nhé!';
      banner.classList.add('is-expired');
      if (buyBtn) {
        buyBtn.classList.add('is-disabled');
        buyBtn.setAttribute('aria-disabled', 'true');
        buyBtn.removeAttribute('href');
        buyBtn.innerHTML = 'Đã Kết Thúc <i class="fa-solid fa-ban"></i>';
      }
      if (timer) { clearInterval(timer); timer = null; }
    }

    function tick() {
      var diff = deadline.getTime() - new Date().getTime();
      if (diff <= 0) { setExpiredState(); return; }
      var totalSeconds = Math.floor(diff / 1000);
      hoursEl.textContent = pad(Math.floor(totalSeconds / 3600));
      minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      secondsEl.textContent = pad(totalSeconds % 60);
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  function init() {
    renderSaleAndVouchers();
    startFlashSaleCountdown();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
