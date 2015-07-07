var blitzscorer = function () {


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
    $('button[data-action="new-game"]').click(function() {

        var onConfirm = function (buttonIndex) {
            if (buttonIndex == 1) {
                $("#rounds").html("");
                nextRound();
            }
        }

        navigator.notification.confirm(
            'All scores will be deleted.  Continue?',  // message
            onConfirm,                  // callback to invoke
            'Reset Scoreboard',            // title
            ['Yes', 'Cancel']             // buttonLabels
        );

        return false;

    });

    $('a[data-action="change-player-count"]').click(function() {

        $('#playercount li').removeClass('active');
        $(this).parents('li').addClass('active').parents('.btn-group').removeClass('open');
        updateTotals();
        save();
        return false;

    });

    function getPlayerCount() {
        return $("#players .active").index() + 1;
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

            var $msg = $('<span class="label label-danger delete-confirm-msg" style="position: absolute; top: -9px; right: 4px;">Tap again to delete</span>');

            $this.parents('td').append($msg);

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

    function nextRound() {
        var i = $("#rounds tr").length + 1;
        //console.log(i);

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
            //console.log(p);
            var $scores = $("#rounds tr td.score:nth-child(" + p + ")");
            var runningTotal = 0;
            $scores.each(function() {
                //console.log($(this), $(this).text());
                runningTotal += parseInt($(this).text());
            });
            $('#totals .total:nth-child(' + p + ')').text(runningTotal);
            //console.log(runningTotal);

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
        save();
    }

    function save() {

        var $rounds = $("#rounds");
        $rounds.find('.delete button').removeClass('btn-danger');
        $rounds.find('.delete-confirm-msg').remove();
        localStorage.setItem("rounds", $rounds.html());
        localStorage.setItem("playercount", getPlayerCount());
    }

    function load() {

        var rows = localStorage.getItem("rounds");

        if (rows == null || rows == 'undefined' || rows == undefined) {
            $("#rounds").html("");
            nextRound();
        }
        else {
            $("#rounds").html(rows);
        }

        var playerCount = localStorage.getItem("playercount");

        $('a[data-action="change-player-count"][data-value="' + playerCount + '"]').click();

        updateTotals();

        $('#rounds td.score.selected').click();

    }


    load();

}(jQuery);