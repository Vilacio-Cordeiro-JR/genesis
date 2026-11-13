import DOMPurify from 'dompurify';

const decodeEntities = (html: string): string => new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';

export const sanitizeInput = (input: string): string =>
  decodeEntities(DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })).trim();
