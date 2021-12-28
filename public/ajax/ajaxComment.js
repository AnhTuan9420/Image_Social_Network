$(document).ready(() =>{
    $('#ajaxComment').on('submit', e => {
        e.preventDefault();

        var formData = $('#ajaxComment').serializeArray();
        var data = {};

        $.each(formData, function (i, v) {
            data['' + v.name + ''] = v.value;
        });
        doComment(data); 
    });

    function doComment(data) {
        $.ajax({
            url: '/user/doComment',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
        }).done(function (res) {
            ajaxGet();
        }).fail(function (res) {
            console.log("Fail")
        })
    }

    var blogId = $('#blogId').val();
    function ajaxGet() {
        $.ajax({
            url: `/api/users/getBlogData/${blogId}`,
            method: 'get',
            dataType: 'json',
        }).done(function (res) {
            arrayComment(res.Comment_id);         
        });
    }

    function arrayComment(data) {
        var res = '';
        if (data.length > 0) {
            data.forEach(el => (res += getData(el)));
        }
        $('#listComment').html(res);
    }

    var sessionId = $('#sessionCom').val();


    function getData(comment) {
        var html = '';
        // console.log(comment.author.account_id._id)
        // console.log(comment)
        html+='<li class="comment"> ';
        html+='<div class="vcard">';
        html+='  <img src="/uploads/'+comment.author.Avatar+'" alt="Avartar">';
        html+='</div>';
        html+='<div class="comment-body">';
        html+='<div class="post-info">';
        html+='<h3 class="name">'+comment.author.name+'';
        if  (comment.author.account_id._id == sessionId) {
        html+='<div class="deletes" style="float: right;">';
        html+='<form action="/user/deleteComment" method="POST" enctype="application/x-www-form-urlencoded">';
        html+='<input type="hidden" name="_id" value="'+comment._id+'">';
        html+='<input type="hidden" name="_method" value="DELETE">';
        html+='<button type="submit" style="border: 0;color: #8e6f6f; background-color: white;margin-top: 20px;">';
        html+='<i class="fas fa-trash" style="font-size:17px; margin-right: 25px;">Delete</i>';
        html+='</button>';
        html+='</form>';
        html+='</div>';   
        }
        html+='</h3>';
        html+='<span class="meta">'+comment.timeCreated+'</span>';
        html+='</div>';
        html+='<p>';
        html+=''+comment.content+'';
        html+='</p>';
        html+='</li>';
        return html;
    }

})