#! /usr/bin/env python

import json
import os
import io
from os import path
from shutil import copy, copytree
from lib import Transformer


def transform(fname, **args):
    exclude = map(lambda x: x + '.json', args.get('exclude', []))
    only = map(lambda x: x + '.json', args.get('only', []))
    root = args.get('root', '')
    html_name = args.get('html_name', None)
    with io.open(fname, encoding='utf-8') as fsrc:
        src = fsrc.read()
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

transform('src/en/index.html', exclude=['zh-CN'], root='build')
transform('src/ch/index.html', only=['zh-CN'], root='build')
transform('src/faq/index.html', root='build', html_name='faq.html')
copy('src/robots.txt', 'build')
copy('src/sitemap.xml', 'build')
copytree('src/static', 'build/static')
