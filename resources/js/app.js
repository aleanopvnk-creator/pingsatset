import './bootstrap';

import 'bootstrap';
import AOS from 'aos';
import Swal from 'sweetalert2';

// Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Init
AOS.init({
    duration: 800,
    once: true,
});

window.Swal = Swal;

// Dark mode toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
        // Set initial icon
        icon.className = document.documentElement.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
    }
});