// Builds template.json from inline React component source below.
// Each scene is one <type:"custom"> layer referencing a component here.
// Edit a component, re-run: `node build.mjs` — then Load template.json in Editor Playground.

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FPS = 30;

// 5 scenes, ~50s total = 1500 frames at 30fps.
// Inspired by mcp-in-action: bold typography, gradient highlights, paired
// Figma-canvas / Claude-Code panes with narrator pills, morph hand-offs, CTA.
const F = {
  hook:    { start: 0,    end: 120,  dur: 120 },  // 4s
  pivot:   { start: 120,  end: 210,  dur: 90  },  // 3s
  pairing: { start: 210,  end: 780,  dur: 570 },  // 19s
  reveal:  { start: 780,  end: 1200, dur: 420 },  // 14s
  cta:     { start: 1200, end: 1500, dur: 300 },  // 10s
};
const TOTAL_FRAMES = 1500;
const TOTAL_SECONDS = TOTAL_FRAMES / FPS;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — prepended to every inline component.
// ─────────────────────────────────────────────────────────────────────────────
const HELPERS = `var R=React.createElement;var cl=function(x){return Math.max(0,Math.min(1,x));};var ease=function(t){return 1-Math.pow(1-t,3);};var easeIn=function(t){return t*t*t;};var easeInOut=function(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};var easeBack=function(t){var c1=1.70158;var c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};var lerp=function(a,b,t){return a+(b-a)*t;};var grad='linear-gradient(90deg,#0084FF,#1A56DB)';`;

const FH_MARK_PATH = 'M36.369 175.282L24.2163 203.986C22.1071 208.969 23.073 214.948 27.1337 219.014C29.8048 221.688 33.3037 223.02 36.8027 223.02C40.3016 223.02 43.8006 221.688 46.4716 219.014L58.023 207.449L101.627 163.787C103.647 161.764 102.218 158.32 99.3599 158.32H74.5815C74.4336 158.32 74.2858 158.3 74.1281 158.3C48.0289 158.3 26.8578 136.8 27.3506 110.563C27.8335 84.9175 49.2905 64.6304 74.9067 64.6304H127.785C128.633 64.6304 129.451 64.295 130.052 63.6931L151.006 42.7153C153.027 40.6925 151.598 37.2488 148.739 37.2488H75.1531C34.0134 37.2488 -0.365082 70.9455 -0.000396729 112.131C0.236145 138.98 14.7839 162.454 36.3591 175.302L36.369 175.282ZM199.992 158.31C225.608 158.31 247.065 138.023 247.548 112.378C248.031 86.7331 226.87 64.6403 200.77 64.6403C200.613 64.6403 200.445 64.6206 200.287 64.6206H175.529C172.68 64.6206 171.251 61.167 173.262 59.1541L219.103 13.2615H219.093L228.121 4.20336C233.276 -0.957219 241.664 -1.50979 247.124 3.33504C251.707 7.39048 252.88 13.7154 250.662 18.945L238.51 47.639C260.105 60.4763 274.662 83.9505 274.909 110.799C275.273 151.985 240.895 185.692 199.755 185.692H126.159C123.31 185.692 121.881 182.238 123.892 180.225L144.846 159.248C145.447 158.646 146.266 158.31 147.113 158.31H200.002H199.992ZM186.617 87.1771C199.696 87.1771 210.301 97.7943 210.301 110.888C210.301 123.982 199.696 134.599 186.617 134.599C173.538 134.599 162.932 123.982 162.932 110.888C162.932 97.7943 173.538 87.1771 186.617 87.1771ZM89.829 87.1673C102.908 87.1673 113.513 97.7844 113.513 110.878C113.513 123.972 102.908 134.589 89.829 134.589C76.7498 134.589 66.1445 123.972 66.1445 110.878C66.1445 97.7844 76.7498 87.1673 89.829 87.1673Z';

/* ============================================================================
 * SCENE 1 — HookScene (120f, 4s)
 * "Claude Code reads Figma." headline with gradient on "Figma" + underline draw.
 * ========================================================================== */
