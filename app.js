var J={hr:75,emax:2.9,rsys:1.1,ava:3,mva:4,mra:0,comp:!0},_=480,vt=.07,Bt=12,Dt=1.25,Vt=.04,gt=.18,Gt=.45,jt=8,D=.16,N=class{constructor(){this.p={...J};this.t=
0;this.vlv=118;this.vla=45;this.pao=85;this.ppv=11;this.fwdAcc=0;this.plv=0;this.pla=0;this.qav=0;this.qmv=0;this.qmr=0;this.ev=0;this.ea=0;this.tc=0;this.T=.8;
this.cycle=0;this.phase="diastasis";this.mvOpen=!1;this.avOpen=!1;this.ejectedThisBeat=!1;this.s1Done=!1;this.s2Done=!1;this.stats=null;this.bins=Array.from({length:_},
()=>({plv:0,pla:0,pao:0,vlv:0,vla:0,ecg:0,pcg:0}));this.onS1=()=>{};this.onS2=()=>{};this.pcgBurst=0;this.murmur=0;this.murmurKind="none";this.acc=this.freshAcc()}freshAcc(){
return{vmax:-1,vmin:1e9,pmax:-1,pmin:1e9,psum:0,n:0,lvmax:0,lvedp:0,lamax:-1,lamin:1e9,lasum:0,fwd:0,reg:0,avg:0,avn:0,mvg:0,mvn:0}}get period(){return 60/this.
p.hr}sysDur(e){return .24+.12*e}actV(e,a){let i=this.sysDur(a),s=.36*i;return e<i?.5*(1-Math.cos(Math.PI*e/i)):e<i+s?.5*(1+Math.cos(Math.PI*(e-i)/s)):0}actA(e){
return e>=0&&e<.1?Math.sin(Math.PI*e/.1)**2:0}ecgAt(e,a){let i=(m,n,l)=>l*Math.exp(-((e-m)**2)/(2*n*n)),s=this.sysDur(a);return i(.05,.022,.15)+i(D-.012,.006,-.12)+
i(D+.005,.0065,1)+i(D+.02,.006,-.25)+i(D+s*.9,.04,.3)}step(e){let a=this.p,i=this.period;this.T=i,this.t+=e;let s=this.tc;this.tc=this.t%i,this.tc<s&&this.endCycle(),
this.ev=this.actV((this.tc-D+i)%i,i),this.ea=this.actA(this.tc),this.plv=(vt+(a.emax-vt)*this.ev)*(this.vlv-Bt),this.pla=(gt+(Gt-gt)*this.ea)*(this.vla-jt);let m=this.
pla-this.plv,n=this.plv-this.pao;this.qmv=m>0?100*a.mva*Math.sqrt(m/4):0,this.qav=n>0?100*a.ava*Math.sqrt(n/4):0,this.qmr=m<0&&a.mra>0?100*a.mra*Math.sqrt(-m/4):
0;let l=(this.ppv-this.pla)/Vt,x=(this.pao-4)/a.rsys;this.vlv+=e*(this.qmv-this.qav-this.qmr),this.vla+=e*(l-this.qmv+this.qmr),this.pao+=e*(this.qav-x)/Dt;let d=this.
qmv>0,v=this.qav>0;this.avOpen&&!v&&!this.s2Done&&(this.s2Done=!0,this.onS2(),this.pcgBurst=.8),v&&(this.ejectedThisBeat=!0),this.mvOpen=d,this.avOpen=v,this.murmurKind=
"none",this.murmur=0,this.qmr>5?(this.murmurKind="mr",this.murmur=Math.min(1,this.qmr/350)):v&&a.ava<1.6?(this.murmurKind="as",this.murmur=Math.min(1,n*this.qav/
4e4)):d&&a.mva<2&&(this.murmurKind="ms",this.murmur=Math.min(1,m*this.qmv/4e3)*.8),this.pcgBurst*=Math.exp(-e/.03);let u=this.phase;this.ev<.02&&this.tc<D+.05?this.
phase="atrial":v&&!this.s2Done?this.phase="ejection":!d&&this.ev>.02&&!this.ejectedThisBeat?this.phase="ivc":!d&&this.ejectedThisBeat?this.phase="ivr":d&&this.qmv>
120?this.phase="rapid":this.phase="diastasis",(this.phase==="ivc"||this.phase==="ejection"&&u==="atrial")&&!this.s1Done&&(this.s1Done=!0,this.onS1(),this.pcgBurst=
1),this.phase==="ivr"&&u==="ejection"&&this.s2Done&&(this.phase="ivr");let c=this.acc;c.n++,this.vlv>c.vmax&&(c.vmax=this.vlv,c.lvedp=this.plv),c.vmin=Math.min(
c.vmin,this.vlv),c.pmax=Math.max(c.pmax,this.pao),c.pmin=Math.min(c.pmin,this.pao),c.psum+=this.pao,c.lvmax=Math.max(c.lvmax,this.plv),c.lamax=Math.max(c.lamax,
this.pla),c.lamin=Math.min(c.lamin,this.pla),c.lasum+=this.pla,c.fwd+=this.qav*e,c.reg+=this.qmr*e,v&&(c.avg+=n,c.avn++),d&&(c.mvg+=m,c.mvn++),this.fwdAcc+=this.
qav*e;let b=this.bins[Math.min(_-1,Math.floor(this.tc/i*_))];b.plv=this.plv,b.pla=this.pla,b.pao=this.pao,b.vlv=this.vlv,b.vla=this.vla,b.ecg=this.ecgAt(this.tc,
i),b.pcg=this.pcgBurst*Math.sin(this.t*2*Math.PI*55)+this.murmur*(Math.random()*2-1)*.55}endCycle(){let e=this.acc,a=this.period;if(e.n>10){let i=e.vmax-e.vmin;
this.stats={sys:e.pmax,dia:e.pmin,map:e.psum/e.n,lvPeak:e.lvmax,lvedp:e.lvedp,laMean:e.lasum/e.n,laMax:e.lamax,laMin:e.lamin,edv:e.vmax,esv:e.vmin,sv:i,fwdSv:e.
fwd,ef:100*i/e.vmax,co:e.fwd*this.p.hr/1e3,avGradMean:e.avn?e.avg/e.avn:0,mvGradMean:e.mvn?e.mvg/e.mvn:0,regFrac:i>0?100*e.reg/(e.reg+e.fwd):0},this.p.comp&&(this.
ppv=Math.max(6,Math.min(32,this.ppv+.6*(5-this.stats.co))))}this.acc=this.freshAcc(),this.ejectedThisBeat=!1,this.s1Done=!1,this.s2Done=!1,this.cycle++}settle(e){
let i=Math.floor(e/2e-4);for(let s=0;s<i;s++)this.step(2e-4)}};var ot=[{id:"normal",name:"Normal",p:{},look:"Textbook cycle: aortic ~120/80, EDV ~120 mL, EF ~55–60%. Watch S1 at mitral closure and S2 at aortic closure."},
{id:"as",name:"Aortic stenosis",p:{ava:.7},look:"LV pressure towers above aortic pressure during ejection — the gradient. Crescendo–decrescendo systolic murmur \
between S1 and S2."},{id:"ms",name:"Mitral stenosis",p:{mva:1},look:"Left atrial pressure stays high above LV pressure through diastole. Low-pitched diastolic r\
umble; the atrium is working hard."},{id:"mr",name:"Mitral regurgitation",p:{mra:.45},look:'No true isovolumetric phase. A large "v" wave on the atrial trace, a\
 holosystolic murmur, and an EF that looks good while forward output is half the total.'},{id:"hf",name:"Heart failure (HFrEF)",p:{emax:.9},look:"The ESPVR line\
 flattens. The ventricle dilates (big EDV), EF falls to ~30% and filling pressure rises to keep output up."},{id:"htn",name:"High afterload",p:{rsys:1.7},look:"\
Systemic resistance up: aortic pressure rises, the PV loop gets taller and narrower, the stroke volume is harder to eject."}];import*as r from"three";import{OrbitControls as Ft}from"three/examples/jsm/controls/OrbitControls.js";var tt=class{constructor(e){this.host=e;this.scene=new r.Scene;
this.root=new r.Group;this.lvGroup=new r.Group;this.laGroup=new r.Group;this.aoGroup=new r.Group;this.mvLeaflets=[];this.avCusps=[];this.explode=.35;this.cut=!0;
this.flow=!0;this.anchors={};this.renderer=new r.WebGLRenderer({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(Math.min(2,window.devicePixelRatio)),
this.renderer.toneMapping=r.ACESFilmicToneMapping,e.appendChild(this.renderer.domElement),this.camera=new r.PerspectiveCamera(38,1,.1,100),this.camera.position.
set(3,1.6,8.6),this.controls=new Ft(this.camera,this.renderer.domElement),this.controls.target.set(-.05,.55,0),this.controls.enableDamping=!0,this.controls.minDistance=
3,this.controls.maxDistance=12,this.controls.autoRotate=!1,this.scene.add(new r.HemisphereLight("#dfefff","#20140f",.9));let a=new r.DirectionalLight("#ffffff",
2.2);a.position.set(3,5,4),this.scene.add(a);let i=new r.DirectionalLight("#49D6D0",1.4);i.position.set(-4,2,-3),this.scene.add(i),this.lvMat=new r.MeshStandardMaterial(
{color:"#b5524a",roughness:.55,side:r.DoubleSide,emissive:"#49D6D0",emissiveIntensity:0}),this.scene.add(this.root),this.root.add(this.lvGroup,this.laGroup,this.
aoGroup),this.build();let s=420;this.pu=new Float32Array(s),this.pjit=new Float32Array(s*3);for(let n=0;n<s;n++)this.pu[n]=Math.random(),this.pjit[n*3]=Math.random()*
2-1,this.pjit[n*3+1]=Math.random()*2-1,this.pjit[n*3+2]=Math.random()*2-1;let m=new r.BufferGeometry;m.setAttribute("position",new r.BufferAttribute(new Float32Array(
s*3),3)),m.setAttribute("color",new r.BufferAttribute(new Float32Array(s*3),3)),this.particles=new r.Points(m,new r.PointsMaterial({size:.055,vertexColors:!0,transparent:!0,
opacity:.95,depthWrite:!1})),this.root.add(this.particles),new ResizeObserver(()=>this.resize()).observe(e),this.resize()}lathe(e,a){return new r.LatheGeometry(
e.map(([i,s])=>new r.Vector2(i,s)),64,a?0:Math.PI*.5,a?Math.PI*2:Math.PI)}lvProfile(){let e=[];for(let a=0;a<=40;a++){let i=a/40*(Math.PI/2);e.push([.62*Math.sin(
i),-1.6+1.6*(1-Math.cos(i))])}return e.push([.62,.35]),e.push([.5,.6]),e}laProfile(){let e=[];for(let a=0;a<=32;a++){let i=a/32*Math.PI;e.push([.42*Math.sin(i)+
.001,-.38*Math.cos(i)])}return e}build(){[this.lvGroup,this.laGroup,this.aoGroup].forEach(u=>u.clear()),this.mvLeaflets=[],this.avCusps=[];let e=!this.cut,a=new r.MeshStandardMaterial(
{color:"#7a0f16",roughness:.35,side:r.DoubleSide,transparent:!0,opacity:.55});this.lvOut=new r.Mesh(this.lathe(this.lvProfile(),e),this.lvMat),this.lvIn=new r.Mesh(
this.lathe(this.lvProfile(),e),a),this.lvGroup.add(this.lvOut,this.lvIn);let i=new r.MeshStandardMaterial({color:"#c8786a",roughness:.6,side:r.DoubleSide});this.
laOut=new r.Mesh(this.lathe(this.laProfile(),e),i),this.laIn=new r.Mesh(this.lathe(this.laProfile(),e),a.clone()),this.laGroup.add(this.laOut,this.laIn),this.laGroup.
position.set(-.32,1.25,-.15),[[-.45,.1,-.25],[-.4,-.05,.2]].forEach(([u,c,b])=>{let f=new r.Mesh(new r.CylinderGeometry(.07,.07,.6,16,1,!0),i);f.rotation.z=Math.
PI/2,f.position.set(u-.25,c,b),this.laGroup.add(f)});let s=u=>new r.Mesh(new r.TorusGeometry(u,.025,8,40),new r.MeshStandardMaterial({color:"#f1e3c4",roughness:.4})),
m=s(.22);m.rotation.x=Math.PI/2,m.position.set(-.22,.62,0),this.lvGroup.add(m);let n=new r.MeshStandardMaterial({color:"#f3dcc0",roughness:.45,side:r.DoubleSide,
transparent:!0,opacity:.95});[-1,1].forEach(u=>{let c=new r.Group;c.position.set(-.22,.62,u*.22);let b=new r.Mesh(new r.PlaneGeometry(.4,.23),n);b.rotation.x=Math.
PI/2,b.position.z=-u*.11,c.add(b),c.userData.side=u,this.lvGroup.add(c),this.mvLeaflets.push(c)});let l=new r.CatmullRomCurve3([new r.Vector3(.28,.62,0),new r.Vector3(
.32,1.4,.05),new r.Vector3(.2,2.25,-.1),new r.Vector3(-.45,2.55,-.45),new r.Vector3(-.95,2.1,-.75),new r.Vector3(-1.05,.6,-.8)]),x=new r.MeshStandardMaterial({color:"\
#d88b7a",roughness:.5,side:r.DoubleSide,transparent:!0,opacity:this.cut?.55:.95});this.aorta=new r.Mesh(new r.TubeGeometry(l,80,.2,24,!1),x),this.aoGroup.add(this.
aorta),this.aoGroup.userData.curve=l;let d=s(.2);d.rotation.x=Math.PI/2,d.position.set(.28,.64,0),this.aoGroup.add(d);for(let u=0;u<3;u++){let c=u/3*Math.PI*2,b=new r.Group;
b.position.set(.28+Math.cos(c)*.2,.64,Math.sin(c)*.2),b.rotation.y=-c;let f=new r.Mesh(new r.CircleGeometry(.2,20,-Math.PI/3,Math.PI*2/3),n);f.rotation.x=-Math.
PI/2,f.position.x=-.2;let w=new r.Group;w.add(f),b.add(w),this.aoGroup.add(b),this.avCusps.push(w)}let v=(u,c,b,f,w)=>{let q=new r.Object3D;q.position.set(b,f,w),
c.add(q),this.anchors[u]=q};v("lv",this.lvGroup,.55,-.7,.3),v("la",this.laGroup,-.45,.25,.1),v("ao",this.aoGroup,-.45,2.6,-.45),v("mv",this.lvGroup,-.22,.62,.25),
v("av",this.aoGroup,.5,.75,.1)}resize(){let e=this.host.clientWidth,a=this.host.clientHeight;this.renderer.setSize(e,a,!1),this.camera.aspect=e/Math.max(1,a),this.
camera.updateProjectionMatrix(),this.fit()}fit(){let e=2.1+this.explode*.8,a=this.camera.fov*Math.PI/180,i=2*Math.atan(Math.tan(a/2)*this.camera.aspect),s=e/Math.
sin(Math.min(a,i)/2),m=this.camera.position.clone().sub(this.controls.target).normalize();this.controls.target.set(-.15-this.explode*.1,.62+this.explode*.4,0),this.
camera.position.copy(this.controls.target).addScaledVector(m,s),this.controls.maxDistance=s*1.6,this.controls.minDistance=s*.35}update(e,a){let i=this.explode;this.
laGroup.position.set(-.32-i*.7,1.25+i*.9,-.15-i*.2),this.aoGroup.position.set(i*.9,i*1.1,i*.1),this.lvGroup.position.set(0,-i*.4,0);let s=Math.cbrt(Math.max(5,e.
vlv)/120),m=Math.cbrt((e.vlv+150)/120);this.lvIn.scale.set(s,.75+.25*s,s),this.lvOut.scale.set(m*.9,.82+.25*m*.9,m*.9),this.lvOut.position.y=-.03;let n=Math.cbrt(
Math.max(5,e.vla)/45);this.laIn.scale.setScalar(n*.92),this.laOut.scale.setScalar(n);let l=e.ecgAt(e.tc,e.T);this.lvMat.emissiveIntensity=Math.max(0,l-.3)*1.4;let x=Math.
min(1,e.qmv/220)*Math.min(1,e.p.mva/4);this.mvLeaflets.forEach(v=>{v.rotation.x=v.userData.side*(Math.PI/2)*(.08+.85*x)*-1});let d=Math.min(1,e.qav/260)*Math.min(
1,e.p.ava/3);this.avCusps.forEach(v=>{v.rotation.z=-(Math.PI/2)*(.05+.85*d)}),this.flow&&this.moveParticles(e,a),this.particles.visible=this.flow,this.controls.
update(),this.renderer.render(this.scene,this.camera)}pathPoint(e,a,i,s){let m=this.laGroup.position,n=this.lvGroup.position,l=this.aoGroup.position;if(e<.18){a.
set(m.x+i[0]*.26,m.y+i[1]*.24,m.z+i[2]*.26);return}if(e<.3){let d=(e-.18)/.12;a.set(m.x+i[0]*.25,m.y+i[1]*.22,m.z+i[2]*.25),a.lerp(new r.Vector3(-.22+n.x,.7+n.y,
n.z),d*d);return}if(e<.36){let d=(e-.3)/.06;a.set(-.22+n.x+i[0]*.12,.65-.5*d+n.y,n.z+i[2]*.12);return}if(e<.62){let d=(e-.36)/.26,v=d*Math.PI,u=.38*s;a.set(n.x-
.2*Math.cos(v)+i[0]*.18*s,n.y+.15-1.25*Math.sin(v)*s*(.6+.4*(1-Math.abs(d-.5)*2)),n.z+i[2]*u*.6),a.x+=.25*d;return}if(e<.68){let d=(e-.62)/.06;a.set(.28+n.x+i[0]*
.1,n.y+.2+.45*d+(l.y-n.y)*d,n.z+i[2]*.1),a.x+=(l.x-n.x)*d;return}this.aoGroup.userData.curve.getPointAt(Math.min(1,(e-.68)/.32),a),a.add(l),a.x+=i[0]*.1,a.z+=i[2]*
.1}moveParticles(e,a){let i=this.particles.geometry.attributes.position,s=this.particles.geometry.attributes.color,m=Math.cbrt(Math.max(5,e.vlv)/120),n=new r.Vector3,
l=this.pu.length;for(let x=0;x<l;x++){let d=this.pu[x],v=0,u=!1;d<.18?v=.05:d<.36?v=.02+e.qmv/1600:d<.62?(v=.01+(e.qmv+e.qav)/2600,e.qmr>20&&x%3===0&&(u=!0,v=-e.
qmr/1200)):d<.68?v=e.qav/900:v=.04+e.qav/2200,d+=v*a*3,u&&d<.36&&(d=.3+Math.random()*.05),d>=1&&(d-=1),this.pu[x]=d,this.pathPoint(d,n,[this.pjit[x*3],this.pjit[x*
3+1],this.pjit[x*3+2]],m),i.setXYZ(x,n.x,n.y,n.z),u?s.setXYZ(x,1,.75,.2):s.setXYZ(x,1,.25+.15*(x%3)/3,.25)}i.needsUpdate=!0,s.needsUpdate=!0}project(e){let a=this.
anchors[e];if(!a)return null;let i=new r.Vector3;a.getWorldPosition(i),i.project(this.camera);let s=this.renderer.domElement.getBoundingClientRect();return{x:(i.
x*.5+.5)*s.width,y:(-i.y*.5+.5)*s.height,behind:i.z>1}}};var ft={subtitle:"TEARDOWN 01 · THE CARDIAC CYCLE",basic:"Basic",advanced:"Advanced",soundOn:"Sound on",soundOff:"Sound off",how:"How it works",p_normal:"Norma\
l",p_as:"Aortic stenosis",p_ms:"Mitral stenosis",p_mr:"Mitral regurgitation",p_hf:"Heart failure (HFrEF)",p_htn:"High afterload",l_normal:"Textbook cycle: aorti\
c ~120/80, EDV ~120 mL, EF ~55–60%. S1 = mitral closes, S2 = aortic closes.",l_as:"LV pressure towers above aortic pressure during ejection — the gradient. Cr\
escendo–decrescendo systolic murmur.",l_ms:"Atrial pressure stays high above LV pressure through diastole. Low diastolic rumble.",l_mr:'No true isovolumetric \
phase. Big "v" wave, holosystolic murmur, and only half the stroke volume goes forward.',l_hf:"Contractility falls: the ventricle dilates, EF drops to ~30% and \
filling pressure rises to keep output up.",l_htn:"Systemic resistance up: aortic pressure rises, the PV loop gets taller and narrower.",custom:"Custom",customText:"\
You're changing the physics. With compensation on, filling pressure adapts over ~20 beats.",ph_atrial:"Atrial systole",ph_ivc:"Isovolumetric contraction",ph_ejection:"\
Ejection",ph_ivr:"Isovolumetric relaxation",ph_rapid:"Rapid filling",ph_diastasis:"Diastasis",s_atrial:"The atrium contracts and tops up the ventricle.",s_ivc:"\
Ventricle contracts with both valves shut — S1.",s_ejection:"Aortic valve open: blood leaves the ventricle.",s_ivr:"Aortic valve shuts — S2. Pressure falls, v\
olume stays the same.",s_rapid:"Mitral valve opens; blood rushes into the ventricle.",s_diastasis:"Slow filling as the pressures equalise.",x_atrial:'After the \
P wave, the atrium contracts and completes ventricular filling. This is the "a" wave on the atrial pressure trace.',x_ivc:"After the QRS the ventricle contracts\
. LV pressure rises above atrial pressure, so the mitral valve shuts — S1. Both valves are closed: pressure climbs, volume cannot change.",x_ejection:"LV pres\
sure exceeds aortic pressure, the aortic valve opens and the stroke volume is ejected — rapidly at first, then more slowly. The T wave appears near the end.",
x_ivr:"LV pressure falls below aortic pressure and the aortic valve shuts — S2 and the dicrotic notch. Both valves closed again: pressure falls, volume stays th\
e same.",x_rapid:"LV pressure drops below atrial pressure, the mitral valve opens and blood stored in the atrium rushes in. An S3 would be heard here.",x_diastasis:"\
Slow filling as atrial and ventricular pressures equalise. The first phase to shrink when the heart rate rises.",mrNote:" With mitral regurgitation it is not tr\
uly isovolumetric: blood already leaks back into the atrium.",tp_atrial:"Atrial",tp_ivc:"IVC",tp_ejection:"Ejection",tp_ivr:"IVR",tp_rapid:"Rapid fill",tp_diastasis:"\
Diastasis",more:"More",less:"Less",r_bp:"Blood pressure",r_hr:"Heart rate",r_co:"Cardiac output",r_edv:"End-diastolic vol.",r_esv:"End-systolic vol.",r_ef:"Ejec\
tion fraction",r_sv:"Stroke volume",r_lvedp:"LV end-diastolic P",r_la:"LA mean pressure",r_avg:"Aortic valve gradient",r_mvg:"Mitral valve gradient",r_rf:"Regur\
gitant fraction",normal:"normal",fwd:"forward",mean:"mean",lab_lv:"LEFT VENTRICLE",lab_la:"LEFT ATRIUM",lab_ao:"AORTA",lab_mv:"MITRAL",lab_av:"AORTIC",open:"OPE\
N",closed:"CLOSED",leaking:"LEAKING",back:"back",wig:"WIGGERS DIAGRAM · calculated live by the model",pv:"PRESSURE–VOLUME LOOP",timeline:"ONE HEARTBEAT",c_ao:"\
Aorta",c_lv:"LV",c_la:"LA",c_vol:"LV volume",e_avo:"AV opens",e_avc:"AV closes · S2",e_mvo:"MV opens",e_mvc:"MV closes · S1",vol:"LV volume (mL)",espvr:"ESPVR\
 (contractility)",svef:"SV",explode:"Explode",cut:"Cutaway",flow:"Blood flow",labels:"Labels",pause:"Pause",play:"Play",step:"Step 10 ms",hint:"Drag to rotate ·\
 pinch or scroll to zoom",k_hr:"Heart rate",d_hr:"Paced rate — no sympathetic boost to contractility.",k_emax:"Contractility (Emax)",d_emax:"Slope of the ESPV\
R line.",k_rsys:"Afterload (SVR)",d_rsys:"Systemic vascular resistance, mmHg·s/mL.",k_ava:"Aortic valve area",d_ava:"Normal 3–4 · severe AS ≤ 1.0",k_mva:"\
Mitral valve area",d_mva:"Normal 4–6 · severe MS ≤ 1.5",k_mra:"Mitral regurgitant orifice",d_mra:"EROA · severe MR ≥ 0.4",comp:"Chronic compensation",compD:"\
Fluid retention raises filling pressure to restore output",on:"ON",off:"OFF",physics:"CHANGE THE PHYSICS",u_mmHg:"mmHg",u_mL:"mL",u_bpm:"bpm",u_Lmin:"L/min",u_mLs:"\
mL/s",close:"Close",disc:"Educational simulation. Not a medical device and not clinical guidance."},Nt={subtitle:"РАЗБОР 01 · СЕРДЕЧНЫЙ ЦИКЛ",
basic:"Базовый",advanced:"Расширенный",soundOn:"Звук вкл.",soundOff:"Звук выкл.",how:"Как это работает",p_normal:"\
Норма",p_as:"Аортальный стеноз",p_ms:"Митральный стеноз",p_mr:"Митральная регургитация",p_hf:"Сердечн\
ая недостаточность (сниж. ФВ)",p_htn:"Высокая постнагрузка",l_normal:"Цикл как в учебнике: давление в аорте ~120/80, К\
ДО ~120 мл, ФВ ~55–60%. I тон — закрытие митрального клапана, II тон — аортального.",l_as:"Во время изгна\
ния давление в ЛЖ намного выше аортального — это градиент. Систолический шум нарастающе-убывающего характера.",
l_ms:"Давление в предсердии остаётся выше давления в ЛЖ на протяжении диастолы. Низкочастотный диастолический шум.",
l_mr:"Нет истинной изоволюмической фазы. Большая волна «v», пансистолический шум; вперёд уходит лишь половина ударного объёма.",
l_hf:"Сократимость снижена: желудочек расширяется, ФВ падает до ~30%, давление наполнения растёт, чтобы сохранить выброс.",
l_htn:"Сосудистое сопротивление повышено: давление в аорте растёт, петля давление–объём становится выше и уже.",
custom:"Свои параметры",customText:"Вы меняете физику. При включённой компенсации давление наполнения адаптируется примерно за 20 сокращений.",
ph_atrial:"Систола предсердия",ph_ivc:"Изоволюмическое сокращение",ph_ejection:"Изгнание",ph_ivr:"Изоволюмичес\
кое расслабление",ph_rapid:"Быстрое наполнение",ph_diastasis:"Диастазис",s_atrial:"Предсердие сокращается и дополняет н\
аполнение желудочка.",s_ivc:"Желудочек сокращается при закрытых клапанах — I тон.",s_ejection:"Аор\
тальный клапан открыт: кровь выбрасывается в аорту.",s_ivr:"Аортальный клапан закрывается — II тон. Давление падает, \
объём не меняется.",s_rapid:"Митральный клапан открывается, кровь устремляется в желудочек.",
s_diastasis:"Медленное наполнение: давления выравниваются.",x_atrial:"После зубца P предсердие сокращается и завершает н\
аполнение желудочка. На кривой давления в предсердии — волна «a».",x_ivc:"После комплекса QRS желудочек со\
кращается. Давление в ЛЖ превышает предсердное, митральный клапан закрывается — I тон. Оба клапана закрыты: давление растёт, объём не меняется.",
x_ejection:"Давление в ЛЖ превышает аортальное, аортальный клапан открывается, и ударный объём выбрасывается — сначала быстро, затем медленнее. Ближе к концу по\
является зубец T.",x_ivr:"Давление в ЛЖ падает ниже аортального, аортальный клапан закрывается — II тон и дикротическая выемка. Оба клапана закрыты\
: давление падает, объём не меняется.",x_rapid:"Давление в ЛЖ становится ниже предсердного, митральный клапан открывается, и накопл\
енная в предсердии кровь быстро поступает в желудочек. Здесь может выслушиваться III тон.",
x_diastasis:"Медленное наполнение по мере выравнивания давлений в предсердии и желудочке. Эта фаза первой укорачивается при учащении ритма.",
mrNote:" При митральной регургитации фаза не истинно изоволюмическая: кровь уже уходит обратно в предсердие.",
tp_atrial:"Сист. пр.",tp_ivc:"ИС",tp_ejection:"Изгнание",tp_ivr:"ИР",tp_rapid:"Быстр. нап.",tp_diastasis:"Диастазис",more:"По\
дробнее",less:"Свернуть",r_bp:"АД в аорте",r_hr:"ЧСС",r_co:"Сердечный выброс",r_edv:"КДО",r_esv:"КСО",r_ef:"Фракц\
ия выброса",r_sv:"Ударный объём",r_lvedp:"КДД ЛЖ",r_la:"Ср. давление в ЛП",r_avg:"Градиент на АК",r_mvg:"Град\
иент на МК",r_rf:"Фракция регургитации",normal:"норма",fwd:"вперёд",mean:"средн.",lab_lv:"ЛЕВЫЙ ЖЕЛУДОЧЕК",
lab_la:"ЛЕВОЕ ПРЕДСЕРДИЕ",lab_ao:"АОРТА",lab_mv:"МИТРАЛЬНЫЙ",lab_av:"АОРТАЛЬНЫЙ",open:"ОТКРЫТ",closed:"ЗАКРЫТ",
leaking:"РЕГУРГИТАЦИЯ",back:"назад",wig:"ДИАГРАММА ВИГГЕРСА · рассчитана моделью в реальном времени",
pv:"ПЕТЛЯ ДАВЛЕНИЕ–ОБЪЁМ",timeline:"ОДНО СОКРАЩЕНИЕ",c_ao:"Аорта",c_lv:"ЛЖ",c_la:"ЛП",c_vol:"Объём ЛЖ",e_avo:"\
АК открыт",e_avc:"АК закрыт · II тон",e_mvo:"МК открыт",e_mvc:"МК закрыт · I тон",vol:"Объём ЛЖ (мл)",espvr:"ES\
PVR (сократимость)",svef:"УО",explode:"Разобрать",cut:"Разрез",flow:"Кровоток",labels:"Подписи",pause:"Пауза",play:"\
Пуск",step:"Шаг 10 мс",hint:"Вращайте мышью · масштаб колесом",k_hr:"ЧСС",d_hr:"Навязанный ритм — без симпатического уси\
ления сократимости.",k_emax:"Сократимость (Emax)",d_emax:"Наклон линии ESPVR.",k_rsys:"Постнагрузка (ОПСС)",
d_rsys:"Общее периферическое сопротивление, мм рт. ст.·с/мл.",k_ava:"Площадь аортального клапана",
d_ava:"Норма 3–4 · тяжёлый АС ≤ 1,0",k_mva:"Площадь митрального клапана",d_mva:"Норма 4–6 · тяжёлый МС ≤ 1,5",
k_mra:"Площадь отверстия регургитации",d_mra:"EROA · тяжёлая МР ≥ 0,4",comp:"Хроническая компенсация",
compD:"Задержка жидкости повышает давление наполнения и восстанавливает выброс",on:"ВКЛ",off:"\
ВЫКЛ",physics:"ИЗМЕНИТЕ ФИЗИКУ",u_mmHg:"мм рт. ст.",u_mL:"мл",u_bpm:"уд/мин",u_Lmin:"л/мин",u_mLs:"мл/с",close:"Закрыть",
disc:"Учебная симуляция. Не является медицинским изделием и клиническим руководством."},Qt={
subtitle:"TAHLIL 01 · YURAK SIKLI",basic:"Oddiy",advanced:"Kengaytirilgan",soundOn:"Ovoz yoniq",soundOff:"Ovoz o'chiq",how:"Qanday ishlaydi",p_normal:"Me'yor",
p_as:"Aorta stenozi",p_ms:"Mitral stenoz",p_mr:"Mitral regurgitatsiya",p_hf:"Yurak yetishmovchiligi (past OF)",p_htn:"Yuqori postyuklama",l_normal:"Darslikdagi \
sikl: aorta bosimi ~120/80, diastola oxiridagi hajm ~120 ml, OF ~55–60%. I ton — mitral qopqoq yopilishi, II ton — aorta qopqog'i yopilishi.",l_as:"Qon ha\
ydash paytida chap qorincha bosimi aorta bosimidan ancha yuqori — bu gradiyent. Kuchayib-pasayuvchi sistolik shovqin.",l_ms:"Diastola davomida bo'lmacha bosim\
i chap qorincha bosimidan yuqori bo'lib qoladi. Past chastotali diastolik shovqin.",l_mr:"Haqiqiy izovolyumik faza yo'q. Katta «v» to'lqin, golosistolik shovqin\
; zarb hajmining faqat yarmi oldinga ketadi.",l_hf:"Qisqaruvchanlik pasaygan: qorincha kengayadi, OF ~30% gacha tushadi, chiqarishni saqlash uchun to'lish bosim\
i oshadi.",l_htn:"Tomir qarshiligi oshgan: aorta bosimi ko'tariladi, bosim–hajm halqasi balandroq va torroq bo'ladi.",custom:"Maxsus",customText:"Siz fizikani\
 o'zgartiryapsiz. Kompensatsiya yoqilgan bo'lsa, to'lish bosimi taxminan 20 zarbada moslashadi.",ph_atrial:"Bo'lmacha sistolasi",ph_ivc:"Izovolyumik qisqarish",
ph_ejection:"Qon haydash",ph_ivr:"Izovolyumik bo'shashish",ph_rapid:"Tez to'lish",ph_diastasis:"Diastazis",s_atrial:"Bo'lmacha qisqarib, qorinchani to'liq to'ld\
iradi.",s_ivc:"Ikkala qopqoq yopiq holda qorincha qisqaradi — I ton.",s_ejection:"Aorta qopqog'i ochiq: qon aortaga haydaladi.",s_ivr:"Aorta qopqog'i yopiladi\
 — II ton. Bosim pasayadi, hajm o'zgarmaydi.",s_rapid:"Mitral qopqoq ochiladi, qon qorinchaga oqib kiradi.",s_diastasis:"Sekin to'lish: bosimlar tenglashadi.",
x_atrial:"P tishchasidan keyin bo'lmacha qisqaradi va qorinchaning to'lishini yakunlaydi. Bo'lmacha bosimi chizig'ida bu — «a» to'lqini.",x_ivc:"QRS komplek\
sidan keyin qorincha qisqaradi. Chap qorincha bosimi bo'lmachanikidan oshadi va mitral qopqoq yopiladi — I ton. Ikkala qopqoq yopiq: bosim oshadi, hajm o'zgarma\
ydi.",x_ejection:"Chap qorincha bosimi aorta bosimidan oshadi, aorta qopqog'i ochiladi va zarb hajmi haydaladi — avval tez, keyin sekinroq. Oxiriga yaqin T tish\
cha paydo bo'ladi.",x_ivr:"Chap qorincha bosimi aorta bosimidan pasayadi va aorta qopqog'i yopiladi — II ton va dikrotik kesik. Ikkala qopqoq yopiq: bosim pasay\
adi, hajm o'zgarmaydi.",x_rapid:"Chap qorincha bosimi bo'lmacha bosimidan pasayadi, mitral qopqoq ochiladi va bo'lmachada to'plangan qon tezda qorinchaga oqib k\
iradi. Bu yerda III ton eshitilishi mumkin.",x_diastasis:"Bo'lmacha va qorincha bosimlari tenglashib, sekin to'lish davom etadi. Yurak urishi tezlashganda birin\
chi bo'lib aynan shu faza qisqaradi.",mrNote:" Mitral regurgitatsiyada bu faza haqiqiy izovolyumik emas: qon allaqachon bo'lmachaga qaytib oqadi.",tp_atrial:"B.\
 sistola",tp_ivc:"IQ",tp_ejection:"Haydash",tp_ivr:"IB",tp_rapid:"Tez to'lish",tp_diastasis:"Diastazis",more:"Batafsil",less:"Yig'ish",r_bp:"Aorta bosimi",r_hr:"\
Yurak urishi",r_co:"Yurak daqiqalik hajmi",r_edv:"Diastola oxiri hajmi",r_esv:"Sistola oxiri hajmi",r_ef:"Otish fraksiyasi",r_sv:"Zarb hajmi",r_lvedp:"ChQ diast\
ola oxiri bosimi",r_la:"ChB o'rtacha bosimi",r_avg:"Aorta qopqog'i gradiyenti",r_mvg:"Mitral qopqoq gradiyenti",r_rf:"Regurgitatsiya fraksiyasi",normal:"me'yor",
fwd:"oldinga",mean:"o'rtacha",lab_lv:"CHAP QORINCHA",lab_la:"CHAP BO'LMACHA",lab_ao:"AORTA",lab_mv:"MITRAL QOPQOQ",lab_av:"AORTA QOPQOG'I",open:"OCHIQ",closed:"\
YOPIQ",leaking:"QAYTAR OQIM",back:"orqaga",wig:"VIGGERS DIAGRAMMASI · model tomonidan real vaqtda hisoblanadi",pv:"BOSIM–HAJM HALQASI",timeline:"BITTA YURAK \
ZARBI",c_ao:"Aorta",c_lv:"ChQ",c_la:"ChB",c_vol:"ChQ hajmi",e_avo:"AQ ochiladi",e_avc:"AQ yopiladi · II ton",e_mvo:"MQ ochiladi",e_mvc:"MQ yopiladi · I ton",vol:"\
ChQ hajmi (ml)",espvr:"ESPVR (qisqaruvchanlik)",svef:"ZH",explode:"Ajratish",cut:"Kesim",flow:"Qon oqimi",labels:"Yozuvlar",pause:"Pauza",play:"Davom",step:"Qad\
am 10 ms",hint:"Aylantirish uchun torting · kattalashtirish uchun g'ildirak",k_hr:"Yurak urishi",d_hr:"Sun'iy ritm — qisqaruvchanlikka simpatik ta'sirsiz.",k_emax:"\
Qisqaruvchanlik (Emax)",d_emax:"ESPVR chizig'ining qiyaligi.",k_rsys:"Postyuklama (SVR)",d_rsys:"Tizimli tomir qarshiligi, mm sim. ust.·s/ml.",k_ava:"Aorta qop\
qog'i maydoni",d_ava:"Me'yor 3–4 · og'ir AS ≤ 1,0",k_mva:"Mitral qopqoq maydoni",d_mva:"Me'yor 4–6 · og'ir MS ≤ 1,5",k_mra:"Regurgitatsiya teshigi may\
doni",d_mra:"EROA · og'ir MR ≥ 0,4",comp:"Surunkali kompensatsiya",compD:"Suyuqlik ushlanishi to'lish bosimini oshirib, chiqarishni tiklaydi",on:"YONIQ",off:"\
O'CHIQ",physics:"FIZIKANI O'ZGARTIRING",u_mmHg:"mm sim. ust.",u_mL:"ml",u_bpm:"zarba/daq",u_Lmin:"l/daq",u_mLs:"ml/s",close:"Yopish",disc:"O'quv simulyatsiyasi.\
 Tibbiy qurilma yoki klinik qo'llanma emas."},Wt={en:ft,ru:Nt,uz:Qt};function Yt(){let t=(location.hash||"").replace("#","");if(t==="ru"||t==="uz"||t==="en")return t;
try{let e=localStorage.getItem("sh.lang");if(e==="ru"||e==="uz"||e==="en")return e}catch{}return"en"}var V=Yt();function bt(t){V=t;try{localStorage.setItem("sh.\
lang",t)}catch{}}var o=t=>Wt[V][t]??ft[t]??t;var E={ao:"#F05252",lv:"#49D6D0",la:"#E9B65B",vol:"#c7a0ff",ecg:"#43e07a",pcg:"#8AAAB5",text:"#EDF4F5",muted:"#91A2AC",grid:"rgba(138,170,181,0.14)"},Kt={atrial:"\
rgba(233,182,91,0.07)",ivc:"rgba(240,82,82,0.10)",ejection:"rgba(73,214,208,0.07)",ivr:"rgba(240,82,82,0.10)",rapid:"rgba(199,160,255,0.07)",diastasis:"rgba(0,0\
,0,0)"},rt={atrial:"#E9B65B",ivc:"#F05252",ejection:"#49D6D0",ivr:"#d9607a",rapid:"#c7a0ff",diastasis:"#5d6f78"},xt=t=>o("tp_"+t),Q=class{constructor(){this.phase=
new Array(_).fill("diastasis");this.done=null;this.wraps=0;this.events=[];this.pending=[];this.lastBin=0;this.mv=!1;this.av=!1}update(e){let a=Math.min(_-1,Math.
floor(e.tc/e.T*_));a<this.lastBin&&(this.events=this.pending,this.pending=[],++this.wraps>=2&&(this.done=this.phase.slice())),this.lastBin=a,this.phase[a]=e.phase,
this.av!==e.avOpen&&this.pending.push({bin:a,label:e.avOpen?"e_avo":"e_avc"}),this.mv!==e.mvOpen&&(e.phase==="ivc"||e.phase==="rapid"||e.phase==="diastasis")&&!this.
pending.some(i=>i.label===(e.mvOpen?"e_mvo":"e_mvc"))&&this.pending.push({bin:a,label:e.mvOpen?"e_mvo":"e_mvc"}),this.mv=e.mvOpen,this.av=e.avOpen}};function yt(t,e,a,i=!1){
let s=t.getContext("2d"),m=t.width,n=t.height,l=m/t.clientWidth||1;s.clearRect(0,0,m,n);let x=54*l,d=m-12*l,v=Math.floor(e.tc/e.T*_),u=g=>x+g/(_-1)*(d-x),c=26*l,
b=i?n-34*l:n*.52,f=n*.56,w=n*.7,q=n*.8,H=n*.93,P=Math.max(140,Math.ceil(((e.stats?.lvPeak??120)+20)/20)*20),C=g=>b-Math.max(0,g)/P*(b-c),pt=Math.max(160,Math.ceil(
((e.stats?.edv??120)+20)/40)*40),Ot=g=>w-g/pt*(w-f),S=0;for(let g=1;g<=_;g++)(g===_||a.phase[g]!==a.phase[S])&&(s.fillStyle=Kt[a.phase[S]],s.fillRect(u(S),c-18*
l,u(g-1)-u(S),n-c),u(g-1)-u(S)>44*l&&(s.fillStyle=E.muted,s.font=`${10*l}px "IBM Plex Mono"`,s.fillText(xt(a.phase[S]),u(S)+4*l,c-6*l)),S=g);s.strokeStyle=E.grid,
s.lineWidth=1,s.fillStyle=E.muted,s.font=`${10*l}px "IBM Plex Mono"`;for(let g=0;g<=P;g+=P>160?40:20)s.beginPath(),s.moveTo(x,C(g)),s.lineTo(d,C(g)),s.stroke(),
s.fillText(String(g),14*l,C(g)+3*l);i||(s.fillText("mL",20*l,f+6*l),s.fillText(String(pt),14*l,f+18*l),s.fillText("ECG",10*l,q+3*l),s.fillText("PCG",10*l,H+3*l));
let O=(g,j,F=2.2)=>{s.strokeStyle=j,s.lineWidth=F*l,s.beginPath();let st=!1;for(let B=0;B<_;B++){let dt=(B-v+_)%_;if(dt>0&&dt<8){st=!1;continue}let ut=g(B);st?s.
lineTo(u(B),ut):(s.moveTo(u(B),ut),st=!0)}s.stroke()},z=e.bins;O(g=>C(z[g].pao),E.ao,i?3:2.2),O(g=>C(z[g].pla),E.la,i?3:2.2),O(g=>C(z[g].plv),E.lv,i?3.4:2.6),i||
(O(g=>Ot(z[g].vlv),E.vol),O(g=>q-z[g].ecg*30*l,E.ecg,1.6),O(g=>H-z[g].pcg*14*l,E.pcg,1.2)),s.font=`${10*l}px "IBM Plex Mono"`,a.events.forEach((g,j)=>{let F=u(g.
bin);s.strokeStyle="rgba(237,244,245,0.25)",s.setLineDash([3*l,4*l]),s.beginPath(),s.moveTo(F,c),s.lineTo(F,n-4*l),s.stroke(),s.setLineDash([]),s.fillStyle=g.label===
"e_avc"||g.label==="e_mvc"?E.text:E.muted,s.save(),s.translate(F+3*l,c+8*l+j%2*12*l),s.fillText(o(g.label),0,0),s.restore()});let zt=[[o("c_ao"),E.ao],[o("c_lv"),
E.lv],[o("c_la"),E.la],...i?[]:[[o("c_vol"),E.vol]]],ht=i?n-12*l:n*.535;s.font=`${11*l}px "IBM Plex Mono"`;let it=x;zt.forEach(([g,j])=>{s.fillStyle=j,s.fillRect(
it,ht-4*l,16*l,4*l),s.fillStyle=E.text,s.fillText(g,it+22*l,ht),it+=s.measureText(g).width+44*l}),s.strokeStyle="rgba(237,244,245,0.8)",s.lineWidth=1.5*l,s.beginPath(),
s.moveTo(u(v),c-18*l),s.lineTo(u(v),n),s.stroke()}function Et(t,e){let a=t.getContext("2d"),i=t.width,s=t.height,m=i/t.clientWidth||1;a.clearRect(0,0,i,s);let n=42*
m,l=i-12*m,x=14*m,d=s-30*m,v=260,u=Math.max(160,Math.ceil(((e.stats?.lvPeak??120)+20)/40)*40),c=f=>n+f/v*(l-n),b=f=>d-Math.max(0,f)/u*(d-x);a.strokeStyle=E.grid,
a.fillStyle=E.muted,a.font=`${10*m}px "IBM Plex Mono"`;for(let f=0;f<=v;f+=50)a.beginPath(),a.moveTo(c(f),x),a.lineTo(c(f),d),a.stroke(),a.fillText(String(f),c(
f)-8*m,d+14*m);for(let f=0;f<=u;f+=40)a.beginPath(),a.moveTo(n,b(f)),a.lineTo(l,b(f)),a.stroke(),a.fillText(String(f),6*m,b(f)+3*m);a.fillText(o("vol")+" →",l-
140*m,d+26*m),a.setLineDash([6*m,5*m]),a.lineWidth=1.5*m,a.strokeStyle="rgba(73,214,208,0.7)",a.beginPath(),a.moveTo(c(12),b(0)),a.lineTo(c(12+u/e.p.emax),b(u)),
a.stroke(),a.strokeStyle="rgba(145,162,172,0.6)",a.beginPath(),a.moveTo(c(12),b(0)),a.lineTo(c(v),b(.07*(v-12))),a.stroke(),a.setLineDash([]),a.fillStyle="rgba(\
73,214,208,0.9)",a.fillText(o("espvr"),c(12+u*.75/e.p.emax)+6*m,b(u*.75)),a.fillStyle=E.muted,a.fillText("EDPVR",c(v)-44*m,b(.07*(v-12))-6*m),a.strokeStyle=E.lv,
a.lineWidth=2.4*m,a.beginPath(),e.bins.forEach((f,w)=>{let q=c(f.vlv),H=b(f.plv);w?a.lineTo(q,H):a.moveTo(q,H)}),a.closePath(),a.stroke(),a.fillStyle="#fff",a.beginPath(),
a.arc(c(e.vlv),b(e.plv),5*m,0,7),a.fill(),e.stats&&(a.fillStyle=E.vol,a.fillText(`${o("svef")} ${Math.round(e.stats.sv)} mL · EF ${Math.round(e.stats.ef)}%`,n+
8*m,x+12*m))}function _t(t,e,a){let i=t.getContext("2d"),s=t.width,m=t.height,n=s/t.clientWidth||1;i.clearRect(0,0,s,m);let l=4*n,x=m-8*n,d=0,v=a.done??a.phase;
for(let c=1;c<=_;c++)if(c===_||v[c]!==v[d]){let b=v[d],f=d/_*s,w=c/_*s,q=b===e.phase;i.globalAlpha=q?1:.35,i.fillStyle=rt[b],i.fillRect(f+1,l,w-f-2,x),i.globalAlpha=
1;let H=xt(b);i.font=`${q?700:500} ${11*n}px Inter`;let P=i.measureText(H).width;P<w-f-8*n&&(i.fillStyle=q?"#061418":"rgba(237,244,245,0.85)",i.fillText(H,f+(w-
f-P)/2,l+x/2+4*n)),d=c}let u=e.tc/e.T*s;i.fillStyle="#fff",i.fillRect(u-1.5*n,0,3*n,m)}var M=null,W,Y,k,et=!1;function Ut(){if(M)return;M=new AudioContext,W=M.createGain(),W.gain.value=.8,W.connect(M.destination);let t=M.createBuffer(1,M.sampleRate*
2,M.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;let a=M.createBufferSource();a.buffer=t,a.loop=!0,k=M.createBiquadFilter(),
k.type="bandpass",k.frequency.value=300,k.Q.value=1,Y=M.createGain(),Y.gain.value=0,a.connect(k).connect(Y).connect(W),a.start()}function Mt(t,e,a){if(!M||!et)return;
let i=M.currentTime;[[t,a],[t*2.1,a*.35]].forEach(([s,m])=>{let n=M.createOscillator(),l=M.createGain();n.frequency.setValueAtTime(s,i),n.frequency.exponentialRampToValueAtTime(
s*.6,i+e),l.gain.setValueAtTime(0,i),l.gain.linearRampToValueAtTime(m,i+.008),l.gain.exponentialRampToValueAtTime(8e-4,i+e),n.connect(l).connect(W),n.start(i),n.
stop(i+e+.02)})}var R={enable(t){t&&(Ut(),M.resume()),et=t,M&&!t&&(Y.gain.value=0)},get enabled(){return et},s1(){Mt(52,.13,.9)},s2(){Mt(78,.08,.7)},murmur(t,e){
if(!M||!et)return;let a=M.currentTime;t==="as"&&(k.type="bandpass",k.frequency.setTargetAtTime(260,a,.01),k.Q.value=1.2),t==="mr"&&(k.type="bandpass",k.frequency.
setTargetAtTime(420,a,.01),k.Q.value=.8),t==="ms"&&(k.type="lowpass",k.frequency.setTargetAtTime(110,a,.01),k.Q.value=3),Y.gain.setTargetAtTime(t==="none"?0:e*(t===
"ms"?1.6:.5),a,.012)}};var y=Math.round,Zt={en:{h:"HOW THIS HEART WORKS",intro:"Nothing on screen is animated by hand. One simulation of the left heart runs about 5,000 steps per simu\
lated second, and the 3D model, the Wiggers diagram, the pressure–volume loop, the numbers and the heart sounds are all read from it.",model:"THE MODEL",bullets:[
"<b>Ventricle and atrium:</b> time-varying elastance, P = E(t)·(V − V₀) — the Suga–Sagawa concept. Contractility is Emax, the slope of the end-systolic pressure\
–volume relation.","<b>Arteries:</b> a two-element Windkessel (compliance + systemic resistance).","<b>Valves:</b> one-way, with flow set by the simplified Be\
rnoulli equation, ΔP = 4v². That is why a small valve area creates a pressure gradient on its own.","<b>Heart sounds:</b> S1 when the ventricle starts contrac\
ting against a shut mitral valve, S2 when the aortic valve shuts. Murmurs scale with turbulent flow through a narrowed or leaking valve.","<b>Compensation:</b> \
filling pressure drifts beat by beat to restore cardiac output to ~5 L/min — a stand-in for chronic fluid retention.","<b>3D:</b> chamber size follows the sim\
ulated volume; muscle volume is held constant, so the wall visibly thickens in systole."],val:"VALIDATION — MODEL OUTPUT VS REFERENCE VALUES",cols:["Quantity",
"Model","Reference"],rows:t=>[["Aortic pressure",`${y(t.n.sys)}/${y(t.n.dia)} mmHg`,"~120/80 mmHg"],["End-diastolic volume",`${y(t.n.edv)} mL`,"~110–120 mL (Guy\
ton & Hall)"],["End-systolic volume",`${y(t.n.esv)} mL`,"~40–50 mL"],["Stroke volume · cardiac output",`${y(t.n.sv)} mL · ${t.n.co.toFixed(1)} L/min`,"~70 m\
L · ~5 L/min"],["Ejection fraction",`${y(t.n.ef)}%`,"~55–65%"],["LV end-diastolic pressure",`${y(t.n.lvedp)} mmHg`,"~4–12 mmHg"],["Aortic stenosis, AVA 0.7\
 cm²",`mean gradient ${y(t.as.avGradMean)} mmHg`,"Severe AS: mean gradient ≥ 40 mmHg (ACC/AHA 2020)"],["Mitral stenosis, MVA 1.0 cm²",`LA mean ${y(t.ms.laMean)}\
 mmHg`,"Severe MS (MVA ≤ 1.5 cm²): raised LA pressure"],["Mitral regurgitation, EROA 0.45 cm²",`regurgitant fraction ${y(t.mr.regFrac)}%`,"Severe MR: EROA ≥\
 0.4 cm², RF ≥ 50%"],["HFrEF, Emax 0.9",`EF ${y(t.hf.ef)}% · EDV ${y(t.hf.edv)} mL`,"EF ≤ 40%, dilated ventricle"]],lim:"LIMITATIONS",limT:"Left heart onl\
y. No blood inertia, so flow waveforms are simplified. Heart rate changes do not add sympathetic contractility. Geometry is schematic, not anatomical. Use it to\
 understand relationships, not to predict a patient.",refs:"REFERENCES"},ru:{h:"КАК РАБОТАЕТ ЭТО СЕРДЦЕ",intro:"Ничего на экране не анимиров\
ано вручную. Одна симуляция левых отделов сердца выполняет около 5 000 шагов на секунду модельного времени, и 3D-модель, диаграмма Виггерса, петля давление–объё\
м, показатели и тоны сердца — всё берётся из неё.",model:"МОДЕЛЬ",bullets:["<b>Желудочек и предсердие:</b> изменяющ\
аяся во времени эластичность, P = E(t)·(V − V₀) — концепция Суги–Сагавы. Сократимость — Emax, наклон конечно-систолической зависимости давление–объём.",
"<b>Артерии:</b> двухэлементная модель Виндкесселя (податливость + периферическое сопротивление).",
"<b>Клапаны:</b> односторонние, поток определяется упрощённым уравнением Бернулли, ΔP = 4v². Поэтому малая площадь клапана сама создаёт градиент давления.",
"<b>Тоны сердца:</b> I тон — когда желудочек начинает сокращаться при закрытом митральном клапане, II тон — когда закрывается аортальный клапан. Шумы пропорцион\
альны турбулентному потоку через суженный или недостаточный клапан.","<b>Компенсация:</b> давление на\
полнения постепенно меняется, чтобы вернуть сердечный выброс к ~5 л/мин — модель хронической задержки жидкости.",
"<b>3D:</b> размер камер следует за модельным объёмом; объём миокарда постоянен, поэтому стенка заметно утолщается в систолу."],
val:"ПРОВЕРКА — ДАННЫЕ МОДЕЛИ И РЕФЕРЕНСНЫЕ ЗНАЧЕНИЯ",cols:["Показатель","Модель","Референс"],
rows:t=>[["Давление в аорте",`${y(t.n.sys)}/${y(t.n.dia)} мм рт. ст.`,"~120/80 мм рт. ст."],["Конечно-диастолический объём",
`${y(t.n.edv)} мл`,"~110–120 мл (Гайтон и Холл)"],["Конечно-систолический объём",`${y(t.n.esv)} мл`,"~40–50 мл"],
["Ударный объём · сердечный выброс",`${y(t.n.sv)} мл · ${t.n.co.toFixed(1)} л/мин`,"~70 мл · ~5 л/мин"],["Фракция выбр\
оса",`${y(t.n.ef)}%`,"~55–65%"],["КДД левого желудочка",`${y(t.n.lvedp)} мм рт. ст.`,"~4–12 мм рт. ст."],["Аортальный стено\
з, AVA 0,7 см²",`средний градиент ${y(t.as.avGradMean)} мм рт. ст.`,"Тяжёлый АС: средний градиент ≥ 40 мм рт. ст. (ACC/AHA 2020)"],
["Митральный стеноз, MVA 1,0 см²",`ср. давление в ЛП ${y(t.ms.laMean)} мм рт. ст.`,"Тяжёлый МС (MVA ≤ 1,5 см²): повышенное\
 давление в ЛП"],["Митральная регургитация, EROA 0,45 см²",`фракция регургитации ${y(t.mr.regFrac)}%`,"Тя\
жёлая МР: EROA ≥ 0,4 см², ФР ≥ 50%"],["СН со сниженной ФВ, Emax 0,9",`ФВ ${y(t.hf.ef)}% · КДО ${y(t.hf.edv)} мл`,"ФВ ≤ 40\
%, дилатация желудочка"]],lim:"ОГРАНИЧЕНИЯ",limT:"Только левые отделы сердца. Без инерции крови, поэтому кривые потока упрощены. Из\
менение ЧСС не добавляет симпатического усиления сократимости. Геометрия схематичная, не анатомическая. Модель для понимания взаимосвязей, а не для прогноза у п\
ациента.",refs:"ЛИТЕРАТУРА"},uz:{h:"BU YURAK QANDAY ISHLAYDI",intro:"Ekrandagi hech narsa qo'lda animatsiya qilinmagan. Chap yurakning bitta si\
mulyatsiyasi modelning har bir soniyasida taxminan 5 000 qadam bajaradi; 3D model, Viggers diagrammasi, bosim–hajm halqasi, ko'rsatkichlar va yurak tonlari — ba\
rchasi shundan olinadi.",model:"MODEL",bullets:["<b>Qorincha va bo'lmacha:</b> vaqt bo'yicha o'zgaruvchan elastiklik, P = E(t)·(V − V₀) — Suga–Sagava konsepsiya\
si. Qisqaruvchanlik — Emax, sistola oxiridagi bosim–hajm bog'liqligining qiyaligi.","<b>Arteriyalar:</b> ikki elementli Vindkessel modeli (cho'ziluvchanlik \
+ tizimli qarshilik).","<b>Qopqoqlar:</b> bir tomonlama; oqim soddalashtirilgan Bernulli tenglamasi bilan aniqlanadi, ΔP = 4v². Shuning uchun qopqoq maydoni kic\
hik bo'lsa, bosim gradiyenti o'z-o'zidan paydo bo'ladi.","<b>Yurak tonlari:</b> I ton — qorincha yopiq mitral qopqoqqa qarshi qisqara boshlaganda, II ton — aort\
a qopqog'i yopilganda. Shovqinlar torayan yoki yetishmovchi qopqoqdan o'tuvchi turbulent oqimga mutanosib.","<b>Kompensatsiya:</b> to'lish bosimi har zarbda ast\
a o'zgarib, yurak daqiqalik hajmini ~5 l/daq ga qaytaradi — surunkali suyuqlik ushlanishining modeli.","<b>3D:</b> kameralar o'lchami model hajmiga mos; mioka\
rd hajmi doimiy, shuning uchun sistolada devor ko'rinarli qalinlashadi."],val:"TEKSHIRUV — MODEL NATIJALARI VA ME'YORIY QIYMATLAR",cols:["Ko'rsatkich","Model",
"Me'yor"],rows:t=>[["Aorta bosimi",`${y(t.n.sys)}/${y(t.n.dia)} mm sim. ust.`,"~120/80 mm sim. ust."],["Diastola oxiridagi hajm",`${y(t.n.edv)} ml`,"~110–120 ml\
 (Guyton & Hall)"],["Sistola oxiridagi hajm",`${y(t.n.esv)} ml`,"~40–50 ml"],["Zarb hajmi · daqiqalik hajm",`${y(t.n.sv)} ml · ${t.n.co.toFixed(1)} l/daq`,"\
~70 ml · ~5 l/daq"],["Otish fraksiyasi",`${y(t.n.ef)}%`,"~55–65%"],["Chap qorincha diastola oxiri bosimi",`${y(t.n.lvedp)} mm sim. ust.`,"~4–12 mm sim. ust."],
["Aorta stenozi, AVA 0,7 sm²",`o'rtacha gradiyent ${y(t.as.avGradMean)} mm sim. ust.`,"Og'ir AS: o'rtacha gradiyent ≥ 40 mm sim. ust. (ACC/AHA 2020)"],["Mitr\
al stenoz, MVA 1,0 sm²",`ChB o'rtacha bosimi ${y(t.ms.laMean)} mm sim. ust.`,"Og'ir MS (MVA ≤ 1,5 sm²): ChB bosimi oshgan"],["Mitral regurgitatsiya, EROA 0,\
45 sm²",`regurgitatsiya fraksiyasi ${y(t.mr.regFrac)}%`,"Og'ir MR: EROA ≥ 0,4 sm², RF ≥ 50%"],["Past OF bilan yurak yetishmovchiligi, Emax 0,9",`OF ${y(t.
hf.ef)}% · hajm ${y(t.hf.edv)} ml`,"OF ≤ 40%, qorincha kengaygan"]],lim:"CHEKLOVLAR",limT:"Faqat chap yurak. Qon inersiyasi hisobga olinmagan, shuning uchun \
oqim egri chiziqlari soddalashtirilgan. Yurak urishi o'zgarishi qisqaruvchanlikka simpatik ta'sir qo'shmaydi. Geometriya sxematik, anatomik emas. Bog'liqliklarn\
i tushunish uchun, bemorni bashorat qilish uchun emas.",refs:"ADABIYOTLAR"}};function Tt(t,e,a,i){let s=Zt[t];return`<div style="display:flex;justify-content:sp\
ace-between;align-items:center;gap:10px"><h2>${s.h}</h2><button class="pill" id="closeNotes">${a}</button></div>
  <p style="margin-top:8px">${s.intro}</p><h3>${s.model}</h3><ul>${s.bullets.map(m=>`<li>${m}</li>`).join("")}</ul>
  <h3>${s.val}</h3><table><tr><th>${s.cols[0]}</th><th>${s.cols[1]}</th><th>${s.cols[2]}</th><th></th></tr>
  ${s.rows(e).map(([m,n,l])=>`<tr><td>${m}</td><td style="font-family:'IBM Plex Mono'">${n}</td><td>${l}</td><td class="ok">✓</td></tr>`).join("")}</table>
  <h3>${s.lim}</h3><p>${s.limT}</p>
  <h3>${s.refs}</h3><p style="font-size:13px">Suga H, Sagawa K, Shoukas AA. Circ Res 1973;32:314–322 · Hall JE. Guyton & Hall Textbook of Medical Physiology · O\
tto CM, Nishimura RA, et al. 2020 ACC/AHA Guideline for the Management of Valvular Heart Disease · Westerhof N, Lankhaar JW, Westerhof BE. The arterial Windkess\
el. Med Biol Eng Comput 2009.</p>
  <div class="disc">${i} · Smart Heart · Sunshine 001</div>`}var p=t=>document.getElementById(t),h=new N;h.settle(30);var G=new Q;function Ht(){G=new Q;let t=Math.ceil(2.05*h.period/2e-4);for(let e=0;e<t;e++)h.step(2e-4),
e%4===0&&G.update(h)}var T=new tt(p("view")),Z={s:[],m:[]},ct=0;h.onS1=()=>{R.s1(),Z.s.push(["s1",ct])};h.onS2=()=>{R.s2(),Z.s.push(["s2",ct])};var X=.35,A=!1,K=!0,
I="normal",$="basic",U=!1,at="";T.explode=.45;T.fit();var Xt=[["0.1×",.1],["0.35×",.35],["1×",1]],mt=[{k:"hr",min:40,max:160,step:1,unit:"u_bpm"},{k:"emax",min:.6,
max:4.5,step:.05,unit:"mmHg/mL",fmt:t=>t.toFixed(2)},{k:"rsys",min:.5,max:2.2,step:.05,unit:"PRU",fmt:t=>t.toFixed(2)},{k:"ava",min:.5,max:3.5,step:.05,unit:"cm\
²",fmt:t=>t.toFixed(2)},{k:"mva",min:.7,max:5,step:.05,unit:"cm²",fmt:t=>t.toFixed(2)},{k:"mra",min:0,max:.6,step:.01,unit:"cm²",fmt:t=>t.toFixed(2)}];function L(){
document.documentElement.lang=V,p("subtitle").textContent=o("subtitle"),p("mBasic").textContent=o("basic"),p("mAdv").textContent=o("advanced"),p("notesBtn").textContent=
o("how"),p("soundBtn").textContent=(R.enabled?"🔊 ":"🔈 ")+o(R.enabled?"soundOn":"soundOff"),p("presets").innerHTML=ot.map(t=>`<button class="preset${t.id===
I?" on":""}" data-id="${t.id}">${o("p_"+t.id)}</button>`).join(""),document.querySelectorAll(".preset").forEach(t=>t.onclick=()=>Lt(t.dataset.id)),p("presetNote").
innerHTML=I==="custom"?`<b>${o("custom")}</b>${o("customText")}`:`<b>${o("p_"+I)}</b>${o("l_"+I)}`,p("speed").innerHTML=`<button class="pill" id="pauseBtn">${A?
"▶ "+o("play"):"⏸ "+o("pause")}</button>`+Xt.map(([t,e])=>`<button class="pill${e===X&&!A?" on":""}" data-s="${e}">${t}</button>`).join("")+`<button class="\
pill" id="stepBtn">${o("step")}</button>`,document.querySelectorAll("[data-s]").forEach(t=>t.onclick=()=>{X=+t.dataset.s,A=!1,L()}),p("pauseBtn").onclick=()=>{A=
!A,L()},p("stepBtn").onclick=()=>{A=!0;for(let t=0;t<50;t++)h.step(2e-4),G.update(h);L()},p("tExplode").textContent=o("explode"),p("cutBtn").textContent=o("cut"),
p("flowBtn").textContent=o("flow"),p("labBtn").textContent=o("labels"),p("hint").textContent=o("hint"),p("tWig").textContent=o("wig"),p("tPv").textContent=o("pv"),
p("moreBtn").textContent=U?o("less"):o("more"),p("controls").innerHTML=`<h4>${o("physics")}</h4>`+mt.map(t=>`<div class="ctl"><label>${o("k_"+t.k)}<span id="v_${t.
k}"></span></label><input type="range" id="s_${t.k}" min="${t.min}" max="${t.max}" step="${t.step}"><div class="d">${o("d_"+t.k)}</div></div>`).join("")+`<div c\
lass="toggle"><span>${o("comp")}<br><span class="d">${o("compD")}</span></span><button class="pill on" id="compBtn"></button></div>`,mt.forEach(t=>{p(`s_${t.k}`).
oninput=e=>{h.p[t.k]=+e.target.value,St(t),I!=="custom"&&(I="custom",document.querySelectorAll(".preset").forEach(a=>a.classList.remove("on")),p("presetNote").innerHTML=
`<b>${o("custom")}</b>${o("customText")}`)}}),p("compBtn").onclick=()=>{h.p.comp=!h.p.comp,wt()},document.querySelectorAll("[data-l]").forEach(t=>t.classList.toggle(
"on",t.dataset.l===V)),document.querySelectorAll("[data-m]").forEach(t=>t.classList.toggle("on",t.dataset.m===$)),wt(),at="",$t()}function St(t){let e=h.p[t.k];
p(`v_${t.k}`).textContent=`${t.fmt?t.fmt(e):e} ${t.unit.startsWith("u_")?o(t.unit):t.unit}`}function wt(){mt.forEach(t=>{p(`s_${t.k}`).value=String(h.p[t.k]),St(
t)}),p("compBtn").textContent=h.p.comp?o("on"):o("off"),p("compBtn").classList.toggle("on",h.p.comp)}function Lt(t){let e=ot.find(a=>a.id===t);I=t,h.p={...J,...e.
p},h.ppv=11,h.settle(30),Ht(),L()}document.querySelectorAll("[data-l]").forEach(t=>t.onclick=()=>{bt(t.dataset.l),history.replaceState(null,"","#"+t.dataset.l),
L()});document.querySelectorAll("[data-m]").forEach(t=>t.onclick=()=>It(t.dataset.m));function It(t){$=t,p("main").className=t,L(),requestAnimationFrame(()=>T.resize())}
p("soundBtn").onclick=()=>{R.enable(!R.enabled),p("soundBtn").classList.toggle("on",R.enabled),L()};p("explode").oninput=t=>{T.explode=+t.target.value,T.fit()};
p("cutBtn").onclick=()=>{T.cut=!T.cut,T.build(),p("cutBtn").classList.toggle("on",T.cut)};p("flowBtn").onclick=()=>{T.flow=!T.flow,p("flowBtn").classList.toggle(
"on",T.flow)};p("labBtn").onclick=()=>{K=!K,p("labBtn").classList.toggle("on",K),p("labels").style.display=K?"":"none"};p("moreBtn").onclick=()=>{U=!U,p("phLong").
classList.toggle("hidden",!U),p("moreBtn").textContent=U?o("less"):o("more"),at=""};p("notesBtn").onclick=()=>{let t=e=>{let a=new N;return a.p={...J,...e},a.settle(
30),a.stats};p("notesBox").innerHTML=Tt(V,{n:t({}),as:t({ava:.7}),ms:t({mva:1}),mr:t({mra:.45}),hf:t({emax:.9})},o("close"),o("disc")),p("closeNotes").onclick=()=>p(
"notes").classList.add("hidden"),p("notes").classList.remove("hidden")};p("notes").onclick=t=>{t.target===p("notes")&&p("notes").classList.add("hidden")};function $t(){
let t=h.stats;if(!t)return;let e=Math.round,a=[[o("r_bp"),`${e(t.sys)}/${e(t.dia)}<small> ${o("u_mmHg")}</small>`,"~120/80",t.sys>140||t.sys<95],[o("r_hr"),`${h.
p.hr}<small> ${o("u_bpm")}</small>`,"60–100",h.p.hr>100||h.p.hr<60],[o("r_sv"),`${e(t.sv)}<small> ${o("u_mL")}</small>`,t.regFrac>5?`· ${o("fwd")} ${e(t.fwdSv)}\
 ${o("u_mL")}`:"~70 "+o("u_mL"),t.regFrac>20],[o("r_ef"),`${e(t.ef)}<small>%</small>`,"55–65%",t.ef<50||t.ef>75],[o("r_co"),`${t.co.toFixed(1)}<small> ${o("u_\
Lmin")}</small>`,"4–8",t.co<4],[o("r_edv"),`${e(t.edv)}<small> ${o("u_mL")}</small>`,"~120",t.edv>160],[o("r_esv"),`${e(t.esv)}<small> ${o("u_mL")}</small>`,"\
~50",t.esv>80],[o("r_lvedp"),`${e(t.lvedp)}<small> ${o("u_mmHg")}</small>`,"4–12",t.lvedp>12],[o("r_la"),`${e(t.laMean)}<small> ${o("u_mmHg")}</small>`,"4–12",
t.laMean>12],[o("r_avg"),`${e(t.avGradMean)}<small> ${o("u_mmHg")}</small>`,"< 10",t.avGradMean>20],[o("r_mvg"),`${t.mvGradMean.toFixed(0)}<small> ${o("u_mmHg")}\
</small>`,"< 5",t.mvGradMean>5],[o("r_rf"),`${e(t.regFrac)}<small>%</small>`,"~0",t.regFrac>20]],i=$==="basic"?a.slice(0,4):a;p("readouts").innerHTML=i.map(([s,
m,n,l])=>`<div class="ro${l?" abn":""}"><div class="k">${s}</div><div class="v">${m}</div><div class="n">${n.startsWith("·")?n.slice(2):o("normal")+" "+n}</div\
></div>`).join("")}var Jt=["lv","la","ao","mv","av"];p("labels").innerHTML=Jt.map(t=>`<div class="lab" id="l_${t}"></div>`).join("");function te(){let t=Math.round,
e=(i,s,m,n)=>{let l=p(`l_${i}`),x=T.project(i);if(!x||x.behind){l.style.display="none";return}l.style.display="",l.className="lab "+s,l.style.left=x.x+"px",l.style.
top=x.y+"px",l.innerHTML=`<b>${m}</b>${n}`};e("lv","",o("lab_lv"),`${t(h.plv)} ${o("u_mmHg")} · ${t(h.vlv)} ${o("u_mL")}`),e("la","",o("lab_la"),`${t(h.pla)} ${o(
"u_mmHg")}`),e("ao","",o("lab_ao"),`${t(h.pao)} ${o("u_mmHg")}`);let a=h.qmr>5;e("mv",a?"leak":h.mvOpen?"open":"closed",`${o("lab_mv")} · ${a?o("leaking"):h.mvOpen?
o("open"):o("closed")}`,$==="adv"&&(h.mvOpen||a)?`${t(a?h.qmr:h.qmv)} ${o("u_mLs")}${a?" "+o("back"):""}`:""),e("av",h.avOpen?"open":"closed",`${o("lab_av")} · ${h.
avOpen?o("open"):o("closed")}`,$==="adv"&&h.avOpen?`${t(h.qav)} ${o("u_mLs")}`:"")}var kt=p("wiggers"),qt=p("pv"),At=p("timeline");function nt(t){let e=Math.min(
2,devicePixelRatio),a=Math.round(t.clientWidth*e),i=Math.round(t.clientHeight*e);a&&i&&(t.width!==a||t.height!==i)&&(t.width=a,t.height=i)}var Rt=performance.now(),
lt=0;function Pt(t){if(!A){let e=Math.round(t*X/2e-4);for(let a=0;a<e;a++)h.step(2e-4),a%4===0&&G.update(h)}if(R.murmur(h.murmurKind,A?0:h.murmur),T.update(h,A?
0:t*X),nt(kt),nt(At),yt(kt,h,G,$==="basic"),_t(At,h,G),$==="adv"&&(nt(qt),Et(qt,h)),K&&te(),h.phase!==at){at=h.phase;let e=h.phase,a=h.p.mra>.05&&e==="ivc"?o("m\
rNote"):"";p("phName").textContent=o("ph_"+e),p("phName").style.color=rt[e],p("phShort").textContent=o("s_"+e),p("phLong").textContent=o("x_"+e)+a}lt+=t,lt>.3&&
(lt=0,$t())}function Ct(t){let e=Math.min(.05,(t-Rt)/1e3);Rt=t,window.__manual||Pt(e),requestAnimationFrame(Ct)}window.__capFrame=(t,e)=>(X=e,A=!1,Pt(t),ct+=t,Z.
m.push(h.murmurKind==="none"?0:h.murmur*(h.murmurKind==="ms"?1.6:.5)),Z);window.__capLog=Z;window.__heart={heart:h,view:T,applyPreset:Lt,setMode:It};Ht();L();requestAnimationFrame(
Ct);
