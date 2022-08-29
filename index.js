const FRIEND_URL = `https://randomuser.me/api/?results=30&nat=us,fr,nl,nz&inc=nat,location,gender,name,email,dob,phone,picture`;
const mainContent = document.querySelector(".main-container");
const headerFilters = document.querySelector(".header-bottom");
const headerSearchInput = document.querySelector(".header-search__input");

const createFriend = ({ picture, gender, name, dob, nat }) => {
  const textHtml = `
            <div class="main-friend">
                <div class="friend-picture-sex">
                    <img src="${picture.large}" alt="" class="friend-picture">
                    <div class="friend-sex-container">
                        <img src="./img/${gender}-gender.png" alt="" class="friend-sex">
                    </div>
                </div>
                <div class="friend-description">
                    <div class="friend-name-age">
                        <span class="friend-name">
                            ${name.title} ${name.first} ${name.last},
                        </span>
                        <span class="friend-age">
                            ${dob.age}
                        </span>
                    </div>
                    <div class="friend-icons">
                        <div class="friend-mail"><img src="./img/icons8-gmail-logo-30.png" alt=""></div>
                        <div class="friend-maps"><img src="./img/icons8-google-maps-old-50.png" alt=""></div>
                        <div class="friend-nat"><img src="https://www.worldometers.info/img/flags/${nat.toLowerCase()}-flag.gif" alt=""></div>
                    </div>
                </div>
            </div>`;
  mainContent.insertAdjacentHTML("beforeend", textHtml);
};
const getFriendsData = async (url) => {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    return results;
  } catch (err) {
    alert("Try again please");
    console.log(err);
  }
};
const setFriendsDataToHtml = async (results) => {
  const friends = await results;
  friends.forEach(async (friend) => await createFriend(friend));
};

const initialFriendsArray = getFriendsData(FRIEND_URL);
setFriendsDataToHtml(initialFriendsArray);
let friendsArray = initialFriendsArray;
let resetArray;
(async () => {
  const hi = await friendsArray;
  resetArray = [...hi];
})();
let sex;
let sortDirection;
let headerInputValue = "";

const filterSex = (friends, sex) => {
  let filteredFriends = friends;
  if (sex === "male" || sex === "female") {
    filteredFriends = friends.filter((friend) => friend.gender === sex);
  }
  return filteredFriends;
};
const filterByInput = (friends, value) => {
  if (value === "") return friends;
  let filteredFriends = friends.filter((friend) => {
    let fullName =
      friend.name.first.toLowerCase() + " " + friend.name.last.toLowerCase();
    let tempTarget = value.toLowerCase();
    return fullName.indexOf(tempTarget) >= 0;
  });
  return filteredFriends;
};
const sortFriendsByName = (friends, direction) => {
  friends.sort((a, b) => {
    let aName = a.name.first + " " + a.name.last;
    let bName = b.name.first + " " + b.name.last;
    return aName.localeCompare(bName);
  });
  if (direction === "up") return friends.reverse();
  return friends;
};
const sortFriendsByAge = (friends, direction) => {
  friends.sort((a, b) => a.dob.age - b.dob.age);
  if (direction === "up") return friends.reverse();
  return friends;
};
const handleSearch = (friendsArray) => {
  mainContent.innerHTML = "";
  friendsArray = filterSex(friendsArray, sex);
  friendsArray = filterByInput(friendsArray, headerInputValue);
  setFriendsDataToHtml(friendsArray);
};
friendsArray = initialFriendsArray;

headerFilters.addEventListener("click", ({ target }) => {
  friendsArray = [...resetArray];
  if (
    target.closest(".header-sex__male") ||
    target.closest(".header-sex__female") ||
    target.closest(".header-sex__both")
  ) {
    sex = target.dataset.id;
  }
  if (
    target.closest(".header-age__age-up") ||
    target.closest(".header-age__age-down")
  ) {
    sortDirection = target.dataset.direction;
    friendsArray = sortFriendsByAge(friendsArray, sortDirection);
  }
  if (
    target.closest(".header-name__name-up") ||
    target.closest(".header-name__name-down")
  ) {
    sortDirection = target.dataset.direction;
    friendsArray = sortFriendsByName(friendsArray, sortDirection);
  }
  handleSearch(friendsArray);
});
headerSearchInput.addEventListener("input", ({ target }) => {
  headerInputValue = target.value;
  handleSearch(friendsArray);
});
