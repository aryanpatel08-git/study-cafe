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

/* feet at (0,0), facing right, about 112 units tall */
export function drawWorker(c,a,ph,moving,panic,blink){
  var sw=moving?Math.sin(ph):0;
  var bob=moving?-Math.abs(Math.sin(ph))*(panic?8:3):0;
  var bodyCol=a.body||a.head,armCol=a.arm||bodyCol,feetCol=a.feet||bodyCol;
  ell(c,0,0,30,7,"rgba(60,40,30,.2)");
  /* tail */
  c.save();c.translate(0,bob);
  if(a.tail==="fox"){ell(c,-32,-26,13,24,a.head,.6);ell(c,-38,-44,8,9,"#fff6ea",.6);}
  if(a.tail==="ring"){ell(c,-32,-26,12,26,a.head,.6);ell(c,-30,-34,11,5,"#7a3f22",.6);ell(c,-35,-22,11,5,"#7a3f22",.6);}
  if(a.tail==="cat"){c.strokeStyle=a.head;c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(-18,-14);c.quadraticCurveTo(-46,-14,-40,-52);c.stroke();}
  if(a.tail==="puff"){ell(c,-26,-14,9,9,"#fff");}
  c.restore();
  /* feet */
  ell(c,-12,-4-Math.max(0,sw)*6,11,7,feetCol);
  ell(c,12,-4-Math.max(0,-sw)*6,11,7,feetCol);
  c.save();c.translate(0,bob);
  /* body */
  ell(c,0,-32,25,26,bodyCol);
  ell(c,0,-28,16,18,a.belly);
  /* arms */
  var la=panic?-.9+Math.sin(ph*2)*.5:.25+sw*.4, ra=panic?.9-Math.sin(ph*2+1)*.5:-.25-sw*.4;
  var ly=panic?-52+Math.sin(ph*2)*5:-30, ry=panic?-52-Math.sin(ph*2+1)*5:-30;
  ell(c,-28,ly,7,13,armCol,la);ell(c,28,ry,7,13,armCol,ra);
  /* apron */
  c.fillStyle=a.apron;c.beginPath();c.moveTo(-14,-44);c.lineTo(14,-44);c.quadraticCurveTo(20,-22,15,-11);c.quadraticCurveTo(0,-6,-15,-11);c.quadraticCurveTo(-20,-22,-14,-44);c.fill();
  c.strokeStyle="rgba(255,255,255,.55)";c.lineWidth=2;c.beginPath();c.moveTo(-14,-42);c.lineTo(14,-42);c.stroke();
  ell(c,0,-20,7,5,"rgba(255,255,255,.4)");
  /* head */
  c.save();c.translate(0,-64+(panic?Math.sin(ph*1.5)*1.5:0));c.rotate(panic?Math.sin(ph*1.5)*.12:Math.sin(ph)*.03*(moving?1:0));
  var hc=a.head;
  if(a.spikes){for(var k=0;k<13;k++){var an=Math.PI+(k/12)*Math.PI,w=.17;tri(c,Math.cos(an)*52,Math.sin(an)*46-2,Math.cos(an-w)*30,Math.sin(an-w)*26,Math.cos(an+w)*30,Math.sin(an+w)*26,a.spikes);}}
  /* ears */
  if(a.ear==="round"){ell(c,-26,-24,12,12,a.earc||hc);ell(c,26,-24,12,12,a.earc||hc);ell(c,-26,-24,6.5,6.5,a.ein);ell(c,26,-24,6.5,6.5,a.ein);}
  if(a.ear==="tiny"){ell(c,-28,-22,8,8,hc);ell(c,28,-22,8,8,hc);ell(c,-28,-22,4,4,a.ein);ell(c,28,-22,4,4,a.ein);}
  if(a.ear==="point"){tri(c,-34,-12,-14,-34,-6,-12,hc);tri(c,34,-12,14,-34,6,-12,hc);tri(c,-29,-14,-16,-28,-11,-14,a.ein);tri(c,29,-14,16,-28,11,-14,a.ein);}
  if(a.ear==="long"){ell(c,-15,-52,9,27,hc,-.12);ell(c,15,-52,9,27,hc,.12);ell(c,-15,-50,5,19,a.ein,-.12);ell(c,15,-50,5,19,a.ein,.12);}
  if(a.duck){ell(c,0,-31,6,8,hc,.4);}
  /* head shape */
  ell(c,0,0,38,33,hc);
  if(a.face){ell(c,-13,7,16,17,a.face);ell(c,13,7,16,17,a.face);}
  if(a.cheeks){tri(c,-38,6,-22,-2,-26,20,a.cheeks);tri(c,38,6,22,-2,26,20,a.cheeks);}
  if(a.stripes){c.strokeStyle=a.stripes;c.lineWidth=3;c.lineCap="round";[-7,0,7].forEach(function(x){c.beginPath();c.moveTo(x,-30);c.lineTo(x*.8,-21);c.stroke();});}
  /* muzzle */
  if(!a.face&&!a.disc&&!a.duck&&!a.beak){ell(c,0,10,a.wide?22:18,a.wide?13:12,a.muzzle);}
  if(a.disc){ell(c,-14,1,16,16,a.disc);ell(c,14,1,16,16,a.disc);}
  /* eye patches */
  if(a.patch){var pc=a.patch;ell(c,-14,1,a.patchLight?12:11,a.patchLight?8:13,pc,.5);ell(c,14,1,a.patchLight?12:11,a.patchLight?8:13,pc,-.5);}
  if(a.brow){ell(c,-14,-10,6,3,a.brow);ell(c,14,-10,6,3,a.brow);}
  /* eyes */
  if(a.ear==="frog"){
    ell(c,-21,-28,13,13,hc);ell(c,21,-28,13,13,hc);
    ell(c,-21,-28,9.5,9.5,"#fff");ell(c,21,-28,9.5,9.5,"#fff");
    var pr=panic?3.2:5;ell(c,-21,-28,pr,pr,DARK);ell(c,21,-28,pr,pr,DARK);ell(c,-22.5,-30,1.8,1.8,"#fff");ell(c,19.5,-30,1.8,1.8,"#fff");
  }else{
    eye(c,-14,2,panic,blink);eye(c,14,2,panic,blink);
  }
  /* nose, beak, mouth */
  var my=10;
  if(a.beak){var bc=a.beak;tri(c,-6,5,6,5,0,17,bc);my=-99;}
  else if(a.duck){ell(c,0,11,16,8,"#f08a3a");ell(c,0,8,12,3,"rgba(255,255,255,.35)");my=-99;}
  else if(a.ear==="frog"){my=10;}
  else{
    if(a.nose==="wide")ell(c,0,5,10,6,"#5a4030");
    else if(a.nose==="big")ell(c,0,6,5,4,DARK);
    else if(a.nose==="pink")ell(c,0,5,4,3,"#e58a9a");
    else if(a.nose==="seal")ell(c,0,5,7,4.5,DARK);
    else ell(c,0,5,4.5,3.4,DARK);
    if(a.whisk){c.strokeStyle="rgba(42,31,28,.55)";c.lineWidth=1.6;[[-1,-2],[-1,3]].forEach(function(p){c.beginPath();c.moveTo(-24,10+p[1]);c.lineTo(-40,8+p[1]*2.2);c.stroke();c.beginPath();c.moveTo(24,10+p[1]);c.lineTo(40,8+p[1]*2.2);c.stroke();});}
  }
  /* blush */
  ell(c,-27,11,7,4.6,"rgba(255,120,130,.42)");ell(c,27,11,7,4.6,"rgba(255,120,130,.42)");
  if(my>-90){
    c.strokeStyle=DARK;c.lineWidth=2.2;c.lineCap="round";
    if(panic){ell(c,0,my+5,a.wide?8:5.5,8,"#7a2f2f");ell(c,0,my+8,3.5,3,"#e58a9a");}
    else if(a.wide){c.beginPath();c.arc(0,my-4,14,.18*Math.PI,.82*Math.PI);c.stroke();}
    else{c.beginPath();c.arc(-3.6,my,3.6,.08*Math.PI,.92*Math.PI);c.stroke();c.beginPath();c.arc(3.6,my,3.6,.08*Math.PI,.92*Math.PI);c.stroke();}
    if(a.teeth&&!panic){rr(c,-3.2,my+3,6.4,6,2,"#fff");c.strokeStyle="rgba(42,31,28,.4)";c.lineWidth=1;c.beginPath();c.moveTo(0,my+3);c.lineTo(0,my+9);c.stroke();}
  }
  c.restore();
  c.restore();
}
export function eye(c,x,y,panic,blink){
  if(blink&&!panic){c.strokeStyle=DARK;c.lineWidth=2.6;c.lineCap="round";c.beginPath();c.arc(x,y+1,5,.15*Math.PI,.85*Math.PI);c.stroke();return;}
  if(panic){ell(c,x,y,10,12,"#fff");ell(c,x,y,4,5,DARK);ell(c,x-1,y-2,1.6,1.6,"#fff");return;}
  ell(c,x,y,6.6,8.4,DARK);
  ell(c,x-2,y-3,2.8,2.8,"#fff");ell(c,x+2.2,y+3,1.4,1.4,"rgba(255,255,255,.85)");
}
export function portrait(cv,idx){
  cv.width=124;cv.height=156;var c=cv.getContext("2d");c.clearRect(0,0,124,156);
  c.translate(62,142);c.scale(1.05,1.05);drawWorker(c,A[idx],0,false,false,false);
}

