var app={attrs:{nav:{opened:void 0,animating:!1},navMobile:{opened:!1,animating:!1},slideshow:{interval:4e3,animation:800,state:[]},signupForm:{fixed:!1}},query:function(e,t){var a,i=e.indexOf(" "),n=e.substring(0,1),s=e.substring(1),o=t?t:document;if(-1!==i)return o.querySelectorAll(e)||[{}];switch(n){case"#":a="getElementById";break;case".":a="getElementsByClassName";break;default:a="getElementsByTagName",s=e}return o[a](s)},removeClassName:function(e,t){var a=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(a," ").trim()},toggleNav:function(e){var t,a=e.currentTarget,i=a.dataset.index,n=app.attrs.nav.opened;e.preventDefault(),app.attrs.nav.animating||(n?n!==i?(app.attrs.nav.opened=i,t=app.query(".nav-li-a")[n],app.removeClassName(t.parentNode,"on"),a.parentNode.className+=" on"):(app.attrs.nav.opened=void 0,app.removeClassName(a.parentNode,"on")):(app.attrs.nav.opened=i,a.parentNode.className+=" on"))},toggleAction:function(e){e.preventDefault(),console.log("clicking a childless nav")},toggleNavMobile:function(){app.attrs.navMobile.opened?app.hideNavMobile():app.showNavMobile()},showNavMobile:function(){var e,t,a;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!0,window.scrollTo(0,0),e=app.query(".nav-m")[0],t=app.query(".container")[0],e.style.display="block",a=Math.max(screen.height,window.innerHeight,e.clientHeight),t.style.overflow="hidden",a>e.offsetHeight&&(e.style.height=a+"px"),t.style.height=a+"px",setTimeout(function(){e.style.opacity="1",app.attrs.navMobile.animating=!1},1))},hideNavMobile:function(){var e,t;app.attrs.navMobile.animating||(app.attrs.navMobile.animating=!0,app.attrs.navMobile.opened=!1,e=app.query(".nav-m")[0],t=app.query(".container")[0],t.style.height="auto",e.style.height="auto",t.style.overflow="visible",e.style.opacity="0",setTimeout(function(){e.style.display="none",app.attrs.navMobile.animating=!1},200))},autoSlideshow:function(e,t){var a=app.query("li",e),i=function(){var e=app.attrs.slideshow.state[t];e.position>=e.size-1?app.attrs.slideshow.state[t].position=0:app.attrs.slideshow.state[t].position+=1},n=function(){var a=app.attrs.slideshow.state[t].position,i=app.attrs.slideshow.state[t].size;a===i-1&&(setTimeout(function(){app.removeClassName(e,"move"),e.style.left=0,app.attrs.slideshow.state[t].position=0},app.attrs.slideshow.animation),setTimeout(function(){e.className+=" move"},app.attrs.slideshow.animation+100))};e.appendChild(a[0].cloneNode(!0)),e.style.left="0%",e.className+=" move",app.attrs.slideshow.state[t]={position:0,size:a.length},setInterval(function(){i(app.attrs.slideshow.state[t].position),e.style.left="-"+100*app.attrs.slideshow.state[t].position+"%",n()},app.attrs.slideshow.interval)},bindSignupFormEvent:function(e){var t=app.query(".hero1")[0],a=t.offsetTop+t.offsetHeight,i=function(){var t=window.pageYOffset;t>=a&&app.attrs.signupForm.fixed===!1?(app.attrs.signupForm.fixed=!0,e.style.position="fixed",e.style.top="0"):a>t&&app.attrs.signupForm.fixed===!0&&(app.attrs.signupForm.fixed=!1,e.style.position="",e.style.top="")};window.addEventListener("scroll",i)},init:function(){var e,t,a=this.query(".nav-li-a"),i=this,n=this.query(".nav-m-toggle")[0],s=this.query(".nav-m-close")[0],o=this.query(".slideshow"),p=function(e){var t=e.parentElement,a=app.query(".snd",t);a.length>0&&e.addEventListener("click",i.toggleNav)};for(e=0;e<a.length;e+=1)p(a[e]);for(e=0;e<o.length;e+=1)t=this.query("li",o[e]).length,t>1&&i.autoSlideshow(o[e],e);n.addEventListener("click",i.toggleNavMobile),window.addEventListener("orientationchange",i.hideNavMobile),s.addEventListener("click",i.toggleNavMobile),this.bindSignupFormEvent(i.query(".signup")[0])}};app.init();