// Using Jquery until we go into Angular or React.
$(document).ready(() => {

    $('.play-button').on('click', (evt) => {
        var component = $(evt.target);
        var audioComponent = component.parent().children('audio')[0];
        audioComponent.play();
        component.addClass('hidden');
        component.parent().children('.pause-button').removeClass('hidden');;

    });

    $('.pause-button').on('click', (evt) => {
        var component = $(evt.target);
        var audioComponent = component.parent().children('audio')[0];
        audioComponent.pause();
        component.addClass('hidden');
        component.parent().children('.play-button').removeClass('hidden');
    });

    $('.restart').on('click', (evt) => {
        var component = $(evt.target);
        var parent = component.parent().parent().parent().parent().parent();
        var row = parent.children('td').first();
        var audioComponent = row.children('audio')[0];
        

        console.log(row.children('.play-button'));
        row.children('.play-button').removeClass('hidden');
        row.children('.play-button').addClass('hidden');
        row.children('.pause-button').removeClass('hidden');


        audioComponent.pause();
        audioComponent.currentTime = 0;
        audioComponent.play();
        
    });

    $('.restart-icon').on('click', (evt) => {
        var component = $(evt.target);
        var parent = component.parent().parent();
        console.log(parent);
        
        var row = parent.children('div').first();
        var audioComponent = row.children('audio')[0];
        

        console.log(row.children('.play-button'));
        row.children('.play-button').removeClass('hidden');
        row.children('.play-button').addClass('hidden');
        row.children('.pause-button').removeClass('hidden');


        audioComponent.pause();
        audioComponent.currentTime = 0;
        audioComponent.play();
        
    });

    

    $('.remove-song-from-playlist').on('click', (evt) => {

        var songId = $(evt.target).attr('song-id');
        var playlistId = $(evt.target).attr('playlist-id');

        AjaxUtils.DeleteByID('/composer/playlist/' + playlistId + '/song/' + songId, key)

    });

    $('.add-song-to-playlist').on('click', (evt) => {

        var songTitle = $(evt.target).attr('song-title');
        var songId = $(evt.target).attr('song-id');

        $('#song-title').html(songTitle);
        $('#song-id').val(songId);

    });

    $('.send-playlist').on('click', (evt) => {
        
        var playlistTitle = $(evt.target).attr('playlist-title');
        var playlistId = $(evt.target).attr('playlist-id');
        var publicKey = $(evt.target).attr('public-key');

        var url = '<a href="/producer/?key=' + publicKey +'">Click Here</a>'

        $('#public-key').html(url);
        $('#playlist-title').html(playlistTitle);
        $('#playlist-id').val(playlistId);

    });

    var selectedPlaylistId= "";

    $('.delete-playlist').on('click', (evt) => {
        
        var playlistTitle = $(evt.target).attr('playlist-title');
        $('#delete-playlist-title').html(playlistTitle);

        selectedPlaylistId = $(evt.target).attr('playlist-id');

    });

    $('.confirm-delete-playlist').on('click', (evt) => {
        AjaxUtils.DeleteByID('/composer/playlist/' + selectedPlaylistId, key)
    });


    var selectedSongId = 0;

    $('.delete-song').on('click', (evt) => {

        var songTitle = $(evt.target).attr('song-title');

        $('#delete-song-title').html(songTitle);

        selectedSongId = $(evt.target).attr('song-id');

    });

    $('.confirm-delete-song').on('click', (evt) => {
        
        AjaxUtils.DeleteByID('/composer/song/' + selectedSongId, key)
       
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


   

    //alert('Loaded Correctly')
});