import './style.css';
import 'bootstrap';
import i18n from 'i18next';
import resources from './locales/index.js';
import onChange from 'on-change';
import * as yup from 'yup';

const runApp = () => {
    const input = document.querySelector('#url-input');
    const feedback = document.querySelector('.feedback'); // validate success or not
    const state = {
        urls: [], // ['https://lorem-rss1.hexlet.app/feed', 'https://lorem-rss2.hexlet.app/feed']
        validate: '', // success or failed
    }
    const schema = yup.object().shape({
        url: yup.string().url().required().test('unique', 'invalidUrl', (data) => !state.urls.includes(data)),
    })
    const render = () => {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.remove('text-danger');
        feedback.textContent = '';
        if (state.validate === 'success') {
            feedback.classList.add('text-success');
            feedback.textContent = i18n.t('pSuccess');
            input.value = '';
            input.focus();
        } else if (state.validate === 'failed') {
            input.classList.add('is-invalid');
            feedback.classList.add('text-danger');
            feedback.textContent = i18n.t('pDanger');
        }
    }
    const watchedState = onChange(state, render);
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        schema.validate({url: input.value})
            .then(() => {
                watchedState.urls.push(input.value);
                watchedState.validate = 'success';
            })
            .catch(() => {
                watchedState.validate = 'failed';
            })
    })
    render();
}
i18n.init({
    lng: 'ru',
    resources,
  })
  .then(() => runApp())
  .catch(() => {})