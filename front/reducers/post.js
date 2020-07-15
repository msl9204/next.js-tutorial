export const initialState = {
    mainPosts: [
        {
            id: 1,
            User: {
                id: 1,
                nickname: "soo",
            },
            content: "첫번째 게시글 #해시태그 #익스프레스",
            Images: [
                {
                    src:
                        "http://www.newstof.com/news/photo/201904/1410_3833_5628.jpg",
                },
                {
                    src:
                        "http://www.newstof.com/news/photo/201904/1410_3833_5628.jpg",
                },
                {
                    src:
                        "http://www.newstof.com/news/photo/201904/1410_3833_5628.jpg",
                },
            ],
            Comments: [
                {
                    User: {
                        nickname: "aaa",
                    },
                    content: "1번",
                },
                {
                    User: {
                        nickname: "bbb",
                    },
                    content: "2버언",
                },
            ],
        },
    ],
    imagePaths: [],
    postAdded: false,
};

const ADD_POST = "ADD_POST";
export const addPost = {
    type: ADD_POST,
};

const dummyPost = {
    id: 2,
    content: "더미데이터입니다.",
    User: {
        id: 1,
        nickname: "제로초",
    },
    Images: [],
    Comments: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true,
            };

        default:
            return state;
    }
};

export default reducer;
