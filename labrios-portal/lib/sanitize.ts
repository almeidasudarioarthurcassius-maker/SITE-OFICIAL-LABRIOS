export function sanitizeFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  const rawName = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
  const rawExt = lastDot > 0 ? fileName.slice(lastDot + 1) : '';

  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');

  const cleanName = normalize(rawName) || 'arquivo';
  const cleanExt = normalize(rawExt);

  return cleanExt ? `${cleanName}.${cleanExt}` : cleanName;
}
