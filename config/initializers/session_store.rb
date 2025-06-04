# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store,
  key: '_capstonity_session',
  same_site: :lax,
  secure: Rails.env.production?,
  expire_after: 2.weeks 