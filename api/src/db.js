const db = {
  users: [
    {
      id: 1,
      name: 'John',
    },
    {
      id: 2,
      name: 'Jane',
    },
  ],

  posts: [
    {
      id: 1,
      author: 1,
      title: 'The Best Post',
      body: "It's great yo.",
    },
    {
      id: 2,
      author: 2,
      title: 'The Second Best Post',
      body: "It's also great yo.",
    },
  ],

  userIdCounter: 3,
  postIdCounter: 3,

  formatUser(user) {
    return {
      ...user,
      posts: this.posts.filter((post) => post.author == user.id),
    }
  },

  async createUser(newUser) {
    newUser.id = this.userIdCounter
    this.userIdCounter += 1
    this.users.push(newUser)
    return this.formatUser(newUser)
  },

  async getOneUser(id) {
    const user = this.users.find((user) => user.id == id)
    return this.formatUser(user)
  },

  async getAllUsers() {
    return this.users.map((user) => this.formatUser(user))
  },

  async createPost(newPost) {
    newPost.id = this.postIdCounter
    this.postIdCounter += 1
    this.posts.push(newPost)
    return this.formatPost(newPost)
  },

  formatPost(post) {
    return {
      ...post,
      author: this.users.find((user) => post.author == user.id),
    }
  },

  async getOnePost(id) {
    return this.formatPost(this.posts.find((post) => post.id == id))
  },

  async getAllPosts() {
    return this.posts.map((post) => this.formatPost(post))
  },
}

module.exports = db
