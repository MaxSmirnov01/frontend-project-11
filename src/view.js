/* eslint no-param-reassign: ["error", { "props": false }] */
const renderError = (watchedState, elements, value, i18nInstance) => {
  if (value !== '') {
    elements.feedback.textContent = i18nInstance.t(`errors.${watchedState.error}`);
  }
};

const renderForm = (watchedState, elements, value) => {
  switch (value) {
    case 'processing':
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = '';
      elements.form.reset();
      elements.input.focus();
      break;

    case 'error':
      elements.input.classList.add('is-invalid');
      break;

    default:
      break;
  }
};

// const renderPosts = () => {};

// const renderFeeds = () => {};

const render = (watchedState, elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'formState':
      renderForm(watchedState, elements, value);
      break;

    case 'error':
      renderError(watchedState, elements, value, i18nInstance);
      break;

    case 'posts':
      // renderPosts(watchedState, elements, value, path);
      break;

    case 'feeds':
      // renderFeeds(watchedState, elements, value, path);
      break;

    default:
      throw new Error('Unknown state', path);
  }
};

export default render;
