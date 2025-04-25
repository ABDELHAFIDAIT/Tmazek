const searchInput = document.getElementById('search');
const searchResults = document.getElementById('display-search');
const lyricsContainer = document.getElementById('lyrics-div');
const previewContainer = document.getElementById('preview-container');

searchInput.addEventListener('input', function() {
    const valeur = searchInput.value;

    if (valeur.length < 3) {
        searchResults.innerHTML = '';
        return;
    }
    
    fetch(`https://api.lyrics.ovh/suggest/${valeur}`)
        .then(response => response.json())
        .then(data => {
            const results = data.data;
            searchResults.innerHTML = '';

            results.forEach(item => {
                lyricsContainer.classList.add('hidden');
                searchResults.classList.remove('hidden');
                const song = document.createElement('div');
                song.className = "flex flex-col gap-2 bg-black p-1 rounded-sm h-min";
                song.id = "song-card";

                song.innerHTML = `
                        <div class="flex gap-3">
                            <img src="${item.album.cover}" alt="Song's Cover" class="rounded-sm w-1/3">
                            <div class="flex flex-col justify-around font-light text-sm text-white">
                                <p class="font-medium text-md">${item.title}</p>
                                <p>${item.album.title}</p>
                                <p>${item.artist.name}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button id="show-lyrics" type="button" class="flex-1 bg-[#F7941D] py-1 text-xs cursor-pointer transition-all ease-in-out duration-300 hover:bg-orange-500">Voir les Paroles</button>
                            <button id="preview" type="button" class="flex-1 bg-blue-400 py-1 text-xs cursor-pointer transition-all ease-in-out duration-300 hover:bg-blue-500">Ecouter l'extrait</button>
                        </div>
                `;
                searchResults.appendChild(song);
                song.querySelector('#show-lyrics').addEventListener('click', function() {
                    lyricsContainer.innerHTML = '';
                    const songTitle = item.title;
                    const artistName = item.artist.name;
                    fetch(`https://api.lyrics.ovh/v1/${artistName}/${songTitle}`)
                        .then(response => response.json())
                        .then(data => {
                            const lyrics = data.lyrics.replace(/(\r\n|\n|\r)/g, '<br>');
                            const lyricsDiv = document.createElement('div');
                            lyricsDiv.className = "bg-black p-4 rounded-lg mt-2";
                            lyricsDiv.innerHTML = `
                                                    <h2 class="text-lg font-medium text-white mb-14">Paroles de ${songTitle} par ${artistName}</h2>
                                                    <p class="text-white">${lyrics}</p>
                            `;
                            lyricsContainer.appendChild(lyricsDiv);
                            lyricsContainer.classList.remove('hidden');
                            searchResults.classList.add('hidden');
                        })
                        .catch(error => console.error('Erreur:', error));
                });

                song.querySelector('#preview').addEventListener('click', function() {
                    const existingPreview = document.getElementById('audio-player');
                    if (existingPreview) {
                        existingPreview.remove();
                        previewContainer.classList.add('hidden');
                    }

                    const previewCard = document.createElement('div');
                    previewCard.className = "absolute bg-black top-10 right-10 w-max flex flex-col items-center justify-center p-2 gap-3 rounded-md";
                    previewCard.id = "audio-player";
                    previewCard.innerHTML = `
                        <img src="${item.album.cover}" alt="Cover" class="cover rounded-md">
                        <audio controls class="w-full h-10 text-black">
                        <source src="${item.preview}" type="audio/mp3">
                        Ton navigateur ne supporte pas l'audio HTML5.
                        </audio>
                        <div id="close-preview" class="flex items-center justify-center absolute top-[-5px] right-[-5px] h-5 w-5 bg-gray-200 rounded-full cursor-pointer" id="close-player">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </div>
                    `;
                    previewContainer.appendChild(previewCard);
                    previewContainer.classList.remove('hidden');

                    document.querySelector('#close-preview').addEventListener('click', function() {
                        previewContainer.classList.add('hidden');
                        previewCard.remove();
                    });
                });
            });
        })
        .catch(error => console.error('Erreur:', error));
});