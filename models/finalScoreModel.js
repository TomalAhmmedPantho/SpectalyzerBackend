import mongoose from 'mongoose';

const FinalScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  finalScore: {
    type: Number,
    required: true,
  },
  updatedAt: { type: Date, default: Date.now },
});

const FinalScoreModel = mongoose.model('FinalScore', FinalScoreSchema);

export default FinalScoreModel;
