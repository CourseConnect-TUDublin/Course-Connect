import mongoose from "mongoose";

const ProgrammeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  groups: [String],
  courses: [String],
}, { collection: "Programmes" }); // Force Mongoose to use the "Programmes" collection

const Programme = mongoose.models.Programme || mongoose.model("Programme", ProgrammeSchema);

export default Programme;
