import appLogo from "/logo.png";
import { Tooltip } from 'react-tooltip'
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login');
    }
    const handleSignup = () => {
        navigate('/signup');
    }
    return (
        <>
            <Tooltip id="logo-tooltip" />
			<div className="logo" data-tooltip-id="logo-tooltip" data-tooltip-content="Simplest expense tracking app">
				<img src={appLogo} alt="app logo" />
			</div>
            <button className="btn" onClick={handleLogin}>Log In</button>
            <button className="btn btn-primary" onClick={handleSignup}>Sign Up</button>
            <p>
                Expense tracking made easier.
            </p>
        </>
    )
}

export default Home;