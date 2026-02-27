import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";

const TEAMS={AFC:{North:[{name:"Ravens",city:"Baltimore",abbr:"BAL",color:"#241773",accent:"#9E7C0C"},{name:"Bengals",city:"Cincinnati",abbr:"CIN",color:"#FB4F14",accent:"#000000"},{name:"Browns",city:"Cleveland",abbr:"CLE",color:"#311D00",accent:"#FF3C00"},{name:"Steelers",city:"Pittsburgh",abbr:"PIT",color:"#FFB612",accent:"#101820"}],South:[{name:"Texans",city:"Houston",abbr:"HOU",color:"#03202F",accent:"#A71930"},{name:"Colts",city:"Indianapolis",abbr:"IND",color:"#002C5F",accent:"#A2AAAD"},{name:"Jaguars",city:"Jacksonville",abbr:"JAX",color:"#006778",accent:"#D7A22A"},{name:"Titans",city:"Tennessee",abbr:"TEN",color:"#0C2340",accent:"#4B92DB"}],East:[{name:"Bills",city:"Buffalo",abbr:"BUF",color:"#00338D",accent:"#C60C30"},{name:"Dolphins",city:"Miami",abbr:"MIA",color:"#008E97",accent:"#FC4C02"},{name:"Patriots",city:"New England",abbr:"NE",color:"#002244",accent:"#C60C30"},{name:"Jets",city:"New York",abbr:"NYJ",color:"#125740",accent:"#FFFFFF"}],West:[{name:"Broncos",city:"Denver",abbr:"DEN",color:"#FB4F14",accent:"#002244"},{name:"Chiefs",city:"Kansas City",abbr:"KC",color:"#E31837",accent:"#FFB81C"},{name:"Raiders",city:"Las Vegas",abbr:"LV",color:"#000000",accent:"#A5ACAF"},{name:"Chargers",city:"Los Angeles",abbr:"LAC",color:"#0080C6",accent:"#FFC20E"}]},NFC:{North:[{name:"Bears",city:"Chicago",abbr:"CHI",color:"#0B162A",accent:"#C83803"},{name:"Lions",city:"Detroit",abbr:"DET",color:"#0076B6",accent:"#B0B7BC"},{name:"Packers",city:"Green Bay",abbr:"GB",color:"#203731",accent:"#FFB612"},{name:"Vikings",city:"Minnesota",abbr:"MIN",color:"#4F2683",accent:"#FFC62F"}],South:[{name:"Falcons",city:"Atlanta",abbr:"ATL",color:"#A71930",accent:"#000000"},{name:"Panthers",city:"Carolina",abbr:"CAR",color:"#0085CA",accent:"#101820"},{name:"Saints",city:"New Orleans",abbr:"NO",color:"#D3BC8D",accent:"#101820"},{name:"Buccaneers",city:"Tampa Bay",abbr:"TB",color:"#D50A0A",accent:"#34302B"}],East:[{name:"Cowboys",city:"Dallas",abbr:"DAL",color:"#003594",accent:"#869397"},{name:"Giants",city:"New York",abbr:"NYG",color:"#0B2265",accent:"#A71930"},{name:"Eagles",city:"Philadelphia",abbr:"PHI",color:"#004C54",accent:"#A5ACAF"},{name:"Commanders",city:"Washington",abbr:"WAS",color:"#5A1414",accent:"#FFB612"}],West:[{name:"Cardinals",city:"Arizona",abbr:"ARI",color:"#97233F",accent:"#000000"},{name:"Rams",city:"Los Angeles",abbr:"LAR",color:"#003594",accent:"#FFA300"},{name:"49ers",city:"San Francisco",abbr:"SF",color:"#AA0000",accent:"#B3995D"},{name:"Seahawks",city:"Seattle",abbr:"SEA",color:"#002244",accent:"#69BE28"}]}};
const allTeams=Object.entries(TEAMS).flatMap(([conf,divs])=>Object.entries(divs).flatMap(([div,teams])=>teams.map(t=>({...t,conference:conf,division:div,divFull:`${conf} ${div}`}))));
const getTeam=(n)=>allTeams.find(t=>t.name===n);
const DIVISIONS=["AFC North","AFC South","AFC East","AFC West","NFC North","NFC South","NFC East","NFC West"];

