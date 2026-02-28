// ESPN Team IDs
const ESPN_TEAM_IDS = {
  Cardinals:22, Falcons:1, Ravens:33, Bills:2, Panthers:29, Bears:3,
  Bengals:4, Browns:5, Cowboys:6, Broncos:7, Lions:8, Packers:9,
  Texans:34, Colts:11, Jaguars:30, Chiefs:12, Raiders:13, Chargers:24,
  Rams:14, Dolphins:15, Vikings:16, Patriots:17, Saints:18, Giants:19,
  Jets:20, Eagles:21, Steelers:23, "49ers":25, Seahawks:26,
  Buccaneers:27, Titans:10, Commanders:28,
};

// Official NFL team RSS feeds
const TEAM_RSS = {
  Cardinals:   "https://www.azcardinals.com/rss/news",
  Falcons:     "https://www.atlantafalcons.com/rss/news",
  Ravens:      "https://www.baltimoreravens.com/rss/news",
  Bills:       "https://www.buffalobills.com/rss/news",
  Panthers:    "https://www.panthers.com/rss/news",
  Bears:       "https://www.chicagobears.com/rss/news",
  Bengals:     "https://www.bengals.com/rss/news",
  Browns:      "https://www.clevelandbrowns.com/rss/news",
  Cowboys:     "https://www.dallascowboys.com/rss/news",
  Broncos:     "https://www.denverbroncos.com/rss/news",
  Lions:       "https://www.detroitlions.com/rss/news",
  Packers:     "https://www.packers.com/rss/news",
  Texans:      "https://www.houstontexans.com/rss/news",
  Colts:       "https://www.colts.com/rss/news",
  Jaguars:     "https://www.jaguars.com/rss/news",
  Chiefs:      "https://www.chiefs.com/rss/news",
  Raiders:     "https://www.raiders.com/rss/news",
  Chargers:    "https://www.chargers.com/rss/news",
  Rams:        "https://www.therams.com/rss/news",
  Dolphins:    "https://www.miamidolphins.com/rss/news",
  Vikings:     "https://www.vikings.com/rss/news",
  Patriots:    "https://www.patriots.com/rss/news",
  Saints:      "https://www.neworleanssaints.com/rss/news",
  Giants:      "https://www.giants.com/rss/news",
  Jets:        "https://www.newyorkjets.com/rss/news",
  Eagles:      "https://www.philadelphiaeagles.com/rss/news",
  Steelers:    "https://www.steelers.com/rss/news",
  "49ers":     "https://www.49ers.com/rss/news",
  Seahawks:    "https://www.seahawks.com/rss/news",
  Buccaneers:  "https://www.buccaneers.com/rss/news",
  Titans:      "https://www.tennesseetitans.com/rss/news",
  Commanders:  "https://www.commanders.com/rss/news",
};

// The Athletic team slugs (1 article max per team)
const ATHLETIC_TEAM_RSS = {
  Cardinals:   "https://theathletic.com/rss/feed/nfl/arizona-cardinals",
  Falcons:     "https://theathletic.com/rss/feed/nfl/atlanta-falcons",
  Ravens:      "https://theathletic.com/rss/feed/nfl/baltimore-ravens",
  Bills:       "https://theathletic.com/rss/feed/nfl/buffalo-bills",
  Panthers:    "https://theathletic.com/rss/feed/nfl/carolina-panthers",
  Bears:       "https://theathletic.com/rss/feed/nfl/chicago-bears",
  Bengals:     "https://theathletic.com/rss/feed/nfl/cincinnati-bengals",
  Browns:      "https://theathletic.com/rss/feed/nfl/cleveland-browns",
  Cowboys:     "https://theathletic.com/rss/feed/nfl/dallas-cowboys",
  Broncos:     "https://theathletic.com/rss/feed/nfl/denver-broncos",
  Lions:       "https://theathletic.com/rss/feed/nfl/detroit-lions",
  Packers:     "https://theathletic.com/rss/feed/nfl/green-bay-packers",
  Texans:      "https://theathletic.com/rss/feed/nfl/houston-texans",
  Colts:       "https://theathletic.com/rss/feed/nfl/indianapolis-colts",
  Jaguars:     "https://theathletic.com/rss/feed/nfl/jacksonville-jaguars",
  Chiefs:      "https://theathletic.com/rss/feed/nfl/kansas-city-chiefs",
  Raiders:     "https://theathletic.com/rss/feed/nfl/las-vegas-raiders",
  Chargers:    "https://theathletic.com/rss/feed/nfl/los-angeles-chargers",
  Rams:        "https://theathletic.com/rss/feed/nfl/los-angeles-rams",
  Dolphins:    "https://theathletic.com/rss/feed/nfl/miami-dolphins",
  Vikings:     "https://theathletic.com/rss/feed/nfl/minnesota-vikings",
  Patriots:    "https://theathletic.com/rss/feed/nfl/new-england-patriots",
  Saints:      "https://theathletic.com/rss/feed/nfl/new-orleans-saints",
  Giants:      "https://theathletic.com/rss/feed/nfl/new-york-giants",
  Jets:        "https://theathletic.com/rss/feed/nfl/new-york-jets",
  Eagles:      "https://theathletic.com/rss/feed/nfl/philadelphia-eagles",
  Steelers:    "https://theathletic.com/rss/feed/nfl/pittsburgh-steelers",
  "49ers":     "https://theathletic.com/rss/feed/nfl/san-francisco-49ers",
  Seahawks:    "https://theathletic.com/rss/feed/nfl/seattle-seahawks",
  Buccaneers:  "https://theathletic.com/rss/feed/nfl/tampa-bay-buccaneers",
  Titans:      "https://theathletic.com/rss/feed/nfl/tennessee-titans",
  Commanders:  "https://theathletic.com/rss/feed/nfl/washington-commanders",
};

