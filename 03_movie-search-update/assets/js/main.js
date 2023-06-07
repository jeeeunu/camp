
// const showMovieDetails = (movieId) => {
//   window.location.href = `assets/detail.html?id=${movieId}`;
// };


//최상단에 개체를 쉽게 접근할 수 있도록 선언
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const movielist = document.getElementById('movielist');

// 비동기 처리를 위한 async/await 선언
//const변수는 호이스팅이 불가하여 상단에 선언
const getMovie = async () => {
  //api 변수에 서버로 api를 요청함.
  const api = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTM4NjU1N2ZkM2UyZDM3Y2EzZTZmZmVkNDBmNGYwNiIsInN1YiI6IjY0NzBiYTgzYzVhZGE1MDBjMWEzNjk1MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XdDRFvv0qvVj6vK9qJ7qA5P5fYyYBQeOdh1G5-IB5uA',
    },
  });
  //api 변수에서 서버로 api를 요청한 결과를 json 객체 형식으로 변환하며, 변환된 결과 내 results라는 키 값의 데이터만 불러올 수 있도록 변수 선언 시 {} 괄호를 통해 개별 추출
  const { results } = await api.json();

  //위 함수를 호출한 위치에 리턴될 수 있도록 return 선언
  return results;
};

// searchInput에서 엔터키 이벤트와 searchBtn 클릭 이벤트를 사용하기 위해 함수 선언
// 비동기 처리를 위한 async/await 선언
// const변수는 호이스팅이 불가하여 상단에 선언
const search = async () => {
  //searchInput객체에 기제된 value 값 받아오기
  const target = searchInput.value;

  //만일 target에 담긴 값이 비어있을 경우 alert실행 후 스크립트 종료 (return으로 인해 더 이상 밑에 코드가 작동하지 않음)
  if (!target) return alert('검색 창에 내용을 입력해 주세요.');

  //getMovie를 반환 (이때 getMovie 함수 내부에 비동기 처리가 되어있는 fetch문이 있기때문에 await으로 처리가 모두 완료될때까지 대기시간을 확보)
  const result = await getMovie();

  //result에 filter를 통해 대소문자와 관계없이, title key값에서 target값을 포함하고있는 객체만 추출하여 새로운 배열을 생성함
  const findResult = result.filter((x) => x.title.toUpperCase().indexOf(target.toUpperCase()) !== -1);

  //만일 검색 결과가 없을 경우 검색결과가 없음을 alert 노출
  if (findResult.length == 0) return alert('검색 결과가 없습니다.');

  //검색 결과를 페이지에 노출하기 전 기존 데이터들은 모두 초기화 작업 진행
  movielist.innerHTML = '';

  //검색 결과를 페이지에 출력
  findResult.forEach((info) => {
    movielist.innerHTML += `<div class="col-lg-3 mb-3">
            <div class="card" onclick="window.location.href='assets/detail.html?id=${info.id}'" style="width: 18rem; height:680px; cursor:pointer;">
              <img src="https://image.tmdb.org/t/p/original/${info['poster_path']}" class="card-img-top" alt="..." style="height:400px;">
              <div class="card-body">
                <h4 class="card-title">${info.title}</h4>
                <div style="text-align:left; font-size:14px;">
                <p><b>평점</b> : ${info.vote_average}점</p>
                <span class="mb-3"><b>요약</b></span><br>
                </div>
                <p class="card-text" style="overflow: auto; height:100px; font-size:14px; text-align:left;">${info.overview}</p>
              </div>
            </div>
          </div>`;
  });
};

//페이지가 모두 로드되었을때 실행되는 이벤트
// 비동기 처리를 위한 async/await 선언
window.addEventListener('load', async () => {
  searchInput.focus();

  //getMovie를 반환 (이때 getMovie 함수 내부에 비동기 처리가 되어있는 fetch문이 있기때문에 await으로 처리가 모두 완료될때까지 대기시간을 확보)
  const result = await getMovie();

  //결과를 페이지에 출력
  result.forEach((info) => {
    movielist.innerHTML += `<div class="col-lg-3 mb-3">
            <div class="card" onclick="window.location.href='assets/detail.html?id=${info.id}'" style="width: 18rem; height:680px; cursor:pointer;">
              <img src="https://image.tmdb.org/t/p/original/${info['poster_path']}" class="card-img-top" alt="..." style="height:400px;">
              <div class="card-body">
                <h4 class="card-title">${info.title}</h4>
                <div style="text-align:left; font-size:14px;">
                <p><b>평점</b> : ${info.vote_average}점</p>
                <span class="mb-3"><b>요약</b></span><br>
                </div>
                <p class="card-text" style="overflow: auto; height:100px; font-size:14px; text-align:left;">${info.overview}</p>
              </div>
            </div>
          </div>`;
  });
});

//key event를 통해 search함수를 실행하기 위한 함수
const searchKeyup = (e) => {
  console.log(e);
  //개체에서 키 이벤트를 실행할 경우 매개변수에 입력된 키 정보가 넘어오며, 여기서 엔터키의 경우 key는 Enter와 keyCode는 13을 결과로 출력된 것으로 확인
  //아래와 같이 if문을 통해 엔터키를 입력하였을 경우 search함수를 실행할 수 있도록 선언
  if (e.keyCode === 13) {
    search();
  }
};

//버튼 클릭시 search 함수 실행
searchBtn.addEventListener('click', search);

//인풋박스에서 키 입력 시 searchKeyup 함수 실행
searchInput.addEventListener('keyup', searchKeyup);
