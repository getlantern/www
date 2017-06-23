from HTMLParser import HTMLParser

_no_split_tags = ['a', 'b']
_empty_tags = ['meta', 'link', 'img', 'br', 'input']


def _html_attrs(attrs):
    if attrs:
        _attrs = [('%s="%s"' % (k, v)) for k, v in attrs]
        return ' %s' % (' '.join(_attrs))
    return ''


class Parser(HTMLParser):
    def __init__(self, strings):
        HTMLParser.__init__(self)
        self.strings = strings
        self.hit_end_tag = False
        self.in_no_split_tag = False
        self.text = ''

    def handle_starttag(self, tag, attrs):
        self.hit_end_tag = False
        if tag in _no_split_tags + ['br'] and self.text.strip() != '':
            self.text += ' <%s%s>' % (tag, _html_attrs(attrs))
            if tag in _no_split_tags:
                self.in_no_split_tag = True
        else:
            self._end_data()

    def handle_endtag(self, tag):
        self.hit_end_tag = True
        if tag in _no_split_tags and self.in_no_split_tag and self.text.strip() != '':
            self.text += '</%s>' % (tag)
            self.in_no_split_tag = False
        else:
            self._end_data()

    def handle_startendtag(self, tag, attrs):
        self._end_data()

    def handle_data(self, data):
        stripped = data.strip()
        if len(stripped) > 0 and stripped[0].isalpha() and self.hit_end_tag:
            self.text += ' '
        self.text += stripped

    def handle_entityref(self, name):
        self.text += '&' + name + ';'

    def handle_charref(self, name):
        self.text += '&#' + name + ';'

    def _end_data(self):
        text = self.text.strip()
        if text != '':
            self.strings[text] = text

        self.text = ''


class Transformer(HTMLParser):

    def __init__(self, translations):
        HTMLParser.__init__(self)
        self.level = 0
        self.stack = []
        self.translations = translations
        self.hit_end_tag = False
        self.in_no_split_tag = False
        self.text = ''

    def handle_decl(self, decl):
        self.stack.append('<!%s>\n' % (decl))

    def handle_starttag(self, tag, attrs):
        self.hit_end_tag = False
        if tag in _no_split_tags + ['br'] and self.text.strip() != '':
            self.text += ' <%s%s>' % (tag, _html_attrs(attrs))
            if tag in _no_split_tags:
                self.in_no_split_tag = True
        else:
            self._end_data()
            self.stack.append('%s<%s%s>\n' %
                              (self._indent(), tag, _html_attrs(attrs)))
            if tag not in _empty_tags:
                self.level += 1

    def handle_endtag(self, tag):
        self.hit_end_tag = True
        if tag in _no_split_tags and self.in_no_split_tag and self.text.strip() != '':
            self.text += '</%s>' % (tag)
            self.in_no_split_tag = False
        else:
            self._end_data()
            if tag not in _empty_tags:
                self.level -= 1
            self.stack.append('%s</%s>\n' % (self._indent(), tag))

    def handle_startendtag(self, tag, attrs):
        self._end_data()
        self.stack.append('%s<%s%s/>\n' %
                          (self._indent(), tag, _html_attrs(attrs)))

    def handle_data(self, data):
        stripped = data.strip()
        if len(stripped) > 0 and stripped[0].isalpha() and self.hit_end_tag:
            self.text += ' '
        self.text += stripped

    def handle_entityref(self, name):
        self.text += '&' + name + ';'

    def handle_charref(self, name):
        self.text += '&#' + name + ';'

    def _end_data(self):
        k = self.text.strip()
        t = self.translations.get(k, '')
        if t == '' and k != '':
            print '"%s" does not have a translation!' % (k)
            t = k
        if t != '':
            self.stack.append('%s%s\n' % (self._indent(), t))

        self.text = ''

    def _indent(self):
        return ''.join(map(lambda x: ' ', range(self.level*2)))

    @classmethod
    def T(cls, translations, markup):
        _p = cls(translations)
        _p.feed(markup)
        _p.close()
        return ''.join(_p.stack)
