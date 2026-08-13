/**
 * Script bổ trợ giao diện cho trang giỏ hàng.
 * KHÔNG chứa business logic giỏ hàng — toàn bộ logic giỏ hàng do cart-handler.js đảm nhiệm.
 * Chỉ xử lý: (1) hiệu ứng Ripple thị giác, (2) nút Thanh toán gọi API công khai của MewTeaCart.
 */
document.addEventListener("DOMContentLoaded", function () {

  // 1. Hiệu ứng Ripple (sóng lan tỏa) khi nhấp vào các nút .ripple-effect
  document.querySelectorAll(".ripple-effect").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 2. Nút "Thanh toán ngay" — sử dụng API công khai MewTeaCart.clearCart()
  const btnCheckout = document.getElementById("btn-checkout");
  if (btnCheckout && typeof MewTeaCart !== "undefined") {
    btnCheckout.addEventListener("click", function () {
      if (MewTeaCart.getCart().length === 0) return;
      alert("Cảm ơn bạn đã lựa chọn đặt hàng tại MewTea! Đơn hàng của bạn đang được xử lý pha chế.");
      MewTeaCart.clearCart();
    });
  }

  // 3. Đồng bộ hiển thị khối "Giỏ hàng trống" (thiết kế đẹp, có minh họa bong bóng)
  //    cart-handler.js chỉ ẩn #cart-grid và chèn thông báo trống đơn giản bên trong
  //    #cart-items-container (khi đó cũng bị ẩn theo #cart-grid). Đoạn dưới đây CHỈ
  //    quan sát DOM và bật/tắt khối minh họa đẹp #cart-empty-state cho tương xứng —
  //    không đụng đến bất kỳ hàm hay dữ liệu nào của cart-handler.js.
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartEmptyState = document.getElementById("cart-empty-state");

  function syncEmptyCartVisual() {
    if (!cartItemsContainer || !cartEmptyState || typeof MewTeaCart === "undefined") return;
    const isEmpty = MewTeaCart.getCart().length === 0;
    cartEmptyState.style.display = isEmpty ? "block" : "none";
  }

  syncEmptyCartVisual();

  if (cartItemsContainer && window.MutationObserver) {
    new MutationObserver(syncEmptyCartVisual).observe(cartItemsContainer, { childList: true });
  }

});
