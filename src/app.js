import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
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

const makeRequest = (url) => {
  const link = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;
  return axios.get(link);
};

const updatePosts = (watchedState, feedId) => {
  watchedState.urls.forEach((url) => {
    makeRequest(url)
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const postsLink = watchedState.posts.map((el) => el.map((post) => post.link));
        const [arrOfLinks] = [...postsLink];
        const newPosts = posts.filter(({ link }) => !arrOfLinks.includes(link));
        // console.log(newPosts);
        const newPostsId = newPosts.map((newPost) => ({ ...newPost, feedId, id: _.uniqueId() }));
        // console.log(newPostsId);
        watchedState.posts.unshift(...newPostsId);
      })
      .finally(() => setTimeout(() => updatePosts(watchedState, feedId), 5000))
      .catch((er) => {
        throw new Error(er);
      });
  });
};

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

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');

        schema(watchedState.urls)
          .validate(url)
          .then(() => {
            watchedState.urls.push(url);
            watchedState.error = '';
            watchedState.formState = 'processing';
            return makeRequest(url);
          })
          .then((response) => {
            const { feed, posts } = parse(response.data.contents);
            feed.id = _.uniqueId();
            const feedId = feed.id;
            const postId = posts.map((post) => ({ ...post, feedId, id: _.uniqueId() }));
            watchedState.feeds.push(feed);
            watchedState.posts.push(postId);
            watchedState.formState = 'finished';
            updatePosts(watchedState, feedId);
          })
          .catch((error) => {
            if (error.message === 'parser error') {
              watchedState.error = 'notRSS';
            } else {
              watchedState.error = error.message;
            }
            watchedState.formState = 'error';
          });
      });
    })
    .catch(() => {
      throw new Error();
    });
};

export default app;
