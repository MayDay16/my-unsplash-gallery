const accessKey = "vqWlI4zvNSZLKdb1KqrjzJm2vrdwLVFSM6CCNI5ScjY";

const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${accessKey}`;
const randomImage = document.getElementById("randomImage");
const photographerName = document.getElementById("photographerName");
const photographerUsername = document.getElementById("photographerUsername");
const likeButton = document.getElementById("likeButton");
const likeCount = document.getElementById("likeCount");
const prevButton = document.getElementById("prevButton");

let photoHistory = [];
let currentPhotoIndex = -1;

// Функция для загрузки случайного изображения и информации о фотографе
async function fetchRandomImage() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.urls.regular;
    const photographer = data.user;

    const photo = {
      imageUrl,
      photographerName: photographer.name,
      photographerUsername: photographer.username,
      likes: 0,
    };

    photoHistory.push(photo);

    currentPhotoIndex = photoHistory.length - 1;

    randomImage.src = imageUrl;

    photographerName.textContent = photographer.name;
    photographerUsername.textContent = photographer.username;

    likeCount.textContent = photo.likes;
  } catch (error) {
    console.error("Ошибка при загрузке изображения: ", error);
  }
}

// обработка кнопки "Лайк"
function handleLike() {
  if (currentPhotoIndex !== -1) {
    const currentPhoto = photoHistory[currentPhotoIndex];
    currentPhoto.likes++;
    likeCount.textContent = currentPhoto.likes;
    saveLikesToLocalStorage();
  }
}

// обработка нажатия кнопки "Предыдущее фото"
function showPreviousPhoto() {
  if (currentPhotoIndex > 0) {
    currentPhotoIndex--;

    // Обновление изображения и информации о фотографе
    const currentPhoto = photoHistory[currentPhotoIndex];
    randomImage.src = currentPhoto.imageUrl;
    photographerName.textContent = currentPhoto.photographerName;
    photographerUsername.textContent = currentPhoto.photographerUsername;

    // Обновление количества лайков
    likeCount.textContent = currentPhoto.likes;

    // Восстанавление количества лайков из локального хранилища
    restoreLikesFromLocalStorage(currentPhoto.imageUrl);
  }
}

fetchRandomImage();

//  количество лайков из локального хранилища
function saveLikesToLocalStorage() {
  if (currentPhotoIndex !== -1) {
    const currentPhoto = photoHistory[currentPhotoIndex];
    localStorage.setItem(currentPhoto.imageUrl, currentPhoto.likes);
  }
}

//  количество лайков из локального хранилища
function restoreLikesFromLocalStorage(imageUrl) {
  const storedLikes = localStorage.getItem(imageUrl);
  if (storedLikes !== null) {
    const likes = parseInt(storedLikes);
    likeCount.textContent = likes;
  }
}

//  количество лайков из локального хранилища
restoreLikesFromLocalStorage();

//  обработчики событий для кнопок "Лайк" и "Предыдущее фото"
likeButton.addEventListener("click", handleLike);
prevButton.addEventListener("click", showPreviousPhoto);
