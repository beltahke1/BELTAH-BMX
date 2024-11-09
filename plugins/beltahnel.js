const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
};

// Function to fetch GitHub repo data
const fetchGitHubStats = async () => {
    try {
        const repo = 'Huaweike/AUTOMATIC-BOT'; // Replace with your repo
        const response = await axios.get(`https://api.github.com/repos/${repo}`);
        const forks = response.data.forks_count;
        const stars = response.data.stargazers_count;
        const totalUsers = (forks * 2) + (stars * 2);
        return {
            forks,
            stars,
            totalUsers
        };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return { forks: 0, stars: 0, totalUsers: 0 };
    }
};

zokou({ nomCom: "channel", categorie: "General" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    var coms = {};
    var mode = "public";

    if ((s.MODE).toLocaleLowerCase() != "public") {
        mode = "Private";
    }

    // Normalize category to uppercase and organize commands by category
    cm.map(async (com, index) => {
        const categoryUpper = com.categorie.toUpperCase();
        if (!coms[categoryUpper])
            coms[categoryUpper] = [];
        coms[categoryUpper].push(com.nomCom);
    });

    // Set the default timezone from the configuration
    moment.tz.setDefault('Africa/Nairobi');

    // Create a date and time in the configured timezone
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    // Determine the greeting based on the current time
    const hour = moment().hour();
    let greeting = "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 😴 ";
    if (hour >= 0 && hour <= 11) {
        greeting = "𝐆𝐨𝐨𝐝 𝐌𝐨𝐫𝐧𝐢𝐧𝐠 🌄";
    } else if (hour >= 12 && hour <= 16) {
        greeting = "𝐆𝐨𝐨𝐝 𝐀𝐟𝐭𝐞𝐫𝐧𝐨𝐨𝐧 🌃";
    } else if (hour >= 16 && hour <= 21) {
        greeting = "𝐆𝐨𝐨𝐝 𝐄𝐯𝐞𝐧𝐢𝐧𝐠 ⛅";
    } else if (hour >= 21 && hour <= 23) {
        greeting = "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 😴 ";
    }

    // Fetch GitHub stats
    const { totalUsers } = await fetchGitHubStats();
    const formattedTotalUsers = totalUsers.toLocaleString();

    let infoMsg = `${greeting} ${nomAuteurMessage} please follow our official channel.
  
ғᴏʟʟᴏᴡ ᴏᴜʀ ᴄʜᴀɴɴᴇʟ ғᴏʀ ᴍᴏʀᴇ
✅ ʙᴏᴛ ɢɪᴠᴇᴀᴡᴀʏs
✅ ʜᴇʀᴏᴋᴜ ᴀᴄᴄᴏᴜɴᴛ ʜᴏsᴛɪɴɢ
✅ ᴛᴇᴀᴍ ɪɴᴠɪᴛᴇs
✅ ʟᴇᴀᴋᴇᴅ ᴏɴʟɪɴᴇ ᴄᴏᴜsᴇs
✅ ғʀᴇᴇ ᴜɴʟɪᴍɪᴛᴇᴅ ᴠᴘɴ ғɪʟᴇs

ᴛᴀᴘ ʜᴇʀᴇ ᴛᴏ ғᴏʟʟᴏᴡ 🖤`;

    try {
        await zk.sendMessage(dest, { 
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: "ʙᴇʟᴛᴀʜ ᴛᴇᴄʜ ʙᴏᴛs",
                    body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴇʟᴛᴀʜ ʜᴀᴄᴋɪɴɢ ᴛᴇᴀᴍ",
                    thumbnailUrl: "https://telegra.ph/file/dcce2ddee6cc7597c859a.jpg",
                    sourceUrl: 'https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
});
