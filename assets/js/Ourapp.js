/**
 * OURAPP.JS — Xử lý tương tác & Hiệu ứng cho trang OurApp.html
 * MewTea App Showcase
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SHOWCASE CAROUSEL (Tự động chạy, Touch, Arrow, Pagination, Loop)
     ========================================================================== */
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const navDots = document.getElementById('carouselNav');

  if (track && prevBtn && nextBtn && navDots) {
    const slides = Array.from(track.children);
    const dots = Array.from(navDots.children);
    let currentIndex = 0;
    let autoPlayTimer = null;

    function updateCarousel(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      
      slides.forEach((slide, i) => slide.classList.toggle('current-slide', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('current-slide', i === index));
      currentIndex = index;
    }

    function nextSlide() {
      const newIndex = (currentIndex + 1) % slides.length;
      updateCarousel(newIndex);
    }

    function prevSlide() {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel(newIndex);
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateCarousel(i);
        resetAutoPlay();
      });
    });

    // Touch / Swipe support
    let startX = 0;
    track.addEventListener('touchstart', (e) => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
      resetAutoPlay();
    });

    // Auto Play
    function startAutoPlay() {
      autoPlayTimer = setInterval(nextSlide, 4000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    startAutoPlay();
  }

  /* ==========================================================================
     2. FAQ ACCORDION (Animation mở mượt mà)
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Đóng tất cả accordion khác
      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Mở nếu chưa mở
      if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     3. SCROLL REVEAL (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ==========================================================================
     4. BUTTON RIPPLE EFFECT (Hiệu ứng gợn sóng khi Click nút)
     ========================================================================== */
  const rippleButtons = document.querySelectorAll('.btn-ripple');

  rippleButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const rippleExist = this.querySelector('.ripple');
      if (rippleExist) rippleExist.remove();

      this.appendChild(circle);
    });
  });

});