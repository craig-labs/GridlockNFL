export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");

  try {
    const base = "https://api.elections.kalshi.com/trade-api/v2";

    // All known NFL series tickers
    const NFL_SERIES = [
      "KXSB",           // Super Bowl champion
      "KXNFLDRAFT1",    // #1 overall pick
      "KXNFLDRAFT1ST",  // 1st pick at position
      "KXNFLDRAFT",     // General draft
      "KXNFLGAME",      // Game winner
      "KXNFLSPREAD",    // Spreads
      "KXNFLTOTAL",     // Totals
      "KXNFLPROP",      // Player props
      "KXNFLMENTION",   // Announcer mentions
      "KXNFLTRADE",     // NFL trades
      "KXNFLMVP",       // MVP
      "KXNFLWIN",       // Win totals
      "KXNFLPLAYOFF",   // Playoffs
      "KXPFB",          // Pro football general
    ];

    // Fetch events with nested markets for each series in parallel
    const fetches = NFL_SERIES.map(async (series) => {
      try {
        const url = `${base}/events?series_ticker=${series}&status=open&with_nested_markets=true&limit=200`;
        const r = await fetch(url, {
          headers: { "Accept": "application/json", "User-Agent": "Gridlock-NFL/1.0" },
        });
        if (!r.ok) return [];
        const d = await r.json();
        return (d.events || []).map(evt => ({
          event_ticker: evt.event_ticker,
          series_ticker: evt.series_ticker,
          title: evt.title,
          subtitle: evt.sub_title,
          category: evt.category,
          mutually_exclusive: evt.mutually_exclusive,
          markets: (evt.markets || [])
            .filter(m => m.status === "active" || m.status === "open")
            .map(m => ({
              ticker: m.ticker,
              title: m.title,
              subtitle: m.subtitle,
              yes_sub_title: m.yes_sub_title,
              no_sub_title: m.no_sub_title,
              yes_bid: m.yes_bid,
              yes_ask: m.yes_ask,
              no_bid: m.no_bid,
              no_ask: m.no_ask,
              last_price: m.last_price,
              volume: m.volume,
              volume_24h: m.volume_24h,
              open_interest: m.open_interest,
            }))
            .sort((a, b) => (b.last_price || 0) - (a.last_price || 0)),
        }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(fetches);
    let allEvents = results.flat().filter(e => e.markets.length > 0);

    // Sort events: SB first, then by total volume
    allEvents.sort((a, b) => {
      const aIsSB = (a.series_ticker || "").startsWith("KXSB") ? 1 : 0;
      const bIsSB = (b.series_ticker || "").startsWith("KXSB") ? 1 : 0;
      if (bIsSB !== aIsSB) return bIsSB - aIsSB;
      const aVol = a.markets.reduce((s, m) => s + (m.volume || 0), 0);
      const bVol = b.markets.reduce((s, m) => s + (m.volume || 0), 0);
      return bVol - aVol;
    });

    res.status(200).json({
      events: allEvents.slice(0, 30),
      total_events: allEvents.length,
      fetched_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Kalshi proxy error:", error);
    res.status(500).json({ error: "Failed to fetch", message: error.message });
  }
}
