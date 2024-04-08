const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../schemas/user.schema');
const { updatePassword } = require('../userInfo');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../schemas/user.schema');

describe('updatePassword function', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            headers: {
                authorization: 'Bearer validToken'
            },
            body: {
                currentPassword: 'currentPassword123!',
                newPassword: 'newPassword123!'
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jwt.verify = jest.fn().mockReturnValue({ _id: 'userId' });
        User.findById = jest.fn().mockResolvedValue({
            _id: 'userId',
            password: 'hashedCurrentPassword',
            save: jest.fn()
        });
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        bcrypt.hash = jest.fn().mockResolvedValue('hashedNewPassword');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Prueba para contraseñas faltantes
    it('should return 400 if passwords are missing', async () => {
        delete mockReq.body.currentPassword;

        await updatePassword(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'currentPassword and newPassword are required'
        });
    });

    // Prueba para contraseñas iguales
    it('should return 400 if current and new password are the same', async () => {
        mockReq.body.newPassword = 'currentPassword123!';

        await updatePassword(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'currentPassword and newPassword must be different'
        });
    });

    // Prueba para formato de contraseña inválido
    it('should return 400 for invalid password format', async () => {
        mockReq.body.newPassword = 'pass'; // Formato de contraseña inválido

        await updatePassword(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Password must have at least 6 characters, one uppercase, one lowercase, one number and one special character'
        });
    });

    // Prueba para contraseña actual incorrecta
    it('should return 400 if current password is incorrect', async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await updatePassword(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Incorrect password'
        });
    });
});
