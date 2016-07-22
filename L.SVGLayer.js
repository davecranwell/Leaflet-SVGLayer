(function (L){
    'use strict';

    L.SVGLayer = L.Class.extend({
        includes: L.Mixin.Events,

        initialize: function (svgNode, bounds, options) {
            // save position of the layer or any options from the constructor
            this._svg = svgNode;
            this._bounds = L.latLngBounds(bounds);

            // Remove width/height attrs from svg, so it scales automatically
            this._svg.removeAttribute('width');
            this._svg.removeAttribute('height');

            L.setOptions(this, options);
        },

        onAdd: function (map) {
            this._map = map;

            // create a DOM element and put it into one of the map panes
            this._el = L.DomUtil.create('div', 'svg-layer leaflet-zoom-hide');
            this._el.appendChild(this._svg);
            map._panes.overlayPane.appendChild(this._el);

            // add a viewreset event listener for updating layer's position, do the latter
            map.on('viewreset', this._reset, this);
            this.fire('load');
            this._reset();
        },

        onRemove: function (map) {
            map.getPanes().overlayPane.removeChild(this._el);
            map.off('viewreset', this._reset, this);
        },

        addTo: function (map) {
            map.addLayer(this);
            return this;
        },


        _reset: function () {
            var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest());
            var size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

            // update layer's position
            L.DomUtil.setPosition(this._el, topLeft);
            this._el.style.width = size.x + 'px';
            this._el.style.height = size.y + 'px';
        }
    });

    L.svgLayer = function (svgNode, bounds, options) {
        return new L.SVGLayer(svgNode, bounds, options);
    };
}(L));
