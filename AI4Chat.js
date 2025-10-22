/*  
  Made By Lenwy
  JANGAN HAPUS WM YA SAYANGGG
*/

import axios from "axios";

export default async function Ai4Chat(prompt) {
  const url = new URL("https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug");
  url.search = new URLSearchParams({
    text: prompt,
    country: "Europe",
    user_id: "Av0SkyG00D"
  }).toString();

  try {
    const response = await axios.get(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 11; Infinix) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36",
        Referer: "https://www.ai4chat.co/pages/riddle-generator"
      }
    });

    if (response.status !== 200) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Fetch error:", error?.message ?? error);
    throw error;
  }
}
