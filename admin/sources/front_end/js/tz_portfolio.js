//Sort
function tzSortFilter(srcObj, desObj, order) {
    "use strict";
    if ((!order || order == 'auto')
        && (srcObj.last().attr('data-order') && srcObj.last().data('order').toString().length)) {
        order = 'filter_asc';
    }
    srcObj.sort(function (a, b) {
        var compA = jQuery(a).data('order') ? parseInt(jQuery(a).data('order'), 10) : jQuery(a).text().trim();
        var compB = jQuery(b).data('order') ? parseInt(jQuery(b).data('order'), 10) : jQuery(b).text().trim();
        if (jQuery(a).attr('data-option-value') != '*' &&
            jQuery(b).attr('data-option-value') != '*') {
            if (order.substr(order.length - 3, order.length).toLowerCase() == 'asc') {
                return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
            }
            if (order.substr(order.length - 4, order.length).toLowerCase() == 'desc') {
                return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
            }
        }
    });
    srcObj.each(function (idx, itm) {
        desObj.append(itm).append('\n');
    });
    return true;
}

function ajaxComments($element, itemid, text, link) {
    "use strict";
    if ($element.length) {
        if ($element.find('.name a').length) {
            var url = 'index.php?option=com_tz_portfolio&task=portfolio.ajaxcomments',
                $href = [],
                $articleId = [];
            if (link) {
                url = link;
            }
            $element.map(function (index, obj) {
                if (jQuery(obj).find('.name a').length) {
                    if (jQuery(obj).find('.name a').attr('href').length) {
                        $href.push(jQuery(obj).find('.name a').attr('href'));
                        if (jQuery(obj).attr('id')) {
                            $articleId.push(jQuery(obj).attr('id'));
                        }
                    }
                }
            });

            jQuery.ajax({
                type: 'post',
                url: url,
                data: {
                    Itemid: itemid,
                    url: window.Base64.encode(window.JSON.encode($href)),
                    id: window.Base64.encode(window.JSON.encode($articleId))
                }
            }).success(function (data) {
                if (data && data.length) {
                    var $comment = window.JSON.decode(data);
                    if (typeof $comment == 'object') {
                        jQuery.each($comment, function (key, value) {
                            if (jQuery('#' + key).find('.TzPortfolioCommentCount').length) {
                                jQuery('#' + key).find('.TzPortfolioCommentCount').html(text + '<span>' + value + '</span>');
                            }
                        });
                    }
                }
            });
        }
    }
}

