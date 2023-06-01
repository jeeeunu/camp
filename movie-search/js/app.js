'use strict'; // 엄격모드 😠

console.log(`meow
 /\\_/\\  
( o.o ) 
 > ^ <
`);

// TMDB api
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTM3ODgyMWMzYTE4M2NjOGJhNTc1YzhjYzkwNTMwNiIsInN1YiI6IjY0NzVkYjkyMWJmMjY2MDQ0MTQ2ZmNmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HK9jbh1safzcGB0aV5mVDCCD8V-B26Gen4m4sguk6i8'
  }
};

const movieDB = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
// movie 데이터
let movieDataArr = [];

//-- fetch --//
fetch(movieDB, options)
  .then(response => response.json())
  .then(data => {
    movieDataArr = data.results; // movie 데이터 저장
    createCards(movieDataArr);
  })
  .catch(err => console.error(err));

//-- function : 영화 카드 만들기 --//
const createCards = dataArr => {
  const cardList = document.querySelector('.card-list');
  cardList.innerHTML = ''; // 카드 리스트 비우기

  // 데이터가 없으면 empty-text 띄우기
  if (dataArr.length === 0) {
    emptyText.classList.remove('hidden');
    return;
  }

  const htmlArray = dataArr.map((movie) => {
    const {
      id: movieId,
      backdrop_path: movieImage,
      title: movieName,
      overview: movieOverview,
      vote_average: movieAverage
    } = movie;

    return `
            <div class="card-item" data-id="${movieId}" onClick="cardIDAlert('${movieId}')">
                <div class="img-wrap">
                    <img src="https://image.tmdb.org/t/p/w500${movieImage}" alt="">
                </div>
                <strong class="movie-name">${movieName}</strong>
                <p class="movie-text">${movieOverview}</p>
                <p class="movie-averate">${movieAverage > 8.6 ? '📈' : '📉'} ${movieAverage}</p>
            </div>
        `;
  });

  cardList.innerHTML = htmlArray.join(''); // 배열 문자열로 합치기
};

//-- return : 검색된 문자 제목의 데이터만 배열로 반환 --//
const filterMovieCards = (dataArr) => {
  return dataArr.filter(movie => {
    const searchInputText = searchInput.value.trim().replace(/ /g, "").toLowerCase(); // 검색 인풋창
    const movieName = movie.original_title.trim().replace(/ /g, "").toLowerCase();
    return movieName.includes(searchInputText);
  });
};

///-- event : 검색하기 버튼 클릭시 필터링된 데이터만 불러오기 --//
const btnSearch = document.querySelector('.btn-search');
const emptyText = document.querySelector('.empty-text');

btnSearch.addEventListener('click', () => {
  const filterResults = filterMovieCards(movieDataArr); // 필터링한 데이터

  // 필터링한 데이터가 비었을때 이벤트 처리
  const numberOfResults = filterResults.length;
  numberOfResults === 0 ? emptyText.classList.remove('hidden') : emptyText.classList.add('hidden');

  createCards(filterResults); // 필터링한 데이터로 카드 만들기
});

//-- function : 카드 클릭하면 id값 띄움 --//
const cardIDAlert = dataId => {
  alert(`영화 id값은 ${dataId} 입니다!`);
};

//-- event : input에서 엔터키 누르면 버튼 클릭 --//
searchInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) { // 눌린키가 enter 키 인지 확인하는 조건문
    btnSearch.click();
    btnSearch.classList.add('active'); // 버튼 눌리는 애니메이션
    setTimeout(() => {
      btnSearch.classList.remove('active');
    }, 120);
  }
});
