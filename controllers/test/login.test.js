const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../schemas/user.schema');
const UserCashInfo = require('../../schemas/userCashInfo.schema');
const { login } = require('../users');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../schemas/user.schema');
jest.mock('../../schemas/userCashInfo.schema');

describe('login function', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                phone: '1234567890',
                password: 'Password123!'
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Prueba para login con campos faltantes
    it('should return 400 if phone or password is missing', async () => {
        mockReq.body = { phone: '1234567890' }; // Falta contraseña

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'phone and password are required'
        });
    });

    // Prueba para usuario no encontrado
    it('should return 404 if user is not found', async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Usuario no encontrado'
        });
    });

    // Prueba para contraseña incorrecta
    it('should return 401 if password is incorrect', async () => {
        const user = { phone: '1234567890', password: 'hashedPassword' };
        User.findOne = jest.fn().mockResolvedValue(user);
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Contraseña incorrecta'
        });
    });

    // Prueba para login exitoso
    it('should return 200 and a token for successful login', async () => {
        const user = { _id: '1', phone: '1234567890', password: 'hashedPassword' };
        User.findOne = jest.fn().mockResolvedValue(user);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        jwt.sign = jest.fn().mockReturnValue('token');

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'User logged in successfully',
            data: expect.objectContaining({
                token: 'token'
            })
        }));
    });

    // Prueba para error interno
    it('should return 500 if there is an internal error', async () => {
        User.findOne = jest.fn().mockRejectedValue(new Error('Internal server error'));

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error logging in user'
        });
    });
});