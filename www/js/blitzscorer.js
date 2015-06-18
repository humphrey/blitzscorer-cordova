var blitzscorer = function () {

    load();

    $('button[data-action="next-round"]').click(function() {

        nextRound();
        return false;

    });

    $('button[data-action="change-score"]').click(function() {

        var $tr = $("#rounds tr.warning").last();
        if ($tr.length > 0) {
            var oldVal = parseInt($tr.find('.score').text());
            var newVal = oldVal + parseInt($(this).data('value'));
            $tr.find('.score').text(newVal);
        }
        updateTotals();
        return false;

    });

    $('button[data-action="new-game"]').click(function() {

        $("#rounds").html("");
        nextRound();
        return false;

    });

    $('#rounds').on('click', 'button[data-action="delete-round"]', function() {

        var $this = $(this);
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

            $this.addClass('btn-danger');

            var $msg = $('<span class="label label-danger delete-confirm-msg" style="position: absolute; top: -8px; right: 4px;">Tap again to delete</span>');

            $this.parents('td').append($msg);

            setTimeout(function() {
                $msg.fadeOut('fast', function() {
                    $('.delete-confirm-msg').remove();
                });
                $this.removeClass('btn-danger');

            }, 3000);

        }
        return false;

    });

    $('#rounds').on('click', 'tr', function() {


        $("#rounds tr").removeClass('warning');
        $(this).addClass('warning');
        save();
        return false;

    });

    function nextRound() {
        var i = $("#rounds tr").removeClass('warning').length + 1;
        console.log(i);

        var $tr = $('<tr>').addClass('warning');

        $tr.append( $('<td class="round"></td>').text(i) );
        $tr.append( $('<td class="score">0</td>') );
        $tr.append( $('<td class="total"></td>') );
        $tr.append( $('<td class="delete"><button data-action="delete-round" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-trash"></span></button></td>') );

        $("#rounds").append($tr);

        updateTotals();

    }

    function updateTotals() {

        var runningTotal = 0;
        var i = 0;
        $("#rounds tr").each(function() {
            i += 1;
            var $tr = $(this),
                score = parseInt($tr.find('.score').text());
            runningTotal += score;
            $tr.find('.total').text(runningTotal);
            $tr.find('.round').text(i);

        });
        save();
    }

    function save() {

        var $rounds = $("#rounds");
        $rounds.find('.delete button').removeClass('btn-danger');
        $rounds.find('.delete-confirm-msg').remove();
        localStorage.setItem("rounds", $rounds.html());
    }

    function load() {

        var rows = localStorage.getItem("rounds");
        if (rows == null) {
            $("#rounds").html("");
            nextRound();
        }
        else {
            $("#rounds").html(rows);
        }
        updateTotals();


    }

}(jQuery);