// Parse an RSS/Atom feed string into articles
function parseRSS(xml, source, maxItems = 10) {
  const articles = [];
  try {
    // Handle both RSS <item> and Atom <entry>
    const itemRegex = /<(item|entry)[\s>]([\s\S]*?)<\/(item|entry)>/gi;
    let match;
    let count = 0;
    while ((match = itemRegex.exec(xml)) !== null && count < maxItems) {
      const block = match[2];
      const get = (tag) => {
        // Try CDATA first, then plain text
        const cdataMatch = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
        if (cdataMatch) return cdataMatch[1].trim();
        const plainMatch = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
        if (plainMatch) return plainMatch[1].replace(/<[^>]+>/g, '').trim();
        return '';
      };
      const getAttr = (tag, attr) => {
        const m = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, 'i'));
        return m ? m[1] : '';
      };

      const title = get('title') || get('a:title');
      const link = get('link') || getAttr('link', 'href') || get('guid');
      const description = get('description') || get('summary') || get('content') || get('a:summary');
      const pubDate = get('pubDate') || get('published') || get('updated') || get('dc:date');
      const image =
        getAttr('media:content', 'url') ||
        getAttr('media:thumbnail', 'url') ||
        getAttr('enclosure', 'url') ||
        (() => { const m = description.match(/src="([^"]*\.(jpg|jpeg|png|webp)[^"]*)"/i); return m ? m[1] : ''; })();

      if (title && link) {
        articles.push({
          headline: title,
          description: description.replace(/<[^>]+>/g, '').slice(0, 200),
          published: pubDate ? new Date(pubDate).toISOString() : null,
          image: image || null,
          link,
          source,
        });
        count++;
      }
    }
  } catch (e) {
    // silently skip malformed feeds
  }
  return articles;
}

// Fetch a URL with timeout
async function fetchWithTimeout(url, timeout = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Gridlock-NFL/1.0', 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

  const { team } = req.query;
  const allArticles = [];

  try {
    if (team) {
      // ── TEAM-SPECIFIC MODE ─────────────────────────────────────────────
      const espnId = ESPN_TEAM_IDS[team];
      const teamRssUrl = TEAM_RSS[team];
      const athleticUrl = ATHLETIC_TEAM_RSS[team];

      const fetches = [];

      // 1. ESPN team feed
      if (espnId) {
        fetches.push(
          fetchWithTimeout(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?team=${espnId}&limit=8`)
            .then(async (text) => {
              const data = JSON.parse(text);
              return (data.articles || []).slice(0, 8).map((a) => ({
                headline: a.headline,
                description: a.description || '',
                published: a.published,
                image: a.images?.[0]?.url || null,
                link: a.links?.web?.href || null,
                source: 'ESPN',
              }));
            })
            .catch(() => [])
        );
      }

      // 2. Official team site RSS (up to 5 articles)
      if (teamRssUrl) {
        fetches.push(
          fetchWithTimeout(teamRssUrl)
            .then((xml) => parseRSS(xml, `${team} Official`, 5))
            .catch(() => [])
        );
      }

      // 3. The Athletic RSS (max 1 article)
      if (athleticUrl) {
        fetches.push(
          fetchWithTimeout(athleticUrl)
            .then((xml) => parseRSS(xml, 'The Athletic', 1))
            .catch(() => [])
        );
      }

      const results = await Promise.all(fetches);
      results.forEach((articles) => allArticles.push(...articles));

    } else {
      // ── LEAGUE-WIDE MODE ───────────────────────────────────────────────
      const fetches = [];

      // 1. ESPN general NFL news
      fetches.push(
        fetchWithTimeout('https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=8')
          .then(async (text) => {
            const data = JSON.parse(text);
            return (data.articles || []).slice(0, 8).map((a) => ({
              headline: a.headline,
              description: a.description || '',
              published: a.published,
              image: a.images?.[0]?.url || null,
              link: a.links?.web?.href || null,
              source: 'ESPN',
            }));
          })
          .catch(() => [])
      );

      // 2. Pro Football Talk (NBC Sports)
      fetches.push(
        fetchWithTimeout('https://profootballtalk.nbcsports.com/feed/', 5000)
          .then((xml) => parseRSS(xml, 'Pro Football Talk', 5))
          .catch(() => [])
      );

      // 3. NFL.com news RSS
      fetches.push(
        fetchWithTimeout('https://www.nfl.com/rss/rsslanding?searchString=news', 5000)
          .then((xml) => parseRSS(xml, 'NFL.com', 4))
          .catch(() => [])
      );

      // 4. The Athletic NFL (max 1)
      fetches.push(
        fetchWithTimeout('https://theathletic.com/rss/feed/nfl', 5000)
          .then((xml) => parseRSS(xml, 'The Athletic', 1))
          .catch(() => [])
      );

      const results = await Promise.all(fetches);
      results.forEach((articles) => allArticles.push(...articles));
    }

    // Dedupe by headline, sort by date (newest first), cap at 15
    const seen = new Set();
    const deduped = allArticles
      .filter((a) => {
        if (!a.headline || !a.link) return false;
        const key = a.headline.slice(0, 60).toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        if (!a.published) return 1;
        if (!b.published) return -1;
        return new Date(b.published) - new Date(a.published);
      })
      .slice(0, 15);

    res.status(200).json({
      articles: deduped,
      team: team || null,
      sources: [...new Set(deduped.map((a) => a.source))],
      fetched_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('News proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
}
