import DataModel from '../models/studentdataentry.js';
import StatisticsModel from '../models/statisticsModel.js';
import StandardizedValuesModel from '../models/standardizedValuesModel.js';
import WeightedScoreModel from '../models/weightedScoresModel.js';
import  RowMeanModel from '../models/rowMean.js';
import RowMeanSDModel from '../models/sdofrowmean.js';



class DataController {
  static createEntry = async (req, res) => {
    try {
        const {
            dateOfRecord, wakeUpTime, wakingUp, firstGoOut, firstScreenOn, breakfast, schooling, classActivity,
            outdoorActivity, therapyAtSchool, therapyType, lunch, eveningSnacks, dinner, goingToSleep, goToBedAt,
            sleepAt, gettingSleepTime, outgoingTendency, outgoingCount, screenTime, junkFood, makingNoise, walking,
            showingAnger, glassCrashTendency, pushingTendency, itemThrowTendency, foodWaterThrowTendency, hitWithHand,
            hitWithHead, cooperateAtSchool, cooperateAtHome, cuttingNails, hairDressing, bedwetting, regularMedication,
            otherSickness, nameOfSickness, medOtherSickness, listOfMedicine, masturbation, toilet, overnightSleeping,
            specialActivity
        } = req.body;

        // Validate required fields
        if (!dateOfRecord) {
            return res.status(400).send({ "status": "failed", "message": "dateOfRecord is required." });
        }

        // Check if the dateOfRecord already exists for this user
        const existingEntry = await DataModel.findOne({ userId: req.user._id, dateOfRecord });
        if (existingEntry) {
            return res.status(400).send({ "status": "failed", "message": "Data entry for the same date already exists." });
        }

        // Create a new data entry
        const dataEntry = new DataModel({
            userId: req.user._id,
            dateOfRecord,
            wakeUpTime,
            wakingUp,
            firstGoOut,
            firstScreenOn,
            breakfast,
            schooling,
            classActivity,
            outdoorActivity,
            therapyAtSchool,
            therapyType,
            lunch,
            eveningSnacks,
            dinner,
            goingToSleep,
            goToBedAt,
            sleepAt,
            gettingSleepTime,
            outgoingTendency,
            outgoingCount,
            screenTime,
            junkFood,
            makingNoise,
            walking,
            showingAnger,
            glassCrashTendency,
            pushingTendency,
            itemThrowTendency,
            foodWaterThrowTendency,
            hitWithHand,
            hitWithHead,
            cooperateAtSchool,
            cooperateAtHome,
            cuttingNails,
            hairDressing,
            bedwetting,
            regularMedication,
            otherSickness,
            nameOfSickness,
            medOtherSickness,
            listOfMedicine,
            masturbation,
            toilet,
            overnightSleeping,
            specialActivity,
            createdAt: new Date()
        });

        // Save the new entry
        await dataEntry.save();
        res.status(201).send({ "status": "success", "message": "Data Entry Created Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "status": "failed", "message": "Unable to create data entry." });
    }
};


  // Endpoint to get user-specific data
  static getUserEntries = async (req, res) => {
    try {
      // Validate user authentication
      if (!req.user || !req.user._id) {
        return res.status(401).send({
          status: 'failed',
          message: 'User is not authenticated.',
        });
      }
  
      const userId = req.user._id;
  
      // Fetch data entries for the authenticated user
      const dataEntries = await DataModel.find({ userId });
  
      if (!dataEntries.length) {
        return res.status(404).send({
          status: 'failed',
          message: 'No data entries found for the user.',
        });
      }
  
      // Format the response for the frontend to easily render as a table
      const formattedData = dataEntries.map((entry) => ({
        dateOfRecord: entry.dateOfRecord,
        wakeUpTime: entry.wakeUpTime,
        wakingUp: entry.wakingUp,
        firstGoOut: entry.firstGoOut,
        firstScreenOn: entry.firstScreenOn,
        breakfast: entry.breakfast,
        schooling: entry.schooling,
        classActivity: entry.classActivity,
        outdoorActivity: entry.outdoorActivity,
        therapyAtSchool: entry.therapyAtSchool,
        therapyType: entry.therapyType,
        lunch: entry.lunch,
        eveningSnacks: entry.eveningSnacks,
        dinner: entry.dinner,
        goingToSleep: entry.goingToSleep,
        goToBedAt: entry.goToBedAt,
        sleepAt: entry.sleepAt,
        gettingSleepTime: entry.gettingSleepTime,
        outgoingTendency: entry.outgoingTendency,
        outgoingCount: entry.outgoingCount,
        screenTime: entry.screenTime,
        junkFood: entry.junkFood,
        makingNoise: entry.makingNoise,
        walking: entry.walking,
        showingAnger: entry.showingAnger,
        glassCrashTendency: entry.glassCrashTendency,
        pushingTendency: entry.pushingTendency,
        itemThrowTendency: entry.itemThrowTendency,
        foodWaterThrowTendency: entry.foodWaterThrowTendency,
        hitWithHand: entry.hitWithHand,
        hitWithHead: entry.hitWithHead,
        cooperateAtSchool: entry.cooperateAtSchool,
        cooperateAtHome: entry.cooperateAtHome,
        cuttingNails: entry.cuttingNails,
        hairDressing: entry.hairDressing,
        bedwetting: entry.bedwetting,
        regularMedication: entry.regularMedication,
        otherSickness: entry.otherSickness,
        nameOfSickness: entry.nameOfSickness,
        medOtherSickness: entry.medOtherSickness,
        listOfMedicine: entry.listOfMedicine,
        masturbation: entry.masturbation,
        toilet: entry.toilet,
        overnightSleeping: entry.overnightSleeping,
        specialActivity: entry.specialActivity,
      }));
  
      res.status(200).send({
        status: 'success',
        message: 'Data entries retrieved successfully.',
        data: formattedData,
      });
    } catch (error) {
      console.error('Error retrieving data entries:', error);
      res.status(500).send({
        status: 'failed',
        message: 'Unable to retrieve data entries.',
      });
    }
  };
  
  
   //New function for mean and sd 
   // Calculate Mean and Standard Deviation
static calculateMeanAndSD = async (userId) => {
  try {
    // Fetch user data
    const userData = await DataModel.find({ userId });

    // Validate sufficient data
    if (userData.length < 30) {
      console.warn(`Insufficient data for user: ${userId}`);
      return { status: 'failed', message: 'Insufficient data (less than 30 days).' };
    }

    const fields = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'hitWithHand', 'hitWithHead', 'masturbation',
    ];

    // Initialize containers for calculations
    const mean = {};
    const standardDeviation = {};

    // Calculate mean and standard deviation for each field
    fields.forEach((field) => {
      const values = userData.map((entry) => entry[field] || 0);
      const fieldMean = values.reduce((sum, value) => sum + value, 0) / values.length;

      const variance = values.reduce((sum, value) => sum + Math.pow(value - fieldMean, 2), 0) / values.length;
      const fieldSD = Math.sqrt(variance);

      mean[field] = fieldMean;
      standardDeviation[field] = fieldSD;
    });

    // Store mean and SD in the database
    await StatisticsModel.create({
      userId,
      mean,
      standardDeviation,
      updatedAt: new Date(),
    });

    return {
      status: 'success',
      message: 'Mean and standard deviation calculated and stored successfully.',
      mean,
      standardDeviation,
    };
  } catch (error) {
    console.error(`Error calculating mean and SD for user: ${userId}`, error);
    return { status: 'failed', message: 'Internal server error.' };
  }
};


// Calculate Standardized Values
static calculateStandardizedValues = async (userId) => {
  try {
    // Retrieve the latest statistics for the user
    const statistics = await StatisticsModel.findOne({ userId }).sort({ updatedAt: -1 });
    if (!statistics) {
      console.warn(`No statistics found for user: ${userId}`);
      return { status: 'failed', message: 'No statistics found for the user.' };
    }

    // Convert Map to plain objects if necessary
    const plainMean = Object.fromEntries(statistics.mean || []);
    const plainSD = Object.fromEntries(statistics.standardDeviation || []);

    if (!plainMean || !plainSD) {
      console.warn(`Mean or SD missing or invalid for user: ${userId}`);
      return {
        status: 'failed',
        message: 'Mean or standard deviation is missing or invalid in statistics.',
      };
    }

    // Define the fields to process
    const expectedFields = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'hitWithHand', 'hitWithHead', 'masturbation'
    ];

    // Retrieve user data
    const userData = await DataModel.find({ userId });

    // Prepare standardized values
    const standardizedValuesEntries = userData.map((entry) => {
      const standardizedValues = {};

      expectedFields.forEach((field) => {
        const x = entry[field] ?? null;
        const fieldMean = plainMean[field];
        const fieldSD = plainSD[field];

        if (x === null || fieldMean === undefined || fieldSD === undefined || fieldSD === 0) {
          standardizedValues[field] = 0; // Default to 0 for invalid or missing data
        } else {
          standardizedValues[field] = (x - fieldMean) / fieldSD;
        }
      });

      return {
        userId,
        date: entry.dateOfRecord,
        standardizedValues,
      };
    });

    // Save or update standardized values
    for (const entry of standardizedValuesEntries) {
      const { userId, date, standardizedValues } = entry;

      // Update the standardized values for the given userId and date
      await StandardizedValuesModel.updateOne(
        { userId, date }, // Find the document by userId and date
        { $set: { standardizedValues } }, // Update the standardized values
        { upsert: true } // If no document exists, create a new one
      );
    }

    console.log(`Standardized values calculated and stored successfully for user: ${userId}`);
    return { status: 'success', message: 'Standardized values calculated and stored successfully.' };
  } catch (error) {
    console.error(`Error calculating standardized values for user: ${userId}`, error);
    return { status: 'failed', message: 'Internal server error.' };
  }
};




// Calculate Weighted Scores
static calculateWeightedScores = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Fetch the latest standardized values for the user, sorted by `updatedAt` in descending order
    const standardizedValuesEntries = await StandardizedValuesModel.find({ userId }).sort({ updatedAt: -1 });

