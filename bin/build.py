#! /usr/bin/env python

import json
import os
import io
from os import path
from shutil import copy, copytree
from jinja2 import Template
from lib import Transformer, template_vars

# generate reads the src_name, generate copies for each lang files.
def generate(src_name, **args):
    exclude = map(lambda x: x + '.json', args.get('exclude', []))
    only = map(lambda x: x + '.json', args.get('only', []))
    root = args.get('root', '')
    html_name = args.get('html_name', None)
    with io.open(src_name, encoding='utf-8') as fsrc:
        src = Template(fsrc.read()).render(template_vars)
        lang_files = [f for f in os.listdir('lang') if f.endswith('.json')]
        if len(only) > 0:
            lang_files = set(lang_files) & set(only)
        lang_files = set(lang_files) - set(exclude)
        for fname in lang_files:
            with open(path.join('lang', fname)) as fl:
                mapping = json.load(fl)
                dest = path.join(root, fname.replace('.json', ''))
                path.exists(dest) or os.makedirs(dest)
                with io.open(path.join(dest, html_name or 'index.html'),
                             'w',
                             encoding='utf-8') as w:
                    w.write(Transformer.T(mapping, src))

generate('src/en/index.html', exclude=['zh_CN'], root='build')
generate('src/ch/index.html', only=['zh_CN'], root='build')
generate('src/faq/index.html', root='build', html_name='faq.html')
with open('src/index.html') as f:
    with open('build/index.html', 'w') as w:
        w.write(Template(f.read()).render(template_vars))

copy('src/robots.txt', 'build')
copy('src/sitemap.xml', 'build')
copytree('src/static', 'build/static')

