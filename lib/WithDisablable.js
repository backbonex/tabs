define([
    'backbone.mix',
    'backbone-super'
], function (Mixin) {
    'use strict';

    /**
     * @mixin WithDisablable
     * @extends Tabs
     */
    var WithDisablable = new Mixin(/** @lends WithDisablable# */{

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
         * @returns {Tabs} this
         */
        enableTab: function (name) {
            this._removeClass('disabled', this._getTabTitleByName(name));
            return this;
        },

        /**
         * @public
         * @param {string} name
         * @returns {Tabs} this
         */
        disableTab: function (name) {
            this._addClass('disabled', this._getTabTitleByName(name));
            return this;
        },

        /**
         * Disables all tabs in the collection
         * @public
         * @returns {Tabs} this
         */
        disable: function () {
            this._addClass('disabled', 'title');
            return this;
        },

        /**
         * Enables all tabs in the collection
         * @public
         * @returns {Tabs} this
         */
        enable: function () {
            this._removeClass('disabled', 'title');
            return this;
        },

        /**
         * @param {string} name
         * @returns {Tabs} this
         */
        show: function (name) {
            if (this._isDisabled(name)) {
                return this;
            }
            return this._super(name);
        },

        /**
         * @protected
         * @param {string} name
         * @returns {boolean}
         */
        _isDisabled: function (name) {
            return this._hasClass('disabled', this._getTabTitleByName(name));
        }
    });
    return WithDisablable;
});
