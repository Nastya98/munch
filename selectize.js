'use strict';
$(document).ready(function () {

    //selectize
    let $select_batchticket = $('select.js-select-batchticket');
    if ($select_batchticket.length) {
        let $select = $select_batchticket.selectize({
            create: false,
            valueField: 'id',
            labelField: 'title',
            searchField: 'title',
            options: selectize_options,
            sortField: {
                field: 'text',
                direction: 'asc'
            },
            placeholder: 'Выберите техкарту...',
            onItemRemove: function(value) {
                let this_select_value = parseInt(this.$control.closest('.js-form-selectize').data('value')),
                    this_day = parseInt(this.$control.closest('.js-day').data('day')),
                    $months = this.$control.closest('.js-calendars'),
                    months_id = $months.hasClass('current active-current') ? 1 : 2;
                    removeSelectItem(value, this_day, this_select_value, months_id);
            }
        });
        setSelectedValue();
    }

    $select_batchticket.on('change', function (event) {
        let select = event.currentTarget,
            select_value = select.value;

        if (select_value == '') return;

        let $this = $(this),
            batchticket_id = select.selectize.getValue(),
            $months = $this.closest('.js-calendars'),
            months_id = $months.hasClass('current active-current') ? 1 : 2,
            day_num = $this.closest('.js-day').data('day'),
            $select = $(select).selectize(),
            selectize = $select[0].selectize,
            $program_type = $('.js-dropdown-item.active'),
            program_type = $program_type.text();

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: 'update_calendar',
                batchticket_id: batchticket_id,
                months_id: months_id,
                day_num: day_num,
                select_value: select_value,
                program_type: program_type
            },
            beforeSend: function () {
                selectize.disable();
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.result){
                    let $this_item_with_data = $select.closest('.js-form-selectize');
                    $this_item_with_data.data('value', res.id);
                    selectize.enable();
                } else {
                    selectize.clear();
                }
                selectize.enable();
            }
        });
    });
});
function checkExistThisDay(this_day, batchtickets_array) {
    let i = batchtickets_array.length;
    while(i--){
        if(batchtickets_array[i].day_num == this_day){
            return true;
        }
    }
    return false;
}

function removeSelectItem(value, this_day, this_select_value, months_id) {
    let day_exists;

    if (months_id == 1) day_exists = checkExistThisDay(this_day, current_m_batchtickets);
    else day_exists = checkExistThisDay(this_day, next_m_batchtickets);

    let id = '';
    if (day_exists) {
        id = value;
    } else {
        id = this_select_value;
    }

    $.ajax({
        type: 'POST',
        url: '/src/Ajax.php',
        data: {
            action: 'remove_from_calendar',
            id: id
        }
    });
}


function setSelectedValue() {

    let cur_batchtickets_array = current_m_batchtickets,
        next_batchtickets_array = next_m_batchtickets;

    let $month = $('.js-calendars'),
        $days = '';
    $month.each(function () {
        let $cur_month = $(this);
        if ($(this).hasClass('current active-current')) {

            $days = $cur_month.find('.js-day');
            $days.each(function () {
                setOptions(cur_batchtickets_array, $(this), $cur_month);
            });
        }
        else {
            $days = $cur_month.find('.js-day');
            $days.each(function () {
                setOptions(next_batchtickets_array, $(this), $cur_month);
            });
        }

    });
}

function setOptions(batchtickets_array, $this_day, $cur_month) {
    let day_index = $this_day.index() + 1,
        batchtickets_this_day = [];

    batchtickets_array.forEach(function (item) {
        let day_num_to_int = parseInt(item.day_num),
            $cur_day = '';
        if (day_num_to_int === day_index) {
            batchtickets_this_day.push(item.id);
            $cur_day = $cur_month.find('.js-day').eq(day_num_to_int - 1);
            if ($cur_day != undefined) {
                $cur_day.find('select.js-select-batchticket')[0].selectize.addOption({id: item.id, title: item.batchticket_title});
                $cur_day.find('select.js-select-batchticket')[0].selectize.addItem(item.id, true);
            }
        }

    });
}