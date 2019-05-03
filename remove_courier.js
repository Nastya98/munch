'use strict';
$(document).ready(function () {

    $('.js-list-couriers').on('click', '.js-remove-question-btn', function (e) {

        let $this = $(this),
            $modal_remove_question = $('.js-modal-remove-question'),
            $this_list_item = $this.closest('.js-list-courier-item'),
            this_list_item_id = $this_list_item.data('id-courier');
        $modal_remove_question.data('id-remove-item', this_list_item_id);

    });

    $('.js-remove-btn').on('click', function (e) {

        $('.js-modal-remove-question').modal('hide');

        let this_id = $('.js-modal-remove-question').data('id-remove-item'),
            $this_list_item = $('.js-list-couriers').find(`.js-list-courier-item[data-id-courier="${this_id}"]`);

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: "couriers_delete",
                courier_id: this_id
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    $this_list_item.remove();
                    rmCourierFromSelect(this_id);
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

    });
    
    function rmCourierFromSelect(courier_id) {
        let $all_selects_single = $('select.js-select-logistics-single');
        $all_selects_single.each(function (i, el) {
            let select_val = el.selectize.getValue();
            if (select_val == courier_id) {
                el.selectize.clear();
            }
        });
    }

});
