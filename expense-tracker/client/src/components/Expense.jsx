import { useState, useEffect } from "react";
import { serverDateFormatter, roundToTwo, isNumberKey } from "../utils/Validations";
import { requestErrorMessage } from "../utils/ErrorHandler";
import { validateExpense } from "../utils/Validations";
import { useParams, useNavigate } from "react-router-dom";
import { makeRequest } from "../utils/RequestHandler";
import { Notification } from "./Notification";

export function Expense() {
    const { id } = useParams();
    const navigate = useNavigate();

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

    const [expense, setExpense] = useState({
        amount: "",
        categoryId: "",
        description: "",
        createdAt: "",
    });

    // Fetch categories and expense data on component load
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axiosFetchCategories().then(() => {
            axiosFetchData();
        });
    }, []);

    const axiosFetchCategories = async () => {
        try {
            const res = await makeRequest("/categories/all", "GET", {});
            setCategories(res.data.categories);
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

    const axiosFetchData = async () => {
        try {
            const res = await makeRequest(`/expenses/${id}`, "GET", {});
            setExpense({
                ...expense,
                amount: res.data.expense[0].amount,
                currency: res.data.expense[0].currency,
                categoryId: res.data.expense[0].categoryId,
                description: res.data.expense[0].description,
                createdAt: res.data.expense[0].createdAt.slice(0, 10),
            });
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

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
        
        expense.amount = roundToTwo(expense.amount);
        
        // ensure createdAt is not empty even if the db is expected to set it to current date
        if (expense.createdAt === "") {
            expense.createdAt = serverDateFormatter(new Date());
        }
        try {
            await makeRequest(`/expenses/${id}`, "PUT", expense);
            notify("Expense updated successfully", "success")
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await makeRequest(`/expenses/${id}`, "DELETE", {});
            notify("Expense deleted successfully", "success")
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (err) {
            notify(requestErrorMessage(err), "error");
        }
    }

    return (
        <>
            <div>
                <h2>Update/Delete Expense</h2>
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
                        <button className="btn" onClick={handleDelete}>Delete</button>
                        <button className="btn" onClick={() => navigate("/dashboard")}>Cancel</button>
                    </div>
                </div>
            </div>
        </> 
    )
}