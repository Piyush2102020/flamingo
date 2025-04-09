const { validateToken } = require('../helpers/functions');
const ApiError = require('../helpers/ApiError');
const STATUS_CODES = require('../helpers/status_code');



/**
 * JWT Authentication Middleware
 *
 * Validates the Bearer token from the Authorization header.
 * Attaches decoded user data to `req.user` if the token is valid.
 * Throws appropriate errors if token is missing, malformed, or expired.
 */
const Validator = (req, res, next) => {
    try {
        const tokenHeader = req.headers['authorization'];
        if (!tokenHeader || !tokenHeader.startsWith('Bearer '))  throw new ApiError(STATUS_CODES.BAD_REQUEST, "Please provide a valid token");
        
        const token = tokenHeader.split(" ")[1];
        if (!token)  throw new ApiError(STATUS_CODES.BAD_REQUEST, "Invalid token");
        

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
