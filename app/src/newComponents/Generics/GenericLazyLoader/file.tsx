import React, { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../helpers/axiosModified';
import { Holder } from '../GenericHolders/file';
import { ConditionalRendererWithDefault } from '../GenericConditionlRender/file';



type GenericLoaderConfig = {
    url: string;
    Element: React.FC<{ item: any }>;
    style?: CSSProperties;
    className?: string;
    mapFunction?: (value: any, index: number) => {};
    reversed?:boolean
}


export const GenericLazyLoader: React.FC<GenericLoaderConfig> = ({ url, Element, style, className, mapFunction ,reversed=true}) => {
    const [items, setItems] = useState<[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const loadItems = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const newItems = await axiosInstance.get(`${url}&page=${page}`) as [];
        if (mapFunction) {
            newItems.map(mapFunction);
        }
        if (newItems.length == 0) {
            setHasMore(false);
        }
        console.log("Items Received : ", newItems);
        setPage(prev => prev + 1);
        await setItems(oldItems => [...oldItems, ...newItems]);
        setIsLoading(false);
    }

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {

            if (entries[0].isIntersecting && hasMore && !isLoading) {
                loadItems();
            }
        }, [isLoading, hasMore]);

    useEffect(() => {
        loadItems();
    }, [])
    useEffect(() => {
        if (!hasMore || !observerRef.current) return;

        const observer = new IntersectionObserver(observerCallback)
        observer.observe(observerRef.current);

        return () => observer.disconnect();

    }, [items.length, observerCallback, observerRef, hasMore]);

    return (
        <Holder direction='vertical'>
            <ConditionalRendererWithDefault
                condition={items.length == 0}
                component={"Nothing For Now comback later"}
                defaultComponent={<Holder style={style}>
                    {items.map((value: any, index) => <Element item={value} key={index} />)}
                    {hasMore && <div ref={observerRef}
                        className='observer'></div>}

                </Holder>

                }
            />
        </Holder>
    )
}

