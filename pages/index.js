import { useState, useEffect, useMemo, useCallback } from "react";
import Head from "next/head";

const TEAMS={AFC:{North:[{name:"Ravens",city:"Baltimore",abbr:"BAL",color:"#241773",accent:"#9E7C0C"},{name:"Bengals",city:"Cincinnati",abbr:"CIN",color:"#FB4F14",accent:"#000000"},{name:"Browns",city:"Cleveland",abbr:"CLE",color:"#311D00",accent:"#FF3C00"},{name:"Steelers",city:"Pittsburgh",abbr:"PIT",color:"#FFB612",accent:"#101820"}],South:[{name:"Texans",city:"Houston",abbr:"HOU",color:"#03202F",accent:"#A71930"},{name:"Colts",city:"Indianapolis",abbr:"IND",color:"#002C5F",accent:"#A2AAAD"},{name:"Jaguars",city:"Jacksonville",abbr:"JAX",color:"#006778",accent:"#D7A22A"},{name:"Titans",city:"Tennessee",abbr:"TEN",color:"#0C2340",accent:"#4B92DB"}],East:[{name:"Bills",city:"Buffalo",abbr:"BUF",color:"#00338D",accent:"#C60C30"},{name:"Dolphins",city:"Miami",abbr:"MIA",color:"#008E97",accent:"#FC4C02"},{name:"Patriots",city:"New England",abbr:"NE",color:"#002244",accent:"#C60C30"},{name:"Jets",city:"New York",abbr:"NYJ",color:"#125740",accent:"#FFFFFF"}],West:[{name:"Broncos",city:"Denver",abbr:"DEN",color:"#FB4F14",accent:"#002244"},{name:"Chiefs",city:"Kansas City",abbr:"KC",color:"#E31837",accent:"#FFB81C"},{name:"Raiders",city:"Las Vegas",abbr:"LV",color:"#000000",accent:"#A5ACAF"},{name:"Chargers",city:"Los Angeles",abbr:"LAC",color:"#0080C6",accent:"#FFC20E"}]},NFC:{North:[{name:"Bears",city:"Chicago",abbr:"CHI",color:"#0B162A",accent:"#C83803"},{name:"Lions",city:"Detroit",abbr:"DET",color:"#0076B6",accent:"#B0B7BC"},{name:"Packers",city:"Green Bay",abbr:"GB",color:"#203731",accent:"#FFB612"},{name:"Vikings",city:"Minnesota",abbr:"MIN",color:"#4F2683",accent:"#FFC62F"}],South:[{name:"Falcons",city:"Atlanta",abbr:"ATL",color:"#A71930",accent:"#000000"},{name:"Panthers",city:"Carolina",abbr:"CAR",color:"#0085CA",accent:"#101820"},{name:"Saints",city:"New Orleans",abbr:"NO",color:"#D3BC8D",accent:"#101820"},{name:"Buccaneers",city:"Tampa Bay",abbr:"TB",color:"#D50A0A",accent:"#34302B"}],East:[{name:"Cowboys",city:"Dallas",abbr:"DAL",color:"#003594",accent:"#869397"},{name:"Giants",city:"New York",abbr:"NYG",color:"#0B2265",accent:"#A71930"},{name:"Eagles",city:"Philadelphia",abbr:"PHI",color:"#004C54",accent:"#A5ACAF"},{name:"Commanders",city:"Washington",abbr:"WAS",color:"#5A1414",accent:"#FFB612"}],West:[{name:"Cardinals",city:"Arizona",abbr:"ARI",color:"#97233F",accent:"#000000"},{name:"Rams",city:"Los Angeles",abbr:"LAR",color:"#003594",accent:"#FFA300"},{name:"49ers",city:"San Francisco",abbr:"SF",color:"#AA0000",accent:"#B3995D"},{name:"Seahawks",city:"Seattle",abbr:"SEA",color:"#002244",accent:"#69BE28"}]}};

const allTeams=Object.entries(TEAMS).flatMap(([conf,divs])=>Object.entries(divs).flatMap(([div,teams])=>teams.map(t=>({...t,conference:conf,division:div,divFull:`${conf} ${div}`}))));
const getTeam=(n)=>allTeams.find(t=>t.name===n);
const DIVISIONS=["AFC North","AFC South","AFC East","AFC West","NFC North","NFC South","NFC East","NFC West"];

