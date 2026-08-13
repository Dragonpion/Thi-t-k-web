/**
 * index-review.html — Trang chủ MewTea
 * Chọn ngẫu nhiên 4/15 sản phẩm cho mục "Best Seller" mỗi lần tải trang (không cố định),
 * dữ liệu lấy trực tiếp từ mewtea-data.js — đồng bộ tuyệt đối với Menu/Safe/Chi tiết.
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

  function cardHtml(p, stats) {
    return '' +
      '<a href="chitietsanpham.html?id=' + p.id + '" target="_self">' +
        '<article class="product-card" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '">' +
          '<div class="product-card__img">' +
            '<span class="ribbon ribbon--hot"><i class="fa-solid fa-fire"></i> Bán chạy</span>' +
            '<button type="button" class="product-card__fav" aria-label="Yêu thích" onclick="event.preventDefault()"><i class="fa-regular fa-heart"></i></button>' +
            '<img src="' + p.image + '" alt="' + p.name + '">' +
          '</div>' +
          '<div class="product-card__body">' +
            '<p class="product-card__cat">' + p.category + '</p>' +
            '<h3 class="product-card__name">' + p.name + '</h3>' +
            '<p class="product-card__rating">' + starsHtml(p.rating) + ' <span>' + p.rating.toFixed(1) + ' (' + stats.reviews + ')</span></p>' +
            '<div class="product-card__footer">' +
              '<span class="product-card__price">' + formatVnd(p.price) + '</span>' +
              '<button type="button" class="product-card__buy btn-quick-add" aria-label="Thêm vào giỏ" onclick="event.preventDefault()"><i class="fa-solid fa-plus"></i></button>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</a>';
  }

  function bindQuickAdd() {
    document.querySelectorAll('#bestseller-grid .product-card__buy').forEach(function (btn) {
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
    var picks = getRandomProducts(4);
    var grid = document.getElementById('bestseller-grid');
    if (!grid) return;
    grid.innerHTML = picks.map(function (p) {
      return cardHtml(p, getStableStats(p.id));
    }).join('');
    bindQuickAdd();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
