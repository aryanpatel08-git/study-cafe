// @ts-nocheck
/* eslint-disable */
// Worker data and drawing code, ported from the design mockup. We'll add proper types later.
export const A=[
 {n:"Capybara",head:"#c8955f",belly:"#ecd2aa",muzzle:"#dcb283",ear:"round",ein:"#a9744a",apron:"#86a98a",nose:"wide"},
 {n:"Red panda",head:"#d9703a",belly:"#f6e7d3",muzzle:"#fbf0e1",ear:"round",ein:"#fbf0e1",apron:"#f1cf7a",tail:"ring",cheeks:"#fbf0e1",brow:"#fbf0e1"},
 {n:"Otter",head:"#9a7556",belly:"#ead9c0",muzzle:"#ead9c0",ear:"tiny",ein:"#7b5a40",apron:"#8fb5c9",whisk:1},
 {n:"Hedgehog",head:"#efd3b4",body:"#8a6a52",belly:"#fff0dc",muzzle:"#fff0dc",ear:"tiny",ein:"#f2b0a6",apron:"#d98c8c",spikes:"#6b5040",nose:"big"},
 {n:"Owl",head:"#b99a6c",belly:"#f1e2c3",muzzle:"#f5ead0",ear:"point",ein:"#9a7a50",apron:"#7aa6c2",disc:"#f5ead0",beak:"#eba43a"},
 {n:"Fox",head:"#e8803a",belly:"#fff3e3",muzzle:"#fff3e3",ear:"point",ein:"#3a2a26",apron:"#6f9a8d",tail:"fox",cheeks:"#fff3e3"},
 {n:"Bunny",head:"#f6f0e8",belly:"#fffaf3",muzzle:"#fffaf3",ear:"long",ein:"#f6b3bf",apron:"#e6a3a8",tail:"puff",teeth:1,nose:"pink"},
 {n:"Penguin",head:"#3a4056",belly:"#f7f3ea",muzzle:"#f7f3ea",ear:"none",apron:"#e07a5f",beak:"#f0a23c",face:"#f7f3ea",feet:"#f0a23c"},
 {n:"Cat",head:"#9a9aa8",belly:"#e5e2ea",muzzle:"#ece9f0",ear:"point",ein:"#f2b0bd",apron:"#f2c27c",tail:"cat",whisk:1,stripes:"#7c7c8a"},
 {n:"Frog",head:"#7ebc7a",belly:"#d8efc2",muzzle:"#d8efc2",ear:"frog",apron:"#f1cf7a",wide:1},
 {n:"Bear",head:"#8a5f45",belly:"#d7b08b",muzzle:"#d7b08b",ear:"round",ein:"#c99b78",apron:"#e8b44f"},
 {n:"Panda",head:"#f7f3ea",belly:"#f7f3ea",muzzle:"#f7f3ea",ear:"round",ein:"#2e2a2b",earc:"#2e2a2b",apron:"#a8d1b0",patch:"#2e2a2b",arm:"#2e2a2b",feet:"#2e2a2b"},
 {n:"Sloth",head:"#bda78a",belly:"#e9dcc2",muzzle:"#e9dcc2",ear:"tiny",ein:"#8a6f55",apron:"#b6c98f",patch:"#8a6f55",patchLight:1,wide:1},
 {n:"Duck",head:"#f7d95a",belly:"#fbe88a",muzzle:"#fbe88a",ear:"none",apron:"#7aa6c2",duck:1,feet:"#f08a3a"},
 {n:"Seal",head:"#a8b6c6",belly:"#e8eef4",muzzle:"#e8eef4",ear:"tiny",ein:"#8a98a8",apron:"#f0a3a3",whisk:1,nose:"seal"}
];
export const DARK="#2a1f1c";

export function ell(c,x,y,rx,ry,col,rot){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,rot||0,0,Math.PI*2);c.fill();}
export function tri(c,a,b,d,e,f,g,col){c.fillStyle=col;c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.lineTo(f,g);c.closePath();c.fill();}
export function rr(c,x,y,w,h,r,fill,stroke,lw){c.beginPath();c.roundRect?c.roundRect(x,y,w,h,r):c.rect(x,y,w,h);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||2;c.stroke();}}

