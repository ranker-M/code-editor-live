import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMessageBox } from "../contexts/MessageBox";
import '../styles/register-page.css'
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPasword] = useState('')
    const { login, signInWithGoogle, sendEmailForVerification, signInWithGithub, linkAccounts } = useAuth();
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
            })
            .catch((err) => {
                errBox.style.backgroundColor = "red";
                console.log(err.message);
                if (err.message.indexOf("wrong-password") != -1) {
                    errBox.innerHTML = "Wrong password";
                } else if (err.message.indexOf("user-not-found") != -1) {
                    errBox.innerHTML = "There isn't any user related to this email";
                } else errBox.innerHTML = err.message;
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
            })
    }

    function handleEmailVerification(res) {
        const errBox = document.getElementById("error-box");
        if (!res.user.emailVerified) {
            sendEmailForVerification(res.user).then((result) => {
                setMessageBox("Please verify your email", "orangered");
                console.log(result);
                errBox.style.backgroundColor = "darkviolet";
                errBox.innerHTML = "Email not verified. A verification mail sent to your email. Please check your email.";
                errBox.style.display = "block";
            }).catch(err => {
                if (err.message.indexOf("too-many-requests") !== -1) {
                    errBox.innerHTML = "Verify your account to login. A verification mail already sent to your email address."
                } else errBox.innerHTML = err.message;
                errBox.style.backgroundColor = "red";
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
            });

        } else {
            setMessageBox("Login successful", "lightgreen");
            navigate("/profile");
        }
    }

    function handleGoogleSignIn() {
        signInWithGoogle().then(user => {
            if (user._tokenResponse?.isNewUser) {
                addUserToDatabase(user);
            }
            handleEmailVerification(user);
        }).catch(err => {
            setMessageBox(err.message, "red");
        });
    }

    function handleGithubSignIn() {
        signInWithGithub().then(user => {
            console.log(user);
            if (user._tokenResponse?.isNewUser) {
                addUserToDatabase(user);
            }
            handleEmailVerification(user);
        }).catch(err => {
            setMessageBox(`Account linking needed`, "red");
            if (err.message.indexOf('auth/account-exists-with-different-credential') != -1) {
                const errBox = document.getElementById("error-box");
                errBox.innerHTML = "This email is already being used. Please enter your account with other providers. We will link your account so you can use this method from now on.";
                errBox.style.backgroundColor = "red";
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
                linkAccounts(err);
            }
        })
    }


    function addUserToDatabase(user) {
        axios.get("/add-user/" + user.user.email).then(
            res => {
                setMessageBox("User successfully created", "lightgreen");
            }).
            catch(err => {
                // console.log(err.response.data);
                if (err.response.data.indexOf("duplicate key error") != -1) {
                    setMessageBox("Login successful", "lightgreen");
                } else
                    setMessageBox(err.response.data, "red");
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
                    <button
                        onClick={handleGithubSignIn}
                        id="github-register-btn">Sign in with Github</button>
                </form>
            </div >
        </div>
    );
}


export default LoginPage;