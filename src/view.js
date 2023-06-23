const renderError = (elements, value) => {
  switch (value) {
    case 'processing':
      elements.input.classList.remove('is-invalid');
      break;

    case 'error':
      elements.input.classList.add('is-invalid');
      break;

    default:
      break;
  }
};

// const renderPosts = () => {};

// const renderForm = () => {};

const render = (watchedState, elements) => (path, value) => {
  switch (path) {
    case 'formState':
      renderError(elements, value);
      break;

    case 'valid':
      // renderError(watchedState, elements, value, path);
      break;

    case 'error':
      // renderError(watchedState, elements, value, path);
      break;

    case 'posts':
      // renderError(watchedState, elements, value, path);
      break;

    case 'feeds':
      // renderError(watchedState, elements, value, path);
      break;

    default:
      throw new Error('Unknown state', path);
  }
};

export default render;
