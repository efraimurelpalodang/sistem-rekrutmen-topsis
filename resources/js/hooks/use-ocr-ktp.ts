import { useState } from 'react';

type OcrKtpData = {
    nik: string | null;
    nama: string | null;
    tempat_lahir: string | null;
    tgl_lahir: string | null;
    jenis_kelamin: 'L' | 'P' | null;
    alamat: string | null;
};

type UseOcrKtpReturn = {
    isProcessing: boolean;
    progress: number;
    error: string | null;
    data: OcrKtpData | null;
    fotoPreview: string | null;
    prosesFoto: (
        file: File,
    ) => Promise<{ success: boolean; data: OcrKtpData | null }>;
    reset: () => void;
};

/**
 * Hook OCR KTP yang berjalan sepenuhnya di browser memakai Tesseract.js.
 * Tidak memerlukan API key atau biaya apapun. Akurasi bergantung pada
 * kualitas foto; pelamar tetap dapat mengoreksi hasil sebelum submit.
 */
export function useOcrKtp(): UseOcrKtpReturn {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<OcrKtpData | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Gagal membaca file'));
            reader.readAsDataURL(file);
        });
    };

    const cekNikDuplikat = async (nik: string): Promise<boolean> => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch('/cek-nik', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                },
                body: JSON.stringify({ nik }),
            });

            const result = await response.json();
            return result.sudahAda === true;
        } catch {
            // Jika gagal cek (mis. koneksi terputus), jangan blokir alur
            // pendaftaran; validasi unique tetap akan dijalankan ulang
            // oleh backend saat submit form.
            return false;
        }
    };

    const prosesFoto = async (
        file: File,
    ): Promise<{ success: boolean; data: OcrKtpData | null }> => {
        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            const dataUrl = await fileToDataUrl(file);
            setFotoPreview(dataUrl);

            // Import dinamis supaya bundle Tesseract.js (cukup besar)
            // hanya dimuat saat halaman register benar-benar diakses.
            // Catatan: dynamic import mengembalikan module namespace object,
            // export default-nya ada di properti .default.
            const TesseractModule = await import('tesseract.js');
            const Tesseract = TesseractModule.default ?? TesseractModule;

            const result = await Tesseract.recognize(file, 'ind', {
                logger: (info: { status: string; progress: number }) => {
                    if (info.status === 'recognizing text') {
                        setProgress(Math.round(info.progress * 100));
                    }
                },
            });

            const teks = result.data.text;
            const parsed = parseTeksKtp(teks);

            if (!parsed.nik) {
                setError(
                    'NIK tidak dapat terbaca dengan jelas dari foto. Pastikan foto KTP tidak buram, tidak miring, dan pencahayaan cukup, lalu coba lagi.',
                );
                setData(parsed);
                setIsProcessing(false);
                return { success: false, data: parsed };
            }

            const sudahAda = await cekNikDuplikat(parsed.nik);

            if (sudahAda) {
                setError(
                    'NIK ini sudah terdaftar. Jika ini adalah akun Anda, silakan masuk.',
                );
                setData(parsed);
                setIsProcessing(false);
                return { success: false, data: parsed };
            }

            setData(parsed);
            setIsProcessing(false);
            return { success: true, data: parsed };
        } catch (err) {
            console.error('OCR KTP error:', err);
            const message =
                'Terjadi kesalahan saat memindai foto. Silakan coba lagi.';
            setError(message);
            setIsProcessing(false);
            return { success: false, data: null };
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setFotoPreview(null);
        setIsProcessing(false);
        setProgress(0);
    };

    return {
        isProcessing,
        progress,
        error,
        data,
        fotoPreview,
        prosesFoto,
        reset,
    };
}

/**
 * Parsing teks mentah hasil Tesseract OCR menjadi field-field terstruktur,
 * mengikuti pola umum tata letak KTP Indonesia.
 */
function parseTeksKtp(teks: string): OcrKtpData {
    const baris = teks
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);
    const teksGabung = baris.join(' ');

    return {
        nik: cariNik(teksGabung),
        nama: cariNama(baris),
        tempat_lahir: cariTempatLahir(teksGabung),
        tgl_lahir: cariTanggalLahir(teksGabung),
        jenis_kelamin: cariJenisKelamin(teksGabung),
        alamat: cariAlamat(baris),
    };
}

function cariNik(teks: string): string | null {
    // Cari pola "NIK" diikuti 16 digit (boleh ada spasi di antara digit,
    // beberapa hasil OCR memisahkan digit dengan spasi tipis).
    const matchDenganLabel = teks.match(/NIK\s*:?\s*([\d\s]{16,25})/i);
    if (matchDenganLabel) {
        const hanyaAngka = matchDenganLabel[1].replace(/\D/g, '');
        if (hanyaAngka.length === 16) {
            return hanyaAngka;
        }
        // Kadang ada digit nyasar/kurang karena noise OCR, ambil 16 digit pertama
        if (hanyaAngka.length > 16) {
            return hanyaAngka.slice(0, 16);
        }
    }

    // Fallback: cari urutan 16 digit polos di mana saja dalam teks
    const matchPolos = teks.match(/\b(\d{16})\b/);
    if (matchPolos) {
        return matchPolos[1];
    }

    return null;
}

function cariNama(baris: string[]): string | null {
    for (let i = 0; i < baris.length; i++) {
        if (/nama/i.test(baris[i])) {
            const setelahLabel = baris[i].replace(/.*nama\s*:?\s*/i, '').trim();
            if (setelahLabel.length > 2) return setelahLabel;
            if (baris[i + 1]) return baris[i + 1].trim();
        }
    }
    return null;
}

function cariTempatLahir(teks: string): string | null {
    const match = teks.match(/Tempat.{0,15}Lahir\s*:?\s*([A-Za-z\s]+),/i);
    return match ? match[1].trim() : null;
}

function cariTanggalLahir(teks: string): string | null {
    const match = teks.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (!match) return null;
    return `${match[3]}-${match[2]}-${match[1]}`; // konversi ke Y-m-d
}

function cariJenisKelamin(teks: string): 'L' | 'P' | null {
    if (/LAKI[\s-]?LAKI/i.test(teks)) return 'L';
    if (/PEREMPUAN/i.test(teks)) return 'P';
    return null;
}

function cariAlamat(baris: string[]): string | null {
    for (let i = 0; i < baris.length; i++) {
        if (/alamat/i.test(baris[i])) {
            const setelahLabel = baris[i]
                .replace(/.*alamat\s*:?\s*/i, '')
                .trim();
            if (setelahLabel.length > 3) return setelahLabel;
            if (baris[i + 1]) return baris[i + 1].trim();
        }
    }
    return null;
}