const CRAIG_PHOTO=null;
const CraigAvatar=({size=44,border=true})=>(
  CRAIG_PHOTO
    ? <img src={CRAIG_PHOTO} alt="Craig Naylor" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:border?"2px solid #ffffff22":"none",flexShrink:0}}/>
    : <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#e94560,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",flexShrink:0,border:border?"2px solid #ffffff22":"none",boxShadow:"0 2px 12px #e9456033"}}>CN</div>
);

const TWITTER_ACCOUNTS={
  league:[
    {handle:"NFL",label:"NFL",emoji:"🏈",desc:"Official NFL account"},
    {handle:"AdamSchefter",label:"Adam Schefter",emoji:"📰",desc:"ESPN NFL Insider"},
    {handle:"RapSheet",label:"Ian Rapoport",emoji:"🗞️",desc:"NFL Network Insider"},
    {handle:"PatMcAfeeShow",label:"Pat McAfee",emoji:"🎙️",desc:"Daily sports talk & NFL commentary"},
    {handle:"NFLNetwork",label:"NFL Network",emoji:"📺",desc:"Official NFL Network"},
    {handle:"TomPelissero",label:"Tom Pelissero",emoji:"📋",desc:"NFL Network Insider"},
    {handle:"JayGlazer",label:"Jay Glazer",emoji:"💪",desc:"FOX NFL Insider"},
    {handle:"MikeGarafolo",label:"Mike Garafolo",emoji:"🎯",desc:"NFL Network reporter"},
  ],
  teams:{
    Ravens:[{handle:"Ravens",label:"Baltimore Ravens",emoji:"🦅"},{handle:"jeffzrebiec",label:"Jeff Zrebiec",emoji:"📰",desc:"Ravens beat — The Athletic"}],
    Bengals:[{handle:"Bengals",label:"Cincinnati Bengals",emoji:"🐯"},{handle:"BenBaby",label:"Ben Baby",emoji:"📰",desc:"Bengals beat — ESPN"}],
    Browns:[{handle:"Browns",label:"Cleveland Browns",emoji:"🟤"}],
    Steelers:[{handle:"steelers",label:"Pittsburgh Steelers",emoji:"⚙️"}],
    Texans:[{handle:"HoustonTexans",label:"Houston Texans",emoji:"🐂"}],
    Colts:[{handle:"Colts",label:"Indianapolis Colts",emoji:"🐴"}],
    Jaguars:[{handle:"Jaguars",label:"Jacksonville Jaguars",emoji:"🐆"}],
    Titans:[{handle:"Titans",label:"Tennessee Titans",emoji:"⚔️"}],
    Bills:[{handle:"BuffaloBills",label:"Buffalo Bills",emoji:"🦬"}],
    Dolphins:[{handle:"MiamiDolphins",label:"Miami Dolphins",emoji:"🐬"}],
    Patriots:[{handle:"Patriots",label:"New England Patriots",emoji:"🇺🇸"}],
    Jets:[{handle:"nyjets",label:"New York Jets",emoji:"✈️"}],
    Broncos:[{handle:"Broncos",label:"Denver Broncos",emoji:"🐎"}],
    Chiefs:[{handle:"Chiefs",label:"Kansas City Chiefs",emoji:"🏹"},{handle:"PatrickMahomes",label:"Patrick Mahomes",emoji:"🌟",desc:"Chiefs QB"}],
    Raiders:[{handle:"Raiders",label:"Las Vegas Raiders",emoji:"☠️"}],
    Chargers:[{handle:"chargers",label:"Los Angeles Chargers",emoji:"⚡"}],
    Bears:[{handle:"ChicagoBears",label:"Chicago Bears",emoji:"🐻"}],
    Lions:[{handle:"Lions",label:"Detroit Lions",emoji:"🦁"}],
    Packers:[{handle:"packers",label:"Green Bay Packers",emoji:"🧀"}],
    Vikings:[{handle:"Vikings",label:"Minnesota Vikings",emoji:"⛵"}],
    Falcons:[{handle:"AtlantaFalcons",label:"Atlanta Falcons",emoji:"🦅"}],
    Panthers:[{handle:"Panthers",label:"Carolina Panthers",emoji:"🐈‍⬛"}],
    Saints:[{handle:"Saints",label:"New Orleans Saints",emoji:"⚜️"}],
    Buccaneers:[{handle:"Buccaneers",label:"Tampa Bay Buccaneers",emoji:"🏴‍☠️"}],
    Cowboys:[{handle:"dallascowboys",label:"Dallas Cowboys",emoji:"⭐"}],
    Giants:[{handle:"Giants",label:"New York Giants",emoji:"🗽"}],
    Eagles:[{handle:"Eagles",label:"Philadelphia Eagles",emoji:"🦅"}],
    Commanders:[{handle:"Commanders",label:"Washington Commanders",emoji:"🎖️"}],
    Cardinals:[{handle:"AZCardinals",label:"Arizona Cardinals",emoji:"🐦"}],
    Rams:[{handle:"RamsNFL",label:"Los Angeles Rams",emoji:"🐏"}],
    "49ers":[{handle:"49ers",label:"San Francisco 49ers",emoji:"⛏️"}],
    Seahawks:[{handle:"Seahawks",label:"Seattle Seahawks",emoji:"🦅"}],
  },
};

