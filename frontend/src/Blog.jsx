export default function Blog() {
  const posts = [
    { id: 1, title: '5 easy indoor plants' },
    { id: 2, title: 'How to water less often' },
  ];

  return (
    <div className="page">
      <h1>Blog</h1>
      <div className="grid grid-3">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <h3>{post.title}</h3>
            <a href="/blog/1">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}
