import { Form, Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Send, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
};

type TesTeknis = {
    id: number;
    durasi_menit: number;
    jumlah_soal: number;
};

type Soal = {
    id: number;
    pertanyaan: string;
    pilihan_a: string;
    pilihan_b: string;
    pilihan_c: string;
    pilihan_d: string;
    jawaban_benar: 'a' | 'b' | 'c' | 'd';
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
    tesTeknis: TesTeknis;
    soals: Soal[];
};

export default function SoalManager() {
    const { lowongan, tesTeknis, soals } = usePage<PageProps>().props;

    const [showForm, setShowForm] = useState(false);
    const [soalToDelete, setSoalToDelete] = useState<Soal | null>(null);
    const [showBukaTesDialog, setShowBukaTesDialog] = useState(false);

    const handleDelete = () => {
        if (!soalToDelete) return;

        router.delete(`/lowongan/${lowongan.id}/tes/soal/${soalToDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setSoalToDelete(null),
        });
    };

    const handleBukaTes = () => {
        router.post(
            `/lowongan/${lowongan.id}/tes/buka`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setShowBukaTesDialog(false),
            },
        );
    };

    const isCukup = soals.length >= tesTeknis.jumlah_soal;

    return (
        <div className="space-y-6 p-6">
            <Head title={`Bank Soal - ${lowongan.judul}`} />

            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href={`/lowongan/${lowongan.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke detail lowongan
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Bank Soal</CardTitle>
                            <CardDescription>
                                {lowongan.judul} · {tesTeknis.durasi_menit}{' '}
                                menit · {tesTeknis.jumlah_soal} soal ditampilkan
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={isCukup ? 'default' : 'destructive'}
                            >
                                {soals.length} / {tesTeknis.jumlah_soal} soal
                            </Badge>
                            <Button
                                variant="outline"
                                disabled={!isCukup}
                                onClick={() =>
                                    setTimeout(
                                        () => setShowBukaTesDialog(true),
                                        0,
                                    )
                                }
                            >
                                Buka Tes
                            </Button>
                            <Button onClick={() => setShowForm(!showForm)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Soal
                            </Button>
                        </div>
                    </div>
                    {!isCukup && (
                        <p className="text-sm text-destructive">
                            Bank soal belum cukup. Tambahkan minimal{' '}
                            {tesTeknis.jumlah_soal - soals.length} soal lagi
                            agar tes dapat dikerjakan pelamar.
                        </p>
                    )}
                </CardHeader>

                {showForm && (
                    <CardContent className="border-t pt-6">
                        <Form
                            action={`/lowongan/${lowongan.id}/tes/soal`}
                            method="post"
                            resetOnSuccess
                            className="space-y-4"
                            onSuccess={() => setShowForm(false)}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pertanyaan">
                                            Pertanyaan
                                        </Label>
                                        <Textarea
                                            id="pertanyaan"
                                            name="pertanyaan"
                                            rows={2}
                                            required
                                            autoFocus
                                            placeholder="Tulis pertanyaan soal di sini"
                                        />
                                        <InputError
                                            message={errors.pertanyaan}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pilihan_a">
                                                Pilihan A
                                            </Label>
                                            <Input
                                                id="pilihan_a"
                                                name="pilihan_a"
                                                required
                                            />
                                            <InputError
                                                message={errors.pilihan_a}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pilihan_b">
                                                Pilihan B
                                            </Label>
                                            <Input
                                                id="pilihan_b"
                                                name="pilihan_b"
                                                required
                                            />
                                            <InputError
                                                message={errors.pilihan_b}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pilihan_c">
                                                Pilihan C
                                            </Label>
                                            <Input
                                                id="pilihan_c"
                                                name="pilihan_c"
                                                required
                                            />
                                            <InputError
                                                message={errors.pilihan_c}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pilihan_d">
                                                Pilihan D
                                            </Label>
                                            <Input
                                                id="pilihan_d"
                                                name="pilihan_d"
                                                required
                                            />
                                            <InputError
                                                message={errors.pilihan_d}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid max-w-xs gap-2">
                                        <Label htmlFor="jawaban_benar">
                                            Jawaban Benar
                                        </Label>
                                        <Select name="jawaban_benar" required>
                                            <SelectTrigger id="jawaban_benar">
                                                <SelectValue placeholder="Pilih jawaban benar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a">
                                                    A
                                                </SelectItem>
                                                <SelectItem value="b">
                                                    B
                                                </SelectItem>
                                                <SelectItem value="c">
                                                    C
                                                </SelectItem>
                                                <SelectItem value="d">
                                                    D
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.jawaban_benar}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Simpan Soal
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                )}
            </Card>

            <div className="space-y-3">
                {soals.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        Belum ada soal di bank soal. Klik &quot;Tambah
                        Soal&quot; untuk mulai menambahkan.
                    </p>
                ) : (
                    soals.map((soal, index) => (
                        <Card key={soal.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <p className="text-sm font-medium">
                                            {index + 1}. {soal.pertanyaan}
                                        </p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            {(
                                                ['a', 'b', 'c', 'd'] as const
                                            ).map((opsi) => (
                                                <p
                                                    key={opsi}
                                                    className={
                                                        soal.jawaban_benar ===
                                                        opsi
                                                            ? 'font-medium text-green-600'
                                                            : ''
                                                    }
                                                >
                                                    {opsi.toUpperCase()}.{' '}
                                                    {
                                                        soal[
                                                            `pilihan_${opsi}` as const
                                                        ]
                                                    }
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 text-destructive hover:text-destructive"
                                        onClick={() =>
                                            setTimeout(
                                                () => setSoalToDelete(soal),
                                                0,
                                            )
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <AlertDialog
                open={soalToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setSoalToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Soal akan
                            dihapus secara permanen dari bank soal.
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
                        <AlertDialogAction onClick={handleDelete}>
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={showBukaTesDialog}
                onOpenChange={(open) => {
                    if (!open) {
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                        setShowBukaTesDialog(false);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Buka tes untuk semua pelamar yang lolos
                            administrasi?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Semua pelamar dengan status &quot;Lolos Seleksi
                            Administrasi&quot; pada lowongan ini akan dapat
                            mengakses dan mengerjakan tes teknis. Tindakan ini
                            tidak dapat dibatalkan.
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
                        <AlertDialogAction onClick={handleBukaTes}>
                            Ya, Buka Tes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

SoalManager.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Soal Tes',
        },
    ],
};