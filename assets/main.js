window.ENV = {};
window.Utils = {

    import: function(src,loaded,error)
    {
        var script = document.createElement("script");
        script.src = src;
        if(loaded)
        {

            script.onload = function (ev) { loaded(null,ev); };
        }
        if(error)
        {

            script.onerror = function (ev) { error(true,ev); };
        }

        document.head.append(script);

    }


};

window.loadApp = function () {
    var waterfall = [
        function(callback) {

            Utils.import("https://unpkg.com/mithril@next/mithril.js",callback,callback);
        },
        function(ev,callback) {
            window.root = document.body;
            callback(null,ev);
        },
    ];
    //Load libs
    libs.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {

            Utils.import(value,callback,callback);
        });
    });

    //Load enviroments
    env.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {

            Utils.import("assets/env/"+value+".js",callback,callback);
        });
    });

    //Load root components
    root_components.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {

            Utils.import("assets/root/components/"+value+"/component.js",callback,callback);
        });
    });

    //Load app components
    app_components.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {

            Utils.import("assets/app/components/"+value+"/component.js",callback,callback);
        });
    });

    //Load root views
    root_views.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {
            Utils.import("assets/root/views/"+value+"/view.js",callback,callback);
        });
    });


    //Load app views
    app_views.forEach(function(value, index) {
        waterfall.push(function (ev,callback) {
            Utils.import("assets/app/views/"+value+"/view.js",callback,callback);
        });
    });

    //Load store
    waterfall.push(function (ev,callback) {
        Utils.import("assets/app/store.js",callback,callback);
    });

    async.waterfall(waterfall, function (err, result) {

        m.route(root, "/", Router)

    });

}

window.Router = {};
window.libs = ["https://unpkg.com/mithril@next/stream/stream.js"];
window.root_views = ['base','components-demo'];
window.root_components = ['base-input','char-input','number-input','base-button','select-input'];


Utils.import("assets/loader.js",function () {
    Utils.import("https://cdnjs.cloudflare.com/ajax/libs/async/3.0.1/async.min.js",loadApp);
});


