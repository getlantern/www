#! /usr/bin/env python3

import io
import json
from jinja2 import Template
from lib import Parser
from config import template_vars

src_html = ["src/en/index.html", "src/ch/index.html", "src/faq/index.html", "src/outdated/index.html"]
strings = dict()
for fname in src_html:
    with io.open(fname, encoding="utf-8") as f:
        p = Parser(strings)
        p.feed(Template(f.read()).render(template_vars))
        p.close()

with io.open("lang/en_US.json", "w", encoding="utf-8") as f:
    f.write(str(
        json.dumps(strings,
                   ensure_ascii=False,
                   sort_keys=True,
                   indent=0,
                   separators=(',', ': '))))
