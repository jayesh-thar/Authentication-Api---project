import jwt from "jsonwebtoken";

const generateToken = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    res.cookie('token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict',
        maxAge: 1000*60*60*24*7 //7d
    });
    return token
};

export default generateToken

/*  FLOw:

        generateToken(user._id, res)
                ↓
        jwt.sign({ userId: user._id }, secret, { expiresIn })
                ↓
        creates token string: "eyJhbG..."
                ↓
        res.cookie('token', "eyJhbG...", { httpOnly... })
                ↓
        cookie attached to response
                ↓
        res.json() sends response WITH cookie attached
                ↓
        browser receives response → stores cookie automatically

*/
