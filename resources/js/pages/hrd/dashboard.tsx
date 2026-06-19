import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';

export default function DashboardHrd() {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
          <Head title="Dashboard HRD" />
          <div className="p-6">
            <h1 className="text-2xl font-semibold">
                Selamat datang, {auth.user.nama}
            </h1>
            <p className="mt-2 text-muted-foreground">
                Dashboard HRD — masih dalam pengembangan.
            </p>
          </div>
        </>
    );
}
