import mongoose from 'mongoose';
const RowMeanSDSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    sd: {
      type: Number,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // Automatically set the date when the SD is updated
    },
  });

  const RowMeanSDModel = mongoose.model('RowMeanSD', RowMeanSDSchema);
  export default RowMeanSDModel ;