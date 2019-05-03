$(document).ready(function () {

    let url = window.location.pathname;

    if (url != '' && url != '/'){

        let regex = /\/([a-z-])+\//i,
            match = url.match(regex)[0],
            link_href = $('a.js-menu-item[href="'+ match +'"]');

        link_href.closest('.nav-item').addClass('active');

    } else {

        $('a.js-menu-item').closest('.nav-item').eq(0).addClass('active');

    }

});