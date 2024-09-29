import jwt from 'jsonwebtoken';

const generateToken = (id, res) => {
   const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   });
   res.cookie('jwt', token, {
      maxAge: 90 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Accessible only by the web server
      secure: false,  // Set to true if using https
      sameSite: 'Lax'
   });
};

export default generateToken;