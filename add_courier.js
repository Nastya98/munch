'use strict';
$(document).ready(function () {

    let $add_form = $('.js-form-add-courier'),
        $add_modal = $('.js-modal-add-courier'),
        $list_modal = $('.js-modal-list-couriers');

    $add_form.on('submit', function (e) {

        if (!e.isDefaultPrevented()) {
            let new_courier = {},
                name_courier = $add_form.find('input[name="name-input"]').val(),
                phone_courier = $add_form.find('input[name="phone-input"]').val(),
                email_courier = $add_form.find('input[name="email-input"]').val();

            new_courier = {
                name: name_courier,
                phone: phone_courier,
                email: email_courier
            };

            $add_modal.modal('hide');
            $add_form[0].reset();
            $list_modal.modal('show');


            let $list = $('.js-list-couriers'),
                id_courier = $list.children().length + 1,
                $list_item = `
                    <li class="list-group-item d-flex justify-content-between js-list-courier-item" data-id-courier="${id_courier}">
                        <div class="list-group-item__left">
                            <h3 class="u-title is-small js-editable-name">${new_courier.name}</h3>
                            <p class="u-text is-big is-gray-dark"><strong>Почта: <span class="is-highlighted-black js-editable-email">${new_courier.email}</span></strong></p>
                            <p class="u-text is-big is-gray-dark"><strong>Телефон: <span class="is-highlighted-black js-editable-phone">${new_courier.phone}</span></strong></p>
                        </div>
                        <div class="list-group-item__right">
                            <span class="c-icon-edit js-edit-btn">${svg_edit}</span>
                            <span class="c-icon-trash js-remove-btn js-remove-question-btn" data-toggle="modal" data-target=".js-modal-remove-question">${svg_trash}</span>
                        </div>
                    </li>
                `;

            $.ajax({
                type: 'POST',
                url: '/src/Ajax.php',
                data: {
                    action: 'couriers_create',
                    courier_name: name_courier,
                    courier_phone: phone_courier,
                    courier_e_mail: email_courier
                },
                success: function (results) {
                    let res = jQuery.parseJSON(results);
                    if (res.status){
                        $list.append($list_item);
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

            return false;
        }
    })

});
