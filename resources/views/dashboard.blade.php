@extends('layouts.app')

@section('title', 'Beranda - WiFi Speed Test')
@section('content')
<div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 dark:text-white" data-aos="fade-down">Dashboard Speed Test</h1>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div class="flex items-center space-x-3">
                <i class="fas fa-globe text-2xl text-indigo-500"></i>
                <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Public IP</p>
                    <p id="public-ip" class="font-semibold text-gray-800 dark:text-white">--</p>
                </div>
            </div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div class="flex items-center space-x-3">
                <i class="fas fa-network-wired text-2xl text-indigo-500"></i>
                <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Local IP</p>
                    <p id="local-ip" class="font-semibold text-gray-800 dark:text-white">--</p>
                </div>
            </div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div class="flex items-center space-x-3">
                <i class="fas fa-building text-2xl text-indigo-500"></i>
                <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">ISP</p>
                    <p id="isp-info" class="font-semibold text-gray-800 dark:text-white">--</p>
                </div>
            </div>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <div class="flex items-center space-x-3">
                <i class="fas fa-server text-2xl text-indigo-500"></i>
                <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Hostname</p>
                    <p id="hostname-info" class="font-semibold text-gray-800 dark:text-white">--</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Speed Test Section -->
    <div class="flex flex-col items-center mb-10" data-aos="zoom-in">
        <div id="gauge-container" class="relative w-64 h-64 mb-6">
            <canvas id="speedGauge" width="256" height="256"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="speed-value" class="text-4xl font-bold text-gray-800 dark:text-white">0</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">Mbps</span>
            </div>
        </div>
        <button id="start-test-btn" class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full text-xl font-semibold shadow-xl transition transform hover:scale-105">
            <i class="fas fa-play mr-2"></i> START SPEED TEST
        </button>
        <div id="test-status" class="mt-4 text-sm text-gray-600 dark:text-gray-400"></div>
    </div>

    <!-- Real-time Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-aos="fade-up">
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <h3 class="text-lg font-semibold mb-3">Download / Upload (Mbps)</h3>
            <canvas id="speedChart" height="200"></canvas>
        </div>
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow">
            <h3 class="text-lg font-semibold mb-3">Ping & Latency (ms)</h3>
            <canvas id="pingChart" height="200"></canvas>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Ambil data awal klien
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(d => { document.getElementById('public-ip').textContent = d.ip; });
        fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(d => {
                document.getElementById('isp-info').textContent = d.org || 'Unknown';
                document.getElementById('hostname-info').textContent = d.hostname || 'N/A';
            });
        // Local IP tidak bisa diambil browser, isi placeholder
        document.getElementById('local-ip').textContent = '192.168.x.x (lihat router)';

        // Gauge Chart (Chart.js)
        const gaugeCtx = document.getElementById('speedGauge').getContext('2d');
        let gaugeChart = new Chart(gaugeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: ['#6366f1', '#e5e7eb'],
                    borderWidth: 0,
                    circumference: 270,
                    rotation: 225,
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: true,
                plugins: { tooltip: { enabled: false }, legend: { display: false } },
            }
        });

        // Real-time line charts
        const speedCtx = document.getElementById('speedChart').getContext('2d');
        let speedChart = new Chart(speedCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Download', borderColor: '#6366f1', data: [], tension: 0.4 },
                    { label: 'Upload', borderColor: '#10b981', data: [], tension: 0.4 }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        const pingCtx = document.getElementById('pingChart').getContext('2d');
        let pingChart = new Chart(pingCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Ping', borderColor: '#f59e0b', data: [], tension: 0.4 },
                    { label: 'Latency', borderColor: '#ef4444', data: [], tension: 0.4 }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });

        // Fungsi speed test
        document.getElementById('start-test-btn').addEventListener('click', async () => {
            const btn = document.getElementById('start-test-btn');
            const statusEl = document.getElementById('test-status');
            btn.disabled = true;
            statusEl.textContent = 'Connecting...';

            try {
                // Ping test (beberapa kali)
                let pings = [];
                for (let i = 0; i < 5; i++) {
                    const start = performance.now();
                    await fetch('{{ route("speedtest.ping") }}', { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content } });
                    const end = performance.now();
                    pings.push(end - start);
                }
                const pingAvg = pings.reduce((a,b)=>a+b,0)/pings.length;
                const jitter = Math.sqrt(pings.map(p => Math.pow(p - pingAvg, 2)).reduce((a,b)=>a+b,0)/pings.length) || 0;
                const latency = pingAvg;
                statusEl.textContent = 'Testing download...';
                updateGauge(10);

                // Download test
                const downloadStart = performance.now();
                const response = await fetch('{{ route("speedtest.download") }}');
                const reader = response.body.getReader();
                let receivedLength = 0;
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    receivedLength += value.length;
                }
                const downloadEnd = performance.now();
                const downloadDuration = (downloadEnd - downloadStart) / 1000;
                const downloadBps = (receivedLength * 8) / downloadDuration;
                const downloadMbps = downloadBps / 1_000_000;
                updateGauge(Math.min(downloadMbps, 100)); // max gauge 100
                document.getElementById('speed-value').textContent = downloadMbps.toFixed(1);
                statusEl.textContent = 'Testing upload...';

                // Upload test: generate 5 MB blob
                const uploadSize = 5 * 1024 * 1024; // 5 MB
                const blob = new Blob([new ArrayBuffer(uploadSize)]);
                const formData = new FormData();
                formData.append('file', blob, 'test.bin');
                formData.append('start_time', performance.now() / 1000);
                formData.append('file_size', uploadSize);
                const uploadResponse = await fetch('{{ route("speedtest.upload") }}', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
                });
                const uploadData = await uploadResponse.json();
                const uploadMbps = uploadData.upload_speed;
                statusEl.textContent = 'Complete';
                updateGauge(0);
                document.getElementById('speed-value').textContent = downloadMbps.toFixed(1) + ' / ' + uploadMbps.toFixed(1);

                // Update charts
                const now = new Date().toLocaleTimeString();
                speedChart.data.labels.push(now);
                speedChart.data.datasets[0].data.push(downloadMbps.toFixed(1));
                speedChart.data.datasets[1].data.push(uploadMbps.toFixed(1));
                if (speedChart.data.labels.length > 20) {
                    speedChart.data.labels.shift();
                    speedChart.data.datasets.forEach(ds => ds.data.shift());
                }
                speedChart.update();

                pingChart.data.labels.push(now);
                pingChart.data.datasets[0].data.push(pingAvg.toFixed(1));
                pingChart.data.datasets[1].data.push(latency.toFixed(1));
                if (pingChart.data.labels.length > 20) {
                    pingChart.data.labels.shift();
                    pingChart.data.datasets.forEach(ds => ds.data.shift());
                }
                pingChart.update();

                // Simpan ke database
                await fetch('{{ route("speedtest.save") }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        isp: document.getElementById('isp-info').textContent,
                        public_ip: document.getElementById('public-ip').textContent,
                        local_ip: document.getElementById('local-ip').textContent,
                        ping: pingAvg.toFixed(2),
                        latency: latency.toFixed(2),
                        jitter: jitter.toFixed(2),
                        download_speed: downloadMbps.toFixed(2),
                        upload_speed: uploadMbps.toFixed(2),
                        packet_loss: 0,
                        status: 'completed'
                    })
                });
                Swal.fire('Sukses', 'Speed test selesai!', 'success');
            } catch (err) {
                statusEl.textContent = 'Failed';
                Swal.fire('Gagal', 'Terjadi kesalahan saat test.', 'error');
            } finally {
                btn.disabled = false;
            }
        });

        function updateGauge(value) {
            gaugeChart.data.datasets[0].data = [value, 100 - value];
            gaugeChart.update();
        }
    });
</script>
@endpush