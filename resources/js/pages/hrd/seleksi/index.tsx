import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Eye, X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
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
import { useState } from 'react';
import type { Auth } from '@/types';

type PelamarProfile = {
    pendidikan: string;
    institusi: string | null;
    nilai_akademik: string | null;
};

type Pengguna = {
    id: number;
    nama: string;
    email: string;
    pelamar_profile: PelamarProfile | null;
};

type Lamaran = {
    id: number;
    status: string;
    status_label: string;
    pengguna: Pengguna;
};

type Lowongan = {
    id: number;
    judul: string;
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
    lamarans: Lamaran[];
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
    menunggu: 'secondary',
    lolos_admin: 'default',
    gagal_admin: 'destructive',
    menunggu_tes: 'default',
    selesai_tes: 'default',
    diterima: 'default',
    ditolak: 'destructive',
};

export default function SeleksiIndex() {
    const { lowongan, lamarans } = usePage<PageProps>().props;

    const [lamaranToReject, setLamaranToReject] = useState<Lamaran | null>(
        null,
    );

    const handleLoloskan = (id: number) => {
        router.patch(`/seleksi/${id}/lolos`, {}, { preserveScroll: true });
    };

    const handleTolak = () => {
        if (!lamaranToReject) return;

        router.patch(
            `/seleksi/${lamaranToReject.id}/tolak`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLamaranToReject(null),
            },
        );
    };

    const menunggu = lamarans.filter((l) => l.status === 'menunggu');
    const sudahDiproses = lamarans.filter((l) => l.status !== 'menunggu');

    return (
        <div className="p-6">
            <Head title={`Seleksi - ${lowongan.judul}`} />

            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
                <Link href={`/lowongan/${lowongan.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke detail lowongan
                </Link>
            </Button>

            <CardHeader className="px-0">
                <CardTitle className="text-xl">Seleksi Administrasi</CardTitle>
                <CardDescription>
                    Review berkas pelamar untuk lowongan{' '}
                    <span className="font-medium">{lowongan.judul}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-0">
                <div>
                    <h3 className="mb-2 text-sm font-medium">
                        Menunggu Review ({menunggu.length})
                    </h3>
                    {menunggu.length === 0 ? (
                        <p className="py-4 text-sm text-muted-foreground">
                            Tidak ada pelamar yang menunggu review.
                        </p>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Pendidikan</TableHead>
                                        <TableHead>Institusi</TableHead>
                                        <TableHead className="w-28">
                                            Nilai
                                        </TableHead>
                                        <TableHead className="w-44 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menunggu.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                {lamaran.pengguna.nama}
                                            </TableCell>
                                            <TableCell>
                                                {lamaran.pengguna
                                                    .pelamar_profile
                                                    ?.pendidikan ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {lamaran.pengguna
                                                    .pelamar_profile
                                                    ?.institusi ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {lamaran.pengguna
                                                    .pelamar_profile
                                                    ?.nilai_akademik ?? '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/seleksi/${lowongan.id}/${lamaran.id}`}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-green-600 hover:text-green-700"
                                                        onClick={() =>
                                                            handleLoloskan(
                                                                lamaran.id,
                                                            )
                                                        }
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            setTimeout(
                                                                () =>
                                                                    setLamaranToReject(
                                                                        lamaran,
                                                                    ),
                                                                0,
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {sudahDiproses.length > 0 && (
                    <div>
                        <h3 className="mb-2 text-sm font-medium">
                            Sudah Diproses ({sudahDiproses.length})
                        </h3>
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
                                    {sudahDiproses.map((lamaran) => (
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
                    </div>
                )}
            </CardContent>

            <AlertDialog
                open={lamaranToReject !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setLamaranToReject(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Tolak lamaran {lamaranToReject?.pengguna.nama}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Pelamar akan ditandai gagal pada tahap seleksi
                            administrasi dan tidak dapat melanjutkan ke tahap
                            tes teknis.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                if (
                                    document.activeElement instanceof
                                    HTMLElement
                                ) {
                                    document.activeElement.blur();
                                }
                            }}
                        >
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleTolak}>
                            Ya, Tolak
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

SeleksiIndex.layout = {
    breadcrumbs: [
        {
            title: 'Seleksi Administrasi',
        },
    ],
};