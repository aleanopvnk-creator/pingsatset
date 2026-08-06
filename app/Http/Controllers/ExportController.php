<?php

namespace App\Http\Controllers;

use App\Models\SpeedTestResult;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SpeedTestExport;
use Barryvdh\DomPDF\Facade\Pdf;

class ExportController extends Controller
{
    public function pdf()
    {
        $results = SpeedTestResult::where('user_id', auth()->id())->latest()->get();
        $pdf = Pdf::loadView('exports.speedtest-pdf', compact('results'));
        return $pdf->download('speedtest-history.pdf');
    }

    public function excel()
    {
        return Excel::download(new SpeedTestExport(auth()->id()), 'speedtest-history.xlsx');
    }
}