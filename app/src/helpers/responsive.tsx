import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setIsMobile } from "./slice";

export default function Responsive() {
    const dispatch = useDispatch();
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize((prevSize) => ({
                width: window.innerWidth,
                height: window.innerHeight,
            }));

            dispatch(setIsMobile(window.innerWidth <= 480));
        };

        window.addEventListener("resize", handleResize);
        handleResize(); 

        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    return screenSize;
}
