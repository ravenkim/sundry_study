import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
});


// 비밀번호 해쉬화 하는 과정
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});



const User = mongoose.model("User", userSchema)
export default User;