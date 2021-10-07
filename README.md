# PowerBI-nologo-proxy
Cloudflare worker which removes the MS PowerBI logo from a report that has been share via publish to web.

## Example
The proxy has been deployed and configured with custom domain `powernote.xyz`.

An original report that has been published to web via the portal

https://app.powerbi.com/view?r=eyJrIjoiMmM0NWYwYWQtMTc0OS00ZWQ2LWE3Y2EtNTNkYjlmNWUzNWI1IiwidCI6IjI4MGFiNDc5LTJhMzYtNDIwNS04MjBlLWUxMWYyZDhiZDA4ZCJ9

Can be viewed on the `powernote.xyz` site by replacing `app.powerbi.com` portion of the URL.

https://powernote.xyz/view?r=eyJrIjoiMmM0NWYwYWQtMTc0OS00ZWQ2LWE3Y2EtNTNkYjlmNWUzNWI1IiwidCI6IjI4MGFiNDc5LTJhMzYtNDIwNS04MjBlLWUxMWYyZDhiZDA4ZCJ9
> This approach doesn't use an iframe.

## Instructions

1. Get a custom domain
2. Configure the DNS to use Cloudflare name servers
3. Add the script from `src\index.js` to a Cloudflare Worker
4. Add a route for the Worker pointing to your site ie. `powernote.xyz/*` 
