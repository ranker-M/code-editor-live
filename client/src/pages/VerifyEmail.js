import { useEffect, useState } from "react";
import { Link, Navigate, NavigationType, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import '../styles/register-page.css';
import { useMessageBox } from "../contexts/MessageBox";
import Loading from "../components/LoadingAnimation";


const VerifyEmail = () => {
    const { currentUser, confirmEmailVerification } = useAuth();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { setMessageBox } = useMessageBox();
    const [time, setTime] = useState(5);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!currentUser?.loading) {
            console.log("curruser:", currentUser?.emailVerified);
            confirmEmailVerification(state?.oobCode).then(res => {
                setMessageBox("Email successfully verified", "lightgreen");
                setDone(true);
                let clock = 5;
                let interval = setInterval(() => {
                    setTime(clock - 1);
                    clock--;
                    if (clock == 0) clearInterval(interval);
                }, 1000);

                setTimeout(() => {
                    window.location.reload();
                }, 6000)

            }).catch(err => {
                setDone("failed");
                setMessageBox("Invalid code! Please try again with a new code", "red");
                console.log(err);
            })
        }
    }, [currentUser]);


    return (
        <div id="register-main">
            {!done ? <Loading color="black" /> : <div id="register-wrapper" style={{ "width": "500px" }} >
                <h1 style={{ "fontSize": "2rem" }} >{done == "failed" ? "There is a problem" : "Your Email has been verified!"}</h1>
                <p style={{ "fontSize": "1.6rem" }}>{done == "failed" ? "We couldn't verify your email. Please request another email and try again."
                    : "You are going to redirected to your profile page in"}{done == true && <strong style={{ "color": "#53148a", fontSize: "2rem" }}>{" " + time + "."}</strong>}</p>
                {done == "failed" && <Link to="/login" id="create-account">Go to Login Page</Link>}
            </div>}
        </div>
    );
}

export default VerifyEmail;