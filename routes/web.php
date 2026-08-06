<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\NetworkToolsController;
use App\Http\Controllers\SpeedTestController;
use App\Http\Controllers\ExportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/network-tools', [NetworkToolsController::class, 'index'])->name('network.tools');
    
    // Speed test processing
    Route::post('/speedtest/ping', [SpeedTestController::class, 'ping']);
    Route::get('/speedtest/download', [SpeedTestController::class, 'download']);
    Route::post('/speedtest/upload', [SpeedTestController::class, 'upload']);
    Route::post('/speedtest/save', [SpeedTestController::class, 'save'])->name('speedtest.save');
    
    // History
    Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
    Route::delete('/history/{id}', [HistoryController::class, 'destroy'])->name('history.destroy');
    Route::get('/history/export/pdf', [ExportController::class, 'pdf'])->name('history.export.pdf');
    Route::get('/history/export/excel', [ExportController::class, 'excel'])->name('history.export.excel');
    
    // Network tools AJAX
    Route::post('/network-tools/ping', [NetworkToolsController::class, 'pingHost']);
    Route::post('/network-tools/dns', [NetworkToolsController::class, 'dnsLookup']);
    Route::post('/network-tools/ip-lookup', [NetworkToolsController::class, 'ipLookup']);
    Route::post('/network-tools/whois', [NetworkToolsController::class, 'whois']);
    Route::post('/network-tools/port', [NetworkToolsController::class, 'portChecker']);
    Route::post('/network-tools/traceroute', [NetworkToolsController::class, 'traceroute']);
    Route::post('/network-tools/router-info', [NetworkToolsController::class, 'routerInfo']);
});

require __DIR__.'/auth.php';