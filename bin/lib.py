from HTMLParser import HTMLParser


class Parser(HTMLParser):
    def __init__(self, strings):
        HTMLParser.__init__(self)
        self.strings = strings

    def handle_data(self, data):
        k = data.strip()
        if k != "":
            self.strings[k] = k


class Transformer(HTMLParser):
    _empty_tags = ['meta', 'link', 'img', 'br', 'input']

    def __init__(self, translations):
        HTMLParser.__init__(self)
        self.level = 0
        self.stack = []
        self.translations = translations

    def handle_decl(self, decl):
        self.stack.append('<!%s>\n' % (decl))

    def handle_starttag(self, tag, attrs):
        self.stack.append('%s<%s%s>\n' %
                          (self._indent(), tag, self.__html_attrs(attrs)))
        if tag not in Transformer._empty_tags:
            self.level += 1

    def handle_endtag(self, tag):
        if tag not in Transformer._empty_tags:
            self.level -= 1
        self.stack.append('%s</%s>\n' % (self._indent(), tag))

    def handle_startendtag(self, tag, attrs):
        self.stack.append('%s<%s%s/>\n' %
                          (self._indent(), tag, self.__html_attrs(attrs)))

    def handle_data(self, data):
        k = data.strip()
        t = self.translations.get(k, k)
        if t != "":
            self.stack.append('%s%s\n' % (self._indent(), t))

    def _indent(self):
        return ''.join(map(lambda x: " ", range(self.level*2)))

    def __html_attrs(self, attrs):
        if attrs:
            _attrs = [('%s="%s"' % (k, v)) for k, v in attrs]
            return ' %s' % (' '.join(_attrs))
        return ''

    @classmethod
    def T(cls, translations, markup):
        _p = cls(translations)
        _p.feed(markup)
        _p.close()
        return ''.join(_p.stack)

language_mapping = {
    'en_US': 'English (United States)',
    'zh_CN': 'Chinese (Simplified)'
}
available_languages = language_mapping.keys()
template_vars = dict(
    language_mapping=language_mapping,
    available_languages=available_languages
)
