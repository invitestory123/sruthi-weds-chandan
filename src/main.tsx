import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {CalendarBlank, MapPin, MusicNotes, FlowerLotus, Sparkle, ArrowDown, SpeakerHigh, SpeakerSlash} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './styles.css';

const WEDDING = new Date('2026-10-25T07:00:00+05:30');

interface WeddingEvent {
  name: string;
  date: string;
  time: string;
  venue: string;
  mapsUrl: string;
  embedQuery: string;
  note: string;
  icon: string;
}

const events: WeddingEvent[] = [
  {
    name: 'Muhurtham',
    date: '25 October 2026',
    time: '7:00 AM – 8:00 AM',
    venue: 'Sri Bhoga Nandishwara Gudi, SH 74, Nandi, Karnataka 562103',
    mapsUrl: 'https://maps.app.goo.gl/toSJhdCum6QGKUpm8?g_st=aw',
    embedQuery: 'Sri Bhoga Nandishwara Gudi, Nandi, Karnataka 562103',
    note: 'The auspicious muhurtham as two lives unite beneath temple blessings.',
    icon: '❧',
  },
  {
    name: 'Brunch',
    date: '25 October 2026',
    time: 'From 9:30 AM onwards',
    venue: 'Hotel Sri Sierra, 1552/110, OPP AGALAGURKI, GATE, BB Rd, Chikkaballapur, Karnataka 562103',
    mapsUrl: 'https://maps.app.goo.gl/xFXD2gJtwBJmu4Nt5?g_st=aw',
    embedQuery: 'Hotel Sri Sierra, 1552/110, OPP AGALAGURKI, GATE, BB Rd, Chikkaballapur, Karnataka 562103',
    note: 'Join us for a celebratory feast and joyous moments with family and friends.',
    icon: '✧',
  },
];

function Reveal({children, className=''}:{children:React.ReactNode,className?:string}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={reduce?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.75,ease:[.16,1,.3,1]}}>{children}</motion.div>
}

function Countdown(){
 const [now,setNow]=useState(Date.now());
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
 const diff=Math.max(0,WEDDING.getTime()-now);
 const values=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
 return <div className="countdown">{values.map((v,i)=><div className="count-unit" key={i}><div className="flip"><motion.span key={v} initial={{rotateX:-75,opacity:0}} animate={{rotateX:0,opacity:1}}>{String(v).padStart(2,'0')}</motion.span></div><small>{['days','hours','mins','secs'][i]}</small></div>)}</div>
}

function Bloom({onDone}:{onDone:()=>void}){
 const reduce=useReducedMotion(); const [open,setOpen]=useState(false);
 return <motion.div className={'welcome-card '+(open?'is-open':'')} animate={open&&!reduce?{scale:1.04,opacity:0}:{}} transition={{duration:.75,ease:[.16,1,.3,1]}}>
  <div className="welcome-names">
    <small>Together with our families</small>
    <h1>Sruthi <i>&</i> Chandan</h1>
    <p>invite you to celebrate their wedding</p>
    <span>25 · 10 · 2026</span>
  </div>
  <motion.button aria-label="Open Sruthi and Chandan's invitation" className="open-invite" onClick={()=>{setOpen(true);onDone()}} whileTap={{scale:.97}}>
   <span className="seal"><FlowerLotus size={25} weight="fill"/></span><b>Open our invitation</b><small>Tap to enter</small>
  </motion.button>
 </motion.div>
}

function addCalendar(eventIndex: number = 0){
 const selected = events[eventIndex] || events[0];
 const isMuhurtham = eventIndex === 0;
 const dtStart = isMuhurtham ? '20261025T013000Z' : '20261025T040000Z'; // 7 AM IST or 9:30 AM IST
 const dtEnd = isMuhurtham ? '20261025T023000Z' : '20261025T070000Z';   // 8 AM IST or 12:30 PM IST

 const body=[
   'BEGIN:VCALENDAR',
   'VERSION:2.0',
   'PRODID:-//Sruthi and Chandan//Wedding//EN',
   'BEGIN:VEVENT',
   `DTSTART:${dtStart}`,
   `DTEND:${dtEnd}`,
   `SUMMARY:Sruthi & Chandan — ${selected.name}`,
   `LOCATION:${selected.venue}`,
   `DESCRIPTION:${selected.note} | ${selected.name} (${selected.time})`,
   'END:VEVENT',
   'END:VCALENDAR'
 ].join('\r\n');

 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([body],{type:'text/calendar'}));
 a.download=`sruthi-chandan-${selected.name.toLowerCase().replace(/\s+/g,'-')}.ics`;
 a.click();
 URL.revokeObjectURL(a.href);
}

