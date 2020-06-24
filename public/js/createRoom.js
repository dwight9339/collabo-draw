$(document).ready(() => {
    $("#createRoomButton").click(() => {
        let roomName = $("input").val();
        $.ajax({
            url: "http://localhost:3000/" + roomName, 
            type: "POST",
            success: res => {
                window.location.href = res.redirect;
            }
        });
    });
});