const NEWS_CHECK_INTERVAL = 60 * 1000; // 1 minute
const API_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"; // ForexFactory feed

async function checkNews() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const now = new Date();
    const upcomingNews = data.filter(event => {
      const eventTime = new Date(event.date + ' ' + event.time);
      return (
        event.currency === 'USD' &&
        event.impact === 'High' &&
        eventTime - now <= 5 * 60 * 1000 &&
        eventTime - now > 0
      );
    });

    if (upcomingNews.length > 0) {
      const notification = new Notification("🚨 High Impact USD News", {
        body: `${upcomingNews[0].title} in ${Math.round((new Date(upcomingNews[0].date + ' ' + upcomingNews[0].time) - now)/60000)} min`,
        icon: "/icon.png"
      });
    }
  } catch (err) {
    console.error("Error fetching news:", err);
  }
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(checkNews, NEWS_CHECK_INTERVAL);
checkNews();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
