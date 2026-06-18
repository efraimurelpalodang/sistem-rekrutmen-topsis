import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
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
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="nik">NIK</Label>
                                <Input
                                    id="nik"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    name="nik"
                                    placeholder="16 digit NIK sesuai KTP"
                                    maxLength={16}
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
                                    tabIndex={2}
                                    autoComplete="name"
                                    name="nama"
                                    placeholder="Nama lengkap sesuai KTP"
                                />
                                <InputError
                                    message={errors.nama}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={3}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@contoh.com"
                                />
                                <InputError message={errors.email} />
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
                                        tabIndex={4}
                                        name="tgl_lahir"
                                    />
                                    <InputError message={errors.tgl_lahir} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="jenis_kelamin">
                                        Jenis Kelamin
                                    </Label>
                                    <select
                                        id="jenis_kelamin"
                                        name="jenis_kelamin"
                                        required
                                        tabIndex={5}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <option value="">Pilih...</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
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
                                    tabIndex={6}
                                    name="alamat"
                                    placeholder="Alamat lengkap sesuai KTP"
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
                                    type="tel"
                                    tabIndex={7}
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
                                    tabIndex={8}
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
                                    tabIndex={9}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={10}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat Akun
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={11}>
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun Baru',
    description: 'Isi data diri Anda untuk mendaftar sebagai pelamar',
};
