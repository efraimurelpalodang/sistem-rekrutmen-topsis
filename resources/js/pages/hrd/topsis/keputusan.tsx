import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    FileCheck,
    FileX,
    HourglassIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Auth } from '@/types';

type Pengguna = {
    id: number;
    nama: string;
    email: string;
};

type HasilTopsis = {
    id: number;
    skor: string;
    ranking: number;
};

type Lamaran = {
    id: number;
    status: string;
    pengguna: Pengguna;
    hasil_topsis: HasilTopsis | null;
};

type Lowongan = {
    id: number;
    judul: string;
    kuota: number;
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
    diterima: Lamaran[];
    ditolak: Lamaran[];
    belumDiputuskan: Lamaran[];
    totalDinilai: number;
};

function SkorBadge({ skor, ranking }: { skor: string; ranking: number }) {
    return (
        <div className="flex items-center gap-2">
            <Badge variant="secondary">#{ranking}</Badge>
            <span className="font-mono text-sm">
                {parseFloat(skor).toFixed(4)}
            </span>
        </div>
    );
}

export default function TopsisKeputusan() {
    const { lowongan, diterima, ditolak, belumDiputuskan, totalDinilai } =
        usePage<PageProps>().props;

    return (
        <div className="space-y-6 p-6">
            <Head title={`Keputusan Akhir - ${lowongan.judul}`} />

            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href={`/lowongan/${lowongan.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke detail lowongan
                    </Link>
                </Button>

                <Button asChild>
                    <a href={`/topsis/${lowongan.id}/export-keputusan-pdf`}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Laporan
                    </a>
                </Button>
            </div>

            <div>
                <h1 className="text-2xl font-semibold">
                    Keputusan Akhir Rekrutmen
                </h1>
                <p className="mt-1 text-muted-foreground capitalize">
                    {lowongan.judul} - Kuota {lowongan.kuota} orang -{' '}
                    {totalDinilai} pelamar telah dinilai TOPSIS
                </p>
            </div>

            {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                            <FileCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {diterima.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Diterima
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                            <FileX className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {ditolak.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Ditolak
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                            <HourglassIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {belumDiputuskan.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Belum Diputuskan
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div> */}

            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileCheck className="h-5 w-5 text-emerald-600" />
                        Pelamar Diterima
                    </CardTitle>
                    <CardDescription>
                        Pelamar yang dinyatakan diterima berdasarkan hasil
                        TOPSIS dan keputusan HRD
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {diterima.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Belum ada pelamar yang diterima.
                        </p>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-40">
                                            Ranking / Skor
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {diterima.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                {lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {lamaran.pengguna.email}
                                            </TableCell>
                                            <TableCell>
                                                <SkorBadge
                                                    skor={
                                                        lamaran.hasil_topsis
                                                            ?.skor ?? '0'
                                                    }
                                                    ranking={
                                                        lamaran.hasil_topsis
                                                            ?.ranking ?? 0
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HourglassIcon className="h-5 w-5 text-amber-600" />
                        Belum Diputuskan
                    </CardTitle>
                    <CardDescription>
                        Pelamar sudah selesai tes dan dinilai TOPSIS, namun
                        belum ada keputusan akhir dari HRD
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {belumDiputuskan.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Tidak ada pelamar yang menunggu keputusan.
                        </p>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-40">
                                            Ranking / Skor
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {belumDiputuskan.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                {lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {lamaran.pengguna.email}
                                            </TableCell>
                                            <TableCell>
                                                <SkorBadge
                                                    skor={
                                                        lamaran.hasil_topsis
                                                            ?.skor ?? '0'
                                                    }
                                                    ranking={
                                                        lamaran.hasil_topsis
                                                            ?.ranking ?? 0
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {belumDiputuskan.length > 0 && (
                        <div className="mt-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/topsis/${lowongan.id}/hasil`}>
                                    Buka Halaman Hasil TOPSIS untuk Memutuskan
                                </Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileX className="h-5 w-5 text-rose-600" />
                        Pelamar Ditolak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {ditolak.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Belum ada pelamar yang ditolak.
                        </p>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-40">
                                            Ranking / Skor
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ditolak.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                {lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {lamaran.pengguna.email}
                                            </TableCell>
                                            <TableCell>
                                                <SkorBadge
                                                    skor={
                                                        lamaran.hasil_topsis
                                                            ?.skor ?? '0'
                                                    }
                                                    ranking={
                                                        lamaran.hasil_topsis
                                                            ?.ranking ?? 0
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

TopsisKeputusan.layout = {
    breadcrumbs: [
        {
            title: `Keputusan Akhir Rekrutmen`,
        },
    ],
};