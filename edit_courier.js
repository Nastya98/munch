'use strict';
$(document).ready(function () {

    $('.js-list-couriers').on('click', '.js-edit-btn', function(e){

        let $this_btn = $(this),
            $this_list_item = $this_btn.closest('.js-list-courier-item'),
            $this_editable_name = $this_list_item.find('.js-editable-name'),
            $this_editable_email = $this_list_item.find('.js-editable-email'),
            $this_editable_phone = $this_list_item.find('.js-editable-phone'),
            this_list_item_id = $this_list_item.data('id-courier');

        let $edit_modal = $('.js-modal-edit-courier'),
            $list_modal = $('.js-modal-list-couriers'),
            $edit_modal_name = $edit_modal.find('input[name="name-input"]'),
            $edit_modal_phone = $edit_modal.find('input[name="phone-input"]'),
            $edit_modal_email = $edit_modal.find('input[name="email-input"]'),
            $form_id_courier = $edit_modal.find('.js-form-edit-courier');

        $list_modal.modal('hide');
        $edit_modal.modal('show');

        $form_id_courier.data('id-courier', this_list_item_id);

        $edit_modal_name.val($this_editable_name.text());
        $edit_modal_phone.val($this_editable_phone.text());
        $edit_modal_email.val($this_editable_email.text());

    });

    let $apply_edit_form = $('.js-form-edit-courier');

    $apply_edit_form.on('submit', function (e) {

        e.preventDefault();

        let $this = $(this),
            edit_form_name = $this.find('input[name="name-input"]').val(),
            $edit_form_phone = $this.find('input[name="phone-input"]').val(),
            $edit_from_email = $this.find('input[name="email-input"]').val();

        let $list_modal = $('.js-modal-list-couriers'),
            $edit_modal = $('.js-modal-edit-courier');

        let form_id = $this.data('id-courier'),
            $this_editable_item = $list_modal.find(`.js-list-courier-item[data-id-courier="${form_id}"]`),
            courier_id = parseInt($this_editable_item.data('id-courier')),
            $this_editable_name = $this_editable_item.find('.js-editable-name'),
            $this_editable_email = $this_editable_item.find('.js-editable-email'),
            $this_editable_phone = $this_editable_item.find('.js-editable-phone');

        $.ajax({
            type: 'POST',
            url: '/src/Ajax.php',
            data: {
                action: "couriers_edit",
                courier_id: courier_id,
                courier_name: edit_form_name,
                courier_phone: $edit_form_phone,
                courier_e_mail: $edit_from_email
            },
            success: function (results) {
                let res = jQuery.parseJSON(results);
                if (res.status){
                    $this_editable_name.text(edit_form_name);
                    $this_editable_email.text($edit_from_email);
                    $this_editable_phone.text($edit_form_phone);

                    $edit_modal.modal('hide');
                    $list_modal.modal('show');
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
