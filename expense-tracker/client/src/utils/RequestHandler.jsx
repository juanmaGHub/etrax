import axios from 'axios';
import { backendUrl } from '../config/Config.jsx';
import { requestErrorMessage } from './ErrorHandler';


export const makeRequest = async (url, method, data) => {
    url = backendUrl + url;
    try {
        const res = await axios({
            url,
            method,
            data,
            withCredentials: true
        });
        if (res.data.status === "success") {
            return res;
        } else {
            throw requestErrorMessage(res.data);
        }
    } catch (err) {
        throw requestErrorMessage(err);
    }
}