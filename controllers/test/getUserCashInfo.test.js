const jwt = require('jsonwebtoken');
const Moves = require('../../schemas/move.schema');
const { getUserCashInfo } = require('../userCashInfo');

jest.mock('jsonwebtoken');
jest.mock('../../schemas/move.schema');

describe('getUserCashInfo function', () => {
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

        await getUserCashInfo(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error getting user cash info'
        });
    });
});