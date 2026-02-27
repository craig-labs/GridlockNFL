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
    Ravens:[{handle:"Ravens",label:"Baltimore Ravens",emoji:"🦅"},{handle:"jamisonhensley",label:"Jamison Hensley",emoji:"📰",desc:"ESPN Ravens beat"},{handle:"jeffzrebiec",label:"Jeff Zrebiec",emoji:"📋",desc:"The Athletic"},{handle:"jonas_shaffer",label:"Jonas Shaffer",emoji:"📋",desc:"Baltimore Banner"},{handle:"Lj_era8",label:"Lamar Jackson",emoji:"🌟",desc:"QB — 2x MVP"},{handle:"ZayFlowers",label:"Zay Flowers",emoji:"🎯",desc:"WR"}],
    Bengals:[{handle:"Bengals",label:"Cincinnati Bengals",emoji:"🐯"},{handle:"Ben_Baby",label:"Ben Baby",emoji:"📰",desc:"ESPN Bengals beat"},{handle:"pauldehnerjr",label:"Paul Dehner Jr.",emoji:"📋",desc:"The Athletic"},{handle:"JoeGoodberry",label:"Joe Goodberry",emoji:"📋",desc:"Film analyst"},{handle:"GeoffHobsonCin",label:"Geoff Hobson",emoji:"📋",desc:"Bengals.com"},{handle:"JoeyB",label:"Joe Burrow",emoji:"🌟",desc:"QB"},{handle:"Real10jayy__",label:"Ja'Marr Chase",emoji:"🎯",desc:"WR"}],
    Browns:[{handle:"Browns",label:"Cleveland Browns",emoji:"🟤"},{handle:"MaryKayCabot",label:"Mary Kay Cabot",emoji:"📰",desc:"Cleveland.com"},{handle:"AkronJackson",label:"Zac Jackson",emoji:"📋",desc:"The Athletic"},{handle:"Flash_Garrett",label:"Myles Garrett",emoji:"🌟",desc:"DE — DPOY"}],
    Steelers:[{handle:"steelers",label:"Pittsburgh Steelers",emoji:"⚙️"},{handle:"BrookePryor",label:"Brooke Pryor",emoji:"📰",desc:"ESPN Steelers beat"},{handle:"MarkKaboly",label:"Mark Kaboly",emoji:"📋",desc:"McAfee Show"},{handle:"TJWatt",label:"T.J. Watt",emoji:"🌟",desc:"OLB"}],
    Texans:[{handle:"HoustonTexans",label:"Houston Texans",emoji:"🐂"},{handle:"DJBienAime",label:"DJ Bien-Aime",emoji:"📰",desc:"ESPN Texans beat"},{handle:"CJStroud7",label:"C.J. Stroud",emoji:"🌟",desc:"QB"},{handle:"NicoCollins",label:"Nico Collins",emoji:"🎯",desc:"WR"}],
    Colts:[{handle:"Colts",label:"Indianapolis Colts",emoji:"🐴"},{handle:"HolderStephen",label:"Stephen Holder",emoji:"📰",desc:"ESPN Colts beat"},{handle:"JonathanTaylor",label:"Jonathan Taylor",emoji:"🏃",desc:"RB"}],
    Jaguars:[{handle:"Jaguars",label:"Jacksonville Jaguars",emoji:"🐆"},{handle:"MikeDiRocco",label:"Mike DiRocco",emoji:"📰",desc:"ESPN Jaguars beat"},{handle:"Demetrius82",label:"Demetrius Harvey",emoji:"📋",desc:"FL Times-Union"},{handle:"TravisETN",label:"Travis Etienne",emoji:"🏃",desc:"RB"}],
    Titans:[{handle:"Titans",label:"Tennessee Titans",emoji:"⚔️"},{handle:"TDavenport_NFL",label:"Turron Davenport",emoji:"📰",desc:"ESPN Titans beat"},{handle:"jwyattsports",label:"Jim Wyatt",emoji:"📋",desc:"Titans.com"},{handle:"TonyPollard",label:"Tony Pollard",emoji:"🏃",desc:"RB"}],
    Bills:[{handle:"BuffaloBills",label:"Buffalo Bills",emoji:"🦬"},{handle:"JoeBuscaglia",label:"Joe Buscaglia",emoji:"📰",desc:"The Athletic"},{handle:"MattParrino",label:"Matt Parrino",emoji:"📋",desc:"Syracuse.com"},{handle:"JoshAllenQB",label:"Josh Allen",emoji:"🌟",desc:"QB — MVP candidate"},{handle:"JCookfor6",label:"James Cook",emoji:"🏃",desc:"RB"}],
    Dolphins:[{handle:"MiamiDolphins",label:"Miami Dolphins",emoji:"🐬"},{handle:"DavidFurones_",label:"David Furones",emoji:"📰",desc:"Sun Sentinel"},{handle:"schadjoe",label:"Joe Schad",emoji:"📋",desc:"Palm Beach Post"}],
    Patriots:[{handle:"Patriots",label:"New England Patriots",emoji:"🇺🇸"},{handle:"MikeReiss",label:"Mike Reiss",emoji:"📰",desc:"ESPN Patriots beat"},{handle:"PhilAPerry",label:"Phil Perry",emoji:"📋",desc:"NBC Sports"},{handle:"DrakeMaye10",label:"Drake Maye",emoji:"🌟",desc:"QB"}],
    Jets:[{handle:"nyjets",label:"New York Jets",emoji:"✈️"},{handle:"RichCimini",label:"Rich Cimini",emoji:"📰",desc:"ESPN Jets beat"},{handle:"BrianCoz",label:"Brian Costello",emoji:"📋",desc:"NY Post"},{handle:"Garrett_Wilson",label:"Garrett Wilson",emoji:"🎯",desc:"WR"}],
    Broncos:[{handle:"Broncos",label:"Denver Broncos",emoji:"🐎"},{handle:"JeffLegwold",label:"Jeff Legwold",emoji:"📰",desc:"ESPN Broncos beat"},{handle:"mikeklis",label:"Mike Klis",emoji:"📋",desc:"9NEWS"},{handle:"TroyRenck",label:"Troy Renck",emoji:"📋",desc:"Denver7"}],
    Chiefs:[{handle:"Chiefs",label:"Kansas City Chiefs",emoji:"🏹"},{handle:"adamteicher",label:"Adam Teicher",emoji:"📰",desc:"ESPN Chiefs beat"},{handle:"mattderrick",label:"Matt Derrick",emoji:"📋",desc:"Chiefs Digest"},{handle:"PatrickMahomes",label:"Patrick Mahomes",emoji:"🌟",desc:"QB — 3x SB MVP"}],
    Raiders:[{handle:"Raiders",label:"Las Vegas Raiders",emoji:"☠️"},{handle:"tashanreed",label:"Tashan Reed",emoji:"📰",desc:"The Athletic"},{handle:"VinnyBonsignore",label:"Vincent Bonsignore",emoji:"📋",desc:"LV Review-Journal"},{handle:"CrosbyMaxx",label:"Maxx Crosby",emoji:"🌟",desc:"DE"}],
    Chargers:[{handle:"chargers",label:"Los Angeles Chargers",emoji:"⚡"},{handle:"krisrhim1",label:"Kris Rhim",emoji:"📰",desc:"ESPN Chargers beat"},{handle:"danielrpopper",label:"Daniel Popper",emoji:"📋",desc:"The Athletic"},{handle:"JustinHerbert",label:"Justin Herbert",emoji:"🌟",desc:"QB"}],
    Bears:[{handle:"ChicagoBears",label:"Chicago Bears",emoji:"🐻"},{handle:"CourtneyRCronin",label:"Courtney Cronin",emoji:"📰",desc:"ESPN Bears beat"},{handle:"adamjahns",label:"Adam Jahns",emoji:"📋",desc:"The Athletic"},{handle:"kfishbain",label:"Kevin Fishbain",emoji:"📋",desc:"The Athletic"},{handle:"CalebWilliams",label:"Caleb Williams",emoji:"🌟",desc:"QB — #1 pick"},{handle:"DJMoore",label:"DJ Moore",emoji:"🎯",desc:"WR"}],
    Lions:[{handle:"Lions",label:"Detroit Lions",emoji:"🦁"},{handle:"EricWoodyard",label:"Eric Woodyard",emoji:"📰",desc:"ESPN Lions beat"},{handle:"davebirkett",label:"Dave Birkett",emoji:"📋",desc:"Detroit Free Press"},{handle:"JaredGoff",label:"Jared Goff",emoji:"🌟",desc:"QB"},{handle:"ArStBr",label:"Amon-Ra St. Brown",emoji:"🎯",desc:"WR"}],
    Packers:[{handle:"packers",label:"Green Bay Packers",emoji:"🧀"},{handle:"RobDemovsky",label:"Rob Demovsky",emoji:"📰",desc:"ESPN Packers beat"},{handle:"mattschneidman",label:"Matt Schneidman",emoji:"📋",desc:"The Athletic"},{handle:"jordan3love",label:"Jordan Love",emoji:"🌟",desc:"QB"}],
    Vikings:[{handle:"Vikings",label:"Minnesota Vikings",emoji:"⛵"},{handle:"KevinSeifert",label:"Kevin Seifert",emoji:"📰",desc:"ESPN Vikings beat"},{handle:"ArifHasanNFL",label:"Arif Hasan",emoji:"📋",desc:"Vikings analyst"},{handle:"JJettas2",label:"Justin Jefferson",emoji:"🌟",desc:"WR — Best in NFL"}],
    Falcons:[{handle:"AtlantaFalcons",label:"Atlanta Falcons",emoji:"🦅"},{handle:"marcraimondi",label:"Marc Raimondi",emoji:"📰",desc:"ESPN Falcons beat"},{handle:"ZachKleinWSB",label:"Zach Klein",emoji:"📋",desc:"WSB"},{handle:"DrakeJLondon",label:"Drake London",emoji:"🎯",desc:"WR"}],
    Panthers:[{handle:"Panthers",label:"Carolina Panthers",emoji:"🐈‍⬛"},{handle:"DNewtonespn",label:"David Newton",emoji:"📰",desc:"ESPN Panthers beat"},{handle:"josephperson",label:"Joe Person",emoji:"📋",desc:"The Athletic"},{handle:"BryceYoung",label:"Bryce Young",emoji:"🌟",desc:"QB"}],
    Saints:[{handle:"Saints",label:"New Orleans Saints",emoji:"⚜️"},{handle:"Kat_Terrell",label:"Katherine Terrell",emoji:"📰",desc:"ESPN Saints beat"},{handle:"MikeTriplett",label:"Mike Triplett",emoji:"📋",desc:"NewOrleans.football"},{handle:"A_kamara6",label:"Alvin Kamara",emoji:"🏃",desc:"RB"}],
    Buccaneers:[{handle:"Buccaneers",label:"Tampa Bay Buccaneers",emoji:"🏴‍☠️"},{handle:"JennaLaineESPN",label:"Jenna Laine",emoji:"📰",desc:"ESPN Bucs beat"},{handle:"gregauman",label:"Greg Auman",emoji:"📋",desc:"FOX Sports"},{handle:"BakerMayfield",label:"Baker Mayfield",emoji:"🌟",desc:"QB"},{handle:"MikeEvans",label:"Mike Evans",emoji:"🎯",desc:"WR"}],
    Cowboys:[{handle:"dallascowboys",label:"Dallas Cowboys",emoji:"⭐"},{handle:"toddarcher",label:"Todd Archer",emoji:"📰",desc:"ESPN Cowboys beat"},{handle:"TimCowlishaw",label:"Tim Cowlishaw",emoji:"📋",desc:"Dallas Morning News"},{handle:"CeeDee",label:"CeeDee Lamb",emoji:"🎯",desc:"WR"}],
    Giants:[{handle:"Giants",label:"New York Giants",emoji:"🗽"},{handle:"JordanRaanan",label:"Jordan Raanan",emoji:"📰",desc:"ESPN Giants beat"},{handle:"DDuggan21",label:"Dan Duggan",emoji:"📋",desc:"The Athletic"},{handle:"MalikNabers",label:"Malik Nabers",emoji:"🎯",desc:"WR"}],
    Eagles:[{handle:"Eagles",label:"Philadelphia Eagles",emoji:"🦅"},{handle:"TimMcManus",label:"Tim McManus",emoji:"📰",desc:"ESPN Eagles beat"},{handle:"ZBerm",label:"Zach Berman",emoji:"📋",desc:"PHLY"},{handle:"Jeff_McLane",label:"Jeff McLane",emoji:"📋",desc:"Philly Inquirer"},{handle:"JalenHurts",label:"Jalen Hurts",emoji:"🌟",desc:"QB"},{handle:"AJBrown",label:"A.J. Brown",emoji:"🎯",desc:"WR"}],
    Commanders:[{handle:"Commanders",label:"Washington Commanders",emoji:"🎖️"},{handle:"john_keim",label:"John Keim",emoji:"📰",desc:"ESPN Commanders beat"},{handle:"BenStandig",label:"Ben Standig",emoji:"📋",desc:"The Athletic"},{handle:"JaydenDaniels",label:"Jayden Daniels",emoji:"🌟",desc:"QB — OROY"},{handle:"TerryMcLaurin",label:"Terry McLaurin",emoji:"🎯",desc:"WR"}],
    Cardinals:[{handle:"AZCardinals",label:"Arizona Cardinals",emoji:"🐦"},{handle:"BoBrack",label:"Bo Brack",emoji:"📰",desc:"PHNX Sports"},{handle:"JohnnyVenerable",label:"Johnny Venerable",emoji:"📋",desc:"PHNX Sports"},{handle:"K1",label:"Kyler Murray",emoji:"🌟",desc:"QB"}],
    Rams:[{handle:"RamsNFL",label:"Los Angeles Rams",emoji:"🐏"},{handle:"JourdanRodrigue",label:"Jourdan Rodrigue",emoji:"📰",desc:"The Athletic"},{handle:"LATimesklein",label:"Gary Klein",emoji:"📋",desc:"LA Times"},{handle:"CooperKupp",label:"Cooper Kupp",emoji:"🎯",desc:"WR"}],
    "49ers":[{handle:"49ers",label:"San Francisco 49ers",emoji:"⛏️"},{handle:"NickWagoner",label:"Nick Wagoner",emoji:"📰",desc:"ESPN 49ers beat"},{handle:"VicTafur",label:"Vic Tafur",emoji:"📋",desc:"The Athletic"},{handle:"LombardiHimself",label:"David Lombardi",emoji:"📋",desc:"The Athletic"},{handle:"CMC_22",label:"Christian McCaffrey",emoji:"🏃",desc:"RB"},{handle:"Kittle",label:"George Kittle",emoji:"🎯",desc:"TE"}],
    Seahawks:[{handle:"Seahawks",label:"Seattle Seahawks",emoji:"🦅"},{handle:"BradyHenderson",label:"Brady Henderson",emoji:"📰",desc:"ESPN Seahawks beat"},{handle:"bcondotta",label:"Bob Condotta",emoji:"📋",desc:"Seattle Times"},{handle:"gbellseattle",label:"Gregg Bell",emoji:"📋",desc:"Tacoma News Tribune"},{handle:"SamDarnold",label:"Sam Darnold",emoji:"🌟",desc:"QB — SB LX champ"},{handle:"JSN_11",label:"Jaxon Smith-Njigba",emoji:"🎯",desc:"WR"}],
  },
};

