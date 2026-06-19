import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { Auth, BreadcrumbItem } from '@/types';

type Kriteria = {
    id: number;
    nama: string;
    bobot: string;
    tipe: 'benefit' | 'cost';
    urutan: number;
};

type PageProps = {
    auth: Auth;
    kriterias: Kriteria[];
    totalBobot: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kelola Kriteria', href: '/kriteria' },
];

export default function KriteriaIndex() {
    const { kriterias, totalBobot } = usePage<PageProps>().props;

    const [editingId, setEditingId] = useState<number | null>(null);
    const [formState, setFormState] = useState<
        Record<number, { bobot: string; tipe: 'benefit' | 'cost' }>
    >(
        Object.fromEntries(
            kriterias.map((k) => [k.id, { bobot: k.bobot, tipe: k.tipe }]),
        ),
    );
    const [savingId, setSavingId] = useState<number | null>(null);

    const handleEdit = (id: number) => {
        setEditingId(id);
    };

    const handleCancel = (id: number) => {
        const original = kriterias.find((k) => k.id === id);
        if (original) {
            setFormState((prev) => ({
                ...prev,
                [id]: { bobot: original.bobot, tipe: original.tipe },
            }));
        }
        setEditingId(null);
    };

    const handleChange = (
        id: number,
        field: 'bobot' | 'tipe',
        value: string,
    ) => {
        setFormState((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    const handleSave = (id: number) => {
        setSavingId(id);
        router.put(
            `/kriteria/${id}`,
            {
                bobot: formState[id].bobot,
                tipe: formState[id].tipe,
            },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
                onFinish: () => setSavingId(null),
            },
        );
    };

    const isBobotValid = Math.abs(totalBobot - 1) < 0.001;

    return (
        // <AppSidebarLayout breadcrumbs={breadcrumbs}>
        //     <Head title="Kelola Kriteria" />

        <div className="space-y-6 p-6">
            <Heading
                title="Kelola Kriteria TOPSIS"
                description="Atur bobot dan tipe setiap kriteria yang digunakan dalam perhitungan TOPSIS"
            />
            <div
                className={`flex w-fit items-center gap-3 rounded-lg`}
            >
                <span className="text-sm text-muted-foreground">
                    Total bobot:
                </span>
                <span
                    className={`text-sm font-semibold ${isBobotValid ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                    {totalBobot.toFixed(2)} / 1.00
                </span>
                {isBobotValid ? (
                    <span className="text-xs text-green-600 dark:text-green-500">
                        ✓ Valid
                    </span>
                ) : (
                    <span className="text-xs text-red-500">
                        Total harus berjumlah 1.00
                    </span>
                )}
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Urutan</TableHead>
                            <TableHead>Nama Kriteria</TableHead>
                            <TableHead className="w-40">Bobot</TableHead>
                            <TableHead className="w-40">Tipe</TableHead>
                            <TableHead className="w-40 text-center">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kriterias.map((kriteria) => {
                            const isEditing = editingId === kriteria.id;
                            const isSaving = savingId === kriteria.id;

                            return (
                                <TableRow key={kriteria.id}>
                                    <TableCell className="text-center text-muted-foreground">
                                        {kriteria.urutan}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {kriteria.nama}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="1"
                                                value={
                                                    formState[kriteria.id]
                                                        ?.bobot ?? ''
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        kriteria.id,
                                                        'bobot',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-24"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className="text-sm">
                                                {parseFloat(
                                                    formState[kriteria.id]
                                                        ?.bobot,
                                                ).toFixed(2)}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isEditing ? (
                                            <Select
                                                value={
                                                    formState[kriteria.id]?.tipe
                                                }
                                                onValueChange={(value) =>
                                                    handleChange(
                                                        kriteria.id,
                                                        'tipe',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="benefit">
                                                        Benefit
                                                    </SelectItem>
                                                    <SelectItem value="cost">
                                                        Cost
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span
                                                className={`text-sm font-medium ${formState[kriteria.id]?.tipe === 'benefit' ? 'text-gray-700 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`}
                                            >
                                                {formState[kriteria.id]
                                                    ?.tipe === 'benefit'
                                                    ? 'Benefit'
                                                    : 'Cost'}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {isEditing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        handleSave(kriteria.id)
                                                    }
                                                    className="text-white"
                                                >
                                                    {isSaving
                                                        ? 'Menyimpan...'
                                                        : 'Simpan'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        handleCancel(
                                                            kriteria.id,
                                                        )
                                                    }
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(kriteria.id)
                                                }
                                                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <p className="text-sm text-muted-foreground">
                Catatan: total bobot seluruh kriteria harus berjumlah tepat 1.00
                (100%) agar perhitungan TOPSIS valid.
            </p>
        </div>
        // </AppSidebarLayout>
    );
}
