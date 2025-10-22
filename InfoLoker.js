/*
MADE BY ZOME/EGGA
JANGAN HAPUS WM KNTL
*/


import * as cheerio from "cheerio";
import fetch from 'node-fetch'

async function infoloker(query) {
    const url = `https://www.jobstreet.co.id/id/job-search/${query}-jobs/`;
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const format = [];

    $('article').each((a, article) => {
        const job = $(article).find('h1 a div').text();
        const perusahaan = $(article).find('span').eq(0).text();
        const daerah = $(article).find('span span').text();
        const link_Detail = 'https://www.jobstreet.co.id' + $(article).find('h1 a').attr('href');
        const upload = $(article).find('div > time > span').text();

        format.push({ job, perusahaan, daerah, upload, link_Detail });
    });

    return format;
}