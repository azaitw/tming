/* jshint strict:false, unused: false */
/* global document, XMLHttpRequest, window */

var app = {
    attrs: {
        nav: {
            opened: undefined,
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
    init: function () {
        var navLinks = this.query('.nav-li-a');
        var navLinksLen = navLinks.length;
        var i;
        var that = this;
        var bindEvent = function (el) {
            el.addEventListener('click', that.toggleNav);
        };
        for (i = 0; i < navLinksLen; i += 1) {
            bindEvent(navLinks[i]);
        }
    }
};
app.init();