"use client";

import { useState, useEffect } from "react";
import { useMock } from "@/lib/firebase";
import { queryDocs, type QueryOptions } from "@/lib/firestore";

interface UseCollectionOptions<T> extends QueryOptions {
  mockData?: T[];
}

interface UseCollectionResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCollection<T>(
  collectionName: string,
  options: UseCollectionOptions<T> = {}
): UseCollectionResult<T> {
  const { mockData = [], filters, sort, limit, ...rest } = options;
  const [data, setData] = useState<T[]>(useMock ? mockData : []);
  const [loading, setLoading] = useState(!useMock);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = () => setTrigger((t) => t + 1);

  useEffect(() => {
    if (useMock) {
      setData(mockData);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    queryDocs<T>(collectionName, { filters, sort, limit })
      .then((docs) => {
        if (!cancelled) {
          setData(docs);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Erro ao carregar dados");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [collectionName, trigger, useMock]);

  return { data, loading, error, refetch };
}
