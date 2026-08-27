/**
 * Country → State/Province dropdown logic.
 * Region lists come from window.MIRAGE_COUNTRY_STATES (loaded as a script,
 * so they work even when AJAX to the JSON file is blocked).
 */
(function ($) {
    "use strict";

    var PROVINCES = {};
    var isDataLoaded = false;

    var CONFIG = {
        countrySelector: "#Address_Country",
        regionSelector: "#Address_Region"
    };

    function loadData() {
        if (!window.MIRAGE_COUNTRY_STATES) {
            console.error("Country/state data did not load.");
            return;
        }
        PROVINCES = window.MIRAGE_COUNTRY_STATES;
        isDataLoaded = true;
        populateRegions();
    }

    function regionsForCountry(countryVal) {
        if (!countryVal || countryVal === "-Select-") return [];
        if (PROVINCES[countryVal]) return PROVINCES[countryVal];
        var match = Object.keys(PROVINCES).find(function (key) {
            return key.toLowerCase() === countryVal.toLowerCase();
        });
        return match ? PROVINCES[match] : [];
    }

    function refreshNiceSelect($select) {
        if (!$.fn.niceSelect || !$select.length) return;
        if ($select.next().hasClass("nice-select")) {
            $select.niceSelect("update");
        } else {
            $select.niceSelect();
        }
    }

    function populateRegions() {
        var $country = $(CONFIG.countrySelector);
        var $region = $(CONFIG.regionSelector);
        if (!$country.length || !$region.length) return;

        var countryVal = $country.val();
        if (countryVal) countryVal = String(countryVal).trim();

        var regions = isDataLoaded ? regionsForCountry(countryVal) : [];

        $region.empty();

        if (!countryVal || countryVal === "-Select-") {
            $region.append($("<option>", {
                value: "-Select-",
                text: "Please select country first"
            }));
        } else {
            $region.append($("<option>", {
                value: "-Select-",
                text: regions.length ? "Select Province / State" : "-Select-"
            }));
            $.each(regions, function (i, p) {
                $region.append($("<option>", { value: p, text: p }));
            });
        }

        refreshNiceSelect($region);
    }

    $(document).ready(function () {
        loadData();

        $(document).on("change", CONFIG.countrySelector, function () {
            populateRegions();
        });

        $(document).on("click", CONFIG.countrySelector + " + .nice-select .option", function () {
            setTimeout(populateRegions, 0);
        });
    });
})(jQuery);
