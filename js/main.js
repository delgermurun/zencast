(function main(document) {
  const audioElm = document.getElementById('player');

  function changeSpeed(value) {
    if (!value) { return false; }

    if (!audioElm || audioElm.paused) {
      console.warn('not playing!'); //eslint-disable-line no-console
      return false;
    }

    audioElm.playbackRate = value;
    return true;
  }

  function insertNewUrl(url) {
    if (!url) { return; }
    $(audioElm).attr('src', url);
  }

  $(document).ready(function() {
    $('[data-action=media-form]').on('submit', function submit_media_form_event(event) {
      event.preventDefault();
      insertNewUrl($(this).find('[name=media-url]').val());
    });

    $('[name=speed]').on('change', function speed_change_even() {
      const result = changeSpeed($(this).val());
      if (!result) {
        $(this).val('1');
      }
    });
  });
})(document);