const HookScene = `function HookScene(props){${HELPERS}
  var f=props.frame||0;
  var inP=ease(cl(f/18));
  var outP=easeIn(cl((f-100)/20));
  var opacity=inP-outP;
  var scale=0.96+0.04*inP;
  var underP=ease(cl((f-22)/22));
  var subP=ease(cl((f-30)/22));
  return R('div',{style:{width:'100%',height:'100%',background:'#FFFFFF',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}},
    R('div',{style:{opacity:opacity,transform:'scale('+scale+')',textAlign:'center',fontSize:'108px',fontWeight:800,color:'#111928',lineHeight:1.1,letterSpacing:'-2px',maxWidth:'1500px'}},
      'Claude Code reads ',
      R('span',{style:{position:'relative',display:'inline-block'}},
        R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Figma.'),
        R('span',{style:{position:'absolute',left:0,right:'8%',bottom:'-4px',height:'8px',borderRadius:'4px',background:grad,transform:'scaleX('+underP+')',transformOrigin:'left center',opacity:opacity}})
      )
    ),
    R('div',{style:{marginTop:'40px',fontSize:'30px',fontWeight:500,color:'#6B7280',letterSpacing:'0.3px',opacity:subP*(1-outP),transform:'translateY('+(10*(1-subP))+'px)'}},'Designs become components — straight from your terminal.')
  );
}`;

/* ============================================================================
 * SCENE 2 — PivotScene (90f, 3s)
 * Title card: "Figma MCP" — huge type, "MCP" in gradient.
 * ========================================================================== */
const PivotScene = `function PivotScene(props){${HELPERS}
  var f=props.frame||0;
  var pwP=ease(cl(f/26));
  var mcpP=ease(cl((f-14)/26));
  var subP=ease(cl((f-46)/22));
  var outP=easeIn(cl((f-72)/18));
  var opacity=1-outP;
  return R('div',{style:{width:'100%',height:'100%',background:'#FFFFFF',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',fontFamily:'Inter,system-ui,sans-serif',opacity:opacity}},
    R('div',{style:{display:'flex',alignItems:'baseline',gap:'28px',fontSize:'160px',fontWeight:800,letterSpacing:'-4px',lineHeight:1}},
      R('span',{style:{color:'#111928',opacity:pwP,transform:'translateY('+(20*(1-pwP))+'px)',display:'inline-block'}},'Figma'),
      R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',opacity:mcpP,transform:'translateY('+(20*(1-mcpP))+'px)',display:'inline-block'}},'MCP')
    ),
    R('div',{style:{marginTop:'36px',fontSize:'30px',color:'#6B7280',opacity:subP}},'the design canvas, plugged into Claude Code')
  );
}`;

/* ============================================================================
 * SCENE 3 — PairingScene (570f, 19s) — THE PAYOFF
 * Left: Figma canvas with selected frame.  Right: Claude Code → MCP → code.
 * Narrator pills point at specific elements at the right beats.
 * Internal beats:
 *    0– 30  fade in canvas + frame selection ring
 *   30– 70  pill: "Selects the frame"
 *   70–130  Claude pane fades in; MCP call line types in
 *  130–200  pill: "Reads layout, type, color"
 *  200–280  context tokens animate in (mini badges over the Figma frame)
 *  280–340  pill: "No vision. No screenshots."  — strong beat
 *  340–470  right pane MORPHS from terminal → code editor with React/Tailwind
 *  410–520  pill: "Real React. Real Tailwind."
 *  520–570  hold + fade out (last 26f)
 * ========================================================================== */
