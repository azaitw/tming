var app={attrs:{disableScroll:!1,isIE8_9:!1,isMobile:!1,nav:{opened:void 0,animating:!1},navMobile:{opened:!1,animating:!1},slideshow:{interval:4e3,animation:800,state:[]},signupForm:{fixed:!1}},query:function(e,t){var a=(e.indexOf(" "),e.substring(0,1),e.substring(1),t?t:document);return a.querySelectorAll(e)||[{}]},removeClassName:function(e,t){var a=new RegExp("(\\s|^)"+t+"(\\s|$)"),n=e.className.replace(a," ");e.className=n},toggleNav:function(e){var t,a=e.currentTarget||e.srcElement,n=a.rel,i=app.attrs.nav.opened;e.preventDefault?e.preventDefault():e.returnValue=!1,app.attrs.nav.animating||(i?i!==n?(app.attrs.nav.opened=n,t=app.query(".nav-li-a")[i],app.removeClassName(t.parentNode,"on"),a.parentNode.className+=" on"):(app.attrs.nav.opened=void 0,app.removeClassName(a.parentNode,"on")):(app.attrs.nav.opened=n,a.parentNode.className+=" on"))},toggleAction:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},disableEvent:function(e){e.preventDefault()},toggleDisableScroll:function(){app.attrs.disableScroll?(document.body.removeEventListener("touchmove",app.disableEvent),app.attrs.disableScroll=!1):(document.body.addEventListener("touchmove",app.disableEvent),app.attrs.disableScroll=!0)},toggleNavMobile:function(){app.attrs.navMobile.opened?app.hideNavMobile():app.showNavMobile(),app.toggleDisableScroll()},showNavMobile:function(){var e,t,a;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!0,window.scrollTo(0,0),e=app.query(".nav-m")[0],t=app.query(".container")[0],e.style.display="block",a=Math.max(screen.height,window.innerHeight,e.clientHeight),t.style.overflow="hidden",a>e.offsetHeight&&(e.style.height=a+"px"),t.style.height=a+"px",setTimeout(function(){e.style.opacity="1",app.attrs.navMobile.animating=!1},1))},hideNavMobile:function(){var e,t;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!1,e=app.query(".nav-m")[0],t=app.query(".container")[0],t.style.height="auto",e.style.height="auto",t.style.overflow="visible",e.style.opacity="0",setTimeout(function(){e.style.display="none",app.attrs.navMobile.animating=!1},200))},autoSlideshow:function(e,t){var a=app.query("li",e),n=function(){var e=app.attrs.slideshow.state[t];e.position>=e.size-1?app.attrs.slideshow.state[t].position=0:app.attrs.slideshow.state[t].position+=1},i=function(){var a=app.attrs.slideshow.state[t].position,n=app.attrs.slideshow.state[t].size;a===n-1&&(setTimeout(function(){app.removeClassName(e,"move"),e.style.left=0,app.attrs.slideshow.state[t].position=0},app.attrs.slideshow.animation),setTimeout(function(){e.className+=" move"},app.attrs.slideshow.animation+100))};e.appendChild(a[0].cloneNode(!0)),e.style.left="0%",e.className+=" move",app.attrs.slideshow.state[t]={position:0,size:a.length},setInterval(function(){n(app.attrs.slideshow.state[t].position),e.style.left="-"+100*app.attrs.slideshow.state[t].position+"%",i()},app.attrs.slideshow.interval)},fixedFormWhenScroll:function(e){var t=app.query(".hero1")[0],a=t.offsetTop+t.offsetHeight,n=app.query("body")[0],i=e.cloneNode(!0),o=function(){a=t.offsetTop+t.offsetHeight},s=function(){var e=window.pageYOffset||window.document.documentElement.scrollTop;e>=a&&app.attrs.signupForm.fixed===!1?(app.attrs.signupForm.fixed=!0,i.style.display="block"):a>e&&app.attrs.signupForm.fixed===!0&&(app.attrs.signupForm.fixed=!1,i.style.display="")};i.className+=" fixed",n.appendChild(i),this.bindEvent(window,"scroll",s),this.bindEvent(window,"resize",o)},togglePlaceholder:function(e){var t=e.srcElement.parentNode,a=app.query("input",t)[0],n=t.className,i="hidePlaceholder";("undefined"==typeof a.value||""===a.value)&&(n.indexOf(i)<0?(a.focus(),t.className=n+" "+i):app.removeClassName(t,i))},bindEvent:function(e,t,a){"undefined"!=typeof e&&(e.addEventListener?e.addEventListener(t,a):e.attachEvent("on"+t,a))},init:function(){var e,t,a,n,i=this.query(".nav-li-a"),o=this,s=o.query(".nav-m-toggle")[0],l=o.query(".nav-m-close")[0],p=o.query(".slideshow"),r=function(e){var t=e.parentElement,a=app.query(".snd",t);a.length>0&&o.bindEvent(e,"click",o.toggleNav)},d=document.all&&!window.atob?!0:!1;for(o.attrs.isMobile=navigator.userAgent.indexOf("iPhone")>0||navigator.userAgent.indexOf("Android")>0||navigator.userAgent.indexOf("BlackBerry")>0||navigator.userAgent.indexOf("iPad")>0||navigator.userAgent.indexOf("iPod")>0||navigator.userAgent.indexOf("IEMobile")>0?!0:!1,o.attrs.isIE8_9=d,e=0;e<i.length;e+=1)r(i[e]);for(e=0;e<p.length;e+=1)t=o.query("li",p[e]).length,t>1&&o.autoSlideshow(p[e],e);if(o.bindEvent(window,"orientationchange",o.hideNavMobile),o.bindEvent(s,"click",o.toggleNavMobile),o.bindEvent(l,"click",o.toggleNavMobile),!o.attrs.isMobile&&o.query(".signup").length>0&&o.fixedFormWhenScroll(o.query(".signup")[0]),d)for(a=o.query(".signup-form .placeholder label"),n=o.query(".signup-form .placeholder input"),e=0;e<a.length;e+=1)o.bindEvent(a[e],"click",o.togglePlaceholder),o.bindEvent(n[e],"click",o.togglePlaceholder),o.bindEvent(n[e],"blur",o.togglePlaceholder)}};app.init();