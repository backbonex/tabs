define([
    'backbone',
    'Backbone.View.Elements',
    'underscore'
], function (Backbone, ElementsView, _) {
    'use strict';

    /**
     * @class Tabs
     * @extends ElementsView
     */
    var Tabs = ElementsView.extend(/** @lends Tabs# */{
        /**
         * @see {@link ElementsView._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                activeTitle: 'tabs__title_active_yes',
                activeBody: 'tabs__body_active_yes'
            }, this._super());
        },

        /**
         * @see {@link ElementsView._selectors}
         * @protected
         * @returns {Object}
         */
        _selectors: function () {
            var selectors = {
                body: '.tabs__body',
                bodies: '> .tabs__body',
                control: '.tabs__control',
                controls: '.tabs__titles:first .tabs__control',
                title: '.tabs__title',
                titles: '.tabs__titles:first .tabs__title'
            };
            selectors.link = selectors.controls + '[href$="%s"], ' + selectors.controls + '[href="#%s"]';
            return _.defaults(selectors, this._super());
        },

        /**
         * @see {@link Backbone.View.events}
         * @protected
         * @returns {Object}
         */
        events: function () {
            var events = this._super();
            events['click ' + this._selector('controls')] = this._onTabClick;
            return events;
        },

        /**
         * @protected
         */
        _initProperties: function () {
            this._super();

            /**
             * @type {?string}
             * @protected
             */
            this._activeTab = null;
        },

        /**
         * @constructs
         */
        initialize: function () {
            this._super();

            this.getName = _.once(this.getName);
            this._initActiveTab();
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            this._activeTab = this._getTabNameFromEl(this._elem('controls')[0]);
        },

        /**
         * @param {jQuery.Event} e
         * @private
         */
        _onTabClick: function (e) {
            e.preventDefault();
            var el = e.currentTarget,
                tabName = this._getTabNameFromEl(el);
            this._processTabClick(tabName);
        },

        /**
         * @param {string} tabName
         * @protected
         */
        _processTabClick: function (tabName) {
            this.show(tabName);
        },

        /**
         * @public
         * @param {string} name
         * @returns {Tabs} this
         */
        show: function (name) {
            if (this._activeTab === name) {
                return this;
            }
            this._setActiveTab(name);
            return this;
        },

        /**
         * @param {string} name
         * @private
         */
        _setActiveTab: function (name) {
            var $title = this._getTabTitleByName(name),
                $body = this._getTabBodyByTitle($title);

            this._removeClass('activeTitle', 'titles');
            this._addClass('activeTitle', $title);
            this._removeClass('activeBody', 'bodies');
            this._addClass('activeBody', $body);

            this._activeTab = name;

            this.trigger('change', name, $body, this);
            Backbone.trigger('change:visibility');
        },

        /**
         * @param {string} name
         * @returns {jQuery}
         * @protected
         */
        _getTabBodyByName: function (name) {
            return this._getTabBodyByTitle(this._getTabTitleByName(name));
        },

        /**
         * @param {jQuery} $title
         * @returns {jQuery}
         * @private
         */
        _getTabBodyByTitle: function ($title) {
            var tabIndex = this._elem('titles').index($title);
            return this._elem('bodies').eq(tabIndex);
        },

        /**
         * @param {HTMLAnchorElement} el
         * @protected
         * @returns {string}
         */
        _getTabNameFromEl: function (el) {
            return this._getNamesPairFromEl(el)[1];
        },

        /**
         * @param {HTMLAnchorElement} el
         * @private
         * @returns {Array.<string>}
         */
        _getNamesPairFromEl: function (el) {
            return el.href.split('#')[1].split('=');
        },

        /**
         * @param {string} tabName
         * @method
         * @protected
         */
        _getTabTitleByName: function (tabName) {
            // todo: fix ElementsView "use selector with object"
            return this._elem('link', tabName, tabName).closest(this._selector('title'));
        },

        /**
         * @public
         * @returns {string}
         */
        getName: function () {
            return this._getNamesPairFromEl(this._elem('controls')[0])[0];
        },

        /**
         * @returns {?string}
         */
        getActiveTabName: function () {
            return this._activeTab;
        }
    });
    return Tabs;
});
