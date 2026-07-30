import { forwardRef, useEffect, useRef, useState } from 'react';
import CroppedPhoto from '@/components/CroppedPhoto';
import { applyFilterToImage, getFilterMatrix, loadImageSource } from '@/engine/colorEngine';
import {
  formatCcdTimestamp,
  formatPolaroidDate,
  getFontById,
} from '@/engine/insTemplateEngine';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { useEditorStore } from '@/store/editorStore';
import type { InsTemplateId, PhotoFilterId, TemplateOptions } from '@/types';

function useFilteredImage(
  src: string | undefined,
  filterId: PhotoFilterId,
  intensity: number,
): string | undefined {
  const [displaySrc, setDisplaySrc] = useState<string | undefined>();
  const [debouncedIntensity, setDebouncedIntensity] = useState(intensity);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedIntensity(intensity), 80);
    return () => window.clearTimeout(t);
  }, [intensity]);

  useEffect(() => {
    if (!src) {
      setDisplaySrc(undefined);
      return;
    }

    let cancelled = false;
    setDisplaySrc(src);

    const apply = async () => {
      try {
        if (getFilterMatrix(filterId) && debouncedIntensity > 0) {
          const result = await applyFilterToImage(src, filterId, 2048, debouncedIntensity);
          if (cancelled) return;
          if (typeof result === 'string') {
            setDisplaySrc(result);
          } else if (result instanceof HTMLCanvasElement) {
            setDisplaySrc(result.toDataURL('image/jpeg', 0.92));
          } else if (result instanceof HTMLImageElement) {
            setDisplaySrc(result.src);
          }
        } else {
          const img = await loadImageSource(src);
          if (!cancelled) setDisplaySrc(img.src);
        }
      } catch {
        if (!cancelled) setDisplaySrc(src);
      }
    };

    void apply();
    return () => {
      cancelled = true;
    };
  }, [src, filterId, debouncedIntensity]);

  return displaySrc;
}

type TemplateProps = {
  photoSrc: string;
  title: string;
  titleFont: string;
  titleColor: string;
  photoDate: string;
  templateOptions: TemplateOptions;
  previewScale: number;
};

function TitleText({
  children,
  className = '',
  color,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <p
      className={`ins-title-text ${className}`}
      style={{ fontFamily: 'var(--ins-title-font)', ...(color ? { color } : {}) }}
    >
      {children}
    </p>
  );
}

function PolaroidTemplate({
  photoSrc,
  titleFont,
  titleColor,
  photoDate,
  templateOptions,
  previewScale,
}: TemplateProps) {
  const pad = templateOptions.polaroidPadding;
  return (
    <div
      className="ins-template tpl-polaroid"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ['--polaroid-pad' as string]: `${pad}%`,
          ['--polaroid-frame-pad' as string]: `${Math.max(3, pad - 1)}%`,
        } as React.CSSProperties
      }
    >
      <div className="tpl-polaroid__frame">
        <div className="tpl-polaroid__photo-wrap">
          <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
          <div className="tpl-polaroid__vignette" aria-hidden />
        </div>
        {templateOptions.showPolaroidDate && (
          <TitleText className="tpl-polaroid__date" color={titleColor}>
            {formatPolaroidDate(photoDate)}
          </TitleText>
        )}
      </div>
    </div>
  );
}

function MagazineTemplate({
  photoSrc,
  title,
  titleFont,
  titleColor,
  templateOptions,
  previewScale,
}: TemplateProps) {
  return (
    <div className="ins-template tpl-magazine" style={{ ['--ins-title-font' as string]: titleFont }}>
      <div className="tpl-magazine__header">
        <span className="tpl-magazine__issue">{templateOptions.magazineIssue || 'Kinfolk · Editorial'}</span>
        <span className="tpl-magazine__page">{templateOptions.magazinePage || 'No. 01'}</span>
      </div>
      <div className="tpl-magazine__photo-wrap tpl-magazine__photo-wrap--left">
        <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
      </div>
      {title && (
        <TitleText className="tpl-magazine__title" color={titleColor}>
          {title}
        </TitleText>
      )}
      {templateOptions.magazineSubtitle && (
        <p className="tpl-magazine__subtitle">{templateOptions.magazineSubtitle}</p>
      )}
      <div className="tpl-magazine__divider" />
    </div>
  );
}

function CcdTemplate({ photoSrc, title, photoDate, previewScale }: TemplateProps) {
  return (
    <div className="ins-template tpl-ccd">
      <div className="tpl-ccd__viewfinder">
        <div className="tpl-ccd__photo-wrap">
          <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
          <div className="tpl-ccd__noise" aria-hidden />
          <div className="tpl-ccd__flash" aria-hidden />
          <span className="tpl-ccd__rec">● REC</span>
          {title && <span className="tpl-ccd__caption">{title}</span>}
          <span className="tpl-ccd__timestamp">{formatCcdTimestamp(photoDate)}</span>
        </div>
      </div>
    </div>
  );
}

