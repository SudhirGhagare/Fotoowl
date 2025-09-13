// src/hooks/useInfiniteImages.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import api, { ImageItem, ImageListResponse } from '../services/api';
import storage from '../services/storage';

type Params = {
  eventId: string|number;
  pageSize?: number;
  key: string;
  order_by?: number;
  order_asc?: boolean;
};

export function useInfiniteImages({ eventId, pageSize = 20, key, order_by = 2, order_asc = true }: Params) {

  const [items, setItems] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadPage = useCallback(async (p = 0, replace = false, externalSignal?: AbortSignal) => {
    
    if (loading) return;
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {

      const url = api.buildImageListUrl({ event_id: eventId, page: p, page_size: pageSize, key, order_by, order_asc });
      const response = await api.fetchWithRetry<ImageListResponse>(url, {}, 3, 10000, externalSignal ?? controller.signal);
      const newItems = response.data.image_list ?? [];
      const updatedItems = replace ? newItems : [...items, ...newItems];
      setItems(prev => updatedItems);

      await storage.saveMetadata(updatedItems);
      setPage(response.data.page ?? p);
      setHasNext(newItems.length >= pageSize); 

    } catch (e: any) {

      if (e?.name === 'CanceledError' || e?.message === 'canceled') {
        // ignore
      } else {
        setError(e);
      }

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  }, 
  [eventId, pageSize, key, order_by, order_asc, loading]);

  const loadNext = useCallback(() => {

    if (loading || !hasNext) return;
    loadPage(page + 1);

  }, 
  [loadPage, loading, hasNext, page]);

  const refresh = useCallback(() => {

    setRefreshing(true);
    loadPage(1, true);

  }, [loadPage]);

  const cancel = useCallback(() => {

    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setRefreshing(false);

  }, []);

  useEffect(() => {

    loadPage(1, true);
    return () => cancel();

  }, [eventId, key, order_by, order_asc]);

  return { items, loading, refreshing, error, hasNext, loadNext, refresh, cancel };
}
