/**
 * MewTea — Nguồn dữ liệu sản phẩm dùng chung (Single Source of Truth)
 * Dùng chung cho: Menu.html, index-review.html, Safe.html, chitietsanpham.html
 * KHÔNG chứa logic giỏ hàng — nghiệp vụ giỏ hàng do cart-handler.js đảm nhiệm.
 */
(function (root) {
  'use strict';

  var MEWTEA_PRODUCTS = [
    {
      id: "tra-sua-socola",
      name: "Trà Sữa Socola",
      tag: "Best Seller",
      category: "Trà Sữa",
      price: 52000,
      rating: 5,
      image: "assets/Img/TSSocola.jpg",
      shortDesc: "Vị cacao nguyên chất đượm đà hòa quyện cùng cốt trà sữa đậm đà béo ngậy.",
      longDesc: "Sử dụng bột cacao đắng cao cấp nhập khẩu hòa cùng cốt trà sữa truyền thống đậm vị. Ly trà sữa Socola mang đến dư vị ngọt ngào xen lẫn chút đắng nhẹ quyến rũ, cực kỳ thích hợp cho những ai mê đắm hương vị socola nguyên bản.",
      subtitle: "Rich Chocolate Milk Tea"
    },
    {
      id: "tra-sua-bac-ha",
      name: "Trà Sữa Bạc Hà",
      tag: "Refreshing",
      category: "Trà Sữa",
      price: 45000,
      rating: 4,
      image: "assets/Img/TSBHa.jpg",
      shortDesc: "Hương bạc hà sảng khoái mát lạnh kết hợp cùng vị trà sữa béo thanh độc đáo.",
      longDesc: "Sự kết hợp bùng nổ giữa tinh chất bạc hà mát lạnh và nền trà sữa ngậy béo. Thức uống mang lại cảm giác sảng khoái tức thì, đập tan cái nóng và để lại hậu vị mát rượi dễ chịu nơi đầu lưỡi.",
      subtitle: "Cool Mint Milk Tea"
    },
    {
      id: "tra-sua-truyen-thong",
      name: "Trà Sữa Truyền Thống",
      tag: "Classic",
      category: "Trà Sữa",
      price: 39000,
      rating: 5,
      image: "assets/Img/TSTThong.jpg",
      shortDesc: "Hồng trà đậm đà pha cùng cốt sữa béo thơm, hương vị nguyên bản khó quên.",
      longDesc: "Được ủ từ lá hồng trà thượng hạng đập đà kết hợp với cốt sữa theo tỉ lệ vàng độc quyền của MewTea. Trà sữa truyền thống giữ trọn vị trà thơm nồng, béo ngậy vừa phải, là sự lựa chọn quen thuộc nhưng không bao giờ gây nhàm chán.",
      subtitle: "Classic Black Milk Tea"
    },
    {
      id: "tra-sua-viet-quat",
      name: "Trà Sữa Việt Quất",
      tag: "Fruity",
      category: "Trà Trái Cây",
      price: 48000,
      rating: 4,
      image: "assets/Img/TSVQuat.jpg",
      shortDesc: "Mứt việt quất chua ngọt tự nhiên hòa cùng nền trà sữa thơm béo lôi cuốn.",
      longDesc: "Sự hòa quyện mới lạ giữa vị chua dịu ngọt thanh của việt quất tươi mọng và vị béo dịu của trà sữa. Màu sắc tím mộng mơ cùng hương thơm trái cây tự nhiên tạo nên trải nghiệm vị giác vô cùng thú vị.",
      subtitle: "Blueberry Milk Tea"
    },
    {
      id: "tra-sua-tran-chau-duong-den",
      name: "Trà Sữa Trân Châu Đường Đen",
      tag: "Best Seller",
      category: "Trà Sữa",
      price: 58000,
      rating: 5,
      image: "assets/Img/TSCCDD.jpg",
      shortDesc: "Trân châu đường đen dẻo mềm đun thủ công kết hợp cốt trà sữa thơm bùi.",
      longDesc: "Siêu phẩm không thể bỏ qua với hạt trân châu được nấu kĩ cùng đường đen Okinawa sánh mịn ngấm vị ngọt đậm đà. Khi hòa vào ly trà sữa thơm béo, từng hạt trân châu dẻo dai làm bùng nổ hương vị dịu ngọt ngây ngất.",
      subtitle: "Brown Sugar Boba Milk Tea"
    },
    {
      id: "tra-sua-vi-dau",
      name: "Trà Sữa Vị Dâu",
      tag: "Sweet",
      category: "Trà Trái Cây",
      price: 45000,
      rating: 4,
      image: "assets/Img/TSDau.jpg",
      shortDesc: "Sốt dâu tây mọng nước chua ngọt nhẹ nhàng quyện trong trà sữa thanh dịu.",
      longDesc: "Ly trà sữa mang sắc hồng ngọt ngào với sốt dâu tây tươi chua nhẹ cân bằng hoàn hảo độ béo ngậy của sữa. Thức uống tươi mát, cực kỳ thích hợp cho những ai yêu thích vị trái cây mọng nước thanh dịu.",
      subtitle: "Strawberry Milk Tea"
    },
    {
      id: "tra-sua-vi-dao",
      name: "Trà Sữa Vị Đào",
      tag: "Fresh",
      category: "Trà Trái Cây",
      price: 46000,
      rating: 4,
      image: "assets/Img/TSDao.jpg",
      shortDesc: "Hương đào thơm mát dịu nhẹ kết hợp nền trà nhài béo thanh hấp dẫn.",
      longDesc: "Trà sữa vị đào kết hợp nền trà nhài ướp hương tinh tế cùng sốt đào thơm lừng. Sự dung hòa giữa vị trà thơm thanh và vị ngọt mát dịu của đào mang lại ly trà sữa vừa thanh mát vừa thơm bùi quyến rũ.",
      subtitle: "Peach Milk Tea"
    },
    {
      id: "tra-sua-chanh-tuyet",
      name: "Trà Sữa Chanh Tuyết",
      tag: "New Tastes",
      category: "Trà Trái Cây",
      price: 49000,
      rating: 4,
      image: "assets/Img/TSCTuyet.jpg",
      shortDesc: "Vị chua thanh mát của chanh tươi kết hợp cùng lớp tuyết đá xay và trà sữa độc đáo.",
      longDesc: "Món uống đột phá với vị chua thanh sảng khoái của chanh tươi, đá xay tuyết mịn cùng hậu vị béo dịu của cốt sữa. Món ăn giải nhiệt lý tưởng mang đến cảm giác bừng tỉnh ngay từ ngụm đầu tiên.",
      subtitle: "Lemon Snow Milk Tea"
    },
    {
      id: "tra-sua-mat-ong",
      name: "Trà Sữa Mật Ong",
      tag: "Healthy",
      category: "Trà Sữa",
      price: 48000,
      rating: 5,
      image: "assets/Img/TSMatOng.jpg",
      shortDesc: "Mật ong hoa rừng tự nhiên ngọt thanh hòa quyện cùng cốt trà sữa ngậy nhẹ.",
      longDesc: "Sử dụng 100% mật ong hoa rừng nguyên chất thay thế đường tinh luyện, tạo nên vị ngọt dịu thanh tao, hậu vị thơm đượm lưu lại nơi cổ họng. Thức uống vừa ngon miệng vừa mang lại cảm giác dễ chịu cho sức khỏe.",
      subtitle: "Honey Milk Tea"
    },
    {
      id: "tra-sua-matcha",
      name: "Trà Sữa Matcha",
      tag: "Best Seller",
      category: "Trà Sữa",
      price: 55000,
      rating: 5,
      image: "assets/Img/TSMatcha.jpg",
      shortDesc: "Bột Matcha Nhật Bản nguyên chất chát nhẹ thanh mát hòa cùng sữa béo ngậy.",
      longDesc: "Sử dụng bột Matcha nhập khẩu trực tiếp từ Nhật Bản, đánh tan mịn mượt đậm vị trà xanh nguyên bản. Vị chát nhẹ thanh cao hòa quyện hoàn hảo cùng vị sữa béo ngậy, tạo nên dòng ly trà chuẩn phong cách Nhật.",
      subtitle: "Kyoto Matcha Milk Tea"
    },
    {
      id: "tra-sua-caramel",
      name: "Trà Sữa Caramel",
      tag: "Smooth",
      category: "Trà Sữa",
      price: 50000,
      rating: 4,
      image: "assets/Img/TSCaramel.jpg",
      shortDesc: "Sốt caramel nấu thủ công thơm phức ngọt ngào rưới đều trên nền trà sữa đượm vị.",
      longDesc: "Điểm nhấn là lớp sốt Caramel thắng ngọt đậm đà thơm đượm mùi bơ, quyện chặt cùng nền trà sữa ấm áp. Vị ngọt bùi béo ngậy lan tỏa từ ngụm đầu tiên, rất phù hợp cho những tín đồ thích đồ ngọt sâu đượm.",
      subtitle: "Caramel Milk Tea"
    },
    {
      id: "tra-sua-kem-cheese",
      name: "Trà Sữa Kem Cheese",
      tag: "Velvet",
      category: "Trà Sữa",
      price: 58000,
      rating: 5,
      image: "assets/Img/TSKCheese.jpg",
      shortDesc: "Lớp kem Cheese mặn béo ngậy sánh mịn phủ trên nền trà sữa ngọt dịu thanh tao.",
      longDesc: "Lớp lớp váng kem cheese phô mai béo ngậy đánh bông mịn màng, vị mặn nhẹ độc đáo quyện trọn vào nền hồng trà sữa thơm phức. Khi uống nghiêng góc 45 độ, bạn sẽ cảm nhận trọn vẹn sự bùng nổ của 2 tầng hương vị.",
      subtitle: "Cheese Foam Milk Tea"
    },
    {
      id: "tra-sua-oreo-cake-cream",
      name: "Trà Sữa Oreo Cake Cream",
      tag: "Best Seller",
      category: "Trà Sữa",
      price: 62000,
      rating: 5,
      image: "assets/Img/TSOreo.jpg",
      shortDesc: "Trà sữa bánh kem quết kem cake béo ngậy cùng vụn bánh Oreo giòn tan thơm lừng.",
      longDesc: "Món trà sữa 'quốc dân' gây bão với phần kem cake béo đặc dính quanh thành ly, rắc thêm vụn bánh quy Oreo đắng nhẹ giòn rụm. Trải nghiệm vị giác thú vị khi vừa nhâm nhi trà sữa vừa nhai vụn bánh Oreo giòn tan cực đã.",
      subtitle: "Oreo Cake Cream Milk Tea"
    },
    {
      id: "tra-sua-khoai-mon",
      name: "Trà Sữa Khoai Môn",
      tag: "Signature",
      category: "Trà Sữa",
      price: 48000,
      rating: 5,
      image: "assets/Img/TSKMon.jpg",
      shortDesc: "Khoai môn nghiền mịn bùi béo tự nhiên hòa quyện trong cốt trà sữa quyến rũ.",
      longDesc: "Được pha chế từ bột khoai môn tím bùi béo kết hợp cùng cốt trà ngậy dịu. Sắc tím nhã nhặn cùng hương thơm đặc trưng của khoai môn chín ngấu tạo nên một món uống vô cùng êm dịu, ấm áp.",
      subtitle: "Taro Milk Tea"
    },
    {
      id: "tra-sua-suong-sao",
      name: "Trà Sữa Sương Sáo",
      tag: "Fresh",
      category: "Trà Sữa",
      price: 42000,
      rating: 4,
      image: "assets/Img/TSSSao.jpg",
      shortDesc: "Thạch sương sáo đen mát lạnh thanh nhiệt kết hợp cùng trà sữa béo thơm dịu nhẹ.",
      longDesc: "Sự kết hợp hoàn hảo giữa trà sữa truyền thống thơm béo và những miếng thạch sương sáo mướt mịn, mát lạnh. Món uống không chỉ giúp giải nhiệt tức thì mà còn mang lại cảm giác thanh mát nhẹ nhàng cho cơ thể.",
      subtitle: "Grass Jelly Milk Tea"
    }
  ];

  /**
   * Danh sách 10 mẫu Voucher thực tế trên thị trường
   */
  var VOUCHER_TEMPLATES = [
    { code: "MEW15", badge: "HOT", val: "-15%", title: "Giảm 15% tổng hóa đơn", rules: "Áp dụng cho mọi size, tối đa giảm 20.000đ." },
    { code: "MEWB1T1", badge: "COMBO", val: "2+1", title: "Mua 2 tặng 1 ly cùng loại", rules: "Áp dụng khi mua từ 2 ly trở lên, không giới hạn số lượng." },
    { code: "FREESIZE", badge: "NÂNG CẤP", val: "FREE", title: "Miễn phí nâng size L", rules: "Tự động nâng size khi đặt online, không phụ thu." },
    { code: "TOPPINGFREE", badge: "QUÀ TẶNG", val: "0đ", title: "Tặng 1 topping bất kỳ", rules: "Chọn 1 trong các loại topping trân châu, thạch, pudding." },
    { code: "COMBO10", badge: "COMBO", val: "-10%", title: "Giảm 10% khi mua combo 2 ly", rules: "Áp dụng cho hóa đơn từ 2 ly trở lên trong cùng đơn hàng." },
    { code: "MEMBER20", badge: "THÀNH VIÊN", val: "-20%", title: "Ưu đãi giảm 20% cho hội viên", rules: "Dành riêng cho khách hàng đã đăng ký thành viên MewTea." },
    { code: "SUMMER12", badge: "MÙA HÈ", val: "-12%", title: "Giảm 12% mừng mùa hè sôi động", rules: "Áp dụng cho hóa đơn từ 50.000đ trong tháng khuyến mãi." },
    { code: "NEWCUS25", badge: "KHÁCH MỚI", val: "-25%", title: "Giảm 25% cho lần đặt đầu tiên", rules: "Áp dụng duy nhất 1 lần cho tài khoản mới đăng ký." },
    { code: "WEEKEND18", badge: "CUỐI TUẦN", val: "-18%", title: "Ưu đãi cuối tuần giảm 18%", rules: "Áp dụng vào Thứ 7 và Chủ Nhật hàng tuần." },
    { code: "STUDENT10", badge: "HỌC SINH", val: "-10%", title: "Giảm 10% cho học sinh - sinh viên", rules: "Xuất trình thẻ học sinh, sinh viên khi thanh toán tại quầy." }
  ];

  /**
   * Trộn ngẫu nhiên mảng (Fisher-Yates) — không làm thay đổi mảng gốc
   */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /**
   * Lấy ngẫu nhiên n sản phẩm, có thể loại trừ 1 id
   */
  function getRandomProducts(n, excludeId) {
    var pool = excludeId ? MEWTEA_PRODUCTS.filter(function (p) { return p.id !== excludeId; }) : MEWTEA_PRODUCTS.slice();
    return shuffle(pool).slice(0, Math.min(n, pool.length));
  }

  /**
   * Lấy ngẫu nhiên 8 voucher ưu đãi ngẫu nhiên phục vụ cho trang Safe.html
   */
  function getRandomVouchers(n) {
    var count = n || 8;
    return shuffle(VOUCHER_TEMPLATES).slice(0, Math.min(count, VOUCHER_TEMPLATES.length));
  }

  function getProductById(id) {
    for (var i = 0; i < MEWTEA_PRODUCTS.length; i++) {
      if (MEWTEA_PRODUCTS[i].id === id) return MEWTEA_PRODUCTS[i];
    }
    return null;
  }

  function formatVnd(amount) {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount) + 'đ';
  }

  function seededFrom(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
    return function () {
      h = (h * 1103515245 + 12345) >>> 0;
      return (h % 10000) / 10000;
    };
  }

  function getStableStats(id) {
    var rnd = seededFrom(id);
    var reviews = 80 + Math.floor(rnd() * 1900);
    var sold = 300 + Math.floor(rnd() * 5800);
    return { reviews: reviews, sold: sold };
  }

  // Export ra toàn cục (window / root)
  root.MEWTEA_PRODUCTS = MEWTEA_PRODUCTS;
  root.MEWTEA_VOUCHER_TEMPLATES = VOUCHER_TEMPLATES;
  root.mewteaShuffle = shuffle;
  root.getRandomProducts = getRandomProducts;
  root.getRandomVouchers = getRandomVouchers;
  root.getProductById = getProductById;
  root.formatVnd = formatVnd;
  root.getStableStats = getStableStats;

})(typeof window !== 'undefined' ? window : this);
