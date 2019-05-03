'use strict';
$(document).ready(function () {

    let $btn_clear = $('.js-btn-clear'),
        $modal_clear_question = $('.js-modal-clear-question');

    $btn_clear.on('click', function (e) {
        let $this_district_id = $(this).closest('.js-tabs-nav-item').data('tab-item-id');
        $modal_clear_question.data('id-district', $this_district_id);
    });

    let $btn_clear_question = $('.js-btn-clear-question');

    $btn_clear_question.on('click', function (e) {

        $modal_clear_question.modal('hide');

        let $this_id = $(this).closest('.js-modal-clear-question').data('id-district'),
            $this_item_district = $('.js-tabs-nav').find(`.js-tabs-nav-item[data-tab-item-id="${$this_id}"]`),
            zone_id = parseInt($this_item_district.data('zone-id')),
            $this_multiple_select = $this_item_district.find('select.js-select-logistics-multiple'),
            $this_select_group = $this_item_district.find('.control-group'),
            $this_select_multiple_p = $this_item_district.find('.js-select-logistics-multiple-p');


        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: 'zone_reset',
                zone_id: zone_id
            },
            beforeSend: function () {
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    clear($this_multiple_select, $this_select_multiple_p, $this_select_group);
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

    let $btn_clear_all = $('.js-btn-clear-all'),
        $modal_clear_all_question = $('.js-modal-clear-all-question');

    $btn_clear_all.on('click', function (e) {

        $modal_clear_all_question.modal('hide');

        let $select = $('select.js-select-logistics'),
            $select_p = $('.js-select-logistics-multiple-p'),
            $select_group = $('.control-group');

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: 'zones_reset_all',
            },
            beforeSend: function () {
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    clear($select, $select_p, $select_group);
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

});

function clear($select, $select_p, $select_group) {
    $select.each(function (i, el) {
        $($select).selectize()[i].selectize.clear();
    });
    $select_p.find('span').text('');
    $select_p.hide();
    $select_group.show();
}