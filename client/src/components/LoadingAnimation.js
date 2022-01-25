import { useEffect } from "react";

const Loading = (props) => {
    let { color } = props;

    useEffect(() => {
        if (color == null) {
            color = "white";
        }
        try {
            document.querySelectorAll("#lds-ring div").forEach(el => {
                el.style.borderColor = color + " transparent transparent transparent"
            });
        } catch (err) {
            console.log("Invalid color prop for Loading animation!");
        }
    }, [])


    return <div id="lds-ring-wrapper"><div id="lds-ring"><div></div><div></div><div></div><div></div></div></div>;
}

export default Loading;