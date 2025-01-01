import DataModel from '../models/studentdataentry.js';




class GraphController {
    static getschoolingPieChartData = async (req, res) => {
        try {
          // Ensure user authentication
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          console.log("User ID from JWT:", req.user._id);
      
          // Fetch the last 30 entries from the database
          const userEntries = await DataModel.find({ userId: req.user._id })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(30); // Limit to the last 30 entries
          console.log("Retrieved Entries (Last 30):", userEntries);
      
          if (!userEntries || userEntries.length === 0) {
            return res.status(404).json({ status: "failed", message: "No entries found for this user." });
          }
      
          // Count occurrences of 'Yes' and 'No' for schooling
          let schoolingYesCount = 0;
          let schoolingNoCount = 0;
      
          userEntries.forEach((entry) => {
            if (entry.schooling === "Yes") schoolingYesCount++;
            if (entry.schooling === "No") schoolingNoCount++;
          });
      
          console.log("Schooling Counts:", { Yes: schoolingYesCount, No: schoolingNoCount });
      
          // Prepare pie chart data
          const pieChartData = {
            labels: ["Schooling (Yes)", "Schooling (No)"],
            datasets: [
              {
                data: [schoolingYesCount, schoolingNoCount],
                backgroundColor: ["#4CAF50", "#FF5733"], // Green for Yes, Red for No
                hoverBackgroundColor: ["#45a049", "#e63e1f"], // Hover colors
              },
            ],
          };
      
          return res.status(200).json({ status: "success", data: pieChartData });
        } catch (error) {
          console.error("Error in getschoolingPieChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getFoodBarChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = {
            breakfast: last7Entries.map((entry) => entry.breakfast || 0),
            lunch: last7Entries.map((entry) => entry.lunch || 0),
            dinner: last7Entries.map((entry) => entry.dinner || 0),
            eveningSnacks: last7Entries.map((entry) => entry.eveningSnacks || 0),
          };
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = {
            breakfast: previous7Entries.map((entry) => entry.breakfast || 0),
            lunch: previous7Entries.map((entry) => entry.lunch || 0),
            dinner: previous7Entries.map((entry) => entry.dinner || 0),
            eveningSnacks: previous7Entries.map((entry) => entry.eveningSnacks || 0),
          
          };
      
          const barChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Breakfast",
                  data: last7Data.breakfast,
                  backgroundColor: "#4CAF50",
                },
                {
                  label: "Lunch",
                  data: last7Data.lunch,
                  backgroundColor: "#FF5733",
                },
                {
                  label: "Dinner",
                  data: last7Data.dinner,
                  backgroundColor: "#FFC300",
                },
                {
                  label: "Evening Snacks",
                  data: last7Data.eveningSnacks,
                  backgroundColor: "#900C3F",
                },
                
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Breakfast",
                  data: previous7Data.breakfast,
                  backgroundColor: "#4CAF50",
                },
                {
                  label: "Lunch",
                  data: previous7Data.lunch,
                  backgroundColor: "#FF5733",
                },
                {
                  label: "Dinner",
                  data: previous7Data.dinner,
                  backgroundColor: "#FFC300",
                },
                {
                  label: "Evening Snacks",
                  data: previous7Data.eveningSnacks,
                  backgroundColor: "#900C3F",
                },
                
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: barChartData });
        } catch (error) {
          console.error("Error in getFoodBarChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getSleepingLineChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.gettingSleepTime || 0); // Sleep times for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.gettingSleepTime || 0); // Sleep times for previous 7
      
          const lineChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Getting Sleeping Time (Last 7 Entries)",
                  data: last7Data,
                  fill: false,
                  borderColor: "#4CAF50",
                  tension: 0.1,
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Getting Sleeping Time (Previous 7 Entries)",
                  data: previous7Data,
                  fill: false,
                  borderColor: "#FF5733",
                  tension: 0.1,
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: lineChartData });
        } catch (error) {
          console.error("Error in getSleepingLineChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      
      
      static getscreenTimeBarChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (last 7 + previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 14 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the charts
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.screenTime || 0); // Screen time for last 7
      
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.screenTime || 0); // Screen time for previous 7
      
          const barChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Screen Time (Last 7 Entries)",
                  data: last7Data,
                  backgroundColor: "#4CAF50",
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Screen Time (Previous 7 Entries)",
                  data: previous7Data,
                  backgroundColor: "#FF5733",
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: barChartData });
        } catch (error) {
          console.error("Error in getscreenTimeBarChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getmakingNoiseBarChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.makingNoise || 0); // Making noise levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.makingNoise || 0); // Making noise levels for previous 7
      
          const barChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Making Noise (Last 7 Entries)",
                  data: last7Data,
                  backgroundColor: "#4CAF50",
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Making Noise (Previous 7 Entries)",
                  data: previous7Data,
                  backgroundColor: "#FF5733",
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: barChartData });
        } catch (error) {
          console.error("Error in getmakingNoiseBarChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getwalkingLineChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.walking || 0); // Walking levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.walking || 0); // Walking levels for previous 7
      
          const lineChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Walking (Last 7 Entries)",
                  data: last7Data,
                  fill: false,
                  borderColor: "#4CAF50",
                  tension: 0.1,
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Walking (Previous 7 Entries)",
                  data: previous7Data,
                  fill: false,
                  borderColor: "#FF5733",
                  tension: 0.1,
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: lineChartData });
        } catch (error) {
          console.error("Error in getwalkingLineChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getwakingUpBarChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.wakingUp || 0); // Waking up levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.wakingUp || 0); // Waking up levels for previous 7
      
          const barChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Waking Up (Last 7 Entries)",
                  data: last7Data,
                  backgroundColor: "#4CAF50",
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Waking Up (Previous 7 Entries)",
                  data: previous7Data,
                  backgroundColor: "#FF5733",
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: barChartData });
        } catch (error) {
          console.error("Error in getwakingUpBarChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getgoingToSleepBarChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.goingToSleep || 0); // Going to sleep levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.goingToSleep || 0); // Going to sleep levels for previous 7
      
          const barChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Going to Sleep (Last 7 Entries)",
                  data: last7Data,
                  backgroundColor: "#4CAF50",
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Going to Sleep (Previous 7 Entries)",
                  data: previous7Data,
                  backgroundColor: "#FF5733",
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: barChartData });
        } catch (error) {
          console.error("Error in getgoingToSleepBarChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getclassActivityLineChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.classActivity || 0); // Class activity levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.classActivity || 0); // Class activity levels for previous 7
      
          const lineChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Class Activity (Last 7 Entries)",
                  data: last7Data,
                  fill: false,
                  borderColor: "#4CAF50",
                  tension: 0.1,
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Class Activity (Previous 7 Entries)",
                  data: previous7Data,
                  fill: false,
                  borderColor: "#FF5733",
                  tension: 0.1,
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: lineChartData });
        } catch (error) {
          console.error("Error in getclassActivityLineChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getoutdoorActivityLineChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.outdoorActivity || 0); // Outdoor activity levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.outdoorActivity || 0); // Outdoor activity levels for previous 7
      
          const lineChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Outdoor Activity (Last 7 Entries)",
                  data: last7Data,
                  fill: false,
                  borderColor: "#4CAF50",
                  tension: 0.1,
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Outdoor Activity (Previous 7 Entries)",
                  data: previous7Data,
                  fill: false,
                  borderColor: "#FF5733",
                  tension: 0.1,
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: lineChartData });
        } catch (error) {
          console.error("Error in getoutdoorActivityLineChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getjunkFoodLineChartData = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7).reverse(); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7).reverse(); // Previous 7 entries before that
      
          // Prepare data for the last 7 entries
          const last7Labels = last7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for last 7
          const last7Data = last7Entries.map((entry) => entry.junkFood || 0); // Junk food levels for last 7
      
          // Prepare data for the previous 7 entries
          const previous7Labels = previous7Entries.map((entry) => entry.dateOfRecord.toISOString().split("T")[0]); // Dates for previous 7
          const previous7Data = previous7Entries.map((entry) => entry.junkFood || 0); // Junk food levels for previous 7
      
          const lineChartData = {
            last7day: {
              labels: last7Labels,
              datasets: [
                {
                  label: "Junk Food Consumption (Last 7 Entries)",
                  data: last7Data,
                  fill: false,
                  borderColor: "#4CAF50",
                  tension: 0.1,
                },
              ],
            },
            previous7day: {
              labels: previous7Labels,
              datasets: [
                {
                  label: "Junk Food Consumption (Previous 7 Entries)",
                  data: previous7Data,
                  fill: false,
                  borderColor: "#FF5733",
                  tension: 0.1,
                },
              ],
            },
          };
      
          return res.status(200).json({ status: "success", data: lineChartData });
        } catch (error) {
          console.error("Error in getjunkFoodLineChartData:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getShowingAngerAverageCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Calculate totals and averages for last 7 entries
          const last7Total = last7Entries.reduce((sum, entry) => sum + (entry.showingAnger || 0), 0); // Total showing anger counts
          const last7Average = last7Total / 7; // Average for last 7
      
          // Calculate totals and averages for previous 7 entries
          const previous7Total = previous7Entries.reduce((sum, entry) => sum + (entry.showingAnger || 0), 0); // Total showing anger counts
          const previous7Average = previous7Total / 7; // Average for previous 7
      
          const result = {
            last7day: {
              
              count: parseFloat(last7Average.toFixed(2)), // Rounded average
            },
            previous7day: {
           
              count: parseFloat(previous7Average.toFixed(2)), // Rounded average
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in getShowingAngerAverageCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static gethitWithHandAverageCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for the last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Calculate totals and averages for last 7 entries (hit with hand counts)
          const last7Total = last7Entries.reduce((sum, entry) => sum + (entry.hitWithHand || 0), 0); // Total hit with hand counts
          const last7Average = last7Total / 7; // Average for last 7
      
          // Calculate totals and averages for previous 7 entries (hit with hand counts)
          const previous7Total = previous7Entries.reduce((sum, entry) => sum + (entry.hitWithHand || 0), 0); // Total hit with hand counts
          const previous7Average = previous7Total / 7; // Average for previous 7
      
          const result = {
            last7day: {
              count: parseFloat(last7Average.toFixed(2)), // Rounded average for last 7 entries
            },
            previous7day: {
              count: parseFloat(previous7Average.toFixed(2)), // Rounded average for previous 7 entries
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in gethitWithHandAverageCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getoutgoingTendencyAverageCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for the last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Calculate totals and averages for last 7 entries
          const last7Total = last7Entries.reduce((sum, entry) => sum + (entry.outgoingTendency || 0), 0); // Total outgoing tendency counts
          const last7Average = last7Total / 7; // Average for last 7
      
          // Calculate totals and averages for previous 7 entries
          const previous7Total = previous7Entries.reduce((sum, entry) => sum + (entry.outgoingTendency || 0), 0); // Total outgoing tendency counts
          const previous7Average = previous7Total / 7; // Average for previous 7
      
          const result = {
            last7day: {
             count: parseFloat(last7Average.toFixed(2)), // Rounded average
            },
            previous7day: {
              count: parseFloat(previous7Average.toFixed(2)), // Rounded average
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in getoutgoingTendencyAverageCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getbedwettingAverageCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Calculate totals and averages for last 7 entries
          const last7Total = last7Entries.reduce((sum, entry) => sum + (entry.bedwetting || 0), 0); // Total bedwetting counts
          const last7Average = last7Total / 7; // Average for last 7
      
          // Calculate totals and averages for previous 7 entries
          const previous7Total = previous7Entries.reduce((sum, entry) => sum + (entry.bedwetting || 0), 0); // Total bedwetting counts
          const previous7Average = previous7Total / 7; // Average for previous 7
      
          const result = {
            last7day: {
              count: parseFloat(last7Average.toFixed(2)), // Rounded average
            },
            previous7day: {
              count: parseFloat(previous7Average.toFixed(2)), // Rounded average
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in getbedwettingAverageCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static getcooperateAtSchoolAverageCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Calculate totals and averages for last 7 entries
          const last7Total = last7Entries.reduce((sum, entry) => sum + (entry.cooperateAtSchool || 0), 0); // Total cooperate counts
          const last7Average = last7Total / 7; // Average for last 7
      
          // Calculate totals and averages for previous 7 entries
          const previous7Total = previous7Entries.reduce((sum, entry) => sum + (entry.cooperateAtSchool || 0), 0); // Total cooperate counts
          const previous7Average = previous7Total / 7; // Average for previous 7
      
          const result = {
            last7day: {
             count: parseFloat(last7Average.toFixed(2)), // Rounded average
            },
            previous7day: {
              count: parseFloat(previous7Average.toFixed(2)), // Rounded average
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in getcooperateAtSchoolAverageCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      
      static getschoolingCountCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Count occurrences of "Yes" and "No" in the last 7 entries
          const last7YesCount = last7Entries.filter((entry) => entry.schooling === 'Yes').length;
    
      
          // Count occurrences of "Yes" and "No" in the previous 7 entries
          const previous7YesCount = previous7Entries.filter((entry) => entry.schooling === 'Yes').length;
          
      
          const result = {
            last7days: {
              Count: last7YesCount,
           
            },
            previous7days: {
              Count: previous7YesCount,
            }
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in getschoolingCountCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      static gettherapyAtSchoolCountCard = async (req, res) => {
        try {
          if (!req.user || !req.user._id) {
            return res.status(401).json({ status: "failed", message: "User not authenticated." });
          }
      
          // Fetch the last 14 entries (needed for last 7 and previous 7)
          const userEntries = await DataModel.find({
            userId: req.user._id,
          })
            .sort({ dateOfRecord: -1 }) // Sort by most recent date first
            .limit(14); // Fetch the last 14 entries
      
          console.log("Retrieved Last 14 Entries:", userEntries);
      
          if (!userEntries || userEntries.length < 7) {
            return res.status(404).json({ status: "failed", message: "Not enough entries found (at least 7 needed)." });
          }
      
          // Separate the last 7 entries and previous 7 entries
          const last7Entries = userEntries.slice(0, 7); // Most recent 7 entries
          const previous7Entries = userEntries.slice(7); // Previous 7 entries before that
      
          // Count the number of "Yes" in the therapyAtSchool field for the last 7 entries
          const last7YesCount = last7Entries.filter((entry) => entry.therapyAtSchool === 'Yes').length;
      
          // Count the number of "Yes" in the therapyAtSchool field for the previous 7 entries
          const previous7YesCount = previous7Entries.filter((entry) => entry.therapyAtSchool === 'Yes').length;
      
          const result = {
            last7day: {
              Count: last7YesCount, // Count of "Yes" for the last 7 entries
            },
            previous7day: {
             Count: previous7YesCount, // Count of "Yes" for the previous 7 entries
            },
          };
      
          return res.status(200).json({ status: "success", data: result });
        } catch (error) {
          console.error("Error in gettherapyAtSchoolCountCard:", error);
          return res.status(500).json({ status: "failed", message: "Server error.", error: error.message });
        }
      };
      
    }


    export default GraphController;