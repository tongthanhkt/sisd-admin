import clientPromise from './mongodb';

export async function getBlogs() {
  try {
    const client = await clientPromise;
    const db = client.db('test');
    const blogs = await db.collection('blogs').find({}).toArray();
    return { blogs };
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch blogs');
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db('test');
    const blog = await db.collection('blogs').findOne({ slug });
    return blog;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to fetch blog');
  }
}
