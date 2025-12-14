const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        text: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)


const Message = mongoose.model('Message', messageSchema)

module.exports = Message