function TwitterFeed({accounts,ac}){
  if(!accounts||!accounts.length)return null;
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
      {accounts.map((a)=>(
        <a key={a.handle} href={`https://x.com/${a.handle}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}>
          <div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`${ac}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.emoji||"🏈"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{a.label}</div>
              <div style={{fontSize:12,color:"#1DA1F2",fontWeight:500}}>@{a.handle}</div>
              {a.desc&&<div style={{fontSize:11,color:"#ffffff44",marginTop:2,lineHeight:1.4}}>{a.desc}</div>}
            </div>
            <span style={{background:"#1DA1F222",color:"#1DA1F2",padding:"4px 10px",borderRadius:6,fontWeight:600,fontSize:11,flexShrink:0}}>View 𝕏</span>
          </div>
        </a>
      ))}
    </div>
  );
}

const fmtVol=(v)=>{if(!v)return"$0";const d=v/100;if(d>=1e6)return`$${(d/1e6).toFixed(1)}M`;if(d>=1e3)return`$${(d/1e3).toFixed(0)}K`;return`$${d.toFixed(0)}`;};
const useKalshi=()=>{
  const [events,setEvents]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState(null);const [lastFetch,setLastFetch]=useState(null);
  const fetch_=useCallback(async()=>{
    setLoading(true);setError(null);
    try{const r=await fetch("/api/kalshi");if(!r.ok)throw new Error(`API ${r.status}`);const d=await r.json();
      setEvents(d.events||[]);setLastFetch(new Date());
    }catch(e){setError(e.message);}finally{setLoading(false);}
  },[]);
  useEffect(()=>{fetch_();},[fetch_]);
  return{events,loading,error,lastFetch,refresh:fetch_};
};

const MOCK_BETS=[
  {id:1,type:"Spread",matchup:"Chiefs -3.5 vs Ravens",odds:"-110",stake:"$100",result:"win",payout:"+$91",date:"Dec 22"},
  {id:2,type:"Over/Under",matchup:"Bills vs Dolphins O48.5",odds:"-105",stake:"$50",result:"pending",payout:"—",date:"Dec 28"},
  {id:3,type:"Moneyline",matchup:"Lions ML vs Vikings",odds:"+135",stake:"$75",result:"win",payout:"+$101",date:"Dec 22"},
  {id:4,type:"Parlay",matchup:"3-Leg: CIN/BUF/SF",odds:"+600",stake:"$25",result:"loss",payout:"-$25",date:"Dec 21"},
  {id:5,type:"Spread",matchup:"Eagles -7 vs Cowboys",odds:"-110",stake:"$150",result:"win",payout:"+$136",date:"Dec 22"},
  {id:6,type:"Player Prop",matchup:"J. Burrow O275.5 Pass Yds",odds:"-120",stake:"$60",result:"pending",payout:"—",date:"Dec 28"},
  {id:7,type:"Moneyline",matchup:"Cardinals ML vs Rams",odds:"+180",stake:"$40",result:"loss",payout:"-$40",date:"Dec 21"},
  {id:8,type:"Teaser",matchup:"2-Team: KC+6/DET+7",odds:"-110",stake:"$100",result:"win",payout:"+$91",date:"Dec 22"},
];
const WEEKLY_VIDEOS=[
  {id:"v1",title:"Week 17 Picks + TNF Recap: Lions Walk It Off!",date:"Fri, Dec 27",duration:"4:32",views:"2.4K",description:"Breaking down the Lions' OT thriller vs GB, plus my top 5 picks for the weekend slate.",picks:[{pick:"Chiefs -3.5",result:"win"},{pick:"Lions ML",result:"win"},{pick:"Eagles -7",result:"win"},{pick:"Bills/Dolphins O48.5",result:"pending"},{pick:"Bengals -1",result:"pending"}]},
  {id:"v2",title:"Week 16 Picks + TNF Recap: Chargers Upset!",date:"Fri, Dec 20",duration:"4:58",views:"1.8K",description:"Thursday's Chargers upset has massive playoff implications.",picks:[{pick:"Ravens -6",result:"win"},{pick:"49ers ML",result:"loss"},{pick:"Packers +3",result:"win"},{pick:"Chiefs/Texans O44",result:"win"},{pick:"Cowboys +10",result:"loss"}]},
  {id:"v3",title:"Week 15 Picks + TNF Recap: Snow Game Madness",date:"Fri, Dec 13",duration:"3:47",views:"1.5K",description:"Wild snow game on Thursday. Plus my best bets for a loaded Week 15.",picks:[{pick:"Bengals -3",result:"win"},{pick:"Lions -4.5",result:"win"},{pick:"Rams ML",result:"loss"},{pick:"Steelers +2",result:"win"},{pick:"Dolphins/Jets U41",result:"win"}]},
];
const seasonRecord=WEEKLY_VIDEOS.reduce((a,v)=>{v.picks.forEach(p=>{if(p.result==="win")a.w++;else if(p.result==="loss")a.l++;else a.p++;});return a;},{w:0,l:0,p:0});

