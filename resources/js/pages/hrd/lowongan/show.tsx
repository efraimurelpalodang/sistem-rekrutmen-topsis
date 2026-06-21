import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

type Pengguna = {
    id: number;
    nama: string;
    email: string;
};

type Lamaran = {
    id: number;
    status: string;
    status_label: string;
    pengguna: Pengguna;
};

type TesTeknis = {
    id: number;
    durasi_menit: number;
    jumlah_soal: number;
};

type Lowongan = {
    id: number;
    judul: string;
    deskripsi: string | null;
    kualifikasi: string | null;
    kuota: number;
    status: 'aktif' | 'ditutup';
    tgl_buka: string;
    tgl_tutup: string;
    lamarans: Lamaran[];
    tes_teknis: TesTeknis | null;
};

type PageProps = {
    lowongan: Lowongan;
};

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    menunggu: 'secondary',
    lolos_admin: 'default',
    gagal_admin: 'destructive',
    menunggu_tes: 'default',
    selesai_tes: 'default',
    diterima: 'default',
    ditolak: 'destructive',
};

export default function LowonganShow() {
    const { lowongan } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Lowongan', href: '/lowongan' },
        { title: lowongan.judul, href: `/lowongan/${lowongan.id}` },
    ];

    return (
        <div className="space-y-6 p-6">
            <Head title={lowongan.judul} />
            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href="/lowongan">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar lowongan
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-xl">
                                    {lowongan.judul}
                                </CardTitle>
                                <Badge
                                    variant={
                                        lowongan.status === 'aktif'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {lowongan.status === 'aktif'
                                        ? 'Aktif'
                                        : 'Ditutup'}
                                </Badge>
                            </div>
                            <CardDescription>
                                Periode: {formatTanggal(lowongan.tgl_buka)} —{' '}
                                {formatTanggal(lowongan.tgl_tutup)} · Kuota:{' '}
                                {lowongan.kuota} orang
                            </CardDescription>
                        </div>
                        {lowongan.status === 'aktif' && (
                            <Button variant="outline" asChild>
                                <Link href={`/lowongan/${lowongan.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {lowongan.deskripsi && (
                        <div>
                            <h3 className="mb-1 text-sm font-medium">
                                Deskripsi Pekerjaan
                            </h3>
                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                {lowongan.deskripsi}
                            </p>
                        </div>
                    )}

                    {lowongan.kualifikasi && (
                        <div>
                            <h3 className="mb-1 text-sm font-medium">
                                Kualifikasi
                            </h3>
                            <p className="text-sm whitespace-pre-line text-muted-foreground">
                                {lowongan.kualifikasi}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium">Tes Teknis</h3>
                            {lowongan.tes_teknis ? (
                                <p className="text-sm text-muted-foreground">
                                    {lowongan.tes_teknis.jumlah_soal} soal ·{' '}
                                    {lowongan.tes_teknis.durasi_menit} menit
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum dibuat
                                </p>
                            )}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={
                                    lowongan.tes_teknis
                                        ? `/lowongan/${lowongan.id}/tes/soal`
                                        : `/lowongan/${lowongan.id}/tes/create`
                                }
                            >
                                {lowongan.tes_teknis
                                    ? 'Kelola Soal'
                                    : 'Buat Tes Teknis'}
                            </Link>
                        </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium">
                                Hasil TOPSIS
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Lihat ranking pelamar berdasarkan perhitungan
                                TOPSIS
                            </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/topsis/${lowongan.id}/hasil`}>
                                Lihat Hasil
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Daftar Pelamar ({lowongan.lamarans.length})
                    </CardTitle>
                    <CardDescription>
                        Pelamar yang telah mengirimkan lamaran ke lowongan ini
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lowongan.lamarans.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Belum ada pelamar untuk lowongan ini.
                        </p>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="w-48">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lowongan.lamarans.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                {lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {lamaran.pengguna.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            lamaran.status
                                                        ] ?? 'secondary'
                                                    }
                                                >
                                                    {lamaran.status_label}
                                                </Badge>
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

LowonganShow.layout = {
    breadcrumbs: [
        {
            title: 'Detail Lowongan',
        },
    ],
};