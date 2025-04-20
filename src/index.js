import './style.css';
import 'bootstrap';
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

  const state = {
    urls: [], // ['https://lorem-rss1.hexlet.app/feed', 'https://lorem-rss2.hexlet.app/feed']
    validateStatus: '', // success or failed
  };

  const schema = yup.object().shape({
    url: yup.string().url().required().test('unique', 'invalidUrl', (data) => !state.urls.includes(data)),
  });

  const render = () => {
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

    input.classList.remove('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
    if (state.validateStatus === 'success') {
      feedback.classList.add('text-success');
      feedback.textContent = i18n.t('feedbackSuccess');
      input.value = '';
      input.focus();
    } else if (state.validateStatus === 'failed') {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18n.t('feedbackDanger');
    }
  };

  const watchedState = onChange(state, render);

  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    schema.validate({ url: input.value })
      .then(() => {
        watchedState.urls.push(input.value);
        watchedState.validate = 'success';
      })
      .catch(() => {
        watchedState.validate = 'failed';
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
