var login={query:function(e,n){var l=(e.indexOf(" "),e.substring(0,1),e.substring(1),n?n:document);return l.querySelectorAll(e)||[{}]},removeClassName:function(e,n){var l=new RegExp("(\\s|^)"+n+"(\\s|$)"),i=e.className.replace(l," ");e.className=i},hidePlaceholder:function(e){var n=e.srcElement.parentNode,l=n.className;l.indexOf("hidePlaceholder")<0&&(n.className=l+" hidePlaceholder")},showPlaceholder:function(e){var n=e.srcElement.parentNode,l=login.query("input",n)[0];("undefined"==typeof l.value||""===l.value)&&login.removeClassName(n,"hidePlaceholder")},bindEvent:function(e,n,l){"undefined"!=typeof e&&(e.addEventListener?e.addEventListener(n,l):e.attachEvent("on"+n,l))},bindIEEvents:function(){var e,n,l,i=this,a=document.all&&!window.atob?!0:!1;if(a)for(n=i.query(".login-form .placeholder label"),l=i.query(".login-form .placeholder input"),e=0;e<n.length;e+=1)i.bindEvent(n[e],"click",i.hidePlaceholder),i.bindEvent(l[e],"blur",i.showPlaceholder),i.bindEvent(l[e],"keyup",i.hidePlaceholder)},init:function(){this.bindIEEvents()}};login.init();