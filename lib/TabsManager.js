define([
    'underscore',
    'backbone.factory/lib/SelectorsFactory',
    './Tabs',
    './WithAnchor'
], function (_, SelectorsFactory, Tabs, WithAnchor) {
    'use strict';

    /**
     * @class TabsManager
     * @extends SelectorsFactory
     */
    var TabsManager = SelectorsFactory.extend(/** @lends TabsManager# */{
        /**
         * @see {@link Backbone.View._selectors}
         * @protected
         * @returns {Object}
         */
        _selectors: function () {
            return _.defaults({
                tabs: '.tabs',
                tabsWithoutAnchor: '.tabs_without-anchor'
            }, this._super());
        },

        /**
         * @see {@link Factory._products}
         * @returns {object}
         * @protected
         */
        _products: function () {
            return _.defaults({
                '*': Tabs.mix(WithAnchor),
                tabsWithoutAnchor: Tabs
            }, this._super());
        },

        /**
         * @protected
         */
        _initProperties: function () {
            this._super();

            /**
             * @type {Array.<Tabs>}
             * @private
             */
            this._tabs = [];
        },

        /**
         * @param {jQuery} $el
         * @returns {TabsManager}
         */
        initTabsInside: function ($el) {
            _.each($el.find(this._selector('tabs')), this._initTabs, this);
            return this;
        },

        /**
         * @param {HTMLElement} el
         * @private
         */
        _initTabs: function (el) {
            this._tabs.push(this.createInstance(el));
        },

        /**
         * @param {String} name
         * @returns {Tabs|undefined}
         */
        get: function (name) {
            return _(this._tabs).find(function (tabs) {
                return tabs.getName() === name;
            });
        }
    });

    return TabsManager;
});
