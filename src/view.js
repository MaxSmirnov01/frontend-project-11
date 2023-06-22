const render = (watchedState, path, value, elements) => {
  if (watchedState.valid === false) {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
  }
  // const renderPosts = () => {
  // };
  // const renderForm = () => {
  // };
};

export default render;