    if (!standardizedValuesEntries.length) {
      throw new Error('No standardized values found for the user.');
    }

    // Fixed weights for the calculation
    const weights = {
      wakingUp: -0.2667,
      firstGoOut: -0.3535,
      firstScreenOn: -0.3209,
      breakfast: -0.167,
      lunch: 0.218,
      eveningSnacks: 0.3425,
      dinner: 0.1648,
      goingToSleep: 0.1648,
      cooperateAtHome: 0.1619,
      overnightSleeping: 0.095,
      gettingSleepTime: -0.0121,
      outgoingTendency: 0.2842,
      outgoingCount: 0.2202,
      screenTime: -0.1325,
      junkFood: 0.0474,
      makingNoise: 0.3358,
      walking: 0.3164,
      showingAnger: 0.153,
      glassCrashTendency: -0.0574,
      pushingTendency: 0.0172,
      itemThrowTendency: -0.0156,
      foodWaterThrowTendency: -0.0094,
      hitWithHand: 0.0137,
      hitWithHead: 0.0668,
      masturbation: 0.2189,
    };

    const weightedScores = [];

    // Iterate over each standardized value entry for the user
    for (const entry of standardizedValuesEntries) {
      const { date, standardizedValues } = entry;

      let weightedScore = 0;

      // Compute the weighted score for each entry
      for (const field in weights) {
        const weight = weights[field] || 0;
        let standardizedValue = 0;

        // Retrieve standardized value properly, checking if it's a Map or plain object
        if (standardizedValues instanceof Map) {
          standardizedValue = standardizedValues.get(field) || 0; // For Map
        } else if (standardizedValues && standardizedValues[field] !== undefined) {
          standardizedValue = standardizedValues[field]; // For plain object
        }

        // Calculate the weighted score for the current field
        weightedScore += weight * standardizedValue;
      }

      // Log the date and weighted score for debugging purposes
      console.log(`Date: ${date}, Weighted Score: ${weightedScore}`);

      // Save the weighted score or update if it exists
      await WeightedScoreModel.updateOne(
        { userId, date },
        { $set: { weightedScore, updatedAt: new Date() } },
        { upsert: true } // If no document exists, create a new one
      );

      weightedScores.push({ date, weightedScore });
    }

