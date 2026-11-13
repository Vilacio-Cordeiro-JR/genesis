import type { Response } from 'express';
import type { Paginated } from './pagination';

export const sendOk = <T>(res: Response, data: T, status = 200): void => {
  res.status(status).json({ success: true, data });
};

export const sendPage = <T>(res: Response, page: Paginated<T>): void => {
  res.json({
    success: true,
    data: page.items,
    meta: { total: page.total, page: page.page, limit: page.limit, totalPages: page.totalPages },
  });
};
