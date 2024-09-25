// ==UserScript==
// @name         Rain Notifier
// @version      1.1
// @description  nigahiga.
// @match        *://*/*
// @grant        none
// @author       xeenrim
// ==/UserScript==

(function () {
    'use strict';

    let lastRainID = null; // stores last rain (NO SPAM ANYMORE)

    const webhookURL = "YOUR_WEBHOOK"; // CHANGE THE WEBHOOK

    function fetchRainData() {
        fetch("https://api.bloxflip.com/chat/history", {
            headers: {
                "Referer": "https://bloxflip.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
            }
        })
        .then(response => response.json())
        .then(data => {
            const rain = data.rain;
            if (rain && rain.active) {
                const rainID = rain.created; // why do you read this?
                if (rainID !== lastRainID) {
                    lastRainID = rainID; // IDK NIGGA
                    notifyRain(rain);
                }
            }
        })
        .catch(error => console.error('Error fetching rain data:', error));
    }

    function notifyRain(rain) {
        const embedData = {
            username: "Rain Notifier",
            embeds: [
                {
                    title: "Active Rain Detected!",
                    description: `**Host:** ${rain.host}\n**Prize:** ${rain.prize} R$\n**Expires In:** <t:${Math.round((rain.duration + rain.created) / 1000)}:R>\n[Join Now](https://bloxflip.com/)`,
                    color: 7506394,
                    timestamp: new Date().toISOString()
                }
            ]
        };

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(embedData)
        }).then(response => {
            if (!response.ok) {
                console.error('Failed to send webhook:', response.statusText);
            }
        }).catch(error => console.error('Error sending webhook:', error));
    }

    // Check for new rain data every 10 seconds
    setInterval(fetchRainData, 10000);

})();
