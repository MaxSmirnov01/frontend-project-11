/* eslint no-param-reassign: ["error", { "props": false }] */
const renderError = (elements, value, i18nInstance) => {
  if (value !== '') {
    elements.feedback.textContent = i18nInstance.t(`errors.${value}`);
  }
};

const renderForm = (elements, value, i18nInstance) => {
  switch (value) {
    case 'processing':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.textContent = '';
      elements.form.reset();
      elements.input.focus();
      break;

    case 'finished':
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18nInstance.t('validUrl');
      break;

    case 'error':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      break;

    default:
      throw new Error('Unknown value!', value);
  }
};

const renderPosts = (watchedState, elements, value, i18nInstance) => {
  elements.posts.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = i18nInstance.t('posts');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.setAttribute('data-id', post.id);
    if (watchedState.uiState.selectedPosts.includes(post.id)) {
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
      a.classList.remove('fw-normal', 'link-secondary');
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('button');
    li.append(a, button);
    ul.prepend(li);
  });

  cardBody.append(postsTitle);
  card.append(cardBody, ul);
  elements.posts.append(card);
};

const renderFeeds = (elements, value, i18nInstance) => {
  elements.feeds.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18nInstance.t('feeds');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;
    li.append(title, description);
    ul.prepend(li);
  });

  cardBody.append(feedsTitle);
  card.append(cardBody, ul);
  elements.feeds.append(card);
};

const renderModal = (watchedState, elements, value) => {
  const post = watchedState.posts.find((el) => el.id === value);
  const modalTitle = elements.modal.querySelector('.modal-title');
  modalTitle.textContent = post.title;
  const modalBody = elements.modal.querySelector('.modal-body');
  modalBody.textContent = post.description;
  const a = elements.modal.querySelector('a');
  a.setAttribute('href', post.link);
};

const renderLink = (elements, value) => {
  value.forEach((id) => {
    const post = elements.posts.querySelector(`a[data-id='${id}']`);
    post.classList.remove('fw-bold');
    post.classList.add('fw-normal', 'link-secondary');
  });
};

const render = (watchedState, elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'formState':
      renderForm(elements, value, i18nInstance);
      break;

    case 'error':
      renderError(elements, value, i18nInstance);
      break;

    case 'posts':
      renderPosts(watchedState, elements, value, i18nInstance);
      break;

    case 'feeds':
      renderFeeds(elements, value, i18nInstance);
      break;

    case 'uiState.selectedPosts':
      renderLink(elements, value);
      break;

    case 'uiState.selectedModal':
      renderModal(watchedState, elements, value);
      break;

    case 'urls':
      break;

    default:
      throw new Error('Unknown state!', path);
  }
};

export default render;
