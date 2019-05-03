'use strict';
$(document).ready(function () {

    let $batchtickets_list = $('.js-batchtickets-list'),
        $kitchen_modal = $('.js-kitchen-modal');

        $kitchen_modal.on('show.bs.modal', function (e) {
        let $card = $batchtickets_list.find('.card.active'),
            dishes_amount = $('.js-amount'),
            client_number = parseInt($card.data('count'));
        dishes_amount.text(client_number);
    });

});
