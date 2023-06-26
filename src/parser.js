const parse = (rss) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'application/xml');
  const parserError = data.querySelector('parsererror');
  if (parserError) {
    throw new Error('parser error');
  }
  const feed = {
    title: data.querySelector('title').textContent,
    description: data.querySelector('description').textContent,
  };

  const items = data.querySelectorAll('item');

  const posts = [...items].map((item) => ({
    link: item.querySelector('link').textContent,
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
  }));

  return { feed, posts };
};

export default parse;
