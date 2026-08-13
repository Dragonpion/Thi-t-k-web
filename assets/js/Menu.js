/**
 * Render động sản phẩm Menu MewTea từ mewtea-data.js.
 * Nhân bản mảng dữ liệu (Items x 2) để tạo 2 tập sản phẩm giống hệt nhau nối đuôi,
 * kết hợp CSS Transform Animation tạo hiệu ứng vòng lặp vô tận (Infinite Loop) 100% mượt mà.
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

  function cardHtml(p) {
    return '' +
      '<article class="menu-card glass-effect" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '">' +
        '<div class="menu-card__img-container">' +
          '<span class="menu-card__tag">' + p.tag + '</span>' +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '</div>' +
        '<div class="menu-card__body">' +
          '<h3 class="menu-card__title">' + p.name + '</h3>' +
          '<p class="menu-card__desc">' + p.shortDesc + '</p>' +
          '<div class="menu-card__rating">' + starsHtml(p.rating) + '</div>' +
          '<div class="menu-card__footer">' +
            '<span class="menu-card__price">' + (typeof formatVnd === 'function' ? formatVnd(p.price) : p.price + 'đ') + '</span>' +
            '<div class="menu-card__actions">' +
              '<a href="Chitietsanpham.html?id=' + p.id + '" target="_self" class="menu-card__btn">Xem Chi Tiết</a>' +
              '<button type="button" class="menu-card__btn menu-card__btn--cart btn-quick-add" aria-label="Thêm giỏ hàng"><i class="fa-solid fa-cart-plus"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderInfiniteRow(items, trackId) {
    var track = document.getElementById(trackId);
    if (!track) return;

    // Nhân bản danh sách (items x 2) để tạo chu kỳ nối đuôi liền mạch
    var doubledItems = items.concat(items);
    var html = doubledItems.map(function (p) { return cardHtml(p); }).join('');
    track.innerHTML = html;
  }

  function init() {
    if (typeof MEWTEA_PRODUCTS === 'undefined') return;
    var all = MEWTEA_PRODUCTS;
    
    var rowLtr = all.slice(0, 8);   // Hàng 1
    var rowRtl = all.slice(8, 15);  // Hàng 2

    renderInfiniteRow(rowLtr, 'menu-track-ltr');
    renderInfiniteRow(rowRtl, 'menu-track-rtl');

    // Gắn sự kiện Thêm giỏ hàng
    document.querySelectorAll('.menu-card .btn-quick-add').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        var card = this.closest('article');
        if (!card || typeof MewTeaCart === 'undefined') return;
        MewTeaCart.addItem({
          id: card.getAttribute('data-id'),
          name: card.getAttribute('data-name'),
          image: card.getAttribute('data-image'),
          price: parseInt(card.getAttribute('data-price'), 10) || 0,
          size: 'M',
          topping: [],
          sweetness: '100%',
          ice: 'Vừa đá',
          quantity: 1,
          note: ''
        });
        alert('Đã thêm 1 ly ' + card.getAttribute('data-name') + ' vào giỏ hàng!');
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