/* lighten (t>0) or darken (t<0) a #hex colour */
export function shade(h,t){
  if(h.length===4)h="#"+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];
  var n=parseInt(h.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255,k=t<0?0:255,p=Math.abs(t);
  return "rgb("+Math.round(r+(k-r)*p)+","+Math.round(g+(k-g)*p)+","+Math.round(b+(k-b)*p)+")";
}

/* ---------- soft, hand-shaped blobs (no plain ellipses) ---------- */
/* closed smooth curve through the points */
function path(c,p){
  var n=p.length;c.beginPath();c.moveTo(p[0][0],p[0][1]);
  for(var i=0;i<n;i++){
    var p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];
    c.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);
  }
  c.closePath();
}
/* mirror the right half of a shape (listed top to bottom) to make a symmetric outline */
function sym(h){var l=[];for(var i=h.length-2;i>=1;i--)l.push([-h[i][0],h[i][1]]);return h.concat(l);}
function xf(p,x,y,sx,sy,rot){
  var cs=Math.cos(rot||0),sn=Math.sin(rot||0);
  return p.map(function(q){var a=q[0]*sx,b=q[1]*sy;return [x+a*cs-b*sn,y+a*sn+b*cs];});
}
/* fill a shape with a plush look: light top-left, darker rim, faint outline */
function blob(c,p,col,flat){
  var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  p.forEach(function(q){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);});
  var w=x1-x0,h=y1-y0,cx=(x0+x1)/2,cy=(y0+y1)/2;
  var g=c.createRadialGradient(cx-w*.17,cy-h*.26,Math.min(w,h)*.05,cx,cy,Math.max(w,h)*.62);
  g.addColorStop(0,shade(col,.24));g.addColorStop(.5,col);g.addColorStop(1,shade(col,-.2));
  path(c,p);c.fillStyle=g;c.fill();
  if(!flat){c.strokeStyle="rgba(80,50,38,.3)";c.lineWidth=1.5;c.stroke();}
}
/* shape library, all centred on 0,0 */
var HEAD=sym([[0,-36],[17,-35],[32,-28],[41,-13],[44.5,5],[40,21],[27,32],[12,37],[0,38]]);
var BODY=sym([[0,-26],[11,-25],[19,-17],[24,-3],[25,11],[19,22],[9,26],[0,26.5]]);
var LIMB=[[0,-13],[5.5,-10],[7.5,0],[6,9],[3,14],[0,15],[-3,14],[-6,9],[-7.5,0],[-5.5,-10]];
var FOOT=[[0,-7],[8,-6.5],[13,-2],[12,4],[6,7.5],[0,8],[-6,7.5],[-12,4],[-13,-2],[-8,-6.5]];
var EARP=[[-8,2],[-9,-12],[-2,-26],[6,-22],[10,-8],[8,2]];     /* rounded pointy ear */
var EARR=[[0,-12],[8,-10],[12,0],[8,10],[0,12],[-8,10],[-12,0],[-8,-10]]; /* round ear */
var TUFT=[[0,-9],[10,-6],[15,3],[8,11],[-5,10],[-10,0]];       /* cheek fluff */

/* soft blush that fades out at the edges */
function blush(c,x,y,rx,ry){
  c.save();c.translate(x,y);c.scale(1,ry/rx);
  var g=c.createRadialGradient(0,0,0,0,0,rx);
  g.addColorStop(0,"rgba(255,112,125,.55)");g.addColorStop(1,"rgba(255,112,125,0)");
  c.fillStyle=g;c.beginPath();c.arc(0,0,rx,0,Math.PI*2);c.fill();c.restore();
}
/* little fur flecks so the felt looks fuzzy; same pattern every frame */
function fleck(c,seed,n,rx,ry,col){
  var s=seed;c.fillStyle=col;
  for(var i=0;i<n;i++){
    s=(s*9301+49297)%233280;var u=s/233280;
    s=(s*9301+49297)%233280;var v=s/233280;
    var an=u*Math.PI*2,rad=Math.sqrt(v)*.9;
    c.beginPath();c.ellipse(Math.cos(an)*rad*rx,Math.sin(an)*ry*rad,1.3,.7,an,0,Math.PI*2);c.fill();
  }
}
function hash(str){var h=7;for(var i=0;i<str.length;i++)h=(h*31+str.charCodeAt(i))%100003;return h;}
/* tiny per-animal memory so the face can turn smoothly toward where it's walking */
var ST={};
function now(){return (typeof performance!=="undefined"?performance.now():Date.now())/1000;}
function pw(x,k){return Math.max(0,x)*Math.max(0,x)*k;}

