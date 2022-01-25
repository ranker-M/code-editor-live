import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import AllProjects from "../components/AllProjects";
import CreateProjectWindow from "../components/CreateProjectWindow";
import Loading from "../components/LoadingAnimation";
import { useAuth } from "../contexts/AuthContext";
import '../styles/profile-page.css';
import qs from 'qs';
import { useMessageBox } from "../contexts/MessageBox";


const ProfilePage = () => {
    const { logout, currentUser } = useAuth();
    const { setMessageBox } = useMessageBox();
    const [showSelf, setShowSelf] = useState("first");
    const sliderMenu = useRef();
    const axios = require('axios').default;
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState("");
    const { state } = useLocation();

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
                    <NavLink to="" id="all-projects" className="slider-btn">
                        All Projects</NavLink>
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
                    {/* {currentUser?.loading ? <Loading color="black" /> :
                        <p style={{ "wordBreak": "break-word" }}>
                            {JSON.stringify(currentUser, null, 2)}
                        </p>} */}
                    <AllProjects searchValue={searchValue} />
                </main>
            </section>
        </div>
    );
}

export default ProfilePage;