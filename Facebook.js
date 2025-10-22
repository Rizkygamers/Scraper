/*
BY RIZKY
SRC DANZ THUMBNAIL
JANGAN HAPUS WM INI YA KONTOL
*/

import axios from 'axios';
import * as cheerio from "cheerio";

async function downloadFacebook(url) {
          try {
            const {
              data
            } = await axios.post('https://yt5s.io/api/ajaxSearch', new URLSearchParams( {
                q: url,
                vt: 'home'
              }), {
                headers: {
                  "Accept": "application/json",
                  "X-Requested-With": "XMLHttpRequest",
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
            if (data.status !== "ok") throw new Error("Gagal mengambil data dari server.");

            const $ = cheerio.load(data.data);
            const thumb = $('img').attr("src");
            const links = [];
            $('table tbody tr').each((_, el) => {
              const quality = $(el).find('.video-quality').text().trim();
              const link = $(el).find('a.download-link-fb').attr("href");
              if (quality && link) links.push({
                quality, link
              });
            });

            if (links.length > 0) return {
              type: "video",
              thumb,
              media: links[0].link
            };
            else if (thumb) return {
              type: "image",
              media: thumb
            };
            throw new Error("Tidak ada media yang bisa diunduh.");
          } catch (error) {
            return {
              error: error.message
            };
          }
                                                      }
