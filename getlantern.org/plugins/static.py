#coding:utf-8
from six.moves import urllib
from django import template
from os.path import relpath
from os.path import dirname


def static(context, link_url):
    """
    Get the path for a static file in the Cactus build.
    We'll need this because paths can be rewritten with fingerprinting.
    """
    #TODO: Support URLS that don't start with `/static/`
    site = context['__CACTUS_SITE__']
    page = context['__CACTUS_CURRENT_PAGE__']

    url = site.get_url_for_static(link_url)

    if url is None:

        # For the static method we check if we need to add a prefix
        helper_keys = [
            "/static/" + link_url,
            "/static"  + link_url,
            "static/"  + link_url
        ]

        for helper_key in helper_keys:

            url_helper_key = site.get_url_for_static(helper_key)

            if url_helper_key is not None:
                return relpath(urllib.parse.urljoin( site.static_path, helper_key), dirname(page.absolute_final_url))

        url = link_url

    return relpath(urllib.parse.urljoin( site.static_path, link_url), dirname(page.absolute_final_url))



def url(context, link_url):
    """
    Get the path for a page in the Cactus build.
    We'll need this because paths can be rewritten with prettifying.
    """
    site = context['__CACTUS_SITE__']
    page = context['__CACTUS_CURRENT_PAGE__']

    url = site.get_url_for_page(link_url)

    if url is None:

        # See if we're trying to link to an /subdir/index.html with /subdir
        link_url_index = os.path.join(link_url, "index.html")
        url_link_url_index = site.get_url_for_page(link_url_index)

        if url_link_url_index is None:
            logger.warn('%s: page resource does not exist: %s', page.link_url, link_url)

        url = link_url

    if site.prettify_urls:
        return relpath(urllib.parse.urljoin(site.url,  url.rsplit('index.html', 1)[0]), dirname(page.absolute_final_url))


    return relpath(urllib.parse.urljoin(site.url, url), dirname(page.absolute_final_url))


def preBuild(site):
    register = template.Library()
    register.simple_tag(takes_context=True)(url)
    register.simple_tag(takes_context=True)(static)
    template.base.builtins.append(register)
