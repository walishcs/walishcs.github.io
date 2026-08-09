export function isPdfPath(path: string | null | undefined): path is string {
  return Boolean(path && path.toLowerCase().endsWith('.pdf'));
}
