# Tabs
Backbone.View-based Tabs. Saves state in the window's anchor.

## Installation

To install the latest version with bower:

```sh
> bower install backbone.tabs --save
```

## Initialization

Simple initialization example:

```js
var tabs = new Tabs({
    el: tabsDomElement
}); 
```

You can initialize all tabs on the page using TabsManager:

```js
var tabsManager = new TabsManager();
tabsManager.initTabsInside($('body'));
var tabs = tabsManager.get('tabsName'); // way to get tabs instances 
```

## Usage

Assuming we have tabs with two links as controls, `#tab=first` and `#tab=second`:

```js
// after page load, the page's url ended with "#tab=first"
var tabs = tabsManager.get('tab');
tabs.getName(); // 'tab'
tabs.getActiveTabName(); // 'first'
tabs.show('second'); // hide "first" tab, show "second"
// now page's url ended with "#tab=second"
tabs.getActiveTabName(); // 'second'
```