(function($){
    'use strict';
    $.tzPortfolioIsotope  = function(el,options){
        var $this   = $(el),
            $var    = $.extend(true,$.tzPortfolioIsotope.defaults,options),
            $params = $var.params,
            $isotope_options    = $var.isotope_options;

        switch($params.orderby_sec){
            default:
                $isotope_options.core.sortBy        = 'original-order';
                $isotope_options.core.sortAscending = false;
                break;
            case 'date':
                $isotope_options.core.sortBy        = 'date';
                $isotope_options.core.sortAscending = true;
                if($var.timeline){
                    $isotope_options.core.sortAscending = false;
                }
                break;
            case 'rdate':
                $isotope_options.core.sortBy        = 'date';
                $isotope_options.core.sortAscending = false;
                break;
            case 'alpha':
                $isotope_options.core.sortBy        = 'name';
                $isotope_options.core.sortAscending = true;
                break;
            case 'ralpha':
                $isotope_options.core.sortBy        = 'name';
                $isotope_options.core.sortAscending = false;
                break;
            case 'author':
                $isotope_options.core.sortBy = 'date';
                $isotope_options.core.sortAscending = false;
                break;
            case 'rauthor':
                $isotope_options.core.sortBy = 'date';
                $isotope_options.core.sortAscending = false;
                break;
            case 'hits':
                $isotope_options.core.sortBy        = 'hits';
                $isotope_options.core.sortAscending = false;
                break;
            case 'rhits':
                $isotope_options.core.sortBy        = 'hits';
                $isotope_options.core.sortAscending = true;
                break;
        }

        // This is the function to calculate column width for isotope
        $.tzPortfolioIsotope.tz_init = function(bool){
            var contentWidth    = $($var.mainElementSelector).width();
            var columnWidth     = $params.tz_column_width;
            var curColCount     = 0;

            var maxColCount     = 0;
            var newColCount     = 0;
            var newColWidth     = 0;
            var featureColWidth = 0;

            if($var.columnWidth){
                columnWidth    = $var.columnWidth;
            }

            if($var.timeline) {
                $.extend(true, $.Isotope.prototype, {
                    _sort: function () {
                        var sortBy = this.options.sortBy,
                            getSorter = this._getSorter,
                            sortDir = this.options.sortAscending ? 1 : -1,
                            sortFn = function (alpha, beta) {
                                var a = getSorter(alpha, sortBy),
                                    b = getSorter(beta, sortBy);

                                // fall back to original order if data matches
                                if (a === b && sortBy !== 'original-order') {
                                    a = getSorter(alpha, 'original-order');
                                    b = getSorter(beta, 'original-order');
                                }

                                if(sortBy == 'name' || sortBy == 'hits') {
                                    if ($(alpha).attr('data-category') > $(beta).attr('data-category')) {
                                        return 0;
                                    } else {
                                        if ($(alpha).attr('data-category') == $(beta).attr('data-category')) {
                                            if($(alpha).hasClass('TzDate')){
                                                return 0;
                                            }
                                            if (a > b) {
                                                return 1 * sortDir;
                                            } else {
                                                return 0;
                                            }
                                        }
                                    }
                                }

                                return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
                            };
                        this.$filteredAtoms.sort(sortFn);
                    }
                });
            }


            curColCount = Math.floor(contentWidth / columnWidth);
            $var.beforeCalculateColumn(curColCount);

            maxColCount = curColCount + 1;
            if((maxColCount - (contentWidth / columnWidth)) > ((contentWidth / columnWidth) - curColCount)){
                newColCount     = curColCount;
            }
            else{
                newColCount = maxColCount;
            }

            newColWidth = contentWidth;
            featureColWidth = contentWidth;

            if(newColCount > 1){
                newColWidth = Math.floor(contentWidth / newColCount);
                featureColWidth = newColWidth * 2;
            }
            $var.afterCalculateColumn(newColCount,newColWidth);

            $($this.selector + ' .element').width(newColWidth);

            $($var.elementFeatureSelector).width(featureColWidth);
            $($this.selector + ' .element.TzDate').width(contentWidth);

            $var.afterColumnWidth(newColCount,newColWidth);

            var $container = $($this.selector);

            if(bool) {
                $container.find('.element').css({opacity: 0});
            }
            $container.imagesLoaded(function(){
                $var.afterImagesLoaded();
                if(bool) {
                    $container.find('.element').css({opacity: 1});
                }

                if(!$isotope_options.core.layoutMode.length){
                    $isotope_options.core.layoutMode  = 'masonry';
                }else{
                    if($params.layout_type.length){
                        $isotope_options.core.layoutMode  = $params.layout_type[0];
                    }
                }

                $container.isotope({
                    itemSelector : $isotope_options.core.itemSelector,
                    layoutMode: $isotope_options.core.layoutMode,
                    sortBy: $isotope_options.core.sortBy,
                    sortAscending: $isotope_options.core.sortAscending,
                    filter: $isotope_options.core.filter,
                    masonry:{
                        columnWidth: newColWidth
                    },
                    getSortData: $isotope_options.core.getSortData
                },function(){
                    if(parseInt($params.tz_show_filter,10) && $params.filter_tags_categories_order) {
                        //Sort tags or categories filter
                        if(typeof window.tzSortFilter != 'undefined') {
                            window.tzSortFilter($($isotope_options.sortParentTag).find($isotope_options.sortChildTag),
                                $($isotope_options.sortParentTag), $params.filter_tags_categories_order);
                        }
                    }
                    $isotope_options.complete();
                });
            });
        };

        $.tzPortfolioIsotope.loadPortfolio  = function(){

            var $optionSets = $($isotope_options.filterSelector),
                $optionLinks = $optionSets.find($isotope_options.tagFilter);
            var $r_options    = null,
                $container_options=$isotope_options.core;
            $optionLinks.click(function(event){
                event.preventDefault();
                var $isotope_this = $(this);
                // don't proceed if already selected
                if ( $isotope_this.hasClass('selected') ) {
                    return false;
                }
                var $optionSet = $isotope_this.parents('.option-set');
                $optionSet.find('.selected').removeClass('selected');
                $isotope_this.addClass('selected');

                // make option object dynamically, i.e. { filter: '.my-filter-class' }
                var options = $container_options,
                    key = $optionSet.attr('data-option-key'),
                    value = $isotope_this.attr('data-option-value');

                // parse 'false' as false boolean
                value = value === 'false' ? false : value;
                options[ key ] = value;

                if ( key === 'layoutMode' && typeof window.changeLayoutMode === 'function' ) {
                    // changes in layout modes need extra logic
                    window.changeLayoutMode( $isotope_this, options );
                } else {
                    // otherwise, apply new options
                    if(value == 'name'){
                        if($params.orderby_sec == 'alpha' || ($params.orderby_sec != 'alpha'
                            && $params.orderby_sec != 'ralpha')){
                            options.sortAscending    = true;
                        }else{
                            if($params.orderby_sec == 'ralpha'){
                                options.sortAscending    = false;
                            }
                        }
                    }
                    if(value == 'date'){
                        if($params.orderby_sec == 'rdate'
                            || ($params.orderby_sec != 'date'
                            && $params.orderby_sec != 'rdate')){
                            options.sortAscending    = false;
                        }else{
                            if($params.orderby_sec == 'date'){
                                options.sortAscending    = true;
                            }
                        }
                    }
                    if(value == 'hits'){
                        if($params.orderby_sec == 'hits'
                            || ($params.orderby_sec != 'hits'
                            && $params.orderby_sec != 'rhits')){
                            options.sortAscending    = false;
                        }else{
                            if($params.orderby_sec == 'rhits'){
                                options.sortAscending    = true;
                            }
                        }
                    }

                    options = $.extend($r_options,options);
                    $($this.selector).isotope(options);
                    $r_options  = options;
                }
                return false;
            });
        }

        // Call Function isotope ind document ready function
        $.tzPortfolioIsotope.tz_init(true);
        $($isotope_options.filterSelector+'[data-option-key=sortBy]').children().removeClass('selected')
            .end().find('[data-option-value='+$isotope_options.core.sortBy + ']').addClass('selected');

        $.tzPortfolioIsotope.loadPortfolio();

        // Call Function tz_init in window load and resize function
        $(window).smartresize(function(){
            $.tzPortfolioIsotope.tz_init();
        });
        $(window).smartresize();

        return this;
    };
    // Create options object
    $.tzPortfolioIsotope.defaults  = { // This is default options
        'columnWidth'               : '',
        'mainElementSelector'       : '#TzContent',
        'containerElementSelector'  : '#portfolio',
        //'elementSelector'           : '.element',
        'elementFeatureSelector'    : '.tz_feature_item',
        'JSON'                      : {},
        timeline                    : false,
        'params'                    : {
            'orderby_sec'                   : 'rdate',
            'tz_show_filter'                : 1,
            'filter_tags_categories_order'  : 'auto',
            'tz_portfolio_layout'           : 'ajaxButton',
            'comment_function_type'         : 'default',
            'tz_filter_type'                : 'categories',
            'show_all_filter'               : 0,
            'tz_comment_type'               : 'disqus',
            'tz_show_count_comment'         : 1,
            'tz_column_width'               : 233,
            'layout_type'                   : ['masonry']
        },
        'isotope_options'                   : {
            'core'  : {
                'itemSelector': '.element',
                'layoutMode': '',
                'sortBy': 'date',
                'sortAscending': false,
                'filter': '*',
                'getSortData': {
                    date: function ($elem) {
                        var number = ($elem.hasClass('element') && $elem.attr('data-date').length) ?
                            $elem.attr('data-date') : $elem.find('.create').text();
                        return parseInt(number,10);
                    },
                    hits: function ($elem) {
                        var number = ($elem.hasClass('element') && $elem.attr('data-hits').length) ?
                            $elem.attr('data-hits') : $elem.find('.hits').text();
                        return parseInt(number,10);
                    },
                    name: function ($elem) {
                        var name = ($elem.hasClass('element') && $elem.find('.TzPortfolioTitle.name').length)?$elem.find('.TzPortfolioTitle.name').text().trim():
                                (($elem.attr('data-title').length)?$elem.attr('data-title'):''),
                            itemText = name.length ? name : $elem.text().trim();
                        return itemText;
                    }
                }
            },
            'filterSelector'    : '#tz_options .option-set',
            'tagFilter'         : 'a',
            'sortParentTag'     : '#filter',
            'sortChildTag'      : '#filter',
            'complete'  : function(){}
        },
        // Call back function
        beforeCalculateColumn   : function(){},
        afterCalculateColumn    : function(){},
        afterColumnWidth        : function(){},
        afterImagesLoaded       : function(){}
    };
    $.fn.tzPortfolioIsotope = function(options){
        if (options === undefined) options = {};
        if (typeof options === "object") {
            // Call function
            return new $.tzPortfolioIsotope(this,options);
        }
    };


    // Variable tzInfiniteScroll plugin
    $.tzInfiniteScroll  = function(el,options){
        var $this   = $(el),
            $var    = $.extend(true,$.tzInfiniteScroll.defaults,options),
            $params = $var.params;

        var tzpage    = 1;

        function getTags() {
            var tags    =   [];
            $('#filter a').each(function () {
                tags.push($(this).attr('data-option-value').replace(".","") );
            });
            return window.JSON.encode(tags);
        }

        function getCategories() {
            var tags    =   [];
            $('#filter a').each(function () {
                tags.push($(this).attr('data-option-value').replace(".category",""));
            });
            return window.JSON.encode(tags);
        }


        var $container = $($this.selector),
            $scroll = true;
        var LastDate = $('div.TzDate:last').attr('data-category');

        $container.infinitescroll({
                navSelector  : $var.navSelector,    // selector for the paged navigation
                nextSelector : $var.nextSelector,  // selector for the NEXT link (to page 2)
                itemSelector : $var.itemSelector,     // selector for all items you'll retrieve
                dataType     : $var.dataType,
                errorCallback: function() {
                    if(!$var.errorCallback) {
                        if ($params.tz_portfolio_layout == 'ajaxButton') {
                            $('#tz_append a').unbind('click').html($var.loadedText).show();
                        }
                        if ($params.tz_portfolio_layout == 'ajaxInfiScroll') {
                            $('#tz_append').removeAttr('style').html('<a class="tzNomore">' + $var.loadedText + '</a>');
                        }
                        $('#tz_append a').addClass('tzNomore');
                        $('#infscr-loading').css('display', 'none');
                    }
                },
                loading: {
                    msgText: $var.msgText,
                    finishedMsg: '',
                    img: $var.rootPath + 'components/com_tz_portfolio/assets/ajax-loader.gif',
                    selector: '#tz_append'
                }
            },
            // call Isotope as a callback
            function( newElements ) {
                $('#infscr-loading').css('display','none');

                var $newElems =   $( newElements ).css({ opacity: 0 });

                if($params.comment_function_type == 'js') {
                    // Ajax show comment count.
                    if (parseInt($params.tz_show_count_comment,10)) {
                        if ($params.tz_comment_type == 'facebook' || $params.tz_comment_type == 'disqus'){
                            if(typeof window.ajaxComments != 'undefined') {
                                window.ajaxComments($newElems, $var.itemID, $var.commentText);
                            }
                        }
                    }
                }

                console.log($.tzInfiniteScroll.ajaxLoadComplete());

                // ensure that images load before adding to masonry layout
                $newElems.imagesLoaded(function() {

                    // show elems now they're ready
                    $newElems.animate({opacity: 1});

                    $.tzPortfolioIsotope.tz_init();

                    if($var.timeline){
                        // trigger scroll again
                        $container.isotope( 'insert', $newElems);

                        // Delete date haved
                        $newElems.each(function(){
                            var tzClass = $(this).attr('class');
                            if(tzClass.match(/.*?TzDate.*?/i)){
                                var LastDate2 = $(this).attr('data-category');
                                if(LastDate == LastDate2){

                                    $(this).remove();
                                    $container.isotope('reloadItems');
                                }
                                else
                                    LastDate    = LastDate2;
                            }
                        });
                    }else {
                        // trigger scroll again
                        $container.isotope('appended', $newElems);
                    }

                    tzpage++;

                    if(parseInt($params.tz_show_filter,10)) {
                        var $lang   = '';
                        if($var.lang && $var.lang.length){
                            $lang   = '&lang=' + $var.lang;
                        }
                        if (!parseInt($params.show_all_filter,10)) {
                            if ($params.tz_filter_type == 'tags') {
                                $.ajax({
                                    url: 'index.php?option=com_tz_portfolio&task=portfolio.ajaxtags' + $lang,
                                    data: {
                                        'tags': getTags(),
                                        'Itemid': $var.itemID,
                                        'page': tzpage
                                    }
                                }).success(function (data) {
                                    if (data.length) {
                                        var tztag = $(data);
                                        $('#filter').append(tztag);
                                        $.tzPortfolioIsotope.loadPortfolio();

                                        if ($params.filter_tags_categories_order) {
                                            //Sort tags or categories filter
                                            if(typeof window.tzSortFilter != 'undefined') {
                                                window.tzSortFilter($($var.sortParentTag).find($var.sortChildTag), $($var.sortParentTag), $params.filter_tags_categories_order);
                                            }
                                        }
                                    }

                                    $scroll = true;
                                });
                            }

                            if ($params.tz_filter_type == 'categories') {
                                $.ajax({
                                    url: 'index.php?option=com_tz_portfolio&task=portfolio.ajaxcategories' + $lang,
                                    data: {
                                        'catIds': getCategories(),
                                        'Itemid': $var.itemID,
                                        'page': tzpage
                                    }
                                }).success(function (data) {
                                    if (data.length) {
                                        var tzCategories = $(data);
                                        $('#filter').append(tzCategories);
                                        $.tzPortfolioIsotope.loadPortfolio();

                                        if ($params.filter_tags_categories_order) {
                                            //Sort tags or categories filter
                                            if(typeof window.tzSortFilter != 'undefined') {
                                                window.tzSortFilter($($var.sortParentTag).find($var.sortChildTag), $($var.sortParentTag), $params.filter_tags_categories_order);
                                            }
                                        }
                                    }

                                    $scroll = true;
                                });
                            }
                        }
                    }else{
                        $scroll = true;
                    }

                    //if there still more item
                    if($newElems.length){

                        //move item-more to the end
                        $('div#tz_append').find('a:first').show();
                    }
                });
            }
        );

        if($params.tz_portfolio_layout == 'ajaxInfiScroll'){
            $(window).scroll(function(){
                $(window).unbind('.infscr');
                if($scroll){
                    if($(window).scrollTop() >= $container.height()){
                        $scroll	= false;
                        $container.infinitescroll('retrieve');
                    }
                }
            });
        }

        if($params.tz_portfolio_layout == 'ajaxButton'){
            $(window).unbind('.infscr');

            $('div#tz_append a').click(function(){
                $(this).stop();
                $('div#tz_append').find('a:first').hide();
                $container.infinitescroll('retrieve');
            });
        }
    };

    var tz = $.tzInfiniteScroll.ajaxLoadComplete = $.extend(true,function($element){
        if(tz.data.length){
            tz.data.each(function(fn, value){
                if(typeof fn == 'function'){
                    // Call function
                    fn();
                }
            });
        }
    }, {
        data: []
    });

    $.tzInfiniteScroll.addCompleteFunction  = function(fn){
        if(fn && typeof fn){
            tz.data.push(fn);
        }
    };

    // Create options object
    $.tzInfiniteScroll.defaults  = {
        rootPath        : '',
        msgText         : '<i class="tz-icon-spinner tz-spin"></i><em>Loading the next set of posts...</em>',
        loadedText      : 'No more pages to load',
        navSelector     : '#loadaj a',    // selector for the paged navigation
        nextSelector    : '#loadaj a:first',  // selector for the NEXT link (to page 2)
        itemSelector    : '.element',     // selector for all items you'll retrieve
        dataType        : 'html',
        itemID          : null,
        commentText     : 'Comment count:',
        timeline        : false,
        sortParentTag   : '#filter',
        sortChildTag    : 'a',
        lang            : '',
        errorCallback   : null

    };
    $.fn.tzInfiniteScroll   = function(options){
        if(options === undefined) options   = {};
        if(typeof options === 'object'){
            // Call function
            return new $.tzInfiniteScroll(this,options);
        }
    }

})(jQuery);
