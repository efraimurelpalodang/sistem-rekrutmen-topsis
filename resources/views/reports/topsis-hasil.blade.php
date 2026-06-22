<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Hasil TOPSIS - {{ $lowongan->judul }}</title>
    <style>
        @page {
            margin: 28px 32px;
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
            width: 130px;
        }

        h2 {
            font-size: 13px;
            color: #111827;
            margin: 18px 0 8px 0;
            border-left: 4px solid #2563eb;
            padding-left: 8px;
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

        .text-right {
            text-align: right;
        }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: bold;
        }

        .badge-diterima {
            background-color: #d1fae5;
            color: #065f46;
        }

        .badge-ditolak {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .badge-belum {
            background-color: #f3f4f6;
            color: #4b5563;
        }

        .rank-cell {
            font-weight: bold;
            color: #2563eb;
        }

        .rank-dalam-kuota {
            background-color: #eff6ff;
        }

        .footer-note {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
        }

        .signature-area {
            margin-top: 40px;
            width: 100%;
        }

        .signature-box {
            display: inline-block;
            width: 200px;
            text-align: center;
            font-size: 9px;
        }

        .signature-line {
            margin-top: 50px;
            border-top: 1px solid #1a1a1a;
            padding-top: 4px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Laporan Hasil Perhitungan TOPSIS</h1>
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
                <td>: {{ $rankings->count() }} orang</td>
                <td class="label">Tanggal Cetak</td>
                <td>: {{ $tanggalCetak }}</td>
            </tr>
        </table>
    </div>

    <h2>Tabel Ranking Hasil TOPSIS</h2>
    <table class="data">
        <thead>
            <tr>
                <th style="width: 30px;">Rank</th>
                <th>Nama Pelamar</th>
                @foreach ($kriterias as $kriteria)
                    <th class="text-center">{{ $kriteria->nama }}</th>
                @endforeach
                <th class="text-center" style="width: 55px;">Skor (C)</th>
                <th class="text-center" style="width: 80px;">Status Akhir</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rankings as $hasil)
                <tr class="{{ $hasil->ranking <= $lowongan->kuota ? 'rank-dalam-kuota' : '' }}">
                    <td class="rank-cell text-center">#{{ $hasil->ranking }}</td>
                    <td>{{ $hasil->lamaran->pengguna->nama }}</td>
                    @foreach ($kriterias as $kriteria)
                        @php
                            $detail = $hasil->detailTopsis->firstWhere('kriteria_id', $kriteria->id);
                        @endphp
                        <td class="text-center">{{ $detail ? number_format($detail->nilai_asli, 2) : '-' }}</td>
                    @endforeach
                    <td class="text-center"><strong>{{ number_format($hasil->skor, 4) }}</strong></td>
                    <td class="text-center">
                        @php
                            $status = $hasil->lamaran->status;
                            $label = match ($status) {
                                'diterima' => 'Diterima',
                                'ditolak' => 'Ditolak',
                                default => 'Belum Diputuskan',
                            };
                            $badgeClass = match ($status) {
                                'diterima' => 'badge-diterima',
                                'ditolak' => 'badge-ditolak',
                                default => 'badge-belum',
                            };
                        @endphp
                        <span class="badge {{ $badgeClass }}">{{ $label }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p style="font-size: 8px; color: #6b7280; margin-top: -6px;">
        * Baris dengan latar biru muda menunjukkan ranking yang berada dalam kuota lowongan ({{ $lowongan->kuota }}
        orang teratas).
    </p>

    <h2>Detail Perhitungan Per Kriteria</h2>
    <table class="data">
        <thead>
            <tr>
                <th style="width: 30px;">Rank</th>
                <th>Nama Pelamar</th>
                <th>Kriteria</th>
                <th class="text-center">Nilai Asli</th>
                <th class="text-center">Normalisasi</th>
                <th class="text-center">Terbobot</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rankings as $hasil)
                @foreach ($hasil->detailTopsis as $i => $detail)
                    <tr>
                        @if ($i === 0)
                            <td class="rank-cell text-center" rowspan="{{ $hasil->detailTopsis->count() }}">
                                #{{ $hasil->ranking }}</td>
                            <td rowspan="{{ $hasil->detailTopsis->count() }}">{{ $hasil->lamaran->pengguna->nama }}
                            </td>
                        @endif
                        <td>{{ $detail->kriteria->nama }} ({{ $detail->kriteria->tipe }})</td>
                        <td class="text-center">{{ number_format($detail->nilai_asli, 2) }}</td>
                        <td class="text-center">{{ number_format($detail->nilai_normalisasi, 4) }}</td>
                        <td class="text-center">{{ number_format($detail->nilai_terbobot, 4) }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>

    <div class="footer-note">
        Dokumen ini dihasilkan secara otomatis oleh Sistem Pendukung Keputusan Rekrutmen menggunakan metode TOPSIS pada
        {{ $tanggalCetak }}. Untuk laporan keputusan akhir HRD, lihat dokumen "Laporan Keputusan HRD" terpisah.
    </div>
</body>

</html>
