'use strict';
$(document).ready(function () {

    $('.js-send-mail').on('click', function (e) {

        $('.js-modal-send-question').modal('hide');

        let $all_select = $('select.js-select-logistics'),
            all_filled_select = [];

        $all_select.each(function (i, el) {
            let this_val = $all_select[i].selectize.getValue();
            if (this_val != '') {
                all_filled_select.push(this_val);
            }
        });

        if (all_filled_select.length != $all_select.length){

            let $error_modal = $('.js-modal-error-send-mail');
            $error_modal.fadeIn();
            setTimeout(function () {
                $error_modal.fadeOut();
            }, 4000);
            return false;

        } else {

            $.ajax({
                type: 'POST',
                url: '/src/Ajax.php',
                data: {
                    action: "couriers_send_mail"
                },
                success: function (results) {
                    let res = jQuery.parseJSON(results);
                    if (res.status){
                        let $success_modal = $('.js-modal-suc-send-mail');
                        $success_modal.fadeIn();
                        setTimeout(function () {
                            $success_modal.fadeOut();
                        }, 4000);
                    } else {
                        let $danger_alert = $('.js-danger-alert'),
                            prev_text_alert = $danger_alert.text();
                        $danger_alert.text(res.msg);
                        $danger_alert.fadeIn();
                        setTimeout(function () {
                            $danger_alert.fadeOut(300, function () {
                                $danger_alert.text(prev_text_alert);
                            });
                        }, 6000);
                    }
                }
            });

        }

    });

});
