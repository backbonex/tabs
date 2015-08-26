define([
    'backbone',
    'Backbone.View.Elements',
    'underscore',
    'backbone.anchor/lib/anchor'
], function (Backbone, ElementsView, _, anchor) {
    'use strict';

    /**
     * @class Tabs
     * @extends ElementsView
     */
    var Tabs = ElementsView.extend(/** @lends Tabs# */{
        /**
         * @see {@link ElementsView._classes}
         * @protected
         * @returns {Object.<string>}
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
         * @returns {Object.<string>}
         */
        _selectors: function () {
            var selectors = {
                body: '.tabs__body',
                bodies: '> .tabs__body',
                control: '.tabs__control',
                activeControl: '.tabs__title_active_yes:first .tabs__control',
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
            this._linkWithAnchor();
        },

        /**
         * @private
         */
        _linkWithAnchor: function () {
            var name = this.getName();
            anchor.on('change:' + name, this._onHashChange, this);
            if (anchor.has(name)) {
                this._processAnchorChange(anchor.get(name));
            }
        },

        /**
         * @param {string} tabName
         * @protected
         */
        _processAnchorChange: function (tabName) {
            this.show(tabName);
        },

        /**
         * @param {Backbone.Model} model
         * @param {string} tabName
         * @private
         */
        _onHashChange: function (model, tabName) {
            this._processAnchorChange(tabName);
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            var $activeControl = this._findElem('activeControl');
            if ($activeControl.length) {
                this._activeTab = this._getTabNameFromEl($activeControl[0]);
            }
        },

        /**
         * @param {jQuery.Event} e
         * @private
         */
        _onTabClick: function (e) {
            var el = e.currentTarget;
            // do nothing if it is a fake tab control which should open a page in a new window
            // for example, if target = _blank
            if (el.target) {
                return;
            }
            e.preventDefault();
            this._processTabClick(this._getTabNameFromEl(el));
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
            anchor.set(this.getName(), name);
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

            this.trigger('change', name, this);
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