    console.log('Weighted scores calculated and stored successfully.', weightedScores);

    return {
      status: 'success',
      message: 'Weighted scores calculated and stored successfully.',
      data: weightedScores,
    };
  } catch (error) {
    console.error('Error calculating weighted scores:', error);
    throw error;
  }
};




// Calculate Row Mean for each day
static calculateRowMean = async (userId, selectedDate) => {
  try {
    // Ensure the selected date is valid
    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj.toString() === 'Invalid Date') {
      return { status: 'failed', message: 'Invalid selected date.' };
    }

    // Calculate the 30-day range from the selected date
    const startDate = new Date(selectedDateObj);
    startDate.setDate(selectedDateObj.getDate() - 30); // 30 days before the selected date
    const endDate = selectedDateObj;

    // Normalize the dates to UTC and strip out the time component
    const selectedDateStr = selectedDateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const startDateStr = startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    const startOfDayUTC = new Date(`${startDateStr}T00:00:00Z`);
    const endOfDayUTC = new Date(`${selectedDateStr}T23:59:59Z`);

    // Fetch the data entries for the user within the last 30 days
    const dataEntries = await DataModel.find({
      userId,
      dateOfRecord: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (!dataEntries.length) {
      return { status: 'failed', message: 'No data entries found for the user within the last 30 days.' };
    }

    const fieldNames = [
      'wakingUp', 'firstGoOut', 'firstScreenOn', 'breakfast', 'lunch', 'eveningSnacks', 'dinner',
      'goingToSleep', 'cooperateAtHome', 'overnightSleeping', 'gettingSleepTime', 'outgoingTendency',
      'outgoingCount', 'screenTime', 'junkFood', 'makingNoise', 'walking', 'showingAnger',
      'glassCrashTendency', 'pushingTendency', 'itemThrowTendency', 'foodWaterThrowTendency',
      'hitWithHand', 'hitWithHead', 'masturbation',
    ];

    const rowMeans = [];

    // Iterate through each entry to calculate the row mean for each day
    for (const entry of dataEntries) {
      const { dateOfRecord, ...fields } = entry.toObject(); // Use dateOfRecord

      let sum = 0;
      let count = 0;

      // Calculate the sum and count of valid fields for this specific date
      for (const field of fieldNames) {
        if (fields[field] !== undefined && fields[field] !== null) {
          sum += fields[field];
          count += 1;
        }
      }

      const mean = count > 0 ? sum / count : 0;

      // Update or insert the row mean in the database for the specific date
      await RowMeanModel.updateOne(
        { userId, date: dateOfRecord },
        { $set: { mean } },
        { upsert: true } // Create or update the document for the specific date
      );

      rowMeans.push({ date: dateOfRecord, mean });
    }

    return {
      status: 'success',
      message: 'Row means calculated and stored successfully.',
      rowMeans,
    };
  } catch (error) {
    console.error('Error calculating row means:', error);
    return { status: 'failed', message: 'Internal server error.' };
  }
};


// Calculate Standard Deviation of Row Means
static calculateSDofRM = async (userId, selectedDate) => {
  try {
    // Calculate the 30-day range from the selected date
    const selectedDateObj = new Date(selectedDate);
    const startDate = new Date(selectedDateObj);
    startDate.setDate(selectedDateObj.getDate() - 30); // 30 days before the selected date
    const endDate = selectedDateObj;

    // Normalize the dates to UTC and strip out the time component
    const selectedDateStr = selectedDateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const startDateStr = startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    const startOfDayUTC = new Date(`${startDateStr}T00:00:00Z`);
    const endOfDayUTC = new Date(`${selectedDateStr}T23:59:59Z`);

    // Fetch the row means for the user within the last 30 days
    const rowMeans = await RowMeanModel.find({
      userId,
      date: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (rowMeans.length < 30) {
      return { status: 'failed', message: 'Insufficient data for SD calculation (less than 30 days).' };
    }

    // Extract the mean values from the row means
    const meanValues = rowMeans.map((entry) => entry.mean || 0);

    // Calculate the overall mean of row means
    const overallMean = meanValues.reduce((sum, value) => sum + value, 0) / meanValues.length;

    // Calculate the variance
    const variance = meanValues.reduce((sum, value) => sum + Math.pow(value - overallMean, 2), 0) / meanValues.length;

    // Calculate the standard deviation
    const standardDeviation = Math.sqrt(variance);

    // Save the calculated SD in the database
    await RowMeanSDModel.updateOne({
      userId,
      sd: standardDeviation,
      updatedAt: new Date(),
    });

    return {
      status: 'success',
      message: 'Standard deviation of row means calculated and stored successfully.',
      data: { standardDeviation },
    };
  } catch (error) {
    console.error('Error calculating standard deviation of row means:', error);
    return { status: 'failed', message: 'Internal server error.' };
  }
};


  // Calculate Final Score
static calculateFinalScore = async (userId, selectedDate = null) => {
  try {
    let startDate, endDate;

    // If selectedDate is provided, calculate based on the selected date
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);

      if (selectedDateObj.toString() === 'Invalid Date') {
        console.log("Invalid selected date:", selectedDate);
        return { status: 'failed', message: 'Invalid selected date.' };
      }

      // Calculate the date range (last 30 days including the selected date)
      startDate = new Date(selectedDateObj);
      startDate.setDate(selectedDateObj.getDate() - 30); // 30 days before the selected date
      endDate = selectedDateObj;
    } else {
      // If no selectedDate is provided, use the latest available dateOfRecord from the database
      const latestData = await DataModel.find({ userId }).sort({ dateOfRecord: -1 }).limit(1);

      if (!latestData.length) {
        console.log("No data found for the user.");
        return { status: 'failed', message: 'No data entries found for the user.' };
      }

      const latestDateOfRecord = latestData[0].dateOfRecord; // The latest dateOfRecord

      // Set the start and end dates based on the latest available dateOfRecord
      startDate = new Date(latestDateOfRecord);
      startDate.setDate(latestDateOfRecord.getDate() - 30); // 30 days before the latest dateOfRecord
      endDate = latestDateOfRecord;
    }

    // Normalize to UTC and strip out the time component
    const startDateStr = startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const endDateStr = endDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' format

    const startOfDayUTC = new Date(`${startDateStr}T00:00:00Z`);
    const endOfDayUTC = new Date(`${endDateStr}T23:59:59Z`);

    // Fetch data entries within the calculated range
    const dataEntries = await DataModel.find({
      userId,
      dateOfRecord: { $gte: startOfDayUTC, $lte: endOfDayUTC }
    });

    if (!dataEntries.length) {
      console.log("No data found for the user in the given date range");
      return { status: 'failed', message: 'No data entries found for the user within the last 30 days.' };
    }

    // Call all necessary functions to calculate the values needed for the final score
    const meanAndSDResult = await DataController.calculateMeanAndSD(userId);
    if (meanAndSDResult.status === 'failed') {
      console.log("Error in calculateMeanAndSD:", meanAndSDResult.message);
      return meanAndSDResult;  // Ensure to return the failed result with status
    }

    const standardizedValuesResult = await DataController.calculateStandardizedValues(userId);
    if (standardizedValuesResult.status === 'failed') {
      console.log("Error in calculateStandardizedValues:", standardizedValuesResult.message);
      return standardizedValuesResult;  // Ensure to return the failed result with status
    }

    const weightedScoresResult = await DataController.calculateWeightedScores(userId);
    if (weightedScoresResult.status === 'failed') {
      console.log("Error in calculateWeightedScores:", weightedScoresResult.message);
      return weightedScoresResult;  // Ensure to return the failed result with status
    }

    const rowMeanResult = await DataController.calculateRowMean(userId, selectedDate || endDateStr);
    if (rowMeanResult.status === 'failed') {
      console.log("Error in calculateRowMean:", rowMeanResult.message);
      return rowMeanResult;  // Ensure to return the failed result with status
    }

    const sdResult = await DataController.calculateSDofRM(userId, selectedDate || endDateStr);
    if (sdResult.status === 'failed') {
      console.log("Error in calculateSDofRM:", sdResult.message);
      return sdResult;  // Ensure to return the failed result with status
    }

    // Calculate the final score based on gathered results
    const finalScore = rowMeanResult.rowMeans.map((rowMean) => {
      const mean = rowMean.mean;
      const weightedScore = weightedScoresResult.data.find((ws) => ws.date === rowMean.date)?.weightedScore || 0;
      const sdOfRowMean = sdResult.data.standardDeviation || 0;

      // Final score formula (this can be adjusted as per your requirements)
      const score = mean + weightedScore * sdOfRowMean;
      return { date: rowMean.date, finalScore: score };
    });

    return {
      status: 'success',
      message: 'Final scores calculated successfully.',
      finalScores: finalScore,
    };

  } catch (error) {
    console.error('Error calculating final score:', error);
    return { status: 'failed', message: 'Internal server error.' };
  }
};
 
  
  
static getFinalScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const selectedDate = req.query.selectedDate;

    console.log("User ID:", userId);
    console.log("Selected Date from Query Parameters:", selectedDate);

    let selectedDateObj;

    // If selectedDate is provided, use it, else find the latest available date in the database
    if (selectedDate) {
      selectedDateObj = new Date(selectedDate);
      console.log("Parsed Selected Date Object:", selectedDateObj);

      if (isNaN(selectedDateObj.getTime())) {
        console.log("Invalid Date Detected:", selectedDateObj);
        return res.status(400).send({
          status: 'failed',
          message: 'Invalid selected date.',
        });
      }
    } else {
      // Fetch the latest data entry for the user and use its dateOfRecord
      const latestEntry = await DataModel.findOne({ userId }).sort({ dateOfRecord: -1 });

      if (!latestEntry) {
        console.log("No data found for the user.");
        return res.status(404).send({
          status: 'failed',
          message: 'No data entries found for the user.',
        });
      }

      selectedDateObj = latestEntry.dateOfRecord; // Use the latest entry's dateOfRecord
      console.log("Using Latest DateOfRecord:", selectedDateObj);
    }

    // Call the final score calculation
    const finalScoreResult = await DataController.calculateFinalScore(userId, selectedDateObj);

    if (finalScoreResult.status === 'failed') {
      console.log("Final Score Calculation Failed:", finalScoreResult.message);
      return res.status(400).send(finalScoreResult);
    }

    const graphData = finalScoreResult.finalScores.map((score) => ({
      date: score.date.toISOString().slice(0, 10),
      finalScore: score.finalScore,
    }));

    res.status(200).send({
      status: 'success',
      message: 'Final scores retrieved and formatted successfully.',
      data: graphData,
    });
  } catch (error) {
    console.error('Error in getFinalScore:', error);
    res.status(500).send({
      status: 'failed',
      message: 'Unable to retrieve final scores.',
    });
  }
};

  
  
  
  
  
  


}

export default DataController
