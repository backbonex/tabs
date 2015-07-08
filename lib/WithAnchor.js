define([
    'backbone.mix',
    'backbone.anchor/lib/anchor',
    'backbone-super'
], function (Mixin, anchor) {
    'use strict';

    /**
     * @mixin WithAnchor
     * @extends Tabs
     */
    var WithAnchor = new Mixin(/** @lends WithAnchor# */{
        /**
         * @constructs
         */
        initialize: function () {
            this._super();

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
         * @public
         * @param {string} name
         * @returns {Tabs} this
         */
        show: function (name) {
            this._super(name);

            anchor.set(this.getName(), name);
            return this;
        }
    });
    return WithAnchor;
});
