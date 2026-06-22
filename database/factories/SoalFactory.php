<?php

namespace Database\Factories;

use App\Models\Soal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Soal>
 */
class SoalFactory extends Factory
{
  protected $model = Soal::class;

  /**
   * Bank soal tematik pertambangan/energi/K3 agar lebih relevan
   * dibanding soal acak generik dari Faker.
   */
  private const BANK_SOAL = [
    [
      'pertanyaan' => 'Apa kepanjangan dari K3 dalam dunia pertambangan?',
      'pilihan_a' => 'Keselamatan dan Kesehatan Kerja',
      'pilihan_b' => 'Kualitas Kerja Karyawan',
      'pilihan_c' => 'Kebijakan Kerja Korporat',
      'pilihan_d' => 'Ketentuan Kerja Khusus',
      'jawaban_benar' => 'a',
    ],
    [
      'pertanyaan' => 'Alat pelindung diri (APD) wajib yang digunakan saat memasuki area tambang terbuka adalah?',
      'pilihan_a' => 'Jas hujan',
      'pilihan_b' => 'Helm safety, sepatu safety, dan rompi reflektif',
      'pilihan_c' => 'Kacamata hitam',
      'pilihan_d' => 'Sarung tangan kain',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan "overburden" dalam pertambangan terbuka?',
      'pilihan_a' => 'Alat berat utama tambang',
      'pilihan_b' => 'Lapisan tanah/batuan penutup di atas endapan mineral',
      'pilihan_c' => 'Jenis bahan peledak',
      'pilihan_d' => 'Sistem ventilasi tambang bawah tanah',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Dokumen apa yang wajib dimiliki sebelum melakukan kegiatan penambangan secara legal di Indonesia?',
      'pilihan_a' => 'Izin Usaha Pertambangan (IUP)',
      'pilihan_b' => 'Surat Izin Mengemudi',
      'pilihan_c' => 'Akta Pendirian Perusahaan saja',
      'pilihan_d' => 'Sertifikat ISO 9001',
      'jawaban_benar' => 'a',
    ],
    [
      'pertanyaan' => 'Apa fungsi utama dari sistem ventilasi pada tambang bawah tanah?',
      'pilihan_a' => 'Mempercepat proses penggalian',
      'pilihan_b' => 'Mengatur suhu ruangan kantor',
      'pilihan_c' => 'Menyediakan udara segar dan membuang gas berbahaya',
      'pilihan_d' => 'Menerangi area tambang',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Batu bara yang memiliki kandungan karbon tertinggi dan kualitas terbaik disebut?',
      'pilihan_a' => 'Lignit',
      'pilihan_b' => 'Antrasit',
      'pilihan_c' => 'Sub-bituminus',
      'pilihan_d' => 'Gambut',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan istilah "reklamasi" dalam industri pertambangan?',
      'pilihan_a' => 'Proses penambangan baru',
      'pilihan_b' => 'Pemulihan kondisi lahan bekas tambang',
      'pilihan_c' => 'Proses pengeboran sumur',
      'pilihan_d' => 'Pengangkutan hasil tambang',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Gas berbahaya yang sering ditemukan di tambang bawah tanah dan mudah terbakar adalah?',
      'pilihan_a' => 'Oksigen',
      'pilihan_b' => 'Nitrogen',
      'pilihan_c' => 'Metana',
      'pilihan_d' => 'Karbon dioksida murni',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan "energi terbarukan"?',
      'pilihan_a' => 'Energi dari minyak bumi',
      'pilihan_b' => 'Energi dari batu bara',
      'pilihan_c' => 'Energi yang sumbernya dapat diperbarui secara alami',
      'pilihan_d' => 'Energi dari gas alam',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Alat berat yang umum digunakan untuk mengangkut material hasil tambang dalam jumlah besar adalah?',
      'pilihan_a' => 'Excavator',
      'pilihan_b' => 'Dump truck',
      'pilihan_c' => 'Forklift',
      'pilihan_d' => 'Crane menara',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa tujuan utama dilakukannya studi AMDAL sebelum proyek pertambangan dimulai?',
      'pilihan_a' => 'Menentukan harga jual hasil tambang',
      'pilihan_b' => 'Menilai dampak lingkungan dari kegiatan pertambangan',
      'pilihan_c' => 'Menghitung gaji karyawan',
      'pilihan_d' => 'Menentukan lokasi kantor pusat',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Proses pemisahan mineral berharga dari bijih mentah disebut?',
      'pilihan_a' => 'Eksplorasi',
      'pilihan_b' => 'Reklamasi',
      'pilihan_c' => 'Pengolahan/benefisiasi mineral',
      'pilihan_d' => 'Konstruksi',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Apa kepanjangan dari SOP yang sering digunakan dalam prosedur kerja tambang?',
      'pilihan_a' => 'Standard Operating Procedure',
      'pilihan_b' => 'System of Production',
      'pilihan_c' => 'Safety Operation Plan',
      'pilihan_d' => 'Site Operation Permit',
      'jawaban_benar' => 'a',
    ],
    [
      'pertanyaan' => 'Tahapan pertama dalam siklus kegiatan pertambangan adalah?',
      'pilihan_a' => 'Penambangan',
      'pilihan_b' => 'Eksplorasi',
      'pilihan_c' => 'Reklamasi',
      'pilihan_d' => 'Pengolahan',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan "Sustainability" dalam konteks industri energi modern?',
      'pilihan_a' => 'Kecepatan produksi maksimal',
      'pilihan_b' => 'Keberlanjutan operasi yang memperhatikan aspek lingkungan, sosial, dan ekonomi jangka panjang',
      'pilihan_c' => 'Jumlah karyawan yang banyak',
      'pilihan_d' => 'Lokasi tambang yang strategis',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa fungsi utama "Safety Induction" bagi karyawan baru di area tambang?',
      'pilihan_a' => 'Memberikan pelatihan microsoft excel',
      'pilihan_b' => 'Mengenalkan budaya perusahaan saja',
      'pilihan_c' => 'Memberikan pemahaman dasar tentang risiko dan prosedur keselamatan kerja',
      'pilihan_d' => 'Menentukan gaji karyawan',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Apa nama alat yang digunakan untuk mengukur kualitas udara di area tambang bawah tanah?',
      'pilihan_a' => 'Barometer',
      'pilihan_b' => 'Gas detector',
      'pilihan_c' => 'Hygrometer',
      'pilihan_d' => 'Anemometer',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan "stripping ratio" dalam tambang terbuka?',
      'pilihan_a' => 'Rasio antara volume overburden dengan volume bijih yang ditambang',
      'pilihan_b' => 'Rasio gaji karyawan',
      'pilihan_c' => 'Kecepatan alat berat',
      'pilihan_d' => 'Jumlah pekerja per shift',
      'jawaban_benar' => 'a',
    ],
    [
      'pertanyaan' => 'Manakah yang termasuk sumber energi fosil?',
      'pilihan_a' => 'Energi surya',
      'pilihan_b' => 'Energi angin',
      'pilihan_c' => 'Batu bara dan minyak bumi',
      'pilihan_d' => 'Energi panas bumi',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Apa istilah untuk kecelakaan kerja yang menyebabkan kehilangan hari kerja?',
      'pilihan_a' => 'Near miss',
      'pilihan_b' => 'Lost time injury (LTI)',
      'pilihan_c' => 'Safety briefing',
      'pilihan_d' => 'Toolbox meeting',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa peran seorang Mining Engineer dalam proyek pertambangan?',
      'pilihan_a' => 'Mengelola keuangan perusahaan',
      'pilihan_b' => 'Merancang dan mengawasi proses penambangan agar efisien dan aman',
      'pilihan_c' => 'Memasarkan hasil tambang',
      'pilihan_d' => 'Mengurus perizinan tenaga kerja asing',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Apa yang dimaksud dengan "blasting" dalam kegiatan pertambangan?',
      'pilihan_a' => 'Proses pengeboran ringan',
      'pilihan_b' => 'Kegiatan peledakan untuk memecah batuan/material tambang',
      'pilihan_c' => 'Proses pendinginan alat berat',
      'pilihan_d' => 'Pengangkutan hasil tambang ke pelabuhan',
      'jawaban_benar' => 'b',
    ],
    [
      'pertanyaan' => 'Manakah yang merupakan contoh Pembangkit Listrik Tenaga Energi Baru Terbarukan (EBT)?',
      'pilihan_a' => 'PLTU Batu Bara',
      'pilihan_b' => 'PLTD',
      'pilihan_c' => 'PLTS (Pembangkit Listrik Tenaga Surya)',
      'pilihan_d' => 'PLTG',
      'jawaban_benar' => 'c',
    ],
    [
      'pertanyaan' => 'Apa kepanjangan dari ESDM, kementerian yang mengatur sektor pertambangan di Indonesia?',
      'pilihan_a' => 'Energi dan Sumber Daya Mineral',
      'pilihan_b' => 'Ekonomi dan Sumber Daya Manusia',
      'pilihan_c' => 'Eksplorasi Sumber Daya Mineral',
      'pilihan_d' => 'Energi Strategis dan Distribusi Mineral',
      'jawaban_benar' => 'a',
    ],
    [
      'pertanyaan' => 'Apa tujuan dilakukannya "toolbox meeting" sebelum memulai pekerjaan di tambang?',
      'pilihan_a' => 'Membahas gaji karyawan',
      'pilihan_b' => 'Briefing singkat terkait potensi bahaya dan rencana kerja hari itu',
      'pilihan_c' => 'Rapat evaluasi tahunan',
      'pilihan_d' => 'Pelatihan komputer',
      'jawaban_benar' => 'b',
    ],
  ];

  public function definition(): array
  {
    // Pilih satu soal acak dari bank tematik, tes_id diisi oleh seeder
    return $this->faker->randomElement(self::BANK_SOAL);
  }
}
