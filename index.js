const content_btn = document.querySelectorAll('.content_btn');
content_btn.forEach((btn) => {
  btn.addEventListener('click', () => {
    content_btn.forEach((btn) => {
      btn.classList.remove('active');
    });
    btn.classList.add('active');
  });

});

// 만들기 팝업 클래스 토글 스크립트
const btnCreate = document.querySelector('li.create');
const popupCreateContents = document.querySelector('.popup_create_contents');
const btnPopupCreateClose = document.querySelector('.popup_create_contents .btn_close');

btnCreate.addEventListener('click', () => {
  popupCreateContents.classList.add('before');
});
btnPopupCreateClose.addEventListener('click', () => {
  if(popupCreateContents.classList.contains('before')){
    popupCreateContents.classList.remove('before')
  }else if(popupCreateContents.classList.contains('after')){
    popupCreateContents.classList.remove('after');
  }
});

// 게시물 모달 스크립트
// const postModal = document.querySelector('.post_modal');
const posts = document.querySelectorAll('.post');
// const postModalCloseBtn = document.querySelector('.post_modal .btn_close');
// const postEdit = document.querySelector('.post_edit');

// posts.forEach((post) => {
//   post.addEventListener('click', () => {
//     postModal.show();
//     postModal.classList.add('open');
//   });

//   postModalCloseBtn.addEventListener('click', () => {
//     postModal.close();
//     postModal.classList.remove('open');
//   });

//   postEdit.addEventListener('click', () => {
//     postModal.classList.add('post_modal_update');
//   });


// });




// 만들기 팝업 이미지 업로드 스크립트
document.addEventListener("DOMContentLoaded", () => {
  const addPostFile = document.getElementById('add_post_file');
  const previewImage = document.querySelector('.preview_img');
  const btnPost = document.querySelector('.btn_post');
  const textArea = document.getElementById('text_area');
  const postsGallery = document.querySelector('.contents_display');

  loadPostsFromLocalStorage();

  // 이미지 선택 시 미리 보기 기능 - 완료
  addPostFile.addEventListener("change", function(event) {
    const file = event.target.files[0];
    
    if(!file) {
      alert('이미지를 선택하세요!');
      return;
    }
    if (file && file.type.startsWith("image/")) {
        previewImage.src = URL.createObjectURL(file);
        popupCreateContents.classList.remove('before');
        popupCreateContents.classList.add('after');

    } else {
        previewImage.src = "";
        textArea.value = ""; 
    }
  });

  btnPost.addEventListener('click', () => {
    const caption = textArea.value; 
    const imageDataUrl = previewImage.src;
    popupCreateContents.classList.remove('after');
    savePostToLocalStorage(imageDataUrl, caption);
  });

  function savePostToLocalStorage(imageDataUrl, caption) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.push({imageUrl: imageDataUrl, caption: caption});
    localStorage.setItem("posts", JSON.stringify(posts));

    displayPost({imageUrl: imageDataUrl, caption: caption});
  }

  // 로컬 스토리지에서 게시물 데이터를 가져와서 게시판에 표시하는 함수
  function loadPostsFromLocalStorage() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(post => {
        displayPost(post);
    });
  }
  

  // 게시물을 DOM에 표시하는 함수
  function displayPost(post) {

    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    if (!posts.length) {
      postsGallery.classList.add("content_none");
      postsGallery.innerHTML = `<div class="img_container">
              <img src="imgs/camera_icon.svg" alt="camera icon">
            </div>
            <p>게시물 없음</p>`;
      return;
    }

    postsGallery.classList.remove("content_none");

    const innerHTML = posts.reduce((acc, post) => {
      return (
        acc +
        ` <div class="post">
          <div class="post_info">
            <div class="post_info_icon">
              <img src="imgs/heart_icon.svg" alt="heart icon">
              <span class="count"></span>
            </div>
            <div class="post_info_icon">
              <img src="imgs/comment_icon.svg" alt="heart icon">
              <span class="count"></span>
            </div>
          </div>
          <img src="${post.imageUrl}" alt="post img">
          <dialog class="post_modal">
            <div class="post_modal_inner">
              <img src="${post.imageUrl}" alt="post">
              <article class="modal_article">
              ${post.caption}
              </article>
              <div class="post_update">
                <textarea class="post_modal_textarea" placeholder="여기에 수정할 내용을 작성하세요..">${post.caption}</textarea>
                <div class="post_update_btns">
                  <button class="post_edit">수정</button>
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
          </dialog>
        </div>
    `
      );
    }, "");

    postsGallery.innerHTML = innerHTML;
    
  }

});