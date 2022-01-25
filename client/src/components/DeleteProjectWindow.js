import axios from 'axios';
import qs from 'qs';
import { useEffect } from 'react';
import { useMessageBox } from '../contexts/MessageBox';
import { useNavigate } from 'react-router-dom';

const DeleteProjectWindow = (props) => {
    const { showWindow } = props;
    const { setMessageBox } = useMessageBox();

    useEffect(() => {
        if (showWindow !== "first") {
            let element = document.getElementById("delete-window-wrapper");
            element.style.display = "flex";
            document.getElementById("delete-project-button").disabled = true;
            document.getElementById("delete-new-project-name").value = "";
        }
    }, [showWindow]);

    function handleOuterClick(e) {
        if (e.target.id == "delete-window-wrapper") {
            closeWindow();
        }
    }

    function closeWindow() {
        let element = document.getElementById("delete-window-wrapper");
        element.style.display = "none";
    }

    function handleDelete() {
        const data = { username: props.username, projectName: props.projectName };
        const options = {
            method: 'DELETE',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: "/delete-project"
        };
        axios(options).then(
            res => {
                setMessageBox(res.data, "lightgreen");
                // To update project list
                props.renderParent();
                closeWindow();
            }).
            catch(err => {
                setMessageBox(err.response.data, "red");
            });
    }

    const handleInput = (e) => {
        if (props.projectName === e.target.value) {
            document.getElementById("delete-project-button").disabled = false;
        } else {
            document.getElementById("delete-project-button").disabled = true;
        }
    }

    return (
        <div id="delete-window-wrapper" onClick={handleOuterClick}>
            <div id="delete-project-window">
                <h1>Delete Project</h1>
                <p>If you delete your project you can't recover it. It will be permanently deleted. Please write <strong>{props.projectName}</strong> to delete your project.</p>
                <input type="text" name="project-name" autoComplete='off'
                    onChange={handleInput} id="delete-new-project-name" />
                <div id="delete-window-button-div">
                    <button id="delete-project-button" onClick={(e) => { handleDelete(e, props.project) }}>Delete</button>
                    <button onClick={closeWindow}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteProjectWindow;