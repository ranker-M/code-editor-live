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
    const { register, signInWithGoogle, sendEmailForVerification } = useAuth();
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
                registerUserToDb(res);
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

    function registerUserToDb(userObj) {
        axios.get("/add-user/" + userObj.user.email).then(
            res => {
                setMessageBox("User successfully created", "lightgreen");
                handleEmailVerification(userObj);
            }).
            catch(err => {
                // console.log(err.response.data);
                if (err.response.data.indexOf("duplicate key error") != -1) {
                    handleEmailVerification(userObj);
                } else setMessageBox(err.response.data, "red");
            });
    }

    function handleEmailVerification(res) {
        console.log(res.user);
        console.log("verified", res.user.emailVerified);
        if (!res.user.emailVerified) {
            sendEmailForVerification(res.user).then((result) => {
                setMessageBox("Please verify your email", "orangered");
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
            navigate("/profile", { replace: true });
        }
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
                        onClick={() => {
                            signInWithGoogle()
                                .then(user => {
                                    // console.log(user);      
                                    if (user._tokenResponse?.isNewUser) {
                                        registerUserToDb(user.user.email);
                                    } else setMessageBox("Login successful", "lightgreen");
                                })
                                .catch(err => {
                                    // console.log(err);
                                    setMessageBox(err.message, "red");
                                });
                        }}
                        id="google-register-btn">Sign in with Google</button>
                </form>
            </div >
        </div>
    );
}

export default RegisterPage;