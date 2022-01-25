import axios from 'axios';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { optionList, exampleCode } from "../components/CodeEditorImports"
import { useMessageBox } from '../contexts/MessageBox';
import { useNavigate } from 'react-router-dom';

const CreateProjectWindow = (props) => {
    const [language, setLanguage] = useState('cpp');
    const [projectName, setProjectName] = useState("");
    const { user, showSelf } = props;
    const { setMessageBox } = useMessageBox();
    const navigate = useNavigate();

    useEffect(() => {
        if (showSelf !== "first") {
            let element = document.getElementById("project-window-wrapper");
            element.style.display = "flex";
        }
    }, [showSelf]);

    function handleOuterClick(e) {
        if (e.target.id == "project-window-wrapper") {
            let element = document.getElementById("project-window-wrapper");
            element.style.display = "none";
        }
    }

    function handleCreateProject() {
        // Empty project title rejection
        if (projectName == "") {
            setMessageBox("Project title can't be empty", "red");
            return;
        }
        // Project creation request
        const data = { username: user.email, language: language, projectName: projectName, code: exampleCode[language] };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: "/add-project"
        };
        axios(options).then(
            result => {
                // console.log(result);
                setMessageBox("Project succesfully created", "lightgreen");
                navigate("/playground/" + result.data._id, {
                    state: { projectName: projectName, language: language, code: data.code }
                });
            }).
            catch(err => {
                // console.log(err.response)
                setMessageBox(err.response.data, "red");
            });
    }


    const selectLanguage = (e) => {
        setLanguage(e.target.value);
    }

    const selectProjectName = (e) => {
        setProjectName(e.target.value);
    }

    return (
        <div id="project-window-wrapper" onClick={handleOuterClick}>
            <div id="create-project-window">
                <label >Project Name:</label>
                <input type="text" name="project-name" onChange={selectProjectName} id="create-new-project-name" />
                <label>Lanuage:</label>
                <select defaultValue="cpp" onChange={selectLanguage} className="lang-select editor-options">
                    {Object.keys(optionList.languages).map(el =>
                        <option key={el}>{el}</option>
                    )}
                </select>
                <button onClick={handleCreateProject}>Create Project</button>
            </div>
        </div>
    );
}

export default CreateProjectWindow;