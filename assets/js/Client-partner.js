document.addEventListener('DOMContentLoaded', () => {

  /* 1. Intersection Observer cho hiệu ứng Reveal Animation */
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  /* 2. Animated Counter cho phần Thống kê */
  const counters = document.querySelectorAll('.counter');
  let counterAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const decimals = counter.getAttribute('data-decimals') || 0;
      const speed = 100;
      const inc = target / speed;
      let count = 0;

      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.innerText = decimals > 0 ? count.toFixed(decimals) : Math.ceil(count).toLocaleString();
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
        }
      };
      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counterAnimated) {
        animateCounters();
        counterAnimated = true;
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  /* 3. Review Filter Logic */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const reviewItems = document.querySelectorAll('.review-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      reviewItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* 4. Like Button Counter Interaction */
  const likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(btn => {
    let liked = false;
    btn.addEventListener('click', () => {
      const countSpan = btn.querySelector('span');
      let currentCount = parseInt(countSpan.innerText);
      if (!liked) {
        countSpan.innerText = currentCount + 1;
        btn.style.color = 'var(--gold-dark)';
        btn.querySelector('i').className = 'fa-solid fa-thumbs-up';
        liked = true;
      } else {
        countSpan.innerText = currentCount - 1;
        btn.style.color = '';
        btn.querySelector('i').className = 'fa-regular fa-thumbs-up';
        liked = false;
      }
    });
  });

});