import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, X } from 'lucide-react';
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Auth } from '@/types';

type PelamarProfile = {
    pendidikan: string;
    jurusan: string | null;
    institusi: string | null;
    nilai_akademik: string | null;
    tipe_nilai: string;
    tahun_lulus: number | null;
    cv_path: string | null;
    foto_ktp_path: string | null;
    foto_ijazah_path: string | null;
};

type PengalamanKerja = {
    id: number;
    nama_perusahaan: string;
    posisi: string;
    bulan_mulai: string;
    bulan_selesai: string | null;
};

type Pengguna = {
    id: number;
    nama: string;
    email: string;
    nik: string | null;
    tgl_lahir: string | null;
    jenis_kelamin: string | null;
    alamat: string | null;
    no_hp: string | null;
    pelamar_profile: PelamarProfile | null;
    pengalaman_kerjas: PengalamanKerja[];
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
    lamaran: Lamaran;
};

function formatTanggal(tanggal: string | null): string {
    if (!tanggal) return '-';
    return new Date(tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function SeleksiShow() {
    const { lowongan, lamaran } = usePage<PageProps>().props;
    const { pengguna } = lamaran;
    const profile = pengguna.pelamar_profile;

    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const handleLoloskan = () => {
        router.patch(
            `/seleksi/${lamaran.id}/lolos`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleTolak = () => {
        router.patch(
            `/seleksi/${lamaran.id}/tolak`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setShowRejectDialog(false),
            },
        );
    };

    const sudahDiproses = lamaran.status !== 'menunggu';

    return (
        <div className="space-y-6 p-6">
            <Head title={`Berkas ${pengguna.nama}`} />

            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href={`/seleksi/${lowongan.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke daftar seleksi
                </Link>
            </Button>

            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            {pengguna.nama}
                        </CardTitle>
                        <CardDescription>
                            Melamar untuk {lowongan.judul}
                        </CardDescription>
                    </div>
                    <Badge>{lamaran.status_label}</Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <h3 className="mb-3 text-sm font-medium">Data Diri</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                            <dt className="text-muted-foreground">NIK</dt>
                            <dd>{pengguna.nik ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>{pengguna.email}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">
                                Tanggal Lahir
                            </dt>
                            <dd>{formatTanggal(pengguna.tgl_lahir)}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">
                                Jenis Kelamin
                            </dt>
                            <dd>
                                {pengguna.jenis_kelamin === 'L'
                                    ? 'Laki-laki'
                                    : pengguna.jenis_kelamin === 'P'
                                      ? 'Perempuan'
                                      : '-'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">No. HP</dt>
                            <dd>{pengguna.no_hp ?? '-'}</dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="text-muted-foreground">Alamat</dt>
                            <dd>{pengguna.alamat ?? '-'}</dd>
                        </div>
                    </dl>
                </div>

                <Separator />

                <div>
                    <h3 className="mb-3 text-sm font-medium">Pendidikan</h3>
                    {profile ? (
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Jenjang
                                </dt>
                                <dd>{profile.pendidikan}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Jurusan
                                </dt>
                                <dd>{profile.jurusan ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Institusi
                                </dt>
                                <dd>{profile.institusi ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Tahun Lulus
                                </dt>
                                <dd>{profile.tahun_lulus ?? '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Nilai Akademik (
                                    {profile.tipe_nilai === 'ipk'
                                        ? 'IPK'
                                        : 'Rapor'}
                                    )
                                </dt>
                                <dd>{profile.nilai_akademik ?? '-'}</dd>
                            </div>
                        </dl>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Data pendidikan belum dilengkapi.
                        </p>
                    )}
                </div>

                <Separator />

                <div>
                    <h3 className="mb-3 text-sm font-medium">
                        Pengalaman Kerja
                    </h3>
                    {pengguna.pengalaman_kerjas.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Tidak ada pengalaman kerja yang dicantumkan.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {pengguna.pengalaman_kerjas.map((peng) => (
                                <div
                                    key={peng.id}
                                    className="rounded-md border p-3 text-sm"
                                >
                                    <p className="font-medium">
                                        {peng.posisi} — {peng.nama_perusahaan}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {formatTanggal(peng.bulan_mulai)} —{' '}
                                        {peng.bulan_selesai
                                            ? formatTanggal(peng.bulan_selesai)
                                            : 'Sekarang'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                <div>
                    <h3 className="mb-3 text-sm font-medium">Dokumen</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile?.cv_path ? (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`/storage-pelamar/cv/${lamaran.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Lihat CV
                                </a>
                            </Button>
                        ) : (
                            <Badge variant="secondary">CV belum diunggah</Badge>
                        )}
                        {profile?.foto_ktp_path ? (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`/storage-pelamar/ktp/${lamaran.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Lihat Foto KTP
                                </a>
                            </Button>
                        ) : (
                            <Badge variant="secondary">
                                KTP belum diunggah
                            </Badge>
                        )}
                        {profile?.foto_ijazah_path ? (
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={`/storage-pelamar/ijazah/${lamaran.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Lihat Ijazah
                                </a>
                            </Button>
                        ) : (
                            <Badge variant="secondary">
                                Ijazah belum diunggah
                            </Badge>
                        )}
                    </div>
                </div>
            </CardContent>

            {!sudahDiproses && (
                <div className="flex gap-3 ml-6">
                    <Button onClick={handleLoloskan}>
                        <Check className="mr-2 h-4 w-4" />
                        Loloskan ke Tes Teknis
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() =>
                            setTimeout(() => setShowRejectDialog(true), 0)
                        }
                    >
                        <X className="mr-2 h-4 w-4" />
                        Tolak Pelamar
                    </Button>
                </div>
            )}

            <AlertDialog
                open={showRejectDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setShowRejectDialog(false);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Tolak lamaran {pengguna.nama}?
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

SeleksiShow.layout = {
    breadcrumbs: [
        {
            title: 'Detail Pelamar Seleksi Administrasi',
        },
    ],
};