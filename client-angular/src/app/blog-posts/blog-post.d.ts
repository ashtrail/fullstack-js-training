export interface PostAuthor {
  id: number
  name: string
}

export interface BlogPost {
  id: number | null
  title: string
  content: string
  author: PostAuthor
}
