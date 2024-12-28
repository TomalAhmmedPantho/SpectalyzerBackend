import mongoose from 'mongoose';
const standardizedValuesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    standardizedValues: {
      type: Map,
      of: Number,
      
    },
    date: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now },
  });

  const StandardizedValuesModel = mongoose.model('StandardizedValues', standardizedValuesSchema);
  export default StandardizedValuesModel;
  