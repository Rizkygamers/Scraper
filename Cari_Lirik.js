/*
MADE BY RIZKY
JANGAN HAPUS WM KNTL
*/



import fetch from "node-fetch";
import cheerio from "cheerio";

async function searchLyrics(text) {
    try {
        const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=lirik+lagu+${encodeURIComponent(text)}&hl=en`, {
            headers: {
                "x-return-format": "html",
                "x-engine": "cf-browser-rendering"
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const $ = cheerio.load(html);
        const lirik = [];
        const output = [];
        const result = {};
        
        $("div.PZPZlf").each((i, e) => {
            const penemu = $(e).find("div[jsname=\"U8S5sf\"]").text().trim();
            if (!penemu) {
                output.push($(e).text().trim());
            }
        });
        
        $("div[jsname=\"U8S5sf\"]").each((i, el) => {
            let out = "";
            $(el).find("span[jsname=\"YS01Ge\"]").each((j, span) => {
                out += $(span).text() + "\n";
            });
            lirik.push(out.trim());
        });
        
        // Structure the result
        result.lyrics = lirik.join("\n\n");
        result.title = output.shift();
        result.subtitle = output.shift();
        result.platform = output.filter(item => !item.includes(":"));
        
        // Extract metadata
        output.forEach(item => {
            if (item.includes(":")) {
                const [name, value] = item.split(":");
                result[name.toLowerCase().trim()] = value.trim();
            }
        });
        
        return result;
        
    } catch (error) {
        throw new Error(`Lyrics search failed: ${error.message}`);
    }
}