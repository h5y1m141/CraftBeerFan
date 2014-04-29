# app/assets/alloy/alert.jsに用意
Alert = require("alloy/alert")
exports.move = (_tab) ->
  Ti.API.info _tab
  Ti.API.info $.loginWindow
  return _tab.open $.loginWindow
  
doAuthorization = (_params) ->
  console.log _params
  _params = _params or {}
  user = Alloy.createModel("Users")
  user.login
    login: _params.username
    password: _params.password
    success: (_model, _response) ->
      # $.trigger "logined", {}
      # $.navigation.close()
      Ti.API.info "model is #{_model}"
      alert _model
      return

    error: (_model, _response) ->
      Alert.dialog
        title: "エラー"
        message: "ログインに失敗しました"

      return

  return
doLogin = ->
  doAuthorization
    username: $.loginUsername.getValue()
    password: $.loginPassword.getValue()

  return
# doCreate = ->
#   user = Alloy.createModel("Users",
#     username: $.createUsername.getValue()
#     password: $.createPassword.getValue()
#     password_confirmation: $.createConfirm.getValue()
#   )
#   user.save {},
#     success: (_model, _response) ->
#       doAuthorization
#         username: $.createUsername.getValue()
#         password: $.createPassword.getValue()

#       return

#     error: (_mode, _response) ->
#       Alert.dialog
#         title: "エラー"
#         message: "ユーザ登録に失敗しました"

#       return

#   return

