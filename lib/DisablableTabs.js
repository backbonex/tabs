define([
    'jquery',
    'underscore',
    './Tabs',
    './WithDisablable'
], function ($, _, Tabs, WithDisablable) {
    "use strict";

    /**
     * @class DisablableTabs
     * @mixes WithDisablable
     * @extends Tabs
     */
    return Tabs.mix(WithDisablable);
});
