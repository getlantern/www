import cgi
from HTMLParser import HTMLParser


class Parser(HTMLParser):
    def __init__(self, strings):
        HTMLParser.__init__(self)
        self.strings = strings
        self.text = ""

    def handle_starttag(self, tag, attrs):
        self._end_data()

    def handle_endtag(self, tag):
        self._end_data()

    def handle_startendtag(self, tag, attrs):
        self._end_data()

    def handle_data(self, data):
        self.text += data


    def handle_entityref(self, name):
        self.text += self.unescape('&' + name + ';')


    def handle_charref(self, name):
        self.text += self.unescape('&#' + name + ';')


    def _end_data(self):
        text = self.text.strip()
        if  text != "":
            self.strings[text] = text

        self.text = ""


class Transformer(HTMLParser):
    _empty_tags = ['meta', 'link', 'img', 'br', 'input']

    def __init__(self, translations):
        HTMLParser.__init__(self)
        self.level = 0
        self.stack = []
        self.translations = translations
        self.text = ""

    def handle_decl(self, decl):
        self.stack.append('<!%s>\n' % (decl))

    def handle_starttag(self, tag, attrs):
        self.stack.append('%s<%s%s>\n' %
                          (self._indent(), tag, self.__html_attrs(attrs)))
        if tag not in Transformer._empty_tags:
            self.level += 1
        self._end_data()

    def handle_endtag(self, tag):
        if tag not in Transformer._empty_tags:
            self.level -= 1
        self.stack.append('%s</%s>\n' % (self._indent(), tag))
        self._end_data()

    def handle_startendtag(self, tag, attrs):
        self.stack.append('%s<%s%s/>\n' %
                          (self._indent(), tag, self.__html_attrs(attrs)))
        self._end_data()

    def handle_data(self, data):
        self.text += data

    def handle_entityref(self, name):
        self.text += self.unescape('&' + name + ';')


    def handle_charref(self, name):
        self.text += self.unescape('&#' + name + ';')


    def _end_data(self):
        k = self.text.strip()
        t = self.translations.get(k, k)
        if t != "":
            self.stack.append('%s%s\n' % (self._indent(), cgi.escape(t)))

        self.text = ""


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
