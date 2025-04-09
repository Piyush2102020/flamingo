/**
 * Custom API Error class extending the native Error object.
 * Used to provide structured error handling in API responses.
 */
class ApiError extends Error {
    constructor(status, message, data = null) {
        super(message); 
        this.status = status; 
        this.data = data;
    }

    toResponse = () => {
        return {
            success: false,
            message: this.message,
            ...(this.data && { data: this.data } ) 
        };
    };
}

module.exports = ApiError;