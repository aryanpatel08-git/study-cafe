// @ts-nocheck
/* eslint-disable */
// The cafe: background, counter, sleeping beds, walking paths. Everything is drawn with the Canvas API.
import { ell, tri, rr, DARK, shade } from './workers';

var SS=2; /* the background is painted at 2x so it stays crisp */
function lg(c,x0,y0,x1,y1,st){var g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(function(s){g.addColorStop(s[0],s[1]);});return g;}
function rg(c,x,y,r0,r1,st){var g=c.createRadialGradient(x,y,r0,x,y,r1);st.forEach(function(s){g.addColorStop(s[0],s[1]);});return g;}
function box(c,x,y,w,h,r,top,bot,line){rr(c,x,y,w,h,r,lg(c,x,y,x,y+h,[[0,top],[1,bot||top]]),line||null,1.5);}
function drop(c,col,blur,oy,fn){c.save();c.shadowColor=col;c.shadowBlur=blur*SS;c.shadowOffsetY=oy*SS;fn();c.restore();}
function rnd(seed){var s=seed;return function(){s=(s*9301+49297)%233280;return s/233280;};}
function glow(c,x,y,r,rgb,a){c.fillStyle=rg(c,x,y,0,r,[[0,"rgba("+rgb+","+a+")"],[1,"rgba("+rgb+",0)"]]);c.fillRect(x-r,y-r,r*2,r*2);}
function leaf(c,x,y,rx,ry,rot,col){c.save();c.translate(x,y);c.rotate(rot||0);
  c.fillStyle=lg(c,-rx,0,rx,0,[[0,shade(col,.2)],[1,shade(col,-.18)]]);c.beginPath();c.ellipse(0,0,rx,ry,0,0,Math.PI*2);c.fill();
  c.strokeStyle="rgba(255,255,255,.28)";c.lineWidth=1.2;c.beginPath();c.moveTo(0,-ry*.85);c.lineTo(0,ry*.85);c.stroke();c.restore();}
function pot(c,x,y,w,h,col){drop(c,"rgba(60,30,10,.3)",8,3,function(){box(c,x,y,w,h,Math.min(12,w/4),shade(col,.12),shade(col,-.12));});
  box(c,x-3,y-5,w+6,12,6,shade(col,.22),shade(col,-.02));
  c.fillStyle="rgba(255,255,255,.16)";rr(c,x+5,y+10,6,h-18,3,"rgba(255,255,255,.16)");}
function mug(c,x,y,col){drop(c,"rgba(60,30,10,.25)",4,2,function(){box(c,x,y,18,16,5,shade(col,.15),shade(col,-.1));});
  c.strokeStyle=shade(col,-.12);c.lineWidth=3;c.beginPath();c.arc(x+19,y+8,5,-1.2,1.2);c.stroke();ell(c,x+9,y+1.5,7.5,2.2,"#6b4636");}
function jar(c,x,y,w,h,fill,lid){
  drop(c,"rgba(60,30,10,.2)",5,2,function(){rr(c,x,y,w,h,8,"rgba(235,245,248,.55)");});
  c.save();rr(c,x+2,y+h*.38,w-4,h*.62-2,7);c.clip();c.fillStyle=fill;c.fillRect(x,y+h*.38,w,h);c.restore();
  rr(c,x,y,w,h,8,null,"rgba(120,140,150,.5)",1.4);rr(c,x+4,y+5,3,h-14,2,"rgba(255,255,255,.7)");
  box(c,x-1,y-8,w+2,10,4,shade(lid,.15),shade(lid,-.12));}
function books(c,x,base,list){var xx=x;list.forEach(function(b){drop(c,"rgba(60,30,10,.2)",3,1,function(){box(c,xx,base-b[1],b[0],b[1],3,shade(b[2],.12),shade(b[2],-.12));});
  c.fillStyle="rgba(255,255,255,.45)";c.fillRect(xx+2,base-b[1]+8,b[0]-4,2);c.fillRect(xx+2,base-b[1]+13,b[0]-4,1.2);xx+=b[0]+1;});}

