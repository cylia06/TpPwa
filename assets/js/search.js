const searchBar = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const cancelButton = document.getElementById('cancel-button');
const loaderElement = document.getElementById('loader');
const gifsElement = document.getElementById("gifs");

function disableSearch() {
    searchButton.style.display = "none";
    cancelButton.style.display = null;
    searchBar.disabled = true;
}

function setLoading(isLoading) {
    if (isLoading) {
        loaderElement.style.display = null;
        gifsElement.style.display = "none";
    }
    else {
        loaderElement.style.display = "none";
        gifsElement.style.display = null;
    }
}

function addGIFToFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);

    const gifTitle = gifElement.querySelector('div h3').textContent;
    const gifVideoUrl = gifElement.querySelector('source').src;
    const gifImageUrl = gifElement.querySelector('img').dataset.src;

    // TODO: 9i - Open IndexedDB's database

    console.log("debug search")
    console.log(event)
    window.db.open().then(async (db) =>{
        
        await db.gifs.add({title : gifTitle, imageUrl: gifImageUrl, videoUrl:gifVideoUrl});
        
    }).catch('NoSuchDatabaseError', function(e) {
        // Database with that name did not exist
        console.error ("Database not found");
    }).catch(function (e) {
        console.error ("Error: " + e);
    });

    // TODO: 9j - Save GIF data into IndexedDB's database

    // TODO: 9k - Put GIF media (image and video) into a cache named "gif-images"

    caches
    .open("gif-images")
    .then(cache => {
      cache.add(gifImageUrl);
      cache.add(gifVideoUrl);
    })
    .catch(e => console.log(e));
    // Set button in 'liked' state (disable the button)
    likeButton.disabled = true;
}

function buildGIFCard(gifItem, isSaved) {
    // Create GIF Card element
    const newGifElement = document.createElement("article");
    newGifElement.classList.add("gif-card");
    newGifElement.id = gifItem.id;

    // Append image to card
    const gifImageElement = document.createElement('video');
    gifImageElement.autoplay = true;
    gifImageElement.loop = true;
    gifImageElement.muted = true;
    gifImageElement.setAttribute('playsinline', true);

    const videoSourceElement = document.createElement('source');
    videoSourceElement.src = gifItem.images.original.mp4;
    videoSourceElement.type = 'video/mp4';
    gifImageElement.appendChild(videoSourceElement);

    const imageSourceElement = document.createElement('img');
    imageSourceElement.classList.add('lazyload');
    imageSourceElement.dataset.src = gifItem.images.original.webp;
    imageSourceElement.alt = `${gifItem.title} image`;
    gifImageElement.appendChild(imageSourceElement);

    newGifElement.appendChild(gifImageElement);

    // Append metadata to card
    const gifMetaContainerElement = document.createElement("div");
    newGifElement.appendChild(gifMetaContainerElement);

    // Append title to card metadata
    const gifTitleElement = document.createElement("h3");
    const gifTitleNode = document.createTextNode(gifItem.title || 'No title');
    gifTitleElement.appendChild(gifTitleNode);
    gifMetaContainerElement.appendChild(gifTitleElement);

    // Append favorite button to card metadata
    const favButtonElement = document.createElement("button");
    favButtonElement.setAttribute('aria-label', `Save ${gifItem.title}`);
    favButtonElement.classList.add("button");
    favButtonElement.dataset.gifId = gifItem.id;
    favButtonElement.onclick = addGIFToFavorite;
    const favIconElement = document.createElement("i");
    favIconElement.classList.add("fas", "fa-heart");
    favButtonElement.appendChild(favIconElement);
    gifMetaContainerElement.appendChild(favButtonElement);

    // Disable button (set GIF as liked) if liked
    if (isSaved) {
        favButtonElement.disabled = true;
    }

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.appendChild(newGifElement);
}

async function searchGIFs() {
    disableSearch();
    setLoading(true);

    const query = searchBar.value;
    //const url = "https://api.giphy.com/v1/gifs/search?api_key=dMUZ07WT6bsD3QTgDvqEbbHVEYwnJ5MZ&q=" + query + "&limit=24"
    const url = "https://api.giphy.com/v1/gifs/search?api_key=dMUZ07WT6bsD3QTgDvqEbbHVEYwnJ5MZ&q="+query+"&limit=25&offset=0&rating=G&lang=en"
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {


    fetch(url, options).then(res => 
            res.json()
    ).then(json => {
        var gifs = json.data
        
        gifs.forEach(async gif => {
            // TODO: 9m - Get GIF from IndexedDB's database, by its ID

            const gifsSaved = await window.db.gifs.where({
                title: gif.title
            }).toArray();
            // TODO: 9n - Create a boolean `isSaved` to check if the GIF was already saved

            const isSaved = false;
            if (gifsSaved.length != 0)
            {
               isSaved = true;
            }
                buildGIFCard(gif, isSaved);          
            // TODO: 9g - Call the function buildGIFCard with proper parameters
            // TIP: Use the boolean `isSaved`
        });

       
    }).catch( e => console.log(e));
    }
    catch (e) {
        console.log("Error: " + e );
        // TODO: 9h - Display a message in console in case of error
    } finally {
        setLoading(false);
    }
}

function cancelSearch() {
    searchButton.style.display = null;
    cancelButton.style.display = "none";

    while (gifsElement.firstChild) {
        gifsElement.firstChild.remove();
    }

    searchBar.value = null;
    searchBar.disabled = false;
    searchBar.focus();
}

window.addEventListener('DOMContentLoaded', async function () {
    // If enter button is pressed, trigger search
    searchBar.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchGIFs();
        }
    });
    // On click of Search button, trigger search
    searchButton.addEventListener('click', searchGIFs);
    // On click of Cancel button, cancel search
    cancelButton.addEventListener('click', cancelSearch);
});