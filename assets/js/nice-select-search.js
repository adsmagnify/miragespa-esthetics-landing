/**
 * Nice Select Search Extension
 * Adds search functionality to nice-select dropdowns.
 * Usage: Add class 'with-search' to the select element.
 */
(function($) {
    "use strict";

    // Re-initialize search when nice-select is updated
    var originalNiceSelectUpdate = $.fn.niceSelect;
    
    $(document).on('click', '.nice-select', function() {
        var $dropdown = $(this);
        var $select = $dropdown.prev('select');
        
        if ($select.hasClass('with-search') && !$dropdown.find('.nice-select-search-box').length) {
            var $list = $dropdown.find('ul');
            var $search = $('<li class="nice-select-search-box"><input type="text" class="nice-select-search" placeholder="Search..." autocomplete="off"></li>');

            $list.prepend($search);

            $search.on('click', function (e) {
                e.stopPropagation();
            });
            
            $search.find('input').on('click keyup keydown', function(e) {
                e.stopPropagation();
            });
            
            $search.find('input').on('keyup', function() {
                var val = $(this).val().toLowerCase();
                $list.find('li').each(function() {
                    var text = $(this).text().toLowerCase();
                    // Skip the search box itself
                    if ($(this).hasClass('nice-select-search-box')) return;
                    
                    if (text.indexOf(val) > -1 || $(this).hasClass('disabled')) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
            
            // Focus input when dropdown opens
            setTimeout(function() {
                $search.find('input').focus();
            }, 10);
        }
    });

    // Hook into niceSelect('update') if we can, but since it's a plugin we might just need to clear search box
    $(document).on('change', 'select.with-search', function() {
        var $dropdown = $(this).next('.nice-select');
        $dropdown.find('.nice-select-search').val('').trigger('keyup');
    });

})(jQuery);
