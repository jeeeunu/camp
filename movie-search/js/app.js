'use strict'; // 엄격모드 😠

console.log(`
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

//-- 문서 파싱 함수 --//
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
})

//-- movie fetch --//
function fetchMovies() {
    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
        .then(response => response.json())
        .then(data => {
            cardItemSet(data.results);
        })
        .catch(err => console.error(err));
}

//-- 공통 함수 : 영화 카드 만들기 --//
const cardItemSet = dataArr => {

    const htmlArray = dataArr.map((movie) => {
        const {
            id: movieId,
            backdrop_path: movieImage,
            title: movieName,
            overview: moviewOverview,
            vote_average: movieAverate
        } = movie;

        // console.log(movieImage)

        return `
            <div class="card-item" data-id="${movieId}" onClick="(${cardItemIdAlert})()">
                <div class="img-wrap">
                    <img src="https://image.tmdb.org/t/p/w500${movieImage}" alt="">
                </div>
                <strong class="movie-name">${movieName}</strong>
                <p class="movie-text">${moviewOverview}</p>
                <p class="movie-averate">${movieAverate > 8.6 ? '📈' : '📉'} ${movieAverate}</p>
            </div>
        `
    })

    // console.log(htmlArray)
    const cardList = document.querySelector('.card-list');
    cardList.innerHTML = ''; // 카드 리스트 비우기
    cardList.innerHTML += htmlArray.join(''); // join 메서드로 배열을 문자열로 결합
}

//-- 검색된 카드 데이터만 배열로 반환 --//
const searchFunc = dataArr => {
    const searchInputText = searchInput.value.trim().replace(/ /g, "").toLowerCase();

    return dataArr.filter(movie => {
        const movieName = movie.original_title.trim().replace(/ /g, "").toLowerCase();
        return movieName.includes(searchInputText);
    });
};

//-- 검색하기 버튼 클릭시 필터링된 데이터만 불러오기 --//
const btnSearch = document.querySelector('.btn-search');
btnSearch.addEventListener('click', () => {
    fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
        .then(response => response.json())
        .then(data => {
            const results = data.results;
            const filteredResults = searchFunc(results);
            cardItemSet(filteredResults);
        })
        .catch(err => console.error(err));
});

//-- card-item 클릭하면 id값 띄우는 함수 --//
const cardItemIdAlert = () => {
    const dataId = this.dataset.id;
    alert(`영화 id값은 ${dataId} 입니다 👏`);
};

//-- input에서 enter 눌렀을시에 버튼 클릭되도록 하기 --//
searchInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) { // 눌린키가 enter키인지 확인
        btnSearch.click();
        btnSearch.classList.add('active');
        setTimeout(() => {
            btnSearch.classList.remove('active');
        }, 120);
    }
});
