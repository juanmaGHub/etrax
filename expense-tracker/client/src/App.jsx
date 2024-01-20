
import "./App.css";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { Expense } from "./components/Expense";

function App() {
    const user = null;
	return (
		<>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/dashboard" element={<Dashboard {...user}/>}/>
                        <Route path="/api/expenses/:id" element={<Expense {...user}/>}/>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
		</>
	);
}

export default App;
