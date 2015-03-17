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
        }
    },
    query: function (queryStr, parentNode) {
        var hasWhitespace = queryStr.indexOf(' ');
        var type = queryStr.substring(0, 1);
        var str = queryStr.substring(1);
        var func;
        var node = (parentNode) ? parentNode : document;
        if (hasWhitespace !== -1) {
            return node.querySelectorAll(queryStr) || [{}];
        }
        switch (type) {
        case '#':
            func = 'getElementById';
            break;
        case '.':
            func = 'getElementsByClassName';
            break;
        default:
            func = 'getElementsByTagName';
            str = queryStr;
        }
        return node[func](str);
    },
    removeClassName: function (obj, toRemove) {
        var reg = new RegExp('(\\s|^)' + toRemove + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ').trim();
    },
    toggleNav: function (e) {
        var clickedNav = e.currentTarget;
        var clickedNavIndex = clickedNav.dataset.index;
        var openedNav;
        var openedNavIndex = app.attrs.nav.opened;

        e.preventDefault();

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
    toggleNavMobile: function () {
        var navMobileStatus = app.attrs.navMobile.opened;
        var navMobileAnimateStatus = app.attrs.navMobile.animating;
        var navMobile = app.query('.nav-m')[0];
        var container = app.query('.container')[0];
        if (!navMobileAnimateStatus) {
            app.attrs.navMobile.animating = true;
            if (!navMobileStatus) { // to show menu
                window.scrollTo(0, 0);
                app.attrs.navMobile.opened = true;
                navMobile.style.display = 'block';
                container.style.height = '500px';
                container.style.overflow = 'hidden';
                setTimeout(function () {
                    navMobile.style.opacity = '1';
                    app.attrs.navMobile.animating = false;
                }, 1);
            } else { // to hide menu
                app.attrs.navMobile.opened = false;
                container.style.height = '';
                container.style.overflow = 'visible';
                navMobile.style.opacity = '0';
                setTimeout(function () {
                navMobile.style.display = 'none';
                    app.attrs.navMobile.animating = false;
                }, 200);
            }   
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
    init: function () {
        var navLinks = this.query('.nav-li-a');
        var i;
        var that = this;
        var navMobileBtn = this.query('.nav-m-toggle')[0];
        var navMobileCloseBtn = this.query('.nav-m-close')[0];
        var slideshows = this.query('.slideshow');
        var slideshowsDeckLen;
        var bindEvent = function (el) {
            el.addEventListener('click', that.toggleNav);
        };
        for (i = 0; i < navLinks.length; i += 1) {
            bindEvent(navLinks[i]);
        }
        for (i = 0; i < slideshows.length; i += 1) {
            slideshowsDeckLen = this.query('li', slideshows[i]).length;
            if (slideshowsDeckLen > 1) {
                that.autoSlideshow(slideshows[i], i);
            }
        }
        navMobileBtn.addEventListener('click', that.toggleNavMobile);
        navMobileCloseBtn.addEventListener('click', that.toggleNavMobile);
    }
};
app.init();