function Y2kTemplate({ photoSrc, title, titleFont, titleColor, previewScale }: TemplateProps) {
  const displayTitle = title || 'Y2K';
  return (
    <div className="ins-template tpl-y2k" style={{ ['--ins-title-font' as string]: titleFont }}>
      <div className="tpl-y2k__window">
        <div className="tpl-y2k__titlebar">
          <span className="tpl-y2k__hearts">♥ ♥ ♥</span>
          <span className="tpl-y2k__win-btns">
            <span>_</span>
            <span>□</span>
            <span>×</span>
          </span>
        </div>

        <div className="tpl-y2k__body">
          <div className="tpl-y2k__holo-bg" aria-hidden />

          <div className="tpl-y2k__logo-block">
            <span className="tpl-y2k__logo">Y2K</span>
            <span className="tpl-y2k__millennium">MILLENNIUM</span>
          </div>

          <div className="tpl-y2k__collage">
            <div className="tpl-y2k__main">
              <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
              <div className="tpl-y2k__main-holo" aria-hidden />
            </div>

            <div className="tpl-y2k__mini tpl-y2k__mini--1">
              <CroppedPhoto src={photoSrc} />
            </div>
            <div className="tpl-y2k__mini tpl-y2k__mini--2">
              <CroppedPhoto src={photoSrc} />
            </div>

            <div className="tpl-y2k__cd tpl-y2k__cd--1" aria-hidden />
            <div className="tpl-y2k__cd tpl-y2k__cd--2" aria-hidden />
            <div className="tpl-y2k__cd tpl-y2k__cd--3" aria-hidden />

            <div className="tpl-y2k__popup">
              <div className="tpl-y2k__popup-bar">Message</div>
              <div className="tpl-y2k__popup-body">
                <span className="tpl-y2k__popup-icon">!</span>
                <span>Save changes?</span>
              </div>
              <div className="tpl-y2k__popup-btns">
                <span>Yes</span>
                <span>No</span>
              </div>
            </div>

            <div className="tpl-y2k__disk">DISK CAD</div>

            <div className="tpl-y2k__barcode">
              <div className="tpl-y2k__barcode-lines" />
              <span>8 809432 001234</span>
            </div>

            <div className="tpl-y2k__stickers" aria-hidden>
              <span>♥</span>
              <span>✦</span>
            </div>
          </div>

          {displayTitle && (
            <TitleText className="tpl-y2k__user-title" color={titleColor}>
              {displayTitle}
            </TitleText>
          )}

          <p className="tpl-y2k__symbols">✦ ✧ ✵ ♡ ✦ ✧</p>
        </div>
      </div>
    </div>
  );
}

function CreamTemplate({ photoSrc, title, titleFont, titleColor, previewScale }: TemplateProps) {
  return (
    <div className="ins-template tpl-cream" style={{ ['--ins-title-font' as string]: titleFont }}>
      <div className="tpl-cream__photo-wrap">
        <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
        <div className="tpl-cream__softlight" aria-hidden />
      </div>
      {title && (
        <div className="tpl-cream__title-wrap">
          <TitleText className="tpl-cream__title" color={titleColor}>
            {title}
          </TitleText>
        </div>
      )}
      <p className="tpl-cream__emoji">☁️ 🌸 ✨</p>
    </div>
  );
}

function renderTemplate(id: InsTemplateId, props: TemplateProps) {
  switch (id) {
    case 'polaroid':
      return <PolaroidTemplate {...props} />;
    case 'magazine':
      return <MagazineTemplate {...props} />;
    case 'ccd':
      return <CcdTemplate {...props} />;
    case 'y2k':
      return <Y2kTemplate {...props} />;
    case 'cream':
      return <CreamTemplate {...props} />;
    default:
      return <PolaroidTemplate {...props} />;
  }
}

type Props = {
  previewScale?: number;
};

const InsPreview = forwardRef<HTMLDivElement, Props>(function InsPreview(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const image = useEditorStore((s) => s.image);
  const templateId = useEditorStore((s) => s.templateId);
  const filterId = useEditorStore((s) => s.filterId);
  const filterIntensity = useEditorStore((s) => s.filterIntensity);
  const title = useEditorStore((s) => s.title);
  const fontId = useEditorStore((s) => s.fontId);
  const titleColor = useEditorStore((s) => s.titleColor);
  const photoDate = useEditorStore((s) => s.photoDate);
  const outputSizeId = useEditorStore((s) => s.outputSizeId);
  const templateOptions = useEditorStore((s) => s.templateOptions);

  const canvasSize = useCanvasSize();
  const exportW = canvasSize?.width ?? 1080;
  const exportH = canvasSize?.height ?? 1350;
  const photoSrc = useFilteredImage(image?.src, filterId, filterIntensity);
  const font = getFontById(fontId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !canvasSize) return;

    const update = () => {
      const pad = 48;
      const maxW = el.clientWidth - pad;
      const maxH = el.clientHeight - pad;
      const scaleW = maxW / exportW;
      const scaleH = maxH / exportH;
      setScale(Math.min(scaleW, scaleH, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasSize, exportW, exportH]);

  const displayW = exportW * scale;
  const displayH = exportH * scale;

  const templateProps: TemplateProps = {
    photoSrc: photoSrc ?? '',
    title,
    titleFont: font.family,
    titleColor,
    photoDate,
    templateOptions,
    previewScale: scale,
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col lg:min-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between border-b border-studio-border px-4 py-3 lg:px-6">
        <div>
          <h2 className="text-sm font-semibold text-ink">拼图预览</h2>
          <p className="text-[11px] text-ink-muted">
            {canvasSize
              ? `${exportW} × ${exportH} px · 拖拽平移 / 滚轮缩放照片`
              : '上传照片后开始'}
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="canvas-matte relative flex flex-1 items-center justify-center p-6 sm:p-10"
      >
        {!image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
              📷
            </div>
            <p className="text-sm font-medium text-white/50">上传一张照片开始</p>
            <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/30">
              选择 INS 风模板，一键导出
            </p>
          </div>
        )}

        {image && canvasSize && photoSrc && (
          <div
            className="overflow-hidden shadow-canvas ring-1 ring-white/10"
            style={{ width: displayW, height: displayH }}
          >
            <div
              style={{
                width: exportW,
                height: exportH,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div
                ref={ref}
                key={`${outputSizeId}-${exportW}x${exportH}`}
                className="ins-export-root"
                style={{ width: exportW, height: exportH }}
              >
                {renderTemplate(templateId, templateProps)}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default InsPreview;
