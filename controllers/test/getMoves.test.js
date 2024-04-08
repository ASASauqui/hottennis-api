const { getMoves } = require('../moves');
const Move = require('../../schemas/move.schema');
const jwt = require('jsonwebtoken');
jest.mock('../../schemas/move.schema');
jest.mock('jsonwebtoken');

describe('getMoves function', () => {
    let mockRequest;
    let mockResponse;
    let nextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            headers: {
                authorization: 'Bearer token'
            }
        };
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should return moves for a valid token', async () => {
        const decodedToken = { _id: 'user123' };
        jwt.verify.mockReturnValue(decodedToken);
        const moves = [{ id: 1, concept: 'Salary', amount: 1000 }];
        Move.find.mockResolvedValue(moves);

        await getMoves(mockRequest, mockResponse, nextFunction);

        expect(jwt.verify).toBeCalledWith('token', process.env.API_KEY);
        expect(Move.find).toBeCalledWith({ user: 'user123' });
        expect(mockResponse.json).toBeCalledWith(moves);
    });

    it('should handle errors in token verification', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Token verification failed');
        });

        await getMoves(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.status).toBeCalledWith(500);
        expect(mockResponse.json).toBeCalledWith({ message: 'Error getting moves' });
    });

    it('should handle database errors', async () => {
        const decodedToken = { _id: 'user123' };
        jwt.verify.mockReturnValue(decodedToken);
        Move.find.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getMoves(mockRequest, mockResponse, nextFunction);

        expect(mockResponse.status).toBeCalledWith(500);
        expect(mockResponse.json).toBeCalledWith({ message: 'Error getting moves' });
    });
});
