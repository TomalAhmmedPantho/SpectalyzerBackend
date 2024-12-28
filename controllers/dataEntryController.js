import DataModel from '../models/studentdataentry.js';
import StatisticsModel from '../models/statisticsModel.js';
import StandardizedValuesModel from '../models/standardizedValuesModel.js';
import WeightedScoreModel from '../models/weightedScoresModel.js';
import  RowMeanModel from '../models/rowMean.js';
import RowMeanSDModel from '../models/sdofrowmean.js';
import FinalScoreModel from '../models/finalScoreModel.js';



class DataController {
  static createEntry = async (req, res) => {
    try {
      const { dateOfRecord, wakeUpTime, wakingUp, firstGoOut, firstScreenOn, breakfast, schooling, classActivity, outdoorActivity, 
        therapyAtSchool, therapyType, lunch, eveningSnacks, dinner, goingToSleep, goToBedAt, sleepAt, gettingSleepTime, outgoingTendency,
        outgoingCount, screenTime, junkFood, makingNoise, walking, showingAnger, glassCrashTendency, pushingTendency, itemThrowTendency,
        foodWaterThrowTendency, hitWithHand, hitWithHead, cooperateAtSchool, cooperateAtHome, cuttingNails, hairDressing, bedwetting,
         regularMedication, otherSickness, nameOfSickness, medOtherSickness, listOfMedicine, masturbation, toilet, overnightSleeping,
          specialActivity} = req.body;
      
  // Check if the dateOfRecord already exists for this user
  const existingEntry = await DataModel.findOne({ userId: req.user._id, dateOfRecord });
  if (existingEntry) {
    return res.status(400).send({ status: "failed", message: "Data entry for the same date already exists." });
  }

      if (!dateOfRecord) {
        return res.status(400).send({ "status": "failed", "message": "dateOfRecord is required." });
      }

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
  
      // Calculate mean and standard deviation
      fields.forEach((field) => {
        const values = userData.map((entry) => entry[field] || 0);
        const fieldMean = values.reduce((sum, value) => sum + value, 0) / values.length;
  
        const variance = values.reduce((sum, value) => sum + Math.pow(value - fieldMean, 2), 0) / values.length;
        const fieldSD = Math.sqrt(variance);
  
        mean[field] = fieldMean;
        standardDeviation[field] = fieldSD;
      });
  
      // Create a new document for the calculated mean and SD
      await StatisticsModel.create({
        userId,
        mean,
        standardDeviation,
        updatedAt: new Date(),
      });
  
      console.log(`Mean and SD calculated successfully for user: ${userId}`);
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
  

  static getMeanandSD = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Call the reusable function
      const result = await DataController.calculateMeanAndSD(userId);
  
      if (result.status === 'failed') {
        return res.status(400).send(result);
      }
  
      res.status(200).send(result);
    } catch (error) {
      console.error('Error in getMeanandSD:', error);
      res.status(500).send({ status: 'failed', message: 'Internal server error.' });
    }
  }



//----------------------------------------------------------------------------------------------//


 
  


   // Standerize value calculation
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
  
      // Save standardized values
      await StandardizedValuesModel.insertMany(standardizedValuesEntries);
  
