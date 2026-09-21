import logger from '#config/logger.js';
import { signinSchema, signupSchema } from '#validations/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';

export const signup = async (req, res, next) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ 
                errors: 'Validation failed',
                details: formatValidationErrors(validationResult.error.errors)
            });
        }

        const { name, email, password, role } = validationResult.data;

        // AUTH SERVICE
        const user = await createUser({ name, email, password, role });

        console.log('User created:', user);
        
        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

        cookies.set(res, 'token', token);

        logger.info(`User signup request received for email: ${email}`);
        res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
         });

    } catch (error) {
        logger.error('Error during signup validation:', error);

        if(error.message === 'User with this email already exists') {
            return res.status(409).json({ message: error.message });
        }

        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const validationResult = signinSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                errors: 'Validation failed',
                details: formatValidationErrors(validationResult.error.errors)
            });
        }

        const user = await authenticateUser(validationResult.data);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });
        cookies.set(res, 'token', token);

        logger.info(`User login request received for email: ${user.email}`);
        return res.status(200).json({
            message: 'Login successful',
            user
        });
    } catch (error) {
        logger.error('Error during login:', error);
        next(error);
    }
};

export const logout = (req, res) => {
    try {
        cookies.clear(res, 'token');
        logger.info(`User logged out successfully`);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Error during logout:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
};