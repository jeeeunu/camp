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

// movie 데이터 담을거임
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
  cardList.innerHTML = ''; // 카드 담는 리스트 비우기

  // 데이터가 없으면 empty-text 띄우기
  if (dataArr.length === 0) {
    emptyText.classList.remove('hidden');
    return;
  }

  // 데이터 map 돌려서 html 템플릿 담음
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

  cardList.innerHTML = htmlArray.join(''); // 데이터 담은 htmlArray를 문자열로 합쳐서 card-list에 넣음
};

//-- function : 카드 클릭하면 id값 띄움 --//
const cardIDAlert = dataId => {
  alert(`영화 id값은 ${dataId} 입니다!`);
};

//-- function-return : 검색된 문자 제목의 데이터만 배열로 반환 --//
const filterMovieCards = dataArr => {

  return dataArr.filter(movie => {
    const searchInputText = searchInput.value.trim().replace(/ /g, "").toLowerCase(); // 검색 인풋창 
    // trim() => 앞뒤 공백 정리 / replace(/ /g, "") => 띄어쓰기 삭제 / toLowerCase() => 소문자 변경
    const movieName = movie.original_title.trim().replace(/ /g, "").toLowerCase(); // 영화 이름
    return movieName.includes(searchInputText); // 영화 이름에 검색어가 포함되어 있는지 확인하고, 포함되어 있으면 true 값을 반환하여 데이터를 필터링
  });
};

///-- event : 검색하기 버튼 클릭시 필터링된 데이터만 불러오기 --//
const btnSearch = document.querySelector('.btn-search');
const emptyText = document.querySelector('.empty-text');

btnSearch.addEventListener('click', () => {
  const filterResults = filterMovieCards(movieDataArr); // filterMovieCards 함수에 data를 넣어 필터링한 데이터 담음

  // 필터링한 데이터가 비었을때 empty-text 이벤트 처리
  filterResults.length === 0 ? emptyText.classList.remove('hidden') : emptyText.classList.add('hidden');

  createCards(filterResults); // 필터링한 데이터로 카드 만들기
});

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
