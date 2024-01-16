import mongoose from "mongoose";

const officialGameSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  tata: Number,
});

export const OfficialGame = mongoose.model("OfficialGame", officialGameSchema);
