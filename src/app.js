import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import render from './view.js';
import ru from './locales/ru.js';
import parse from './parser.js';

/* eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 5 }] */
yup.setLocale({
  mixed: {
    notOneOf: 'existsRSS',
  },
  string: {
    url: 'invalidURL',
  },
});

const schema = (urls) => yup.string().trim().url().notOneOf(urls);

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
        urls: [],
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.getElementById('url-input'),
        button: document.querySelector('.btn'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
      };

      const watchedState = onChange(state, render(state, elements, i18nInstance));

      const makeRequest = (url) => {
        const link = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`;
        axios
          .get(link)
          .then((response) => {
            const { feed, posts } = parse(response.data.contents);
            watchedState.feeds.push(feed);
            watchedState.posts.push(posts);
          })
          .catch((er) => console.log(er));
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');

        schema(watchedState.urls)
          .validate(url)
          .then(() => {
            watchedState.urls.push(url);
            watchedState.error = '';
            // watchedState.valid = true;
            watchedState.formState = 'processing';
          })
          .then(() => {
            makeRequest(url);
            watchedState.formState = 'finished';
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
