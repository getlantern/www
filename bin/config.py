#! /usr/bin/env python
# coding:utf-8

_language_mapping = [
    ('en_US', u'English (United States)'),
    ('zh_CN', u'简体中文'),
    ('fr', u'Français'),
    ('es', u'Español'),
    ('ar', u'عربى')
]
_available_languages = [l[0] for l in _language_mapping]
template_vars = dict(
    language_mapping=_language_mapping,
    available_languages=_available_languages
)
