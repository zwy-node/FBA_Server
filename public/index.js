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
    var pathName = window.location.pathname;
    var menuNavItems = $('#menuNav .item');
    if (pathName.startsWith('/admin/contents')){
        $(menuNavItems[0]).addClass('active');
        $(menuNavItems[1]).removeClass('active');
        $(menuNavItems[2]).removeClass('active');
    }else if (pathName.startsWith('/admin/operations')){
        $(menuNavItems[1]).addClass('active');
        $(menuNavItems[0]).removeClass('active');
        $(menuNavItems[2]).removeClass('active');
    }else if (pathName.startsWith('/admin/datas')){
        $(menuNavItems[2]).addClass('active');
        $(menuNavItems[0]).removeClass('active');
        $(menuNavItems[1]).removeClass('active');
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