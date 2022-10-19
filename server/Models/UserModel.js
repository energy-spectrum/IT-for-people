import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    }
})

export default mongoose.model("User", UserSchema)