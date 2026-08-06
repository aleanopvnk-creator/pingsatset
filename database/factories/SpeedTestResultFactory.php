<?php

namespace Database\Factories;

use App\Models\SpeedTestResult;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SpeedTestResultFactory extends Factory
{
    protected $model = SpeedTestResult::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'isp' => fake()->company() . ' ISP',
            'public_ip' => fake()->ipv4(),
            'local_ip' => '192.168.1.' . fake()->numberBetween(2, 254),
            'ping' => fake()->randomFloat(2, 5, 100),
            'latency' => fake()->randomFloat(2, 10, 120),
            'jitter' => fake()->randomFloat(2, 0.5, 20),
            'download_speed' => fake()->randomFloat(2, 10, 500),
            'upload_speed' => fake()->randomFloat(2, 5, 200),
            'packet_loss' => fake()->randomFloat(2, 0, 5),
            'status' => 'completed',
        ];
    }
}