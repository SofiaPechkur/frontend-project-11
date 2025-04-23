import './style.css';
import 'bootstrap';
import axios from 'axios';
import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';

export default (i18n) => {
  const input = document.querySelector('#url-input');
  const posts = document.querySelector('.posts');

  const state = {
    urls: [], // https://lorem-rss.hexlet.app/feed?unit=second, https://lorem-rss.hexlet.app/feed?unit=second&interval=30, https://lorem-rss.hexlet.app/feed?unit=day
    status: '',
    data: {
      // {title: title, description: description}
      feeds: [],
      // {postId: 1, postOpen: '', postTitle: title, postDescription: description, postLink: link},
      // {postId: 2, postOpen: '', postTitle: title, postDescription: description, postLink: link},
      posts: [],
      // activePost: postId,
      activePost: 0,
    },
  };

  const schema = yup.object().shape({
    url: yup.string().url().required().test('unique', 'RSS is not unique', (data) => !state.urls.includes(data)),
  });

  const watchedState = onChange(state, () => render(state, i18n));

  const getContents = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      const contentDoc = parser.parseFromString(response.data.contents, 'application/xml');
      return contentDoc;
    });

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = input.value;
    schema.validate({ url })
      .then(() => {
        getContents(url)
          .then((contentDoc) => {
            const changeState = (doc) => {
              const title = doc.querySelector('title').textContent;
              const description = doc.querySelector('description').textContent;
              const items = Array.from(doc.querySelectorAll('item'));
              const itemsData = items.map((item) => {
                const titleText = item.querySelector('title').textContent;
                const descriptionText = item.querySelector('description').textContent;
                const linkText = item.querySelector('link').textContent;
                return [titleText, descriptionText, linkText];
              });
              if (state.data.feeds.length === 0) {
                watchedState.data.feeds.push({ title, description });
              }
              const feedsTitles = state.data.feeds.map((feed) => feed.title);
              if (!feedsTitles.includes(title)) {
                watchedState.data.feeds.push({ title, description });
              }
              if (state.data.posts.length === 0) {
                let i = 10;
                itemsData.forEach((item) => {
                  watchedState.data.posts.push({
                    postId: i,
                    postOpen: '',
                    postTitle: item[0],
                    postDescription: item[1],
                    postLink: item[2],
                  });
                  i -= 1;
                });
              }
              const postsTitles = state.data.posts.map((post) => post.postTitle);
              itemsData.reverse().forEach((item) => {
                if (!postsTitles.includes(item[0])) {
                  watchedState.data.posts.unshift({
                    postId: state.data.posts.length + 1,
                    postOpen: '',
                    postTitle: item[0],
                    postDescription: item[1],
                    postLink: item[2],
                  });
                }
              });
            };
            changeState(contentDoc);

            const updateRSS = () => {
              state.urls.forEach((urlForUpdate) => {
                getContents(urlForUpdate)
                  .then((newContentDoc) => {
                    changeState(newContentDoc);
                  })
                  .catch(() => {});
              });
              setTimeout(updateRSS, 5000);
            };
            updateRSS();

            watchedState.urls.push(url);
            watchedState.status = 'success';
          })
          .catch((error) => {
            if (error.message === 'Network Error') {
              watchedState.status = 'Network Error';
            } else {
              watchedState.status = 'parseErr';
            }
          });
      })
      .catch((error) => {
        if (error.message === 'RSS is not unique') {
          watchedState.status = 'not unique';
        } else {
          watchedState.status = 'failed';
        }
      });
  });

  posts.addEventListener('click', (event) => {
    const { target } = event;
    const targetId = target.getAttribute('data-id');
    watchedState.data.activePost = Number(targetId);
    const targetPost = state.data.posts.find((post) => post.postId === Number(targetId));
    const index = state.data.posts.indexOf(targetPost);
    watchedState.data.posts[index].postOpen = 'yes';
  });

  render(state, i18n);
};
