<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpeedTestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'isp',
        'public_ip',
        'local_ip',
        'ping',
        'latency',
        'jitter',
        'download_speed',
        'upload_speed',
        'packet_loss',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}