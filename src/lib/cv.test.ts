import { describe, expect, it } from 'vitest';
import { isPdfPath } from './cv';

describe('CV file validation', () => {
  it('accepts PDF paths regardless of extension casing', () => {
    expect(isPdfPath('/files/cv/resume.pdf')).toBe(true);
    expect(isPdfPath('/files/cv/resume.PDF')).toBe(true);
  });

  it('rejects missing and non-PDF files', () => {
    expect(isPdfPath('/files/cv/resume.docx')).toBe(false);
    expect(isPdfPath(null)).toBe(false);
  });
});
