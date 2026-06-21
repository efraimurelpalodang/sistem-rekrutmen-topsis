import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    kuota: number;
    tgl_tutup: string;
    lamarans_count: number;
};

type PageProps = {
    auth: Auth;
    lowongans: Lowongan[];
};

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function KarirIndex() {
    const { lowongans } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-background">
            <Head title="Karir" />

            <div className="border-b">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bergabung Bersama Kami
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Temukan peluang karir di bidang energi dan pertambangan
                        yang sesuai dengan keahlian Anda.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-4 px-6 py-8">
                {lowongans.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">
                        Belum ada lowongan yang dibuka saat ini.
                    </p>
                ) : (
                    lowongans.map((lowongan) => (
                        <Link key={lowongan.id} href={`/karir/${lowongan.id}`}>
                            <Card className="transition-colors hover:border-foreground/20">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {lowongan.judul}
                                            </CardTitle>
                                            <CardDescription className="mt-1 line-clamp-2">
                                                {lowongan.deskripsi}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">Aktif</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="h-3.5 w-3.5" />
                                            Kuota {lowongan.kuota} orang
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3.5 w-3.5" />
                                            {lowongan.lamarans_count} pelamar
                                        </span>
                                        <span>
                                            Tutup{' '}
                                            {formatTanggal(lowongan.tgl_tutup)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
