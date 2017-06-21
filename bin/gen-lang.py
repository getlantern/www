#! /usr/bin/env python

import io
import json
from HTMLParser import HTMLParser
from jinja2 import Template
from lib import Parser, template_vars

src_html = ["src/en/index.html", "src/ch/index.html", "src/faq/index.html"]
strings = dict()
for fname in src_html:
    with io.open(fname, encoding="utf-8") as f:
        p = Parser(strings)
        p.feed(Template(f.read()).render(template_vars))
        p.close()

with io.open("lang/en_US.json", "w", encoding="utf-8") as f:
    f.write(unicode(
        json.dumps(strings,
                   ensure_ascii=False,
                   sort_keys=True,
                   indent=0,
                   separators=(',', ': '))))
