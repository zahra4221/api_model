import mongoose from "mongoose";

const freeGameSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

export const FreeGame = mongoose.model("FreeGame", freeGameSchema);
