import { Form, Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
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
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { Auth } from '@/types';

type PelamarProfile = {
    pendidikan: string;
    jurusan: string | null;
    institusi: string | null;
    nilai_akademik: string | null;
    tipe_nilai: string;
    tahun_lulus: number | null;
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
    alamat: string | null;
    no_hp: string | null;
    pelamar_profile: PelamarProfile | null;
    pengalaman_kerjas: PengalamanKerja[];
};

type PageProps = {
    auth: Auth;
    pengguna: Pengguna;
};

function toDateInputValue(tanggal: string | null): string {
    return tanggal ? tanggal.slice(0, 10) : '';
}

export default function ProfilPelamar() {
    const { pengguna } = usePage<PageProps>().props;
    const profile = pengguna.pelamar_profile;

    const [showPengalamanForm, setShowPengalamanForm] = useState(false);
    const [pengalamanToDelete, setPengalamanToDelete] =
        useState<PengalamanKerja | null>(null);
    const [tipeNilai, setTipeNilai] = useState(profile?.tipe_nilai ?? 'ipk');

    const handleDeletePengalaman = () => {
        if (!pengalamanToDelete) return;

        router.delete(`/profil/pengalaman/${pengalamanToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setPengalamanToDelete(null),
        });
    };

    return (
        <div className="space-y-6 p-6">
            <Head title="Profil Saya" />

                <CardHeader>
                    <CardTitle className="text-xl">
                        Data Diri & Pendidikan
                    </CardTitle>
                    <CardDescription>
                        Lengkapi profil Anda sebelum melamar pekerjaan. Data ini
                        digunakan untuk proses seleksi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form action="/profil" method="put" className="space-y-6">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        name="nama"
                                        required
                                        defaultValue={pengguna.nama}
                                    />
                                    <InputError message={errors.nama} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        name="alamat"
                                        required
                                        defaultValue={pengguna.alamat ?? ''}
                                    />
                                    <InputError message={errors.alamat} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="no_hp">
                                        Nomor HP{' '}
                                        <span className="text-xs text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="no_hp"
                                        name="no_hp"
                                        type="tel"
                                        defaultValue={pengguna.no_hp ?? ''}
                                    />
                                    <InputError message={errors.no_hp} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="pendidikan">
                                            Jenjang Pendidikan
                                        </Label>
                                        <Select
                                            name="pendidikan"
                                            defaultValue={profile?.pendidikan}
                                            required
                                        >
                                            <SelectTrigger id="pendidikan">
                                                <SelectValue placeholder="Pilih jenjang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SMA">
                                                    SMA
                                                </SelectItem>
                                                <SelectItem value="SMK">
                                                    SMK
                                                </SelectItem>
                                                <SelectItem value="D3">
                                                    D3
                                                </SelectItem>
                                                <SelectItem value="S1">
                                                    S1
                                                </SelectItem>
                                                <SelectItem value="S2">
                                                    S2
                                                </SelectItem>
                                                <SelectItem value="S3">
                                                    S3
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.pendidikan}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tahun_lulus">
                                            Tahun Lulus
                                        </Label>
                                        <Input
                                            id="tahun_lulus"
                                            name="tahun_lulus"
                                            type="number"
                                            min={1980}
                                            max={new Date().getFullYear() + 1}
                                            defaultValue={
                                                profile?.tahun_lulus ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.tahun_lulus}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="jurusan">Jurusan</Label>
                                        <Input
                                            id="jurusan"
                                            name="jurusan"
                                            defaultValue={
                                                profile?.jurusan ?? ''
                                            }
                                        />
                                        <InputError message={errors.jurusan} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="institusi">
                                            Institusi
                                        </Label>
                                        <Input
                                            id="institusi"
                                            name="institusi"
                                            defaultValue={
                                                profile?.institusi ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.institusi}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tipe_nilai">
                                            Tipe Nilai
                                        </Label>
                                        <Select
                                            name="tipe_nilai"
                                            value={tipeNilai}
                                            onValueChange={setTipeNilai}
                                        >
                                            <SelectTrigger id="tipe_nilai">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ipk">
                                                    IPK
                                                </SelectItem>
                                                <SelectItem value="rapor">
                                                    Rapor
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.tipe_nilai}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nilai_akademik">
                                            {tipeNilai === 'ipk'
                                                ? 'IPK'
                                                : 'Nilai Rapor'}{' '}
                                            (skala 0-100)
                                        </Label>
                                        <Input
                                            id="nilai_akademik"
                                            name="nilai_akademik"
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            max={100}
                                            required
                                            defaultValue={
                                                profile?.nilai_akademik ?? ''
                                            }
                                            placeholder={
                                                tipeNilai === 'ipk'
                                                    ? 'Contoh: IPK 3.5 → 87.5'
                                                    : 'Contoh: 85'
                                            }
                                        />
                                        <InputError
                                            message={errors.nilai_akademik}
                                        />
                                        {tipeNilai === 'ipk' && (
                                            <p className="text-xs text-muted-foreground">
                                                Konversi: (IPK / 4) × 100
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing && <Spinner />}
                                    Simpan Profil
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>

            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">
                            Pengalaman Kerja
                        </CardTitle>
                        <CardDescription>
                            Opsional, tapi membantu penilaian seleksi
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setShowPengalamanForm(!showPengalamanForm)
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah
                    </Button>
                </div>
            </CardHeader>

            {showPengalamanForm && (
                <CardContent className="border-t pt-6">
                    <Form
                        action="/profil/pengalaman"
                        method="post"
                        resetOnSuccess
                        className="space-y-4"
                        onSuccess={() => setShowPengalamanForm(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama_perusahaan">
                                        Nama Perusahaan
                                    </Label>
                                    <Input
                                        id="nama_perusahaan"
                                        name="nama_perusahaan"
                                        required
                                    />
                                    <InputError
                                        message={errors.nama_perusahaan}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="posisi">Posisi</Label>
                                    <Input id="posisi" name="posisi" required />
                                    <InputError message={errors.posisi} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bulan_mulai">
                                            Mulai Bekerja
                                        </Label>
                                        <Input
                                            id="bulan_mulai"
                                            name="bulan_mulai"
                                            type="date"
                                            required
                                        />
                                        <InputError
                                            message={errors.bulan_mulai}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bulan_selesai">
                                            Selesai{' '}
                                            <span className="text-xs text-muted-foreground">
                                                (kosongkan jika masih bekerja)
                                            </span>
                                        </Label>
                                        <Input
                                            id="bulan_selesai"
                                            name="bulan_selesai"
                                            type="date"
                                        />
                                        <InputError
                                            message={errors.bulan_selesai}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Simpan
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setShowPengalamanForm(false)
                                        }
                                    >
                                        Batal
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            )}

            <CardContent className={showPengalamanForm ? 'pt-0' : ''}>
                {pengguna.pengalaman_kerjas.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        Belum ada pengalaman kerja ditambahkan.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {pengguna.pengalaman_kerjas.map((peng) => (
                            <div
                                key={peng.id}
                                className="flex items-start justify-between gap-4 rounded-md border p-3"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {peng.posisi} — {peng.nama_perusahaan}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {toDateInputValue(peng.bulan_mulai)} —{' '}
                                        {peng.bulan_selesai
                                            ? toDateInputValue(
                                                  peng.bulan_selesai,
                                              )
                                            : 'Sekarang'}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setTimeout(
                                            () => setPengalamanToDelete(peng),
                                            0,
                                        )
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <AlertDialog
                open={pengalamanToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setPengalamanToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus pengalaman kerja ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan.
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
                        <AlertDialogAction onClick={handleDeletePengalaman}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

ProfilPelamar.layout = {
    breadcrumbs: [
        {
            title: 'Profil Saya',
        },
    ],
};
