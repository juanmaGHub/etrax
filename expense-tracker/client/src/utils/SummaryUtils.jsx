export const aggregateExpenses = (expenses) => {
    let byCategories = {};
    expenses.forEach((expense) => {
        if (byCategories[expense.category]) {
            byCategories[expense.category] += parseFloat(expense.amount);
        } else {
            byCategories[expense.category] = parseFloat(expense.amount);
        }
    });
    return byCategories;
}

export const computeTotal = (expenses) => {
    let total = 0.0;
    expenses.forEach((expense) => {
        total += parseFloat(expense.amount);
    });
    return total;
}

export const computeNorm = (expenses) => {
    let byCategories = aggregateExpenses(expenses);
    let norm = 0;
    Object.entries(byCategories).forEach(([, amount]) => {
        norm += amount * amount;
    });
    norm = Math.sqrt(norm);
    return norm;
}

export const sortByValue = (obj) => {
    let sortable = [];
    for (let key in obj) {
        sortable.push([key, obj[key]]);
    }
    sortable.sort((a, b) => {
        return b[1] - a[1];
    });
    return sortable;
}

export const computeAggExpenses = (expenses) => {
    let byCategories = aggregateExpenses(expenses);
    
    // return sorted 
    let sorted = sortByValue(byCategories);
    return sorted;
}

export const computeNormalizedExpenses = (expenses) => {
    let byCategories = aggregateExpenses(expenses);
    let norm = computeNorm(expenses);
    let normalized = {};
    Object.entries(byCategories).forEach(([category, amount]) => {
        normalized[category] = amount / norm;
    });
    
    // return sorted normalized expenses
    let sorted = sortByValue(normalized);
    return sorted;
}

export const drawBarChart = (expenses) => {
    const byCategories = computeNormalizedExpenses(expenses);
    if (!byCategories || (byCategories && byCategories.length === 0)) {
        return;
    }
    const canvas = document.querySelector(".graph-content");
    if (!canvas) {
        return;
    }
    if (canvas.innerHTML !== "") {
        canvas.innerHTML = "";
    }
    
    // now by categories is a sorted array of arrays
    for (let i = 0; i < Math.min(4, byCategories.length); i++) {
        const div = document.createElement("div");
        div.classList.add("bar");
        
        // logarithmic scale
        let height = (100 * Math.log(byCategories[i][1] + 1));
        // if it is too small, make it visible
        div.style.height = height > 10 ? height.toString() + "%" : `calc(4px + ${height}%)`;

        div.style.width = "30px";
        div.innerHTML = `<span style="width:60px;">${byCategories[i][0]}</span>`;
        canvas.appendChild(div);
    }
}

export const renderMainTable = (expenses) => {
    let summaryTable = document.querySelector(".summary-table");
    if (!summaryTable) {
        return;
    } else {
        summaryTable.innerHTML = "";
    }
    if (!expenses || expenses.length === 0) {
        summaryTable.innerHTML = "";
        return;
    }
    
    const headers = ["Category", "Amount", "Date", "Description"];
    const headersMapped = ["category", "amount", "createdAt", "description"];

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    headers.forEach((header) => {
        let th = document.createElement("th");
        th.innerHTML = header;
        tr.appendChild(th);
    })
    thead.appendChild(tr);
    summaryTable.appendChild(thead);

    let tbody = document.createElement("tbody");
    expenses.forEach((expense) => {
        let tr = document.createElement("tr");
        tr.key = expense.id;
        tr.addEventListener("click", () => {
            let id = expense.id;
            window.history.pushState({}, "", "/api/expenses/" + id);
            window.dispatchEvent(new Event("popstate"));
        })
        headersMapped.forEach((header) => {
            let td = document.createElement("td");
            td.innerHTML = expense[header];
            if (header === "createdAt") {
                td.innerHTML = td.innerHTML.slice(0, 10);
            }
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    });
    summaryTable.appendChild(tbody);
}

export const blockUI = () => {
    document.getElementById("loading").classList.remove("hidden");
}

export const unblockUI = () => {
    document.getElementById("loading").classList.add("hidden");
}