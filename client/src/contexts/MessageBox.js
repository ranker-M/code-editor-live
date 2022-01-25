import {
    createContext, useContext,
    useEffect, useState
} from "react";

const MessageBoxContext = createContext({
    message: "",
    color: "",
    setMessageBox: () => { }
})

export const useMessageBox = () => useContext(MessageBoxContext)

export default function MessageBoxContextProvider({ children }) {
    const [message, setMessage] = useState("Empty");
    const [color, setColor] = useState("white");
    const [timer, setTimer] = useState(null);

    function setMessageBox(message, color = "white") {
        setMessage(message);
        setColor(color);
        var x = document.getElementById("message-window");

        if (!timer) {
            // console.log("new mesagge box created");
            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            let classTimer = setTimeout(function () {
                x.className = x.className.replace("show", "");
                setTimer(null);
            }, 3000);
            setTimer(classTimer);
        } else {
            // console.log("message box restarted");

            // Restart animation and clearTimeout to prevent finishing 
            clearTimeout(timer);
            x.className = x.className.replace("show", "");
            void x.offsetWidth;

            // Start new animation and timer

            // Add the "show" class to DIV
            x.className = "show";

            // After 3 seconds, remove the show class from DIV
            let classTimer = setTimeout(function () {
                x.className = x.className.replace("show", "");
                setTimer(null);
            }, 3000);
            setTimer(classTimer);

        }
    }

    const value = {
        message,
        color,
        setMessageBox
    }

    return <MessageBoxContext.Provider value={value}>
        {children}
    </MessageBoxContext.Provider>

}



