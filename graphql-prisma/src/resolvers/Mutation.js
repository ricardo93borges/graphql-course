import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserId } from "../utils/getUserId";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const { email, password } = args.data
    const emailTaken = await prisma.exists.User({ email })

    if (emailTaken)
      throw new Error('Email taken')

    if (password.length < 8)
      throw new Error('Password must be 8 characters or longer')

    const hash = bcrypt.hash(password, 10)

    const user = await prisma.mutation.createUser({
      data: { ...args.data, password: hash }
    });

    const token = jwr.sign({ userId: user.id }, 'mysecret')

    return { user, token }
  },

  async login(parent, args, { prisma }, info) {
    const { email, password } = args

    const user = await prisma.query.user({
      email
    })

    if (!user)
      throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
      throw new Error('Unable to login')

    const token = jwt.sign({ userId: user.id }, 'mysecret')

    return {
      user,
      token
    }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const { id } = args
    const userId = getUserId(request)
    const userExists = await prisma.exists.User({ id })

    if (!userExists)
      throw new Error('User not found')

    return prisma.mutation.deleteUser({ where: { id: userId } }, info)
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },

  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const { title, body, published, author } = args.data
    return prisma.mutation.createPost({
      data: {
        title,
        body,
        published,
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const { id } = args
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })

    if (!postExists)
      throw new Error('Unable to delete post')

    return prisma.mutation.deletePost({
      where: { id }
    }, info)
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if (!postExists)
      throw new Error('Unable to update post')

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: args.id }
        }
      })
    }

    return prisma.mutation.updatePost({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  },

  async createComment(parent, args, { prisma, request }, info) {
    const { text, post } = args.data

    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id: post,
      published: true
    })

    if (!postExists)
      throw new Error('Post not found')

    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          id: userId
        },
        post: {
          connect: {
            id: post
          }
        }
      }
    }, info)
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const { id } = args
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists)
      throw new Error('Unable to delete comment')


    return prisma.mutation.deleteComment({
      where: { id }
    }, info)
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const { data } = args

    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })

    if (!commentExists)
      throw new Error('Unable to uodate comment')

    return prisma.mutation.updateComment({
      where: { id: userId },
      data
    }, info)
  }
}

export { Mutation as default }