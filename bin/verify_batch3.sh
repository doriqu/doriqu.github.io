#!/usr/bin/env bash
B=http://localhost:8080; P=0; F=0
ready=0
for attempt in $(seq 1 60); do
  code=$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' "$B/") || code=000
  if [ "$code" = 200 ]; then echo "site ready"; ready=1; break; fi
  sleep 3
done
[ "$ready" = 1 ] || { echo "ERROR: site did not return HTTP 200 at $B/ after 180 seconds" >&2; exit 1; }
get(){ curl -s --max-time 20 "$B$1"; }
ok(){ echo "PASS  $1"; P=$((P+1)); }
ko(){ echo "FAIL  $1"; F=$((F+1)); }
has(){ get "$2" | grep -qiE -- "$3" && ok "$1" || ko "$1"; }
no(){ get "$2" | grep -qiE -- "$3" && ko "$1" || ok "$1"; }
cnt(){ n=$(get "$2" | grep -oiE -- "$3" | wc -l); [ "$n" -eq "$4" ] && ok "$1" || ko "$1 (found $n, expected $4)"; }
atleast(){ n=$(get "$2" | grep -oiE -- "$3" | wc -l); [ "$n" -ge "$4" ] && ok "$1" || ko "$1 (found $n, expected >= $4)"; }
for p in / /education/ /projects/ /experience/ /awards/ /involvement/ /skills/ /blog/ /cv/; do c=$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' "$B$p"); [ "$c" = 200 ] && ok "page $p is up" || ko "page $p returns $c"; done
pg(){ h=$(get "$1"); for d in prev next; do if [ $d = prev ]; then t="$2"; else t="$3"; fi; if [ "$t" = "-" ]; then echo "$h"|grep -qE "rel=\"$d\""&&ko "pager $1: unexpected $d"||ok "pager $1: no $d"; else echo "$h"|grep -qE "(rel=\"$d\"[^>]*href=\"$t( index.html)?\"|href=\"$t( index.html)?\"[^>]*rel=\"$d\")"&&ok "pager $1: $d -> $t"||ko "pager $1: $d -> $t"; fi; done; }
pg / - /education/; pg /education/ / /projects/; pg /projects/ /education/ /experience/; pg /experience/ /projects/ /awards/; pg /awards/ /experience/ /involvement/; pg /involvement/ /awards/ /skills/; pg /skills/ /involvement/ /blog/; pg /blog/ /skills/ /cv/; pg /cv/ /blog/ -
for p in /education/ /experience/ /involvement/ /skills/ /cv/ /projects/ /awards/; do cnt "$p: exactly one <h1>" "$p" '<h1' 1; done
cnt "/education/: exact Education heading once" /education/ '<h[1-3][^>]*>[[:space:]]*Education[[:space:]]*</h[1-3]>' 1
has "education: 4th-year marked TODO confirm" /education/ '4th year.{0,100}TODO: confirm|TODO: confirm.{0,100}4th year'; has "education: CAP format" /education/ 'CAP \(2022\)'
has "experience: SBEE expanded" /experience/ 'Soci.t. B.ninoise d.{1,8}.nergie'; atleast "experience: On-site twice" /experience/ 'On-site' 2; has "experience: BOM separate bullet" /experience/ 'Bill of materials and motor selection</'; has "experience: power budget separate bullet" /experience/ 'Power budget and battery sizing'
no "awards: no prize claimed" /awards/ 'no prize claimed'; has "awards: certificate" /awards/ 'Certificate of Participation'; no "awards: Arduino has no unverified Benin" /awards/ 'HEPHAESTUS[^<]{0,12}Benin'; no "awards: Bac has no repeated subtitle" /awards/ 'F3[^<]{0,12}Benin'
has "involvement: club present" /involvement/ 'Club Informatique Industrielle'; no "involvement: embellishments absent" /involvement/ 'Beninese youth organi[sz]ation|for schools|engineering services in robotics'; has "involvement: TODO verify" /involvement/ 'TODO: verify'
cnt "/cv/: one h1" /cv/ '<h1' 1; cnt "/skills/: one h1" /skills/ '<h1' 1
for p in /awards/ /education/ /experience/ /involvement/; do n=$(get "$p"|grep -o 'class="timeline-list"'|wc -l); if [ "$p" = /awards/ ]; then [ "$n" -eq 2 ]&&ok "$p: two timeline lists"||ko "$p: found $n timeline lists, expected 2"; else [ "$n" -eq 1 ]&&ok "$p: one timeline list"||ko "$p: found $n timeline lists, expected 1"; fi; done
no "awards: no h2 inside timeline lists" /awards/ '<div class="custom-site timeline-list">[^<]*<h2' 
python3 - "$B" <<'PYAUDIT'
import re,sys,urllib.request,html
base=sys.argv[1]
def fetch(url):
 req=urllib.request.Request(url)
 with urllib.request.urlopen(req,timeout=20) as r:return r.read().decode()
