'use strict';
$(document).ready(function () {
    if (window.location.href.match('get-kitchen-data') != null) {
        (function checkExecuting() {
            $('.js-preloader').show();
            $.ajax({
                type: 'GET',
                url: '/src/Ajax.php',
                data: {
                    action: 'is_kitchen_cron_done'
                },
                success: function(results) {
                    let res = jQuery.parseJSON(results);
                    if (res.result){
                        let $update_data_alert = $('.js-update-data');
                        setTimeout(function () {
                            $('.js-preloader').hide();
                            $update_data_alert.fadeIn();

                        }, 500);
                        setTimeout(function () {
                            $update_data_alert.fadeOut(300);
                        }, 6000);
                    } else {
                        checkExecuting();
                    }
                }
            });
        })();

    }
});
