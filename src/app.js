import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';

const schema = yup.string().trim().required().url(); // .notOneOf();

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

  const watchedState = onChange(state, (path, value) => {
    // console.log(path, value);
    if (watchedState.formState === 'filling') {
      render(watchedState, path, value, elements);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    schema
      .validate(url)
      .then(() => {
        watchedState.error = null;
      })
      .catch((error) => {
        watchedState.error = error;
      });

    if (watchedState.error !== null) {
      watchedState.valid = false;
    } else {
      watchedState.valid = true;
    }

    elements.form.reset();
    elements.input.focus();
  });
};

export default app;
