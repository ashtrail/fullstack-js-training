import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BlogPostForm } from '../components'
import http from '../http-common'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await http.get('/posts')
      setPosts(result.data)
    }

    fetchData()
  }, [])

  const createPost = (post) => {
    http
      .post('/posts', post)
      .then(({ data }) => {
        setPosts([...posts, data])
      })
      .catch((err) => {
        console.log(`API error when creating new post ${post.title}:`, err)
      })
  }

  // Render
  const blogPosts = posts.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link> by {post.author.name}
    </li>
  ))

  return (
    <div className="columns">
      <div className="column is-two-thirds">
        <div className="content">
          <h1 className="title">React Blog</h1>

          <ul>{blogPosts}</ul>
        </div>
      </div>

      <div className="column is-one-third">
        <h1 className="title">New Post</h1>
        <BlogPostForm onSubmit={createPost} />
      </div>
    </div>
  )
}
