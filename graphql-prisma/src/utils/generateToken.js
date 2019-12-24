import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'mysecret', { expiresIn: '1d' })
}

export default generateToken