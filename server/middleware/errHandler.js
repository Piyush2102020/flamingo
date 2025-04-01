const ApiError = require("../helpers/ApiError");

const errHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json(err.toResponse());
    }

    console.error("Unhandled Error:", err); 

    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errHandler;
