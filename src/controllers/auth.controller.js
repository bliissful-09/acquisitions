export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate the request body using the signupSchema
        const validatedData = signupSchema.parse({ name, email, password, role });
    } catch (error) {
        logger.error('Error during signup validation:', error);

        if(error.message === 'User with this email already exists') {
            return res.status(400).json({ message: error.message });
        }

        next(error);
    }
}