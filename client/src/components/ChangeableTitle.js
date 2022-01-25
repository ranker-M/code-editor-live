import axios from "axios";
import { useEffect, useState } from "react";
import { useMessageBox } from "../contexts/MessageBox";
import qs from 'qs';

const ChangeableTitle = (props) => {
    const [title, setTitle] = useState(props.title ? props.title : "Untitled-1");
    const { setMessageBox } = useMessageBox();
    const [oldTitle, setOldTitle] = useState(props.title ? props.title : "Untitled-1");

    useEffect(() => {
        // console.log(props.title);
        document.getElementById("changeable-title").style.width = props.title.length + "ch";
        setTitle(props.title);
    }, [props.title]);

    function handleChange(e) {
        // if (e.target.style.width < "4ch") e.target.style.width = "3ch";
        if (e.target.value.length < 4) e.target.style.width = "4ch";
        else e.target.style.width = e.target.value.length + 2 + "ch";
        setTitle(e.target.value);
    }

    function handleOnFocus() {
        setOldTitle(title);
    }

    function handleOnBlur() {
        if (title == "") {
            setMessageBox("Project title cannot be empty", "red");
            let el = document.getElementById("changeable-title");
            el.style.width = oldTitle.length + 2 + "ch";
            setTitle(oldTitle);
        } else if (title == oldTitle) return;
        else {
            if (props.projectId !== "Proxy project") {
                const data = { projectName: title };
                const options = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify(data),
                    url: "/update-projectName/" + props.currentUserName + "/" + props.projectId
                };
                axios(options).then(
                    res => {
                        // console.log(res);
                        setMessageBox(res.data, "lightgreen");
                        props.parentProjectName(title);
                    }).
                    catch(err => {
                        // console.log(err.response)
                        console.log(err);
                        setMessageBox(err.response.data, "red");
                        let el = document.getElementById("changeable-title");
                        el.style.width = oldTitle.length + "ch";
                        setTitle(oldTitle);
                    });
            } else props.parentProjectName(title);
        }
    }

    return (
        <input type="text" name="project-title"
            id="changeable-title" value={title}
            onChange={handleChange} onBlur={handleOnBlur}
            onFocus={handleOnFocus} autoComplete="off"
        />);
}

export default ChangeableTitle;