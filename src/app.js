import './style.css';
import 'bootstrap';
import _ from 'lodash';
import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';
import getData from './getData.js';

export default (i18n) => {
  const input = document.querySelector('#url-input');
  const posts = document.querySelector('.posts');

  const state = {
    isRequestExecuting: false,
    statusApp: 'waiting',
    data: {
      // {title: title, description: description, url: url}
      // https://lorem-rss.hexlet.app/feed?unit=second, https://lorem-rss.hexlet.app/feed?unit=second&interval=30, https://lorem-rss.hexlet.app/feed?unit=day
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
    url: yup.string().url().required().test('unique', 'RSS is not unique', (data) => !state.data.feeds.map((feed) => feed.url).includes(data)),
  });

  const watchedState = onChange(state, (path) => render(state, i18n, path));

  const setFeed = (data) => {
    const { title, description, url } = data;
    watchedState.data.feeds.push({ title, description, url });
  };

  const setPosts = (data) => {
    const { postsData } = data;
    const postsTitlesInState = state.data.posts.map((post) => post.postTitle);
    const postsTitlesIncome = postsData.reverse().map((post) => post.titleText);
    const postsTitlesAll = new Set([...postsTitlesInState, ...postsTitlesIncome]);
    const postsTitlesNew = Array.from(postsTitlesAll)
      .filter((title) => !postsTitlesInState
        .includes(title));
    const postsNew = postsData.filter((post) => postsTitlesNew.includes(post.titleText));
    postsNew.forEach((post) => {
      const id = _.uniqueId();
      watchedState.data.posts.unshift({
        postId: id,
        postTitle: post.titleText,
        postDescription: post.descriptionText,
        postLink: post.linkText,
      });
      watchedState.uiState.posts.unshift({
        postId: id,
        visibility: 'new',
      });
    });
  };

  const updateRSS = () => {
    const feedUrls = state.data.feeds.map((feed) => feed.url);
    const promises = feedUrls.map((urlForUpdate) => getData(urlForUpdate)
      .then((data) => {
        setPosts(data);
      })
      .catch(() => {}));
    Promise.all(promises)
      .then(() => {
        setTimeout(updateRSS, 5000);
      })
      .catch(() => {});
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.isRequestExecuting = true;
    const url = input.value;
    schema.validate({ url })
      .then(() => {
        getData(url)
          .then((data) => {
            setFeed(data);
            setPosts(data);

            watchedState.statusApp = 'noError';
            watchedState.isRequestExecuting = false;
          })
          .catch((error) => {
            if (error.message === 'Network Error') {
              watchedState.statusApp = 'Network Error';
            } else {
              watchedState.statusApp = 'parseErr';
            }
            watchedState.isRequestExecuting = false;
          });
      })
      .catch((error) => {
        console.log(error);
        if (error.message === 'RSS is not unique') {
          watchedState.statusApp = 'not unique';
        } else {
          watchedState.statusApp = 'failed';
        }
        watchedState.isRequestExecuting = false;
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
  updateRSS();
};
