const { validateToken } = require('../helpers/functions');
const ApiError = require('../helpers/ApiError');
const STATUS_CODES = require('../helpers/status_code');

const Validator = (req, res, next) => {
    try {
        const tokenHeader = req.headers['authorization'];
        if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) { 
            throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please provide a valid token");
        }

        const token = tokenHeader.split(" ")[1];
        if (!token) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid token");
        }

        try {
            const user = validateToken(token);
            if (user) {
                req.user = user;
                
                return next();
            } else {
                throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid token");
            }
        } catch (e) {
            throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Session expired");
        }

    } catch (e) {
        next(e); 
    }
};

module.exports = Validator;
