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
        }
    },
    query: function (queryStr) {
        var hasWhitespace = queryStr.indexOf(' ');
        var type = queryStr.substring(0, 1);
        var str = queryStr.substring(1);
        var func;
        if (hasWhitespace !== -1) {
            return document.querySelectorAll(queryStr) || [{}];
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
        }
        return document[func](str);
    },
    removeClassName: function (classes, toRemove) {
        var index = classes.indexOf(toRemove);
        var pre = classes.substring(0, index);
        var post = classes.substring(index + 2);
        return (pre + post).trim();
    },
    toggleNav: function (e) {
        var clickedNav = e.currentTarget;
        var clickedNavIndex = clickedNav.dataset.index;
        var clickedNavClassName;
        var openedNav;
        var openedNavIndex = app.attrs.nav.opened;
        var openedNavClassName;

        e.preventDefault();

        if (!app.attrs.nav.animating) {
            if (!openedNavIndex) { // nothing opened
                app.attrs.nav.opened = clickedNavIndex;
                clickedNav.parentNode.className += ' on';
            } else if (openedNavIndex !== clickedNavIndex) { // switch nav
                app.attrs.nav.opened = clickedNavIndex;
                openedNav = app.query('.nav-li-a')[openedNavIndex];
                openedNavClassName = openedNav.parentNode.className;
                openedNav.parentNode.className = app.removeClassName(openedNavClassName, 'on');
                clickedNav.parentNode.className += ' on';
            } else { // close nav
                app.attrs.nav.opened = undefined;
                clickedNavClassName = clickedNav.parentNode.className;
                clickedNav.parentNode.className = app.removeClassName(clickedNavClassName, 'on');
            }
        }
    },
    getElementHeight: function (el) {
        var height = Math.max(el.clientHeight, screen.height, window.innerHeight);
        console.log('height: ', height);
        return height;
    },
    toggleNavMobile: function () {
        var navMobileStatus = app.attrs.navMobile.opened;
        var navMobileAnimateStatus = app.attrs.navMobile.animating;
        var navMobile = app.query('.nav-m')[0];
        var navMobileHeight;
        var container = app.query('.container')[0];
        var navMobileClass = navMobile.className;
        if (!navMobileAnimateStatus) {
            app.attrs.navMobile.animating = true;
            if (!navMobileStatus) { // to show menu
                window.scrollTo(0, 0);
                app.attrs.navMobile.opened = true;
                navMobile.style.display = 'block';
//                navMobileHeight = navMobile.clientHeight, screen.height;
//                container.style.height = navMobileHeight + 'px';
                container.style.height = '500px';
                container.style.overflow = 'hidden';
                setTimeout(function () {
                    navMobile.style.opacity = '1';
                    app.attrs.navMobile.animating = false;
                }, 1);
            } else { // to hide menu
//                window.removeEventListener('orientationchange', app.updateHeight);
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
    init: function () {
        var navLinks = this.query('.nav-li-a');
        var navLinksLen = navLinks.length;
        var i;
        var that = this;
        var bindEvent = function (el) {
            el.addEventListener('click', that.toggleNav);
        };
        var navMobileBtn = this.query('.nav-m-toggle')[0];
        var navMobileCloseBtn = this.query('.nav-m-close')[0];
        for (i = 0; i < navLinksLen; i += 1) {
            bindEvent(navLinks[i]);
        }
        navMobileBtn.addEventListener('click', that.toggleNavMobile);
        navMobileCloseBtn.addEventListener('click', that.toggleNavMobile);

    }
};
app.init();