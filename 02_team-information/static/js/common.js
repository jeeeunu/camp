console.log('연결완료!')

//// 현재 URL 멤버 ID 가져오기
const url = new URL(window.location.href);
const pathValue = url.pathname.split("/members/")[1];
console.log(pathValue)

// GET : 멤버 불러오기
async function getMember() {
    try {
        const response = await fetch("/members", { method: "GET" });
        const resultData = await response.json();

        console.log(resultData);
        return resultData.result;
    } catch (error) {
        throw error;
    }
}

getMember()
    .then((members) => {
        members.forEach((member) => {
            ///// nav에 멤버 추가하기
            console.log(member)
            const navList = document.querySelector(".nav-list");
            if (pathValue === member._id) {
                html_temp = `
                <li>
                    <a href="/members/${member._id}" class="btn btn-primary">${member.name}</a>
                </li>`
            } else {
                html_temp = `
                <li>
                    <a href="/members/${member._id}" class="btn btn-outline-primary">${member.name}</a>
                </li >
                    `;
            }
            navList.innerHTML += html_temp;


            //// 본문에 멤버 정보 뿌리기
            const memberWrap = document.querySelector(".my-info");
            let member_html_temp = ``;

            if (member._id === pathValue) {
                const imgURL = `${url}/image`;
                console.log(imgURL);
                member_html_temp = `
                                <div class="main-img-wrap">
                                    <img src="${imgURL}" alt="" />
                                </div>
                                <div class="info-text">
                                    <h2 class="name">${member.name}</h2>
                                    <p class="address">${member.address}</p>
                                    <p class="hobby">${member.hobby}</p>
                                    <p class="advantage">${member.advantage}</p>
                                    <p class="work_style">${member.work_style}</p>
                                    <p class="comment">${member.comment}</p>
                                    <p class="blog">${member.blog}</p>
                                </div>
                           `;
                memberWrap.innerHTML += member_html_temp;
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });


// POST : 멤버 정보 전달하기
async function saveMember() {
    const memberName = document.querySelector("#memberName").value;
    const memberAddress = document.querySelector("#memberAddress").value;;
    const memberHobby = document.querySelector("#memberHobby").value;
    const memberAdvantage = document.querySelector("#memberAdvantage").value;
    const memberWorkStyle = document.querySelector("#memberWorkStyle").value;
    const memberComment = document.querySelector("#memberComment").value;
    const memberBlog = document.querySelector("#memberBlog").value;
    const memberImg = document.querySelector("#memberImg").files[0];
    // console.log(memberImg);

    const formData = new FormData();
    formData.append("name_give", memberName);
    formData.append("address_give", memberAddress);
    formData.append("hobby_give", memberHobby);
    formData.append("advantage_give", memberAdvantage);
    formData.append("work_style_give", memberWorkStyle);
    formData.append("comment_give", memberComment);
    formData.append("blog_give", memberBlog);
    formData.append("img_give", memberImg);

    try {
        const response = await fetch("/members", { method: "POST", body: formData });

        if (!response.ok) {
            const data = await response.json();
            const errorMessage = data.msg;

            alert(errorMessage);

            throw new Error(errorMessage);
        }

        alert('등록완료!');
        window.location.reload();

    } catch (error) {
        alert(error.message);
    }
}


// PUT : 해당 정보 수정 모달에 불러오기
let memberNameEdit = document.querySelector("#memberNameEdit");
let memberAddressEdit = document.querySelector("#memberAddressEdit");
let memberHobbyEdit = document.querySelector("#memberHobbyEdit");
let memberAdvantageEdit = document.querySelector("#memberAdvantageEdit");
let memberWorkStyleEdit = document.querySelector("#memberWorkStyleEdit");
let memberCommentEdit = document.querySelector("#memberCommentEdit");
let memberBlogEdit = document.querySelector("#memberBlogEdit");
let memberImg = document.querySelector("#memberImgEdit")

const btnEdit = document.querySelector('#btnEdit');
btnEdit.addEventListener('click', () => {

    try {
        fetch("/members", { method: "GET" })
            .then((response) => response.json())
            .then((responseData) => {
                const members = responseData.result;

                members.forEach((member) => {
                    if (member._id === pathValue) {
                        memberNameEdit.value = member.name;
                        memberAddressEdit.value = member.address;
                        memberHobbyEdit.value = member.hobby;
                        memberAdvantageEdit.value = member.advantage;
                        memberWorkStyleEdit.value = member.work_style;
                        memberCommentEdit.value = member.comment;
                        memberBlogEdit.value = member.blog;
                    }
                });
            })
    } catch (error) {
        throw error;
    }
})

// PUT : 수정 데이터 전달하기
function editComplete() {
    const formData = new FormData();
    formData.append("name", memberNameEdit.value);
    formData.append("address", memberAddressEdit.value);
    formData.append("hobby", memberHobbyEdit.value);
    formData.append("advantage", memberAdvantageEdit.value);
    formData.append("work_style", memberWorkStyleEdit.value);
    formData.append("comment", memberCommentEdit.value);
    formData.append("blog", memberBlogEdit.value);

    if (memberImgEdit !== null && memberImgEdit.files.length > 0) {
        formData.append("img", memberImgEdit.files[0]);
    }

    fetch(`/members/${pathValue}`, {
        method: "PUT",
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert('수정되었습니다!');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error(error);
        });
}

// DELETE : 멤버 삭제하기
function deleteMember() {
    fetch(`/members/${pathValue}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) {
                throw new Error("멤버 삭제에 실패했습니다.");
            }
            // 멤버 삭제 후에 멤버 목록 업데이트
            return getMember();
        })
        .then((members) => {
            alert('삭제되었습니다!')
            // 홈 화면으로 이동
            window.location.href = "/";
        })
        .catch(error => {
            console.error(error);
        });
}

console.log("끗")