#! /usr/bin/env python
# coding:utf-8

_language_mapping = [
    ('en_US', u'English (United States)'),
    ('zh_CN', u'简体中文'),
    ('fa_IR', u'فارسی'),
    ('fr', u'Français'),
    ('es', u'Español'),
    ('ar', u'عربى'),
    ('th', u'ไทย'),
    ('ms', u'Melayu'),
    ('id', u'bahasa Indonesia'),
    ('ru_RU', u'русский')
]
_available_languages = [l[0] for l in _language_mapping]
template_vars = dict(
    language_mapping=_language_mapping,
    available_languages=_available_languages
)
