const FRIEND_URL = `https://randomuser.me/api/?results=30&nat=us,fr,nl,nz&inc=nat,location,gender,name,email,dob,phone,picture`;
const mainContent = document.querySelector(".main-container");
const headerFilters = document.querySelector(".header-bottom"); // const headerContent = document.querySelector(".header-container");
const headerSearchInput = document.querySelector(".header-search__input");

const createFriend = (friend) => {
  const textHtml = `
            <div class="main-friend">
                <div class="friend-picture-sex">
                    <img src="${
                      friend.picture.large
                    }" alt="" class="friend-picture">
                    <div class="friend-sex-container">
                        <img src="./${
                          friend.gender
                        }-gender.png" alt="" class="friend-sex">
                    </div>
                </div>
                <div class="friend-description">
                    <div class="friend-name-age">
                        <span class="friend-name">
                            ${friend.name.title} ${friend.name.first} ${
    friend.name.last
  },
                        </span>
                        <span class="friend-age">
                            ${friend.dob.age}
                        </span>
                    </div>
                    <div class="friend-icons">
                        <div class="friend-mail"><img src="./icons8-gmail-logo-30.png" alt=""></div>
                        <div class="friend-maps"><img src="./icons8-google-maps-old-50.png" alt=""></div>
                        <div class="friend-nat"><img src="https://www.worldometers.info/img/flags/${friend.nat.toLowerCase()}-flag.gif" alt=""></div>
                    </div>
                </div>
            </div>`;
  mainContent.insertAdjacentHTML("beforeend", textHtml);
};
// const insertCodeToHtml = (results) => {
//   mainContent.insertAdjacentHTML("beforeend", results);
// };
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
  console.log(resetArray);
})();
let headerSortChecked = false;
let headerInputChecked = false;
let headerSexChecked = false;
let sex;
let sortDirection;
let headerInputValue = "";

// const filterSex = async (friendsArray, sex) => {
//   const friends = await friendsArray;
const filterSex = (friends, sex) => {
  console.log(friends);
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
  console.log("sortName");
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
  console.log(friends);
  return friends;
};
const handleSearch = /*async*/ (friendsArray) => {
  friendsArray = filterSex(friendsArray, sex);
  friendsArray = filterByInput(friendsArray, headerInputValue);
  //   friendsArray = sortFriendsByAge(friendsArray, sortDirection);
  //   friendsArray = sortFriendsByName(friendsArray, sortDirection);
  setFriendsDataToHtml(friendsArray);
};
friendsArray = resetArray;

headerFilters.addEventListener("click", ({ target }) => {
  mainContent.innerHTML = "";
  friendsArray = resetArray;
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
    console.log("age");
    sortDirection = target.dataset.direction;
    console.log(sortDirection);
    friendsArray = sortFriendsByAge(friendsArray, sortDirection);
  }
  if (
    target.closest(".header-name__name-up") ||
    target.closest(".header-name__name-down")
  ) {
    console.log("name");
    sortDirection = target.dataset.direction;
    friendsArray = sortFriendsByName(friendsArray, sortDirection);
  }
  handleSearch(friendsArray);
});
headerSearchInput.addEventListener("input", ({ target }) => {
  mainContent.innerHTML = "";
  headerInputValue = target.value;
  handleSearch(friendsArray);
});

// Done | 1. Назва – топ – вже оріджинал ))
// 2. Шрифт, це на смак кожного, я би на свій використав найлінивіший спосіб зробити х2
// сучасніше font-family: system-ui (і далі через Tab аутокомплітом доповнюєш)
// Done | 3. Тяночки – прибираємо, або нейтралізуємо слово. Копірайтинг – теж дизайн.
// Done | 4. Логін/СайнАп – зменшуємо між ними відстань і прибираємо зелен та жовт обводку
// Done | 5. Пошук відштовхуємо від країв екрану, а то прилип. Додаємо placeholder щоб більш натякнути що
// це текстове поле, наприклад «Пошук по імені…»
// 6. Витягуємо фільтри з попапу, ставимо справа від пошуку і «виносимо спільне за дужки», наприклад

// Фільтрувати за віком [0→99][99→0] або за алфавітом [A→Я][Я→A]

// Групи кнопок/форми теж можуть формувати собою ніби цільне речення і це гарно

// Done maybe | 7. У карточках тінь робимо м’якішою, біль прозорою, у житті ми ніде не бачимо зазвичай таких насичених
//  тіней, тому це виглядає artificial
// Done | 8. Обводку у фото міняємо на білу
// 9. Місто та адресу можливо вирівнюємо по лівому краю, вирівнювання по центру майже ніколи не виглядає
//  гарно, хіба що коли робимо титульний лист у книзі, наприклад
// 10. Адресу робимо ближче до міста а не до краю картки

// Доречі, деякі пункти з цього списку мають спільну основу-проблему – порушення закону У гарному дизайні
// Внутрішнє ≤ Зовнішнє. Якщо спрощувати – якісь схожі елементи мають бути ближче один до одного ніж до країв свого контейнера або інших сусідів.

// Логін та сайнап мають бути ближче один до одного. Зараз іх внутрішне (відстань між ними) більше ніж їх
//  зовнішнє (відстань від сайнапа до краю екрана або відстань від будь кого з них до фільтрів).

// Пошук більше відноситься до контенту твого сайту ніж до твоєї операціїної системи, а у нього відстань до
// карточки френда більше ніж до твого бару додатків зліва. «Внутрішне» вийшло більше за «зовнішне»

// Адреса у карточці ближча до країв контейнера ніж до свого сусіда – міста-країни.

// Звичайно, є випадки де можна порушити це правило і буде норм, але для спрощування – краще слідувати йому)