export function buildBg(){
  var cv=document.createElement("canvas");cv.width=1280*SS;cv.height=720*SS;
  var c=cv.getContext("2d");c.scale(SS,SS);var i,x,y,R=rnd(11);
  /* ---------- wall ---------- */
  c.fillStyle=lg(c,0,0,0,444,[[0,"#faeedc"],[1,"#efd4b4"]]);c.fillRect(0,0,1280,444);
  c.fillStyle="rgba(190,140,100,.11)";
  for(y=34;y<326;y+=32)for(x=((y/32)%2)*16+10;x<1280;x+=32){c.beginPath();c.arc(x,y,2,0,7);c.fill();}
  /* wainscot */
  c.fillStyle=lg(c,0,332,0,444,[[0,"#a9c3a4"],[1,"#86a584"]]);c.fillRect(0,332,1280,112);
  for(x=0;x<1280;x+=160){rr(c,x+16,350,128,72,12,"rgba(255,255,255,.07)","rgba(255,255,255,.45)",2.5);c.strokeStyle="rgba(50,80,50,.18)";c.lineWidth=2;c.beginPath();c.moveTo(x+18,420);c.lineTo(x+142,420);c.lineTo(x+142,352);c.stroke();}
  box(c,0,322,1280,14,0,"#fffaf0","#ecdcc0");c.fillStyle="rgba(120,80,40,.18)";c.fillRect(0,336,1280,4);
  box(c,0,432,1280,14,0,"#f0e0c4","#d8c3a0");
  /* crown moulding + string lights */
  box(c,0,0,1280,14,0,"#fffaf0","#ecdcc0");c.fillStyle="rgba(120,80,40,.2)";c.fillRect(0,14,1280,5);
  c.strokeStyle="#6b5a50";c.lineWidth=1.6;c.beginPath();
  for(x=0;x<=1280;x+=4){var yy=20+22*Math.sin(Math.PI*((x%320)/320));if(x===0)c.moveTo(x,yy);else c.lineTo(x,yy);}c.stroke();
  var lc=["255,214,140","255,176,150","255,240,180","190,230,200"];
  for(i=1;i<24;i++){x=i*53.3;if(Math.abs((x%320))<8)continue;var by=20+22*Math.sin(Math.PI*((x%320)/320));
    glow(c,x,by+6,22,lc[i%4],.5);ell(c,x,by+6,3.6,4.6,"rgb("+lc[i%4]+")");ell(c,x-1,by+4.5,1.2,1.6,"rgba(255,255,255,.8)");}
  /* ---------- window ---------- */
  drop(c,"rgba(90,60,30,.3)",14,4,function(){rr(c,668,40,484,290,28,"#fffaf0");});
  c.save();rr(c,692,64,436,242,18);c.clip();
  c.fillStyle=lg(c,0,64,0,306,[[0,"#bfe0f2"],[.55,"#e8f2ee"],[1,"#fcebd0"]]);c.fillRect(692,64,436,242);
  c.fillStyle=rg(c,990,118,2,150,[[0,"rgba(255,250,214,1)"],[1,"rgba(255,250,214,0)"]]);c.fillRect(692,64,436,242);
  [[748,112,56,15],[812,98,40,12],[1062,158,52,14],[1010,90,34,10]].forEach(function(p){ell(c,p[0],p[1],p[2],p[3],"rgba(255,255,255,.9)");ell(c,p[0]+p[2]*.4,p[1]-p[3]*.7,p[2]*.5,p[3]*.9,"rgba(255,255,255,.9)");});
  /* hills, trees, fence, flowers */
  c.fillStyle=lg(c,0,220,0,330,[[0,"#c3dcae"],[1,"#9cc388"]]);c.beginPath();c.ellipse(790,340,260,110,0,0,7);c.fill();
  c.fillStyle=lg(c,0,230,0,340,[[0,"#aed09a"],[1,"#86b476"]]);c.beginPath();c.ellipse(1040,346,300,112,0,0,7);c.fill();
  [[742,236,26],[772,244,22],[1056,234,28],[1096,246,22],[900,252,18]].forEach(function(p){c.fillStyle="#6a5040";c.fillRect(p[0]-2.5,p[1]+p[2]*.5,5,p[2]*1.2);c.fillStyle=rg(c,p[0]-p[2]*.3,p[1]-p[2]*.3,2,p[2]*1.4,[[0,"#97cc8c"],[1,"#5f9a64"]]);c.beginPath();c.ellipse(p[0],p[1],p[2],p[2]*1.12,0,0,7);c.fill();});
  c.fillStyle="#fffaf0";for(x=696;x<1128;x+=24){rr(c,x,262,16,44,5,"#fffaf0");tri(c,x,262,x+8,254,x+16,262,"#fffaf0");}
  c.fillStyle="rgba(120,90,60,.12)";c.fillRect(692,284,436,3);
  var R2=rnd(5);for(i=0;i<40;i++){var fx=700+R2()*420,fy=292+R2()*14;ell(c,fx,fy,2.4,2.4,["#f4a6b4","#f8d56b","#fff","#f9b98a"][i%4]);}
  c.restore();
  /* mullions */
  box(c,899,64,18,242,3,"#fffaf0","#eadcc3");box(c,692,174,436,14,3,"#fffaf0","#eadcc3");
  c.fillStyle="rgba(255,255,255,.18)";c.beginPath();c.moveTo(716,64);c.lineTo(790,64);c.lineTo(716,200);c.closePath();c.fill();
  /* sill + flower box */
  drop(c,"rgba(80,50,20,.3)",8,3,function(){box(c,650,318,530,20,9,"#fffaf0","#e6d6b8");});
  pot(c,722,296,34,28,"#c9683f");[-14,-7,0,7,14].forEach(function(o,k){leaf(c,739+o*.9,286-(k%2)*6,5,17,o/48,"#5d9a62");});
  drop(c,"rgba(60,30,10,.3)",6,3,function(){box(c,1012,298,100,26,6,"#b8825a","#8e5f3c");});
  for(i=0;i<16;i++){var px=1018+i*6;leaf(c,px,296,3.4,9+(i%3)*2,(i-8)*.09,"#5d9a62");}
  for(i=0;i<9;i++){var qx=1022+i*10.5,qy=288-(i%3)*5;ell(c,qx,qy,5,5,["#f4a6b4","#f8d56b","#fff1f1"][i%3]);ell(c,qx,qy,1.8,1.8,"#e0a14e");}
  /* curtains: gingham drapes pulled aside */
  function drape(x0,dir){
    c.save();c.beginPath();c.moveTo(x0,36);c.lineTo(x0+dir*58,36);c.bezierCurveTo(x0+dir*50,120,x0+dir*14,190,x0+dir*30,330);c.lineTo(x0-dir*12,330);c.closePath();c.clip();
    c.fillStyle=lg(c,x0,0,x0+dir*58,0,[[0,"#fbf0e0"],[.5,"#f6e4cc"],[1,"#ecd3b4"]]);c.fillRect(x0-80,30,200,310);
    c.fillStyle="rgba(201,104,63,.28)";for(var gx=x0-80;gx<x0+120;gx+=14)c.fillRect(gx,30,7,310);
    for(var gy=30;gy<340;gy+=14)c.fillRect(x0-80,gy,200,7);
    c.fillStyle="rgba(90,50,20,.14)";for(var fx2=0;fx2<5;fx2++){c.fillRect(x0+dir*(fx2*12+6),30,2,310);}
    c.restore();
    c.strokeStyle="rgba(120,70,40,.25)";c.lineWidth=1.4;c.beginPath();c.moveTo(x0+dir*58,36);c.bezierCurveTo(x0+dir*50,120,x0+dir*14,190,x0+dir*30,330);c.stroke();
    box(c,x0+dir*8-12,186,24,10,5,"#c9683f","#a9512d"); /* tie-back */
  }
  drape(668,1);drape(1152,-1);
  drop(c,"rgba(60,30,10,.3)",5,2,function(){box(c,646,30,534,8,4,"#7a5a3d","#5b4034");});ell(c,646,34,8,8,"#c9683f");ell(c,1180,34,8,8,"#c9683f");
  /* ---------- chalkboard ---------- */
  drop(c,"rgba(60,30,10,.35)",10,4,function(){box(c,478,82,182,156,12,"#a67a52","#7a5539");});
  box(c,488,92,162,136,7,"#425049","#37433d");
  c.fillStyle=rg(c,570,160,5,120,[[0,"rgba(255,255,255,.08)"],[1,"rgba(255,255,255,0)"]]);c.fillRect(488,92,162,136);
  c.fillStyle="rgba(255,255,255,.88)";c.textAlign="center";c.font="700 20px Fredoka, 'Trebuchet MS', sans-serif";c.fillText("Today",569,118);
  c.textAlign="left";c.font="600 12.5px Nunito, sans-serif";
  [["flat white","4"],["matcha latte","5"],["focus blend","3"],["cinnamon bun","4"]].forEach(function(m,k){c.fillStyle="rgba(255,255,255,.82)";c.fillText(m[0],502,142+k*20);c.fillText(m[1],626,142+k*20);c.fillStyle="rgba(255,255,255,.3)";for(var d=0;d<7;d++)c.fillRect(570+d*7.5+(k*2),138+k*20,2,1.6);});
  c.strokeStyle="rgba(255,255,255,.6)";c.lineWidth=1.6;c.beginPath();c.moveTo(500,126);c.lineTo(640,126);c.stroke();
  /* tiny chalk doodles in the corner */
  c.strokeStyle="#f1cf7a";c.lineWidth=1.8;c.lineCap="round";c.beginPath();c.moveTo(506,214);c.lineTo(508,224);c.lineTo(518,224);c.lineTo(520,214);c.closePath();c.stroke();c.beginPath();c.arc(523,218,3.4,-1.4,1.4);c.stroke();
  c.fillStyle="#f4a6b4";c.beginPath();c.moveTo(630,224);c.bezierCurveTo(620,215,628,208,630,213);c.bezierCurveTo(632,208,640,215,630,224);c.fill();
  /* ---------- shelves ---------- */
  [196,278].forEach(function(sy){drop(c,"rgba(60,30,10,.35)",8,4,function(){box(c,64,sy,392,13,5,"#c6976a","#9c6e48");});
    [[96,sy+13],[420,sy+13]].forEach(function(b){tri(c,b[0],b[1],b[0]+16,b[1],b[0],b[1]+22,"#8e6342");});});
  jar(c,100,164,28,32,"#d9b88a","#c9683f");jar(c,136,160,28,36,"#f5ecd9","#8fae8b");jar(c,172,166,26,30,"#b87e52","#6b5a50");
  mug(c,330,180,"#f1cf7a");mug(c,356,180,"#fbf4ea");mug(c,382,180,"#8fb5c9");
  pot(c,238,168,30,28,"#e8d8bd");leaf(c,253,160,4,14,-.3,"#5d9a62");leaf(c,253,158,4,16,.0,"#6fb08a");leaf(c,253,160,4,14,.3,"#5d9a62");
  pot(c,276,170,24,26,"#c9683f");ell(c,288,160,12,10,"#6fb08a");ell(c,284,156,3,3,"#f4a6b4");ell(c,292,162,3,3,"#f4a6b4");
  books(c,96,278,[[16,40,"#c9683f"],[14,34,"#8fae8b"],[18,44,"#f1cf7a"],[14,30,"#8fb5c9"]]);
  box(c,196,240,44,38,8,"#e9d9be","#d3bf9c");box(c,194,232,48,10,5,"#c6976a","#9c6e48");ell(c,218,228,12,5,"#7a5a3d");for(i=0;i<9;i++)ell(c,206+(i%3)*8,254+Math.floor(i/3)*8,3,2,"#6b4a32");
  box(c,276,244,52,34,8,"#e9d9be","#d3bf9c");box(c,272,236,60,10,5,"#c6976a","#9c6e48");
  /* wall clock showing the real time */
  drop(c,"rgba(60,30,10,.3)",8,3,function(){c.fillStyle="#c6976a";c.beginPath();c.arc(380,252,26,0,7);c.fill();});
  c.fillStyle=lg(c,0,226,0,278,[[0,"#ffffff"],[1,"#f1e6d2"]]);c.beginPath();c.arc(380,252,21,0,7);c.fill();
  c.strokeStyle="#6b5a50";c.lineWidth=1.6;for(i=0;i<12;i++){var an=i*Math.PI/6;c.beginPath();c.moveTo(380+Math.sin(an)*17,252-Math.cos(an)*17);c.lineTo(380+Math.sin(an)*19.5,252-Math.cos(an)*19.5);c.stroke();}
  var now=new Date(),hh=(now.getHours()%12+now.getMinutes()/60)*Math.PI/6,mm=now.getMinutes()*Math.PI/30;
  c.strokeStyle=DARK;c.lineCap="round";c.lineWidth=2.6;c.beginPath();c.moveTo(380,252);c.lineTo(380+Math.sin(hh)*10,252-Math.cos(hh)*10);c.stroke();c.lineWidth=1.8;c.beginPath();c.moveTo(380,252);c.lineTo(380+Math.sin(mm)*15,252-Math.cos(mm)*15);c.stroke();ell(c,380,252,2.2,2.2,"#c9683f");
  /* ---------- right wall: prints + hanging plant ---------- */
  drop(c,"rgba(60,30,10,.3)",8,3,function(){box(c,1180,92,72,92,8,"#fffaf0","#ecdcc0");});
  box(c,1188,100,56,76,4,"#9fbfa0","#86a584");ell(c,1216,146,16,20,"#f1cf7a");ell(c,1216,124,8,8,"#fbf4ea");c.fillStyle="#c9683f";c.beginPath();c.arc(1216,170,12,Math.PI,0);c.fill();
  c.strokeStyle="#6b5a50";c.lineWidth=1.6;c.beginPath();c.moveTo(1196,14);c.lineTo(1212,52);c.lineTo(1228,14);c.stroke();
  drop(c,"rgba(60,30,10,.3)",6,3,function(){box(c,1192,48,40,26,9,"#ecdcc0","#d3bf9c");});
  for(i=0;i<9;i++){c.strokeStyle="#5d9a62";c.lineWidth=2.4;c.beginPath();c.moveTo(1198+i*4.5,70);c.quadraticCurveTo(1190+i*6,88+i%3*8,1194+i*5,108+i%4*10);c.stroke();leaf(c,1194+i*5,108+i%4*10,3,6,0,"#6fb08a");}
  /* ---------- pendant lamps ---------- */
  [260,410,910].forEach(function(lx){
    c.strokeStyle="#5b4a40";c.lineWidth=2;c.beginPath();c.moveTo(lx,0);c.lineTo(lx,64);c.stroke();box(c,lx-5,60,10,8,3,"#7a6a5e","#5b4a40");
    drop(c,"rgba(90,40,0,.35)",10,6,function(){c.fillStyle=lg(c,lx-36,0,lx+36,0,[[0,"#d98f4a"],[.45,"#f0b36a"],[1,"#c97c3a"]]);c.beginPath();c.moveTo(lx-38,108);c.quadraticCurveTo(lx-30,66,lx,66);c.quadraticCurveTo(lx+30,66,lx+38,108);c.closePath();c.fill();});
    ell(c,lx-10,84,6,14,"rgba(255,255,255,.22)",.3);ell(c,lx,108,38,6,"#ffe2a6");ell(c,lx,108,22,3.6,"#fff6d8");
  });
  /* ---------- floor ---------- */
  c.fillStyle=lg(c,0,444,0,720,[[0,"#e6c398"],[1,"#c99a6c"]]);c.fillRect(0,444,1280,276);
  y=444;var row=0;var R3=rnd(21);
  while(y<720){var h=20+row*5;c.fillStyle="rgba(100,60,25,.2)";c.fillRect(0,y,1280,1.6);
    for(var xx=(row*137)%190-190;xx<1280;xx+=190){var wv=R3();c.fillStyle="rgba("+(wv>.5?"255,235,200":"110,70,30")+","+(.05+wv*.07)+")";c.fillRect(xx+2,y+1.6,188,h-1.6);c.fillStyle="rgba(100,60,25,.2)";c.fillRect(xx,y,1.6,h);
      c.strokeStyle="rgba(110,70,30,.08)";c.lineWidth=1;for(var gk=0;gk<3;gk++){var gy=y+4+R3()*(h-8);c.beginPath();c.moveTo(xx+10+R3()*40,gy);c.lineTo(xx+80+R3()*90,gy+R3()*2-1);c.stroke();}}
    y+=h;row++;}
  c.fillStyle=lg(c,0,444,0,500,[[0,"rgba(70,40,15,.38)"],[1,"rgba(70,40,15,0)"]]);c.fillRect(0,444,1280,56);
  /* ---------- rug (and soft shadows under it) ---------- */
  drop(c,"rgba(60,30,10,.35)",16,6,function(){rr(c,150,552,650,156,64,"#f6e7cf");});
  rr(c,150,552,650,156,64,lg(c,0,552,0,708,[[0,"#f8ecd8"],[1,"#eed9ba"]]));
  rr(c,166,566,618,128,52,null,"#c9683f",7);rr(c,182,580,586,100,42,null,"#8fae8b",3.5);rr(c,194,592,562,76,34,null,"rgba(201,104,63,.35)",1.5);
  for(i=0;i<13;i++){var rx=232+i*40;c.fillStyle=i%2?"rgba(143,174,139,.5)":"rgba(201,104,63,.4)";c.beginPath();c.moveTo(rx,630);c.lineTo(rx+10,621);c.lineTo(rx+20,630);c.lineTo(rx+10,639);c.closePath();c.fill();}
  c.strokeStyle="rgba(201,104,63,.5)";c.lineWidth=2;for(i=0;i<16;i++){c.beginPath();c.moveTo(152,578+i*8);c.lineTo(144,578+i*8);c.stroke();c.beginPath();c.moveTo(798,578+i*8);c.lineTo(806,578+i*8);c.stroke();}
  /* ---------- right table, chairs ---------- */
  ell(c,1010,684,112,16,"rgba(60,30,10,.22)");
  [[925,-1],[1095,1]].forEach(function(p){var cx=p[0],d=p[1];
    c.fillStyle="#8f4222";c.fillRect(cx-19,636,5,32);c.fillRect(cx+14,636,5,32);c.fillRect(cx-15,632,4,32);c.fillRect(cx+11,632,4,32);
    drop(c,"rgba(60,30,10,.3)",6,3,function(){box(c,cx+(d<0?-30:16),548,14,86,6,"#c9683f","#a9512d");});
    box(c,cx+(d<0?-33:12),540,20,14,6,"#d9784f","#b45a36");
    drop(c,"rgba(60,30,10,.3)",6,3,function(){ell(c,cx,634,31,13,"#b45a36");});ell(c,cx,631,29,11,lg(c,cx-29,0,cx+29,0,[[0,"#a9c3a4"],[1,"#86a584"]]));ell(c,cx-6,628,12,4,"rgba(255,255,255,.25)");});
  box(c,1002,606,16,64,3,"#7a5a45","#5e4434");ell(c,1010,668,38,9,"#6b4a38");
  drop(c,"rgba(60,30,10,.35)",8,5,function(){ell(c,1010,606,80,31,"#b89a76");});
  ell(c,1010,597,80,31,lg(c,930,0,1090,0,[[0,"#fbf2e2"],[1,"#f0e0c4"]]));
  c.save();c.beginPath();c.ellipse(1010,597,80,31,0,0,7);c.clip();c.fillStyle="rgba(201,104,63,.22)";for(x=930;x<1090;x+=16)c.fillRect(x,560,8,80);for(y=566;y<630;y+=12)c.fillRect(930,y,160,6);c.restore();
  c.strokeStyle="rgba(120,80,40,.25)";c.lineWidth=1.4;c.beginPath();c.ellipse(1010,597,80,31,0,0,7);c.stroke();
  /* things on the table */
  ell(c,1040,598,20,6.5,"#ffffff");ell(c,1040,596,11,4,"#e8b25f");
  mug(c,968,584,"#8fb5c9");c.strokeStyle="rgba(255,255,255,.65)";c.lineWidth=1.8;c.beginPath();c.moveTo(977,580);c.quadraticCurveTo(972,572,977,566);c.stroke();c.beginPath();c.moveTo(983,580);c.quadraticCurveTo(978,574,983,568);c.stroke();
  box(c,1003,578,8,20,3,"#8fae8b","#6f9475");for(i=0;i<5;i++){var a5=-1+i*.5;c.strokeStyle="#5d9a62";c.lineWidth=1.6;c.beginPath();c.moveTo(1007,578);c.lineTo(1007+Math.sin(a5)*13,566-Math.cos(a5)*8);c.stroke();ell(c,1007+Math.sin(a5)*13,566-Math.cos(a5)*8,4.2,4.2,i%2?"#fff":"#f4a6b4");ell(c,1007+Math.sin(a5)*13,566-Math.cos(a5)*8,1.5,1.5,"#f1cf7a");}
  /* ---------- floor plants ---------- */
  ell(c,1218,700,50,9,"rgba(60,30,10,.22)");
  [[1216,566,-.5],[1238,578,.7],[1194,582,-.95],[1216,544,.1],[1246,560,1.1],[1188,560,-1.2],[1230,540,.5]].forEach(function(l){leaf(c,l[0],l[1],15,34,l[2],"#5d9a62");});
  pot(c,1186,616,64,78,"#c9683f");
  ell(c,54,698,38,8,"rgba(60,30,10,.22)");
  leaf(c,54,586,12,30,-.15,"#6fb08a");leaf(c,40,592,9,22,-.6,"#5d9a62");leaf(c,68,592,9,22,.6,"#5d9a62");leaf(c,30,602,8,17,-1,"#6fb08a");leaf(c,78,602,8,17,1,"#6fb08a");
  pot(c,28,612,52,70,"#e8b44f");
  /* ---------- lighting pass ---------- */
  c.save();c.globalCompositeOperation="screen";
  [260,410,910].forEach(function(lx){glow(c,lx,120,190,"255,205,125",.3);});
  c.fillStyle=rg(c,990,150,10,360,[[0,"rgba(255,244,200,.22)"],[1,"rgba(255,244,200,0)"]]);c.fillRect(600,0,680,460);
  c.restore();
  c.fillStyle=rg(c,640,380,300,820,[[0,"rgba(70,30,10,0)"],[1,"rgba(70,30,10,.32)"]]);c.fillRect(0,0,1280,720);
  return cv;
}

