import exifr from 'exifr';

export type PhotoMeta = {
  location: string;
  dateTime: string;
};

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'InsPuzzle/1.0' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        county?: string;
        state?: string;
        country?: string;
      };
    };
    const a = data.address;
    if (!a) return null;
    const parts = [a.city ?? a.town ?? a.village ?? a.county, a.state, a.country].filter(Boolean);
    return parts.slice(0, 2).join(' · ') || null;
  } catch {
    return null;
  }
}

async function getBrowserLocation(): Promise<string | null> {
  if (!navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const name = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        resolve(name);
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 60000 },
    );
  });
}

export async function extractPhotoMeta(file: File): Promise<PhotoMeta> {
  let location = '';
  let dateTime = formatDateTime(new Date());

  try {
    const gps = await exifr.gps(file);
    if (gps?.latitude != null && gps?.longitude != null) {
      const name = await reverseGeocode(gps.latitude, gps.longitude);
      if (name) location = name;
    }
  } catch {
    /* ignore */
  }

  try {
    const exif = await exifr.parse(file, { pick: ['DateTimeOriginal', 'CreateDate'] });
    const raw = exif?.DateTimeOriginal ?? exif?.CreateDate;
    if (raw instanceof Date) dateTime = formatDateTime(raw);
  } catch {
    /* ignore */
  }

  if (!location) {
    const browserLoc = await getBrowserLocation();
    if (browserLoc) location = browserLoc;
  }

  if (!location) location = '地点 / 主标题';

  return { location, dateTime };
}
