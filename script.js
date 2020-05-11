const postContainer = document.getElementById("posts-container");
const loading = document.querySelector(".loader");
const filter = document.getElementById("filter");

let limit = 3;
let page = 1;

async function getPosts() {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );
  const data = await res.json();
  return data;
}

//show post in DOM
async function showPost() {
  const posts = await getPosts();
  console.log(posts);
  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = ` <div class="number">${post.id}</div>
    <div class="post-info">
      <h2 class="post-title">${post.title}</h2>
      <p class="post-body">${post.body}</p>
    </div>
    `;
    postContainer.appendChild(postEl);
  });
}

function showLoading() {
  loading.classList.add("show");
  setTimeout(() => {
    loading.classList.remove("show");
    setTimeout(() => {
      page++;
      showPost();
    }, 300);
  }, 1000);
}

function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll(".post");
  posts.forEach((post) => {
    const title = post.querySelector(".post-title").innerText.toUpperCase();
    const body = post.querySelector(".post-body").innerText;
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = "flex";
      //console.log(post);
    } else {
      post.style.display = "none";
    }
  });
}

const debounce = (fn, limit) => {
  let timer;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, limit);
  };
};
const throttle = (fn, limit) => {
  let flag = true;
  return function () {
    let context = this;
    let args = arguments;
    if (flag) {
      page++;
      fn.apply(context, args);
      console.log("ran ");
      flag = false;
      setTimeout(() => {
        flag = true;
        loading.classList.remove("show");
      }, limit);
    }
  };
};

const callThrottle = throttle(showPost, 3000);
const callDebounce = debounce(filterPosts, 500);

showPost();
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loading.classList.add("show");

    callThrottle();
  }
});

filter.addEventListener("keyup", callDebounce);
