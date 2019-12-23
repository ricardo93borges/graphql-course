import { jwt } from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const header = request.request ?
    request.request.header.authorization :
    request.connection.context.Authorization

  if (header) {
    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'mysecret')
    return decoded.userId
  }

  if (requireAuth)
    throw new Error('Authentication required')

  return null
}

export default getUserId