/* jshint strict:false, unused: false */
/* global document, XMLHttpRequest, window */

var app = {
    attrs: {
        disableScroll: false,
        isIE8_9: false,
        isMobile: false,
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
        if (typeof String.prototype.trim !== 'function') {
          String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, ''); 
          }
        }
        newClass = newClass.trim();
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
//        console.log('clicking a childless nav');
    },
    disableEvent: function (e) {
        e.preventDefault();        
    },
    toggleDisableScroll: function () {
        if (app.attrs.disableScroll) { // disabled, to enable
            document.body.removeEventListener('touchmove', app.disableEvent);
            app.attrs.disableScroll = false;
        } else {
            document.body.addEventListener('touchmove', app.disableEvent);
            app.attrs.disableScroll = true;
        }
    },
    toggleNavMobile: function () {
        if (!app.attrs.navMobile.opened) { // to show menu
            app.showNavMobile();
        } else { // to hide menu
            app.hideNavMobile();
        }
        app.toggleDisableScroll();
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
            container = app.query('body')[0];
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
            container = app.query('.body')[0];
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
    anim: {
        swipe: function (el, key, animMethod) {
            var that = app;
            var children = app.query('li', el);
            var childrenLen = children.length;
            var elClassName = el.className;
            var prop = animMethod.prop;
            var value = animMethod.value;
            el.appendChild(children[0].cloneNode(true));
            el.style[prop] = value[0] + '0%' + value[1];
            el.className += ' anim-swipe';
            app.attrs.slideshow.state[key] = {
                position: 0,
                size: children.length
            };
            setInterval(function () {
                var pos;
                var animTime = app.attrs.slideshow.animation;
                that.attrs.slideshow.state[key].position += 1;
                pos = '-' + (app.attrs.slideshow.state[key].position * 100) + '%';
                el.style[prop] = value[0] + pos + value[1];
                if (app.attrs.slideshow.state[key].position === childrenLen) {
                    setTimeout(function () {
                        el.className = elClassName;
                        el.style[prop] = value[0] + '0%' + value[1];
                        app.attrs.slideshow.state[key].position = 0;
                    }, animTime);
                    setTimeout(function () {
                        el.className += ' anim-swipe';
                    }, animTime + (animTime / 2));
                }
            }, app.attrs.slideshow.interval);
        },
        opacity: function (el) {
            var that = app;
            var children = app.query('li', el);
            var childrenLen = children.length;
            var showing = 0; // 0 1 2 3
            el.className += ' anim-opacity';
            children[showing].className += ' on';
            setInterval(function () {
                var nextShowing = showing + 1;
                if (nextShowing >= childrenLen) {
                    nextShowing = 0;
                }
                app.removeClassName(children[showing], 'on');
                showing = nextShowing;
                children[showing].className += ' on';
            }, app.attrs.slideshow.interval);
        }
    },
    fixedOnScroll: function (fixedOnScroll) {
        var formEl = fixedOnScroll.children[0];
        var body = app.query('body')[0];
        var initPosY;
        var newForm = formEl.cloneNode();
        var formHeight = 0;
        var updateHeight = function () {
            var newFormHeight = Math.max(formEl.offsetHeight, formEl.clientHeight);
            initPosY = fixedOnScroll.offsetTop;
            if (newFormHeight !== formHeight) {
                formHeight = newFormHeight;
                newForm.style.height = formHeight + 'px';
            }
        };
        var updateFormPos = function () {
            var posY = window.pageYOffset || window.document.documentElement.scrollTop;
            if (posY >= initPosY && app.attrs.signupForm.fixed === false) {
                app.attrs.signupForm.fixed = true;
                fixedOnScroll.className += ' fixed';
            } else if (posY < initPosY && app.attrs.signupForm.fixed === true){
                app.attrs.signupForm.fixed = false;
                app.removeClassName(fixedOnScroll, 'fixed');
            }
        };
        newForm.style.height = formHeight + 'px';
        newForm.className = 'fixedOnScroll-placeholder';
        fixedOnScroll.appendChild(newForm);
        updateHeight();
        this.bindEvent(window, 'scroll', updateFormPos);
        this.bindEvent(window, 'resize', updateHeight);
    },
    hidePlaceholder: function (e) {
        var parentNode = e.srcElement.parentNode;
        var parentClass = parentNode.className;
        if (parentClass.indexOf('hidePlaceholder') < 0) {
            parentNode.className = parentClass + ' hidePlaceholder';
        }
    },
    showPlaceholder: function (e) {
        var parentNode = e.srcElement.parentNode;
        var input = app.query('input', parentNode)[0];
        if (typeof input.value === 'undefined' || input.value === '') {
            app.removeClassName(parentNode, 'hidePlaceholder');
        }
    },
    bindEvent: function (element, eventType, action) {
        if (typeof element !== 'undefined') {
            if (element.addEventListener) {
                element.addEventListener(eventType, action);
            } else {
                element.attachEvent('on' + eventType, action);
            }
        }
    },
    bindSlideshow: function (animationType) {
        var slideshows = this.query('.slideshow');
        var slideshowsDeckLen;
        var ieName;
        var i;
        var animType = animationType || 'swipe';
        var animMethod = {};
        var props;
        var value;

        if (animType === 'opacity') {
        } else if (animType === 'swipe') {
            if (navigator.userAgent.indexOf('Safari') > 0) {
                if (navigator.userAgent.indexOf('Chrome') > 0) {
                    prop = '-webkit-transform';
                    value = ['translate(', ', 0)'];
                } else {
                    prop = '-webkit-transform';
                    value = ['translate3d(', ', 0, 0)'];
                }
            } else {
                prop = 'left';
                value = ['', ''];
            }
            animMethod = {
                prop: prop,
                value: value
            };
        }
        for (i = 0; i < slideshows.length; i += 1) {
            slideshowsDeckLen = this.query('li', slideshows[i]).length;
            if (slideshowsDeckLen > 1) {
                this.anim[animType](slideshows[i], i, animMethod);
            }
        }
    },
    bindNav: function () {
        var that = this;
        var i;
        var navLinks = that.query('.nav-li-a');
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
    },
    bindIEEvents: function () {
        var that = this;
        var i;
        var placeholderLabels;
        var placeholderInput;
        var isIE8_9 = (document.all && !window.atob)? true : false;
        this.attrs.isIE8_9 = isIE8_9;
        if (isIE8_9) { // only for IE8 and 9
            placeholderLabels = that.query('.signup-form .placeholder label');
            placeholderInput = that.query('.signup-form .placeholder input');
            for (i = 0; i < placeholderLabels.length; i += 1) {
                that.bindEvent(placeholderLabels[i], 'click', that.hidePlaceholder);
                that.bindEvent(placeholderInput[i], 'blur', that.showPlaceholder);
                that.bindEvent(placeholderInput[i], 'keyup', that.hidePlaceholder);
            }
        }
    },
    bindMobileNavEvent: function () {
        var that = this;
        var navMobileCloseBtn = that.query('.nav-m-close')[0];
        var navMobileBtn = that.query('.nav-m-toggle')[0];
        that.attrs.isMobile = (
            navigator.userAgent.indexOf('iPhone') > 0 ||
            navigator.userAgent.indexOf('Android') > 0 ||
            navigator.userAgent.indexOf('BlackBerry') > 0 ||
            navigator.userAgent.indexOf('iPad') > 0 ||
            navigator.userAgent.indexOf('iPod') > 0 ||
            navigator.userAgent.indexOf('IEMobile') > 0
        ) ? true : false;
        that.bindEvent(navMobileBtn, 'click', that.toggleNavMobile);
        that.bindEvent(navMobileCloseBtn, 'click', that.toggleNavMobile);
    },
    init: function () {
        var that = this;  
        that.bindSlideshow('opacity');
        that.bindNav();
        that.bindEvent(window, 'orientationchange', that.hideNavMobile);
        that.bindMobileNavEvent();
        that.bindIEEvents();
        if (!that.attrs.isMobile && that.query('.fixedOnScroll').length === 1) {
            that.fixedOnScroll(that.query('.fixedOnScroll')[0]);
        }
    }
};
app.init();