import { useState } from 'react';

type OcrKtpData = {
    nik: string | null;
    nama: string | null;
    tempat_lahir: string | null;
    tgl_lahir: string | null;
    jenis_kelamin: 'L' | 'P' | null;
    alamat: string | null;
};

type OcrKtpResult = {
    success: boolean;
    message: string | null;
    data: OcrKtpData | null;
};

type UseOcrKtpReturn = {
    isProcessing: boolean;
    error: string | null;
    data: OcrKtpData | null;
    fotoPreview: string | null;
    prosesFoto: (file: File) => Promise<OcrKtpResult>;
    reset: () => void;
};

/**
 * Hook untuk upload foto KTP dan memproses OCR lewat endpoint /ocr-ktp.
 * Mengembalikan data hasil bacaan yang dapat dipakai mengisi form register
 * secara otomatis, sekaligus tetap dapat dikoreksi manual oleh pelamar.
 */
export function useOcrKtp(): UseOcrKtpReturn {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<OcrKtpData | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Gagal membaca file'));
            reader.readAsDataURL(file);
        });
    };

    const prosesFoto = async (file: File): Promise<OcrKtpResult> => {
        setIsProcessing(true);
        setError(null);

        try {
            const base64 = await fileToBase64(file);
            setFotoPreview(base64);

            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            const response = await fetch('/ocr-ktp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                },
                body: JSON.stringify({ foto: base64 }),
            });

            const result: OcrKtpResult = await response.json();

            if (!result.success) {
                setError(
                    result.message ?? 'Gagal membaca KTP. Silakan coba lagi.',
                );
                setData(result.data ?? null);
                setIsProcessing(false);
                return result;
            }

            setData(result.data);
            setIsProcessing(false);
            return result;
        } catch (err) {
            const message =
                'Terjadi kesalahan saat memproses foto. Periksa koneksi internet Anda.';
            setError(message);
            setIsProcessing(false);
            return { success: false, message, data: null };
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setFotoPreview(null);
        setIsProcessing(false);
    };

    return { isProcessing, error, data, fotoPreview, prosesFoto, reset };
}
