/* ============================================================
 * Plugin Core Init
 * For DEMO purposes only. Extract what you need.
 * ============================================================ */
 $(function() {
'use strict';
//Make tabs switch to top on Mobile
    function switchTabs(){
        $('.nav-tabs').each(function(){
            if($(window).width() <= 480)
                $(this).removeClass('nav-tabs-left');
            else
                $(this).addClass('nav-tabs-left');            
        })
    }
    $(window).resize(function(){
        switchTabs();
    })
    $(document).ready(function(){
        switchTabs();
    })
});