<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NetworkToolsController extends Controller
{
    public function index()
    {
        return view('network-tools');
    }

    public function pingHost(Request $request)
    {
        $host = $request->input('host');
        $request->validate(['host' => 'required|string']);

        $output = [];
        $status = 0;
        // Gunakan exec ping untuk sistem Unix/Windows, dengan batasan
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $cmd = "ping -n 4 " . escapeshellarg($host);
        } else {
            $cmd = "ping -c 4 " . escapeshellarg($host);
        }
        exec($cmd, $output, $status);
        return response()->json([
            'success' => $status === 0,
            'output' => implode("\n", $output)
        ]);
    }

    public function dnsLookup(Request $request)
    {
        $domain = $request->input('domain');
        $request->validate(['domain' => 'required|string']);
        $records = dns_get_record($domain, DNS_A + DNS_AAAA + DNS_MX + DNS_NS + DNS_TXT);
        return response()->json([
            'records' => $records ?: [],
            'message' => empty($records) ? 'No records found' : ''
        ]);
    }

    public function ipLookup(Request $request)
    {
        $ip = $request->input('ip', $request->ip());
        $request->validate(['ip' => 'ip']);
        $response = \Illuminate\Support\Facades\Http::get("http://ip-api.com/json/{$ip}");
        return response()->json($response->json());
    }

    public function whois(Request $request)
    {
        $domain = $request->input('domain');
        $request->validate(['domain' => 'required|string']);
        $whois = '';
        $fp = @fsockopen('whois.iana.org', 43, $errno, $errstr, 10);
        if ($fp) {
            fwrite($fp, $domain . "\r\n");
            while (!feof($fp)) {
                $whois .= fgets($fp, 128);
            }
            fclose($fp);
        } else {
            $whois = "WHOIS query failed: $errstr ($errno)";
        }
        return response()->json(['output' => $whois]);
    }

    public function portChecker(Request $request)
    {
        $host = $request->input('host');
        $port = $request->input('port');
        $request->validate(['host' => 'required|string', 'port' => 'required|integer|min:1|max:65535']);
        $connection = @fsockopen($host, $port, $errno, $errstr, 5);
        $open = is_resource($connection);
        if ($open) fclose($connection);
        return response()->json([
            'open' => $open,
            'message' => $open ? 'Port is open' : "Port is closed ($errstr)"
        ]);
    }

    public function traceroute(Request $request)
    {
        $host = $request->input('host');
        $request->validate(['host' => 'required|string']);
        $output = [];
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            exec("tracert " . escapeshellarg($host), $output);
        } else {
            exec("traceroute -w 1 -q 1 " . escapeshellarg($host), $output);
        }
        return response()->json([
            'output' => implode("\n", $output)
        ]);
    }

    public function routerInfo(Request $request)
    {
        // Informasi terbatas yang bisa diambil dari sisi server, seperti IP klien
        return response()->json([
            'client_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'note' => 'Informasi router (MAC, SSID) tidak bisa diakses langsung. Gunakan data yang tersedia di sisi klien jika diperlukan.'
        ]);
    }
}