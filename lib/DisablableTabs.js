define([
    'jquery',
    'underscore',
    './Tabs',
    './Disablable'
], function ($, _, Tabs, Disablable) {
    "use strict";

    /**
     * @class DisablableTabs
     * @mixes Disablable
     * @extends Tabs
     */
    return Tabs.mix(Disablable);
});
