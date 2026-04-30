/* ================================================================
   BUSINESS IVOIRE USA 2026 — Philadelphia Mission Map
   Leaflet + CARTO Light tiles (institutional, no API key)
   ================================================================ */

(function () {
  "use strict";
  if (typeof L === "undefined") return;
  const el = document.getElementById("phillyMap");
  if (!el) return;

  const VENUES = [
    {
      name: "Greenberg Traurig",
      sub: "1717 Arch Street · 22nd Floor",
      day: {
        fr: "11–12 Juin · Forum & Deal Room",
        en: "June 11–12 · Forum & Deal Room",
      },
      lat: 39.95667,
      lng: -75.16998,
    },
    {
      name: "The Union League of Philadelphia",
      sub: "140 South Broad Street",
      day: {
        fr: "10 Juin · Cérémonie d'ouverture",
        en: "June 10 · Opening ceremony",
      },
      lat: 39.94734,
      lng: -75.16404,
    },
    {
      name: "Comcast Center",
      sub: "1701 John F. Kennedy Blvd",
      day: {
        fr: "12 Juin · Gala diplomatique",
        en: "June 12 · Diplomatic gala",
      },
      lat: 39.95513,
      lng: -75.16903,
    },
    {
      name: "Lincoln Financial Field",
      sub: "1 Lincoln Financial Field Way",
      day: {
        fr: "13 Juin · Sport Diplomacy Day",
        en: "June 13 · Sport Diplomacy Day",
      },
      lat: 39.9008,
      lng: -75.1675,
    },
  ];

  const map = L.map("phillyMap", {
    center: [39.9405, -75.1655],
    zoom: 13,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  // CARTO Light No Labels — institutional / minimal
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
  ).addTo(map);

  // Labels overlay (only major roads + neighbourhoods)
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    {
      subdomains: "abcd",
      maxZoom: 19,
      pane: "shadowPane",
    },
  ).addTo(map);

  const markers = [];
  VENUES.forEach((v, i) => {
    const icon = L.divIcon({
      className: "biusa-pin",
      html:
        '<span class="biusa-pin__num">' +
        (i + 1) +
        '</span><span class="biusa-pin__pulse"></span>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
    const m = L.marker([v.lat, v.lng], { icon }).addTo(map);
    const lang = document.documentElement.getAttribute("lang") || "fr";
    const dayLabel = v.day[lang] || v.day.fr;
    m.bindPopup(
      '<div class="biusa-popup">' +
        '<span class="biusa-popup__day">' +
        dayLabel +
        "</span>" +
        "<strong>" +
        v.name +
        "</strong>" +
        '<span class="biusa-popup__sub">' +
        v.sub +
        "</span>" +
        "</div>",
      { closeButton: false, maxWidth: 260 },
    );
    markers.push(m);
  });

  // Initial focus on Center City (3 close venues), Lincoln Financial reachable via legend
  map.setView([39.9525, -75.1665], 14);

  // Legend hover -> open popup
  document.querySelectorAll(".map-legend__item").forEach((li) => {
    li.addEventListener("mouseenter", () => {
      const idx = parseInt(li.dataset.marker, 10);
      if (markers[idx]) markers[idx].openPopup();
    });
    li.addEventListener("click", () => {
      const idx = parseInt(li.dataset.marker, 10);
      if (markers[idx]) {
        map.flyTo(markers[idx].getLatLng(), 15, { duration: 0.8 });
        markers[idx].openPopup();
      }
    });
  });

  // Re-bind popup language on lang switch
  document.querySelectorAll(".topbar__lang button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang || "fr";
      VENUES.forEach((v, i) => {
        const dayLabel = v.day[lang] || v.day.fr;
        markers[i].setPopupContent(
          '<div class="biusa-popup">' +
            '<span class="biusa-popup__day">' +
            dayLabel +
            "</span>" +
            "<strong>" +
            v.name +
            "</strong>" +
            '<span class="biusa-popup__sub">' +
            v.sub +
            "</span>" +
            "</div>",
        );
      });
    });
  });
})();
