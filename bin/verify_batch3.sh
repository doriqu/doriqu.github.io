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
has "theme: light palette exists" /assets/css/custom-theme.css 'html\[data-theme="light"\]'
has "theme: navbar toggle is rendered" /education/ 'data-theme-switch'
has "theme: inline head initializer is rendered" /education/ 'var storedTheme = null'
if python3 - "$B" <<'THEMEAUDIT'
from pathlib import Path
import re,sys,urllib.request
base=sys.argv[1]
config=Path('_config.yml').read_text()
disabled=bool(re.search(r'^enable_darkmode:\s*false\b',config,re.M))
print(('PASS' if disabled else 'FAIL')+'  al-folio darkmode toggle disabled in config')
# Count site runtime writers only; visual test tools intentionally seed `theme` for fixtures.
runtime=list(Path('assets/js').rglob('*.js'))
writers=[]
setters=[]
for path in runtime:
 text=path.read_text()
 if re.search(r'localStorage\.setItem\(\s*["\']theme["\']',text): writers.append(str(path))
 if re.search(r'(?:setAttribute\(\s*["\']data-theme["\']|\.dataset\.theme\s*=)',text): setters.append(str(path))
print(('PASS' if writers==['assets/js/theme.js'] else 'FAIL')+f'  runtime theme-key writer: {writers}')
print(('PASS' if setters==['assets/js/theme.js'] else 'FAIL')+f'  runtime data-theme setter: {setters}')
try:
 with urllib.request.urlopen(base+'/education/',timeout=20) as response: page=response.read().decode()
 head=page.split('</head>',1)[0]
 init=head.find('var storedTheme = null')
 styles=[m.start() for m in re.finditer(r'<link\b[^>]*>',head,re.I) if re.search(r'\brel=["\']stylesheet["\']',m.group(0),re.I)]
 ordered=init>=0 and bool(styles) and init<min(styles)
 print(('PASS' if ordered else 'FAIL')+'  theme initializer precedes first stylesheet in rendered head')
 tags=re.findall(r'<script\b[^>]*>.*?</script\s*>',page,re.I|re.S)
 inline_setters=[tag for tag in tags if 'src=' not in tag.split('>',1)[0] and re.search(r'setAttribute\(\s*["\']data-theme["\']',tag) and 'var storedTheme = null' not in tag]
 srcs=re.findall(r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>',page,re.I)
 competing=[src for src in srcs if re.search(r'(^|/)(?:theme|dark-mode|darkmode)\.js(?:[?#]|$)',src,re.I) and not re.search(r'/assets/js/theme\.js(?:[?#]|$)',src)]
 print(('PASS' if not inline_setters and not competing else 'FAIL')+f'  no competing rendered theme scripts (inline setters={len(inline_setters)}, theme scripts={competing})')
 if not ordered or inline_setters or competing: sys.exit(1)
except Exception as error:
 print('FAIL  could not inspect rendered head order:',error); sys.exit(1)
sys.exit(not (disabled and writers==['assets/js/theme.js'] and setters==['assets/js/theme.js']))
THEMEAUDIT
then ok "theme persistence has one runtime writer and head-first initialization"; else ko "theme persistence audit failed"; fi
if python3 - <<'STATICCSS'
import re,sys
css=open('assets/css/custom-theme.css').read()
blocks=list(re.finditer(r'(?m)^(?::root,\s*\nhtml\[data-theme="dark"\]|html\[data-theme="light"\])\s*\{[^}]*\}',css))
if len(blocks)!=2:
 print(f'FAIL  custom-theme.css: expected exactly two palette blocks, found {len(blocks)}'); sys.exit(1)
masked=list(css)
for match in blocks:
 for i in range(match.start(),match.end()): masked[i]=' '
rest=''.join(masked)
patterns=[r'#[0-9a-fA-F]{3,8}\b',r'\b(?:rgba?|hsla?)\s*\(\s*(?:\d|#)',r'(?<![-\w])(?:white|black|red|blue|green|gray|grey|silver|purple|orange|yellow|pink|navy|teal|cyan|magenta|rebeccapurple)(?![-\w])']
found=[m.group(0) for pattern in patterns for m in re.finditer(pattern,rest,re.I)]
print('PASS  custom-theme.css: no literal colors outside the two palettes' if not found else 'FAIL  custom-theme.css literals outside palettes: '+', '.join(found))
sys.exit(bool(found))
STATICCSS
then ok "custom-theme.css: literals are confined to the palettes"; else ko "custom-theme.css: color literals outside palettes"; fi
if node bin/color-audit.js --both-themes --url="$B/education/"; then ok "computed color audit passes in both themes"; else ko "computed color audit failed"; fi

# Navbar/pager consistency and canonical destinations.
if python3 - <<'PY'
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
then :; else F=$((F+1)); fi

echo; echo "RESULT: $P passed, $F failed"
[ "$F" -eq 0 ]
