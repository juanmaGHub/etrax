import { useState } from "react";
import axios from "axios";
import lockIcon from "../assets/lock-solid.svg";
import emailIcon from "../assets/envelope-solid.svg";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./UseAuthContext";
import { validateLogin } from "../utils/Validations";
import { Notification } from "./Notification";
import { makeRequest } from "../utils/RequestHandler";


function Login() {
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

    const axiosLogin = async (loginData) => {
        try {
            const res = await makeRequest("/login", "POST", loginData);
            loginUser(res.data.user);
            navigate("/dashboard");
        }
        catch (err) {
            notify(err, "error");
            resetForm();
        }
    }

    const resetForm = () => {
        setLoginData({
            ...loginData,
            email: "",
            password: "",
        });
    };

    // Form data
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    
    // Request
    axios.defaults.withCredentials = true;
    const handleLogin = async (e) => {
        e.preventDefault();
        const validationError = validateLogin(loginData);
        if (validationError !== "") {
            notify(validationError, "error");
            resetForm();
            return;
        }
        await axiosLogin(loginData);
    };
    
	return (
        <>
            <Tooltip id="so-sorry" />
            <div className="center-container">
                <div className="row">
                    <div className="form-content">
                        <h1>Log In</h1>
                        <div className="form-input">
                            <img src={emailIcon} alt="email icon" />
                            <input 
                                type="text" 
                                placeholder="Email" 
                                onChange={e => setLoginData({...loginData, email: e.target.value})}
                                value={loginData.email}/>
                        </div>
                        <div className="form-input">
                            <img src={lockIcon} alt="password icon" />
                            <input 
                                type="password"
                                placeholder="Password"
                                onChange={e => setLoginData({...loginData, password: e.target.value})}
                                value={loginData.password}/>
                        </div>
                        <button className="btn btn-primary" onClick={handleLogin}>Log In</button>
                        
                        <p>Don&apos;t have an account? <a href="/signup">Sign up here!</a></p>
                        <p className="forgot-password" 
                            data-tooltip-id="so-sorry" 
                            data-tooltip-content="I am so ... so ... sorry">
                            Forgot Password?
                        </p>
                        
                    </div>
                </div>
                <Notification type={notification.type} message={notification.message} show={notification.show} />
            </div>
        </>
	);
}

export default Login;