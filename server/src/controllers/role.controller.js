const RoleModel = require('./../models/Role.model')
const { successResponse, errorResponse } = require('../helpers/response.helper');

class RoleController {
    async getRoles(req, res) {
        try {
            const roles = await RoleModel.find()
            return successResponse(res, 200, 'Roles obtenido exitosamente', roles);
        } catch (error) {
            return errorResponse(res, 500, error.message);
        }
    }
}

module.exports = new RoleController();