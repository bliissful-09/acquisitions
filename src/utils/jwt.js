import jwt from 'jsonwebtoken'; 
import logger from './logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your  default_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            logger.error('Error signing JWT token:', error);
            throw new Error('Error signing JWT token');
        }
    }
}