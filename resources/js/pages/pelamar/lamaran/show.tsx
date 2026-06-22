import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Timeline } from '@/components/pelamar/timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
    deskripsi: string | null;
};

type HasilTes = {
    nilai: string;
};

type Lamaran = {
    id: number;
    status: string;
    status_label: string;
    created_at: string;
    lowongan: Lowongan;
    hasil_tes: HasilTes | null;
};

type PageProps = {
    auth: Auth;
    lamaran: Lamaran;
};

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function LamaranShow() {
    const { lamaran } = usePage<PageProps>().props;

    return (
        <div className="space-y-6 p-6">
            <Head title={`Lamaran - ${lamaran.lowongan.judul}`} />

            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href="/lamaran">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar lamaran
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                {lamaran.lowongan.judul}
                            </CardTitle>
                            <CardDescription>
                                Dilamar pada {formatTanggal(lamaran.created_at)}
                            </CardDescription>
                        </div>
                        <Badge>{lamaran.status_label}</Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="pt-2">
                        <Timeline
                            statusLamaran={lamaran.status}
                            lamaranId={lamaran.id}
                        />
                    </div>

                    {lamaran.hasil_tes && (
                        <div className="rounded-md border p-4">
                            <h3 className="mb-1 text-sm font-medium">
                                Hasil Tes Teknis
                            </h3>
                            <p className="text-2xl font-bold">
                                {parseFloat(lamaran.hasil_tes.nilai).toFixed(1)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {' '}
                                    / 100
                                </span>
                            </p>
                        </div>
                    )}

                    {lamaran.status === 'diterima' && (
                        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                            Selamat! Anda dinyatakan diterima. Tim HRD akan
                            menghubungi Anda untuk proses selanjutnya.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
