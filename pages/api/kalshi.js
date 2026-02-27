export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

  try {
    const baseUrl = "https://api.elections.kalshi.com/trade-api/v2/markets";

    // All known NFL series ticker prefixes on Kalshi
    const NFL_SERIES = [
      "KXNFLDRAFT1",    // #1 overall pick
      "KXNFLDRAFT1ST",  // 1st pick at position
      "KXNFLDRAFT",     // General draft markets
      "KXNFLGAME",      // Game winner
      "KXNFLSPREAD",    // Spreads
      "KXNFLTOTAL",     // Totals
      "KXNFLPROP",      // Player props
      "KXNFLMENTION",   // Announcer mentions
      "KXNFLTRADE",     // NFL trades
      "KXNFLMVP",       // MVP
      "KXNFLROTY",      // Rookie of the year
      "KXNFLAWARD",     // Awards
      "KXNFLWIN",       // Win totals
      "KXNFLPLAYOFF",   // Playoffs
      "KXSB",           // Super Bowl
      "KXPFB",          // Pro football general
    ];

    // Fetch markets for each series in parallel
    const fetches = NFL_SERIES.map(async (series) => {
      try {
        const url = `${baseUrl}?series_ticker=${series}&status=open&limit=200`;
        const r = await fetch(url, {
          headers: { "Accept": "application/json", "User-Agent": "Gridlock-NFL/1.0" },
        });
        if (!r.ok) return [];
        const d = await r.json();
        return d.markets || [];
      } catch {
        return [];
      }
    });

    const results = await Promise.all(fetches);
    let allMarkets = results.flat();

    // Deduplicate by ticker
    const seen = new Set();
    allMarkets = allMarkets.filter((m) => {
      if (seen.has(m.ticker)) return false;
      seen.add(m.ticker);
      return true;
    });

    // Sort by volume (24h first, then total)
    allMarkets.sort(
      (a, b) => (b.volume_24h || 0) - (a.volume_24h || 0) || (b.volume || 0) - (a.volume || 0)
    );

    res.status(200).json({
      markets: allMarkets.slice(0, 50),
      total_nfl_found: allMarkets.length,
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
