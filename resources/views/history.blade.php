@extends('layouts.app')

@section('title', 'History Speed Test')
@section('content')
<div class="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 dark:text-white">History Speed Test</h1>

    <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow mb-6">
        <form method="GET" class="flex flex-wrap gap-3 items-end">
            <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300">Search</label>
                <input type="text" name="search" value="{{ request('search') }}" placeholder="ISP / IP..."
                       class="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300">From</label>
                <input type="date" name="date_from" value="{{ request('date_from') }}" class="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
                <label class="block text-sm text-gray-700 dark:text-gray-300">To</label>
                <input type="date" name="date_to" value="{{ request('date_to') }}" class="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex gap-2">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"><i class="fas fa-filter"></i> Filter</button>
                <a href="{{ route('history.index') }}" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">Reset</a>
                <a href="{{ route('history.export.pdf') }}" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"><i class="fas fa-file-pdf"></i> PDF</a>
                <a href="{{ route('history.export.excel') }}" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><i class="fas fa-file-excel"></i> Excel</a>
            </div>
        </form>
    </div>

    <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl overflow-hidden shadow">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tanggal</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Jam</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ISP</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ping</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Download</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Upload</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                    <th class="px-4 py-3"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @forelse ($results as $result)
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td class="px-4 py-3 text-sm">{{ $result->created_at->format('Y-m-d') }}</td>
                    <td class="px-4 py-3 text-sm">{{ $result->created_at->format('H:i:s') }}</td>
                    <td class="px-4 py-3 text-sm">{{ $result->isp }}</td>
                    <td class="px-4 py-3 text-sm">{{ $result->ping }} ms</td>
                    <td class="px-4 py-3 text-sm">{{ $result->download_speed }} Mbps</td>
                    <td class="px-4 py-3 text-sm">{{ $result->upload_speed }} Mbps</td>
                    <td class="px-4 py-3 text-sm"><span class="px-2 py-1 rounded-full text-xs font-semibold {{ $result->status == 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">{{ $result->status }}</span></td>
                    <td class="px-4 py-3 text-sm">
                        <button onclick="deleteHistory({{ $result->id }})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
                @empty
                <tr><td colspan="8" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Belum ada history speed test.</td></tr>
                @endforelse
            </tbody>
        </table>
        <div class="p-4">
            {{ $results->links() }}
        </div>
    </div>
</div>

<script>
    async function deleteHistory(id) {
        const result = await Swal.fire({
            title: 'Hapus data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });
        if (result.isConfirmed) {
            try {
                await fetch(`/history/${id}`, {
                    method: 'DELETE',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content }
                });
                Swal.fire('Terhapus!', '', 'success').then(() => location.reload());
            } catch (e) {
                Swal.fire('Gagal', 'Tidak bisa menghapus', 'error');
            }
        }
    }
</script>
@endsection