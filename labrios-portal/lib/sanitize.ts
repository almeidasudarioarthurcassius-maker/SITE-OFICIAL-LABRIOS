// lib/sanitize.ts
// Gera nomes de arquivo seguros para o Supabase Storage.
// O Storage do Supabase só aceita chaves com caracteres ASCII
// (letras sem acento, números, ".", "_" e "-"). Nomes de arquivo
// com acentuação, cedilha, espaços ou outros símbolos (comuns em
// PDFs como "Relatório_março_2026.pdf") são rejeitados com o erro
// "Invalid key". Esta função remove acentos e troca qualquer
// caractere não permitido por "_", preservando a extensão.
export function sanitizeFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  const rawName = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
  const rawExt = lastDot > 0 ? fileName.slice(lastDot + 1) : '';

  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos (á, ã, ç, etc.)
      .replace(/[^a-zA-Z0-9._-]/g, '_') // troca qualquer outro símbolo por "_"
      .replace(/_+/g, '_') // colapsa underscores repetidos
      .replace(/^_+|_+$/g, ''); // remove underscores nas pontas

  const cleanName = normalize(rawName) || 'arquivo';
  const cleanExt = normalize(rawExt);

  return cleanExt ? `${cleanName}.${cleanExt}` : cleanName;
}