/* ---------- cosy floor cushions the crew sleeps on during breaks ---------- */
export const BEDS=[[300,646],[500,664],[700,646]];
export function drawBed(c,x,y,col,alpha){
  c.save();c.globalAlpha=alpha;c.translate(x,y);
  ell(c,0,4,92,22,"rgba(60,30,10,.25)");
  c.fillStyle=lg(c,0,-26,0,16,[[0,shade(col,.22)],[1,shade(col,-.16)]]);c.beginPath();c.ellipse(0,-4,88,24,0,0,7);c.fill();
  c.strokeStyle="rgba(80,50,38,.3)";c.lineWidth=1.5;c.stroke();
  c.fillStyle=lg(c,0,-24,0,10,[[0,shade(col,.34)],[1,shade(col,.06)]]);c.beginPath();c.ellipse(0,-9,70,16,0,0,7);c.fill();
  c.strokeStyle="rgba(255,255,255,.5)";c.lineWidth=1.4;c.setLineDash([4,4]);c.beginPath();c.ellipse(0,-9,60,12,0,0,7);c.stroke();c.setLineDash([]);
  ell(c,-60,-12,22,8,"rgba(255,255,255,.35)");
  /* little pillow where the head goes */
  c.fillStyle=lg(c,0,-26,0,0,[[0,"#fffaf0"],[1,"#ecdcc0"]]);c.beginPath();c.ellipse(-52,-14,22,12,-.1,0,7);c.fill();c.strokeStyle="rgba(80,50,38,.25)";c.stroke();
  c.restore();
}