const PairingScene = `function PairingScene(props){${HELPERS}
  var f=props.frame||0;
  var END=570;
  var sceneOut=easeIn(cl((f-(END-26))/26));
  var op=1-sceneOut;

  // ── left canvas
  var canvasP=ease(cl(f/26));
  var ringP=ease(cl((f-22)/22));
  var ringPulse=Math.sin(cl((f-22)/40)*Math.PI)*0.5+0.5;

  // ── right pane (terminal → code editor morph at 340–410)
  var rightP=ease(cl((f-70)/26));
  var morphStart=340, morphDur=70;
  var morphP=easeInOut(cl((f-morphStart)/morphDur));
  var termInnerOp=1-ease(cl((f-morphStart)/40));
  var codeInnerOp=ease(cl((f-(morphStart+30))/40));
  // Right pane background lerps slate-900 → editor-near-black
  var bgR=Math.round(lerp(15, 24, morphP));
  var bgG=Math.round(lerp(23, 28, morphP));
  var bgB=Math.round(lerp(42, 39, morphP));
  var rightBg='rgb('+bgR+','+bgG+','+bgB+')';

  // ── Claude pane content
  var promptCmd='claude → figma MCP';
  var l1Show=f>=80;
  var typeStart=92, typeDur=30;
  var typedChars=Math.floor(cl((f-typeStart)/typeDur)*promptCmd.length);
  var promptTyped=promptCmd.slice(0, typedChars);
  var caretOn=f>=typeStart && (Math.floor((f-typeStart)/9))%2===0 && f<160;

  function lineAt(d){return ease(cl((f-d)/12));}
  var mcpCallP=lineAt(140);
  var rec1=lineAt(195);
  var rec2=lineAt(220);
  var rec3=lineAt(245);
  var rec4=lineAt(270);
  var rec5=lineAt(295);

  // ── Figma context tokens (mini badges that float OUT of the canvas at the right beat)
  function tokenP(d){return ease(cl((f-d)/16));}
  var tk={
    layout: tokenP(200),
    type:   tokenP(220),
    color:  tokenP(240),
    vars:   tokenP(260),
    comp:   tokenP(280),
  };

  // ── code editor lines (right pane after morph)
  var codeStart=morphStart+30;
  function codeAt(d){return ease(cl((f-(codeStart+d))/14));}
  var codeLines=[
    {pre:'export ', kw:'function', name:' ChartsCover() {',                     d:0  },
    {pre:'  ',     kw:'return',   name:' (',                                     d:8  },
    {pre:'    <',  kw:'div',      name:' className="min-h-screen bg-white">',    d:18 },
    {pre:'      <',kw:'p',        name:' className="text-sm font-bold text-blue-500 tracking-wider">DATA VISUALIZATION</p>', d:32 },
    {pre:'      <',kw:'h1',       name:' className="text-7xl font-extrabold text-slate-900">',  d:48 },
    {pre:'        Graphs & Charts <',kw:'span',name:' className="bg-gradient-to-r from-sky-500 to-blue-700 bg-clip-text text-transparent">Kit</span>',  d:68 },
    {pre:'      </',kw:'h1',       name:'>',                                      d:90 },
    {pre:'      <',kw:'div',       name:' className="grid grid-cols-3 gap-4">',   d:106},
    {pre:'        {cards.map(c => <',kw:'ChartCard', name:' key={c.id} {...c} />)}', d:122},
    {pre:'      </',kw:'div',       name:'>',                                     d:140},
    {pre:'    </', kw:'div',       name:'>',                                      d:154},
    {pre:'  );',  kw:'',          name:'',                                        d:166},
    {pre:'}',     kw:'',          name:'',                                        d:178},
  ];

  // ── Narrator pills (mcp-in-action pattern)
  function pillOp(s,e){
    var inP=ease(cl((f-s)/12));
    var oP=easeIn(cl((f-(e-12))/12));
    return cl(inP-oP);
  }
  var p1Op=pillOp(36,90);
  var p2Op=pillOp(140,210);
  var p3Op=pillOp(280,340);
  var p4Op=pillOp(420,510);

  function pill(text, cx, cy, tx, ty, opP){
    if(opP<0.005) return null;
    return R('div',{style:{position:'absolute',inset:0,opacity:opP,pointerEvents:'none'}},
      R('svg',{style:{position:'absolute',left:0,top:0},width:1920,height:1080},
        R('line',{x1:cx,y1:cy,x2:tx,y2:ty,stroke:'#111928',strokeWidth:1.5,strokeLinecap:'round'}),
        R('circle',{cx:tx,cy:ty,r:5,fill:'#111928'})
      ),
      R('div',{style:{position:'absolute',left:cx,top:cy,transform:'translate(-50%,-50%)',background:'#FFFFFF',border:'1.5px solid #E5E7EB',borderRadius:'28px',padding:'14px 28px',fontSize:'22px',fontWeight:600,color:'#111928',whiteSpace:'nowrap',boxShadow:'0 8px 22px rgba(17,25,40,0.12)'}},text)
    );
  }

  // ── reusable: a single context token (small floating chip in canvas)
  function chip(label, x, y, color, opP){
    if(opP<0.005) return null;
    return R('div',{style:{position:'absolute',left:x+'px',top:y+'px',transform:'translate(-50%,-50%) translateY('+(10*(1-opP))+'px)',background:'#FFFFFF',border:'1.5px solid '+color,color:color,fontSize:'13px',fontWeight:700,padding:'6px 12px',borderRadius:'999px',boxShadow:'0 6px 14px rgba(17,25,40,0.10)',opacity:opP,letterSpacing:'0.04em',fontFamily:'JetBrains Mono, monospace',whiteSpace:'nowrap'}}, label);
  }

  // mini-charts for the Figma canvas
  var palette=['#0084FF','#1A56DB','#22C55E','#F59E0B','#EF4444','#8B5CF6'];
  function bars(seed){
    var arr=[]; for(var i=0;i<6;i++){ var h = 10 + ((seed*7+i*13) % 36); arr.push(R('div',{key:i,style:{width:'7px',height:h+'px',background:palette[(seed+i)%palette.length],borderRadius:'1px'}})); }
    return R('div',{style:{display:'flex',alignItems:'flex-end',gap:'3px',height:'46px'}},arr);
  }
  function donut(seed){
    var p=0.4+((seed*7)%40)/100; var c=2*Math.PI*16;
    return R('svg',{width:46,height:46,viewBox:'0 0 46 46'},
      R('circle',{cx:23,cy:23,r:16,fill:'none',stroke:'#E5E7EB',strokeWidth:5}),
      R('circle',{cx:23,cy:23,r:16,fill:'none',stroke:palette[seed%palette.length],strokeWidth:5,strokeDasharray:c,strokeDashoffset:c*(1-p),transform:'rotate(-90 23 23)',strokeLinecap:'round'})
    );
  }
  function card(i,kind,title){
    return R('div',{key:i,style:{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:'8px',padding:'10px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'78px'}},
      R('div',{style:{fontSize:'9px',fontWeight:700,color:'#6B7280',letterSpacing:'0.05em',textTransform:'uppercase'}},title),
      R('div',{style:{display:'flex',justifyContent:'center',alignItems:'flex-end'}}, kind===0?bars(i+2):donut(i+2))
    );
  }

  return R('div',{style:{width:'100%',height:'100%',background:'#F9FAFB',fontFamily:'Inter,system-ui,sans-serif',position:'relative',overflow:'hidden',opacity:op}},

    // ─── LEFT — Figma canvas
    R('div',{style:{position:'absolute',left:'60px',top:'90px',width:'880px',height:'880px',background:'#FFFFFF',borderRadius:'14px',boxShadow:'0 24px 50px rgba(17,25,40,0.10)',overflow:'hidden',opacity:canvasP,transform:'translateX('+(-30*(1-canvasP))+'px)'}},
      // Figma chrome
      R('div',{style:{height:'42px',background:'#F3F4F6',borderBottom:'1px solid #E5E7EB',display:'flex',alignItems:'center',padding:'0 14px',gap:'10px',fontSize:'13px',color:'#6B7280'}},
        R('div',{style:{display:'flex',gap:'6px'}},
          R('div',{style:{width:11,height:11,borderRadius:'2px',background:'#F24E1E'}}),
          R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FEBC2E'}}),
          R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#28C840'}})
        ),
        R('div',{style:{marginLeft:'14px'}},'Figma  ·  Data Visualization Kit')
      ),
      // canvas content (the cover frame)
      R('div',{style:{padding:'40px',height:'calc(100% - 42px)',boxSizing:'border-box',position:'relative'}},
        // selection ring around the frame
        R('div',{style:{position:'absolute',left:'24px',top:'24px',right:'24px',bottom:'24px',border:'2px solid #0084FF',borderRadius:'10px',opacity:ringP*(0.7+0.3*ringPulse),pointerEvents:'none'}}),
        // tiny "Charts Cover  1920×1080" caption above ring
        R('div',{style:{position:'absolute',left:'30px',top:'-2px',background:'#0084FF',color:'#FFFFFF',fontSize:'12px',fontWeight:700,padding:'3px 10px',borderRadius:'4px',opacity:ringP,fontFamily:'Inter'}},'Charts Cover  ·  1920 × 1080'),
        // frame body
        R('div',{style:{height:'100%',background:'#FFFFFF',borderRadius:'10px',padding:'40px',display:'flex',flexDirection:'column',gap:'24px',boxSizing:'border-box'}},
          R('div',{style:{fontSize:'14px',fontWeight:700,color:'#0084FF',letterSpacing:'0.12em'}},'DATA VISUALIZATION'),
          R('div',{style:{fontSize:'56px',fontWeight:800,lineHeight:1.05,color:'#111928'}},'Graphs & Charts ',R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Kit')),
          R('div',{style:{fontSize:'18px',color:'#6B7280',maxWidth:'500px'}},'Real layout. Real type. Real colors. Ready for code.'),
          R('div',{style:{display:'flex',gap:'8px'}},
            R('div',{style:{fontSize:'12px',fontWeight:600,color:'#0084FF',background:'#E0F2FE',padding:'5px 12px',borderRadius:'999px'}},'1920 × 1080'),
            R('div',{style:{fontSize:'12px',fontWeight:600,color:'#1A56DB',background:'#EFF6FF',padding:'5px 12px',borderRadius:'999px'}},'Auto-layout'),
            R('div',{style:{fontSize:'12px',fontWeight:600,color:'#6B7280',background:'#F3F4F6',padding:'5px 12px',borderRadius:'999px'}},'24 components')
          ),
          R('div',{style:{marginTop:'8px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',flex:'1 1 auto'}},
            card(0,0,'Revenue'),card(1,1,'Users'),card(2,0,'Conversion'),
            card(3,0,'MRR'),card(4,1,'Sessions'),card(5,0,'Retention')
          )
        ),
        // floating context chips (these emerge OUT of the frame as Claude reads them)
        chip('layout: vertical · gap 24',  280, 200, '#0084FF', tk.layout),
        chip('font: Inter 56 · 800',       620, 220, '#22C55E', tk.type),
        chip('--brand-500: #0084FF',       260, 480, '#A78BFA', tk.color),
        chip('--text-primary: #111928',    660, 480, '#A78BFA', tk.vars),
        chip('<ChartCard /> × 6',          440, 720, '#FBBF24', tk.comp)
      )
    ),

    // ─── RIGHT — Claude Code (terminal → code editor morph)
    R('div',{style:{position:'absolute',right:'60px',top:'90px',width:'920px',height:'880px',background:rightBg,borderRadius:'14px',boxShadow:'0 24px 50px rgba(17,25,40,0.18)',overflow:'hidden',opacity:rightP,transform:'translateX('+(30*(1-rightP))+'px)'}},
      // chrome
      R('div',{style:{height:'42px',background:morphP<0.5?'#1E293B':'#0F172A',display:'flex',alignItems:'center',padding:'0 14px',gap:'10px',transition:'background 0.2s'}},
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FF5F57'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FEBC2E'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#28C840'}}),
        R('div',{style:{marginLeft:'14px',fontSize:'13px',color:'#94A3B8',display:'flex',alignItems:'center',gap:'10px'}},
          morphP<0.5
            ? R('span',null,'claude  —  terminal')
            : R('span',null, R('span',{style:{color:'#94A3B8'}},'src/'), R('span',{style:{color:'#E2E8F0'}},'ChartsCover.tsx'))
        )
      ),

      // ─── TERMINAL VIEW (fades out during morph)
      termInnerOp>0.005 ? R('div',{style:{position:'absolute',top:'42px',left:0,right:0,bottom:0,padding:'30px 36px',fontFamily:'JetBrains Mono,monospace',fontSize:'19px',lineHeight:1.55,color:'#E2E8F0',opacity:termInnerOp}},
        l1Show?R('div',null,
          R('span',{style:{color:'#22C55E'}},'> '),
          R('span',{style:{color:'#E2E8F0'}},promptTyped),
          caretOn?R('span',{style:{display:'inline-block',width:'10px',height:'18px',background:'#E2E8F0',marginLeft:'2px',verticalAlign:'middle'}}):null
        ):null,

        mcpCallP>0.01?R('div',{style:{marginTop:'22px',opacity:mcpCallP}},
          R('span',{style:{color:'#94A3B8'}},'⏺ '),
          R('span',{style:{color:'#0084FF',fontWeight:700}},'figma'),
          R('span',{style:{color:'#94A3B8'}},'('),
          R('span',{style:{color:'#FBBF24'}},'get_design_context'),
          R('span',{style:{color:'#94A3B8'}},')')
        ):null,

        // structured returns (bullets)
        rec1>0.01?R('div',{style:{marginTop:'14px',opacity:rec1}}, R('span',{style:{color:'#64748B'}},'  ⎿  '), R('span',{style:{color:'#E2E8F0'}}, 'Frame ',R('span',{style:{color:'#22D3EE'}},'"Charts Cover"'),' (1920 × 1080)')):null,
        rec2>0.01?R('div',{style:{opacity:rec2,color:'#94A3B8'}},'      Auto-layout · vertical · gap 24 · padding 40'):null,
        rec3>0.01?R('div',{style:{opacity:rec3,color:'#94A3B8'}},'      Heading · Inter 56 · 800 · ',R('span',{style:{color:'#FBBF24'}},'#111928')):null,
        rec4>0.01?R('div',{style:{opacity:rec4,color:'#94A3B8'}},'      Variables · ',R('span',{style:{color:'#A78BFA'}},'--brand-500'),' · ',R('span',{style:{color:'#A78BFA'}},'--brand-700')):null,
        rec5>0.01?R('div',{style:{opacity:rec5,color:'#22C55E',marginTop:'10px'}},'      ✓ 96 layers · 18 variables · 4 components'):null
      ) : null,

      // ─── CODE EDITOR VIEW (fades in during morph)
      codeInnerOp>0.005 ? R('div',{style:{position:'absolute',top:'42px',left:0,right:0,bottom:0,display:'flex',opacity:codeInnerOp}},
        // gutter
        R('div',{style:{width:'56px',background:'#1A1F2E',padding:'24px 0',fontFamily:'JetBrains Mono, monospace',fontSize:'14px',color:'#475569',display:'flex',flexDirection:'column',alignItems:'flex-end',paddingRight:'12px',gap:'4px',lineHeight:'24px'}},
          codeLines.map(function(_,i){
            var t=ease(cl((f-(codeStart+codeLines[i].d))/14));
            return R('div',{key:'g'+i,style:{opacity:t}},(i+1));
          })
        ),
        // code body
        R('div',{style:{flex:1,padding:'24px 28px',fontFamily:'JetBrains Mono, monospace',fontSize:'15px',lineHeight:'24px',color:'#E2E8F0',overflow:'hidden'}},
          codeLines.map(function(L,i){
            var t=ease(cl((f-(codeStart+L.d))/16));
            if(t<0.01) return R('div',{key:'cb'+i,style:{minHeight:'24px'}});
            return R('div',{key:'cb'+i,style:{opacity:t,whiteSpace:'pre'}},
              R('span',{style:{color:'#94A3B8'}}, L.pre),
              L.kw?R('span',{style:{color:'#C084FC',fontWeight:600}}, L.kw):null,
              R('span',{style:{color:'#E2E8F0'}}, L.name)
            );
          })
        )
      ) : null
    ),

    // ─── Narrator pills (timed beats)
    pill('Selects the frame',           500, 80, 480, 110, p1Op),
    pill('Reads layout · type · color · variables', 960, 80, 720, 230, p2Op),
    pill('No vision. No screenshots.',   960, 1010, 960, 880, p3Op),
    pill('Real React. Real Tailwind.',   1420, 80, 1420, 200, p4Op)
  );
}`;

