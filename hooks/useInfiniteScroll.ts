import { useEffect } from "react";

export function useInfiniteScroll(
  hasMore: boolean,
  loading: boolean,
  setPage: React.Dispatch<React.SetStateAction<number>>
) {
  useEffect(() => {
    const onScroll = () => {
      if (!hasMore || loading) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, loading, setPage]);
}
