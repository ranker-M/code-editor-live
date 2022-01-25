import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/register-page.css';
import { useMessageBox } from "../contexts/MessageBox";


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const { forgotPassword } = useAuth();
    const errBox = document.getElementById("error-box");
    const button = document.getElementById("create-account");
    const { setMessageBox } = useMessageBox();


    const handleSendEmail = (e) => {
        e.preventDefault();
        button.disabled = true;
        forgotPassword(email)
            .then((res) => {
                // Error box handling
                errBox.style.display = "none";
                errBox.innerHTML = "";

                // inform user
                setMessageBox("Email send please check your email", "lightgreen");
                button.disabled = false;
            })
            .catch((err) => {
                console.log(err);
                if (err.message.indexOf("user-not-found") != -1) {
                    errBox.innerHTML = "User not found";
                } else {
                    errBox.innerHTML = err.message;
                }
                errBox.style.display = "block";
                button.disabled = false;
            })
    }

    return (
        <div id="register-main">
            <h1>Forgot Password</h1>
            <div id="register-wrapper" >
                <form onSubmit={e => handleSendEmail(e)}>
                    <label htmlFor="email">E-mail</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email" name="email" id="email-input" autoComplete="email" required />
                    <div id="error-box"></div>
                    <div className="click-btn-div">
                        <NavLink to="/login" className="login click-btn">Do you want to try login again?</NavLink>
                    </div>
                    <button type="submit" id="create-account">Send Email</button>
                </form>
            </div >
        </div>
    );
}

export default ForgotPasswordPage;