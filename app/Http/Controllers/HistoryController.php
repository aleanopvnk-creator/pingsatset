<?php

namespace App\Http\Controllers;

use App\Models\SpeedTestResult;
use Illuminate\Http\Request;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = SpeedTestResult::where('user_id', auth()->id());

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('isp', 'like', "%{$search}%")
                  ->orWhere('public_ip', 'like', "%{$search}%")
                  ->orWhere('local_ip', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $results = $query->latest()->paginate(15)->withQueryString();

        return view('history', compact('results'));
    }

    public function destroy($id)
    {
        $result = SpeedTestResult::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $result->delete();
        return response()->json(['success' => true]);
    }
}