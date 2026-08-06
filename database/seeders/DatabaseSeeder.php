<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SpeedTestResult;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat user demo
        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Buat beberapa history speed test dummy
        SpeedTestResult::factory(20)->create([
            'user_id' => $user->id,
        ]);

        $this->command->info('Seeder selesai. Email: admin@example.com, Password: password');
    }
}