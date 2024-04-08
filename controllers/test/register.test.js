const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../schemas/user.schema');
const UserCashInfo = require('../../schemas/userCashInfo.schema');
const { register } = require('../users');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../schemas/user.schema');
jest.mock('../../schemas/userCashInfo.schema');

describe('register function', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123!',
                phone: '1234567890'
            }
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        bcrypt.hash.mockResolvedValue('hashedPassword');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Prueba para un registro con datos faltantes
    it('should return 400 if required fields are missing', async () => {
        mockReq.body = { ...mockReq.body, email: '' };

        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'name, email, password and phone are required'
        });
    });

    // Prueba para un registro con contraseña inválida
    it('should return 400 for invalid password format', async () => {
        mockReq.body = { ...mockReq.body, password: 'pass' }; // Contraseña inválida

        await register(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial'
        });
    });
});