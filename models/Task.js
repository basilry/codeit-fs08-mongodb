import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
      validator: (title) => {
        return title.split(" ").length > 1;
      },
      message: "Must contain at least 2 words",
    },
  },
  description: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;