// @ts-nocheck
/* eslint-disable */
// The cafe background, counter and walking paths, ported from the design mockup.
import { ell, tri, rr, DARK } from './workers';
export function buildBg(){
  var S=1.5,cv=document.createElement("canvas");cv.width=1280*S;cv.height=720*S;
  var c=cv.getContext("2d");c.scale(S,S);
  var g=c.createLinearGradient(0,0,0,440);g.addColorStop(0,"#f7e8d3");g.addColorStop(1,"#efd6b8");
  c.fillStyle=g;c.fillRect(0,0,1280,442);
  c.fillStyle="rgba(255,255,255,.12)";for(var x=0;x<1280;x+=72)c.fillRect(x,0,36,330);
  /* wainscot */
  c.fillStyle="#9fb89b";c.fillRect(0,332,1280,112);
  c.fillStyle="#f9f0e2";c.fillRect(0,326,1280,10);c.fillStyle="#e7d5b8";c.fillRect(0,434,1280,10);
  for(x=0;x<1280;x+=160)rr(c,x+16,348,128,76,12,null,"rgba(255,255,255,.4)",3);
  /* window */
  rr(c,676,46,468,278,26,"#fff8ee");
  c.save();rr(c,696,66,428,238,16);c.clip();
  g=c.createLinearGradient(0,66,0,304);g.addColorStop(0,"#cfe6f4");g.addColorStop(.7,"#f4eadb");g.addColorStop(1,"#fbe3c4");c.fillStyle=g;c.fillRect(696,66,428,238);
  var sun=c.createRadialGradient(990,120,4,990,120,120);sun.addColorStop(0,"rgba(255,248,214,.95)");sun.addColorStop(1,"rgba(255,248,214,0)");c.fillStyle=sun;c.fillRect(696,66,428,238);
  ell(c,760,110,46,16,"rgba(255,255,255,.85)");ell(c,800,100,34,14,"rgba(255,255,255,.85)");ell(c,1060,160,44,14,"rgba(255,255,255,.8)");
  ell(c,780,330,240,90,"#b9d6a6");ell(c,1020,336,260,100,"#a3c590");ell(c,900,350,200,70,"#8fb87f");
  [[740,250],[790,262],[1050,248],[1090,262]].forEach(function(p){ell(c,p[0],p[1],20,26,"#7fae78");c.fillStyle="#6f5240";c.fillRect(p[0]-2,p[1]+10,4,30);});
  c.restore();
  c.fillStyle="#fff8ee";c.fillRect(904,66,14,238);c.fillRect(696,176,428,12);
  rr(c,660,320,500,18,8,"#f9f0e2");
  /* sill plants */
  rr(c,722,296,34,28,6,"#c9683f");[-14,-6,2,10,18].forEach(function(o,i){ell(c,739+o*.7,288-i%2*6,5,18,"#5d9a62",(o)/60);});
  rr(c,1060,300,30,24,6,"#e8b44f");ell(c,1075,286,10,16,"#6fb08a");ell(c,1066,290,6,12,"#5d9a62",-.3);ell(c,1084,290,6,12,"#5d9a62",.3);
  /* shelves */
  rr(c,70,196,380,12,5,"#b88b60");rr(c,70,278,380,12,5,"#b88b60");
  [[100,"#f5e6d2"],[136,"#c9683f"],[172,"#8fb5c9"],[330,"#f1cf7a"],[366,"#fbf4ea"]].forEach(function(p){rr(c,p[0],168,26,28,7,p[1]);ell(c,p[0]+28,182,6,7,p[1]);c.fillStyle="rgba(0,0,0,.08)";c.fillRect(p[0],188,26,8);});
  rr(c,230,160,40,36,8,"#e7d5b8");rr(c,236,150,28,12,4,"#cdb78f");ell(c,250,146,14,6,"#7a5a3d");
  rr(c,270,146,18,50,8,"#c9683f");ell(c,279,140,6,12,"#5d9a62");ell(c,271,142,5,10,"#6fb08a",-.4);ell(c,287,142,5,10,"#6fb08a",.4);
  [[96,"#c9683f",40],[116,"#8fae8b",34],[132,"#f1cf7a",44],[150,"#8fb5c9",30]].forEach(function(b){rr(c,b[0],278-b[2],16,b[2],3,b[1]);});
  rr(c,200,230,40,48,8,"#e8d8bd");rr(c,198,222,44,10,4,"#b88b60");
  for(var i=0;i<9;i++)ell(c,214+(i%3)*6,250+Math.floor(i/3)*8,3,2,"#6b4a32");
  rr(c,280,236,50,42,8,"#e8d8bd");rr(c,276,228,58,10,4,"#b88b60");
  c.fillStyle="#fff";c.beginPath();c.arc(380,256,22,0,7);c.fill();c.strokeStyle="#b88b60";c.lineWidth=4;c.stroke();c.strokeStyle=DARK;c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(380,256);c.lineTo(380,242);c.moveTo(380,256);c.lineTo(390,260);c.stroke();
  /* chalkboard */
  rr(c,480,84,178,152,12,"#8a6544");rr(c,490,94,158,132,7,"#3e4a45");
  c.strokeStyle="rgba(255,255,255,.78)";c.lineWidth=3;c.lineCap="round";
  [[508,120,600],[508,142,630],[508,164,580],[508,186,616]].forEach(function(l){c.beginPath();c.moveTo(l[0],l[1]);c.lineTo(l[2],l[1]);c.stroke();});
  c.strokeStyle="#f1cf7a";c.beginPath();c.arc(624,206,10,0,7);c.stroke();c.beginPath();c.moveTo(634,206);c.lineTo(640,204);c.stroke();
  /* frame + hanging plant */
  rr(c,1176,94,72,92,8,"#fff8ee");rr(c,1184,102,56,76,4,"#8fae8b");ell(c,1212,146,16,20,"#f1cf7a");ell(c,1212,126,8,8,"#f7f3ea");
  c.strokeStyle="#6b5a50";c.lineWidth=2;c.beginPath();c.moveTo(1190,0);c.lineTo(1190,34);c.stroke();rr(c,1170,34,40,26,8,"#e8d8bd");
  for(i=0;i<7;i++){ell(c,1176+i*6,70+i%3*10,5,14+i%2*8,"#6fb08a",.1);}
  /* pendant lamps */
  [330,610,1190-190].forEach(function(lx){
    var gl=c.createRadialGradient(lx,110,6,lx,110,170);gl.addColorStop(0,"rgba(255,224,150,.55)");gl.addColorStop(1,"rgba(255,224,150,0)");c.fillStyle=gl;c.fillRect(lx-180,0,360,300);
    c.strokeStyle="#6b5a50";c.lineWidth=2.5;c.beginPath();c.moveTo(lx,0);c.lineTo(lx,70);c.stroke();
    c.fillStyle="#e8a85a";c.beginPath();c.moveTo(lx-34,106);c.quadraticCurveTo(lx-30,66,lx,66);c.quadraticCurveTo(lx+30,66,lx+34,106);c.closePath();c.fill();
    ell(c,lx,106,34,6,"#f6d38b");
  });
  /* floor */
  g=c.createLinearGradient(0,444,0,720);g.addColorStop(0,"#e1bd92");g.addColorStop(1,"#c99a6c");c.fillStyle=g;c.fillRect(0,444,1280,276);
  var y=444,r=0;while(y<720){var h=20+r*5;c.fillStyle="rgba(110,70,30,.14)";c.fillRect(0,y,1280,2);
    for(var xx=(r*137)%190-190;xx<1280;xx+=190){c.fillRect(xx,y,2,h);}
    y+=h;r++;}
  /* rug */
  rr(c,150,552,650,156,64,"#f4e3c9");rr(c,166,566,618,128,52,null,"#c9683f",6);rr(c,182,580,586,100,42,null,"#8fae8b",3);
  for(i=0;i<9;i++){ell(c,260+i*66,630,14,9,"rgba(201,104,63,.28)");}
  /* right table */
  ell(c,1010,676,100,14,"rgba(60,30,10,.18)");
  [[925,"l"],[1095,"r"]].forEach(function(p){var cx=p[0],d=p[1]==="l"?-1:1;rr(c,cx+(d<0?-28:14),556,14,72,6,"#a9512d");ell(c,cx,632,30,12,"#c9683f");c.fillStyle="#8f4222";c.fillRect(cx-18,634,5,28);c.fillRect(cx+13,634,5,28);});
  c.fillStyle="#7a5a45";c.fillRect(1002,606,16,62);ell(c,1010,668,36,9,"#7a5a45");
  ell(c,1010,606,78,30,"#c9ad8a");ell(c,1010,598,78,30,"#f9eedd");
  ell(c,1040,596,18,6,"#fff");ell(c,1040,594,9,5,"#a9512d");rr(c,1000,576,6,14,3,"#5d9a62");ell(c,1003,574,10,6,"#e58a9a");
  /* floor plants */
  rr(c,1184,616,64,76,12,"#c9683f");
  [[1216,560,-.5],[1236,574,.7],[1196,578,-.9],[1218,540,.1],[1244,556,1.1],[1190,556,-1.2]].forEach(function(l){ell(c,l[0],l[1],14,32,"#5d9a62",l[2]);ell(c,l[0],l[1],5,24,"#7cb87e",l[2]);});
  rr(c,28,612,52,70,12,"#e8b44f");ell(c,54,586,12,30,"#6fb08a",-.2);ell(c,40,590,9,22,"#5d9a62",-.6);ell(c,68,590,9,22,"#5d9a62",.6);
  return cv;
}
export function drawCounter(c){
  /* items on top */
  var x0=96;
  rr(c,x0,356,124,92,16,"#dcd6cc");rr(c,x0-6,342,136,22,10,"#b9b4ab");rr(c,x0,402,124,10,3,"#c9683f");
  ell(c,x0+30,388,10,10,"#fbf4ea");ell(c,x0+30,388,6,6,"#a9512d");rr(c,x0+86,376,22,8,3,"#6b6860");
  rr(c,x0+22,414,24,26,6,"#fbf4ea");rr(c,x0+74,414,24,26,6,"#fbf4ea");
  ell(c,x0+62,350,5,5,"#e0584a");
  /* pastry dome */
  ell(c,430,440,48,8,"#f9f0e2");
  c.fillStyle="rgba(235,245,250,.55)";c.beginPath();c.moveTo(390,438);c.quadraticCurveTo(390,386,430,386);c.quadraticCurveTo(470,386,470,438);c.closePath();c.fill();
  c.strokeStyle="rgba(255,255,255,.8)";c.lineWidth=2;c.stroke();
  ell(c,420,426,18,9,"#e8b25f",-.2);ell(c,446,428,14,8,"#d89a4a",.3);rr(c,424,380,12,6,3,"#fff");
  /* counter body */
  rr(c,24,444,512,18,9,"#ecd2aa");rr(c,24,444,512,6,3,"rgba(255,255,255,.5)");
  rr(c,38,460,484,88,12,"#7a9a82");
  c.fillStyle="rgba(255,255,255,.18)";for(var x=52;x<510;x+=30)c.fillRect(x,468,10,72);
  rr(c,38,544,484,12,5,"#5b4034");
}
export function buildBeam(){
  var cv=document.createElement("canvas");cv.width=1280;cv.height=720;var c=cv.getContext("2d");
  var g=c.createLinearGradient(0,300,0,720);g.addColorStop(0,"rgba(255,244,205,.30)");g.addColorStop(1,"rgba(255,244,205,0)");
  c.fillStyle=g;c.beginPath();c.moveTo(700,320);c.lineTo(1120,320);c.lineTo(780,720);c.lineTo(300,720);c.closePath();c.fill();
  return cv;
}

/* ---------- Walking paths ---------- */
export const PATHS=[[[230,470],[500,470]],[[880,540],[1140,540],[1140,690],[880,690]],[[180,575],[760,575],[760,690],[180,690]]];
export function posOn(path,d){
  var n=path.length,segs=[],tot=0,i;
  for(i=0;i<n;i++){var a=path[i],b=path[(i+1)%n],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push(l);tot+=l;}
  d=((d%tot)+tot)%tot;
  for(i=0;i<n;i++){if(d<=segs[i]){var a2=path[i],b2=path[(i+1)%n],t=segs[i]?d/segs[i]:0;return [a2[0]+(b2[0]-a2[0])*t,a2[1]+(b2[1]-a2[1])*t];}d-=segs[i];}
  return path[0];
}
export function depth(y){return Math.max(.8,Math.min(1.12,.8+(y-470)/230*.32));}
