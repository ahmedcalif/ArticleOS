interface Post {
  id: number;
  title: string;
  content: string;
  url?: string;
  userId?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface PostsPageProps {
  posts: Post[] | Post;
}

export default function PostsPage({ posts }: PostsPageProps) {
console.log('Received posts:', posts);
  return (
    <>
      {Array.isArray(posts) ? (
        posts.map((post: Post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <div>{post.content}</div>
          </div>
        ))
      ) : posts ? (
        <div>
          <h2>{posts.title}</h2>
          <div>{posts.content}</div>
        </div>
      ) : ( 
        <div>No posts found</div>
      )}
    </>
  );
}