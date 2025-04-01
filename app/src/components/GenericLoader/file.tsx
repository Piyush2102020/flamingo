import React, { useEffect, useState, useRef, useCallback, CSSProperties } from "react";
import axiosInstance from "../../helpers/axiosModified";
import "./style.css";

interface LoaderProps<T> {
  url: string;
  Element?: React.FC<{ item: any }>;
  style?:CSSProperties
}

export default function GenericLoader<T>({ url, Element ,style}: LoaderProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);


  const chatBoxRef=useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
}, [items]); // Trigger only when new messages are added

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [url]);

  const LoadMore = async () => {
    if (isFetching || !hasMore) return; 

    setIsFetching(true);
    try {
      console.log("Fetching page:", page ,"Url : ",url);
      const response = await axiosInstance.get(`${url}&page=${page}`);
      const data = response 
      console.log("Response : ",response);
      
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); 
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (navigator.onLine) {
      LoadMore();
    } else {
      setHasMore(false);
    }
  }, []); 

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isFetching && hasMore) {
        console.log("Loading more items...");
        LoadMore();
      }
    },
    [isFetching, hasMore]
  );

  useEffect(() => {
    if (!hasMore || !observerRef.current) return;

    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [observerCallback, items.length, hasMore]);

  return (
    <div ref={chatBoxRef} style={style} className="loader-container">
      {Element
        ? items.map((value, index) => <Element key={index} item={value} />)
        : items.map((value: any, index) => <h1 key={index}>{value._id}</h1>)}

      {hasMore && (
        <div
          ref={observerRef}
          style={{
            height: "100px",
            backgroundColor: "transparent",
            textAlign: "center",
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
