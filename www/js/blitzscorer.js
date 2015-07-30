var blitzscorer = function () {


    var isFirefoxosDesktop = function () {

        var ua = window.navigator.userAgent.toLowerCase();
        var platformId = '';
        if (window.cordova !== undefined) {
            platformId = window.cordova.platformId || '';
        }
        if (platformId == 'firefoxos') {
            var isDevice = (ua.indexOf('(mobile;') > 0 || ua.indexOf('(tablet;') > 0) && ua.indexOf('; rv:') > 0;
            return !isDevice;
        }
        return false;

    };

    var blitzConfirm = function (message, callback, title, buttonLabels) {

        if (isFirefoxosDesktop()) {
            // Workaround for an Annoying bug where firefoxos dialog plugin doesn't work as a desktop os
            if (window.confirm(message) == true) {
                callback(1);
            }
            else {
                callback(0);
            }
        }
        else if (window.navigator !== undefined && window.navigator.notification !== undefined) {
            navigator.notification.confirm(message, callback, title, buttonLabels);
        }
        else {
            callback(1);
        }

    };

    var blitzPrompt = function (message, callback, title, buttonLabels, defaultText) {

        if (isFirefoxosDesktop()) {
            // Workaround for an Annoying bug where firefoxos dialog plugin doesn't work as a desktop os
            var result = window.prompt(message, defaultText);
            callback({
                buttonIndex: result === null ? 0 : 1,
                input1: result || ''
            });
        }
        else {
            navigator.notification.prompt(message, callback, title, buttonLabels, defaultText);
        }

    };

    $('button[data-action="next-round"]').click(function() {

        nextRound();
        return false;

    });

    $('button[data-action="change-score"]').click(function() {

        var $td = $("#rounds td.selected").first();
        if ($td.length > 0) {
            var oldVal = parseInt($td.text());
            var newVal = oldVal + parseInt($(this).data('value'));
            $td.text(newVal);
        }
        updateTotals();
        return false;

    });
    var newGame = function() {

        var onConfirm = function (buttonIndex) {
            if (buttonIndex == 1) {
                $("#rounds").html("");
                nextRound();
            }
        }

        //navigator.notification.confirm(
        blitzConfirm(
            'All scores will be deleted.  Continue?',  // message
            onConfirm,                  // callback to invoke
            'Reset Scoreboard',            // title
            ['Yes', 'Cancel']             // buttonLabels
        );

        return false;

    };


    $('a[data-action="new-game"]').click(function() {

        newGame();
        return false;

    });


    $('a[data-action="change-player-count"]').click(function() {

        $('#playercount li').removeClass('active');
        $(this).parent('li').addClass('active').parents('.open').removeClass('open');
        updateTotals();
        save();
        return false;

    });

    $('a[data-action="reset-player-names"]').click(function() {

        var onConfirm = function (buttonIndex) {
            if (buttonIndex == 1) {
                set_player_names([]);
                save();
                updateTotals();
            }
        }

        $(this).parents('li').parents('.btn-group').removeClass('open');

        //navigator.notification.confirm(
        blitzConfirm(
            'Names will be reset to Player 1, Player 2, etc.  Continue?',  // message
            onConfirm,                  // callback to invoke
            'Reset Player Names?',            // title
            ['Yes', 'Cancel']             // buttonLabels
        );

        return false;

    });

    function getPlayerCount() {
        return ($("#players-dropdown .active").index() + 1) || 4;
    }

    $('#rounds').on('click', 'td.delete', function() {

        var $this = $(this).find('button');
        if ($this.hasClass('btn-danger')) {

            var $tr = $this.parents('tr');
            $tr.fadeOut('fast', function() {

                $tr.remove();
                updateTotals();

                if ($('#rounds tr').length == 0) {
                    nextRound();
                }
                $("#rounds tr").removeClass('warning');
                $("#rounds tr").last().addClass('warning');
                save();

            });

        }
        else {

            $this.addClass('btn-danger').removeClass('btn-link');

            var $msg = $('<span class="label label-danger delete-confirm-msg" style="position: absolute; top: -16px; right: 0px;">Tap again to delete</span>');

            $this.parent().append($msg);

            setTimeout(function() {
                $msg.fadeOut('fast', function() {
                    $('.delete-confirm-msg').remove();
                });
                $this.removeClass('btn-danger').addClass('btn-link');

            }, 3000);

        }
        return false;

    });

    $('#rounds').on('click', 'td.score', function() {

        var $this = $(this);
        $("#scoresheet").find('tr,th,td').removeClass('selected').removeClass('warning');
        $this.addClass('selected');
        $this.parents('tr').addClass('warning');

        var col = $this.index() + 1;
        $("#scoresheet tr td:nth-child(" + col + ")").addClass('warning');
        $("#scoresheet tr th:nth-child(" + col + ")").addClass('warning');

        save();
        return false;

    });

    $('#players th.player').click(function() {

        var $this = $(this),
            playerNo = $this.index();

        var onPrompt = function (r) {
            if (r.buttonIndex == 1) {
                $this.find('span').text(r.input1 || "Player " + playerNo);
                save();
            }
            updateTotals();
        }


        //navigator.notification.prompt(
        blitzPrompt(
            'Enter new name for Player ' + playerNo,  // message
            onPrompt,                  // callback to invoke
            'Player ' + playerNo,            // title
            ['OK', 'Cancel'],             // buttonLabels
            $this.find('span').text()
        );

        return false;

    });

    function nextRound() {
        var i = $("#rounds tr").length + 1;

        var $tr = $('<tr>');

        $tr.append( $('<th class="round"></th>').text(i) );
        for( var p=0 ; p < 8 ; p++) {
            $tr.append('<td class="score">0</td>');
        }
        $tr.append( $('<td class="delete"><div><button data-action="delete-round" class="btn btn-xs btn-link"><span class="glyphicon glyphicon-trash"></span></button></div></td>') );

        $("#rounds").append($tr);

        $tr.find('.score').first().click();

        updateTotals();

    }

    function updateTotals() {

        var playerCount = getPlayerCount();

        for( var p=2 ; p < 10 ; p++) {
            var $scores = $("#rounds tr td.score:nth-child(" + p + ")");
            var runningTotal = 0;
            $scores.each(function() {
                runningTotal += parseInt($(this).text());
            });
            $('#totals .total:nth-child(' + p + ')').text(runningTotal);

            //$("#scoresheet tr").find('th,td').eq(p - 1).toggleClass('hide', p - 1 > playerCount);
            var col = p - 0;
            $("#scoresheet tr td:nth-child(" + col + ")").toggleClass('hide', col - 1 > playerCount);
            $("#scoresheet tr th:nth-child(" + col + ")").toggleClass('hide', col - 1 > playerCount);

        }

        var i = 0;
        $("#rounds tr").each(function() {
            i += 1;
            var $tr = $(this);
            $tr.find('.round').text(i);

        });

        $('#players th.rotate').css('height', (getMaxPlayerNameHeight() + 50) + 'px');

        save();
    }

    function getMaxPlayerNameHeight() {

        var m = 70;
        $('#players th.player:not(.hide) span').each(function() {
            m = Math.max(m, $(this).width());
        });
        return Math.min(120, m);
    }
    function getPlayerNames() {
        var names = Array();
        $('#players th.player span').each(function() {
            names.push($(this).text());
        });
        return names;
    }

    function set_player_names(names) {
        names = names || Array();
        for (var i=0 ; i<8 ; i++) {
            var name = 'Player ' + (i+1);
            if (i < names.length) {
                name = names[i] || name;
            }
            $('#players th.player').eq(i).find('span').text(name);
        }
    }

    function save() {

        var $rounds = $("#rounds");
        $rounds.find('.delete button').removeClass('btn-danger');
        $rounds.find('.delete-confirm-msg').remove();
        storageBackend.setItem("rounds", $rounds.html());
        storageBackend.setItem("playercount", getPlayerCount());
        storageBackend.setItem("playernames", JSON.stringify(getPlayerNames()));

    }

    function load() {
        storageBackend.getItem(["playernames", "rounds", "playercount"], function(data) {

            console.log('Load:', data);

            var names = JSON.parse(data["playernames"] || "[]");
            set_player_names(names);

            var rows = data["rounds"];

            if (rows == null || rows == 'undefined' || rows == undefined) {
                $("#rounds").html("");
                nextRound();
            }
            else {
                $("#rounds").html(rows);
            }

            var playerCount = data["playercount"];

            $('a[data-action="change-player-count"][data-value="' + playerCount + '"]').click();

            updateTotals();

            $('#rounds td.score.selected').click();

        });


    }

    load();

    return {
        newGame: newGame/*,
        setNumberOfPlayers: setNumberOfPlayers*/
    };

}(jQuery);