/* ============================================================================
 * SCENE 4 — RevealScene (420f, 14s)
 * Side-by-side: Figma original / running React component. "Pixel-perfect." stamp.
 * ========================================================================== */
const RevealScene = `function RevealScene(props){${HELPERS}
  var f=props.frame||0;
  var END=420;
  var sceneIn=ease(cl(f/26));
  var sceneOut=easeIn(cl((f-(END-26))/26));
  var op=sceneIn-sceneOut;

  var leftIn=ease(cl(f/30));
  var rightIn=ease(cl((f-15)/30));
  var stampIn=easeBack(cl((f-160)/26));
  var stampPulse=1+0.03*Math.sin(cl((f-200)/40)*Math.PI);

  var palette=['#0084FF','#1A56DB','#22C55E','#F59E0B','#EF4444','#8B5CF6'];
  function bars(s){
    var arr=[]; for(var i=0;i<6;i++){ var h=10+((s*7+i*13)%36); arr.push(R('div',{key:i,style:{width:'8px',height:h+'px',background:palette[(s+i)%palette.length],borderRadius:'1px'}})); }
    return R('div',{style:{display:'flex',alignItems:'flex-end',gap:'3px',height:'48px'}},arr);
  }
  function donut(s){
    var p=0.4+((s*7)%40)/100; var c=2*Math.PI*18;
    return R('svg',{width:50,height:50,viewBox:'0 0 50 50'},
      R('circle',{cx:25,cy:25,r:18,fill:'none',stroke:'#E5E7EB',strokeWidth:5}),
      R('circle',{cx:25,cy:25,r:18,fill:'none',stroke:palette[s%palette.length],strokeWidth:5,strokeDasharray:c,strokeDashoffset:c*(1-p),transform:'rotate(-90 25 25)',strokeLinecap:'round'})
    );
  }
  function card(i,kind,title){
    return R('div',{key:i,style:{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:'10px',padding:'14px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'92px'}},
      R('div',{style:{fontSize:'10px',fontWeight:700,color:'#6B7280',letterSpacing:'0.05em',textTransform:'uppercase'}},title),
      R('div',{style:{display:'flex',justifyContent:'center',alignItems:'flex-end'}}, kind===0?bars(i+1):donut(i+1))
    );
  }
  function preview(){
    return R('div',{style:{width:'100%',height:'100%',background:'#FFFFFF',padding:'30px',display:'flex',flexDirection:'column',gap:'16px',boxSizing:'border-box'}},
      R('div',null,
        R('div',{style:{fontSize:'12px',fontWeight:700,color:'#0084FF',letterSpacing:'0.12em'}},'DATA VISUALIZATION'),
        R('div',{style:{fontSize:'40px',fontWeight:800,lineHeight:1.05,color:'#111928',marginTop:'4px'}},'Graphs & Charts ',R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Kit'))
      ),
      R('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',flex:'1 1 auto'}},
        card(0,0,'Revenue'),card(1,1,'Users'),card(2,0,'Conversion'),
        card(3,0,'MRR'),card(4,1,'Sessions'),card(5,0,'Retention')
      )
    );
  }

  return R('div',{style:{width:'100%',height:'100%',background:'#F9FAFB',opacity:op,fontFamily:'Inter,system-ui,sans-serif',position:'relative'}},
    // LEFT — Figma
    R('div',{style:{position:'absolute',left:'70px',top:'120px',width:'860px',height:'820px',borderRadius:'16px',boxShadow:'0 24px 50px rgba(17,25,40,0.10)',background:'#FFFFFF',overflow:'hidden',border:'1px solid #E5E7EB',opacity:leftIn,transform:'translateX('+((1-leftIn)*-40)+'px)'}},
      R('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 22px',borderBottom:'1px solid #F3F4F6'}},
        R('div',{style:{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px',fontWeight:700,color:'#111928'}},
          R('span',{style:{display:'inline-block',width:'10px',height:'10px',borderRadius:'2px',background:'#F24E1E'}}),
          'Figma — design'
        ),
        R('div',{style:{fontSize:'12px',fontWeight:600,color:'#6B7280',background:'#F3F4F6',padding:'4px 10px',borderRadius:'999px'}},'1920 × 1080')
      ),
      R('div',{style:{height:'calc(100% - 50px)'}}, preview())
    ),
    // RIGHT — running component
    R('div',{style:{position:'absolute',right:'70px',top:'120px',width:'860px',height:'820px',borderRadius:'16px',boxShadow:'0 24px 50px rgba(17,25,40,0.10)',background:'#FFFFFF',overflow:'hidden',border:'1px solid #E5E7EB',opacity:rightIn,transform:'translateX('+((1-rightIn)*40)+'px)'}},
      R('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 22px',borderBottom:'1px solid #F3F4F6'}},
        R('div',{style:{display:'flex',alignItems:'center',gap:'8px',fontSize:'14px',fontWeight:700,color:'#111928'}},
          R('span',{style:{display:'inline-block',width:'10px',height:'10px',borderRadius:'50%',background:'#22C55E'}}),
          'localhost:5173'
        ),
        R('div',{style:{fontSize:'12px',fontWeight:600,color:'#1A56DB',background:'#EFF6FF',padding:'4px 10px',borderRadius:'999px'}},'React + Tailwind')
      ),
      R('div',{style:{height:'calc(100% - 50px)'}}, preview())
    ),
    // Stamp
    stampIn>0.02 ? R('div',{style:{position:'absolute',left:0,right:0,top:'50%',transform:'translateY(-50%) scale('+(0.9+0.1*stampIn)+') scale('+stampPulse+') rotate(-2deg)',textAlign:'center',opacity:cl(stampIn)}},
      R('div',{style:{display:'inline-block',background:'#FFFFFF',padding:'24px 48px',borderRadius:'14px',boxShadow:'0 30px 70px rgba(0,0,0,0.20)',border:'2px solid #111928'}},
        R('div',{style:{fontSize:'80px',fontWeight:900,color:'#111928',lineHeight:1,letterSpacing:'-0.02em'}},
          'Pixel-',
          R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'perfect.')
        ),
        R('div',{style:{marginTop:'12px',fontSize:'30px',fontWeight:600,color:'#6B7280',letterSpacing:'0.5px'}},'First try.')
      )
    ) : null
  );
}`;

