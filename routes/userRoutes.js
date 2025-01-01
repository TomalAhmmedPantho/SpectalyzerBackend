import express from 'express'
const router = express.Router();
import UserController from '../controllers/userController.js';
import DataController from '../controllers/dataEntryController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import GraphController from '../controllers/graph.js';

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
  
router.get('/getUserEntries', checkUserAuth, DataController.getUserEntries);
router.get('/getMeanandSD', checkUserAuth, DataController.getMeanandSD);
router.get('/getStandardizedValue', checkUserAuth, DataController.getStandardizedValue);
// router.get('/getWeightedScore', checkUserAuth, DataController.getWeightedScore);
// router.get('/getRowMean', checkUserAuth, DataController.getRowMean);
// router.get('/getSDofRM', checkUserAuth, DataController.getSDofRM);
// router.get('/finalScore', checkUserAuth, DataController.finalScore);
router.get('/getFinalScore', checkUserAuth, DataController.getFinalScore);

// Graphs
// Route to get schooling counts for the last 30 days
router.get("/getschoolingPieChartData", checkUserAuth, GraphController.getschoolingPieChartData);
// Route for food habit bar chart
router.get("/getFoodBarChartData", checkUserAuth, GraphController.getFoodBarChartData);
// Route for SleepingLineChartData
router.get("/getSleepingLineChartData", checkUserAuth, GraphController.getSleepingLineChartData);
// Route for screenTimeBarChartData
router.get("/getscreenTimeBarChartData", checkUserAuth, GraphController.getscreenTimeBarChartData);
// Route for makingNoiseBarChartData
router.get("/getmakingNoiseBarChartData", checkUserAuth, GraphController.getmakingNoiseBarChartData);
// Route for walkingLineChartData
router.get("/getwalkingLineChartData", checkUserAuth, GraphController.getwalkingLineChartData);
// Route for wakingLineChartData
router.get("/getwakingUpBarChartData", checkUserAuth, GraphController.getwakingUpBarChartData);
// Route for goingToSleepBarChartData
router.get("/getgoingToSleepBarChartData", checkUserAuth, GraphController.getgoingToSleepBarChartData);
// Route for classActivityLineChartData
router.get("/getclassActivityLineChartData", checkUserAuth, GraphController.getclassActivityLineChartData);
// Route for outdoorActivityLineChartData
router.get("/getoutdoorActivityLineChartData", checkUserAuth, GraphController.getoutdoorActivityLineChartData);
// Route for junkFoodLineChartData
router.get("/getjunkFoodLineChartData", checkUserAuth, GraphController.getjunkFoodLineChartData);
// Route for getShowingAngerAverageCard
router.get("/getShowingAngerAverageCard", checkUserAuth, GraphController.getShowingAngerAverageCard);
// Route for hitWithHandAverageCard
router.get("/gethitWithHandAverageCard", checkUserAuth, GraphController.gethitWithHandAverageCard);
// Route for outgoingAverageTendencyCard
router.get("/getoutgoingTendencyAverageCard", checkUserAuth, GraphController.getoutgoingTendencyAverageCard);
// Route for bedwettingAverageCard
router.get("/getbedwettingAverageCard", checkUserAuth, GraphController.getbedwettingAverageCard)
// Route for cooperateAtSchoolAverageCard
router.get("/getcooperateAtSchoolAverageCard", checkUserAuth, GraphController.getcooperateAtSchoolAverageCard)
// Route for schoolingYesCountCard
router.get("/getschoolingCountCard", checkUserAuth, GraphController.getschoolingCountCard)
// Route for therapyAtSchoolYesCountCard
router.get("/gettherapyAtSchoolCountCard", checkUserAuth, GraphController.gettherapyAtSchoolCountCard)

export default router