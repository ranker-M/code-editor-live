import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AllProjects.css';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import Loading from './LoadingAnimation';
import DeleteProjectWindow from "../components/DeleteProjectWindow";

const AllProjects = (props) => {
    const [renderState, setRenderState] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [showWindow, setShowWindow] = useState("first");
    const [projectList, setProjectList] = useState(null);
    const [recentlyProjects, setRecentlyProjects] = useState(null);
    const [projectName, setProjectName] = useState("");

    const oneMin = 1000 * 60;
    const oneHour = oneMin * 60;
    const oneDay = oneHour * 24;

    useEffect(() => {
        if (!currentUser?.loading) {
            axios.get("/all-projects/" + currentUser.email).then(
                res => {
                    let projects = res.data.projects;

                    let result = projects.filter(project => {
                        return project.projectName.indexOf(props.searchValue) !== -1
                            || project.language.indexOf(props.searchValue) !== -1;
                    })

                    projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setRecentlyProjects(projects.slice(0, 3));
                    setProjectList(result);
                    if (props.searchValue === "") {
                        document.querySelector("#all-project-title").innerHTML = "All Projects";
                    } else {
                        document.querySelector("#all-project-title").innerHTML = "Result";
                    }
                    if (props.searchValue === "" && result.length === 0) {
                        document.querySelector("#result-placeholder").innerHTML = "Doesn't have any project yet";
                    } else {
                        document.querySelector("#result-placeholder").innerHTML = "No match";
                    }
                }).
                catch(err => {
                    if (err.message.indexOf("setting 'innerHTML'") !== -1) console.log(err)
                });
        }
    }, [currentUser, renderState, props.searchValue]);

    function calculatePassedDays(date) {
        date = new Date(date).getTime();
        let today = Date.now();
        let passedDay = Math.floor((today - date) / oneDay);
        let passedHour = Math.floor((today - (date + passedDay * oneDay)) / oneHour);
        let passedMin = Math.floor((today - (date + passedHour * oneHour)) / oneMin);
        let minText = passedMin < 2 ? "Just now" : passedMin + " mins before";
        if (passedHour == 0) return minText;
        let hourText = passedHour !== 0 ? passedHour + " hours before" : passedMin;
        return passedDay === 0 ? hourText : passedDay + " days " + hourText;
    }

    function handleCodeThis(e, project) {
        navigate("/playground/" + project._id,
            {
                state: {
                    projectName: project.projectName,
                    language: project.language,
                    code: project.text
                }
            });
    }

    function handleDelete(e, project) {
        setProjectName(project.projectName);
        setShowWindow(!showWindow);
    }

    function renderParent() {
        setRenderState(!renderState);
    }
    return (
        <div id="all-project-wrapper">
            <DeleteProjectWindow showWindow={showWindow} renderParent={renderParent}
                username={currentUser.email} projectName={projectName} />


            {props.searchValue.length === 0 && <h1 id="recently-project-title">Recently Updated Projects</h1>}
            {props.searchValue.length === 0 && <div key="recently-project-grid-wrapper" className="AllProjects-grid-wrapper recently-projects-grid-wrapper">
                {currentUser.loading || !recentlyProjects ? <Loading color="black" /> : recentlyProjects.length != 0 ?
                    recentlyProjects.map(project => {
                        return <div className="all-project-project-card" key={project.projectName}>
                            <h3>{project.projectName}</h3>
                            <h4>{"Language:"}</h4>
                            <p>{"Language: ", project.language}</p>
                            <h4>{"Last Updated:"}</h4>
                            <p>{calculatePassedDays(project.updatedAt)}</p>
                            <h4>{"Project created at:"}</h4>
                            <p>{new Date(project.updatedAt).toLocaleDateString()}</p>
                            <div className="all-project-button-div">
                                <button className='all-project-button code-this' onClick={(e) => handleCodeThis(e, project)}>Code this</button>
                                <button className='all-project-button delete' onClick={(e) => handleDelete(e, project)}>Delete</button>
                            </div>
                        </div>
                    }) : <p id="result-placeholder">Doesn't have any project yet</p>}
            </div>}



            <h1 id="all-project-title">All Projects</h1>
            <div key="all-project-grid-wrapper" className="AllProjects-grid-wrapper">
                {currentUser.loading || !projectList ? <Loading color="black" /> : projectList.length != 0 ?
                    projectList.map(project => {
                        return <div className="all-project-project-card" key={project.projectName}>
                            <h3>{project.projectName}</h3>
                            <h4>{"Language:"}</h4>
                            <p>{"Language: ", project.language}</p>
                            <h4>{"Last Updated:"}</h4>
                            <p>{calculatePassedDays(project.updatedAt)}</p>
                            <h4>{"Project created at:"}</h4>
                            <p>{new Date(project.updatedAt).toLocaleDateString()}</p>
                            <div className="all-project-button-div">
                                <button className='all-project-button code-this' onClick={(e) => handleCodeThis(e, project)}>Code this</button>
                                <button className='all-project-button delete' onClick={(e) => handleDelete(e, project)}>Delete</button>
                            </div>
                        </div>
                    }) : <p id="result-placeholder">Doesn't have any project yet</p>}
            </div>
        </div >
    );
}

export default AllProjects;