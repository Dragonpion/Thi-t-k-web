
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminLoginForm');
    const togglePassBtn = document.getElementById('togglePass');
    const passwordInput = document.getElementById('password');
    const portalContainer = document.getElementById('portalContainer');
    const toastError = document.getElementById('toastError');
    const toastMsg = document.getElementById('toastMsg');

    // Password toggle
    togglePassBtn.addEventListener('click', () => {
        const isPass = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPass ? 'text' : 'password');
        togglePassBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });

    // Login Logic Validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();

        // Valid Hardcoded Accounts
        const isValid = (u === 'dragon' && p === '367') || (u === 'admin@mewtea.com' && p === '123456');

        if (isValid) {
            localStorage.setItem('mewtea_admin_logged', 'true');
            localStorage.setItem('mewtea_admin_user', u);
            
            // Button Feedback Effect
            const btn = form.querySelector('.btn-submit');
            btn.style.background = '#27ae60';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Xác thực thành công...</span>';

            setTimeout(() => {
                window.location.href = 'admin-index.html';
            }, 600);
        } else {
            // Shake Effect & Toast Error
            portalContainer.classList.add('shake');
            setTimeout(() => portalContainer.classList.remove('shake'), 600);

            toastMsg.textContent = 'Sai tài khoản hoặc mật khẩu';
            toastError.classList.add('show');
            setTimeout(() => toastError.classList.remove('show'), 3500);
        }
    });
});

function simulateSSO(provider) {
    localStorage.setItem('mewtea_admin_logged', 'true');
    localStorage.setItem('mewtea_admin_user', 'admin@mewtea.com');
    alert('Xác thực thành công qua ' + provider + ' SSO!');
    window.location.href = 'admin-index.html';
}
