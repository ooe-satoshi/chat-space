$(function(){

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.message').append(html);
      $('.message').animate({ scrollTop: $('.message')[0].scrollHeight});
      $('form')[0].reset();
      $('.form__message').val('')
      $('.submit-btn').attr('disabled', false);
    })
    .fail(function(){
      alert('メッセージ送信に失敗しました');
    })
  })

  var buildHTML = function(message) {
    if (message.content && message.image) {
      //data-idが反映されるようにしている
      var html =
        `<div class="message-box" data-message-id=${message.id}>
          <div class="upper-message">
            <div class="upper-message__user-name">
              ${message.user_name}
            </div>
            <div class="upper-message__date">
              ${message.created_at}
            </div>
            </div>
            <div class="lower-message">
              <p class="lower-message__message">
                ${message.content}
              </p>
              <div class="message-photo">
                <img src="${message.image}" class="lower-message__image" >
              </div>
            </div>
          </div>`
      return html;
    } else if (message.content) {
      console.log(2)
      //同様に、data-idが反映されるようにしている
      var html =
        `<div class="message-box" data-message-id=${message.id}>
          <div class="upper-message">
            <div class="upper-message__user-name">
              ${message.user_name}
            </div>
            <div class="upper-message__date">
              ${message.created_at}
            </div>
          </div>
          <div class="lower-message">
            <p class="lower-message__message">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    } else if (message.image) {
      console.log(3)
      //同様に、data-idが反映されるようにしている
      var html =
      `<div class="message-box" data-message-id=${message.id}>
      <div class="upper-message">
        <div class="upper-message__user-name">
          ${message.user_name}
        </div>
        <div class="upper-message__date">
          ${message.created_at}
        </div>
        </div>
        <div class="lower-message">
          <div class="message-photo">
            <img src="${message.image}" class="lower-message__image" >
          </div>
        </div>
      </div>`
      return html;
    };
  };



  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      console.log('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});