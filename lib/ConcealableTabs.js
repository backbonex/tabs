define([
    'underscore',
    'backbone',
    './Tabs',
    'backbone.anchor/lib/anchor'
], function (_, Backbone, Tabs, anchor) {
    "use strict";

    /**
     * @const {string}
     */
    var CLOSED_SUFFIX = '_closed';

    /**
     * @class ConcealableTabs
     * @extends Tabs
     */
    var ConcealableTabs = Tabs.extend(/**@lends ConcealableTabs#*/{

        /**
         * @see {@link Backbone.View._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                hidden: 'hidden',
                closed: 'tabs__title_closed'
            }, this._super());
        },

        /**
         * @see {@link Backbone.View._selectors}
         * @protected
         * @returns {Object}
         */
        _selectors: function () {
            return _.defaults({
                bodiesHolder: '> .tabs__bodies',
                bodies: '> .tabs__bodies > .tabs__body'
            }, this._super());
        },

        /**
         * @protected
         */
        _initProperties: function () {
            this._super();

            /**
             * @type {boolean}
             * @private
             */
            this._visible = false;

            /**
             * @type {boolean}
             * @private
             */
            this._changing = false;
        },

        /**
         * @constructs
         */
        initialize: function () {
            this._super();

            this._initBodies();
        },

        /**
         * @private
         */
        _initBodies: function () {
            this._removeClass('hidden', 'bodiesHolder').css('display', 'none');
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            // we don't need to init active tab
            // because all tabs are hidden by default
        },

        /**
         * @param {String} tabName
         * @protected
         */
        show: function (tabName) {
            if (this._changing || tabName.indexOf(CLOSED_SUFFIX) > -1) {
                return this;
            }
            this._changing = true;
            if (this._activeTab !== tabName) {
                this._super(tabName);
                if (!this._isVisible()) {
                    this._show(tabName);
                }
            } else {
                if (this._isVisible()) {
                    this._hide(tabName);
                } else {
                    this._show(tabName);
                }
            }
            this._changing = false;
            return this;
        },

        /**
         * @returns {boolean}
         * @private
         */
        _isVisible: function () {
            return this._visible;
        },

        /**
         * @private
         */
        _show: function (tabName) {
            anchor.set(this.getName(), tabName);
            this._visible = true;
            this._elem('titles').removeClass(this._class('closed'));
            this._elem('bodiesHolder').stop(true, true).slideDown();
            Backbone.trigger('change:visibility');
        },

        /**
         * @private
         */
        _hide: function (tabName) {
            anchor.set(this.getName(), tabName + CLOSED_SUFFIX);
            this._visible = false;
            this._getTabTitleByName(tabName).addClass(this._class('closed'));
            this._elem('bodiesHolder').stop(true, true).slideUp();
            Backbone.trigger('change:visibility');
        }

    });

    return ConcealableTabs;
});