/* ============================================================================
 * SCENE 5 — CTAScene (300f, 10s)
 * FlowHunt lockup + blog title + gradient pill button + URL.
 * ========================================================================== */
const CTAScene = `function CTAScene(props){${HELPERS}
  var f=props.frame||0;
  var logoP=ease(cl(f/20));
  var divP=ease(cl((f-22)/16));
  var titleP=ease(cl((f-38)/22));
  var btnP=ease(cl((f-66)/22));
  var urlP=ease(cl((f-100)/24));
  var arrowNudge=Math.sin(cl((f-90)/40)*Math.PI*2)*3;
  var outP=easeIn(cl((f-(300-26))/26));
  var op=1-outP;
  return R('div',{style:{width:'100%',height:'100%',background:'#FFFFFF',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif',opacity:op}},
    R('div',{style:{opacity:logoP,transform:'translateY('+(12*(1-logoP))+'px)',display:'flex',alignItems:'center',justifyContent:'center',gap:'18px',fontSize:'64px',fontWeight:800,letterSpacing:'-1px',lineHeight:1}},
      R('svg',{width:'66',height:'53',viewBox:'0 0 275 223',fill:'none',xmlns:'http://www.w3.org/2000/svg',style:{flexShrink:0,display:'block'}},
        R('defs',null,R('linearGradient',{id:'fh_cta_grad',x1:'0',y1:'0',x2:'275',y2:'223',gradientUnits:'userSpaceOnUse'},R('stop',{stopColor:'#0084FF'}),R('stop',{offset:'1',stopColor:'#1A56DB'}))),
        R('path',{d:'${FH_MARK_PATH}',fill:'url(#fh_cta_grad)'})
      ),
      R('div',{style:{display:'flex'}},
        R('span',{style:{color:'#111928'}},'Flow'),
        R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Hunt')
      )
    ),
    R('div',{style:{width:'200px',height:'1px',background:'#E5E7EB',marginTop:'32px',transform:'scaleX('+divP+')',transformOrigin:'center'}}),
    R('div',{style:{marginTop:'52px',textAlign:'center',opacity:titleP,transform:'translateY('+(12*(1-titleP))+'px)',maxWidth:'1500px'}},
      R('div',{style:{fontSize:'56px',fontWeight:800,color:'#111928',lineHeight:1.15,letterSpacing:'-1px'}},'How to Use Claude Code with ',R('span',{style:{background:grad,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}},'Figma MCP')),
      R('div',{style:{marginTop:'20px',fontSize:'26px',color:'#6B7280'}},'A complete setup guide')
    ),
    R('div',{style:{marginTop:'56px',width:'340px',height:'68px',borderRadius:'34px',background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:600,color:'#FFFFFF',opacity:btnP,transform:'scale('+(0.9+0.1*btnP)+')',boxShadow:'0 14px 30px rgba(0,132,255,0.35)'}},
      R('span',null,'Read the guide '),
      R('span',{style:{display:'inline-block',marginLeft:'8px',transform:'translateX('+arrowNudge+'px)'}},'→')
    ),
    R('div',{style:{marginTop:'48px',fontSize:'20px',fontWeight:500,color:'#6B7280',opacity:urlP}},'flowhunt.io/blog')
  );
}`;

