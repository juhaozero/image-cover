import { forwardRef, useEffect, useRef, useState } from 'react';
import CroppedPhoto from '@/components/CroppedPhoto';
import { IconPhotoAdd } from './icons';
import { PrintStack } from './PhotoArtwork';
import { applyFilterToImage, getFilterMatrix, loadImageSource } from '@/engine/colorEngine';
import {
  formatCcdTimestamp,
  formatPolaroidDate,
  getFontById,
  getTemplateById,
} from '@/engine/insTemplateEngine';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { useEditorStore } from '@/store/editorStore';
import { DEFAULT_THEME, themeToCssVars } from '@/engine/themeEngine';
import type { InsTemplateId, PhotoFilterId, TemplateOptions } from '@/types';
import type { CSSProperties } from 'react';

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
  themeStyle: CSSProperties;
  paletteDriven: boolean;
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
  themeStyle,
  paletteDriven,
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
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
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
  themeStyle,
  paletteDriven,
}: TemplateProps) {
  return (
    <div
      className="ins-template tpl-magazine"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
      }
    >
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

function CreamTemplate({
  photoSrc,
  title,
  titleFont,
  titleColor,
  previewScale,
  themeStyle,
  paletteDriven,
}: TemplateProps) {
  return (
    <div
      className="ins-template tpl-cream"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
      }
    >
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

function CinemaTemplate({
  photoSrc,
  title,
  titleFont,
  titleColor,
  previewScale,
  themeStyle,
  paletteDriven,
}: TemplateProps) {
  return (
    <div
      className="ins-template tpl-cinema"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
      }
    >
      <div className="tpl-cinema__bar tpl-cinema__bar--top" aria-hidden />
      <div className="tpl-cinema__frame">
        <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
      </div>
      <div className="tpl-cinema__bar tpl-cinema__bar--bottom">
        {title && (
          <TitleText className="tpl-cinema__caption" color={titleColor || '#f5f5f4'}>
            {title}
          </TitleText>
        )}
      </div>
    </div>
  );
}

function NoteTemplate({
  photoSrc,
  title,
  titleFont,
  titleColor,
  photoDate,
  previewScale,
  themeStyle,
  paletteDriven,
}: TemplateProps) {
  return (
    <div
      className="ins-template tpl-note"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
      }
    >
      <div className="tpl-note__tape" aria-hidden />
      <div className="tpl-note__card">
        <div className="tpl-note__photo-wrap">
          <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
        </div>
        {title && (
          <TitleText className="tpl-note__title" color={titleColor}>
            {title}
          </TitleText>
        )}
        <p className="tpl-note__meta">{formatPolaroidDate(photoDate)}</p>
      </div>
      <div className="tpl-note__sticker" aria-hidden>
        ✦
      </div>
    </div>
  );
}

function FilmstripTemplate({
  photoSrc,
  title,
  titleFont,
  titleColor,
  photoDate,
  previewScale,
  themeStyle,
  paletteDriven,
}: TemplateProps) {
  return (
    <div
      className="ins-template tpl-filmstrip"
      style={
        {
          ['--ins-title-font' as string]: titleFont,
          ...(paletteDriven ? themeStyle : {}),
        } as CSSProperties
      }
    >
      <div className="tpl-filmstrip__sprocket tpl-filmstrip__sprocket--left" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={`l-${i}`} />
        ))}
      </div>
      <div className="tpl-filmstrip__body">
        <div className="tpl-filmstrip__photo-wrap">
          <CroppedPhoto src={photoSrc} interactive previewScale={previewScale} />
        </div>
        <div className="tpl-filmstrip__footer">
          <span className="tpl-filmstrip__code">35mm · {formatCcdTimestamp(photoDate)}</span>
          {title && (
            <TitleText className="tpl-filmstrip__title" color={titleColor || '#e7e5e4'}>
              {title}
            </TitleText>
          )}
        </div>
      </div>
      <div className="tpl-filmstrip__sprocket tpl-filmstrip__sprocket--right" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={`r-${i}`} />
        ))}
      </div>
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
    case 'cinema':
      return <CinemaTemplate {...props} />;
    case 'note':
      return <NoteTemplate {...props} />;
    case 'filmstrip':
      return <FilmstripTemplate {...props} />;
    default:
      return <PolaroidTemplate {...props} />;
  }
}

type Props = {
  onPickPhoto: () => void;
};

const InsPreview = forwardRef<HTMLDivElement, Props>(function InsPreview({ onPickPhoto }, ref) {
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
  const paletteDriven = useEditorStore((s) => s.paletteDriven);
  const themeColors = useEditorStore((s) => s.themeColors);

  const canvasSize = useCanvasSize();
  const exportW = canvasSize?.width ?? 1080;
  const exportH = canvasSize?.height ?? 1350;
  const photoSrc = useFilteredImage(image?.src, filterId, filterIntensity);
  const font = getFontById(fontId);
  const themeStyle = themeToCssVars(paletteDriven ? themeColors : DEFAULT_THEME);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !canvasSize) return;

    const update = () => {
      const pad = el.clientWidth < 480 ? 32 : 64;
      const maxW = el.clientWidth - pad;
      const maxH = el.clientHeight - pad;
      const scaleW = maxW / exportW;
      const scaleH = maxH / exportH;
      setScale(Math.max(0, Math.min(scaleW, scaleH, 1)));
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
    themeStyle,
    paletteDriven,
  };

  return (
    <section className="panel preview-panel min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2" aria-labelledby="preview-heading">
      <div className="preview-toolbar">
        <div className="min-w-0">
          <h2 id="preview-heading" className="panel-title">
            <span className="step-number" aria-hidden="true">03</span>拼图预览
          </h2>
        </div>
        <span className="studio-label truncate rounded-md bg-studio-muted px-2.5 py-1.5">{getTemplateById(templateId).name}</span>
      </div>

      <div ref={containerRef} className="canvas-matte">
        <span className="canvas-corner canvas-corner-tl" aria-hidden="true" />
        <span className="canvas-corner canvas-corner-tr" aria-hidden="true" />
        <span className="canvas-corner canvas-corner-bl" aria-hidden="true" />
        <span className="canvas-corner canvas-corner-br" aria-hidden="true" />
        {!image && (
          <div className="preview-empty">
            <PrintStack />
            <p className="preview-empty-title">从一张照片开始</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">把日常的光影，装进喜欢的相框。</p>
            <button type="button" className="preview-pick" onClick={onPickPhoto}>
              <IconPhotoAdd size={17} /> 选择照片
            </button>
          </div>
        )}

        {image && canvasSize && photoSrc && (
          <div
            className="relative overflow-hidden shadow-canvas ring-1 ring-studio-border"
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
      <div className="preview-status">
        <span className="studio-label flex items-center gap-2"><span className="canvas-indicator" aria-hidden="true" />画布</span>
        <span className="text-right">
          {canvasSize ? `${exportW} × ${exportH} px · 拖拽平移 / 滚轮缩放` : '上传照片后显示预览'}
        </span>
      </div>
    </section>
  );
});

export default InsPreview;