function ScratchDate(){
 const canvas=useRef<HTMLCanvasElement>(null); const [done,setDone]=useState(false); const drawing=useRef(false); const strokes=useRef(0);
 useEffect(()=>{
   const c=canvas.current;if(!c)return;
   const ratio=Math.min(devicePixelRatio,2);
   const rect=c.getBoundingClientRect();
   c.width=rect.width*ratio;
   c.height=rect.height*ratio;
   const x=c.getContext('2d')!;
   x.scale(ratio,ratio);
   const g=x.createLinearGradient(0,0,rect.width,rect.height);
   g.addColorStop(0,'#d7a94f');
   g.addColorStop(.5,'#f0d08a');
   g.addColorStop(1,'#a76d1c');
   x.fillStyle=g;
   x.fillRect(0,0,rect.width,rect.height);
   x.fillStyle='#633f1f';
   x.textAlign='center';
   x.font='11px Marcellus, serif';
   x.fillText('SCRATCH TO REVEAL OUR DATE',rect.width/2,rect.height/2-6);
   x.font='25px serif';
   x.fillText('❋',rect.width/2,rect.height/2+29);
 },[]);

 const scratch=(e:React.PointerEvent<HTMLCanvasElement>)=>{
   if(!drawing.current||done)return;
   const c=canvas.current!,r=c.getBoundingClientRect(),x=c.getContext('2d')!;
   x.globalCompositeOperation='destination-out';
   x.beginPath();
   x.arc(e.clientX-r.left,e.clientY-r.top,24,0,Math.PI*2);
   x.fill();
   if(++strokes.current>42){
     setDone(true);
     c.style.opacity='0';
     navigator.vibrate?.(35);
   }
 };

 return (
   <section className={'scratch-section '+(done?'revealed':'')}>
     <div className="float-field" aria-hidden="true">
       {Array.from({length:12},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}>❀</i>)}
     </div>
     <Reveal>
       <p className="script">Save our date</p>
       <h2>A day written in the stars</h2>
       <div className="scratch-card">
         <div className="date-reveal">
           <small>Sunday</small>
           <b>25</b>
           <span>October · 2026</span>
           <em>Nandi, Karnataka</em>
         </div>
         <canvas
           ref={canvas}
           onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);scratch(e)}}
           onPointerMove={scratch}
           onPointerUp={()=>drawing.current=false}
           onPointerCancel={()=>drawing.current=false}
         />
       </div>
       <p className="scratch-hint">{done?'We will see you there ♡':'Use your finger to uncover the date'}</p>
     </Reveal>
   </section>
 );
}

