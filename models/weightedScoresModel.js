import mongoose from 'mongoose';

const weightedScoresSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, required: true },
 
  weightedScore: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
});

const WeightedScoreModel = mongoose.model('WeightedScore', weightedScoresSchema);

export default WeightedScoreModel;