/* feet at (0,0), front view, about 112 units tall.
   ph = walk phase (advances while moving). Idle motion (breathing, blinking, ear/tail flicks) runs off the clock. */
export function drawWorker(c,a,ph,moving,panic,blink,still,sleep){
  var sl=sleep||0;if(sl>.35)moving=false;
  var t=still?0:now();
  var seed=hash(a.n);
  var st=ST[a.n]||(ST[a.n]={fx:0,lt:t});
  var dt=Math.min(.1,Math.max(0,t-st.lt));st.lt=t;
  st.fx+=((moving&&!panic?1:0)-st.fx)*Math.min(1,dt*9);
  var fx=still||sl>.2?0:st.fx;

  var sw=moving?Math.sin(ph):0, co=moving?Math.cos(ph):0;
  var step=moving?Math.abs(Math.sin(ph)):0;
  var bob=moving?-step*(panic?8:3.6):0;
  var breathe=still?0:Math.sin(t*(2.2-sl*1.0)+seed)*(1+sl*2.2);
  var bodyCol=a.body||a.head,armCol=a.arm||bodyCol,feetCol=a.feet||bodyCol;
  var scarf=a.scarf||shade(a.apron,-.22);

  /* blink: quick, with a half-closed frame on each side; sometimes a double blink */
  var cyc=3.3+(seed%7)*.35,bp=(t+seed*.37)%cyc,close=0;
  if(!still&&!panic&&sl<.05){
    if(bp<.17)close=Math.sin(bp/.17*Math.PI);
    else if(seed%3===0&&bp>.3&&bp<.45)close=Math.sin((bp-.3)/.15*Math.PI);
  }
  close=Math.max(close,Math.min(1,sl*1.8));
  /* occasional ear flick */
  var flick=still?0:Math.max(0,Math.sin((t+seed)*.9))>.985?Math.sin(t*40)*.18:0;
  var wag=still?0:Math.sin(t*3.1+seed)*.5+(moving?Math.sin(ph-1)*.7:0);

  /* soft ground shadow (shrinks while the body is in the air) */
  c.save();c.scale(1-step*.08,.24);
  var sg=c.createRadialGradient(0,0,2,0,0,34);sg.addColorStop(0,"rgba(60,40,30,.32)");sg.addColorStop(1,"rgba(60,40,30,0)");
  c.globalAlpha=1-sl;c.fillStyle=sg;c.beginPath();c.arc(0,0,34,0,Math.PI*2);c.fill();c.restore();
  if(sl>0){c.save();c.translate(-46*sl,0);c.scale(1,.2);var lg2=c.createRadialGradient(0,0,4,0,0,70);lg2.addColorStop(0,"rgba(60,40,30,"+(.34*sl)+")");lg2.addColorStop(1,"rgba(60,40,30,0)");c.fillStyle=lg2;c.beginPath();c.arc(0,0,70,0,Math.PI*2);c.fill();c.restore();}

  /* whole-body squash & stretch and a little waddle lean, pivoting at the feet */
  c.save();
  if(sl>0){c.translate(0,-sl*26);c.rotate(-sl*Math.PI/2);}
  var sy=moving?.965+.075*step:1+breathe*.012, sxs=moving?1.03-.05*step:1-breathe*.006;
  c.rotate((moving?sw*.055:0)+(panic?Math.sin(ph*2)*.05:0));
  c.scale(sxs,sy);

  /* tail (swishes) */
  c.save();c.translate(0,bob);
  if(a.tail==="fox"){c.save();c.translate(-30,-22);c.rotate(wag*.18);blob(c,xf(sym([[0,-30],[9,-24],[14,-8],[12,8],[5,16],[0,17]]),0,0,1,1,.5),a.head);blob(c,xf(sym([[0,-30],[8,-26],[11,-16],[0,-12]]),0,0,1,1,.5),"#fff6ea",1);c.restore();}
  if(a.tail==="ring"){c.save();c.translate(-30,-22);c.rotate(wag*.15);var tp=xf(sym([[0,-30],[9,-24],[13,-6],[11,10],[5,18],[0,19]]),0,0,1,1,.55);blob(c,tp,a.head);c.save();path(c,tp);c.clip();c.rotate(.55);c.fillStyle="#7a3f22";[-17,-6,5].forEach(function(y){c.fillRect(-20,y,40,5);});c.restore();c.restore();}
  if(a.tail==="cat"){c.save();c.translate(-18,-14);c.rotate(wag*.16);c.strokeStyle=shade(a.head,-.14);c.lineWidth=9.5;c.lineCap="round";c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-30,0,-22,-38);c.stroke();c.strokeStyle=a.head;c.lineWidth=6.8;c.stroke();c.restore();}
  if(a.tail==="puff"){c.save();c.translate(-24,-14);c.rotate(wag*.2);blob(c,xf(EARR,0,0,.8,.8,0),"#ffffff");c.restore();}
  c.restore();

  /* feet: little beans that step, with a lift and a slide */
  var fl=-sw*4.5,fr=sw*4.5;
  c.save();c.translate(-12+fl,-6.5-pw(sw,6));blob(c,FOOT,feetCol);c.strokeStyle="rgba(80,50,38,.22)";c.lineWidth=1.2;c.beginPath();c.moveTo(-3,2);c.lineTo(-3,6.5);c.moveTo(3,2);c.lineTo(3,6.5);c.stroke();c.restore();
  c.save();c.translate(12+fr,-6.5-pw(-sw,6));blob(c,FOOT,feetCol);c.strokeStyle="rgba(80,50,38,.22)";c.lineWidth=1.2;c.beginPath();c.moveTo(-3,2);c.lineTo(-3,6.5);c.moveTo(3,2);c.lineTo(3,6.5);c.stroke();c.restore();

  c.save();c.translate(0,bob);
  /* body: pear-shaped, not a ball */
  c.save();c.translate(0,-28);blob(c,BODY,bodyCol);
  if(a.body){blob(c,xf(BODY,0,3,.62,.62,0),a.belly,1);}
  path(c,BODY);c.clip();fleck(c,seed,16,22,24,"rgba(255,255,255,.16)");c.restore();
  /* arms swing opposite to the feet; they fly up when panicking */
  var la=panic?-.9+Math.sin(ph*2)*.5:.28+co*.5*(moving?1:0)+breathe*.02, ra=panic?.9-Math.sin(ph*2+1)*.5:-.28-co*.5*(moving?1:0)-breathe*.02;
  la=la*(1-sl)+.14*sl;ra=ra*(1-sl)-.14*sl;
  var ly=panic?-56+Math.sin(ph*2)*5:-33, ry=panic?-56-Math.sin(ph*2+1)*5:-33;
  c.save();c.translate(-26,ly);c.rotate(la);blob(c,LIMB,armCol);c.restore();
  c.save();c.translate(26,ry);c.rotate(ra);blob(c,LIMB,armCol);c.restore();
  /* apron: bib, straps, pocket */
  c.fillStyle=a.apron;c.beginPath();c.moveTo(-13,-46);c.lineTo(13,-46);c.quadraticCurveTo(21,-24,16,-11);c.quadraticCurveTo(0,-5,-16,-11);c.quadraticCurveTo(-21,-24,-13,-46);c.fill();
  c.strokeStyle=shade(a.apron,-.22);c.lineWidth=1.4;c.stroke();
  c.strokeStyle=shade(a.apron,-.12);c.lineWidth=2.4;c.lineCap="round";
  c.beginPath();c.moveTo(-9,-45);c.lineTo(-13,-52);c.stroke();c.beginPath();c.moveTo(9,-45);c.lineTo(13,-52);c.stroke();
  rr(c,-8,-26,16,10,4,shade(a.apron,.28),shade(a.apron,-.2),1.2);
  c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1.3;c.setLineDash([2.5,2.5]);c.beginPath();c.moveTo(-6.5,-26);c.lineTo(6.5,-26);c.stroke();c.setLineDash([]);
  /* neckerchief bow */
  tri(c,-1,-47,-11,-52,-11,-42,scarf);tri(c,1,-47,11,-52,11,-42,scarf);ell(c,0,-47,3.4,3.4,shade(scarf,-.12));

  /* blanket tucked over the body while asleep */
  if(sl>.55){
    var ba=Math.min(1,(sl-.55)*3),bcs=["#f4d6c5","#cfe3d4","#f5e2a8","#d7d3ea","#f6c9d0"],bc=bcs[seed%5];
    c.save();c.globalAlpha=ba;
    var bgd=c.createLinearGradient(0,-50,0,6);bgd.addColorStop(0,shade(bc,.2));bgd.addColorStop(1,shade(bc,-.1));
    rr(c,-30,-48,60,54,13,bgd,"rgba(80,50,38,.3)",1.4);
    rr(c,-30,-49,60,10,6,shade(bc,.3),null);
    c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1.4;c.setLineDash([3,3]);c.beginPath();c.moveTo(-26,-36);c.lineTo(26,-36);c.stroke();c.setLineDash([]);
    c.fillStyle=shade(bc,-.22);c.beginPath();c.moveTo(0,-14);c.bezierCurveTo(-9,-22,-3,-28,0,-22);c.bezierCurveTo(3,-28,9,-22,0,-14);c.fill();
    c.restore();
  }
  /* ---------- head ---------- */
  var hs=a.wide?1.06:1;
  c.save();c.translate(fx*3.2,-67+sl*3+(panic?Math.sin(ph*1.5)*1.5:0)+(moving?step*-.8:breathe*.5));
  c.rotate(panic?Math.sin(ph*1.5)*.12:(moving?Math.sin(ph-.7)*.045:Math.sin(t*.8+seed)*.025*(1-sl)+sl*.2));
  var hc=a.head;
  if(a.spikes){for(var k=0;k<15;k++){var an=Math.PI+(k/14)*Math.PI,w=.15;tri(c,Math.cos(an)*56,Math.sin(an)*49-2,Math.cos(an-w)*32,Math.sin(an-w)*27,Math.cos(an+w)*32,Math.sin(an+w)*27,k%2?a.spikes:shade(a.spikes,-.12));}}
  /* ears: they lag behind the head, flop while walking, flick when idle */
  var ew=(moving?Math.sin(ph-1.3)*.16:0)+flick+(panic?Math.sin(ph*3)*.12:0)+sl*.3;
  function ear(x,y,sh,sx,sy,rot,col){c.save();c.translate(x,y);c.rotate(rot);blob(c,xf(sh,0,0,sx,sy,0),col);c.restore();}
  if(a.ear==="round"){ear(-30,-24,EARR,1.05,1.05,-ew,a.earc||hc);ear(30,-24,EARR,1.05,1.05,ew,a.earc||hc);ear(-30,-23,EARR,.58,.58,-ew,a.ein);ear(30,-23,EARR,.58,.58,ew,a.ein);}
  if(a.ear==="tiny"){ear(-31,-21,EARR,.72,.72,-ew,hc);ear(31,-21,EARR,.72,.72,ew,hc);ear(-31,-21,EARR,.38,.38,-ew,a.ein);ear(31,-21,EARR,.38,.38,ew,a.ein);}
  if(a.ear==="point"){ear(-27,-26,EARP,1.0,1.0,-.25-ew,shade(hc,-.06));ear(27,-26,EARP,-1.0,1.0,.25+ew,shade(hc,-.06));ear(-26,-26,EARP,.46,.5,-.25-ew,a.ein);ear(26,-26,EARP,-.46,.5,.25+ew,a.ein);}
  if(a.ear==="long"){var lw=(moving?Math.sin(ph-1.3)*.1:0)+flick;ear(-15,-33,[[0,0],[8,-6],[10,-26],[5,-42],[-3,-44],[-9,-30],[-9,-8]],1.0,1.15,-.12-lw,hc);ear(15,-33,[[0,0],[8,-6],[9,-30],[3,-44],[-5,-42],[-10,-26],[-8,-6]],1.0,1.15,.12+lw,hc);ear(-15,-33,[[0,-4],[5,-8],[6,-26],[2,-38],[-3,-38],[-5,-26],[-5,-8]],.85,1.0,-.12-lw,a.ein);ear(15,-33,[[0,-4],[5,-8],[5,-26],[1,-38],[-4,-38],[-6,-26],[-5,-8]],.85,1.0,.12+lw,a.ein);}
  if(a.duck){blob(c,xf(EARR,0,-33,.5,.7,.4),hc);}
  /* head shape: wide round cheeks, narrower dome on top */
  var HP=xf(HEAD,0,0,hs,1,0);
  blob(c,HP,hc);
  c.save();path(c,HP);c.clip();
  if(a.face){blob(c,xf(EARR,-14,8,1.4,1.5,0),a.face,1);blob(c,xf(EARR,14,8,1.4,1.5,0),a.face,1);}
  if(a.stripes){c.strokeStyle=a.stripes;c.lineWidth=3.2;c.lineCap="round";[-8,0,8].forEach(function(x){c.beginPath();c.moveTo(x,-36);c.lineTo(x*.8,-25);c.stroke();});}
  fleck(c,seed+5,26,40,34,"rgba(255,255,255,.2)");
  c.restore();
  /* fluffy cheek tufts (fox, red panda) */
  if(a.cheeks){blob(c,xf(TUFT,-35,13,.95,.85,.5),a.cheeks,1);blob(c,xf(TUFT,35,13,-.95,.85,-.5),a.cheeks,1);}

  /* face features slide toward the walking direction, so the head looks 3D */
  c.save();c.translate(fx*4.5,0);
  if(!a.face&&!a.disc&&!a.duck&&!a.beak){blob(c,xf(EARR,0,12,a.wide?1.95:1.55,a.wide?1.1:1.0,0),a.muzzle,1);}
  if(a.disc){blob(c,xf(EARR,-15,2,1.4,1.4,0),a.disc,1);blob(c,xf(EARR,15,2,1.4,1.4,0),a.disc,1);}
  if(a.patch){var pc=a.patch;blob(c,xf(EARR,-16,2,a.patchLight?1:.95,a.patchLight?.7:1.12,.5),pc,1);blob(c,xf(EARR,16,2,a.patchLight?1:.95,a.patchLight?.7:1.12,-.5),pc,1);}
  if(a.brow){ell(c,-16,-10,6.5,3.2,a.brow);ell(c,16,-10,6.5,3.2,a.brow);}
  blush(c,-29,13,10,6.5);blush(c,29,13,10,6.5);
  /* eyes */
  if(a.ear==="frog"){
    blob(c,xf(EARR,-22,-29,1.15,1.15,0),hc);blob(c,xf(EARR,22,-29,1.15,1.15,0),hc);
    ell(c,-22,-29,10,10*(1-close*.85),"#fff");ell(c,22,-29,10,10*(1-close*.85),"#fff");
    var pr=panic?3.4:5.6;if(close<.6){ell(c,-22+fx*1.5,-29,pr,pr,DARK);ell(c,22+fx*1.5,-29,pr,pr,DARK);ell(c,-23.6+fx*1.5,-31,2,2,"#fff");ell(c,20.4+fx*1.5,-31,2,2,"#fff");}
    else{c.strokeStyle=DARK;c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(-28,-29);c.lineTo(-16,-29);c.moveTo(16,-29);c.lineTo(28,-29);c.stroke();}
  }else{
    eye(c,-16,3,panic,close,fx);eye(c,16,3,panic,close,fx);
  }
  /* nose, beak, mouth */
  var my=12;
  if(a.beak){tri(c,-7,6,7,6,0,19,a.beak);tri(c,-7,6,7,6,0,12,shade(a.beak,.25));my=-99;}
  else if(a.duck){blob(c,xf(EARR,0,12,1.4,.7,0),"#f08a3a");ell(c,0,9,12,3,"rgba(255,255,255,.4)");my=-99;}
  else if(a.ear==="frog"){my=11;}
  else{
    var np=xf(EARR,0,6,.5,.38,0);
    if(a.nose==="wide")np=xf(EARR,0,6,.88,.55,0);
    else if(a.nose==="big")np=xf(EARR,0,7,.46,.37,0);
    else if(a.nose==="seal")np=xf(EARR,0,6,.62,.42,0);
    blob(c,np,a.nose==="pink"?"#e58a9a":a.nose==="wide"?"#5a4030":DARK,1);
    ell(c,-1.4,4.8,1.6,1,"rgba(255,255,255,.55)");
    if(a.whisk){c.strokeStyle="rgba(42,31,28,.5)";c.lineWidth=1.5;[[-1,-2],[-1,3]].forEach(function(p){c.beginPath();c.moveTo(-25,12+p[1]);c.lineTo(-42,9+p[1]*2.2);c.stroke();c.beginPath();c.moveTo(25,12+p[1]);c.lineTo(42,9+p[1]*2.2);c.stroke();});}
  }
  if(my>-90){
    c.strokeStyle=DARK;c.lineWidth=2.1;c.lineCap="round";
    if(panic){ell(c,0,my+5,a.wide?8:5.5,8,"#7a2f2f");ell(c,0,my+8,3.5,3,"#e58a9a");}
    else if(sl>.5){ell(c,0,my+3.5,2.1,1.6+Math.max(0,breathe)*.9,"#7a2f2f");}
    else if(moving&&!a.wide){ /* happy open smile while walking */
      c.beginPath();c.moveTo(-5,my);c.quadraticCurveTo(0,my+9,5,my);c.closePath();c.fillStyle="#7a2f2f";c.fill();c.stroke();ell(c,0,my+5,2.6,1.6,"#e58a9a");
    }
    else if(a.wide){c.beginPath();c.arc(0,my-4,14,.18*Math.PI,.82*Math.PI);c.stroke();}
    else{c.beginPath();c.arc(-3.6,my,3.6,.08*Math.PI,.92*Math.PI);c.stroke();c.beginPath();c.arc(3.6,my,3.6,.08*Math.PI,.92*Math.PI);c.stroke();}
    if(a.teeth&&!panic&&!moving){rr(c,-3.4,my+3,6.8,6.4,2,"#fff","rgba(42,31,28,.4)",1);c.strokeStyle="rgba(42,31,28,.4)";c.lineWidth=1;c.beginPath();c.moveTo(0,my+3);c.lineTo(0,my+9);c.stroke();}
  }
  c.restore(); /* face shift */
  /* soft sheen on the head */
  c.save();c.globalAlpha=.13;ell(c,-14,-25,15,5,"#ffffff",-.25);c.restore();
  c.restore(); /* head */
  c.restore(); /* bob */
  c.restore(); /* squash & lean */
}
/* eyes: big glossy dots; lids close smoothly */
export function eye(c,x,y,panic,close,fx){
  close=close||0;fx=fx||0;
  if(panic){ell(c,x,y,10.5,12.5,"#fff");c.strokeStyle="rgba(42,31,28,.5)";c.lineWidth=1.2;c.beginPath();c.ellipse(x,y,10.5,12.5,0,0,Math.PI*2);c.stroke();ell(c,x,y,4,5,DARK);ell(c,x-1,y-2,1.6,1.6,"#fff");return;}
  if(close>.62){c.strokeStyle=DARK;c.lineWidth=2.6;c.lineCap="round";c.beginPath();c.arc(x,y+1,5.4,.15*Math.PI,.85*Math.PI);c.stroke();return;}
  var ry=7.4*(1-close*.8);
  ell(c,x+fx*1.2,y+(7.4-ry)*.4,5.8,ry,DARK);
  if(close<.3){ell(c,x-1.9+fx*1.2,y-2.7,2.5,2.5,"#fff");ell(c,x+2+fx*1.2,y+2.7,1.2,1.2,"rgba(255,255,255,.85)");}
}
export function portrait(cv,idx){
  cv.width=124;cv.height=156;var c=cv.getContext("2d");c.clearRect(0,0,124,156);
  c.translate(62,142);c.scale(1.05,1.05);drawWorker(c,A[idx],0,false,false,false,true);
}
