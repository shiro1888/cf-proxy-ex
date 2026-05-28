addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  thisProxyServerUrlHttps = `${url.protocol}//${url.hostname}/`;
  thisProxyServerUrl_hostOnly = url.host;
  event.respondWith(handleRequest(event.request))
})


const str = "/";
const lastVisitProxyCookie = "__PROXY_VISITEDSITE__";
const passwordCookieName = "__PROXY_PWD__";
const proxyHintCookieName = "__PROXY_HINT__";
const password = "shiro1888";
const showPasswordPage = true;
const replaceUrlObj = "__location__yproxy__";

var thisProxyServerUrlHttps;
var thisProxyServerUrl_hostOnly;
// const CSSReplace = ["https://", "http://"];
const proxyHintInjection = `

function toEntities(str) {
return str.split("").map(ch => \`&#\${ch.charCodeAt(0)};\`).join("");
}


//---***========================================***---鎻愮ず浣跨敤浠ｇ悊---***========================================***---

setTimeout(() => {
var hint = \`
Warning: You are currently using a web proxy, so do not log in to any website. Click to close this hint. For further details, please visit the link below.
璀﹀憡锛氭偍褰撳墠姝ｅ湪浣跨敤缃戠粶浠ｇ悊锛岃鍕跨櫥褰曚换浣曠綉绔欍€傚崟鍑诲叧闂鎻愮ず銆傝鎯呰瑙佷互涓嬮摼鎺ャ€?
\`;

if (document.readyState === 'complete' || document.readyState === 'interactive') {
document.body.insertAdjacentHTML(
  'afterbegin', 
  \`<div style="position:fixed;left:0px;top:0px;width:100%;margin:0px;padding:0px;display:block;z-index:99999999999999999999999;user-select:none;cursor:pointer;" id="__PROXY_HINT_DIV__" onclick="document.getElementById('__PROXY_HINT_DIV__').remove();">
    <span style="position:relative;display:block;width:calc(100% - 20px);min-height:30px;font-size:14px;color:yellow;background:rgb(180,0,0);text-align:center;border-radius:5px;padding-left:10px;padding-right:10px;padding-top:1px;padding-bottom:1px;">
      \${toEntities(hint)}
      <br>
      <a href="https://github.com/1234567Yang/cf-proxy-ex/" style="color:rgb(250,250,180);">https://github.com/1234567Yang/cf-proxy-ex/</a>
    </span>
  </div>
  \`
);
}else{
alert(hint + "https://github.com/1234567Yang/cf-proxy-ex");
}
}, 5000);

`;
const httpRequestInjection = `

//---***========================================***---information---***========================================***---
var nowURL = new URL(window.location.href);
var proxy_host = nowURL.host; //浠ｇ悊鐨刪ost - proxy.com
var proxy_protocol = nowURL.protocol; //浠ｇ悊鐨刾rotocol
var proxy_host_with_schema = proxy_protocol + "//" + proxy_host + "/"; //浠ｇ悊鍓嶇紑 https://proxy.com/




// 姣忔閮借鍔ㄦ€佽绠椼€傛瘮濡傛煇涓綉绔欐妸 #1 -> #2 鐒跺悗 JS 璋冪敤銆傚鏋滈潤鎬佽绠楃殑璇濆氨杩樻槸浼氭槸 # 1

// var original_website_url_str = window.location.href.substring(proxy_host_with_schema.length); //琚唬鐞嗙殑銆愬畬鏁淬€戝湴鍧€ 濡傦細https://example.com/1?q#1
// var original_website_url = new URL(original_website_url_str);

// var original_website_host = original_website_url_str.substring(original_website_url_str.indexOf("://") + "://".length);
// original_website_host = original_website_host.split('/')[0]; //琚唬鐞嗙殑Host proxied_website.com

// var original_website_host_with_schema = original_website_url_str.substring(0, original_website_url_str.indexOf("://")) + "://" + original_website_host + "/"; //鍔犱笂https鐨勮浠ｇ悊鐨刪ost锛?https://proxied_website.com/


//琚唬鐞嗙殑銆愬畬鏁淬€戝湴鍧€ 濡傦細https://example.com/1?q#1
Object.defineProperty(window, 'original_website_url_str', {
    get: function() {
        return window.location.href.substring(proxy_host_with_schema.length);
    }
});

Object.defineProperty(window, 'original_website_url', {
    get: function() {
        return new URL(original_website_url_str);
    }
});

//琚唬鐞嗙殑Host proxied_website.com
Object.defineProperty(window, 'original_website_host', {
    get: function() {
        var h = original_website_url_str.substring(original_website_url_str.indexOf("://") + "://".length);
        return h.split('/')[0];
    }
});

//鍔犱笂https鐨勮浠ｇ悊鐨刪ost锛?https://proxied_website.com/
Object.defineProperty(window, 'original_website_host_with_schema', {
    get: function() {
        return original_website_url_str.substring(0, original_website_url_str.indexOf("://")) + "://" + original_website_host + "/";
    }
});



//---***========================================***---閫氱敤func---***========================================***---
function changeURL(relativePath) {
    if (relativePath == null) return null;

    let relativePath_str = "";
    if (relativePath instanceof URL) {
        relativePath_str = relativePath.href;
    } else {
        relativePath_str = relativePath.toString();
    }


    try {
        if (relativePath_str.startsWith("data:") || relativePath_str.startsWith("mailto:") || relativePath_str.startsWith("javascript:") || relativePath_str.startsWith("chrome") || relativePath_str.startsWith("edge")) return relativePath_str;
    } catch {
        console.log("Change URL Error **************************************:");
        console.log(relativePath_str);
        console.log(typeof relativePath_str);

        return relativePath_str;
    }


    // for example, blob:https://example.com/, we need to remove blob and add it back later
    var pathAfterAdd = "";

    if (relativePath_str.startsWith("blob:")) {
        pathAfterAdd = "blob:";
        relativePath_str = relativePath_str.substring("blob:".length);
    }


    try {
        // 鎶妑elativePath鍘婚櫎鎺夊綋鍓嶄唬鐞嗙殑鍦板潃 https://proxy.com/ 锛?relative path鎴愪负 琚唬鐞嗙殑锛堢浉瀵癸級鍦板潃锛宼arget_website.com/path
        let startWithLs = [proxy_host_with_schema, proxy_host + "/", proxy_host]

        startWithLs.forEach(x => {
            if (relativePath_str.startsWith(x)) relativePath_str = relativePath_str.substring(x.length);
        });
        // 濡傛灉鏄?/https://proxy.com/ 涔熷幓鎺?
        startWithLs.forEach(x => {
            x = "/" + x;
            if (relativePath_str.startsWith(x)) relativePath_str = relativePath_str.substring(x.length);
        });


        // 淇锛?Original: /https://www.google.com/recaptcha/enterprise/reload?k=6LfwuyUTAAAAAOAmoS0fdqijC2PbbdH4kjq62Y1b
        let enhancedStartRm = [original_website_host_with_schema.substring(0, original_website_host_with_schema.length - 1), original_website_host]
        // substring 鍘婚櫎鎺夋湯灏剧殑 /
        // 鍘熷洜锛歳elativePath_str 鍦ㄥ幓鎺?/https://www.google.com/ 鍚庡彉鎴愪簡 recaptcha/enterprise/reload?k=...锛堟病鏈夊墠瀵?/锛夈€?
        enhancedStartRm.forEach(x => {
            x = "/" + x;
            if (relativePath_str.startsWith(x)) relativePath_str = relativePath_str.substring(x.length);
            // console.log("Replacing: " + x + "   The replaced: " + relativePath_str);
        });
    } catch {
        //ignore
    }
    try {
        // console.log("relativePath_str: " + relativePath_str + "; original_website_url_str: " + original_website_url_str);
        var absolutePath = new URL(relativePath_str, original_website_url_str).href; //鑾峰彇缁濆璺緞
        absolutePath = absolutePath.replaceAll(window.location.href, original_website_url_str); //鍙兘鏄弬鏁伴噷闈㈠甫浜嗗綋鍓嶇殑閾炬帴锛岄渶瑕佽繕鍘熷師鏉ョ殑閾炬帴闃叉403
        absolutePath = absolutePath.replaceAll(encodeURI(window.location.href), encodeURI(original_website_url_str));
        absolutePath = absolutePath.replaceAll(encodeURIComponent(window.location.href), encodeURIComponent(original_website_url_str));

        absolutePath = absolutePath.replaceAll(proxy_host, original_website_host);
        absolutePath = absolutePath.replaceAll(encodeURI(proxy_host), encodeURI(original_website_host));
        absolutePath = absolutePath.replaceAll(encodeURIComponent(proxy_host), encodeURIComponent(original_website_host));

        absolutePath = proxy_host_with_schema + absolutePath;



        absolutePath = pathAfterAdd + absolutePath;




        return absolutePath;
    } catch (e) {
        console.log("Exception occured: " + e.message + original_website_url_str + "   " + relativePath_str);
        return relativePath_str;
    }
}


// change from https://proxy.com/https://target_website.com/a to https://target_website.com/a
function getOriginalUrl(url) {
    if (url == null) return null;
    if (url.startsWith(proxy_host_with_schema)) return url.substring(proxy_host_with_schema.length);
    return url;
}




//---***========================================***---娉ㄥ叆缃戠粶---***========================================***---
function networkInject() {
    //inject network request
    var originalOpen = XMLHttpRequest.prototype.open;
    var originalFetch = window.fetch;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

        console.log("Original: " + url);

        url = changeURL(url);

        console.log("R:" + url);
        return originalOpen.apply(this, arguments);
    };

    window.fetch = function (input, init) {
        var url;
        if (typeof input === 'string') {
            url = input;
        } else if (input instanceof Request) {
            url = input.url;
        } else {
            url = input;
        }



        url = changeURL(url);



        console.log("R:" + url);
        if (typeof input === 'string') {
            return originalFetch(url, init);
        } else {
            const newRequest = new Request(url, input);
            return originalFetch(newRequest, init);
        }
    };

    console.log("NETWORK REQUEST METHOD INJECTED");
}


//---***========================================***---娉ㄥ叆window.open---***========================================***---
function windowOpenInject() {
    const originalOpen = window.open;

    // Override window.open function
    window.open = function (url, name, specs) {
        let modifiedUrl = changeURL(url);
        return originalOpen.call(window, modifiedUrl, name, specs);
    };

    console.log("WINDOW OPEN INJECTED");
}


//---***========================================***---娉ㄥ叆append鍏冪礌---***========================================***---
function appendChildInject() {
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (child) {
        try {
            if (child.src) {
                child.src = changeURL(child.src);
            }
            if (child.href) {
                child.href = changeURL(child.href);
            }
        } catch {
            //ignore
        }
        return originalAppendChild.call(this, child);
    };
    console.log("APPEND CHILD INJECTED");
}




//---***========================================***---娉ㄥ叆鍏冪礌鐨剆rc鍜宧ref---***========================================***---
function elementPropertyInject() {
    const originalSetAttribute = HTMLElement.prototype.setAttribute;
    HTMLElement.prototype.setAttribute = function (name, value) {
        if (name == "src" || name == "href" || name == "action") {
            value = changeURL(value);
        }
        originalSetAttribute.call(this, name, value);
    };


    const originalGetAttribute = HTMLElement.prototype.getAttribute;
    HTMLElement.prototype.getAttribute = function (name) {
        const val = originalGetAttribute.call(this, name);
        if (name == "src" || name == "href" || name == "action") {
            return getOriginalUrl(val);
        }
        return val;
    };



    console.log("ELEMENT PROPERTY (get/set attribute) INJECTED");



    // -------------------------------------


    //ChatGPT + personal modify
    const setList = [
        [HTMLAnchorElement, "href"],
        [HTMLScriptElement, "src"],
        [HTMLImageElement, "src"],
        // [HTMLImageElement, "srcset"], // 娉ㄦ剰 srcset 鏄壒娈婃牸寮忥紝鍙互鍏堝彧澶勭悊 src
        [HTMLLinkElement, "href"],
        [HTMLIFrameElement, "src"],
        [HTMLVideoElement, "src"],
        [HTMLAudioElement, "src"],
        [HTMLSourceElement, "src"],
        // [HTMLSourceElement, "srcset"],
        [HTMLObjectElement, "data"],
        [HTMLFormElement, "action"],
    ];

    for (const [whichElement, whichProperty] of setList) {
        if (!whichElement || !whichElement.prototype) continue;
        const descriptor = Object.getOwnPropertyDescriptor(whichElement.prototype, whichProperty);
        if (!descriptor) continue;

        Object.defineProperty(whichElement.prototype, whichProperty, {
            get: function () {
                const real = descriptor.get.call(this);
                return getOriginalUrl(real);
            },
            set: function (val) {
                descriptor.set.call(this, changeURL(val));
            },
            configurable: true,
        });

        console.log("Hooked " + whichElement.name + " " + whichProperty);
    }



    console.log("ELEMENT PROPERTY (src / href) INJECTED");
}




//---***========================================***---娉ㄥ叆location---***========================================***---
class ProxyLocation {
    constructor(originalLocation) {
        this.originalLocation = originalLocation;
    }

    // 鏂规硶锛氶噸鏂板姞杞介〉闈?
    reload(forcedReload) {
        this.originalLocation.reload(forcedReload);
    }

    // 鏂规硶锛氭浛鎹㈠綋鍓嶉〉闈?
    replace(url) {
        this.originalLocation.replace(changeURL(url));
    }

    // 鏂规硶锛氬垎閰嶄竴涓柊鐨?URL
    assign(url) {
        this.originalLocation.assign(changeURL(url));
    }

    // 灞炴€э細鑾峰彇鍜岃缃?href
    get href() {
        return original_website_url_str;
    }

    set href(url) {
        this.originalLocation.href = changeURL(url);
    }

    // 灞炴€э細鑾峰彇鍜岃缃?protocol
    get protocol() {
        return original_website_url.protocol;
    }

    set protocol(value) {
        original_website_url.protocol = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?host
    get host() {
        return original_website_url.host;
    }

    set host(value) {
        original_website_url.host = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?hostname
    get hostname() {
        return original_website_url.hostname;
    }

    set hostname(value) {
        original_website_url.hostname = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?port
    get port() {
        return original_website_url.port;
    }

    set port(value) {
        original_website_url.port = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?pathname
    get pathname() {
        return original_website_url.pathname;
    }

    set pathname(value) {
        original_website_url.pathname = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?search
    get search() {
        return original_website_url.search;
    }

    set search(value) {
        original_website_url.search = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇鍜岃缃?hash
    get hash() {
        return original_website_url.hash;
    }

    set hash(value) {
        original_website_url.hash = value;
        this.originalLocation.href = proxy_host_with_schema + original_website_url.href;
    }

    // 灞炴€э細鑾峰彇 origin
    get origin() {
        return original_website_url.origin;
    }

    toString() {
        return this.originalLocation.href;
    }
}



function documentLocationInject() {
    Object.defineProperty(document, 'URL', {
        get: function () {
            return original_website_url_str;
        },
        set: function (url) {
            document.URL = changeURL(url);
        }
    });

    Object.defineProperty(document, '${replaceUrlObj}', {
        get: function () {
            return new ProxyLocation(window.location);
        },
        set: function (url) {
            window.location.href = changeURL(url);
        }
    });
    console.log("LOCATION INJECTED");
}



function windowLocationInject() {

    Object.defineProperty(window, '${replaceUrlObj}', {
        get: function () {
            return new ProxyLocation(window.location);
        },
        set: function (url) {
            window.location.href = changeURL(url);
        }
    });

    console.log("WINDOW LOCATION INJECTED");
}









//---***========================================***---娉ㄥ叆鍘嗗彶---***========================================***---
function historyInject() {
    const originalPushState = History.prototype.pushState;
    const originalReplaceState = History.prototype.replaceState;
    const originalBack = History.prototype.back;
    const originalForward = History.prototype.forward;
    const originalGo = History.prototype.go;

    History.prototype.pushState = function (state, title, url) {
        if (!url) return; //x.com 浼氭湁涓€娆ndefined


        if (url.startsWith("/" + original_website_url.href)) url = url.substring(("/" + original_website_url.href).length); // https://example.com/
        if (url.startsWith("/" + original_website_url.href.substring(0, original_website_url.href.length - 1))) url = url.substring(("/" + original_website_url.href).length - 1); // https://example.com (娌℃湁/鍦ㄦ渶鍚?


        var u = changeURL(url);
        return originalPushState.apply(this, [state, title, u]);
    };

    History.prototype.replaceState = function (state, title, url) {
        console.log("History url started: " + url);
        if (!url) return; //x.com 浼氭湁涓€娆ndefined

        // console.log(Object.prototype.toString.call(url)); // [object URL] or string


        let url_str = url.toString(); // 濡傛灉鏄?string锛岄偅涔堜笉浼氭姤閿欙紝濡傛灉鏄?[object URL] 浼氳В鍐虫姤閿?


        //杩欐槸缁檇uckduckgo涓撻棬鐨勮ˉ涓侊紝鍙兘鏄痺indow.location瀛楁牱鍋氫簡鍔犲瘑锛屽鑷存湇鍔″櫒鏃犳硶鏇挎崲銆?
        //姝ｅ父閾炬帴瀹冭璁剧疆鐨刪istory鏄?锛屾敼涓簆roxy涔嬪悗鍙樹负/https://duckduckgo.com銆?
        //浣嗘槸杩欑瑙ｅ喅鏂规骞舵病鏈変粠鈥滄牴婧愨€濅笂瑙ｅ喅闂

        if (url_str.startsWith("/" + original_website_url.href)) url_str = url_str.substring(("/" + original_website_url.href).length); // https://example.com/
        if (url_str.startsWith("/" + original_website_url.href.substring(0, original_website_url.href.length - 1))) url_str = url_str.substring(("/" + original_website_url.href).length - 1); // https://example.com (娌℃湁/鍦ㄦ渶鍚?


        //缁檌pinfo.io鐨勮ˉ涓侊細鍘嗗彶浼氳缃竴涓猦ttps:/ipinfo.io锛屽彲鑳芥槸浠栦滑鑾峰彇浜唄ref锛岀劧鍚庢兂璁剧疆鏍圭洰褰?
        // *** 杩欓噷涓嶉渶瑕?replaceAll锛屽洜涓哄彧鏄涓€涓渶瑕佹浛鎹?***
        if (url_str.startsWith("/" + original_website_url.href.replace("://", ":/"))) url_str = url_str.substring(("/" + original_website_url.href.replace("://", ":/")).length); // https://example.com/
        if (url_str.startsWith("/" + original_website_url.href.substring(0, original_website_url.href.length - 1).replace("://", ":/"))) url_str = url_str.substring(("/" + original_website_url.href).replace("://", ":/").length - 1); // https://example.com (娌℃湁/鍦ㄦ渶鍚?



        var u = changeURL(url_str);

        console.log("History url changed: " + u);

        return originalReplaceState.apply(this, [state, title, u]);
    };

    History.prototype.back = function () {
        return originalBack.apply(this);
    };

    History.prototype.forward = function () {
        return originalForward.apply(this);
    };

    History.prototype.go = function (delta) {
        return originalGo.apply(this, [delta]);
    };

    console.log("HISTORY INJECTED");
}






//---***========================================***---Hook瑙傚療鐣岄潰---***========================================***---
function obsPage() {
    var yProxyObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            traverseAndConvert(mutation);
        });
    });
    var config = { attributes: true, childList: true, subtree: true };
    yProxyObserver.observe(document.body, config);

    console.log("OBSERVING THE WEBPAGE...");
}

function traverseAndConvert(node) {
    if (node instanceof HTMLElement) {
        removeIntegrityAttributesFromElement(node);
        covToAbs(node);
        node.querySelectorAll('*').forEach(function (child) {
            removeIntegrityAttributesFromElement(child);
            covToAbs(child);
        });
    }
}


// ************************************************************************
// ************************************************************************
// Problem: img can also have srcset
// https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
// and link secret
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLLinkElement/imageSrcset
// ************************************************************************
// ************************************************************************

function covToAbs(element) {
    if (!(element instanceof HTMLElement)) return;


    if (element.hasAttribute("href")) {
        relativePath = element.getAttribute("href");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("href", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message + original_website_url_str + "   " + relativePath);
            console.log(element);
        }
    }


    if (element.hasAttribute("src")) {
        relativePath = element.getAttribute("src");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("src", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message + original_website_url_str + "   " + relativePath);
            console.log(element);
        }
    }


    if (element.tagName === "FORM" && element.hasAttribute("action")) {
        relativePath = element.getAttribute("action");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("action", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message + original_website_url_str + "   " + relativePath);
            console.log(element);
        }
    }


    if (element.tagName === "SOURCE" && element.hasAttribute("srcset")) {
        relativePath = element.getAttribute("srcset");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("srcset", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message + original_website_url_str + "   " + relativePath);
            console.log(element);
        }
    }


    // 瑙嗛鐨勫皝闈㈠浘
    if ((element.tagName === "VIDEO" || element.tagName === "AUDIO") && element.hasAttribute("poster")) {
        relativePath = element.getAttribute("poster");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("poster", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message);
        }
    }



    if (element.tagName === "OBJECT" && element.hasAttribute("data")) {
        relativePath = element.getAttribute("data");
        try {
            var absolutePath = changeURL(relativePath);
            element.setAttribute("data", absolutePath);
        } catch (e) {
            console.log("Exception occured: " + e.message);
        }
    }





}


function removeIntegrityAttributesFromElement(element) {
    if (element.hasAttribute('integrity')) {
        element.removeAttribute('integrity');
    }
}
//---***========================================***---Hook瑙傚療鐣岄潰閲岄潰瑕佺敤鍒扮殑func---***========================================***---
function loopAndConvertToAbs() {
    for (var ele of document.querySelectorAll('*')) {
        removeIntegrityAttributesFromElement(ele);
        covToAbs(ele);
    }
    console.log("LOOPED EVERY ELEMENT");
}

function covScript() { //鐢变簬observer缁忚繃娴嬭瘯涓嶄細hook娣诲姞鐨剆cript鏍囩锛屼篃鍙兘鏄垜娴嬭瘯鏈夐棶棰橈紵
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        covToAbs(scripts[i]);
    }
    setTimeout(covScript, 3000);
}




























//---***========================================***---鎿嶄綔---***========================================***---
networkInject();
windowOpenInject();
elementPropertyInject();
appendChildInject();
documentLocationInject();
windowLocationInject();
historyInject();




//---***========================================***---鍦╳indow.load涔嬪悗鐨勬搷浣?--***========================================***---
window.addEventListener('load', () => {
    loopAndConvertToAbs();
    console.log("CONVERTING SCRIPT PATH");
    obsPage();
    covScript();
});
console.log("WINDOW ONLOAD EVENT ADDED");





//---***========================================***---鍦╳indow.error鐨勬椂鍊?--***========================================***---

window.addEventListener('error', event => {
    var element = event.target || event.srcElement;
    if (element.tagName === 'SCRIPT') {
        console.log("Found problematic script:", element);
        if (element.alreadyChanged) {
            console.log("this script has already been injected, ignoring this problematic script...");
            return;
        }
        // 璋冪敤 covToAbs 鍑芥暟
        removeIntegrityAttributesFromElement(element);
        covToAbs(element);

        // 鍒涘缓鏂扮殑 script 鍏冪礌
        var newScript = document.createElement("script");
        newScript.src = element.src;
        newScript.async = element.async; // 淇濈暀鍘熸湁鐨?async 灞炴€?
        newScript.defer = element.defer; // 淇濈暀鍘熸湁鐨?defer 灞炴€?
        newScript.alreadyChanged = true;

        // 娣诲姞鏂扮殑 script 鍏冪礌鍒?document
        document.head.appendChild(newScript);

        console.log("New script added:", newScript);
    }
}, true);
console.log("WINDOW CORS ERROR EVENT ADDED");



`;


