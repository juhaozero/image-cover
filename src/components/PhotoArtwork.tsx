import type { InsTemplateId } from '@/types';

const thumbClass: Record<InsTemplateId, string> = {
  polaroid: '',
  magazine: 'thumb-magazine',
  ccd: 'thumb-ccd',
  y2k: 'thumb-y2k',
  cream: 'thumb-cream',
  cinema: 'thumb-cinema',
  note: 'thumb-note',
  filmstrip: 'thumb-filmstrip',
};

export function Landscape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 76" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path className="art-sky" d="M0 0h120v76H0z" />
      <circle className="art-sun" cx="83" cy="22" r="12" />
      <path className="art-ridge" d="M0 48 27 22l17 16 14-9 28 20 20-8 14 6v29H0z" />
      <path className="art-slope" d="M0 58 26 45l19 6 24-10 24 11 27-9v33H0z" />
      <path className="art-foreground" d="M0 66c24-13 48-13 68-6s33 6 52-3v19H0z" />
      <path className="art-light" d="M34 66c12-4 25-3 36 0m-17 5c7-1 14-1 21 1" fill="none" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function TemplateThumb({ id }: { id: InsTemplateId }) {
  return (
    <span className={`template-thumb ${thumbClass[id]}`} aria-hidden="true">
      <span className="thumb-paper"><Landscape className="thumb-image" /></span>
    </span>
  );
}

export function PrintStack() {
  return (
    <div className="print-stack" aria-hidden="true">
      <span className="print-spark print-spark-left">✦</span>
      <span className="print-spark print-spark-right">✧</span>
      <div className="print-sheet print-sheet-back">
        <Landscape className="print-landscape" />
      </div>
      <div className="print-sheet print-sheet-front">
        <Landscape className="print-landscape" />
        <div className="print-caption">
          <span>AFTERNOON LIGHT</span>
          <span>01</span>
        </div>
      </div>
    </div>
  );
}
