import mongoose from "mongoose";

// Counter Schema
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "clients"
  sequence_value: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Function to get the next sequence value based on schema name
export const genNextSequenceValue = async (schemaName) => {
  try {
    // Update the counter for the given schema name and return the new sequence value
    const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: schemaName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    return sequenceDocument.sequence_value;
  } catch (err) {
    console.error("Error generating sequence value:", err);
    throw err;
  }
};
