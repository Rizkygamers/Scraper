import axios from 'axios';
import cheerio from 'cheerio';
import { lookup } from 'mime-types';

async function mediafire(url) {
    try {
        if (!url.includes('www.mediafire.com')) throw new Error('Invalid url');
        
        const { data } = await axios.get(`https://px.nekolabs.my.id/${encodeURIComponent(url)}`);
        const $ = cheerio.load(data.data.content);
        const raw = $('div.dl-info');
        
        const filename = $('.dl-btn-label').attr('title') || raw.find('div.intro div.filename').text().trim() || null;
        const ext = filename.split('.').pop() || null;
        const mimetype = lookup(ext.toLowerCase()) || null;
        
        const filesize = raw.find('ul.details li:nth-child(1) span').text().trim();
        const uploaded = raw.find('ul.details li:nth-child(2) span').text().trim();
        
        const dl = $('a#downloadButton').attr('href');
        if (!dl) throw new Error('File not found');
        
        return {
            filename,
            filesize,
            mimetype,
            uploaded,
            download_url: dl
        }
    } catch (error) {
        throw new Error(error.message);
    }
}