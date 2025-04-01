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