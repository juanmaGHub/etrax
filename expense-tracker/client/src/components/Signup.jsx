import userIcon from "../assets/user-solid.svg";
import lockIcon from "../assets/lock-solid.svg";
import emailIcon from "../assets/envelope-solid.svg";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignup } from "../utils/Validations";
import { requestErrorMessage } from "../utils/ErrorHandler";
import { useAuth } from "./UseAuthContext";
import { makeRequest } from "../utils/RequestHandler";
import { Notification } from "./Notification";

function Signup() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();

    // Notifications
    const [notification, setNotification] = useState({
        type: "",
        message: "",
        show: false
    });
    const notify = (message, type) => {
        setNotification({
            type: type,
            message: message,
            show: true
        });
        setTimeout(() => {
            setNotification({
                type: "",
                message: "",
                show: false
            });
        }, 1500);
    }

    const axiosSignup = async (signupData) => {
        try {
            await makeRequest("/register", "POST", signupData);
            
            // try auto login
            try {
                const loginData = {
                    email: signupData.email,
                    password: signupData.password,
                }
                const loginRes = await makeRequest("/login", "POST", loginData);
                loginUser(loginRes.data.user);
                navigate("/dashboard");
            } catch (err) {
                console.log('in')
                console.log(err);
                notify(requestErrorMessage(err), "error");
            }
        } catch (err) {
            console.log('out')
            console.log(err);
            notify(err, "error");
            resetForm();
        }
    }
    
    const resetForm = () => {
        setSignupData({
            ...signupData,
            username: "",
            email: "",
            password: "",
        });
        setPass2({
            ...pass2,
            pass2: "",
        });
    }

    // Form data
    const [signupData, setSignupData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [pass2, setPass2] = useState({
        pass2: "",
    });

    // Request
    axios.defaults.withCredentials = true;
    const handleSignup = (e) => {
        e.preventDefault();
        const signupDataExt = {
            ...signupData,
            pass2: pass2.pass2,
        }
        const validationError = validateSignup(signupDataExt);
        if (validationError !== "") {
            notify(validationError, "error");
            resetForm();
            return;
        }
        axiosSignup(signupData);
    }
	return (
		<>
            <div className="center-container">
                <div className="row">
                    <div className="form-content">
                        <h1>Sign Up</h1>
                        <div className="form-input">
                            <img src={userIcon} alt="user icon" />
                            <input 
                                type="text" 
                                placeholder="Username"
                                value={signupData.username}
                                onChange={e => setSignupData({...signupData, username: e.target.value})}/>
                        </div>
                        <div className="form-input">
                            <img src={emailIcon} alt="email icon" />
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={signupData.email}
                                onChange={e => setSignupData({...signupData, email: e.target.value})}/>
                        </div>
                        <div className="form-input">
                            <img src={lockIcon} alt="password icon" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={signupData.password}
                                onChange={e => setSignupData({...signupData, password: e.target.value})}/>
                        </div>
                        <div className="form-input">
                            <img src={lockIcon} alt="password icon" />
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={pass2.pass2}
                                onChange={e => setPass2({...pass2, pass2: e.target.value})}/>
                        </div>
                        <button className="btn btn-primary" onClick={handleSignup}>Sign Up</button>
                        <p>
                            Already have an account? <a href="/login">Log in here!</a>
                        </p>
                        <p className="forgot-password">
                            Try to not forget your password.
                        </p>
                    </div>
                </div>
                <Notification type={notification.type} message={notification.message} show={notification.show} />
            </div>
        </>
	);
}

export default Signup;
