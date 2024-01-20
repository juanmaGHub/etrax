export const validateEmail = (email) => {
	let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailRegex.test(email);
};

export const validateSignup = ({ username, email, password, pass2 }) => {
	if (username === "") {
		return "Username cannot be empty";
	}
	if (email === "") {
		return "Email cannot be empty";
	}
	if (password === "") {
		return "Password cannot be empty";
	}
	if (pass2 === "") {
		return "Confirm Password cannot be empty";
	}
	if (password !== pass2) {
		return "Passwords do not match";
	}
	if (password.length < 6) {
		return "Password must be at least 6 characters";
	}
	if (!validateEmail(email)) {
		return "Invalid email address";
	}
	return "";
};

export const validateLogin = ({ email, password }) => {
	if (email === "") {
		return "Email cannot be empty";
	}
	if (password === "") {
		return "Password cannot be empty";
	}
	if (!validateEmail(email)) {
		return "Invalid email address";
	}
	return "";
};

export const isNumberKey = (e) => {
	var charCode = e.which ? e.which : e.keyCode;
    if (charCode >= 37 && charCode <= 40 || charCode === 8) {
        return true;
    }
	if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 190)
		return false;

	return true;
};
const isNumeric = (str) => {
    if (typeof str != "string") return false
    return !isNaN(str) && 
           !isNaN(parseFloat(str))
  }
export const validateExpense = ({ amount }) => {
    if (amount.replace(".", "").length - 2 > 10) {
        return "Amount is too large, you should consider saving your money instead ;-)";
    }
    if (amount === "" || amount === undefined) {
        return "Amount cannot be empty";
    }
    try {
        if (Number(amount) <= 0) {
            return "Amount must be greater than 0";
        }
        if (!isNumeric(amount)) {
            return "Amount must be a number";
        }
    } catch (err) {
        return "Amount must be a number";
    }
    return "";
}

export const serverDateFormatter = (dateObj) => {
    return dateObj.toISOString().slice(0, 19).replace('T', ' ');
}

export const roundToTwo = (num) => {
    return (Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100).toString()
}

export const dateRangeOptions = () => {
    const today = new Date();
        
    // options last month, last 3 months, last 6 months, last year, all time
    const lastMonth = serverDateFormatter(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
    const last3Months = serverDateFormatter(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()));
    const last6Months = serverDateFormatter(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()));
    const lastYear = serverDateFormatter(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()));
    return {
        lastMonth: lastMonth,
        last3Months: last3Months,
        last6Months: last6Months,
        lastYear: lastYear,
        allTime: "1970-01-01 00:00:00"
    }
}