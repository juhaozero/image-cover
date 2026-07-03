type Option<T extends string | number> = {
  value: T;
  label: string;
};

type Props<T extends string | number> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: Props<T>) {
  return (
    <div role="group" aria-label={label} className="segmented">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'segmented-item',
            value === opt.value ? 'segmented-item-active' : 'hover:text-ink-secondary',
          ].join(' ')}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
