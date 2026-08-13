
document.addEventListener('DOMContentLoaded', () => {
    // Check Logged Status
    const isLogged = localStorage.getItem('mewtea_admin_logged');
    if (isLogged !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    // Display User Name
    const savedUser = localStorage.getItem('mewtea_admin_user') || 'Quản Trị Viên';
    document.getElementById('adminUserName').textContent = savedUser.split('@')[0];

    // Display Current Date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    document.getElementById('currentDateStr').textContent = now.toLocaleDateString('vi-VN', options);

    // Dark Mode Toggle
    const darkModeBtn = document.getElementById('darkModeBtn');
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        darkModeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun" style="color:var(--gold);"></i>' : '<i class="fa-solid fa-moon"></i>';
    });

    // Mobile Responsive Sidebar Toggle
    const mobileBtn = document.getElementById('mobileToggleBtn');
    const sidebar = document.getElementById('adminSidebar');
    if (window.innerWidth <= 768) {
        mobileBtn.style.display = 'flex';
    }
    mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Logout Action
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if(confirm('Bạn có chắc chắn muốn đăng xuất khỏi MewTea CMS?')) {
            localStorage.removeItem('mewtea_admin_logged');
            window.location.href = 'admin-login.html';
        }
    });

    // Render Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [{
                label: 'Doanh thu (triệu VNĐ)',
                data: [12.5, 14.2, 11.8, 18.45, 21.0, 26.5, 24.8],
                borderColor: '#C9A227',
                backgroundColor: 'rgba(201, 162, 39, 0.12)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#313C45',
                pointBorderColor: '#D4AF37',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { callback: value => value + ' tr' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
});
