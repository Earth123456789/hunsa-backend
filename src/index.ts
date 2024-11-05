import app from "./app";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

dotenv.config();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://18.204.213.201:${process.env.PORT}`);
});
