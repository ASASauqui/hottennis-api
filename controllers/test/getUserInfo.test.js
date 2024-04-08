const jwt = require('jsonwebtoken');
const User = require('../../schemas/user.schema');
const { getUserInfo } = require('../userInfo');

jest.mock('jsonwebtoken');
jest.mock('../../schemas/user.schema');

describe('getUserInfo function', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            headers: {
                authorization: 'Bearer validToken'
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


    // Prueba para token inválido
    it('should return 500 if token is invalid', async () => {
        jwt.verify = jest.fn().mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await getUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error getting user info'
        });
    });

    // Prueba para usuario no encontrado
    it('should return 500 if user is not found', async () => {
        jwt.verify = jest.fn().mockReturnValue({ _id: 'nonExistentUserId' });
        User.findById = jest.fn().mockResolvedValue(null);

        await getUserInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error getting user info'
        });
    });
});
