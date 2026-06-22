import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TimelineStepStatus = 'selesai' | 'aktif' | 'gagal' | 'menunggu';

type TimelineStep = {
    label: string;
    keterangan: string;
    status: TimelineStepStatus;
};

type TimelineProps = {
    statusLamaran: string;
    lamaranId: number;
};

/**
 * Ambang batas eksplisit: box ke berapa (index di array steps) yang
 * dianggap "selesai" untuk setiap status database. Status menunggu_tes
 * sengaja membuat box index 2 (Menunggu Tes Dibuka) selesai SEKALIGUS
 * box index 3 (Tes Teknis) jadi aktif, karena keduanya merepresentasikan
 * transisi yang sama dari satu status menunggu_tes.
 */
const AMBANG_BATAS_SELESAI: Record<string, number> = {
    menunggu: -1, // belum ada box yang selesai, box 0 baru aktif
    lolos_admin: 1, // box 0-1 selesai, box 2 aktif
    menunggu_tes: 2, // box 0-2 selesai, box 3 aktif
    selesai_tes: 3, // box 0-3 selesai, box 4 aktif
    diterima: 4, // semua box selesai
    ditolak: 3, // box 0-3 selesai, box 4 gagal
    gagal_admin: 0, // box 0 selesai, box 1 gagal
};

function buildSteps(status: string): TimelineStep[] {
    const gagalAdmin = status === 'gagal_admin';
    const ditolak = status === 'ditolak';
    const batasSelesai = AMBANG_BATAS_SELESAI[status] ?? -1;

    const steps: TimelineStep[] = [
        {
            label: 'Lamaran Diterima',
            keterangan:
                'Lamaran Anda telah berhasil dikirim dan diterima sistem.',
            status: 'menunggu',
        },
        {
            label: 'Seleksi Berkas',
            keterangan: gagalAdmin
                ? 'Berkas lamaran tidak memenuhi kualifikasi yang dibutuhkan.'
                : 'Tim HRD meninjau kelengkapan berkas Anda.',
            status: 'menunggu',
        },
        {
            label: 'Menunggu Tes Dibuka',
            keterangan:
                'Anda lolos seleksi berkas. Menunggu HRD membuka akses tes teknis.',
            status: 'menunggu',
        },
        {
            label: 'Tes Teknis',
            keterangan:
                status === 'menunggu_tes'
                    ? 'Tes teknis sudah dapat dikerjakan.'
                    : 'Mengerjakan tes teknis sesuai jadwal yang ditentukan.',
            status: 'menunggu',
        },
        {
            label: 'Hasil Akhir',
            keterangan: ditolak
                ? 'Anda belum berhasil pada proses seleksi kali ini.'
                : status === 'diterima'
                  ? 'Selamat! Anda dinyatakan diterima.'
                  : 'Menunggu keputusan akhir dari tim HRD.',
            status: 'menunggu',
        },
    ];

    return steps.map((step, i) => {
        // Box 2 (Seleksi Berkas) jadi gagal jika gagal_admin
        if (i === 1 && gagalAdmin) {
            return { ...step, status: 'gagal' };
        }

        // Box 5 (Hasil Akhir) jadi gagal jika ditolak
        if (i === 4 && ditolak) {
            return { ...step, status: 'gagal' };
        }

        // Jika gagal di tahap admin, box setelahnya tetap menunggu (alur berhenti)
        if (gagalAdmin && i > 1) {
            return { ...step, status: 'menunggu' };
        }

        if (batasSelesai >= i) {
            return { ...step, status: 'selesai' };
        }
        if (batasSelesai === i - 1) {
            // Box terakhir, kalau statusnya sudah diterima -> selesai, bukan aktif
            const isSelesaiAkhir = status === 'diterima' && i === 4;
            return { ...step, status: isSelesaiAkhir ? 'selesai' : 'aktif' };
        }
        return { ...step, status: 'menunggu' };
    });
}

const STATUS_STYLES: Record<
    TimelineStepStatus,
    { dot: string; line: string; label: string }
> = {
    selesai: {
        dot: 'bg-emerald-500 border-emerald-500 text-white',
        line: 'bg-emerald-500',
        label: 'text-emerald-700 dark:text-emerald-400',
    },
    aktif: {
        dot: 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-950',
        line: 'bg-muted-foreground/20',
        label: 'text-blue-700 dark:text-blue-400',
    },
    gagal: {
        dot: 'bg-rose-500 border-rose-500 text-white',
        line: 'bg-muted-foreground/20',
        label: 'text-rose-700 dark:text-rose-400',
    },
    menunggu: {
        dot: 'bg-background border-muted-foreground/30 text-muted-foreground/50',
        line: 'bg-muted-foreground/20',
        label: 'text-muted-foreground',
    },
};

export function Timeline({ statusLamaran, lamaranId }: TimelineProps) {
    const steps = buildSteps(statusLamaran);

    return (
        <div className="flex flex-col">
            {steps.map((step, index) => {
                const style = STATUS_STYLES[step.status];
                const isLast = index === steps.length - 1;
                // Tombol Mulai Tes muncul khusus di box ke-4 (Tes Teknis)
                // saat status persis menunggu_tes (siap dikerjakan).
                const tampilkanTombolTes =
                    index === 3 && statusLamaran === 'menunggu_tes';

                return (
                    <div key={step.label} className="flex gap-4">
                        {/* Kolom titik + garis vertikal */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                                    style.dot,
                                )}
                            >
                                {step.status === 'selesai' && (
                                    <Check className="h-4 w-4" />
                                )}
                                {step.status === 'gagal' && (
                                    <X className="h-4 w-4" />
                                )}
                                {step.status === 'aktif' && (
                                    <Clock className="h-4 w-4" />
                                )}
                                {step.status === 'menunggu' && (
                                    <span className="text-xs font-medium">
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                            {!isLast && (
                                <div
                                    className={cn(
                                        'my-1 min-h-10 w-0.5 flex-1 rounded-full transition-colors',
                                        style.line,
                                    )}
                                />
                            )}
                        </div>

                        {/* Kolom keterangan */}
                        <div className={cn('pb-8', isLast && 'pb-0')}>
                            <p
                                className={cn(
                                    'mt-1 text-sm font-semibold',
                                    style.label,
                                )}
                            >
                                {step.label}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {step.keterangan}
                            </p>
                            {tampilkanTombolTes && (
                                <Button size="sm" className="mt-3" asChild>
                                    <Link href={`/tes/${lamaranId}`}>
                                        Mulai Tes
                                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
