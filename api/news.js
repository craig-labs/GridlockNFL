// ESPN Team IDs for NFL
const ESPN_TEAM_IDS = {
  Cardinals:22, Falcons:1, Ravens:33, Bills:2, Panthers:29, Bears:3,
  Bengals:4, Browns:5, Cowboys:6, Broncos:7, Lions:8, Packers:9,
  Texans:34, Colts:11, Jaguars:30, Chiefs:12, Raiders:13, Chargers:24,
  Rams:14, Dolphins:15, Vikings:16, Patriots:17, Saints:18, Giants:19,
  Jets:20, Eagles:21, Steelers:23, "49ers":25, Seahawks:26,
  Buccaneers:27, Titans:10, Commanders:28,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

  try {
    const { team } = req.query;
    let url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=15";

    // If a team name is provided, use team-specific endpoint
    if (team && ESPN_TEAM_IDS[team]) {
      url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?team=${ESPN_TEAM_IDS[team]}`;
    }

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
      team: team || null,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ESPN news proxy error:", error);
    res.status(500).json({ error: "Failed to fetch news", message: error.message });
  }
}
