type Step = {
  id: number;
  label: string;
  done: boolean;
  active: boolean;
};

type Props = {
  steps: Step[];
};

export default function StepIndicator({ steps }: Props) {
  return (
    <nav aria-label="制作流程" className="flex items-center gap-1 sm:gap-2">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1 sm:gap-2">
          <div
            className={[
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:px-3',
              step.active
                ? 'bg-accent-soft text-accent'
                : step.done
                  ? 'text-ink-secondary'
                  : 'text-ink-faint',
            ].join(' ')}
            aria-current={step.active ? 'step' : undefined}
          >
            <span
              className={[
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                step.active
                  ? 'bg-accent text-white'
                  : step.done
                    ? 'bg-ink-secondary text-white'
                    : 'bg-studio-border text-ink-muted',
              ].join(' ')}
            >
              {step.done && !step.active ? '✓' : step.id}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={[
                'h-px w-4 sm:w-8',
                step.done ? 'bg-ink-faint' : 'bg-studio-border',
              ].join(' ')}
              aria-hidden
            />
          )}
        </div>
      ))}
    </nav>
  );
}
