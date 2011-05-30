(function($, window) {

window.application.call(this);

var visitor = window.visitor,
    slideshow = window.slideshow,
    searching = false,
    data = window.data,
    dataSource = data.dataSource({
        pageSize: 5,
        serverSorting: true,
        dialect: {
            read: function(data) {
                var params = {
                    text: $("#searchBox").val(),
                    extras: EXTRAS,
                    per_page: PAGESIZE
                };

                if (!$.support.cors) {
                    params.jsoncallback = "searchPhotos";
                }

                return flickr.searchParams(params);
            }
        },
        deserializer: searchDeserializer,
        jsoncallback: "searchPhotos"
    }),
    mostPopularDataSource = data.dataSource({
        dialect: {
            read: function(data) {
                var params = {
                    extras: EXTRAS,
                    per_page: 100,
                };

                if (!$.support.cors) {
                    params.jsoncallback = "mostPopularPhotos";
                }

                return flickr.mostPopularParams(params);
            }
        },
        deserializer: searchDeserializer,
        jsoncallback: "mostPopularPhotos"
    });

   function showSelectedPhoto(ui) {
       $("#flatSearchPhotos").show();

       ui.element.parent().hide();
       $("#overlay").fadeOut();

       setBigPhoto(ui.selectable.value().find("img"));

       dataSource.query({page: 1, pageSize: PAGESIZE});
       $("#viewslideshow, #uploadphotos").fadeIn();

       $("#backButton").text("Back to search results").data("currentView", "flatMostPopularPhotos");
   }

    function updatePlayIcon(playing) {
        return $("#viewslideshow").find(".p-icon")
                .toggleClass("i-pause", playing)
                .toggleClass("i-slideshow", !playing)
                .end()
                .find("em")
                .html(playing ? 'Pause' : 'Play').end();
    }

   window.visitor = {
        hideExif: function() {
            var exifWindow = $("#exifWindow");
            if (exifWindow.length) {
                exifWindow.data("kendoWindow").close();
            }
        },
        mostPopular: function() {
            this.thumbList.append( $("#flatMostPopularPhotos").kendoListView({
                dataSource: mostPopularDataSource,
                template: template(IMAGESIZES[0]),
                dataBound: function() {
                    var li = this.element.find("li").filter(":first");
                    this.selectable.value(li);
                    displayImages(this.element);
                },
                change: function() {
                    setBigPhoto(this.selected().find("img"));
                }
            }));
        },
        search: function(el) {
            if ($("#searchBox").val() && !searching) {
                $("#overlay").after("<div id='searchLoading' class='loading'>Loading ...</div>");
                searching = true;
                dataSource.query({page: 1, pageSize: $("#mainTemplate").find("#grid").hasClass("currentView") ? 5 : 20});
                $("#flatMostPopularPhotos").hide();
                $("#flatSearchPhotos").hide();
                $("#overlay").fadeIn();
                $("#exifButton").fadeOut();
                slideshow.init($("#flatSearchPhotos").data("kendoListView"));
                updatePlayIcon(slideshow._started)
                    .add("#uploadphotos").fadeOut()
            }
        },

        initMainPictures: function () {
            var that = this;

            that._isSliderInit = false;

            $(".paging").kendoPager({ dataSource: dataSource });

            $("#flatSearchPhotos").kendoListView({
                autoBind: false,
                dataSource: dataSource,
                template: template(IMAGESIZES[0]),
                dataBound: function() {
                    displayImages(this.element);
                    var id = $("#bigPhoto").attr("data-photoid");
                    var images = this.element.find("img[data-photoid*='" + id + "']");
                    if (images.length)
                        images.parent().addClass("t-state-selected");
                },
                change: function() {
                    setBigPhoto(this.selected().find("img"));
                }
            });
            $("#mainPhotoGrid").kendoGrid({
                autoBind: false,
                dataSource: dataSource,
                pageable: $(".paging").data("kendoPager"),
                selectable: true,
                columns: [
                    { template: '<img data-photoid="<%= id %>" alt="<%= kendo.htmlEncode(title) %>" src="http://farm<%=farm%>.static.flickr.com/<%=server%>/<%=id%>_<%=secret%>_s.jpg">', title: "PHOTO" },
                    { field: "ownername", title: "AUTHOR" },
                    { field: "title", title: "TITLE" },
                    { field: "tags", title: "TAGS"}
                ],
                change: function() {
                    showSelectedPhoto(this);
                },
                dataBound: function() {
                    displayImages(this.element);
                }
            }).hide();

            $("#mainPhotoStrip").kendoListView({
                autoBind: false,
                dataSource: dataSource,
                template: template(imageSize),
                dataBound: function() {
                    if (searching){
                        $("#mainTemplate").show();
                        searching = false;
                    }
                    if (!that._isSliderInit) {
                        that._isSliderInit = true;
                        that.initSlider();
                    }

                    $("#backButton").text("Back to most popular").data("currentView", "mainTemplate");
                    displayImages(this.element);
                    $("#searchLoading").remove();
                },
                change: function() {
                    showSelectedPhoto(this);
                }
            });


            $(".i-gridview").click(function() {
                dataSource.query({page: 1, pageSize: 5});
                $(this).addClass("currentView");
                $(".i-tileview").removeClass("currentView");
                $("#mainPhotoStrip").hide();
                $("#slider").parent().hide();
                $("#mainPhotoGrid").show();
                $("#overlay").fadeIn();
                $("#exifButton").fadeOut();
            });

            $(".i-tileview").click(function() {
                var value = $("#slider").data("kendoSlider").value(),
                    pageSize = value === 0 ? 20 : parseInt(20 / value);

                dataSource.query({page: 1, pageSize: pageSize});

                $(this).addClass("currentView");
                $(".i-gridview").removeClass("currentView");
                $("#mainPhotoGrid").hide();
                $("#mainPhotoStrip").show();
                $("#slider").parent().show();
                $("#overlay").stop(true, true).fadeIn();
                $("#exifButton").stop(true, true).fadeOut();
            });

            $(".bottomLink").bind("click", function(e){
                e.preventDefault();
                var element = $(this),
                    view = element.data("currentView");

                if (view === "flatMostPopularPhotos") {
                    element.data("currentView", "mainTemplate");
                    $("#flatSearchPhotos").hide();
                    $("#mainTemplate").show();
                    $("#flatMostPopularPhotos").hide();
                    $(".i-tileview").click();
                    $("#viewslideshow, #uploadphotos").stop(true, true).fadeOut();
                    element.text("Back to most popular");
                    slideshow.init($("#flatSearchPhotos").data("kendoListView"));
                } else if (view === "mainTemplate"){
                    element.data("currentView", "flatMostPopularPhotos");
                    $("#flatSearchPhotos").hide();
                    $("#mainTemplate").hide();
                    $("#overlay").stop(true, true).fadeOut();
                    $("#exifButton").stop(true, true).fadeIn();
                    $("#flatMostPopularPhotos").show();
                    $("#viewslideshow, #uploadphotos").stop(true, true).fadeIn();
                    element.text("Back to search results");
                    slideshow.init($("#flatMostPopularPhotos").data("kendoListView"));
                }

                updatePlayIcon(slideshow._started)
                    .add("#uploadphotos").stop(true, true).fadeIn();
            });

            that.thumbList.append($("#flatSearchPhotos"));
        },
        initSlider: function() {
            $("#slider").kendoSlider({
                orientation: "vertical",
                min: 0,
                max: 2,
                largeStep: 1,
                tickPlacement: "none",
                change: function() {
                    var value = this.value();
                    imageSize = IMAGESIZES[value];
                    var t = template(imageSize),
                        pageSize = value === 0 ? 20 : parseInt(20 / value);
                    $("#mainPhotoStrip").data("kendoListView").template = kendo.template(t);
                    dataSource.query({page: 1, pageSize: pageSize});
                }
            });
        },
        initVisitor: function() {
            var that = this;

            $(".i-search").click(function(e) { e.preventDefault(); that.search(); });
            $("#searchBox").bind("keydown", function(e) {
                if (e.keyCode === kendo.keys.ENTER) {
                    this.blur();
                    $(".i-search").click();
                }
            });

            that.thumbList = new kendo.ui.Scroller($('<div class="thumb-list">').appendTo("#footer")).scrollElement;

            that.mostPopular();
            that.initMainPictures();

            $("#backButton").text("");

            slideshow.init($("#flatMostPopularPhotos").data("kendoListView"));

            $("#viewslideshow").click(function(e) {
                e.preventDefault();
                if($(this).hasClass("i-state-disabled")) {
                    return;
                }
                var started = slideshow._started;
                if (!started && !$("#footer .thumbs:visible")[0]) {
                    return;
                }

                if (started){
                    setBigPhoto($(".thumbs:visible").find(".t-state-selected:last img"));
                } else {
                    $("#exifButton").fadeOut();
                    setTimeout(function(){
                        hideExif();
                    }, 300);
                }

                slideshow.toggle();
                updatePlayIcon(slideshow._started);
            });
        }
   };
})(jQuery, window);
