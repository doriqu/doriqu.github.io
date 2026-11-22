(() => {
  const canvas = document.querySelector('[data-swarm]');
  if (!canvas) return;
  const presetName = canvas.dataset.swarm || 'flock';
  const presets = {
    flock:{count:64,speed:.45,separation:.8,alignment:.5,cohesion:.25,cursor_attraction:.08,link_distance:68,trail:0},
    consensus:{count:52,speed:.25,separation:.2,alignment:.9,cohesion:.7,cursor_attraction:0,link_distance:0,trail:0},
    formation:{count:64,speed:.32,separation:.4,alignment:.6,cohesion:.3,cursor_attraction:0,link_distance:0,trail:0},
    trails:{count:56,speed:.5,separation:.3,alignment:.3,cohesion:.3,cursor_attraction:.05,link_distance:0,trail:.08},
    aggregation:{count:50,speed:.25,separation:.4,alignment:.2,cohesion:.7,cursor_attraction:0,link_distance:0,trail:0},
    network:{count:56,speed:.3,separation:.5,alignment:.35,cohesion:.25,cursor_attraction:.02,link_distance:78,trail:0},
    clusters:{count:60,speed:.28,separation:.4,alignment:.45,cohesion:.8,cursor_attraction:0,link_distance:0,trail:0},
    drift:{count:28,speed:.12,separation:0,alignment:.1,cohesion:.1,cursor_attraction:0,link_distance:0,trail:0},
    minimal:{count:16,speed:.12,separation:.2,alignment:.1,cohesion:.1,cursor_attraction:0,link_distance:0,trail:0}
  };
  const preset = presets[presetName] || presets.minimal || { count: 24, speed: .2, link_distance: 0 };
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 600px)').matches;
  const count = Math.min(preset.count || 24, mobile ? 35 : 80);
  let width=0,height=0,frame=0,last=0,visible=false,paused=localStorage.getItem('swarm-paused')==='true',pointer=null;
  let points=[];
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);points=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*preset.speed,vy:(Math.random()-.5)*preset.speed}));drawStatic()};
  const drawStatic=()=>{ctx.clearRect(0,0,width,height);ctx.fillStyle='rgba(220,220,220,.1)';for(const p of points){ctx.beginPath();ctx.arc(p.x,p.y,1.4,0,Math.PI*2);ctx.fill()}};
  const step=(t)=>{frame=0;if(!visible||paused||document.hidden)return;if(t-last<16){frame=requestAnimationFrame(step);return}last=t;ctx.clearRect(0,0,width,height);ctx.fillStyle='rgba(230,230,230,.1)';const lim=preset.link_distance||0;for(let i=0;i<points.length;i++){const a=points[i];let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,n=0;for(let j=0;j<points.length;j++){if(i===j)continue;const b=points[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>90)continue;n++;cx+=b.x;cy+=b.y;ax+=b.vx;ay+=b.vy;if(d<30){sx-=dx/(d||1);sy-=dy/(d||1)}if(lim&&d<lim){ctx.strokeStyle='rgba(220,220,220,.08)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}if(n){a.vx+=(sx*preset.separation+((ax/n)-a.vx)*(preset.alignment||0)+(cx/n-a.x)*(preset.cohesion||0)*.01)*.004;a.vy+=(sy*preset.separation+((ay/n)-a.vy)*(preset.alignment||0)+(cy/n-a.y)*(preset.cohesion||0)*.01)*.004}if(pointer&&preset.cursor_attraction){a.vx+=(pointer.x-a.x)*preset.cursor_attraction*.0005;a.vy+=(pointer.y-a.y)*preset.cursor_attraction*.0005}a.x=(a.x+a.vx+width)%width;a.y=(a.y+a.vy+height)%height;ctx.beginPath();ctx.arc(a.x,a.y,1.4,0,Math.PI*2);ctx.fill()}frame=requestAnimationFrame(step)};
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible&&!paused&&!reduce&&!frame)frame=requestAnimationFrame(step);if(!visible&&frame){cancelAnimationFrame(frame);frame=0}});observer.observe(canvas);
  addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else if(!document.hidden&&visible&&!paused&&!reduce&&!frame)frame=requestAnimationFrame(step)});canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top}});canvas.addEventListener('pointerleave',()=>pointer=null);
  document.querySelectorAll('[data-swarm-toggle]').forEach(b=>{const update=()=>{b.textContent=`Swarm: ${presetName} · ${paused?'Resume':'Pause'}`;b.setAttribute('aria-pressed',String(paused))};update();b.addEventListener('click',()=>{paused=!paused;localStorage.setItem('swarm-paused',String(paused));update();if(paused&&frame){cancelAnimationFrame(frame);frame=0;drawStatic()}else if(!paused&&visible&&!reduce&&!frame)frame=requestAnimationFrame(step)})});
  resize();if(reduce)drawStatic();
})();
