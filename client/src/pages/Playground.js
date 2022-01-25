import '../styles/playgroundPage.css'
import { useEffect, useState } from "react";
import ChangeableTitle from '../components/ChangeableTitle';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';

import CodeMirror from "@uiw/react-codemirror";
import { optionList } from "../components/CodeEditorImports"

import axios from 'axios';
import qs from 'qs';
import { useMessageBox } from '../contexts/MessageBox';
import Loading from '../components/LoadingAnimation';
import ResizableBox from '../components/ResizableBox';

const Playground = (props) => {
    const { state } = useLocation();
    const [theme, setTheme] = useState("dark");
    const [language, setlanguage] = useState(state.language);
    const [code, setCode] = useState(state.code);
    const [projectName, setProjectName] = useState("")
    const params = useParams();
    const [renderState, setRenderState] = useState(false);
    const { currentUser } = useAuth();
    const { setMessageBox } = useMessageBox();
    const [output, setOutput] = useState({ time: "", output: "Output will be displayed here..." });
    const [input, setInput] = useState("");

    useEffect(() => {
        window.scrollTo("0px", "0px");
        if (!currentUser.loading) {
            axios.get("/get-one-project/" + currentUser.email + "/" + params.projectId)
                .then(result => {
                    let project = result.data[0];
                    setCode(project.text);
                    setProjectName(project.projectName);
                    setlanguage(project.language);
                    console.log(project.language);
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            setTimeout(() => {
                setRenderState(!renderState);
            }, 100);
        }
    }, [renderState]);

    function parentProjectName(newName) {
        setProjectName(newName);
    }

    const selectTheme = (e) => {
        setTheme(e.target.value);
    }

    const selectLanguage = (e) => {
        setlanguage(e.target.value);
    }

    function handleInput(e) {
        setInput(e.target.value);
    }

    function handleFontSize(e) {
        if (e.target.value > 50 || e.target.value < 10) {
            e.target.value = 25;
            return;
        }
        let editor = document.getElementById("code-editor-div");
        editor.style.fontSize = e.target.value + "px";
    }

    function handleUpdate() {
        document.getElementById("playground-update-button").style.color = "green";
        const data = { text: code, language: language };
        const options = {
            method: 'PUT',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: "/update-projectText/" + currentUser.email + "/" + params.projectId
        };
        axios(options).then(
            res => {
                setMessageBox(res.data, "lightgreen");
            }).
            catch(err => {
                console.log(err.response)
                setMessageBox(err.response.data, "red");
            });
    }

    function handleCompile() {
        document.getElementById("playground-update-button").style.color = "green";
        if (code.trim().length === 0) {
            setOutput({
                time: "0.00", output: "No output"
            });
            return;
        }
        const data = { text: code, language: language };
        const options = {
            method: 'PUT',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: "/update-projectText/" + currentUser.email + "/" + params.projectId
        };
        axios(options).then(
            res => {
                // setMessageBox(res.data, "lightgreen");
                setOutput({
                    time: "", output: "Compiling..."
                });
                const data = { project: { text: code, language: language }, input: input };
                const options = {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify(data),
                    url: "/compile-project/"
                };

                axios(options)
                    .then(result => {
                        setOutput(result.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }).
            catch(err => {
                console.log(err.response)
                setMessageBox(err.response.data, "red");
            });
    }

    return (
        <div id="playgroundPage">
            {currentUser?.loading ? <Loading color="black" /> : <div id="playground-page-wrapper">
                <div id="playground-navbar">

                    {/* <div id="navbar-div"> */}

                    <ChangeableTitle title={projectName}
                        currentUserName={currentUser.email}
                        parentProjectName={parentProjectName}
                        projectId={params.projectId}
                    />

                    {window.screen.width > 850 && <select defaultValue={theme} onChange={selectTheme} className="theme-select editor-options" key={"theme options"}>
                        {optionList.themes.map(el =>
                            <option key={el}>{el}</option>
                        )}
                    </select>}

                    {window.screen.width > 850 && <select defaultValue={language} onChange={selectLanguage} className="lang-select editor-options" key="language options">
                        {Object.keys(optionList.languages).map(el =>
                            <option key={el}>{el}</option>
                        )}
                    </select>}

                    <button id="run-btn" onClick={handleCompile}>➤</button>

                    {window.screen.width > 1000 && <label htmlFor="font-size" id='font-size-label'>Font-size:</label>}
                    {window.screen.width > 1000 && <input type="number" name="font-size" id="editor-font-size-input"
                        onBlur={handleFontSize} size="" defaultValue={25} min="10" max="50" />}
                    {/* </div> */}


                    <a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(code)}
                        download={projectName + "." + optionList.languages[language].fileExtension}
                        id="buttonDownload">⭳</a>

                    <button onClick={handleUpdate} id="playground-update-button">Save Project</button>

                    <NavLink to="/profile" id="playground-profile-page-button">Profile</NavLink>
                </div>



                <div id="playground-main">

                    <ResizableBox props={{ right: true }}>
                        <div id="code-editor-div">
                            <CodeMirror
                                value={code}
                                theme={theme}
                                height="100vh"
                                width='100%'
                                extensions={[optionList.languages[language].extension]}
                                onChange={(value, viewUpdate) => {
                                    setCode(value);
                                    document.getElementById("playground-update-button").style.color = "orange";

                                }}
                            />
                        </div>
                    </ResizableBox>

                    <div id='compiler-div'>
                        <ResizableBox props={{ bottom: true }}>
                            <div id="output-div">
                                <p>{output.output}</p>
                                <span id="output-time-span">{output.time !== "" && "Compiled in: " + output.time + "s"}</span>
                            </div>
                        </ResizableBox>

                        <textarea name="compiler-input" id="compiler-input-area"
                            placeholder={'Enter your input here, for every different entry:\ninput1\ninput2\ninput3'}
                            spellcheck="false" value={input} onChange={handleInput}></textarea>
                    </div>
                </div>

            </div>}
        </div >
    );
}




export default Playground;