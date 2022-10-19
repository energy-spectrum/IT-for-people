import mongoose from "mongoose";

const ProposalSchema = mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    
    date: { 
        type: Date, 
        default: Date.now 
    }
})

export default mongoose.model('Proposal', ProposalSchema)