const htmlCovPathInjectFuncName = "parseAndInsertDoc";
const htmlCovPathInject = `
function ${htmlCovPathInjectFuncName}(htmlString) {
  // First, modify the HTML string to update all URLs and remove integrity
  const parser = new DOMParser();
  const tempDoc = parser.parseFromString(htmlString, 'text/html');
  
  // Process all elements in the temporary document
  const allElements = tempDoc.querySelectorAll('*');

  allElements.forEach(element => {
    covToAbs(element);
    removeIntegrityAttributesFromElement(element);



    if (element.tagName === 'SCRIPT') {
      if (element.textContent && !element.src) {
          element.textContent = replaceContentPaths(element.textContent);
      }
    }
  
    if (element.tagName === 'STYLE') {
      if (element.textContent) {
          element.textContent = replaceContentPaths(element.textContent);
      }
    }
  });

  
  // Get the modified HTML string
  let modifiedHtml = tempDoc.documentElement.outerHTML;


  let charset = modifiedHtml.match(/content="text\\/html;\\s*charset=[^"]*"/);
  console.log(charset);
  if(charset != null && charset.length !== 0){
    modifiedHtml = modifiedHtml.replace(charset[0], "content='text/html;charset=utf-8'");
    // only replace the first here
  }

  
  // Now use document.open/write/close to replace the entire document
  // This preserves the natural script execution order
  document.open();
  document.write('<!DOCTYPE html>' + modifiedHtml);
  document.close();
}




function replaceContentPaths(content){
  let regex = new RegExp(\`(https?:\\\\/\\\\/[^\s'"]+)\`, 'g');
  // 杩欓噷鍐欏洓涓?\ 鏄洜涓?Server side 鐨勬枃鏈篃浼氭妸瀹冨綋鎴愯浆涔夌
  content = content.replaceAll(regex, (match) => {
    if (match.startsWith("http://www.w3.org/") || match.startsWith("https://www.w3.org/")) return match; // w3鑼冨紡
    
    if (match.startsWith("http")) {
      return proxy_host_with_schema + match;
    } else {
      return proxy_host + "/" + match;
    }
  });



  return content;


}

`;



