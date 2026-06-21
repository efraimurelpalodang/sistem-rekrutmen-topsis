import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, FileText } from 'lucide-react';
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
import dashboard from '../dashboard';

type Lowongan = {
    id: number;
    judul: string;
};

type Lamaran = {
    id: number;
    status: string;
    status_label: string;
    lowongan: Lowongan;
};

type PageProps = {
    auth: Auth;
    lamaransTerbaru: Lamaran[];
    profilLengkap: boolean;
};

export default function DashboardPelamar() {
    const { auth, lamaransTerbaru, profilLengkap } = usePage<PageProps>().props;

    return (
        <div className="space-y-6 p-6">
            <Head title="Dashboard" />

            <div>
                <h1 className="text-2xl font-semibold">
                    Selamat datang, {auth.user.nama}
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Pantau lamaran dan temukan peluang karir baru di sini.
                </p>
            </div>

            {!profilLengkap && (
                <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm font-medium">
                                Lengkapi profil Anda
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Data pendidikan diperlukan sebelum Anda dapat
                                melamar pekerjaan.
                            </p>
                        </div>
                        <Button asChild size="sm">
                            <Link href="/profil">Lengkapi Sekarang</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link href="/karir">
                    <Card className="h-full transition-colors hover:border-foreground/20">
                        <CardHeader>
                            <Briefcase className="mb-2 h-6 w-6 text-muted-foreground" />
                            <CardTitle className="text-base">
                                Cari Lowongan
                            </CardTitle>
                            <CardDescription>
                                Lihat lowongan pekerjaan yang tersedia saat ini
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/lamaran">
                    <Card className="h-full transition-colors hover:border-foreground/20">
                        <CardHeader>
                            <FileText className="mb-2 h-6 w-6 text-muted-foreground" />
                            <CardTitle className="text-base">
                                Lamaran Saya
                            </CardTitle>
                            <CardDescription>
                                Pantau status seluruh lamaran yang sudah dikirim
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

DashboardPelamar.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
        },
    ],
};