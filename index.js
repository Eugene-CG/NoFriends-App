const FRIEND_URL = `https://randomuser.me/api/?results=30&nat=us,fr,nl,nz&inc=nat,location,gender,name,email,dob,phone,picture`;
const friendsContainer = document.querySelector(".friends-container");
const sidebar = document.querySelector(".sidebar");
const searchInput = document.querySelector(".search__input");

const createFriend = ({
  picture: { large },
  gender,
  name: { first, last },
  dob: { age },
  nat,
}) => {
  const textHtml = `
            <div class="friend">
                <div class="friend-picture-sex">
                    <img src="${large}" alt="" class="friend-picture">
                    <div class="friend-sex-container">
                        <img src="./img/${gender}-gender.png" alt="" class="friend-sex">
                    </div>
                </div>
                <div class="friend-description">
                    <div class="friend-name-age">
                        <span class="friend-name">
                            ${first} ${last},
                        </span>
                        <span class="friend-age">
                            ${age}
                        </span>
                    </div>
                    <div class="friend-icons">
                        <div class="friend-mail"><img src="./img/icons8-gmail-logo-30.png" alt=""></div>
                        <div class="friend-maps"><img src="./img/icons8-google-maps-old-50.png" alt=""></div>
                        <div class="friend-nat"><img src="https://www.worldometers.info/img/flags/${nat.toLowerCase()}-flag.gif" alt=""></div>
                    </div>
                </div>
            </div>`;
  friendsContainer.insertAdjacentHTML("beforeend", textHtml);
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
const setFriendsDataToHtml = (friends) =>
  friends.forEach((friend) => createFriend(friend));

const initialFriends = getFriendsData(FRIEND_URL);

let friendsObj;
(async () => {
  friendsObj = [...(await initialFriends)];
  setFriendsDataToHtml(friendsObj);
})();
// actualy I could use this code below, but I prefer IIFE here, because fetch called once
// const createInitialFriendsCopy = async (initialFriends) => {
//   const temp = await initialFriends;
//   setFriendsDataToHtml([...temp]);
//   friendsObj = [...temp];
// };
// createInitialFriendsCopy(initialFriends);
let sex;
let headerInputValue = "";

const filterSex = (friends, sex) => {
  if (sex === "male" || sex === "female") {
    friends = friends.filter((friend) => friend.gender === sex);
  }
  return friends;
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
const sortName = (friends, direction) => {
  friends.sort((a, b) => {
    let aName = a.name.first + " " + a.name.last;
    let bName = b.name.first + " " + b.name.last;
    return aName.localeCompare(bName);
  });
  if (direction === "up") return friends.reverse();
  return friends;
};
const sortAge = (friends, direction) => {
  friends.sort((a, b) => a.dob.age - b.dob.age);
  if (direction === "up") return friends.reverse();
  return friends;
};
const handleSearchAndFilters = (friends) => {
  friendsContainer.innerHTML = "";
  friends = filterSex(friends, sex);
  friends = filterByInput(friends, headerInputValue);
  setFriendsDataToHtml(friends);
};
let friendsCopy;

sidebar.addEventListener("click", ({ target }) => {
  friendsCopy = [...friendsObj];
  if (target.closest(".search")) return;
  if (target.closest(".sex-icon")) sex = target.dataset.id;
  if (target.closest(".age-icon"))
    friendsCopy = sortAge(friendsCopy, target.dataset.direction);
  if (target.closest(".name-icon"))
    friendsCopy = sortName(friendsCopy, target.dataset.direction);
  if (target.closest(".icon-hover")) handleSearchAndFilters(friendsCopy);
});
searchInput.addEventListener("input", ({ target }) => {
  friendsCopy = [...friendsObj];
  headerInputValue = target.value;
  handleSearchAndFilters(friendsCopy);
});
