import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Download,
} from 'lucide-react';
import { Fragment, useState } from 'react';
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

type Lamaran = {
    id: number;
    status: string;
    pengguna: Pengguna;
};

type Kriteria = {
    id: number;
    nama: string;
    tipe: 'benefit' | 'cost';
};

type DetailTopsis = {
    id: number;
    nilai_asli: string;
    nilai_normalisasi: string;
    nilai_terbobot: string;
    kriteria: Kriteria;
};

type HasilTopsis = {
    id: number;
    skor: string;
    ranking: number;
    lamaran: Lamaran;
    detail_topsis: DetailTopsis[];
};

type Lowongan = {
    id: number;
    judul: string;
    kuota: number;
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
    rankings: HasilTopsis[];
    jumlahSelesaiTes: number;
    belumCukupData: boolean;
};

export default function TopsisHasil() {
    const { lowongan, rankings, jumlahSelesaiTes, belumCukupData } =
        usePage<PageProps>().props;

    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleTerima = (hasilId: number) => {
        router.patch(`/topsis/${hasilId}/terima`, {}, { preserveScroll: true });
    };

    const handleTolak = (hasilId: number) => {
        router.patch(`/topsis/${hasilId}/tolak`, {}, { preserveScroll: true });
    };

    return (
        <div className="space-y-6 p-6">
            <Head title={`Hasil TOPSIS - ${lowongan.judul}`} />

            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href={`/lowongan/${lowongan.id}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke detail lowongan
                    </Link>
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/topsis/${lowongan.id}/keputusan`}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Ringkasan Keputusan
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={`/topsis/${lowongan.id}/export-hasil-pdf`}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </a>
                    </Button>
                </div>
            </div>

            <CardHeader>
                <CardTitle className="text-xl">
                    Hasil Perhitungan TOPSIS
                </CardTitle>
                <CardDescription>
                    {lowongan.judul} · Kuota {lowongan.kuota} orang ·{' '}
                    {jumlahSelesaiTes} pelamar selesai tes
                </CardDescription>
            </CardHeader>

            <CardContent>
                {belumCukupData ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Perhitungan TOPSIS membutuhkan minimal 2 pelamar
                            yang sudah menyelesaikan tes teknis.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Saat ini baru {jumlahSelesaiTes} pelamar yang
                            selesai tes.
                        </p>
                    </div>
                ) : rankings.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Belum ada hasil perhitungan.
                    </p>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">
                                        Ranking
                                    </TableHead>
                                    <TableHead>Nama Pelamar</TableHead>
                                    <TableHead className="w-32">
                                        Skor (C)
                                    </TableHead>
                                    <TableHead className="w-32 text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-20"></TableHead>
                                    <TableHead className="w-48 text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankings.map((hasil) => (
                                    <Fragment key={hasil.id}>
                                        <TableRow key={hasil.id}>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        hasil.ranking <=
                                                        lowongan.kuota
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    #{hasil.ranking}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hasil.lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {parseFloat(hasil.skor).toFixed(
                                                    4,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        hasil.lamaran.status ===
                                                        'diterima'
                                                            ? 'default'
                                                            : hasil.lamaran
                                                                    .status ===
                                                                'ditolak'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {hasil.lamaran.status ===
                                                    'diterima'
                                                        ? 'Diterima'
                                                        : hasil.lamaran
                                                                .status ===
                                                            'ditolak'
                                                          ? 'Ditolak'
                                                          : 'Belum diputuskan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setExpandedId(
                                                            expandedId ===
                                                                hasil.id
                                                                ? null
                                                                : hasil.id,
                                                        )
                                                    }
                                                >
                                                    {expandedId === hasil.id ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {hasil.lamaran.status ===
                                                    'selesai_tes' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleTerima(
                                                                    hasil.id,
                                                                )
                                                            }
                                                        >
                                                            Terima
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleTolak(
                                                                    hasil.id,
                                                                )
                                                            }
                                                        >
                                                            Tolak
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedId === hasil.id && (
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <div className="rounded-md bg-muted/30 p-4">
                                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                                            Detail Perhitungan
                                                        </p>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>
                                                                        Kriteria
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Tipe
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Nilai
                                                                        Asli
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Normalisasi
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Terbobot
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {hasil.detail_topsis.map(
                                                                    (
                                                                        detail,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                detail.id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {
                                                                                    detail
                                                                                        .kriteria
                                                                                        .nama
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Badge variant="outline">
                                                                                    {
                                                                                        detail
                                                                                            .kriteria
                                                                                            .tipe
                                                                                    }
                                                                                </Badge>
                                                                            </TableCell>
                                                                            <TableCell className="font-mono">
                                                                                {
                                                                                    detail.nilai_asli
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell className="font-mono">
                                                                                {parseFloat(
                                                                                    detail.nilai_normalisasi,
                                                                                ).toFixed(
                                                                                    4,
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell className="font-mono">
                                                                                {parseFloat(
                                                                                    detail.nilai_terbobot,
                                                                                ).toFixed(
                                                                                    4,
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </div>
    );
}