export function drawCounter(c){
  /* espresso machine */
  var x0=92;
  drop(c,"rgba(40,20,5,.35)",10,5,function(){box(c,x0,346,132,102,14,"#e6e3dd","#b8b4ab");});
  box(c,x0-4,336,140,20,9,"#f3f0ea","#c8c4bb");box(c,x0,398,132,10,3,"#c9683f","#a9512d");
  for(var k=0;k<3;k++)ell(c,x0+30+k*36,330,10,6.5,k===1?"#fbf4ea":"#8fb5c9");
  [x0+30,x0+86].forEach(function(gx){box(c,gx-14,408,28,9,3,"#3a3330","#231e1c");box(c,gx+8,411,24,6,3,"#3a3330","#231e1c");});
  c.fillStyle="#4a423e";c.fillRect(x0+10,438,112,8);c.fillStyle="rgba(255,255,255,.25)";for(var gx2=x0+14;gx2<x0+118;gx2+=7)c.fillRect(gx2,438,2,8);
  c.fillStyle=lg(c,0,360,0,390,[[0,"#fffdf7"],[1,"#e8e2d6"]]);c.beginPath();c.arc(x0+36,376,13,0,7);c.fill();c.strokeStyle="#9a948a";c.lineWidth=2.4;c.stroke();
  c.strokeStyle="#c9683f";c.lineWidth=2;c.lineCap="round";c.beginPath();c.moveTo(x0+36,376);c.lineTo(x0+44,370);c.stroke();ell(c,x0+36,376,2,2,DARK);
  ell(c,x0+82,372,5,5,"#e0584a");ell(c,x0+100,372,5,5,"#8fae8b");rr(c,x0+66,386,48,5,2.5,"#c8c4bb");
  c.strokeStyle="#b8b4ab";c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(x0+130,380);c.quadraticCurveTo(x0+142,392,x0+132,410);c.stroke();
  /* grinder */
  drop(c,"rgba(40,20,5,.3)",6,3,function(){box(c,248,386,34,62,8,"#c9683f","#a9512d");});
  c.fillStyle="rgba(235,245,248,.6)";c.beginPath();c.moveTo(246,386);c.lineTo(284,386);c.lineTo(274,350);c.lineTo(256,350);c.closePath();c.fill();c.strokeStyle="rgba(120,140,150,.6)";c.lineWidth=1.6;c.stroke();
  c.fillStyle="#6b4636";c.beginPath();c.moveTo(249,386);c.lineTo(281,386);c.lineTo(274,366);c.lineTo(256,366);c.closePath();c.fill();box(c,254,344,22,8,3,"#7a6a5e","#5b4a40");
  rr(c,252,408,26,8,3,"rgba(255,255,255,.45)");
  /* tip jar + bell */
  jar(c,310,408,28,34,"#e8c46a","#8fae8b");ell(c,324,430,8,3,"#f1cf7a");c.fillStyle="#fff";c.font="700 7px Fredoka, sans-serif";c.textAlign="center";c.fillText("tips",324,422);
  drop(c,"rgba(40,20,5,.3)",4,2,function(){c.fillStyle=lg(c,350,0,376,0,[[0,"#f6d97a"],[1,"#c9a13a"]]);c.beginPath();c.arc(364,436,10,Math.PI,0);c.fill();});ell(c,364,437,13,3,"#b88a2e");ell(c,364,424,2.6,2.6,"#fff3b8");
  /* pastry cloche on a cake stand */
  ell(c,436,444,52,8,"#f9f0e2");box(c,430,438,12,10,3,"#f3ebdc","#d8cdb8");ell(c,436,438,48,7,"#fffaf0");
  ell(c,420,426,18,9,"#e8b25f",-.2);ell(c,418,423,7,3,"rgba(255,255,255,.4)");ell(c,447,428,14,8,"#d89a4a",.3);ell(c,436,418,9,6,"#f4a6b4");ell(c,436,414,3,3,"#e0584a");
  c.fillStyle="rgba(235,245,250,.42)";c.beginPath();c.moveTo(390,438);c.quadraticCurveTo(390,384,436,384);c.quadraticCurveTo(482,384,482,438);c.closePath();c.fill();
  c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=2;c.stroke();c.strokeStyle="rgba(255,255,255,.6)";c.lineWidth=3;c.beginPath();c.moveTo(402,424);c.quadraticCurveTo(402,396,422,392);c.stroke();ell(c,436,380,5,4,"#fff");
  /* counter top + front */
  drop(c,"rgba(40,20,5,.35)",10,6,function(){box(c,22,444,516,20,10,"#f0d9b0","#d8b886");});
  c.fillStyle="rgba(255,255,255,.5)";c.fillRect(34,446,492,3);c.strokeStyle="rgba(160,110,60,.15)";c.lineWidth=1;for(var gk=0;gk<8;gk++){c.beginPath();c.moveTo(40+gk*60,452+gk%2*3);c.lineTo(80+gk*60,454);c.stroke();}
  box(c,38,462,484,86,12,"#86a584","#6e8f6e");
  c.fillStyle="rgba(255,255,255,.14)";for(var cx=52;cx<510;cx+=30)rr(c,cx,470,11,70,5,"rgba(255,255,255,.14)");
  c.fillStyle="rgba(40,70,40,.18)";for(var cx2=63;cx2<510;cx2+=30)c.fillRect(cx2,470,2,70);
  box(c,34,544,492,14,5,"#6b4a3a","#4e3428");
  rr(c,232,498,96,26,9,"#fbf4ea","rgba(120,80,40,.3)",1.4);c.fillStyle="#6b4a3a";c.font="700 13px Fredoka, sans-serif";c.textAlign="center";c.fillText("Study Cafe",280,516);
}
export function buildBeam(){
  var cv=document.createElement("canvas");cv.width=1280;cv.height=720;var c=cv.getContext("2d");
  /* four panes of window light falling across the floor */
  var g=c.createLinearGradient(0,320,0,720);g.addColorStop(0,"rgba(255,244,205,.34)");g.addColorStop(1,"rgba(255,244,205,0)");
  c.fillStyle=g;
  [[706,894,-1],[920,1114,1]].forEach(function(p){
    c.beginPath();c.moveTo(p[0],324);c.lineTo(p[1],324);c.lineTo(p[1]-330,720);c.lineTo(p[0]-330,720);c.closePath();c.fill();
  });
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
