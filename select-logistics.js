'use strict';
$(document).ready(function () {

    let $select_logistics = $('select.js-select-logistics');

    if (!$select_logistics.length) return;

    if ($select_logistics.length) {
        $select_logistics.selectize({
            create: false,
            options: select_log_options,
            placeholder: 'Назначить курьера'
        });
    }

    try{
        setSelectedValueLogistics();
    } catch(err){
        console.log(err);
    }

    let $select_logistics_multiple = $('.js-select-logistics-multiple');
    $select_logistics_multiple.on('change', function (event) {
        let $this = $(this),
            multiple_select_val = event.currentTarget.value,
            card_id = $this.closest('.js-tabs-nav-item').data('tab-item-id'),
            $this_single_selects = $('.js-tabs-content').find(`.js-tabs-content-item[data-tab-item-id='${card_id}']`).find('select.js-select-logistics-single');

        let zone_id = parseInt($this.closest('.js-tabs-nav-item').data('zone-id'));

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: 'zones_add_courier',
                zone_id: zone_id,
                courier_id: multiple_select_val,
            },
            beforeSend: function () {
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    $this_single_selects.each(function (i, el) {
                        $this_single_selects[i].selectize.setValue(multiple_select_val, true);
                    });
                    checkSelectedValues();
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

    let $select_logistics_single = $('select.js-select-logistics-single');
    $select_logistics_single.on('change', function (event) {
        let $this = $(this),
            single_select_val = event.currentTarget.value,
            list_id = $this.closest('.js-tabs-content-item').data('tab-item-id'),
            $this_multiple_select = $('.js-tabs-nav').find(`.js-tabs-nav-item[data-tab-item-id='${list_id}']`).find('select.js-select-logistics-multiple'),
            $all_this_single_selects = $this.closest('.js-tabs-content-item').find('select.js-select-logistics-single'),
            $other_single_selects = $this.closest('.js-tabs-content-item').find('select.js-select-logistics-single').not($this);

        let arr_val_single_selects = [],
            arr_text_single_selects = [],
            arr_other_val_single_selects = [],
            arr_other_text_single_selects = [];

        let res = allForSetValue($all_this_single_selects, arr_val_single_selects, arr_text_single_selects, $other_single_selects, arr_other_text_single_selects, arr_other_val_single_selects),
            arr_single_text = res.arr_single_text,
            allEqual = res.allEqual,
            arr_other_single_text = res.arr_other_single_text;

        let $multiple_select_group = $this_multiple_select.closest('.control-group'),
            $multiple_select_p = $this_multiple_select.closest('.js-select-logistics-multiple-cont').find('.js-select-logistics-multiple-p');

        let client_id = parseInt($this.closest('.js-tabs-content-card').data('client-id'));

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: 'clients_add_courier',
                client_id: client_id,
                courier_id: single_select_val,
            },
            beforeSend: function () {
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    if (allEqual) {
                        $multiple_select_group.show();
                        $multiple_select_p.hide();
                        if (single_select_val != ''){
                            $this_multiple_select[0].selectize.setValue(single_select_val, true);
                        } else {
                            $this_multiple_select[0].selectize.addOption({value: arr_other_val_single_selects, text: arr_other_single_text});
                            $this_multiple_select[0].selectize.addItem(arr_other_val_single_selects, true);
                            $this_multiple_select[0].selectize.setValue(arr_other_val_single_selects, true);
                        }
                    } else {
                        $multiple_select_group.hide();
                        $multiple_select_p.show();
                        $multiple_select_p.find('span').text(arr_single_text.join(', '));
                    }
                    checkSelectedValues();
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


function setSelectedValueLogistics() {
    $.ajax('/src/Ajax.php', {
        'method': 'POST',
        'data': {
            action: 'zones_json'
        },
        success: function (data) {
            window.selected_couriers = JSON.parse(data);
            process();
        }
    });

    function process() {
        selected_couriers.forEach(function (zone, i) {
            let this_zone_id = zone.zone_id,
                $this_zone = $(`.js-zone[data-zone-id="${this_zone_id}"]`),
                $this_select_multiple = $this_zone.find('select.js-select-logistics-multiple');

            if (zone.clients.length) {
                zone.clients.forEach(function (client, i) {
                    let this_client_id = client.id,
                        $this_client = $(`.js-clients[data-client-id="${this_client_id}"]`),
                        $this_select = $this_client.find('select.js-select-logistics-single');

                    if (client.courier_id != 0) {
                        const courier = zone.couriers[Object.keys(zone.couriers).filter(courier => zone.couriers[courier].courier_id === client.courier_id)];

                        $this_select[0].selectize.addOption({value: courier.courier_id, text: courier.courier_name});
                        $this_select[0].selectize.addItem(courier.courier_id, true);
                    }

                });

                let $all_this_single_selects = $(`.js-tabs-content-item[data-tab-item-id="${this_zone_id}"]`).find('select.js-select-logistics-single'),
                    arr_val_single_selects = [],
                    arr_text_single_selects = [];

                let res = allForSetValue($all_this_single_selects, arr_val_single_selects, arr_text_single_selects, null, null, null),
                    arr_single_text = res.arr_single_text,
                    allEqual = res.allEqual;
                let $multiple_select_group = $this_zone.find('.control-group'),
                    $multiple_select_p = $this_zone.find('.js-select-logistics-multiple-p'),
                    single_equal_val = $all_this_single_selects[0].selectize.getValue(),
                    single_equal_text = $all_this_single_selects[0].selectize.getItem(single_equal_val).text();

                if (allEqual) {
                    $multiple_select_group.show();
                    $multiple_select_p.hide();
                    if (arr_val_single_selects != ''){
                        $this_select_multiple[0].selectize.addOption({value: arr_val_single_selects, text: arr_text_single_selects});
                        $this_select_multiple[0].selectize.addItem(arr_val_single_selects, true);
                    }
                } else {
                    $multiple_select_group.hide();
                    $multiple_select_p.show();
                    $this_select_multiple[0].selectize.addOption({value: single_equal_val, text: arr_single_text});
                    $this_select_multiple[0].selectize.addItem(single_equal_val, true);
                    $multiple_select_p.find('span').text(arr_single_text.join(', '));
                }
                checkSelectedValues();
            }

        });
    }
}

function allForSetValue(
    $all_this_single_selects,
    arr_val_single_selects,
    arr_text_single_selects,
    $other_single_selects,
    arr_other_text_single_selects,
    arr_other_val_single_selects
) {
    $all_this_single_selects.each(function (i, el) {
        let $this_val = $all_this_single_selects[i].selectize.getValue(),
            $this_text = $all_this_single_selects[i].selectize.getItem($this_val).text();
        if ($this_val != ''){
            if (!arr_val_single_selects.includes($this_val)){
                arr_val_single_selects.push($this_val);
                arr_text_single_selects.push($this_text);
            }
        }
    });

    if ($other_single_selects) {
        $other_single_selects.each(function (i, el) {
            let $this_val = $other_single_selects[i].selectize.getValue(),
                $this_text = $other_single_selects[i].selectize.getItem($this_val).text();
            if ($this_val != ''){
                if (!arr_other_val_single_selects.includes($this_val)){
                    arr_other_val_single_selects.push($this_val);
                    arr_other_text_single_selects.push($this_text);
                }
            }
        });
    }


    let allEqual = arr_val_single_selects.every( (val, i, arr) => val === arr[0] );

    return {
        arr_single_val: arr_val_single_selects,
        arr_single_text: arr_text_single_selects,
        arr_other_single_val: arr_other_val_single_selects,
        arr_other_single_text: arr_other_text_single_selects,
        allEqual: allEqual
    }
}

function checkSelectedValues() {
    let $all_single_select = $('select.js-select-logistics-single');
    let not_empty_val = [];

    $all_single_select.each(function (i, el) {
        let $this_select_val = $all_single_select[i].selectize.getValue();
        if ($this_select_val != ''){
            not_empty_val.push($this_select_val);
        }
    });

    let $indicator = $('.js-indicator-set');
    $indicator.text(not_empty_val.length);

}