// TODO: Replace with your hosted photo URL
const CRAIG_PHOTO=null;
const CraigAvatar=({size=44,border=true})=>(
  CRAIG_PHOTO
    ? <img src={CRAIG_PHOTO} alt="Craig Naylor" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:border?`2px solid #ffffff22`:"none",flexShrink:0}}/>
    : <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#e94560,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:800,color:"#fff",letterSpacing:"-0.5px",flexShrink:0,border:border?"2px solid #ffffff22":"none",boxShadow:"0 2px 12px #e9456033"}}>CN</div>
);

const TOP_STORIES_ALL=[
  {id:"s1",headline:"Chiefs Lock Up #1 Seed After Dominant Win Over Ravens",summary:"Kansas City clinches home-field advantage throughout the AFC playoffs with their 13th win of the season.",category:"league",tag:"🔥 Breaking",relatedPosts:["Patrick Mahomes threw for 312 yards and 3 TDs as the Chiefs cruised past Baltimore 31-17. KC locks up the #1 seed.","The AFC playoff picture is set. Chiefs get the bye, Ravens likely face Bills in the Wild Card round.","Andy Reid is now 5-1 against Harbaugh in the regular season."]},
  {id:"s2",headline:"Saquon Barkley Tears ACL — Out for Season",summary:"The Eagles star RB suffered the injury in the 3rd quarter against Dallas.",category:"league",tag:"💔 Injury",relatedPosts:["Devastating news from Philadelphia. Saquon Barkley is done for the year. MRI confirmed a torn ACL.","Eagles already exploring trade market for RB help.","Prayers up for Saquon. One of the most electric players in the league. 🙏"]},
  {id:"s3",headline:"NFL Approves New Kickoff Rule for 2026 Season",summary:"After a successful trial, the dynamic kickoff format becomes permanent.",category:"league",tag:"📋 Rules",relatedPosts:["OFFICIAL: The new kickoff is here to stay. Owners voted 30-2.","Special teams coordinators rejoice. The new kickoff has made ST relevant again."]},
  {id:"s4",headline:"Joe Burrow Named AFC Offensive Player of the Month",summary:"Burrow threw for 1,400 yards and 12 TDs in December.",category:"league",tag:"⭐ Award",relatedPosts:["Joe Burrow is playing the best football of his career. 12 TDs, 1 INT in December.","AFC OPOM: Joe Burrow. Completely deserved."]},
  {id:"s5",headline:"Thursday Night Football: Lions 27, Packers 24 in OT Thriller",summary:"Amon-Ra St. Brown's walk-off TD catch gives Detroit the division title.",category:"league",tag:"🏟️ TNF",relatedPosts:["WALK. IT. OFF. Amon-Ra St. Brown with the 34-yard TD in OT!","Lions clinch the NFC North for the 2nd straight year."]},
];

const DIVISION_STORIES={"AFC North":[{id:"dn1",headline:"Bengals Clinch Playoff Berth with Win Over Steelers",summary:"Cincinnati punches their ticket behind Burrow's 4-TD performance.",tag:"🐯",relatedPosts:["BENGALS ARE IN. Joe Burrow threw 4 TDs against Pittsburgh. WHO DEY!","Steelers fall to 9-7 and now need help in Week 18."]},{id:"dn2",headline:"Ravens Sign Derrick Henry to Extension Through 2027",summary:"Baltimore locks up their workhorse back on a 2-year, $20M deal.",tag:"🦅",relatedPosts:["Derrick Henry isn't going anywhere. Ravens commit through 2027.","Henry has 1,300+ rushing yards this season at age 31."]}],"NFC West":[{id:"dw1",headline:"Cardinals Trade for Pro Bowl Edge Rusher",summary:"Arizona acquires a key defensive piece for a Wild Card push.",tag:"🐦",relatedPosts:["BREAKING: Cardinals acquire edge rusher in a blockbuster deal.","The Cardinals FO is sending a message. This team is ALL IN."]}]};

const TEAM_STORIES={Bengals:[{id:"tb1",headline:"Ja'Marr Chase Breaks Franchise Receiving Record",summary:"Chase surpasses Chad Johnson's single-season yardage mark.",tag:"🐯",relatedPosts:["JA'MARR CHASE HAS DONE IT. New franchise record for receiving yards!","Chase and Burrow might be the best QB-WR duo in NFL history."]}],Cardinals:[{id:"tc1",headline:"Kyler Murray Having Career Resurgence",summary:"Murray is top-5 in QBR and has the Cardinals in surprise contention.",tag:"🐦",relatedPosts:["Kyler Murray is BACK. Top 5 in QBR, the Cardinals are for real."]}]};

