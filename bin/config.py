_language_mapping = {
    'en_US': 'English (United States)',
    'zh_CN': 'Chinese (Simplified)',
    'fr': 'French',
    'es': 'Spanish',
    'ar': 'Arabic'
}
_available_languages = _language_mapping.keys()
template_vars = dict(
    language_mapping=_language_mapping,
    available_languages=_available_languages
)
