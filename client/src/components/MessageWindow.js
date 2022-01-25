import { useEffect } from "react";
import { useMessageBox } from "../contexts/MessageBox";

const MessageWindow = () => {

    let { color, message } = useMessageBox();

    useEffect(() => {
        const el = document.querySelector("#message-window");
        try {
            el.style.color = color;
        } catch (err) {
            console.log("Invalid color style for Loading animation!");
        }
    }, [color, message]);

    return (<div id="message-window">
        {message}
    </div>);
}

export default MessageWindow;