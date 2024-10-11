// initial user profile
const defaultProfile = {
  id: "es__bella__",
  img: "imgs/profile_img.jpeg",
  name: "에스베야",
  description: `Hola! soy Bella 👋`,
  link: "https://github.com/WolgyeBella",
  posts: 0,
  followers: 1103,
  follows: 502,
};

// constant elements
// post
const postModal = document.querySelector('.post_modal');
const postCreate = document.querySelector('li.create');
const postCreateModal = document.querySelector('.popup_create_contents');
const postCreateModalUpdate = document.querySelector('.after_upload');
const postCreateModalInput = document.getElementById('add_post_file');
const postCreateModalCloseBtn = postCreateModal.querySelector('.btn_close');
const postCreateShareBtn = postCreateModal.querySelector('.btn_post');
const postCreateModalTextarea = document.getElementById('text_area');
const postsGallery = document.querySelector('.contents_display');

window.addEventListener('load', () => {
  initEvents();
  updatePostsUI();
});

function initEvents() {
  postCreate.addEventListener('click', () => {
    postCreateModal.classList.add('before');
  });
  postCreateModalCloseBtn.addEventListener('click', () => {
    createModalClose();
  });
  postCreateModalInput.addEventListener('change', handleFileInputChangePost);
}

function updateUI() {
  updatePostsUI();
}

function whichDialogOpen() {
  const allDialogs = Array.from(document.querySelectorAll("dialog.post_modal")); // NodeList는 유사배열객체이기 때문에 Array.from을 사용해 일반 배열로 변환함.
  const openedDialog = allDialogs.find(({ open }) => open); // open 속성인 첫번째 dialog 요소를 찾음.
  return openedDialog ? openedDialog.parentNode.id : undefined; // openedDialog가 존재하면 열려앴는 다이얼 로그의 부모 요소의 id를 반환.
}

function updatePostsUI() {
  const openedDialogPostId = whichDialogOpen();
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if(!posts.length) {
    postsGallery.classList.add("content_none");
    postsGallery.innerHTML = `<div class="img_container">
              <img src="imgs/camera_icon.svg" alt="camera icon">
            </div>
            <p>게시물 없음</p>`;
    return;
  }

  postsGallery.classList.remove('content_none');
  const innerHTML = posts.reduce((acc, post) => {
    return (
      acc +
      ` <div class="post" id="post-${post.id}">
        <div class="post_info">
          <div class="post_info_icon">
            <img src="imgs/heart_icon.svg" alt="heart icon">
            <span class="count">${post.likes}</span>
          </div>
          <div class="post_info_icon">
            <img src="imgs/comment_icon.svg" alt="comment icon">
            <span class="count">${post.comments}</span>
          </div>
        </div>
        <img src="${post.image}" alt="post-${post.id}">
        <dialog class="post_modal post_modal_view">
          <form method="dialog">
            <div class="post_modal_inner">
            <img src="${post.image}" alt="post-${post.id}" />
            <article class="modal_article">${post.text}</article>
            <div class="post_update_view">
              <textarea class="post_modal_textarea" placeholder="여기에 수정할 내용을 작성하세요..">${post.text}</textarea>
              <div class="post_update_btns">
                <button class="post_update">수정</button>
                <button class="post_edit_cancle">취소</button>
              </div>
            </div>
            <div class="post_btns">
              <button class="post_edit">
                <img src="imgs/edit_icon.svg" alt="edit icon">
              </button>
              <button class="post_trash">
                <img src="imgs/trashcan_icon.svg" alt="trash icon">
              </button>
            </div>
          </div>
          <button class="btn_close">
            <img src="imgs/close_icon.svg" alt="close icon">
          </button>
          </form>
        </dialog>
      </div>
  `
    );
  }, "");

  postsGallery.innerHTML = innerHTML;

  posts.forEach(({id, text}) => {
    const post = document.getElementById(`post-${id}`);
    if(!post) return;

    const postModal = post.querySelector('.post_modal');

    if(openedDialogPostId === `post-${id}`) postModal.showModal();

    post.addEventListener('click', () => postModal.showModal());

    postModal.querySelector('.btn_close')
      .addEventListener('click', () => {
        postModalUpdateToViewMode(postModal, text);
      });

    post.querySelector('.post_trash')
      .addEventListener('click', () => {
        confirm('정말로 삭제하시겠습니까?') && deletePost(id);
      });

    post.querySelector('.post_edit')
      .addEventListener('click', (e) => {
        e.preventDefault();

        postModalViewToUpdateMode(postModal);
      });

    post.querySelector('.post_update')
      .addEventListener('click', (e) => {
        e.preventDefault();

        updatePost(id, postModal.querySelector('.post_modal_textarea').value);
      });
    
    post.querySelector('.post_edit_cancle')
      .addEventListener('click', (e) => {
        e.preventDefault();

        postModalUpdateToViewMode(postModal, text);
      });

  })
}

function postModalViewToUpdateMode(postModal) {
  postModal.classList.remove('post_modal_view');
  postModal.classList.add('post_modal_update');
}

function postModalUpdateToViewMode(postModal, originText) {
  postModal.querySelector('.post_modal_textarea').value = originText;
  postModal.classList.add('post_modal_view');
  postModal.classList.remove('post_modal_update');
}

function createPost(image, text) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const newPosts = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    likes: 0,
    comments: 3,
    image,
    text,
  }

  posts.push(newPosts);
  localStorage.setItem("posts", JSON.stringify(posts));

  updateUI();
}

function deletePost(id) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!posts.length) return;

  localStorage.setItem(
    "posts",
    JSON.stringify(posts.filter(({ id: postId }) => id !== postId))
  );

  updateUI();
}

function updatePost(id, text) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!posts.length) return;

  localStorage.setItem(
    "posts",
    JSON.stringify(
      posts.map(({ id: postId, text: postText, ...rest }) =>
        id === postId
          ? { id: postId, text, ...rest }
          : { id: postId, text: postText, ...rest }
      )
    )
  );

  updatePostsUI();
}


function createModalClose() {
  if(postCreateModal.classList.contains('before')){
    postCreateModal.classList.remove('before');
  }else {
    postCreateModal.classList.remove('after');
  }
}

function addModalFileToShareMode() {
  postCreateModal.classList.remove("before");
  postCreateModal.classList.add("after");
}

function handleFileInputChangePost() {
  const fr = new FileReader();

  fr.readAsDataURL(this.files[0]);

  const loadEvent = fr.addEventListener('load', function () {
    addModalFileToShareMode();

    postCreateShareBtn.addEventListener('click', () => {
      createPost(fr.result, postCreateModalTextarea.value);
      postCreateModalTextarea.value = "";

      createModalClose();
    }, 
    {once: true}
    );
    
    postCreateModalUpdate.querySelector('.preview_img')
      .setAttribute('src', fr.result);

  });

  fr.removeEventListener('load', loadEvent);
} 


const content_btn = document.querySelectorAll('.content_btn');
content_btn.forEach((btn) => {
  btn.addEventListener('click', () => {
    content_btn.forEach((btn) => {
      btn.classList.remove('active');
    });
    btn.classList.add('active');
  });

});