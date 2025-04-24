import axios from 'axios';

export default (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data.contents, 'application/xml');
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const posts = Array.from(doc.querySelectorAll('item'));
    const postsData = posts.map((post) => {
      const titleText = post.querySelector('title').textContent;
      const descriptionText = post.querySelector('description').textContent;
      const linkText = post.querySelector('link').textContent;
      return [titleText, descriptionText, linkText];
    });
    return { title, description, postsData };
  });
