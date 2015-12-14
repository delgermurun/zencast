(function main(window, document) {
  function throttle(fn, threshhold, scope) {
    threshhold = threshhold || 250;
    var last;
    var deferTimer;

    return function () {
      var context = scope || this;

      var now = +new Date;
      var args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  const audioElm = document.getElementById('player');
  const $urlElm = $('[name=media-url]');

  const storage = {
    _prefix: 'ZENCAST_',

    save(key, value) {
      if (!window.localStorage) {
        return false;
      }

      window.localStorage.setItem(storage._prefix + key, value);
      return true;
    },

    get(key) {
      if (!window.localStorage) {
        return;
      }

      return window.localStorage.getItem(storage._prefix + key);
    }
  };

  function saveUrl(url) {
    if (!url) { return false; }

    return storage.save('url', url);
  }

  function saveProgress(value) {
    if (!value) { return false; }

    return storage.save('progress', value);
  }

  function changeSpeed(value) {
    if (!value) { return false; }

    if (!audioElm || audioElm.paused) {
      console.warn('not playing!'); //eslint-disable-line no-console
      return false;
    }

    audioElm.playbackRate = value;
    return true;
  }

  function changeTime(value) {
    value = parseInt(value);

    if (!value) { return false; }

    if (!audioElm || audioElm.paused) {
      console.warn('not playing!'); //eslint-disable-line no-console
      return false;
    }

    audioElm.currentTime += value;
    return true;
  }

  function insertNewUrl(url) {
    if (!url) { return; }
    $(audioElm).attr('src', url);
    saveUrl(url);
  }

  function initialize() {
    const url = storage.get('url');
    if (url) {
      $(audioElm).attr('src', url);
      $urlElm.val(url);
    }

    const time = storage.get('progress');
    if (url && time) {
      audioElm.currentTime = Number(time);
    }
  }

  $(document).ready(function() {
    $('[data-action=media-form]').on('submit', function submit_media_form_event(event) {
      event.preventDefault();
      insertNewUrl($(this).find('[name=media-url]').val());
    });

    $('[data-action=change-speed]').on('change', function speed_change_event() {
      const result = changeSpeed($(this).val());
      if (!result) {
        $(this).val('1');
      }
    });

    $('[data-action=change-time]').on('click', function time_change_event(e) {
      e.preventDefault();
      changeTime($(this).val());
    });

    audioElm.ontimeupdate = throttle(function time_update_event() {
      saveProgress(audioElm.currentTime);
    }, 5000);

    initialize();
  });
})(window, document);
