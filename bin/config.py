#! /usr/bin/env python
# coding:utf-8

_language_mapping = [
    ('en_US', u'English (United States)'),
    ('zh_CN', u'中文（简体）'),
    ('zh_HK', u'中文（香港）'),
    ('zh_TW', u'中文（正體）'),
    ('fa_IR', u'فارسی'),
    ('fr', u'Français'),
    ('es', u'Español'),
    ('ar', u'عربى'),
    ('th', u'ไทย'),
    ('ms', u'Malay'),
    ('id', u'bahasa Indonesia'),
    ('ru_RU', u'русский')
]
_available_languages = [l[0] for l in _language_mapping]
template_vars = dict(
    language_mapping=_language_mapping,
    available_languages=_available_languages
)