function TwitterFeed({accounts,ac}){
  if(!accounts||!accounts.length)return null;
  return(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
    {accounts.map(a=>(<a key={a.handle} href={`https://x.com/${a.handle}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}><div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:`${ac}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.emoji||"🏈"}</div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.label}</div><div style={{fontSize:12,color:"#1DA1F2",fontWeight:500}}>@{a.handle}</div>{a.desc&&<div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{a.desc}</div>}</div>
      <span style={{background:"#1DA1F222",color:"#1DA1F2",padding:"4px 10px",borderRadius:6,fontWeight:600,fontSize:11,flexShrink:0}}>View 𝕏</span>
    </div></a>))}
  </div>);
}

const fmtVol=(v)=>{if(!v)return"$0";const d=v/100;if(d>=1e6)return`$${(d/1e6).toFixed(1)}M`;if(d>=1e3)return`$${(d/1e3).toFixed(0)}K`;return`$${d.toFixed(0)}`;};
const useKalshi=()=>{
  const [events,setEvents]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);const [lastFetch,setLastFetch]=useState(null);
  const f=useCallback(async()=>{setLoading(true);setError(null);try{const r=await fetch("/api/kalshi");if(!r.ok)throw new Error(`API ${r.status}`);const d=await r.json();setEvents(d.events||[]);setLastFetch(new Date());}catch(e){setError(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{f();},[f]);return{events,loading,error,lastFetch,refresh:f};
};

const useNflNews=(teamName)=>{
  const [articles,setArticles]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);
  const f=useCallback(async()=>{setLoading(true);setError(null);try{const url=teamName?`/api/news?team=${encodeURIComponent(teamName)}`:"/api/news";const r=await fetch(url);if(!r.ok)throw new Error(`API ${r.status}`);const d=await r.json();setArticles(d.articles||[]);}catch(e){setError(e.message);}finally{setLoading(false);}},[teamName]);
  useEffect(()=>{f();},[f]);return{articles,loading,error,refresh:f};
};

function TopStories({articles,ac}){
  if(!articles||!articles.length)return null;
  const main=articles[0],rest=articles.slice(1,5);
  const ago=(d)=>{if(!d)return"";const m=Math.floor((Date.now()-new Date(d).getTime())/60000);if(m<60)return`${m}m ago`;if(m<1440)return`${Math.floor(m/60)}h ago`;return`${Math.floor(m/1440)}d ago`;};
  return(<div style={{marginBottom:24}}>
    <div style={{fontSize:12,color:"#ffffff55",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>📰 Top Stories</div>
    <div style={{display:"grid",gridTemplateColumns:rest.length?"2fr 1fr":"1fr",gap:12}}>
      <a href={main.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}><div style={{background:"linear-gradient(135deg,#1a1a2e,#12121c)",border:"1px solid #ffffff12",borderRadius:14,overflow:"hidden",cursor:"pointer",borderLeft:`4px solid ${ac}`}}>
        {main.image&&<div style={{width:"100%",height:180,backgroundImage:`url(${main.image})`,backgroundSize:"cover",backgroundPosition:"center"}}/>}
        <div style={{padding:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:`${ac}22`,color:ac,fontWeight:700}}>🔥 Breaking</span><span style={{fontSize:10,color:"#ffffff44"}}>{ago(main.published)}</span></div>
          <h3 style={{fontSize:17,fontWeight:800,color:"#fff",lineHeight:1.3,marginBottom:6}}>{main.headline}</h3>
          <p style={{fontSize:12,color:"#ffffff66",lineHeight:1.5,margin:0}}>{main.description?.slice(0,140)}{main.description?.length>140?"...":""}</p>
          <div style={{fontSize:11,color:ac,marginTop:10,fontWeight:600}}>Read full story →</div>
        </div>
      </div></a>
      {rest.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {rest.map((s,i)=>(<a key={i} href={s.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",flex:1}}><div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:10,padding:12,cursor:"pointer",display:"flex",gap:10,alignItems:"center",height:"100%"}}>
          {s.image&&<div style={{width:60,height:50,borderRadius:6,backgroundImage:`url(${s.image})`,backgroundSize:"cover",backgroundPosition:"center",flexShrink:0}}/>}
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:9,color:"#ffffff44",fontWeight:600,marginBottom:3}}>{ago(s.published)} · {s.source}</div><div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{s.headline}</div></div>
        </div></a>))}
      </div>}
    </div>
  </div>);
}// ===== BETS DATA — Real 2025 Season =====
const MOCK_BETS=[
  {id:155,type:"Spread",matchup:"Seahawks -3 vs Patriots (SB LX)",odds:"-110",stake:"$600",result:"win",payout:"+$545",date:"Feb 8"},
  {id:154,type:"Player Prop",matchup:"Kenneth Walker O75.5 Rush Yds (SB)",odds:"-115",stake:"$250",result:"win",payout:"+$217",date:"Feb 8"},
  {id:153,type:"Over/Under",matchup:"SEA/NE U44.5 (SB)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Feb 8"},
  {id:152,type:"Moneyline",matchup:"Patriots ML (SB)",odds:"+140",stake:"$150",result:"loss",payout:"-$150",date:"Feb 8"},
  {id:151,type:"Spread",matchup:"Seahawks -3.5 vs Rams (NFCCG)",odds:"-110",stake:"$400",result:"win",payout:"+$364",date:"Jan 25"},
  {id:150,type:"Over/Under",matchup:"SEA/LAR O47 (NFCCG)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 25"},
  {id:149,type:"Moneyline",matchup:"Rams ML (NFCCG)",odds:"+160",stake:"$100",result:"loss",payout:"-$100",date:"Jan 25"},
  {id:148,type:"Moneyline",matchup:"Patriots ML vs Broncos (AFCCG)",odds:"+145",stake:"$200",result:"win",payout:"+$290",date:"Jan 25"},
  {id:147,type:"Under",matchup:"NE/DEN U38.5 (AFCCG)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 25"},
  {id:146,type:"Spread",matchup:"Broncos -3 vs Patriots (AFCCG)",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Jan 25"},
  {id:145,type:"Spread",matchup:"Seahawks -7 vs 49ers (Div)",odds:"-110",stake:"$300",result:"win",payout:"+$273",date:"Jan 18"},
  {id:144,type:"Under",matchup:"SEA/SF U44 (Div)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 18"},
  {id:143,type:"Moneyline",matchup:"Rams ML vs Bears (Div)",odds:"+135",stake:"$150",result:"win",payout:"+$203",date:"Jan 18"},
  {id:142,type:"Spread",matchup:"Bears -3 vs Rams (Div)",odds:"-110",stake:"$100",result:"loss",payout:"-$100",date:"Jan 18"},
  {id:141,type:"Moneyline",matchup:"Bills ML vs Broncos (Div)",odds:"+125",stake:"$150",result:"loss",payout:"-$150",date:"Jan 17"},
  {id:140,type:"Over/Under",matchup:"DEN/BUF O45.5 (Div)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 17"},
  {id:139,type:"Spread",matchup:"Patriots -3.5 vs Texans (Div)",odds:"-110",stake:"$250",result:"win",payout:"+$227",date:"Jan 17"},
  {id:138,type:"Player Prop",matchup:"Drake Maye O1.5 Pass TDs (Div)",odds:"-130",stake:"$130",result:"win",payout:"+$100",date:"Jan 17"},
  {id:137,type:"Spread",matchup:"Texans -6 vs Steelers (WC)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 12"},
  {id:136,type:"Under",matchup:"HOU/PIT U41 (WC)",odds:"-110",stake:"$100",result:"win",payout:"+$91",date:"Jan 12"},
  {id:135,type:"Moneyline",matchup:"Bills ML vs Jaguars (WC)",odds:"-155",stake:"$200",result:"win",payout:"+$129",date:"Jan 11"},
  {id:134,type:"Over/Under",matchup:"BUF/JAX O44 (WC)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 11"},
  {id:133,type:"Spread",matchup:"Patriots -4 vs Chargers (WC)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 10"},
  {id:132,type:"Under",matchup:"NE/LAC U39 (WC)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 10"},
  {id:131,type:"Moneyline",matchup:"Panthers ML vs Rams (WC)",odds:"+130",stake:"$100",result:"loss",payout:"-$100",date:"Jan 10"},
  {id:130,type:"Over/Under",matchup:"LAR/CAR O47 (WC)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 10"},
  {id:129,type:"Spread",matchup:"Bears -2.5 vs Packers (WC)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 10"},
  {id:128,type:"Moneyline",matchup:"Eagles ML vs 49ers (WC)",odds:"-175",stake:"$175",result:"loss",payout:"-$175",date:"Jan 10"},
  {id:127,type:"Spread",matchup:"49ers +3.5 vs Eagles (WC)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 10"},
  {id:126,type:"Spread",matchup:"Seahawks -6 vs Cardinals",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 4"},
  {id:125,type:"Moneyline",matchup:"Broncos ML vs Chiefs",odds:"-200",stake:"$200",result:"loss",payout:"-$200",date:"Jan 4"},
  {id:124,type:"Spread",matchup:"Patriots -3 vs Bills",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Jan 4"},
  {id:123,type:"Parlay",matchup:"2-Leg: SEA ML + DEN ML",odds:"+130",stake:"$150",result:"loss",payout:"-$150",date:"Jan 4"},
  {id:122,type:"Over/Under",matchup:"Bears/Lions O44",odds:"-110",stake:"$100",result:"loss",payout:"-$100",date:"Jan 4"},
  {id:121,type:"Player Prop",matchup:"Sam Darnold O235.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Jan 4"},
  {id:120,type:"Teaser",matchup:"2-Team: SEA+3/DEN+7",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Jan 4"},
  {id:119,type:"Spread",matchup:"Bears -3 vs Packers",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 28"},
  {id:118,type:"Moneyline",matchup:"Seahawks ML vs Rams",odds:"-145",stake:"$200",result:"win",payout:"+$138",date:"Dec 28"},
  {id:117,type:"Spread",matchup:"Broncos -7 vs Bengals",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 28"},
  {id:116,type:"Player Prop",matchup:"Josh Allen O2.5 TDs",odds:"+120",stake:"$150",result:"loss",payout:"-$150",date:"Dec 28"},
  {id:115,type:"Parlay",matchup:"3-Leg: SEA/DEN/CHI ML",odds:"+350",stake:"$75",result:"win",payout:"+$263",date:"Dec 28"},
  {id:114,type:"Moneyline",matchup:"Jaguars ML vs Colts",odds:"-160",stake:"$160",result:"loss",payout:"-$160",date:"Dec 28"},
  {id:113,type:"Spread",matchup:"Seahawks -4 vs Vikings",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 21"},
  {id:112,type:"Moneyline",matchup:"Patriots ML vs Colts",odds:"-200",stake:"$200",result:"loss",payout:"-$200",date:"Dec 21"},
  {id:111,type:"Player Prop",matchup:"Bo Nix O245.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Dec 21"},
  {id:110,type:"Spread",matchup:"Bills -3 vs Jets",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Dec 21"},
  {id:109,type:"Teaser",matchup:"2-Team: SEA+3/NE+4",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 21"},
  {id:108,type:"Spread",matchup:"Broncos -6 vs Browns",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 14"},
  {id:107,type:"Moneyline",matchup:"Seahawks ML vs Packers",odds:"-175",stake:"$175",result:"loss",payout:"-$175",date:"Dec 14"},
  {id:106,type:"Spread",matchup:"Bears -3.5 vs Lions",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Dec 14"},
  {id:105,type:"Player Prop",matchup:"Caleb Williams O1.5 Pass TDs",odds:"-140",stake:"$140",result:"win",payout:"+$100",date:"Dec 14"},
  {id:104,type:"Parlay",matchup:"2-Leg: DEN ML + SEA ML",odds:"+120",stake:"$150",result:"loss",payout:"-$150",date:"Dec 14"},
  {id:103,type:"Spread",matchup:"Texans -4 vs Titans",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Dec 14"},
  {id:102,type:"Spread",matchup:"Patriots -3 vs Steelers",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 7"},
  {id:101,type:"Moneyline",matchup:"Seahawks ML vs 49ers",odds:"-145",stake:"$200",result:"win",payout:"+$138",date:"Dec 7"},
  {id:100,type:"Spread",matchup:"Bears -4 vs Vikings",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Dec 7"},
  {id:99,type:"Player Prop",matchup:"Kenneth Walker O80.5 Rush",odds:"-115",stake:"$150",result:"win",payout:"+$130",date:"Dec 7"},
  {id:98,type:"Moneyline",matchup:"Eagles ML vs Panthers",odds:"-250",stake:"$250",result:"loss",payout:"-$250",date:"Dec 7"},
  {id:97,type:"Teaser",matchup:"2-Team: NE+3/SEA+3",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Dec 7"},
  {id:96,type:"Spread",matchup:"Broncos -7 vs Raiders",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 30"},
  {id:95,type:"Moneyline",matchup:"Bears ML vs Cardinals",odds:"-200",stake:"$200",result:"loss",payout:"-$200",date:"Nov 30"},
  {id:94,type:"Spread",matchup:"Seahawks -3 vs Eagles",odds:"-110",stake:"$200",result:"loss",payout:"-$200",date:"Nov 30"},
  {id:93,type:"Parlay",matchup:"2-Leg: DEN ML + CHI ML",odds:"+115",stake:"$150",result:"loss",payout:"-$150",date:"Nov 30"},
  {id:92,type:"Player Prop",matchup:"Drake Maye O245.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Nov 30"},
  {id:91,type:"Moneyline",matchup:"Rams ML vs Saints",odds:"-160",stake:"$160",result:"loss",payout:"-$160",date:"Nov 30"},
  {id:90,type:"Spread",matchup:"Jaguars -2 vs Titans",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Nov 23"},
  {id:89,type:"Moneyline",matchup:"Patriots ML vs Dolphins",odds:"-175",stake:"$175",result:"loss",payout:"-$175",date:"Nov 23"},
  {id:88,type:"Spread",matchup:"Broncos -4 vs Falcons",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 23"},
  {id:87,type:"Player Prop",matchup:"Sam Darnold O1.5 TDs",odds:"-125",stake:"$125",result:"win",payout:"+$100",date:"Nov 23"},
  {id:86,type:"Moneyline",matchup:"Chiefs ML vs Bills",odds:"+130",stake:"$150",result:"loss",payout:"-$150",date:"Nov 23"},
  {id:85,type:"Parlay",matchup:"3-Leg: DEN/NE/JAX ML",odds:"+320",stake:"$75",result:"loss",payout:"-$75",date:"Nov 23"},
  {id:84,type:"Teaser",matchup:"2-Team: DEN+3/NE+3",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 16"},
  {id:83,type:"Spread",matchup:"Seahawks -6.5 vs Saints",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 16"},
  {id:82,type:"Moneyline",matchup:"Bears ML vs Packers",odds:"-135",stake:"$175",result:"loss",payout:"-$175",date:"Nov 16"},
  {id:81,type:"Spread",matchup:"Bills -3 vs Vikings",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Nov 16"},
  {id:80,type:"Player Prop",matchup:"Puka Nacua O85.5 Rec Yds",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Nov 16"},
  {id:79,type:"Moneyline",matchup:"Panthers ML vs Giants",odds:"+125",stake:"$100",result:"win",payout:"+$125",date:"Nov 16"},
  {id:78,type:"Spread",matchup:"Broncos -3 vs Chargers",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 9"},
  {id:77,type:"Moneyline",matchup:"Patriots ML vs Bears",odds:"+130",stake:"$150",result:"loss",payout:"-$150",date:"Nov 9"},
  {id:76,type:"Spread",matchup:"Seahawks -4 vs Dolphins",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 9"},
  {id:75,type:"Player Prop",matchup:"Bo Nix O225.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Nov 9"},
  {id:74,type:"Teaser",matchup:"2-Team: SEA+3/DEN+3",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 9"},
  {id:73,type:"Moneyline",matchup:"Texans ML vs Lions",odds:"+110",stake:"$100",result:"loss",payout:"-$100",date:"Nov 9"},
  {id:72,type:"Spread",matchup:"Broncos -6 vs Saints",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 2"},
  {id:71,type:"Moneyline",matchup:"Seahawks ML vs Cardinals",odds:"-200",stake:"$200",result:"loss",payout:"-$200",date:"Nov 2"},
  {id:70,type:"Spread",matchup:"Patriots -3 vs Jets",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Nov 2"},
  {id:69,type:"Over/Under",matchup:"CHI/JAX O41",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Nov 2"},
  {id:68,type:"Moneyline",matchup:"Eagles ML vs Cowboys",odds:"-220",stake:"$220",result:"loss",payout:"-$220",date:"Nov 2"},
  {id:67,type:"Parlay",matchup:"2-Leg: DEN ML + NE ML",odds:"+115",stake:"$150",result:"win",payout:"+$173",date:"Nov 2"},
  {id:66,type:"Spread",matchup:"Seahawks -3 vs Bills",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Oct 26"},
  {id:65,type:"Moneyline",matchup:"Broncos ML vs Panthers",odds:"-300",stake:"$200",result:"loss",payout:"-$200",date:"Oct 26"},
  {id:64,type:"Spread",matchup:"Bears -3.5 vs Cowboys",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Oct 26"},
  {id:63,type:"Player Prop",matchup:"Caleb Williams O240.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Oct 26"},
  {id:62,type:"Teaser",matchup:"2-Team: CHI+3/DEN+10",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Oct 26"},
  {id:61,type:"Moneyline",matchup:"Jaguars ML vs Browns",odds:"-160",stake:"$160",result:"loss",payout:"-$160",date:"Oct 26"},
  {id:60,type:"Spread",matchup:"Broncos -3.5 vs Steelers",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Oct 19"},
  {id:59,type:"Moneyline",matchup:"Seahawks ML vs Falcons",odds:"-175",stake:"$175",result:"loss",payout:"-$175",date:"Oct 19"},
  {id:58,type:"Spread",matchup:"Patriots -2 vs Jaguars",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Oct 19"},
  {id:57,type:"Player Prop",matchup:"Walker O90.5 Rush",odds:"-120",stake:"$120",result:"win",payout:"+$100",date:"Oct 19"},
  {id:56,type:"Parlay",matchup:"3-Leg: DEN/SEA/CHI ML",odds:"+300",stake:"$75",result:"loss",payout:"-$75",date:"Oct 19"},
  {id:55,type:"Moneyline",matchup:"Panthers ML vs Saints",odds:"+120",stake:"$100",result:"win",payout:"+$120",date:"Oct 19"},
  {id:54,type:"Spread",matchup:"Seahawks -4 vs Rams",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Oct 12"},
  {id:53,type:"Moneyline",matchup:"Broncos ML vs Raiders",odds:"-200",stake:"$200",result:"loss",payout:"-$200",date:"Oct 12"},
  {id:52,type:"Spread",matchup:"Bears -2.5 vs Bengals",odds:"-110",stake:"$150",result:"loss",payout:"-$150",date:"Oct 12"},
  {id:51,type:"Teaser",matchup:"2-Team: SEA+3/DEN+4",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Oct 12"},
  {id:50,type:"Player Prop",matchup:"Darnold O225.5 Pass",odds:"-110",stake:"$100",result:"win",payout:"+$91",date:"Oct 12"},
  {id:49,type:"Moneyline",matchup:"Eagles ML vs Browns",odds:"-250",stake:"$250",result:"loss",payout:"-$250",date:"Oct 12"},
  {id:48,type:"Spread",matchup:"Broncos -3 vs Chargers",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 28"},
  {id:47,type:"Moneyline",matchup:"Seahawks ML vs 49ers",odds:"-135",stake:"$175",result:"win",payout:"+$130",date:"Sep 28"},
  {id:46,type:"Spread",matchup:"Patriots -1 vs Jets",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Sep 28"},
  {id:45,type:"Player Prop",matchup:"Bo Nix O1.5 Pass TDs",odds:"-150",stake:"$150",result:"win",payout:"+$100",date:"Sep 28"},
  {id:44,type:"Moneyline",matchup:"Packers ML vs Vikings",odds:"+125",stake:"$100",result:"loss",payout:"-$100",date:"Sep 28"},
  {id:43,type:"Parlay",matchup:"2-Leg: DEN -3 + SEA ML",odds:"+230",stake:"$100",result:"win",payout:"+$230",date:"Sep 28"},
  {id:42,type:"Spread",matchup:"Seahawks -3 vs Dolphins",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 21"},
  {id:41,type:"Moneyline",matchup:"Broncos ML vs Bucs",odds:"-175",stake:"$175",result:"loss",payout:"-$175",date:"Sep 21"},
  {id:40,type:"Spread",matchup:"Bears -4 vs Titans",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Sep 21"},
  {id:39,type:"Player Prop",matchup:"Maye O215.5 Pass",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Sep 21"},
  {id:38,type:"Teaser",matchup:"2-Team: SEA+3/DEN+3",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 21"},
  {id:37,type:"Moneyline",matchup:"Rams ML vs Browns",odds:"-220",stake:"$220",result:"loss",payout:"-$220",date:"Sep 21"},
  {id:36,type:"Spread",matchup:"Broncos -6.5 vs Jets",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 14"},
  {id:35,type:"Moneyline",matchup:"Seahawks ML vs Cardinals",odds:"-180",stake:"$200",result:"loss",payout:"-$200",date:"Sep 14"},
  {id:34,type:"Spread",matchup:"Patriots -3 vs Bengals",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Sep 14"},
  {id:33,type:"Player Prop",matchup:"Caleb Williams O1.5 TDs",odds:"-130",stake:"$130",result:"win",payout:"+$100",date:"Sep 14"},
  {id:32,type:"Parlay",matchup:"2-Leg: DEN ML + NE ML",odds:"+115",stake:"$125",result:"win",payout:"+$144",date:"Sep 14"},
  {id:31,type:"Moneyline",matchup:"Jaguars ML vs Colts",odds:"+105",stake:"$100",result:"loss",payout:"-$100",date:"Sep 14"},
  {id:30,type:"Spread",matchup:"Eagles -3 vs Cowboys (Kickoff)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 4"},
  {id:29,type:"Moneyline",matchup:"Seahawks ML vs Rams (Wk1)",odds:"-145",stake:"$200",result:"win",payout:"+$138",date:"Sep 7"},
  {id:28,type:"Spread",matchup:"Broncos -3 vs Cardinals (Wk1)",odds:"-110",stake:"$200",result:"win",payout:"+$182",date:"Sep 7"},
  {id:27,type:"Player Prop",matchup:"Maye O195.5 Pass (Wk1)",odds:"-110",stake:"$100",result:"win",payout:"+$91",date:"Sep 7"},
  {id:26,type:"Moneyline",matchup:"Bears ML vs Titans (Wk1)",odds:"-160",stake:"$160",result:"loss",payout:"-$160",date:"Sep 7"},
  {id:25,type:"Spread",matchup:"Jaguars -1.5 vs Lions (Wk1)",odds:"-110",stake:"$100",result:"loss",payout:"-$100",date:"Sep 7"},
  {id:24,type:"Teaser",matchup:"2-Team: SEA+3/DEN+4 (Wk1)",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Sep 7"},
  {id:23,type:"Parlay",matchup:"3-Leg: PHI/SEA/DEN ML (Wk1)",odds:"+280",stake:"$100",result:"win",payout:"+$280",date:"Sep 7"},
  {id:22,type:"Moneyline",matchup:"Cowboys ML vs Eagles (Wk1)",odds:"+135",stake:"$100",result:"loss",payout:"-$100",date:"Sep 4"},
];

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
  const [feedFilter,setFeedFilter]=useState("league");
  const [betFilter,setBetFilter]=useState("all");
  const [activeSection,setActiveSection]=useState("feed");
  const kalshi=useKalshi();
  const newsTeam=(feedFilter==="team"&&selectedTeam)?selectedTeam:null;
  const news=useNflNews(newsTeam);
  const team=selectedTeam?getTeam(selectedTeam):null;
  const pc=team?team.color:"#1a1a2e";
  const ac=team?team.accent:"#e94560";
  const sbEvent=kalshi.events.find(e=>(e.series_ticker||"").startsWith("KXSB"));
  const otherEvents=kalshi.events.filter(e=>e!==sbEvent);
  const feedAccounts=useMemo(()=>{
    if(feedFilter==="league")return TWITTER_ACCOUNTS.league;
    if(feedFilter==="team"&&selectedTeam)return TWITTER_ACCOUNTS.teams[selectedTeam]||[];
    if(feedFilter==="all"&&selectedTeam){const t=TWITTER_ACCOUNTS.teams[selectedTeam]||[];return[...t,...TWITTER_ACCOUNTS.league.slice(0,3)];}
    if(feedFilter==="all")return TWITTER_ACCOUNTS.league;
    if(DIVISIONS.includes(feedFilter)){const[c,d]=feedFilter.split(" ");const dt=TEAMS[c]?.[d]||[];return dt.flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]);}
    if(feedFilter==="afc")return Object.entries(TEAMS.AFC).flatMap(([,t])=>t.slice(0,1)).flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]).slice(0,8);
    if(feedFilter==="nfc")return Object.entries(TEAMS.NFC).flatMap(([,t])=>t.slice(0,1)).flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]).slice(0,8);
    return TWITTER_ACCOUNTS.league;
  },[feedFilter,selectedTeam]);
  const filteredBets=betFilter==="all"?MOCK_BETS:MOCK_BETS.filter(b=>b.result===betFilter);
  const rec={w:MOCK_BETS.filter(b=>b.result==="win").length,l:MOCK_BETS.filter(b=>b.result==="loss").length,p:MOCK_BETS.filter(b=>b.result==="pending").length};
  const profit=MOCK_BETS.reduce((s,b)=>{if(b.result==="win")return s+parseFloat(b.payout.replace(/[+$]/g,""));if(b.result==="loss")return s+parseFloat(b.payout.replace(/[$]/g,""));return s;},0);
  const filterOptions=useMemo(()=>{
    const f=[{key:"all",label:"All"},{key:"league",label:"🏈 League Wide"},{key:"afc",label:"AFC"},{key:"nfc",label:"NFC"}];
    DIVISIONS.forEach(d=>f.push({key:d,label:d}));
    if(selectedTeam)f.push({key:"team",label:`⭐ ${selectedTeam}`});return f;
  },[selectedTeam]);

  return(<>
    <Head><title>GRIDLOCK — NFL Bets, News & Social Feed</title><meta name="description" content="Your NFL command center."/><meta name="viewport" content="width=device-width, initial-scale=1"/></Head>
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",fontFamily:"'Inter',-apple-system,sans-serif"}}>
      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${pc}ee,${pc}99,#0a0a0f)`,borderBottom:`2px solid ${ac}44`,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontSize:28,fontWeight:900,letterSpacing:"-1px",background:`linear-gradient(135deg,#fff,${ac})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GRIDLOCK</div><div style={{fontSize:10,color:"#ffffff66",letterSpacing:"2px",textTransform:"uppercase"}}>NFL • Bets • Feed</div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"8px 12px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,color:"#1DA1F2"}}>𝕏</span> @cnaylor_</a>
              <button onClick={()=>setShowPicker(!showPicker)} style={{background:selectedTeam?`${ac}33`:"#ffffff15",border:`1px solid ${selectedTeam?ac:"#ffffff33"}`,color:"#fff",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>{selectedTeam?`${team?.city} ${selectedTeam}`:"🏈 Select Your Team"}</button>
              {selectedTeam&&<button onClick={()=>{setSelectedTeam(null);setFeedFilter("league");}} style={{background:"#e9456033",border:"1px solid #e9456066",color:"#e94560",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700}}>✕ Reset Team</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:4,marginTop:12}}>
            {[{k:"feed",l:"📱 Social Feed"},{k:"kalshi",l:<span>📊 NFL Prediction Markets <span style={{fontSize:9,opacity:0.6,fontWeight:400}}>Powered by Kalshi</span></span>},{k:"bets",l:"💰 Craig's List"},{k:"video",l:"🎬 Five Pick Fridays"}].map(s=>(
              <button key={s.k} onClick={()=>setActiveSection(s.k)} style={{background:activeSection===s.k?`${ac}33`:"transparent",border:"none",color:activeSection===s.k?"#fff":"#ffffff66",padding:"8px 16px",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",borderBottom:activeSection===s.k?`2px solid ${ac}`:"2px solid transparent"}}>{s.l}</button>
            ))}
          </div>
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
        {/* SOCIAL FEED */}
        {activeSection==="feed"&&(<div>
          <div style={{marginBottom:20}}><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📱 Live NFL Feed</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Curated NFL accounts — click to view on X</div></div>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}><span style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Filter:</span>
            {filterOptions.map(f=>(<button key={f.key} onClick={()=>setFeedFilter(f.key)} style={{background:feedFilter===f.key?`${ac}33`:"#ffffff08",border:`1px solid ${feedFilter===f.key?ac:"#ffffff15"}`,color:feedFilter===f.key?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.label}</button>))}
          </div>
          {news.articles.length>0&&<TopStories articles={news.articles} ac={ac}/>}
          {news.loading&&<div style={{textAlign:"center",padding:20,color:"#ffffff44",fontSize:13}}>Loading {newsTeam?`${newsTeam} `:""} stories...</div>}
          {!selectedTeam&&feedFilter==="all"&&(<div style={{background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:12,padding:24,textAlign:"center",marginBottom:20}}><div style={{fontSize:32,marginBottom:8}}>🏈</div><div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:4}}>Select your team for a personalized feed</div><div style={{fontSize:13,color:"#ffffff66"}}>Or browse League Wide, AFC, NFC, or any division</div></div>)}
          <TwitterFeed accounts={feedAccounts} ac={ac}/>
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}><div style={{fontSize:12,color:"#ffffff44"}}>Click any card to view their latest posts on X</div><div style={{fontSize:11,color:"#ffffff33",marginTop:6}}>💡 Live embedded tweets coming soon — once this site generates revenue, we&#39;ll upgrade to the X API for real-time feeds directly on this page.</div></div>
        </div>)}
        {/* KALSHI */}
        {activeSection==="kalshi"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📊 NFL Prediction Markets</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Live odds from Kalshi — click any option to trade</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>{kalshi.lastFetch&&<span style={{fontSize:11,color:"#ffffff33"}}>Updated {kalshi.lastFetch.toLocaleTimeString()}</span>}<button onClick={kalshi.refresh} disabled={kalshi.loading} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,opacity:kalshi.loading?0.5:1}}>{kalshi.loading?"Loading...":"🔄 Refresh"}</button></div>
          </div>
          {kalshi.error&&<div style={{background:"#f8717115",border:"1px solid #f8717133",borderRadius:10,padding:14,marginBottom:16}}><div style={{fontSize:13,color:"#f87171",fontWeight:600}}>Could not fetch Kalshi data</div><div style={{fontSize:12,color:"#ffffff55",marginTop:4}}>Error: {kalshi.error}</div></div>}
          {kalshi.loading&&!kalshi.events.length&&<div style={{textAlign:"center",padding:40}}><div style={{fontSize:28,marginBottom:8}}>📊</div><div style={{fontSize:14,color:"#ffffff55"}}>Fetching live markets...</div></div>}
          {sbEvent&&(<div style={{marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:20}}>🏆</span><div><h3 style={{fontSize:18,fontWeight:800,color:"#fff",margin:0}}>2027 Champion — Super Bowl LXI</h3><div style={{fontSize:12,color:"#ffffff55"}}>Live futures odds from Kalshi</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>{sbEvent.markets.map(m=>{const price=m.last_price||m.yes_bid||0;const label=(m.yes_sub_title||m.title||m.subtitle||"").replace(/^Will |win.*$/gi,"").trim();return(<a key={m.ticker} href={`https://kalshi.com/markets/${(sbEvent.series_ticker||"kxsb").toLowerCase()}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><div style={{background:price>=15?"#12121c":"#0d0d14",border:`1px solid ${price>=15?"#ffffff15":"#ffffff08"}`,borderRadius:10,padding:"12px 14px",position:"relative",overflow:"hidden"}}>{price>=15&&<div style={{position:"absolute",top:0,left:0,width:`${price}%`,height:"100%",background:`linear-gradient(90deg,${ac}08,${ac}03)`,borderRadius:10}}/>}<div style={{position:"relative",zIndex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.3}}>{label}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}><div style={{fontSize:20,fontWeight:900,color:price>=15?"#4ade80":price>=5?"#fbbf24":"#ffffff55"}}>{price}¢</div><div style={{fontSize:10,color:"#ffffff33"}}>Vol {fmtVol(m.volume||0)}</div></div></div></div></a>);})}</div>
          </div>)}
          {otherEvents.length>0&&(<div><div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>More NFL Markets</div><div style={{display:"flex",flexDirection:"column",gap:12}}>{otherEvents.map(evt=>(<div key={evt.event_ticker} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:18}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{evt.title}</div>{evt.subtitle&&<div style={{fontSize:12,color:"#ffffff44",marginTop:2}}>{evt.subtitle}</div>}</div><span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#ffffff08",color:"#ffffff44",fontWeight:600,flexShrink:0}}>{evt.markets.length} options</span></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>{evt.markets.slice(0,12).map(m=>{const price=m.last_price||m.yes_bid||0;const label=m.yes_sub_title||m.title||m.subtitle||"Yes";return(<a key={m.ticker} href={`https://kalshi.com/markets/${(evt.series_ticker||evt.event_ticker||"").toLowerCase()}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><div style={{background:"#1a1a2e",border:"1px solid #ffffff08",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}><div style={{fontSize:12,fontWeight:600,color:"#ddd",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div><div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}><span style={{fontSize:14,fontWeight:800,color:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff44"}}>{price}¢</span><div style={{width:32,height:6,borderRadius:3,background:"#ffffff10",overflow:"hidden"}}><div style={{width:`${price}%`,height:"100%",borderRadius:3,background:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff33"}}/></div></div></div></a>);})}</div>
            {evt.markets.length>12&&<div style={{fontSize:11,color:"#ffffff33",textAlign:"center",marginTop:8}}>+{evt.markets.length-12} more on Kalshi</div>}
          </div>))}</div></div>)}
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}><div style={{fontSize:12,color:"#ffffff44"}}>Live data from <a href="https://kalshi.com/sports/all-sports" target="_blank" rel="noopener noreferrer" style={{color:"#fff",fontWeight:600,textDecoration:"none"}}>Kalshi</a> · Prices in cents · Click any option to trade</div></div>
        </div>)}
        {/* CRAIG'S LIST */}
        {activeSection==="bets"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><div><div style={{display:"flex",alignItems:"center",gap:3}}><h2 style={{fontSize:26,fontWeight:900,color:"#fff",margin:0}}>Craig&#39;s</h2><h2 style={{fontSize:26,fontWeight:900,margin:0,background:`linear-gradient(135deg,${ac},#e94560)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>List</h2></div><div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Live bets from the man himself — via Hard Rock Bet</div><a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a></div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}><CraigAvatar size={44}/><div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8066"}}/><span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>LIVE</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
            {[{l:"Record",v:`${rec.w}-${rec.l}`,s:`${rec.p} pending`},{l:"Win Rate",v:`${((rec.w/(rec.w+rec.l))*100).toFixed(0)}%`,s:`${rec.w+rec.l} settled`},{l:"Net Profit",v:`${profit>=0?"+":""}$${profit.toFixed(0)}`,s:"all time",c:profit>=0?"#4ade80":"#f87171"},{l:"Avg Stake",v:`$${(MOCK_BETS.reduce((s,b)=>s+parseFloat(b.stake.replace("$","")),0)/MOCK_BETS.length).toFixed(0)}`,s:`${MOCK_BETS.length} bets`}].map((s,i)=>(<div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div><div style={{fontSize:22,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div><div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{s.s}</div></div>))}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>{["all","win","loss","pending"].map(f=>(<button key={f} onClick={()=>setBetFilter(f)} style={{background:betFilter===f?`${ac}33`:"#ffffff08",border:`1px solid ${betFilter===f?ac:"#ffffff15"}`,color:betFilter===f?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:16,cursor:"pointer",fontSize:11,fontWeight:600,textTransform:"capitalize"}}>{f}</button>))}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{filteredBets.map(bet=>(<div key={bet.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24"}`}}><div style={{width:38,height:38,borderRadius:10,background:bet.result==="win"?"#4ade8015":bet.result==="loss"?"#f8717115":"#fbbf2415",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{bet.result==="win"?"✅":bet.result==="loss"?"❌":"⏳"}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:1}}>{bet.matchup}</div><div style={{fontSize:12,color:"#ffffff55"}}>{bet.type} · {bet.odds} · {bet.stake} · {bet.date}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:15,fontWeight:800,color:bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24"}}>{bet.payout}</div><div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24",marginTop:2}}>{bet.result}</div></div></div>))}</div>
        </div>)}
        {/* FIVE PICK FRIDAYS */}
        {activeSection==="video"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}><CraigAvatar size={56}/>
            <div style={{flex:1}}><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>Five Pick Fridays</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Every Friday during NFL season — Craig&#39;s 5 best bets + Thursday Night recap</div><a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a></div>
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
              <div style={{width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.2)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,cursor:"pointer",zIndex:2,boxShadow:"0 0 30px rgba(0,0,0,0.4)",border:"2px solid rgba(255,255,255,0.3)"}}>▶</div>
              <div style={{position:"absolute",top:10,right:12,background:"rgba(0,0,0,0.7)",borderRadius:4,padding:"2px 8px",fontSize:11,color:"#fff",fontWeight:600,zIndex:2}}>{WEEKLY_VIDEOS[0].duration}</div>
            </div>
            <div style={{display:"flex",gap:16,fontSize:12,color:"#ffffff55"}}><span>⏱️ {WEEKLY_VIDEOS[0].duration}</span><span>👁️ {WEEKLY_VIDEOS[0].views} views</span></div>
            <div style={{marginTop:14,borderTop:"1px solid #ffffff10",paddingTop:12}}><div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>This Week&#39;s Picks</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{WEEKLY_VIDEOS[0].picks.map((p,i)=>(<div key={i} style={{background:p.result==="win"?"#4ade8012":p.result==="loss"?"#f8717112":"#fbbf2412",border:`1px solid ${p.result==="win"?"#4ade8033":p.result==="loss"?"#f8717133":"#fbbf2433"}`,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12,fontWeight:600,color:"#fff"}}>{p.pick}</span><span style={{fontSize:10}}>{p.result==="win"?"✅":p.result==="loss"?"❌":"⏳"}</span></div>))}</div>
            </div>
          </div>
          <div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Previous Episodes</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{WEEKLY_VIDEOS.slice(1).map(v=>(<div key={v.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
            <div style={{width:64,height:44,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",overflow:"hidden"}}><img src={CP} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",filter:"brightness(0.35)"}}/><span style={{fontSize:14,zIndex:1,color:"#fff"}}>▶</span></div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{v.title}</div><div style={{fontSize:12,color:"#ffffff55",marginBottom:4}}>{v.date} · {v.duration} · {v.views} views</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{v.picks.map((p,i)=>(<span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:p.result==="win"?"#4ade8015":p.result==="loss"?"#f8717115":"#fbbf2415",color:p.result==="win"?"#4ade80":p.result==="loss"?"#f87171":"#fbbf24",fontWeight:600}}>{p.result==="win"?"W":p.result==="loss"?"L":"P"}</span>))}</div>
            </div>
          </div>))}</div>
          <div style={{background:"#ffffff06",border:"1px dashed #ffffff15",borderRadius:12,padding:20,textAlign:"center",marginTop:20}}><div style={{fontSize:13,color:"#ffffff55"}}>🔔 New episode every <strong style={{color:"#fff"}}>Friday</strong> during NFL season</div><div style={{fontSize:12,color:"#ffffff44",marginTop:4}}>Subscribe to never miss Five Pick Fridays</div></div>
        </div>)}
      </div>
    </div>
    <style jsx global>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:3px}button:hover{opacity:0.85}html,body{background:#0a0a0f}`}</style>
  </>);
}
