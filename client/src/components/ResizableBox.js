import { useEffect, useRef, useState } from "react";
import "../styles/ResizableBox.css";

const ResizableBox = ({ children, props }) => {
    const refer = useRef();

    const [update, setUpdate] = useState(false);
    // console.log(refer.current);

    // The current position of mouse
    var x = 0;
    var y = 0;

    // The dimension of the element
    var w = 0;
    var h = 0;

    // useEffect(() => {
    //     console.log(ele);
    // }, [])

    const mouseDownHandler = function (e) {
        let ele = refer.current;
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;

        // Calculate the dimension of element
        const styles = window.getComputedStyle(ele);
        w = parseInt(styles.width, 10);
        h = parseInt(styles.height, 10);

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        let ele = refer.current;
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        // Adjust the dimension of element
        if (!(props.bottom || props.top)) {
            if (w + dx < 12) {
                ele.style.width = "12px";
                return;
            }
            ele.style.width = `${w + dx}px`;
        }
        if (!(props.right || props.left)) {
            if (h + dy < 12) {
                ele.style.height = "12px";
                return;
            }
            ele.style.height = `${h + dy}px`;
        }
    };

    const mouseUpHandler = function () {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    useEffect(() => {
        var ele = refer.current;
        const resizers = ele.querySelectorAll('.resizer');
        [].forEach.call(resizers, function (resizer) {
            resizer.addEventListener('mousedown', mouseDownHandler);
        });
        if (!(props.bottom || props.top)) {
            ele.style.width = "50%";
        }
        if (!(props.right || props.left)) {
            ele.style.height = "50%";
        }

    }, [update])

    return (<div ref={refer} onLoad={() => setUpdate(true)} className="resizable resizeMe">
        {children}
        {props.right && <div className="resizer resizer-r"></div>}
        {props.bottom && <div className="resizer resizer-b"></div>}
    </div>);
}

export default ResizableBox;