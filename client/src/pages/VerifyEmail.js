import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/register-page.css';
import { useMessageBox } from "../contexts/MessageBox";


const VerifyEmail = () => {
    const { currentUser, confirmEmailVerification } = useAuth();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { setMessageBox } = useMessageBox();
    const [time, setTime] = useState(5);

    useEffect(() => {
        if (!currentUser?.loading) {
            console.log("curruser:", currentUser.emailVerified);
            confirmEmailVerification(state?.oobCode).then(res => {
                setMessageBox("Email successfully verified", "lightgreen");
                let clock = 5;
                let interval = setInterval(() => {
                    setTime(clock - 1);
                    clock--;
                    if (clock == 0) clearInterval(interval);
                }, 1000);

                setTimeout(() => {
                    navigate("/profile");
                }, 6000)

            }).catch(err => {
                setMessageBox(err.message, "red");
                console.log(err);
            })
        }
    }, [currentUser]);


    return (
        <div id="register-main">
            <div id="register-wrapper" >
                <h1 style={{ "fontSize": "2rem" }} >Your Email has been verified!</h1>
                <p style={{ "fontSize": "1.6rem" }}>You are going to redirected to your profile page in
                    <strong style={{ "color": "#53148a", fontSize: "2rem" }}>{" " + time}</strong>.</p>
            </div>
        </div>
    );
}

export default VerifyEmail;