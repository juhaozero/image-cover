import { Icon, stroke, type IconProps } from './Icon';

export function IconPhotoAdd(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="6" width="14" height="12" rx="2" {...stroke} />
      <circle cx="8" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3.5 15l3.5-3 2.5 2 2-1.5L17.5 15.5" {...stroke} />
      <circle cx="18" cy="6.5" r="3" {...stroke} />
      <path d="M18 5v3M16.5 6.5h3" {...stroke} />
    </Icon>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5v10" {...stroke} />
      <path d="M8.5 10 12 13.5 15.5 10" {...stroke} />
      <path
        d="M5 14.5v3.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-3.5"
        {...stroke}
      />
    </Icon>
  );
}

export function IconMove(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5v4M12 15.5v4" {...stroke} />
      <path d="M4.5 12h4M15.5 12h4" {...stroke} />
      <path d="M10 6.5 12 4.5 14 6.5" {...stroke} />
      <path d="M10 17.5 12 19.5 14 17.5" {...stroke} />
      <path d="M6.5 10 4.5 12 6.5 14" {...stroke} />
      <path d="M17.5 10 19.5 12 17.5 14" {...stroke} />
    </Icon>
  );
}

export function IconZoom(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10.5" cy="10.5" r="5.75" {...stroke} />
      <path d="M15 15l4 4" {...stroke} />
      <path d="M10.5 8v5M8 10.5h5" {...stroke} />
    </Icon>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 12.5 10 16.5 18 7.5" {...stroke} strokeWidth={2.25} />
    </Icon>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 8l8 8M16 8l-8 8" {...stroke} strokeWidth={2} />
    </Icon>
  );
}

export function IconCanvasEmpty(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} strokeDasharray="3 3" />
      <path d="M3 16l5.5-4.5 3.5 2.5 3-2.5L21 16" {...stroke} opacity="0.6" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" opacity="0.5" />
    </Icon>
  );
}

export function IconTemplate(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" {...stroke} />
      <rect x="13" y="3" width="8" height="8" rx="1.5" {...stroke} />
      <rect x="3" y="13" width="8" height="8" rx="1.5" {...stroke} />
      <rect
        x="12"
        y="12"
        width="8"
        height="8"
        rx="1.5"
        {...stroke}
        transform="rotate(6 16 16)"
      />
    </Icon>
  );
}

export function IconSpinner(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        d="M12 3a9 9 0 1 0 9 9"
        {...stroke}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Icon>
  );
}

export { Logo } from './Logo';
