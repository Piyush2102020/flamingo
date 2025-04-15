const express = require('express');
const routes = express.Router();
const errHandler = require('../middleware/errHandler');
const validator = require('../middleware/validator');
const multer = require('multer');


/**
 * 🔗 API Routes
 *
 * Base router handling all incoming API requests. Applies token validation middleware
 * after auth routes, and sets up global error handling.
 *
 * ▸ Auth Routes
 *  - POST /auth/:type               → Login or Register based on :type
 *  - POST /reset                    → Send password reset link/email
 *  - POST /changepassword           → Change password using token
 *
 * ▸ Middleware
 *  - validator                      → Validates Bearer token and user session
 *
 * ▸ User Routes
 *  - GET /user/:id                  → Get user public profile info
 *  - GET /search/:username          → Search users by username
 *  - GET/PUT /profile/:id           → Get or interact (follow/unfollow) with a profile
 *  - POST /updateprofile            → Update bio, links, visibility etc.
 *  - POST /updateprofilepicture     → Upload profile image (uses multer)
 *  - GET /notification              → Fetch logged-in user notifications
 *
 * ▸ Post Routes
 *  - GET/POST /content              → Retrieve or create post (with optional media)
 *  - GET/POST /content/:postId/comments/:parentId?
 *                                   → Get/add comment or nested reply to a post
 *  - POST /content/:id              → Like, save, or interact with post
 *
 * ▸ Chat Routes
 *  - GET /inbox                     → Get users with whom chat exists
 *  - GET /getmessages/:chatboxid    → Fetch old messages in chatbox
 *
 * ▸ Music
 *  - GET /music                     → Search and return music data (e.g. YouTube API)
 *
 * ▸ Error Handler
 *  - Any uncaught error in the above routes will be handled by `errHandler`
 */
const { Auth, resetPassword, ChangePassword } = require('../controller/Auth');
const { RetrievePost, MakePost, GetComments, AddComment } = require('../controller/Post');
const { Interact } = require('../controller/interaction');
const { userInfo, searchUser, updateProfile, profileInteraction, getAccData, Notifications, updateProfilePicture, getrequests, requestActions } = require('../controller/User');
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
routes.route('/requests/:action?').get(getrequests).post(requestActions)

/// 🔹 **Post Routes**
routes.route('/content/:id?').get(RetrievePost).post(upload.single('media'), MakePost);
routes.route('/content/:postId/comments/:parentId?').get(GetComments).post(AddComment);
routes.post('/content/:id', Interact);

/// 🔹 **Chat Routes**
routes.get('/inbox',getUsersInInbox);
routes.get('/getmessages/:chatboxid',getOldMessage);


routes.get('/music',SearchMusic)
// Global Error Handler
routes.use(errHandler);

module.exports = routes;