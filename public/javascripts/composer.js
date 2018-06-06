// Using Jquery until we go into Angular or React.
$(document).ready(() => {

    // ** key **
    // gets rendered by handlebars making it globally available.

    $('.delete-song').on('click', (evt) => {
        $.ajax({
            url: '/composer/song/' + id + '?' + $.param({ "key": key }),
            type: 'DELETE',
            success: () => window.location = '/composer/' + key,
            error: () => alert('Error Deleting Resource.'),
            statusCode: {
                401: function () {
                    window.location = '/me/login';
                },
                400: function (o) {
                    alert(o.error);
                },
                200: function (o) {
                    window.location = '/composer/' + key;
                }
            }
        });
    });

    $('.play-song').on('click', (evt) => {
        var key = $(evt.target).attr('song-key');
        alert(key);

    });

    $('.add-playlist').on('click', (evt) => {
        var id = $(evt.target).attr('song-id');
        $('')
    });

    var bar = document.getElementById('js-progressbar');

    UIkit.upload('.js-upload', {

        url: 'song',
        multiple: true,
        params: { key: key },

        beforeSend: function () {
            console.log('beforeSend', arguments);
        },
        beforeAll: function () {
            console.log('beforeAll', arguments);
        },
        load: function () {
            console.log('load', arguments);
        },
        error: function () {
            alert('Error');
            console.log('error', arguments);
        },
        complete: function () {
            console.log('complete', arguments);
        },

        loadStart: function (e) {
            console.log('loadStart', arguments);

            bar.removeAttribute('hidden');
            bar.max = e.total;
            bar.value = e.loaded;
        },

        progress: function (e) {
            console.log('progress', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        loadEnd: function (e) {
            console.log('loadEnd', arguments);

            bar.max = e.total;
            bar.value = e.loaded;
        },

        completeAll: function () {
            console.log('completeAll', arguments);

            setTimeout(function () {
                bar.setAttribute('hidden', 'hidden');
            }, 1000);

            window.location = '/composer/' + key;
        }

    });


    $('.add-song-to-playlist').on('click', (evt) => {

        var songTitle = $(evt.target).attr('song-title');
        var songId = $(evt.target).attr('song-id');

        $('#song-title').html(songTitle);
        $('#song-id').val(songId);

    });

    //alert('Loaded Correctly')
});