page=fetch(base+'/education/')
paths=['/assets/css/custom-theme.css']
paths += [html.unescape(x) for x in re.findall(r'<link[^>]+href=["\']([^"\']+\.css(?:\?[^"\']*)?)["\']',page,re.I)]
paths=list(dict.fromkeys(paths)); css=''
for path in paths:
 if path.startswith('//') or path.startswith('http'): continue
 css += '\n'+fetch(base+path.split('?',1)[0])
fail=[]
for value in re.findall(r'#[0-9a-fA-F]{3,8}\b',css):
 h=value[1:]
 if len(h) in (3,4): rgb=[int(c*2,16) for c in h[:3]]
 elif len(h) in (6,8): rgb=[int(h[i:i+2],16) for i in (0,2,4)]
 else: continue
 if len(set(rgb))>1: fail.append(value)
for value in re.findall(r'rgba?\(([^)]*)\)|hsla?\(([^)]*)\)',css,re.I):
 raw=next(x for x in value if x); nums=re.findall(r'-?\d*\.?\d+',raw)
 if raw.lower().startswith('h') or len(nums)>=3:
  if raw.lower().startswith('h') or len(set(nums[:3]))>1: fail.append(raw)
for value in re.findall(r'(?<![-\w])(?:red|blue|green|yellow|orange|purple|pink|olive|teal|navy|cyan|magenta|rebeccapurple)(?![-\w])',css,re.I):fail.append(value)
for name in ['--global-theme-color','--global-hover-color','--global-text-color-light','--global-divider-color','--global-card-bg-color']:
 if re.search(re.escape(name)+r'\s*:\s*(?!#(?:fff|ffffff|aaa|888|777|555|333|222|000)\b)[^;]+',css,re.I):fail.append(name+' non-neutral override')
print('CSS color audit files:', ', '.join(paths))
print('CSS color audit findings:', ', '.join(sorted(set(fail))) if fail else 'none')
print('PASS  CSS color audit neutral' if not fail else 'FAIL  CSS color audit found chromatic values')
sys.exit(bool(fail))
PYAUDIT

echo; echo "RESULT: $P passed, $F failed"
# Navbar/pager consistency and canonical destinations.
python3 - <<'PY'
import re, urllib.request, sys
base='http://localhost:8080'
pages=['/','/education/','/projects/','/experience/','/awards/','/involvement/','/skills/','/blog/','/cv/']
failed=0
for path in ['/education/','/','/projects/']:
 html=urllib.request.urlopen(base+path).read().decode()
 nav=re.search(r'<nav id="navbar".*?</nav>',html,re.S)
 labels=re.findall(r'<a class="nav-link"[^>]*>(.*?)</a>',nav.group(0),re.S) if nav else []
 labels=[re.sub(r'<.*?>','',x).strip() for x in labels]
 n=labels.count('About')
 print(('PASS' if n==1 else 'FAIL')+f'  navbar {path}: exactly one About link (found {n})')
 failed+=n!=1
for path in pages:
 html=urllib.request.urlopen(base+path).read().decode()
 pager=re.search(r'<nav class="page-pager".*?</nav>',html,re.S)
 links=re.findall(r'<a class="pager-(?:prev|next)"[^>]*href="([^"]+)"',pager.group(0),re.S) if pager else []
 if '/blog/index.html' in html: print(f'FAIL  {path}: canonical Blog URL'); failed+=1
 else: print(f'PASS  {path}: canonical Blog URL')
 if 'href="/about/"' in html: print(f'FAIL  {path}: About URL is /about/'); failed+=1
print('Navbar order:', 'About, Education, Projects, Experience, Awards & Certifications, Involvement, Skills, Blog, CV')
print('Pager order: About, Education, Projects, Experience, Awards & Certifications, Involvement, Skills, Blog, CV')
sys.exit(bool(failed))
PY
