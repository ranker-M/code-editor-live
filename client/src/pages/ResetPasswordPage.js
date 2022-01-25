import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/register-page.css';
import { useMessageBox } from "../contexts/MessageBox";


const ResetPasswordPage = () => {
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const { resetPassword } = useAuth();
    const errBox = document.getElementById("error-box");
    const button = document.getElementById("create-account");
    const [searchParams, setSearchParams] = useSearchParams();
    const { setMessageBox } = useMessageBox();
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to forgot password page if queries missing
        if (searchParams.get("oobCode") == null ||
            searchParams.get("apiKey") == null || searchParams.get("mode") != "resetPassword") {
            navigate("/forgot-password");
        }
    }, []);

    const handleResetPassword = (e) => {
        e.preventDefault();
        const oobCode = searchParams.get("oobCode");
        const continueUrl = searchParams.get("continueUrl");

        button.disabled = true;
        if (password != password2) {
            errBox.innerHTML = "Passwords don't match, re-enter passwords";
            errBox.style.display = "block";
            button.disabled = false;
            return;
        }
        resetPassword(oobCode, password)
            .then((res) => {
                // Error box handling
                errBox.style.display = "none";
                errBox.innerHTML = "";
                setMessageBox("Password successfully changed", "lightgreen");
                navigate("/login");
            })
            .catch((err) => {
                if (err.message.indexOf("invalid-action-code") != -1) {
                    errBox.innerHTML = "This link used or deprecated, request new email from 'forgot password' page";
                } else if (err.message.indexOf("at least") != -1) {
                    errBox.innerHTML = "Password should be at least 6 characters";
                } else {
                    errBox.innerHTML = err.message;
                }
                errBox.style.display = "block";
                button.disabled = false;
            })
    }

    return (
        <div id="register-main">
            <h1>Reset Password</h1>
            <div id="register-wrapper" >
                <form onSubmit={e => handleResetPassword(e)}>
                    <label htmlFor="password">New password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password" name="password" id="reset-password" autoComplete="password" required />
                    <label htmlFor="password">Enter password again</label>
                    <input
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        type="password" name="password2" id="reset-password2" autoComplete="password" required />
                    <div id="error-box"></div>
                    <button type="submit" id="create-account">Reset Password</button>
                </form>
            </div >
        </div>
    );
}

export default ResetPasswordPage;