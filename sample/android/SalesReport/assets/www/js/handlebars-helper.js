Handlebars.registerHelper('showSyncStatus', function(status) {
    if (status === "0" || status === "2") {
        return new Handlebars.SafeString(
            '<span class="icon" id="loader">0</span><script type="text/javascript">var loaderSymbols = ["0", "1", "2", "3", "4", "5", "6", "7"], loaderRate = 100, loaderIndex = 0, loader= function() { document.getElementById("loader").innerHTML = loaderSymbols[loaderIndex]; loaderIndex = loaderIndex  < loaderSymbols.length - 1 ? loaderIndex + 1 : 0; setTimeout(loader, loaderRate); }; loader(); </script>');
    } else if (status === "1") {
        return new Handlebars.SafeString(
            '<span class="icon" style="color: #0d0;">.</span>');
    }
});

Handlebars.registerHelper('picturePaging', function(param) {
    var html = '<h5 class="muted">';
    var page = Number(param.page);
    var pageCount = Number(param.pageCount);
    var reportId = param.reportId;

    // previous page
    if (page === 0) {
        html = html + '<span class="label label-info back"><a href="#back">戻る</a></span>';
    } else {
        html = html + '<span class="label label-info back"><a href="#back">前の写真</a></span>';
    }
    // title
    html = html + '写真をみる';

    // next page (if exists next picture)
    if (page !== pageCount - 1) {
        html = html + '<span class="label label-info next"><a href="#report/' + reportId + '';
        html = html + '/picture/' + (page + 1) +'">次の写真</a></span>';
    }
    html = html + '</h5>';
    return new Handlebars.SafeString(html);
});

