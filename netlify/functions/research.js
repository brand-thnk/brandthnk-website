const { getStore } = require('@netlify/blobs');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  const store = getStore({ name: 'research', consistency: 'strong' });

  // POST — publish new research
  if (event.httpMethod === 'POST') {
    const apiKey = event.headers['x-api-key'];
    const expectedKey = process.env.RESEARCH_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }

    const { title, summary, content } = body;
    if (!title || !content) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Title and content are required' }),
      };
    }

    const slug = slugify(title);
    const now = new Date().toISOString();

    // Store the full research entry
    await store.setJSON(slug, {
      title,
      slug,
      summary: summary || '',
      content,
      publishedAt: now,
    });

    // Update the index (list of all slugs with metadata)
    let index = await store.get('_index', { type: 'json' }) || [];
    // Remove existing entry with same slug if re-publishing
    index = index.filter((item) => item.slug !== slug);
    index.unshift({ slug, title, summary: summary || '', publishedAt: now });
    await store.setJSON('_index', index);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ slug, url: `/research/?slug=${slug}` }),
    };
  }

  // GET — list all or fetch one
  if (event.httpMethod === 'GET') {
    const slug = event.queryStringParameters?.slug;

    if (slug) {
      const entry = await store.get(slug, { type: 'json' });
      if (!entry) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Not found' }),
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(entry),
      };
    }

    // Return the index
    const index = await store.get('_index', { type: 'json' }) || [];
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(index),
    };
  }

  // DELETE — remove research entry (API key required)
  if (event.httpMethod === 'DELETE') {
    const apiKey = event.headers['x-api-key'];
    const expectedKey = process.env.RESEARCH_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    const slug = event.queryStringParameters?.slug;
    if (!slug) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Slug parameter required' }),
      };
    }

    await store.delete(slug);
    let index = await store.get('_index', { type: 'json' }) || [];
    index = index.filter((item) => item.slug !== slug);
    await store.setJSON('_index', index);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ deleted: slug }),
    };
  }

  return {
    statusCode: 405,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
