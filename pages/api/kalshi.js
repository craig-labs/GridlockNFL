export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

  try {
    const kalshiUrl =
      "https://api.elections.kalshi.com/trade-api/v2/markets?limit=200&status=open";

    const response = await fetch(kalshiUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Gridlock-NFL-Hub/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Kalshi API returned ${response.status}`);
    }

    const data = await response.json();

    const nflKeywords = [
      "nfl", "super bowl", "touchdown", "mvp", "pro football",
      "chiefs", "ravens", "bengals", "browns", "steelers",
      "texans", "colts", "jaguars", "titans", "bills",
      "dolphins", "patriots", "jets", "broncos", "chargers",
      "raiders", "bears", "lions", "packers", "vikings",
      "falcons", "panthers", "saints", "buccaneers", "cowboys",
      "giants", "eagles", "commanders", "cardinals", "rams",
      "49ers", "seahawks", "kansas city", "baltimore",
      "cincinnati", "cleveland", "pittsburgh", "houston",
      "indianapolis", "jacksonville", "tennessee", "buffalo",
      "miami", "new england", "new york", "denver",
      "los angeles", "las vegas", "chicago", "detroit",
      "green bay", "minnesota", "atlanta", "carolina",
      "new orleans", "tampa bay", "dallas", "philadelphia",
      "washington", "arizona", "san francisco", "seattle",
      "afc", "nfc",
    ];

    const nflMarkets = (data.markets || []).filter((m) => {
      const text = `${m.title} ${m.subtitle} ${m.event_ticker}`.toLowerCase();
      return nflKeywords.some((kw) => text.includes(kw));
    });

    nflMarkets.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));

    res.status(200).json({
      markets: nflMarkets.slice(0, 30),
      count: nflMarkets.length,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Kalshi proxy error:", error);
    res.status(500).json({
      error: "Failed to fetch Kalshi markets",
      message: error.message,
    });
  }
}
