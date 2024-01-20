export const requestErrorMessage = (data) => {
    if (data.response) {
        // Request made and server responded
        let errCode = data.response.status;
        let statusText = data.response.statusText;
        let message = data.response.data.message;
        return `${errCode} ${statusText}: ${message}`
    } else {
        // Something happened in setting up the request that triggered an Error
        return data.message;
    }
}