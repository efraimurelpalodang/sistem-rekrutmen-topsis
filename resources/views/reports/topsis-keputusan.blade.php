<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Keputusan HRD - {{ $lowongan->judul }}</title>
    <style>
        @page {
            margin: 32px 40px;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10px;
            color: #1a1a1a;
        }

        .header {
            border-bottom: 2px solid #1f2937;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }

        .header h1 {
            font-size: 18px;
            margin: 0 0 4px 0;
            color: #111827;
        }

        .header p {
            margin: 2px 0;
            color: #4b5563;
            font-size: 10px;
        }

        .info-box {
            background-color: #f3f4f6;
            border-radius: 4px;
            padding: 10px 14px;
            margin-bottom: 16px;
        }

        .info-box table {
            width: 100%;
        }

        .info-box td {
            padding: 2px 0;
            font-size: 10px;
        }

        .info-box td.label {
            color: #6b7280;
            width: 140px;
        }

        .summary-grid {
            width: 100%;
            margin-bottom: 20px;
        }

        .summary-grid td {
            width: 33.33%;
            padding: 4px;
        }

        .summary-card {
            border-radius: 6px;
            padding: 14px;
            text-align: center;
        }

        .summary-card .count {
            font-size: 24px;
            font-weight: bold;
            display: block;
        }

        .summary-card .label {
            font-size: 9px;
            margin-top: 2px;
        }

        .card-diterima {
            background-color: #d1fae5;
        }

        .card-diterima .count, .card-diterima .label {
            color: #065f46;
        }

        .card-ditolak {
            background-color: #fee2e2;
        }

        .card-ditolak .count, .card-ditolak .label {
            color: #991b1b;
        }

        .card-belum {
            background-color: #f3f4f6;
        }

        .card-belum .count, .card-belum .label {
            color: #4b5563;
        }

        h2 {
            font-size: 13px;
            color: #111827;
            margin: 18px 0 8px 0;
            padding-left: 8px;
        }

        h2.h-diterima {
            border-left: 4px solid #10b981;
        }

        h2.h-ditolak {
            border-left: 4px solid #ef4444;
        }

        h2.h-belum {
            border-left: 4px solid #9ca3af;
        }

        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }

        table.data th {
            background-color: #1f2937;
            color: #ffffff;
            text-align: left;
            padding: 6px 8px;
            font-size: 9px;
            font-weight: bold;
        }

        table.data td {
            padding: 5px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 9px;
        }

        table.data tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }

        .text-center {
            text-align: center;
        }

        .empty-note {
            font-size: 9px;
            color: #9ca3af;
            font-style: italic;
            padding: 8px 0;
        }

        .signature-area {
            margin-top: 36px;
            width: 100%;
        }

        .signature-box {
            text-align: center;
            font-size: 9px;
        }

        .signature-line {
            margin-top: 50px;
            border-top: 1px solid #1a1a1a;
            padding-top: 4px;
        }

        .footer-note {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Keputusan Akhir HRD</h1>
        <p>Sistem Pendukung Keputusan Rekrutmen Karyawan</p>
    </div>

    <div class="info-box">
        <table>
            <tr>
                <td class="label">Posisi / Lowongan</td>
                <td>: {{ $lowongan->judul }}</td>
                <td class="label">Kuota</td>
                <td>: {{ $lowongan->kuota }} orang</td>
            </tr>
            <tr>
                <td class="label">Total Pelamar Dinilai</td>
                <td>: {{ $totalDinilai }} orang</td>
                <td class="label">Tanggal Cetak</td>
                <td>: {{ $tanggalCetak }}</td>
            </tr>
        </table>
    </div>

    <table class="summary-grid">
        <tr>
            <td>
                <div class="summary-card card-diterima">
                    <span class="count">{{ $diterima->count() }}</span>
                    <span class="label">DITERIMA</span>
                </div>
            </td>
            <td>
                <div class="summary-card card-ditolak">
                    <span class="count">{{ $ditolak->count() }}</span>
                    <span class="label">DITOLAK</span>
                </div>
            </td>
            <td>
                <div class="summary-card card-belum">
                    <span class="count">{{ $belumDiputuskan->count() }}</span>
                    <span class="label">BELUM DIPUTUSKAN</span>
                </div>
            </td>
        </tr>
    </table>

    <h2 class="h-diterima">Pelamar Diterima</h2>
    @if ($diterima->isEmpty())
        <p class="empty-note">Belum ada pelamar yang diterima.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 30px;">Rank</th>
                    <th>Nama Pelamar</th>
                    <th>Email</th>
                    <th class="text-center" style="width: 70px;">Skor TOPSIS</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($diterima as $hasil)
                    <tr>
                        <td class="text-center">#{{ $hasil->ranking }}</td>
                        <td>{{ $hasil->lamaran->pengguna->nama }}</td>
                        <td>{{ $hasil->lamaran->pengguna->email }}</td>
                        <td class="text-center">{{ number_format($hasil->skor, 4) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2 class="h-ditolak">Pelamar Ditolak</h2>
    @if ($ditolak->isEmpty())
        <p class="empty-note">Belum ada pelamar yang ditolak.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 30px;">Rank</th>
                    <th>Nama Pelamar</th>
                    <th>Email</th>
                    <th class="text-center" style="width: 70px;">Skor TOPSIS</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($ditolak as $hasil)
                    <tr>
                        <td class="text-center">#{{ $hasil->ranking }}</td>
                        <td>{{ $hasil->lamaran->pengguna->nama }}</td>
                        <td>{{ $hasil->lamaran->pengguna->email }}</td>
                        <td class="text-center">{{ number_format($hasil->skor, 4) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2 class="h-belum">Belum Diputuskan</h2>
    @if ($belumDiputuskan->isEmpty())
        <p class="empty-note">Tidak ada pelamar yang menunggu keputusan.</p>
    @else
        <table class="data">
            <thead>
                <tr>
                    <th style="width: 30px;">Rank</th>
                    <th>Nama Pelamar</th>
                    <th>Email</th>
                    <th class="text-center" style="width: 70px;">Skor TOPSIS</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($belumDiputuskan as $hasil)
                    <tr>
                        <td class="text-center">#{{ $hasil->ranking }}</td>
                        <td>{{ $hasil->lamaran->pengguna->nama }}</td>
                        <td>{{ $hasil->lamaran->pengguna->email }}</td>
                        <td class="text-center">{{ number_format($hasil->skor, 4) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="signature-area">
        <table style="width: 100%;">
            <tr>
                <td style="width: 65%;"></td>
                <td class="signature-box" style="width: 35%;">
                    <p style="margin: 0;">Mengetahui,</p>
                    <p style="margin: 0;">HRD {{ $lowongan->hrd->nama ?? '' }}</p>
                    <div class="signature-line">
                        {{ $lowongan->hrd->nama ?? '___________________' }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer-note">
        Dokumen ini dihasilkan secara otomatis oleh Sistem Pendukung Keputusan Rekrutmen pada {{ $tanggalCetak }}. Keputusan akhir merupakan hasil pertimbangan HRD berdasarkan rekomendasi perhitungan TOPSIS. Untuk detail perhitungan, lihat dokumen "Laporan Hasil Perhitungan TOPSIS" terpisah.
    </div>
</body>
</html>