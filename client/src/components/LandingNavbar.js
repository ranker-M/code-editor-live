import { NavLink } from 'react-router-dom';
import '../styles/landingNavbar.css'

const LandingNavbar = () => {

    window.onload = function () {
        document.querySelector(".navbar ul.buttons").style.display = "none";
    };

    return (
        <div className="wrapper">
            <nav className="navbar">

                <ul className="logo-side">
                    <li ><NavLink className="logo" to="/">Logo</NavLink></li>
                    <li>
                        <NavLink className="title" to="/"><h2>LCodeSession</h2></NavLink>
                    </li>
                </ul>
                <ul className="buttons">
                    <li><NavLink to="/playground">
                        Playground</NavLink></li>
                    <li><NavLink to="/login">Login</NavLink></li>
                    <li><NavLink to="/register">Sign in</NavLink></li>
                </ul>
            </nav>
        </div>

    );
}

export default LandingNavbar;