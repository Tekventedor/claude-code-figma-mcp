import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const FPS = 30;

// Frame ranges per scene (contiguous, sum = 2850 = 95s @ 30fps)
const F = {
  hook:       { start: 0,    end: 240,  dur: 240 },  // 8s
  design:     { start: 240,  end: 600,  dur: 360 },  // 12s
  handoff:    { start: 600,  end: 900,  dur: 300 },  // 10s
  context:    { start: 900,  end: 1440, dur: 540 },  // 18s
  generation: { start: 1440, end: 2040, dur: 600 },  // 20s
  reveal:     { start: 2040, end: 2460, dur: 420 },  // 14s
  outro:      { start: 2460, end: 2850, dur: 390 },  // 13s
};
const TOTAL_FRAMES = 2850;
const TOTAL_SECONDS = TOTAL_FRAMES / FPS;

// Shared helpers prepended to every inline component.
const HELPERS = `var R=React.createElement;
var cl=function(x){return Math.max(0,Math.min(1,x));};
var ease=function(t){return 1-Math.pow(1-t,3);};
var easeIn=function(t){return t*t*t;};
var easeInOut=function(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
var easeBack=function(t){var c1=1.70158;var c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
var lerp=function(a,b,t){return a+(b-a)*t;};
var grad='linear-gradient(90deg,#0084FF,#1A56DB)';`;