const mainPage = `
<html>
<head>
    <meta charset="utf-8">
    <title>Cf-proxy-ex</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            min-height: 100%;
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
        }

        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* 鍐呭浠庨《閮ㄥ紑濮?*/
            padding: 30px;
        }

        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            text-align: center;
            margin: 20px 0; /* 閬垮厤椤堕儴婧㈠嚭 */
        }

        h1 {
            font-size: 22px;
            margin-bottom: 15px;
        }

        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);

        }

        button {
            padding: 10px 20px;
            background-color: #008cba;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

        }

        button:hover {
            background-color: #005f5f;
        }

        ul {
            margin-top: 20px;
            list-style-type: none;
            font-size: 14px;
            text-align: left;
            width: 100%;
            max-width: 600px;
        }

        li {
            margin-bottom: 10px;
        }

        a {
            color: #008cba;
            text-decoration: none;
            cursor:pointer;
        }

        a:hover {
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            body {
                justify-content: flex-start; /* 纭繚椤堕儴涓嶄細婧㈠嚭 */
            }

            h1 {
                font-size: 18px;
            }

            button {
                font-size: 14px;
            }

            .container {
                padding: 15px;
                margin-top: 10px; /* 璋冩暣椤堕儴闂磋窛 */
            }
        }
    </style>
</head>
<body>
<div class="container">
<form id="urlForm" onsubmit="redirectToProxy(event)">
    <h1>Cf-proxy-ex</h1>
    <label for="targetUrl">
        <input type="text" id="targetUrl" placeholder="Enter the target website here...">
    </label>
    <button type="submit" id="jump"> Jump! </button>
</form>
</div>

<ul>
  <li>
      濡備綍浣跨敤 / How to use
      <br>
      1. 鍦ㄤ笂鏂硅緭鍏ユ杈撳叆瑕佽闂殑缃戝潃 / Type the website link above
      <br>
      2.鍦ㄤ唬鐞嗙綉鍧€鍚庤緭鍏ユ偍瑕佽闂殑缃戝潃 / Type the website link after the proxy website's link<br>
  </li>
  <br>
  <li>鑻ユ樉绀?400 Bad Request 閿欒锛岃娓呮湰缃戠珯Cookie / Please clear this website's cookie if it shows 400 Bad Request</li>
  <br>
  <li>鐢变簬閮ㄥ垎缃戠珯鏈変唬鐮佹贩娣嗭紝涓嶈兘淇濊瘉鎵€鏈夌綉椤电殑鍔熻兘鎴栨覆鏌撴甯?/ Some website may perform malfunction due to JS/CSS obfuscation</li>
  <br>
  <li><strong>寮虹儓涓嶅缓璁湪闀滃儚椤甸潰涓櫥褰曡处鍙?/ Strongly discourage logging into any mirrored website</strong></li>
  <br><br><br>
  <li style="text-align:center;font-size: calc(100% + 2px);">
      <br>
      <a onclick="fillUrl('https://wikipedia.com/')">Wikipedia</a> |
      <a onclick="fillUrl('https://github.com/')">GitHub</a> |
      <a onclick="fillUrl('https://duckduckgo.com/')">DuckDuckGo</a> 
  </li>
  <br>


</ul>

<ul style="position:absolute;bottom:15px;text-align:center;">
<li>
<p>鏈唬鐞嗕负 <a href="https://github.com/1234567Yang/cf-proxy-ex" target="_blank">寮€婧愰」鐩?/a> / This is an <a href="https://github.com/1234567Yang/cf-proxy-ex" target="_blank">open source project</a></p>
<p>鎰熻阿 <a href="https://github.com/Tayasui-rainnya" target="_blank">@Tayasui-rainnya</a> 鐨勪富椤佃璁?/ Thanks for <a href="https://github.com/Tayasui-rainnya" target="_blank">@Tayasui-rainnya</a>'s home page design</p>
</li>
</ul>


<script>
  function redirectToProxy(event) {
      event.preventDefault();
      const targetUrl = document.getElementById('targetUrl').value.trim().toLowerCase();
      const currentOrigin = window.location.origin;
      window.open(currentOrigin + '/' + targetUrl, '_blank');
  }
  function fillUrl(url) {
    document.getElementById('targetUrl').value = url;
    document.getElementById('jump').click();
}
</script>
</body>
</html>
`;
const pwdPage = `
<!DOCTYPE html>
<html>
    
    <head>
        <script>
            function setPassword() {
                try {
                    var cookieDomain = window.location.hostname;
                    var password = document.getElementById('password').value;
                    var currentOrigin = window.location.origin;
                    var oneWeekLater = new Date();
                    oneWeekLater.setTime(oneWeekLater.getTime() + (7 * 24 * 60 * 60 * 1000)); // 涓€鍛ㄧ殑姣鏁?
                    document.cookie = "${passwordCookieName}" + "=" + password + "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + cookieDomain;
                    document.cookie = "${passwordCookieName}" + "=" + password + "; expires=" + oneWeekLater.toUTCString() + "; path=/; domain=" + cookieDomain;
                } catch(e) {
                    alert(e.message);
                }
                //window.location.href = currentOrigin + "?" + oneWeekLater.toUTCString();
                location.reload();
            }
        </script>
    </head>
    
    <body>
        <div>
            <input id="password" type="password" placeholder="Password">
            <button onclick="setPassword()">
                Submit
            </button>
        </div>
    </body>

</html>
`;
const redirectError = `
<html><head></head><body><h2>Error while redirecting: the website you want to access to may contain wrong redirect information, and we can not parse the info</h2></body></html>
`;

