import mongoose from 'mongoose';

const StatisticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  mean: { type: Map, of: Number, required: true }, // Store mean as a key-value pair (field name -> value)
  standardDeviation: { type: Map, of: Number, required: true }, // Store standard deviation as a key-value pair
  updatedAt: { type: Date, default: Date.now }
});

const StatisticsModel = mongoose.model('Statistics', StatisticsSchema);
export default StatisticsModel;
