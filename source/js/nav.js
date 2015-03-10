/* jshint strict:true */
/* global core, escape */

'use strict';

var nav = core.createApp({
    attrs: {
        data: {},
        queryItems: [],
        dom: {}
    },
    templates: function (template, inputString) {
        switch (template) {
        default:
            return '<div>' + inputString + '</div>';
        }
    },
    load: function () {
        console.log('test')
    }
}, 'nav');