const WEEKLY_VIDEOS=[
  {id:"v1",title:"Week 17 Picks + TNF Recap: Lions Walk It Off!",date:"Fri, Dec 27",duration:"4:32",views:"2.4K",description:"Breaking down the Lions' OT thriller vs GB, plus my top 5 picks for the weekend slate.",picks:[{pick:"Chiefs -3.5",result:"win"},{pick:"Lions ML",result:"win"},{pick:"Eagles -7",result:"win"},{pick:"Bills/Dolphins O48.5",result:"pending"},{pick:"Bengals -1",result:"pending"}]},
  {id:"v2",title:"Week 16 Picks + TNF Recap: Chargers Upset!",date:"Fri, Dec 20",duration:"4:58",views:"1.8K",description:"Thursday's Chargers upset has massive playoff implications.",picks:[{pick:"Ravens -6",result:"win"},{pick:"49ers ML",result:"loss"},{pick:"Packers +3",result:"win"},{pick:"Chiefs/Texans O44",result:"win"},{pick:"Cowboys +10",result:"loss"}]},
  {id:"v3",title:"Week 15 Picks + TNF Recap: Snow Game Madness",date:"Fri, Dec 13",duration:"3:47",views:"1.5K",description:"Wild snow game on Thursday. Plus my best bets for a loaded Week 15.",picks:[{pick:"Bengals -3",result:"win"},{pick:"Lions -4.5",result:"win"},{pick:"Rams ML",result:"loss"},{pick:"Steelers +2",result:"win"},{pick:"Dolphins/Jets U41",result:"win"}]},
];
const seasonRecord=WEEKLY_VIDEOS.reduce((a,v)=>{v.picks.forEach(p=>{if(p.result==="win")a.w++;else if(p.result==="loss")a.l++;else a.p++;});return a;},{w:0,l:0,p:0});

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

const NFL_KEYWORDS=["nfl","super bowl","touchdown","mvp","pro football","chiefs","ravens","bengals","browns","steelers","texans","colts","jaguars","titans","bills","dolphins","patriots","jets","broncos","chargers","raiders","bears","lions","packers","vikings","falcons","panthers","saints","buccaneers","cowboys","giants","eagles","commanders","cardinals","rams","49ers","seahawks","kansas city","baltimore","cincinnati","cleveland","pittsburgh","houston","indianapolis","jacksonville","tennessee","buffalo","miami","new england","new york","denver","los angeles","las vegas","chicago","detroit","green bay","minnesota","atlanta","carolina","new orleans","tampa bay","dallas","philadelphia","washington","arizona","san francisco","seattle","afc","nfc"];

const fmtVol=(v)=>{if(!v)return"$0";const d=v/100;if(d>=1e6)return`$${(d/1e6).toFixed(1)}M`;if(d>=1e3)return`$${(d/1e3).toFixed(0)}K`;return`$${d.toFixed(0)}`;};
const catMarket=(m)=>{const t=`${m.title||""}${m.event_ticker||""}`.toLowerCase();if(t.includes("super bowl")||t.includes("champion")||t.includes("playoff"))return"Futures";if(t.includes("touchdown")||t.includes("yard")||t.includes("pass")||t.includes("rush"))return"Prop";if(t.includes("win")||t.includes("spread")||t.includes("over")||t.includes("under")||t.includes("total"))return"Game";if(t.includes("mvp")||t.includes("rookie")||t.includes("award"))return"Award";return"Other";};

const useKalshi=()=>{
  const [markets,setMarkets]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [lastFetch,setLastFetch]=useState(null);
  const fetch_=useCallback(async()=>{
    setLoading(true);setError(null);
    try{
      const r=await fetch("/api/kalshi");
      if(!r.ok)throw new Error(`API ${r.status}`);
      const d=await r.json();
      const mapped=(d.markets||[]).slice(0,20).map(m=>({
        id:m.ticker,market:m.title+(m.subtitle?` — ${m.subtitle}`:""),
        yes:m.yes_bid||m.last_price||50,no:m.no_bid||(100-(m.last_price||50)),
        volume:fmtVol(m.volume_24h||m.volume||0),cat:catMarket(m),ticker:m.ticker,
      }));
      setMarkets(mapped);setLastFetch(new Date());
    }catch(e){setError(e.message);}finally{setLoading(false);}
  },[]);
  useEffect(()=>{fetch_();},[fetch_]);
  return{markets,loading,error,lastFetch,refresh:fetch_};
};

const timeAgo=(ts)=>{const d=Math.floor((Date.now()-ts)/60000);if(d<60)return`${d}m`;if(d<1440)return`${Math.floor(d/60)}h`;return`${Math.floor(d/1440)}d`;};
const fmt=(n)=>n>=1000?`${(n/1000).toFixed(1)}k`:n;

