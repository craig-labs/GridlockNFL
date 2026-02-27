export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

  try {
    const url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=15";
    const r = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "Gridlock-NFL/1.0" },
    });
    if (!r.ok) throw new Error(`ESPN API returned ${r.status}`);
    const data = await r.json();

    const articles = (data.articles || []).map((a) => ({
      headline: a.headline,
      description: a.description || "",
      published: a.published,
      image: a.images && a.images[0] ? a.images[0].url : null,
      link: a.links && a.links.web ? a.links.web.href : null,
      source: a.source || "ESPN",
      type: a.type || "article",
    }));

    res.status(200).json({
      articles: articles.slice(0, 10),
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ESPN news proxy error:", error);
    res.status(500).json({ error: "Failed to fetch news", message: error.message });
  }
}
