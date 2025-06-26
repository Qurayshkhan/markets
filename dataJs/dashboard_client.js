"use strict";

$(function () {
    // cdp_load(1);
});


//Cargar datos AJAX
function cdp_load(page) {
    console.log("🚀 ~ cdp_load ~ page:", page)

    var parametros = { "page": page };
    $("#loader").fadeIn('slow');
    var user = $('#userid').val();
    $.ajax({
        url: './ajax/dashboard/shipments/load_shipments_ajax.php',
        data: parametros,
        beforeSend: function (objeto) {
        },
        success: function (data) {
            $(".outer_div").html(data).fadeIn('slow');
        }
    });
    $.ajax({
        url: './ajax/dashboard/shipments/load_shipments_ready_to_send_ajax.php',
        data: parametros,
        beforeSend: function (objeto) {
        },
        success: function (data) {
            $(".outer_div").html(data).fadeIn('slow');
        }
    })
}


function loadTabContent(targetId, url, wrapperClass) {
    console.log("🚀 ~ loadTabContent ~ url:", url);
    $("#loader").fadeIn('slow');

    $.ajax({
        url: url,
        data: { page: 1 },
        success: function (data) {
            $(targetId + ' ' + wrapperClass).html(data).fadeIn('slow');
            $("#loader").fadeOut('slow');
        }
    });
}

$(document).ready(function () {
    // Load View All by default
    loadTabContent('#nav-view-all', './ajax/dashboard/shipments/load_shipments_ajax.php', '.outer_div');

    // On tab click
    $('.nav-link').on('click', function () {
        let targetId = $(this).data('target');

        if (targetId === '#nav-ready-to-send') {
            loadTabContent(targetId, './ajax/dashboard/shipments/load_shipments_ready_to_send_ajax.php', '.outer_ready_to_send_div');
        } else if (targetId === '#nav-in-review') {
            loadTabContent(targetId, './ajax/dashboard/shipments/load_shipments_in_review_ajax.php', '.outer_in_review_div');
        } else if (targetId === '#nav-action-required') {
            loadTabContent(targetId, './ajax/dashboard/shipments/load_shipments_action_required_ajax.php', '.outer_action_required_div');
        } else if (targetId === '#nav-view-all') {
            loadTabContent(targetId, './ajax/dashboard/shipments/load_shipments_ajax.php', '.outer_div');
        }
    });
});


