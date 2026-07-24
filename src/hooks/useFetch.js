import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn({ signal: abortController.signal });
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          // ignore aborted requests
        } else if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted && abortControllerRef.current === abortController) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, setData, setLoading };
}
