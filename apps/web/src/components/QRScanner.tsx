import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (data: string) => void;
  onError?: (err: string) => void;
}

export default function QRScanner({ onScan, onError }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = 'qr-reader-' + Date.now();
    if (containerRef.current) {
      containerRef.current.id = id;
    }

    const scanner = new Html5Qrcode(id);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop().catch(() => {});
        onScan(decodedText);
      },
      () => {}
    ).catch((err) => {
      onError?.(String(err));
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan, onError]);

  return <div ref={containerRef} className="w-full rounded-2xl overflow-hidden" />;
}
