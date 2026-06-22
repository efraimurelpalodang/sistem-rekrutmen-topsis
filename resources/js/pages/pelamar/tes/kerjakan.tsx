import { Head, router, usePage } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCountdown } from '@/hooks/use-countdown';
import type { Auth } from '@/types';

type Lowongan = {
    id: number;
    judul: string;
};

type Lamaran = {
    id: number;
    lowongan: Lowongan;
};

type TesTeknis = {
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
};

type PageProps = {
    auth: Auth;
    lamaran: Lamaran;
    tesTeknis: TesTeknis;
    soals: Soal[];
    sisaDetik: number;
    jawabanTersimpan: Record<number, 'a' | 'b' | 'c' | 'd'>;
};

export default function TesKerjakan() {
    const { lamaran, soals, sisaDetik, jawabanTersimpan } =
        usePage<PageProps>().props;

    const [jawaban, setJawaban] = useState<Record<number, string>>(
        jawabanTersimpan ?? {},
    );
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const isSubmittingRef = useRef(false);

    const handleSubmit = useCallback(() => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        router.post(`/tes/${lamaran.id}/submit`, { jawaban });
    }, [jawaban, lamaran.id]);

    const { formatted, isWarning } = useCountdown(sisaDetik, {
        onExpire: handleSubmit,
    });

    const handlePilihJawaban = (soalId: number, pilihan: string) => {
        setJawaban((prev) => ({ ...prev, [soalId]: pilihan }));

        // Autosave per soal, tidak menunggu submit akhir
        router.post(
            `/tes/${lamaran.id}/jawab`,
            { soal_id: soalId, jawaban: pilihan },
            { preserveScroll: true, preserveState: true, only: [] },
        );
    };

    const jumlahTerjawab = Object.keys(jawaban).length;

    return (
        <div className="min-h-screen bg-muted/30">
            <Head title={`Tes Teknis - ${lamaran.lowongan.judul}`} />

            {/* Header sticky dengan timer */}
            <div className="sticky top-0 z-10 border-b bg-background">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="font-semibold">
                            {lamaran.lowongan.judul}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {jumlahTerjawab} / {soals.length} soal terjawab
                        </p>
                    </div>
                    <Badge
                        variant={isWarning ? 'destructive' : 'secondary'}
                        className="px-3 py-1.5 font-mono text-base"
                    >
                        <Clock className="mr-1.5 h-4 w-4" />
                        {formatted}
                    </Badge>
                </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
                {soals.map((soal, index) => (
                    <Card key={soal.id}>
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                {index + 1}. {soal.pertanyaan}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={jawaban[soal.id] ?? ''}
                                onValueChange={(value) =>
                                    handlePilihJawaban(soal.id, value)
                                }
                                className="space-y-2"
                            >
                                {(['a', 'b', 'c', 'd'] as const).map((opsi) => (
                                    <div
                                        key={opsi}
                                        className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                                    >
                                        <RadioGroupItem
                                            value={opsi}
                                            id={`soal-${soal.id}-${opsi}`}
                                        />
                                        <Label
                                            htmlFor={`soal-${soal.id}-${opsi}`}
                                            className="flex-1 cursor-pointer font-normal"
                                        >
                                            <span className="mr-2 font-medium">
                                                {opsi.toUpperCase()}.
                                            </span>
                                            {soal[`pilihan_${opsi}` as const]}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-center pt-4 pb-12">
                    <Button
                        size="lg"
                        onClick={() => setShowConfirmSubmit(true)}
                    >
                        Selesai & Kumpulkan Jawaban
                    </Button>
                </div>
            </div>

            <AlertDialog
                open={showConfirmSubmit}
                onOpenChange={setShowConfirmSubmit}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Kumpulkan jawaban sekarang?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda telah menjawab {jumlahTerjawab} dari{' '}
                            {soals.length} soal. Setelah dikumpulkan, Anda tidak
                            dapat mengubah jawaban atau mengerjakan ulang tes
                            ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Ya, Kumpulkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
