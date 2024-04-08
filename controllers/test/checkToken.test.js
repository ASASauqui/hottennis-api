const jwt = require('jsonwebtoken');
const { checkToken } = require('../users');

jest.mock('jsonwebtoken');

describe('checkToken function', () => {
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

    // Prueba para un token válido
    it('should return 200 if token is valid', async () => {
        jwt.verify = jest.fn().mockImplementation(() => ({ /* datos del token decodificados */ }));

        await checkToken(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Token is valid'
        });
    });

    // Continúa con las otras pruebas
    // ...

});