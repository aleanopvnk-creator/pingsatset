<!DOCTYPE html>
<html>
<head><title>History Speed Test</title>
<style>
    body { font-family: sans-serif; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background-color: #f0f0f0; }
</style>
</head>
<body>
    <h2>History Speed Test</h2>
    <table>
        <tr>
            <th>Tanggal</th><th>Jam</th><th>ISP</th><th>Ping</th><th>Download</th><th>Upload</th><th>Status</th>
        </tr>
        @foreach($results as $row)
        <tr>
            <td>{{ $row->created_at->format('Y-m-d') }}</td>
            <td>{{ $row->created_at->format('H:i:s') }}</td>
            <td>{{ $row->isp }}</td>
            <td>{{ $row->ping }} ms</td>
            <td>{{ $row->download_speed }} Mbps</td>
            <td>{{ $row->upload_speed }} Mbps</td>
            <td>{{ $row->status }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>