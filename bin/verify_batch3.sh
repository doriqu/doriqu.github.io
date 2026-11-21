#!/usr/bin/env bash
B=http://localhost:8080; P=0; F=0
get(){ curl -s "$B$1"; }
ok(){ echo "PASS  $1"; P=$((P+1)); }
ko(){ echo "FAIL  $1"; F=$((F+1)); }
has(){ get "$2" | grep -qiE -- "$3" && ok "$1" || ko "$1"; }
no(){ get "$2" | grep -qiE -- "$3" && ko "$1" || ok "$1"; }
cnt(){ n=$(get "$2" | grep -oiE -- "$3" | wc -l); [ "$n" -eq "$4" ] && ok "$1" || ko "$1 (found $n, expected $4)"; }
atleast(){ n=$(get "$2" | grep -oiE -- "$3" | wc -l); [ "$n" -ge "$4" ] && ok "$1" || ko "$1 (found $n, expected >= $4)"; }
for p in / /education/ /projects/ /experience/ /awards/ /involvement/ /skills/ /blog/ /cv/; do c=$(curl -s -o /dev/null -w '%{http_code}' "$B$p"); [ "$c" = 200 ] && ok "page $p is up" || ko "page $p returns $c"; done
pg(){ h=$(get "$1"); for d in prev next; do if [ $d = prev ]; then t="$2"; else t="$3"; fi; if [ "$t" = "-" ]; then echo "$h"|grep -qE "rel=\"$d\""&&ko "pager $1: unexpected $d"||ok "pager $1: no $d"; else echo "$h"|grep -qE "(rel=\"$d\"[^>]*href=\"$t( index.html)?\"|href=\"$t( index.html)?\"[^>]*rel=\"$d\")"&&ok "pager $1: $d -> $t"||ko "pager $1: $d -> $t"; fi; done; }
pg / - /education/; pg /education/ / /projects/; pg /projects/ /education/ /experience/; pg /experience/ /projects/ /awards/; pg /awards/ /experience/ /involvement/; pg /involvement/ /awards/ /skills/; pg /skills/ /involvement/ /blog/; pg /blog/ /skills/ /cv/; pg /cv/ /blog/ -
for p in /education/ /experience/ /involvement/ /skills/ /cv/ /projects/ /awards/; do cnt "$p: exactly one <h1>" "$p" '<h1' 1; done
cnt "/education/: exact Education heading once" /education/ '<h[1-3][^>]*>[[:space:]]*Education[[:space:]]*</h[1-3]>' 1
has "education: 4th-year marked TODO confirm" /education/ '4th year.{0,100}TODO: confirm|TODO: confirm.{0,100}4th year'; has "education: CAP format" /education/ 'CAP \(2022\)'
has "experience: SBEE expanded" /experience/ 'Soci.t. B.ninoise d.{1,8}.nergie'; atleast "experience: On-site twice" /experience/ 'On-site' 2; has "experience: BOM separate bullet" /experience/ 'Bill of materials and motor selection</'; has "experience: power budget separate bullet" /experience/ 'Power budget and battery sizing'
no "awards: no prize claimed" /awards/ 'no prize claimed'; has "awards: certificate" /awards/ 'Certificate of Participation'; no "awards: Arduino has no unverified Benin" /awards/ 'HEPHAESTUS[^<]{0,12}Benin'; no "awards: Bac has no repeated subtitle" /awards/ 'F3[^<]{0,12}Benin'
has "involvement: club present" /involvement/ 'Club Informatique Industrielle'; no "involvement: embellishments absent" /involvement/ 'Beninese youth organi[sz]ation|for schools|engineering services in robotics'; has "involvement: TODO verify" /involvement/ 'TODO: verify'
cnt "/cv/: one h1" /cv/ '<h1' 1; cnt "/skills/: one h1" /skills/ '<h1' 1
css=$(curl -s $B/assets/css/custom-theme.css); echo "$css"|grep -qE 'font-variant-ligatures: *none'&&ok "ligatures disabled"||ko "ligatures"; bad=$(echo "$css"|grep -oE '#[0-9a-fA-F]{6}\b'|sort -u|while read c; do r=${c:1:2};g=${c:3:2};b=${c:5:2};[ "${r,,}" = "${g,,}" ]&&[ "${g,,}" = "${b,,}" ]||echo "$c";done);[ -z "$bad" ]&&ok "no chromatic six-digit hex"||ko "chromatic colors $bad"
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
