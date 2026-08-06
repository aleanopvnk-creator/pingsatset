<?php

namespace App\Exports;

use App\Models\SpeedTestResult;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SpeedTestExport implements FromCollection, WithHeadings, WithMapping
{
    private $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        return SpeedTestResult::where('user_id', $this->userId)->latest()->get();
    }

    public function headings(): array
    {
        return [
            'Tanggal', 'Jam', 'ISP', 'Public IP', 'Local IP', 'Ping (ms)',
            'Latency (ms)', 'Jitter (ms)', 'Download (Mbps)', 'Upload (Mbps)',
            'Packet Loss (%)', 'Status'
        ];
    }

    public function map($result): array
    {
        return [
            $result->created_at->format('Y-m-d'),
            $result->created_at->format('H:i:s'),
            $result->isp,
            $result->public_ip,
            $result->local_ip,
            $result->ping,
            $result->latency,
            $result->jitter,
            $result->download_speed,
            $result->upload_speed,
            $result->packet_loss,
            $result->status,
        ];
    }
}