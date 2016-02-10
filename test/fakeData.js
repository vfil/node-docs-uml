module.exports = {
    indexUrlResponse: {
        "source": "doc/api/index.markdown",
        "desc": [
            {
                "type": "space"
            },
            {
                "type": "list_item_start"
            },
            {
                "type": "text",
                "text": "[HTTP](http.html)"
            },
            {
                "type": "list_item_end"
            }
        ]
    },
    moduleUrlResponse: {
        "source": "doc/api/http.markdown",
        "modules": [
            {
                "textRaw": "HTTP",
                "name": "http",
                "stability": 2,
                "stabilityText": "Stable",
                "desc": "<p>To use the HTTP server and client one must <code>require(&#39;http&#39;)</code>.\n\n</p>\n<p>The HTTP interfaces in Node.js are designed to support many features\nof the protocol which have been traditionally difficult to use.\nIn particular, large, possibly chunk-encoded, messages. The interface is\ncareful to never buffer entire requests or responses--the\nuser is able to stream data.\n\n</p>\n<p>HTTP message headers are represented by an object like this:\n\n</p>\n<pre><code>{ &#39;content-length&#39;: &#39;123&#39;,\n  &#39;content-type&#39;: &#39;text/plain&#39;,\n  &#39;connection&#39;: &#39;keep-alive&#39;,\n  &#39;host&#39;: &#39;mysite.com&#39;,\n  &#39;accept&#39;: &#39;*/*&#39; }</code></pre>\n<p>Keys are lowercased. Values are not modified.\n\n</p>\n<p>In order to support the full spectrum of possible HTTP applications, Node.js&#39;s\nHTTP API is very low-level. It deals with stream handling and message\nparsing only. It parses a message into headers and body but it does not\nparse the actual headers or the body.\n\n</p>\n<p>See [<code>message.headers</code>][] for details on how duplicate headers are handled.\n\n</p>\n<p>The raw headers as they were received are retained in the <code>rawHeaders</code>\nproperty, which is an array of <code>[key, value, key2, value2, ...]</code>.  For\nexample, the previous message header object might have a <code>rawHeaders</code>\nlist like the following:\n\n</p>\n<pre><code>[ &#39;ConTent-Length&#39;, &#39;123456&#39;,\n  &#39;content-LENGTH&#39;, &#39;123&#39;,\n  &#39;content-type&#39;, &#39;text/plain&#39;,\n  &#39;CONNECTION&#39;, &#39;keep-alive&#39;,\n  &#39;Host&#39;, &#39;mysite.com&#39;,\n  &#39;accepT&#39;, &#39;*/*&#39; ]</code></pre>\n",
                "classes": [
                    {
                        "textRaw": "Class: http.ClientRequest",
                        "type": "class",
                        "name": "http.ClientRequest",
                        "desc": "<p>This object is created internally and returned from [<code>http.request()</code>][].  It\nrepresents an <em>in-progress</em> request whose header has already been queued.  The\nheader is still mutable using the <code>setHeader(name, value)</code>, <code>getHeader(name)</code>,\n<code>removeHeader(name)</code> API.  The actual header will be sent along with the first\ndata chunk or when closing the connection.\n\n</p>\n<p>To get the response, add a listener for <code>&#39;response&#39;</code> to the request object.\n<code>&#39;response&#39;</code> will be emitted from the request object when the response\nheaders have been received.  The <code>&#39;response&#39;</code> event is executed with one\nargument which is an instance of [<code>http.IncomingMessage</code>][].\n\n</p>\n<p>During the <code>&#39;response&#39;</code> event, one can add listeners to the\nresponse object; particularly to listen for the <code>&#39;data&#39;</code> event.\n\n</p>\n<p>If no <code>&#39;response&#39;</code> handler is added, then the response will be\nentirely discarded.  However, if you add a <code>&#39;response&#39;</code> event handler,\nthen you <strong>must</strong> consume the data from the response object, either by\ncalling <code>response.read()</code> whenever there is a <code>&#39;readable&#39;</code> event, or\nby adding a <code>&#39;data&#39;</code> handler, or by calling the <code>.resume()</code> method.\nUntil the data is consumed, the <code>&#39;end&#39;</code> event will not fire.  Also, until\nthe data is read it will consume memory that can eventually lead to a\n&#39;process out of memory&#39; error.\n\n</p>\n<p>Note: Node.js does not check whether Content-Length and the length of the body\nwhich has been transmitted are equal or not.\n\n</p>\n<p>The request implements the [Writable Stream][] interface. This is an\n[<code>EventEmitter</code>][] with the following events:\n\n</p>\n",
                        "events": [
                            {
                                "textRaw": "Event: 'abort'",
                                "type": "event",
                                "name": "abort",
                                "desc": "<p><code>function () { }</code>\n\n</p>\n<p>Emitted when the request has been aborted by the client. This event is only\nemitted on the first call to <code>abort()</code>.\n\n</p>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'checkExpectation'",
                                "type": "event",
                                "name": "checkExpectation",
                                "desc": "<p><code>function (request, response) { }</code>\n\n</p>\n<p>Emitted each time a request with an http Expect header is received, where the\nvalue is not 100-continue. If this event isn&#39;t listened for, the server will\nautomatically respond with a 417 Expectation Failed as appropriate.\n\n</p>\n<p>Note that when this event is emitted and handled, the <code>request</code> event will\nnot be emitted.\n\n</p>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'connect'",
                                "type": "event",
                                "name": "connect",
                                "desc": "<p><code>function (response, socket, head) { }</code>\n\n</p>\n<p>Emitted each time a server responds to a request with a <code>CONNECT</code> method. If this\nevent isn&#39;t being listened for, clients receiving a <code>CONNECT</code> method will have\ntheir connections closed.\n\n</p>\n<p>A client server pair that show you how to listen for the <code>&#39;connect&#39;</code> event.\n\n</p>\n<pre><code>const http = require(&#39;http&#39;);\nconst net = require(&#39;net&#39;);\nconst url = require(&#39;url&#39;);\n\n// Create an HTTP tunneling proxy\nvar proxy = http.createServer( (req, res) =&gt; {\n  res.writeHead(200, {&#39;Content-Type&#39;: &#39;text/plain&#39;});\n  res.end(&#39;okay&#39;);\n});\nproxy.on(&#39;connect&#39;, (req, cltSocket, head) =&gt; {\n  // connect to an origin server\n  var srvUrl = url.parse(`http://${req.url}`);\n  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () =&gt; {\n    cltSocket.write(&#39;HTTP/1.1 200 Connection Established\\r\\n&#39; +\n                    &#39;Proxy-agent: Node.js-Proxy\\r\\n&#39; +\n                    &#39;\\r\\n&#39;);\n    srvSocket.write(head);\n    srvSocket.pipe(cltSocket);\n    cltSocket.pipe(srvSocket);\n  });\n});\n\n// now that proxy is running\nproxy.listen(1337, &#39;127.0.0.1&#39;, () =&gt; {\n\n  // make a request to a tunneling proxy\n  var options = {\n    port: 1337,\n    hostname: &#39;127.0.0.1&#39;,\n    method: &#39;CONNECT&#39;,\n    path: &#39;www.google.com:80&#39;\n  };\n\n  var req = http.request(options);\n  req.end();\n\n  req.on(&#39;connect&#39;, (res, socket, head) =&gt; {\n    console.log(&#39;got connected!&#39;);\n\n    // make a request over an HTTP tunnel\n    socket.write(&#39;GET / HTTP/1.1\\r\\n&#39; +\n                 &#39;Host: www.google.com:80\\r\\n&#39; +\n                 &#39;Connection: close\\r\\n&#39; +\n                 &#39;\\r\\n&#39;);\n    socket.on(&#39;data&#39;, (chunk) =&gt; {\n      console.log(chunk.toString());\n    });\n    socket.on(&#39;end&#39;, () =&gt; {\n      proxy.close();\n    });\n  });\n});</code></pre>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'continue'",
                                "type": "event",
                                "name": "continue",
                                "desc": "<p><code>function () { }</code>\n\n</p>\n<p>Emitted when the server sends a &#39;100 Continue&#39; HTTP response, usually because\nthe request contained &#39;Expect: 100-continue&#39;. This is an instruction that\nthe client should send the request body.\n\n</p>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'response'",
                                "type": "event",
                                "name": "response",
                                "desc": "<p><code>function (response) { }</code>\n\n</p>\n<p>Emitted when a response is received to this request. This event is emitted only\nonce. The <code>response</code> argument will be an instance of [<code>http.IncomingMessage</code>][].\n\n</p>\n<p>Options:\n\n</p>\n<ul>\n<li><code>host</code>: A domain name or IP address of the server to issue the request to.</li>\n<li><code>port</code>: Port of remote server.</li>\n<li><code>socketPath</code>: Unix Domain Socket (use one of host:port or socketPath)</li>\n</ul>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'socket'",
                                "type": "event",
                                "name": "socket",
                                "desc": "<p><code>function (socket) { }</code>\n\n</p>\n<p>Emitted after a socket is assigned to this request.\n\n</p>\n",
                                "params": []
                            },
                            {
                                "textRaw": "Event: 'upgrade'",
                                "type": "event",
                                "name": "upgrade",
                                "desc": "<p><code>function (response, socket, head) { }</code>\n\n</p>\n<p>Emitted each time a server responds to a request with an upgrade. If this\nevent isn&#39;t being listened for, clients receiving an upgrade header will have\ntheir connections closed.\n\n</p>\n<p>A client server pair that show you how to listen for the <code>&#39;upgrade&#39;</code> event.\n\n</p>\n<pre><code>const http = require(&#39;http&#39;);\n\n// Create an HTTP server\nvar srv = http.createServer( (req, res) =&gt; {\n  res.writeHead(200, {&#39;Content-Type&#39;: &#39;text/plain&#39;});\n  res.end(&#39;okay&#39;);\n});\nsrv.on(&#39;upgrade&#39;, (req, socket, head) =&gt; {\n  socket.write(&#39;HTTP/1.1 101 Web Socket Protocol Handshake\\r\\n&#39; +\n               &#39;Upgrade: WebSocket\\r\\n&#39; +\n               &#39;Connection: Upgrade\\r\\n&#39; +\n               &#39;\\r\\n&#39;);\n\n  socket.pipe(socket); // echo back\n});\n\n// now that server is running\nsrv.listen(1337, &#39;127.0.0.1&#39;, () =&gt; {\n\n  // make a request\n  var options = {\n    port: 1337,\n    hostname: &#39;127.0.0.1&#39;,\n    headers: {\n      &#39;Connection&#39;: &#39;Upgrade&#39;,\n      &#39;Upgrade&#39;: &#39;websocket&#39;\n    }\n  };\n\n  var req = http.request(options);\n  req.end();\n\n  req.on(&#39;upgrade&#39;, (res, socket, upgradeHead) =&gt; {\n    console.log(&#39;got upgraded!&#39;);\n    socket.end();\n    process.exit(0);\n  });\n});</code></pre>\n",
                                "params": []
                            }
                        ],
                        "methods": [
                            {
                                "textRaw": "request.abort()",
                                "type": "method",
                                "name": "abort",
                                "desc": "<p>Marks the request as aborting. Calling this will cause remaining data\nin the response to be dropped and the socket to be destroyed.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": []
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.end([data][, encoding][, callback])",
                                "type": "method",
                                "name": "end",
                                "desc": "<p>Finishes sending the request. If any parts of the body are\nunsent, it will flush them to the stream. If the request is\nchunked, this will send the terminating <code>&#39;0\\r\\n\\r\\n&#39;</code>.\n\n</p>\n<p>If <code>data</code> is specified, it is equivalent to calling\n[<code>response.write(data, encoding)</code>][] followed by <code>request.end(callback)</code>.\n\n</p>\n<p>If <code>callback</code> is specified, it will be called when the request stream\nis finished.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": [
                                            {
                                                "name": "data",
                                                "optional": true
                                            },
                                            {
                                                "name": "encoding",
                                                "optional": true
                                            },
                                            {
                                                "name": "callback",
                                                "optional": true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.flushHeaders()",
                                "type": "method",
                                "name": "flushHeaders",
                                "desc": "<p>Flush the request headers.\n\n</p>\n<p>For efficiency reasons, Node.js normally buffers the request headers until you\ncall <code>request.end()</code> or write the first chunk of request data.  It then tries\nhard to pack the request headers and data into a single TCP packet.\n\n</p>\n<p>That&#39;s usually what you want (it saves a TCP round-trip) but not when the first\ndata isn&#39;t sent until possibly much later.  <code>request.flushHeaders()</code> lets you bypass\nthe optimization and kickstart the request.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": []
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.setNoDelay([noDelay])",
                                "type": "method",
                                "name": "setNoDelay",
                                "desc": "<p>Once a socket is assigned to this request and is connected\n[<code>socket.setNoDelay()</code>][] will be called.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": [
                                            {
                                                "name": "noDelay",
                                                "optional": true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.setSocketKeepAlive([enable][, initialDelay])",
                                "type": "method",
                                "name": "setSocketKeepAlive",
                                "desc": "<p>Once a socket is assigned to this request and is connected\n[<code>socket.setKeepAlive()</code>][] will be called.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": [
                                            {
                                                "name": "enable",
                                                "optional": true
                                            },
                                            {
                                                "name": "initialDelay",
                                                "optional": true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.setTimeout(timeout[, callback])",
                                "type": "method",
                                "name": "setTimeout",
                                "desc": "<p>Once a socket is assigned to this request and is connected\n[<code>socket.setTimeout()</code>][] will be called.\n\n</p>\n<ul>\n<li><code>timeout</code> {Number} Milliseconds before a request is considered to be timed out.</li>\n<li><code>callback</code> {Function} Optional function to be called when a timeout occurs. Same as binding to the <code>timeout</code> event.</li>\n</ul>\n",
                                "signatures": [
                                    {
                                        "params": [
                                            {
                                                "name": "timeout"
                                            },
                                            {
                                                "name": "callback",
                                                "optional": true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "textRaw": "request.write(chunk[, encoding][, callback])",
                                "type": "method",
                                "name": "write",
                                "desc": "<p>Sends a chunk of the body.  By calling this method\nmany times, the user can stream a request body to a\nserver--in that case it is suggested to use the\n<code>[&#39;Transfer-Encoding&#39;, &#39;chunked&#39;]</code> header line when\ncreating the request.\n\n</p>\n<p>The <code>chunk</code> argument should be a [<code>Buffer</code>][] or a string.\n\n</p>\n<p>The <code>encoding</code> argument is optional and only applies when <code>chunk</code> is a string.\nDefaults to <code>&#39;utf8&#39;</code>.\n\n</p>\n<p>The <code>callback</code> argument is optional and will be called when this chunk of data\nis flushed.\n\n</p>\n<p>Returns <code>request</code>.\n\n</p>\n",
                                "signatures": [
                                    {
                                        "params": [
                                            {
                                                "name": "chunk"
                                            },
                                            {
                                                "name": "encoding",
                                                "optional": true
                                            },
                                            {
                                                "name": "callback",
                                                "optional": true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "properties": [
                    {
                        "textRaw": "`METHODS` {Array} ",
                        "name": "METHODS",
                        "desc": "<p>A list of the HTTP methods that are supported by the parser.\n\n</p>\n"
                    },
                    {
                        "textRaw": "`STATUS_CODES` {Object} ",
                        "name": "STATUS_CODES",
                        "desc": "<p>A collection of all the standard HTTP response status codes, and the\nshort description of each.  For example, <code>http.STATUS_CODES[404] === &#39;Not\nFound&#39;</code>.\n\n</p>\n"
                    },
                    {
                        "textRaw": "http.globalAgent",
                        "name": "globalAgent",
                        "desc": "<p>Global instance of Agent which is used as the default for all http client\nrequests.\n\n</p>\n"
                    }
                ],
                "methods": [
                    {
                        "textRaw": "http.createClient([port][, host])",
                        "type": "method",
                        "name": "createClient",
                        "stability": 0,
                        "stabilityText": "Deprecated: Use [`http.request()`][] instead.",
                        "desc": "<p>Constructs a new HTTP client. <code>port</code> and <code>host</code> refer to the server to be\nconnected to.\n\n</p>\n",
                        "signatures": [
                            {
                                "params": [
                                    {
                                        "name": "port",
                                        "optional": true
                                    },
                                    {
                                        "name": "host",
                                        "optional": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "textRaw": "http.createServer([requestListener])",
                        "type": "method",
                        "name": "createServer",
                        "desc": "<p>Returns a new instance of [<code>http.Server</code>][].\n\n</p>\n<p>The <code>requestListener</code> is a function which is automatically\nadded to the <code>&#39;request&#39;</code> event.\n\n</p>\n",
                        "signatures": [
                            {
                                "params": [
                                    {
                                        "name": "requestListener",
                                        "optional": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "textRaw": "http.get(options[, callback])",
                        "type": "method",
                        "name": "get",
                        "desc": "<p>Since most requests are GET requests without bodies, Node.js provides this\nconvenience method. The only difference between this method and [<code>http.request()</code>][]\nis that it sets the method to GET and calls <code>req.end()</code> automatically.\n\n</p>\n<p>Example:\n\n</p>\n<pre><code>http.get(&#39;http://www.google.com/index.html&#39;, (res) =&gt; {\n  console.log(`Got response: ${res.statusCode}`);\n  // consume response body\n  res.resume();\n}).on(&#39;error&#39;, (e) =&gt; {\n  console.log(`Got error: ${e.message}`);\n});</code></pre>\n",
                        "signatures": [
                            {
                                "params": [
                                    {
                                        "name": "options"
                                    },
                                    {
                                        "name": "callback",
                                        "optional": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "textRaw": "http.request(options[, callback])",
                        "type": "method",
                        "name": "request",
                        "desc": "<p>Node.js maintains several connections per server to make HTTP requests.\nThis function allows one to transparently issue requests.\n\n</p>\n<p><code>options</code> can be an object or a string. If <code>options</code> is a string, it is\nautomatically parsed with [<code>url.parse()</code>][].\n\n</p>\n<p>Options:\n\n</p>\n<ul>\n<li><code>protocol</code>: Protocol to use. Defaults to <code>&#39;http:&#39;</code>.</li>\n<li><code>host</code>: A domain name or IP address of the server to issue the request to.\nDefaults to <code>&#39;localhost&#39;</code>.</li>\n<li><code>hostname</code>: Alias for <code>host</code>. To support [<code>url.parse()</code>][] <code>hostname</code> is\npreferred over <code>host</code>.</li>\n<li><code>family</code>: IP address family to use when resolving <code>host</code> and <code>hostname</code>.\nValid values are <code>4</code> or <code>6</code>. When unspecified, both IP v4 and v6 will be\nused.</li>\n<li><code>port</code>: Port of remote server. Defaults to 80.</li>\n<li><code>localAddress</code>: Local interface to bind for network connections.</li>\n<li><code>socketPath</code>: Unix Domain Socket (use one of host:port or socketPath).</li>\n<li><code>method</code>: A string specifying the HTTP request method. Defaults to <code>&#39;GET&#39;</code>.</li>\n<li><code>path</code>: Request path. Defaults to <code>&#39;/&#39;</code>. Should include query string if any.\nE.G. <code>&#39;/index.html?page=12&#39;</code>. An exception is thrown when the request path\ncontains illegal characters. Currently, only spaces are rejected but that\nmay change in the future.</li>\n<li><code>headers</code>: An object containing request headers.</li>\n<li><code>auth</code>: Basic authentication i.e. <code>&#39;user:password&#39;</code> to compute an\nAuthorization header.</li>\n<li><code>agent</code>: Controls [<code>Agent</code>][] behavior. When an Agent is used request will\ndefault to <code>Connection: keep-alive</code>. Possible values:<ul>\n<li><code>undefined</code> (default): use [<code>http.globalAgent</code>][] for this host and port.</li>\n<li><code>Agent</code> object: explicitly use the passed in <code>Agent</code>.</li>\n<li><code>false</code>: opts out of connection pooling with an Agent, defaults request to\n<code>Connection: close</code>.</li>\n</ul>\n</li>\n</ul>\n<p>The optional <code>callback</code> parameter will be added as a one time listener for\nthe <code>&#39;response&#39;</code> event.\n\n</p>\n<p><code>http.request()</code> returns an instance of the [<code>http.ClientRequest</code>][]\nclass. The <code>ClientRequest</code> instance is a writable stream. If one needs to\nupload a file with a POST request, then write to the <code>ClientRequest</code> object.\n\n</p>\n<p>Example:\n\n</p>\n<pre><code>var postData = querystring.stringify({\n  &#39;msg&#39; : &#39;Hello World!&#39;\n});\n\nvar options = {\n  hostname: &#39;www.google.com&#39;,\n  port: 80,\n  path: &#39;/upload&#39;,\n  method: &#39;POST&#39;,\n  headers: {\n    &#39;Content-Type&#39;: &#39;application/x-www-form-urlencoded&#39;,\n    &#39;Content-Length&#39;: postData.length\n  }\n};\n\nvar req = http.request(options, (res) =&gt; {\n  console.log(`STATUS: ${res.statusCode}`);\n  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);\n  res.setEncoding(&#39;utf8&#39;);\n  res.on(&#39;data&#39;, (chunk) =&gt; {\n    console.log(`BODY: ${chunk}`);\n  });\n  res.on(&#39;end&#39;, () =&gt; {\n    console.log(&#39;No more data in response.&#39;)\n  })\n});\n\nreq.on(&#39;error&#39;, (e) =&gt; {\n  console.log(`problem with request: ${e.message}`);\n});\n\n// write data to request body\nreq.write(postData);\nreq.end();</code></pre>\n<p>Note that in the example <code>req.end()</code> was called. With <code>http.request()</code> one\nmust always call <code>req.end()</code> to signify that you&#39;re done with the request -\neven if there is no data being written to the request body.\n\n</p>\n<p>If any error is encountered during the request (be that with DNS resolution,\nTCP level errors, or actual HTTP parse errors) an <code>&#39;error&#39;</code> event is emitted\non the returned request object. As with all <code>&#39;error&#39;</code> events, if no listeners\nare registered the error will be thrown.\n\n</p>\n<p>There are a few special headers that should be noted.\n\n</p>\n<ul>\n<li><p>Sending a &#39;Connection: keep-alive&#39; will notify Node.js that the connection to\nthe server should be persisted until the next request.</p>\n</li>\n<li><p>Sending a &#39;Content-length&#39; header will disable the default chunked encoding.</p>\n</li>\n<li><p>Sending an &#39;Expect&#39; header will immediately send the request headers.\nUsually, when sending &#39;Expect: 100-continue&#39;, you should both set a timeout\nand listen for the <code>&#39;continue&#39;</code> event. See RFC2616 Section 8.2.3 for more\ninformation.</p>\n</li>\n<li><p>Sending an Authorization header will override using the <code>auth</code> option\nto compute basic authentication.</p>\n</li>\n</ul>\n",
                        "signatures": [
                            {
                                "params": [
                                    {
                                        "name": "options"
                                    },
                                    {
                                        "name": "callback",
                                        "optional": true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "type": "module",
                "displayName": "HTTP"
            }
        ]
    }
};
