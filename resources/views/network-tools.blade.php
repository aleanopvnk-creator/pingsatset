@extends('layouts.app')

@section('title', 'Network Tools')
@section('content')
<div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 dark:text-white">Network Tools</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @foreach ([
            ['id'=>'ping','title'=>'Ping Host','icon'=>'fa-exchange-alt','route'=>'network-tools/ping','param'=>'host'],
            ['id'=>'dns','title'=>'DNS Lookup','icon'=>'fa-search','route'=>'network-tools/dns','param'=>'domain'],
            ['id'=>'ip','title'=>'IP Lookup','icon'=>'fa-map-marker-alt','route'=>'network-tools/ip-lookup','param'=>'ip'],
            ['id'=>'whois','title'=>'WHOIS','icon'=>'fa-globe','route'=>'network-tools/whois','param'=>'domain'],
            ['id'=>'port','title'=>'Port Checker','icon'=>'fa-plug','route'=>'network-tools/port','param'=>'host', 'extra'=>'port'],
            ['id'=>'traceroute','title'=>'Traceroute','icon'=>'fa-route','route'=>'network-tools/traceroute','param'=>'host'],
            ['id'=>'router','title'=>'Router Info','icon'=>'fa-wifi','route'=>'network-tools/router-info','param'=>null],
        ] as $tool)
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow" data-aos="fade-up">
            <div class="flex items-center space-x-3 mb-3">
                <i class="fas {{ $tool['icon'] }} text-2xl text-indigo-500"></i>
                <h2 class="text-lg font-semibold dark:text-white">{{ $tool['title'] }}</h2>
            </div>
            @if($tool['param'])
            <div class="flex gap-2 mb-3">
                <input type="text" id="{{ $tool['id'] }}-input" placeholder="{{ $tool['title'] == 'Port Checker' ? 'host' : $tool['param'] }}"
                       class="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                @if($tool['id'] == 'port')
                <input type="number" id="port-input" placeholder="Port" class="w-24 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                @endif
                <button onclick="runTool('{{ $tool['id'] }}', '{{ $tool['route'] }}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><i class="fas fa-play"></i></button>
            </div>
            @else
            <button onclick="runTool('{{ $tool['id'] }}', '{{ $tool['route'] }}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><i class="fas fa-sync-alt"></i> Lihat Info</button>
            @endif
            <pre id="{{ $tool['id'] }}-output" class="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-sm overflow-auto max-h-40 mt-2"></pre>
        </div>
        @endforeach
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Catatan: Beberapa tools bergantung pada izin server (exec, fsockopen).</p>
</div>

<script>
    async function runTool(toolId, route) {
        const outputEl = document.getElementById(toolId + '-output');
        outputEl.textContent = 'Memproses...';
        const payload = {};
        if (toolId === 'port') {
            payload.host = document.getElementById('port-input').value || document.getElementById('port-input')?.value;
            payload.port = document.getElementById('port-input')?.value || document.getElementById('port-input')?.value;
        } else if (toolId === 'ping' || toolId === 'traceroute') {
            payload.host = document.getElementById(toolId + '-input').value;
        } else if (toolId === 'dns' || toolId === 'whois') {
            payload.domain = document.getElementById(toolId + '-input').value;
        } else if (toolId === 'ip') {
            payload.ip = document.getElementById(toolId + '-input').value;
        }
        try {
            const res = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.output) outputEl.textContent = data.output;
            else outputEl.textContent = JSON.stringify(data, null, 2);
        } catch (e) {
            outputEl.textContent = 'Error: ' + e.message;
        }
    }
</script>
@endsection