import express from 'express'
const router = express.Router();
import UserController from '../controllers/userController.js';
import DataController from '../controllers/dataEntryController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';

//Poute Level Middleware
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

// Public Routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userLogin)



// Protected Routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)
router.post('/createEntry', checkUserAuth, (req, res, next) => {
    console.log("Accessing /createEntry route"); // Debugging purpose
    next();
  }, DataController.createEntry);
  
router.get('/getUserEntries', DataController.getUserEntries)

export default router