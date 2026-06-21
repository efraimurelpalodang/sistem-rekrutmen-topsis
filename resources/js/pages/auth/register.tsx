import { Form, Head } from '@inertiajs/react';
import { Loader2, ScanLine, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useOcrKtp } from '@/hooks/use-ocr-ktp';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const {
        isProcessing,
        progress,
        error,
        data,
        fotoPreview,
        prosesFoto,
        reset,
    } = useOcrKtp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showForm, setShowForm] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await prosesFoto(file);

        if (result.success) {
            setShowForm(true);
        }
    };

    const handleFotoUlang = () => {
        reset();
        setShowForm(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ── Tahap 1: Upload & Scan KTP ──────────────────────────────────
    if (!showForm) {
        return (
            <>
                <Head title="Daftar" />
                <div className="mx-auto w-sm space-y-6">
                    {/* Deskripsi + icon hanya tampil jika belum ada foto yang diupload */}
                    {!fotoPreview && (
                        <div className="space-y-1 text-center">
                            <ScanLine className="mx-auto h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Unggah foto KTP Anda untuk memulai pendaftaran.
                                Data akan terisi otomatis dari hasil pemindaian.
                            </p>
                        </div>
                    )}

                    {fotoPreview && (
                        <Card>
                            <CardContent className="pt-6">
                                <img
                                    src={fotoPreview}
                                    alt="Preview KTP"
                                    className="w-full rounded-md border"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Gagal membaca KTP</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            id="foto-ktp"
                            onChange={handleFileChange}
                            disabled={isProcessing}
                        />
                        <Button
                            type="button"
                            className="w-full cursor-pointer"
                            disabled={isProcessing}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memindai KTP... {progress}%
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {error
                                        ? 'Coba Foto Ulang'
                                        : 'Unggah Foto KTP'}
                                </>
                            )}
                        </Button>

                        {isProcessing && (
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                        width: `${progress}%`,
                                        background:
                                            'linear-gradient(90deg, #3b82f6, #6366f1)',
                                    }}
                                />
                            </div>
                        )}

                        {/* Tips hanya tampil saat belum ada foto */}
                        {!fotoPreview && (
                            <div className="space-y-1 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                                <p className="font-medium">
                                    Tips agar foto terbaca dengan baik:
                                </p>
                                <ul className="list-inside list-disc space-y-0.5">
                                    <li>Pastikan pencahayaan cukup terang</li>
                                    <li>
                                        Foto KTP secara lurus, tidak miring atau
                                        terpotong
                                    </li>
                                    <li>
                                        Hindari pantulan cahaya/silau pada KTP
                                    </li>
                                    <li>
                                        Proses pemindaian berjalan langsung di
                                        perangkat Anda dan membutuhkan waktu
                                        beberapa detik
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Sudah punya akun?{' '}
                        <TextLink href={login()}>Masuk</TextLink>
                    </div>
                </div>
            </>
        );
    }

    // ── Tahap 2: Form lengkap, sudah terisi otomatis dari OCR ───────
    return (
        <>
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <Alert>
                            <ScanLine className="h-4 w-4" />
                            <AlertTitle>Data terisi dari KTP</AlertTitle>
                            <AlertDescription>
                                Data di bawah diisi otomatis dari KTP Anda dan
                                tidak dapat diubah.{' '}
                                <button
                                    type="button"
                                    onClick={handleFotoUlang}
                                    className="cursor-pointer font-medium underline"
                                >
                                    Foto ulang KTP
                                </button>
                            </AlertDescription>
                        </Alert>

                        {/* Layout 2 kolom di layar lg ke atas */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            {/* Kolom kiri — Data dari KTP (read-only) */}
                            <div className="flex flex-col gap-4">
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Data dari KTP
                                </p>
                                <div className="grid gap-2">
                                    <Label htmlFor="nik">NIK</Label>
                                    <Input
                                        id="nik"
                                        type="text"
                                        required
                                        name="nik"
                                        maxLength={16}
                                        defaultValue={data?.nik ?? ''}
                                        readOnly
                                        className="cursor-not-allowed bg-muted/50 text-muted-foreground"
                                    />
                                    <InputError
                                        message={errors.nik}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        name="nama"
                                        defaultValue={data?.nama ?? ''}
                                        readOnly
                                        className="cursor-not-allowed bg-muted/50 text-muted-foreground"
                                    />
                                    <InputError
                                        message={errors.nama}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="tgl_lahir">
                                            Tanggal Lahir
                                        </Label>
                                        <Input
                                            id="tgl_lahir"
                                            type="date"
                                            required
                                            name="tgl_lahir"
                                            defaultValue={data?.tgl_lahir ?? ''}
                                            readOnly
                                            className="cursor-not-allowed bg-muted/50 text-muted-foreground"
                                        />
                                        <InputError
                                            message={errors.tgl_lahir}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="jenis_kelamin">
                                            Jenis Kelamin
                                        </Label>
                                        <select
                                            id="jenis_kelamin"
                                            name="jenis_kelamin"
                                            required
                                            defaultValue={
                                                data?.jenis_kelamin ?? ''
                                            }
                                            disabled
                                            className="flex h-9 w-full cursor-not-allowed rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-muted-foreground shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                        >
                                            <option value="">Pilih...</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        {/* Hidden input agar nilai tetap terkirim meski select disabled */}
                                        <input
                                            type="hidden"
                                            name="jenis_kelamin"
                                            value={data?.jenis_kelamin ?? ''}
                                        />
                                        <InputError
                                            message={errors.jenis_kelamin}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        type="text"
                                        required
                                        name="alamat"
                                        defaultValue={data?.alamat ?? ''}
                                        readOnly
                                        className="cursor-not-allowed bg-muted/50 text-muted-foreground"
                                    />
                                    <InputError message={errors.alamat} />
                                </div>
                            </div>

                            {/* Kolom kanan — Data tambahan yang diisi pelamar */}
                            <div className="flex flex-col gap-4">
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Data Akun
                                </p>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Alamat Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@contoh.com"
                                    />
                                    <InputError message={errors.email} />
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
                                        type="tel"
                                        name="no_hp"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    <InputError message={errors.no_hp} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Kata Sandi</Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Kata sandi"
                                        passwordrules={passwordRules}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Kata Sandi
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Ulangi kata sandi"
                                        passwordrules={passwordRules}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                {/* <Button
                                    type="submit"
                                    className="mt-2 w-full cursor-pointer"
                                    data-test="register-user-button"
                                >
                                    {processing && <Spinner />}
                                    Buat Akun
                                </Button> */}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="mt-2 cursor-pointer w-sm"
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat Akun
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <TextLink href={login()}>Masuk</TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun Baru',
    description: 'Unggah KTP untuk mendaftar sebagai pelamar',
};
