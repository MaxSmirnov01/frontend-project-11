import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import render from './view.js';
import ru from './locales/ru.js';

/* eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 5 }] */
yup.setLocale({
  mixed: {
    notOneOf: 'existsRSS',
  },
  string: {
    url: 'invalidURL',
  },
});

const schema = (feeds) => yup.string().trim().url().notOneOf(feeds);

const app = () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debag: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      const state = {
        // valid: false,
        formState: 'filling',
        error: '',
        posts: [], // posts: [{ fidId: '' }]
        feeds: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.getElementById('url-input'),
        button: document.querySelector('.btn'),
        feedback: document.querySelector('.feedback'),
      };

      const watchedState = onChange(state, render(state, elements, i18nInstance));

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');

        schema(watchedState.feeds)
          .validate(url)
          .then(() => {
            watchedState.feeds.push(url);
            watchedState.error = '';
            // watchedState.valid = true;
            watchedState.formState = 'processing';
          })
          .catch((error) => {
            watchedState.error = error.message;
            // watchedState.valid = false;
            watchedState.formState = 'error';
          });
      });
    })
    .catch(() => {
      throw new Error();
    });
};

export default app;
