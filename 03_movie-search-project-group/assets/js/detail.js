// TODO :: 사용하기 위해 전역변수로 이동
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// 함수: 랜덤숫자 생성
const getRandomNumber = () => {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const movieDetailContainer = document.querySelector('.movie-detail-container');

// 페이지에 맞는 데이터 가져오기
const getMovieDetails = async () => {

  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=ko`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTM4NjU1N2ZkM2UyZDM3Y2EzZTZmZmVkNDBmNGYwNiIsInN1YiI6IjY0NzBiYTgzYzVhZGE1MDBjMWEzNjk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdDRFvv0qvVj6vK9qJ7qA5P5fYyYBQeOdh1G5-IB5uA',
    },
  });

  const movieDetails = await response.json();
  detail(movieDetails);
};
const detail = (data) => {
  console.log(data);
  const { id, title, poster_path, vote_average, overview, release_date, runtime } = data;
  const genre1 = data.genres[0].name;
  document.title = `${title}`;
  // movieDetailContainer.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${poster_path}')`;


  document.querySelector('.review-title').innerHTML = `<${title}><br> 리뷰를 작성해주세요. 😁`;

  movieDetailContainer.innerHTML = `
            <div class="detail_container">
                <div class="poster">
                    <img src="https://image.tmdb.org/t/p/w500/${poster_path}" />
                </div>
                <div class="info">
                    <div class="movie-title">${title}</div>
                    <div class="movie-detail">
                        <div class="set">
                            <label>Rating</label>
                            <span>${vote_average.toFixed(1)}</span>
                        </div>
                        <div class="set">
                            <label>Realease Date</label>
                            <span>${release_date}</span>
                        </div>
                        <div class="set">
                            <label>Runnig time</label>
                            <span>${runtime} min</span>
                        </div>
                        <div class="set">
                            <label>Genre</label>
                            <span>${genre1}</span>
                        </div>
                    </div>
                    <div class="movie-description">${overview}</div>
                </div>
            </div>
        `;
};

getMovieDetails();

// 리뷰 불러오기
let reviewData = Object.entries(localStorage);

const reviewRead = () => {
  reviewData.forEach((review) => {
    let reviewKey = review[0];
    review = JSON.parse(review[1]);

    // console.log(review.movieID);
    // console.log(movieId);

    if (review.movieID == movieId) {
      let html_temp = `
        <li class="review-item" data-id="${reviewKey}">
          <div class="text-wrap">
            <p class="review-text">
              ${review.text}
            </p>
            <span class="review-writer">${review.writer}</span>
          </div>
          <div class="edit-wrap hidden">
            <div class="input-box">
              <textarea class="form-control editTextarea" rows="3" placeholder="수정할 내용을 입력해주세요."></textarea>
            </div>
            <button type="button" class="btn btn-outline-primary btn-sm btn-edit-complete">수정 완료</button>
          </div>
          <div class="btn-group">
            <button type="button" class="btn btn-outline-secondary btn-sm btn-edit-confirm">수정하기</button>
            <button type="button" class="btn btn-secondary btn-sm btn-review-delete">삭제하기</button>
          </div>
        </li>
      `
      document.querySelector('.review-list').innerHTML += html_temp;
    }


  })
}
reviewRead();

//-- 리뷰 --//
const userReviewText = document.querySelector('#userReviewText');
const userReviewWriter = document.querySelector('#userReviewWriter');
const userReviewPassword = document.querySelector('#userReviewPassword');

const btnReviewSubmit = document.querySelector('#btnReviewSubmit');

// 리뷰 등록하기
btnReviewSubmit.addEventListener('click', () => {
  const reviewData = {
    'movieID': movieId,
    'text': userReviewText.value,
    'writer': userReviewWriter.value,
    'password': userReviewPassword.value
  }

  let reviewNumber;
  do {
    reviewNumber = getRandomNumber();
  } while (localStorage.getItem(`data_${reviewNumber}`) !== null);

  localStorage.setItem(`data_${reviewNumber}`, JSON.stringify(reviewData));

  alert('리뷰가 등록되었습니다.');
  location.reload();
});

// 리뷰 수정하기
const editConfirmButtons = document.querySelectorAll('.btn-edit-confirm');

editConfirmButtons.forEach(button => {
  button.addEventListener('click', () => {
    const reviewItem = button.closest('.review-item');
    const itemId = reviewItem.dataset.id;
    const thisLocalStorage = JSON.parse(localStorage.getItem(itemId));

    const promptValue = prompt('댓글을 작성했을 때 입력한 비밀번호를 작성해주세요.');

    if (promptValue === thisLocalStorage.password) {
      reviewItem.querySelector('.edit-wrap').classList.remove('hidden');
      reviewItem.querySelector('.btn-group').classList.add('hidden');

      const editTextarea = reviewItem.querySelector('.editTextarea');
      const editCompelteButton = reviewItem.querySelector('.btn-edit-complete');

      let isContentChanged = false;

      const handleInputChange = () => {
        const editContent = editTextarea.value;
        // console.log(editContent);
        thisLocalStorage.text = editContent;
        console.log(thisLocalStorage.text);
        console.log(editContent);
        isContentChanged = true;
      };

      editTextarea.addEventListener('input', handleInputChange);

      editCompelteButton.addEventListener('click', () => {
        if (!isContentChanged || thisLocalStorage.text.trim() === '') {
          alert('수정내용을 입력해주세요.');
          return;
        }

        alert('리뷰 수정이 완료되었습니다.');
        localStorage.setItem(itemId, JSON.stringify(thisLocalStorage));
        location.reload();
      });

    } else {
      alert('올바른 패스워드를 입력해주세요.');
    }
  });
});

// 리뷰 삭제하기
const DeleteButtons = document.querySelectorAll('.btn-review-delete');
DeleteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const promptValue = prompt('비밀번호를 입력해주세요.');

    const reviewItem = button.closest('.review-item');
    const itemId = reviewItem.dataset.id;
    const thisLocalStorage = JSON.parse(localStorage.getItem(itemId));

    promptValue === thisLocalStorage.password ? (localStorage.removeItem(itemId), console.log('Element removed from localStorage'), location.reload()) : alert('올바른 패스워드를 입력해주세요.')
  });
});