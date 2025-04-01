const express=require('express');
const routes=express.Router();
const errHandler=require('../middleware/errHandler');
const validator=require('../middleware/validator');
const { Auth } = require('../controller/Auth');
const { RetrievePost, MakePost, GetComments, AddComment } = require('../controller/Post');
const multer=require('multer');
const { Interact } = require('../controller/interaction');
const { userInfo, searchUser } = require('../controller/User');
const { Chat, RetreiveChat, GetChatBoxes } = require('../controller/Chat');
const storage = multer.memoryStorage(); 
const upload=multer({storage:storage});


routes.post('/auth/:type',Auth);
routes.use(validator);
routes.get('/search/:username',searchUser)
routes.get('/user/:id',userInfo);
routes.route('/content').get(RetrievePost).post(upload.single('image'),MakePost);
routes.route('/content/:postId/comments/:parentId?').get(GetComments).post(AddComment);
routes.post('/content/:id',Interact)
routes.route('/chat').get(RetreiveChat).post(Chat);
routes.get('/chatbox',GetChatBoxes)
routes.use(errHandler)

module.exports=routes;