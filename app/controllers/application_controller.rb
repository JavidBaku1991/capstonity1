# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ActionController::MimeResponds
  include ActionController::ImplicitRender
  include ActionController::Helpers
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern
  config.load_defaults 6.1

  # For API requests, we'll use null_session to skip CSRF protection
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
  respond_to :json, :html

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_format
  before_action :set_csrf_cookie
  before_action :set_session_cookie

  protected

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = {
      value: form_authenticity_token,
      secure: Rails.env.production?,
      same_site: :strict
    }
  end

  def set_format
    request.format = :json if request.format == '*/*'
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [:email, :password])
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :password, :name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:email, :password, :name])
  end

  def devise_controller?
    is_a?(::DeviseController) || is_a?(::Devise::SessionsController) || is_a?(::Devise::RegistrationsController)
  end

  def after_sign_in_path_for(resource)
    if request.format.json?
      nil
    else
      super
    end
  end

  def after_sign_out_path_for(resource)
    if request.format.json?
      nil
    else
      super
    end
  end

  def set_session_cookie
    cookies['_session_id'] = {
      value: session.id,
      secure: Rails.env.production?,
      same_site: :lax
    }
  end

  def render_error(status, message)
    render json: { error: message }, status: status
  end
end
