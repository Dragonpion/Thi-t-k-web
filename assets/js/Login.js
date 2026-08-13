    document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('loginForm');
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      
      const emailGroup = document.getElementById('emailGroup');
      const passwordGroup = document.getElementById('passwordGroup');
      
      const togglePasswordBtn = document.getElementById('togglePassword');
      const submitBtn = document.getElementById('submitBtn');

      // 1. Show/Hide Password Feature
      togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle Icon Class
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'text') {
          icon.className = 'fa-regular fa-eye-slash';
          togglePasswordBtn.setAttribute('aria-label', 'Ẩn mật khẩu');
        } else {
          icon.className = 'fa-regular fa-eye';
          togglePasswordBtn.setAttribute('aria-label', 'Hiển thị mật khẩu');
        }
      });

      // Email Validator Regex Helper
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      };

      // 2. Realtime Input Cleanups
      emailInput.addEventListener('input', () => {
        if (emailGroup.classList.contains('has-error')) {
          emailGroup.classList.remove('has-error');
        }
      });

      passwordInput.addEventListener('input', () => {
        if (passwordGroup.classList.contains('has-error')) {
          passwordGroup.classList.remove('has-error');
        }
      });

      // 3. Form Submission & Validation Logic
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let hasErrors = false;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value;

        // Reset errors
        emailGroup.classList.remove('has-error');
        passwordGroup.classList.remove('has-error');

        // Email check
        if (!emailValue || !validateEmail(emailValue)) {
          emailGroup.classList.add('has-error');
          hasErrors = true;
        }

        // Password minimum length check
        if (passwordValue.length < 6) {
          passwordGroup.classList.add('has-error');
          hasErrors = true;
        }

        if (hasErrors) return;

        // 4. Loading State Trigger (Simulating network response)
        submitBtn.classList.add('is-loading');
        submitBtn.querySelector('.btn-text').textContent = 'Đang xử lý...';
        
        // Simulate a 2 seconds response window
        setTimeout(() => {
          submitBtn.classList.remove('is-loading');
          submitBtn.querySelector('.btn-text').textContent = 'Đăng nhập';
          alert('Đăng nhập thành công với tài khoản: ' + emailValue);
        }, 2000);
      });
    });
  