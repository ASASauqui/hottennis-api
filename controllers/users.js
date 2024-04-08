const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/user.schema');


const JWT_EXPIRATION_TIME = '1d';

/**
 * The `register` function is an asynchronous function that handles the registration of a user by
 * validating the input data, checking for duplicate phone numbers, hashing the password, saving the
 * user and user cash info to the database, and returning a success message with the user's
 * information.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is used to
 * retrieve data sent by the client.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to set the status code, headers, and
 * send the response body.
 * @returns a JSON response with a status code and a message. If the registration is successful, it
 * also includes the user's ID, name, email, and phone number in the response data.
 */
const register = async (req, res) => {

    try {
        const body = req.body;

        const { name, email, password, phone } = body;


        if( !name || !email || !password || !phone )
            return res.status(400).json({
                message: 'name, email, password and phone are required'
            });


        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
        if(!passwordRegex.test(password))
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial'
            });

        const phoneRegex = /^\d{10}$/;
        if(!phoneRegex.test(phone))
            return res.status(400).json({
                message: 'El teléfono debe tener 10 dígitos'
            });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
            return res.status(400).json({
                message: 'Por favor ingresa un correo electrónico válido'
            });

        const duplicatedNumbers = await User.find({ phone });

        if(duplicatedNumbers.length > 0)
            return res.status(400).json({
                message: 'El teléfono ya está registrado'
            });

        const user = new User(body);

        user.password = await bcrypt.hash(password, 10);

        user.save();

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Error registrando usuario, intente más tarde.'
        });
    }

};

/**
 * The login function is an asynchronous function that handles user login by checking the provided
 * phone and password, finding the user in the database, comparing the password, generating a JWT
 * token, and returning it in the response.
 * @param req - The `req` parameter is the request object that contains information about the incoming
 * HTTP request, such as the request headers, request body, and request parameters. It is typically
 * provided by the web framework or server handling the request.
 * @param res - The `res` parameter is the response object that is used to send the response back to
 * the client. It contains methods and properties that allow you to control the response, such as
 * setting the status code, sending JSON data, or redirecting the client to another URL.
 * @returns a JSON response with a status code and a message. If the phone or password is missing, it
 * returns a 400 status code with a message indicating that both phone and password are required. If
 * the user is not found, it returns a 404 status code with a message indicating that the user was not
 * found. If the password is incorrect, it returns a 401 status code
 */
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if( !phone || !password )
            return res.status(400).json({
                message: 'phone and password are required'
            });

        const user = await User.findOne({ phone });

        if(!user)
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword)
            return res.status(401).json({
                message: 'Contraseña incorrecta'
            });

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        }, process.env.API_KEY, { expiresIn: JWT_EXPIRATION_TIME });

        res.status(200).json({
            message: 'User logged in successfully',
            data: {
                token
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error logging in user'
        });
    }
}

const updateInfo = async (req, res) => {
    const { _id } = req.user;
    try {
        const body = req.body;

        const { name=req.user.name, profile_image=req.user.name } = body;

        const user = await User.findById(_id);

        user.name = name;
        user.profile_image = profile_image;

        user.save();

        res.status(200).json({
            message: 'User updated successfully',
            data: {                
                name: user.name,
                email: user.email,
                phone: user.phone,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error updating user info'
        });
    }
}

const getInfo = async (req, res) => {
    const { user } = req;
    try {
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error getting user info'
        });
    }
}

module.exports = {
    register,
    login,
    getInfo,
    updateInfo
}