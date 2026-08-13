/**
 * chitietsanpham.html — Trang chi tiết sản phẩm MewTea
 * Đọc tham số ?id= trên URL, tra cứu sản phẩm tương ứng trong mewtea-data.js
 * (đồng bộ tuyệt đối với Menu/Safe/Best Seller) và đổ dữ liệu vào toàn bộ khu vực Hero.
 * Đồng thời render ngẫu nhiên 4 "Sản phẩm liên quan" (loại trừ sản phẩm đang xem).
 */
(function () {
  'use strict';

  function starsHtml(rating) {
    var full = Math.round(rating || 5);
    var html = '';
    for (var i = 0; i < 5; i++) {
      html += '<i class="fa-solid fa-star" style="opacity:' + (i < full ? '1' : '.25') + '"></i>';
    }
    return html;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat('vi-VN').format(n);
  }

  function renderDetail(product) {
    var stats = getStableStats(product.id);
    var container = document.getElementById('product-detail-container');
    if (container) {
      container.setAttribute('data-id', product.id);
      container.setAttribute('data-name', product.name);
      container.setAttribute('data-price', product.price);
      container.setAttribute('data-image', product.image);
    }

    var mainImg = document.getElementById('p-main-img');
    if (mainImg) { mainImg.src = product.image; mainImg.alt = product.name; }

    var gallery = document.getElementById('p-gallery');
    if (gallery) {
      gallery.querySelectorAll('.p-gallery__thumb img').forEach(function (img, idx) {
        img.src = product.image;
        img.alt = product.name + ' — góc nhìn ' + (idx + 1);
      });
    }

    var badgeMain = document.getElementById('p-badge-main');
    if (badgeMain) badgeMain.textContent = product.tag;

    var titleMain = document.getElementById('p-title-main');
    if (titleMain) titleMain.textContent = product.name;

    var titleSub = document.getElementById('p-title-sub');
    if (titleSub) titleSub.textContent = product.subtitle;

    var ratingBox = document.getElementById('p-rating');
    if (ratingBox) {
      ratingBox.innerHTML = starsHtml(product.rating) + '<span id="p-rating-value">' + product.rating.toFixed(1) + '</span>';
    }

    var reviewsEl = document.getElementById('p-meta-reviews');
    if (reviewsEl) reviewsEl.textContent = formatNumber(stats.reviews) + ' đánh giá';

    var soldEl = document.getElementById('p-meta-sold');
    if (soldEl) soldEl.textContent = formatNumber(stats.sold);

    var priceCurrent = document.getElementById('p-price-current');
    if (priceCurrent) priceCurrent.textContent = formatVnd(product.price);

    // Trang chi tiết hiển thị đúng 1 mức giá thống nhất với Menu/Best Seller —
    // ẩn giá gốc/badge giảm giá để không mâu thuẫn dữ liệu giá giữa các trang.
    var priceOld = document.getElementById('p-price-old');
    if (priceOld) priceOld.style.display = 'none';
    var priceDiscount = document.getElementById('p-price-discount');
    if (priceDiscount) priceDiscount.style.display = 'none';

    var shortDesc = document.getElementById('p-short-desc');
    if (shortDesc) shortDesc.textContent = product.longDesc;

    document.title = product.name + ' | MewTea — Trà Sữa Thủ Công Cao Cấp';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', product.shortDesc);
  }

  function relatedCardHtml(p) {
    return '' +
      '<article class="product-card" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '">' +
        '<div class="product-card__img">' +
          '<img src="' + p.image + '" alt="' + p.name + '">' +
        '</div>' +
        '<div class="product-card__body">' +
          '<p class="product-card__cat">' + p.category + '</p>' +
          '<h3 class="product-card__name"><a href="chitietsanpham.html?id=' + p.id + '" target="_self">' + p.name + '</a></h3>' +
          '<div class="product-card__footer">' +
            '<span class="product-card__price">' + formatVnd(p.price) + '</span>' +
            '<button type="button" class="product-card__buy btn-quick-add" aria-label="Thêm vào giỏ"><i class="fa-solid fa-plus"></i></button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderRelated(currentId) {
    var grid = document.getElementById('related-products-grid');
    if (!grid) return;
    var picks = getRandomProducts(4, currentId);
    grid.innerHTML = picks.map(relatedCardHtml).join('');

    grid.querySelectorAll('.btn-quick-add').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        var card = this.closest('article');
        if (!card || typeof MewTeaCart === 'undefined') return;
        var name = card.getAttribute('data-name');
        MewTeaCart.addItem({
          id: card.getAttribute('data-id'),
          name: name,
          image: card.getAttribute('data-image'),
          price: parseInt(card.getAttribute('data-price'), 10) || 0,
          size: 'M',
          topping: [],
          sweetness: '100%',
          ice: 'Vừa đá',
          quantity: 1,
          note: ''
        });
        alert('Đã thêm nhanh 1 ly ' + name + ' vào giỏ hàng!');
      };
    });
  }

  function init() {
    if (typeof MEWTEA_PRODUCTS === 'undefined') return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var product = (id && getProductById(id)) || MEWTEA_PRODUCTS[0];

    renderDetail(product);
    renderRelated(product.id);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
