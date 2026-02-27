export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

  try {
    // Fetch multiple pages to get a good pool of NFL markets
    const baseUrl = "https://api.elections.kalshi.com/trade-api/v2/markets";
    const allMarkets = [];

    // NFL ticker prefixes on Kalshi
    // kxnfl = NFL games/spreads/totals/props
    // kxsb = Super Bowl
    // kxnflgame, kxnflspread, kxnfltotal, kxnflprop, kxnflmention, etc.
    const NFL_TICKER_PREFIXES = [
      "kxnfl",
      "kxsb",
      "kxpfb",    // pro football
    ];

    // Strategy: Use the event_ticker filter approach
    // Fetch open markets and filter by ticker prefix
    let cursor = "";
    let pages = 0;
    const maxPages = 3;

    while (pages < maxPages) {
      const url = `${baseUrl}?limit=1000&status=open${cursor ? `&cursor=${cursor}` : ""}`;
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Gridlock-NFL-Hub/1.0",
        },
      });

      if (!response.ok) throw new Error(`Kalshi API returned ${response.status}`);
      const data = await response.json();

      const markets = data.markets || [];
      allMarkets.push(...markets);

      // Stop if no more pages
      if (!data.cursor || markets.length === 0) break;
      cursor = data.cursor;
      pages++;
    }

    // Filter to NFL markets using ticker prefixes (most reliable method)
    const nflMarkets = allMarkets.filter((m) => {
      const ticker = (m.ticker || "").toLowerCase();
      const eventTicker = (m.event_ticker || "").toLowerCase();
      const seriesTicker = (m.series_ticker || "").toLowerCase();

      return NFL_TICKER_PREFIXES.some(
        (prefix) =>
          ticker.startsWith(prefix) ||
          eventTicker.startsWith(prefix) ||
          seriesTicker.startsWith(prefix)
      );
    });

    // Sort by 24h volume descending
    nflMarkets.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));

    res.status(200).json({
      markets: nflMarkets.slice(0, 30),
      total_nfl_found: nflMarkets.length,
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
