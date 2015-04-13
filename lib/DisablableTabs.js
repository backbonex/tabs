define([
    'jquery',
    'underscore',
    './Tabs',
    'global/Anchor/Anchor'
], function ($, _, Tabs, Anchor) {
    "use strict";

    /**
     * @class DisablableTabs
     * @extends Tabs
     */
    var DisablableTabs = Tabs.extend(/**@lends DisablableTabs*/{

        /**
         * @see {@link Backbone.View._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                disabled: 'tabs__title_disabled_yes'
            }, this._super());
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            var $enabledTitles = this._elem('titles').not(this._selector('disabled'));
            if ($enabledTitles.length) {
                this._activeTab = this._getTabNameFromEl($enabledTitles.eq(0).find(this._selector('control'))[0]);
            }
        },

        /**
         * @public
         * @param {string} name
         */
        enableTab: function (name) {
            this._removeClass('disabled', this._getTabTitleByName(name));
            return this;
        },

        /**
         * @public
         * @param {string} name
         */
        disableTab: function (name) {
            this._addClass('disabled', this._getTabTitleByName(name));
            return this;
        },

        /**
         * Disables all tabs in the collection
         * @public
         * @returns DisablableTabs this
         */
        disable: function () {
            this._addClass('disabled', 'title');
            return this;
        },

        /**
         * Enables all tabs in the collection
         * @public
         * @returns DisablableTabs this
         */
        enable: function () {
            this._removeClass('disabled', 'title');
            return this;
        },

        /**
         * @param {string} name
         */
        show: function (name) {
            if (this._hasClass('disabled', this._getTabTitleByName(name))) {
                return this;
            }
            return this._super(name);
        }
    });

    return DisablableTabs;
});
