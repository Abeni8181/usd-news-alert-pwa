const BOT_TOKEN = "8193219470:AAGWZd3V-YI0AHO5luEB-H0PVKyNd34TqdQ";
const CHAT_ID = "55676073283";
const API_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";
const NEWS_CHECK_INTERVAL = 60 * 1000; // check every minute

function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message })
  });
}

async function checkNews() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const now = new Date();
    const upcomingNews = data.filter(event => {
      const eventTime = new Date(`${event.date} ${event.time}`);
      return (
        event.currency === "USD" &&
        event.impact === "High" &&
        eventTime - now <= 5 * 60 * 1000 &&
        eventTime - now > 0
      );
    });

    if (upcomingNews.length > 0) {
      const event = upcomingNews[0];
      const minsLeft = Math.round((new Date(`${event.date} ${event.time}`) - now) / 60000);
      const msg = `🚨 HIGH IMPACT USD NEWS\n${event.title}\n🕒 In ${minsLeft} minute(s)\n📅 ${event.date} ${event.time}`;
      sendTelegramMessage(msg);
    }
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

setInterval(checkNews, NEWS_CHECK_INTERVAL);
checkNews();
sendTelegramMessage("✅ Test message from USD News Bot!");

