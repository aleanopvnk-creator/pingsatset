<?php

namespace App\Http\Controllers;

use App\Models\SpeedTestResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SpeedTestController extends Controller
{
    public function ping(Request $request)
    {
        $start = microtime(true);
        // Simulasi waktu respons server (dapat diganti dengan pengukuran nyata)
        usleep(10000); // 10ms
        $end = microtime(true);
        $ping = round(($end - $start) * 1000, 2);
        return response()->json(['ping' => $ping]);
    }

    public function download()
    {
        // Kirim data dummy 10 MB
        $size = 10 * 1024 * 1024; // 10 MB
        $chunk = str_repeat('0', 1024); // 1 KB chunk
        return response()->stream(function () use ($size, $chunk) {
            $sent = 0;
            while ($sent < $size) {
                echo $chunk;
                $sent += strlen($chunk);
                if (ob_get_level()) ob_flush();
                flush();
            }
        }, 200, [
            'Content-Type' => 'application/octet-stream',
            'Content-Length' => $size,
            'Cache-Control' => 'no-store, no-cache, must-revalidate',
        ]);
    }

    public function upload(Request $request)
    {
        // Ukur waktu upload: klien mengirim file, kita hitung waktu diterima
        $start = $request->input('start_time');
        $end = microtime(true);
        $duration = $end - $start;
        $fileSize = $request->input('file_size'); // dalam byte
        if ($duration > 0 && $fileSize > 0) {
            $speedBps = $fileSize / $duration;
            $speedMbps = ($speedBps * 8) / 1_000_000;
        } else {
            $speedMbps = 0;
        }
        return response()->json([
            'upload_speed' => round($speedMbps, 2),
            'duration' => $duration
        ]);
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'isp' => 'nullable|string|max:255',
            'public_ip' => 'nullable|string|max:45',
            'local_ip' => 'nullable|string|max:45',
            'ping' => 'nullable|numeric',
            'latency' => 'nullable|numeric',
            'jitter' => 'nullable|numeric',
            'download_speed' => 'nullable|numeric',
            'upload_speed' => 'nullable|numeric',
            'packet_loss' => 'nullable|numeric',
            'status' => 'required|in:completed,failed',
        ]);

        $validated['user_id'] = auth()->id();
        SpeedTestResult::create($validated);

        return response()->json(['success' => true]);
    }
}