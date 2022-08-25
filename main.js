const FRIEND_URL = `https://randomuser.me/api/?results=50`;
const mainContent = document.querySelector(".main-container");
const headerContent = document.querySelector(".header-container");
const headerSearchInput = document.querySelector(".container-search__input");

const loadJson = (url) => fetch(url);
const convertJsonToObject = (response) => response.json();
const createFriend = (friend) => {
  return `
  <div class="main__friend">
  <div class="friend__flag-and-face">
    <div class="friend__flag">
      <img
        src="https://www.worldometers.info/img/flags/${friend.nat.toLowerCase()}-flag.gif"
        alt=""
      />
    </div>
    <div class="friend__face">
      <img src="${friend.picture.large}" alt="" />
    </div>
  </div>
  <div class="friend__description">
    <div class="friend__description_location">
      <img src="./icons8-google-maps-old-50.png" alt="" />
      <span>${friend.location.city}, ${friend.location.country}</span>
    </div>
    <div class="friend__description_mail">
      <img src="./icons8-gmail-logo-30.png" alt="" />
      <span>${friend.name.title} ${friend.name.first} ${friend.name.last},${
    friend.dob.age
  } </span>
    </div>
  </div>
</div>`;
};
const insertCodeToHtml = (results) => {
  mainContent.insertAdjacentHTML("beforeend", results);
};
const getFriendsData = async (url) => {
  try {
    const jsonFriends = await convertJsonToObject(await loadJson(url));
    const { results } = jsonFriends;
    return results;
  } catch (err) {
    getFriendsData(url);
  }
};
const setFriendsDataToHtml = async (results) => {
  const friends = await results;
  friends.forEach(
    async (friend) => await insertCodeToHtml(createFriend(friend))
  );
};

const initialFriendsArray = getFriendsData(FRIEND_URL);
setFriendsDataToHtml(initialFriendsArray);
let headerSortChecked = false;
let headerInputChecked = false;
let headerSexChecked = false;
let sex;
let sortDirection;
let headerInputValue;
let friendsArray = initialFriendsArray;
let resetArray;
(async () => {
  const hi = await friendsArray;
  resetArray = [...hi];
})();
const filterSex = async (friendsArray, sex) => {
  const friends = await friendsArray;
  const filteredBySexFriends = friends.filter(
    (friend) => friend.gender === sex.toLowerCase()
  );
  return filteredBySexFriends;
};
const filterByInput = async (friendsArray, headerInputValue) => {
  const friends = await friendsArray;
  const filteredByInputFriends = friends.filter((friend) => {
    let fullName =
      friend.name.first.toLowerCase() + " " + friend.name.last.toLowerCase();
    let tempTarget = headerInputValue.toLowerCase();
    return fullName.indexOf(tempTarget) >= 0;
  });
  return filteredByInputFriends;
};
const sortFriends = async (friendsArray, sortDirection) => {
  const friends = await friendsArray;
  let sortedFriends;
  if (sortDirection === "By Age Up" || sortDirection === "By Age Down") {
    sortedFriends = await friends.sort(
      (currFriend, nextFriend) => currFriend.dob.age - nextFriend.dob.age
    );
  }
  if (
    sortDirection === "By Alphabet Up" ||
    sortDirection === "By Alphabet Down"
  ) {
    sortedFriends = await friends.sort((currFriend, nextFriend) => {
      let a = currFriend.name.first + " " + currFriend.name.last;
      let b = nextFriend.name.first + " " + nextFriend.name.last;
      return a.localeCompare(b);
    });
  }
  if (sortDirection === "By Age Up" || sortDirection === "By Alphabet Up")
    return sortedFriends.reverse();
  if (sortDirection === "By Age Down" || sortDirection === "By Alphabet Down")
    return sortedFriends;
};
const handleSearch = async (friendsArray) => {
  if (headerSexChecked) {
    friendsArray = await filterSex(friendsArray, sex);
  }
  if (headerInputChecked) {
    friendsArray = await filterByInput(friendsArray, headerInputValue);
  }
  if (headerSortChecked) {
    friendsArray = await sortFriends(friendsArray, sortDirection);
  }
  await setFriendsDataToHtml(friendsArray);
};

headerContent.addEventListener("click", ({ target }) => {
  mainContent.innerHTML = "";
  friendsArray = initialFriendsArray;
  if (
    target.closest(".container-search__btns_ul-male") ||
    target.closest(".container-search__btns_ul-female")
  ) {
    headerSexChecked = true;
    sex = target.innerText;
  }
  if (target.closest(".popup-list")) {
    headerSortChecked = true;
    sortDirection = target.innerText;
  }
  if (target.closest(".popup-list__reset")) {
    headerSortChecked = false;
    headerInputChecked = false;
    headerSexChecked = false;
    friendsArray = resetArray;
  }
  handleSearch(friendsArray);
});
headerSearchInput.addEventListener("input", ({ target }) => {
  mainContent.innerHTML = "";
  headerInputChecked = true;
  headerInputValue = target.value;
  handleSearch(friendsArray);
});