      console.log(`Standardized values calculated successfully for user: ${userId}`);
      return { status: 'success', message: 'Standardized values calculated and stored successfully.' };
    } catch (error) {
      console.error(`Error calculating standardized values for user: ${userId}`, error);
      return { status: 'failed', message: 'Internal server error.' };
    }
  };
  
  static getStandardizedValue = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // Call the reusable function
      const result = await DataController.calculateStandardizedValues(userId);
  
      if (result.status === 'failed') {
        return res.status(400).send(result);
      }
  
      res.status(200).send(result);
    } catch (error) {
      console.error('Error in getStandardizedValue:', error);
      res.status(500).send({ status: 'failed', message: 'Internal server error.' });
    }
  };
  
  
  
  //------------------------------------------------------------------------------------------------------------//



  // weighted score calculation 
  static calculateWeightedScores = async ( userId ) => {
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

      for (const entry of standardizedValuesEntries) {
        const { date, standardizedValues } = entry;

        let weightedScore = 0;

        // Compute the weighted score
        for (const field in weights) {
          const weight = weights[field] || 0;
          const standardizedValue = standardizedValues.has(field) ? standardizedValues.get(field) : 0; // Ensure proper retrieval from Map
          weightedScore += weight * standardizedValue;
        }

        // Debugging logs
        console.log(`Date: ${date}, Weighted Score: ${weightedScore}`);

        // Save the weighted score or update if it exists
        await WeightedScoreModel.updateOne(
          { userId, date },
          { $set: { weightedScore, updatedAt: new Date() } },
          { upsert: true }
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

//   static calculateWeightedScores = async (userId) => {
//     try {
//         if (!userId) {
//             throw new Error('User ID is required.');
//         }

//         // Fetch all standardized values for the user
//         const standardizedValuesEntries = await StandardizedValuesModel.find({ userId });

//         if (!standardizedValuesEntries.length) {
//             throw new Error('No standardized values found for the user.');
//         }

//         // Group entries by date and keep the latest one based on updatedAt
//         const latestEntriesByDate = {};
//         standardizedValuesEntries.forEach(entry => {
//             const dateKey = entry.date.toISOString().split('T')[0]; // Use date as the key
//             if (!latestEntriesByDate[dateKey] || entry.updatedAt > latestEntriesByDate[dateKey].updatedAt) {
//                 latestEntriesByDate[dateKey] = entry;
//             }
//         });

//         // Fixed weights for the calculation
//         const weights = {
//             wakingUp: -0.2667,
//             firstGoOut: -0.3535,
//             firstScreenOn: -0.3209,
//             breakfast: -0.167,
//             lunch: 0.218,
//             eveningSnacks: 0.3425,
//             dinner: 0.1648,
//             goingToSleep: 0.1648,
//             cooperateAtHome: 0.1619,
//             overnightSleeping: 0.095,
//             gettingSleepTime: -0.0121,
//             outgoingTendency: 0.2842,
//             outgoingCount: 0.2202,
//             screenTime: -0.1325,
//             junkFood: 0.0474,
//             makingNoise: 0.3358,
//             walking: 0.3164,
//             showingAnger: 0.153,
//             glassCrashTendency: -0.0574,
//             pushingTendency: 0.0172,
//             itemThrowTendency: -0.0156,
//             foodWaterThrowTendency: -0.0094,
//             hitWithHand: 0.0137,
//             hitWithHead: 0.0668,
//             masturbation: 0.2189,
//         };

//         const weightedScores = [];

//         for (const dateKey in latestEntriesByDate) {
//             const entry = latestEntriesByDate[dateKey];
//             const { date, standardizedValues } = entry;

//             let weightedScore = 0;

//             // Compute the weighted score
//             for (const field in weights) {
//                 const weight = weights[field] || 0;
//                 const standardizedValue = standardizedValues.has(field) ? standardizedValues.get(field) : 0; // Ensure proper retrieval from Map
//                 weightedScore += weight * standardizedValue;
//             }

//             // Debugging logs
//             console.log(`Date: ${date}, Weighted Score: ${weightedScore}`);

//             // Save the weighted score without replacing old results
//             await WeightedScoreModel.create({
//                 userId,
//                 date,
//                 weightedScore,
//                 updatedAt: new Date(),
//             });

//             weightedScores.push({ date, weightedScore });
//         }

//         console.log('Weighted scores calculated and stored successfully.', weightedScores);
//         return {
//             status: 'success',
//             message: 'Weighted scores calculated and stored successfully.',
//             data: weightedScores,
//         };
//     } catch (error) {
//         console.error('Error calculating weighted scores:', error);
//         throw error;
//     }
// };






  //----------------------------------------------------------------------------------------//




  //ROW MEAN CALCULATION

  static calculateRowMean = async (userId) => {
    try {
      // Validate the user authentication
      
  
      
      // Fetch all data entries for the user
      const dataEntries = await DataModel.find({ userId });
  
      if (!dataEntries.length) {
        return res.status(404).send({
          status: 'failed',
          message: 'No data entries found for the user.',
        });
      }
  
      const fieldNames = [
        'wakingUp',
        'firstGoOut',
        'firstScreenOn',
        'breakfast',
        'lunch',
        'eveningSnacks',
        'dinner',
        'goingToSleep',
        'cooperateAtHome',
        'overnightSleeping',
        'gettingSleepTime',
        'outgoingTendency',
        'outgoingCount',
        'screenTime',
        'junkFood',
        'makingNoise',
        'walking',
        'showingAnger',
        'glassCrashTendency',
        'pushingTendency',
        'itemThrowTendency',
        'foodWaterThrowTendency',
        'hitWithHand',
        'hitWithHead',
        'masturbation',
      ];
  
      const rowMeans = [];
  
      for (const entry of dataEntries) {
        const { dateOfRecord, ...fields } = entry.toObject(); // Use `dateOfRecord` instead of `date` as per your schema
        if (!dateOfRecord) {
          console.warn(`Entry missing dateOfRecord: ${entry}`);
          continue;
        }
  
        let sum = 0;
        let count = 0;
  
        // Calculate the sum and count of valid fields
        for (const field of fieldNames) {
          if (fields[field] !== undefined && fields[field] !== null) {
            sum += fields[field];
            count += 1;
          }
        }
  
        const mean = count > 0 ? sum / count : 0;
  
        // Debugging logs
        console.log(`Date: ${dateOfRecord}, Row Mean: ${mean}`);
  
        // Upsert the row mean in the database
        await RowMeanModel.updateOne(
          { userId, date: dateOfRecord }, // Use `dateOfRecord` as the unique identifier
          { $set: { mean } }, // Update or set the mean
          { upsert: true } // Create a new document if none exists
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
      res.status(500).send({
        status: 'failed',
        message: 'An error occurred while calculating row means.',
      });
    }
  };
  

  // SD of the Row Mean

  static calculateSDofRM = async (userId) => {
    try {
      // Fetch all row means for the user
      const rowMeans = await RowMeanModel.find({ userId });

      if (!rowMeans.length) {
        throw new Error('No row means found for the user.');
      }

      // Check if there is at least 30 days of data
      if (rowMeans.length < 30) {
        throw new Error('Insufficient data for SD calculation (less than 30 days).');
      }

      // Extract the mean values from the row means
      const meanValues = rowMeans.map((entry) => entry.mean || 0);

      // Calculate the overall mean of row means
      const overallMean = meanValues.reduce((sum, value) => sum + value, 0) / meanValues.length;

      // Calculate the variance
      const variance = meanValues.reduce((sum, value) => sum + Math.pow(value - overallMean, 2), 0) / meanValues.length;

      // Calculate the standard deviation
      const standardDeviation = Math.sqrt(variance);

      // Debugging logs
      console.log(`Mean Values: ${meanValues}`);
      console.log(`Overall Mean: ${overallMean}`);
      console.log(`Standard Deviation of Row Means: ${standardDeviation}`);

      // Save the calculated SD in the database
      await RowMeanSDModel.create({
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
      throw error;
    }
  };
  

  //FINAL SCORE 

  static finalScore = async (userId) => {
    try {
      // Fetch the latest SD of Row Mean
      const rowMeanSD = await RowMeanSDModel.findOne({ userId }).sort({ lastUpdated: -1 });
      if (!rowMeanSD) {
        throw new Error('No Row Mean SD data found for the user.');
      }
      const sdOfRowMean = rowMeanSD.sd;
  
      // Fetch all Row Means and Weighted Scores for the user
      const rowMeans = await RowMeanModel.find({ userId });
      const weightedScores = await WeightedScoreModel.find({ userId });
  
      if (!rowMeans.length || !weightedScores.length) {
        throw new Error('No Row Means or Weighted Scores found for the user.');
      }
  
      const finalScores = [];
  
      for (const rowMean of rowMeans) {
        const { date, mean: rowMeanValue } = rowMean;
  
        // Find the corresponding weighted score for the same date
        const weightedScoreEntry = weightedScores.find(
          (entry) => entry.date.toISOString() === date.toISOString()
        );
  
        if (!weightedScoreEntry) {
          console.warn(`No weighted score found for date: ${date}`);
          continue; // Skip if there's no matching weighted score
        }
  
        const { weightedScore } = weightedScoreEntry;
  
        // Calculate the final score
        const finalScore = rowMeanValue + weightedScore * sdOfRowMean;
  
        // Debugging logs
        console.log(
          `Date: ${date}, Row Mean: ${rowMeanValue}, Weighted Score: ${weightedScore}, SD of Row Mean: ${sdOfRowMean}, Final Score: ${finalScore}`
        );
  
        // Insert the final score without replacing old results
        try {
          await FinalScoreModel.create({
            userId,
            date, // Use rowMean's date
            finalScore,
            updatedAt: new Date(), // Correct `new Date()`
          });
        } catch (err) {
          if (err.code !== 11000) {
            // Ignore duplicate key errors
            throw err;
          }
        }
  
        finalScores.push({ date, finalScore });
      }
  
      return {
        status: 'success',
        message: 'Final scores calculated and stored successfully.',
        data: finalScores,
      };
    } catch (error) {
      console.error('Error calculating final scores:', error);
      throw new Error('An error occurred while calculating final scores.');
    }
  };
  
  // static finalScore = async (userId) => {
  //   try {
  //     // Fetch the latest SD of Row Mean
  //     const rowMeanSD = await RowMeanSDModel.find({ userId }).sort({ lastUpdated: -1 });
  //     if (!rowMeanSD.length) {
  //       throw new Error('No Row Mean SD data found for the user.');
  //     }
  //     const sdOfRowMean = rowMeanSD[0].sd;

  //     // Fetch all Row Means and Weighted Scores for the user
  //     const rowMeans = await RowMeanModel.find({ userId });
  //     const weightedScoresEntries = await WeightedScoreModel.find({ userId });

  //     if (!rowMeans.length || !weightedScoresEntries.length) {
  //       throw new Error('No Row Means or Weighted Scores found for the user.');
  //     }

  //     // Group weighted scores by date and keep the latest one based on updatedAt
  //     const latestWeightedScoresByDate = {};
  //     for (const entry of weightedScoresEntries) {
  //       const dateKey = entry.date.toISOString().split('T')[0];
  //       if (!latestWeightedScoresByDate[dateKey] || entry.updatedAt > latestWeightedScoresByDate[dateKey].updatedAt) {
  //         latestWeightedScoresByDate[dateKey] = entry;
  //       }
  //     }

  //     const finalScores = [];

  //     for (const rowMean of rowMeans) {
  //       const { date, mean: rowMeanValue } = rowMean;

  //       // Find the corresponding weighted score for the same date
  //       const weightedScoreEntry = latestWeightedScoresByDate[date.toISOString().split('T')[0]];

  //       if (!weightedScoreEntry) {
  //         console.warn(`No weighted score found for date: ${date}`);
  //         continue; // Skip if there's no matching weighted score
  //       }

  //       const { weightedScore } = weightedScoreEntry;

  //       // Calculate the final score
  //       const finalScore = rowMeanValue + weightedScore * sdOfRowMean;

  //       // Debugging logs
  //       console.log(
  //         `Date: ${date}, Row Mean: ${rowMeanValue}, Weighted Score: ${weightedScore}, SD of Row Mean: ${sdOfRowMean}, Final Score: ${finalScore}`
  //       );

  //       // Insert the final score without replacing old results
  //       try {
  //         await FinalScoreModel.create({
  //           userId,
  //           date, // Use rowMean's date
  //           finalScore,
  //           updatedAt: new Date(),
  //         });
  //       } catch (err) {
  //         if (err.code !== 11000) {
  //           // Ignore duplicate key errors
  //           throw err;
  //         }
  //       }

  //       finalScores.push({ date, finalScore });
  //     }

  //     return {
  //       status: 'success',
  //       message: 'Final scores calculated and stored successfully.',
  //       data: finalScores,
  //     };
  //   } catch (error) {
  //     console.error('Error calculating final scores:', error);
  //     throw new Error('An error occurred while calculating final scores.');
  //   }
  // };
  
  
  static getFinalScore = async (req, res) => {
    try {
      // Validate user authentication
      if (!req.user || !req.user._id) {
        return res.status(401).send({
          status: 'failed',
          message: 'User is not authenticated.',
        });
      }
  
      const userId = req.user._id;
  
      // Fetch all final scores for the user
      const finalScores = await FinalScoreModel.find({ userId });
  
      if (!finalScores.length) {
        return res.status(404).send({
          status: 'failed',
          message: 'No final scores found for the user.',
        });
      }
  
      // Group records by `date` and filter by the latest `updatedAt`
      const groupedData = finalScores.reduce((acc, score) => {
        const dateKey = score.date.toISOString().slice(0, 10); // Use `date` as key
        if (!acc[dateKey] || new Date(score.updatedAt) > new Date(acc[dateKey].updatedAt)) {
          acc[dateKey] = score; // Keep the record with the latest `updatedAt`
        }
        return acc;
      }, {});
  
      // Format the filtered data for the frontend
      const graphData = Object.values(groupedData).map((score) => ({
        date: score.date.toISOString().slice(0, 10), // Format `date` as 'YYYY-MM-DD'
        finalScore: score.finalScore, // Include `finalScore`
      }));
  
      res.status(200).send({
        status: 'success',
        message: 'Final scores retrieved successfully.',
        data: graphData,
      });
    } catch (error) {
      console.error('Error retrieving final scores:', error);
      res.status(500).send({
        status: 'failed',
        message: 'Unable to retrieve final scores.',
      });
    }
  };
  


}

export default DataController