/* ------------------------------------------------------------------------- */
/* SCENE 1 — Hook (240f, 8s)                                                 */
/* "A designer hands you a Figma file. / Used to mean an afternoon of        */
/*  pixel-pushing in code. / Not anymore."                                   */
/* ------------------------------------------------------------------------- */
const SceneHook = `function SceneHook(props){${HELPERS}
  var END=240;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/24));
  var sceneOut = easeIn(cl((f-(END-24))/24));
  var sceneOp  = sceneIn - sceneOut;

  var l1In = ease(cl((f-10)/22));
  var l2In = ease(cl((f-90)/22));
  var l3In = ease(cl((f-160)/18));
  var l3Pulse = 1 + 0.04 * Math.sin(cl((f-180)/40)*Math.PI);

  return R('div', { style:{ width:'100%', height:'100%', background:'#FFFFFF', opacity:sceneOp, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'24px', fontFamily:'Inter' } },
    R('div', { style:{ fontSize:'72px', fontWeight:600, color:'#111928', opacity:l1In, transform:'translateY('+(20*(1-l1In))+'px)' } }, 'A designer hands you a Figma file.'),
    R('div', { style:{ fontSize:'40px', fontWeight:400, color:'#6B7280', opacity:l2In, transform:'translateY('+(16*(1-l2In))+'px)' } }, 'Used to mean an afternoon of pixel-pushing in code.'),
    R('div', { style:{ fontSize:'88px', fontWeight:800, opacity:l3In, transform:'scale('+(0.94+0.06*l3In)+') scale('+l3Pulse+')', background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginTop:'24px' } }, 'Not anymore.')
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 2 — Open the design (360f, 12s)                                     */
/* Mock browser with Figma file: cover frame "Data Visualization Charts Kit" */
/* + chart card mosaic on the right.                                         */
/* ------------------------------------------------------------------------- */
const SceneDesign = `function SceneDesign(props){${HELPERS}
  var END=360;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/26));
  var sceneOut = easeIn(cl((f-(END-26))/26));
  var sceneOp  = sceneIn - sceneOut;

  var browserScale = 0.96 + 0.04 * ease(cl(f/34));

  // Stagger chart cards entry
  function cardOp(i){ return ease(cl((f - (40 + i*10)) / 22)); }
  function cardY(i){ return 14 * (1 - cardOp(i)); }

  var titleIn = ease(cl((f-30)/26));

  // Mini chart palette
  var palette = ['#0084FF','#1A56DB','#22C55E','#F59E0B','#EF4444','#8B5CF6'];

  function bars(seed){
    var arr=[];
    for(var i=0;i<7;i++){
      var h = 14 + ((seed*13 + i*29) % 60);
      arr.push(R('div', { key:i, style:{ width:'10px', height:h+'px', background:palette[(seed+i)%palette.length], borderRadius:'2px' } }));
    }
    return R('div', { style:{ display:'flex', alignItems:'flex-end', gap:'4px', height:'78px' } }, arr);
  }
  function line(seed){
    var pts='';
    for(var i=0;i<8;i++){
      var x = i*22;
      var y = 70 - ((seed*11 + i*17 + (i*i*5)) % 50);
      pts += (i?' L':'M') + x + ' ' + y;
    }
    return R('svg', { width:160, height:78, viewBox:'0 0 160 78' },
      R('path', { d:pts, fill:'none', stroke:palette[seed%palette.length], strokeWidth:2.5, strokeLinecap:'round' })
    );
  }
  function donut(seed){
    var p = 0.35 + ((seed*7)%50)/100;
    var c = 2*Math.PI*28;
    return R('svg', { width:80, height:78, viewBox:'0 0 80 78' },
      R('circle', { cx:40, cy:39, r:28, fill:'none', stroke:'#E5E7EB', strokeWidth:8 }),
      R('circle', { cx:40, cy:39, r:28, fill:'none', stroke:palette[seed%palette.length], strokeWidth:8, strokeDasharray:c, strokeDashoffset:c*(1-p), transform:'rotate(-90 40 39)', strokeLinecap:'round' })
    );
  }

  function card(i, kind, title){
    var op = cardOp(i);
    if (op < 0.005) return null;
    var content = kind===0 ? bars(i+1) : kind===1 ? line(i+1) : donut(i+1);
    return R('div', { key:i, style:{ background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'12px', padding:'16px', display:'flex', flexDirection:'column', justifyContent:'space-between', boxShadow:'0 4px 12px rgba(17,25,40,0.04)', opacity:op, transform:'translateY('+cardY(i)+'px)', minHeight:'140px' } },
      R('div', { style:{ fontSize:'13px', fontWeight:600, color:'#6B7280', letterSpacing:'0.04em', textTransform:'uppercase' } }, title),
      R('div', { style:{ display:'flex', justifyContent:'center', alignItems:'flex-end' } }, content)
    );
  }

  var cards = [
    card(0,0,'Revenue'),
    card(1,1,'Users'),
    card(2,2,'Conversion'),
    card(3,1,'MRR'),
    card(4,0,'Sessions'),
    card(5,2,'Retention'),
  ];

  return R('div', { style:{ width:'100%', height:'100%', background:'#F9FAFB', opacity:sceneOp, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter' } },
    R('div', { style:{ width:'1700px', background:'#FFFFFF', borderRadius:'14px', boxShadow:'0 30px 60px rgba(17,25,40,0.10)', overflow:'hidden', transform:'scale('+browserScale+')' } },
      // browser chrome
      R('div', { style:{ height:'42px', background:'#F3F4F6', display:'flex', alignItems:'center', padding:'0 16px', gap:'8px', borderBottom:'1px solid #E5E7EB' } },
        R('div', { style:{ width:12, height:12, borderRadius:'50%', background:'#FF5F57' } }),
        R('div', { style:{ width:12, height:12, borderRadius:'50%', background:'#FEBC2E' } }),
        R('div', { style:{ width:12, height:12, borderRadius:'50%', background:'#28C840' } }),
        R('div', { style:{ marginLeft:'24px', background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'8px', padding:'4px 14px', fontSize:'13px', color:'#6B7280', fontFamily:'Inter' } }, 'figma.com/design/abc123/Data-Visualization-Kit?node-id=1-234')
      ),
      // figma frame body
      R('div', { style:{ display:'flex', minHeight:'820px' } },
        // left: cover with title
        R('div', { style:{ flex:'0 0 720px', padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'18px', borderRight:'1px solid #F3F4F6' } },
          R('div', { style:{ fontSize:'14px', fontWeight:700, color:'#0084FF', letterSpacing:'0.12em', opacity:titleIn, transform:'translateX('+((1-titleIn)*-12)+'px)' } }, 'DATA VISUALIZATION'),
          R('div', { style:{ fontSize:'72px', fontWeight:800, lineHeight:1.05, color:'#111928', opacity:titleIn, transform:'translateX('+((1-titleIn)*-12)+'px)' } },
            'Graphs & Charts ',
            R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Kit')
          ),
          R('div', { style:{ fontSize:'22px', color:'#6B7280', maxWidth:'520px', opacity:ease(cl((f-50)/30)) } }, 'Real layout. Real type. Real colors. Ready for code.'),
          R('div', { style:{ display:'flex', gap:'10px', marginTop:'8px', opacity:ease(cl((f-70)/30)) } },
            R('div', { style:{ fontSize:'13px', fontWeight:600, color:'#0084FF', background:'#E0F2FE', padding:'6px 14px', borderRadius:'999px' } }, '1920 × 1080'),
            R('div', { style:{ fontSize:'13px', fontWeight:600, color:'#1A56DB', background:'#EFF6FF', padding:'6px 14px', borderRadius:'999px' } }, 'Auto-layout'),
            R('div', { style:{ fontSize:'13px', fontWeight:600, color:'#6B7280', background:'#F3F4F6', padding:'6px 14px', borderRadius:'999px' } }, '24 components')
          )
        ),
        // right: card mosaic
        R('div', { style:{ flex:'1 1 auto', padding:'48px', background:'#FAFBFC', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'18px', alignContent:'center' } }, cards)
      )
    )
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 3 — Hand the URL to Claude Code (300f, 10s)                          */
/* Split: Figma URL on left, Claude Code terminal on right with prompt typing */
/* ------------------------------------------------------------------------- */
const SceneHandoff = `function SceneHandoff(props){${HELPERS}
  var END=300;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/24));
  var sceneOut = easeIn(cl((f-(END-24))/24));
  var sceneOp  = sceneIn - sceneOut;

  // Left figma URL pill, right terminal — the URL "flies" across between t=70..150
  var flyP = easeInOut(cl((f-60)/60));
  var leftIn  = ease(cl(f/24));
  var rightIn = ease(cl((f-30)/26));

  // After flyP=1, type the prompt in terminal
  var typeStart = 130;
  var prompt = "I have figma MCP connected. Call get_design_context with this URL.";
  var typedChars = Math.floor(cl((f-typeStart)/100) * prompt.length);
  var typed = prompt.slice(0, typedChars);
  var caretOn = (f >= typeStart) && (Math.floor((f-typeStart)/12) % 2 === 0);

  // After typing, show MCP call line
  var mcpIn = ease(cl((f-240)/26));

  // URL traveling element
  var startX = 260, endX = 1180;
  var travelX = lerp(startX, endX, flyP);
  var travelY = lerp(360, 470, flyP);
  var travelOp = (flyP > 0.02 && flyP < 0.98) ? 1 : 0;

  return R('div', { style:{ width:'100%', height:'100%', background:'#F9FAFB', opacity:sceneOp, fontFamily:'Inter', position:'relative' } },
    // LEFT — Figma frame card with URL highlight
    R('div', { style:{ position:'absolute', left:'80px', top:'150px', width:'780px', background:'#FFFFFF', borderRadius:'14px', boxShadow:'0 24px 50px rgba(17,25,40,0.08)', overflow:'hidden', opacity:leftIn, transform:'translateY('+((1-leftIn)*16)+'px)' } },
      R('div', { style:{ height:'40px', background:'#F3F4F6', display:'flex', alignItems:'center', padding:'0 14px', gap:'6px', borderBottom:'1px solid #E5E7EB' } },
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FF5F57' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FEBC2E' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#28C840' } }),
        R('div', { style:{ marginLeft:'14px', fontSize:'13px', color:'#6B7280' } }, 'Figma — Data Visualization Kit')
      ),
      R('div', { style:{ padding:'40px 36px 32px 36px' } },
        R('div', { style:{ fontSize:'13px', fontWeight:700, color:'#0084FF', letterSpacing:'0.12em', marginBottom:'10px' } }, 'SELECTED FRAME'),
        R('div', { style:{ fontSize:'40px', fontWeight:800, color:'#111928', lineHeight:1.1, marginBottom:'24px' } },
          'Charts ',
          R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Cover')
        ),
        R('div', { style:{ background:'#F3F4F6', border:'1px solid #E5E7EB', borderRadius:'10px', padding:'14px 18px', fontSize:'15px', fontFamily:'JetBrains Mono, monospace', color:'#111928', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', boxShadow: f>50 && f<140 ? '0 0 0 3px rgba(0,132,255,'+(0.6*Math.sin(cl((f-50)/30)*Math.PI))+')' : 'none' } },
          R('span', { style:{ color:'#6B7280' } }, 'figma.com/design/abc123/'),
          R('span', { style:{ color:'#0084FF', fontWeight:700 } }, 'MyFile?node-id=1-234')
        )
      )
    ),

    // CENTER — flying URL bubble
    travelOp > 0.01 ? R('div', { style:{ position:'absolute', left:travelX+'px', top:travelY+'px', transform:'translate(-50%,-50%) scale('+(0.9+0.1*Math.sin(flyP*Math.PI))+')', background:grad, color:'#FFFFFF', padding:'10px 22px', borderRadius:'999px', fontSize:'15px', fontWeight:700, fontFamily:'JetBrains Mono, monospace', boxShadow:'0 12px 30px rgba(0,132,255,0.40)', opacity:travelOp } }, 'node-id=1-234') : null,

    // RIGHT — Claude Code terminal
    R('div', { style:{ position:'absolute', right:'80px', top:'150px', width:'860px', background:'#0F172A', borderRadius:'14px', boxShadow:'0 24px 50px rgba(17,25,40,0.18)', overflow:'hidden', opacity:rightIn, transform:'translateY('+((1-rightIn)*16)+'px)' } },
      R('div', { style:{ height:'40px', background:'#1E293B', display:'flex', alignItems:'center', padding:'0 14px', gap:'6px' } },
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FF5F57' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FEBC2E' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#28C840' } }),
        R('div', { style:{ marginLeft:'14px', fontSize:'13px', color:'#94A3B8', fontFamily:'Inter' } }, 'claude — terminal')
      ),
      R('div', { style:{ padding:'28px 30px', fontFamily:'JetBrains Mono, monospace', fontSize:'17px', lineHeight:1.6, color:'#E2E8F0', minHeight:'460px' } },
        R('div', { style:{ color:'#22C55E' } }, '$ claude'),
        R('div', { style:{ marginTop:'8px', color:'#94A3B8' } }, '╭─────────────────────────────────────────╮'),
        R('div', { style:{ color:'#94A3B8' } }, '│  ',R('span',{style:{color:'#E2E8F0'}},'Claude Code'),'  ·  ',R('span',{style:{color:'#0084FF'}},'figma'),' MCP connected      │'),
        R('div', { style:{ color:'#94A3B8' } }, '╰─────────────────────────────────────────╯'),
        R('div', { style:{ marginTop:'18px' } },
          R('span', { style:{ color:'#22C55E' } }, '> '),
          R('span', null, typed),
          caretOn ? R('span', { style:{ background:'#E2E8F0', color:'#0F172A', marginLeft:'1px' } }, '\\u2588') : null
        ),
        mcpIn > 0.01 ? R('div', { style:{ marginTop:'22px', opacity:mcpIn } },
          R('span', { style:{ color:'#94A3B8' } }, '⏺ '),
          R('span', { style:{ color:'#0084FF', fontWeight:700 } }, 'figma'),
          R('span', { style:{ color:'#94A3B8' } }, '('),
          R('span', { style:{ color:'#FBBF24' } }, 'get_design_context'),
          R('span', { style:{ color:'#94A3B8' } }, ')')
        ) : null,
        mcpIn > 0.4 ? R('div', { style:{ marginTop:'8px', color:'#64748B', fontSize:'15px', opacity:cl((mcpIn-0.4)/0.6) } }, '  ⎿  Reading frame, layers, variables…') : null
      )
    ),

    // BOTTOM caption
    R('div', { style:{ position:'absolute', left:0, right:0, bottom:'80px', textAlign:'center', fontSize:'34px', fontWeight:700, color:'#111928', opacity:ease(cl((f-200)/30)) } },
      'One prompt. One URL. One ',
      R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'MCP'),
      ' tool.'
    )
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 4 — Design context dump (540f, 18s)                                 */
/* Terminal scroll of structured design data, with sequenced callouts.       */
/* ------------------------------------------------------------------------- */
const SceneContext = `function SceneContext(props){${HELPERS}
  var END=540;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/26));
  var sceneOut = easeIn(cl((f-(END-26))/26));
  var sceneOp  = sceneIn - sceneOut;

  // Lines reveal in sequence (each line line-by-line typewriter)
  var lines = [
    { txt:'Frame "Charts Cover" (1920×1080)',                    color:'#E2E8F0', bold:true,  delay:0   },
    { txt:'  Auto-layout: vertical · gap 24 · padding 56',        color:'#94A3B8', delay:18  },
    { txt:'  Fill: var(--color-surface)',                          color:'#94A3B8', delay:36  },
    { txt:'  Border: 1px var(--color-border) · radius 14',         color:'#94A3B8', delay:54  },
    { txt:'  Children:',                                            color:'#94A3B8', delay:78  },
    { txt:'    Eyebrow "DATA VISUALIZATION" · weight 700 · 14px',  color:'#22C55E', delay:96  },
    { txt:'    Heading "Graphs & Charts Kit" · 72px · color text-primary', color:'#22C55E', delay:120 },
    { txt:'    Subheading 22px · color text-secondary',            color:'#22C55E', delay:144 },
    { txt:'    Component <Badge variant="info"> "1920 × 1080"',    color:'#FBBF24', delay:168 },
    { txt:'    Component <Badge variant="brand"> "Auto-layout"',   color:'#FBBF24', delay:188 },
    { txt:'    Component <Badge variant="muted"> "24 components"', color:'#FBBF24', delay:208 },
    { txt:'  Right region:',                                        color:'#94A3B8', delay:232 },
    { txt:'    Grid 3×2 · gap 18 · cards [Revenue, Users, …]',     color:'#0084FF', delay:252 },
    { txt:'    Card: padding 16 · radius 12 · border subtle',       color:'#0084FF', delay:272 },
    { txt:'    Chart: bar | line | donut · palette[6]',             color:'#0084FF', delay:292 },
    { txt:'  Variables:',                                           color:'#94A3B8', delay:316 },
    { txt:'    --brand-500: #0084FF · --brand-700: #1A56DB',        color:'#A78BFA', delay:336 },
    { txt:'    --text-primary: #111928 · --text-muted: #6B7280',    color:'#A78BFA', delay:356 },
    { txt:'',                                                       color:'#94A3B8', delay:380 },
    { txt:'✓ design context returned · 96 layers · 18 variables',   color:'#22C55E', bold:true, delay:404 },
  ];

  function renderLine(L,i){
    var t = cl((f - L.delay) / 14);
    if (t <= 0) return null;
    var chars = Math.floor(L.txt.length * ease(t));
    var shown = L.txt.slice(0, chars);
    return R('div', { key:i, style:{ color:L.color, fontWeight:L.bold?700:400, opacity:t<1?(0.5+0.5*t):1, minHeight:'1.6em' } }, shown);
  }

  // Callouts: appear over the terminal at the right times
  var callouts = [
    { label:'Layout',     start:96,  side:'right' },
    { label:'Typography', start:160, side:'right' },
    { label:'Colors',     start:336, side:'right' },
    { label:'Spacing',    start:36,  side:'left'  },
    { label:'Badges',     start:208, side:'left'  },
    { label:'Cards',      start:272, side:'left'  },
  ];
  function calloutEl(c, i){
    var t = ease(cl((f - c.start) / 18));
    if (t < 0.02) return null;
    var fade = 1 - cl((f - (c.start + 90)) / 24);
    var op = Math.max(0, Math.min(t, fade));
    if (op < 0.02) return null;
    var top = 140 + i*100;
    var common = { position:'absolute', top:top+'px', opacity:op, fontFamily:'Inter', fontWeight:700, fontSize:'22px', padding:'10px 22px', borderRadius:'999px', background:'#FFFFFF', color:'#111928', boxShadow:'0 8px 22px rgba(17,25,40,0.10)', border:'1.5px solid #E5E7EB' };
    if (c.side==='right') common.right = (60 + (1-t)*-20) + 'px';
    else                  common.left  = (60 + (1-t)*-20) + 'px';
    return R('div', { key:i, style:common },
      R('span', { style:{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:'#0084FF', marginRight:'10px', verticalAlign:'middle' } }),
      c.label
    );
  }

  return R('div', { style:{ width:'100%', height:'100%', background:'#0B1120', opacity:sceneOp, fontFamily:'Inter', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' } },
    R('div', { style:{ width:'1380px', background:'#0F172A', borderRadius:'14px', boxShadow:'0 30px 70px rgba(0,0,0,0.5)', overflow:'hidden', border:'1px solid #1E293B' } },
      R('div', { style:{ height:'42px', background:'#1E293B', display:'flex', alignItems:'center', padding:'0 14px', gap:'6px' } },
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FF5F57' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FEBC2E' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#28C840' } }),
        R('div', { style:{ marginLeft:'14px', fontSize:'13px', color:'#94A3B8' } }, 'figma MCP · get_design_context')
      ),
      R('div', { style:{ padding:'34px 44px', fontFamily:'JetBrains Mono, monospace', fontSize:'19px', lineHeight:1.55, color:'#E2E8F0', minHeight:'780px' } },
        lines.map(renderLine)
      )
    ),
    callouts.map(calloutEl)
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 5 — Generation (600f, 20s)                                          */
/* Write file → npm install → vite build → dev server boot.                  */
/* "React · Tailwind · Vite — scaffolded & built" pill banner.               */
/* ------------------------------------------------------------------------- */
const SceneGeneration = `function SceneGeneration(props){${HELPERS}
  var END=600;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/26));
  var sceneOut = easeIn(cl((f-(END-26))/26));
  var sceneOp  = sceneIn - sceneOut;

  // Sequence:
  //  0-120:  Write(src/Cover.jsx) progress count up to 252
  //  120-240: npm install lines
  //  240-360: vite build output
  //  360-480: dev server boot box
  //  420-end: pill banner pops in
  var writeT = cl(f/120);
  var writeLines = Math.floor(writeT * 252);

  var npmStart = 120;
  var npmLines = [
    'added 184 packages in 6.2s',
    '',
    '  3 packages are looking for funding',
  ];

  var viteStart = 240;
  var viteLines = [
    '> vite build',
    '',
    'vite v6.4.1 building for production…',
    '✓ 42 modules transformed.',
    'dist/index.html                    0.46 kB │ gzip:  0.31 kB',
    'dist/assets/index-7f3a.css        12.84 kB │ gzip:  3.12 kB',
    'dist/assets/index-c0a1.js         148.92 kB │ gzip: 48.71 kB',
    '✓ built in 1.42s',
  ];

  var devStart = 380;
  var devIn = ease(cl((f-devStart)/26));

  var pillStart = 420;
  var pillIn = easeBack(cl((f-pillStart)/30));

  function lineEl(text, color, delay, bold){
    var t = cl((f - delay) / 14);
    if (t <= 0) return null;
    var chars = Math.floor(text.length * ease(t));
    return R('div', { style:{ color:color, fontWeight:bold?700:400, opacity:t<1?(0.5+0.5*t):1, minHeight:'1.5em' } }, text.slice(0, chars));
  }

  return R('div', { style:{ width:'100%', height:'100%', background:'#0B1120', opacity:sceneOp, fontFamily:'Inter', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' } },
    R('div', { style:{ width:'1500px', background:'#0F172A', borderRadius:'14px', boxShadow:'0 30px 70px rgba(0,0,0,0.5)', overflow:'hidden', border:'1px solid #1E293B' } },
      R('div', { style:{ height:'42px', background:'#1E293B', display:'flex', alignItems:'center', padding:'0 14px', gap:'6px' } },
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FF5F57' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#FEBC2E' } }),
        R('div', { style:{ width:11, height:11, borderRadius:'50%', background:'#28C840' } }),
        R('div', { style:{ marginLeft:'14px', fontSize:'13px', color:'#94A3B8' } }, 'claude — generation')
      ),
      R('div', { style:{ padding:'34px 44px', fontFamily:'JetBrains Mono, monospace', fontSize:'18px', lineHeight:1.55, color:'#E2E8F0', minHeight:'780px' } },
        // Write step
        R('div', { style:{ color:'#94A3B8' } }, '⏺ ', R('span', { style:{ color:'#E2E8F0' } }, 'Write'), '(', R('span', { style:{ color:'#FBBF24' } }, 'src/Cover.jsx'), ')'),
        R('div', { style:{ color:'#22C55E', marginLeft:'18px' } }, '  ⎿  Wrote ', R('span', { style:{ fontWeight:700 } }, writeLines), ' lines'),

        // npm install
        f >= npmStart ? R('div', { style:{ marginTop:'18px' } },
          R('div', { style:{ color:'#94A3B8' } }, '$ ', R('span', { style:{ color:'#E2E8F0' } }, 'npm install')),
          npmLines.map(function(l,i){ return lineEl(l, '#94A3B8', npmStart + 16 + i*10, false); })
        ) : null,

        // vite build
        f >= viteStart ? R('div', { style:{ marginTop:'18px' } },
          R('div', { style:{ color:'#94A3B8' } }, '$ ', R('span', { style:{ color:'#E2E8F0' } }, 'npm run build')),
          viteLines.map(function(l,i){
            var color = l.indexOf('✓')===0 ? '#22C55E' : (l.indexOf('dist/')===0 ? '#A78BFA' : '#94A3B8');
            return lineEl(l, color, viteStart + 12 + i*8, l.indexOf('✓')===0);
          })
        ) : null,

        // dev server boot box
        devIn > 0.02 ? R('div', { style:{ marginTop:'24px', opacity:devIn, transform:'translateY('+((1-devIn)*8)+'px)' } },
          R('div', { style:{ display:'inline-block', background:'rgba(34,197,94,0.10)', border:'1px solid rgba(34,197,94,0.30)', borderRadius:'10px', padding:'14px 24px' } },
            R('div', { style:{ color:'#22C55E', fontWeight:700 } }, '  VITE v6.4.1  ready in 312 ms'),
            R('div', { style:{ marginTop:'6px' } }, R('span', { style:{ color:'#94A3B8' } }, '  ➜  Local:   '), R('span', { style:{ color:'#E2E8F0' } }, 'http://localhost:5173/'))
          )
        ) : null
      )
    ),

    // pill banner (top)
    pillIn > 0.02 ? R('div', { style:{ position:'absolute', top:'80px', left:'50%', transform:'translateX(-50%) scale('+(0.95+0.05*pillIn)+')', opacity:cl(pillIn), background:'#FFFFFF', borderRadius:'999px', padding:'14px 28px', display:'flex', alignItems:'center', gap:'14px', boxShadow:'0 14px 36px rgba(0,0,0,0.30)', fontFamily:'Inter', fontSize:'22px', fontWeight:700, color:'#111928' } },
      R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'React'),
      R('span', { style:{ color:'#CBD5E1' } }, '·'),
      R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Tailwind'),
      R('span', { style:{ color:'#CBD5E1' } }, '·'),
      R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Vite'),
      R('span', { style:{ color:'#6B7280', fontWeight:500, marginLeft:'6px' } }, '— scaffolded & built')
    ) : null
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 6 — Reveal (420f, 14s)                                              */
/* Side by side: Figma original / running React component.                   */
/* "Pixel-perfect. First try." overlay.                                       */
/* ------------------------------------------------------------------------- */
const SceneReveal = `function SceneReveal(props){${HELPERS}
  var END=420;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/26));
  var sceneOut = easeIn(cl((f-(END-26))/26));
  var sceneOp  = sceneIn - sceneOut;

  // Two cards slide in from sides
  var leftIn  = ease(cl(f/30));
  var rightIn = ease(cl((f-15)/30));

  // Big stamp: "Pixel-perfect. First try."
  var stampIn = easeBack(cl((f-160)/26));
  var stampPulse = 1 + 0.03 * Math.sin(cl((f-200)/40)*Math.PI);

  // Mini chart palette
  var palette = ['#0084FF','#1A56DB','#22C55E','#F59E0B','#EF4444','#8B5CF6'];

  // Tiny shared "Charts Cover" preview
  function preview(seed){
    function bars(s){
      var arr=[]; for(var i=0;i<6;i++){ var h = 8 + ((s*7 + i*13) % 32); arr.push(R('div',{key:i,style:{width:'6px',height:h+'px',background:palette[(s+i)%palette.length],borderRadius:'1px'}})); }
      return R('div',{style:{display:'flex',alignItems:'flex-end',gap:'2px',height:'40px'}},arr);
    }
    function donut(s){
      var p=0.4+((s*7)%40)/100; var c=2*Math.PI*16;
      return R('svg',{width:46,height:46,viewBox:'0 0 46 46'},
        R('circle',{cx:23,cy:23,r:16,fill:'none',stroke:'#E5E7EB',strokeWidth:5}),
        R('circle',{cx:23,cy:23,r:16,fill:'none',stroke:palette[s%palette.length],strokeWidth:5,strokeDasharray:c,strokeDashoffset:c*(1-p),transform:'rotate(-90 23 23)',strokeLinecap:'round'})
      );
    }
    function card(i,kind,title){
      return R('div',{key:i,style:{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:'8px',padding:'10px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'72px'}},
        R('div',{style:{fontSize:'9px',fontWeight:700,color:'#6B7280',letterSpacing:'0.05em',textTransform:'uppercase'}},title),
        R('div',{style:{display:'flex',justifyContent:'center',alignItems:'flex-end'}}, kind===0?bars(i+seed):donut(i+seed))
      );
    }
    return R('div',{style:{width:'100%',height:'100%',background:'#FFFFFF',padding:'24px',display:'flex',flexDirection:'column',gap:'14px'}},
      R('div',null,
        R('div',{style:{fontSize:'10px',fontWeight:700,color:'#0084FF',letterSpacing:'0.12em'}},'DATA VISUALIZATION'),
        R('div',{style:{fontSize:'30px',fontWeight:800,lineHeight:1.05,color:'#111928',marginTop:'4px'}},'Graphs & Charts ',R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Kit'))
      ),
      R('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',flex:'1 1 auto'}},
        card(0,0,'Revenue'),card(1,1,'Users'),card(2,0,'Conversion'),
        card(3,0,'MRR'),card(4,1,'Sessions'),card(5,0,'Retention')
      )
    );
  }

  return R('div', { style:{ width:'100%', height:'100%', background:'#F9FAFB', opacity:sceneOp, fontFamily:'Inter', position:'relative' } },
    // LEFT card — labelled "Figma"
    R('div', { style:{ position:'absolute', left:'70px', top:'120px', width:'860px', height:'820px', borderRadius:'16px', boxShadow:'0 24px 50px rgba(17,25,40,0.10)', background:'#FFFFFF', overflow:'hidden', border:'1px solid #E5E7EB', opacity:leftIn, transform:'translateX('+((1-leftIn)*-40)+'px)' } },
      R('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px', borderBottom:'1px solid #F3F4F6' } },
        R('div', { style:{ display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', fontWeight:700, color:'#111928' } },
          R('span', { style:{ display:'inline-block', width:'10px', height:'10px', borderRadius:'2px', background:'#F24E1E' } }),
          'Figma — design'
        ),
        R('div', { style:{ fontSize:'12px', fontWeight:600, color:'#6B7280', background:'#F3F4F6', padding:'4px 10px', borderRadius:'999px' } }, '1920 × 1080')
      ),
      R('div', { style:{ height:'calc(100% - 50px)' } }, preview(1))
    ),

    // RIGHT card — labelled "localhost:5173"
    R('div', { style:{ position:'absolute', right:'70px', top:'120px', width:'860px', height:'820px', borderRadius:'16px', boxShadow:'0 24px 50px rgba(17,25,40,0.10)', background:'#FFFFFF', overflow:'hidden', border:'1px solid #E5E7EB', opacity:rightIn, transform:'translateX('+((1-rightIn)*40)+'px)' } },
      R('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 22px', borderBottom:'1px solid #F3F4F6' } },
        R('div', { style:{ display:'flex', alignItems:'center', gap:'8px', fontSize:'14px', fontWeight:700, color:'#111928' } },
          R('span', { style:{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:'#22C55E' } }),
          'localhost:5173'
        ),
        R('div', { style:{ fontSize:'12px', fontWeight:600, color:'#1A56DB', background:'#EFF6FF', padding:'4px 10px', borderRadius:'999px' } }, 'React + Tailwind')
      ),
      R('div', { style:{ height:'calc(100% - 50px)' } }, preview(1))
    ),

    // Stamp overlay
    stampIn > 0.02 ? R('div', { style:{ position:'absolute', left:0, right:0, top:'50%', transform:'translateY(-50%) scale('+(0.9+0.1*stampIn)+') scale('+stampPulse+') rotate(-2deg)', textAlign:'center', opacity:cl(stampIn) } },
      R('div', { style:{ display:'inline-block', background:'#FFFFFF', padding:'24px 48px', borderRadius:'14px', boxShadow:'0 30px 70px rgba(0,0,0,0.20)', border:'2px solid #111928' } },
        R('div', { style:{ fontSize:'72px', fontWeight:900, color:'#111928', lineHeight:1, letterSpacing:'-0.02em' } },
          'Pixel-',
          R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'perfect.'),
          ' First try.'
        )
      )
    ) : null
  );
}`;

/* ------------------------------------------------------------------------- */
/* SCENE 7 — Outro / CTA (390f, 13s)                                         */
/* "Claude Code reads Figma." + "Try it on your next handoff." + URLs.       */
/* ------------------------------------------------------------------------- */
const SceneOutro = `function SceneOutro(props){${HELPERS}
  var END=390;
  var f=props.frame||0;
  var sceneIn  = ease(cl(f/30));
  var sceneOut = easeIn(cl((f-(END-30))/30));
  var sceneOp  = sceneIn - sceneOut;

  var l1In = ease(cl((f-20)/26));
  var l2In = ease(cl((f-110)/24));
  var l3In = ease(cl((f-200)/24));

  // Underline draws under "Figma"
  var underP = ease(cl((f-70)/30));

  return R('div', { style:{ width:'100%', height:'100%', background:'#FFFFFF', opacity:sceneOp, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'40px', fontFamily:'Inter' } },
    R('div', { style:{ fontSize:'120px', fontWeight:900, color:'#111928', lineHeight:1.05, letterSpacing:'-0.02em', textAlign:'center', opacity:l1In, transform:'translateY('+((1-l1In)*20)+'px)' } },
      'Claude Code reads ',
      R('span', { style:{ position:'relative', display:'inline-block' } },
        R('span', { style:{ background:grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Figma.'),
        R('span', { style:{ position:'absolute', left:0, right:0, bottom:'-4px', height:'10px', borderRadius:'5px', background:grad, transform:'scaleX('+underP+')', transformOrigin:'left center' } })
      )
    ),
    R('div', { style:{ fontSize:'42px', fontWeight:500, color:'#6B7280', opacity:l2In, transform:'translateY('+((1-l2In)*16)+'px)' } }, 'Try it on your next handoff.'),
    R('div', { style:{ display:'flex', gap:'40px', marginTop:'24px', fontSize:'24px', fontWeight:600, opacity:l3In, transform:'translateY('+((1-l3In)*12)+'px)' } },
      R('div', { style:{ display:'flex', alignItems:'center', gap:'10px', color:'#111928' } },
        R('span', { style:{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', background:'#0084FF' } }),
        'claude.ai/code'
      ),
      R('div', { style:{ display:'flex', alignItems:'center', gap:'10px', color:'#111928' } },
        R('span', { style:{ display:'inline-block', width:'10px', height:'10px', borderRadius:'2px', background:'#F24E1E' } }),
        'figma.com/mcp'
      )
    )
  );
}`;

/* ------------------------------------------------------------------------- */
/* Watermark                                                                  */
/* ------------------------------------------------------------------------- */
const Watermark = `function Watermark(props){var R=React.createElement;
  return R('div', { style:{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', opacity:0.7, fontFamily:'Inter', fontWeight:700, fontSize:'22px' } },
    R('span', { style:{ color:'#111928' } }, 'Flow'),
    R('span', { style:{ background:'linear-gradient(90deg,#0084FF,#1A56DB)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Hunt')
  );
}`;

/* ------------------------------------------------------------------------- */
/* scene() helper — injects watermark as second layer                        */
/* ------------------------------------------------------------------------- */
function scene(id, range, componentName, transition = { type: 'fade', duration: 18 }) {
  return {
    id,
    startFrame: range.start,
    endFrame: range.end,
    backgroundColor: '#FFFFFF',
    transition,
    layers: [
      { id: `${id}-layer`,     type: 'custom', position: { x: 0, y: 0 },    size: { width: 1920, height: 1080 }, customComponent: { name: componentName, props: {} } },
      { id: `${id}-watermark`, type: 'custom', position: { x: 0, y: 1010 }, size: { width: 1920, height: 50 },   customComponent: { name: 'Watermark',    props: {} } },
    ],
  };
}

const template = {
  name: 'claude-code-figma-mcp',
  description: 'Motion-graphics promo for the FlowHunt blog "How to Use Claude Code with Figma MCP".',
  version: '1.0.0',
  output: { type: 'video', width: 1920, height: 1080, fps: FPS, duration: TOTAL_SECONDS, backgroundColor: '#FFFFFF' },
  customComponents: {
    SceneHook:       { type: 'inline', code: SceneHook },
    SceneDesign:     { type: 'inline', code: SceneDesign },
    SceneHandoff:    { type: 'inline', code: SceneHandoff },
    SceneContext:    { type: 'inline', code: SceneContext },
    SceneGeneration: { type: 'inline', code: SceneGeneration },
    SceneReveal:     { type: 'inline', code: SceneReveal },
    SceneOutro:      { type: 'inline', code: SceneOutro },
    Watermark:       { type: 'inline', code: Watermark },
  },
  inputs: [],
  composition: {
    scenes: [
      scene('s1-hook',       F.hook,       'SceneHook'),
      scene('s2-design',     F.design,     'SceneDesign'),
      scene('s3-handoff',    F.handoff,    'SceneHandoff'),
      scene('s4-context',    F.context,    'SceneContext'),
      scene('s5-generation', F.generation, 'SceneGeneration'),
      scene('s6-reveal',     F.reveal,     'SceneReveal'),
      scene('s7-outro',      F.outro,      'SceneOutro', { type: 'fade', duration: 30 }),
    ],
  },
};

writeFileSync(join(__dirname, 'template.json'), JSON.stringify(template, null, 2));
console.log('template.json written (' + template.composition.scenes.length + ' scenes, ' + template.output.duration + 's, ' + TOTAL_FRAMES + ' frames)');
