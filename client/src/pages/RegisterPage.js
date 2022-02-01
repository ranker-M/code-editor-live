import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/register-page.css';
import axios from 'axios';
import { useMessageBox } from "../contexts/MessageBox";


const RegisterPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPasword] = useState('')
    const [password2, setPasword2] = useState('')
    const { register, signInWithGoogle, sendEmailForVerification, linkAccounts, signInWithGithub } = useAuth();
    const errBox = document.getElementById("error-box");
    const buttons = document.querySelectorAll("#register-wrapper button");
    const { setMessageBox } = useMessageBox();
    const navigate = useNavigate();
    const { state } = useLocation();


    const handleSubmit = (e) => {
        e.preventDefault();
        buttons.forEach(el => el.disabled = true);
        if (password !== password2) {
            errBox.innerHTML = "Passwords different";
            errBox.style.display = "block";
            buttons.forEach(el => el.disabled = false);
            return;
        }
        register(email, password)
            .then((res) => {
                // Error box handling
                errBox.style.display = "none";
                errBox.innerHTML = "";

                // add new user to db
                addUserToDatabase(res);
            })
            .catch((err) => {
                if (err.message.indexOf("already") != -1) {
                    errBox.innerHTML = "Email already in use";
                } else if (err.message.indexOf("least") != -1) {
                    errBox.innerHTML = "Password should be at least 6 characters";
                }
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
            })
    }

    function addUserToDatabase(user) {
        axios.get("/add-user/" + user.user.email).then(
            res => {
                setMessageBox("User successfully created", "lightgreen");
                handleEmailVerification(user);
            }).
            catch(err => {
                // console.log(err.response.data);
                if (err.response.data.indexOf("duplicate key error") != -1) {
                    handleEmailVerification(user);
                } else
                    setMessageBox(err.response.data, "red");
            });
    }

    function handleEmailVerification(res) {
        const errBox = document.getElementById("error-box");
        if (!res.user.emailVerified) {
            sendEmailForVerification(res.user).then((result) => {
                setMessageBox("Please verify your email", "orangered");
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

    function handleGithubSignIn() {
        signInWithGithub().then(user => {
            if (user._tokenResponse?.isNewUser) {
                addUserToDatabase(user);
            }
            handleEmailVerification(user);
        }).catch(err => {
            if (err.message.indexOf("auth-popup-closed-by-user") === -1) {
                setMessageBox(err.message, "red");
            }
            if (err.message.indexOf('auth/account-exists-with-different-credential') != -1) {
                setMessageBox(`Account linking needed`, "red");
                const errBox = document.getElementById("error-box");
                errBox.innerHTML = "This email is already being used. Please enter your account with other providers. We will link your account so you can use this method from now on.";
                errBox.style.backgroundColor = "red";
                errBox.style.display = "block";
                buttons.forEach(el => el.disabled = false);
                linkAccounts(err);
            }
        })
    }
    function handleGoogleSignIn() {
        signInWithGoogle().then(user => {
            if (user._tokenResponse?.isNewUser) {
                addUserToDatabase(user);
            }
            handleEmailVerification(user);
        }).catch(err => {
            if (err.message.indexOf("auth-popup-closed-by-user") === -1) {
                setMessageBox(err.message, "red");
            }
        });
    }
    return (
        <div id="register-main">
            <h1>Register</h1>
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
                    <label htmlFor="password2">Password Again</label>
                    <input
                        value={password2}
                        onChange={e => setPasword2(e.target.value)}
                        type="password" name="password" id="password2"
                        autoComplete="password"
                        required />
                    <div id="error-box"></div>
                    <div className="click-btn-div">
                        <NavLink to="/login" className="login click-btn">Do you already have an account?</NavLink>
                    </div>
                    <button type="submit" id="create-account">Create an account</button>
                    <div id="line-between-login"></div>
                    <button
                        onClick={handleGoogleSignIn}
                        id="google-register-btn">Sign in with Google
                    </button>

                    <button
                        onClick={handleGithubSignIn}
                        id="github-register-btn">Sign in with Github
                    </button>

                </form>
            </div >
        </div>
    );
}

export default RegisterPage;