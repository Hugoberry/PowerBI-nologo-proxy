
// Website you intended to retrieve for users.
const upstream = 'app.powerbi.com'

// Custom pathname for the upstream website.
const upstream_path = '/'

// Whether to use HTTPS protocol for upstream address.
const https = true

// Whether to disable cache.
const disable_cache = true

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})

class RemoveElement {
element(element) {
    // An incoming element, such as `div`
    element.append(`
<script>
// if you want to hide some element, add the selector to hideEle Array
const hideEle = [ "#embedWrapperID > div.logoBarWrapper" ]

function hideElement(qs) {
  let eles = document.querySelectorAll(qs)
  eles && eles.forEach(ele => ele.style.display = "none")
}

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let body = document.querySelector('body');
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        hideEle.forEach( hideE => hideElement(hideE) )
    });
});
observer.observe(body, { subtree: true, childList: true });   
</script>
<noscript>Please enable JavaScript to view this PowerBI dashboard</noscript>
<style>.embeddedLandingRootContentLogoVisible { height: 100% }</style>
`, { html: Boolean })
    console.log(`Incoming element: ${element.tagName}`)
}
}

async function fetchAndApply(request) {

    const region = request.headers.get('cf-ipcountry').toUpperCase();
    const ip_address = request.headers.get('cf-connecting-ip');
    const user_agent = request.headers.get('user-agent');

    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;

    if (https == true) {
        url.protocol = 'https:';
    } else {
        url.protocol = 'http:';
    }
    var upstream_domain = upstream;

    url.host = upstream_domain;
    if (url.pathname == '/') {
        url.pathname = upstream_path;
    } else {
        url.pathname = upstream_path + url.pathname;
    }


        let method = request.method;
        let request_headers = request.headers;
        let new_request_headers = new Headers(request_headers);

        new_request_headers.set('Host', upstream_domain);
        new_request_headers.set('Referer', url.protocol + '//' + url_hostname);

        let original_response = await fetch(url.href, {
            method: method,
            headers: new_request_headers
        })

        response = new Response(original_response.body, original_response)
        let original_text = null;
        let response_headers = original_response.headers;
        let new_response_headers = new Headers(response_headers);
        let status = original_response.status;

        if (disable_cache) {
            new_response_headers.set('Cache-Control', 'no-store');
        }

        new_response_headers.set('access-control-allow-origin', '*');
        new_response_headers.set('access-control-allow-credentials', true);
        new_response_headers.delete('content-security-policy');
        new_response_headers.delete('content-security-policy-report-only');
        new_response_headers.delete('clear-site-data');

        if (new_response_headers.get("x-pjax-url")) {
            new_response_headers.set("x-pjax-url", response_headers.get("x-pjax-url").replace("//" + upstream_domain, "//" + url_hostname));
        }

        return new HTMLRewriter().on('body', new RemoveElement()).transform(response);
}
