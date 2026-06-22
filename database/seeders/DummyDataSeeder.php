<?php

namespace Database\Seeders;

use App\Models\HasilTes;
use App\Models\Lamaran;
use App\Models\Lowongan;
use App\Models\PelamarProfile;
use App\Models\Pengguna;
use App\Models\Soal;
use App\Models\TesTeknis;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DummyDataSeeder extends Seeder
{
  /**
   * 5 lowongan bertema energi & pertambangan, masing-masing dengan
   * judul, deskripsi, dan kualifikasi yang relevan.
   */
  private const LOWONGAN_DATA = [
    [
      'judul' => 'Mining Engineer',
      'deskripsi' => "Bertanggung jawab merancang dan mengawasi metode penambangan yang aman dan efisien, melakukan perencanaan tambang jangka pendek dan panjang, serta memastikan kepatuhan terhadap standar operasional dan regulasi pertambangan.",
      'kualifikasi' => "- S1 Teknik Pertambangan atau Geologi\n- Pengalaman minimal 1 tahun di bidang pertambangan (lebih disukai)\n- Memahami software perencanaan tambang (Minescape/Surpac)\n- Mampu bekerja di lokasi remote area",
    ],
    [
      'judul' => 'HSE Officer (Health Safety Environment)',
      'deskripsi' => "Mengawasi implementasi sistem keselamatan kerja, melakukan inspeksi rutin area tambang, menyusun laporan insiden, dan memastikan seluruh aktivitas operasional sesuai dengan standar K3 pertambangan.",
      'kualifikasi' => "- S1/D3 K3, Teknik Lingkungan, atau bidang terkait\n- Memahami regulasi K3 pertambangan (Kepmen ESDM)\n- Memiliki sertifikat AK3 Umum menjadi nilai tambah\n- Teliti dan disiplin tinggi terhadap prosedur keselamatan",
    ],
    [
      'judul' => 'Geologist',
      'deskripsi' => "Melakukan eksplorasi dan pemetaan geologi, menganalisis data bor untuk estimasi cadangan, serta menyusun laporan geologi untuk mendukung perencanaan tambang.",
      'kualifikasi' => "- S1 Teknik Geologi\n- Memahami software pemetaan geologi (ArcGIS/Surpac)\n- Pengalaman eksplorasi mineral menjadi nilai tambah\n- Siap ditempatkan di lokasi tambang",
    ],
    [
      'judul' => 'Operator Alat Berat',
      'deskripsi' => "Mengoperasikan alat berat tambang (excavator, dump truck, bulldozer) sesuai standar operasional, melakukan pemeriksaan harian alat, dan melaporkan kondisi alat ke supervisor.",
      'kualifikasi' => "- Minimal SMA/SMK sederajat\n- Memiliki SIM/sertifikat operator alat berat\n- Pengalaman mengoperasikan alat berat tambang minimal 1 tahun\n- Sehat jasmani dan rohani, siap kerja shift",
    ],
    [
      'judul' => 'Staff Administrasi Tambang',
      'deskripsi' => "Mengelola dokumen administrasi operasional tambang, mendukung pelaporan produksi harian, serta berkoordinasi dengan berbagai divisi terkait kebutuhan administratif lapangan.",
      'kualifikasi' => "- Minimal D3 segala jurusan, diutamakan Manajemen/Akuntansi\n- Mahir Microsoft Office (Excel khususnya)\n- Teliti, rapi, dan mampu bekerja dengan tenggat waktu\n- Pengalaman di industri pertambangan menjadi nilai tambah",
    ],
  ];

  public function run(): void
  {
    $this->command->info('Membuat akun HRD...');
    $hrd = Pengguna::factory()->hrd()->create([
      'nama' => 'Budi Santoso',
      'email' => 'hrd@spk.test',
      'password' => bcrypt('password'),
    ]);

    $this->command->info('Membuat 5 lowongan bertema energi & pertambangan...');
    $lowongans = collect();
    foreach (self::LOWONGAN_DATA as $data) {
      $lowongans->push(
        Lowongan::factory()->create([
          ...$data,
          'pengguna_id' => $hrd->id,
        ])
      );
    }

    $this->command->info('Membuat tes teknis untuk setiap lowongan...');
    foreach ($lowongans as $lowongan) {
      $tes = TesTeknis::create([
        'lowongan_id' => $lowongan->id,
        'durasi_menit' => 60,
        'jumlah_soal' => 10,
      ]);

      // Tambahkan 15 soal unik per lowongan dari bank soal tematik
      Soal::factory()
        ->count(15)
        ->create(['tes_id' => $tes->id]);
    }

    $this->command->info('Membuat 100 pelamar dengan profil lengkap...');
    $pelamars = collect();
    for ($i = 0; $i < 100; $i++) {
      $pelamar = Pengguna::factory()->create();

      PelamarProfile::factory()->create([
        'pengguna_id' => $pelamar->id,
      ]);

      // 70% pelamar punya 1-2 pengalaman kerja, 30% fresh graduate
      if (fake()->boolean(70)) {
        \App\Models\PengalamanKerja::factory()
          ->count(fake()->numberBetween(1, 2))
          ->create(['pengguna_id' => $pelamar->id]);
      }

      $pelamars->push($pelamar);
    }

    $this->command->info('Membuat lamaran dengan status tersebar di semua tahap, merata ke 5 lowongan...');
    $this->seedLamaranTersebar($pelamars, $lowongans);

    $this->command->info('Selesai! 100 pelamar, 5 lowongan, lamaran tersebar merata di semua status.');
  }

  /**
   * Sebar 100 pelamar ke 5 lowongan SECARA MERATA (20 pelamar/lowongan),
   * dengan status lamaran tersebar ke semua tahap alur rekrutmen pada
   * setiap lowongan, supaya tiap halaman (seleksi, tes, TOPSIS) di
   * SETIAP lowongan punya data untuk ditest -- bukan cuma satu lowongan.
   */
  private function seedLamaranTersebar(Collection $pelamars, Collection $lowongans): void
  {
    $pelamars = $pelamars->shuffle()->values();
    $totalPelamar = $pelamars->count();
    $jumlahLowongan = $lowongans->count();
    $pelamarPerLowongan = intdiv($totalPelamar, $jumlahLowongan);

    $lowonganIndex = 0;

    foreach ($lowongans as $lowongan) {
      $awal = $lowonganIndex * $pelamarPerLowongan;
      $grupPelamar = $pelamars->slice($awal, $pelamarPerLowongan)->values();
      $lowonganIndex++;

      $this->command->info(
        "  → {$lowongan->judul}: {$grupPelamar->count()} pelamar"
      );

      $distribusi = $this->bagiDistribusiStatus($grupPelamar->count());

      $posisi = 0;
      foreach ($distribusi as $status => $jumlah) {
        for ($i = 0; $i < $jumlah; $i++) {
          if (! $grupPelamar->has($posisi)) {
            break;
          }

          $pelamar = $grupPelamar->get($posisi);
          $posisi++;

          $lamaran = Lamaran::create([
            'pengguna_id' => $pelamar->id,
            'lowongan_id' => $lowongan->id,
            'status' => $status,
          ]);

          // Untuk status yang sudah melewati tahap tes,
          // buatkan record hasil_tes agar TOPSIS bisa dihitung.
          if (in_array($status, [
            Lamaran::STATUS_SELESAI_TES,
            Lamaran::STATUS_DITERIMA,
            Lamaran::STATUS_DITOLAK,
          ], true)) {
            HasilTes::factory()->create([
              'lamaran_id' => $lamaran->id,
            ]);
          }
        }
      }
    }
  }

  /**
   * Hitung jumlah pelamar per status berdasarkan persentase distribusi,
   * memastikan totalnya pas dengan jumlah pelamar yang tersedia.
   *
   * @return array<string, int>
   */
  private function bagiDistribusiStatus(int $total): array
  {
    $persentase = [
      Lamaran::STATUS_MENUNGGU => 0.20,
      Lamaran::STATUS_GAGAL_ADMIN => 0.15,
      Lamaran::STATUS_LOLOS_ADMIN => 0.15,
      Lamaran::STATUS_MENUNGGU_TES => 0.10,
      Lamaran::STATUS_SELESAI_TES => 0.25,
      Lamaran::STATUS_DITERIMA => 0.10,
      Lamaran::STATUS_DITOLAK => 0.05,
    ];

    $distribusi = [];
    $terpakai = 0;

    $statusList = array_keys($persentase);
    $totalStatus = count($statusList);

    foreach ($statusList as $i => $status) {
      if ($i === $totalStatus - 1) {
        // Status terakhir ambil sisa, hindari pembulatan meleset dari total
        $distribusi[$status] = max(0, $total - $terpakai);
      } else {
        $jumlah = (int) round($total * $persentase[$status]);
        $distribusi[$status] = $jumlah;
        $terpakai += $jumlah;
      }
    }

    return $distribusi;
  }
}
