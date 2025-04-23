export default (state, i18n) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const fullArticle = document.querySelector('.full-article');
  const btnClose = document.querySelector('.btn-secondary');
  const titleH1 = document.querySelector('.display-3');
  const afterTitleLead = document.querySelector('.lead');
  const labelUrlInput = document.querySelector('label[for="url-input"]');
  const btnSubmit = document.querySelector('.btn-lg');
  const footer = document.querySelector('.text-center span');
  const footerTextLink = document.querySelector('.text-center a');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  const firstRender = () => {
    fullArticle.textContent = i18n.t('fullArticle');
    btnClose.textContent = i18n.t('btnClose');
    titleH1.textContent = i18n.t('titleH1');
    afterTitleLead.textContent = i18n.t('afterTitleLead');
    labelUrlInput.textContent = i18n.t('labelUrlInput');
    btnSubmit.textContent = i18n.t('btnSubmit');
    footer.textContent = i18n.t('footer');
    footerTextLink.textContent = i18n.t('footerTextLink');
  };
  firstRender();

  const renderData = (stateData) => {
    const renderFeeds = (feedsArr) => {
      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      const divCardBody = document.createElement('div');
      divCardBody.classList.add('card-body');
      const h2CardTitle = document.createElement('h2');
      h2CardTitle.classList.add('card-title', 'h4');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      h2CardTitle.textContent = i18n.t('h2FeedsCardTitle');
      feeds.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(h2CardTitle);
      feeds.appendChild(ul);
      feedsArr.forEach((feed) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'border-0', 'border-end-0');
        li.innerHTML = `
                <h3 class="h6 m-0">${feed.title}</h3>
                <p class="m-0 small text-black-50">${feed.description}</p>`;
        ul.appendChild(li);
      });
    };

    const renderPosts = (postsArr) => {
      const divCard = document.createElement('div');
      divCard.classList.add('card', 'border-0');
      const divCardBody = document.createElement('div');
      divCardBody.classList.add('card-body');
      const h2CardTitle = document.createElement('h2');
      h2CardTitle.classList.add('card-title', 'h4');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'border-0', 'rounded-0');
      h2CardTitle.textContent = i18n.t('h2PostsCardTitle');
      posts.appendChild(divCard);
      divCard.appendChild(divCardBody);
      divCardBody.appendChild(h2CardTitle);
      posts.appendChild(ul);
      postsArr.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        li.innerHTML = `
                <a href="${post.postLink}" class="fw-bold" target="_blank" data-id="${post.postId}" rel="noopener noreferrer">${post.postTitle}</a>
                <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.postId}" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('btnPost')}</button>`;
        ul.appendChild(li);
      });
    };

    if (stateData.feeds.length > 0) {
      renderFeeds(stateData.feeds);
      renderPosts(stateData.posts);
    }

    const renderModalWindow = (postsArr) => {
      postsArr.forEach((post) => {
        if (post.postId === state.data.activePost) {
          document.querySelector('.modal-title').textContent = post.postTitle;
          document.querySelector('.modal-body').textContent = post.postDescription;
        }
      });
    };
    renderModalWindow(stateData.posts);

    const renderOpenPosts = (postsArr) => {
      const postsOpen = postsArr.filter((post) => post.postOpen === 'yes');
      postsOpen.forEach((post) => {
        const postTitle = document.querySelector(`a[data-id="${post.postId}"]`);
        postTitle.classList.remove('fw-bold');
        postTitle.classList.add('fw-normal', 'link-secondary');
      });
    };
    renderOpenPosts(stateData.posts);
  };

  const render = () => {
    feeds.innerHTML = '';
    posts.innerHTML = '';
    document.querySelector('.modal-title').textContent = '';
    document.querySelector('.modal-body').textContent = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
    switch (state.status) {
      case 'parseErr':
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackParseErr');
        renderData(state.data);
        break;
      case 'Network Error':
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackNetworkErr');
        renderData(state.data);
        break;
      case 'success':
        feedback.classList.add('text-success');
        feedback.textContent = i18n.t('feedbackSuccess');
        input.value = '';
        input.focus();
        renderData(state.data);
        break;
      case 'not unique':
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackRssNotUnique');
        renderData(state.data);
        break;
      case 'failed':
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t('feedbackDanger');
        renderData(state.data);
        break;
      default:
        break;
    }
  };
  render();
};
