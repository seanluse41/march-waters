// /routes/api/get-news-notes/+server.js
export async function GET() {
  const username = 'kind_phlox908';

  try {
    const response = await fetch(`https://note.com/api/v2/creators/${username}/contents?kind=note&page=1`);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const data = await response.json();

    const filteredContents = data.data.contents.filter(article => {
      return article.hashtags.some(tag => tag.hashtag.name != "#ニュース");
    });

    const filteredData = {
      data: {
        ...data.data,
        contents: filteredContents
      }
    };

    return new Response(JSON.stringify(filteredData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}