function StoryModal({story,onClose}){
  if(!story)return null;
  return(<div style={{position:"fixed",inset:0,background:"#000000dd",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",padding:16}} onClick={onClose}>
    <div style={{background:"#151520",borderRadius:16,padding:28,maxWidth:600,width:"100%",maxHeight:"80vh",overflowY:"auto",border:"1px solid #ffffff15"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
        <span style={{fontSize:11,padding:"3px 8px",borderRadius:6,background:"#e9456022",color:"#e94560",fontWeight:700}}>{story.tag}</span>
        <button onClick={onClose} style={{background:"#ffffff10",border:"none",color:"#fff",width:28,height:28,borderRadius:8,cursor:"pointer",fontSize:14}}>✕</button>
      </div>
      <h2 style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:8,lineHeight:1.3}}>{story.headline}</h2>
      <p style={{fontSize:14,color:"#ffffff88",marginBottom:20,lineHeight:1.5}}>{story.summary}</p>
      <div style={{fontSize:12,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:12}}>Related Posts</div>
      {story.relatedPosts.map((p,i)=>(<div key={i} style={{background:"#1a1a2e",borderRadius:10,padding:14,marginBottom:8,borderLeft:"3px solid #e94560"}}>
        <div style={{fontSize:13,color:"#ddd",lineHeight:1.5}}>{p}</div>
        <div style={{fontSize:11,color:"#ffffff44",marginTop:6}}>📱 Social Post · {Math.floor(Math.random()*4)+1}h ago</div>
      </div>))}
    </div>
  </div>);
}

function TopStories({stories,ac}){
  const [sel,setSel]=useState(null);
  if(!stories||!stories.length)return null;
  const main=stories[0],rest=stories.slice(1,5);
  return(<><div style={{marginBottom:24}}>
    <div style={{fontSize:12,color:"#ffffff55",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:12}}>📰 Top Stories</div>
    <div style={{display:"grid",gridTemplateColumns:rest.length?"2fr 1fr":"1fr",gap:12}}>
      <div onClick={()=>setSel(main)} style={{background:"linear-gradient(135deg,#1a1a2e,#12121c)",border:"1px solid #ffffff12",borderRadius:14,padding:20,cursor:"pointer",borderLeft:`4px solid ${ac}`}}>
        <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:`${ac}22`,color:ac,fontWeight:700,marginBottom:8,display:"inline-block"}}>{main.tag}</span>
        <h3 style={{fontSize:18,fontWeight:800,color:"#fff",lineHeight:1.3,marginBottom:6}}>{main.headline}</h3>
        <p style={{fontSize:13,color:"#ffffff77",lineHeight:1.5}}>{main.summary}</p>
        <div style={{fontSize:11,color:ac,marginTop:10,fontWeight:600}}>Click to read more →</div>
      </div>
      {rest.length>0&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
        {rest.map(s=>(<div key={s.id} onClick={()=>setSel(s)} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:10,padding:12,cursor:"pointer",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span style={{fontSize:9,color:"#ffffff55",fontWeight:600}}>{s.tag}</span>
          <div style={{fontSize:13,fontWeight:700,color:"#fff",lineHeight:1.3,marginTop:3}}>{s.headline}</div>
        </div>))}
      </div>}
    </div>
  </div><StoryModal story={sel} onClose={()=>setSel(null)}/></>);
}

