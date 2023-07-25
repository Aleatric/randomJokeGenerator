document.addEventListener('DOMContentLoaded', () => {
  const jokeTextElement = document.getElementById('text');
  const jokeAuthorElement = document.getElementById('author');
  const newJokeButton = document.getElementById('new-quote');
  const tweetButton = document.getElementById('tweet-quote');

  const fetchRandomJoke = async () => {
    try {
      const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(checkbox => checkbox.value)
        .join(',');

      const contentFilter = document.getElementById('content-filter').checked
        ? 'nsfw,religious,political,racist,sexist,explicit'
        : '';

        const addRandomAsterisks = (text) => {
          const words = text.split(/\s+/);
          const numAsterisks = Math.floor(Math.random() * words.length) + 1;
          const indexes = [];
        
          for (let i = 0; i < numAsterisks; i++) {
            indexes.push(Math.floor(Math.random() * words.length));
          }
        
          indexes.sort((a, b) => b - a);
        
          for (const index of indexes) {
            const wordWithAsterisks = '*'.repeat(Math.floor(Math.random() * 3) + 1);
            words.splice(index, 1, wordWithAsterisks);
          }
        
          return words.join(' ');
        };

      let apiUrl = 'https://v2.jokeapi.dev/joke/Any';

      if (selectedCategories) {
        apiUrl = `https://v2.jokeapi.dev/joke/${selectedCategories}?blacklistFlags=${contentFilter}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.status !== 200 || data.error) {
        throw new Error('Failed to fetch joke');
      }

      let jokeText = data.type === 'single' ? data.joke : `${data.setup} ${data.delivery}`;

      const badContentFilterEnabled = document.getElementById('bad-content-filter').checked;
      if (badContentFilterEnabled) {
        jokeText = addRandomAsterisks(jokeText);
      }

      jokeTextElement.textContent = jokeText;
      jokeAuthorElement.textContent = '';

      const tweetText = encodeURIComponent(jokeText);
      tweetButton.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
    } catch (error) {
      console.error('Error fetching joke:', error);
      jokeTextElement.textContent = 'Failed to fetch joke';
      jokeAuthorElement.textContent = '';
    }
  };

  newJokeButton.addEventListener('click', fetchRandomJoke);

  fetchRandomJoke();
});
