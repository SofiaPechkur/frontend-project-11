import './style.css';
import 'bootstrap';
import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';
import parse from './parse.js';

export default (i18n) => {
  const input = document.querySelector('#url-input');
  const posts = document.querySelector('.posts');

  const state = {
    urls: [], // https://lorem-rss.hexlet.app/feed?unit=second, https://lorem-rss.hexlet.app/feed?unit=second&interval=30, https://lorem-rss.hexlet.app/feed?unit=day
    statusApp: 'waiting', // 'waiting' or 'request'
    typeError: null,
    data: {
      // {title: title, description: description}
      feeds: [],
      // {postId: 1, postTitle: title, postDescription: description, postLink: link},
      // {postId: 2, postTitle: title, postDescription: description, postLink: link},
      posts: [],
    },
    uiState: {
      // activePost: postId,
      activePost: 0,
      // {postId: id, visibility: 'new' or 'visited'}
      posts: [],
    },
  };

  const schema = yup.object().shape({
    url: yup.string().url().required().test('unique', 'RSS is not unique', (data) => !state.urls.includes(data)),
  });

  const watchedState = onChange(state, () => render(state, i18n));

  const setState = (data) => {
    const { title, description, postsData } = data;
    const feedsTitles = state.data.feeds.map((feed) => feed.title);
    if (!feedsTitles.includes(title)) {
      watchedState.data.feeds.push({ title, description });
    }
    const postsTitles = state.data.posts.map((post) => post.postTitle);
    postsData.reverse().forEach((item) => {
      if (!postsTitles.includes(item[0])) {
        const id = _.uniqueId();
        watchedState.data.posts.unshift({
          postId: id,
          postTitle: item[0],
          postDescription: item[1],
          postLink: item[2],
        });
        watchedState.uiState.posts.unshift({
          postId: id,
          visibility: 'new',
        });
      }
    });
  };

  const updateRSS = () => {
    state.urls.forEach((urlForUpdate) => {
      parse(urlForUpdate)
        .then((data) => {
          setState(data);
          setTimeout(updateRSS, 5000);
        })
        .catch(() => {});
    });
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.statusApp = 'request';
    const url = input.value;
    schema.validate({ url })
      .then(() => {
        parse(url)
          .then((data) => {
            setState(data);

            watchedState.urls.push(url);
            if (state.urls.length === 1) {
              updateRSS();
            }

            watchedState.typeError = 'noError';
            form.reset();
            watchedState.statusApp = 'waiting';
          })
          .catch((error) => {
            if (error.message === 'Network Error') {
              watchedState.typeError = 'Network Error';
            } else {
              watchedState.typeError = 'parseErr';
            }
            watchedState.statusApp = 'waiting';
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.message === 'RSS is not unique') {
          watchedState.typeError = 'not unique';
        } else {
          watchedState.typeError = 'failed';
        }
        watchedState.statusApp = 'waiting';
      });
  });

  posts.addEventListener('click', (event) => {
    const { target } = event;
    const targetId = target.getAttribute('data-id');
    watchedState.uiState.activePost = targetId;
    const targetPost = state.uiState.posts.find((post) => post.postId === targetId);
    const index = state.uiState.posts.indexOf(targetPost);
    watchedState.uiState.posts[index].visibility = 'visited';
  });

  render(state, i18n);
};
