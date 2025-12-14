const Message = require('../models/Message.model')
const UserModel = require('../models/User.model')
const responseHelper = require('./../helpers/response.helper')

class MessageController {

    async usersForSideBar(req, res) {
        const { id } = req.user
        
        const myUser = await UserModel.findById(id).select('role')
        
        const filteredUser = await UserModel.find({ 
            _id: { $ne: id }, 
            role: myUser.role
        })
        .populate('role', 'name')
        .select("-password")
        
        return responseHelper.successResponse(res, 200, "Usuarios obtenidos", filteredUser)
    }

    async getMessages(req, res) {
        const { id: myId } = req.user
        const { id: userToChat } = req.params
        
        try {
            const messages = await Message.find({
                $or: [
                    { senderId: myId, receiverId: userToChat },
                    { senderId: userToChat, receiverId: myId }
                ]
            }).sort({ createdAt: 1 })

            return responseHelper.successResponse(res, 200, "Mensajes obtenidos", messages)
        } catch (error) {
            responseHelper.errorResponse(res, 400, "Algo salió mal")
        }
    }

    async sendMessage(req, res) {
        try {
            const { text, image } = req.body
            const { id: myId } = req.user
            const { id: idUserToSend } = req.params

            const newMessage = new Message({
                senderId: myId,
                receiverId: idUserToSend,
                text,
                image
            })

            await newMessage.save()

            // 👇 EMITIR POR SOCKET
            const io = req.io;
            const userSocketMap = req.userSocketMap;
            
            if (io && userSocketMap) {
                const receiverSocketId = userSocketMap.get(idUserToSend);
                
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('receive-message', {
                        _id: newMessage._id,
                        senderId: myId,
                        receiverId: idUserToSend,
                        text,
                        image,
                        createdAt: newMessage.createdAt
                    });
                    
                }
            }

            return responseHelper.successResponse(res, 200, "Mensaje enviado", newMessage)
        } catch (error) {
            responseHelper.errorResponse(res, 400, "Algo salió mal en el mensaje")
        }
    }
}

module.exports = new MessageController()