function App(){
 const [entered,setEntered]=useState(false);
 const [introPlaying,setIntroPlaying]=useState(false);
 const [activeVenue,setActiveVenue]=useState(0);
 const [isPlayingBgm,setIsPlayingBgm]=useState(false);

 const introVideo=useRef<HTMLVideoElement>(null);
 const ytPlayerRef=useRef<any>(null);
 const ytReady=useRef(false);

 const reduce=useReducedMotion();
 const {scrollYProgress}=useScroll();
 const leafY=useTransform(scrollYProgress,[0,1],[0,180]);
 const templeY=useTransform(scrollYProgress,[0,1],[0,95]);
 const page=useRef<HTMLElement>(null);

 // Initialize YouTube IFrame API for background music (starts at 53 seconds)
 useEffect(()=>{
   const onYouTubeIframeAPIReady = () => {
     try {
       ytPlayerRef.current = new (window as any).YT.Player('yt-bgm-container', {
         height: '1',
         width: '1',
         videoId: 'KBYSpR8N6pc',
         playerVars: {
           start: 53,
           autoplay: 0,
           controls: 0,
           disablekb: 1,
           fs: 0,
           loop: 1,
           playlist: 'KBYSpR8N6pc',
           playsinline: 1,
         },
         events: {
           onReady: () => {
             ytReady.current = true;
           },
           onStateChange: (event: any) => {
             if (event.data === (window as any).YT.PlayerState.PLAYING) {
               setIsPlayingBgm(true);
             } else if (event.data === (window as any).YT.PlayerState.PAUSED || event.data === (window as any).YT.PlayerState.ENDED) {
               setIsPlayingBgm(false);
             }
           }
         }
       });
     } catch (err) {
       console.warn('YouTube Player initialization:', err);
     }
   };

   if ((window as any).YT && (window as any).YT.Player) {
     onYouTubeIframeAPIReady();
   } else {
     (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
     if (!document.getElementById('yt-iframe-script')) {
       const tag = document.createElement('script');
       tag.id = 'yt-iframe-script';
       tag.src = 'https://www.youtube.com/iframe_api';
       const firstScriptTag = document.getElementsByTagName('script')[0];
       firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
     }
   }
 },[]);

 const playBgm = () => {
   if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
     try {
       ytPlayerRef.current.seekTo(53, true);
       ytPlayerRef.current.playVideo();
       setIsPlayingBgm(true);
     } catch (e) {
       console.warn(e);
     }
   }
 };

 const toggleBgm = () => {
   if (!ytPlayerRef.current || typeof ytPlayerRef.current.getPlayerState !== 'function') return;
   try {
     const state = ytPlayerRef.current.getPlayerState();
     if (state === 1) { // playing
       ytPlayerRef.current.pauseVideo();
       setIsPlayingBgm(false);
     } else {
       ytPlayerRef.current.playVideo();
       setIsPlayingBgm(true);
     }
   } catch (e) {
     console.warn(e);
   }
 };

 const handleOpenInvitation = () => {
   const v=introVideo.current;
   if(v){
     v.currentTime=0;
     setIntroPlaying(true);
     void v.play().catch(()=>setIntroPlaying(false));
   }
   playBgm();
 };

 const handleSkipIntro = () => {
   setEntered(true);
   playBgm();
 };

 useEffect(()=>{
   if(reduce||!entered||!page.current)return;
   gsap.registerPlugin(ScrollTrigger);
   const ctx=gsap.context(()=>{
    gsap.fromTo('.hero-copy>*',{opacity:0,y:30},{opacity:1,y:0,duration:1,stagger:.12,ease:'power3.out'});
    gsap.to('.hero-art',{scale:1.09,yPercent:7,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    gsap.utils.toArray<HTMLElement>('.event').forEach((el,i)=>gsap.fromTo(el,{opacity:0,x:i%2?-42:42,rotate:.5},{opacity:1,x:0,rotate:0,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',end:'top 58%',scrub:.8}}));
    gsap.fromTo('.ceremony-image img',{scale:1.18,yPercent:-5},{scale:1,yPercent:5,ease:'none',scrollTrigger:{trigger:'.ceremony-image',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.fromTo('.story-inner',{clipPath:'inset(0 50% 0 50%)',opacity:.4},{clipPath:'inset(0 0% 0 0%)',opacity:1,ease:'power2.out',scrollTrigger:{trigger:'.story',start:'top 80%',end:'center 55%',scrub:1}});
    gsap.to('.map i',{y:-10,repeat:-1,yoyo:true,duration:1.2,ease:'sine.inOut'});
    gsap.utils.toArray<HTMLElement>('.atmos-lantern').forEach((el,i)=>{const depth=Number(el.dataset.depth||.4);gsap.to(el,{yPercent:-90*depth,x:Math.sin(i)*18*depth,rotation:i%2?4:-4,ease:'none',scrollTrigger:{trigger:page.current,start:'top top',end:'bottom bottom',scrub:1.2+depth}});gsap.to(el.querySelector('.lantern-flame'),{scaleY:1.18,opacity:.72,repeat:-1,yoyo:true,duration:.7+i*.08,ease:'sine.inOut'})});
   },page);
   return()=>ctx.revert();
 },[entered,reduce]);

 const currentVenue = events[activeVenue];

 return <main ref={page}>
  {/* Hidden YouTube Audio Mount */}
  <div style={{position:'fixed',left:'-9999px',bottom:'-9999px',width:'1px',height:'1px',overflow:'hidden',opacity:0,pointerEvents:'none'}}>
    <div id="yt-bgm-container" />
  </div>

  {/* Floating BGM Play/Pause Button */}
  <button
    type="button"
    onClick={toggleBgm}
    className={'bgm-toggle '+(isPlayingBgm?'is-playing':'')}
    aria-label={isPlayingBgm ? 'Pause background music' : 'Play background music'}
    title="Chanakya (Sitar) — Rishab Sharma"
  >
    <span className="music-disc">
      <MusicNotes size={14} weight="fill" />
    </span>
    <span className="sound-wave">
      <span />
      <span />
      <span />
    </span>
    <span>{isPlayingBgm ? 'Music ON' : 'Play BGM'}</span>
  </button>

  <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>
  
  <div className="lantern-atmosphere" aria-hidden="true">{[
   {x:6,y:12,d:.22,s:.62,b:2.2},{x:89,y:20,d:.35,s:.78,b:1.4},{x:12,y:42,d:.7,s:1.05,b:.4},{x:93,y:55,d:.28,s:.58,b:2.6},{x:4,y:72,d:1,s:1.35,b:.2},{x:87,y:84,d:.62,s:.92,b:.8},{x:48,y:64,d:.18,s:.42,b:3.2}
  ].map((l,i)=><span key={i} className="atmos-lantern" data-depth={l.d} style={{left:`${l.x}%`,top:`${l.y}%`,'--scale':l.s,'--blur':`${l.b}px`,'--delay':`${-i*.6}s`} as React.CSSProperties}><i className="lantern-chain"/><i className="lantern-cap"/><i className="lantern-body"><b className="lantern-flame"/></i><i className="lantern-tail"/></span>)}</div>

  {!entered&&<div className={'welcome '+(introPlaying?'intro-playing':'')}>
    <video
      ref={introVideo}
      className="welcome-video"
      muted
      playsInline
      preload="auto"
      poster="https://media.invitestory.in/lantern-madurai/assets/entrance-first-frame.png"
      onEnded={()=>{setEntered(true);playBgm();}}
      aria-label="Sruthi and Chandan's illustrated wedding invitation opening"
    >
      <source src="https://media.invitestory.in/lantern-madurai/assets/aarav-ananya-opening.mp4" type="video/mp4"/>
    </video>
    <div className="welcome-shade"/>
    <div className="garland-edge"/>
    {!introPlaying&&<Bloom onDone={handleOpenInvitation}/>}
    {introPlaying&&<button className="skip-intro" onClick={handleSkipIntro}>Skip intro</button>}
  </div>}

  <section className="hero">
   <motion.img className="hero-art" src="https://media.invitestory.in/lantern-madurai/assets/invitation-reference.png" alt="Sruthi and Chandan before a sacred temple, framed by auspicious jasmine and lotus flowers" style={{y:reduce?0:templeY}} />
   <div className="hero-scrim"/>
   <motion.div className="hero-copy" initial={{opacity:0,y:24}} animate={{opacity:entered?1:0,y:entered?0:24}} transition={{delay:.15,duration:1}}>
    <p className="blessing">With the blessings of our families</p>
    <h1>Sruthi <span>&</span> Chandan</h1>
    <div className="date-rule"><i/>25 · 10 · 2026<i/></div>
    <p>Nandi &amp; Chikkaballapur, Karnataka</p>
   </motion.div>
   <motion.div className="leaf-float left" style={{y:reduce?0:leafY}}/><motion.div className="leaf-float right" style={{y:reduce?0:leafY}}/>
   <div className="scroll-cue"><ArrowDown size={20}/><span>Our celebration</span></div>
  </section>

  <section className="count-section">
    <Reveal>
      <p className="kicker">Until we say “I do”</p>
      <h2>Counting every heartbeat</h2>
      <Countdown/>
    </Reveal>
  </section>

  <ScratchDate/>

  <section className="story ornamental">
    <Reveal className="story-inner">
      <FlowerLotus size={34} weight="thin"/>
      <p className="script">A celebration of love</p>
      <h2>Two paths, one forever</h2>
      <p>
        Together with their families, <b>Sruthi Sathiya Sekar</b> and <b>Chandan Rao S</b> cordially invite you to share in the joy of their wedding. Join us as we begin this beautiful chapter surrounded by love, prayers, and cherished memories.
      </p>
      <div className="signature">Sruthi <i>&</i> Chandan</div>
    </Reveal>
  </section>

  <section className="ceremony-moment">
    <div className="floating-glass lotus-one">✿</div>
    <div className="floating-glass lotus-two">❀</div>
    <div className="floating-diya">◒</div>
    <div className="ceremony-image">
      <img src="https://media.invitestory.in/lantern-madurai/assets/haldi-mehendi.png" loading="lazy" alt="Sruthi and Chandan wedding celebration moment"/>
    </div>
    <Reveal className="ceremony-caption">
      <p className="script">Sacred Bonds &amp; Warm Festivities</p>
      <h2>Before forever begins</h2>
      <p>Under auspicious temple skies and amid the warmth of near and dear ones, we await your presence and heartfelt blessings.</p>
      <span>Explore our celebrations below</span>
    </Reveal>
  </section>

  <section className="events">
    <Reveal>
      <h2>Wedding festivities</h2>
      <p className="section-intro">Two cherished moments. One unforgettable celebration.</p>
    </Reveal>
    <div className="event-list">
      {events.map((e,i)=>(
        <Reveal className={'event '+(i===0?'featured':'')} key={e.name}>
          <div className="event-number">0{i+1}</div>
          <div>
            <span className="event-icon">{e.icon}</span>
            <h3>{e.name}</h3>
            <p>{e.note}</p>
            <dl>
              <div><dt>Date</dt><dd>{e.date}</dd></div>
              <div><dt>Time</dt><dd>{e.time}</dd></div>
              <div><dt>Venue</dt><dd>{e.venue}</dd></div>
            </dl>
            <div style={{marginTop:'16px',display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <a
                href={e.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="button primary"
                style={{minHeight:'42px',padding:'8px 16px',fontSize:'11px',textTransform:'uppercase',letterSpacing:'.1em'}}
              >
                <MapPin size={16}/> Directions
              </a>
              <button
                type="button"
                onClick={()=>addCalendar(i)}
                className="button secondary"
                style={{minHeight:'42px',padding:'8px 16px',fontSize:'11px',textTransform:'uppercase',letterSpacing:'.1em'}}
              >
                <CalendarBlank size={16}/> Add to Calendar
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>

  <section className="venue ornamental">
    <Reveal>
      <MapPin size={38} weight="thin"/>
      <p className="script">Find your way</p>
      <h2>Venues &amp; Locations</h2>

      {/* Switcher Tabs between Muhurtham & Brunch */}
      <div className="venue-tabs" role="tablist" aria-label="Wedding Venues">
        <button
          type="button"
          className={'venue-tab-btn '+(activeVenue===0?'active':'')}
          onClick={()=>setActiveVenue(0)}
        >
          01 · Muhurtham Venue
        </button>
        <button
          type="button"
          className={'venue-tab-btn '+(activeVenue===1?'active':'')}
          onClick={()=>setActiveVenue(1)}
        >
          02 · Brunch Venue
        </button>
      </div>

      <div className="venue-card-details">
        <span className="venue-timing-badge">{currentVenue.time}</span>
        <h3 style={{font:'26px Italiana,serif',margin:'6px 0 10px'}}>{currentVenue.name}</h3>
        <p className="venue-address">{currentVenue.venue}</p>
      </div>

      <div className="map google-map">
        <iframe
          key={currentVenue.name}
          title={`Google Map of ${currentVenue.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${encodeURIComponent(currentVenue.embedQuery)}&z=15&output=embed`}
        />
        <div className="map-overlay">
          <span><MapPin size={19} weight="fill"/>{currentVenue.name}</span>
          <b>{activeVenue === 0 ? 'Sri Bhoga Nandishwara Gudi' : 'Hotel Sri Sierra'}</b>
          <small>Pinch or drag to explore</small>
        </div>
      </div>

      <div className="actions">
        <a className="button primary" href={currentVenue.mapsUrl} target="_blank" rel="noreferrer">
          <MapPin size={19}/>Open in Google Maps
        </a>
        <button className="button secondary" onClick={()=>addCalendar(activeVenue)}>
          <CalendarBlank size={19}/>Add to Calendar
        </button>
      </div>
    </Reveal>
  </section>

  <footer>
    <img src="https://media.invitestory.in/lantern-madurai/assets/og-aarav-ananya.png" loading="lazy" alt="Sruthi and Chandan wedding illustration"/>
    <div className="footer-overlay"/>
    <Reveal className="footer-copy">
      <Sparkle size={27} weight="thin"/>
      <p>We cannot wait to celebrate with you</p>
      <h2>Sruthi <i>&</i> Chandan</h2>
      <span>25 October 2026 · Karnataka</span>
    </Reveal>
    <a
      href="https://www.instagram.com/invitestory.in/"
      target="_blank"
      rel="noreferrer"
      style={{
        position:'relative',
        zIndex:2,
        display:'block',
        marginTop:'16px',
        fontSize:'8px',
        textTransform:'uppercase',
        letterSpacing:'.18em',
        color:'rgba(255,242,214,.35)',
        textDecoration:'none',
        paddingBottom:'12px'
      }}
    >
      Follow @invitestory.in on Instagram
    </a>
  </footer>
 </main>
}

createRoot(document.getElementById('root')!).render(<App/>);
