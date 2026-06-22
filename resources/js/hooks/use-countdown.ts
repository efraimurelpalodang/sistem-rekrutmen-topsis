import { useEffect, useRef, useState } from 'react';

type UseCountdownOptions = {
    onExpire?: () => void;
};

/**
 * Hook countdown timer. Menerima jumlah detik awal, menghitung mundur
 * tiap detik, dan memanggil onExpire saat mencapai 0.
 */
export function useCountdown(
    initialSeconds: number,
    options: UseCountdownOptions = {},
) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const onExpireRef = useRef(options.onExpire);
    const hasExpiredRef = useRef(false);

    // Selalu pakai callback terbaru tanpa perlu re-subscribe interval
    onExpireRef.current = options.onExpire;

    useEffect(() => {
        if (secondsLeft <= 0) {
            if (!hasExpiredRef.current) {
                hasExpiredRef.current = true;
                onExpireRef.current?.();
            }
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft <= 0]);

    const jam = Math.floor(secondsLeft / 3600);
    const menit = Math.floor((secondsLeft % 3600) / 60);
    const detik = secondsLeft % 60;

    const formatted =
        jam > 0
            ? `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`
            : `${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;

    return {
        secondsLeft,
        formatted,
        isExpired: secondsLeft <= 0,
        isWarning: secondsLeft <= 300 && secondsLeft > 0, // 5 menit terakhir
    };
}
