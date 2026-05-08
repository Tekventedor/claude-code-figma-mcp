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
  pairing: { start: 210,  end: 570,  dur: 360 },  // 12s — terminal lands ~3.3s in, faster typing/streaming
  reveal:  { start: 570,  end: 735,  dur: 165 },  // 5.5s — Cover.jsx code reveal (cut another 0.5s, even faster streaming)
  cta:     { start: 735,  end: 1035, dur: 300 },  // 10s
};
const TOTAL_FRAMES = 1035;
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
    R('div',{style:{marginTop:'40px',fontSize:'30px',fontWeight:500,color:'#6B7280',letterSpacing:'0.3px',opacity:subP*(1-outP),transform:'translateY('+(10*(1-subP))+'px)'}},'Pull the design. Generate the code. Done.')
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
    R('div',{style:{marginTop:'36px',fontSize:'30px',color:'#6B7280',opacity:subP}},'The design canvas, plugged into Claude Code')
  );
}`;

/* ============================================================================
 * SCENE 3 — PairingScene (570f, 19s) — THE PAYOFF
 * Mirrors the actual screen recording: real Figma file with the Cover frame
 * selected (sidebar + canvas + inspector), then Claude Code terminal slides in
 * with the URL handoff and structured design-context return.
 *
 * Beats:
 *    0– 60  Figma window fades in; Cover selection ring + handles draw on
 *   60–120  Inspector populates (Position, Layout, Appearance, Fill)
 *  120–230  Hold on Cover-selected — narrator pill drifts in
 *  230–260  Claude Code terminal slides in from the right
 *  260–320  Prompt types in (figma URL + get_design_context)
 *  320–470  MCP call lands; structured return prints line-by-line
 *  470–544  Hold; pill fades; ✓ confirmation
 *  544–570  Scene fades out (last 26f)
 * ========================================================================== */
// Cover content shared between Pairing + Reveal scenes — mirrors the actual
// Figma file (Figma logo collage, "Figma Template / Data Visualization /
// Graphs / Charts Kit", 5 outlined feature pills, 9-cell chart collage).
// coverFrame(selOp) — when selOp > 0, child sub-frames also show darker-blue
// selection borders (Figma's "select parent → show children outlines" look).
const COVER_FRAME = `
  var palette=['#1A56DB','#22C55E','#F59E0B','#EF4444','#8B5CF6','#0084FF','#EC4899','#10B981','#F97316'];
  function _bars(s){var a=[];for(var i=0;i<5;i++){var h=4+((s*7+i*5)%14);a.push(R('div',{key:i,style:{width:'3px',height:h+'px',background:palette[(s+i)%palette.length]}}));}return R('div',{style:{display:'flex',alignItems:'flex-end',gap:'2px',height:'18px'}},a);}
  function _donut(s){var p=0.4+((s*7)%40)/100;var c=2*Math.PI*8;return R('svg',{width:24,height:24,viewBox:'0 0 24 24'},R('circle',{cx:12,cy:12,r:8,fill:'none',stroke:'#E5E7EB',strokeWidth:3}),R('circle',{cx:12,cy:12,r:8,fill:'none',stroke:palette[s%palette.length],strokeWidth:3,strokeDasharray:c,strokeDashoffset:c*(1-p),transform:'rotate(-90 12 12)',strokeLinecap:'round'}));}
  function _line(s){return R('svg',{width:30,height:18,viewBox:'0 0 30 18'},R('polyline',{points:'1,14 7,9 13,12 19,5 24,8 29,4',fill:'none',stroke:palette[s%palette.length],strokeWidth:2,strokeLinecap:'round'}));}
  function _area(s){var c=palette[s%palette.length];return R('svg',{width:30,height:18,viewBox:'0 0 30 18'},R('path',{d:'M1,16 L1,12 L8,8 L14,11 L19,5 L24,8 L29,4 L29,16 Z',fill:c,fillOpacity:0.25,stroke:c,strokeWidth:1.5,strokeLinejoin:'round'}));}
  function _scatter(s){var pts=[[3,12],[8,7],[12,10],[16,4],[20,8],[25,11],[28,6]];return R('svg',{width:30,height:18,viewBox:'0 0 30 18'},pts.map(function(p,i){return R('circle',{key:i,cx:p[0],cy:p[1],r:1.4,fill:palette[(s+i)%palette.length]});}));}
  function _hbar(s){var a=[];for(var i=0;i<4;i++){var w=8+((s*5+i*7)%18);a.push(R('div',{key:i,style:{height:'2px',width:w+'px',background:palette[(s+i)%palette.length],borderRadius:'1px'}}));}return R('div',{style:{display:'flex',flexDirection:'column',gap:'2px',justifyContent:'center'}},a);}
  function _metric(s){var nums=['+24%','$1.2k','98%','+9.3%','4.8★'];var labels=['GROWTH','REVENUE','UPTIME','YIELD','RATING'];var i=s%nums.length;return R('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1px'}},R('div',{style:{fontSize:'12px',fontWeight:800,color:palette[s%palette.length],lineHeight:1,fontFamily:'Inter,system-ui'}},nums[i]),R('div',{style:{fontSize:'5px',color:'#6B7280',fontWeight:700,letterSpacing:'0.06em'}},labels[i]));}
  function _calendar(s){var c=palette[s%palette.length];var cells=[];for(var i=0;i<28;i++){var op=0.15+((s*3+i*5)%5)/6;cells.push(R('div',{key:i,style:{width:'2.5px',height:'2.5px',background:c,opacity:op,borderRadius:'1px'}}));}return R('div',{style:{display:'grid',gridTemplateColumns:'repeat(7, 2.5px)',gridTemplateRows:'repeat(4, 2.5px)',gap:'1.5px'}},cells);}
  function _spark(s){var c=palette[s%palette.length];return R('svg',{width:32,height:14,viewBox:'0 0 32 14'},R('polyline',{points:'1,11 5,9 9,10 13,6 17,7 21,4 25,5 31,2',fill:'none',stroke:c,strokeWidth:1.5,strokeLinecap:'round'}),R('circle',{cx:31,cy:2,r:1.6,fill:c}));}
  function _flogo(scale){var sz=scale||1;return R('div',{style:{width:(30*sz)+'px',height:(45*sz)+'px',display:'grid',gridTemplateColumns:'1fr 1fr',gridTemplateRows:'1fr 1fr 1fr',gap:0}},R('div',{style:{background:'#F24E1E',borderTopLeftRadius:'50%'}}),R('div',{style:{background:'#A259FF',borderTopRightRadius:'50%'}}),R('div',{style:{background:'#FF7262'}}),R('div',{style:{background:'#1ABCFE',borderRadius:'50%'}}),R('div',{style:{background:'#0ACF83',borderBottomLeftRadius:'50%'}}),R('div',{style:{background:'transparent'}}));}
  function _fhLogo(){return R('svg',{width:34,height:28,viewBox:'0 0 275 223',fill:'none'},R('defs',null,R('linearGradient',{id:'fh_cover_g',x1:'0',y1:'0',x2:'275',y2:'223',gradientUnits:'userSpaceOnUse'},R('stop',{stopColor:'#0084FF'}),R('stop',{offset:'1',stopColor:'#1A56DB'}))),R('path',{d:'${FH_MARK_PATH}',fill:'url(#fh_cover_g)'}));}
  function coverFrame(selOp, vertOp){
    selOp = (selOp == null) ? 0 : selOp;
    var vertOpVal = (vertOp == null) ? 1 : vertOp;
    var dBlue = '#1A56DB';                       // darker blue for child frame borders
    function bdr(){ return selOp > 0.01 ? '1px solid '+dBlue : '1px solid transparent'; }
    function pillBdr(){ return selOp > 0.01 ? '1px solid '+dBlue : '1px solid #111928'; }
    function pillCol(){ return selOp > 0.5 ? dBlue : '#111928'; }
    function _ptag(t){return R('div',{style:{fontSize:'10px',fontWeight:600,color:pillCol(),padding:'3px 9px',border:pillBdr(),borderRadius:'4px',whiteSpace:'nowrap',background:'transparent'}},t);}
    // 9-cell mix: variety across charts plus a metric card, mini calendar/heatmap, and a sparkline
    var chartTypes=['bars','metric','line','area','calendar','donut','spark','hbar','scatter'];
    function _cell(i){
      var t=chartTypes[i]||'bars';
      var ch = t==='bars'?_bars(i+1)
             : t==='donut'?_donut(i+1)
             : t==='line'?_line(i+1)
             : t==='area'?_area(i+1)
             : t==='scatter'?_scatter(i+1)
             : t==='hbar'?_hbar(i+1)
             : t==='metric'?_metric(i+1)
             : t==='calendar'?_calendar(i+1)
             : t==='spark'?_spark(i+1)
             : _bars(i+1);
      return R('div',{key:i,style:{background:'#FFFFFF',border:bdr(),borderRadius:'2px',display:'flex',alignItems:'center',justifyContent:'center'}},ch);
    }
    // Single layout — elements absolutely positioned, lerping from horizontal
    // coords to vertical coords so they actually slide/fold into their new
    // positions instead of crossfading.
    var p = vertOpVal;
    var fontSub = Math.round(lerp(11, 12, p));
    var fontH1 = Math.round(lerp(18, 22, p));
    return R('div',{style:{position:'relative',width:'100%',height:'100%',background:'#F0F2FF',overflow:'hidden'}},
      // FH logo — stays top-left
      R('div',{key:'fh',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(14, 14, p)+'px',padding:'2px',border:bdr(),borderRadius:'2px'}}, _fhLogo()),
      // Subtitle
      R('div',{key:'sub',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(62, 66, p)+'px',fontSize:fontSub+'px',color:'#6B7280',fontWeight:500,padding:'1px 2px',border:bdr(),borderRadius:'2px',whiteSpace:'nowrap'}},'Subtitle'),
      // Example Title (h1 line 1)
      R('div',{key:'t1',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(82, 90, p)+'px',fontSize:fontH1+'px',fontWeight:800,color:'#111928',lineHeight:1.05,padding:'1px 2px',border:bdr(),borderRadius:'2px',whiteSpace:'nowrap'}},'Example Title'),
      // Demo Caption (h1 line 2)
      R('div',{key:'t2',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(104, 122, p)+'px',fontSize:fontH1+'px',fontWeight:800,color:'#111928',lineHeight:1.05,padding:'1px 2px',border:bdr(),borderRadius:'2px',whiteSpace:'nowrap'}},'Demo Caption'),
      // Pill row 1
      R('div',{key:'pr1',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(138, 158, p)+'px',display:'flex',gap:'5px',padding:'2px',border:bdr(),borderRadius:'2px'}}, _ptag('Tag'), _ptag('Item')),
      // Pill row 2
      R('div',{key:'pr2',style:{position:'absolute',left:lerp(14, 14, p)+'px',top:lerp(168, 190, p)+'px',display:'flex',gap:'5px',padding:'2px',border:bdr(),borderRadius:'2px'}}, _ptag('Label'), _ptag('Type'), _ptag('Variant')),
      // Chart grid — folds from right side (horizontal) to bottom (vertical)
      R('div',{key:'cg',style:{position:'absolute',left:lerp(260, 14, p)+'px',top:lerp(14, 224, p)+'px',width:lerp(206, 372, p)+'px',height:lerp(212, 282, p)+'px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gridTemplateRows:'1fr 1fr 1fr',gap:'4px',padding:'4px',border:bdr(),borderRadius:'2px',boxSizing:'border-box'}}, [0,1,2,3,4,5,6,7,8].map(_cell))
    );
  }
`;

const PairingScene = `function PairingScene(props){${HELPERS}
  var f=props.frame||0;
  var END=360;
  var sceneOut=easeIn(cl((f-(END-26))/26));
  var op=1-sceneOut;

  // Beat timing
  var figmaIn=ease(cl(f/26));
  var ringIn=ease(cl((f-44)/24));
  var ringPulse=Math.sin(cl((f-44)/80)*Math.PI)*0.35+0.65;
  var inspectorIn=ease(cl((f-60)/30));

  // Cover layout morph: starts horizontal, animates to vertical stacked
  var morphStart=72, morphDur=36;
  var morphP=easeInOut(cl((f-morphStart)/morphDur));
  var coverW=Math.round(lerp(480, 400, morphP));
  var coverH=Math.round(lerp(240, 520, morphP));

  // Right pane (Claude terminal) slides in early — another second sooner
  var termStart=100;
  var termIn=ease(cl((f-termStart)/22));

  // Prompt typing — much faster
  var promptCmd='figma get_design_context  figma.com/design/wx0yxVi8…/?node-id=201-66';
  var typeStart=termStart+22;
  var typeDur=26;
  var typedChars=Math.floor(cl((f-typeStart)/typeDur)*promptCmd.length);
  var promptTyped=promptCmd.slice(0,typedChars);
  var caretOn=f>=typeStart && (Math.floor((f-typeStart)/8))%2===0 && f<typeStart+typeDur+30;

  // Result lines — tighter ramp, tighter spacing
  function lineAt(d){return ease(cl((f-(termStart+d))/7));}
  var mcpCallP=lineAt(72);
  var rec1=lineAt(100);
  var rec2=lineAt(114);
  var rec3=lineAt(128);
  var rec4=lineAt(142);
  var rec5=lineAt(156);
  var doneP=lineAt(186);

  // Single narrator pill
  function pillOp(s,e){var inP=ease(cl((f-s)/12));var oP=easeIn(cl((f-(e-12))/12));return cl(inP-oP);}
  var pillP=pillOp(80,210);

  ${COVER_FRAME}

  return R('div',{style:{width:'100%',height:'100%',background:'#F3F4F6',fontFamily:'Inter,system-ui,sans-serif',position:'relative',overflow:'hidden',opacity:op}},

    // ─── LEFT — Figma window
    R('div',{style:{position:'absolute',left:'40px',top:'30px',width:'900px',height:'880px',background:'#FFFFFF',borderRadius:'10px',boxShadow:'0 24px 50px rgba(17,25,40,0.10)',overflow:'hidden',opacity:figmaIn,transform:'translateX('+(-30*(1-figmaIn))+'px)'}},
      // Browser chrome
      R('div',{style:{height:'34px',background:'#E8EAF0',borderBottom:'1px solid #D1D5DB',display:'flex',alignItems:'center',padding:'0 12px',gap:'10px'}},
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FF5F57'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FEBC2E'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#28C840'}}),
        R('div',{style:{marginLeft:'14px',padding:'4px 12px',background:'#FFFFFF',borderRadius:'4px',fontSize:'10px',color:'#6B7280',flex:1,maxWidth:'520px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}},'figma.com/design/wx0yxVi8…/Data-Visualization-Graphs-Charts-Kit?node-id=201-66')
      ),
      // Figma toolbar
      R('div',{style:{height:'42px',background:'#FFFFFF',borderBottom:'1px solid #F3F4F6',display:'flex',alignItems:'center',padding:'0 14px',justifyContent:'space-between'}},
        R('div',{style:{display:'flex',alignItems:'center',gap:'8px'}},
          R('div',{style:{transform:'scale(0.45)',transformOrigin:'left center',width:'14px',height:'20px',display:'inline-block'}}, _flogo(1)),
          R('div',{style:{fontSize:'12px',fontWeight:700,color:'#111928'}},'Data Visualization Graphs / Charts Kit'),
          R('div',{style:{fontSize:'10px',color:'#6B7280'}},'Drafts'),
          R('div',{style:{fontSize:'10px',fontWeight:600,color:'#374151',background:'#F3F4F6',padding:'2px 6px',borderRadius:'3px'}},'Free')
        ),
        R('div',{style:{display:'flex',alignItems:'center',gap:'12px'}},
          R('div',{style:{width:18,height:18,borderRadius:'50%',background:grad}}),
          R('div',{style:{fontSize:'11px',color:'#374151',fontWeight:600,borderBottom:'2px solid #0084FF',paddingBottom:'2px'}},'Design'),
          R('div',{style:{fontSize:'11px',color:'#9CA3AF'}},'Prototype'),
          R('div',{style:{fontSize:'11px',color:'#374151'}},'44%'),
          R('div',{style:{padding:'4px 12px',background:'#0084FF',color:'#FFFFFF',fontSize:'11px',fontWeight:600,borderRadius:'5px'}},'Share')
        )
      ),
      // Main row
      R('div',{style:{display:'flex',height:'calc(100% - 76px)'}},
        // Left rail
        R('div',{style:{width:'40px',background:'#FFFFFF',borderRight:'1px solid #F3F4F6',display:'flex',flexDirection:'column',alignItems:'center',padding:'12px 0',gap:'18px',fontSize:'8px',color:'#6B7280'}},
          R('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}, R('div',{style:{width:18,height:18,border:'1.5px solid #6B7280',borderRadius:'2px'}}), 'File'),
          R('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}, R('div',{style:{width:18,height:18,border:'1.5px solid #6B7280',borderRadius:'50%'}}), 'Assets'),
          R('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}, R('div',{style:{width:18,height:18,border:'1.5px solid #6B7280'}}), 'Variables')
        ),
        // Sidebar
        R('div',{style:{width:'175px',background:'#FFFFFF',borderRight:'1px solid #F3F4F6',padding:'12px 0',fontSize:'12px'}},
          R('div',{style:{padding:'0 14px 8px',fontSize:'10px',fontWeight:700,color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.04em'}},'Pages'),
          R('div',{style:{padding:'4px 14px',color:'#374151'}},'Welcome & Tutorial'),
          R('div',{style:{padding:'4px 14px',color:'#374151'}},'Data Viz Kit'),
          R('div',{style:{padding:'4px 14px',color:'#0084FF',fontWeight:600,background:'#EFF6FF'}},'Cover'),
          R('div',{style:{padding:'12px 14px 6px',fontSize:'10px',fontWeight:700,color:'#6B7280',textTransform:'uppercase',letterSpacing:'0.04em'}},'Layers'),
          R('div',{style:{padding:'4px 14px',color:'#0084FF',fontWeight:600,background:'#EFF6FF',display:'flex',alignItems:'center',gap:'5px'}}, R('span',{style:{fontFamily:'JetBrains Mono, monospace'}},'#'), 'Cover'),
          R('div',{style:{padding:'4px 14px 4px 30px',color:'#0084FF',fontWeight:600,fontSize:'11px',background:'#EFF6FF'}},'> Frame 210'),
          R('div',{style:{padding:'4px 14px 4px 30px',color:'#0084FF',fontWeight:600,fontSize:'11px',background:'#EFF6FF'}},'> Frame 11')
        ),
        // Canvas
        R('div',{style:{flex:1,background:'#F0F2FF',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}},
          R('div',{style:{position:'relative',width:coverW+'px',height:coverH+'px'}},
            // Cover label above frame
            R('div',{style:{position:'absolute',left:0,top:'-18px',fontSize:'10px',color:'#0084FF',fontWeight:600,opacity:ringIn}},'Cover'),
            // Selection ring
            R('div',{style:{position:'absolute',left:'-2px',top:'-2px',right:'-2px',bottom:'-2px',border:'2px solid #0084FF',opacity:ringIn,boxShadow:'0 0 0 1px rgba(0,132,255,'+(0.18*ringPulse)+')',pointerEvents:'none'}}),
            // Selection handles
            ['tl','tr','bl','br'].map(function(p){var s={position:'absolute',width:6,height:6,background:'#FFFFFF',border:'1.5px solid #0084FF',opacity:ringIn};if(p==='tl'){s.left=-5;s.top=-5;}else if(p==='tr'){s.right=-5;s.top=-5;}else if(p==='bl'){s.left=-5;s.bottom=-5;}else{s.right=-5;s.bottom=-5;}return R('div',{key:p,style:s});}),
            coverFrame(ringIn, morphP),
            // Dimension badge below
            R('div',{style:{position:'absolute',left:'50%',bottom:'-18px',transform:'translateX(-50%)',fontSize:'10px',color:'#6B7280',fontWeight:500,opacity:ringIn,fontFamily:'Inter,system-ui,sans-serif'}},'1920 × 960'),
            R('div',{style:{position:'absolute',left:'50%',bottom:'-36px',transform:'translateX(-50%)',fontSize:'9px',color:'#9CA3AF',fontStyle:'italic',opacity:ringIn,fontFamily:'Inter,system-ui,sans-serif',whiteSpace:'nowrap'}},'* illustrative example — not the actual frame contents')
          )
        ),
        // Inspector
        R('div',{style:{width:'180px',background:'#FFFFFF',borderLeft:'1px solid #F3F4F6',padding:'14px 12px',fontSize:'10px',opacity:inspectorIn}},
          R('div',{style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}},
            R('div',{style:{width:14,height:14,background:grad,borderRadius:'2px'}}),
            R('div',{style:{fontSize:'11px',color:'#374151',fontWeight:600}},'Frame'),
            R('div',{style:{marginLeft:'auto',fontSize:'12px',color:'#9CA3AF'}},'⋯')
          ),
          R('div',{style:{fontSize:'9px',color:'#6B7280',marginTop:'10px',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.04em',fontWeight:600}},'Position'),
          R('div',{style:{display:'flex',gap:'4px',marginBottom:'4px'}},
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'X 590'),
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'Y -728')
          ),
          R('div',{style:{fontSize:'9px',color:'#6B7280',marginTop:'10px',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.04em',fontWeight:600}},'Layout'),
          R('div',{style:{display:'flex',gap:'4px',marginBottom:'4px'}},
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'W 1920'),
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'H 960')
          ),
          R('div',{style:{fontSize:'9px',color:'#6B7280',marginTop:'10px',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.04em',fontWeight:600}},'Appearance'),
          R('div',{style:{display:'flex',gap:'4px',marginBottom:'4px'}},
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'100%'),
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'◯ 0')
          ),
          R('div',{style:{fontSize:'9px',color:'#6B7280',marginTop:'10px',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.04em',fontWeight:600}},'Fill'),
          R('div',{style:{display:'flex',alignItems:'center',gap:'4px'}},
            R('div',{style:{width:12,height:12,background:'#F0F2FF',border:'1px solid #E5E7EB',borderRadius:'2px'}}),
            R('div',{style:{flex:1,padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'F0F2FF'),
            R('div',{style:{padding:'4px 6px',background:'#F3F4F6',borderRadius:'3px',fontSize:'9px'}},'100')
          )
        )
      )
    ),

    // ─── RIGHT — Claude Code terminal
    termIn>0.005 ? R('div',{style:{position:'absolute',right:'40px',top:'30px',width:'900px',height:'880px',background:'#0F172A',borderRadius:'10px',boxShadow:'0 24px 50px rgba(17,25,40,0.18)',overflow:'hidden',opacity:termIn,transform:'translateX('+(40*(1-termIn))+'px)'}},
      R('div',{style:{height:'34px',background:'#1E293B',display:'flex',alignItems:'center',padding:'0 12px',gap:'10px'}},
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FF5F57'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FEBC2E'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#28C840'}}),
        R('div',{style:{marginLeft:'14px',fontSize:'12px',color:'#94A3B8'}},'claude  ·  Get design context from Figma')
      ),
      R('div',{style:{padding:'30px 36px',fontFamily:'JetBrains Mono,monospace',fontSize:'17px',lineHeight:1.55,color:'#E2E8F0'}},
        R('div',null,
          R('span',{style:{color:'#22C55E'}},'> '),
          R('span',{style:{color:'#E2E8F0'}},promptTyped),
          caretOn?R('span',{style:{display:'inline-block',width:9,height:18,background:'#E2E8F0',marginLeft:2,verticalAlign:'middle'}}):null
        ),
        mcpCallP>0.01?R('div',{style:{marginTop:24,opacity:mcpCallP}},
          R('span',{style:{color:'#94A3B8'}},'⏺ '),
          R('span',{style:{color:'#0084FF',fontWeight:700}},'figma'),
          R('span',{style:{color:'#94A3B8'}},'('),
          R('span',{style:{color:'#FBBF24'}},'get_design_context'),
          R('span',{style:{color:'#94A3B8'}},')')
        ):null,
        rec1>0.01?R('div',{style:{marginTop:14,opacity:rec1}}, R('span',{style:{color:'#64748B'}},'  ⎿  '), R('span',{style:{color:'#E2E8F0'}}, 'Frame ',R('span',{style:{color:'#22D3EE'}},'"Cover"'),'  (1920 × 960)')):null,
        rec2>0.01?R('div',{style:{opacity:rec2,color:'#94A3B8'}},'      Background  ',R('span',{style:{color:'#FBBF24'}},'#F0F2FF')):null,
        rec3>0.01?R('div',{style:{opacity:rec3,color:'#94A3B8'}},'      Heading  ·  Space Grotesk Bold 83px  ·  ',R('span',{style:{color:'#FBBF24'}},'#1A1362')):null,
        rec4>0.01?R('div',{style:{opacity:rec4,color:'#94A3B8'}},'      5 outlined feature pills  ·  9 chart cards (3 × 3)'):null,
        rec5>0.01?R('div',{style:{opacity:rec5,color:'#94A3B8'}},'      Variables · ',R('span',{style:{color:'#A78BFA'}},'palette/blue-700'),'  ·  ',R('span',{style:{color:'#A78BFA'}},'palette/gray-900')):null,
        doneP>0.01?R('div',{style:{opacity:doneP,color:'#22C55E',marginTop:10}},'      ✓ Design context ready — handing off to Claude'):null
      )
    ) : null,

    // ─── Single narrator pill
    pillP>0.005 ? R('div',{style:{position:'absolute',left:'50%',top:'935px',transform:'translateX(-50%) translateY('+(-8*(1-pillP))+'px)',opacity:pillP,background:'#FFFFFF',border:'1.5px solid #E5E7EB',borderRadius:'999px',padding:'10px 24px',fontSize:'18px',fontWeight:600,color:'#111928',boxShadow:'0 8px 22px rgba(17,25,40,0.12)',pointerEvents:'none',whiteSpace:'nowrap',zIndex:10}},'One URL.  One MCP call.  Real design data.') : null
  );
}`;

/* ============================================================================
 * SCENE 4 — RevealScene (420f, 14s) — CODE GENERATION REVEAL
 * Editor window with Cover.jsx streaming in line-by-line. Footer status bar
 * confirms "Cover.jsx · saved · 252 lines · Live at localhost:5173/".
 * Pairs with the existing claude-code-figma-mcp-generated-code.png screenshot.
 * ========================================================================== */
const RevealScene = `function RevealScene(props){${HELPERS}
  var f=props.frame||0;
  var END=165;
  var sceneIn=ease(cl(f/18));
  var sceneOut=easeIn(cl((f-(END-26))/26));
  var op=sceneIn-sceneOut;

  var editorIn=ease(cl(f/16));
  var titleIn=ease(cl((f-18)/14));
  var titleOut=easeIn(cl((f-88)/12));
  var checkIn=easeBack(cl((f-110)/12));

  // Cover.jsx — generated from the Figma frame (more substantive than before:
  // includes chart-asset URL constants pulled from MCP, more JSX detail)
  var codeLines=[
    {parts:[['#94A3B8','// Cover.jsx — generated from your Figma frame']], d:2},
    {parts:[['','']], d:4},
    {parts:[['#C084FC','import'],['#E2E8F0',' React '],['#C084FC','from'],['#FBBF24'," 'react'"],['#94A3B8',';']], d:6},
    {parts:[['#C084FC','import'],['#E2E8F0',' { '],['#22D3EE','FigmaLogo'],['#E2E8F0',' } '],['#C084FC','from'],['#FBBF24'," './FigmaLogo'"],['#94A3B8',';']], d:9},
    {parts:[['#C084FC','import'],['#E2E8F0',' { '],['#22D3EE','ChartCard'],['#E2E8F0',' } '],['#C084FC','from'],['#FBBF24'," './ChartCard'"],['#94A3B8',';']], d:12},
    {parts:[['','']], d:14},
    {parts:[['#C084FC','const'],['#E2E8F0',' featurePills '],['#94A3B8','= [']], d:17},
    {parts:[['#FBBF24',"  'Customizable', 'AutoLayout V4!', 'Graphs', 'Data', 'Styles'"]], d:21},
    {parts:[['#94A3B8','];']], d:25},
    {parts:[['','']], d:27},
    {parts:[['#C084FC','const'],['#E2E8F0',' chartCards '],['#94A3B8','= [']], d:30},
    {parts:[['#94A3B8','  { '],['#22D3EE','id'],['#94A3B8',": '"],['#FBBF24','bar-1'],['#94A3B8',"', "],['#22D3EE','src'],['#94A3B8',": '"],['#FBBF24','/assets/210daa94.png'],['#94A3B8',"', "],['#22D3EE','kind'],['#94A3B8',": '"],['#FBBF24','bars'],['#94A3B8',"' },"]], d:34},
    {parts:[['#94A3B8','  { '],['#22D3EE','id'],['#94A3B8',": '"],['#FBBF24','donut-1'],['#94A3B8',"', "],['#22D3EE','src'],['#94A3B8',": '"],['#FBBF24','/assets/bde24fc0.png'],['#94A3B8',"', "],['#22D3EE','kind'],['#94A3B8',": '"],['#FBBF24','donut'],['#94A3B8',"' },"]], d:38},
    {parts:[['#94A3B8','  { '],['#22D3EE','id'],['#94A3B8',": '"],['#FBBF24','line-1'],['#94A3B8',"', "],['#22D3EE','src'],['#94A3B8',": '"],['#FBBF24','/assets/b81b9224.png'],['#94A3B8',"', "],['#22D3EE','kind'],['#94A3B8',": '"],['#FBBF24','line'],['#94A3B8',"' },"]], d:42},
    {parts:[['#475569','  /* …6 more chart cards wired to MCP assets */']], d:46},
    {parts:[['#94A3B8','];']], d:50},
    {parts:[['','']], d:52},
    {parts:[['#C084FC','export function'],['#22D3EE',' Cover'],['#94A3B8','() {']], d:55},
    {parts:[['#E2E8F0','  '],['#C084FC','return'],['#94A3B8',' (']], d:59},
    {parts:[['#94A3B8','    <'],['#22D3EE','div'],['#E2E8F0',' '],['#FBBF24','className'],['#94A3B8','='],['#34D399','"bg-[#F0F2FF] min-h-screen p-12 grid grid-cols-2 gap-12"'],['#94A3B8','>']], d:63},
    {parts:[['#94A3B8','      <'],['#22D3EE','div'],['#E2E8F0',' '],['#FBBF24','className'],['#94A3B8','='],['#34D399','"flex flex-col gap-6"'],['#94A3B8','>']], d:67},
    {parts:[['#94A3B8','        <'],['#22D3EE','FigmaLogo'],['#94A3B8',' />']], d:71},
    {parts:[['#94A3B8','        <'],['#22D3EE','p'],['#E2E8F0',' '],['#FBBF24','className'],['#94A3B8','='],['#34D399','"text-sm text-gray-500"'],['#94A3B8','>'],['#E2E8F0','Figma Template'],['#94A3B8','</'],['#22D3EE','p'],['#94A3B8','>']], d:75},
    {parts:[['#94A3B8','        <'],['#22D3EE','h1'],['#E2E8F0',' '],['#FBBF24','className'],['#94A3B8','='],['#34D399','"text-7xl font-black text-[#1A1362]"'],['#94A3B8','>']], d:79},
    {parts:[['#E2E8F0','          Data Visualization Graphs / Charts Kit']], d:83},
    {parts:[['#94A3B8','        </'],['#22D3EE','h1'],['#94A3B8','>']], d:87},
    {parts:[['#94A3B8','        <'],['#22D3EE','Pills'],['#E2E8F0',' '],['#FBBF24','items'],['#94A3B8','={featurePills} />']], d:91},
    {parts:[['#94A3B8','      </'],['#22D3EE','div'],['#94A3B8','>']], d:95},
    {parts:[['#94A3B8','      <'],['#22D3EE','ChartGrid'],['#E2E8F0',' '],['#FBBF24','items'],['#94A3B8','={chartCards} />']], d:99},
    {parts:[['#94A3B8','    </'],['#22D3EE','div'],['#94A3B8','>']], d:103},
    {parts:[['#94A3B8','  );']], d:106},
    {parts:[['#94A3B8','}']], d:109},
  ];
  function lineOp(d){return ease(cl((f-d)/3));}

  return R('div',{style:{width:'100%',height:'100%',background:'#0B1220',fontFamily:'Inter,system-ui,sans-serif',position:'relative',opacity:op,padding:'40px',boxSizing:'border-box'}},

    // Editor window
    R('div',{style:{width:'100%',height:'940px',background:'#0F172A',borderRadius:'12px',overflow:'hidden',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',display:'flex',flexDirection:'column',opacity:editorIn,transform:'translateY('+(20*(1-editorIn))+'px)'}},

      // Title bar (window chrome)
      R('div',{style:{height:'40px',background:'#1E293B',display:'flex',alignItems:'center',padding:'0 14px',gap:'10px',flexShrink:0}},
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FF5F57'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#FEBC2E'}}),
        R('div',{style:{width:11,height:11,borderRadius:'50%',background:'#28C840'}}),
        R('div',{style:{marginLeft:'14px',fontSize:'13px',color:'#94A3B8',fontFamily:'JetBrains Mono, monospace'}}, 'figma-data-viz-cover  /  src/Cover.jsx')
      ),

      // Tab bar
      R('div',{style:{height:'36px',background:'#0F172A',display:'flex',alignItems:'flex-end',borderBottom:'1px solid #1E293B',flexShrink:0}},
        R('div',{style:{padding:'8px 18px',background:'#1A1F2E',color:'#E2E8F0',fontSize:'13px',display:'flex',alignItems:'center',gap:'8px',borderTop:'2px solid #0084FF',fontFamily:'JetBrains Mono, monospace'}},
          R('span',{style:{fontSize:'11px',color:'#FBBF24'}}, '⬢'),
          R('span',null, 'Cover.jsx'),
          R('span',{style:{color:'#64748B',marginLeft:'6px'}}, '×')
        )
      ),

      // Editor body — gutter + code
      R('div',{style:{flex:1,display:'flex',background:'#0F172A',overflow:'hidden'}},
        // Gutter (line numbers)
        R('div',{style:{width:'58px',background:'#0B1220',padding:'18px 0',fontFamily:'JetBrains Mono, monospace',fontSize:'13px',color:'#475569',display:'flex',flexDirection:'column',alignItems:'flex-end',paddingRight:'12px',lineHeight:'24px',flexShrink:0}},
          codeLines.map(function(L,i){var t=lineOp(L.d);return R('div',{key:'g'+i,style:{opacity:t}}, (i+1));})
        ),
        // Code body
        R('div',{style:{flex:1,padding:'18px 28px',fontFamily:'JetBrains Mono, monospace',fontSize:'13px',lineHeight:'24px',color:'#E2E8F0',overflow:'hidden'}},
          codeLines.map(function(L,i){
            var t=lineOp(L.d);
            if(t<0.005) return R('div',{key:'c'+i,style:{minHeight:'24px'}});
            return R('div',{key:'c'+i,style:{opacity:t,whiteSpace:'pre',minHeight:'24px'}},
              L.parts.map(function(p,j){if(!p[1]) return null;return R('span',{key:j,style:p[0]?{color:p[0]}:null}, p[1]);})
            );
          })
        )
      ),

      // Footer status bar (turns blue with green check once code is in)
      R('div',{style:{height:'36px',background:checkIn>0.05?'#0084FF':'#1E293B',display:'flex',alignItems:'center',padding:'0 18px',gap:'12px',fontSize:'13px',color:'#FFFFFF',fontFamily:'JetBrains Mono, monospace',flexShrink:0,transition:'background 0.3s'}},
        checkIn>0.05 ? R('span',{style:{fontWeight:700,opacity:checkIn,transform:'scale('+(0.6+0.4*checkIn)+')',display:'inline-block'}}, '✓') : R('span',{style:{color:'#64748B'}}, '·'),
        checkIn>0.05
          ? R('span',{style:{opacity:checkIn}}, 'Cover.jsx · saved · 252 lines')
          : R('span',{style:{color:'#94A3B8'}}, 'writing src/Cover.jsx…'),
        checkIn>0.05 ? R('span',{style:{marginLeft:'auto',opacity:checkIn,color:'rgba(255,255,255,0.85)'}}, 'Live at  ', R('span',{style:{fontWeight:700,color:'#FFFFFF'}}, 'localhost:5173/')) : null
      )
    ),

    // Title pill (top centre, fades out before code finishes)
    titleIn>0.005 && titleOut<0.99 ? R('div',{style:{position:'absolute',left:'50%',top:'10px',transform:'translateX(-50%) translateY('+(8*(1-titleIn))+'px)',opacity:cl(titleIn-titleOut),background:'#FFFFFF',border:'1.5px solid #E5E7EB',borderRadius:'999px',padding:'10px 24px',fontSize:'18px',fontWeight:600,color:'#111928',boxShadow:'0 8px 22px rgba(17,25,40,0.18)',pointerEvents:'none',whiteSpace:'nowrap',zIndex:10}}, 'From design  →  React component') : null
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
