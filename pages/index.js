import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";

const TEAMS={AFC:{North:[{name:"Ravens",city:"Baltimore",abbr:"BAL",color:"#241773",accent:"#9E7C0C"},{name:"Bengals",city:"Cincinnati",abbr:"CIN",color:"#FB4F14",accent:"#000000"},{name:"Browns",city:"Cleveland",abbr:"CLE",color:"#311D00",accent:"#FF3C00"},{name:"Steelers",city:"Pittsburgh",abbr:"PIT",color:"#FFB612",accent:"#101820"}],South:[{name:"Texans",city:"Houston",abbr:"HOU",color:"#03202F",accent:"#A71930"},{name:"Colts",city:"Indianapolis",abbr:"IND",color:"#002C5F",accent:"#A2AAAD"},{name:"Jaguars",city:"Jacksonville",abbr:"JAX",color:"#006778",accent:"#D7A22A"},{name:"Titans",city:"Tennessee",abbr:"TEN",color:"#0C2340",accent:"#4B92DB"}],East:[{name:"Bills",city:"Buffalo",abbr:"BUF",color:"#00338D",accent:"#C60C30"},{name:"Dolphins",city:"Miami",abbr:"MIA",color:"#008E97",accent:"#FC4C02"},{name:"Patriots",city:"New England",abbr:"NE",color:"#002244",accent:"#C60C30"},{name:"Jets",city:"New York",abbr:"NYJ",color:"#125740",accent:"#FFFFFF"}],West:[{name:"Broncos",city:"Denver",abbr:"DEN",color:"#FB4F14",accent:"#002244"},{name:"Chiefs",city:"Kansas City",abbr:"KC",color:"#E31837",accent:"#FFB81C"},{name:"Raiders",city:"Las Vegas",abbr:"LV",color:"#000000",accent:"#A5ACAF"},{name:"Chargers",city:"Los Angeles",abbr:"LAC",color:"#0080C6",accent:"#FFC20E"}]},NFC:{North:[{name:"Bears",city:"Chicago",abbr:"CHI",color:"#0B162A",accent:"#C83803"},{name:"Lions",city:"Detroit",abbr:"DET",color:"#0076B6",accent:"#B0B7BC"},{name:"Packers",city:"Green Bay",abbr:"GB",color:"#203731",accent:"#FFB612"},{name:"Vikings",city:"Minnesota",abbr:"MIN",color:"#4F2683",accent:"#FFC62F"}],South:[{name:"Falcons",city:"Atlanta",abbr:"ATL",color:"#A71930",accent:"#000000"},{name:"Panthers",city:"Carolina",abbr:"CAR",color:"#0085CA",accent:"#101820"},{name:"Saints",city:"New Orleans",abbr:"NO",color:"#D3BC8D",accent:"#101820"},{name:"Buccaneers",city:"Tampa Bay",abbr:"TB",color:"#D50A0A",accent:"#34302B"}],East:[{name:"Cowboys",city:"Dallas",abbr:"DAL",color:"#003594",accent:"#869397"},{name:"Giants",city:"New York",abbr:"NYG",color:"#0B2265",accent:"#A71930"},{name:"Eagles",city:"Philadelphia",abbr:"PHI",color:"#004C54",accent:"#A5ACAF"},{name:"Commanders",city:"Washington",abbr:"WAS",color:"#5A1414",accent:"#FFB612"}],West:[{name:"Cardinals",city:"Arizona",abbr:"ARI",color:"#97233F",accent:"#000000"},{name:"Rams",city:"Los Angeles",abbr:"LAR",color:"#003594",accent:"#FFA300"},{name:"49ers",city:"San Francisco",abbr:"SF",color:"#AA0000",accent:"#B3995D"},{name:"Seahawks",city:"Seattle",abbr:"SEA",color:"#002244",accent:"#69BE28"}]}};
const allTeams=Object.entries(TEAMS).flatMap(([c,d])=>Object.entries(d).flatMap(([v,t])=>t.map(x=>({...x,conference:c,division:v,divFull:`${c} ${v}`}))));
const getTeam=(n)=>allTeams.find(t=>t.name===n);
const DIVISIONS=["AFC North","AFC South","AFC East","AFC West","NFC North","NFC South","NFC East","NFC West"];
const CP="https://i.imgur.com/vo46zbi.jpg";
const CraigAvatar=({size=44})=>(CP?<img src={CP} alt="Craig" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:"2px solid #ffffff22",flexShrink:0}}/>:<div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#e94560,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:800,color:"#fff",flexShrink:0,border:"2px solid #ffffff22"}}>CN</div>);

const TWITTER_ACCOUNTS={
  league:[
    {handle:"NFL",label:"NFL",emoji:"🏈",desc:"Official NFL account"},
    {handle:"AdamSchefter",label:"Adam Schefter",emoji:"📰",desc:"ESPN NFL Insider"},
    {handle:"RapSheet",label:"Ian Rapoport",emoji:"🗞️",desc:"NFL Network Insider"},
    {handle:"PatMcAfeeShow",label:"Pat McAfee",emoji:"🎙️",desc:"Daily sports talk & NFL"},
    {handle:"NFLNetwork",label:"NFL Network",emoji:"📺",desc:"Official NFL Network"},
    {handle:"TomPelissero",label:"Tom Pelissero",emoji:"📋",desc:"NFL Network Insider"},
    {handle:"JayGlazer",label:"Jay Glazer",emoji:"💪",desc:"FOX NFL Insider"},
    {handle:"MikeGarafolo",label:"Mike Garafolo",emoji:"🎯",desc:"NFL Network reporter"},
  ],
  teams:{
    Ravens:[{handle:"Ravens",label:"Baltimore Ravens",emoji:"🦅"},{handle:"jamisonhensley",label:"Jamison Hensley",emoji:"📰",desc:"ESPN Ravens beat"},{handle:"jeffzrebiec",label:"Jeff Zrebiec",emoji:"📋",desc:"The Athletic"},{handle:"jonas_shaffer",label:"Jonas Shaffer",emoji:"📋",desc:"Baltimore Banner"},{handle:"Lj_era8",label:"Lamar Jackson",emoji:"🌟",desc:"QB  --  2x MVP"},{handle:"ZayFlowers",label:"Zay Flowers",emoji:"🎯",desc:"WR"}],
    Bengals:[{handle:"Bengals",label:"Cincinnati Bengals",emoji:"🐯"},{handle:"Ben_Baby",label:"Ben Baby",emoji:"📰",desc:"ESPN Bengals beat"},{handle:"pauldehnerjr",label:"Paul Dehner Jr.",emoji:"📋",desc:"The Athletic"},{handle:"JoeGoodberry",label:"Joe Goodberry",emoji:"📋",desc:"Film analyst"},{handle:"GeoffHobsonCin",label:"Geoff Hobson",emoji:"📋",desc:"Bengals.com"},{handle:"JoeyB",label:"Joe Burrow",emoji:"🌟",desc:"QB"},{handle:"Real10jayy__",label:"Ja'Marr Chase",emoji:"🎯",desc:"WR"}],
    Browns:[{handle:"Browns",label:"Cleveland Browns",emoji:"🟤"},{handle:"MaryKayCabot",label:"Mary Kay Cabot",emoji:"📰",desc:"Cleveland.com"},{handle:"AkronJackson",label:"Zac Jackson",emoji:"📋",desc:"The Athletic"},{handle:"Flash_Garrett",label:"Myles Garrett",emoji:"🌟",desc:"DE  --  DPOY"}],
    Steelers:[{handle:"steelers",label:"Pittsburgh Steelers",emoji:"⚙️"},{handle:"BrookePryor",label:"Brooke Pryor",emoji:"📰",desc:"ESPN Steelers beat"},{handle:"MarkKaboly",label:"Mark Kaboly",emoji:"📋",desc:"McAfee Show"},{handle:"TJWatt",label:"T.J. Watt",emoji:"🌟",desc:"OLB"}],
    Texans:[{handle:"HoustonTexans",label:"Houston Texans",emoji:"🐂"},{handle:"DJBienAime",label:"DJ Bien-Aime",emoji:"📰",desc:"ESPN Texans beat"},{handle:"CJStroud7",label:"C.J. Stroud",emoji:"🌟",desc:"QB"},{handle:"NicoCollins",label:"Nico Collins",emoji:"🎯",desc:"WR"}],
    Colts:[{handle:"Colts",label:"Indianapolis Colts",emoji:"🐴"},{handle:"HolderStephen",label:"Stephen Holder",emoji:"📰",desc:"ESPN Colts beat"},{handle:"JonathanTaylor",label:"Jonathan Taylor",emoji:"🏃",desc:"RB"}],
    Jaguars:[{handle:"Jaguars",label:"Jacksonville Jaguars",emoji:"🐆"},{handle:"MikeDiRocco",label:"Mike DiRocco",emoji:"📰",desc:"ESPN Jaguars beat"},{handle:"Demetrius82",label:"Demetrius Harvey",emoji:"📋",desc:"FL Times-Union"},{handle:"TravisETN",label:"Travis Etienne",emoji:"🏃",desc:"RB"}],
    Titans:[{handle:"Titans",label:"Tennessee Titans",emoji:"⚔️"},{handle:"TDavenport_NFL",label:"Turron Davenport",emoji:"📰",desc:"ESPN Titans beat"},{handle:"jwyattsports",label:"Jim Wyatt",emoji:"📋",desc:"Titans.com"},{handle:"TonyPollard",label:"Tony Pollard",emoji:"🏃",desc:"RB"}],
    Bills:[{handle:"BuffaloBills",label:"Buffalo Bills",emoji:"🦬"},{handle:"JoeBuscaglia",label:"Joe Buscaglia",emoji:"📰",desc:"The Athletic"},{handle:"MattParrino",label:"Matt Parrino",emoji:"📋",desc:"Syracuse.com"},{handle:"JoshAllenQB",label:"Josh Allen",emoji:"🌟",desc:"QB  --  MVP candidate"},{handle:"JCookfor6",label:"James Cook",emoji:"🏃",desc:"RB"}],
    Dolphins:[{handle:"MiamiDolphins",label:"Miami Dolphins",emoji:"🐬"},{handle:"DavidFurones_",label:"David Furones",emoji:"📰",desc:"Sun Sentinel"},{handle:"schadjoe",label:"Joe Schad",emoji:"📋",desc:"Palm Beach Post"}],
    Patriots:[{handle:"Patriots",label:"New England Patriots",emoji:"🇺🇸"},{handle:"MikeReiss",label:"Mike Reiss",emoji:"📰",desc:"ESPN Patriots beat"},{handle:"PhilAPerry",label:"Phil Perry",emoji:"📋",desc:"NBC Sports"},{handle:"DrakeMaye10",label:"Drake Maye",emoji:"🌟",desc:"QB"}],
    Jets:[{handle:"nyjets",label:"New York Jets",emoji:"✈️"},{handle:"RichCimini",label:"Rich Cimini",emoji:"📰",desc:"ESPN Jets beat"},{handle:"BrianCoz",label:"Brian Costello",emoji:"📋",desc:"NY Post"},{handle:"Garrett_Wilson",label:"Garrett Wilson",emoji:"🎯",desc:"WR"}],
    Broncos:[{handle:"Broncos",label:"Denver Broncos",emoji:"🐎"},{handle:"JeffLegwold",label:"Jeff Legwold",emoji:"📰",desc:"ESPN Broncos beat"},{handle:"mikeklis",label:"Mike Klis",emoji:"📋",desc:"9NEWS"},{handle:"TroyRenck",label:"Troy Renck",emoji:"📋",desc:"Denver7"}],
    Chiefs:[{handle:"Chiefs",label:"Kansas City Chiefs",emoji:"🏹"},{handle:"adamteicher",label:"Adam Teicher",emoji:"📰",desc:"ESPN Chiefs beat"},{handle:"mattderrick",label:"Matt Derrick",emoji:"📋",desc:"Chiefs Digest"},{handle:"PatrickMahomes",label:"Patrick Mahomes",emoji:"🌟",desc:"QB  --  3x SB MVP"}],
    Raiders:[{handle:"Raiders",label:"Las Vegas Raiders",emoji:"☠️"},{handle:"tashanreed",label:"Tashan Reed",emoji:"📰",desc:"The Athletic"},{handle:"VinnyBonsignore",label:"Vincent Bonsignore",emoji:"📋",desc:"LV Review-Journal"},{handle:"CrosbyMaxx",label:"Maxx Crosby",emoji:"🌟",desc:"DE"}],
    Chargers:[{handle:"chargers",label:"Los Angeles Chargers",emoji:"⚡"},{handle:"krisrhim1",label:"Kris Rhim",emoji:"📰",desc:"ESPN Chargers beat"},{handle:"danielrpopper",label:"Daniel Popper",emoji:"📋",desc:"The Athletic"},{handle:"JustinHerbert",label:"Justin Herbert",emoji:"🌟",desc:"QB"}],
    Bears:[{handle:"ChicagoBears",label:"Chicago Bears",emoji:"🐻"},{handle:"CourtneyRCronin",label:"Courtney Cronin",emoji:"📰",desc:"ESPN Bears beat"},{handle:"adamjahns",label:"Adam Jahns",emoji:"📋",desc:"The Athletic"},{handle:"kfishbain",label:"Kevin Fishbain",emoji:"📋",desc:"The Athletic"},{handle:"CalebWilliams",label:"Caleb Williams",emoji:"🌟",desc:"QB  --  #1 pick"},{handle:"DJMoore",label:"DJ Moore",emoji:"🎯",desc:"WR"}],
    Lions:[{handle:"Lions",label:"Detroit Lions",emoji:"🦁"},{handle:"EricWoodyard",label:"Eric Woodyard",emoji:"📰",desc:"ESPN Lions beat"},{handle:"davebirkett",label:"Dave Birkett",emoji:"📋",desc:"Detroit Free Press"},{handle:"JaredGoff",label:"Jared Goff",emoji:"🌟",desc:"QB"},{handle:"ArStBr",label:"Amon-Ra St. Brown",emoji:"🎯",desc:"WR"}],
    Packers:[{handle:"packers",label:"Green Bay Packers",emoji:"🧀"},{handle:"RobDemovsky",label:"Rob Demovsky",emoji:"📰",desc:"ESPN Packers beat"},{handle:"mattschneidman",label:"Matt Schneidman",emoji:"📋",desc:"The Athletic"},{handle:"jordan3love",label:"Jordan Love",emoji:"🌟",desc:"QB"}],
    Vikings:[{handle:"Vikings",label:"Minnesota Vikings",emoji:"⛵"},{handle:"KevinSeifert",label:"Kevin Seifert",emoji:"📰",desc:"ESPN Vikings beat"},{handle:"ArifHasanNFL",label:"Arif Hasan",emoji:"📋",desc:"Vikings analyst"},{handle:"JJettas2",label:"Justin Jefferson",emoji:"🌟",desc:"WR  --  Best in NFL"}],
    Falcons:[{handle:"AtlantaFalcons",label:"Atlanta Falcons",emoji:"🦅"},{handle:"marcraimondi",label:"Marc Raimondi",emoji:"📰",desc:"ESPN Falcons beat"},{handle:"ZachKleinWSB",label:"Zach Klein",emoji:"📋",desc:"WSB"},{handle:"DrakeJLondon",label:"Drake London",emoji:"🎯",desc:"WR"}],
    Panthers:[{handle:"Panthers",label:"Carolina Panthers",emoji:"🐈‍⬛"},{handle:"DNewtonespn",label:"David Newton",emoji:"📰",desc:"ESPN Panthers beat"},{handle:"josephperson",label:"Joe Person",emoji:"📋",desc:"The Athletic"},{handle:"BryceYoung",label:"Bryce Young",emoji:"🌟",desc:"QB"}],
    Saints:[{handle:"Saints",label:"New Orleans Saints",emoji:"⚜️"},{handle:"Kat_Terrell",label:"Katherine Terrell",emoji:"📰",desc:"ESPN Saints beat"},{handle:"MikeTriplett",label:"Mike Triplett",emoji:"📋",desc:"NewOrleans.football"},{handle:"A_kamara6",label:"Alvin Kamara",emoji:"🏃",desc:"RB"}],
    Buccaneers:[{handle:"Buccaneers",label:"Tampa Bay Buccaneers",emoji:"🏴‍☠️"},{handle:"JennaLaineESPN",label:"Jenna Laine",emoji:"📰",desc:"ESPN Bucs beat"},{handle:"gregauman",label:"Greg Auman",emoji:"📋",desc:"FOX Sports"},{handle:"BakerMayfield",label:"Baker Mayfield",emoji:"🌟",desc:"QB"},{handle:"MikeEvans",label:"Mike Evans",emoji:"🎯",desc:"WR"}],
    Cowboys:[{handle:"dallascowboys",label:"Dallas Cowboys",emoji:"⭐"},{handle:"toddarcher",label:"Todd Archer",emoji:"📰",desc:"ESPN Cowboys beat"},{handle:"TimCowlishaw",label:"Tim Cowlishaw",emoji:"📋",desc:"Dallas Morning News"},{handle:"CeeDee",label:"CeeDee Lamb",emoji:"🎯",desc:"WR"}],
    Giants:[{handle:"Giants",label:"New York Giants",emoji:"🗽"},{handle:"JordanRaanan",label:"Jordan Raanan",emoji:"📰",desc:"ESPN Giants beat"},{handle:"DDuggan21",label:"Dan Duggan",emoji:"📋",desc:"The Athletic"},{handle:"MalikNabers",label:"Malik Nabers",emoji:"🎯",desc:"WR"}],
    Eagles:[{handle:"Eagles",label:"Philadelphia Eagles",emoji:"🦅"},{handle:"TimMcManus",label:"Tim McManus",emoji:"📰",desc:"ESPN Eagles beat"},{handle:"ZBerm",label:"Zach Berman",emoji:"📋",desc:"PHLY"},{handle:"Jeff_McLane",label:"Jeff McLane",emoji:"📋",desc:"Philly Inquirer"},{handle:"JalenHurts",label:"Jalen Hurts",emoji:"🌟",desc:"QB"},{handle:"AJBrown",label:"A.J. Brown",emoji:"🎯",desc:"WR"}],
    Commanders:[{handle:"Commanders",label:"Washington Commanders",emoji:"🎖️"},{handle:"john_keim",label:"John Keim",emoji:"📰",desc:"ESPN Commanders beat"},{handle:"BenStandig",label:"Ben Standig",emoji:"📋",desc:"The Athletic"},{handle:"JaydenDaniels",label:"Jayden Daniels",emoji:"🌟",desc:"QB  --  OROY"},{handle:"TerryMcLaurin",label:"Terry McLaurin",emoji:"🎯",desc:"WR"}],
    Cardinals:[{handle:"AZCardinals",label:"Arizona Cardinals",emoji:"🐦"},{handle:"BoBrack",label:"Bo Brack",emoji:"📰",desc:"PHNX Sports"},{handle:"JohnnyVenerable",label:"Johnny Venerable",emoji:"📋",desc:"PHNX Sports"},{handle:"K1",label:"Kyler Murray",emoji:"🌟",desc:"QB"}],
    Rams:[{handle:"RamsNFL",label:"Los Angeles Rams",emoji:"🐏"},{handle:"JourdanRodrigue",label:"Jourdan Rodrigue",emoji:"📰",desc:"The Athletic"},{handle:"LATimesklein",label:"Gary Klein",emoji:"📋",desc:"LA Times"},{handle:"CooperKupp",label:"Cooper Kupp",emoji:"🎯",desc:"WR"}],
    "49ers":[{handle:"49ers",label:"San Francisco 49ers",emoji:"⛏️"},{handle:"NickWagoner",label:"Nick Wagoner",emoji:"📰",desc:"ESPN 49ers beat"},{handle:"VicTafur",label:"Vic Tafur",emoji:"📋",desc:"The Athletic"},{handle:"LombardiHimself",label:"David Lombardi",emoji:"📋",desc:"The Athletic"},{handle:"CMC_22",label:"Christian McCaffrey",emoji:"🏃",desc:"RB"},{handle:"Kittle",label:"George Kittle",emoji:"🎯",desc:"TE"}],
    Seahawks:[{handle:"Seahawks",label:"Seattle Seahawks",emoji:"🦅"},{handle:"BradyHenderson",label:"Brady Henderson",emoji:"📰",desc:"ESPN Seahawks beat"},{handle:"bcondotta",label:"Bob Condotta",emoji:"📋",desc:"Seattle Times"},{handle:"gbellseattle",label:"Gregg Bell",emoji:"📋",desc:"Tacoma News Tribune"},{handle:"SamDarnold",label:"Sam Darnold",emoji:"🌟",desc:"QB  --  SB LX champ"},{handle:"JSN_11",label:"Jaxon Smith-Njigba",emoji:"🎯",desc:"WR"}],
  },
};

function TwitterFeed({accounts,ac}){
  if(!accounts||!accounts.length)return null;
  return(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
    {accounts.map(a=>(<a key={a.handle} href={`https://x.com/${a.handle}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}><div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:`${ac}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.emoji||"🏈"}</div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.label}</div><div style={{fontSize:12,color:"#1DA1F2",fontWeight:500}}>@{a.handle}</div>{a.desc&&<div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{a.desc}</div>}</div>
      <span style={{background:"#1DA1F222",color:"#1DA1F2",padding:"4px 10px",borderRadius:6,fontWeight:600,fontSize:11,flexShrink:0}}>View {"X"}</span>
    </div></a>))}
  </div>);
}

const fmtVol=(v)=>{if(!v)return"$0";const d=v/100;if(d>=1e6)return`$${(d/1e6).toFixed(1)}M`;if(d>=1e3)return`$${(d/1e3).toFixed(0)}K`;return`$${d.toFixed(0)}`;};
const useKalshi=()=>{
  const [events,setEvents]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);const [lastFetch,setLastFetch]=useState(null);
  const f=useCallback(async()=>{setLoading(true);setError(null);try{const r=await fetch("/api/kalshi");if(!r.ok)throw new Error(`API ${r.status}`);const d=await r.json();setEvents(d.events||[]);setLastFetch(new Date());}catch(e){setError(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{f();},[f]);return{events,loading,error,lastFetch,refresh:f};
};

const useNflNews=(newsContext={})=>{
  const [articles,setArticles]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);
  const contextKey=JSON.stringify(newsContext);
  const f=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      let url="/api/news";
      if(newsContext.type==="team")url=`/api/news?team=${encodeURIComponent(newsContext.value)}`;
      else if(newsContext.type==="conference")url=`/api/news?conference=${encodeURIComponent(newsContext.value)}`;
      else if(newsContext.type==="division")url=`/api/news?division=${encodeURIComponent(newsContext.value)}`;
      const r=await fetch(url);
      if(!r.ok)throw new Error(`API ${r.status}`);
      const d=await r.json();
      setArticles(d.articles||[]);
    }catch(e){setError(e.message);}finally{setLoading(false);}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[contextKey]);
  useEffect(()=>{f();},[f]);return{articles,loading,error,refresh:f};
};

const SOURCE_COLORS={"ESPN":"#e05c1a","Pro Football Talk":"#00a0d6","NFL.com":"#013087","The Athletic":"#e52836","Official":"#4ade80"};
function SourceBadge({source}){
  const color=Object.entries(SOURCE_COLORS).find(([k])=>source?.includes(k))?.[1]||"#ffffff44";
  return <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:color+"22",color:color,fontWeight:700,flexShrink:0}}>{source}</span>;
}
function TopStories({articles,ac,newsContext={}}){
  if(!articles||!articles.length)return null;
  const main=articles[0],rest=articles.slice(1,6);
  const ago=(d)=>{if(!d)return"";const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<60)return`${m}m ago`;if(m<1440)return`${Math.floor(m/60)}h ago`;return`${Math.floor(m/1440)}d ago`;};
  return(<div style={{marginBottom:24}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <div style={{fontSize:12,color:"#ffffff55",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase"}}>
        📰 Top Stories
        {newsContext.type==="conference"&&<span style={{marginLeft:8,fontSize:10,padding:"2px 8px",borderRadius:10,background:"#ffffff12",color:"#ffffffaa",fontWeight:600}}>{newsContext.value}</span>}
        {newsContext.type==="division"&&<span style={{marginLeft:8,fontSize:10,padding:"2px 8px",borderRadius:10,background:"#ffffff12",color:"#ffffffaa",fontWeight:600}}>{newsContext.value}</span>}
        {newsContext.type==="team"&&<span style={{marginLeft:8,fontSize:10,padding:"2px 8px",borderRadius:10,background:"#ffffff12",color:"#ffffffaa",fontWeight:600}}>{newsContext.value}</span>}
      </div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"flex-end"}}>{[...new Set(articles.map(a=>a.source))].map(s=><SourceBadge key={s} source={s}/>)}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:rest.length?"2fr 1fr":"1fr",gap:12}}>
      <a href={main.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}><div style={{background:"linear-gradient(135deg,#1a1a2e,#12121c)",border:"1px solid #ffffff12",borderRadius:14,overflow:"hidden",cursor:"pointer",borderLeft:`4px solid ${ac}`}}>
        {main.image&&<div style={{width:"100%",height:180,backgroundImage:`url(${main.image})`,backgroundSize:"cover",backgroundPosition:"center"}}/>}
        <div style={{padding:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:`${ac}22`,color:ac,fontWeight:700}}>🔥 Top Story</span><SourceBadge source={main.source}/><span style={{fontSize:10,color:"#ffffff44"}}>{ago(main.published)}</span></div>
          <h3 style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.3,marginBottom:6}}>{main.headline}</h3>
          <p style={{fontSize:12,color:"#ffffff66",lineHeight:1.5,margin:0}}>{main.description?.slice(0,140)}{main.description?.length>140?"...":""}</p>
          <div style={{fontSize:11,color:ac,marginTop:10,fontWeight:600}}>Read full story {"->"}</div>
        </div>
      </div></a>
      {rest.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {rest.map((s,i)=>(<a key={i} href={s.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",flex:1}}><div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:10,padding:12,cursor:"pointer",display:"flex",gap:10,alignItems:"center",height:"100%"}}>
          {s.image&&<div style={{width:60,height:50,borderRadius:6,backgroundImage:`url(${s.image})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}}/>}
          <div style={{flex:1,minWidth:0}}><div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}><SourceBadge source={s.source}/><span style={{fontSize:9,color:"#ffffff33"}}>{ago(s.published)}</span></div><div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.headline}</div></div>
        </div></a>))}
      </div>}
    </div>
  </div>);
}

// ===== REAL BET DATA — Hard Rock Bet (1,218 bets | Jan 2024 – Feb 2026) =====
const ALL_BETS=[
  {id:1,date:"2026-02-22",status:"Lost",league:"Men",match:"Canada vs United States",type:"Total Goals",market:"Over 5.5",price:2.2,wager:100,winnings:0,payout:0},
  {id:2,date:"2026-02-08",status:"Won",league:"NFL",match:"Patriots vs Seahawks",type:"Drake Maye - Pass Completions",market:"Over 20.5",price:2.0,wager:2000,winnings:2000,payout:4000},
  {id:3,date:"2026-02-08",status:"Won",league:"NFL",match:"Patriots vs Seahawks",type:"Drake Maye - Pass Completions",market:"Over 20.5",price:2.0,wager:1000,winnings:1000,payout:2000},
  {id:4,date:"2026-01-30",status:"Lost",league:"NCAA",match:"#23 Saint Louis vs. Dayton",type:"To Win",market:"Dayton",price:6.0,wager:250,winnings:0,payout:0,freeBet:true},
  {id:5,date:"2026-01-25",status:"Lost",league:"NFL",match:"Seahawks vs Rams",type:"Spread",market:"Rams +2.5",price:1.91,wager:1500,winnings:0,payout:0},
  {id:6,date:"2026-01-25",status:"Lost",league:"NFL",match:"Broncos vs Patriots",type:"Spread",market:"Patriots -3.5",price:1.91,wager:700,winnings:0,payout:0},
  {id:7,date:"2026-01-25",status:"Lost",league:"NFL",match:"Broncos vs Patriots",type:"Spread",market:"Patriots -3.5",price:1.87,wager:1000,winnings:0,payout:0},
  {id:8,date:"2026-01-24",status:"Lost",league:"NCAA",match:"St. Joseph's vs. Dayton",type:"Spread",market:"Dayton -6.5",price:1.87,wager:150,winnings:0,payout:0},
  {id:9,date:"2026-01-21",status:"Lost",league:"NCAA",match:"La Salle vs. Dayton",type:"Spread",market:"Dayton -3.5",price:1.95,wager:150,winnings:0,payout:0},
  {id:10,date:"2026-01-21",status:"Lost",league:"NCAA",match:"La Salle vs. Dayton",type:"Spread",market:"Dayton -10.5",price:2.0,wager:200,winnings:0,payout:0},
  {id:11,date:"2026-01-19",status:"Lost",league:"NCAA",match:"1 Indiana vs. 10 Miami (FL)",type:"Spread",market:"1 Indiana -7.5",price:1.95,wager:400,winnings:0,payout:0},
  {id:12,date:"2026-01-19",status:"Lost",league:"NCAA",match:"1 Indiana vs. 10 Miami (FL), 1 Indiana vs. 10 Miami (FL),",type:"MULTIPLE",market:"MULTIPLE",price:3.25,wager:200,winnings:0,payout:0},
  {id:13,date:"2026-01-19",status:"Lost",league:"NCAA",match:"1 Indiana vs. 10 Miami (FL)",type:"Spread",market:"1 Indiana -7.5",price:1.95,wager:230,winnings:0,payout:0},
  {id:14,date:"2026-01-19",status:"Lost",league:"NCAA",match:"1 Indiana vs. 10 Miami (FL), 1 Indiana vs. 10 Miami (FL),",type:"MULTIPLE",market:"MULTIPLE",price:3.25,wager:250,winnings:0,payout:0},
  {id:15,date:"2026-01-19",status:"Won",league:"NHL",match:"Avalanche vs. Capitals, Avalanche vs. Capitals,",type:"MULTIPLE",market:"MULTIPLE",price:3.6,wager:200,winnings:520,payout:720},
  {id:16,date:"2026-01-18",status:"Lost",league:"NFL",match:"Bears vs Rams",type:"Spread",market:"Rams -3.5",price:2.3,wager:100,winnings:0,payout:0},
  {id:17,date:"2026-01-18",status:"Won",league:"NFL",match:"Bears vs Rams",type:"Total Points",market:"Under 42.5",price:1.91,wager:150,winnings:136,payout:286},
  {id:18,date:"2026-01-18",status:"Won",league:"NFL",match:"Bears vs Rams",type:"Total Points",market:"Under 49",price:1.91,wager:260,winnings:236,payout:496},
  {id:19,date:"2026-01-18",status:"Lost",league:"NFL",match:"Bears vs Rams",type:"To Win",market:"Bears",price:2.7,wager:40,winnings:0,payout:0},
  {id:20,date:"2026-01-18",status:"Won",league:"NFL",match:"Bears vs Rams",type:"Total Points",market:"Under 49",price:1.91,wager:550,winnings:500,payout:1050},
  {id:21,date:"2026-01-18",status:"Won",league:"NFL",match:"Patriots vs Texans",type:"Spread",market:"Patriots -3.5",price:2.0,wager:150,winnings:150,payout:300},
  {id:22,date:"2026-01-18",status:"Won",league:"NFL",match:"Bears vs Rams",type:"Total Points",market:"Under 48.5",price:1.91,wager:198,winnings:180,payout:378},
  {id:23,date:"2026-01-17",status:"Lost",league:"NFL",match:"Seahawks vs 49ers",type:"Spread",market:"49ers +17.5",price:1.83,wager:100,winnings:0,payout:0},
  {id:24,date:"2026-01-17",status:"Lost",league:"NFL",match:"Seahawks vs 49ers",type:"To Win",market:"49ers",price:10.0,wager:100,winnings:0,payout:0},
  {id:25,date:"2026-01-17",status:"Lost",league:"NFL",match:"Broncos vs Bills",type:"Spread",market:"Bills -4.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:26,date:"2026-01-17",status:"Lost",league:"NFL",match:"Broncos vs Bills, Broncos vs Bills, Broncos vs Bills, Broncos vs Bills,",type:"MULTIPLE",market:"MULTIPLE",price:13.03,wager:50,winnings:0,payout:0},
  {id:27,date:"2026-01-17",status:"Lost",league:"NFL",match:"Broncos vs Bills, Broncos vs Bills,",type:"MULTIPLE",market:"MULTIPLE",price:3.35,wager:50,winnings:0,payout:0},
  {id:28,date:"2026-01-17",status:"Lost",league:"NFL",match:"Seahawks vs 49ers",type:"To Win",market:"49ers",price:3.5,wager:100,winnings:0,payout:0},
  {id:29,date:"2026-01-17",status:"Lost",league:"NFL",match:"Seahawks vs 49ers",type:"To Win",market:"49ers",price:3.6,wager:10,winnings:0,payout:0,freeBet:true},
  {id:30,date:"2026-01-17",status:"Lost",league:"NFL",match:"Seahawks vs 49ers",type:"To Win",market:"49ers",price:3.6,wager:100,winnings:0,payout:0},
  {id:31,date:"2026-01-16",status:"Lost",league:"NHL",match:"Avalanche vs. Predators, Avalanche vs. Predators,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:20,winnings:0,payout:0},
  {id:32,date:"2026-01-16",status:"Won",league:"NBA",match:"76ers vs. Cavaliers",type:"Jaylon Tyson - Points",market:"Over 25.5",price:1.8,wager:20,winnings:16,payout:36},
  {id:33,date:"2026-01-16",status:"Lost",league:"NBA",match:"76ers vs. Cavaliers",type:"Donovan Mitchell - Points",market:"Over 23.5",price:1.95,wager:20,winnings:0,payout:0},
  {id:34,date:"2026-01-16",status:"Lost",league:"NCAA",match:"Dayton vs. Loyola Chicago",type:"Spread",market:"Loyola Chicago +16.5",price:1.91,wager:20,winnings:0,payout:0},
  {id:35,date:"2026-01-16",status:"Won",league:"NBA",match:"76ers vs. Cavaliers",type:"To Win",market:"Cavaliers",price:3.1,wager:20,winnings:42,payout:62},
  {id:36,date:"2026-01-12",status:"Lost",league:"NFL",match:"Steelers vs Texans",type:"Total Points",market:"Over 38",price:1.91,wager:200,winnings:0,payout:0},
  {id:37,date:"2026-01-11",status:"Lost",league:"NFL",match:"Eagles vs 49ers",type:"Total Points",market:"Over 44",price:1.91,wager:450,winnings:0,payout:0},
  {id:38,date:"2026-01-11",status:"Lost",league:"NFL",match:"Eagles vs 49ers",type:"Total Points",market:"Over 44",price:1.91,wager:1279,winnings:0,payout:0},
  {id:39,date:"2026-01-11",status:"Won",league:"NFL",match:"Jaguars vs Bills",type:"To Win",market:"Bills",price:2.05,wager:400,winnings:420,payout:820},
  {id:40,date:"2026-01-10",status:"Lost",league:"NFL",match:"Bears vs Packers",type:"Spread",market:"Packers -13.5",price:2.8,wager:200,winnings:0,payout:0},
  {id:41,date:"2026-01-10",status:"Lost",league:"NFL",match:"Bears vs Packers",type:"Total Points",market:"Under 46",price:1.91,wager:220,winnings:0,payout:0},
  {id:42,date:"2026-01-10",status:"Lost",league:"NFL",match:"Panthers vs Rams, Panthers vs Rams,",type:"MULTIPLE",market:"MULTIPLE",price:3.1,wager:400,winnings:0,payout:0},
  {id:43,date:"2026-01-09",status:"Won",league:"NCAA",match:"1 Indiana vs. 5 Oregon",type:"Spread",market:"1 Indiana -33.5",price:1.91,wager:70,winnings:63,payout:133},
  {id:44,date:"2026-01-09",status:"Won",league:"NCAA",match:"1 Indiana vs. 5 Oregon",type:"Spread",market:"1 Indiana -13.5",price:1.74,wager:50,winnings:37,payout:87},
  {id:45,date:"2026-01-09",status:"Lost",league:"NCAA",match:"1 Indiana vs. 5 Oregon",type:"Total Points",market:"Under 57.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:46,date:"2026-01-06",status:"Won",league:"NCAA",match:"Dayton vs. George Washington",type:"Spread",market:"Dayton -2.5",price:1.95,wager:676,winnings:644,payout:1320},
  {id:47,date:"2026-01-05",status:"Won",league:"NFL",match:"Jaguars vs Bills",type:"Spread",market:"Bills -1",price:1.91,wager:1000,winnings:909,payout:1909},
  {id:48,date:"2026-01-04",status:"Won",league:"NFL",match:"Steelers vs Ravens, Steelers vs Ravens, Steelers vs Ravens,",type:"MULTIPLE",market:"MULTIPLE",price:5.0,wager:50,winnings:225,payout:275},
  {id:49,date:"2026-01-04",status:"Won",league:"NFL",match:"Bears vs Lions",type:"To Win",market:"Lions",price:2.3,wager:400,winnings:520,payout:920},
  {id:50,date:"2026-01-04",status:"Won",league:"NFL",match:"Bears vs Lions",type:"To Win",market:"Lions",price:2.3,wager:20,winnings:6,payout:26,freeBet:true},
  {id:51,date:"2026-01-04",status:"Lost",league:"NFL",match:"Giants vs Cowboys",type:"Spread",market:"Cowboys -3",price:1.91,wager:380,winnings:0,payout:0},
  {id:52,date:"2026-01-04",status:"Lost",league:"NFL",match:"Giants vs Cowboys",type:"Spread",market:"Cowboys -3",price:1.91,wager:20,winnings:0,payout:0},
  {id:53,date:"2026-01-04",status:"Lost",league:"NFL",match:"Giants vs Cowboys",type:"Spread",market:"Cowboys -3",price:1.91,wager:10,winnings:0,payout:0,freeBet:true},
  {id:54,date:"2026-01-04",status:"Won",league:"NFL",match:"Bengals vs Browns",type:"Total Points",market:"Under 47",price:1.95,wager:463,winnings:441,payout:905},
  {id:55,date:"2026-01-03",status:"Lost",league:"NFL",match:"49ers vs Seahawks",type:"Spread",market:"49ers +2.5",price:2.5,wager:500,winnings:0,payout:0},
  {id:56,date:"2026-01-03",status:"Won",league:"NFL",match:"49ers vs Seahawks",type:"Total Points",market:"Under 48",price:1.91,wager:400,winnings:363,payout:763},
  {id:57,date:"2026-01-03",status:"Lost",league:"NFL",match:"49ers vs Seahawks",type:"Spread",market:"49ers +2.5",price:1.91,wager:150,winnings:0,payout:0},
  {id:58,date:"2026-01-03",status:"Lost",league:"NFL",match:"Buccaneers vs Panthers",type:"Total Points",market:"Over 43",price:1.87,wager:150,winnings:0,payout:0},
  {id:59,date:"2026-01-01",status:"Lost",league:"NCAA",match:"3 Georgia vs. 6 Ole Miss",type:"Spread",market:"3 Georgia -5.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:60,date:"2026-01-01",status:"Lost",league:"NCAA",match:"1 Indiana vs. 9 Alabama",type:"Total Points",market:"Over 46.5",price:1.91,wager:371,winnings:0,payout:0},
  {id:61,date:"2025-12-31",status:"Lost",league:"NCAA",match:"2 Ohio State vs. 10 Miami (FL)",type:"Spread",market:"2 Ohio State -7.5",price:1.95,wager:1000,winnings:0,payout:0},
  {id:62,date:"2025-12-31",status:"Lost",league:"NCAA",match:"2 Ohio State vs. 10 Miami (FL)",type:"Total Points",market:"Over 41",price:1.95,wager:1000,winnings:0,payout:0},
  {id:63,date:"2025-12-31",status:"Won",league:"NCAA",match:"4 Texas Tech vs. 5 Oregon",type:"Spread",market:"5 Oregon -2.5",price:1.95,wager:600,winnings:571,payout:1171},
  {id:64,date:"2025-12-29",status:"Lost",league:"NFL",match:"Falcons vs Rams",type:"Total Points",market:"Under 48.5",price:1.95,wager:400,winnings:0,payout:0},
  {id:65,date:"2025-12-29",status:"Lost",league:"NFL",match:"Falcons vs Rams",type:"Spread",market:"Rams -7",price:1.91,wager:771,winnings:0,payout:0},
  {id:66,date:"2025-12-28",status:"Won",league:"NFL",match:"49ers vs Bears",type:"Spread",market:"49ers -3.5",price:1.91,wager:700,winnings:636,payout:1336},
  {id:67,date:"2025-12-28",status:"Won",league:"NFL",match:"49ers vs Bears",type:"Spread",market:"49ers -3.5",price:1.95,wager:735,winnings:700,payout:1435},
  {id:68,date:"2025-12-28",status:"Lost",league:"NFL",match:"Bills vs Eagles",type:"Total Points",market:"Over 45",price:1.91,wager:400,winnings:0,payout:0},
  {id:69,date:"2025-12-28",status:"Won",league:"NFL",match:"Bengals vs Cardinals",type:"Spread",market:"Bengals -7",price:1.91,wager:75,winnings:68,payout:143},
  {id:70,date:"2025-12-28",status:"Won",league:"NFL",match:"Bengals vs Cardinals",type:"Spread",market:"Bengals -7",price:1.91,wager:7,winnings:6,payout:13},
  {id:71,date:"2025-12-28",status:"Won",league:"NFL",match:"Colts vs Jaguars",type:"Spread",market:"Jaguars -4",price:1.95,wager:750,winnings:714,payout:1464},
  {id:72,date:"2025-12-28",status:"Lost",league:"NFL",match:"Bengals vs Cardinals, Bengals vs Cardinals, Bengals vs Cardinals,",type:"MULTIPLE",market:"MULTIPLE",price:5.5,wager:250,winnings:0,payout:0},
  {id:73,date:"2025-12-28",status:"Won",league:"NFL",match:"Bengals vs Cardinals",type:"Spread",market:"Bengals -7",price:1.95,wager:500,winnings:476,payout:976},
  {id:74,date:"2025-12-27",status:"Lost",league:"NFL",match:"Bills vs Eagles",type:"Total Points",market:"Over 44",price:1.91,wager:600,winnings:0,payout:0},
  {id:75,date:"2025-12-27",status:"Lost",league:"NFL",match:"Dolphins vs Buccaneers",type:"Total Points",market:"Over 44",price:1.87,wager:400,winnings:0,payout:0},
  {id:76,date:"2025-12-27",status:"Lost",league:"NFL",match:"Browns vs Steelers",type:"Total Points",market:"Over 35",price:1.91,wager:581,winnings:0,payout:0},
  {id:77,date:"2025-12-27",status:"Cashed Out",league:"NFL",match:"Browns vs Steelers",type:"Total Points",market:"Over 34.5",price:1.87,wager:581,winnings:0,payout:581},
  {id:78,date:"2025-12-27",status:"Won",league:"NFL",match:"Packers vs Ravens",type:"To Win",market:"Ravens",price:2.05,wager:400,winnings:420,payout:820},
  {id:79,date:"2025-12-27",status:"Cashed Out",league:"NFL",match:"Packers vs Ravens",type:"Total Points",market:"Over 38",price:1.87,wager:550,winnings:0,payout:550},
  {id:80,date:"2025-12-27",status:"Won",league:"NFL",match:"Packers vs Ravens",type:"Total Points",market:"Over 38",price:1.91,wager:750,winnings:681,payout:1431},
  {id:81,date:"2025-12-27",status:"Lost",league:"NFL",match:"Chargers vs Texans, Chargers vs Texans,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:200,winnings:0,payout:0},
  {id:82,date:"2025-12-27",status:"Lost",league:"NFL",match:"Chargers vs Texans",type:"Total Points",market:"Over 40.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:83,date:"2025-12-27",status:"Lost",league:"NFL",match:"Chargers vs Texans",type:"Spread",market:"Chargers -1",price:1.87,wager:550,winnings:0,payout:0},
  {id:84,date:"2025-12-25",status:"Lost",league:"NFL",match:"Chiefs vs Broncos",type:"Total Points",market:"Over 39",price:1.95,wager:150,winnings:0,payout:0},
  {id:85,date:"2025-12-25",status:"Lost",league:"NFL",match:"Vikings vs Lions",type:"Spread",market:"Lions -7",price:1.91,wager:617,winnings:0,payout:0},
  {id:86,date:"2025-12-25",status:"Won",league:"NFL",match:"Commanders vs Cowboys",type:"Total Points",market:"Over 50.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:87,date:"2025-12-25",status:"Lost",league:"NFL",match:"Commanders vs Cowboys",type:"Spread",market:"Cowboys -8.5",price:1.91,wager:272,winnings:0,payout:0},
  {id:88,date:"2025-12-22",status:"Won",league:"NFL",match:"Colts vs 49ers",type:"Spread",market:"49ers -4",price:1.91,wager:650,winnings:590,payout:1240},
  {id:89,date:"2025-12-22",status:"Won",league:"NFL",match:"Colts vs 49ers",type:"Spread",market:"49ers -4.5",price:1.91,wager:750,winnings:681,payout:1431},
  {id:90,date:"2025-12-21",status:"Lost",league:"NFL",match:"Ravens vs Patriots",type:"Total Points",market:"Under 48.5",price:1.91,wager:457,winnings:0,payout:0},
  {id:91,date:"2025-12-21",status:"Won",league:"NFL",match:"Dolphins vs Bengals",type:"Spread",market:"Bengals -3.5",price:1.91,wager:600,winnings:545,payout:1145},
  {id:92,date:"2025-12-21",status:"Lost",league:"NFL",match:"Panthers vs Buccaneers",type:"Spread",market:"Buccaneers -2.5",price:1.83,wager:1000,winnings:0,payout:0},
  {id:93,date:"2025-12-21",status:"Won",league:"NFL",match:"Dolphins vs Bengals",type:"Spread",market:"Bengals -3.5",price:1.91,wager:1263,winnings:1148,payout:2412},
  {id:94,date:"2025-12-20",status:"Lost",league:"NFL",match:"Bears vs Packers",type:"Spread",market:"Packers -1.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:95,date:"2025-12-20",status:"Won",league:"NFL",match:"Commanders vs Eagles",type:"Spread",market:"Eagles -7.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:96,date:"2025-12-20",status:"Lost",league:"NFL",match:"Bears vs Packers",type:"To Win",market:"Packers",price:2.0,wager:1000,winnings:0,payout:0},
  {id:97,date:"2025-12-20",status:"Lost",league:"NCAA",match:"7 Texas A&M vs. 10 Miami (FL)",type:"Spread",market:"7 Texas A&M -3.5",price:2.15,wager:575,winnings:0,payout:0},
  {id:98,date:"2025-12-19",status:"Lost",league:"NCAA",match:"5 Oregon vs. 12 James Madison",type:"Spread",market:"5 Oregon -20.5",price:1.91,wager:776,winnings:0,payout:0},
  {id:99,date:"2025-12-19",status:"Won",league:"NCAA",match:"8 Oklahoma vs. 9 Alabama",type:"To Win",market:"9 Alabama",price:5.75,wager:100,winnings:475,payout:575},
  {id:100,date:"2025-12-18",status:"Won",league:"NFL",match:"Seahawks vs Rams, Seahawks vs Rams,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:607,winnings:1396,payout:2003},
  {id:101,date:"2025-12-18",status:"Won",league:"NFL",match:"Seahawks vs Rams",type:"Spread",market:"Rams +1.5",price:1.91,wager:238,winnings:216,payout:455},
  {id:102,date:"2025-12-18",status:"Cashed Out",league:"NFL",match:"Seahawks vs Rams, Seahawks vs Rams,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:425,winnings:0,payout:425},
  {id:103,date:"2025-12-16",status:"Won",league:"NCAA",match:"Dayton vs. Florida State",type:"Spread",market:"Dayton -7.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:104,date:"2025-12-16",status:"Lost",league:"NFL",match:"Seahawks vs Rams",type:"Spread",market:"Rams -1",price:1.95,wager:466,winnings:0,payout:0},
  {id:105,date:"2025-12-15",status:"Won",league:"NFL",match:"Steelers vs Dolphins",type:"Spread",market:"Steelers -3",price:1.87,wager:438,winnings:381,payout:820},
  {id:106,date:"2025-12-15",status:"Won",league:"NFL",match:"Steelers vs Dolphins",type:"Spread",market:"Steelers -3",price:1.87,wager:25,winnings:21,payout:46},
  {id:107,date:"2025-12-14",status:"Lost",league:"NFL",match:"Cowboys vs Vikings",type:"Spread",market:"Cowboys -5",price:1.91,wager:400,winnings:0,payout:0},
  {id:108,date:"2025-12-14",status:"Lost",league:"NFL",match:"Broncos vs Packers",type:"Spread",market:"Packers -1",price:1.87,wager:400,winnings:0,payout:0},
  {id:109,date:"2025-12-14",status:"Lost",league:"NFL",match:"Rams vs Lions",type:"Total Points",market:"Under 54.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:110,date:"2025-12-14",status:"Lost",league:"NFL",match:"Chiefs vs Chargers",type:"Spread",market:"Chiefs -4.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:111,date:"2025-12-14",status:"Lost",league:"NFL",match:"Giants vs Commanders",type:"Spread",market:"Commanders -8.5",price:1.91,wager:475,winnings:0,payout:0},
  {id:112,date:"2025-12-14",status:"Lost",league:"NFL",match:"Rams vs Lions",type:"Spread",market:"Lions +6",price:1.91,wager:125,winnings:0,payout:0},
  {id:113,date:"2025-12-14",status:"Won",league:"NFL",match:"Patriots vs Bills",type:"Spread",market:"Bills -2",price:1.91,wager:500,winnings:454,payout:954},
  {id:114,date:"2025-12-14",status:"Won",league:"NFL",match:"Bengals vs Ravens",type:"Total Points",market:"Under 51.5",price:1.91,wager:1000,winnings:909,payout:1909},
  {id:115,date:"2025-12-14",status:"Lost",league:"NFL",match:"Patriots vs Bills",type:"Total Points",market:"Under 49.5",price:1.91,wager:619,winnings:0,payout:0},
  {id:116,date:"2025-12-13",status:"Won",league:"NCAA",match:"NC State vs. #14 Kansas",type:"To Win",market:"#14 Kansas",price:1.59,wager:250,winnings:147,payout:397},
  {id:117,date:"2025-12-13",status:"Lost",league:"NFL",match:"NFL 25/26",type:"SB 60 - Winner",market:"Buffalo Bills",price:9.5,wager:1052,winnings:0,payout:0},
  {id:118,date:"2025-12-13",status:"Lost",league:"NCAA",match:"Navy vs. Army",type:"Total Points",market:"Over 38.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:119,date:"2025-12-08",status:"Lost",league:"NFL",match:"Chargers vs Eagles, Chargers vs Eagles,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:250,winnings:0,payout:0},
  {id:120,date:"2025-12-08",status:"Lost",league:"NFL",match:"Chargers vs Eagles",type:"Spread",market:"Eagles -1",price:1.91,wager:548,winnings:0,payout:0},
  {id:121,date:"2025-11-30",status:"Won",league:"NFL",match:"Steelers vs Bills",type:"Spread",market:"Bills -3",price:1.91,wager:250,winnings:227,payout:477},
  {id:122,date:"2025-11-30",status:"Lost",league:"NFL",match:"Dolphins vs Saints",type:"Total Points",market:"Over 41.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:123,date:"2025-11-30",status:"Lost",league:"NFL",match:"Dolphins vs Saints",type:"Spread",market:"Dolphins -5",price:1.91,wager:200,winnings:0,payout:0},
  {id:124,date:"2025-11-30",status:"Lost",league:"NFL",match:"Jets vs Falcons",type:"Spread",market:"Falcons -3",price:1.95,wager:200,winnings:0,payout:0},
  {id:125,date:"2025-11-30",status:"Lost",league:"NFL",match:"Buccaneers vs Cardinals",type:"Spread",market:"Buccaneers -3.5",price:1.95,wager:250,winnings:0,payout:0},
  {id:126,date:"2025-11-30",status:"Lost",league:"NFL",match:"Buccaneers vs Cardinals",type:"Total Points",market:"Over 44.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:127,date:"2025-11-30",status:"Won",league:"NFL",match:"Lions vs Cowboys",type:"Spread",market:"Lions -3",price:1.83,wager:800,winnings:666,payout:1466},
  {id:128,date:"2025-11-30",status:"Won",league:"NFL",match:"Steelers vs Bills",type:"Spread",market:"Bills -3",price:1.91,wager:500,winnings:454,payout:954},
  {id:129,date:"2025-11-30",status:"Lost",league:"NFL",match:"Buccaneers vs Cardinals",type:"Spread",market:"Buccaneers -3.5",price:1.95,wager:350,winnings:0,payout:0},
  {id:130,date:"2025-11-30",status:"Lost",league:"NFL",match:"Jets vs Falcons",type:"Spread",market:"Falcons -3",price:1.95,wager:400,winnings:0,payout:0},
  {id:131,date:"2025-11-30",status:"Lost",league:"NFL",match:"Jets vs Falcons",type:"Spread",market:"Falcons -3",price:1.95,wager:10,winnings:0,payout:0,freeBet:true},
  {id:132,date:"2025-11-30",status:"Lost",league:"NFL",match:"Dolphins vs Saints",type:"Total Points",market:"Over 41.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:133,date:"2025-11-30",status:"Lost",league:"NFL",match:"Buccaneers vs Cardinals",type:"Spread",market:"Buccaneers -3.5",price:1.95,wager:694,winnings:0,payout:0},
  {id:134,date:"2025-11-29",status:"Won",league:"NCAA",match:"Auburn vs. 9 Alabama",type:"Total Points",market:"Under 47.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:135,date:"2025-11-29",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. LSU",type:"Total Points",market:"Over 36.5",price:1.83,wager:125,winnings:0,payout:0},
  {id:136,date:"2025-11-29",status:"Won",league:"NCAA",match:"Michigan vs. 2 Ohio State",type:"Total Points",market:"Under 45.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:137,date:"2025-11-29",status:"Won",league:"NCAA",match:"Auburn vs. 9 Alabama",type:"Spread",market:"9 Alabama -5.5",price:1.91,wager:675,winnings:613,payout:1288},
  {id:138,date:"2025-11-29",status:"Won",league:"NCAA",match:"Pittsburgh vs. 10 Miami (FL)",type:"Spread",market:"10 Miami (FL) -6.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:139,date:"2025-11-29",status:"Won",league:"NCAA",match:"Pittsburgh vs. 10 Miami (FL)",type:"Total Points",market:"Under 48.5",price:1.95,wager:125,winnings:119,payout:244},
  {id:140,date:"2025-11-29",status:"Won",league:"NCAA",match:"Washington vs. 5 Oregon",type:"Spread",market:"5 Oregon -7.5",price:2.0,wager:325,winnings:325,payout:650},
  {id:141,date:"2025-11-29",status:"Lost",league:"NCAA",match:"Michigan vs. 2 Ohio State",type:"To Win",market:"Michigan",price:4.0,wager:75,winnings:0,payout:0},
  {id:142,date:"2025-11-29",status:"Won",league:"NCAA",match:"Washington vs. 5 Oregon",type:"Spread",market:"5 Oregon -7.5",price:2.0,wager:636,winnings:636,payout:1272},
  {id:143,date:"2025-11-28",status:"Lost",league:"NCAA",match:"Dayton vs. #19 BYU",type:"Total Points",market:"Under 150.5",price:1.95,wager:400,winnings:0,payout:0},
  {id:144,date:"2025-11-28",status:"Won",league:"NCAA",match:"Purdue vs. 1 Indiana",type:"Spread",market:"1 Indiana -28.5",price:1.91,wager:438,winnings:398,payout:836},
  {id:145,date:"2025-11-28",status:"Lost",league:"NCAA",match:"Texas vs. 7 Texas A&M",type:"Total Points",market:"Over 52.5",price:1.87,wager:500,winnings:0,payout:0},
  {id:146,date:"2025-11-28",status:"Lost",league:"NCAA",match:"Texas vs. 7 Texas A&M",type:"Total Points",market:"Over 52.5",price:1.87,wager:10,winnings:0,payout:0,freeBet:true},
  {id:147,date:"2025-11-28",status:"Won",league:"NFL",match:"Eagles vs Bears",type:"Total Points",market:"Under 42.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:148,date:"2025-11-28",status:"Lost",league:"NFL",match:"Eagles vs Bears",type:"Spread",market:"Eagles -7",price:1.91,wager:567,winnings:0,payout:0},
  {id:149,date:"2025-11-27",status:"Won",league:"NFL",match:"Ravens vs Bengals",type:"Total Points",market:"Under 53.5",price:1.91,wager:1000,winnings:909,payout:1909},
  {id:150,date:"2025-11-27",status:"Won",league:"NFL",match:"Ravens vs Bengals",type:"To Win",market:"Bengals",price:4.0,wager:250,winnings:750,payout:1000},
  {id:151,date:"2025-11-27",status:"Won",league:"NFL",match:"Cowboys vs Chiefs",type:"Total Points",market:"Under 63.5",price:1.83,wager:400,winnings:333,payout:733},
  {id:152,date:"2025-11-27",status:"Lost",league:"NFL",match:"Cowboys vs Chiefs",type:"Spread",market:"Chiefs -3",price:1.83,wager:128,winnings:0,payout:0},
  {id:153,date:"2025-11-27",status:"Lost",league:"NFL",match:"Cowboys vs Chiefs",type:"Spread",market:"Chiefs -3",price:1.83,wager:842,winnings:0,payout:0},
  {id:154,date:"2025-11-27",status:"Lost",league:"NFL",match:"Lions vs Packers, Cowboys vs Chiefs, Ravens vs Bengals,",type:"MULTIPLE",market:"MULTIPLE",price:14.32,wager:1000,winnings:0,payout:0},
  {id:155,date:"2025-11-27",status:"Cashed Out",league:"NFL",match:"Ravens vs Bengals",type:"To Win",market:"Bengals",price:4.0,wager:250,winnings:0,payout:250},
  {id:156,date:"2025-11-27",status:"Lost",league:"NFL",match:"Cowboys vs Chiefs",type:"Spread",market:"Chiefs -3",price:1.83,wager:654,winnings:0,payout:0},
  {id:157,date:"2025-11-27",status:"Lost",league:"NFL",match:"Lions vs Packers",type:"Spread",market:"Lions -3",price:2.0,wager:584,winnings:0,payout:0},
  {id:158,date:"2025-11-27",status:"Lost",league:"NFL",match:"Lions vs Packers, Lions vs Packers,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:200,winnings:0,payout:0},
  {id:159,date:"2025-11-24",status:"Won",league:"NFL",match:"49ers vs Panthers",type:"Spread",market:"49ers -7.5",price:1.87,wager:150,winnings:130,payout:280},
  {id:160,date:"2025-11-24",status:"Won",league:"NFL",match:"49ers vs Panthers",type:"Spread",market:"49ers -7.5",price:1.87,wager:350,winnings:304,payout:654},
  {id:161,date:"2025-11-24",status:"Won",league:"NFL",match:"49ers vs Panthers",type:"Total Points",market:"Under 50",price:1.91,wager:500,winnings:454,payout:954},
  {id:162,date:"2025-11-24",status:"Won",league:"NFL",match:"49ers vs Panthers",type:"Total Points",market:"Under 49.5",price:1.95,wager:714,winnings:680,payout:1394},
  {id:163,date:"2025-11-23",status:"Lost",league:"NFL",match:"Rams vs Buccaneers",type:"To Win",market:"Buccaneers",price:3.75,wager:100,winnings:0,payout:0},
  {id:164,date:"2025-11-23",status:"Lost",league:"NFL",match:"Rams vs Buccaneers",type:"To Win",market:"Buccaneers",price:3.75,wager:250,winnings:0,payout:0},
  {id:165,date:"2025-11-23",status:"Lost",league:"NFL",match:"Cowboys vs Eagles",type:"Spread",market:"Eagles -3",price:1.95,wager:600,winnings:0,payout:0},
  {id:166,date:"2025-11-23",status:"Lost",league:"NFL",match:"Cowboys vs Eagles",type:"Spread",market:"Eagles -3",price:1.95,wager:400,winnings:0,payout:0},
  {id:167,date:"2025-11-23",status:"Won",league:"NFL",match:"Packers vs Vikings",type:"Spread",market:"Packers -7.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:168,date:"2025-11-23",status:"Won",league:"NFL",match:"Bengals vs Patriots",type:"Total Points",market:"Under 48.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:169,date:"2025-11-23",status:"Lost",league:"NFL",match:"Bengals vs Patriots",type:"To Win",market:"Bengals",price:3.75,wager:100,winnings:0,payout:0},
  {id:170,date:"2025-11-23",status:"Lost",league:"NFL",match:"Raiders vs Browns",type:"Total Points",market:"Over 36",price:1.91,wager:200,winnings:0,payout:0},
  {id:171,date:"2025-11-23",status:"Lost",league:"NFL",match:"Cowboys vs Eagles",type:"Spread",market:"Eagles -3",price:1.95,wager:1000,winnings:0,payout:0},
  {id:172,date:"2025-11-23",status:"Lost",league:"NFL",match:"Chiefs vs Colts",type:"Spread",market:"Chiefs -3.5",price:1.95,wager:907,winnings:0,payout:0},
  {id:173,date:"2025-11-23",status:"Lost",league:"NFL",match:"Lions vs Giants",type:"Total Points",market:"Under 50.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:174,date:"2025-11-22",status:"Won",league:"NCAA",match:"Maryland vs. Michigan",type:"Spread",market:"Michigan -13.5",price:1.83,wager:200,winnings:166,payout:366},
  {id:175,date:"2025-11-22",status:"Won",league:"NCAA",match:"8 Oklahoma vs. Missouri",type:"Spread",market:"8 Oklahoma -5.5",price:1.87,wager:400,winnings:347,payout:747},
  {id:176,date:"2025-11-22",status:"Won",league:"NCAA",match:"2 Ohio State vs. Rutgers",type:"Spread",market:"2 Ohio State -28.5",price:1.91,wager:325,winnings:295,payout:620},
  {id:177,date:"2025-11-22",status:"Won",league:"NCAA",match:"5 Oregon vs. USC",type:"Spread",market:"5 Oregon -10.5",price:1.87,wager:400,winnings:347,payout:747},
  {id:178,date:"2025-11-20",status:"Lost",league:"NFL",match:"Texans vs Bills",type:"Spread",market:"Bills -5",price:1.91,wager:400,winnings:0,payout:0},
  {id:179,date:"2025-11-20",status:"Lost",league:"NHL",match:"Panthers vs. Devils",type:"Spread",market:"Panthers -1.5",price:2.75,wager:100,winnings:0,payout:0},
  {id:180,date:"2025-11-20",status:"Lost",league:"NFL",match:"Texans vs Bills",type:"Spread",market:"Bills -5",price:1.91,wager:707,winnings:0,payout:0},
  {id:181,date:"2025-11-17",status:"Won",league:"NFL",match:"Raiders vs Cowboys",type:"Spread",market:"Cowboys -3.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:182,date:"2025-11-17",status:"Lost",league:"NFL",match:"Raiders vs Cowboys",type:"Total Points",market:"Under 48",price:1.91,wager:200,winnings:0,payout:0},
  {id:183,date:"2025-11-17",status:"Won",league:"NFL",match:"Raiders vs Cowboys",type:"Spread",market:"Cowboys -3.5",price:2.0,wager:400,winnings:400,payout:800},
  {id:184,date:"2025-11-16",status:"Won",league:"NFL",match:"Raiders vs Cowboys",type:"Total Points",market:"Under 49.5",price:1.91,wager:222,winnings:202,payout:425},
  {id:185,date:"2025-11-16",status:"Won",league:"NFL",match:"Raiders vs Cowboys",type:"Total Points",market:"Under 49.5",price:1.91,wager:10,winnings:0,payout:9,freeBet:true},
  {id:186,date:"2025-11-16",status:"Won",league:"NFL",match:"Eagles vs Lions",type:"Spread",market:"Eagles -2.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:187,date:"2025-11-16",status:"Won",league:"NFL",match:"Eagles vs Lions",type:"Spread",market:"Eagles -2.5",price:1.87,wager:252,winnings:219,payout:471},
  {id:188,date:"2025-11-16",status:"Lost",league:"NFL",match:"Broncos vs Chiefs",type:"Spread",market:"Chiefs -4",price:1.91,wager:292,winnings:0,payout:0},
  {id:189,date:"2025-11-16",status:"Lost",league:"NFL",match:"Broncos vs Chiefs",type:"Spread",market:"Chiefs -4",price:1.91,wager:468,winnings:0,payout:0},
  {id:190,date:"2025-11-16",status:"Won",league:"NFL",match:"Rams vs Seahawks",type:"Total Points",market:"Under 48.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:191,date:"2025-11-16",status:"Won",league:"NFL",match:"Rams vs Seahawks",type:"Total Points",market:"Under 49.5",price:1.83,wager:200,winnings:166,payout:366},
  {id:192,date:"2025-11-16",status:"Won",league:"NFL",match:"Broncos vs Chiefs",type:"Total Points",market:"Under 45",price:1.91,wager:200,winnings:181,payout:381},
  {id:193,date:"2025-11-16",status:"Lost",league:"NFL",match:"Giants vs Packers",type:"Spread",market:"Packers -7.5",price:1.95,wager:438,winnings:0,payout:0},
  {id:194,date:"2025-11-16",status:"Won",league:"NFL",match:"Falcons vs Panthers",type:"Total Points",market:"Over 42",price:1.91,wager:350,winnings:318,payout:668},
  {id:195,date:"2025-11-16",status:"Won",league:"NFL",match:"Steelers vs Bengals",type:"Total Points",market:"Under 48.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:196,date:"2025-11-16",status:"Lost",league:"NFL",match:"Jaguars vs Chargers",type:"Spread",market:"Chargers -2.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:197,date:"2025-11-16",status:"Won",league:"NFL",match:"Eagles vs Lions",type:"Spread",market:"Eagles -2.5",price:1.87,wager:800,winnings:695,payout:1495},
  {id:198,date:"2025-11-16",status:"Won",league:"NFL",match:"Cardinals vs 49ers",type:"Spread",market:"49ers -3",price:1.83,wager:206,winnings:171,payout:377},
  {id:199,date:"2025-11-16",status:"Won",league:"NFL",match:"Bills vs Buccaneers",type:"Spread",market:"Bills -5.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:200,date:"2025-11-16",status:"Won",league:"NFL",match:"Dolphins vs Commanders",type:"Spread",market:"Dolphins -2.5",price:1.8,wager:400,winnings:320,payout:720},
  {id:201,date:"2025-11-16",status:"Won",league:"NFL",match:"Dolphins vs Commanders",type:"Total Points",market:"Under 47.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:202,date:"2025-11-16",status:"Won",league:"NFL",match:"Dolphins vs Commanders",type:"Total Points",market:"Under 47.5",price:1.91,wager:50,winnings:45,payout:95},
  {id:203,date:"2025-11-15",status:"Won",league:"NCAA",match:"3 Georgia vs. Texas",type:"Spread",market:"3 Georgia -3.5",price:1.83,wager:400,winnings:333,payout:733},
  {id:204,date:"2025-11-15",status:"Lost",league:"NCAA",match:"9 Alabama vs. 8 Oklahoma",type:"Total Points",market:"Over 45.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:205,date:"2025-11-15",status:"Lost",league:"NCAA",match:"9 Alabama vs. 8 Oklahoma",type:"Spread",market:"9 Alabama -6.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:206,date:"2025-11-15",status:"Won",league:"NCAA",match:"USC vs. Iowa",type:"Total Points",market:"Under 48.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:207,date:"2025-11-15",status:"Lost",league:"NCAA",match:"9 Alabama vs. 8 Oklahoma",type:"Total Points",market:"Over 45.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:208,date:"2025-11-15",status:"Won",league:"NCAA",match:"USC vs. Iowa",type:"Total Points",market:"Under 48.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:209,date:"2025-11-14",status:"Lost",league:"NCAA",match:"Northwestern vs. Michigan",type:"Spread",market:"Michigan -10.5",price:1.91,wager:400,winnings:0,payout:0},
  {id:210,date:"2025-11-13",status:"Won",league:"NFL",match:"Cardinals vs 49ers",type:"Spread",market:"49ers -3",price:1.95,wager:600,winnings:571,payout:1171},
  {id:211,date:"2025-11-13",status:"Won",league:"NFL",match:"Dolphins vs Commanders",type:"Total Points",market:"Under 47.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:212,date:"2025-11-13",status:"Lost",league:"NFL",match:"Patriots vs Jets",type:"Total Points",market:"Over 43",price:1.91,wager:180,winnings:0,payout:0},
  {id:213,date:"2025-11-13",status:"Lost",league:"NFL",match:"Patriots vs Jets",type:"Total Points",market:"Over 43",price:1.87,wager:400,winnings:0,payout:0},
  {id:214,date:"2025-11-12",status:"Won",league:"NFL",match:"Steelers vs Bengals",type:"Total Points",market:"Under 49",price:1.91,wager:420,winnings:381,payout:801},
  {id:215,date:"2025-11-11",status:"Lost",league:"NFL",match:"Broncos vs Chiefs",type:"Spread",market:"Chiefs -3.5",price:1.91,wager:626,winnings:0,payout:0},
  {id:216,date:"2025-11-10",status:"Won",league:"NFL",match:"Packers vs Eagles",type:"Spread",market:"Eagles -1",price:1.95,wager:306,winnings:292,payout:599},
  {id:217,date:"2025-11-09",status:"Won",league:"NFL",match:"Commanders vs Lions",type:"Spread",market:"Lions -20.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:218,date:"2025-11-09",status:"Won",league:"NFL",match:"Chargers vs Steelers",type:"Spread",market:"Chargers -3",price:1.87,wager:400,winnings:347,payout:747},
  {id:219,date:"2025-11-09",status:"Won",league:"NFL",match:"Packers vs Eagles",type:"To Win",market:"Eagles",price:2.0,wager:363,winnings:363,payout:727},
  {id:220,date:"2025-11-09",status:"Won",league:"NFL",match:"Commanders vs Lions",type:"Spread",market:"Lions -8",price:1.91,wager:600,winnings:545,payout:1145},
  {id:221,date:"2025-11-09",status:"Lost",league:"NFL",match:"49ers vs Rams",type:"Total Points",market:"Under 49.5",price:1.95,wager:335,winnings:0,payout:0},
  {id:222,date:"2025-11-09",status:"Lost",league:"NFL",match:"Dolphins vs Bills",type:"Spread",market:"Bills -8",price:1.91,wager:500,winnings:0,payout:0},
  {id:223,date:"2025-11-09",status:"Won",league:"NFL",match:"Packers vs Eagles",type:"To Win",market:"Eagles",price:2.0,wager:600,winnings:600,payout:1200},
  {id:224,date:"2025-11-09",status:"Lost",league:"NFL",match:"49ers vs Rams",type:"Total Points",market:"Under 49.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:225,date:"2025-11-09",status:"Won",league:"NFL",match:"Texans vs Jaguars",type:"Total Points",market:"Over 37",price:1.87,wager:350,winnings:304,payout:654},
  {id:226,date:"2025-11-09",status:"Lost",league:"NFL",match:"Panthers vs Saints",type:"Total Points",market:"Over 38",price:1.91,wager:350,winnings:0,payout:0},
  {id:227,date:"2025-11-09",status:"Won",league:"NFL",match:"Vikings vs Ravens",type:"Total Points",market:"Under 49",price:1.91,wager:400,winnings:363,payout:763},
  {id:228,date:"2025-11-09",status:"Won",league:"NFL",match:"Dolphins vs Bills",type:"Total Points",market:"Under 50",price:1.95,wager:400,winnings:380,payout:780},
  {id:229,date:"2025-11-09",status:"Lost",league:"NFL",match:"Buccaneers vs Patriots",type:"Spread",market:"Buccaneers -3",price:2.05,wager:500,winnings:0,payout:0},
  {id:230,date:"2025-11-09",status:"Lost",league:"NFL",match:"Colts vs Falcons",type:"Total Points",market:"Under 48",price:1.95,wager:410,winnings:0,payout:0},
  {id:231,date:"2025-11-08",status:"Won",league:"NCAA",match:"9 Alabama vs. LSU",type:"Spread",market:"9 Alabama -10.5",price:1.95,wager:400,winnings:380,payout:780},
  {id:232,date:"2025-11-08",status:"Lost",league:"NCAA",match:"#9 Notre Dame vs. Navy",type:"Spread",market:"Navy +30.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:233,date:"2025-11-07",status:"Lost",league:"NCAA",match:"#18 North Carolina vs. #14 Kansas",type:"Total Points",market:"Under 158.5",price:1.91,wager:50,winnings:0,payout:0,freeBet:true},
  {id:234,date:"2025-11-06",status:"Won",league:"NFL",match:"Broncos vs Raiders",type:"Total Points",market:"Under 42.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:235,date:"2025-11-02",status:"Won",league:"NFL",match:"Commanders vs Seahawks",type:"Spread",market:"Seahawks -2.5",price:1.87,wager:543,winnings:472,payout:1016},
  {id:236,date:"2025-11-02",status:"Won",league:"NFL",match:"Bills vs Chiefs",type:"Spread",market:"Bills -3.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:237,date:"2025-11-02",status:"Won",league:"NFL",match:"Bills vs Chiefs",type:"Spread",market:"Bills -3.5",price:1.87,wager:481,winnings:418,payout:900},
  {id:238,date:"2025-11-02",status:"Lost",league:"NFL",match:"Rams vs Saints",type:"Total Points",market:"Over 45.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:239,date:"2025-11-02",status:"Lost",league:"NFL",match:"Raiders vs Jaguars",type:"Spread",market:"Jaguars -1.5",price:1.91,wager:400,winnings:0,payout:0},
  {id:240,date:"2025-11-02",status:"Lost",league:"NFL",match:"Commanders vs Seahawks",type:"Total Points",market:"Under 48",price:1.95,wager:250,winnings:0,payout:0},
  {id:241,date:"2025-11-02",status:"Won",league:"NFL",match:"Bills vs Chiefs",type:"Total Points",market:"Under 53",price:1.91,wager:200,winnings:181,payout:381},
  {id:242,date:"2025-11-01",status:"Lost",league:"NFL",match:"Bengals vs Bears",type:"To Win",market:"Bengals",price:2.3,wager:250,winnings:0,payout:0},
  {id:243,date:"2025-11-01",status:"Won",league:"NFL",match:"Steelers vs Colts",type:"Total Points",market:"Under 51",price:1.91,wager:200,winnings:181,payout:381},
  {id:244,date:"2025-11-01",status:"Lost",league:"NFL",match:"Texans vs Broncos",type:"Total Points",market:"Over 40.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:245,date:"2025-11-01",status:"Lost",league:"MLB",match:"Blue Jays vs. Dodgers",type:"Spread",market:"Dodgers -1.5",price:2.15,wager:200,winnings:0,payout:0},
  {id:246,date:"2025-11-01",status:"Lost",league:"NCAA",match:"Florida vs. 3 Georgia",type:"Spread",market:"3 Georgia -7.5",price:1.95,wager:643,winnings:0,payout:0},
  {id:247,date:"2025-11-01",status:"Lost",league:"NCAA",match:"Maryland vs. 1 Indiana",type:"Total Points",market:"Under 50.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:248,date:"2025-11-01",status:"Won",league:"NCAA",match:"Texas vs. Vanderbilt",type:"Total Points",market:"Over 47.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:249,date:"2025-11-01",status:"Lost",league:"NCAA",match:"SMU vs. 10 Miami (FL)",type:"Spread",market:"10 Miami (FL) -9.5",price:1.83,wager:400,winnings:0,payout:0},
  {id:250,date:"2025-11-01",status:"Won",league:"NCAA",match:"2 Ohio State vs. Penn State",type:"Spread",market:"2 Ohio State -17.5",price:1.87,wager:1000,winnings:869,payout:1869},
  {id:251,date:"2025-10-31",status:"Lost",league:"MLB",match:"Blue Jays vs. Dodgers",type:"Total Runs",market:"Over 7.5",price:2.05,wager:434,winnings:0,payout:0},
  {id:252,date:"2025-10-30",status:"Won",league:"NFL",match:"Dolphins vs Ravens",type:"Total Points",market:"Under 52",price:1.87,wager:500,winnings:434,payout:934},
  {id:253,date:"2025-10-29",status:"Lost",league:"MLB",match:"Dodgers vs. Blue Jays",type:"Spread",market:"Dodgers -1.5",price:2.0,wager:300,winnings:0,payout:0},
  {id:254,date:"2025-10-29",status:"Lost",league:"MLB",match:"Dodgers vs. Blue Jays",type:"Spread",market:"Dodgers -1.5",price:1.95,wager:429,winnings:0,payout:0},
  {id:255,date:"2025-10-27",status:"Won",league:"NFL",match:"Chiefs vs Commanders",type:"Spread",market:"Chiefs -10.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:256,date:"2025-10-27",status:"Won",league:"NFL",match:"Chiefs vs Commanders",type:"Total Points",market:"Under 48",price:1.91,wager:300,winnings:272,payout:572},
  {id:257,date:"2025-10-27",status:"Lost",league:"MLB",match:"Dodgers vs. Blue Jays",type:"Spread",market:"Dodgers -1.5",price:2.0,wager:250,winnings:0,payout:0},
  {id:258,date:"2025-10-27",status:"Won",league:"NFL",match:"Chiefs vs Commanders",type:"Spread",market:"Chiefs -10.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:259,date:"2025-10-27",status:"Won",league:"NFL",match:"Chiefs vs Commanders",type:"Total Points",market:"Under 48",price:1.91,wager:610,winnings:555,payout:1166},
  {id:260,date:"2025-10-26",status:"Won",league:"NFL",match:"Steelers vs Packers",type:"Spread",market:"Packers -2.5",price:1.87,wager:380,winnings:330,payout:710},
  {id:261,date:"2025-10-26",status:"Lost",league:"NFL",match:"Steelers vs Packers",type:"Total Points",market:"Under 46",price:1.91,wager:350,winnings:0,payout:0},
  {id:262,date:"2025-10-26",status:"Cashed Out",league:"NFL",match:"Steelers vs Packers",type:"Total Points",market:"Over 46",price:1.91,wager:366,winnings:0,payout:366},
  {id:263,date:"2025-10-26",status:"Lost",league:"NFL",match:"Bengals vs Jets",type:"Spread",market:"Bengals -11.5",price:1.87,wager:400,winnings:0,payout:0},
  {id:264,date:"2025-10-26",status:"Lost",league:"NFL",match:"Broncos vs Cowboys",type:"To Win",market:"Cowboys",price:2.55,wager:250,winnings:0,payout:0},
  {id:265,date:"2025-10-26",status:"Won",league:"NFL",match:"Saints vs Buccaneers",type:"Spread",market:"Buccaneers -3.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:266,date:"2025-10-26",status:"Won",league:"NFL",match:"Panthers vs Bills",type:"Spread",market:"Bills -7",price:1.87,wager:500,winnings:434,payout:934},
  {id:267,date:"2025-10-26",status:"Won",league:"NFL",match:"Bengals vs Jets",type:"Total Points",market:"Over 44.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:268,date:"2025-10-26",status:"Won",league:"NFL",match:"Eagles vs Giants, Eagles vs Giants,",type:"MULTIPLE",market:"MULTIPLE",price:3.0,wager:400,winnings:800,payout:1200},
  {id:269,date:"2025-10-26",status:"Lost",league:"NFL",match:"Texans vs 49ers",type:"Spread",market:"49ers +2",price:1.91,wager:401,winnings:0,payout:0},
  {id:270,date:"2025-10-25",status:"Won",league:"MLB",match:"Blue Jays vs. Dodgers",type:"Spread",market:"Dodgers -1.5",price:2.25,wager:300,winnings:375,payout:675},
  {id:271,date:"2025-10-25",status:"Lost",league:"NCAA",match:"Michigan State vs. Michigan",type:"Total Points",market:"Under 47.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:272,date:"2025-10-21",status:"Won",league:"NFL",match:"Chargers vs Vikings",type:"Spread",market:"Chargers -3",price:1.95,wager:832,winnings:793,payout:1626},
  {id:273,date:"2025-10-20",status:"Lost",league:"NFL",match:"Lions vs Buccaneers",type:"Total Points",market:"Over 54",price:1.91,wager:200,winnings:0,payout:0},
  {id:274,date:"2025-10-20",status:"Lost",league:"NFL",match:"Lions vs Buccaneers",type:"To Win",market:"Buccaneers",price:3.25,wager:100,winnings:0,payout:0},
  {id:275,date:"2025-10-19",status:"Won",league:"NFL",match:"49ers vs Falcons",type:"Spread",market:"49ers -1",price:1.95,wager:538,winnings:512,payout:1051},
  {id:276,date:"2025-10-19",status:"Won",league:"NFL",match:"49ers vs Falcons",type:"Spread",market:"49ers -1",price:1.95,wager:400,winnings:380,payout:780},
  {id:277,date:"2025-10-19",status:"Won",league:"NFL",match:"Cowboys vs Commanders",type:"Total Points",market:"Under 71.5",price:1.83,wager:436,winnings:363,payout:800},
  {id:278,date:"2025-10-19",status:"Won",league:"NFL",match:"Broncos vs Giants",type:"Total Points",market:"Over 40.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:279,date:"2025-10-19",status:"Lost",league:"NFL",match:"Chargers vs Colts, Chargers vs Colts,",type:"MULTIPLE",market:"MULTIPLE",price:3.5,wager:200,winnings:0,payout:0},
  {id:280,date:"2025-10-19",status:"Won",league:"NFL",match:"Vikings vs Eagles",type:"Spread",market:"Eagles -2",price:1.91,wager:200,winnings:181,payout:381},
  {id:281,date:"2025-10-19",status:"Won",league:"NFL",match:"Vikings vs Eagles",type:"Spread",market:"Eagles -2",price:1.91,wager:425,winnings:387,payout:812},
  {id:282,date:"2025-10-19",status:"Lost",league:"NFL",match:"Browns vs Dolphins",type:"To Win",market:"Dolphins",price:2.25,wager:100,winnings:0,payout:0},
  {id:283,date:"2025-10-19",status:"Won",league:"NFL",match:"Jaguars vs Rams",type:"Total Points",market:"Under 44.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:284,date:"2025-10-18",status:"Won",league:"NFL",match:"Vikings vs Eagles",type:"Spread",market:"Eagles -1.5",price:1.87,wager:550,winnings:478,payout:1028},
  {id:285,date:"2025-10-18",status:"Lost",league:"NCAA",match:"9 Alabama vs. Tennessee",type:"Total Points",market:"Under 54.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:286,date:"2025-10-18",status:"Won",league:"NCAA",match:"Rutgers vs. 5 Oregon",type:"Spread",market:"5 Oregon -19.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:287,date:"2025-10-18",status:"Lost",league:"NCAA",match:"Arizona State vs. 4 Texas Tech",type:"Spread",market:"4 Texas Tech -5.5",price:1.91,wager:400,winnings:0,payout:0},
  {id:288,date:"2025-10-18",status:"Won",league:"NCAA",match:"1 Indiana vs. Michigan State",type:"Spread",market:"Michigan State +26.5",price:1.95,wager:125,winnings:119,payout:244},
  {id:289,date:"2025-10-18",status:"Won",league:"NCAA",match:"Wisconsin vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -25.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:290,date:"2025-10-18",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. USC",type:"Total Points",market:"Under 60.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:291,date:"2025-10-18",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. USC",type:"Total Points",market:"Under 60.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:292,date:"2025-10-18",status:"Won",league:"NCAA",match:"Rutgers vs. 5 Oregon",type:"Spread",market:"5 Oregon -17.5",price:1.87,wager:500,winnings:434,payout:934},
  {id:293,date:"2025-10-18",status:"Lost",league:"NCAA",match:"South Carolina vs. 8 Oklahoma, South Carolina vs. 8 Oklahoma,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:300,winnings:0,payout:0},
  {id:294,date:"2025-10-18",status:"Won",league:"NCAA",match:"Michigan vs. Washington",type:"Spread",market:"Michigan -3.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:295,date:"2025-10-18",status:"Lost",league:"NCAA",match:"Vanderbilt vs. LSU",type:"To Win",market:"LSU",price:2.0,wager:408,winnings:0,payout:0},
  {id:296,date:"2025-10-16",status:"Lost",league:"NFL",match:"Bengals vs Steelers",type:"Spread",market:"Steelers -9.5",price:1.77,wager:300,winnings:0,payout:0},
  {id:297,date:"2025-10-16",status:"Won",league:"NFL",match:"Bengals vs Steelers",type:"To Win",market:"Bengals",price:4.75,wager:50,winnings:187,payout:237},
  {id:298,date:"2025-10-16",status:"Won",league:"NFL",match:"Bengals vs Steelers",type:"To Win",market:"Bengals",price:2.7,wager:200,winnings:340,payout:540},
  {id:299,date:"2025-10-16",status:"Lost",league:"NFL",match:"Bengals vs Steelers",type:"Total Points",market:"Under 44.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:300,date:"2025-10-15",status:"Lost",league:"NHL",match:"Red Wings vs. Panthers",type:"Spread",market:"Panthers -1.5",price:2.6,wager:200,winnings:0,payout:0},
  {id:301,date:"2025-10-13",status:"Won",league:"NFL",match:"Commanders vs Bears",type:"Total Points",market:"Under 50.5",price:1.87,wager:500,winnings:434,payout:934},
  {id:302,date:"2025-10-13",status:"Won",league:"NFL",match:"Falcons vs Bills",type:"Total Points",market:"Under 58.5",price:1.8,wager:200,winnings:160,payout:360},
  {id:303,date:"2025-10-13",status:"Lost",league:"NFL",match:"Falcons vs Bills",type:"Spread",market:"Bills -3.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:304,date:"2025-10-13",status:"Lost",league:"NFL",match:"Falcons vs Bills",type:"Spread",market:"Bills -3.5",price:1.87,wager:300,winnings:0,payout:0},
  {id:305,date:"2025-10-13",status:"Won",league:"NFL",match:"Commanders vs Bears",type:"Total Points",market:"Under 49.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:306,date:"2025-10-13",status:"Won",league:"NFL",match:"Falcons vs Bills",type:"Total Points",market:"Under 58.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:307,date:"2025-10-13",status:"Lost",league:"NFL",match:"Falcons vs Bills",type:"Spread",market:"Bills -3.5",price:2.15,wager:400,winnings:0,payout:0},
  {id:308,date:"2025-10-13",status:"Lost",league:"NFL",match:"Falcons vs Bills",type:"Spread",market:"Bills -3.5",price:1.87,wager:409,winnings:0,payout:0},
  {id:309,date:"2025-10-12",status:"Won",league:"NFL",match:"Chiefs vs Lions",type:"Spread",market:"Chiefs -2.5",price:1.87,wager:427,winnings:371,payout:799},
  {id:310,date:"2025-10-12",status:"Lost",league:"NFL",match:"Chiefs vs Lions",type:"Total Points",market:"Over 51.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:311,date:"2025-10-12",status:"Won",league:"NFL",match:"Chiefs vs Lions",type:"Spread",market:"Chiefs -2.5",price:1.87,wager:447,winnings:389,payout:837},
  {id:312,date:"2025-10-12",status:"Lost",league:"NFL",match:"Chiefs vs Lions",type:"Total Points",market:"Over 51.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:313,date:"2025-10-12",status:"Won",league:"NFL",match:"Chiefs vs Lions",type:"Spread",market:"Chiefs -2.5",price:1.91,wager:38,winnings:34,payout:73},
  {id:314,date:"2025-10-12",status:"Won",league:"NFL",match:"Packers vs Bengals",type:"Spread",market:"Bengals +14",price:1.95,wager:125,winnings:119,payout:244},
  {id:315,date:"2025-10-12",status:"Won",league:"NFL",match:"Buccaneers vs 49ers",type:"Total Points",market:"Over 46.5",price:1.87,wager:400,winnings:347,payout:747},
  {id:316,date:"2025-10-12",status:"Won",league:"NFL",match:"Buccaneers vs 49ers",type:"Total Points",market:"Over 46.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:317,date:"2025-10-12",status:"Lost",league:"NFL",match:"Jaguars vs Seahawks",type:"Spread",market:"Jaguars +1",price:1.91,wager:200,winnings:0,payout:0},
  {id:318,date:"2025-10-12",status:"Lost",league:"NFL",match:"Panthers vs Cowboys",type:"Spread",market:"Cowboys -3",price:1.95,wager:300,winnings:0,payout:0},
  {id:319,date:"2025-10-12",status:"Lost",league:"NFL",match:"Jaguars vs Seahawks",type:"Spread",market:"Jaguars +1",price:1.91,wager:200,winnings:0,payout:0},
  {id:320,date:"2025-10-12",status:"Lost",league:"NFL",match:"Panthers vs Cowboys",type:"Spread",market:"Cowboys -3",price:1.95,wager:400,winnings:0,payout:0},
  {id:321,date:"2025-10-12",status:"Won",league:"NFL",match:"Packers vs Bengals",type:"Total Points",market:"Over 44.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:322,date:"2025-10-12",status:"Lost",league:"NFL",match:"Dolphins vs Chargers",type:"Spread",market:"Chargers -3.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:323,date:"2025-10-12",status:"Lost",league:"NFL",match:"Jets vs Broncos",type:"Spread",market:"Broncos -4.5",price:1.91,wager:150,winnings:0,payout:0},
  {id:324,date:"2025-10-11",status:"Lost",league:"NCAA",match:"Auburn vs. 3 Georgia, Auburn vs. 3 Georgia,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:125,winnings:0,payout:0},
  {id:325,date:"2025-10-11",status:"Lost",league:"NCAA",match:"Texas vs. 8 Oklahoma",type:"To Win",market:"8 Oklahoma",price:2.05,wager:150,winnings:0,payout:0},
  {id:326,date:"2025-10-11",status:"Won",league:"NCAA",match:"Auburn vs. 3 Georgia",type:"Spread",market:"3 Georgia -3.5",price:1.87,wager:400,winnings:347,payout:747},
  {id:327,date:"2025-10-11",status:"Lost",league:"NCAA",match:"5 Oregon vs. 1 Indiana",type:"Spread",market:"5 Oregon -7.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:328,date:"2025-10-11",status:"Won",league:"NCAA",match:"Illinois vs. 2 Ohio State",type:"Total Points",market:"Over 47.5",price:2.05,wager:100,winnings:105,payout:205},
  {id:329,date:"2025-10-11",status:"Won",league:"NCAA",match:"Illinois vs. 2 Ohio State",type:"Total Points",market:"Over 47.5",price:2.05,wager:10,winnings:0,payout:10,freeBet:true},
  {id:330,date:"2025-10-11",status:"Lost",league:"NCAA",match:"5 Oregon vs. 1 Indiana",type:"Spread",market:"5 Oregon -7.5",price:2.0,wager:200,winnings:0,payout:0},
  {id:331,date:"2025-10-10",status:"Lost",league:"NCAA",match:"USC vs. Michigan",type:"To Win",market:"Michigan",price:2.15,wager:150,winnings:0,payout:0},
  {id:332,date:"2025-10-09",status:"Lost",league:"NFL",match:"Giants vs Eagles",type:"Spread",market:"Eagles -7.5",price:1.95,wager:625,winnings:0,payout:0},
  {id:333,date:"2025-10-07",status:"Lost",league:"NHL",match:"Rangers vs. Penguins",type:"Spread",market:"Rangers -1.5",price:2.05,wager:125,winnings:0,payout:0},
  {id:334,date:"2025-10-07",status:"Lost",league:"NHL",match:"Kings vs. Avalanche",type:"Spread",market:"Kings -1.5",price:3.1,wager:125,winnings:0,payout:0},
  {id:335,date:"2025-10-07",status:"Lost",league:"NHL",match:"Panthers vs. Blackhawks",type:"Spread",market:"Panthers -1.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:336,date:"2025-10-06",status:"Lost",league:"NFL",match:"Jaguars vs Chiefs",type:"Spread",market:"Chiefs -3.5",price:1.95,wager:791,winnings:0,payout:0},
  {id:337,date:"2025-09-22",status:"Lost",league:"NFL",match:"Ravens vs Lions",type:"Spread",market:"Ravens -4.5",price:1.91,wager:400,winnings:0,payout:0},
  {id:338,date:"2025-09-22",status:"Lost",league:"NFL",match:"Ravens vs Lions",type:"Total Points",market:"Under 53.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:339,date:"2025-09-21",status:"Won",league:"NFL",match:"Giants vs Chiefs",type:"Spread",market:"Chiefs -6",price:1.91,wager:150,winnings:136,payout:286},
  {id:340,date:"2025-09-21",status:"Won",league:"NFL",match:"Giants vs Chiefs",type:"Spread",market:"Chiefs -5.5",price:1.87,wager:850,winnings:739,payout:1589},
  {id:341,date:"2025-09-21",status:"Lost",league:"NFL",match:"49ers vs Cardinals",type:"Spread",market:"49ers -1.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:342,date:"2025-09-21",status:"Cashed Out",league:"NFL",match:"49ers vs Cardinals",type:"Spread",market:"49ers -1.5",price:1.91,wager:500,winnings:0,payout:500},
  {id:343,date:"2025-09-21",status:"Won",league:"NFL",match:"Seahawks vs Saints",type:"Total Points",market:"Over 40.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:344,date:"2025-09-21",status:"Lost",league:"NFL",match:"Chargers vs Broncos",type:"Spread",market:"Chargers -3.5",price:2.15,wager:350,winnings:0,payout:0},
  {id:345,date:"2025-09-21",status:"Won",league:"NFL",match:"Eagles vs Rams",type:"Spread",market:"Eagles -3.5",price:1.95,wager:500,winnings:476,payout:976},
  {id:346,date:"2025-09-20",status:"Won",league:"NCAA",match:"Nebraska vs. Michigan",type:"Spread",market:"Michigan -1.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:347,date:"2025-09-20",status:"Won",league:"NCAA",match:"Utah vs. 4 Texas Tech",type:"Spread",market:"4 Texas Tech -5.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:348,date:"2025-09-18",status:"Lost",league:"NFL",match:"Bills vs Dolphins",type:"Spread",market:"Bills -11.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:349,date:"2025-09-18",status:"Lost",league:"NFL",match:"Bills vs Dolphins",type:"Total Points",market:"Under 50.5",price:1.91,wager:750,winnings:0,payout:0},
  {id:350,date:"2025-09-15",status:"Won",league:"NFL",match:"Raiders vs Chargers",type:"Spread",market:"Chargers -3.5",price:1.95,wager:300,winnings:285,payout:585},
  {id:351,date:"2025-09-15",status:"Won",league:"NFL",match:"Raiders vs Chargers",type:"Total Points",market:"Under 46.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:352,date:"2025-09-15",status:"Won",league:"NFL",match:"Raiders vs Chargers",type:"Total Points",market:"Under 46.5",price:1.95,wager:400,winnings:380,payout:780},
  {id:353,date:"2025-09-15",status:"Won",league:"NFL",match:"Texans vs Buccaneers",type:"To Win",market:"Buccaneers",price:2.2,wager:250,winnings:300,payout:550},
  {id:354,date:"2025-09-15",status:"Lost",league:"NFL",match:"Texans vs Buccaneers",type:"Total Points",market:"Over 42",price:1.91,wager:250,winnings:0,payout:0},
  {id:355,date:"2025-09-12",status:"Won",league:"NFL",match:"Colts vs Broncos",type:"Total Points",market:"Over 43",price:1.87,wager:200,winnings:173,payout:373},
  {id:356,date:"2025-09-12",status:"Won",league:"NFL",match:"Jets vs Bills",type:"Spread",market:"Bills -6",price:1.91,wager:400,winnings:363,payout:763},
  {id:357,date:"2025-09-12",status:"Lost",league:"NFL",match:"Dolphins vs Patriots",type:"Spread",market:"Dolphins -2",price:1.91,wager:200,winnings:0,payout:0},
  {id:358,date:"2025-09-12",status:"Won",league:"NFL",match:"Saints vs 49ers",type:"Spread",market:"49ers -3.5",price:2.05,wager:750,winnings:787,payout:1537},
  {id:359,date:"2025-09-12",status:"Won",league:"NFL",match:"Bengals vs Jaguars",type:"Spread",market:"Bengals -3.5",price:2.0,wager:500,winnings:500,payout:1000},
  {id:360,date:"2025-09-11",status:"Won",league:"NFL",match:"Packers vs Commanders",type:"Spread",market:"Packers -3",price:1.87,wager:250,winnings:217,payout:467},
  {id:361,date:"2025-09-11",status:"Won",league:"NFL",match:"Packers vs Commanders",type:"Total Points",market:"Under 48.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:362,date:"2025-09-08",status:"Lost",league:"NFL",match:"Bears vs Vikings",type:"Total Points",market:"Under 43.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:363,date:"2025-09-07",status:"Won",league:"NFL",match:"Bills vs Ravens",type:"To Win",market:"Bills",price:2.0,wager:232,winnings:232,payout:465},
  {id:364,date:"2025-09-07",status:"Won",league:"NFL",match:"Bills vs Ravens",type:"To Win",market:"Bills",price:2.05,wager:300,winnings:315,payout:615},
  {id:365,date:"2025-09-07",status:"Won",league:"NFL",match:"Packers vs Lions",type:"Total Points",market:"Under 47",price:1.8,wager:125,winnings:100,payout:225},
  {id:366,date:"2025-09-07",status:"Won",league:"NFL",match:"Seahawks vs 49ers",type:"Spread",market:"49ers -2",price:1.87,wager:313,winnings:272,payout:586},
  {id:367,date:"2025-09-07",status:"Lost",league:"NFL",match:"Browns vs Bengals",type:"Spread",market:"Bengals -4.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:368,date:"2025-09-07",status:"Lost",league:"NFL",match:"Colts vs Dolphins",type:"Spread",market:"Dolphins +1",price:1.91,wager:300,winnings:0,payout:0},
  {id:369,date:"2025-09-07",status:"Won",league:"NFL",match:"Falcons vs Buccaneers",type:"Spread",market:"Buccaneers -1",price:1.95,wager:300,winnings:285,payout:585},
  {id:370,date:"2025-09-07",status:"Won",league:"NFL",match:"Jets vs Steelers",type:"Total Points",market:"Over 37.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:371,date:"2025-09-07",status:"Won",league:"NFL",match:"Jaguars vs Panthers",type:"Spread",market:"Jaguars -4",price:1.87,wager:300,winnings:260,payout:560},
  {id:372,date:"2025-09-07",status:"Lost",league:"NFL",match:"Browns vs Bengals, Browns vs Bengals,",type:"MULTIPLE",market:"MULTIPLE",price:3.5,wager:300,winnings:0,payout:0},
  {id:373,date:"2025-09-06",status:"Lost",league:"NCAA",match:"Michigan State vs. Boston College",type:"Spread",market:"Michigan State -2.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:374,date:"2025-09-06",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. Michigan",type:"Total Points",market:"Over 43.5",price:1.87,wager:259,winnings:0,payout:0},
  {id:375,date:"2025-09-06",status:"Lost",league:"NCAA",match:"2 Ohio State vs. Grambling",type:"Total Points",market:"Under 62.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:376,date:"2025-09-06",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. Michigan",type:"Total Points",market:"Over 43.5",price:1.87,wager:300,winnings:0,payout:0},
  {id:377,date:"2025-09-06",status:"Lost",league:"NCAA",match:"LSU vs. Louisiana Tech",type:"Spread",market:"LSU -36.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:378,date:"2025-09-06",status:"Lost",league:"NCAA",match:"Kentucky vs. 6 Ole Miss",type:"To Win",market:"Kentucky",price:3.6,wager:150,winnings:0,payout:0},
  {id:379,date:"2025-09-06",status:"Won",league:"NCAA",match:"Duke vs. Illinois",type:"Spread",market:"Illinois -2.5",price:1.91,wager:175,winnings:159,payout:334},
  {id:380,date:"2025-09-06",status:"Lost",league:"NCAA",match:"Texas vs. San Jose State",type:"Spread",market:"Texas -36.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:381,date:"2025-09-05",status:"Lost",league:"NFL",match:"Chargers vs Chiefs",type:"Total Points",market:"Under 47.5",price:1.91,wager:110,winnings:0,payout:0},
  {id:382,date:"2025-09-05",status:"Lost",league:"NFL",match:"Chargers vs Chiefs",type:"Total Points",market:"Under 47.5",price:1.91,wager:15,winnings:0,payout:0},
  {id:383,date:"2025-09-05",status:"Lost",league:"NFL",match:"Chargers vs Chiefs",type:"Spread",market:"Chiefs -3",price:1.91,wager:225,winnings:0,payout:0},
  {id:384,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"SB 60 - Winner",market:"Cincinnati Bengals",price:23.5,wager:50,winnings:0,payout:0},
  {id:385,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"NFC West - Division Winner (reg. season)",market:"San Francisco 49ers",price:2.55,wager:125,winnings:0,payout:0},
  {id:386,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"AFC West - Division Winner (reg. season)",market:"Kansas City Chiefs",price:1.87,wager:500,winnings:0,payout:0},
  {id:387,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"Regular Season Wins - Kansas City Chiefs",market:"Over 11.5",price:2.1,wager:125,winnings:0,payout:0},
  {id:388,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"Regular Season Wins - Pittsburgh Steelers",market:"Under 8.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:389,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"Regular Season Wins - Denver Broncos",market:"Under 9.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:390,date:"2025-09-02",status:"Lost",league:"NFL",match:"NFL 25/26",type:"Regular Season Wins - Cincinnati Bengals",market:"Over 9.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:391,date:"2025-09-02",status:"Lost",league:"NFL",match:"Chargers vs Chiefs",type:"Spread",market:"Chiefs -3",price:1.87,wager:425,winnings:0,payout:0},
  {id:392,date:"2025-09-02",status:"Lost",league:"NFL",match:"Eagles vs Cowboys",type:"Spread",market:"Eagles -8",price:1.91,wager:200,winnings:0,payout:0},
  {id:393,date:"2025-09-01",status:"Lost",league:"NCAA",match:"North Carolina vs. TCU",type:"Total Points",market:"Under 54.5",price:1.95,wager:259,winnings:0,payout:0},
  {id:394,date:"2025-08-31",status:"Won",league:"NCAA",match:"10 Miami (FL) vs. #9 Notre Dame",type:"Total Points",market:"Under 51.5",price:1.87,wager:245,winnings:213,payout:459},
  {id:395,date:"2025-08-31",status:"Lost",league:"NCAA",match:"10 Miami (FL) vs. #9 Notre Dame",type:"Total Points",market:"Under 50.5",price:1.95,wager:200,winnings:0,payout:0},
  {id:396,date:"2025-08-31",status:"Won",league:"MLB",match:"Reds vs. Cardinals",type:"Spread",market:"Reds -1.5",price:2.3,wager:100,winnings:130,payout:230},
  {id:397,date:"2025-08-30",status:"Lost",league:"NCAA",match:"Michigan vs. New Mexico",type:"Spread",market:"Michigan -28.5",price:1.95,wager:364,winnings:0,payout:0},
  {id:398,date:"2025-08-30",status:"Won",league:"NCAA",match:"Clemson vs. LSU",type:"Total Points",market:"Under 55.5",price:1.87,wager:275,winnings:239,payout:515},
  {id:399,date:"2025-08-30",status:"Won",league:"NCAA",match:"2 Ohio State vs. Texas",type:"Spread",market:"2 Ohio State -1.5",price:1.95,wager:399,winnings:380,payout:779},
  {id:400,date:"2025-08-30",status:"Won",league:"NCAA",match:"Tennessee vs. Syracuse",type:"Spread",market:"Tennessee -13.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:401,date:"2025-08-30",status:"Lost",league:"NCAA",match:"2 Ohio State vs. Texas",type:"Total Points",market:"Over 46.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:402,date:"2025-08-29",status:"Lost",league:"NCAA",match:"Michigan State vs. Western Michigan",type:"Spread",market:"Michigan State -30.5",price:2.1,wager:125,winnings:0,payout:0},
  {id:403,date:"2025-08-28",status:"Lost",league:"NCAA",match:"Cincinnati vs. Nebraska",type:"Spread",market:"Nebraska -4.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:404,date:"2025-08-28",status:"Lost",league:"NCAA",match:"Minnesota vs. Buffalo",type:"Spread",market:"Minnesota -14.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:405,date:"2025-08-28",status:"Won",league:"NCAA",match:"Wisconsin vs. Miami (OH)",type:"Spread",market:"Wisconsin -16.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:406,date:"2025-07-30",status:"Won",league:"NFL",match:"Lions vs Chargers",type:"Total Points",market:"Over 32.5",price:1.87,wager:219,winnings:190,payout:410},
  {id:407,date:"2025-07-24",status:"Won",league:"MLB",match:"Cardinals vs. Padres",type:"Spread",market:"Cardinals -1.5",price:2.3,wager:15,winnings:19,payout:34},
  {id:408,date:"2025-06-21",status:"Lost",league:"NBA",match:"Thunder vs. Pacers",type:"To Win",market:"Pacers",price:3.25,wager:344,winnings:0,payout:0},
  {id:409,date:"2025-06-19",status:"Won",league:"NBA",match:"Pacers vs. Thunder",type:"Spread",market:"Pacers -12.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:410,date:"2025-06-17",status:"Won",league:"NHL",match:"Panthers vs. Oilers",type:"Spread",market:"Panthers -1.5",price:2.4,wager:576,winnings:807,payout:1383},
  {id:411,date:"2025-06-16",status:"Lost",league:"NBA",match:"Thunder vs. Pacers",type:"Spread",market:"Thunder -12.5",price:2.0,wager:125,winnings:0,payout:0},
  {id:412,date:"2025-06-16",status:"Won",league:"NBA",match:"Thunder vs. Pacers",type:"Spread",market:"Thunder -7.5",price:1.95,wager:125,winnings:119,payout:244},
  {id:413,date:"2025-06-16",status:"Lost",league:"NBA",match:"Thunder vs. Pacers",type:"To Win",market:"Pacers",price:4.0,wager:250,winnings:0,payout:0},
  {id:414,date:"2025-06-16",status:"Lost",league:"NBA",match:"Thunder vs. Pacers",type:"Total Points",market:"Under 224",price:1.91,wager:300,winnings:0,payout:0},
  {id:415,date:"2025-06-15",status:"Lost",league:"Golf",match:"U.S. Open",type:"Winner",market:"V. Hovland",price:61.0,wager:18,winnings:0,payout:0},
  {id:416,date:"2025-06-14",status:"Won",league:"NHL",match:"Oilers vs. Panthers",type:"Total Goals",market:"Over 6.5",price:3.0,wager:35,winnings:70,payout:105},
  {id:417,date:"2025-06-13",status:"Lost",league:"NBA",match:"Pacers vs. Thunder",type:"Total Points",market:"Over 227.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:418,date:"2025-06-12",status:"Lost",league:"NBA",match:"Pacers vs. Thunder",type:"Total Points",market:"Over 225.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:419,date:"2025-06-12",status:"Lost",league:"Golf",match:"US Open 2025",type:"Winner",market:"Rory McIlroy",price:26.0,wager:40,winnings:0,payout:0},
  {id:420,date:"2025-06-09",status:"Won",league:"NBA",match:"Pacers vs. Thunder",type:"Total Points",market:"Under 228",price:1.91,wager:350,winnings:318,payout:668},
  {id:421,date:"2025-06-09",status:"Won",league:"NHL",match:"Panthers vs. Oilers",type:"Spread",market:"Panthers -1.5",price:2.5,wager:440,winnings:661,payout:1102},
  {id:422,date:"2025-06-08",status:"Won",league:"NBA",match:"Thunder vs. Pacers",type:"Total Points",market:"Over 228.5",price:1.91,wager:375,winnings:340,payout:715},
  {id:423,date:"2025-05-31",status:"Won",league:"NBA",match:"Pacers vs. Knicks",type:"Spread",market:"Pacers -5.5",price:2.0,wager:400,winnings:400,payout:800},
  {id:424,date:"2025-05-30",status:"Lost",league:"NHL",match:"Oilers vs. Panthers",type:"To Win",market:"Panthers",price:2.0,wager:127,winnings:0,payout:0},
  {id:425,date:"2025-05-28",status:"Won",league:"NHL",match:"Hurricanes vs. Panthers",type:"To Win",market:"Panthers",price:4.25,wager:75,winnings:243,payout:318},
  {id:426,date:"2025-05-28",status:"Lost",league:"NBA",match:"Thunder vs. Timberwolves",type:"Spread",market:"Timberwolves +18.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:427,date:"2025-05-28",status:"Won",league:"NBA",match:"Thunder vs. Timberwolves",type:"Total Points",market:"Over 199.5",price:1.87,wager:125,winnings:108,payout:233},
  {id:428,date:"2025-05-27",status:"Won",league:"NBA",match:"Pacers vs. Knicks",type:"Spread",market:"Pacers -6.5",price:2.0,wager:300,winnings:300,payout:600},
  {id:429,date:"2025-05-26",status:"Lost",league:"NHL",match:"Panthers vs. Hurricanes, Panthers vs. Hurricanes,",type:"MULTIPLE",market:"MULTIPLE",price:3.5,wager:300,winnings:0,payout:0},
  {id:430,date:"2025-05-26",status:"Lost",league:"NBA",match:"Timberwolves vs. Thunder",type:"Spread",market:"Thunder -3.5",price:1.91,wager:342,winnings:0,payout:0},
  {id:431,date:"2025-05-25",status:"Lost",league:"NBA",match:"Pacers vs. Knicks",type:"Spread",market:"Pacers -5.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:432,date:"2025-05-24",status:"Won",league:"NHL",match:"Panthers vs. Hurricanes",type:"Spread",market:"Panthers -1.5",price:2.6,wager:200,winnings:320,payout:520},
  {id:433,date:"2025-05-24",status:"Won",league:"NHL",match:"Panthers vs. Hurricanes",type:"Total Goals",market:"Over 5.5",price:2.05,wager:382,winnings:401,payout:784},
  {id:434,date:"2025-05-24",status:"Won",league:"NBA",match:"Timberwolves vs. Thunder",type:"Total Points",market:"Over 217.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:435,date:"2025-05-23",status:"Won",league:"NBA",match:"Knicks vs. Pacers",type:"To Win",market:"Pacers",price:2.9,wager:155,winnings:294,payout:449},
  {id:436,date:"2025-05-22",status:"Won",league:"NHL",match:"Hurricanes vs. Panthers",type:"Spread",market:"Panthers -1.5",price:2.6,wager:200,winnings:320,payout:520},
  {id:437,date:"2025-05-22",status:"Won",league:"NBA",match:"Thunder vs. Timberwolves",type:"Total Points",market:"Over 216.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:438,date:"2025-05-18",status:"Lost",league:"NBA",match:"Thunder vs. Nuggets",type:"To Win",market:"Nuggets",price:3.5,wager:200,winnings:0,payout:0},
  {id:439,date:"2025-05-16",status:"Lost",league:"NHL",match:"Panthers vs. Maple Leafs",type:"Spread",market:"Panthers -1.5",price:2.15,wager:125,winnings:0,payout:0},
  {id:440,date:"2025-05-12",status:"Won",league:"NBA",match:"Knicks vs. Celtics",type:"Total Points",market:"Over 208.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:441,date:"2025-05-12",status:"Lost",league:"NBA",match:"Thunder vs. Nuggets",type:"To Win",market:"Nuggets",price:4.75,wager:125,winnings:0,payout:0},
  {id:442,date:"2025-05-12",status:"Won",league:"NHL",match:"Maple Leafs vs. Panthers",type:"Spread",market:"Panthers -1.5",price:2.75,wager:125,winnings:218,payout:343},
  {id:443,date:"2025-05-12",status:"Won",league:"NHL",match:"Stars vs. Jets",type:"Spread",market:"Stars -1.5",price:2.6,wager:125,winnings:200,payout:325},
  {id:444,date:"2025-05-12",status:"Won",league:"NBA",match:"Knicks vs. Celtics",type:"Total Points",market:"Over 208.5",price:1.91,wager:312,winnings:284,payout:597},
  {id:445,date:"2025-05-11",status:"Won",league:"NHL",match:"Panthers vs. Maple Leafs",type:"Spread",market:"Panthers -1.5",price:2.3,wager:353,winnings:459,payout:812},
  {id:446,date:"2025-05-11",status:"Lost",league:"NBA",match:"Nuggets vs. Thunder",type:"To Win",market:"Nuggets",price:2.75,wager:200,winnings:0,payout:0},
  {id:447,date:"2025-05-11",status:"Lost",league:"NBA",match:"Pacers vs. Cavaliers",type:"Total Points",market:"Under 231",price:1.91,wager:300,winnings:0,payout:0},
  {id:448,date:"2025-05-11",status:"Lost",league:"NBA",match:"Nuggets vs. Thunder",type:"To Win",market:"Nuggets",price:3.0,wager:100,winnings:0,payout:0},
  {id:449,date:"2025-05-11",status:"Lost",league:"Other",match:"Battle of the Bets 5/11",type:"Overs",market:"Florida Panthers vs Toronto Maple Leafs: Each team to score 4 goals or more (Incl. OT)",price:7.0,wager:10,winnings:0,payout:0},
  {id:450,date:"2025-05-10",status:"Won",league:"NBA",match:"Warriors vs. Timberwolves",type:"Spread",market:"Timberwolves +2.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:451,date:"2025-05-09",status:"Lost",league:"NHL",match:"Panthers vs. Maple Leafs",type:"Total Goals",market:"Under 8.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:452,date:"2025-05-09",status:"Won",league:"NBA",match:"Pacers vs. Cavaliers",type:"Total Points",market:"Under 232",price:1.91,wager:367,winnings:334,payout:702},
  {id:453,date:"2025-05-08",status:"Lost",league:"NHL",match:"Golden Knights vs. Oilers",type:"Total Goals",market:"Under 6.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:454,date:"2025-05-08",status:"Won",league:"NBA",match:"Timberwolves vs. Warriors",type:"Total Points",market:"Over 201.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:455,date:"2025-05-07",status:"Lost",league:"NHL",match:"Jets vs. Stars",type:"Spread",market:"Stars -1.5",price:3.0,wager:250,winnings:0,payout:0},
  {id:456,date:"2025-05-07",status:"Won",league:"NHL",match:"Maple Leafs vs. Panthers",type:"Total Goals",market:"Under 7.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:457,date:"2025-05-07",status:"Lost",league:"NBA",match:"Celtics vs. Knicks",type:"Spread",market:"Celtics -11.5",price:1.87,wager:350,winnings:0,payout:0},
  {id:458,date:"2025-05-07",status:"Lost",league:"NBA",match:"Thunder vs. Nuggets",type:"Total Points",market:"Under 230",price:1.91,wager:100,winnings:0,payout:0},
  {id:459,date:"2025-05-06",status:"Lost",league:"NHL",match:"Golden Knights vs. Oilers",type:"Spread",market:"Golden Knights -1.5",price:2.4,wager:150,winnings:0,payout:0},
  {id:460,date:"2025-05-06",status:"Won",league:"NBA",match:"Timberwolves vs. Warriors",type:"Total Points",market:"Under 211.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:461,date:"2025-05-06",status:"Lost",league:"Other",match:"Battle of the Bets May 6th",type:"Overs",market:"Golden State Warriors vs Minnesota Timberwolves: Each team to score 109 or more points (Incl. OT)",price:8.0,wager:50,winnings:0,payout:0},
  {id:462,date:"2025-05-06",status:"Lost",league:"NHL",match:"Capitals vs. Hurricanes",type:"To Win",market:"Capitals",price:2.15,wager:250,winnings:0,payout:0},
  {id:463,date:"2025-05-06",status:"Lost",league:"NBA",match:"Cavaliers vs. Pacers",type:"Spread",market:"Cavaliers -8.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:464,date:"2025-05-05",status:"Won",league:"NBA",match:"Thunder vs. Nuggets",type:"To Win",market:"Nuggets",price:4.5,wager:24,winnings:84,payout:108},
  {id:465,date:"2025-05-05",status:"Won",league:"NBA",match:"Thunder vs. Nuggets",type:"To Win",market:"Nuggets",price:4.5,wager:100,winnings:350,payout:450},
  {id:466,date:"2025-05-05",status:"Lost",league:"NBA",match:"Celtics vs. Knicks",type:"Spread",market:"Celtics -8.5",price:1.95,wager:126,winnings:0,payout:0},
  {id:467,date:"2025-05-05",status:"Won",league:"NHL",match:"Maple Leafs vs. Panthers",type:"Total Goals",market:"Over 5.5",price:1.87,wager:350,winnings:304,payout:654},
  {id:468,date:"2025-05-05",status:"Lost",league:"NHL",match:"Maple Leafs vs. Panthers",type:"Spread",market:"Panthers -1.5",price:3.0,wager:150,winnings:0,payout:0},
  {id:469,date:"2025-05-05",status:"Lost",league:"NBA",match:"Celtics vs. Knicks",type:"Spread",market:"Celtics -8.5",price:1.87,wager:327,winnings:0,payout:0},
  {id:470,date:"2025-05-04",status:"Won",league:"NBA",match:"Rockets vs. Warriors",type:"Spread",market:"Warriors +0.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:471,date:"2025-05-04",status:"Lost",league:"NBA",match:"Cavaliers vs. Pacers",type:"Spread",market:"Cavaliers -8.5",price:1.91,wager:371,winnings:0,payout:0},
  {id:472,date:"2025-05-04",status:"Lost",league:"Formula 1",match:"Race",type:"Winner",market:"Max Verstappen",price:2.1,wager:50,winnings:0,payout:0},
  {id:473,date:"2025-05-04",status:"Lost",league:"NBA",match:"Cavaliers vs. Pacers",type:"Spread",market:"Cavaliers -8.5",price:1.87,wager:126,winnings:0,payout:0},
  {id:474,date:"2025-05-04",status:"Won",league:"Formula 1",match:"Race",type:"Winner",market:"Oscar Piastri",price:5.5,wager:75,winnings:337,payout:446},
  {id:475,date:"2025-05-03",status:"Won",league:"NBA",match:"Nuggets vs. Clippers",type:"Spread",market:"Nuggets -1.5",price:1.91,wager:511,winnings:464,payout:976},
  {id:476,date:"2025-05-03",status:"Lost",league:"Formula 1",match:"Sprint",type:"Winner",market:"Max Verstappen",price:5.25,wager:75,winnings:0,payout:0},
  {id:477,date:"2025-05-02",status:"Lost",league:"NBA",match:"Warriors vs. Rockets, Warriors vs. Rockets,",type:"MULTIPLE",market:"MULTIPLE",price:3.25,wager:30,winnings:0,payout:0},
  {id:478,date:"2025-05-02",status:"Won",league:"NHL",match:"Blues vs. Jets",type:"Spread",market:"Blues -1.5",price:3.0,wager:75,winnings:150,payout:225},
  {id:479,date:"2025-05-02",status:"Lost",league:"NBA",match:"Warriors vs. Rockets",type:"Spread",market:"Warriors -5.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:480,date:"2025-05-01",status:"Lost",league:"NHL",match:"Avalanche vs. Stars",type:"Spread",market:"Stars +2.5",price:2.15,wager:125,winnings:0,payout:0},
  {id:481,date:"2025-05-01",status:"Lost",league:"NHL",match:"Oilers vs. Kings",type:"To Win",market:"Kings",price:2.5,wager:125,winnings:0,payout:0},
  {id:482,date:"2025-05-01",status:"Lost",league:"NBA",match:"Clippers vs. Nuggets",type:"To Win",market:"Nuggets",price:2.5,wager:300,winnings:0,payout:0},
  {id:483,date:"2025-04-29",status:"Lost",league:"NHL",match:"Kings vs. Oilers",type:"Spread",market:"Kings -1.5",price:3.4,wager:100,winnings:0,payout:0},
  {id:484,date:"2025-04-29",status:"Won",league:"NBA",match:"Nuggets vs. Clippers",type:"Spread",market:"Nuggets -5.5",price:2.0,wager:500,winnings:500,payout:1000},
  {id:485,date:"2025-04-28",status:"Lost",league:"NBA",match:"Heat vs. Cavaliers",type:"Total Points",market:"Under 214.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:486,date:"2025-04-28",status:"Lost",league:"NBA",match:"Warriors vs. Rockets",type:"Spread",market:"Warriors -4",price:1.91,wager:100,winnings:0,payout:0},
  {id:487,date:"2025-04-25",status:"Won",league:"NHL",match:"Blues vs. Jets",type:"To Win",market:"Blues",price:2.0,wager:50,winnings:50,payout:100},
  {id:488,date:"2025-04-25",status:"Won",league:"NHL",match:"Avalanche vs. Stars",type:"Spread",market:"Avalanche -1.5",price:2.3,wager:100,winnings:130,payout:230},
  {id:489,date:"2025-04-25",status:"Lost",league:"NHL",match:"Wild vs. Golden Knights",type:"Spread",market:"Golden Knights -1.5",price:2.6,wager:30,winnings:0,payout:0},
  {id:490,date:"2025-04-25",status:"Lost",league:"NHL",match:"Panthers vs. Lightning",type:"Spread",market:"Panthers -1.5",price:2.75,wager:150,winnings:0,payout:0},
  {id:491,date:"2025-04-25",status:"Lost",league:"NHL",match:"Oilers vs. Kings",type:"To Win",market:"Kings",price:2.25,wager:50,winnings:0,payout:0},
  {id:492,date:"2025-04-25",status:"Lost",league:"NBA",match:"Pistons vs. Knicks",type:"Total Points",market:"Over 217",price:1.91,wager:125,winnings:0,payout:0},
  {id:493,date:"2025-04-25",status:"Won",league:"NBA",match:"Clippers vs. Nuggets",type:"To Win",market:"Nuggets",price:2.9,wager:345,winnings:655,payout:1000},
  {id:494,date:"2025-04-25",status:"Lost",league:"NBA",match:"Timberwolves vs. Lakers",type:"To Win",market:"Lakers",price:2.35,wager:300,winnings:0,payout:0},
  {id:495,date:"2025-04-25",status:"Lost",league:"NBA",match:"Warriors vs. Rockets",type:"Total Points",market:"Over 203.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:496,date:"2025-04-25",status:"Won",league:"NBA",match:"Bucks vs. Pacers",type:"Spread",market:"Bucks -5",price:1.87,wager:300,winnings:260,payout:560},
  {id:497,date:"2025-04-25",status:"Lost",league:"NBA",match:"Magic vs. Celtics",type:"Spread",market:"Celtics -3.5",price:1.91,wager:430,winnings:0,payout:0},
  {id:498,date:"2025-04-23",status:"Lost",league:"NBA",match:"Rockets vs. Warriors",type:"To Win",market:"Warriors",price:2.5,wager:125,winnings:0,payout:0},
  {id:499,date:"2025-04-23",status:"Lost",league:"NBA",match:"Celtics vs. Magic",type:"Spread",market:"Celtics -9.5",price:1.95,wager:125,winnings:0,payout:0},
  {id:500,date:"2025-04-23",status:"Won",league:"NHL",match:"Kings vs. Oilers",type:"To Win",market:"Kings",price:1.8,wager:125,winnings:100,payout:225},
  {id:501,date:"2025-04-23",status:"Won",league:"NHL",match:"Avalanche vs. Stars",type:"To Win",market:"Stars",price:2.6,wager:100,winnings:160,payout:260},
  {id:502,date:"2025-04-23",status:"Lost",league:"NBA",match:"Rockets vs. Warriors",type:"To Win",market:"Warriors",price:2.4,wager:250,winnings:0,payout:0},
  {id:503,date:"2025-04-23",status:"Lost",league:"NBA",match:"Cavaliers vs. Heat",type:"To Win",market:"Heat",price:5.25,wager:71,winnings:0,payout:0},
  {id:504,date:"2025-04-22",status:"Won",league:"NBA",match:"Lakers vs. Timberwolves",type:"Spread",market:"Lakers -6",price:1.95,wager:533,winnings:508,payout:1041},
  {id:505,date:"2025-04-22",status:"Lost",league:"NBA",match:"Pacers vs. Bucks",type:"To Win",market:"Bucks",price:2.45,wager:300,winnings:0,payout:0},
  {id:506,date:"2025-04-21",status:"Lost",league:"NBA",match:"Nuggets vs. Clippers",type:"To Win",market:"Nuggets",price:1.91,wager:175,winnings:0,payout:0},
  {id:507,date:"2025-04-21",status:"Won",league:"NBA",match:"Knicks vs. Pistons",type:"Spread",market:"Pistons -3.5",price:1.87,wager:125,winnings:108,payout:233},
  {id:508,date:"2025-04-21",status:"Lost",league:"NBA",match:"Nuggets vs. Clippers",type:"To Win",market:"Nuggets",price:1.91,wager:370,winnings:0,payout:0},
  {id:509,date:"2025-04-14",status:"Lost",league:"NBA",match:"NBA 24/25",type:"NBA Champion",market:"Los Angeles Lakers",price:15.0,wager:100,winnings:0,payout:0},
  {id:510,date:"2025-04-13",status:"Lost",league:"Golf",match:"Masters Tournament",type:"Winner",market:"S. Scheffler",price:41.0,wager:20,winnings:0,payout:0},
  {id:511,date:"2025-04-13",status:"Lost",league:"Other",match:"Battle of the Bets April 13th",type:"PGA",market:"Rory McIlroy to Win and Shane Lowry to Finish in Top 5 (inc. Ties)",price:4.75,wager:30,winnings:0,payout:0},
  {id:512,date:"2025-04-12",status:"Lost",league:"Golf",match:"Masters Tournament",type:"Winner",market:"B. Dechambeau",price:4.75,wager:150,winnings:0,payout:0},
  {id:513,date:"2025-04-12",status:"Lost",league:"Golf",match:"Masters Tournament",type:"Winner",market:"B. Dechambeau",price:4.75,wager:25,winnings:0,payout:0,freeBet:true},
  {id:514,date:"2025-04-10",status:"Lost",league:"Golf",match:"Masters Tournament",type:"End Of Round 1 Leader",market:"M. Homa",price:101.0,wager:26,winnings:0,payout:0},
  {id:515,date:"2025-04-10",status:"Lost",league:"Golf",match:"Masters Tournament",type:"Winner",market:"B. Koepka",price:31.0,wager:100,winnings:0,payout:0},
  {id:516,date:"2025-04-07",status:"Lost",league:"NCAA",match:"#5 Houston vs. #7 Florida",type:"Spread",market:"#5 Houston -3.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:517,date:"2025-04-07",status:"Lost",league:"NCAA",match:"#5 Houston vs. #7 Florida",type:"Spread",market:"#5 Houston -4.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:518,date:"2025-04-07",status:"Lost",league:"NCAA",match:"#5 Houston vs. #7 Florida",type:"Total Points",market:"Over 140.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:519,date:"2025-04-06",status:"Lost",league:"NCAA",match:"#3 South Carolina (W) vs. #1 UConn (W)",type:"Total Points",market:"Under 137.5",price:1.83,wager:125,winnings:0,payout:0},
  {id:520,date:"2025-04-06",status:"Lost",league:"NCAA",match:"#3 South Carolina (W) vs. #1 UConn (W)",type:"Total Points",market:"Under 137.5",price:1.83,wager:15,winnings:0,payout:0},
  {id:521,date:"2025-04-05",status:"Won",league:"NCAA",match:"#1 Duke vs. #5 Houston",type:"Total Points",market:"Under 141.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:522,date:"2025-04-05",status:"Lost",league:"NCAA",match:"Auburn vs. #7 Florida",type:"Total Points",market:"Over 159.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:523,date:"2025-04-05",status:"Lost",league:"NCAA",match:"#1 Duke vs. #5 Houston",type:"Spread",market:"#1 Duke -5",price:1.87,wager:960,winnings:0,payout:0},
  {id:524,date:"2025-03-30",status:"Won",league:"NCAA",match:"Auburn vs. #13 Michigan State",type:"Total Points",market:"Under 148.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:525,date:"2025-03-30",status:"Lost",league:"NCAA",match:"#5 Houston vs. #22 Tennessee",type:"Total Points",market:"Over 125",price:1.87,wager:310,winnings:0,payout:0},
  {id:526,date:"2025-03-29",status:"Lost",league:"NCAA",match:"#1 Duke vs. #17 Alabama",type:"Total Points",market:"Over 183.5",price:1.87,wager:50,winnings:0,payout:0,freeBet:true},
  {id:527,date:"2025-03-29",status:"Won",league:"NCAA",match:"#1 Duke vs. #17 Alabama",type:"Spread",market:"#1 Duke -8.5",price:1.95,wager:500,winnings:476,payout:976},
  {id:528,date:"2025-03-29",status:"Won",league:"NCAA",match:"#1 Duke vs. #17 Alabama",type:"Spread",market:"#1 Duke -7",price:1.87,wager:500,winnings:434,payout:934},
  {id:529,date:"2025-03-29",status:"Lost",league:"NCAA",match:"#7 Florida vs. #16 Texas Tech",type:"Spread",market:"#7 Florida -7",price:1.91,wager:561,winnings:0,payout:0},
  {id:530,date:"2025-03-28",status:"Won",league:"NCAA",match:"Auburn vs. #3 Michigan",type:"Spread",market:"Auburn -6.5",price:1.91,wager:50,winnings:-4,payout:45,freeBet:true},
  {id:531,date:"2025-03-28",status:"Lost",league:"NCAA",match:"#5 Houston vs. #8 Purdue",type:"Spread",market:"#5 Houston -7.5",price:1.87,wager:500,winnings:0,payout:0},
  {id:532,date:"2025-03-28",status:"Won",league:"NCAA",match:"Auburn vs. #3 Michigan",type:"Total Points",market:"Under 155",price:1.91,wager:150,winnings:136,payout:286},
  {id:533,date:"2025-03-28",status:"Lost",league:"NCAA",match:"#22 Tennessee vs. Kentucky",type:"Total Points",market:"Under 141.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:534,date:"2025-03-28",status:"Lost",league:"NCAA",match:"#13 Michigan State vs. Ole Miss",type:"Spread",market:"#13 Michigan State -4",price:1.91,wager:300,winnings:0,payout:0},
  {id:535,date:"2025-03-27",status:"Lost",league:"NCAA",match:"#1 Duke vs. #2 Arizona",type:"Spread",market:"#1 Duke -9",price:1.87,wager:500,winnings:0,payout:0},
  {id:536,date:"2025-03-27",status:"Won",league:"NCAA",match:"#17 Alabama vs. #19 BYU",type:"Spread",market:"#17 Alabama -17.5",price:2.0,wager:125,winnings:125,payout:250},
  {id:537,date:"2025-03-27",status:"Won",league:"NCAA",match:"#7 Florida vs. Maryland",type:"Spread",market:"#7 Florida -9.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:538,date:"2025-03-27",status:"Lost",league:"NCAA",match:"#17 Alabama vs. #19 BYU",type:"Total Points",market:"Under 175",price:1.91,wager:500,winnings:0,payout:0},
  {id:539,date:"2025-03-27",status:"Cashed Out",league:"NCAA",match:"#17 Alabama vs. #19 BYU",type:"Total Points",market:"Under 175",price:1.91,wager:250,winnings:0,payout:250},
  {id:540,date:"2025-03-23",status:"Lost",league:"NCAA",match:"Maryland vs. Colorado State",type:"Spread",market:"Maryland -2.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:541,date:"2025-03-23",status:"Push",league:"NCAA",match:"#2 Arizona vs. Oregon",type:"Spread",market:"#2 Arizona -4",price:1.0,wager:125,winnings:0,payout:125},
  {id:542,date:"2025-03-23",status:"Won",league:"NCAA",match:"#13 Michigan State vs. New Mexico",type:"Total Points",market:"Under 148.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:543,date:"2025-03-23",status:"Won",league:"NCAA",match:"#2 Arizona vs. Oregon",type:"Total Points",market:"Over 151.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:544,date:"2025-03-23",status:"Won",league:"NCAA",match:"#17 Alabama vs. Saint Mary's",type:"Spread",market:"#17 Alabama -10.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:545,date:"2025-03-23",status:"Won",league:"NCAA",match:"#17 Alabama vs. Saint Mary's",type:"Total Points",market:"Under 146.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:546,date:"2025-03-23",status:"Won",league:"NCAA",match:"Kentucky vs. #10 Illinois",type:"Total Points",market:"Under 166.5",price:1.91,wager:50,winnings:45,payout:95},
  {id:547,date:"2025-03-23",status:"Won",league:"NCAA",match:"Kentucky vs. #10 Illinois",type:"Total Points",market:"Under 167",price:1.91,wager:50,winnings:-4,payout:45,freeBet:true},
  {id:548,date:"2025-03-23",status:"Won",league:"NCAA",match:"#1 Duke vs. Baylor",type:"Spread",market:"#1 Duke -12.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:549,date:"2025-03-23",status:"Won",league:"NCAA",match:"#1 Duke vs. Baylor",type:"Total Points",market:"Over 146",price:1.91,wager:125,winnings:113,payout:238},
  {id:550,date:"2025-03-23",status:"Won",league:"NCAA",match:"#1 Duke vs. Baylor",type:"Spread",market:"#1 Duke -12.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:551,date:"2025-03-23",status:"Lost",league:"NCAA",match:"#7 Florida vs. #6 Connecticut",type:"Spread",market:"#7 Florida -8.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:552,date:"2025-03-22",status:"Lost",league:"NBA",match:"Lakers vs. Bulls",type:"Spread",market:"Lakers -9.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:553,date:"2025-03-22",status:"Lost",league:"NBA",match:"Lakers vs. Bulls",type:"Spread",market:"Lakers -9.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:554,date:"2025-03-22",status:"Lost",league:"NCAA",match:"Wisconsin vs. #19 BYU",type:"Total Points",market:"Under 170.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:555,date:"2025-03-22",status:"Lost",league:"NCAA",match:"#22 Tennessee vs. UCLA",type:"To Win",market:"UCLA",price:2.85,wager:100,winnings:0,payout:0},
  {id:556,date:"2025-03-22",status:"Lost",league:"NCAA",match:"#5 Houston vs. #9 Gonzaga",type:"Spread",market:"#5 Houston -10.5",price:1.83,wager:100,winnings:0,payout:0},
  {id:557,date:"2025-03-22",status:"Lost",league:"NHL",match:"Golden Knights vs. Red Wings",type:"Total Goals",market:"Under 6.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:558,date:"2025-03-22",status:"Lost",league:"NCAA",match:"Auburn vs. Creighton",type:"To Win",market:"Creighton",price:3.6,wager:50,winnings:0,payout:0},
  {id:559,date:"2025-03-22",status:"Lost",league:"NCAA",match:"Wisconsin vs. #19 BYU",type:"Total Points",market:"Under 155.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:560,date:"2025-03-22",status:"Won",league:"NCAA",match:"#16 Texas Tech vs. Drake",type:"Spread",market:"#16 Texas Tech -7.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:561,date:"2025-03-22",status:"Won",league:"NCAA",match:"Texas A&M vs. #3 Michigan",type:"Total Points",market:"Over 143.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:562,date:"2025-03-22",status:"Won",league:"NCAA",match:"#15 St. John's vs. #20 Arkansas",type:"To Win",market:"#20 Arkansas",price:3.3,wager:100,winnings:230,payout:330},
  {id:563,date:"2025-03-22",status:"Won",league:"NCAA",match:"#8 Purdue vs. McNeese State",type:"Spread",market:"#8 Purdue -6.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:564,date:"2025-03-22",status:"Lost",league:"National Invitation Tournament",match:"Chattanooga vs. Dayton",type:"Spread",market:"Dayton -2.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:565,date:"2025-03-21",status:"Won",league:"NCAA",match:"#13 Michigan State vs. Bryant",type:"Spread",market:"#13 Michigan State -13.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:566,date:"2025-03-21",status:"Won",league:"NCAA",match:"#10 Illinois vs. Xavier",type:"Spread",market:"#10 Illinois -8.5",price:1.87,wager:300,winnings:260,payout:560},
  {id:567,date:"2025-03-21",status:"Won",league:"NCAA",match:"#6 Connecticut vs. Oklahoma",type:"Spread",market:"#6 Connecticut -3.5",price:2.0,wager:125,winnings:125,payout:250},
  {id:568,date:"2025-03-21",status:"Won",league:"NCAA",match:"Ole Miss vs. #18 North Carolina",type:"Spread",market:"#18 North Carolina +15.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:569,date:"2025-03-21",status:"Lost",league:"NCAA",match:"Saint Mary's vs. #25 Vanderbilt",type:"Spread",market:"#25 Vanderbilt -1.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:570,date:"2025-03-21",status:"Won",league:"NCAA",match:"Maryland vs. Grand Canyon",type:"Spread",market:"Maryland -10.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:571,date:"2025-03-21",status:"Won",league:"NCAA",match:"#1 Duke vs. Mount St. Mary's",type:"Total Points",market:"Over 140.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:572,date:"2025-03-21",status:"Won",league:"NCAA",match:"#17 Alabama vs. Robert Morris",type:"Spread",market:"#17 Alabama -5.5",price:2.0,wager:125,winnings:125,payout:250},
  {id:573,date:"2025-03-21",status:"Lost",league:"NCAA",match:"#7 Florida vs. Norfolk State",type:"Spread",market:"#7 Florida -28.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:574,date:"2025-03-21",status:"Lost",league:"NCAA",match:"Ole Miss vs. #18 North Carolina",type:"Spread",market:"#18 North Carolina -1.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:575,date:"2025-03-21",status:"Lost",league:"NCAA",match:"Saint Mary's vs. #25 Vanderbilt",type:"Spread",market:"Saint Mary's -4.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:576,date:"2025-03-21",status:"Lost",league:"NCAA",match:"Memphis vs. Colorado State",type:"To Win",market:"Memphis",price:1.95,wager:125,winnings:0,payout:0},
  {id:577,date:"2025-03-21",status:"Won",league:"NCAA",match:"#4 Iowa State vs. Lipscomb",type:"Spread",market:"#4 Iowa State -14",price:1.91,wager:300,winnings:272,payout:572},
  {id:578,date:"2025-03-21",status:"Won",league:"NCAA",match:"Mississippi State vs. Baylor",type:"Total Points",market:"Under 147.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:579,date:"2025-03-21",status:"Lost",league:"NCAA",match:"Mississippi State vs. Baylor, #17 Alabama vs. Robert Morris,",type:"MULTIPLE",market:"MULTIPLE",price:3.64,wager:125,winnings:0,payout:0},
  {id:580,date:"2025-03-20",status:"Won",league:"NCAA",match:"#4 Iowa State vs. Lipscomb",type:"Spread",market:"#4 Iowa State -14",price:1.87,wager:250,winnings:217,payout:467},
  {id:581,date:"2025-03-15",status:"Lost",league:"NCAA",match:"#15 St. John's vs. Creighton",type:"To Win",market:"Creighton",price:2.7,wager:93,winnings:0,payout:0},
  {id:582,date:"2025-03-15",status:"Won",league:"NCAA",match:"VCU vs. Loyola Chicago",type:"Spread",market:"VCU -2.5",price:2.05,wager:125,winnings:131,payout:256},
  {id:583,date:"2025-03-15",status:"Won",league:"NCAA",match:"Auburn vs. #22 Tennessee",type:"To Win",market:"#22 Tennessee",price:2.7,wager:100,winnings:170,payout:270},
  {id:584,date:"2025-03-15",status:"Lost",league:"NCAA",match:"VCU vs. Loyola Chicago",type:"Spread",market:"VCU -11.5",price:1.83,wager:250,winnings:0,payout:0},
  {id:585,date:"2025-03-15",status:"Won",league:"NCAA",match:"Maryland vs. #3 Michigan",type:"Spread",market:"#3 Michigan +4.5",price:1.95,wager:125,winnings:119,payout:244},
  {id:586,date:"2025-03-15",status:"Lost",league:"NCAA",match:"#13 Michigan State vs. Wisconsin",type:"Total Points",market:"Under 147.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:587,date:"2025-03-14",status:"Lost",league:"NCAA",match:"Dayton vs. St. Joseph's",type:"To Win",market:"Dayton",price:2.6,wager:200,winnings:0,payout:0},
  {id:588,date:"2025-03-14",status:"Lost",league:"NCAA",match:"Dayton vs. St. Joseph's",type:"Spread",market:"Dayton +3.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:589,date:"2025-03-14",status:"Lost",league:"NCAA",match:"#1 Duke vs. #18 North Carolina",type:"Spread",market:"#1 Duke -13.5",price:2.0,wager:125,winnings:0,payout:0},
  {id:590,date:"2025-03-14",status:"Lost",league:"NCAA",match:"Dayton vs. St. Joseph's",type:"Spread",market:"Dayton -1.5",price:1.87,wager:300,winnings:0,payout:0},
  {id:591,date:"2025-03-08",status:"Lost",league:"NCAA",match:"#18 North Carolina vs. #1 Duke",type:"To Win",market:"#18 North Carolina",price:2.15,wager:100,winnings:0,payout:0},
  {id:592,date:"2025-03-08",status:"Won",league:"NCAA",match:"#18 North Carolina vs. #1 Duke",type:"Total Points",market:"Under 160.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:593,date:"2025-03-08",status:"Won",league:"NCAA",match:"#18 North Carolina vs. #1 Duke",type:"Spread",market:"#1 Duke -9.5",price:1.83,wager:125,winnings:104,payout:229},
  {id:594,date:"2025-03-07",status:"Won",league:"NCAA",match:"VCU vs. Dayton",type:"To Win",market:"Dayton",price:4.25,wager:100,winnings:325,payout:425},
  {id:595,date:"2025-03-07",status:"Won",league:"NCAA",match:"VCU vs. Dayton",type:"To Win",market:"Dayton",price:3.75,wager:100,winnings:275,payout:375},
  {id:596,date:"2025-03-07",status:"Lost",league:"NCAA",match:"VCU vs. Dayton",type:"Total Points",market:"Under 128.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:597,date:"2025-03-04",status:"Won",league:"NCAA",match:"Dayton vs. #23 Saint Louis",type:"Total Points",market:"Under 144.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:598,date:"2025-03-01",status:"Won",league:"NHL",match:"Blue Jackets vs. Red Wings",type:"Spread",market:"Blue Jackets -1.5",price:2.8,wager:100,winnings:180,payout:280},
  {id:599,date:"2025-03-01",status:"Lost",league:"NCAA",match:"Dayton vs. Richmond",type:"Total Points",market:"Under 137.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:600,date:"2025-02-20",status:"Lost",league:"4 Nations Face-Off",match:"USA vs. Canada",type:"Spread",market:"USA -1.5",price:3.3,wager:100,winnings:0,payout:0},
  {id:601,date:"2025-02-17",status:"Lost",league:"4 Nations Face-Off",match:"USA vs. Sweden",type:"Spread",market:"USA -1.5",price:2.3,wager:125,winnings:0,payout:0},
  {id:602,date:"2025-02-15",status:"Lost",league:"4 Nations Face-Off",match:"Canada vs. USA",type:"Spread",market:"Canada -1.5",price:2.15,wager:300,winnings:0,payout:0},
  {id:603,date:"2025-02-15",status:"Won",league:"4 Nations Face-Off",match:"Canada vs. USA",type:"Total Goals",market:"Under 5.5",price:1.83,wager:125,winnings:104,payout:229},
  {id:604,date:"2025-02-15",status:"Won",league:"4 Nations Face-Off",match:"Canada vs. USA",type:"Spread",market:"USA -1.5",price:3.5,wager:100,winnings:250,payout:350},
  {id:605,date:"2025-02-12",status:"Won",league:"NCAA",match:"Fordham vs. Dayton",type:"Spread",market:"Dayton -6.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:606,date:"2025-02-09",status:"Lost",league:"NFL",match:"Eagles vs Chiefs",type:"Spread",market:"Chiefs -1.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:607,date:"2025-02-09",status:"Won",league:"NFL",match:"Eagles vs Chiefs",type:"Total Points",market:"Over 48.5",price:1.91,wager:600,winnings:545,payout:1145},
  {id:608,date:"2025-02-08",status:"Lost",league:"NCAA",match:"Clemson vs. #1 Duke",type:"Spread",market:"#1 Duke -5.5",price:1.83,wager:300,winnings:0,payout:0},
  {id:609,date:"2025-02-08",status:"Lost",league:"NCAA",match:"Clemson vs. #1 Duke",type:"Spread",market:"#1 Duke -10.5",price:1.83,wager:500,winnings:0,payout:0},
  {id:610,date:"2025-02-08",status:"Lost",league:"NFL",match:"Eagles vs Chiefs",type:"Spread",market:"Chiefs -1",price:1.91,wager:499,winnings:0,payout:0},
  {id:611,date:"2025-02-08",status:"Lost",league:"NBA",match:"Suns vs. Jazz",type:"Spread",market:"Suns -9.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:612,date:"2025-02-07",status:"Lost",league:"NCAA",match:"Dayton vs. VCU",type:"Spread",market:"Dayton +1.5",price:1.91,wager:150,winnings:0,payout:0},
  {id:613,date:"2025-02-05",status:"Lost",league:"NCAA",match:"Syracuse vs. #1 Duke",type:"Total Points",market:"Under 132.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:614,date:"2025-02-01",status:"Lost",league:"NCAA",match:"Kentucky vs. #20 Arkansas",type:"Spread",market:"Kentucky -8.5",price:1.87,wager:150,winnings:0,payout:0},
  {id:615,date:"2025-02-01",status:"Lost",league:"NFL",match:"Eagles vs Chiefs, Eagles vs Chiefs, Eagles vs Chiefs,",type:"MULTIPLE",market:"MULTIPLE",price:5.25,wager:250,winnings:0,payout:0},
  {id:616,date:"2025-02-01",status:"Won",league:"NCAA",match:"#1 Duke vs. #18 North Carolina",type:"Total Points",market:"Over 149.5",price:1.95,wager:125,winnings:119,payout:244},
  {id:617,date:"2025-02-01",status:"Won",league:"NCAA",match:"#1 Duke vs. #18 North Carolina",type:"Total Points",market:"Over 154.5",price:2.05,wager:125,winnings:131,payout:256},
  {id:618,date:"2025-01-28",status:"Lost",league:"NFL",match:"Eagles vs Chiefs",type:"Spread",market:"Chiefs -1.5",price:1.91,wager:1000,winnings:0,payout:0},
  {id:619,date:"2025-01-27",status:"Won",league:"NCAA",match:"#1 Duke vs. NC State",type:"Spread",market:"#1 Duke -5.5",price:2.0,wager:300,winnings:300,payout:600},
  {id:620,date:"2025-01-27",status:"Lost",league:"NCAA",match:"#1 Duke vs. NC State",type:"Total Points",market:"Under 131.5",price:2.0,wager:100,winnings:0,payout:0},
  {id:621,date:"2025-01-26",status:"Lost",league:"NFL",match:"Chiefs vs Bills",type:"Spread",market:"Chiefs -3.5",price:1.95,wager:346,winnings:0,payout:0},
  {id:622,date:"2025-01-26",status:"Push",league:"NFL",match:"Chiefs vs Bills",type:"Spread",market:"Chiefs -3",price:1.0,wager:300,winnings:0,payout:300},
  {id:623,date:"2025-01-26",status:"Lost",league:"NFL",match:"Chiefs vs Bills",type:"Total Points",market:"Under 48.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:624,date:"2025-01-26",status:"Lost",league:"NFL",match:"Chiefs vs Bills",type:"Spread",market:"Chiefs -6",price:1.87,wager:50,winnings:0,payout:0},
  {id:625,date:"2025-01-26",status:"Lost",league:"NFL",match:"Chiefs vs Bills",type:"Spread",market:"Chiefs -4",price:1.87,wager:100,winnings:0,payout:0},
  {id:626,date:"2025-01-26",status:"Won",league:"NFL",match:"Chiefs vs Bills",type:"Total Points",market:"Over 49.5",price:1.91,wager:265,winnings:241,payout:507},
  {id:627,date:"2025-01-26",status:"Won",league:"NFL",match:"Chiefs vs Bills",type:"Total Points",market:"Over 49.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:628,date:"2025-01-26",status:"Won",league:"NFL",match:"Eagles vs Commanders, Eagles vs Commanders,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:400,winnings:881,payout:1281},
  {id:629,date:"2025-01-26",status:"Won",league:"NFL",match:"Eagles vs Commanders",type:"Total Points",market:"Over 46.5",price:1.91,wager:532,winnings:483,payout:1015},
  {id:630,date:"2025-01-26",status:"Won",league:"Boosts",match:"QB Parlay 1/26 OD",type:"Air It Out",market:"Patrick Mahomes & Josh Allen each record 225+ Passing Yards",price:2.8,wager:50,winnings:90,payout:140},
  {id:631,date:"2025-01-26",status:"Won",league:"Boosts",match:"Eagles 1/26 OD",type:"Go Birds",market:"Eagles to win by 7+ Points vs. Commanders",price:2.3,wager:50,winnings:65,payout:115},
  {id:632,date:"2025-01-24",status:"Lost",league:"NCAA",match:"Dayton vs. St. Joseph's",type:"Spread",market:"Dayton -6.5",price:1.87,wager:125,winnings:0,payout:0},
  {id:633,date:"2025-01-20",status:"Won",league:"Boosts",match:"NCAAF final total 1/20 OD",type:"Last Dance",market:"46+ Points Scored in Ohio State vs. Notre Dame (NCAAF)",price:2.2,wager:25,winnings:30,payout:55},
  {id:634,date:"2025-01-20",status:"Won",league:"Boosts",match:"NCAAF final total 1/20 OD",type:"Last Dance",market:"46+ Points Scored in Ohio State vs. Notre Dame (NCAAF)",price:2.2,wager:25,winnings:30,payout:55},
  {id:635,date:"2025-01-19",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. 2 Ohio State",type:"Total Points",market:"Over 45.5",price:1.91,wager:617,winnings:561,payout:1179},
  {id:636,date:"2025-01-19",status:"Won",league:"NFL",match:"Eagles vs Rams",type:"Total Points",market:"Under 54.5",price:1.87,wager:25,winnings:21,payout:46},
  {id:637,date:"2025-01-19",status:"Won",league:"NFL",match:"Eagles vs Rams",type:"Total Points",market:"Under 54.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:638,date:"2025-01-19",status:"Won",league:"NFL",match:"Bills vs Ravens",type:"To Win",market:"Bills",price:2.0,wager:750,winnings:750,payout:1500},
  {id:639,date:"2025-01-19",status:"Won",league:"NFL",match:"Eagles vs Rams",type:"Total Points",market:"Over 43.5",price:1.91,wager:175,winnings:159,payout:334},
  {id:640,date:"2025-01-19",status:"Lost",league:"NFL",match:"Bills vs Ravens",type:"Total Points",market:"Under 51.5",price:1.91,wager:553,winnings:0,payout:0},
  {id:641,date:"2025-01-18",status:"Lost",league:"NCAA",match:"Dayton vs. Loyola Chicago",type:"Spread",market:"Dayton -7.5",price:1.87,wager:150,winnings:0,payout:0},
  {id:642,date:"2025-01-18",status:"Lost",league:"NFL",match:"Chiefs vs Texans, Lions vs Commanders,",type:"MULTIPLE",market:"MULTIPLE",price:1.8,wager:1000,winnings:0,payout:0},
  {id:643,date:"2025-01-18",status:"Cashed Out",league:"NFL",match:"Chiefs vs Texans, Lions vs Commanders,",type:"MULTIPLE",market:"MULTIPLE",price:1.91,wager:100,winnings:0,payout:100},
  {id:644,date:"2025-01-18",status:"Push",league:"NFL",match:"Chiefs vs Texans",type:"Spread",market:"Chiefs -9",price:1.0,wager:240,winnings:0,payout:240},
  {id:645,date:"2025-01-18",status:"Lost",league:"NCAA",match:"Kentucky vs. #17 Alabama",type:"To Win",market:"Kentucky",price:2.5,wager:79,winnings:0,payout:0},
  {id:646,date:"2025-01-18",status:"Lost",league:"NCAA",match:"Kentucky vs. #17 Alabama",type:"To Win",market:"Kentucky",price:2.15,wager:10,winnings:0,payout:0,freeBet:true},
  {id:647,date:"2025-01-18",status:"Lost",league:"NFL",match:"Lions vs Commanders",type:"Total Points",market:"Under 55.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:648,date:"2025-01-18",status:"Won",league:"NFL",match:"Chiefs vs Texans",type:"Spread",market:"Chiefs -8.5",price:1.91,wager:400,winnings:363,payout:763},
  {id:649,date:"2025-01-15",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -8",price:1.91,wager:2000,winnings:1818,payout:3818},
  {id:650,date:"2025-01-13",status:"Won",league:"NFL",match:"Rams vs Vikings",type:"Total Points",market:"Under 47.5",price:1.95,wager:300,winnings:285,payout:585},
  {id:651,date:"2025-01-12",status:"Won",league:"NFL",match:"Rams vs Vikings",type:"Total Points",market:"Under 48",price:1.91,wager:306,winnings:278,payout:584},
  {id:652,date:"2025-01-12",status:"Won",league:"NFL",match:"Buccaneers vs Commanders",type:"Total Points",market:"Under 51.5",price:1.95,wager:255,winnings:242,payout:497},
  {id:653,date:"2025-01-12",status:"Won",league:"NFL",match:"Eagles vs Packers",type:"Spread",market:"Eagles -5.5",price:1.91,wager:510,winnings:464,payout:975},
  {id:654,date:"2025-01-12",status:"Won",league:"NFL",match:"Bills vs Broncos",type:"Total Points",market:"Under 49",price:1.91,wager:150,winnings:136,payout:286},
  {id:655,date:"2025-01-12",status:"Won",league:"NFL",match:"Buccaneers vs Commanders",type:"Total Points",market:"Under 51",price:1.95,wager:250,winnings:238,payout:488},
  {id:656,date:"2025-01-12",status:"Won",league:"NFL",match:"Bills vs Broncos",type:"Spread",market:"Bills -7.5",price:1.91,wager:536,winnings:487,payout:1024},
  {id:657,date:"2025-01-11",status:"Won",league:"NFL",match:"Ravens vs Steelers",type:"Total Points",market:"Under 44",price:1.91,wager:500,winnings:454,payout:954},
  {id:658,date:"2025-01-11",status:"Won",league:"NFL",match:"Texans vs Chargers",type:"Total Points",market:"Over 41.5",price:1.91,wager:462,winnings:420,payout:882},
  {id:659,date:"2025-01-10",status:"Won",league:"NCAA",match:"Texas vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -10.5",price:2.0,wager:1000,winnings:1000,payout:2000},
  {id:660,date:"2025-01-10",status:"Lost",league:"NCAA",match:"Texas vs. 2 Ohio State, Texas vs. 2 Ohio State,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:500,winnings:0,payout:0},
  {id:661,date:"2025-01-09",status:"Lost",league:"NCAA",match:"Penn State vs. #9 Notre Dame",type:"Spread",market:"Penn State -3.5",price:1.95,wager:500,winnings:0,payout:0},
  {id:662,date:"2025-01-05",status:"Won",league:"NFL",match:"Lions vs Vikings",type:"Spread",market:"Lions -3",price:1.95,wager:500,winnings:476,payout:976},
  {id:663,date:"2025-01-05",status:"Won",league:"NFL",match:"Falcons vs Panthers",type:"Spread",market:"Panthers -3",price:1.91,wager:150,winnings:136,payout:286},
  {id:664,date:"2025-01-05",status:"Lost",league:"NFL",match:"Cardinals vs 49ers",type:"To Win",market:"49ers",price:2.85,wager:350,winnings:0,payout:0},
  {id:665,date:"2025-01-05",status:"Won",league:"NFL",match:"Lions vs Vikings",type:"Spread",market:"Lions -3",price:2.0,wager:650,winnings:650,payout:1300},
  {id:666,date:"2025-01-05",status:"Cashed Out",league:"NFL",match:"Cardinals vs 49ers",type:"To Win",market:"49ers",price:2.85,wager:100,winnings:0,payout:100},
  {id:667,date:"2025-01-05",status:"Won",league:"NFL",match:"Jets vs Dolphins",type:"Spread",market:"Jets -1",price:1.91,wager:200,winnings:181,payout:381},
  {id:668,date:"2025-01-05",status:"Lost",league:"NFL",match:"Colts vs Jaguars",type:"Spread",market:"Colts -3.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:669,date:"2025-01-05",status:"Lost",league:"NFL",match:"Falcons vs Panthers, Falcons vs Panthers,",type:"MULTIPLE",market:"MULTIPLE",price:3.6,wager:400,winnings:0,payout:0},
  {id:670,date:"2025-01-05",status:"Lost",league:"NFL",match:"Packers vs Bears",type:"Total Points",market:"Under 41",price:1.95,wager:100,winnings:0,payout:0},
  {id:671,date:"2025-01-04",status:"Lost",league:"NFL",match:"Steelers vs Bengals",type:"Spread",market:"Bengals -3",price:2.05,wager:250,winnings:0,payout:0},
  {id:672,date:"2025-01-04",status:"Won",league:"NFL",match:"Steelers vs Bengals",type:"Total Points",market:"Under 48",price:1.95,wager:250,winnings:238,payout:488},
  {id:673,date:"2025-01-04",status:"Won",league:"NFL",match:"Ravens vs Browns",type:"Total Points",market:"Over 42",price:1.87,wager:150,winnings:130,payout:280},
  {id:674,date:"2025-01-02",status:"Lost",league:"NCAA",match:"Texas vs. 2 Ohio State",type:"Total Points",market:"Over 53",price:1.91,wager:569,winnings:0,payout:0},
  {id:675,date:"2025-01-01",status:"Won",league:"NCAA",match:"Arizona State vs. Texas",type:"Total Points",market:"Over 43.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:676,date:"2025-01-01",status:"Won",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Total Points",market:"Over 55.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:677,date:"2025-01-01",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Total Points",market:"Over 56",price:1.91,wager:200,winnings:0,payout:200},
  {id:678,date:"2024-12-31",status:"Won",league:"NCAA",match:"Boise State vs. Penn State",type:"Total Points",market:"Under 54.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:679,date:"2024-12-31",status:"Won",league:"NCAA",match:"LSU vs. Baylor",type:"Spread",market:"LSU -2.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:680,date:"2024-12-31",status:"Won",league:"NCAA",match:"Boise State vs. Penn State",type:"Total Points",market:"Under 54.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:681,date:"2024-12-31",status:"Lost",league:"NCAA",match:"Illinois vs. South Carolina",type:"Total Points",market:"Over 44.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:682,date:"2024-12-31",status:"Won",league:"NCAA",match:"Michigan vs. 9 Alabama",type:"Spread",market:"Michigan -4.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:683,date:"2024-12-30",status:"Won",league:"NFL",match:"49ers vs Lions",type:"Spread",market:"Lions -3.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:684,date:"2024-12-29",status:"Won",league:"NFL",match:"Commanders vs Falcons",type:"Spread",market:"Commanders -3.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:685,date:"2024-12-29",status:"Won",league:"NFL",match:"Giants vs Colts",type:"To Win",market:"Giants",price:4.0,wager:100,winnings:300,payout:400},
  {id:686,date:"2024-12-29",status:"Lost",league:"NFL",match:"Commanders vs Falcons",type:"Total Points",market:"Under 46",price:1.91,wager:450,winnings:0,payout:0},
  {id:687,date:"2024-12-29",status:"Lost",league:"NFL",match:"Vikings vs Packers",type:"Spread",market:"Packers +1",price:1.91,wager:200,winnings:0,payout:0},
  {id:688,date:"2024-12-29",status:"Lost",league:"NFL",match:"Browns vs Dolphins",type:"Total Points",market:"Over 33",price:1.87,wager:150,winnings:0,payout:0},
  {id:689,date:"2024-12-29",status:"Lost",league:"NFL",match:"Buccaneers vs Panthers",type:"Total Points",market:"Under 47.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:690,date:"2024-12-29",status:"Won",league:"NFL",match:"Eagles vs Cowboys",type:"Total Points",market:"Over 37.5",price:1.87,wager:318,winnings:277,payout:595},
  {id:691,date:"2024-12-28",status:"Lost",league:"NCAA",match:"Colorado vs. BYU",type:"Spread",market:"Colorado +19.5",price:2.0,wager:200,winnings:0,payout:0},
  {id:692,date:"2024-12-28",status:"Won",league:"NFL",match:"Rams vs Cardinals",type:"Total Points",market:"Under 48",price:1.91,wager:200,winnings:181,payout:381},
  {id:693,date:"2024-12-28",status:"Lost",league:"NFL",match:"Bengals vs Broncos",type:"Total Points",market:"Under 43.5",price:1.83,wager:100,winnings:0,payout:0},
  {id:694,date:"2024-12-28",status:"Won",league:"NFL",match:"Patriots vs Chargers",type:"Spread",market:"Chargers -5.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:695,date:"2024-12-28",status:"Won",league:"NFL",match:"Bengals vs Broncos",type:"Spread",market:"Bengals -3.5",price:2.0,wager:775,winnings:775,payout:1550},
  {id:696,date:"2024-12-27",status:"Lost",league:"NCAA",match:"USC vs. 7 Texas A&M",type:"Spread",market:"7 Texas A&M -3.5",price:1.91,wager:125,winnings:0,payout:0},
  {id:697,date:"2024-12-27",status:"Lost",league:"NCAA",match:"Washington State vs. Syracuse",type:"To Win",market:"Washington State",price:9.0,wager:100,winnings:0,payout:0},
  {id:698,date:"2024-12-27",status:"Lost",league:"NCAA",match:"Navy vs. 8 Oklahoma, Navy vs. 8 Oklahoma,",type:"MULTIPLE",market:"MULTIPLE",price:3.5,wager:377,winnings:0,payout:0},
  {id:699,date:"2024-12-26",status:"Lost",league:"NCAA",match:"Michigan vs. 9 Alabama",type:"Total Points",market:"Over 43.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:700,date:"2024-12-26",status:"Lost",league:"NFL",match:"Bears vs Seahawks",type:"Spread",market:"Seahawks -4.5",price:1.91,wager:631,winnings:0,payout:0},
  {id:701,date:"2024-12-26",status:"Lost",league:"NCAA",match:"Toledo vs. Pittsburgh",type:"Spread",market:"Toledo -4.5",price:1.83,wager:200,winnings:0,payout:0},
  {id:702,date:"2024-12-26",status:"Lost",league:"NCAA",match:"Toledo vs. Pittsburgh",type:"Spread",market:"Toledo -7.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:703,date:"2024-12-26",status:"Cashed Out",league:"NFL",match:"Bears vs Seahawks",type:"Spread",market:"Seahawks -4.5",price:1.91,wager:431,winnings:0,payout:431},
  {id:704,date:"2024-12-25",status:"Won",league:"NFL",match:"Bears vs Seahawks",type:"Total Points",market:"Under 42.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:705,date:"2024-12-25",status:"Lost",league:"NFL",match:"Texans vs Ravens",type:"Total Points",market:"Over 47",price:1.91,wager:200,winnings:0,payout:0},
  {id:706,date:"2024-12-25",status:"Won",league:"NFL",match:"Steelers vs Chiefs",type:"Spread",market:"Chiefs -2",price:1.91,wager:300,winnings:272,payout:572},
  {id:707,date:"2024-12-25",status:"Won",league:"Boosts",match:"Chiefs 12/25 OD",type:"Statement Game",market:"Chiefs to win by 5+ Points vs. Steelers",price:2.7,wager:50,winnings:85,payout:135},
  {id:708,date:"2024-12-23",status:"Won",league:"NFL",match:"Packers vs Saints",type:"Total Points",market:"Under 43.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:709,date:"2024-12-22",status:"Lost",league:"NFL",match:"Cowboys vs Buccaneers",type:"Spread",market:"Buccaneers -4",price:1.91,wager:1000,winnings:0,payout:0},
  {id:710,date:"2024-12-22",status:"Cashed Out",league:"NFL",match:"Cowboys vs Buccaneers",type:"Spread",market:"Buccaneers -4",price:1.91,wager:500,winnings:0,payout:500},
  {id:711,date:"2024-12-22",status:"Push",league:"NFL",match:"Seahawks vs Vikings",type:"Spread",market:"Vikings -3",price:1.0,wager:300,winnings:0,payout:300},
  {id:712,date:"2024-12-22",status:"Lost",league:"NFL",match:"Commanders vs Eagles, Commanders vs Eagles, Commanders vs Eagles,",type:"MULTIPLE",market:"MULTIPLE",price:4.75,wager:100,winnings:0,payout:0},
  {id:713,date:"2024-12-22",status:"Won",league:"NFL",match:"Jets vs Rams",type:"Total Points",market:"Under 47",price:1.91,wager:250,winnings:227,payout:477},
  {id:714,date:"2024-12-22",status:"Won",league:"NFL",match:"Dolphins vs 49ers, Dolphins vs 49ers,",type:"MULTIPLE",market:"MULTIPLE",price:3.3,wager:200,winnings:460,payout:660},
  {id:715,date:"2024-12-22",status:"Won",league:"NFL",match:"Dolphins vs 49ers",type:"Total Points",market:"Over 44.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:716,date:"2024-12-21",status:"Won",league:"NCAA",match:"2 Ohio State vs. Tennessee",type:"Spread",market:"2 Ohio State -19.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:717,date:"2024-12-21",status:"Won",league:"NCAA",match:"2 Ohio State vs. Tennessee",type:"Total Points",market:"Over 46",price:1.87,wager:250,winnings:217,payout:467},
  {id:718,date:"2024-12-21",status:"Won",league:"NFL",match:"Ravens vs Steelers",type:"Spread",market:"Ravens -7.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:719,date:"2024-12-21",status:"Won",league:"NFL",match:"Bears vs Lions",type:"Spread",market:"Lions -6.5",price:1.87,wager:500,winnings:434,payout:934},
  {id:720,date:"2024-12-21",status:"Won",league:"NFL",match:"Chiefs vs Texans",type:"Spread",market:"Chiefs -4",price:1.87,wager:300,winnings:260,payout:560},
  {id:721,date:"2024-12-21",status:"Won",league:"NCAA",match:"Texas vs. Clemson",type:"Spread",market:"Texas -13.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:722,date:"2024-12-21",status:"Lost",league:"NFL",match:"Ravens vs Steelers",type:"Total Points",market:"Under 44.5",price:1.95,wager:200,winnings:0,payout:0},
  {id:723,date:"2024-12-21",status:"Lost",league:"NCAA",match:"3 Georgia vs. #9 Notre Dame",type:"Spread",market:"3 Georgia -1",price:1.91,wager:1000,winnings:0,payout:0},
  {id:724,date:"2024-12-21",status:"Won",league:"NCAA",match:"Penn State vs. SMU",type:"Total Points",market:"Under 52",price:1.91,wager:200,winnings:181,payout:381},
  {id:725,date:"2024-12-20",status:"Lost",league:"NCAA",match:"Cincinnati vs. Dayton",type:"To Win",market:"Dayton",price:4.75,wager:200,winnings:0,payout:0},
  {id:726,date:"2024-12-20",status:"Lost",league:"NCAA",match:"Cincinnati vs. Dayton",type:"To Win",market:"Dayton",price:2.4,wager:270,winnings:0,payout:0},
  {id:727,date:"2024-12-20",status:"Cashed Out",league:"NCAA",match:"Cincinnati vs. Dayton",type:"To Win",market:"Dayton",price:2.4,wager:120,winnings:0,payout:120},
  {id:728,date:"2024-12-20",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. 1 Indiana",type:"Total Points",market:"Under 50.5",price:1.91,wager:300,winnings:272,payout:572},
  {id:729,date:"2024-12-20",status:"Cashed Out",league:"NCAA",match:"#9 Notre Dame vs. 1 Indiana",type:"Total Points",market:"Under 50.5",price:1.91,wager:125,winnings:0,payout:125},
  {id:730,date:"2024-12-19",status:"Won",league:"NFL",match:"Chargers vs Broncos",type:"Spread",market:"Chargers -3",price:2.0,wager:253,winnings:253,payout:506},
  {id:731,date:"2024-12-16",status:"Won",league:"NFL",match:"Vikings vs Bears",type:"Total Points",market:"Under 43.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:732,date:"2024-12-16",status:"Won",league:"NFL",match:"Raiders vs Falcons",type:"Spread",market:"Falcons -5.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:733,date:"2024-12-16",status:"Won",league:"NFL",match:"Bengals vs Browns",type:"Total Points",market:"Under 48",price:1.91,wager:250,winnings:227,payout:477},
  {id:734,date:"2024-12-15",status:"Lost",league:"NFL",match:"Lions vs Bills",type:"Spread",market:"Bills -6.5",price:1.91,wager:400,winnings:0,payout:0},
  {id:735,date:"2024-12-15",status:"Won",league:"NFL",match:"Seahawks vs Packers",type:"Spread",market:"Packers -3",price:2.05,wager:515,winnings:540,payout:1055},
  {id:736,date:"2024-12-15",status:"Won",league:"NFL",match:"Chargers vs Buccaneers",type:"Total Points",market:"Over 45.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:737,date:"2024-12-15",status:"Won",league:"NFL",match:"Cardinals vs Patriots",type:"Total Points",market:"Over 46.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:738,date:"2024-12-15",status:"Lost",league:"NFL",match:"Lions vs Bills",type:"Total Points",market:"Under 55.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:739,date:"2024-12-15",status:"Won",league:"NFL",match:"Jaguars vs Jets",type:"Spread",market:"Jets +1.5",price:1.83,wager:100,winnings:83,payout:183},
  {id:740,date:"2024-12-15",status:"Lost",league:"NFL",match:"Saints vs Commanders",type:"Spread",market:"Commanders -14",price:1.91,wager:100,winnings:0,payout:0},
  {id:741,date:"2024-12-15",status:"Won",league:"NFL",match:"Titans vs Bengals",type:"Spread",market:"Bengals -2",price:2.05,wager:300,winnings:315,payout:615},
  {id:742,date:"2024-12-15",status:"Lost",league:"NFL",match:"Giants vs Ravens",type:"Total Points",market:"Under 43.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:743,date:"2024-12-15",status:"Cashed Out",league:"NFL",match:"Giants vs Ravens",type:"Total Points",market:"Under 43.5",price:1.91,wager:100,winnings:0,payout:100},
  {id:744,date:"2024-12-15",status:"Lost",league:"NFL",match:"Texans vs Dolphins, Texans vs Dolphins, Texans vs Dolphins,",type:"MULTIPLE",market:"MULTIPLE",price:5.25,wager:250,winnings:0,payout:0},
  {id:745,date:"2024-12-15",status:"Lost",league:"NFL",match:"Eagles vs Steelers",type:"Total Points",market:"Over 43",price:1.91,wager:250,winnings:0,payout:0},
  {id:746,date:"2024-12-14",status:"Lost",league:"NCAA",match:"Dayton vs. Marquette",type:"Spread",market:"Marquette -2.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:747,date:"2024-12-14",status:"Won",league:"NCAA",match:"Dayton vs. Marquette",type:"Total Points",market:"Under 137.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:748,date:"2024-12-14",status:"Lost",league:"NCAA",match:"Kentucky vs. #24 Louisville",type:"Spread",market:"Kentucky -8.5",price:2.0,wager:100,winnings:0,payout:0},
  {id:749,date:"2024-12-14",status:"Won",league:"NFL",match:"Titans vs Bengals",type:"Spread",market:"Bengals -5",price:1.91,wager:700,winnings:636,payout:1336},
  {id:750,date:"2024-12-14",status:"Lost",league:"NCAA",match:"Army vs. Navy",type:"Spread",market:"Army -6.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:751,date:"2024-12-12",status:"Lost",league:"NFL",match:"Texans vs Dolphins",type:"Total Points",market:"Over 46.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:752,date:"2024-12-12",status:"Won",league:"NFL",match:"Browns vs Chiefs",type:"Spread",market:"Chiefs -4",price:1.91,wager:650,winnings:590,payout:1240},
  {id:753,date:"2024-12-12",status:"Cashed Out",league:"NFL",match:"Titans vs Bengals",type:"Spread",market:"Bengals -5",price:1.91,wager:250,winnings:0,payout:250},
  {id:754,date:"2024-12-12",status:"Lost",league:"Boosts",match:"Kupp 12/12 HH",type:"Happy Hour",market:"Cooper Kupp records 80+ Receiving Yards",price:3.3,wager:100,winnings:0,payout:0},
  {id:755,date:"2024-12-12",status:"Lost",league:"NFL",match:"49ers vs Rams",type:"Spread",market:"49ers -3",price:2.0,wager:558,winnings:0,payout:0},
  {id:756,date:"2024-12-09",status:"Won",league:"NFL",match:"Cowboys vs Bengals, Cowboys vs Bengals, Cowboys vs Bengals,",type:"MULTIPLE",market:"MULTIPLE",price:6.5,wager:250,winnings:1375,payout:2037},
  {id:757,date:"2024-12-09",status:"Won",league:"NFL",match:"Cowboys vs Bengals",type:"Spread",market:"Bengals -4.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:758,date:"2024-12-09",status:"Won",league:"NFL",match:"Cowboys vs Bengals",type:"Spread",market:"Bengals -5.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:759,date:"2024-12-08",status:"Lost",league:"NFL",match:"Chiefs vs Chargers",type:"Spread",market:"Chiefs -4.5",price:1.91,wager:279,winnings:0,payout:0},
  {id:760,date:"2024-12-08",status:"Lost",league:"NFL",match:"Rams vs Bills, Rams vs Bills,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:100,winnings:0,payout:0},
  {id:761,date:"2024-12-08",status:"Lost",league:"NFL",match:"Steelers vs Browns",type:"To Win",market:"Browns",price:12.0,wager:10,winnings:0,payout:0},
  {id:762,date:"2024-12-08",status:"Won",league:"NFL",match:"Steelers vs Browns",type:"Total Points",market:"Under 45.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:763,date:"2024-12-08",status:"Lost",league:"NFL",match:"Titans vs Jaguars",type:"Spread",market:"Titans -7",price:2.3,wager:100,winnings:0,payout:0},
  {id:764,date:"2024-12-08",status:"Lost",league:"NFL",match:"Vikings vs Falcons, Vikings vs Falcons,",type:"MULTIPLE",market:"MULTIPLE",price:5.75,wager:100,winnings:0,payout:0},
  {id:765,date:"2024-12-08",status:"Cashed Out",league:"NFL",match:"Vikings vs Falcons",type:"Total Points",market:"Over 46.5",price:1.91,wager:100,winnings:0,payout:100},
  {id:766,date:"2024-12-08",status:"Cashed Out",league:"NFL",match:"Vikings vs Falcons",type:"To Win",market:"Falcons",price:3.1,wager:100,winnings:0,payout:100},
  {id:767,date:"2024-12-08",status:"Won",league:"NFL",match:"Cowboys vs Bengals",type:"Total Points",market:"Under 49.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:768,date:"2024-12-08",status:"Won",league:"NFL",match:"49ers vs Bears",type:"Spread",market:"49ers -3",price:1.87,wager:500,winnings:434,payout:934},
  {id:769,date:"2024-12-08",status:"Lost",league:"NFL",match:"Chiefs vs Chargers",type:"Spread",market:"Chiefs -4",price:1.91,wager:500,winnings:0,payout:0},
  {id:770,date:"2024-12-08",status:"Lost",league:"NFL",match:"Rams vs Bills",type:"Spread",market:"Bills -3.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:771,date:"2024-12-07",status:"Won",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Total Points",market:"Over 80.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:772,date:"2024-12-07",status:"Won",league:"NCAA",match:"Texas vs. 3 Georgia",type:"To Win",market:"3 Georgia",price:2.5,wager:150,winnings:225,payout:375},
  {id:773,date:"2024-12-07",status:"Won",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Spread",market:"5 Oregon -3.5",price:1.91,wager:1533,winnings:1394,payout:2927},
  {id:774,date:"2024-12-07",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Spread",market:"5 Oregon -3.5",price:1.91,wager:833,winnings:0,payout:833},
  {id:775,date:"2024-12-07",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Spread",market:"5 Oregon -3.5",price:1.91,wager:533,winnings:0,payout:533},
  {id:776,date:"2024-12-07",status:"Lost",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Total Points",market:"Under 50",price:1.91,wager:100,winnings:0,payout:0},
  {id:777,date:"2024-12-07",status:"Lost",league:"NCAA",match:"Texas vs. 3 Georgia",type:"Total Points",market:"Over 50",price:1.91,wager:125,winnings:0,payout:0},
  {id:778,date:"2024-12-07",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Spread",market:"5 Oregon -3.5",price:1.91,wager:314,winnings:0,payout:314},
  {id:779,date:"2024-12-07",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. Penn State",type:"Spread",market:"5 Oregon -3.5",price:1.91,wager:262,winnings:0,payout:262},
  {id:780,date:"2024-12-05",status:"Push",league:"NFL",match:"Lions vs Packers",type:"Spread",market:"Lions -3",price:1.0,wager:258,winnings:0,payout:258},
  {id:781,date:"2024-12-01",status:"Won",league:"NFL",match:"Bills vs 49ers",type:"Josh Allen - Passing TDs",market:"Over 1.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:782,date:"2024-12-01",status:"Won",league:"NFL",match:"Bills vs 49ers",type:"Spread",market:"Bills -6.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:783,date:"2024-12-01",status:"Lost",league:"NFL",match:"Panthers vs Buccaneers, Panthers vs Buccaneers, Saints vs Rams,",type:"MULTIPLE",market:"MULTIPLE",price:5.5,wager:250,winnings:0,payout:0},
  {id:784,date:"2024-12-01",status:"Lost",league:"NFL",match:"Saints vs Rams",type:"Total Points",market:"Under 30.5",price:1.83,wager:100,winnings:0,payout:0},
  {id:785,date:"2024-12-01",status:"Lost",league:"NFL",match:"Bengals vs Steelers",type:"Total Points",market:"Under 74.5",price:2.5,wager:100,winnings:0,payout:0},
  {id:786,date:"2024-12-01",status:"Won",league:"NFL",match:"Saints vs Rams",type:"Total Points",market:"Under 49",price:1.91,wager:100,winnings:90,payout:190},
  {id:787,date:"2024-12-01",status:"Lost",league:"NFL",match:"Bengals vs Steelers",type:"Total Points",market:"Under 46",price:1.91,wager:100,winnings:0,payout:0},
  {id:788,date:"2024-12-01",status:"Won",league:"NFL",match:"Falcons vs Chargers",type:"Total Points",market:"Under 47",price:1.91,wager:100,winnings:90,payout:190},
  {id:789,date:"2024-12-01",status:"Won",league:"NFL",match:"Falcons vs Chargers",type:"Spread",market:"Chargers -1",price:1.91,wager:100,winnings:90,payout:190},
  {id:790,date:"2024-12-01",status:"Lost",league:"NFL",match:"Jaguars vs Texans",type:"Spread",market:"Texans -3.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:791,date:"2024-12-01",status:"Lost",league:"NFL",match:"Bengals vs Steelers",type:"Spread",market:"Bengals -3",price:1.91,wager:250,winnings:0,payout:0},
  {id:792,date:"2024-12-01",status:"Won",league:"NFL",match:"Bills vs 49ers",type:"Total Points",market:"Over 44.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:793,date:"2024-12-01",status:"Lost",league:"NFL",match:"Jaguars vs Texans",type:"Spread",market:"Texans -3.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:794,date:"2024-11-30",status:"Won",league:"NCAA",match:"7 Texas A&M vs. Texas",type:"Spread",market:"Texas -4.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:795,date:"2024-11-30",status:"Won",league:"NCAA",match:"7 Texas A&M vs. Texas",type:"Spread",market:"Texas -4",price:1.91,wager:100,winnings:90,payout:190},
  {id:796,date:"2024-11-30",status:"Lost",league:"NCAA",match:"USC vs. #9 Notre Dame",type:"To Win",market:"USC",price:3.5,wager:100,winnings:0,payout:0},
  {id:797,date:"2024-11-30",status:"Won",league:"NCAA",match:"9 Alabama vs. Auburn",type:"Spread",market:"9 Alabama -11",price:1.91,wager:200,winnings:181,payout:381},
  {id:798,date:"2024-11-30",status:"Lost",league:"NCAA",match:"2 Ohio State vs. Michigan",type:"Total Points",market:"Over 42",price:1.87,wager:250,winnings:0,payout:0},
  {id:799,date:"2024-11-29",status:"Lost",league:"NFL",match:"Chiefs vs Raiders",type:"Total Points",market:"Over 42",price:1.91,wager:150,winnings:0,payout:0},
  {id:800,date:"2024-11-28",status:"Lost",league:"NFL",match:"Packers vs Dolphins",type:"Spread",market:"Packers -15.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:801,date:"2024-11-28",status:"Push",league:"NFL",match:"Packers vs Dolphins",type:"Total Points",market:"Under 47",price:1.0,wager:100,winnings:0,payout:100},
  {id:802,date:"2024-11-28",status:"Won",league:"NFL",match:"Packers vs Dolphins",type:"Total Points",market:"Under 47.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:803,date:"2024-11-28",status:"Cashed Out",league:"NFL",match:"Packers vs Dolphins",type:"Total Points",market:"Under 47.5",price:1.91,wager:250,winnings:0,payout:250},
  {id:804,date:"2024-11-28",status:"Lost",league:"NFL",match:"Lions vs Bears",type:"Spread",market:"Lions -10",price:1.95,wager:250,winnings:0,payout:0},
  {id:805,date:"2024-11-28",status:"Lost",league:"NFL",match:"Lions vs Bears, Lions vs Bears,",type:"MULTIPLE",market:"MULTIPLE",price:3.0,wager:150,winnings:0,payout:0},
  {id:806,date:"2024-11-27",status:"Lost",league:"NCAA",match:"Dayton vs. #6 Connecticut",type:"Spread",market:"#6 Connecticut -8",price:1.91,wager:500,winnings:0,payout:0},
  {id:807,date:"2024-11-26",status:"Won",league:"NCAA",match:"#14 Kansas vs. #1 Duke",type:"To Win",market:"#14 Kansas",price:2.5,wager:100,winnings:150,payout:250},
  {id:808,date:"2024-11-26",status:"Won",league:"NCAA",match:"Dayton vs. #4 Iowa State",type:"Spread",market:"Dayton +9.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:809,date:"2024-11-25",status:"Won",league:"NFL",match:"Chargers vs Ravens",type:"Spread",market:"Ravens -2.5",price:1.87,wager:274,winnings:238,payout:512},
  {id:810,date:"2024-11-24",status:"Won",league:"NFL",match:"Rams vs Eagles",type:"Spread",market:"Eagles -3",price:1.95,wager:500,winnings:476,payout:976},
  {id:811,date:"2024-11-24",status:"Lost",league:"NFL",match:"Packers vs 49ers",type:"To Win",market:"49ers",price:3.25,wager:100,winnings:0,payout:0},
  {id:812,date:"2024-11-24",status:"Lost",league:"NFL",match:"Packers vs 49ers",type:"To Win",market:"49ers",price:3.4,wager:250,winnings:0,payout:0},
  {id:813,date:"2024-11-24",status:"Lost",league:"NFL",match:"Packers vs 49ers",type:"To Win",market:"49ers",price:3.4,wager:250,winnings:0,payout:0},
  {id:814,date:"2024-11-24",status:"Won",league:"NFL",match:"Rams vs Eagles",type:"Spread",market:"Eagles -3",price:2.0,wager:27,winnings:27,payout:55},
  {id:815,date:"2024-11-24",status:"Won",league:"NFL",match:"Rams vs Eagles",type:"Spread",market:"Eagles -3",price:2.0,wager:300,winnings:300,payout:600},
  {id:816,date:"2024-11-24",status:"Lost",league:"NFL",match:"Commanders vs Cowboys",type:"Total Points",market:"Under 45",price:1.91,wager:100,winnings:0,payout:0},
  {id:817,date:"2024-11-24",status:"Won",league:"NFL",match:"Packers vs 49ers",type:"Total Points",market:"Over 44.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:818,date:"2024-11-24",status:"Won",league:"NFL",match:"Seahawks vs Cardinals",type:"Total Points",market:"Under 47.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:819,date:"2024-11-24",status:"Won",league:"NFL",match:"Raiders vs Broncos",type:"Total Points",market:"Over 41.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:820,date:"2024-11-24",status:"Lost",league:"NFL",match:"Texans vs Titans",type:"Spread",market:"Texans -7.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:821,date:"2024-11-24",status:"Won",league:"NFL",match:"Bears vs Vikings",type:"Total Points",market:"Over 39",price:1.91,wager:100,winnings:90,payout:190},
  {id:822,date:"2024-11-24",status:"Lost",league:"NFL",match:"Panthers vs Chiefs",type:"Spread",market:"Chiefs -10.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:823,date:"2024-11-24",status:"Won",league:"NFL",match:"Colts vs Lions",type:"Spread",market:"Lions -7",price:1.87,wager:250,winnings:217,payout:467},
  {id:824,date:"2024-11-23",status:"Lost",league:"NCAA",match:"Auburn vs. 7 Texas A&M",type:"Spread",market:"7 Texas A&M -1",price:1.91,wager:150,winnings:0,payout:0},
  {id:825,date:"2024-11-23",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. 9 Alabama",type:"Total Points",market:"Over 46",price:1.91,wager:100,winnings:0,payout:0},
  {id:826,date:"2024-11-23",status:"Won",league:"NCAA",match:"#9 Notre Dame vs. Army",type:"Spread",market:"#9 Notre Dame -14",price:1.91,wager:250,winnings:227,payout:477},
  {id:827,date:"2024-11-23",status:"Lost",league:"NCAA",match:"Minnesota vs. Penn State",type:"Spread",market:"Penn State -11.5",price:1.91,wager:150,winnings:0,payout:0},
  {id:828,date:"2024-11-23",status:"Lost",league:"NCAA",match:"#9 Notre Dame vs. Army, #9 Notre Dame vs. Army, 8 Oklahoma vs. 9 Alabama, Auburn vs. 7 Texas A&M, 8 Oklahoma vs. 9 Alabama, Auburn vs. 7 Texas A&M,",type:"MULTIPLE",market:"MULTIPLE",price:14.1,wager:50,winnings:0,payout:0},
  {id:829,date:"2024-11-22",status:"Won",league:"NCAA",match:"2 Ohio State vs. 1 Indiana",type:"Spread",market:"2 Ohio State -11",price:1.91,wager:500,winnings:454,payout:954},
  {id:830,date:"2024-11-21",status:"Lost",league:"NFL",match:"Browns vs Steelers",type:"Total Points",market:"Under 32",price:1.87,wager:250,winnings:0,payout:0},
  {id:831,date:"2024-11-21",status:"Lost",league:"NFL",match:"Browns vs Steelers, Browns vs Steelers, Browns vs Steelers,",type:"MULTIPLE",market:"MULTIPLE",price:5.0,wager:125,winnings:0,payout:0},
  {id:832,date:"2024-11-20",status:"Lost",league:"NCAA",match:"#17 Alabama vs. #10 Illinois",type:"Spread",market:"#17 Alabama -15.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:833,date:"2024-11-20",status:"Won",league:"NCAA",match:"Dayton vs. New Mexico State",type:"Spread",market:"Dayton -18.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:834,date:"2024-11-18",status:"Won",league:"NFL",match:"Cowboys vs Texans",type:"Spread",market:"Texans -8",price:2.0,wager:250,winnings:250,payout:500},
  {id:835,date:"2024-11-18",status:"Won",league:"NFL",match:"Cowboys vs Texans",type:"Spread",market:"Texans -7",price:1.87,wager:250,winnings:217,payout:467},
  {id:836,date:"2024-11-17",status:"Lost",league:"NFL",match:"Chargers vs Bengals",type:"To Win",market:"Bengals",price:3.6,wager:100,winnings:0,payout:0},
  {id:837,date:"2024-11-17",status:"Lost",league:"NFL",match:"Chargers vs Bengals",type:"To Win",market:"Bengals",price:1.95,wager:250,winnings:0,payout:0},
  {id:838,date:"2024-11-17",status:"Lost",league:"NFL",match:"Chargers vs Bengals",type:"Total Points",market:"Under 48.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:839,date:"2024-11-17",status:"Lost",league:"NFL",match:"Bills vs Chiefs",type:"To Win",market:"Chiefs",price:2.2,wager:250,winnings:0,payout:0},
  {id:840,date:"2024-11-17",status:"Cashed Out",league:"NFL",match:"Bills vs Chiefs",type:"Spread",market:"Chiefs +2.5",price:2.0,wager:250,winnings:0,payout:250},
  {id:841,date:"2024-11-17",status:"Won",league:"NFL",match:"49ers vs Seahawks",type:"Total Points",market:"Under 49",price:1.87,wager:250,winnings:217,payout:467},
  {id:842,date:"2024-11-17",status:"Lost",league:"NFL",match:"Broncos vs Falcons",type:"Total Points",market:"Over 44.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:843,date:"2024-11-17",status:"Won",league:"NFL",match:"Dolphins vs Raiders",type:"Spread",market:"Dolphins -8",price:1.91,wager:250,winnings:227,payout:477},
  {id:844,date:"2024-11-17",status:"Lost",league:"NFL",match:"Bears vs Packers",type:"Total Points",market:"Over 40.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:845,date:"2024-11-17",status:"Lost",league:"NFL",match:"Saints vs Browns",type:"Spread",market:"Browns -1.5",price:1.91,wager:150,winnings:0,payout:0},
  {id:846,date:"2024-11-17",status:"Won",league:"NFL",match:"Bills vs Chiefs",type:"Total Points",market:"Over 46.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:847,date:"2024-11-17",status:"Won",league:"NFL",match:"Steelers vs Ravens",type:"Total Points",market:"Under 48",price:1.95,wager:252,winnings:240,payout:492},
  {id:848,date:"2024-11-16",status:"Lost",league:"NCAA",match:"Wisconsin vs. 5 Oregon",type:"Spread",market:"5 Oregon -16.5",price:2.15,wager:150,winnings:0,payout:0},
  {id:849,date:"2024-11-16",status:"Won",league:"NCAA",match:"3 Georgia vs. Tennessee",type:"Total Points",market:"Over 47.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:850,date:"2024-11-16",status:"Lost",league:"NCAA",match:"Purdue vs. Penn State",type:"Spread",market:"Purdue +30",price:1.91,wager:100,winnings:0,payout:0},
  {id:851,date:"2024-11-16",status:"Won",league:"NCAA",match:"9 Alabama vs. Mercer",type:"Spread",market:"9 Alabama -42",price:1.87,wager:200,winnings:173,payout:373},
  {id:852,date:"2024-11-16",status:"Won",league:"NCAA",match:"Northwestern vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -23.5",price:1.83,wager:250,winnings:208,payout:458},
  {id:853,date:"2024-11-15",status:"Lost",league:"International Matchups",match:"J. Paul vs. M. Tyson",type:"Total Rounds",market:"Under 6.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:854,date:"2024-11-14",status:"Won",league:"NFL",match:"Eagles vs Commanders",type:"Total Points",market:"Under 49.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:855,date:"2024-11-11",status:"Won",league:"NFL",match:"Rams vs Dolphins",type:"Total Points",market:"Under 49",price:1.91,wager:200,winnings:181,payout:381},
  {id:856,date:"2024-11-11",status:"Won",league:"NFL",match:"Rams vs Dolphins",type:"Total Points",market:"Under 49",price:1.91,wager:250,winnings:227,payout:477},
  {id:857,date:"2024-11-10",status:"Push",league:"NFL",match:"Texans vs Lions",type:"Total Points",market:"Over 49",price:1.0,wager:250,winnings:0,payout:250},
  {id:858,date:"2024-11-10",status:"Won",league:"NFL",match:"Chargers vs Titans",type:"Spread",market:"Chargers -8",price:1.91,wager:125,winnings:113,payout:238},
  {id:859,date:"2024-11-10",status:"Push",league:"NFL",match:"Texans vs Lions",type:"Spread",market:"Lions -3",price:1.0,wager:250,winnings:0,payout:250},
  {id:860,date:"2024-11-10",status:"Lost",league:"NFL",match:"Cowboys vs Eagles",type:"Total Points",market:"Over 44",price:1.87,wager:250,winnings:0,payout:0},
  {id:861,date:"2024-11-10",status:"Lost",league:"NFL",match:"Chiefs vs Broncos",type:"Spread",market:"Chiefs -8",price:1.87,wager:250,winnings:0,payout:0},
  {id:862,date:"2024-11-10",status:"Won",league:"NFL",match:"Colts vs Bills",type:"Spread",market:"Bills -4.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:863,date:"2024-11-10",status:"Lost",league:"NFL",match:"Buccaneers vs 49ers",type:"Spread",market:"49ers -4",price:1.59,wager:250,winnings:0,payout:0},
  {id:864,date:"2024-11-10",status:"Won",league:"NFL",match:"Colts vs Bills",type:"Spread",market:"Bills -4.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:865,date:"2024-11-10",status:"Lost",league:"NFL",match:"Chiefs vs Broncos",type:"Total Points",market:"Over 42.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:866,date:"2024-11-10",status:"Lost",league:"NFL",match:"Saints vs Falcons",type:"Spread",market:"Falcons -3.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:867,date:"2024-11-10",status:"Won",league:"NFL",match:"Panthers vs Giants",type:"Total Points",market:"Under 40",price:1.95,wager:100,winnings:95,payout:195},
  {id:868,date:"2024-11-09",status:"Won",league:"NCAA",match:"Dayton vs. Northwestern",type:"Spread",market:"Dayton -3.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:869,date:"2024-11-09",status:"Lost",league:"NCAA",match:"1 Indiana vs. Michigan",type:"To Win",market:"Michigan",price:6.25,wager:50,winnings:0,payout:0},
  {id:870,date:"2024-11-09",status:"Won",league:"NCAA",match:"LSU vs. 9 Alabama",type:"Spread",market:"9 Alabama -2.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:871,date:"2024-11-09",status:"Lost",league:"NCAA",match:"5 Oregon vs. Maryland",type:"Spread",market:"5 Oregon -23.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:872,date:"2024-11-09",status:"Lost",league:"NCAA",match:"6 Ole Miss vs. 3 Georgia",type:"Spread",market:"3 Georgia -2",price:1.91,wager:100,winnings:0,payout:0},
  {id:873,date:"2024-11-09",status:"Won",league:"NCAA",match:"1 Indiana vs. Michigan",type:"Spread",market:"Michigan +14.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:874,date:"2024-11-09",status:"Lost",league:"NCAA",match:"Georgia Tech vs. 10 Miami (FL)",type:"Spread",market:"10 Miami (FL) -9.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:875,date:"2024-11-04",status:"Lost",league:"NFL",match:"Chiefs vs Buccaneers",type:"Spread",market:"Chiefs -8.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:876,date:"2024-11-03",status:"Won",league:"NFL",match:"Vikings vs Colts",type:"Spread",market:"Vikings -6",price:1.91,wager:375,winnings:340,payout:715},
  {id:877,date:"2024-11-03",status:"Won",league:"NFL",match:"Vikings vs Colts",type:"Spread",market:"Vikings -5.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:878,date:"2024-11-03",status:"Won",league:"NFL",match:"Seahawks vs Rams",type:"Spread",market:"Rams -3",price:1.91,wager:100,winnings:90,payout:190},
  {id:879,date:"2024-11-03",status:"Lost",league:"NFL",match:"Eagles vs Jaguars",type:"Spread",market:"Eagles -6",price:1.83,wager:100,winnings:0,payout:0},
  {id:880,date:"2024-11-03",status:"Lost",league:"NFL",match:"Falcons vs Cowboys",type:"To Win",market:"Cowboys",price:2.45,wager:50,winnings:0,payout:0},
  {id:881,date:"2024-11-03",status:"Lost",league:"NFL",match:"Bills vs Dolphins",type:"Spread",market:"Bills -6",price:1.87,wager:100,winnings:0,payout:0},
  {id:882,date:"2024-11-03",status:"Won",league:"NFL",match:"Packers vs Lions",type:"Spread",market:"Lions -2.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:883,date:"2024-11-03",status:"Lost",league:"NFL",match:"Cardinals vs Bears",type:"Total Points",market:"Over 44.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:884,date:"2024-11-03",status:"Won",league:"NFL",match:"Packers vs Lions",type:"Spread",market:"Lions -2.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:885,date:"2024-11-03",status:"Lost",league:"NFL",match:"Bills vs Dolphins",type:"Spread",market:"Bills -6",price:1.87,wager:200,winnings:0,payout:0},
  {id:886,date:"2024-11-03",status:"Lost",league:"NFL",match:"Falcons vs Cowboys",type:"To Win",market:"Cowboys",price:2.45,wager:100,winnings:0,payout:0},
  {id:887,date:"2024-11-02",status:"Lost",league:"NCAA",match:"3 Georgia vs. Florida",type:"Spread",market:"3 Georgia -15",price:1.91,wager:200,winnings:0,payout:0},
  {id:888,date:"2024-11-02",status:"Won",league:"NCAA",match:"Penn State vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -3",price:1.87,wager:250,winnings:217,payout:467},
  {id:889,date:"2024-10-31",status:"Lost",league:"NFL",match:"Jets vs Texans",type:"To Win",market:"Texans",price:2.6,wager:100,winnings:0,payout:0},
  {id:890,date:"2024-10-31",status:"Lost",league:"NFL",match:"Jets vs Texans",type:"To Win",market:"Texans",price:2.4,wager:200,winnings:0,payout:0},
  {id:891,date:"2024-10-29",status:"Won",league:"MLB",match:"Yankees vs. Dodgers",type:"Spread",market:"Yankees -1.5",price:2.45,wager:100,winnings:145,payout:245},
  {id:892,date:"2024-10-28",status:"Won",league:"NFL",match:"Steelers vs Giants",type:"Total Points",market:"Over 37",price:1.91,wager:150,winnings:136,payout:300},
  {id:893,date:"2024-10-27",status:"Won",league:"NFL",match:"49ers vs Cowboys",type:"Spread",market:"49ers -5.5",price:1.91,wager:275,winnings:250,payout:525},
  {id:894,date:"2024-10-27",status:"Lost",league:"NFL",match:"Raiders vs Chiefs",type:"Spread",market:"Chiefs -8",price:1.91,wager:250,winnings:0,payout:0},
  {id:895,date:"2024-10-27",status:"Lost",league:"NFL",match:"Dolphins vs Cardinals",type:"Spread",market:"Dolphins -5.5",price:1.77,wager:100,winnings:0,payout:0},
  {id:896,date:"2024-10-27",status:"Lost",league:"NFL",match:"Browns vs Ravens",type:"Spread",market:"Ravens -5.5",price:1.71,wager:100,winnings:0,payout:0},
  {id:897,date:"2024-10-27",status:"Lost",league:"NFL",match:"Bengals vs Eagles",type:"Spread",market:"Bengals -3",price:1.91,wager:100,winnings:0,payout:0},
  {id:898,date:"2024-10-27",status:"Won",league:"NFL",match:"49ers vs Cowboys",type:"Total Points",market:"Over 48",price:1.91,wager:100,winnings:90,payout:190},
  {id:899,date:"2024-10-27",status:"Won",league:"NFL",match:"Raiders vs Chiefs",type:"Total Points",market:"Over 42.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:900,date:"2024-10-27",status:"Won",league:"NFL",match:"Seahawks vs Bills",type:"Spread",market:"Bills -3",price:1.91,wager:250,winnings:227,payout:500},
  {id:901,date:"2024-10-27",status:"Won",league:"NFL",match:"Bengals vs Eagles",type:"Total Points",market:"Over 47.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:902,date:"2024-10-27",status:"Lost",league:"NFL",match:"Texans vs Colts",type:"Spread",market:"Texans -5",price:1.91,wager:250,winnings:0,payout:0},
  {id:903,date:"2024-10-27",status:"Lost",league:"NFL",match:"Jaguars vs Packers",type:"Spread",market:"Packers -3.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:904,date:"2024-10-27",status:"Won",league:"NFL",match:"Buccaneers vs Falcons",type:"Spread",market:"Falcons -1.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:905,date:"2024-10-26",status:"Won",league:"NCAA",match:"7 Texas A&M vs. LSU",type:"Total Points",market:"Over 54.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:906,date:"2024-10-26",status:"Lost",league:"NCAA",match:"Vanderbilt vs. Texas",type:"Spread",market:"Texas -17.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:907,date:"2024-10-26",status:"Lost",league:"NCAA",match:"5 Oregon vs. Illinois",type:"Total Points",market:"Over 54.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:908,date:"2024-10-26",status:"Lost",league:"NCAA",match:"2 Ohio State vs. Nebraska",type:"Spread",market:"2 Ohio State -25.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:909,date:"2024-10-24",status:"Won",league:"NFL",match:"Rams vs Vikings",type:"Total Points",market:"Under 56.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:910,date:"2024-10-21",status:"Lost",league:"NFL",match:"Cardinals vs Chargers",type:"Spread",market:"Chargers -1",price:1.91,wager:100,winnings:0,payout:0},
  {id:911,date:"2024-10-21",status:"Lost",league:"NFL",match:"Buccaneers vs Ravens",type:"Total Points",market:"Under 50.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:912,date:"2024-10-20",status:"Lost",league:"NFL",match:"Steelers vs Jets",type:"Spread",market:"Jets -2.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:913,date:"2024-10-20",status:"Won",league:"NFL",match:"49ers vs Chiefs",type:"To Win",market:"Chiefs",price:2.2,wager:250,winnings:300,payout:550},
  {id:914,date:"2024-10-20",status:"Lost",league:"NFL",match:"Steelers vs Jets",type:"Spread",market:"Jets -2.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:915,date:"2024-10-20",status:"Lost",league:"NFL",match:"Cardinals vs Chargers",type:"Spread",market:"Chargers -2",price:1.91,wager:100,winnings:0,payout:0},
  {id:916,date:"2024-10-20",status:"Won",league:"NFL",match:"49ers vs Chiefs",type:"Spread",market:"Chiefs +2",price:1.91,wager:250,winnings:227,payout:500},
  {id:917,date:"2024-10-20",status:"Won",league:"NFL",match:"Giants vs Eagles",type:"Spread",market:"Eagles -3",price:1.91,wager:250,winnings:227,payout:477},
  {id:918,date:"2024-10-20",status:"Won",league:"NFL",match:"Bills vs Titans",type:"Spread",market:"Bills -9.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:919,date:"2024-10-20",status:"Lost",league:"NFL",match:"Browns vs Bengals",type:"Total Points",market:"Over 41.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:920,date:"2024-10-20",status:"Lost",league:"NFL",match:"Jaguars vs Patriots",type:"Total Points",market:"Under 42.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:921,date:"2024-10-19",status:"Won",league:"NCAA",match:"Texas vs. 3 Georgia",type:"Total Points",market:"Under 51.5",price:1.83,wager:100,winnings:83,payout:183},
  {id:922,date:"2024-10-19",status:"Lost",league:"NCAA",match:"Tennessee vs. 9 Alabama",type:"Spread",market:"9 Alabama -3.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:923,date:"2024-10-19",status:"Lost",league:"NCAA",match:"Louisville vs. 10 Miami (FL)",type:"Spread",market:"10 Miami (FL) -8.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:924,date:"2024-10-15",status:"Lost",league:"NFL",match:"Saints vs Broncos",type:"To Win",market:"Saints",price:2.05,wager:200,winnings:0,payout:0},
  {id:925,date:"2024-10-15",status:"Cashed Out",league:"NFL",match:"Saints vs Broncos",type:"Spread",market:"Saints +1.5",price:1.91,wager:250,winnings:0,payout:250},
  {id:926,date:"2024-10-14",status:"Won",league:"NFL",match:"Jets vs Bills",type:"Spread",market:"Bills -1",price:1.91,wager:100,winnings:90,payout:190},
  {id:927,date:"2024-10-14",status:"Won",league:"NFL",match:"Jets vs Bills",type:"Spread",market:"Bills -1.5",price:1.87,wager:250,winnings:217,payout:489},
  {id:928,date:"2024-10-13",status:"Push",league:"NFL",match:"Titans vs Colts",type:"Spread",market:"Titans +3",price:1.0,wager:36,winnings:0,payout:36},
  {id:929,date:"2024-10-13",status:"Won",league:"NFL",match:"Patriots vs Texans",type:"Spread",market:"Texans -15",price:1.87,wager:100,winnings:86,payout:186},
  {id:930,date:"2024-10-13",status:"Won",league:"NFL",match:"Giants vs Bengals",type:"Spread",market:"Bengals -3.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:931,date:"2024-10-13",status:"Won",league:"NFL",match:"Panthers vs Falcons",type:"Spread",market:"Falcons -5.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:932,date:"2024-10-13",status:"Won",league:"NFL",match:"Ravens vs Commanders",type:"Spread",market:"Ravens -6.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:933,date:"2024-10-13",status:"Won",league:"NFL",match:"Broncos vs Chargers",type:"Total Points",market:"Over 35.5",price:1.91,wager:100,winnings:90,payout:200},
  {id:934,date:"2024-10-12",status:"Won",league:"NCAA",match:"Colorado vs. Kansas State",type:"Total Points",market:"Over 55",price:1.87,wager:100,winnings:86,payout:186},
  {id:935,date:"2024-10-12",status:"Lost",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -3.5",price:1.95,wager:150,winnings:0,payout:0},
  {id:936,date:"2024-10-12",status:"Lost",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -3.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:937,date:"2024-10-12",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. Texas",type:"Total Points",market:"Over 48.5",price:1.91,wager:70,winnings:0,payout:0},
  {id:938,date:"2024-10-12",status:"Lost",league:"NCAA",match:"Pittsburgh vs. California",type:"To Win",market:"California",price:2.4,wager:100,winnings:0,payout:0},
  {id:939,date:"2024-10-12",status:"Won",league:"NCAA",match:"UMass vs. Missouri",type:"Spread",market:"Missouri -27.5",price:1.91,wager:89,winnings:81,payout:170},
  {id:940,date:"2024-10-12",status:"Lost",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -3",price:1.91,wager:250,winnings:0,payout:0},
  {id:941,date:"2024-10-12",status:"Cashed Out",league:"NCAA",match:"5 Oregon vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -3",price:1.91,wager:250,winnings:0,payout:250},
  {id:942,date:"2024-10-12",status:"Lost",league:"NCAA",match:"USC vs. Penn State",type:"Spread",market:"Penn State -3.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:943,date:"2024-10-12",status:"Lost",league:"NCAA",match:"8 Oklahoma vs. Texas",type:"Total Points",market:"Over 49.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:944,date:"2024-10-10",status:"Won",league:"NFL",match:"Giants vs Bengals",type:"Spread",market:"Bengals -3.5",price:1.91,wager:750,winnings:681,payout:1431},
  {id:945,date:"2024-10-10",status:"Won",league:"NFL",match:"Seahawks vs 49ers",type:"Spread",market:"49ers -3.5",price:1.87,wager:250,winnings:217,payout:489},
  {id:946,date:"2024-10-07",status:"Won",league:"NFL",match:"Chiefs vs Saints",type:"Spread",market:"Chiefs -5.5",price:1.91,wager:550,winnings:500,payout:1050},
  {id:947,date:"2024-10-05",status:"Won",league:"NFL",match:"Steelers vs Cowboys",type:"To Win",market:"Cowboys",price:2.2,wager:250,winnings:300,payout:550},
  {id:948,date:"2024-10-05",status:"Lost",league:"NFL",match:"49ers vs Cardinals",type:"Spread",market:"49ers -7",price:1.87,wager:130,winnings:0,payout:0},
  {id:949,date:"2024-10-05",status:"Lost",league:"NCAA",match:"Minnesota vs. USC",type:"Spread",market:"USC -9.5",price:1.83,wager:250,winnings:0,payout:0},
  {id:950,date:"2024-10-05",status:"Lost",league:"NCAA",match:"Washington vs. Michigan",type:"Spread",market:"Michigan -0.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:951,date:"2024-10-05",status:"Lost",league:"NCAA",match:"Vanderbilt vs. 9 Alabama",type:"Spread",market:"9 Alabama -22",price:1.91,wager:250,winnings:0,payout:0},
  {id:952,date:"2024-10-05",status:"Lost",league:"NCAA",match:"3 Georgia vs. Auburn",type:"Spread",market:"3 Georgia -21",price:1.91,wager:250,winnings:0,payout:0},
  {id:953,date:"2024-10-05",status:"Won",league:"NCAA",match:"2 Ohio State vs. Iowa",type:"Spread",market:"2 Ohio State -17",price:1.87,wager:250,winnings:217,payout:489},
  {id:954,date:"2024-10-05",status:"Won",league:"NCAA",match:"Wisconsin vs. Purdue",type:"Spread",market:"Wisconsin -11.5",price:1.83,wager:250,winnings:208,payout:479},
  {id:955,date:"2024-10-03",status:"Won",league:"NFL",match:"Falcons vs Buccaneers",type:"Total Points",market:"Over 44",price:1.91,wager:250,winnings:227,payout:477},
  {id:956,date:"2024-09-29",status:"Won",league:"NFL",match:"Lions vs Seahawks",type:"Spread",market:"Lions -4",price:1.91,wager:100,winnings:90,payout:190},
  {id:957,date:"2024-09-29",status:"Lost",league:"NFL",match:"Ravens vs Bills",type:"Total Points",market:"Over 46",price:1.91,wager:100,winnings:0,payout:0},
  {id:958,date:"2024-09-29",status:"Won",league:"NFL",match:"49ers vs Patriots",type:"Spread",market:"49ers -10.5",price:1.87,wager:115,winnings:100,payout:216},
  {id:959,date:"2024-09-29",status:"Lost",league:"NFL",match:"Chargers vs Chiefs, Chargers vs Chiefs,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:250,winnings:0,payout:0},
  {id:960,date:"2024-09-29",status:"Cashed Out",league:"NFL",match:"Chargers vs Chiefs",type:"Spread",market:"Chiefs -7.5",price:1.95,wager:250,winnings:0,payout:250},
  {id:961,date:"2024-09-29",status:"Lost",league:"NFL",match:"Buccaneers vs Eagles",type:"Spread",market:"Eagles -1.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:962,date:"2024-09-28",status:"Lost",league:"NCAA",match:"9 Alabama vs. 3 Georgia",type:"Spread",market:"3 Georgia -1.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:963,date:"2024-09-28",status:"Lost",league:"NFL",match:"Panthers vs Bengals",type:"Andy Dalton - Passing Yards",market:"Over 227.5",price:1.87,wager:75,winnings:0,payout:0},
  {id:964,date:"2024-09-28",status:"Lost",league:"NCAA",match:"USC vs. Wisconsin, USC vs. Wisconsin,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:100,winnings:0,payout:0},
  {id:965,date:"2024-09-28",status:"Cashed Out",league:"NCAA",match:"USC vs. Wisconsin",type:"Spread",market:"Wisconsin +14.5",price:1.91,wager:100,winnings:0,payout:100},
  {id:966,date:"2024-09-28",status:"Lost",league:"NCAA",match:"7 Texas A&M vs. Arkansas",type:"Spread",market:"7 Texas A&M -6.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:967,date:"2024-09-28",status:"Lost",league:"NCAA",match:"Michigan vs. Minnesota",type:"Spread",market:"Michigan -24.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:968,date:"2024-09-28",status:"Won",league:"NCAA",match:"LSU vs. South Alabama",type:"Spread",market:"LSU -20.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:969,date:"2024-09-28",status:"Cashed Out",league:"NCAA",match:"USC vs. Wisconsin",type:"Total Points",market:"Under 50",price:1.91,wager:100,winnings:0,payout:100},
  {id:970,date:"2024-09-28",status:"Won",league:"NCAA",match:"Michigan State vs. 2 Ohio State",type:"Spread",market:"2 Ohio State -23.5",price:1.91,wager:250,winnings:227,payout:500},
  {id:971,date:"2024-09-26",status:"Push",league:"NFL",match:"Giants vs Cowboys",type:"Spread",market:"Cowboys -5",price:1.0,wager:250,winnings:0,payout:250},
  {id:972,date:"2024-09-26",status:"Lost",league:"NFL",match:"Texans vs Jaguars",type:"Total Points",market:"Over 45.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:973,date:"2024-09-26",status:"Won",league:"NFL",match:"Panthers vs Bengals",type:"Spread",market:"Bengals -4.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:974,date:"2024-09-16",status:"Lost",league:"NFL",match:"Eagles vs Falcons",type:"Spread",market:"Eagles -5.5",price:1.91,wager:1000,winnings:0,payout:0},
  {id:975,date:"2024-09-16",status:"Lost",league:"NFL",match:"Eagles vs Falcons",type:"Spread",market:"Eagles -5.5",price:1.91,wager:158,winnings:0,payout:0},
  {id:976,date:"2024-09-15",status:"Lost",league:"NFL",match:"Texans vs Bears",type:"Spread",market:"Texans -6.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:977,date:"2024-09-15",status:"Lost",league:"NFL",match:"Texans vs Bears",type:"Spread",market:"Texans -6.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:978,date:"2024-09-15",status:"Lost",league:"NFL",match:"Texans vs Bears",type:"Spread",market:"Texans -6.5",price:1.95,wager:250,winnings:0,payout:0},
  {id:979,date:"2024-09-15",status:"Lost",league:"NFL",match:"Patriots vs Seahawks, Vikings vs 49ers, Ravens vs Raiders, Lions vs Buccaneers, Panthers vs Chargers, Cowboys vs Saints,",type:"MULTIPLE",market:"MULTIPLE",price:6.92,wager:100,winnings:0,payout:0},
  {id:980,date:"2024-09-15",status:"Lost",league:"NFL",match:"Chiefs vs Bengals",type:"To Win",market:"Bengals",price:3.4,wager:50,winnings:0,payout:0},
  {id:981,date:"2024-09-15",status:"Won",league:"NFL",match:"Jaguars vs Browns",type:"To Win",market:"Browns",price:2.45,wager:100,winnings:145,payout:245},
  {id:982,date:"2024-09-15",status:"Lost",league:"NFL",match:"Cowboys vs Saints",type:"Spread",market:"Cowboys -6.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:983,date:"2024-09-15",status:"Lost",league:"NFL",match:"Ravens vs Raiders",type:"Spread",market:"Ravens -8.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:984,date:"2024-09-15",status:"Won",league:"NFL",match:"Panthers vs Chargers",type:"Spread",market:"Chargers -5",price:1.91,wager:250,winnings:227,payout:477},
  {id:985,date:"2024-09-14",status:"Lost",league:"NCAA",match:"Wisconsin vs. 9 Alabama",type:"Total Points",market:"Under 45.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:986,date:"2024-09-12",status:"Lost",league:"NFL",match:"Dolphins vs Bills",type:"Total Points",market:"Over 48",price:1.91,wager:250,winnings:0,payout:0},
  {id:987,date:"2024-09-09",status:"Won",league:"NFL",match:"49ers vs Jets",type:"Total Points",market:"Over 42",price:1.91,wager:250,winnings:227,payout:477},
  {id:988,date:"2024-09-08",status:"Lost",league:"NFL",match:"Lions vs Rams",type:"To Win",market:"Rams",price:3.0,wager:100,winnings:0,payout:0},
  {id:989,date:"2024-09-08",status:"Cashed Out",league:"NFL",match:"Lions vs Rams",type:"Spread",market:"Rams +5",price:1.87,wager:100,winnings:0,payout:100},
  {id:990,date:"2024-09-08",status:"Lost",league:"NFL",match:"Lions vs Rams",type:"Total Points",market:"Over 53",price:1.91,wager:250,winnings:0,payout:0},
  {id:991,date:"2024-09-08",status:"Won",league:"NFL",match:"Buccaneers vs Commanders",type:"Spread",market:"Buccaneers -3.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:992,date:"2024-09-08",status:"Won",league:"NFL",match:"Browns vs Cowboys",type:"To Win",market:"Cowboys",price:2.1,wager:100,winnings:110,payout:210},
  {id:993,date:"2024-09-08",status:"Push",league:"NFL",match:"Bengals vs Patriots",type:"Spread",market:"Bengals +6",price:1.0,wager:250,winnings:0,payout:250},
  {id:994,date:"2024-09-08",status:"Lost",league:"NFL",match:"Bills vs Cardinals",type:"Spread",market:"Bills -6.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:995,date:"2024-09-08",status:"Lost",league:"NFL",match:"Dolphins vs Jaguars",type:"Spread",market:"Dolphins -3.5",price:1.95,wager:500,winnings:0,payout:0},
  {id:996,date:"2024-09-08",status:"Lost",league:"NFL",match:"Bengals vs Patriots",type:"Spread",market:"Bengals -8",price:1.91,wager:150,winnings:0,payout:0},
  {id:997,date:"2024-09-08",status:"Lost",league:"NFL",match:"Bengals vs Patriots, Dolphins vs Jaguars, Saints vs Panthers, Bills vs Cardinals,",type:"SYSTEM 2",market:"SYSTEM 2",price:21.66,wager:600,winnings:0,payout:0},
  {id:998,date:"2024-09-07",status:"Lost",league:"NCAA",match:"#9 Notre Dame vs. Northern Illinois",type:"Spread",market:"#9 Notre Dame -8.5",price:2.05,wager:100,winnings:0,payout:0},
  {id:999,date:"2024-09-07",status:"Won",league:"NCAA",match:"Penn State vs. Bowling Green",type:"Spread",market:"Penn State -3.5",price:2.05,wager:100,winnings:105,payout:205},
  {id:1000,date:"2024-09-07",status:"Won",league:"NCAA",match:"2 Ohio State vs. Western Michigan",type:"Spread",market:"2 Ohio State -37.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1001,date:"2024-09-07",status:"Lost",league:"NCAA",match:"9 Alabama vs. South Florida",type:"Spread",market:"9 Alabama -31",price:1.91,wager:50,winnings:0,payout:0},
  {id:1002,date:"2024-09-07",status:"Won",league:"NCAA",match:"Michigan vs. Texas",type:"Total Points",market:"Over 41.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1003,date:"2024-09-01",status:"Lost",league:"NFL",match:"NFL 24/25",type:"SB 59 - Winner",market:"Cincinnati Bengals",price:13.0,wager:50,winnings:0,payout:0},
  {id:1004,date:"2024-09-01",status:"Won",league:"NCAA",match:"USC vs. LSU",type:"Total Points",market:"Under 51.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:1005,date:"2024-09-01",status:"Lost",league:"NCAA",match:"USC vs. LSU",type:"Spread",market:"LSU -4.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1006,date:"2024-08-31",status:"Lost",league:"NCAA",match:"Michigan vs. Fresno State",type:"Spread",market:"Michigan -20.5",price:1.87,wager:250,winnings:0,payout:0},
  {id:1007,date:"2024-08-31",status:"Lost",league:"NCAA",match:"9 Alabama vs. Western Kentucky",type:"Total Points",market:"Under 60.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:1008,date:"2024-08-31",status:"Won",league:"NCAA",match:"7 Texas A&M vs. #9 Notre Dame",type:"Total Points",market:"Under 47.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1009,date:"2024-08-31",status:"Won",league:"NCAA",match:"Oklahoma State vs. South Dakota St",type:"Spread",market:"Oklahoma State -17.5",price:1.83,wager:250,winnings:208,payout:458},
  {id:1010,date:"2024-08-31",status:"Won",league:"NCAA",match:"West Virginia vs. Penn State",type:"Spread",market:"Penn State -10.5",price:1.95,wager:250,winnings:238,payout:488},
  {id:1011,date:"2024-08-31",status:"Won",league:"NCAA",match:"3 Georgia vs. Clemson",type:"Total Points",market:"Over 34.5",price:1.83,wager:250,winnings:208,payout:458},
  {id:1012,date:"2024-08-31",status:"Won",league:"NCAA",match:"3 Georgia vs. Clemson",type:"Spread",market:"3 Georgia -10.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1013,date:"2024-08-31",status:"Won",league:"NCAA",match:"Dayton vs. Saint Francis",type:"Spread",market:"Dayton +6.5",price:2.0,wager:50,winnings:50,payout:105},
  {id:1014,date:"2024-08-31",status:"Won",league:"NCAA",match:"3 Georgia vs. Clemson",type:"Spread",market:"3 Georgia -11.5",price:1.95,wager:500,winnings:476,payout:976},
  {id:1015,date:"2024-08-30",status:"Lost",league:"NCAA",match:"Wisconsin vs. Western Michigan",type:"Total Points",market:"Under 33.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1016,date:"2024-08-30",status:"Lost",league:"NCAA",match:"Stanford vs. TCU",type:"Total Points",market:"Under 60.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1017,date:"2024-08-30",status:"Lost",league:"NCAA",match:"Stanford vs. TCU",type:"Total Points",market:"Under 59.5",price:1.91,wager:50,winnings:0,payout:0},
  {id:1018,date:"2024-08-21",status:"Won",league:"NFL",match:"NFL 24/25",type:"Regular Season Wins - Buffalo Bills",market:"Over 10.5",price:2.25,wager:200,winnings:250,payout:450},
  {id:1019,date:"2024-08-10",status:"Lost",league:"NFL",match:"Bengals vs Buccaneers",type:"Total Points",market:"Over 38.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1020,date:"2024-08-10",status:"Lost",league:"Olympic Games",match:"France vs. USA",type:"Spread",market:"USA -12.5",price:1.95,wager:200,winnings:0,payout:0},
  {id:1021,date:"2024-08-10",status:"Won",league:"Olympic Tournament, Women",match:"Brazil (W) vs. USA (W)",type:"Game Result (90 Minutes + Stoppage Time)",market:"USA (W)",price:2.15,wager:250,winnings:287,payout:537},
  {id:1022,date:"2024-07-02",status:"Lost",league:"Copa America",match:"Brazil vs. Colombia",type:"Game Result (90 Minutes + Stoppage Time)",market:"Colombia",price:4.0,wager:100,winnings:0,payout:0},
  {id:1023,date:"2024-07-02",status:"Cashed Out",league:"Copa America",match:"Brazil vs. Colombia",type:"Game Result (90 Minutes + Stoppage Time)",market:"Colombia",price:4.0,wager:10,winnings:0,payout:10},
  {id:1024,date:"2024-06-29",status:"Lost",league:"Copa America",match:"Canada vs. Chile",type:"Game Result (90 Minutes + Stoppage Time)",market:"Chile",price:5.5,wager:100,winnings:0,payout:0},
  {id:1025,date:"2024-06-29",status:"Won",league:"Copa America",match:"Argentina vs. Peru",type:"Game Result (90 Minutes + Stoppage Time)",market:"Argentina",price:1.65,wager:250,winnings:161,payout:411},
  {id:1026,date:"2024-06-28",status:"Won",league:"Copa America",match:"Colombia vs. Costa Rica",type:"Spread",market:"Colombia -1.5",price:1.87,wager:100,winnings:86,payout:195},
  {id:1027,date:"2024-06-24",status:"Lost",league:"NHL",match:"Panthers vs. Oilers",type:"Spread",market:"Panthers -1.5",price:3.2,wager:100,winnings:0,payout:0},
  {id:1028,date:"2024-06-23",status:"Lost",league:"NHL",match:"Panthers vs. Oilers",type:"Spread",market:"Panthers -1.5",price:3.2,wager:250,winnings:0,payout:0},
  {id:1029,date:"2024-06-23",status:"Won",league:"Golf",match:"Travelers Championship",type:"Winner",market:"S. Scheffler",price:2.25,wager:250,winnings:312,payout:562},
  {id:1030,date:"2024-06-18",status:"Lost",league:"NHL",match:"Panthers vs. Oilers",type:"To Win",market:"Panthers",price:5.5,wager:100,winnings:0,payout:0},
  {id:1031,date:"2024-06-15",status:"Lost",league:"NHL",match:"Oilers vs. Panthers",type:"To Win",market:"Panthers",price:1.95,wager:250,winnings:0,payout:0},
  {id:1032,date:"2024-06-14",status:"Lost",league:"NBA",match:"Mavericks vs. Celtics",type:"Spread",market:"Celtics -0.5",price:1.91,wager:250,winnings:0,payout:0},
  {id:1033,date:"2024-06-08",status:"Won",league:"NHL",match:"NHL 23/24",type:"Playoffs 2023/24 - Florida Panthers vs Edmonton Oilers - Winner",market:"Florida Panthers",price:1.67,wager:250,winnings:166,payout:416},
  {id:1034,date:"2024-06-08",status:"Cashed Out",league:"NBA",match:"NBA 23/24",type:"Playoffs 2023/24 - Boston Celtics vs Dallas Mavericks - Winner",market:"Dallas Mavericks",price:4.25,wager:100,winnings:-73,payout:26},
  {id:1035,date:"2024-06-07",status:"Won",league:"NHL",match:"Panthers vs. Oilers",type:"Spread",market:"Panthers -1.5",price:2.65,wager:100,winnings:65,payout:165,freeBet:true},
  {id:1036,date:"2024-06-06",status:"Lost",league:"NBA",match:"Celtics vs. Mavericks",type:"Kyrie Irving 2 Pointer",market:"Method of First Basket",price:8.5,wager:50,winnings:0,payout:0},
  {id:1037,date:"2024-06-06",status:"Lost",league:"NBA",match:"Celtics vs. Mavericks, Celtics vs. Mavericks,",type:"MULTIPLE",market:"MULTIPLE",price:4.75,wager:100,winnings:0,payout:0},
  {id:1038,date:"2024-06-02",status:"Won",league:"Golf",match:"RBC Canadian Open",type:"Winner",market:"R. MacIntyre",price:1.36,wager:500,winnings:181,payout:681},
  {id:1039,date:"2024-06-02",status:"Lost",league:"NHL",match:"Oilers vs. Stars",type:"To Win",market:"Stars",price:2.2,wager:100,winnings:0,payout:0},
  {id:1040,date:"2024-06-01",status:"Lost",league:"NHL",match:"Panthers vs. Rangers",type:"Spread",market:"Panthers -1.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1041,date:"2024-05-31",status:"Lost",league:"NHL",match:"Stars vs. Oilers",type:"Spread",market:"Stars -1.5",price:3.2,wager:100,winnings:0,payout:0},
  {id:1042,date:"2024-05-31",status:"Lost",league:"NHL",match:"Stars vs. Oilers",type:"Spread",market:"Stars -1.5",price:3.2,wager:100,winnings:0,payout:0},
  {id:1043,date:"2024-05-30",status:"Won",league:"NHL",match:"Rangers vs. Panthers",type:"To Win",market:"Panthers",price:1.83,wager:200,winnings:166,payout:366},
  {id:1044,date:"2024-05-30",status:"Won",league:"NBA",match:"Timberwolves vs. Mavericks",type:"To Win",market:"Mavericks",price:1.95,wager:200,winnings:190,payout:390},
  {id:1045,date:"2024-05-17",status:"Lost",league:"NBA",match:"Pacers vs. Knicks",type:"Total Points",market:"Under 215.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1046,date:"2024-05-17",status:"Won",league:"NHL",match:"Bruins vs. Panthers",type:"To Win",market:"Panthers",price:2.55,wager:200,winnings:310,payout:510},
  {id:1047,date:"2024-05-17",status:"Lost",league:"NBA",match:"Mavericks vs. Thunder",type:"Spread",market:"Mavericks -4",price:1.95,wager:200,winnings:0,payout:0},
  {id:1048,date:"2024-05-17",status:"Lost",league:"NBA",match:"Nuggets vs. Timberwolves",type:"Spread",market:"Nuggets -5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1049,date:"2024-05-17",status:"Lost",league:"Premier League",match:"Man City vs. West Ham",type:"Game Result (90 Minutes + Stoppage Time)",market:"Tie",price:11.0,wager:30,winnings:0,payout:0},
  {id:1050,date:"2024-05-17",status:"Lost",league:"Premier League",match:"Man City vs. West Ham",type:"Game Result (90 Minutes + Stoppage Time)",market:"West Ham",price:21.0,wager:30,winnings:0,payout:0},
  {id:1051,date:"2024-05-17",status:"Won",league:"Premier League",match:"Arsenal vs. Everton",type:"Game Result (90 Minutes + Stoppage Time)",market:"Arsenal",price:1.15,wager:100,winnings:-84,payout:15,freeBet:true},
  {id:1052,date:"2024-05-16",status:"Lost",league:"NBA",match:"Timberwolves vs. Nuggets, Timberwolves vs. Nuggets,",type:"MULTIPLE",market:"MULTIPLE",price:3.6,wager:100,winnings:0,payout:0},
  {id:1053,date:"2024-05-16",status:"Lost",league:"Boosts",match:"Nuggets 5/16 OD",type:"Chicken Nugget",market:"Nuggets to win vs. Timberwolves",price:2.45,wager:50,winnings:0,payout:0},
  {id:1054,date:"2024-05-15",status:"Won",league:"NBA",match:"Thunder vs. Mavericks",type:"To Win",market:"Mavericks",price:2.35,wager:150,winnings:202,payout:352},
  {id:1055,date:"2024-05-15",status:"Won",league:"NBA",match:"Celtics vs. Cavaliers, Celtics vs. Cavaliers,",type:"MULTIPLE",market:"MULTIPLE",price:2.5,wager:250,winnings:375,payout:625},
  {id:1056,date:"2024-05-15",status:"Lost",league:"Golf",match:"PGA Championship 2024",type:"Winner",market:"Rory McIlroy",price:7.0,wager:100,winnings:0,payout:0},
  {id:1057,date:"2024-05-14",status:"Won",league:"NBA",match:"Nuggets vs. Timberwolves",type:"Spread",market:"Nuggets -4",price:1.91,wager:200,winnings:181,payout:381},
  {id:1058,date:"2024-05-14",status:"Lost",league:"NHL",match:"Panthers vs. Bruins",type:"To Win",market:"Panthers",price:2.45,wager:100,winnings:0,payout:0},
  {id:1059,date:"2024-05-12",status:"Lost",league:"NHL",match:"Oilers vs. Canucks",type:"Spread",market:"Oilers -1.5",price:2.3,wager:100,winnings:0,payout:0},
  {id:1060,date:"2024-05-12",status:"Lost",league:"NBA",match:"Cavaliers vs. Celtics",type:"Spread",market:"Celtics -8",price:1.91,wager:200,winnings:0,payout:0},
  {id:1061,date:"2024-05-12",status:"Won",league:"NBA",match:"Timberwolves vs. Nuggets",type:"To Win",market:"Nuggets",price:2.45,wager:200,winnings:290,payout:490},
  {id:1062,date:"2024-05-12",status:"Won",league:"NHL",match:"Bruins vs. Panthers",type:"To Win",market:"Panthers",price:4.0,wager:100,winnings:300,payout:400},
  {id:1063,date:"2024-05-10",status:"Lost",league:"NHL",match:"Canucks vs. Oilers",type:"To Win",market:"Canucks",price:2.15,wager:100,winnings:0,payout:0},
  {id:1064,date:"2024-05-09",status:"Lost",league:"NBA",match:"Celtics vs. Cavaliers",type:"Total Points",market:"Over 212.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1065,date:"2024-05-08",status:"Lost",league:"NBA",match:"Celtics vs. Cavaliers",type:"Spread",market:"Celtics -13.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1066,date:"2024-05-08",status:"Won",league:"NHL",match:"Panthers vs. Bruins",type:"Spread",market:"Panthers -1.5",price:2.45,wager:100,winnings:145,payout:245},
  {id:1067,date:"2024-05-08",status:"Lost",league:"TT Elite Series",match:"S. Seroka vs. Krzysztof Kotyl",type:"Winner",market:"Krzysztof Kotyl",price:6.5,wager:50,winnings:0,payout:0},
  {id:1068,date:"2024-05-07",status:"Lost",league:"NHL",match:"Stars vs. Avalanche",type:"To Win",market:"Stars",price:1.91,wager:100,winnings:0,payout:0},
  {id:1069,date:"2024-05-07",status:"Won",league:"NHL",match:"Rangers vs. Hurricanes",type:"To Win",market:"Rangers",price:1.95,wager:100,winnings:95,payout:195},
  {id:1070,date:"2024-05-07",status:"Lost",league:"NBA",match:"Thunder vs. Mavericks",type:"To Win",market:"Mavericks",price:2.55,wager:200,winnings:0,payout:0},
  {id:1071,date:"2024-05-07",status:"Won",league:"TT Elite Series",match:"Szymon Radlo vs. Krzysztof Kotyl",type:"Winner",market:"Krzysztof Kotyl",price:1.18,wager:100,winnings:18,payout:118},
  {id:1072,date:"2024-05-07",status:"Won",league:"NBA",match:"Celtics vs. Cavaliers",type:"Spread",market:"Celtics -12.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1073,date:"2024-05-06",status:"Lost",league:"NBA",match:"Nuggets vs. Timberwolves",type:"Spread",market:"Nuggets -7.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:1074,date:"2024-05-05",status:"Lost",league:"NHL",match:"Stars vs. Golden Knights",type:"To Win",market:"Golden Knights",price:2.25,wager:400,winnings:0,payout:0},
  {id:1075,date:"2024-05-05",status:"Lost",league:"Formula 1",match:"Race",type:"Winner",market:"Max Verstappen",price:2.3,wager:150,winnings:0,payout:0},
  {id:1076,date:"2024-05-05",status:"Lost",league:"Formula 1",match:"Race",type:"Fastest Lap of the Race",market:"Max Verstappen",price:1.56,wager:200,winnings:0,payout:0},
  {id:1077,date:"2024-05-05",status:"Lost",league:"Formula 1",match:"Race",type:"Fastest Lap of the Race",market:"Max Verstappen",price:1.53,wager:250,winnings:0,payout:0},
  {id:1078,date:"2024-05-05",status:"Lost",league:"Boosts",match:"Red Bulls Grand Prix 5/5 OD",type:"SPECIALS Outright",market:"Both Red Bull Drivers Podium Finish",price:1.91,wager:50,winnings:0,payout:0},
  {id:1079,date:"2024-05-05",status:"Lost",league:"Formula 1",match:"Race",type:"Miami Grand Prix Race - Top 10 (Points Finish)",market:"Daniel Ricciardo",price:5.0,wager:100,winnings:0,payout:0},
  {id:1080,date:"2024-05-05",status:"Lost",league:"Formula 1",match:"Race",type:"Miami Grand Prix Race - Top 3",market:"Sergio Perez",price:1.61,wager:200,winnings:0,payout:0},
  {id:1081,date:"2024-04-29",status:"Won",league:"NHL",match:"Panthers vs. Lightning",type:"Spread",market:"Panthers -1.5",price:2.35,wager:200,winnings:270,payout:470},
  {id:1082,date:"2024-04-29",status:"Lost",league:"NBA",match:"Nuggets vs. Lakers",type:"Spread",market:"Nuggets -7",price:1.91,wager:100,winnings:0,payout:0},
  {id:1083,date:"2024-04-28",status:"Lost",league:"NHL",match:"Predators vs. Canucks",type:"Spread",market:"Predators -1.5",price:2.1,wager:100,winnings:0,payout:0},
  {id:1084,date:"2024-04-27",status:"Lost",league:"NBA",match:"Lakers vs. Nuggets",type:"To Win",market:"Nuggets",price:3.1,wager:100,winnings:0,payout:0},
  {id:1085,date:"2024-04-26",status:"Won",league:"NHL",match:"Predators vs. Canucks",type:"Spread",market:"Predators +2.5",price:1.8,wager:200,winnings:160,payout:360},
  {id:1086,date:"2024-04-25",status:"Won",league:"NBA",match:"Lakers vs. Nuggets",type:"Spread",market:"Nuggets +1",price:1.91,wager:100,winnings:90,payout:190},
  {id:1087,date:"2024-04-25",status:"Won",league:"NHL",match:"Lightning vs. Panthers",type:"To Win",market:"Panthers",price:1.95,wager:100,winnings:95,payout:195},
  {id:1088,date:"2024-04-25",status:"Lost",league:"MLB",match:"Reds vs. Phillies",type:"To Win",market:"Reds",price:2.5,wager:100,winnings:0,payout:0},
  {id:1089,date:"2024-04-23",status:"Won",league:"NHL",match:"Canucks vs. Predators",type:"Spread",market:"Predators -1.5",price:2.35,wager:100,winnings:135,payout:235},
  {id:1090,date:"2024-04-23",status:"Lost",league:"NHL",match:"Jets vs. Avalanche",type:"Spread",market:"Jets -1.5",price:2.3,wager:120,winnings:0,payout:0},
  {id:1091,date:"2024-04-23",status:"Lost",league:"NBA",match:"Bucks vs. Pacers",type:"To Win",market:"Bucks",price:2.7,wager:150,winnings:0,payout:0},
  {id:1092,date:"2024-04-23",status:"Won",league:"NHL",match:"Panthers vs. Lightning",type:"To Win",market:"Panthers",price:1.83,wager:200,winnings:166,payout:366},
  {id:1093,date:"2024-04-21",status:"Lost",league:"NHL",match:"Panthers vs. Lightning",type:"Spread",market:"Panthers -1.5",price:2.8,wager:100,winnings:0,payout:0},
  {id:1094,date:"2024-04-21",status:"Lost",league:"NBA",match:"Celtics vs. Heat",type:"Spread",market:"Heat +18.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:1095,date:"2024-04-20",status:"Won",league:"NBA",match:"Nuggets vs. Lakers",type:"Spread",market:"Nuggets -8.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:1096,date:"2024-04-17",status:"Won",league:"NBA",match:"Bulls vs. Hawks",type:"Spread",market:"Bulls -3.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:1097,date:"2024-04-17",status:"Lost",league:"NBA",match:"76ers vs. Heat",type:"To Win",market:"Heat",price:1.91,wager:100,winnings:0,payout:0},
  {id:1098,date:"2024-04-14",status:"Lost",league:"Golf",match:"The Masters",type:"Winner",market:"M. Homa",price:8.0,wager:100,winnings:0,payout:0},
  {id:1099,date:"2024-04-08",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #8 Purdue",type:"Spread",market:"#6 Connecticut -7.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1100,date:"2024-04-08",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #8 Purdue",type:"Spread",market:"#6 Connecticut -6.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:1101,date:"2024-04-07",status:"Won",league:"NCAA",match:"#3 South Carolina (W) vs. #13 Iowa (W)",type:"Spread",market:"#3 South Carolina (W) -6.5",price:1.91,wager:150,winnings:136,payout:286},
  {id:1102,date:"2024-04-06",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #17 Alabama",type:"Spread",market:"#6 Connecticut -10.5",price:1.91,wager:150,winnings:136,payout:286},
  {id:1103,date:"2024-04-06",status:"Won",league:"NCAA",match:"#8 Purdue vs. NC State",type:"Spread",market:"#8 Purdue -9.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1104,date:"2024-04-05",status:"Won",league:"NCAA",match:"#13 Iowa (W) vs. #1 UConn (W)",type:"Total Points",market:"Under 140.5",price:1.83,wager:100,winnings:83,payout:183},
  {id:1105,date:"2024-04-01",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #17 Alabama",type:"Spread",market:"#6 Connecticut -11.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:1106,date:"2024-04-01",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #17 Alabama",type:"Spread",market:"#6 Connecticut -11.5",price:1.87,wager:250,winnings:217,payout:467},
  {id:1107,date:"2024-03-31",status:"Won",league:"NCAA",match:"#8 Purdue vs. #22 Tennessee",type:"Spread",market:"#8 Purdue -3.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:1108,date:"2024-03-31",status:"Lost",league:"NCAA",match:"#1 Duke vs. NC State",type:"Spread",market:"#1 Duke -6.5",price:1.83,wager:200,winnings:0,payout:0},
  {id:1109,date:"2024-03-30",status:"Lost",league:"NCAA",match:"#6 Connecticut vs. #10 Illinois",type:"Spread",market:"#10 Illinois +23.5",price:1.83,wager:150,winnings:0,payout:0},
  {id:1110,date:"2024-03-30",status:"Won",league:"NCAA",match:"#17 Alabama vs. Clemson",type:"Spread",market:"#17 Alabama -3.5",price:1.95,wager:150,winnings:142,payout:292},
  {id:1111,date:"2024-03-30",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #10 Illinois",type:"Spread",market:"#6 Connecticut -8.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1112,date:"2024-03-30",status:"Won",league:"NHL",match:"Panthers vs. Red Wings",type:"To Win",market:"Panthers",price:1.74,wager:200,winnings:148,payout:348},
  {id:1113,date:"2024-03-30",status:"Lost",league:"NHL",match:"Panthers vs. Red Wings",type:"Total Goals",market:"Under 2.5",price:3.2,wager:200,winnings:0,payout:0},
  {id:1114,date:"2024-03-30",status:"Lost",league:"NHL",match:"Panthers vs. Red Wings",type:"Total Goals",market:"Under 3.5",price:1.57,wager:400,winnings:0,payout:0},
  {id:1115,date:"2024-03-30",status:"Won",league:"NCAA",match:"#6 Connecticut vs. #10 Illinois",type:"Spread",market:"#6 Connecticut -8.5",price:1.87,wager:400,winnings:347,payout:747},
  {id:1116,date:"2024-03-30",status:"Lost",league:"NHL",match:"Panthers vs. Red Wings",type:"Spread",market:"Panthers -1.5",price:2.05,wager:200,winnings:0,payout:0},
  {id:1117,date:"2024-03-29",status:"Won",league:"NCAA",match:"#22 Tennessee vs. Creighton",type:"Spread",market:"#22 Tennessee -3.5",price:1.91,wager:50,winnings:45,payout:95},
  {id:1118,date:"2024-03-29",status:"Lost",league:"NCAA",match:"#5 Houston vs. #1 Duke",type:"Total Points",market:"Over 134.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1119,date:"2024-03-29",status:"Won",league:"NCAA",match:"#22 Tennessee vs. Creighton",type:"Spread",market:"#22 Tennessee -3.5",price:1.91,wager:250,winnings:227,payout:477},
  {id:1120,date:"2024-03-29",status:"Won",league:"NCAA",match:"#8 Purdue vs. #9 Gonzaga",type:"Spread",market:"#8 Purdue -4.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:1121,date:"2024-03-28",status:"Lost",league:"NCAA",match:"#18 North Carolina vs. #17 Alabama",type:"Spread",market:"#18 North Carolina -4.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1122,date:"2024-03-28",status:"Won",league:"NCAA",match:"#4 Iowa State vs. #10 Illinois",type:"To Win",market:"#10 Illinois",price:2.05,wager:100,winnings:105,payout:205},
  {id:1123,date:"2024-03-28",status:"Lost",league:"NCAA",match:"#2 Arizona vs. Clemson",type:"Spread",market:"#2 Arizona -7.5",price:2.0,wager:200,winnings:0,payout:0},
  {id:1124,date:"2024-03-28",status:"Won",league:"NCAA",match:"#6 Connecticut vs. San Diego St",type:"Spread",market:"#6 Connecticut -11.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1125,date:"2024-03-25",status:"Lost",league:"NCAA",match:"#18 North Carolina vs. #17 Alabama",type:"Spread",market:"#18 North Carolina -4.5",price:1.95,wager:300,winnings:0,payout:0},
  {id:1126,date:"2024-03-25",status:"Lost",league:"NCAA",match:"#6 Connecticut vs. San Diego St, #6 Connecticut vs. San Diego St,",type:"MULTIPLE",market:"MULTIPLE",price:3.2,wager:250,winnings:0,payout:0},
  {id:1127,date:"2024-03-25",status:"Won",league:"NCAA",match:"#13 Iowa (W) vs. #17 West Virginia (W)",type:"Spread",market:"#13 Iowa (W) -9.5",price:1.95,wager:100,winnings:95,payout:195},
  {id:1128,date:"2024-03-25",status:"Lost",league:"NCAA",match:"#13 Iowa (W) vs. #17 West Virginia (W)",type:"Spread",market:"#13 Iowa (W) -14.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1129,date:"2024-03-25",status:"Lost",league:"NCAA",match:"NC State (W) vs. #21 Tennessee (W)",type:"To Win",market:"#21 Tennessee (W)",price:2.7,wager:100,winnings:0,payout:0},
  {id:1130,date:"2024-03-24",status:"Won",league:"NCAA",match:"San Diego St vs. Yale",type:"Spread",market:"San Diego St -5.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1131,date:"2024-03-24",status:"Won",league:"NCAA",match:"#6 Connecticut vs. Northwestern",type:"Spread",market:"#6 Connecticut -13.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1132,date:"2024-03-24",status:"Won",league:"NCAA",match:"#6 Connecticut vs. Northwestern",type:"Spread",market:"#6 Connecticut -13.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1133,date:"2024-03-24",status:"Won",league:"NCAA",match:"#1 Duke vs. James Madison",type:"Spread",market:"#1 Duke -15.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1134,date:"2024-03-24",status:"Lost",league:"NCAA",match:"#8 Purdue vs. Utah State",type:"To Win",market:"Utah State",price:5.25,wager:100,winnings:0,payout:0},
  {id:1135,date:"2024-03-24",status:"Won",league:"NCAA",match:"San Diego St vs. Yale",type:"Spread",market:"San Diego St -5.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1136,date:"2024-03-23",status:"Lost",league:"NCAA",match:"#22 Tennessee vs. Texas",type:"Spread",market:"#22 Tennessee -6.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:1137,date:"2024-03-23",status:"Won",league:"NCAA",match:"Creighton vs. Oregon",type:"Spread",market:"Creighton -4.5",price:2.0,wager:100,winnings:100,payout:200},
  {id:1138,date:"2024-03-23",status:"Lost",league:"NCAA",match:"#2 Arizona vs. Dayton",type:"To Win",market:"Dayton",price:6.0,wager:100,winnings:0,payout:0},
  {id:1139,date:"2024-03-23",status:"Lost",league:"NCAA",match:"#14 Kansas vs. #9 Gonzaga",type:"To Win",market:"#14 Kansas",price:2.5,wager:300,winnings:0,payout:0},
  {id:1140,date:"2024-03-23",status:"Won",league:"NCAA",match:"#18 North Carolina vs. #13 Michigan State",type:"Spread",market:"#18 North Carolina -3.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:1141,date:"2024-03-23",status:"Won",league:"NCAA",match:"NC State vs. Oakland",type:"Spread",market:"NC State -5.5",price:1.87,wager:200,winnings:173,payout:373},
  {id:1142,date:"2024-03-22",status:"Won",league:"NCAA",match:"Utah State vs. TCU",type:"To Win",market:"Utah State",price:2.45,wager:100,winnings:145,payout:245},
  {id:1143,date:"2024-03-22",status:"Won",league:"NCAA",match:"#8 Purdue vs. Grambling State",type:"Spread",market:"#8 Purdue -26.5",price:2.15,wager:100,winnings:115,payout:215},
  {id:1144,date:"2024-03-22",status:"Won",league:"NCAA",match:"Utah State vs. TCU",type:"To Win",market:"Utah State",price:2.5,wager:100,winnings:150,payout:250},
  {id:1145,date:"2024-03-22",status:"Lost",league:"NCAA",match:"Wisconsin vs. James Madison",type:"Spread",market:"Wisconsin -5.5",price:1.95,wager:400,winnings:0,payout:0},
  {id:1146,date:"2024-03-22",status:"Lost",league:"NCAA",match:"#8 Purdue vs. Grambling State",type:"Spread",market:"Grambling State +20.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1147,date:"2024-03-22",status:"Lost",league:"NCAA",match:"Saint Mary's vs. Grand Canyon",type:"Spread",market:"Saint Mary's -5.5",price:1.87,wager:200,winnings:0,payout:0},
  {id:1148,date:"2024-03-22",status:"Lost",league:"NCAA",match:"Auburn vs. Yale",type:"Total Points",market:"Under 140.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:1149,date:"2024-03-22",status:"Won",league:"NCAA",match:"#1 Duke vs. Vermont",type:"Spread",market:"#1 Duke -12.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1150,date:"2024-03-22",status:"Won",league:"NCAA",match:"Clemson vs. New Mexico",type:"Total Points",market:"Under 153.5",price:1.87,wager:150,winnings:130,payout:280},
  {id:1151,date:"2024-03-22",status:"Won",league:"NCAA",match:"Marquette vs. Western Kentucky",type:"Spread",market:"Marquette -5.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:1152,date:"2024-03-22",status:"Won",league:"NCAA",match:"Florida Atlantic vs. Northwestern",type:"Spread",market:"Northwestern -6.5",price:2.05,wager:100,winnings:105,payout:205},
  {id:1153,date:"2024-03-22",status:"Lost",league:"NCAA",match:"Saint Mary's vs. Grand Canyon",type:"Spread",market:"Saint Mary's -5.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:1154,date:"2024-03-22",status:"Lost",league:"NCAA",match:"San Diego St vs. UAB",type:"Spread",market:"San Diego St -6.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:1155,date:"2024-03-22",status:"Lost",league:"NCAA",match:"Florida Atlantic vs. Northwestern",type:"Spread",market:"Florida Atlantic -4.5",price:2.0,wager:100,winnings:0,payout:0},
  {id:1156,date:"2024-03-22",status:"Lost",league:"NHL",match:"Golden Knights vs. Kraken",type:"To Win",market:"Kraken",price:2.25,wager:100,winnings:0,payout:0},
  {id:1157,date:"2024-03-21",status:"Won",league:"NCAA",match:"#16 Texas Tech vs. NC State",type:"Total Points",market:"Over 146.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1158,date:"2024-03-21",status:"Lost",league:"NCAA",match:"#14 Kansas vs. Samford",type:"Spread",market:"#14 Kansas -7.5",price:1.91,wager:500,winnings:0,payout:0},
  {id:1159,date:"2024-03-21",status:"Won",league:"NCAA",match:"Texas vs. Colorado State",type:"Spread",market:"Texas -11.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1160,date:"2024-03-21",status:"Won",league:"NCAA",match:"Dayton vs. Nevada",type:"To Win",market:"Dayton",price:3.3,wager:100,winnings:230,payout:330},
  {id:1161,date:"2024-03-21",status:"Won",league:"NCAA",match:"Dayton vs. Nevada",type:"To Win",market:"Dayton",price:2.05,wager:100,winnings:105,payout:205},
  {id:1162,date:"2024-03-21",status:"Won",league:"NCAA",match:"#2 Arizona vs. Long Beach State",type:"Total Points",market:"Under 163.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1163,date:"2024-03-21",status:"Lost",league:"NCAA",match:"Kentucky vs. Oakland",type:"Spread",market:"Kentucky -13.5",price:1.87,wager:150,winnings:0,payout:0},
  {id:1164,date:"2024-03-21",status:"Won",league:"NCAA",match:"#10 Illinois vs. Morehead State",type:"Spread",market:"#10 Illinois -11.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1165,date:"2024-03-21",status:"Won",league:"NCAA",match:"#9 Gonzaga vs. McNeese State",type:"Spread",market:"#9 Gonzaga -6.5",price:1.91,wager:500,winnings:454,payout:954},
  {id:1166,date:"2024-03-21",status:"Won",league:"NCAA",match:"Creighton vs. Akron",type:"Spread",market:"Creighton -12.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1167,date:"2024-03-21",status:"Won",league:"Boosts",match:"Oregon ML 3/21 OD",type:"Duck Sauce",market:"Oregon to win vs. South Carolina",price:2.3,wager:50,winnings:65,payout:115},
  {id:1168,date:"2024-03-21",status:"Won",league:"NHL",match:"Kings vs. Wild",type:"Total Goals",market:"Under 7.5",price:1.45,wager:200,winnings:90,payout:290},
  {id:1169,date:"2024-03-20",status:"Won",league:"NBA",match:"Warriors vs. Grizzlies",type:"Spread",market:"Warriors -20.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1170,date:"2024-03-20",status:"Won",league:"NCAA",match:"Mississippi State vs. #13 Michigan State",type:"Spread",market:"#13 Michigan State -1.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:1171,date:"2024-03-20",status:"Won",league:"NCAA",match:"Boise State vs. Colorado",type:"Spread",market:"Colorado -3.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1172,date:"2024-03-19",status:"Lost",league:"NCAA",match:"#11 Virginia vs. Colorado State",type:"Spread",market:"#11 Virginia +2.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1173,date:"2024-03-14",status:"Lost",league:"NCAA",match:"Dayton vs. Duquesne",type:"Spread",market:"Dayton -6.5",price:1.91,wager:300,winnings:0,payout:0},
  {id:1174,date:"2024-03-01",status:"Lost",league:"NCAA",match:"Loyola Chicago vs. Dayton",type:"Spread",market:"Dayton -1.5",price:2.0,wager:300,winnings:0,payout:0},
  {id:1175,date:"2024-02-24",status:"Lost",league:"NCAA",match:"Wake Forest vs. #1 Duke",type:"Spread",market:"#1 Duke +1.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1176,date:"2024-02-23",status:"Won",league:"NCAA",match:"Fordham vs. Duquesne",type:"Spread",market:"Fordham -1.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1177,date:"2024-02-21",status:"Won",league:"NCAA",match:"George Mason vs. Dayton",type:"Spread",market:"Dayton +7.5",price:2.1,wager:100,winnings:110,payout:210},
  {id:1178,date:"2024-02-21",status:"Lost",league:"NCAA",match:"George Mason vs. Dayton",type:"Spread",market:"Dayton -2.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1179,date:"2024-02-17",status:"Won",league:"NCAA",match:"Auburn vs. Kentucky",type:"Spread",market:"Kentucky -4.5",price:2.1,wager:100,winnings:110,payout:210},
  {id:1180,date:"2024-02-17",status:"Won",league:"NCAA",match:"Oklahoma vs. #14 Kansas",type:"Spread",market:"#14 Kansas -3.5",price:1.8,wager:200,winnings:160,payout:360},
  {id:1181,date:"2024-02-17",status:"Lost",league:"NCAA",match:"Florida State vs. #1 Duke",type:"Spread",market:"#1 Duke -9.5",price:1.95,wager:150,winnings:0,payout:0},
  {id:1182,date:"2024-02-17",status:"Won",league:"NCAA",match:"Dayton vs. Fordham",type:"Spread",market:"Dayton -4.5",price:1.83,wager:200,winnings:166,payout:366},
  {id:1183,date:"2024-02-11",status:"Lost",league:"NFL",match:"Chiefs vs 49ers",type:"Total Points",market:"Under 42.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1184,date:"2024-02-11",status:"Won",league:"NFL",match:"Chiefs vs 49ers",type:"Travis Kelce - Receiving Yards",market:"Over 71.5",price:1.87,wager:75,winnings:65,payout:140},
  {id:1185,date:"2024-02-11",status:"Won",league:"NFL",match:"Chiefs vs 49ers",type:"Marquez Valdes-Scantling - Receiving Yards",market:"Over 18.5",price:1.87,wager:50,winnings:43,payout:93},
  {id:1186,date:"2024-02-09",status:"Won",league:"NBA",match:"Lakers vs. Pelicans",type:"Spread",market:"Lakers -5.5",price:1.95,wager:200,winnings:190,payout:390},
  {id:1187,date:"2024-02-09",status:"Lost",league:"NCAA",match:"VCU vs. Dayton",type:"To Win",market:"Dayton",price:4.25,wager:25,winnings:0,payout:0},
  {id:1188,date:"2024-02-09",status:"Lost",league:"NCAA",match:"VCU vs. Dayton",type:"Spread",market:"Dayton -1.5",price:1.95,wager:156,winnings:0,payout:0},
  {id:1189,date:"2024-02-07",status:"Lost",league:"Golf",match:"WM Phoenix Open 2024",type:"Winner",market:"Jordan Spieth",price:18.5,wager:50,winnings:0,payout:0},
  {id:1190,date:"2024-02-02",status:"Won",league:"NCAA",match:"Dayton vs. St. Bonaventure",type:"Spread",market:"Dayton -2.5",price:1.83,wager:200,winnings:166,payout:366},
  {id:1191,date:"2024-02-02",status:"Lost",league:"NCAA",match:"Dayton vs. St. Bonaventure",type:"Spread",market:"Dayton -7.5",price:1.87,wager:100,winnings:0,payout:0},
  {id:1192,date:"2024-01-28",status:"Won",league:"NFL",match:"49ers vs Lions",type:"Total Points",market:"Over 52.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1193,date:"2024-01-28",status:"Won",league:"NFL",match:"Ravens vs Chiefs",type:"Spread",market:"Chiefs -5.5",price:1.87,wager:100,winnings:86,payout:186},
  {id:1194,date:"2024-01-28",status:"Lost",league:"Boosts",match:"Andrews 2Q TD 1/28",type:"Andrews 2Q TD",market:"Mark Andrews to score a TD in 2nd Quarter",price:9.0,wager:25,winnings:0,payout:0},
  {id:1195,date:"2024-01-28",status:"Won",league:"NFL",match:"49ers vs Lions",type:"Total Points",market:"Over 52.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1196,date:"2024-01-28",status:"Lost",league:"NFL",match:"Ravens vs Chiefs",type:"Total Points",market:"Over 44.0",price:1.91,wager:200,winnings:0,payout:0},
  {id:1197,date:"2024-01-27",status:"Lost",league:"NCAA",match:"Richmond vs. Dayton",type:"Spread",market:"Dayton -3.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1198,date:"2024-01-25",status:"Lost",league:"NFL",match:"Ravens vs Chiefs",type:"Total Points",market:"Over 44.5",price:1.91,wager:200,winnings:0,payout:0},
  {id:1199,date:"2024-01-21",status:"Won",league:"NFL",match:"Bills vs Chiefs",type:"Total Points",market:"Over 46.0",price:1.91,wager:150,winnings:136,payout:286},
  {id:1200,date:"2024-01-21",status:"Won",league:"NFL",match:"Lions vs Buccaneers",type:"Spread",market:"Lions -6.0",price:1.91,wager:100,winnings:90,payout:190},
  {id:1201,date:"2024-01-21",status:"Won",league:"NFL",match:"Lions vs Buccaneers",type:"Spread",market:"Lions -6.0",price:1.91,wager:100,winnings:90,payout:190},
  {id:1202,date:"2024-01-20",status:"Won",league:"NFL",match:"49ers vs Packers",type:"Total Points",market:"Under 50.5",price:1.91,wager:200,winnings:181,payout:381},
  {id:1203,date:"2024-01-20",status:"Lost",league:"NFL",match:"Ravens vs Texans",type:"Total Points",market:"Over 44.5",price:1.91,wager:75,winnings:0,payout:0},
  {id:1204,date:"2024-01-20",status:"Won",league:"NFL",match:"Ravens vs Texans",type:"Total Points",market:"Over 43.5",price:1.91,wager:125,winnings:113,payout:238},
  {id:1205,date:"2024-01-15",status:"Lost",league:"NFL",match:"Bills vs Steelers",type:"Total Points",market:"Under 39.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1206,date:"2024-01-14",status:"Lost",league:"NFL",match:"Lions vs Rams",type:"Spread",market:"Lions -3.5",price:1.95,wager:100,winnings:0,payout:0},
  {id:1207,date:"2024-01-14",status:"Lost",league:"NFL",match:"Lions vs Rams",type:"Spread",market:"Lions -3.0",price:1.87,wager:100,winnings:0,payout:0},
  {id:1208,date:"2024-01-14",status:"Lost",league:"NFL",match:"Cowboys vs Packers",type:"Spread",market:"Cowboys -7.0",price:1.91,wager:41,winnings:0,payout:0},
  {id:1209,date:"2024-01-14",status:"Lost",league:"NFL",match:"Cowboys vs Packers",type:"Spread",market:"Cowboys -7.0",price:1.91,wager:100,winnings:0,payout:0},
  {id:1210,date:"2024-01-13",status:"Lost",league:"NFL",match:"Lions vs Rams",type:"Spread",market:"Lions -3.0",price:1.87,wager:121,winnings:0,payout:0},
  {id:1211,date:"2024-01-13",status:"Lost",league:"NFL",match:"Bills vs Steelers",type:"Total Points",market:"Under 37.5",price:1.91,wager:100,winnings:0,payout:0},
  {id:1212,date:"2024-01-13",status:"Won",league:"NFL",match:"Chiefs vs Dolphins",type:"Spread",market:"Chiefs -4.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1213,date:"2024-01-13",status:"Lost",league:"NFL",match:"Buccaneers vs Eagles",type:"Spread",market:"Eagles -2.5",price:1.87,wager:300,winnings:0,payout:0},
  {id:1214,date:"2024-01-13",status:"Won",league:"NFL",match:"Texans vs Browns",type:"Spread",market:"Texans -7.0",price:1.91,wager:100,winnings:90,payout:190},
  {id:1215,date:"2024-01-13",status:"Won",league:"NFL",match:"Texans vs Browns",type:"Spread",market:"Texans -7.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1216,date:"2024-01-13",status:"Lost",league:"NFL",match:"Texans vs Browns",type:"Total Points",market:"Under 45.0",price:1.95,wager:100,winnings:0,payout:0},
  {id:1217,date:"2024-01-13",status:"Won",league:"NFL",match:"Chiefs vs Dolphins",type:"Spread",market:"Chiefs -4.5",price:1.91,wager:100,winnings:90,payout:190},
  {id:1218,date:"2024-01-13",status:"Won",league:"NFL",match:"NFL 23/24",type:"Super Bowl 58 - Winner",market:"Kansas City Chiefs",price:10.0,wager:100,winnings:900,payout:1000}
];

const LEAGUE_LABELS={"NFL":"🏈 NFL","NCAA":"🏫 NCAA","NCAA FB":"🏈 NCAA FB","NCAA BB":"🏀 NCAA BB","NBA":"🏀 NBA","NHL":"🏒 NHL","MLB":"⚾ MLB","Formula 1":"🏎️ F1","Golf":"⛳ Golf","Copa America":"⚽ Copa","4 Nations Face-Off":"🏒 4 Nations","Boosts":"⚡ Boosts","Other":"🎯 Other","Men":"⚽ Soccer"};
const LEAGUE_COLORS={"NFL":"#e94560","NCAA":"#7c3aed","NCAA FB":"#f97316","NCAA BB":"#a855f7","NBA":"#f97316","NHL":"#0ea5e9","MLB":"#ef4444","Formula 1":"#dc2626","Golf":"#16a34a","Copa America":"#22c55e","4 Nations Face-Off":"#38bdf8","Boosts":"#fbbf24","Other":"#6b7280","Men":"#22c55e"};

// Premium access credentials — add friends here
const getNcaaLeague=(b)=>{
  if(b.league!=="NCAA")return b.league;
  const mk=b.market||"";
  const total=mk.match(/(?:Over|Under) ([\d.]+)/);
  if(total&&parseFloat(total[1])>=100)return "NCAA BB";
  return "NCAA FB";
};
const PREMIUM_USERS = {
  "craig":    "gridlock24",
  "friend1":  "letmein99",
  "friend2":  "allsports1",
};
const USER_TEAMS = {
  "craig":   "Bengals",
  "friend1": null,
  "friend2": null,
};

const WEEKLY_VIDEOS=[
  {id:"v1",title:"Week 17 Picks + TNF Recap",date:"Fri, Dec 27",duration:"4:32",views:"2.4K",description:"Breaking down TNF plus my top 5 picks for the weekend slate.",picks:[{pick:"Seahawks -4",result:"win"},{pick:"Broncos -7",result:"win"},{pick:"Bears -3",result:"win"},{pick:"Bills -3",result:"win"},{pick:"Patriots ML",result:"loss"}]},
  {id:"v2",title:"Week 16 Picks + TNF Recap",date:"Fri, Dec 20",duration:"4:58",views:"1.8K",description:"Thursday's upset has massive playoff implications. Here's where I'm putting my money.",picks:[{pick:"Seahawks -4",result:"win"},{pick:"Bo Nix O245",result:"win"},{pick:"Bills -3",result:"win"},{pick:"Panthers ML",result:"win"},{pick:"DEN/CIN O43",result:"loss"}]},
  {id:"v3",title:"Week 15 Picks + TNF Recap",date:"Fri, Dec 13",duration:"3:47",views:"1.5K",description:"Wild Thursday game. Plus my best bets for a loaded Week 15.",picks:[{pick:"Broncos -6",result:"win"},{pick:"Caleb O1.5 TDs",result:"win"},{pick:"Texans -4",result:"win"},{pick:"Seahawks ML",result:"loss"},{pick:"Bears -3.5",result:"loss"}]},
];
const seasonRecord=WEEKLY_VIDEOS.reduce((a,v)=>{v.picks.forEach(p=>{if(p.result==="win")a.w++;else if(p.result==="loss")a.l++;else a.p++;});return a;},{w:0,l:0,p:0});

// ===== MAIN APP =====
export default function Home(){
  const [selectedTeam,setSelectedTeam]=useState(null);
  const [showPicker,setShowPicker]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const [feedFilter,setFeedFilter]=useState("league");
  const [betResultFilter,setBetResultFilter]=useState("all");
  const [betLeagueFilter,setBetLeagueFilter]=useState("all");
  const [betDateFrom,setBetDateFrom]=useState("");
  const [betDateTo,setBetDateTo]=useState("");
  const [betSearch,setBetSearch]=useState("");
  const [showFreeBets,setShowFreeBets]=useState(false);
  const [betView,setBetView]=useState("list"); // "list" | "teams" | "types"
  const [selectedStatTeam,setSelectedStatTeam]=useState(null);
  const [activeSection,setActiveSection]=useState("feed");
  const [premiumAuthed,setPremiumAuthed]=useState(false);
  const [premiumUser,setPremiumUser]=useState("");
  const [premiumPass,setPremiumPass]=useState("");
  const [premiumError,setPremiumError]=useState("");
  const [showPremiumLogin,setShowPremiumLogin]=useState(false);
  const [fpfAuthed,setFpfAuthed]=useState(false);
  const [fpfPass,setFpfPass]=useState("");
  const [fpfError,setFpfError]=useState("");
  const kalshi=useKalshi();
  // Derive news query context from current filter
  const newsTeam=useMemo(()=>{
    if(feedFilter==="team"&&selectedTeam)return selectedTeam;
    return null; // team-specific ESPN/RSS only works per-team
  },[feedFilter,selectedTeam]);
  // For afc/nfc/division filters, pass a conference/division hint to TopStories
  const newsContext=useMemo(()=>{
    if(feedFilter==="team"&&selectedTeam)return{type:"team",value:selectedTeam};
    if(feedFilter==="afc")return{type:"conference",value:"AFC"};
    if(feedFilter==="nfc")return{type:"conference",value:"NFC"};
    if(DIVISIONS.includes(feedFilter))return{type:"division",value:feedFilter};
    return{type:"league",value:"NFL"};
  },[feedFilter,selectedTeam]);
  const news=useNflNews(newsContext);
  const team=selectedTeam?getTeam(selectedTeam):null;
  const pc=team?team.color:"#1a1a2e";
  const ac=team?team.accent:"#e94560";
  const sbEvent=kalshi.events.find(e=>(e.series_ticker||"").startsWith("KXSB"));
  const otherEvents=kalshi.events.filter(e=>e!==sbEvent);

  const feedAccounts=useMemo(()=>{
    if(feedFilter==="league")return TWITTER_ACCOUNTS.league;
    if(feedFilter==="team"&&selectedTeam)return TWITTER_ACCOUNTS.teams[selectedTeam]||[];
    if(DIVISIONS.includes(feedFilter)){const[c,d]=feedFilter.split(" ");const dt=TEAMS[c]?.[d]||[];return dt.flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]);}
    if(feedFilter==="afc")return Object.entries(TEAMS.AFC).flatMap(([,t])=>t.slice(0,1)).flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]).slice(0,8);
    if(feedFilter==="nfc")return Object.entries(TEAMS.NFC).flatMap(([,t])=>t.slice(0,1)).flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]).slice(0,8);
    return TWITTER_ACCOUNTS.league;
  },[feedFilter,selectedTeam]);

  // ── BET FILTERING ──────────────────────────────────────────────────────────
  // Craig's List: NFL + Boosts only
  const NFL_LEAGUES = ["NFL", "Boosts"];
  const isFutures=b=>{
    const t=b.type||"";const m=b.market||"";
    if(t.includes("SB")&&t.includes("Winner"))return false;
    return["Division Winner","Regular Season Wins","NFC ","AFC ","Conference Winner"].some(k=>t.includes(k)||m.includes(k));
  };
  const filteredBets=useMemo(()=>{
    return ALL_BETS.filter(b=>{
      if(!NFL_LEAGUES.includes(b.league))return false;
      if(!showFreeBets&&b.freeBet)return false;
      if(isFutures(b))return false;
      if(betResultFilter!=="all"&&b.status.toLowerCase()!==betResultFilter)return false;
      if(betDateFrom&&b.date<betDateFrom)return false;
      if(betDateTo&&b.date>betDateTo)return false;
      if(betSearch){
        const q=betSearch.toLowerCase();
        if(!b.match.toLowerCase().includes(q)&&!b.market.toLowerCase().includes(q))return false;
      }
      return true;
    });
  },[betResultFilter,betDateFrom,betDateTo,betSearch,showFreeBets]);

  // Premium All Sports: all bets, separate filter state
  const [premBetResultFilter,setPremBetResultFilter]=useState("all");
  const [premBetLeagueFilter,setPremBetLeagueFilter]=useState("all");
  const [premBetDateFrom,setPremBetDateFrom]=useState("");
  const [premBetDateTo,setPremBetDateTo]=useState("");
  const [premBetSearch,setPremBetSearch]=useState("");
  const [premShowFreeBets,setPremShowFreeBets]=useState(false);
  const premFilteredBets=useMemo(()=>{
    return ALL_BETS.filter(b=>{
      if(!premShowFreeBets&&b.freeBet)return false;
      if(premBetResultFilter!=="all"&&b.status.toLowerCase()!==premBetResultFilter)return false;
      if(premBetLeagueFilter!=="all"&&getNcaaLeague(b)!==premBetLeagueFilter)return false;
      if(premBetDateFrom&&b.date<premBetDateFrom)return false;
      if(premBetDateTo&&b.date>premBetDateTo)return false;
      if(premBetSearch){
        const q=premBetSearch.toLowerCase();
        if(!b.match.toLowerCase().includes(q)&&!b.market.toLowerCase().includes(q))return false;
      }
      return true;
    });
  },[premBetResultFilter,premBetLeagueFilter,premBetDateFrom,premBetDateTo,premBetSearch,premShowFreeBets]);
  const premStats=useMemo(()=>{
    const wins=premFilteredBets.filter(b=>b.status==="Won");
    const losses=premFilteredBets.filter(b=>b.status==="Lost");
    const totalWagered=premFilteredBets.reduce((s,b)=>s+b.wager,0);
    const totalWinnings=wins.reduce((s,b)=>s+b.winnings,0);
    const totalLost=losses.reduce((s,b)=>s+b.wager,0);
    const netProfit=totalWinnings-totalLost;
    const winRate=wins.length/(wins.length+losses.length)||0;
    const avgStake=premFilteredBets.length?totalWagered/premFilteredBets.length:0;
    return{wins:wins.length,losses:losses.length,totalWagered,netProfit,winRate,avgStake};
  },[premFilteredBets]);

  // ── NFL team breakdown stats ────────────────────────────────────────────
  const NFL_TEAM_NAMES = [
    "49ers","Bears","Bengals","Bills","Broncos","Browns","Buccaneers","Cardinals",
    "Chargers","Chiefs","Colts","Cowboys","Dolphins","Eagles","Falcons","Giants",
    "Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams",
    "Ravens","Saints","Seahawks","Steelers","Texans","Titans","Vikings","Commanders"
  ];
  const teamStats=useMemo(()=>{
    return NFL_TEAM_NAMES.map(team=>{
      const tb=ALL_BETS.filter(b=>NFL_LEAGUES.includes(b.league)&&b.match.includes(team)&&!b.freeBet);
      if(!tb.length)return null;
      const wins=tb.filter(b=>b.status==="Won");
      const losses=tb.filter(b=>b.status==="Lost");
      const totalWin=wins.reduce((s,b)=>s+b.winnings,0);
      const totalLost=losses.reduce((s,b)=>s+b.wager,0);
      const wagered=tb.reduce((s,b)=>s+b.wager,0);
      const wr=wins.length/(wins.length+losses.length)||0;
      return{team,bets:tb.length,wins:wins.length,losses:losses.length,net:totalWin-totalLost,wagered,wr,allBets:tb};
    }).filter(Boolean).sort((a,b)=>b.bets-a.bets);
  },[]);
  const betTypeStats=useMemo(()=>{
    const base=ALL_BETS.filter(b=>NFL_LEAGUES.includes(b.league)&&!b.freeBet);
    const map={};
    base.forEach(b=>{
      const t=b.type==="MULTIPLE"?"Parlay":b.type;
      if(!map[t])map[t]={type:t,bets:0,wins:0,losses:0,winAmt:0,lossAmt:0,wagered:0};
      map[t].bets++;map[t].wagered+=b.wager;
      if(b.status==="Won"){map[t].wins++;map[t].winAmt+=b.winnings;}
      else if(b.status==="Lost"){map[t].losses++;map[t].lossAmt+=b.wager;}
    });
    return Object.values(map).sort((a,b)=>b.bets-a.bets);
  },[]);

  // ── STATS computed from filteredBets ───────────────────────────────────────
  const stats=useMemo(()=>{
    const wins=filteredBets.filter(b=>b.status==="Won");
    const losses=filteredBets.filter(b=>b.status==="Lost");
    const totalWagered=filteredBets.reduce((s,b)=>s+b.wager,0);
    const totalWinnings=wins.reduce((s,b)=>s+b.winnings,0);
    const totalLost=losses.reduce((s,b)=>s+b.wager,0);
    const netProfit=totalWinnings-totalLost;
    const winRate=wins.length/(wins.length+losses.length)||0;
    const avgStake=filteredBets.length?totalWagered/filteredBets.length:0;
    return{wins:wins.length,losses:losses.length,totalWagered,netProfit,winRate,avgStake};
  },[filteredBets]);

  const filterOptions=useMemo(()=>{
    const f=[{key:"league",label:"🏈 League Wide"},{key:"afc",label:"AFC"},{key:"nfc",label:"NFC"}];
    DIVISIONS.forEach(d=>f.push({key:d,label:d}));
    if(selectedTeam)f.push({key:"team",label:`⭐ ${selectedTeam}`});return f;
  },[selectedTeam]);

  const premUniqueLeagues=["all",...new Set(ALL_BETS.map(b=>getNcaaLeague(b)))].filter(l=>l!=="NCAA");

  const pill=(label,active,onClick,color)=>(<button onClick={onClick} style={{background:active?`${color||ac}33`:"#ffffff08",border:`1px solid ${active?color||ac:"#ffffff15"}`,color:active?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:16,cursor:"pointer",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{label}</button>);

  return(<>
    <Head><title>GRIDLOCK  --  NFL Bets, News & Social Feed</title><meta name="description" content="Your NFL command center."/><meta name="viewport" content="width=device-width, initial-scale=1"/></Head>
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",fontFamily:"'Inter',-apple-system,sans-serif"}}>
      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${pc}ee,${pc}99,#0a0a0f)`,borderBottom:`2px solid ${ac}44`,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",position:"relative"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontSize:28,fontWeight:900,letterSpacing:"-1px",background:`linear-gradient(135deg,#fff,${ac})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GRIDLOCK</div><div style={{fontSize:10,color:"#ffffff66",letterSpacing:"2px",textTransform:"uppercase"}}>NFL - Bets - Feed</div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {(premiumAuthed||fpfAuthed)?(
                <div style={{display:"flex",alignItems:"center",gap:6,background:"#ffffff10",border:"1px solid #4ade8033",borderRadius:8,padding:"6px 12px"}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade8066"}}/>
                  <span style={{fontSize:12,color:"#4ade80",fontWeight:600}}>Logged in</span>
                  <button onClick={()=>{setPremiumAuthed(false);setFpfAuthed(false);setPremiumUser("");setPremiumPass("");setFpfPass("");}} style={{background:"none",border:"none",color:"#ffffff44",cursor:"pointer",fontSize:11,marginLeft:4,padding:0}}>{"x"}</button>
                </div>
              ):(
                <button onClick={()=>{setActiveSection("premium");}} style={{background:"linear-gradient(135deg,#fbbf2422,#f59e0b22)",border:"1px solid #fbbf2444",color:"#fbbf24",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>🔑 Member Login</button>
              )}
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"8px 12px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,color:"#1DA1F2"}}>{"X"}</span> @cnaylor_</a>
              <button onClick={()=>setShowPicker(!showPicker)} style={{background:selectedTeam?`${ac}33`:"#ffffff15",border:`1px solid ${selectedTeam?ac:"#ffffff33"}`,color:"#fff",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>{selectedTeam?`${team?.city} ${selectedTeam}`:"🏈 Select Your Team"}</button>
              {selectedTeam&&<button onClick={()=>{setSelectedTeam(null);setFeedFilter("league");}} style={{background:"#e9456033",border:"1px solid #e9456066",color:"#e94560",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Reset Team</button>}
            </div>
          </div>
          {/* ── NAV TABS ── */}
          {(()=>{
            const tabs=[
              {k:"feed",l:"📱 Social Feed",s:"Feed"},
              {k:"kalshi",l:"📊 Prediction Markets",s:"Markets"},
              {k:"bets",l:"💰 Craig's List",s:"Craig's List"},
              {k:"premium",l:"🔒 All Sports",s:"All Sports",gold:true},
              {k:"video",l:"🎬 Five Pick Fridays",s:"FPF",gold:true},
            ];
            return(<>
              {/* Desktop tabs — hidden on small screens via flex-wrap */}
              <div style={{display:"flex",gap:4,marginTop:12,overflowX:"auto",alignItems:"center"}}>
                {/* Hamburger button — left side */}
                <button onClick={()=>setShowMenu(!showMenu)} style={{marginRight:4,background:showMenu?`${ac}33`:"#ffffff10",border:`1px solid ${showMenu?ac:"#ffffff22"}`,color:"#fff",padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:16,lineHeight:1,flexShrink:0}}>
                  {showMenu?"x":"☰"}
                </button>
                {tabs.map(s=>(
                  <button key={s.k} onClick={()=>setActiveSection(s.k)} style={{background:activeSection===s.k?`${ac}33`:"transparent",border:"none",color:activeSection===s.k?"#fff":"#ffffff66",padding:"8px 14px",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",borderBottom:activeSection===s.k?`2px solid ${ac}`:"2px solid transparent",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}>
                    {s.s}{s.gold&&<span style={{fontSize:8,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:800,marginLeft:2}}>PREMIUM</span>}
                  </button>
                ))}
              </div>
              {/* Dropdown menu */}
              {showMenu&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#12121c",borderBottom:`2px solid ${ac}44`,zIndex:200,padding:"8px 16px",display:"flex",flexDirection:"column",gap:4}}>
                  {tabs.map(s=>(
                    <button key={s.k} onClick={()=>{setActiveSection(s.k);setShowMenu(false);}} style={{background:activeSection===s.k?`${ac}22`:"transparent",border:"none",borderLeft:activeSection===s.k?`3px solid ${ac}`:"3px solid transparent",color:activeSection===s.k?"#fff":"#ffffff88",padding:"12px 16px",cursor:"pointer",fontSize:14,fontWeight:600,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span>{s.l}</span>
                      {s.gold&&<span style={{fontSize:9,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontWeight:800}}>PREMIUM</span>}
                    </button>
                  ))}
                </div>
              )}
            </>);
          })()}
        </div>
      </div>

      {/* TEAM PICKER */}
      {showPicker&&(<div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setShowPicker(false)}>
        <div style={{background:"#151520",borderRadius:16,padding:28,maxWidth:720,width:"90%",maxHeight:"80vh",overflowY:"auto",border:"1px solid #ffffff15"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:20,fontWeight:800,marginBottom:20,color:"#fff"}}>Choose Your Team</div>
          {selectedTeam&&(<button onClick={()=>{setSelectedTeam(null);setShowPicker(false);setFeedFilter("league");}} style={{width:"100%",background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"12px",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:700,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>🏈 Back to League Wide View</button>)}
          {Object.entries(TEAMS).map(([conf,divs])=>(<div key={conf} style={{marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:conf==="AFC"?"#e94560":"#4ea8de",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>{conf}</div>
            {Object.entries(divs).map(([div,teams])=>(<div key={div}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",marginBottom:6,marginTop:8}}>{div}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>{teams.map(t=>(<button key={t.abbr} onClick={()=>{setSelectedTeam(t.name);setShowPicker(false);setFeedFilter("team");}} style={{background:selectedTeam===t.name?`${t.color}44`:"#1a1a2e",border:`1px solid ${selectedTeam===t.name?t.color:"#ffffff15"}`,color:"#fff",padding:"8px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left"}}><div style={{fontWeight:700}}>{t.name}</div><div style={{fontSize:10,color:"#ffffff55",marginTop:1}}>{t.city}</div></button>))}</div>
            </div>))}
          </div>))}
        </div>
      </div>)}

      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px"}}>

        {/* ── SOCIAL FEED ── */}
        {activeSection==="feed"&&(<div>
          <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📱 Live NFL Feed</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Curated NFL accounts  --  click to view on X</div></div>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}><span style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Filter:</span>
            {filterOptions.map(f=>(<button key={f.key} onClick={()=>setFeedFilter(f.key)} style={{background:feedFilter===f.key?`${ac}33`:"#ffffff08",border:`1px solid ${feedFilter===f.key?ac:"#ffffff15"}`,color:feedFilter===f.key?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.label}</button>))}
          </div>
          {news.articles.length>0&&<TopStories articles={news.articles} ac={ac} newsContext={newsContext}/>}
          {news.loading&&<div style={{textAlign:"center",padding:20,color:"#ffffff44",fontSize:13}}>Loading {newsTeam?`${newsTeam} `:newsContext.type!=="league"?`${newsContext.value} `:"NFL "} stories...</div>}
          
          <TwitterFeed accounts={feedAccounts} ac={ac}/>
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}><div style={{fontSize:12,color:"#ffffff44"}}>Click any card to view their latest posts on X</div><div style={{fontSize:11,color:"#ffffff33",marginTop:6}}>💡 Live embedded tweets coming soon  --  once this site generates revenue, we&#39;ll upgrade to the X API for real-time feeds directly on this page.</div></div>
        </div>)}

        {/* ── KALSHI ── */}
        {activeSection==="kalshi"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📊 NFL Prediction Markets</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Live odds from Kalshi  --  click any option to trade</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>{kalshi.lastFetch&&<span style={{fontSize:11,color:"#ffffff33"}}>Updated {kalshi.lastFetch.toLocaleTimeString()}</span>}<button onClick={kalshi.refresh} disabled={kalshi.loading} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,opacity:kalshi.loading?0.5:1}}>{kalshi.loading?"Loading...":"🔄 Refresh"}</button></div>
          </div>
          {kalshi.error&&<div style={{background:"#f8717115",border:"1px solid #f8717133",borderRadius:10,padding:14,marginBottom:16}}><div style={{fontSize:13,color:"#f87171",fontWeight:600}}>Could not fetch Kalshi data</div><div style={{fontSize:12,color:"#ffffff55",marginTop:4}}>Error: {kalshi.error}</div></div>}
          {kalshi.loading&&!kalshi.events.length&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:28,marginBottom:8}}>📊</div><div style={{fontSize:14,color:"#ffffff55"}}>Fetching live markets...</div></div>}
          {sbEvent&&(<div style={{marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🏆</span><div><h3 style={{fontSize:18,fontWeight:800,color:"#fff",margin:0}}>2027 Champion  --  Super Bowl LXI</h3><div style={{fontSize:12,color:"#ffffff55"}}>Live futures odds from Kalshi</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>{sbEvent.markets.map(m=>{const price=m.last_price||m.yes_bid||0;const label=(m.yes_sub_title||m.title||m.subtitle||"").replace(/^Will |win.*$/gi,"").trim();return(<a key={m.ticker} href={`https://kalshi.com/markets/${(sbEvent.series_ticker||"kxsb").toLowerCase()}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><div style={{background:price>=15?"#12121c":"#0d0d14",border:`1px solid ${price>=15?"#ffffff15":"#ffffff08"}`,borderRadius:10,padding:"12px 14px",position:"relative",overflow:"hidden"}}>{price>=15&&<div style={{position:"absolute",top:0,left:0,width:`${price}%`,height:"100%",background:`linear-gradient(90deg,${ac}08,${ac}03)`,borderRadius:10}}/>}<div style={{position:"relative",zIndex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.3}}>{label}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><div style={{fontSize:20,fontWeight:900,color:price>=15?"#4ade80":price>=5?"#fbbf24":"#ffffff55"}}>{price}{"c"}</div><div style={{fontSize:10,color:"#ffffff33"}}>Vol {fmtVol(m.volume||0)}</div></div></div></div></a>);})}</div>
          </div>)}
          {otherEvents.length>0&&(<div><div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>More NFL Markets</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{otherEvents.map(evt=>(<div key={evt.event_ticker} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:18}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{evt.title}</div>{evt.subtitle&&<div style={{fontSize:12,color:"#ffffff44",marginTop:2}}>{evt.subtitle}</div>}</div><span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#ffffff08",color:"#ffffff44",fontWeight:600,flexShrink:0}}>{evt.markets.length} options</span></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>{evt.markets.slice(0,12).map(m=>{const price=m.last_price||m.yes_bid||0;const label=m.yes_sub_title||m.title||m.subtitle||"Yes";return(<a key={m.ticker} href={`https://kalshi.com/markets/${(evt.series_ticker||evt.event_ticker||"").toLowerCase()}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><div style={{background:"#1a1a2e",border:"1px solid #ffffff08",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}><div style={{fontSize:12,fontWeight:600,color:"#ddd",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div><div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}><span style={{fontSize:14,fontWeight:800,color:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff44"}}>{price}{"c"}</span><div style={{width:32,height:6,borderRadius:3,background:"#ffffff10",overflow:"hidden"}}><div style={{width:`${price}%`,height:"100%",borderRadius:3,background:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff33"}}/></div></div></div></a>);})}</div>
            {evt.markets.length>12&&<div style={{fontSize:11,color:"#ffffff33",textAlign:"center",marginTop:8}}>+{evt.markets.length-12} more on Kalshi</div>}
          </div>))}</div></div>)}
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}><div style={{fontSize:12,color:"#ffffff44"}}>Live data from <a href="https://kalshi.com/sports/all-sports" target="_blank" rel="noopener noreferrer" style={{color:"#fff",fontWeight:600,textDecoration:"none"}}>Kalshi</a> {"·"} Prices in cents {"·"} Click any option to trade</div></div>
        </div>)}

        {/* ── CRAIG'S LIST ── */}
        {activeSection==="bets"&&(<div>
          {/* Title row */}
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}><div><div style={{display:"flex",alignItems:"center",gap:3}}><h2 style={{fontSize:26,fontWeight:900,color:"#fff",margin:0}}>Craig&#39;s</h2><h2 style={{fontSize:26,fontWeight:900,margin:0,background:`linear-gradient(135deg,${ac},#e94560)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>List</h2></div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:2,marginBottom:2}}>
                    <span style={{background:"#e9456022",border:"1px solid #e9456044",color:"#e94560",padding:"2px 10px",borderRadius:20,fontSize:10,fontWeight:800,letterSpacing:"1px"}}>🏈 NFL ONLY</span>
                    </div>
                  <div style={{marginTop:4,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:13,color:"#ffffff88",fontWeight:500}}>NFL Bets from the big man himself</span>
                    <span style={{fontSize:11,color:"#ffffff33"}}> --  -- </span>
                    <span style={{display:"flex",alignItems:"center",gap:4,background:"#c8102e15",border:"1px solid #c8102e44",borderRadius:6,padding:"2px 8px"}}>
                      <span style={{fontSize:10,color:"#c8102e",fontWeight:800,letterSpacing:"1px",textTransform:"uppercase"}}>via Hard Rock Bet</span>
                    </span>
                    <a href="#" onClick={e=>{e.preventDefault();setActiveSection("premium");}} style={{color:"#fbbf24",fontWeight:600,textDecoration:"none",fontSize:11}}>See all sports {"->"}</a>
                  </div>
                  <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>{"X"} @cnaylor_</a></div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}><CraigAvatar size={44}/><div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8066"}}/><span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>LIVE</span></div>
          </div>

          {/* Stats cards — based on filtered set */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
            {[
              {l:"Record",v:`${stats.wins}-${stats.losses}`,s:`${filteredBets.length} bets shown`},
              {l:"Win Rate",v:`${(stats.winRate*100).toFixed(1)}%`,s:"filtered results",c:stats.winRate>=0.5?"#4ade80":"#f87171"},
              {l:"Net Profit",v:`${stats.netProfit>=0?"+":""}$${stats.netProfit.toLocaleString()}`,s:"winnings - losses",c:stats.netProfit>=0?"#4ade80":"#f87171"},
              {l:"Total Wagered",v:`$${stats.totalWagered.toLocaleString()}`,s:"filtered bets"},
              {l:"Avg Stake",v:`$${Math.round(stats.avgStake).toLocaleString()}`,s:"per bet"},
            ].map((s,i)=>(<div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div><div style={{fontSize:20,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div><div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{s.s}</div></div>))}
          </div>

          {/* ── FILTERS ── */}
          <div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,marginBottom:16}}>

            {/* Season selector — primary filter, front and center */}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",letterSpacing:"1px",textTransform:"uppercase"}}>
                  {"📅 Season"}
                </div>
                <div style={{fontSize:11,color:"#ffffff44"}}>
                  {!betDateFrom&&!betDateTo?"Showing all bets  --  Jan 2024 to present":betDateFrom&&betDateTo?`${betDateFrom} to ${betDateTo}`:"Custom range"}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[
                  {l:"All Time",f:"",t:"",sub:"Jan 2024  --  Now"},
                  {l:"2025-26",f:"2025-03-01",t:"2026-02-09",sub:"Current season"},
                  {l:"2024-25",f:"2024-03-01",t:"2025-02-09",sub:"Last season"},
                  {l:"2023-24",f:"2023-09-07",t:"2024-02-11",sub:"2 seasons ago"},
                  {l:"Playoffs 26",f:"2026-01-10",t:"2026-02-09",g:true},
                  {l:"Playoffs 25",f:"2025-01-11",t:"2025-02-09",g:true},
                  {l:"Playoffs 24",f:"2024-01-13",t:"2024-02-11",g:true},
                ].map(s=>{
                  const active=betDateFrom===s.f&&betDateTo===s.t;
                  const col=s.g?"#fbbf24":ac;
                  return(
                    <button key={s.l} onClick={()=>{setBetDateFrom(s.f);setBetDateTo(s.t);}}
                      style={{background:active?`${col}33`:"#ffffff08",border:`2px solid ${active?col:"#ffffff15"}`,color:active?"#fff":"#ffffff66",padding:"8px 14px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12,whiteSpace:"nowrap",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:80}}>
                      <span>{s.l}</span>
                      {s.sub&&<span style={{fontSize:9,color:active?(s.g?"#fbbf2499":"#ffffff88"):"#ffffff33",fontWeight:400}}>{s.sub}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{height:1,background:"#ffffff10",marginBottom:12}}/>

            {/* Row 1: Result */}
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:12}}>
              <div>
                <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>RESULT</div>
                <div style={{display:"flex",gap:4}}>
                  {[["all","All"],["won","✅ Won"],["lost","❌ Lost"]].map(([k,l])=>pill(l,betResultFilter===k,()=>setBetResultFilter(k)))}
                </div>
              </div>
            </div>

            {/* Row 2: Custom date range + search */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>

              <div>
                <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>FROM DATE</div>
                <input type="date" value={betDateFrom} onChange={e=>setBetDateFrom(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,outline:"none",colorScheme:"dark"}}/>
              </div>
              <div>
                <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>TO DATE</div>
                <input type="date" value={betDateTo} onChange={e=>setBetDateTo(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,outline:"none",colorScheme:"dark"}}/>
              </div>
              <div style={{flex:1,minWidth:160}}>
                <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>SEARCH</div>
                <input placeholder="Search match or market..." value={betSearch} onChange={e=>setBetSearch(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 12px",fontSize:12,outline:"none",width:"100%"}}/>
              </div>
              <button onClick={()=>setShowFreeBets(!showFreeBets)} style={{background:showFreeBets?"#fbbf2422":"#ffffff08",border:`1px solid ${showFreeBets?"#fbbf24":"#ffffff15"}`,color:showFreeBets?"#fbbf24":"#ffffff55",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{showFreeBets?"🎁 Hiding Free Bets: OFF":"🎁 Hide Free Bets"}</button>
              {(betResultFilter!=="all"||betLeagueFilter!=="all"||betDateFrom||betDateTo||betSearch)&&(
                <button onClick={()=>{setBetResultFilter("all");setBetLeagueFilter("all");setBetDateFrom("");setBetDateTo("");setBetSearch("");}} style={{background:"#e9456022",border:"1px solid #e9456044",color:"#e94560",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{"x"} Clear</button>
              )}
            </div>

            {/* Result summary */}
            <div style={{marginTop:10,fontSize:11,color:"#ffffff44"}}>
              Showing <strong style={{color:"#fff"}}>{filteredBets.length}</strong> of {ALL_BETS.length} bets
              {betLeagueFilter!=="all"&&<span> {"·"} <span style={{color:LEAGUE_COLORS[betLeagueFilter]||ac}}>{LEAGUE_LABELS[betLeagueFilter]||betLeagueFilter}</span></span>}
              {betDateFrom&&<span> {"·"} from {betDateFrom}</span>}
              {betDateTo&&<span> {"·"} to {betDateTo}</span>}
            </div>
          </div>

          {/* ── VIEW TOGGLE ── */}
          <div style={{display:"flex",gap:6,marginBottom:16,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>View:</span>
            {[["list","📋 Bet List"],["teams","🏈 By Team"],["types","📊 By Bet Type"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setBetView(k);setSelectedStatTeam(null);}} style={{background:betView===k?`${ac}33`:"#ffffff08",border:`1px solid ${betView===k?ac:"#ffffff15"}`,color:betView===k?"#fff":"#ffffff66",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>{l}</button>
            ))}
          </div>

          {/* ── TEAM STATS DASHBOARD ── */}
          {betView==="teams"&&(
            <div>
              {!selectedStatTeam?(
                /* Team grid */
                <div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
                    {teamStats.map(s=>{
                      const color=s.wr>=0.55?"#4ade80":s.wr>=0.45?"#fbbf24":"#f87171";
                      return(
                        <button key={s.team} onClick={()=>setSelectedStatTeam(s.team)}
                          style={{background:"#12121c",border:`1px solid ${color}33`,borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"left",transition:"all 0.15s",position:"relative",overflow:"hidden"}}>
                          <div style={{position:"absolute",top:0,left:0,width:`${s.wr*100}%`,height:2,background:`linear-gradient(90deg,${color},${color}88)`}}/>
                          <div style={{fontSize:15,fontWeight:800,color:"#fff",marginBottom:6}}>{s.team}</div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                            <span style={{fontSize:22,fontWeight:900,color}}>{(s.wr*100).toFixed(0)}%</span>
                            <span style={{fontSize:11,color:"#ffffff44"}}>{s.bets} bets</span>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                            <span style={{color:"#ffffff55"}}>{s.wins}W / {s.losses}L</span>
                            <span style={{color:s.net>=0?"#4ade80":"#f87171",fontWeight:700}}>{s.net>=0?"+":""}${s.net.toLocaleString()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {/* Summary bar */}
                  <div style={{marginTop:20,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                    {[
                      {l:"Best Team",v:teamStats.slice().sort((a,b)=>b.wr-a.wr)[0]?.team,s:`${(teamStats.slice().sort((a,b)=>b.wr-a.wr)[0]?.wr*100).toFixed(0)}% WR`,c:"#4ade80"},
                      {l:"Most Bet",v:teamStats[0]?.team,s:`${teamStats[0]?.bets} bets`},
                      {l:"Most Profitable",v:teamStats.slice().sort((a,b)=>b.net-a.net)[0]?.team,s:`+$${teamStats.slice().sort((a,b)=>b.net-a.net)[0]?.net.toLocaleString()}`,c:"#4ade80"},
                    ].map((c,i)=>(
                      <div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                        <div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>{c.l}</div>
                        <div style={{fontSize:18,fontWeight:800,color:c.c||"#fff"}}>{c.v}</div>
                        <div style={{fontSize:11,color:"#ffffff55",marginTop:2}}>{c.s}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ):(
                /* Individual team drill-down */
                <div>
                  {(()=>{
                    const s=teamStats.find(t=>t.team===selectedStatTeam);
                    if(!s)return null;
                    const color=s.wr>=0.55?"#4ade80":s.wr>=0.45?"#fbbf24":"#f87171";
                    const byType={};
                    s.allBets.forEach(b=>{
                      const t=b.type==="MULTIPLE"?"Parlay":b.type;
                      if(!byType[t])byType[t]={bets:0,wins:0,losses:0,net:0};
                      byType[t].bets++;
                      if(b.status==="Won"){byType[t].wins++;byType[t].net+=b.winnings;}
                      else if(b.status==="Lost"){byType[t].losses++;byType[t].net-=b.wager;}
                    });
                    return(
                      <div>
                        <button onClick={()=>setSelectedStatTeam(null)} style={{background:"#ffffff10",border:"1px solid #ffffff20",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:16}}>{"<-"} All Teams</button>
                        {/* Team header */}
                        <div style={{background:`linear-gradient(135deg,${color}18,#12121c)`,border:`1px solid ${color}44`,borderRadius:14,padding:20,marginBottom:16}}>
                          <div style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:4}}>{s.team}</div>
                          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:12}}>
                            {[
                              {l:"Win Rate",v:`${(s.wr*100).toFixed(1)}%`,c:color},
                              {l:"Record",v:`${s.wins}W / ${s.losses}L`},
                              {l:"Net P&L",v:`${s.net>=0?"+":""}$${s.net.toLocaleString()}`,c:s.net>=0?"#4ade80":"#f87171"},
                              {l:"Wagered",v:`$${s.wagered.toLocaleString()}`},
                              {l:"Total Bets",v:s.bets},
                            ].map((m,i)=>(
                              <div key={i}>
                                <div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>{m.l}</div>
                                <div style={{fontSize:20,fontWeight:800,color:m.c||"#fff"}}>{m.v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* By bet type breakdown */}
                        <div style={{marginBottom:16}}>
                          <div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>By Bet Type</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6}}>
                            {Object.entries(byType).sort((a,b)=>b[1].bets-a[1].bets).map(([type,ts])=>{
                              const twr=ts.wins/(ts.wins+ts.losses)||0;
                              const tc=twr>=0.55?"#4ade80":twr>=0.45?"#fbbf24":"#f87171";
                              return(
                                <div key={type} style={{background:"#1a1a2e",border:"1px solid #ffffff08",borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
                                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{type}</div><div style={{fontSize:11,color:"#ffffff44",marginTop:1}}>{ts.wins}W / {ts.losses}L {"·"} {ts.bets} bets</div></div>
                                  <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:tc}}>{(twr*100).toFixed(0)}%</div><div style={{fontSize:11,color:ts.net>=0?"#4ade80":"#f87171",marginTop:1}}>{ts.net>=0?"+":""}${ts.net.toLocaleString()}</div></div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        {/* Recent bets for this team */}
                        <div>
                          <div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>All Bets ({s.allBets.length})</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6}}>
                            {s.allBets.map(bet=>(
                              <div key={bet.id} style={{background:"#12121c",border:"1px solid #ffffff08",borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderLeft:`3px solid ${bet.status==="Won"?"#4ade80":"#f87171"}`}}>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{bet.match}</div>
                                  <div style={{fontSize:11,color:"#ffffff44"}}>{bet.type} {"·"} {bet.market} {"·"} {bet.price}x {"·"} {bet.date}</div>
                                </div>
                                <div style={{textAlign:"right",flexShrink:0}}>
                                  <div style={{fontSize:14,fontWeight:800,color:bet.status==="Won"?"#4ade80":"#f87171"}}>{bet.status==="Won"?`+$${bet.winnings.toLocaleString()}`:`-$${bet.wager.toLocaleString()}`}</div>
                                  <div style={{fontSize:10,color:"#ffffff33"}}>stake $${bet.wager.toLocaleString()}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ── BET TYPE STATS ── */}
          {betView==="types"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,marginBottom:20}}>
                {betTypeStats.map(s=>{
                  const wr=s.wins/(s.wins+s.losses)||0;
                  const net=s.winAmt-s.lossAmt;
                  const color=wr>=0.55?"#4ade80":wr>=0.45?"#fbbf24":"#f87171";
                  return(
                    <div key={s.type} style={{background:"#12121c",border:`1px solid ${color}22`,borderRadius:12,padding:"16px",position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,width:`${wr*100}%`,height:2,background:`linear-gradient(90deg,${color},${color}66)`}}/>
                      <div style={{fontSize:14,fontWeight:800,color:"#fff",marginBottom:8}}>{s.type}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                        <span style={{fontSize:26,fontWeight:900,color}}>{(wr*100).toFixed(0)}%</span>
                        <span style={{fontSize:11,color:"#ffffff44"}}>{s.bets} bets</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                        <span style={{color:"#ffffff55"}}>{s.wins}W / {s.losses}L</span>
                        <span style={{color:net>=0?"#4ade80":"#f87171",fontWeight:700}}>{net>=0?"+":""}${net.toLocaleString()}</span>
                      </div>
                      <div style={{marginTop:8,height:4,background:"#ffffff08",borderRadius:2}}>
                        <div style={{width:`${wr*100}%`,height:"100%",background:color,borderRadius:2,transition:"width 0.6s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Key insight callout */}
              {(()=>{
                const best=betTypeStats.slice().sort((a,b)=>(b.wins/(b.wins+b.losses)||0)-(a.wins/(a.wins+a.losses)||0))[0];
                const worst=betTypeStats.slice().sort((a,b)=>(a.wins/(a.wins+a.losses)||0)-(b.wins/(b.wins+b.losses)||0))[0];
                const mostProfit=betTypeStats.slice().sort((a,b)=>(b.winAmt-b.lossAmt)-(a.winAmt-a.lossAmt))[0];
                return(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                    {[
                      {l:"Best Win Rate",v:best?.type,s:`${((best?.wins/(best?.wins+best?.losses)||0)*100).toFixed(0)}% WR`,c:"#4ade80"},
                      {l:"Most Profitable",v:mostProfit?.type,s:`+$${(mostProfit?.winAmt-(mostProfit?.lossAmt||0)).toLocaleString()}`,c:"#4ade80"},
                      {l:"Avoid This",v:worst?.type,s:`${((worst?.wins/(worst?.wins+worst?.losses)||0)*100).toFixed(0)}% WR`,c:"#f87171"},
                    ].map((c,i)=>(
                      <div key={i} style={{background:"#12121c",border:`1px solid ${c.c}33`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}>
                        <div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:4}}>{c.l}</div>
                        <div style={{fontSize:16,fontWeight:800,color:c.c||"#fff"}}>{c.v}</div>
                        <div style={{fontSize:11,color:"#ffffff55",marginTop:2}}>{c.s}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── BET LIST ── */}
          {betView==="list"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filteredBets.length===0&&(<div style={{textAlign:"center",padding:40,color:"#ffffff44"}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><div style={{fontSize:14}}>No bets match your filters</div></div>)}
            {filteredBets.map(bet=>(
              <div key={bet.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${bet.status==="Won"?"#4ade80":"#f87171"}`}}>
                <div style={{width:38,height:38,borderRadius:10,background:bet.status==="Won"?"#4ade8015":"#f8717115",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{bet.status==="Won"?"✅":"❌"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{bet.match}</div>
                  <div style={{fontSize:12,color:"#ffffff55",display:"flex",gap:8,flexWrap:"wrap"}}>
                    <span style={{background:LEAGUE_COLORS[bet.league]+"22",color:LEAGUE_COLORS[bet.league]||"#ffffff44",padding:"1px 6px",borderRadius:4,fontWeight:600,fontSize:10}}>{LEAGUE_LABELS[getNcaaLeague(bet)]||bet.league}</span>
                    {bet.freeBet&&<span style={{background:"#fbbf2422",color:"#fbbf24",padding:"1px 6px",borderRadius:4,fontWeight:600,fontSize:10}}>🎁 Free Bet</span>}
                    <span>{bet.type}</span>
                    <span style={{color:"#ffffff33"}}>{"·"}</span>
                    <span>{bet.market}</span>
                    <span style={{color:"#ffffff33"}}>{"·"}</span>
                    <span>{bet.price}x</span>
                    <span style={{color:"#ffffff33"}}>{"·"}</span>
                    <span>{bet.date}</span>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:16,fontWeight:800,color:bet.status==="Won"?"#4ade80":"#f87171"}}>{bet.status==="Won"?`+$${bet.winnings.toLocaleString()}`:`-$${bet.wager.toLocaleString()}`}</div>
                  <div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{"stake: $" + bet.wager.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>}
        </div>)}


        {/* ── PREMIUM: ALL SPORTS ── */}
        {activeSection==="premium"&&(<div>
          {!premiumAuthed?(
            /* LOGIN GATE */
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400}}>
              <div style={{background:"linear-gradient(135deg,#12121c,#1a1a2e)",border:"1px solid #fbbf2433",borderRadius:16,padding:40,maxWidth:400,width:"100%",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔒</div>
                <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:4}}>All Sports Premium</div>
                <div style={{fontSize:13,color:"#ffffff55",marginBottom:28,lineHeight:1.5}}>Craig's full betting history across every sport.<br/>Invite only.</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  <input
                    placeholder="Username"
                    value={premiumUser}
                    onChange={e=>setPremiumUser(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"){const ok=PREMIUM_USERS[premiumUser.toLowerCase()]===premiumPass;if(ok){setPremiumAuthed(true);setFpfAuthed(true);setPremiumError("");const ut=USER_TEAMS[premiumUser.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setPremiumError("Wrong username or password.");}}}}
                    style={{background:"#0a0a0f",border:"1px solid #ffffff22",borderRadius:8,color:"#fff",padding:"10px 14px",fontSize:14,outline:"none",textAlign:"center"}}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={premiumPass}
                    onChange={e=>setPremiumPass(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"){const ok=PREMIUM_USERS[premiumUser.toLowerCase()]===premiumPass;if(ok){setPremiumAuthed(true);setFpfAuthed(true);setPremiumError("");const ut=USER_TEAMS[premiumUser.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setPremiumError("Wrong username or password.");}}}}
                    style={{background:"#0a0a0f",border:"1px solid #ffffff22",borderRadius:8,color:"#fff",padding:"10px 14px",fontSize:14,outline:"none",textAlign:"center"}}
                  />
                </div>
                {premiumError&&<div style={{fontSize:12,color:"#f87171",marginBottom:12}}>{premiumError}</div>}
                <button
                  onClick={()=>{const ok=PREMIUM_USERS[premiumUser.toLowerCase()]===premiumPass;if(ok){setPremiumAuthed(true);setFpfAuthed(true);setPremiumError("");const ut=USER_TEAMS[premiumUser.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setPremiumError("Wrong username or password.");}}}
                  style={{width:"100%",background:"linear-gradient(135deg,#fbbf24,#f59e0b)",border:"none",borderRadius:8,color:"#000",padding:"12px",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:"1px"}}
                >UNLOCK ACCESS</button>
                <div style={{fontSize:11,color:"#ffffff33",marginTop:16}}>Contact Craig for access {"·"} @cnaylor_</div>
              </div>
            </div>
          ):(
            /* PREMIUM CONTENT */
            <div>
              {/* Header with cheeky joke */}
              <div style={{background:"linear-gradient(135deg,#1a0a0a,#1a1a2e)",border:"1px solid #fbbf2433",borderRadius:14,padding:"20px 24px",marginBottom:24,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,right:0,width:200,height:"100%",background:"linear-gradient(135deg,#fbbf2408,transparent)",borderRadius:14}}/>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",color:"#000",fontWeight:800,letterSpacing:"1px"}}>PREMIUM</span>
                      <span style={{fontSize:12,color:"#ffffff55"}}>All Sports {"·"} Full History</span>
                    </div>
                    <h2 style={{fontSize:22,fontWeight:900,color:"#fff",margin:"0 0 4px"}}>Craig's Degenerate Portfolio 📉</h2>
                    <p style={{fontSize:13,color:"#ffffff66",margin:0,lineHeight:1.5,fontStyle:"italic"}}>"Every time I bet on something besides the NFL, a financial advisor somewhere sheds a single tear. This page is proof."</p>
                  </div>
                  <button onClick={()=>{setPremiumAuthed(false);setPremiumUser("");setPremiumPass("");}} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#ffffff66",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,flexShrink:0}}>🔒 Lock</button>
                </div>
              </div>

              {/* Stats */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
                {[
                  {l:"Record",v:`${premStats.wins}-${premStats.losses}`,s:`${premFilteredBets.length} bets shown`},
                  {l:"Win Rate",v:`${(premStats.winRate*100).toFixed(1)}%`,s:"filtered results",c:premStats.winRate>=0.5?"#4ade80":"#f87171"},
                  {l:"Net P&L",v:`${premStats.netProfit>=0?"+":""}$${premStats.netProfit.toLocaleString()}`,s:"winnings - losses",c:premStats.netProfit>=0?"#4ade80":"#f87171"},
                  {l:"Total Wagered",v:`$${premStats.totalWagered.toLocaleString()}`,s:"filtered bets"},
                  {l:"Avg Stake",v:`$${Math.round(premStats.avgStake).toLocaleString()}`,s:"per bet"},
                ].map((s,i)=>(<div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div><div style={{fontSize:20,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div><div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{s.s}</div></div>))}
              </div>

              {/* Filters */}
              <div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>Filter Bets</div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:12}}>
                  <div>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>RESULT</div>
                    <div style={{display:"flex",gap:4}}>
                      {[["all","All"],["won","✅ Won"],["lost","❌ Lost"]].map(([k,l])=>pill(l,premBetResultFilter===k,()=>setPremBetResultFilter(k)))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>SPORT</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {premUniqueLeagues.map(lg=>pill(
                        lg==="all"?"🏆 All":(LEAGUE_LABELS[lg]||lg),
                        premBetLeagueFilter===lg,
                        ()=>setPremBetLeagueFilter(lg),
                        LEAGUE_COLORS[lg]
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
                  <div style={{width:"100%"}}>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>YEAR</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {[{l:"All Time",f:"",t:""},{l:"2026",f:"2026-01-01",t:"2026-12-31"},{l:"2025",f:"2025-01-01",t:"2025-12-31"},{l:"2024",f:"2024-01-01",t:"2024-12-31"}].map(s=>{
                        const active=premBetDateFrom===s.f&&premBetDateTo===s.t;
                        return(<button key={s.l} onClick={()=>{setPremBetDateFrom(s.f);setPremBetDateTo(s.t);}} style={{background:active?`${ac}33`:"#ffffff08",border:`2px solid ${active?ac:"#ffffff15"}`,color:active?"#fff":"#ffffff66",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{s.l}</button>);
                      })}
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>FROM DATE</div>
                    <input type="date" value={premBetDateFrom} onChange={e=>setPremBetDateFrom(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,outline:"none",colorScheme:"dark"}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>TO DATE</div>
                    <input type="date" value={premBetDateTo} onChange={e=>setPremBetDateTo(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:12,outline:"none",colorScheme:"dark"}}/>
                  </div>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:10,color:"#ffffff44",marginBottom:6,fontWeight:600,letterSpacing:"1px"}}>SEARCH</div>
                    <input placeholder="Search match or market..." value={premBetSearch} onChange={e=>setPremBetSearch(e.target.value)} style={{background:"#1a1a2e",border:"1px solid #ffffff15",borderRadius:8,color:"#fff",padding:"6px 12px",fontSize:12,outline:"none",width:"100%"}}/>
                  </div>
                  <button onClick={()=>setPremShowFreeBets(!premShowFreeBets)} style={{background:premShowFreeBets?"#fbbf2422":"#ffffff08",border:`1px solid ${premShowFreeBets?"#fbbf24":"#ffffff15"}`,color:premShowFreeBets?"#fbbf24":"#ffffff55",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{premShowFreeBets?"🎁 Hiding Free Bets: OFF":"🎁 Hide Free Bets"}</button>
                  {(premBetResultFilter!=="all"||premBetLeagueFilter!=="all"||premBetDateFrom||premBetDateTo||premBetSearch)&&(
                    <button onClick={()=>{setPremBetResultFilter("all");setPremBetLeagueFilter("all");setPremBetDateFrom("");setPremBetDateTo("");setPremBetSearch("");}} style={{background:"#e9456022",border:"1px solid #e9456044",color:"#e94560",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700,whiteSpace:"nowrap"}}>{"x"} Clear</button>
                  )}
                </div>
                <div style={{marginTop:10,fontSize:11,color:"#ffffff44"}}>
                  Showing <strong style={{color:"#fff"}}>{premFilteredBets.length}</strong> of {ALL_BETS.length} bets
                  {premBetLeagueFilter!=="all"&&<span> {"·"} <span style={{color:LEAGUE_COLORS[premBetLeagueFilter]||ac}}>{LEAGUE_LABELS[premBetLeagueFilter]||premBetLeagueFilter}</span></span>}
                </div>
              </div>

              {/* Bet list */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {premFilteredBets.length===0&&(<div style={{textAlign:"center",padding:40,color:"#ffffff44"}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><div style={{fontSize:14}}>No bets match your filters</div></div>)}
                {premFilteredBets.map(bet=>(
                  <div key={bet.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${bet.status==="Won"?"#4ade80":bet.status==="Lost"?"#f87171":"#fbbf24"}`}}>
                    <div style={{width:38,height:38,borderRadius:10,background:bet.status==="Won"?"#4ade8015":bet.status==="Lost"?"#f8717115":"#fbbf2415",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{bet.status==="Won"?"✅":bet.status==="Lost"?"❌":"💰"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{bet.match}</div>
                      <div style={{fontSize:12,color:"#ffffff55",display:"flex",gap:8,flexWrap:"wrap"}}>
                        <span style={{background:(LEAGUE_COLORS[getNcaaLeague(bet)]||"#6b7280")+"22",color:LEAGUE_COLORS[getNcaaLeague(bet)]||"#ffffff44",padding:"1px 6px",borderRadius:4,fontWeight:600,fontSize:10}}>{LEAGUE_LABELS[getNcaaLeague(bet)]||bet.league}</span>
                        {bet.freeBet&&<span style={{background:"#fbbf2422",color:"#fbbf24",padding:"1px 6px",borderRadius:4,fontWeight:600,fontSize:10}}>🎁 Free Bet</span>}
                        <span>{bet.type}</span>
                        <span style={{color:"#ffffff33"}}>{"·"}</span>
                        <span>{bet.market}</span>
                        <span style={{color:"#ffffff33"}}>{"·"}</span>
                        <span>{bet.price}x</span>
                        <span style={{color:"#ffffff33"}}>{"·"}</span>
                        <span>{bet.date}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:16,fontWeight:800,color:bet.status==="Won"?"#4ade80":bet.status==="Lost"?"#f87171":"#fbbf24"}}>{bet.status==="Won"?`+$${bet.winnings.toLocaleString()}`:bet.status==="Lost"?`-$${bet.wager.toLocaleString()}`:"Cashed"}</div>
                      <div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{"stake: $" + bet.wager.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>)}

        {/* ── FIVE PICK FRIDAYS ── */}
        {activeSection==="video"&&(<div>
          {!fpfAuthed?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:400}}>
              <div style={{background:"linear-gradient(135deg,#12121c,#1a1a2e)",border:"1px solid #e9456033",borderRadius:16,padding:40,maxWidth:400,width:"100%",textAlign:"center"}}>
                <div style={{fontSize:40,marginBottom:12}}>{"🎬"}</div>
                <div style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:4}}>Five Pick Fridays</div>
                <div style={{fontSize:13,color:"#ffffff55",marginBottom:28,lineHeight:1.5}}>{"Craig's 5 best picks every Friday."}<br/>Invite only.</div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                  <input placeholder="Username" value={fpfPass} onChange={e=>setFpfPass(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const ok=PREMIUM_USERS[fpfPass.toLowerCase()]===premiumPass;if(ok){setFpfAuthed(true);setPremiumAuthed(true);setFpfError("");const ut=USER_TEAMS[fpfPass.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setFpfError("Wrong username or password.");}}}} style={{background:"#0a0a0f",border:"1px solid #ffffff22",borderRadius:8,color:"#fff",padding:"10px 14px",fontSize:14,outline:"none",textAlign:"center"}}/>
                  <input type="password" placeholder="Password" value={premiumPass} onChange={e=>setPremiumPass(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){const ok=PREMIUM_USERS[fpfPass.toLowerCase()]===premiumPass;if(ok){setFpfAuthed(true);setPremiumAuthed(true);setFpfError("");const ut=USER_TEAMS[fpfPass.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setFpfError("Wrong username or password.");}}}} style={{background:"#0a0a0f",border:"1px solid #ffffff22",borderRadius:8,color:"#fff",padding:"10px 14px",fontSize:14,outline:"none",textAlign:"center"}}/>
                </div>
                {fpfError&&<div style={{fontSize:12,color:"#f87171",marginBottom:12}}>{fpfError}</div>}
                <button onClick={()=>{const ok=PREMIUM_USERS[fpfPass.toLowerCase()]===premiumPass;if(ok){setFpfAuthed(true);setPremiumAuthed(true);setFpfError("");const ut=USER_TEAMS[fpfPass.toLowerCase()];if(ut){setSelectedTeam(ut);setFeedFilter("team");}}else{setFpfError("Wrong username or password.");}}} style={{width:"100%",background:"linear-gradient(135deg,#e94560,#c0283e)",border:"none",borderRadius:8,color:"#fff",padding:"12px",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:"1px"}}>UNLOCK PICKS</button>
                <div style={{fontSize:11,color:"#ffffff33",marginTop:16}}>Contact Craig for access · @cnaylor_</div>
              </div>
            </div>
          ):(
            <div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}><CraigAvatar size={56}/>
            <div style={{flex:1}}><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>Five Pick Fridays</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Every Friday during NFL season  --  Craig&#39;s 5 best bets + Thursday Night recap</div><a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>{"X"} @cnaylor_</a></div>
            <div style={{background:"#12121c",border:"1px solid #ffffff15",borderRadius:12,padding:"12px 20px",display:"flex",gap:20,alignItems:"center",flexShrink:0}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>Season</div><div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{seasonRecord.w}-{seasonRecord.l}{seasonRecord.p>0&&<span style={{color:"#fbbf24",fontSize:14}}>-{seasonRecord.p}</span>}</div></div>
              <div style={{width:1,height:36,background:"#ffffff15"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>Win %</div><div style={{fontSize:22,fontWeight:900,color:((seasonRecord.w/(seasonRecord.w+seasonRecord.l))*100)>=55?"#4ade80":"#fbbf24"}}>{((seasonRecord.w/(seasonRecord.w+seasonRecord.l))*100).toFixed(0)}%</div></div>
              <div style={{width:1,height:36,background:"#ffffff15"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>Picks</div><div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{seasonRecord.w+seasonRecord.l+seasonRecord.p}</div></div>
            </div>
          </div>
          <div style={{background:`linear-gradient(135deg,${pc}44,#12121c)`,border:`1px solid ${ac}33`,borderRadius:14,padding:20,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><div style={{background:"#e94560",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>LATEST</div><span style={{fontSize:11,color:"#ffffff55"}}>{WEEKLY_VIDEOS[0].date}</span></div>
            <h3 style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:6}}>{WEEKLY_VIDEOS[0].title}</h3>
            <p style={{fontSize:13,color:"#ffffff77",lineHeight:1.5,marginBottom:12}}>{WEEKLY_VIDEOS[0].description}</p>
            <div style={{background:"#12121c",borderRadius:12,height:200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",marginBottom:12}}>
              <img src={CP} alt="Craig Naylor" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"brightness(0.4)"}}/>
              <div style={{position:"absolute",bottom:12,left:14,zIndex:2}}><div style={{background:"#e94560",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#fff",display:"inline-block",marginBottom:4}}>FIVE PICK FRIDAYS</div><div style={{fontSize:13,fontWeight:700,color:"#fff",textShadow:"0 1px 4px #000"}}>Week 17 Picks + TNF Recap</div></div>
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,cursor:"pointer",zIndex:2,boxShadow:"0 0 30px rgba(0,0,0,0.4)",border:"2px solid rgba(255,255,255,0.3)"}}>{">"}</div>
              <div style={{position:"absolute",top:10,right:12,background:"rgba(0,0,0,0.7)",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#fff",fontWeight:600,zIndex:2}}>{WEEKLY_VIDEOS[0].duration}</div>
            </div>
            <div style={{display:"flex",gap:16,fontSize:12,color:"#ffffff55"}}><span>⏱️ {WEEKLY_VIDEOS[0].duration}</span><span>👁️ {WEEKLY_VIDEOS[0].views} views</span></div>
            <div style={{marginTop:14,borderTop:"1px solid #ffffff10",paddingTop:12}}><div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>This Week&#39;s Picks</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{WEEKLY_VIDEOS[0].picks.map((p,i)=>(<div key={i} style={{background:p.result==="win"?"#4ade8012":p.result==="loss"?"#f8717112":"#fbbf2412",border:`1px solid ${p.result==="win"?"#4ade8033":p.result==="loss"?"#f8717133":"#fbbf2433"}`,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:600,color:"#fff"}}>{p.pick}</span><span style={{fontSize:10}}>{p.result==="win"?"✅":p.result==="loss"?"❌":"P"}</span></div>))}</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Previous Episodes</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{WEEKLY_VIDEOS.slice(1).map(v=>(<div key={v.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
            <div style={{width:64,height:44,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",overflow:"hidden"}}><img src={CP} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"brightness(0.35)"}}/><span style={{fontSize:14,zIndex:1,color:"#fff"}}>{">"}</span></div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{v.title}</div><div style={{fontSize:12,color:"#ffffff55",marginBottom:4}}>{v.date} {"·"} {v.duration} {"·"} {v.views} views</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{v.picks.map((p,i)=>(<span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:p.result==="win"?"#4ade8015":p.result==="loss"?"#f8717115":"#fbbf2415",color:p.result==="win"?"#4ade80":p.result==="loss"?"#f87171":"#fbbf24",fontWeight:600}}>{p.result==="win"?"W":p.result==="loss"?"L":"P"}</span>))}</div>
            </div>
          </div>))}</div>
          <div style={{background:"#ffffff06",border:"1px dashed #ffffff15",borderRadius:12,padding:20,textAlign:"center",marginTop:20}}><div style={{fontSize:13,color:"#ffffff55"}}>🔔 New episode every <strong style={{color:"#fff"}}>Friday</strong> during NFL season</div><div style={{fontSize:12,color:"#ffffff44",marginTop:4}}>Subscribe to never miss Five Pick Fridays</div></div>
            </div>
          )}
        </div>)}

      </div>
    </div>
    <style jsx global>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:3px}button:hover{opacity:0.85}html,body{background:#0a0a0f}input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}`}</style>
  </>);
}
