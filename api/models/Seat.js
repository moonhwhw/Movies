import mongoose from "mongoose";
const SeatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type:String,
            required: true,
        },

        status :{
            type: String,
            enum: ['available','occupied'],
            default: 'available',
        },
        
        
       
    },
    { timestamps: true}
);

export default mongoose.model("Seat", SeatSchema);