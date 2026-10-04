import { Transform } from 'class-transformer';

export function parseBoolean(value: unknown): boolean | undefined {
  const raw = Array.isArray(value) ? value[value.length - 1] : value;

  if (raw === undefined || raw === null || raw === '') {
    return undefined;
  }

  if (raw === true || raw === false) {
    return raw;
  }

  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }

  return undefined;
}

export function ToBoolean() {
  return Transform(({ obj, key }) => parseBoolean(obj[key]));
}
