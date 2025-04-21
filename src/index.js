import './style.css';
import 'bootstrap';
import axios from 'axios';
import i18n from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import resources from './locales/index.js';

const runApp = () => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const fullArticle = document.querySelector('.full-article');
  const btnClose = document.querySelector('.btn-secondary');
  const titleH1 = document.querySelector('.display-3');
  const afterTitleLead = document.querySelector('.lead');
  const labelUrlInput = document.querySelector('label[for="url-input"]');
  const btnSubmit = document.querySelector('.btn-lg');
  const footer = document.querySelector('.text-center span');
  const footerTextLink = document.querySelector('.text-center a');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  const state = {
    urls: [], // https://lorem-rss.hexlet.app/feed, https://lorem-rss.hexlet.app/feed?unit=day
    status: '',
    data: {
      // {id: 1, title: title, description: description}
      feeds: [],
      // {feedId: 1, postId: 1, postTitle: title, postLink: link},
      // {feedId: 1, postId: 2, postTitle: title, postLink: link},
      posts: [],
    },
  };

  const schema = yup.object().shape({
    url: yup.string().url().required().test('unique', 'invalidUrl', (data) => !state.urls.includes(data)),
  });

  const firstRender = () => {
    fullArticle.textContent = i18n.t('fullArticle');
    btnClose.textContent = i18n.t('btnClose');
    titleH1.textContent = i18n.t('titleH1');
    afterTitleLead.textContent = i18n.t('afterTitleLead');
    labelUrlInput.textContent = i18n.t('labelUrlInput');
    btnSubmit.textContent = i18n.t('btnSubmit');
    footer.textContent = i18n.t('footer');
    footerTextLink.textContent = i18n.t('footerTextLink');
  };
  firstRender();

  const renderData = (stateData) => {
    const renderFeeds = (feedsArr) => {
      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      const divCardBody = document.createElement('div');
      divCardBody.classList.add('card-body');
      const h2CardTitle = document.createElement('h2');
      h2CardTitle.classList.add('card-title', 'h4');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      h2CardTitle.textContent = i18n.t('h2FeedsCardTitle');
      feeds.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(h2CardTitle);
      feeds.appendChild(ul);
      feedsArr.forEach((feed) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');
        li.innerHTML = `
            <h3 class="h6 m-0">${feed.title}</h3>
            <p class="m-0 small text-black-50">${feed.description}</p>`;
        ul.appendChild(li);
      });
    };
    renderFeeds(stateData.feeds);
    const renderPosts = (postsArr) => {
      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      const divCardBody = document.createElement('div');
      divCardBody.classList.add('card-body');
      const h2CardTitle = document.createElement('h2');
      h2CardTitle.classList.add('card-title', 'h4');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      h2CardTitle.textContent = i18n.t('h2PostsCardTitle');
      posts.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(h2CardTitle);
      posts.appendChild(ul);
      postsArr.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        li.innerHTML = `
            <a href="${post.postLink}" class="fw-bold" target="_blank" data-id="${post.postId}" rel="noopener noreferrer">${post.postTitle}</a>
            <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.postId}" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('btnPost')}</button>`;
        ul.appendChild(li);
      });
    };
    renderPosts(stateData.posts);
  };

  const render = () => {
    feeds.innerHTML = '';
    posts.innerHTML = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
    switch (state.status) {
      case 'parseErr':
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackParseErr');
        break;
      case 'Network Error':
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackNetworkErr');
        break;
      case 'success':
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('feedbackSuccess');
        input.value = '';
        input.focus();
        renderData(state.data);
        break;
      case 'failed':
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackDanger');
        break;
      default:
        break;
    }
  };

  const watchedState = onChange(state, render);

  const getContents = (url) => axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      const contentDoc = parser.parseFromString(response.data.contents, 'application/xml');
      return contentDoc;
    });
  // https://lorem-rss.hexlet.app/feed
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    schema.validate({ url: input.value })
      .then(() => {
        getContents(input.value)
          .then((contentDoc) => {
            const title = contentDoc.querySelector('title').textContent;
            const description = contentDoc.querySelector('description').textContent;
            const items = Array.from(contentDoc.querySelectorAll('item'));
            const itemsData = items.map((item) => {
              const titleText = item.querySelector('title').textContent;
              const linkText = item.querySelector('link').textContent;
              return [titleText, linkText];
            });
            watchedState.data.feeds.push({ id: state.data.feeds.length + 1, title, description });
            itemsData.forEach((item) => {
              watchedState.data.posts.push({
                feedId: state.data.feeds.at(-1).id,
                postId: state.data.posts.length + 1,
                postTitle: item[0],
                postLink: item[1],
              });
            });
            watchedState.urls.push(input.value);
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
      .catch(() => {
        watchedState.status = 'failed';
      });
  });

  render();
};

i18n.init({
  lng: 'ru',
  resources,
})
  .then(() => runApp())
  .catch(() => {});