export default function Home(){
  const [selectedTeam,setSelectedTeam]=useState(null);
  const [showPicker,setShowPicker]=useState(false);
  const [feedFilter,setFeedFilter]=useState("all");
  const [betTab,setBetTab]=useState("craigs");
  const [betFilter,setBetFilter]=useState("all");
  const [activeSection,setActiveSection]=useState("feed");
  const [searchQuery,setSearchQuery]=useState("");
  const [activeSearch,setActiveSearch]=useState("");
  const [kalshiFilter,setKalshiFilter]=useState("all");
  const kalshi=useKalshi();

  const team=selectedTeam?getTeam(selectedTeam):null;
  const pc=team?team.color:"#1a1a2e";
  const ac=team?team.accent:"#e94560";

  const getStories=()=>{
    let s=[...TOP_STORIES_ALL];
    if(team){const ds=DIVISION_STORIES[team.divFull]||[];const ts=TEAM_STORIES[team.name]||[];
      if(feedFilter==="team"&&ts.length)return ts;if(feedFilter==="division"&&ds.length)return ds;s=[...ts,...ds,...s];}
    if(feedFilter==="league")return TOP_STORIES_ALL.slice(0,5);return s.slice(0,5);
  };

  const generatePosts=useMemo(()=>{
    const now=Date.now(),posts=[];
    const league=["NFL considering new kickoff rule changes for next season.","Week 14 Power Rankings are out — some big movers.","Trade deadline buzz: Multiple teams looking to add pass rush.","Injury report: Several star QBs dealing with issues heading into December.","Historic Sunday: 3 games decided by walk-off field goals.","Pro Bowl voting is now open.","Patrick Mahomes post-game: 'We're built for January football.'","Saquon Barkley injury update: Eagles fear the worst after MRI."];
    const div=team?[`${team.divFull} is the tightest race in football.`,`Big ${team.divFull} matchup this weekend.`,`${team.divFull} defensive rankings — the numbers might surprise you.`,`${team.divFull} playoff scenarios: Who controls their own destiny?`]:[];
    const tm=team?[`${team.name} practice report: Key starter back at full participation.`,`${team.name} film breakdown: Why the offense is clicking 🧵`,`${team.name} cap space update: Flexibility to make moves.`,`${team.name} working out veteran DBs this week.`,`${team.name} fan poll: Rate the season 1-10.`,`${team.name} locker room energy is at an all-time high.`]:[];
    const accs=[{h:"@NFL",p:"twitter",n:"NFL",a:"🏈"},{h:"@AdamSchefter",p:"twitter",n:"Adam Schefter",a:"📰"},{h:"@RapSheet",p:"twitter",n:"Ian Rapoport",a:"🗞️"},{h:"@PatMcAfeeShow",p:"twitter",n:"Pat McAfee",a:"🎙️"},{h:"@nfl",p:"instagram",n:"NFL",a:"🏈"},{h:"@NFLNetwork",p:"twitter",n:"NFL Network",a:"📺"}];
    league.forEach((t,i)=>posts.push({id:`l${i}`,text:t,account:accs[i%accs.length],time:now-(i*47+10)*60000,category:"league",likes:Math.floor(Math.random()*5000)+500,rts:Math.floor(Math.random()*1200)+100}));
    div.forEach((t,i)=>posts.push({id:`d${i}`,text:t,account:{h:`@${team.divFull.replace(" ","")}`,p:"twitter",n:`${team.divFull} Talk`,a:"🏟️"},time:now-(i*63+25)*60000,category:"division",likes:Math.floor(Math.random()*2000)+200,rts:Math.floor(Math.random()*500)+50}));
    tm.forEach((t,i)=>posts.push({id:`t${i}`,text:t,account:{h:`@${team?.name||""}`,p:i%3===2?"instagram":"twitter",n:`${team?.city} ${team?.name}`,a:"⭐"},time:now-(i*35+5)*60000,category:"team",likes:Math.floor(Math.random()*3000)+300,rts:Math.floor(Math.random()*800)+80}));
    return posts.sort((a,b)=>b.time-a.time);
  },[selectedTeam,team]);

  const filteredPosts=useMemo(()=>{
    let p=feedFilter==="all"?generatePosts:generatePosts.filter(x=>x.category===feedFilter);
    if(activeSearch){const q=activeSearch.toLowerCase();p=generatePosts.filter(x=>x.text.toLowerCase().includes(q)||x.account.n.toLowerCase().includes(q));}
    return p;
  },[generatePosts,feedFilter,activeSearch]);

  const postsForDisplay=useMemo(()=>{
    if(activeSearch)return filteredPosts;
    if(feedFilter==="afc")return generatePosts.filter(p=>p.category==="league"||p.text.includes("AFC"));
    if(feedFilter==="nfc")return generatePosts.filter(p=>p.category==="league"||p.text.includes("NFC"));
    if(DIVISIONS.includes(feedFilter))return generatePosts.filter(p=>p.category==="league"||p.category==="division"||p.text.includes(feedFilter.split(" ")[1]));
    return filteredPosts;
  },[filteredPosts,feedFilter,activeSearch,generatePosts]);

  const filteredBets=betFilter==="all"?MOCK_BETS:MOCK_BETS.filter(b=>b.result===betFilter);
  const filteredKalshi=kalshiFilter==="all"?kalshi.markets:kalshi.markets.filter(k=>k.cat===kalshiFilter);
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
      <meta name="description" content="Your NFL command center. Live Kalshi markets, curated social feeds, and Craig's betting picks." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e0e0e0",fontFamily:"'Inter',-apple-system,sans-serif"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${pc}ee,${pc}99,#0a0a0f)`,borderBottom:`2px solid ${ac}44`,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"14px 24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:28,fontWeight:900,letterSpacing:"-1px",background:`linear-gradient(135deg,#fff,${ac})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>GRIDLOCK</div>
              <div style={{fontSize:10,color:"#ffffff66",letterSpacing:"2px",textTransform:"uppercase"}}>NFL • Bets • Feed</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"8px 12px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:11,color:"#1DA1F2"}}>𝕏</span> @cnaylor_
              </a>
              <button onClick={()=>setShowPicker(!showPicker)} style={{background:selectedTeam?`${ac}33`:"#ffffff15",border:`1px solid ${selectedTeam?ac:"#ffffff33"}`,color:"#fff",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
                {selectedTeam?`${team?.city} ${selectedTeam}`:"🏈 Select Your Team"}
              </button>
              {selectedTeam&&<button onClick={()=>{setSelectedTeam(null);setFeedFilter("all");}} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#ffffff88",padding:"8px 12px",borderRadius:8,cursor:"pointer",fontSize:12}}>✕</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:4,marginTop:12}}>
            {[{k:"feed",l:"📱 Social Feed"},{k:"kalshi",l:"📊 Kalshi Markets"},{k:"bets",l:"💰 Craig's List"},{k:"video",l:"🎬 Five Pick Fridays"}].map(s=>(
              <button key={s.k} onClick={()=>setActiveSection(s.k)} style={{background:activeSection===s.k?`${ac}33`:"transparent",border:"none",color:activeSection===s.k?"#fff":"#ffffff66",padding:"8px 16px",borderRadius:"8px 8px 0 0",cursor:"pointer",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:"1px",borderBottom:activeSection===s.k?`2px solid ${ac}`:"2px solid transparent"}}>{s.l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Picker */}
      {showPicker&&(<div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setShowPicker(false)}>
        <div style={{background:"#151520",borderRadius:16,padding:28,maxWidth:720,width:"90%",maxHeight:"80vh",overflowY:"auto",border:"1px solid #ffffff15"}} onClick={e=>e.stopPropagation()}>
          <div style={{fontSize:20,fontWeight:800,marginBottom:20,color:"#fff"}}>Choose Your Team</div>
          {Object.entries(TEAMS).map(([conf,divs])=>(<div key={conf} style={{marginBottom:20}}>
            <div style={{fontSize:13,fontWeight:700,color:conf==="AFC"?"#e94560":"#4ea8de",letterSpacing:"2px",marginBottom:10,textTransform:"uppercase"}}>{conf}</div>
            {Object.entries(divs).map(([div,teams])=>(<div key={div}>
              <div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",marginBottom:6,marginTop:8}}>{div}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:8}}>
                {teams.map(t=>(<button key={t.abbr} onClick={()=>{setSelectedTeam(t.name);setShowPicker(false);setFeedFilter("all");}} style={{background:selectedTeam===t.name?`${t.color}44`:"#1a1a2e",border:`1px solid ${selectedTeam===t.name?t.color:"#ffffff15"}`,color:"#fff",padding:"8px 10px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,textAlign:"left"}}>
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
          <div style={{position:"relative",marginBottom:20}}>
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")setActiveSearch(searchQuery)}} placeholder="🔍 Search players, teams, or topics..." style={{width:"100%",background:"#12121c",border:"1px solid #ffffff15",borderRadius:10,padding:"12px 16px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            {searchQuery&&<button onClick={()=>{setSearchQuery("");setActiveSearch("");}} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"#ffffff15",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:12}}>Clear</button>}
          </div>
          {!activeSearch&&<TopStories stories={getStories()} ac={ac}/>}
          {activeSearch&&(<div style={{background:`${ac}15`,border:`1px solid ${ac}33`,borderRadius:10,padding:12,marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,color:"#fff"}}>Results for: <strong>&quot;{activeSearch}&quot;</strong></span>
            <span style={{fontSize:12,color:"#ffffff66"}}>({postsForDisplay.length} posts)</span>
          </div>)}
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginRight:4}}>Filter:</span>
            {filterOptions.map(f=>(<button key={f.key} onClick={()=>{setFeedFilter(f.key);setActiveSearch("");setSearchQuery("");}} style={{background:feedFilter===f.key?`${ac}33`:"#ffffff08",border:`1px solid ${feedFilter===f.key?ac:"#ffffff15"}`,color:feedFilter===f.key?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600}}>{f.label}</button>))}
          </div>
          {!selectedTeam&&!activeSearch&&(<div style={{background:"#ffffff08",border:"1px solid #ffffff15",borderRadius:12,padding:24,textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:32,marginBottom:8}}>🏈</div>
            <div style={{fontSize:15,fontWeight:600,color:"#fff",marginBottom:4}}>Select your team for a personalized feed</div>
            <div style={{fontSize:13,color:"#ffffff66"}}>Get a curated mix of league-wide, division, and team-specific content</div>
          </div>)}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {postsForDisplay.map(post=>(<div key={post.id} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16,borderLeft:`3px solid ${post.category==="team"?ac:post.category==="division"?"#4ea8de":"#ffffff22"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"#ffffff12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{post.account.a}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{post.account.n}</span><span style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:post.account.p==="twitter"?"#1DA1F222":"#E1306C22",color:post.account.p==="twitter"?"#1DA1F2":"#E1306C",fontWeight:600}}>{post.account.p==="twitter"?"𝕏":"IG"}</span></div>
                  <div style={{fontSize:11,color:"#ffffff44"}}>{post.account.h} · {timeAgo(post.time)} ago</div>
                </div>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:post.category==="team"?`${ac}22`:post.category==="division"?"#4ea8de22":"#ffffff08",color:post.category==="team"?ac:post.category==="division"?"#4ea8de":"#ffffff55",fontWeight:600,textTransform:"uppercase",flexShrink:0}}>{post.category==="team"?selectedTeam:post.category}</span>
              </div>
              <div style={{fontSize:14,lineHeight:1.5,color:"#ddd",marginBottom:8}}>{post.text}</div>
              <div style={{display:"flex",gap:16,fontSize:12,color:"#ffffff44"}}><span>♥ {fmt(post.likes)}</span><span>🔄 {fmt(post.rts)}</span></div>
            </div>))}
            {postsForDisplay.length===0&&(<div style={{textAlign:"center",padding:40,color:"#ffffff44"}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><div style={{fontSize:14}}>No posts found{activeSearch?` for "${activeSearch}"`:""}</div></div>)}
          </div>
        </div>)}

        {/* KALSHI MARKETS */}
        {activeSection==="kalshi"&&(<div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
            <div><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:0}}>🔥 Trending on Kalshi</h2><div style={{fontSize:13,color:"#ffffff55",marginTop:4}}>Live NFL prediction markets — sorted by volume</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {kalshi.lastFetch&&<span style={{fontSize:11,color:"#ffffff33"}}>Updated {kalshi.lastFetch.toLocaleTimeString()}</span>}
              <button onClick={kalshi.refresh} disabled={kalshi.loading} style={{background:"#ffffff10",border:"1px solid #ffffff22",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600,opacity:kalshi.loading?0.5:1}}>{kalshi.loading?"Loading...":"🔄 Refresh"}</button>
            </div>
          </div>
          {kalshi.error&&(<div style={{background:"#f8717115",border:"1px solid #f8717133",borderRadius:10,padding:14,marginBottom:16}}>
            <div style={{fontSize:13,color:"#f87171",fontWeight:600}}>⚠️ Couldn&apos;t fetch Kalshi data</div>
            <div style={{fontSize:12,color:"#ffffff55",marginTop:4}}>This will work once deployed with the backend proxy. Error: {kalshi.error}</div>
          </div>)}
          {kalshi.loading&&!kalshi.markets.length&&(<div style={{textAlign:"center",padding:40}}><div style={{fontSize:28,marginBottom:8}}>📊</div><div style={{fontSize:14,color:"#ffffff55"}}>Fetching live markets from Kalshi...</div></div>)}
          {kalshi.markets.length>0&&(<>
            <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
              {["all",...new Set(kalshi.markets.map(k=>k.cat))].map(f=>(<button key={f} onClick={()=>setKalshiFilter(f)} style={{background:kalshiFilter===f?`${ac}33`:"#ffffff08",border:`1px solid ${kalshiFilter===f?ac:"#ffffff15"}`,color:kalshiFilter===f?"#fff":"#ffffff77",padding:"5px 12px",borderRadius:16,cursor:"pointer",fontSize:11,fontWeight:600}}>{f==="all"?"All Markets":f}</button>))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {filteredKalshi.map(k=>(<a key={k.id} href={`https://kalshi.com/markets/${k.ticker}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}>
                <div style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:16}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff",flex:1,paddingRight:12}}>{k.market}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}><span style={{fontSize:11,color:"#ffffff44"}}>Vol: {k.volume}</span><span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:"#ffffff08",color:"#ffffff55",fontWeight:600}}>{k.cat}</span></div>
                  </div>
                  <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span style={{color:"#4ade80",fontWeight:600}}>Yes {k.yes}¢</span><span style={{color:"#f87171",fontWeight:600}}>No {k.no}¢</span></div>
                    <div style={{height:8,borderRadius:4,background:"#f8717133",overflow:"hidden"}}><div style={{width:`${k.yes}%`,height:"100%",borderRadius:4,background:"linear-gradient(90deg,#4ade80,#22c55e)"}}/></div>
                  </div>
                </div>
              </a>))}
            </div>
          </>)}
          <div style={{background:"#ffffff06",border:"1px solid #ffffff10",borderRadius:10,padding:16,marginTop:16,textAlign:"center"}}>
            <div style={{fontSize:12,color:"#ffffff44"}}>Live data from <a href="https://kalshi.com/sports/all-sports" target="_blank" rel="noopener noreferrer" style={{color:"#fff",fontWeight:600,textDecoration:"none"}}>Kalshi</a> · Click any market to trade</div>
          </div>
        </div>)}

        {/* CRAIG'S LIST */}
        {activeSection==="bets"&&(<div>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:3}}><h2 style={{fontSize:26,fontWeight:900,color:"#fff",margin:0}}>Craig&apos;s</h2><h2 style={{fontSize:26,fontWeight:900,margin:0,background:`linear-gradient(135deg,${ac},#e94560)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>List</h2></div>
              <div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Live bets from the man himself — via Hard Rock Bet</div>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
              <CraigAvatar size={44}/>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 8px #4ade8066"}}/>
              <span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>LIVE</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
            {[{l:"Record",v:`${rec.w}-${rec.l}`,s:`${rec.p} pending`},{l:"Win Rate",v:`${((rec.w/(rec.w+rec.l))*100).toFixed(0)}%`,s:`${rec.w+rec.l} settled`},{l:"Net Profit",v:`${profit>=0?"+":""}$${profit.toFixed(0)}`,s:"all time",c:profit>=0?"#4ade80":"#f87171"},{l:"Avg Stake",v:`$${(MOCK_BETS.reduce((s,b)=>s+parseFloat(b.stake.replace("$","")),0)/MOCK_BETS.length).toFixed(0)}`,s:`${MOCK_BETS.length} bets`}].map((s,i)=>(<div key={i} style={{background:"#12121c",border:"1px solid #ffffff10",borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{fontSize:10,color:"#ffffff55",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.c||"#fff"}}>{s.v}</div>
              <div style={{fontSize:11,color:"#ffffff44",marginTop:2}}>{s.s}</div>
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
              <div style={{fontSize:13,color:"#ffffff55",marginTop:2}}>Every Friday during NFL season — Craig&apos;s 5 best bets + Thursday Night recap</div>
              <a href="https://x.com/cnaylor_" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#1DA1F2",textDecoration:"none",fontWeight:600,marginTop:2,display:"inline-block"}}>𝕏 @cnaylor_</a>
            </div>
            <div style={{background:"#12121c",border:"1px solid #ffffff15",borderRadius:12,padding:"12px 20px",display:"flex",gap:20,alignItems:"center",flexShrink:0}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>Season Record</div><div style={{fontSize:22,fontWeight:900,color:"#fff"}}>{seasonRecord.w}-{seasonRecord.l}{seasonRecord.p>0?<span style={{color:"#fbbf24",fontSize:14}}>-{seasonRecord.p}</span>:null}</div></div>
              <div style={{width:1,height:36,background:"#ffffff15"}}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>Win Rate</div><div style={{fontSize:22,fontWeight:900,color:((seasonRecord.w/(seasonRecord.w+seasonRecord.l))*100)>=55?"#4ade80":"#fbbf24"}}>{((seasonRecord.w/(seasonRecord.w+seasonRecord.l))*100).toFixed(0)}%</div></div>
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
              <div style={{fontSize:11,color:"#ffffff44",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8}}>This Week&apos;s Picks</div>
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
                <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#e94560,#7c3aed)",opacity:0.15}}/>
                <span style={{fontSize:16,zIndex:1}}>▶</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{v.title}</div>
                <div style={{fontSize:12,color:"#ffffff55",marginBottom:4}}>{v.date} · {v.duration} · {v.views} views</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {v.picks.map((p,i)=>(<span key={i} style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:p.result==="win"?"#4ade8015":p.result==="loss"?"#f8717115":"#fbbf2415",color:p.result==="win"?"#4ade80":p.result==="loss"?"#f87171":"#fbbf24",fontWeight:600}}>{p.result==="win"?"W":p.result==="loss"?"L":"P"}</span>))}
                </div>
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
      input::placeholder{color:#ffffff44}
      html,body{background:#0a0a0f}
    `}</style>
  </>);
}
