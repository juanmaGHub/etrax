import { useAuth } from "./UseAuthContext";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/user-solid.svg";
import chartIcon from "../assets/chart-simple-solid.svg";
import plusIcon from "../assets/plus-solid.svg";
import { Summary, AddExpense, Profile } from "./DashboardContent";
import { useEffect, useState } from "react";

function Dashboard() {
    const { user, logoutUser } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user]);
    
    const navigate = useNavigate();
    const [dashboardContent, setDashboardContent] = useState("Summary");
    const handleDashboardContent = (e) => {
        setDashboardContent(e.target.textContent ? e.target.textContent : "Summary");
    }
    const handleLogout = () => {
        logoutUser();
        navigate("/")
    }

    return (
        <>
            <div className="dashboard-wrapper">
                <div className="dashboard">
                    <div className="left-pane">
                        <div className="left-pane-content">
                            <div className="left-pane-setting logout">
                                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                            </div>
                            <div className="left-pane-setting" onClick={handleDashboardContent}>
                                <img src={chartIcon} alt="chart icon" />
                                <p>Summary</p>
                            </div>
                            <div className="left-pane-setting" onClick={handleDashboardContent}>
                                <img src={plusIcon} alt="plus icon" />
                                <p>Add Expense</p>
                            </div>
                            <div className="left-pane-setting" onClick={handleDashboardContent}>
                                <img src={userIcon} alt="user icon" />
                                <p>Profile</p>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-content">
                        {dashboardContent === "Summary" && <Summary />}
                        {dashboardContent === "Add Expense" && <AddExpense />}
                        {dashboardContent === "Profile" && <Profile />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
