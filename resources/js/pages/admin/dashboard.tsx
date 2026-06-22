import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Kriteria {
    id: number;
    nama: string;
    bobot: number | string; // MySQL decimal → JSON string, selalu parse sebelum dipakai
    tipe: 'benefit' | 'cost';
    urutan: number;
}

interface StatistikAdmin {
    total_pelamar: number;
    total_hrd: number;
    lowongan_aktif: number;
    proses_topsis: number; // lowongan yang sudah dihitung TOPSIS tapi belum ditutup
}

interface DashboardAdminProps {
    statistik: StatistikAdmin;
    kriterias: Kriteria[];
    total_bobot: number | string; // hasil sum() di PHP, bisa string saat di-JSON
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Laravel mengirim decimal dari MySQL sebagai string — selalu parse dulu
const toNum = (val: number | string) => parseFloat(val as string);

const persen = (bobot: number | string) =>
    (toNum(bobot) * 100).toFixed(0) + '%';

const formatBobot = (bobot: number | string) => toNum(bobot).toFixed(2);

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: number | string;
    sub?: string;
    accent?: boolean;
}) {
    return (
        <Card className={accent ? 'border-primary/40 bg-primary/5' : ''}>
            <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p
                    className={`mt-1 text-3xl font-semibold tabular-nums ${accent ? 'text-primary' : ''}`}
                >
                    {value}
                </p>
                {sub && (
                    <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
                )}
            </CardContent>
        </Card>
    );
}

function BobotBar({ bobot }: { bobot: number | string }) {
    const pct = Math.min(toNum(bobot) * 100, 100);
    return (
        <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="w-8 text-xs text-muted-foreground tabular-nums">
                {persen(bobot)}
            </span>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function DashboardAdmin() {
    const { auth, statistik, kriterias, total_bobot } = usePage<{
        auth: { user: { nama: string } };
        statistik: StatistikAdmin;
        kriterias: Kriteria[];
        total_bobot: number;
    }>().props;

    const bobotValid = Math.abs(toNum(total_bobot) - 1) < 0.001;

    const sortedKriterias = [...kriterias].sort((a, b) => a.urutan - b.urutan);

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Selamat datang, {auth.user.nama}
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Ringkasan sistem dan konfigurasi kriteria TOPSIS.
                    </p>
                </div>
                <Button asChild size="sm" variant="outline">
                    <Link href="/kriteria">Kelola Kriteria</Link>
                </Button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Total Pelamar"
                    value={statistik.total_pelamar}
                    sub="akun terdaftar"
                />
                <StatCard
                    label="Lowongan Aktif"
                    value={statistik.lowongan_aktif}
                    sub="saat ini tersedia"
                    accent
                />
                <StatCard
                    label="Total HRD"
                    value={statistik.total_hrd}
                    sub="akun HRD aktif"
                />
                <StatCard
                    label="Proses TOPSIS"
                    value={statistik.proses_topsis}
                    sub="lowongan sudah dihitung"
                />
            </div>

            {/* ── Kriteria TOPSIS ── */}
            <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                        <CardTitle className="text-base">
                            Kriteria TOPSIS
                        </CardTitle>
                        <CardDescription className="mt-0.5">
                            Konfigurasi bobot dan tipe yang aktif saat ini.
                        </CardDescription>
                    </div>
                    {!bobotValid && (
                        <Badge variant="destructive" className="shrink-0">
                            Total bobot {formatBobot(total_bobot)} ≠ 1.00
                        </Badge>
                    )}
                    {bobotValid && (
                        <Badge
                            variant="secondary"
                            className="shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700"
                        >
                            Bobot valid
                        </Badge>
                    )}
                </CardHeader>

                <Separator />

                <CardContent className="pt-4">
                    {/* Header row */}
                    <div className="mb-2 grid grid-cols-12 gap-2 px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        <span className="col-span-1">#</span>
                        <span className="col-span-4">Kriteria</span>
                        <span className="col-span-2 text-center">Tipe</span>
                        <span className="col-span-2 text-center">Bobot</span>
                        <span className="col-span-3">Distribusi</span>
                    </div>

                    <div className="divide-y">
                        {sortedKriterias.map((k) => (
                            <div
                                key={k.id}
                                className="grid grid-cols-12 items-center gap-2 px-1 py-3"
                            >
                                <span className="col-span-1 text-xs text-muted-foreground tabular-nums">
                                    {k.urutan}
                                </span>

                                <span className="col-span-4 text-sm font-medium">
                                    {k.nama}
                                </span>

                                <span className="col-span-2 flex justify-center">
                                    <Badge
                                        variant="outline"
                                        className={
                                            k.tipe === 'benefit'
                                                ? 'border-blue-200 bg-blue-50 text-xs text-blue-700'
                                                : 'border-orange-200 bg-orange-50 text-xs text-orange-700'
                                        }
                                    >
                                        {k.tipe === 'benefit'
                                            ? 'Benefit ↑'
                                            : 'Cost ↓'}
                                    </Badge>
                                </span>

                                <span className="col-span-2 text-center font-mono text-sm tabular-nums">
                                    {formatBobot(k.bobot)}
                                </span>

                                <span className="col-span-3">
                                    <BobotBar bobot={k.bobot} />
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total row */}
                    <Separator className="mt-2" />
                    <div className="mt-3 grid grid-cols-12 items-center gap-2 px-1">
                        <span className="col-span-5 text-xs font-medium text-muted-foreground">
                            Total
                        </span>
                        <span className="col-span-2" />
                        <span
                            className={`col-span-2 text-center font-mono text-sm font-semibold tabular-nums ${
                                bobotValid
                                    ? 'text-emerald-600'
                                    : 'text-destructive'
                            }`}
                        >
                            {formatBobot(total_bobot)}
                        </span>
                        <span className="col-span-3" />
                    </div>

                    {!bobotValid && (
                        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                            Total bobot harus tepat 1.00 agar kalkulasi TOPSIS
                            valid.{' '}
                            <Link
                                href="/kriteria"
                                className="font-medium underline underline-offset-2"
                            >
                                Perbaiki sekarang →
                            </Link>
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
