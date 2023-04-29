const{ Router }=require('express');
const multer=require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const friendcontroller =require('../controllers/friendrequest');
const authController=require('../controllers/authController');
const imageController = require('../controllers/imageController');
const commentController=require('../controllers/commentController');
const {requireAuth,adminAuth}=require('../middleware/authMiddleware');
const router=Router();
router.get('/signup',authController.signup_get);
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);
router.get('/adminpanel',adminAuth,authController.admin_get);
router.post('/adminpanel',adminAuth,authController.admin_post);
router.get('/topic',requireAuth,authController.topic_get);
router.get('/topic/:name',requireAuth,authController.question_get);
router.get('/questionData/',requireAuth,authController.questiondata_get);
// router.get('/imageupload',upload,requireAuth,authController.upload_post);
router.get('/imageupload/',requireAuth,imageController.imageupload_get);
router.post('/imageupload/',upload.single('image'),requireAuth,imageController.imageupload_post);
router.get('/images/',requireAuth,imageController.image_get);
router.get('/getalluser',requireAuth,friendcontroller.all_user);
router.get('/getuser/:username',requireAuth,friendcontroller.get_user);
router.post('/sendreq',requireAuth,friendcontroller.send_request);
router.get('/accept/:name1/:name2',requireAuth,friendcontroller.accept_request);
router.get('/requests/:name',requireAuth,friendcontroller.all_requests);
router.get('/friends/:name',requireAuth,friendcontroller.friends);
router.post('/comment',requireAuth,commentController.comment);
router.get('/getcomment/:id',requireAuth,commentController.getComment);
router.get('/getallcomments',requireAuth,commentController.getAllComment);
module.exports=router; 