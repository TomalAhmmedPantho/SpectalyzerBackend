import mongoose from 'mongoose';

const RowMeanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  date: { type: Date, required: true, unique: true },
  mean: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  
});

  const RowMeanModel = mongoose.model('RowMean', RowMeanSchema);
  
  export default RowMeanModel;

