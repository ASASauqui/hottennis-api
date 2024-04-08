const jwt = require('jsonwebtoken');
const User = require('../../schemas/user.schema');
const { updateUserInfo } = require('../userInfo');

jest.mock('jsonwebtoken');
jest.mock('../../schemas/user.schema');

describe('updateUserInfo function', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            headers: {
                authorization: 'Bearer validToken'
            },
            body: {
                name: 'John Doe',
                phone: '1234567890',
                email: 'john@example.com',
                profileImage: 'http://example.com/image.jpg'
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jwt.verify = jest.fn().mockReturnValue({ _id: 'userId' });
        User.findById = jest.fn().mockResolvedValue({ _id: 'userId', save: jest.fn() });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Prueba para datos faltantes
    it('should return 400 if required fields are missing', async () => {
        delete mockReq.body.email; // Eliminar email para simular datos faltantes

        await updateUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'name, phone and email are required'
        });
    });

    // Prueba para teléfono inválido
    it('should return 400 for invalid phone format', async () => {
        mockReq.body.phone = 'invalidPhone'; // Formato de teléfono inválido

        await updateUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'El teléfono debe tener 10 dígitos'
        });
    });

    // Prueba para email inválido
    it('should return 400 for invalid email format', async () => {
        mockReq.body.email = 'invalidEmail'; // Formato de email inválido

        await updateUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Por favor ingresa un correo electrónico válido'
        });
    });

    // Prueba para teléfono duplicado
    it('should return 400 if phone is already registered', async () => {
        User.find = jest.fn().mockResolvedValue([{ _id: 'anotherUserId' }]);

        await updateUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'El teléfono ya está registrado'
        });
    });
});
