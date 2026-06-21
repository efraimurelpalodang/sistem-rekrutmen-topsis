import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
    deskripsi: string | null;
    kualifikasi: string | null;
    kuota: number;
    tgl_buka: string;
    tgl_tutup: string;
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
    sudahMelamar: boolean;
};

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function KarirShow() {
    const { auth, lowongan, sudahMelamar } = usePage<PageProps>().props;

    const handleLamar = () => {
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        router.post(`/lamaran/${lowongan.id}`, {});
    };

    const renderTombolLamar = () => {
        if (!auth.user) {
            return (
                <Button onClick={handleLamar} size="lg">
                    Login untuk Melamar
                </Button>
            );
        }

        if (auth.user.role !== 'pelamar') {
            return null;
        }

        if (sudahMelamar) {
            return (
                <Button disabled size="lg" variant="secondary">
                    Anda Sudah Melamar
                </Button>
            );
        }

        return (
            <Button onClick={handleLamar} size="lg">
                Lamar Sekarang
            </Button>
        );
    };

    return (
        <div className="min-h-5 bg-background">
            <Head title={lowongan.judul} />

            <div className="mx-auto max-w-5xl px-6 pt-5">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-4 -ml-2"
                >
                    <Link href="/karir">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke daftar lowongan
                    </Link>
                </Button>

                <CardHeader>
                    <div className="flex items-start justify-between gap-4 my-4">
                        <div>
                            <CardTitle className="text-2xl capitalize">
                                {lowongan.judul}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Kuota {lowongan.kuota} orang · Dibuka{' '}
                                {formatTanggal(lowongan.tgl_buka)} — Ditutup{' '}
                                {formatTanggal(lowongan.tgl_tutup)}
                            </CardDescription>
                        </div>
                        <Badge>Aktif</Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {lowongan.deskripsi && (
                        <div>
                            <h3 className="mb-2 font-medium">
                                Deskripsi Pekerjaan
                            </h3>
                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                {lowongan.deskripsi}
                            </p>
                        </div>
                    )}

                    {lowongan.kualifikasi && (
                        <div>
                            <h3 className="mb-2 font-medium">Kualifikasi</h3>
                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                {lowongan.kualifikasi}
                            </p>
                        </div>
                    )}

                    {/* <Separator /> */}

                    <div className="flex justify-center pt-2">
                        {renderTombolLamar()}
                    </div>
                </CardContent>
            </div>
        </div>
    );
}