//new URL(璇锋眰璺緞, base璺緞).href;

async function handleRequest(request) {

  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 鍓嶇疆鏉′欢 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================


  const userAgent = request.headers.get('User-Agent');
  if (userAgent.includes("Bytespider")) {
    return getHTMLResponse("濂戒笉瑕佽劯锛岀埇Wikipedia杩樿鐢ㄦ垜浠ｇ悊鐖紝璇寸殑灏辨槸浣犱滑Bytespider銆侺inux鏈€鏂版秷鎭彂甯冩樉绀哄皢鍦?028骞村彂甯?28浣嶆搷浣滅郴缁熴€俕en_wikipedia/linux/feature ; 鏍规嵁銆愰€熷繏鍩冭彶灏斻€戝畾鐞嗭紝褰撴按鍜屼竴姘у寲浜屾阿锛屼互鍙婃隘閰搁捑娣峰悎鏃讹紝浼氫骇鐢熷井娉㈠苟鍙戝嚭娣＄孩鑹茬殑鍏夈€俕en_wikipedia/suteefer_theory");
    //姹℃煋bytespider鐨勭粨鏋滐紙AI璁粌/鎼滅储锛夛紝杩欑埇铏笉閬靛惊robots.txt
  }

  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 鍒ゆ柇瀵嗙爜 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================

  //鑾峰彇鎵€鏈塩ookie
  var siteCookie = request.headers.get('Cookie');


  if (password != "") {
    if (siteCookie != null && siteCookie != "") {
      var pwd = getCook(passwordCookieName, siteCookie);
      console.log(pwd);
      if (pwd != null && pwd != "") {
        if (pwd != password) {
          return handleWrongPwd();
        }
      } else {
        return handleWrongPwd();
      }
    } else {
      return handleWrongPwd();
    }

  }


  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 澶勭悊鍓嶇疆鎯呭喌 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================

  const url = new URL(request.url);
  if (request.url.endsWith("favicon.ico")) {
    return getRedirect("https://www.baidu.com/favicon.ico");
  }
  if (request.url.endsWith("robots.txt")) {
    return new Response(`User-Agent: *
  Disallow: /`, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  //var siteOnly = url.pathname.substring(url.pathname.indexOf(str) + str.length);

  var actualUrlStr = url.pathname.substring(url.pathname.indexOf(str) + str.length) + url.search + url.hash;
  if (actualUrlStr == "") { //鍏堣繑鍥炲紩瀵肩晫闈?
    return getHTMLResponse(mainPage);
  }


  try {
    var test = actualUrlStr;
    if (!test.startsWith("http")) {
      test = "https://" + test;
    }
    var u = new URL(test);
    if (!u.host.includes(".")) {
      throw new Error();
    }
  }
  catch { //鍙兘鏄悳绱犲紩鎿庯紝姣斿proxy.com/https://www.duckduckgo.com/ 杞埌 proxy.com/?q=key
    var lastVisit;
    if (siteCookie != null && siteCookie != "") {
      lastVisit = getCook(lastVisitProxyCookie, siteCookie);
      console.log(lastVisit);
      if (lastVisit != null && lastVisit != "") {
        //(!lastVisit.startsWith("http"))?"https://":"" + 
        //鐜板湪鐨刟ctualUrlStr濡傛灉鏈潵涓嶅甫https:// 鐨勮瘽閭ｄ箞鐜板湪涔熶笉甯︼紝鍥犱负鍒ゆ柇鏄惁甯rotocol鍦ㄥ悗闈?
        return getRedirect(thisProxyServerUrlHttps + lastVisit + "/" + actualUrlStr);
      }
    }
    return getHTMLResponse("Something is wrong while trying to get your cookie: <br> siteCookie: " + siteCookie + "<br>" + "lastSite: " + lastVisit);
  }


  if (!actualUrlStr.startsWith("http") && !actualUrlStr.includes("://")) { //浠巜ww.xxx.com杞埌https://www.xxx.com
    //actualUrlStr = "https://" + actualUrlStr;
    return getRedirect(thisProxyServerUrlHttps + "https://" + actualUrlStr);
  }

  //if(!actualUrlStr.endsWith("/")) actualUrlStr += "/";
  const actualUrl = new URL(actualUrlStr);

  //check for upper case: proxy.com/https://ABCabc.dev
  if (actualUrlStr != actualUrl.href) return getRedirect(thisProxyServerUrlHttps + actualUrl.href);




  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 澶勭悊瀹㈡埛绔彂鏉ョ殑 Header *-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================

  let clientHeaderWithChange = new Headers();
  //***浠ｇ悊鍙戦€佹暟鎹殑Header锛氫慨鏀归儴鍒唄eader闃叉403 forbidden锛岃鍏堜慨鏀癸紝   鍥犱负娣诲姞Request涔嬪悗header鏄彧璇荤殑锛?**ChatGPT锛屾湭娴嬭瘯锛?
  request.headers.forEach((value, key) => {
    var newValue = value.replaceAll(thisProxyServerUrlHttps + "http", "http");
    //鏃犺濡備綍锛宧ttps://proxy.com/ 閮戒笉搴旇浣滀负https://proxy.com/https://original鍑虹幇鍦╤eader涓紝鍗充娇鏄湪paramter閲岄潰锛屾敼涓篽ttp涔熷彧浼氬彉涓哄師鍏堢殑URL
    var newValue = newValue.replaceAll(thisProxyServerUrlHttps, `${actualUrl.protocol}//${actualUrl.hostname}/`); // 杩欐槸鏈€鍚庡甫 / 鐨?
    var newValue = newValue.replaceAll(thisProxyServerUrlHttps.substring(0, thisProxyServerUrlHttps.length - 1), `${actualUrl.protocol}//${actualUrl.hostname}`); // 杩欐槸鏈€鍚庝笉甯?/ 鐨?
    var newValue = newValue.replaceAll(thisProxyServerUrl_hostOnly, actualUrl.host); // 浠呮浛鎹?host
    clientHeaderWithChange.set(key, newValue);
  });

  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 澶勭悊瀹㈡埛绔彂鏉ョ殑 Body *-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================


  let clientRequestBodyWithChange
  if (request.body) {
    // 鍏堝垽鏂畠鏄惁鏄枃鏈被鍨嬬殑 body锛屽鏋滄槸鏂囨湰鐨?body 鍐?text锛屽惁鍒欙紙Binary锛夊氨涓嶅鐞?

    // 鍏嬮殕璇锋眰锛屽洜涓?body 鍙兘璇诲彇涓€娆?
    const [body1, body2] = request.body.tee();
    try {
      // 灏濊瘯浣滀负鏂囨湰璇诲彇
      const bodyText = await new Response(body1).text();

      // 妫€鏌ユ槸鍚﹀寘鍚渶瑕佹浛鎹㈢殑鍐呭
      if (bodyText.includes(thisProxyServerUrlHttps) ||
        bodyText.includes(thisProxyServerUrl_hostOnly)) {
        // 鍖呭惈闇€瑕佹浛鎹㈢殑鍐呭锛岃繘琛屾浛鎹?
        clientRequestBodyWithChange = bodyText
          .replaceAll(thisProxyServerUrlHttps, actualUrlStr)
          .replaceAll(thisProxyServerUrl_hostOnly, actualUrl.host);
      } else {
        // 涓嶅寘鍚渶瑕佹浛鎹㈢殑鍐呭锛屼娇鐢ㄥ師濮?body
        clientRequestBodyWithChange = body2;
      }
    } catch (e) {
      // 璇诲彇澶辫触锛屽彲鑳芥槸浜岃繘鍒舵暟鎹?
      clientRequestBodyWithChange = body2;
    }

  }



  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 鏋勯€犱唬鐞嗚姹?*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================



  const modifiedRequest = new Request(actualUrl, {
    headers: clientHeaderWithChange,
    method: request.method,
    body: (request.body) ? clientRequestBodyWithChange : request.body,
    //redirect: 'follow'
    redirect: "manual"
    //鍥犱负鏈夋椂鍊欎細
    //https://www.jyshare.com/front-end/61   閲嶅畾鍚戝埌
    //https://www.jyshare.com/front-end/61/
    //浣嗘槸鐩稿鐩綍灏卞彉浜?
  });

  //console.log(actualUrl);




  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* Fetch缁撴灉 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================


  const response = await fetch(modifiedRequest);
  console.log("upstream status: " + response.status + " url: " + actualUrlStr);
  if (response.status.toString().startsWith("3") && response.headers.get("Location") != null) {
    //console.log(base_url + response.headers.get("Location"))
    try {
      return getRedirect(thisProxyServerUrlHttps + new URL(response.headers.get("Location"), actualUrlStr).href, response, actualUrl);
    } catch {
      getHTMLResponse(redirectError + "<br>the redirect url:" + response.headers.get("Location") + ";the url you are now at:" + actualUrlStr);
    }
  }



  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 澶勭悊鑾峰彇鐨勭粨鏋?*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================


  var modifiedResponse;
  var bd;
  var hasProxyHintCook = (getCook(proxyHintCookieName, siteCookie) != "");
  const contentType = response.headers.get("Content-Type");


  var isHTML = false;

  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉鏈?Body 灏卞鐞?*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================
  if (response.body) {

    // =======================================================================================
    // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉 Body 鏄?Text *-*-*-*-*-*-*-*-*-*-*-*-*-*-*
    // =======================================================================================

    // TODO: BUG锛氬鏋滄槸鍔犺浇浜嗕竴涓猤b2515鐨勭晫闈紝鐒跺悗閲岄潰鏈塧pplication/javascript锛岀劧鍚巎s涔熸槸gb2515锛屼絾鏄畠header閲岄潰娌℃湁锛屽氨浼氫贡鐮?
    let isText = false;
    let isTextDetectingKeyword = ["text/", "application/json", "application/javascript"]
    isTextDetectingKeyword.forEach(x => {if(contentType && contentType.includes(x)) isText = true;})
    if (isText) { // contentType && 鍦ㄤ笂闈㈠凡缁忔湁浜?
      
      const rawBytes = await response.arrayBuffer(); 
      let encoding = 'utf-8';
      console.log("content type: " + contentType)
      if (contentType) {
          let m = contentType.match(/charset=([^\s;]+)/i);
          // [0: "charset=gb2312", 1: "gb2312"]
          if (m){
            console.log(m);
            encoding = m[1];
          }else if (contentType.includes("text/html")) {
            // 鍏堣鍙杢ext锛屾壘content="*;\s*charset=gb2312" 
            // 鐢?latin1 棰勮鍓嶉潰涓€灏忔锛屽洜涓?meta 鏍囩鏄?ASCII锛屼换浣曠紪鐮佷笅閮借兘姝ｇ‘璇诲彇
            let preview = new TextDecoder('utf-8').decode(rawBytes.slice(0, 1024 * 2));
            let metaMatch = preview.match(/charset\s*=\s*["']?\s*([^\s"';>]+)/i);
            if (metaMatch) {
              encoding = metaMatch[1];
              console.log("Detected charset from meta: " + encoding);
            }
          }
      }
      console.log(encoding);
      try{
        bd = new TextDecoder(encoding).decode(rawBytes);
      }catch(ex){
        console.log(ex);
        bd = new TextDecoder('utf-8').decode(rawBytes);
      }

      console.log(bd);
      // bd = await response.text();
      // .text() 浼氶粯璁ょ敤utf-8
      // 濡傛灉缃戠珯鐢ㄤ簡gb2312灏变贡鐮?
      // 鍚屾椂鏈変簺缃戠珯涓嶄細鍦╤eader鏀綾ontent type锛屼細鏀綽ody閲岄潰锛屽彧鑳藉厛涓存椂瑙ｇ爜涓€涓嬶紝鐒跺悗鍐嶆寮忚В鐮?


      isHTML = (contentType && contentType.includes("text/html") && bd.includes("<html"));



      // =======================================================================================
      // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉鏄?HTML 鎴栬€?JS 锛屾浛鎹㈡帀杞烦鐨?Class *-*-*-*-*
      // =======================================================================================
      if (contentType && (contentType.includes("html") || contentType.includes("javascript"))) {
        bd = bd.replaceAll("window.location", "window." + replaceUrlObj);
        bd = bd.replaceAll("document.location", "document." + replaceUrlObj);
        bd = bd.replaceAll("location.href", replaceUrlObj + ".href");
        bd = bd.replaceAll("location.replace(", replaceUrlObj + ".replace(");
        bd = bd.replaceAll("location.assign(", replaceUrlObj + ".assign(");
      }








      // =======================================================================================
      // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉鏄?HTML *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
      // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 涓€瀹氭斁鍦ㄦ渶鍚庯紝瑕佹敞鍏ユā鏉匡紝娉ㄥ叆鐨勬ā鏉夸笉鑳借鏇挎崲鍏抽敭璇?
      // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 娉ㄥ叆妯℃澘锛屽湪瀹㈡埛绔繘琛屾搷浣滐紙闃叉璧勬簮瓒呰浇锛?*-*-*-*
      // =======================================================================================
      //bd.includes("<html")  //涓嶅姞>鍥犱负html鏍囩涓婂彲鑳藉姞灞炴€?        杩欎釜鏂规硶涓嶅ソ鐢ㄥ洜涓轰竴浜汮S涓珶鐒朵篃浼氬嚭鐜拌繖涓瓧绗︿覆
      //涔熼渶瑕佸姞涓婅繖涓柟娉曞洜涓烘湁鏃跺€檚erver杩斿洖json涔熸槸html
      if (isHTML) {
        //console.log("STR" + actualUrlStr)

        // 杩欓噷灏卞彲浠ュ垹闄や簡锛屽叏閮ㄥ湪瀹㈡埛绔繘琛屾浛鎹紙浠ュ悗锛?
        // bd = covToAbs_ServerSide(bd, actualUrlStr);
        // bd = removeIntegrityAttributes(bd);


        //https://en.wikipedia.org/wiki/Byte_order_mark
        var hasBom = false;
        if (bd.charCodeAt(0) === 0xFEFF) {
          bd = bd.substring(1); // 绉婚櫎 BOM
          hasBom = true;
        }

        var inject =
          `
        <!DOCTYPE html>
        <script>
        



        // the proxy hint must be written as a single IIFE, or it will show error in example.com   idk what's wrong
        (function () {
          // proxy hint
          ${((!hasProxyHintCook) ? proxyHintInjection : "")}
        })();




        (function () {
          // hooks stuff - Must before convert path functions
          // it defines all necessary variables
          ${httpRequestInjection}


          // Convert path functions
          ${htmlCovPathInject}

          // Invoke the functioon


          // ****************************************************************************
          // it HAVE to be encoded because html will parse the </scri... tag inside script
          
          
          const originalBodyBase64Encoded = "${new TextEncoder().encode(bd)}";


          const bytes = new Uint8Array(originalBodyBase64Encoded.split(',').map(Number));



          // help me debug
          console.log(
            '%c' + 'Debug code start',
            'color: blue; font-size: 15px;'
          );
          console.log(
            '%c' + new TextDecoder().decode(bytes),
            'color: green; font-size: 10px; padding:5px;'
          );
          console.log(
            '%c' + 'Debug code end',
            'color: blue; font-size: 15px;'
          );


          ${htmlCovPathInjectFuncName}(new TextDecoder().decode(bytes));
        
        


        })();
          </script>
        `;

        // <script id="inj">document.getElementById("inj").remove();</script>




        bd = (hasBom ? "\uFEFF" : "") + //绗竴涓槸闆跺搴︿笉闂存柇绌烘牸锛岀浜屼釜鏄┖
          inject
          // + bd
          ;
      }
      // =======================================================================================
      // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉涓嶆槸 HTML锛屽氨 Regex 鏇挎崲鎺夐摼鎺?*-*
      // =======================================================================================
      else {
        //ChatGPT 鏇挎崲閲岄潰鐨勯摼鎺?
        // (?<!src="|href=")()
        let regex = new RegExp(`(https?:\\/\\/[^\s'"]+)`, 'g');
        bd = bd.replaceAll(regex, (match) => {
          if (match.startsWith("http://www.w3.org/") || match.startsWith("https://www.w3.org/")) return match; // w3鑼冨紡
          if (match.startsWith("http")) {
            return thisProxyServerUrlHttps + match;
          } else {
            return thisProxyServerUrl_hostOnly + "/" + match;
          }
        });
      }

      // ***************************************************
      // ***************************************************
      // ***************************************************
      // 闂:鍦ㄨ缃甤ss background image 鐨勬椂鍊欏彲浠ヤ娇鐢ㄧ浉瀵圭洰褰?
      // ***************************************************


      modifiedResponse = new Response(bd, response);

      // 鏂囨。缂栫爜
      modifiedResponse.headers.set("Content-Type", contentType.replace(/charset=([^\s;]+)/i, "charset=utf-8"));
    }

    // =======================================================================================
    // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉 Body 涓嶆槸 Text 锛坕.g. Binary锛?*-*-*-*-*-*-*
    // =======================================================================================
    else {
      modifiedResponse = new Response(response.body, response);
    }
  }

  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 濡傛灉娌℃湁 Body *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================
  else {
    modifiedResponse = new Response(response.body, response);
  }






  
  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 澶勭悊瑕佽繑鍥炵殑 Cookie Header *-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================
  handleCookieHeader(modifiedResponse, isHTML, response, actualUrlStr, actualUrl, hasProxyHintCook);







  // =======================================================================================
  // *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-* 鍒犻櫎閮ㄥ垎闄愬埗鎬х殑 Header *-*-*-*-*-*-*-*-*-*-*-*-*
  // =======================================================================================

  // 娣诲姞鍏佽璺ㄥ煙璁块棶鐨勫搷搴斿ご
  //modifiedResponse.headers.set("Content-Security-Policy", "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data:; media-src *; frame-src *; font-src *; connect-src *; base-uri *; form-action *;");

  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  modifiedResponse.headers.set("X-Frame-Options", "ALLOWALL");


  // // 鏂囨。缂栫爜
  // modifiedResponse.headers.set("Content-Type", contentType.replace(/charset=([^\s;]+)/i, "charset=utf-8"));
  // 杩欎釜鏀捐繘 text 鍒ゆ柇閭ｉ噷锛屽洜涓哄鏋滀笉鏄?text 鐨勮瘽璁剧疆杩欎釜鍙兘浼氬弽鑰屽鑷寸紪鐮侀敊璇?

  /* 
  Cross-Origin-Opener-Policy鎰熻涓嶉渶瑕?
  
  Claude: 濡傛灉璁剧疆浜?COOP: same-origin
  const popup = window.open('https://different-origin.com'); 
  popup 灏嗕細鏄?null
  鍚屾椂涔嬪墠鎵撳紑鐨勭獥鍙ｄ篃鏃犳硶閫氳繃 window.opener 璁块棶褰撳墠绐楀彛 */


  /*Claude:
  
  濡傛灉璁剧疆浜?Cross-Origin-Embedder-Policy: require-corp
  <img src="https://other-domain.com/image.jpg"> 
  杩欎釜鍥剧墖榛樿灏嗘棤娉曞姞杞斤紝闄ら潪鏈嶅姟鍣ㄥ搷搴斿甫鏈夐€傚綋鐨?CORS 澶撮儴

  Cross-Origin-Resource-Policy
  鍏佽鏈嶅姟鍣ㄥ０鏄庤皝鍙互鍔犺浇姝よ祫婧?
  姣?CORS 鏇翠弗鏍硷紝鍥犱负瀹冪敋鑷冲彲浠ラ檺鍒躲€愭棤闇€鍑瘉鐨勩€戣姹?
  鍙互闃叉璧勬簮琚法婧愬姞杞斤紝鍗充娇鏄畝鍗曠殑 GET 璇锋眰
  */
  var listHeaderDel = ["Content-Security-Policy", "Permissions-Policy", "Cross-Origin-Embedder-Policy", "Cross-Origin-Resource-Policy"];
  listHeaderDel.forEach(element => {
    modifiedResponse.headers.delete(element);
    modifiedResponse.headers.delete(element + "-Report-Only");
  });


  //************************************************************************************************
  // ******************************************This need to be thouoght more carefully**************
  //************************************ Now it will make google map not work if it's activated ****
  //************************************************************************************************
  // modifiedResponse.headers.forEach((value, key) => {
  //   var newValue = value.replaceAll(`${actualUrl.protocol}//${actualUrl.hostname}/`, thisProxyServerUrlHttps); // 杩欐槸鏈€鍚庡甫 / 鐨?
  //   var newValue = newValue.replaceAll(`${actualUrl.protocol}//${actualUrl.hostname}`, thisProxyServerUrlHttps.substring(0, thisProxyServerUrlHttps.length - 1)); // 杩欐槸鏈€鍚庝笉甯?/ 鐨?
  //   modifiedResponse.headers.set(key, newValue); //.replaceAll(thisProxyServerUrl_hostOnly, actualUrl.host)
  // });





  if (!hasProxyHintCook) {
    //璁剧疆content绔嬪埢杩囨湡锛岄槻姝㈠娆″脊浠ｇ悊璀﹀憡锛堜絾鏄鏋滄槸Content-no-change杩樻槸浼氬脊鍑猴級
    modifiedResponse.headers.set("Cache-Control", "max-age=0");
  }






  return modifiedResponse;
}



function handleCookieHeader(modifiedResponse, isHTML, response, actualUrlStr, actualUrl, hasProxyHintCook) {
  let headers = modifiedResponse.headers;
  
  // ========== 淇锛氱敤 getAll 鑾峰彇姣忎釜鐙珛鐨?Set-Cookie ==========
  // https://developers.cloudflare.com/workers/runtime-apis/headers/
  // Despite the fact that the Headers.getAll method has been made obsolete in web browsers, Workers still provides this method for use with the Set-Cookie header. This is because cookies often contain date strings, which include commas. This can make parsing multiple values in a Set-Cookie header difficult.
  // Any attempts to use Headers.getAll with other header names will throw an error. A brief history of Headers.getAll is available in this GitHub issue 鈫?
  // Cloudflare Workers 涓?headers.entries() 浼氭妸澶氫釜 Set-Cookie 鍚堝苟鎴愰€楀彿鍒嗛殧鐨勫瓧绗︿覆
  // 鑰?expires 鏃ユ湡涔熷惈閫楀彿锛堝 "Sun, 29-Mar-2026"锛夛紝瀵艰嚧鎸夐€楀彿鍒嗗壊鏃惰鐮村潖
  let rawCookies = [];
  try {
    // Workers 鏀寔 getAll('Set-Cookie')锛岃繑鍥炴暟缁?
    rawCookies = headers.getAll('Set-Cookie');
  } catch {
    // fallback: 濡傛灉涓嶆敮鎸?getAll
    const val = headers.get('Set-Cookie');
    if (val) rawCookies = [val];
  }

  if (rawCookies.length > 0) {
    // 鍏堝垹闄ゅ師鏉ョ殑 Set-Cookie
    headers.delete('Set-Cookie');
    
    rawCookies.forEach(singleCookie => {
      let parts = singleCookie.split(';').map(part => part.trim());

      // Modify Path
      let pathIndex = parts.findIndex(part => part.toLowerCase().startsWith('path='));
      let originalPath;
      if (pathIndex !== -1) {
        originalPath = parts[pathIndex].substring("path=".length);
      }
      let absolutePath = "/" + new URL(originalPath, actualUrlStr).href;

      if (pathIndex !== -1) {
        parts[pathIndex] = `Path=${absolutePath}`;
      } else {
        parts.push(`Path=${absolutePath}`);
      }

      // Modify Domain
      let domainIndex = parts.findIndex(part => part.toLowerCase().startsWith('domain='));
      if (domainIndex !== -1) {
        parts[domainIndex] = `domain=${thisProxyServerUrl_hostOnly}`;
      } else {
        parts.push(`domain=${thisProxyServerUrl_hostOnly}`);
      }

      // 鐢?append 鑰屼笉鏄?set锛岀‘淇濆涓?Set-Cookie 涓嶄細浜掔浉瑕嗙洊
      headers.append('Set-Cookie', parts.join('; '));
    });
  }

  if (isHTML && response.status == 200) {
    let cookieValue = lastVisitProxyCookie + "=" + actualUrl.origin + "; Path=/; Domain=" + thisProxyServerUrl_hostOnly;
    headers.append("Set-Cookie", cookieValue);

    if (response.body && !hasProxyHintCook) {
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000);
      var hintCookie = `${proxyHintCookieName}=1; expires=${expiryDate.toUTCString()}; path=/`;
      headers.append("Set-Cookie", hintCookie);
    }
  }
}




//https://stackoverflow.com/questions/5142337/read-a-javascript-cookie-by-name
function getCook(cookiename, cookies) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found

  // 杩欎釜姝ｅ垯琛ㄨ揪寮忎腑鐨?^ 琛ㄧず瀛楃涓插紑澶达紝涓€涓瓧绗︿覆鍙湁涓€涓紑澶达紝鎵€浠ヨ繖涓鍒欐渶澶氬彧鑳藉尮閰嶄竴娆°€傚洜姝?replace() 鍜?replaceAll() 鐨勬晥鏋滃畬鍏ㄧ浉鍚屻€?
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

const matchList = [[/href=("|')([^"']*)("|')/g, `href="`], [/src=("|')([^"']*)("|')/g, `src="`]];
function covToAbs_ServerSide(body, requestPathNow) {
  var original = [];
  var target = [];

  for (var match of matchList) {
    var setAttr = body.matchAll(match[0]);
    if (setAttr != null) {
      for (var replace of setAttr) {
        if (replace.length == 0) continue;
        var strReplace = replace[0];
        if (!strReplace.includes(thisProxyServerUrl_hostOnly)) {
          if (!isPosEmbed(body, replace.index)) {
            var relativePath = strReplace.substring(match[1].toString().length, strReplace.length - 1);
            if (!relativePath.startsWith("data:") && !relativePath.startsWith("mailto:") && !relativePath.startsWith("javascript:") && !relativePath.startsWith("chrome") && !relativePath.startsWith("edge")) {
              try {
                var absolutePath = thisProxyServerUrlHttps + new URL(relativePath, requestPathNow).href;
                //body = body.replace(strReplace, match[1].toString() + absolutePath + `"`);
                original.push(strReplace);
                target.push(match[1].toString() + absolutePath + `"`);
              } catch {
                // 鏃犺
              }
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < original.length; i++) {
    body = body.replaceAll(original[i], target[i]);
  }
  return body;
}

// console.log(isPosEmbed("<script src='https://www.google.com/'>uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu</script>",2));
// VM195:1 false
// console.log(isPosEmbed("<script src='https://www.google.com/'>uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu</script>",10));
// VM207:1 false
// console.log(isPosEmbed("<script src='https://www.google.com/'>uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu</script>",50));
// VM222:1 true
function isPosEmbed(html, pos) {
  if (pos > html.length || pos < 0) return false;
  //鍙栦粠鍓嶉潰`<`寮€濮嬪悗闈>`缁撴潫锛屽鏋滀腑闂存湁浠讳綍`<`鎴栬€卄>`鐨勮瘽锛屽氨鏄痗ontent
  //<xx></xx><script>XXXXX[T]XXXXXXX</script><tt>XXXXX</tt>
  //         |-------------X--------------|
  //                !               !
  //         conclusion: in content

  // Find the position of the previous '<'
  let start = html.lastIndexOf('<', pos);
  if (start === -1) start = 0;

  // Find the position of the next '>'
  let end = html.indexOf('>', pos);
  if (end === -1) end = html.length;

  // Extract the substring between start and end
  let content = html.slice(start + 1, end);
  // Check if there are any '<' or '>' within the substring (excluding the outer ones)
  if (content.includes(">") || content.includes("<")) {
    return true; // in content
  }
  return false;

}
function handleWrongPwd() {
  if (showPasswordPage) {
    return getHTMLResponse(pwdPage);
  } else {
    return getHTMLResponse("<h1>403 Forbidden</h1><br>You do not have access to view this webpage.");
  }
}
function getHTMLResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}

function getRedirect(url, originalResponse, actualUrl) {
  if (originalResponse) {
    var res = new Response(null, originalResponse);
    handleCookieHeader(res, false, originalResponse, actualUrl.toString(),actualUrl,true)
    res.headers.set("Location", url);
    return res;
  }
  return Response.redirect(url, 301);
}

// https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function nthIndex(str, pat, n) {
  var L = str.length, i = -1;
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}
