import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, ChevronRight, ClipboardList, Users } from 'lucide-react';
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
import type { Auth, BreadcrumbItem } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stats = {
    total_lowongan_aktif: number;
    total_pelamar_masuk: number;
    menanti_seleksi: number;
};

type LowonganTerbaru = {
    id: number;
    judul: string;
    status: 'aktif' | 'ditutup';
    tgl_tutup: string;
    kuota: number;
    lamarans_count: number;
};

type PelamarTerbaru = {
    id: number;
    pengguna: { id: number; nama: string };
    lowongan: { id: number; judul: string };
    status: string;
    created_at: string;
};

type PageProps = {
    auth: Auth;
    stats: Stats;
    lowongan_terbaru: LowonganTerbaru[];
    pelamar_terbaru: PelamarTerbaru[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const labelStatus: Record<string, string> = {
    menunggu: 'Menunggu',
    lolos_admin: 'Lolos Admin',
    gagal_admin: 'Gagal Admin',
    menunggu_tes: 'Menunggu Tes',
    selesai_tes: 'Selesai Tes',
    diterima: 'Diterima',
    ditolak: 'Ditolak',
};

const variantStatus: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    menunggu: 'outline',
    lolos_admin: 'secondary',
    gagal_admin: 'destructive',
    menunggu_tes: 'secondary',
    selesai_tes: 'secondary',
    diterima: 'default',
    ditolak: 'destructive',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    icon: Icon,
    href,
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    href: string;
}) {
    return (
        <Link href={href}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/40">
                <CardContent className="flex items-center justify-between pt-6">
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-1 text-3xl font-bold">{value}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardHrd() {
    const { auth, stats, lowongan_terbaru, pelamar_terbaru } =
        usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard HRD" />
            <div className="space-y-6 p-6">
                {/* Greeting */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Selamat datang, {auth.user.nama}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Berikut ringkasan rekrutmen yang sedang berjalan.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Lowongan Aktif"
                        value={stats.total_lowongan_aktif}
                        icon={Briefcase}
                        href="/lowongan"
                    />
                    <StatCard
                        label="Total Pelamar Masuk"
                        value={stats.total_pelamar_masuk}
                        icon={Users}
                        href="/lowongan"
                    />
                    <StatCard
                        label="Menunggu Seleksi Admin"
                        value={stats.menanti_seleksi}
                        icon={ClipboardList}
                        href="/lowongan"
                    />
                </div>

                {/* Lowongan Terbaru */}
                <Card className="rounded-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Lowongan Terbaru
                                </CardTitle>
                                <CardDescription>
                                    5 lowongan yang terakhir dibuat
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/lowongan">
                                    Lihat semua
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-0">
                        {lowongan_terbaru.length === 0 ? (
                            <p className="px-6 pb-6 text-sm text-muted-foreground">
                                Belum ada lowongan. &nbsp;
                                <Link
                                    href="/lowongan/create"
                                    className="underline underline-offset-4"
                                >
                                    Buat sekarang
                                </Link>
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Judul</TableHead>
                                        <TableHead className="w-24">
                                            Pelamar
                                        </TableHead>
                                        <TableHead className="w-24">
                                            Kuota
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Tutup
                                        </TableHead>
                                        <TableHead className="w-24">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lowongan_terbaru.map((l) => (
                                        <TableRow key={l.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/lowongan/${l.id}`}
                                                    className="hover:underline"
                                                >
                                                    {l.judul}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {l.lamarans_count}
                                            </TableCell>
                                            <TableCell>{l.kuota}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatTanggal(l.tgl_tutup)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        l.status === 'aktif'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {l.status === 'aktif'
                                                        ? 'Aktif'
                                                        : 'Ditutup'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/lowongan/${l.id}`}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Pelamar Terbaru */}
                <Card className="rounded-sm">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Pelamar Terbaru
                        </CardTitle>
                        <CardDescription>
                            5 lamaran yang terakhir masuk
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-0">
                        {pelamar_terbaru.length === 0 ? (
                            <p className="px-6 pb-6 text-sm text-muted-foreground">
                                Belum ada pelamar masuk.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Posisi</TableHead>
                                        <TableHead className="w-32">
                                            Tanggal
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Status
                                        </TableHead>
                                        <TableHead className="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pelamar_terbaru.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">
                                                {p.pengguna.nama}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {p.lowongan.judul}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatTanggal(p.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        variantStatus[
                                                            p.status
                                                        ] ?? 'outline'
                                                    }
                                                >
                                                    {labelStatus[p.status] ??
                                                        p.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/seleksi/${p.lowongan.id}/${p.id}`}
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DashboardHrd.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
        },
    ],
};