export default function Home(){
  const [selectedTeam,setSelectedTeam]=useState(null);
  const [showPicker,setShowPicker]=useState(false);
  const [feedFilter,setFeedFilter]=useState("league");
  const [betFilter,setBetFilter]=useState("all");
  const [activeSection,setActiveSection]=useState("feed");
  const kalshi=useKalshi();

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
    if(DIVISIONS.includes(feedFilter)){const[conf,div]=feedFilter.split(" ");const dt=TEAMS[conf]?.[div]||[];return dt.flatMap(t=>TWITTER_ACCOUNTS.teams[t.name]||[]);}
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
    if(selectedTeam)f.push({key:"team",label:`⭐ ${selectedTeam}`});
    return f;
  },[selectedTeam]);

  return(<>
    <Head>
      <title>GRIDLOCK — NFL Bets, News & Social Feed</title>
      <meta name="description" content="Your NFL command center. Live Kalshi markets, curated social feeds, and Craig's betting picks."/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",fontFamily:"'Inter',-apple-system,sans-serif"}}>
      {/* HEADER */}
      <div style={{background:`linear-gradient(135deg,${pc}ee,${pc}99,#0a0a0f)`,borderBottom:`2px solid ${ac}44`,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:"-1px",background:`linear-gradient(135deg,#fff,${ac})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GRIDLOCK</div>
              <div style={{fontSize:10,color:"#ffffff66",letterSpacing:"2px",textTransform:"uppercase"}}>NFL • Bets • Feed</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"8px 12px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,color:"#1DA1F2"}}>𝕏</span> @cnaylor_</a>
              <button onClick={()=>setShowPicker(!showPicker)} style={{background:selectedTeam?`${ac}33`:"#ffffff15",border:`1px solid ${selectedTeam?ac:"#ffffff33"}`,color:"#fff",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>{selectedTeam?`${team?.city} ${selectedTeam}`:"🏈 Select Your Team"}</button>
              {selectedTeam&&<button onClick={()=>{setSelectedTeam(null);setFeedFilter("league");}} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#ffffff88",padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>✕</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:4,marginTop:12}}>
            {[{k:"feed",l:"📱 Social Feed"},{k:"kalshi",l:"📊 Kalshi Markets"},{k:"bets",l:"💰 Craig's List"},{k:"video",l:"🎬 Five Pick Fridays"}].map(s=>(
              <button key={s.k} onClick={()=>setActiveSection(s.k)} style={{background:activeSection===s.k?`${ac}33`:"transparent",border:"none",color:activeSection===s.k?"#fff":"#ffffff66",padding:"8px 16px",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",borderBottom:activeSection===s.k?`2px solid ${ac}`:"2px solid transparent"}}>{s.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* TEAM PICKER */}
      {showPicker&&(<div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setShowPicker(false)}>
        <div style={{background:"#151520",borderRadius:16,padding:28,maxWidth:720,width:"90%",maxHeight:"80vh",overflowY:"auto",border:"1px solid #ffffff15"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:20,fontWeight:800,marginBottom:20,color:"#fff"}}>Choose Your Team</div>
          {Object.entries(TEAMS).map(([conf,divs])=>(<div key={conf} style={{marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:conf==="AFC"?"#e94560":"#4ea8de",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>{conf}</div>
            {Object.entries(divs).map(([div,teams])=>(<div key={div}>
              <div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",marginBottom:6,marginTop:8}}>{div}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {teams.map(t=>(<button key={t.abbr} onClick={()=>{setSelectedTeam(t.name);setShowPicker(false);setFeedFilter("team");}} style={{background:selectedTeam===t.name?`${t.color}44`:"#1a1a2e",border:`1px solid ${selectedTeam===t.name?t.color:"#ffffff15"}`,color:"#fff",padding:"8px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left"}}>
                  <div style={{fontWeight:700}}>{t.name}</div><div style={{fontSize:10,color:"#ffffff55",marginTop:1}}>{t.city}</div>
                </button>))}
              </div>
            </div>))}
          </div>))}
        </div>
      </div>)}

      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px"}}>

        {/* SOCIAL FEED */}
        {activeSection==="feed"&&(<div>
          <div style={{marginBottom:20}}>
            <h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📱 Live NFL Feed</h2>
            <div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Curated NFL accounts — click to view on X</div>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Filter:</span>
            {filterOptions.map(f=>(<button key={f.key} onClick={()=>setFeedFilter(f.key)} style={{background:feedFilter===f.key?`${ac}33`:"#ffffff08",border:`1px solid ${feedFilter===f.key?ac:"#ffffff15"}`,color:feedFilter===f.key?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.label}</button>))}
          </div>
          {!selectedTeam&&feedFilter==="all"&&(<div style={{background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:12,padding:24,textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:8}}>🏈</div>
            <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:4}}>Select your team for a personalized feed</div>
            <div style={{fontSize:13,color:"#ffffff66"}}>Or browse League Wide, AFC, NFC, or any division</div>
          </div>)}
          <TwitterFeed accounts={feedAccounts} ac={ac}/>
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}>
            <div style={{fontSize:12,color:"#ffffff44"}}>Click any card to view their latest posts on X</div>
          </div>
        </div>)}

        {/* KALSHI MARKETS */}
        {activeSection==="kalshi"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>📊 NFL Prediction Markets</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Live odds from Kalshi — click any option to trade</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {kalshi.lastFetch&&<span style={{fontSize:11,color:"#ffffff33"}}>Updated {kalshi.lastFetch.toLocaleTimeString()}</span>}
              <button onClick={kalshi.refresh} disabled={kalshi.loading} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,opacity:kalshi.loading?0.5:1}}>{kalshi.loading?"Loading...":"🔄 Refresh"}</button>
            </div>
          </div>
          {kalshi.error&&(<div style={{background:"#f8717115",border:"1px solid #f8717133",borderRadius:10,padding:14,marginBottom:16}}><div style={{fontSize:13,color:"#f87171",fontWeight:600}}>Could not fetch Kalshi data</div><div style={{fontSize:12,color:"#ffffff55",marginTop:4}}>Error: {kalshi.error}</div></div>)}
          {kalshi.loading&&!kalshi.events.length&&(<div style={{textAlign:"center",padding:40}}><div style={{fontSize:28,marginBottom:8}}>📊</div><div style={{fontSize:14,color:"#ffffff55"}}>Fetching live markets...</div></div>)}

          {sbEvent&&(<div style={{marginBottom:28}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{fontSize:20}}>🏆</span>
              <div><h3 style={{fontSize:18,fontWeight:800,color:"#fff",margin:0}}>{sbEvent.title||"Super Bowl Champion"}</h3>
              {sbEvent.subtitle&&<div style={{fontSize:12,color:"#ffffff55"}}>{sbEvent.subtitle}</div>}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:8}}>
              {sbEvent.markets.map(m=>{
                const price=m.last_price||m.yes_bid||0;
                const label=(m.yes_sub_title||m.title||m.subtitle||"").replace(/^Will |win.*$/gi,"").trim();
                return(<a key={m.ticker} href={`https://kalshi.com/markets/${m.ticker}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <div style={{background:price>=15?"#12121c":"#0d0d14",border:`1px solid ${price>=15?"#ffffff15":"#ffffff08"}`,borderRadius:10,padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                    {price>=15&&<div style={{position:"absolute",top:0,left:0,width:`${price}%`,height:"100%",background:`linear-gradient(90deg,${ac}08,${ac}03)`,borderRadius:10}}/>}
                    <div style={{position:"relative",zIndex:1}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:6,lineHeight:1.3}}>{label}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                        <div style={{fontSize:20,fontWeight:900,color:price>=15?"#4ade80":price>=5?"#fbbf24":"#ffffff55"}}>{price}¢</div>
                        <div style={{fontSize:10,color:"#ffffff33"}}>Vol {fmtVol(m.volume||0)}</div>
                      </div>
                    </div>
                  </div>
                </a>);
              })}
            </div>
          </div>)}

          {otherEvents.length>0&&(<div>
            <div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:14}}>More NFL Markets</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {otherEvents.map(evt=>(<div key={evt.event_ticker} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:18}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{evt.title}</div>
                  {evt.subtitle&&<div style={{fontSize:12,color:"#ffffff44",marginTop:2}}>{evt.subtitle}</div>}</div>
                  <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#ffffff08",color:"#ffffff44",fontWeight:600,flexShrink:0}}>{evt.markets.length} options</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>
                  {evt.markets.slice(0,12).map(m=>{
                    const price=m.last_price||m.yes_bid||0;
                    const label=m.yes_sub_title||m.title||m.subtitle||"Yes";
                    return(<a key={m.ticker} href={`https://kalshi.com/markets/${m.ticker}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                      <div style={{background:"#1a1a2e",border:"1px solid #ffffff08",borderRadius:8,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                        <div style={{fontSize:12,fontWeight:600,color:"#ddd",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{label}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                          <span style={{fontSize:14,fontWeight:800,color:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff44"}}>{price}¢</span>
                          <div style={{width:32,height:6,borderRadius:3,background:"#ffffff10",overflow:"hidden"}}><div style={{width:`${price}%`,height:"100%",borderRadius:3,background:price>=20?"#4ade80":price>=5?"#fbbf24":"#ffffff33"}}/></div>
                        </div>
                      </div>
                    </a>);
                  })}
                </div>
                {evt.markets.length>12&&<div style={{fontSize:11,color:"#ffffff33",textAlign:"center",marginTop:8}}>+{evt.markets.length-12} more options on Kalshi</div>}
              </div>))}
            </div>
          </div>)}
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:20,textAlign:"center"}}><div style={{fontSize:12,color:"#ffffff44"}}>Live data from <a href="https://kalshi.com/sports/all-sports" target="_blank" rel="noopener noreferrer" style={{color:"#fff",fontWeight:600,textDecoration:"none"}}>Kalshi</a> · Prices in cents · Click any option to trade</div></div>
        </div>)}

        {/* CRAIG'S LIST */}
        {activeSection==="bets"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><h2 style={{fontSize:26,fontWeight:900,color:"#fff",margin:0}}>Craig&#39;s</h2><h2 style={{fontSize:26,fontWeight:900,margin:0,background:`linear-gradient(135deg,${ac},#e94560)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>List</h2></div>
              <div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Live bets from the man himself — via Hard Rock Bet</div>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              <CraigAvatar size={44}/><div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8066"}}/><span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>LIVE</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
            {[{l:"Record",v:`${rec.w}-${rec.l}`,s:`${rec.p} pending`},{l:"Win Rate",v:`${((rec.w/(rec.w+rec.l))*100).toFixed(0)}%`,s:`${rec.w+rec.l} settled`},{l:"Net Profit",v:`${profit>=0?"+":""}$${profit.toFixed(0)}`,s:"all time",c:profit>=0?"#4ade80":"#f87171"},{l:"Avg Stake",v:`$${(MOCK_BETS.reduce((s,b)=>s+parseFloat(b.stake.replace("$","")),0)/MOCK_BETS.length).toFixed(0)}`,s:`${MOCK_BETS.length} bets`}].map((s,i)=>(<div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{fontSize:10,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div><div style={{fontSize:22,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div><div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{s.s}</div>
            </div>))}
          </div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {["all","win","loss","pending"].map(f=>(<button key={f} onClick={()=>setBetFilter(f)} style={{background:betFilter===f?`${ac}33`:"#ffffff08",border:`1px solid ${betFilter===f?ac:"#ffffff15"}`,color:betFilter===f?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:16,cursor:"pointer",fontSize:11,fontWeight:600,textTransform:"capitalize"}}>{f}</button>))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filteredBets.map(bet=>(<div key={bet.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24"}`}}>
              <div style={{width:38,height:38,borderRadius:10,background:bet.result==="win"?"#4ade8015":bet.result==="loss"?"#f8717115":"#fbbf2415",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{bet.result==="win"?"✅":bet.result==="loss"?"❌":"⏳"}</div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:1}}>{bet.matchup}</div><div style={{fontSize:12,color:"#ffffff55"}}>{bet.type} · {bet.odds} · {bet.stake} · {bet.date}</div></div>
              <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:15,fontWeight:800,color:bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24"}}>{bet.payout}</div><div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",color:bet.result==="win"?"#4ade80":bet.result==="loss"?"#f87171":"#fbbf24",marginTop:2}}>{bet.result}</div></div>
            </div>))}
          </div>
        </div>)}

        {/* FIVE PICK FRIDAYS */}
        {activeSection==="video"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,flexWrap:"wrap"}}>
            <CraigAvatar size={56}/>
            <div style={{flex:1}}>
              <h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>Five Pick Fridays</h2>
              <div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Every Friday during NFL season — Craig&#39;s 5 best bets + Thursday Night recap</div>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a>
            </div>
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
              <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#e94560,#7c3aed)",opacity:0.1}}/>
              <div style={{width:60,height:60,borderRadius:"50%",background:`${ac}cc`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,cursor:"pointer",zIndex:1,boxShadow:`0 0 30px ${ac}44`}}>▶</div>
            </div>
            <div style={{display:"flex",gap:16,fontSize:12,color:"#ffffff55"}}><span>⏱️ {WEEKLY_VIDEOS[0].duration}</span><span>👁️ {WEEKLY_VIDEOS[0].views} views</span></div>
            <div style={{marginTop:14,borderTop:"1px solid #ffffff10",paddingTop:12}}>
              <div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>This Week&#39;s Picks</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {WEEKLY_VIDEOS[0].picks.map((p,i)=>(<div key={i} style={{background:p.result==="win"?"#4ade8012":p.result==="loss"?"#f8717112":"#fbbf2412",border:`1px solid ${p.result==="win"?"#4ade8033":p.result==="loss"?"#f8717133":"#fbbf2433"}`,borderRadius:8,padding:"6px 10px",display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#fff"}}>{p.pick}</span><span style={{fontSize:10}}>{p.result==="win"?"✅":p.result==="loss"?"❌":"⏳"}</span>
                </div>))}
              </div>
            </div>
          </div>
          <div style={{fontSize:12,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Previous Episodes</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {WEEKLY_VIDEOS.slice(1).map(v=>(<div key={v.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
              <div style={{width:64,height:44,borderRadius:8,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#e94560,#7c3aed)",opacity:0.15}}/><span style={{fontSize:16,zIndex:1}}>▶</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{v.title}</div>
                <div style={{fontSize:12,color:"#ffffff55",marginBottom:4}}>{v.date} · {v.duration} · {v.views} views</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{v.picks.map((p,i)=>(<span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:p.result==="win"?"#4ade8015":p.result==="loss"?"#f8717115":"#fbbf2415",color:p.result==="win"?"#4ade80":p.result==="loss"?"#f87171":"#fbbf24",fontWeight:600}}>{p.result==="win"?"W":p.result==="loss"?"L":"P"}</span>))}</div>
              </div>
            </div>))}
          </div>
          <div style={{background:"#ffffff06",border:"1px dashed #ffffff15",borderRadius:12,padding:20,textAlign:"center",marginTop:20}}>
            <div style={{fontSize:13,color:"#ffffff55"}}>🔔 New episode every <strong style={{color:"#fff"}}>Friday</strong> during NFL season</div>
            <div style={{fontSize:12,color:"#ffffff44",marginTop:4}}>Subscribe to never miss Five Pick Fridays</div>
          </div>
        </div>)}
      </div>
    </div>
    <style jsx global>{`
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:6px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:3px}
      button:hover{opacity:0.85}
      html,body{background:#0a0a0f}
    `}</style>
  </>);
}
