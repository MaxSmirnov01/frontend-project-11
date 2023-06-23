const render = (watchedState, path, value, elements) => {
  // console.log(path, 'path!!');
  // console.log(value, 'value!!');
  const renderError = () => {
    if (watchedState.valid === false) {
      elements.input.classList.add('is-invalid');
    } else {
      elements.input.classList.remove('is-invalid');
    }
  };
  // const renderPosts = () => {
  // };
  // const renderForm = () => {
  // };

  switch (watchedState.formState) {
    case 'filling':
      // renderError();
      break;

    case 'error':
      renderError();
      break;

    default:
      break;
  }
};

export default render;
