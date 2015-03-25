var login = {
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
        obj.className = newClass;
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
        var input = login.query('input', parentNode)[0];
        if (typeof input.value === 'undefined' || input.value === '') {
            login.removeClassName(parentNode, 'hidePlaceholder');
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
    bindIEEvents: function () {
        var that = this;
        var i;
        var placeholderLabels;
        var placeholderInput;
        var isIE8_9 = (document.all && !window.atob)? true : false;
        if (isIE8_9) { // only for IE8 and 9
            placeholderLabels = that.query('.login-form .placeholder label');
            placeholderInput = that.query('.login-form .placeholder input');
            for (i = 0; i < placeholderLabels.length; i += 1) {
                that.bindEvent(placeholderLabels[i], 'click', that.hidePlaceholder);
                that.bindEvent(placeholderInput[i], 'blur', that.showPlaceholder);
                that.bindEvent(placeholderInput[i], 'keyup', that.hidePlaceholder);
            }
        }
    },
    init: function () {
        this.bindIEEvents();
    }
}
login.init();