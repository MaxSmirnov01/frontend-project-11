import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import render from './view.js';
import ru from './locales/ru.js';
import parse from './parser.js';

yup.setLocale({
  mixed: {
    notOneOf: 'existsRSS',
  },
  string: {
    url: 'invalidURL',
  },
});

const schema = (urls) => yup.string().trim().url().notOneOf(urls);

const makeRequest = (url) => {
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(link).catch(() => {
    throw new Error('network error');
  });
};

/* eslint-disable */
const updatePosts = (watchedState) => {
  const promises = watchedState.urls.map((url) => {
    return makeRequest(url)
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const postsLink = watchedState.posts.map((post) => post.link);
        const newPosts = posts.filter(({ link }) => !postsLink.includes(link));
        const newPostsId = newPosts.flatMap((newPost) => {
          return watchedState.feeds.map((feed) => ({ ...newPost, feedId: feed.id, id: _.uniqueId() }));
        });
        watchedState.posts.push(...newPostsId);
      })
      .catch((er) => console.log(er));
  });
  const interval = 5000;
  Promise.all(promises).finally(() => setTimeout(() => updatePosts(watchedState), interval));
};
/* eslint-enable */

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
        formState: 'filling',
        error: '',
        posts: [],
        feeds: [],
        urls: [],
        uiState: {
          selectedPosts: [],
          selectedModal: null,
        },
      };

      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.getElementById('url-input'),
        button: document.querySelector('.btn'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
        modal: document.querySelector('.modal'),
      };

      const watchedState = onChange(state, render(state, elements, i18nInstance));

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        watchedState.formState = 'processing';

        schema(watchedState.urls)
          .validate(url)
          .then(() => {
            watchedState.error = '';
            return makeRequest(url);
          })
          .then((response) => {
            const { feed, posts } = parse(response.data.contents);
            feed.id = _.uniqueId();
            const postsId = posts.map((post) => ({ ...post, feedId: feed.id, id: _.uniqueId() }));
            watchedState.feeds.push(feed);
            watchedState.posts.push(...postsId);
            watchedState.urls.push(url);
            watchedState.formState = 'finished';
          })
          .catch((error) => {
            switch (error.message) {
              case 'network error':
                watchedState.error = 'networkError';
                break;

              case 'parser error':
                watchedState.error = 'notRSS';
                break;

              default:
                watchedState.error = error.message;
            }
            watchedState.formState = 'error';
          });
      });
      elements.posts.addEventListener('click', (e) => {
        const { id } = e.target.dataset;
        if (id) {
          watchedState.uiState.selectedPosts.push(id);
          watchedState.uiState.selectedModal = id;
        }
      });
      updatePosts(watchedState);
    })
    .catch((er) => {
      console.log(er);
    });
};

export default app;
