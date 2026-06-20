import { Head, Link, router, usePage } from '@inertiajs/react';
import { ClipboardCheck, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Auth, BreadcrumbItem } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
    kuota: number;
    status: 'aktif' | 'ditutup';
    tgl_buka: string;
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
        month: 'short',
        year: 'numeric',
    });
}

export default function LowonganIndex() {
    const { lowongans } = usePage<PageProps>().props;

    // Satu state tunggal untuk lowongan yang sedang dipilih untuk dihapus.
    // null = dialog tertutup, ada isinya = dialog terbuka untuk lowongan tsb.
    const [lowonganToDelete, setLowonganToDelete] = useState<Lowongan | null>(
        null,
    );

    const handleToggle = (id: number) => {
        router.patch(`/lowongan/${id}/toggle`, {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (!lowonganToDelete) return;

        router.delete(`/lowongan/${lowonganToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setLowonganToDelete(null),
        });
    };

    return (
        <div className="p-6">
            <Head title="Daftar Lowongan" />

            <CardHeader className="px-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            Daftar Lowongan
                        </CardTitle>
                        <CardDescription>
                            Kelola lowongan pekerjaan yang Anda buat
                        </CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/lowongan/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Buat Lowongan
                        </Link>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {lowongans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground">
                            Belum ada lowongan yang dibuat.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/lowongan/create">
                                Buat Lowongan Pertama
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead className="w-24">
                                        Kuota
                                    </TableHead>
                                    <TableHead className="w-28">
                                        Pelamar
                                    </TableHead>
                                    <TableHead className="w-40">
                                        Periode
                                    </TableHead>
                                    <TableHead className="w-28">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-40">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowongans.map((lowongan) => (
                                    <TableRow key={lowongan.id}>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/lowongan/${lowongan.id}`}
                                                className="hover:underline"
                                            >
                                                {lowongan.judul}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{lowongan.kuota}</TableCell>
                                        <TableCell>
                                            {lowongan.lamarans_count}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatTanggal(lowongan.tgl_buka)} —{' '}
                                            {formatTanggal(lowongan.tgl_tutup)}
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                {lowongan.status ===
                                                    'ditutup' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/seleksi/${lowongan.id}`}
                                                        >
                                                            <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
                                                            Seleksi
                                                        </Link>
                                                    </Button>
                                                )}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/lowongan/${lowongan.id}`}
                                                            >
                                                                Lihat Detail
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/lowongan/${lowongan.id}/edit`}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleToggle(
                                                                    lowongan.id,
                                                                )
                                                            }
                                                        >
                                                            {lowongan.status ===
                                                            'aktif'
                                                                ? 'Tutup Lowongan'
                                                                : 'Buka Lowongan'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            variant="destructive"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                // Tunda sampai DropdownMenu selesai unmount
                                                                // dan mengembalikan fokus, baru buka AlertDialog.
                                                                // Mencegah konflik aria-hidden/fokus antar Radix portal.
                                                                setTimeout(
                                                                    () => {
                                                                        setLowonganToDelete(
                                                                            lowongan,
                                                                        );
                                                                    },
                                                                    0,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus Lowongan
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Satu AlertDialog tunggal di luar .map(), controlled lewat state */}
            <AlertDialog
                open={lowonganToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        // Lepas fokus dari elemen aktif sebelum unmount,
                        // mencegah warning aria-hidden akibat fokus nyangkut
                        // di tombol trigger saat dialog menutup.
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setLowonganToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus lowongan &quot;{lowonganToDelete?.judul}
                            &quot;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {lowonganToDelete &&
                            lowonganToDelete.lamarans_count > 0
                                ? `Lowongan ini sudah memiliki ${lowonganToDelete.lamarans_count} pelamar dan tidak dapat dihapus. Gunakan opsi "Tutup Lowongan" sebagai gantinya.`
                                : 'Tindakan ini tidak dapat dibatalkan. Lowongan akan dihapus secara permanen.'}
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
                        {lowonganToDelete &&
                            lowonganToDelete.lamarans_count === 0 && (
                                <AlertDialogAction onClick={handleDelete}>
                                    Ya, Hapus
                                </AlertDialogAction>
                            )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
