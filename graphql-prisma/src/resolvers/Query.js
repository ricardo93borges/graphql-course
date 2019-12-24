import { getUserId } from "../utils/getUserId";

const Query = {

  users(parent, args, { db, prisma }, info) {
    const { query, first, skip, after, orderBy } = args;

    const opArgs = { first, skip, after, orderBy }

    if (query) {
      opArgs.where = {
        OR: [
          { name_contains: query },
        ]
      }
    }

    return prisma.query.users(opArgs, info)
  },

  posts(parent, args, { prisma }, info) {
    const { query, first, skip, after, orderBy } = args;

    const opArgs = {
      first,
      skip,
      after,
      orderBy,
      where: {
        published: true
      }
    }

    if (query) {
      opArgs.where.or = [
        { title_contains: query },
        { body_contains: query },
      ]
    }

    return prisma.query.posts(opArgs, info)
  },

  myPosts(parent, args, { prisma, request }, info) {
    const { query, first, skip, after, orderBy } = args;
    const userId = getUserId(request)
    const opArgs = {
      where: {
        first,
        skip,
        after,
        orderBy,
        author: {
          id: userId
        }
      }
    }

    if (query) {
      opArgs.where.or = [
        { title_contains: query },
        { body_contains: query },
      ]
    }

    return prisma.query.posts(opArgs, info)
  },

  comments(parent, args, { db, prisma }, info) {
    const { first, skip, after, orderBy } = args;
    return prisma.query.comments(
      { first, skip, after, orderBy },
      info
    )
  },

  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },

  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info)

    if (posts.length === 0)
      throw new Error('Post not found')

    return posts[0]
  }
}

export { Query as default }