import '../styles/playgroundPage.css'
import { useEffect, useState } from "react";
import ChangeableTitle from '../components/ChangeableTitle';
import { NavLink } from 'react-router-dom';

import CodeMirror from "@uiw/react-codemirror";
import { optionList } from "../components/CodeEditorImports"

import axios from 'axios';
import qs from 'qs';
import ResizableBox from '../components/ResizableBox';

const ProxyPlayground = (props) => {
    const [theme, setTheme] = useState("dark");
    const [language, setlanguage] = useState("javascript");
    const [code, setCode] = useState("Hello World!");
    const [projectName, setProjectName] = useState("Untitled-1")
    const [output, setOutput] = useState({ time: "", output: "Output will be displayed here..." });
    const [input, setInput] = useState("");

    useEffect(() => {
        let proxyProject = localStorage.getItem("proxyProject");
        if (proxyProject) {
            const { theme, language, code, projectName } = JSON.parse(proxyProject);
            setTheme(theme);
            setlanguage(language);
            setCode(code);
            setProjectName(projectName);
            console.log(proxyProject);
        }
    }, [])

    useEffect(() => {
        let project = { theme, language, code, projectName };
        localStorage.setItem("proxyProject", JSON.stringify(project));
    }, [theme, language, code, projectName])

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

    function handleCodeChange(e) {
        console.log(e.target.value);
    }

    function handleFontSize(e) {
        if (e.target.value > 50 || e.target.value < 10) {
            e.target.value = 25;
            return;
        }
        let editor = document.getElementById("code-editor-div");
        editor.style.fontSize = e.target.value + "px";
    }

    function handleCompile() {
        if (code.trim().length === 0) {
            setOutput({
                time: "0.00", output: "No output"
            });
            return;
        }
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
                setOutput({ time: "0.00", output: err.response.data });
            });
    }

    return (
        <div id="playgroundPage">
            <div id="playground-page-wrapper">
                <nav id="playground-navbar">
                    <ChangeableTitle title={projectName}
                        currentUserName={"Proxy user"}
                        parentProjectName={parentProjectName}
                        projectId={"Proxy project"}
                    />
                    {<select defaultValue={"dark"} onChange={selectTheme} className="lang-select editor-options">
                        {optionList.themes.map(el =>
                            <option key={el}>{el}</option>
                        )}
                    </select>}
                    <select defaultValue={"javascript"} onChange={selectLanguage} className="lang-select editor-options">
                        {Object.keys(optionList.languages).map(el =>
                            <option key={el}>{el}</option>
                        )}
                    </select>

                    <button id="run-btn" onClick={handleCompile} >➤</button>

                    <label htmlFor="font-size" id='font-size-label'>Font-size:</label>
                    <input type="number" name="font-size" id="editor-font-size-input"
                        onBlur={handleFontSize} size="" defaultValue={25} min="10" max="50" />


                    <a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(code)}
                        download={projectName + "." + optionList.languages[language].fileExtension}
                        id="buttonDownload">⭳</a>

                    <NavLink to="/login"
                        state={{ path: "/playground" }}
                        id="playground-sign-in-btn"
                    >Sign in</NavLink>
                    <NavLink to="/" id="proxy-playground-homepage-button">Home Page</NavLink>

                </nav>
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
            </div>
        </div>
    );
}




export default ProxyPlayground;