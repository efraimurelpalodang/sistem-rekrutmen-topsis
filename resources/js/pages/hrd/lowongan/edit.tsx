import { Form, Head, usePage } from '@inertiajs/react';
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

type Lowongan = {
    id: number;
    judul: string;
    deskripsi: string | null;
    kualifikasi: string | null;
    kuota: number;
    tgl_buka: string;
    tgl_tutup: string;
};

type PageProps = {
    lowongan: Lowongan;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Lowongan', href: '/lowongan' },
    { title: 'Edit Lowongan', href: '#' },
];

function toDateInputValue(tanggal: string): string {
    return tanggal.slice(0, 10);
}

export default function LowonganEdit() {
    const { lowongan } = usePage<PageProps>().props;

    return (
        <div className="p-6">
            <CardHeader>
                <CardTitle className="text-xl">Edit Lowongan</CardTitle>
                <CardDescription>
                    Perbarui detail lowongan {lowongan.judul}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form
                    action={`/lowongan/${lowongan.id}`}
                    method="put"
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="judul">Judul Lowongan</Label>
                                <Input
                                    id="judul"
                                    name="judul"
                                    required
                                    autoFocus
                                    defaultValue={lowongan.judul}
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
                                    defaultValue={lowongan.deskripsi ?? ''}
                                />
                                <InputError message={errors.deskripsi} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="kualifikasi">Kualifikasi</Label>
                                <Textarea
                                    id="kualifikasi"
                                    name="kualifikasi"
                                    rows={4}
                                    defaultValue={lowongan.kualifikasi ?? ''}
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
                                        defaultValue={lowongan.kuota}
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
                                            defaultValue={toDateInputValue(
                                                lowongan.tgl_buka,
                                            )}
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
                                            defaultValue={toDateInputValue(
                                                lowongan.tgl_tutup,
                                            )}
                                        />
                                        <InputError
                                            message={errors.tgl_tutup}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </CardContent>
        </div>
    );
}

LowonganEdit.layout = {
    breadcrumbs: [
        {
            title: 'Edit Lowongan',
        },
    ],
};