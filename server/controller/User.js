const { mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const ApiError = require("../helpers/ApiError");
const STATUS_CODES = require("../helpers/status_code");
const { response } = require("../helpers/functions");



exports.searchUser = async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await UserModel.aggregate([
            { $match: { username: { $regex: username, $options: "i" } } }
            ,{$limit:20},
            { $addFields: { isFollowing: { $in: [req.user._id, "$followers"] } } },
            { $project: { name:1,username: 1, _id: 1, profilePicture: 1, isFollowing: 1 } }
        ]);

        if (user) {
            response(res, "acknowledged", user)
        } else {
            throw new ApiError(STATUS_CODES.NOT_FOUND, "User not found");
        }
    }
    catch (e) {
        next(e)
    }
}


exports.userInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);

        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(STATUS_CODES.BAD_REQUEST, "Uid not valid")
        }
        const uid = new mongoose.Types.ObjectId(id);
        const user = await UserModel.aggregate([
            { $match: { _id: uid } },
            {
                $addFields: {
                    followersCount: { $size: "$followers" },
                    followingCount: { $size: "$following" },
                    isFollowing: { $in: [uid, "$followers"] }
                }
            }, {
                $project: {
                    followers: 0,
                    following: 0,
                    password: 0
                }
            }
        ]);

        console.log("User : ",user);
        
        if (!user.length) {
            throw new ApiError(STATUS_CODES.NOT_FOUND, "User Not Found")
        }

        response(res,"acknowledged",user[0])
    } catch (e) {
        next(e);
    }
};
