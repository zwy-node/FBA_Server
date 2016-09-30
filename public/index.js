/**
 * Created by Kevin on 7/9/2016.
 */

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}


$(document).ready(function(){
    var pathName = window.location.pathname.split("/")[1];
    var menuNavItems = $('#menuNav .item');
    if (pathName == ''){
        for(var i = 0; i < 6; i++){
            if(i == 0){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }else if(pathName == 'user'){
        for(var i = 0; i < 6; i++){
            if(i == 1){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }else if(pathName == 'customer'){
        for(var i = 0; i < 6; i++){
            if(i == 2){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }else if(pathName == 'order'){
        for(var i = 0; i < 6; i++){
            if(i == 3){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }else if(pathName == 'config'){
        for(var i = 0; i < 6; i++){
            if(i == 4){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }else{
        for(var i = 0; i < 6; i++){
            if(i == 5){
                $(menuNavItems[i]).addClass('active');
            }else{
                $(menuNavItems[i]).removeClass('active');
            }
        }
    }

    $(document).ready(function(){
        $('#typeDropdown').dropdown({
            onChange: function(value, text, $selectedItem) {
                $('#txtStatus').val(value);
                $('#queryForm').submit();
            }
        });
    });
});

function goToPage(page){
    var string = window.location.search.slice(1);
    if (!string || string.length == 0){
        window.location = '?page=' + page;
        return;
    }
    var parts = string.split('&');  //?后内容

    var newParams = [];
    var bFoundPage = false;
    parts.forEach(function (part) {
        var pair = part.split('=');
        pair[0] = decodeURIComponent(pair[0]);
        pair[1] = decodeURIComponent(pair[1]);
        if (pair[0] == 'page'){
            pair[1] = page;
            bFoundPage = true;
        }
        newParams.push(pair[0] + '=' + pair[1]);
    });
    if (!bFoundPage){
        newParams.push('page=' + page);
    }
    if (newParams.length > 0){
        window.location = '?' + newParams.join('&');
    }else {
        window.location = '?page=' + page;
    }
}

function previous(page){
    if (page <= 1)
        return;
    goToPage(page - 1);
}

function next(page, pageCount){
    if (page >= pageCount)
        return;
    goToPage(page + 1);
}

var getParams = function(){
    var params = {};
    var string = window.location.search.slice(1);
    if (!string || string.length == 0){
        window.location = '?page=' + page;
        return params;
    }
    var parts = string.split('&');
    parts.forEach(function (part) {
        var pair = part.split('=');
        pair[0] = decodeURIComponent(pair[0]);
        pair[1] = decodeURIComponent(pair[1]);
        params[pair[0]] = pair[1];
    });
    return params;
}


var format = function(){
    return '';
}