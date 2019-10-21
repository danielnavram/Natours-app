/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGFuaWVsbmF2cmFtIiwiYSI6ImNrMWJlM3RqZDJteDkzYnFkd3MxcjczOXYifQ.cLFCZduedrnFjNfLgw_x9Q';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/danielnavram/ck1bf0onq0gj91cqje43pe2yi',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      right: 100,
      left: 100
    }
  });
};
