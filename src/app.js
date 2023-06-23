import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';

/* eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 5 }] */

const schema = (feeds) => yup.string().trim().url().notOneOf(feeds);

const app = () => {
  const state = {
    valid: false,
    formState: 'filling',
    error: null,
    posts: [], // posts: [{ fidId: '' }]
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    button: document.querySelector('.btn'),
  };

  const watchedState = onChange(state, render(state, elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    schema(watchedState.feeds)
      .validate(url)
      .then((data) => {
        console.log('validation was successful', data);
        watchedState.feeds.push(url);
        // watchedState.error = null;
        // watchedState.valid = true;
        watchedState.formState = 'processing';
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        console.log('validation failed', error);
        // watchedState.error = error;
        // watchedState.valid = false;
        watchedState.formState = 'error';
      });
  });
};

export default app;
