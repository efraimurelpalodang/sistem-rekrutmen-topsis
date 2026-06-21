import { Head, Link, usePage } from '@inertiajs/react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
};

type Lamaran = {
    id: number;
    status: string;
    status_label: string;
    created_at: string;
    lowongan: Lowongan;
};

type PageProps = {
    auth: Auth;
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

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function LamaranIndex() {
    const { lamarans } = usePage<PageProps>().props;

    return (
        <div className="space-y-4 p-6">
            <Head title="Lamaran Saya" />

            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke dashboard
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Lamaran Saya</CardTitle>
                    <CardDescription>
                        Pantau status lamaran pekerjaan yang telah Anda kirim
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lamarans.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Anda belum mengirim lamaran apapun.
                            </p>
                            <Link
                                href="/karir"
                                className="mt-2 inline-block text-sm text-primary hover:underline"
                            >
                                Lihat lowongan yang tersedia
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lowongan</TableHead>
                                        <TableHead className="w-40">
                                            Tanggal Melamar
                                        </TableHead>
                                        <TableHead className="w-48">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lamarans.map((lamaran) => (
                                        <TableRow key={lamaran.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/lamaran/${lamaran.id}`}
                                                    className="hover:underline"
                                                >
                                                    {lamaran.lowongan.judul}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatTanggal(
                                                    lamaran.created_at,
                                                )}
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

LamaranIndex.layout = {
    breadcrumbs: [
        {
            title: 'Lamaran Saya',
        },
    ],
};