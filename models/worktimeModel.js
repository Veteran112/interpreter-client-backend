import mongoose from "mongoose";

const worktimeSchema = mongoose.Schema({
    userId: {
      type: String, required: false
    },
    date: [{
        year: {
            type: Number
        },
        month: {
            type: Number
        },
        day: {
            type: String
        },
        worktime: {
            type: Number
        }
    }]
});

export const WorkTime = mongoose.model("worktime", worktimeSchema);
