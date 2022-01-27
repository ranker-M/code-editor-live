import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMessageBox } from "../contexts/MessageBox";
import '../styles/register-page.css'
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPasword] = useState('')
    const { login, signInWithGoogle, sendEmailForVerification } = useAuth();
    const errBox = document.getElementById("error-box");
    const navigate = useNavigate();
    const buttons = document.querySelectorAll("#register-wrapper button");
    const { state } = useLocation();
    const { setMessageBox } = useMessageBox();

    const handleSubmit = (e) => {
        e.preventDefault();
        buttons.forEach(el => el.disabled = true);
        login(email, password)
            .then((res) => {
                errBox.style.display = "none";
                errBox.innerHTML = "";
                handleEmailVerification(res);
                // console.log("login:", state);
                // navigate(state?.path || "/profile");
            })
            .catch((err) => {
                errBox.style.backgroundColor = "red";
                console.log(err.message);
                if (err.message.indexOf("wrong-password") != -1) {
                    errBox.innerHTML = "Wrong password";
                } else if (err.message.indexOf("user-not-found") != -1) {
                    errBox.innerHTML = "User not found";
                } else errBox.innerHTML = err.message;
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
            })
    }

    function handleEmailVerification(res) {
        console.log(res);
        console.log("verified", res.user.emailVerified);
        if (!res.user.emailVerified) {
            sendEmailForVerification(res.user).then((result) => {
                setMessageBox("Please verify your email", "red");
                console.log(result);
                errBox.style.backgroundColor = "darkviolet";
                errBox.innerHTML = "Email not verified. A verification mail sent to your email. Please check your email.";
                errBox.style.display = "block";
            }).catch(err => {
                console.log(err);
                errBox.style.backgroundColor = "red";
                errBox.innerHTML = err.message;
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
            });

        } else {
            setMessageBox("Login successful", "lightgreen");
            navigate("/profile");
        }
    }

    function handleGoogleSignIn() {
        signInWithGoogle()
            .then(user => {
                // console.log(user);
                if (user._tokenResponse?.isNewUser) {
                    axios.get("/add-user/" + user.user.email).then(
                        res => {
                            setMessageBox("User successfully created", "lightgreen");
                            handleEmailVerification(user);
                        }).
                        catch(err => {
                            // console.log(err.response.data);
                            if (err.response.data.indexOf("duplicate key error") != -1) {
                                setMessageBox("Login successful", "lightgreen");
                            } else setMessageBox(err.response.data, "red");
                        });
                } else handleEmailVerification(user);

            })
            .catch(err => {
                // console.log(err);
                setMessageBox(err.message, "red");
            });
    }

    return (
        <div id="register-main">
            <h1>Login</h1>
            <div id="register-wrapper" >
                <form onSubmit={e => handleSubmit(e)}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" name="email" id="email-input" autoComplete="email" required />
                    <label htmlFor="password">Password </label>
                    <input
                        value={password}
                        onChange={e => setPasword(e.target.value)}
                        type="password" name="password" id="password"
                        autoComplete="password"
                        required />
                    <div id="error-box"></div>
                    <div className="click-btn-div">
                        <NavLink to="/forgot-password" className="forgot-password click-btn">Forgot password?</NavLink>
                        <NavLink to="/register" state={{ path: state?.path }} className="register click-btn">Don't have an account? Create new</NavLink>
                    </div>
                    <button type="submit" id="create-account">Login</button>
                    <div id="line-between-login"></div>
                    <button
                        onClick={handleGoogleSignIn}
                        id="google-register-btn">Sign in with Google</button>
                </form>
            </div >
        </div>
    );
}


export default LoginPage;