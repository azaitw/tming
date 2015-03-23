var app={attrs:{disableScroll:!1,isIE8_9:!1,isMobile:!1,nav:{opened:void 0,animating:!1},navMobile:{opened:!1,animating:!1},slideshow:{interval:4e3,animation:800,state:[]},signupForm:{fixed:!1},animMethod:{}},query:function(e,t){var a=(e.indexOf(" "),e.substring(0,1),e.substring(1),t?t:document);return a.querySelectorAll(e)||[{}]},removeClassName:function(e,t){var a=new RegExp("(\\s|^)"+t+"(\\s|$)"),n=e.className.replace(a," ");e.className=n},toggleNav:function(e){var t,a=e.currentTarget||e.srcElement,n=a.rel,i=app.attrs.nav.opened;e.preventDefault?e.preventDefault():e.returnValue=!1,app.attrs.nav.animating||(i?i!==n?(app.attrs.nav.opened=n,t=app.query(".nav-li-a")[i],app.removeClassName(t.parentNode,"on"),a.parentNode.className+=" on"):(app.attrs.nav.opened=void 0,app.removeClassName(a.parentNode,"on")):(app.attrs.nav.opened=n,a.parentNode.className+=" on"))},toggleAction:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},disableEvent:function(e){e.preventDefault()},toggleDisableScroll:function(){app.attrs.disableScroll?(document.body.removeEventListener("touchmove",app.disableEvent),app.attrs.disableScroll=!1):(document.body.addEventListener("touchmove",app.disableEvent),app.attrs.disableScroll=!0)},toggleNavMobile:function(){app.attrs.navMobile.opened?app.hideNavMobile():app.showNavMobile(),app.toggleDisableScroll()},showNavMobile:function(){var e,t,a;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!0,window.scrollTo(0,0),e=app.query(".nav-m")[0],t=app.query(".container")[0],e.style.display="block",a=Math.max(screen.height,window.innerHeight,e.clientHeight),t.style.overflow="hidden",a>e.offsetHeight&&(e.style.height=a+"px"),t.style.height=a+"px",setTimeout(function(){e.style.opacity="1",app.attrs.navMobile.animating=!1},1))},hideNavMobile:function(){var e,t;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!1,e=app.query(".nav-m")[0],t=app.query(".container")[0],t.style.height="auto",e.style.height="auto",t.style.overflow="visible",e.style.opacity="0",setTimeout(function(){e.style.display="none",app.attrs.navMobile.animating=!1},200))},animateMethods:function(e){var t,a=[];switch(e){case"safari":t="-webkit-transform",a=["translate3d(",", 0, 0)"];break;case"chrome":t="-webkit-transform",a=["translate(",", 0)"];break;default:t="left",a=["",""]}this.attrs.animMethod={prop:t,value:a}},animateEl:function(e,t){var a=app.attrs.animMethod.prop,n=app.attrs.animMethod.value;e.style[a]=n[0]+t+n[1]},autoSlideshow:function(e,t){var a=this,n=app.query("li",e),i=n.length,o=e.className;e.appendChild(n[0].cloneNode(!0)),a.animateEl(e,"0%"),e.className+=" move",app.attrs.slideshow.state[t]={position:0,size:n.length},setInterval(function(){var n;a.attrs.slideshow.state[t].position+=1,n="-"+100*app.attrs.slideshow.state[t].position+"%",a.animateEl(e,n),app.attrs.slideshow.state[t].position===i&&(setTimeout(function(){e.className=o,a.animateEl(e,"0%"),app.attrs.slideshow.state[t].position=0},app.attrs.slideshow.animation),setTimeout(function(){e.className+=" move"},app.attrs.slideshow.animation+100))},app.attrs.slideshow.interval)},fixedFormWhenScroll:function(e){var t=e.offsetTop,a=app.query("body")[0],n=e.cloneNode(!0),i=function(){t=e.offsetTop},o=function(){var e=window.pageYOffset||window.document.documentElement.scrollTop;e>=t&&app.attrs.signupForm.fixed===!1?(app.attrs.signupForm.fixed=!0,n.style.display="block"):t>e&&app.attrs.signupForm.fixed===!0&&(app.attrs.signupForm.fixed=!1,n.style.display="")};n.className+=" fixed",a.appendChild(n),this.bindEvent(window,"scroll",o),this.bindEvent(window,"resize",i)},togglePlaceholder:function(e){var t=e.srcElement.parentNode,a=app.query("input",t)[0],n=t.className,i="hidePlaceholder";("undefined"==typeof a.value||""===a.value)&&(n.indexOf(i)<0?(a.focus(),t.className=n+" "+i):app.removeClassName(t,i))},bindEvent:function(e,t,a){"undefined"!=typeof e&&(e.addEventListener?e.addEventListener(t,a):e.attachEvent("on"+t,a))},bindSlideshow:function(){var e,t,a=this.query(".slideshow");for(this.animateMethods(navigator.userAgent.indexOf("Safari")>0?navigator.userAgent.indexOf("Chrome")>0?"chrome":"safari":"default"),t=0;t<a.length;t+=1)e=this.query("li",a[t]).length,e>1&&this.autoSlideshow(a[t],t)},bindNav:function(){var e,t=this,a=t.query(".nav-li-a"),n=function(e){var a=e.parentElement,n=app.query(".snd",a);n.length>0&&t.bindEvent(e,"click",t.toggleNav)};for(e=0;e<a.length;e+=1)n(a[e])},bindIEEvents:function(){var e,t,a,n=this,i=document.all&&!window.atob?!0:!1;if(this.attrs.isIE8_9=i,i)for(t=n.query(".signup-form .placeholder label"),a=n.query(".signup-form .placeholder input"),e=0;e<t.length;e+=1)n.bindEvent(t[e],"click",n.togglePlaceholder),n.bindEvent(a[e],"click",n.togglePlaceholder),n.bindEvent(a[e],"blur",n.togglePlaceholder)},bindMobileNavEvent:function(){var e=this,t=e.query(".nav-m-close")[0],a=e.query(".nav-m-toggle")[0];e.attrs.isMobile=navigator.userAgent.indexOf("iPhone")>0||navigator.userAgent.indexOf("Android")>0||navigator.userAgent.indexOf("BlackBerry")>0||navigator.userAgent.indexOf("iPad")>0||navigator.userAgent.indexOf("iPod")>0||navigator.userAgent.indexOf("IEMobile")>0?!0:!1,!e.attrs.isMobile&&e.query(".signup").length>0&&e.fixedFormWhenScroll(e.query(".signup")[0]),e.bindEvent(a,"click",e.toggleNavMobile),e.bindEvent(t,"click",e.toggleNavMobile)},init:function(){var e=this;e.bindSlideshow(),e.bindNav(),e.bindEvent(window,"orientationchange",e.hideNavMobile),e.bindMobileNavEvent(),e.bindIEEvents()}};app.init();