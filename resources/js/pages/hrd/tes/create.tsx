import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
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
import { Spinner } from '@/components/ui/spinner';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
};

type PageProps = {
    auth: Auth;
    lowongan: Lowongan;
};

export default function TesCreate() {
    const { lowongan } = usePage<PageProps>().props;

    return (
        <div className="p-6">
            <Head title={`Buat Tes Teknis - ${lowongan.judul}`} />

            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
                <Link href={`/lowongan/${lowongan.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke detail lowongan
                </Link>
            </Button>

                <CardHeader>
                    <CardTitle className="text-xl">Buat Tes Teknis</CardTitle>
                    <CardDescription>
                        Atur durasi dan jumlah soal untuk lowongan{' '}
                        <span className="font-medium">{lowongan.judul}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form
                        action={`/lowongan/${lowongan.id}/tes`}
                        method="post"
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="durasi_menit">
                                        Durasi Pengerjaan (menit)
                                    </Label>
                                    <Input
                                        id="durasi_menit"
                                        name="durasi_menit"
                                        type="number"
                                        min={1}
                                        max={300}
                                        required
                                        autoFocus
                                        placeholder="Contoh: 60"
                                    />
                                    <InputError message={errors.durasi_menit} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jumlah_soal">
                                        Jumlah Soal Ditampilkan
                                    </Label>
                                    <Input
                                        id="jumlah_soal"
                                        name="jumlah_soal"
                                        type="number"
                                        min={1}
                                        required
                                        placeholder="Contoh: 20"
                                    />
                                    <InputError message={errors.jumlah_soal} />
                                    <p className="text-xs text-muted-foreground">
                                        Soal akan dipilih secara acak dari bank
                                        soal yang Anda buat setelah ini.
                                        Pastikan bank soal memiliki jumlah soal
                                        minimal sebanyak ini.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Buat Tes & Lanjut ke Bank Soal
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
        </div>
    );
}
