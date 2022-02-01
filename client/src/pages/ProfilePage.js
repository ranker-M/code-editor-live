import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AllProjects from "../components/AllProjects";
import CreateProjectWindow from "../components/CreateProjectWindow";
import Loading from "../components/LoadingAnimation";
import { useAuth } from "../contexts/AuthContext";
import '../styles/profile-page.css';
import qs from 'qs';
import { useMessageBox } from "../contexts/MessageBox";
import { compilerList } from "../components/CodeEditorImports";

const ProfilePage = () => {
    const { logout, currentUser } = useAuth();
    const { setMessageBox } = useMessageBox();
    const [showSelf, setShowSelf] = useState("first");
    const sliderMenu = useRef();
    const axios = require('axios').default;
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const { state } = useLocation();
    const [compiler, setCompilerList] = useState(false);

    useEffect(() => {
        // console.log("Profile page:", state);
        let proxyProject = localStorage.getItem("proxyProject");
        // console.log("Proxy project:", proxyProject);
        if (state?.path === "/playground" && proxyProject) {
            createProjectForProxyPlayground(proxyProject);
        }
    }, [])

    function createProjectForProxyPlayground(proxyProject) {
        // Project creation request
        // console.log(proxyProject);
        proxyProject = JSON.parse(proxyProject);
        const { language, code, projectName } = proxyProject;
        const data = { username: currentUser.email, language, projectName, code };
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url: "/add-project"
        };
        axios(options).then(
            result => {
                // console.log(result);
                localStorage.clear();
                setMessageBox("Project succesfully created", "lightgreen");
                navigate("/playground/" + result.data._id, {
                    state: { projectName, language, code }
                });
            }).
            catch(err => {
                // console.log(err.response)
                if (err.response.data.indexOf("Project names must be unique") !== -1) {
                    let randomizedName = { ...proxyProject, projectName: proxyProject.projectName + "(" + Math.floor(Math.random() * 100) + ")" };
                    randomizedName = JSON.stringify(randomizedName);
                    localStorage.setItem("proxyProject", randomizedName);
                    createProjectForProxyPlayground(randomizedName);
                    setMessageBox("Project names can't be same, project name randomize", "orange");
                } else setMessageBox(err.response.data, "red");
            });
    }

    function openMenu() {
        sliderMenu.current.classList.toggle("open-menu");
    }

    function handleCreateProject() {
        setShowSelf(!showSelf);
    }

    function handleLogout() {
        logout()
            .then((result) => {
                setMessageBox("Logout successful", "lightgreen");
                navigate("/");
            })
            .catch(err => {
                // console.log(err);
                setMessageBox(err.message, "red");
            })
    }

    return (
        <div id="profile-wrapper">
            <CreateProjectWindow showSelf={showSelf} user={currentUser} />
            <div ref={sliderMenu} id="profile-slider-menu">
                <div id="slider-menu-buttons-wrapper">
                    <NavLink to="" id="user-name" className="slider-btn">
                        {currentUser?.loading ? <Loading color="black" /> : currentUser.email}</NavLink>
                    <NavLink to="" id="create-project"
                        onClick={handleCreateProject} className="slider-btn">
                        Create Project</NavLink>
                    <NavLink to="/" id="slider-home" className="slider-btn">
                        Home</NavLink>
                    <NavLink to="" id="all-projects" onClick={() => setCompilerList(false)} className="slider-btn">
                        All Projects</NavLink>
                    <NavLink to="" id="compiler-list" onClick={() => setCompilerList(true)} className="slider-btn">
                        Compiler List</NavLink>
                    <NavLink to="" onClick={handleLogout} id="profile-navbar-logout-btn">Logout</NavLink>
                </div>
            </div>
            <section id="profile-page">
                <div id="menu-button" onClick={openMenu}>≡</div>
                <div id="profile-navbar">
                    <input type="text" name="search-bar" id="profile-page-search-bar"
                        placeholder="Search by project name, language"
                        onChange={e => e.target.value === "" && setSearchValue("")}
                        onBlur={e => setSearchValue(e.target.value)}
                        onKeyPress={e => e.key === "Enter" && setSearchValue(e.target.value)}
                    />
                </div>
                <main id="profile-main">
                    {!compiler && <AllProjects searchValue={searchValue}
                        handleCreateProject={handleCreateProject} setCompilerList={setCompilerList} />}
                    {compiler && <div id="compiler-list">
                        <h1>Compiler List</h1>
                        <p>This project compiles codes via Sphere Engine Compilers and the list of compilers available right now is below.</p>
                        <p>Some features may work differently than you expected so if there is a such thing please learn more about the compiler. For example in javascript:<br />
                            This won't work <code>console.log("Hello World!")</code>
                            <br />You should use <code>print("Hello World")</code> for output.
                        </p>
                        <p>Here is the full list,<a href="https://sphere-engine.com/supported-languages" target="_blank">Sphere Engine Compiler</a>. You can learn more about compilers from here.</p>
                        <ul id="compiler-list-ul">
                            {Object.values(compilerList).map(compiler => {
                                return <li className="compiler-list-il">{compiler.name + ", (id:" + compiler.id + ")"}</li>;
                            })}
                        </ul>
                        <p>This project is using free trial of Sphere Engine which expires at <strong>Feb. 15, 2022, 4:30 p.m</strong>.
                            After this date, you may see <strong>"Compiler Errors"</strong> due to the expired access tokens for Sphere Engine Compiler API.</p>
                        <p>You can contact me from <strong>meric99gunduz@gmail.com</strong> email address for your questions or suggestions.</p>
                        <p>Happy Coding</p>
                    </div>}

                </main>
            </section>
        </div >
    );
}

export default ProfilePage;