#! /usr/bin/env python

import json
from lib import Parser

src_html = ["src/en/index.html", "src/ch/index.html", "src/faq/index.html"]
strings = dict()
for fname in src_html:
    with open(fname) as f:
        p = Parser(strings)
        p.feed(f.read())
        p.close()

with open("lang/en-US.json", "w") as f:
    json.dump(strings, f,
              ensure_ascii=False,
              sort_keys=True,
              indent=0,
              separators=(',', ': '))
