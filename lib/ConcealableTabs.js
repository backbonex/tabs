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
             * @protected
             */
            this._isBodiesHolderOpen = !this._hasClass('hidden', 'bodiesHolder');

            /**
             * @type {boolean}
             * @private
             */
            this._ignoreAnchorChanges = false;

            /**
             * @type {boolean}
             * @private
             */
            this._isBodiesHolderInited = this._isBodiesHolderOpen;
        },

        /**
         * @private
         */
        _initBodiesHolder: function () {
            if (!this._isBodiesHolderInited) {
                this._isBodiesHolderInited = true;
                this._elem('bodiesHolder')
                    .removeClass(this._class('hidden'))
                    .css('display', 'none');
            }
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            if (this._isBodiesHolderOpen) {
                this._super();
            }
        },

        /**
         * @param {string} tabName
         * @protected
         */
        _processAnchorChange: function (tabName) {
            if (this._ignoreAnchorChanges) {
                return;
            }
            if (tabName.indexOf(CLOSED_SUFFIX) > -1) {
                var tabNameWithoutClosedSuffix = tabName.split(CLOSED_SUFFIX)[0];
                if (this._activeTab !== tabNameWithoutClosedSuffix) {
                    this._ignoreAnchorChanges = true;
                    this.show(tabNameWithoutClosedSuffix);
                    anchor.set(this.getName(), tabName);
                    this._ignoreAnchorChanges = false;
                }
                this._closeBodiesHolder(tabNameWithoutClosedSuffix);
            } else {
                this._super(tabName);
            }
        },

        /**
         * @param {string} tabName
         * @protected
         */
        _processTabClick: function (tabName) {
            if (this._activeTab !== tabName) {
                this._super(tabName);
            }
            else {
                this._ignoreAnchorChanges = true;
                if (this._isBodiesHolderOpen) {
                    anchor.set(this.getName(), tabName + CLOSED_SUFFIX);
                    this._closeBodiesHolder(tabName);
                }
                else {
                    anchor.set(this.getName(), tabName);
                    this._openBodiesHolder(tabName);
                }
                this._ignoreAnchorChanges = false;
            }
        },

        /**
         * @param {String} tabName
         * @returns ConcealableTabs
         * @protected
         */
        show: function (tabName) {
            this._super(tabName);
            if (!this._isBodiesHolderOpen) {
                this._openBodiesHolder(tabName);
            }
            return this;
        },

        /**
         * @private
         */
        _openBodiesHolder: function (tabName) {
            this._isBodiesHolderOpen = true;
            this._getTabTitleByName(tabName).removeClass(this._class('closed'));
            this._initBodiesHolder();
            this._elem('bodiesHolder').stop(true, true).slideDown();
            Backbone.trigger('change:visibility');
        },

        /**
         * @private
         */
        _closeBodiesHolder: function (tabName) {
            this._isBodiesHolderOpen = false;
            this._getTabTitleByName(tabName).addClass(this._class('closed'));
            this._elem('bodiesHolder').stop(true, true).slideUp();
            Backbone.trigger('change:visibility');
        }

    });

    return ConcealableTabs;
});
