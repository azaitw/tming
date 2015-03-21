/* jshint strict:false, unused: false */
/* global document, XMLHttpRequest, window */

var app = {
    attrs: {
        nav: {
            opened: undefined,
            animating: false
        },
        navMobile: {
            opened: false,
            animating: false
        },
        slideshow: {
            interval: 4000,
            animation: 800,
            state: [] // {elements: [], position: 0, size: N}
        },
        signupForm: {
            fixed: false
        }
    },
    query: function (queryStr, parentNode) {
        var hasWhitespace = queryStr.indexOf(' ');
        var type = queryStr.substring(0, 1);
        var str = queryStr.substring(1);
        var func;
        var node = (parentNode) ? parentNode : document;
        return node.querySelectorAll(queryStr) || [{}];

    },
    removeClassName: function (obj, toRemove) {
        var reg = new RegExp('(\\s|^)' + toRemove + '(\\s|$)');
        var newClass = obj.className.replace(reg, ' ');
        console.log('newClass: ', newClass);
        obj.className = newClass;
    },
    toggleNav: function (e) {
        var clickedNav = e.currentTarget || e.srcElement;
        var clickedNavIndex = clickedNav.rel;
        var openedNav;
        var openedNavIndex = app.attrs.nav.opened;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        console.log('clickedNavIndex: ', clickedNavIndex);

        if (!app.attrs.nav.animating) {
            if (!openedNavIndex) { // nothing opened
                app.attrs.nav.opened = clickedNavIndex;
                clickedNav.parentNode.className += ' on';
            } else if (openedNavIndex !== clickedNavIndex) { // switch nav
                app.attrs.nav.opened = clickedNavIndex;
                openedNav = app.query('.nav-li-a')[openedNavIndex];
                app.removeClassName(openedNav.parentNode, 'on');
                clickedNav.parentNode.className += ' on';
            } else { // close nav
                app.attrs.nav.opened = undefined;
                app.removeClassName(clickedNav.parentNode, 'on');
            }
        }
    },
    toggleAction: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        console.log('clicking a childless nav');
    },
    toggleNavMobile: function () {
        if (!app.attrs.navMobile.opened) { // to show menu
            app.showNavMobile();
        } else { // to hide menu
            app.hideNavMobile();
        }
    },
    showNavMobile: function () {
        var navMobile;
        var container;
        var height;
        if (!app.attrs.navMobile.animating) {
            app.attrs.navMobile.animating = true;
            app.attrs.navMobile.opened = true;
            window.scrollTo(0, 0);
            navMobile = app.query('.nav-m')[0];
            container = app.query('.container')[0];
            navMobile.style.display = 'block';
            height = Math.max(screen.height, window.innerHeight, navMobile.clientHeight);
            container.style.overflow = 'hidden';
            if (height > navMobile.offsetHeight) {
                navMobile.style.height = height + 'px';
            }
            container.style.height = height + 'px';
            setTimeout(function () {
                navMobile.style.opacity = '1';
                app.attrs.navMobile.animating = false;
            }, 1);
        }
    },
    hideNavMobile: function () {
        var navMobile;
        var container;
        if (!app.attrs.navMobile.animating) {
            app.attrs.navMobile.animating = true;
            app.attrs.navMobile.opened = false;
            navMobile = app.query('.nav-m')[0];
            container = app.query('.container')[0];
            container.style.height = 'auto';
            navMobile.style.height = 'auto';
            container.style.overflow = 'visible';
            navMobile.style.opacity = '0';
            setTimeout(function () {
            navMobile.style.display = 'none';
                app.attrs.navMobile.animating = false;
            }, 200);
        }
    },
    autoSlideshow: function (el, key) {
        var children = app.query('li', el);
        var returnNextPosition = function () {
            var data = app.attrs.slideshow.state[key];
            if (data.position >= (data.size - 1)) {
                app.attrs.slideshow.state[key].position = 0;
            } else {
                app.attrs.slideshow.state[key].position += 1;
            }  
        };
        var shuffleDeck = function () {
            var position = app.attrs.slideshow.state[key].position;
            var size = app.attrs.slideshow.state[key].size;
            if (position === (size - 1)) {
                setTimeout(function () {
                    app.removeClassName(el, 'move');
                    el.style.left = 0;
                    app.attrs.slideshow.state[key].position = 0;
                }, app.attrs.slideshow.animation);
                setTimeout(function () {
                    el.className += ' move';
                }, app.attrs.slideshow.animation + 100);
            }
        };
        el.appendChild(children[0].cloneNode(true));
        el.style.left = '0%';
        el.className += ' move';
        app.attrs.slideshow.state[key] = {
            position: 0,
            size: children.length
        };
        setInterval(function () {
            returnNextPosition(app.attrs.slideshow.state[key].position);
            el.style.left = '-' + (app.attrs.slideshow.state[key].position * 100) + '%';
            shuffleDeck();
        }, app.attrs.slideshow.interval);
    },
    fixedFormWhenScroll: function (formEl) {
        var hero1 = app.query('.hero1')[0];
        var why = app.query('.why')[0];
        var initPosY = hero1.offsetTop + hero1.offsetHeight;
        var formElH = formEl.offsetHeight + 30;
        var signupClassname = formEl.className;
        var updateFormPos = function () {
            var posY = window.pageYOffset;
            var screenHeight = window.innerHeight;
            if (screenHeight > 650) {
                if (posY >= initPosY && app.attrs.signupForm.fixed === false) {
                    app.attrs.signupForm.fixed = true;
                    formEl.className += ' fixed';
                    why.style.paddingTop = formElH + 'px';
                } else if (posY < initPosY && app.attrs.signupForm.fixed === true){
                    app.attrs.signupForm.fixed = false;
                    formEl.className = signupClassname;
                    why.style.paddingTop = '';
                }
            }
        };
        this.bindEvent(window, 'scroll', updateFormPos);
    },
    bindEvent: function (element, eventType, action) {
        if (element.addEventListener) {
            element.addEventListener(eventType, action);
        } else {
            element.attachEvent('on' + eventType, action);
        }
    },
    init: function () {
        var navLinks = this.query('.nav-li-a');
        var i;
        var that = this;
        var navMobileBtn = that.query('.nav-m-toggle')[0];
        var navMobileCloseBtn = that.query('.nav-m-close')[0];
        var slideshows = that.query('.slideshow');
        var slideshowsDeckLen;
        var bindNavEvent = function (el) {
            var parent = el.parentElement;
            var elChildren = app.query('.snd', parent);
            if (elChildren.length > 0) { // has submenu
                that.bindEvent(el, 'click', that.toggleNav);
            } else { // childless
//                el.addEventListener('click', that.toggleAction);
            }
        };
        for (i = 0; i < navLinks.length; i += 1) {
            bindNavEvent(navLinks[i]);
        }
        for (i = 0; i < slideshows.length; i += 1) {
            slideshowsDeckLen = that.query('li', slideshows[i]).length;
            if (slideshowsDeckLen > 1) {
                that.autoSlideshow(slideshows[i], i);
            }
        }
        that.bindEvent(window, 'orientationchange', that.hideNavMobile);
        that.bindEvent(navMobileBtn, 'click', that.toggleNavMobile);
        that.bindEvent(navMobileCloseBtn, 'click', that.toggleNavMobile);
        that.fixedFormWhenScroll(that.query('.signup')[0]);
    }
};
app.init();