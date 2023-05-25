document.addEventListener('DOMContentLoaded', () => {
  const jokeTextElement = document.getElementById('text');
  const jokeAuthorElement = document.getElementById('author');
  const newJokeButton = document.getElementById('new-quote');
  const tweetButton = document.getElementById('tweet-quote');

  const fetchRandomJoke = async () => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any');
      const data = await response.json();

      if (response.status !== 200 || data.error) {
        throw new Error('Failed to fetch joke');
      }

      if (data.type === 'single') {
        jokeTextElement.textContent = data.joke;
        jokeAuthorElement.textContent = '';
      } else {
        jokeTextElement.textContent = data.setup;
        jokeAuthorElement.textContent = data.delivery;
      }

      const tweetText = encodeURIComponent(data.type === 'single' ? data.joke : `${data.setup} ${data.delivery}`);
      tweetButton.href = `https://twitter.com/intent/tweet?text=${tweetText}`;
    } catch (error) {
      console.error('Error fetching joke:', error);
    }
  };

  newJokeButton.addEventListener('click', fetchRandomJoke);

  // Fetch initial joke on page load
  fetchRandomJoke();
});