/* ============================================================================
 * Watermark — small FlowHunt mark + wordmark, bottom of every scene.
 * ========================================================================== */
const Watermark = `function Watermark(props){var R=React.createElement;
  return R('div', { style:{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', opacity:0.55, fontFamily:'Inter,system-ui,sans-serif', fontWeight:700, fontSize:'18px' } },
    R('svg', { width:22, height:18, viewBox:'0 0 275 223' },
      R('defs', null,
        R('linearGradient', { id:'fh_mark_grad', x1:0, y1:0, x2:1, y2:1 },
          R('stop', { stopColor:'#0084FF' }),
          R('stop', { offset:'1', stopColor:'#1A56DB' })
        )
      ),
      R('path', { d:'${FH_MARK_PATH}', fill:'url(#fh_mark_grad)' })
    ),
    R('span', { style:{ color:'#111928' } }, 'Flow'),
    R('span', { style:{ background:'linear-gradient(90deg,#0084FF,#1A56DB)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } }, 'Hunt')
  );
}`;

// scene() — injects watermark as second layer.
function scene(id, range, componentName, transition = { type: 'fade', duration: 18 }) {
  return {
    id,
    startFrame: range.start,
    endFrame: range.end,
    backgroundColor: '#FFFFFF',
    transition,
    layers: [
      { id: `${id}-layer`,     type: 'custom', position: { x: 0, y: 0 },    size: { width: 1920, height: 1080 }, customComponent: { name: componentName, props: {} } },
      { id: `${id}-watermark`, type: 'custom', position: { x: 0, y: 1020 }, size: { width: 1920, height: 40 },   customComponent: { name: 'Watermark',    props: {} } },
    ],
  };
}

