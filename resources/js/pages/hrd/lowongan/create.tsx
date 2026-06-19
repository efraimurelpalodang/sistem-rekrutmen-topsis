import { Form, Head } from '@inertiajs/react';
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
import { Textarea } from '@/components/ui/textarea';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Lowongan', href: '/lowongan' },
    { title: 'Buat Lowongan', href: '/lowongan/create' },
];

export default function LowonganCreate() {
    return (
        // <AppSidebarLayout breadcrumbs={breadcrumbs}>
        //     <Head title="Buat Lowongan" />

        <div className="p-6">
            {/* <Card className="max-w-2xl"> */}
            <CardHeader>
                <CardTitle className="text-xl">Buat Lowongan Baru</CardTitle>
                <CardDescription>
                    Isi detail lowongan pekerjaan yang akan dipublikasikan
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form action="/lowongan" method="post" className="space-y-6 mt-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="judul">Judul Lowongan</Label>
                                <Input
                                    id="judul"
                                    name="judul"
                                    required
                                    autoFocus
                                    placeholder="Contoh: Backend Developer"
                                />
                                <InputError message={errors.judul} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi">
                                    Deskripsi Pekerjaan
                                </Label>
                                <Textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    rows={4}
                                    placeholder="Jelaskan tanggung jawab dan tugas pekerjaan ini"
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="kualifikasi">Kualifikasi</Label>
                                <Textarea
                                    id="kualifikasi"
                                    name="kualifikasi"
                                    rows={4}
                                    placeholder="Jelaskan syarat dan kualifikasi yang dibutuhkan"
                                />
                                <InputError message={errors.kualifikasi} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="kuota">
                                        Kuota Diterima
                                    </Label>
                                    <Input
                                        id="kuota"
                                        name="kuota"
                                        type="number"
                                        min={1}
                                        required
                                        placeholder="Jumlah orang yang akan diterima"
                                    />
                                    <InputError message={errors.kuota} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tgl_buka">
                                            Tanggal Buka
                                        </Label>
                                        <Input
                                            id="tgl_buka"
                                            name="tgl_buka"
                                            type="date"
                                            required
                                        />
                                        <InputError message={errors.tgl_buka} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="tgl_tutup">
                                            Tanggal Tutup
                                        </Label>
                                        <Input
                                            id="tgl_tutup"
                                            name="tgl_tutup"
                                            type="date"
                                            required
                                        />
                                        <InputError
                                            message={errors.tgl_tutup}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Simpan Lowongan
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
            {/* </Card> */}
        </div>
        // </AppSidebarLayout>
    );
}
