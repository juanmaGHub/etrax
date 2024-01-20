import { useAuth } from "./UseAuthContext"
import { useEffect, useState, useRef } from "react";
import { isNumberKey, validateExpense, serverDateFormatter, dateRangeOptions, roundToTwo } from "../utils/Validations";
import { requestErrorMessage } from "../utils/ErrorHandler";
import { computeTotal, computeAggExpenses, drawBarChart, renderMainTable } from "../utils/SummaryUtils";
import { Tooltip } from "react-tooltip";
import { makeRequest } from "../utils/RequestHandler";
import { Notification } from "./Notification";

export function Summary() {
    const { user } = useAuth();
    
    const dateRanges = dateRangeOptions();
    const dateSelectRef = useRef();

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
    
    // Expenses and table
    const [expenses, setExpenses] = useState([]);
    const emptyTable = () => {
        let table = document.querySelector(".summary-table");
        table.innerHTML = "";
    }
    
    // Fetch expenses on load
    useEffect(() => {
        emptyTable();

        let dateSelect = document.getElementById("date-select");
        let dateSelectValue = dateSelect ? dateSelect.value : dateRanges.lastMonth;
        dateSelectRef.current = dateSelectValue;
        
        axiosFetchExpenses(dateSelectRef.current || dateSelectValue);
        
    }, []);

    const axiosFetchExpenses = async (dateStart) => {
        try {
            const res = await makeRequest(
                "/expenses/all/" + user.id + "?startDate=" + encodeURIComponent(dateStart), "GET", {}
            );
            setExpenses(res.data.expenses);
            return res.data.expenses;
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }
    
    // Date select handler
    const handleDateChange = (e) => {
        emptyTable();
        dateSelectRef.current = e.target.value;
        axiosFetchExpenses(dateSelectRef.current);
    }

    return (
        <>
            <div id="loading" className="hidden">
                <div id="loading-content">
                    <p><strong>Loading...</strong></p>
                </div>
            </div>
            <div>
                <h2>Summary</h2>
            </div>
            <Notification type={notification.type} message={notification.message} show={notification.show} />
            <Tooltip id="top-categories" />
            <div className="row" data-tooltip-id="top-categories" 
                    data-tooltip-content="Top 4 spending categories"
                >
                <div className="graph">
                    <div className="graph-header">
                        <h3>Expenses</h3>
                        <div className="date-range">
                            <select
                                id="date-select"
                                value={dateSelectRef.current}
                                ref={dateSelectRef}
                                onChange={handleDateChange}
                                >
                                <option value={dateRanges.lastMonth}>Last Month</option>
                                <option value={dateRanges.last3Months}>Last 3 Months</option>
                                <option value={dateRanges.last6Months}>Last 6 Months</option>
                                <option value={dateRanges.lastYear}>Last Year</option>
                                <option value={dateRanges.allTime}>All time</option>
                            </select>
                        </div>
                    </div>
                    <div className="graph-content">
                        {drawBarChart(expenses)}
                    </div>
                </div>
                <div className="summary">
                    <div className="summary-col">
                        <span><strong>Total: </strong>&#8364;{computeTotal(expenses)}</span>
                        <br/>
                        <strong>Max. Spent: </strong>
                        {
                            computeAggExpenses(expenses).map((expense, idx) => {
                                // only show top 4 categories
                                if (idx > 0) {
                                    return null;
                                }
                                return (
                                    <span key={expense[0].toString()+"s"}>
                                        &#91;{expense[0]}&#93; &#8364;{expense[1]}    
                                    </span>
                                )
                            })
                        }
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {computeAggExpenses(expenses).map((expense, idx) => {
                                    // only show top 4 categories
                                    if (idx > 3) {
                                        return null;
                                    }
                                    return (
                                        <tr key={expense[0]}>
                                            <td>{expense[0]}</td>
                                            <td>&#8364;{expense[1]}</td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Tooltip id="summary-table-tooltip" />
            <div className="row scroll">
                <table className="summary-table" data-tooltip-id="summary-table-tooltip" 
                    data-tooltip-content="Click in a row to update expense record">
                    {renderMainTable(expenses)}
                </table>

            </div>
        </>
    )
}


export function AddExpense() {
    const { user } = useAuth();

    // Expense form
    const [categories, setCategories] = useState([]);
    const [expense, setExpense] = useState({
        userId: user.id,
        amount: "",
        categoryId: categories[0] ? categories[0].id : "",
        description: "",
        createdAt: ""
    });

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

    // Fetch categories on load
    useEffect(() => {
        axiosFetchCategories();
    }, []);
    const axiosFetchCategories = async () => {
        try {
            const res = await makeRequest("/categories/all", "GET", {});
            setCategories(res.data.categories);
            setExpense({
                ...expense,
                categoryId: res.data.categories[0] ? res.data.categories[0].id : ""
            });
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

    // Expense form handlers
    const handleExpenseChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value
        })
        if(expense.createdAt !== "") {
            expense.createdAt = serverDateFormatter(new Date(expense.createdAt));
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateExpense({amount: expense.amount});
        if (error !== "") {
            notify(error, "error");
            return;
        }

        // round to 2 decimal places before sending to server
        expense.amount = roundToTwo(expense.amount);
        
        // ensure createdAt is not empty even if the db is expected to set it to current date
        if (expense.createdAt === "") {
            expense.createdAt = serverDateFormatter(new Date());
        }
        
        // request
        try {
            await makeRequest("/expenses/add", "POST", expense, null);
            notify("Expense added successfully", "success");
            setExpense({
                ...expense,
                amount: "",
                categoryId: categories[0] ? categories[0].id : "",
                description: "",
                createdAt: ""
            });
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

    return (
        <>
            <div>
                <h2>Add Expense</h2>
            </div>
            <Notification type={notification.type} message={notification.message} show={notification.show} />
            <div className="row">
                <div className="form-content background-1 no-shadow">
                    <div className="form-input">
                        <span>Amount</span>
                        <input 
                            name="amount"
                            type="text" 
                            placeholder="0.00"
                            onKeyDown={(e) => isNumberKey(e) ? null : e.preventDefault()}
                            value={expense.amount}
                            onChange={handleExpenseChange}
                            />
                        <span>EUR</span>
                    </div>
                    <div className="form-input">
                        <span>Category</span>
                        <select
                            name="categoryId"
                            value={expense.categoryId}
                            onChange={handleExpenseChange}
                            >
                            {categories.map((category) => {return <option key={category.id} value={category.id}>{category.name}</option>})}
                        </select>
                    </div>
                    <div className="form-input">
                        <span>Date</span>
                        <input
                            name="createdAt"
                            type="date"
                            value={expense.createdAt}
                            onChange={handleExpenseChange}
                            />
                    </div>
                    <div className="form-input">
                        <textarea 
                            name="description"
                            value={expense.description}
                            onChange={handleExpenseChange}
                            placeholder="Description"
                            />
                    </div>
                    <div className="form-input">
                        <button className="btn btn-primary m0" onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </>        
    )
}

export function Profile() {
    const { user } = useAuth();

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

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        console.log(user.id)
        try {
            await makeRequest("/" + user.id, "DELETE", {});
            notify("Account deleted successfully", "success");
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch (err) {
            notify(err, "error");
        }
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>
                <strong>Username: </strong>{user.username}
            </p>
            <p>
                <strong>Email: </strong>{user.email}
            </p>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
            <Notification type={notification.type} message={notification.message} show={notification.show} />
        </div>
    )
}