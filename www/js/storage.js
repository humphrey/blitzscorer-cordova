window.storageBackend = function () {

    function isChrome() {
        return window.chrome !== undefined
            && window.chrome.storage !== undefined
            && window.chrome.storage.local !== undefined;
    }

    return {
        getItem: function (keys, callback) {

            if (isChrome()) {

                //window.chrome.storage.local.get(keys, function(data) {
                //    callback(data.key);
                //});
                console.log(keys);
                //window.chrome.storage.local.get(['hello'], function (d) {console.log(d)})
                window.chrome.storage.local.get(keys, callback);


            }
            else if (document.localStorage !== undefined) {

                //return callback(document.localStorage.getItem(key));
                var result = {};
                for (var i=0; i<keys.length; i++) {
                    result[keys[i]] = document.localStorage.getItem(keys[i]);
                }
                callback(result);

            }
        },
        setItem: function (key, value) {

            if (isChrome()) {

                console.log('setting:', key, value.toString());
                window.chrome.storage.local.set({key: value.toString()});

                //window.chrome.storage.sync.set({key: value});
                //window.chrome.storage.sync.get(key, function (d) {
                //    console.log('hello:', key, d[key]);
                //});

            }
            else if (document.localStorage !== undefined) {

                document.localStorage.setItem(key, value);

            }
        }
    };

}();