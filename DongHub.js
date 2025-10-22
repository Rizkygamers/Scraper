const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeDonghubAllMovies() {
  const baseUrl = 'https://donghub.vip/anime/page/';
  const allMovies = [];
  let page = 1;

  try {
    console.log('Mengambil semua data film Donghub (Movie Type)...');

    while (true) {
      const url = `${baseUrl}${page}/?status=&type=Movie&order=update`;
      console.log(`Mengambil halaman ${page}: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const movies = [];

      $('.listupd .bs').each((index, element) => {
        const title = $(element).find('.tt h2').text().trim();
        const movieUrl = $(element).find('.bsx > a').attr('href');
        const imageUrl = $(element).find('.limit img').attr('src');
        const status = $(element).find('.limit .status').text().trim() || null;
        const episodeInfo = $(element).find('.limit .bt .epx').text().trim() || null;

        if (title && movieUrl) {
          movies.push({
            title,
            url: movieUrl,
            image: imageUrl,
            status,
            episode_info: episodeInfo,
          });
        }
      });

      if (movies.length === 0) {
        console.log('Tidak ada lagi data di halaman berikutnya.');
        break;
      }

      allMovies.push(...movies);
      page++;
    }

    console.log(`Berhasil mengambil total ${allMovies.length} film.`);
    console.log(JSON.stringify(allMovies, null, 2));

    return allMovies;
  } catch (error) {
    console.error('Terjadi kesalahan saat scraping:', error.message);
    return allMovies;
  }
}

async function searchDonghub(query) {
  const formattedQuery = query.replace(/ /g, '+');
  const searchUrl = `https://donghub.vip/?s=${formattedQuery}`;

  try {
    console.log(`Mencari anime dengan kata kunci: "${query}"`);
    console.log(`Mengakses URL: ${searchUrl}`);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const searchResults = [];

    $('.listupd .bs').each((index, element) => {
      const title = $(element).find('.tt h2').text().trim();
      const url = $(element).find('.bsx > a').attr('href');
      const image = $(element).find('.limit img').attr('src');
      const type = $(element).find('.limit .typez').text().trim() || 'N/A';
      const episodeInfo = $(element).find('.limit .bt .epx').text().trim();

      if (title && url) {
        searchResults.push({
          title,
          url,
          image,
          type,
          episode_info: episodeInfo,
        });
      }
    });

    if (searchResults.length > 0) {
      console.log(`Berhasil ditemukan ${searchResults.length} hasil pencarian.`);
      console.log(JSON.stringify(searchResults, null, 2));
    } else {
      console.log('Tidak ada hasil yang ditemukan untuk kata kunci tersebut.');
    }

    return searchResults;
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan pencarian:', error.message);
    return [];
  }
}

module.exports = { scrapeDonghubAllMovies, searchDonghub };