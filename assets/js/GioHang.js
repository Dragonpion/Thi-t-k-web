
/**
 * Render động 4 sản phẩm "Có thể bạn cũng thích" tại trang giỏ hàng,
 * lấy trực tiếp từ nguồn dữ liệu dùng chung mewtea-data.js (đồng bộ với Menu/Safe/Chi tiết).
 */
(function () {
  'use strict';

  function starHtml(rating) {
    return '<i class="fa-solid fa-star"></i> ' + rating.toFixed(1);
  }

  function recCardHtml(p) {
    return '' +
      '<article class="rec-card" data-id="' + p.id + '" data-name="' + p.name + '" data-price="' + p.price + '" data-image="' + p.image + '">' +
        '<div class="rec-card__visual">' +
          '<div class="rec-card__bg-blob"></div>' +
          '<a href="chitietsanpham.html?id=' + p.id + '" target="_self">' +
            '<img src="' + p.image + '" alt="' + p.name + '" class="rec-card__img">' +
          '</a>' +
          '<button type="button" class="rec-quick-add btn-quick-add" title="Thêm nhanh"><i class="fa-solid fa-plus"></i></button>' +
        '</div>' +
        '<div class="rec-card__info">' +
          '<h3 class="rec-card__title"><a href="chitietsanpham.html?id=' + p.id + '" target="_self">' + p.name + '</a></h3>' +
          '<p class="rec-card__desc">' + p.shortDesc + '</p>' +
          '<div class="rec-card__footer">' +
            '<span class="rec-card__price">' + formatVnd(p.price) + '</span>' +
            '<span class="rec-card__rating">' + starHtml(p.rating) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function init() {
    if (typeof MEWTEA_PRODUCTS === 'undefined') return;
    var grid = document.getElementById('cart-recommend-grid');
    if (!grid) return;
    var picks = getRandomProducts(4);
    grid.innerHTML = picks.map(recCardHtml).join('');

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
