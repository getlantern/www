#! /usr/bin/env python

import json
import os
import io
from os import path
from shutil import copy, copytree
from jinja2 import Template
from lib import Transformer
from config import template_vars


# generate reads the src_name, generate copies for each lang files.
def generate(src_name, **args):
    exclude = map(lambda x: x + '.json', args.get('exclude', []))
    only = map(lambda x: x + '.json', args.get('only', []))
    root = args.get('root', '')
    html_name = args.get('html_name', None)
    with io.open(src_name, encoding='utf-8') as fsrc:
        src = fsrc.read()
        lang_files = [f for f in os.listdir('lang') if f.endswith('.json')]
        if len(only) > 0:
            lang_files = set(lang_files) & set(only)
        lang_files = set(lang_files) - set(exclude)
        for fname in lang_files:
            with open(path.join('lang', fname)) as fl:
                print("building %s" % fname)
                mapping = json.load(fl)
                dest = path.join(root, fname.replace('.json', ''))
                path.exists(dest) or os.makedirs(dest)
                with io.open(path.join(dest, html_name or 'index.html'),
                             'w',
                             encoding='utf-8') as w:
                    # Note: intentionally not render template until now, to
                    # avoid accidentally pulling in translations for language
                    # names.
                    w.write(Template(Transformer.T(mapping, src)).render(template_vars))

generate('src/en/index.html', exclude=['zh_CN'], root='build')
generate('src/ch/index.html', only=['zh_CN'], root='build')
generate('src/faq/index.html', root='build', html_name='faq.html')
generate('src/outdated/index.html', root='build/', html_name='outdated.html')
for html_name in ['index', 'outdated']:
    with open('src/index.html') as f:
        template_vars['html_name'] = '"%s"' % html_name
        with open('build/' + '%s.html'%html_name, 'w') as w:
            w.write(Template(f.read()).render(template_vars))

copy('src/robots.txt', 'build')
copy('src/sitemap.xml', 'build')
copy('src/favicon.ico', 'build')
copytree('src/static', 'build/static')
copytree('src/fanqiang', 'build/fanqiang')
