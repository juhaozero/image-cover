import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  variant?: 'brand' | 'mono' | 'mark';
};

/** SnapLayout 品牌标识 — 四格拼图 + 叠层胶片感 */
export function Logo({ size = 32, variant = 'brand', className, ...props }: LogoProps) {
  if (variant === 'mark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        aria-hidden
        {...props}
      >
        <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
        <rect x="6.5" y="6.5" width="8" height="8" rx="1.5" fill="#fff" />
        <rect x="17.5" y="6.5" width="8" height="8" rx="1.5" fill="#fff" opacity="0.88" />
        <rect x="6.5" y="17.5" width="8" height="8" rx="1.5" fill="#fff" opacity="0.88" />
        <rect
          x="15"
          y="15"
          width="8"
          height="8"
          rx="1.5"
          fill="#FFE4E6"
          stroke="#fff"
          strokeWidth="1.2"
          transform="rotate(6 19 19)"
        />
        <defs>
          <linearGradient id="logo-bg" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FB7185" />
            <stop stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 'mono') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        aria-hidden
        {...props}
      >
        <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none" />
        <rect x="18" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none" />
        <rect x="5" y="18" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.75" fill="none" />
        <rect
          x="16"
          y="16"
          width="9"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.75"
          fill="currentColor"
          fillOpacity="0.12"
          transform="rotate(8 20.5 20.5)"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-bg-brand)" />
      <rect x="6.5" y="6.5" width="8" height="8" rx="1.5" fill="#fff" />
      <rect x="17.5" y="6.5" width="8" height="8" rx="1.5" fill="#fff" opacity="0.9" />
      <rect x="6.5" y="17.5" width="8" height="8" rx="1.5" fill="#fff" opacity="0.9" />
      <rect
        x="15"
        y="15"
        width="8"
        height="8"
        rx="1.5"
        fill="#FFE4E6"
        stroke="#fff"
        strokeWidth="1.2"
        transform="rotate(6 19 19)"
      />
      <defs>
        <linearGradient id="logo-bg-brand" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop stopColor="#E11D48" />
        </linearGradient>
      </defs>
    </svg>
  );
}
