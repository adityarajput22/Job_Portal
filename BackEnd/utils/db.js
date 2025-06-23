import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://abhishekkorkora321:NtximBlpThudBUr8@cluster0.fvr6v.mongodb.net/jobportal?retryWrites=true&w=majority", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


export default connectDB;