const template = {
  name: 'claude-code-figma-mcp',
  description: 'Motion-graphics promo for the FlowHunt blog "How to Use Claude Code with Figma MCP". Visual-first, mcp-in-action style.',
  version: '2.0.0',
  output: { type: 'video', width: 1920, height: 1080, fps: FPS, duration: TOTAL_SECONDS, backgroundColor: '#FFFFFF' },
  customComponents: {
    HookScene:    { type: 'inline', code: HookScene },
    PivotScene:   { type: 'inline', code: PivotScene },
    PairingScene: { type: 'inline', code: PairingScene },
    RevealScene:  { type: 'inline', code: RevealScene },
    CTAScene:     { type: 'inline', code: CTAScene },
    Watermark:    { type: 'inline', code: Watermark },
  },
  inputs: [],
  composition: {
    scenes: [
      scene('s1-hook',    F.hook,    'HookScene'),
      scene('s2-pivot',   F.pivot,   'PivotScene'),
      scene('s3-pairing', F.pairing, 'PairingScene'),
      scene('s4-reveal',  F.reveal,  'RevealScene'),
      scene('s5-cta',     F.cta,     'CTAScene', { type: 'fade', duration: 26 }),
    ],
  },
};

writeFileSync(join(__dirname, 'template.json'), JSON.stringify(template, null, 2));
console.log('template.json written (' + template.composition.scenes.length + ' scenes, ' + template.output.duration + 's, ' + TOTAL_FRAMES + ' frames)');
