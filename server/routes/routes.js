const express = require('express');
const routes = express.Router();
const errHandler = require('../middleware/errHandler');
const validator = require('../middleware/validator');
const multer = require('multer');

const { Auth, resetPassword, ChangePassword } = require('../controller/Auth');
const { RetrievePost, MakePost, GetComments, AddComment } = require('../controller/Post');
const { Interact } = require('../controller/interaction');
const { userInfo, searchUser, updateProfile, profileInteraction, getAccData, Notifications, updateProfilePicture } = require('../controller/User');
const { getUsersInInbox, getOldMessage} = require('../controller/Chat');
const { SearchMusic } = require('../controller/music');

// Multer Setup (Memory Storage for Uploads)
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });




/// 🔹 **Auth Routes*
routes.post('/auth/:type', Auth);
routes.post('/reset',resetPassword);
routes.post('/changepassword',ChangePassword)


// Middleware for Validation
routes.use(validator);




/// 🔹 **User Routes**
routes.get('/user/:id', userInfo);
routes.get('/search/:username', searchUser);
routes.route('/profile/:id').get(getAccData).put(profileInteraction);
routes.post('/updateprofile', updateProfile);
routes.post('/updateprofilepicture',upload.single('image'), updateProfilePicture);
routes.get('/notification',Notifications)

/// 🔹 **Post Routes**
routes.route('/content').get(RetrievePost).post(upload.single('image'), MakePost);
routes.route('/content/:postId/comments/:parentId?').get(GetComments).post(AddComment);
routes.post('/content/:id', Interact);

/// 🔹 **Chat Routes**
routes.get('/inbox',getUsersInInbox);
routes.get('/getmessages/:chatboxid',getOldMessage);


routes.get('/music',SearchMusic)
// Global Error Handler
routes.use(errHandler);

module.exports = routes;