export type User = {
    id: number;
    nama: string;
    email: string;
    role: 'pelamar' | 'hrd' | 'admin';
    avatar?: string;
    nik?: string | null;
    tgl_lahir?: string | null;
    jenis_kelamin?: 'L' | 'P' | null;
    alamat?: string | null;
    no_hp?: string | null;
    foto_profil?: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
