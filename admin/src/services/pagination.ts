import type { ApiPage } from '../types/api';

const MAX_PAGES = 20;

export const fetchAllPages = async <T>(fetchPage: (page: number) => Promise<ApiPage<T>>): Promise<T[]> => {
  const first = await fetchPage(1);
  const items = [...first.data];
  const last = Math.min(first.meta.totalPages, MAX_PAGES);
  for (let page = 2; page <= last; page += 1) {
    items.push(...(await fetchPage(page)).data);
  }
  return items;
};
