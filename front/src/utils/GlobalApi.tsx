import axios from "axios";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;

// post api for all api route 
export const postApi = async (endPoint: string, data: any): Promise<any> => {
    try {
        const response = await axios.post(BASE_URL + endPoint, data, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 10000, // 10 seconds
        });
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                console.error("Timeout error:", error?.response);
                return error?.response;
            } else {
                console.error("Axios error:", error?.response?.data);
                return error?.response?.data;
            }
        } else {
            console.error("Unknown error:", error);
        }
        return error; // rethrow the original error
    }
};

// get api for all route 
export const getApi = async (endPoint: string): Promise<any> => {
    try {
        const response = await axios.get(BASE_URL + endPoint, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 10000,
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                console.error("Timeout error:", error);
            } else {
                console.error("Axios error:", error);
            }
        } else {
            console.error("Unknown error:", error);
        }
        throw error; // rethrow the original error
    }
}