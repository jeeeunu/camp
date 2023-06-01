#movie-search

-   검색 기능 구현하면서 fetch를 두번 사용했더니 데이터가 쌓이는 문제 생김. fetch는 DOM 불러올때 한번 실행해서 배열에 담은 후에 가공해서 사용하는 방식으로 바꾸었다.
-   movieName.includes(searchInputText); <='' 이 들어가면 전부 true값으로 반환돼서 검색 초기화되는것처럼 작동함.
