<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('speed_test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('isp')->nullable();
            $table->string('public_ip')->nullable();
            $table->string('local_ip')->nullable();
            $table->float('ping')->nullable(); // ms
            $table->float('latency')->nullable(); // ms
            $table->float('jitter')->nullable(); // ms
            $table->float('download_speed')->nullable(); // Mbps
            $table->float('upload_speed')->nullable(); // Mbps
            $table->float('packet_loss')->nullable(); // percent
            $table->string('status')->default('completed'); // completed, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('speed_test_results');
    }
};