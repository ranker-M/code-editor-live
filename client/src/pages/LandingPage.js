import LandingNavbar from "../components/LandingNavbar";
import '../styles/landingPage.css'
import collabImg from '../img/collab-coding.jpg'
import codeMirrorImg from '../img/code-mirror-logo.png'
import proggrammingLangugageImage from '../img/programming-languages.jpg'
import { Link } from "react-router-dom";
import { useEffect } from "react";


const LandingPage = (props) => {

    window.onload = function () {
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
            anchors[i].onclick = function () { return false; };
        }
        document.querySelector("div.wrapper").style.display = "none";
    };

    return (
        <div className="landingPage">
            <LandingNavbar />
            {/* Background Image */}
            <div className="landing-page-bg">
                {props.mobile ?
                    <h2 style={{ "color": "white" }}>Unfortunately we don't suppport mobile devices. You can use LCodeSharing only in a computer.</h2>
                    : <div className="center">
                        <h1>Collaborative Online Code Compiler</h1>
                        <h2>Code with your team and friends</h2>
                        <Link to="/playground" className="btn-white btn btn-animate">Start Coding Now</Link>
                    </div>}
            </div>
            {/* Content */}
            {/* Project Descriptions */}
            <main id="project-description-wrapper">
                <section className="project-description">
                    <div className="text">
                        <h3>Code Editing and Compiler</h3>
                        <p>LcodeSession is online code editor and compiler for programmers.
                            You can use 8+ programming language to code and compile.
                            You can also register and save your projects or you can download your file
                            if you want to save it in your computer. Check the playground and see yourself.

                        </p>
                        <Link to="/playground">Start coding →</Link>
                    </div>
                    <div className="image">
                        <img src={collabImg} alt="real-time code editor illustration" />
                    </div>
                </section>

                <section className="project-description small">
                    <div className="image little-logo">
                        <img src={codeMirrorImg} alt="real-time code editor illustration" />
                    </div>
                    <div className="text">
                        <h3>Rich Text Editor- CodeMirror</h3>
                        <p> CodeMirror is versatile text editor implemented in Javascript
                            for the browser. It is specialized for editing code and comes with number
                            of language modes and more advanced editing functionality.
                        </p>
                        <a href="https://codemirror.net/6/">Learn more →</a>
                    </div>
                </section>

                <section className="project-description">
                    <div className="text">
                        <h3>More than 8+ programming language</h3>
                        <p> Write and compile code for more than 8+ programming language.
                            With CodeMirror's code editor and Sphere Engine's compiler API, you can select any language you
                            want to use. Learn more about available compilers.
                        </p>
                        <a href="https://sphere-engine.com/supported-languages">Learn more →</a>
                    </div>
                    <div className="image">
                        <img src={proggrammingLangugageImage} alt="real-time code editor illustration" />
                    </div>
                </section >

            </main>
            {/* How to use cards */}
            < section className="how-to-start-container" >
                <h2 className="how-to-title">How to Start Using LCodingSession</h2>
                <div className="card-container">
                    <div className="card">
                        <h4>1.Sign in</h4>
                        <p>Sign in or login to create a profile. You can use our code editor and download your work
                            without logging in. You can save your work in our database if you login.
                        </p>
                    </div>
                    <div className="arrow">🡆</div>
                    <div className="card">
                        <h4>2.Create a Project</h4>
                        <p>Create a new file to start coding in playground.
                            You can save your projects and you can continue whenever you want.
                            Or you can delete it to forget about it, if you wish.
                        </p>
                    </div>
                    <div className="arrow">🡆</div>
                    <div className="card">
                        <h4>3.Compile Your Code</h4>
                        <p>After creating your project, you can compile it from playground.
                            You can write your code via our responsive editor. But don't forget
                            to save your code before leaving.
                        </p>
                    </div>
                    <div className="arrow">🡆</div>
                    <div className="card">
                        <h4>4.Enjoy it!</h4>
                        <p>You can logout or login whenever you want and you can compile
                            your code anytime. Don't forget to mention lCodeSession to your friends.
                            Happy coding!
                        </p>
                    </div>
                </div>
                <Link to="/playground" className="btn-purple btn btn-animate">Start Coding Now</Link>
            </section >

            {/* Footer */}
            < footer >
                <p>
                    Made by <a href="https://www.linkedin.com/in/meriç-gündüz-198a99186/">Meric Gunduz</a>
                </p>
                <div className="footer-buttons">
                    <a href="#project-description-wrapper">Home Page</a>
                    <Link to="/playground">Playground</Link>
                    <Link to="/register">Sign in</Link>
                </div>
            </footer >
        </div >
    );
}

export default LandingPage;