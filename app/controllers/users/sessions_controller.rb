# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  skip_before_action :require_no_authentication, only: [:new]
  respond_to :json

  def create
    Rails.logger.info "Attempting to authenticate user with email: #{params[:user][:email]}"
    Rails.logger.info "Request parameters: #{params.inspect}"
    Rails.logger.info "CSRF token: #{request.headers['X-CSRF-Token']}"
    
    begin
      # Verify CSRF token
      unless verified_request?
        Rails.logger.error "CSRF token verification failed"
        return render json: {
          status: { code: 422, message: 'Invalid CSRF token' }
        }, status: :unprocessable_entity
      end

      # Find user by email
      user = User.find_by(email: params[:user][:email])
      unless user
        Rails.logger.error "User not found with email: #{params[:user][:email]}"
        return render json: {
          status: { code: 401, message: 'Invalid email or password' }
        }, status: :unauthorized
      end

      # Authenticate user
      unless user.valid_password?(params[:user][:password])
        Rails.logger.error "Invalid password for user: #{user.email}"
        return render json: {
          status: { code: 401, message: 'Invalid email or password' }
        }, status: :unauthorized
      end

      # Sign in the user
      sign_in(user)
      Rails.logger.info "User authenticated successfully: #{user.email}"
      
      # Generate a new CSRF token
      new_csrf_token = form_authenticity_token
      response.headers['X-CSRF-Token'] = new_csrf_token
      
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: {
          type: 'users',
          id: user.id,
          attributes: {
            email: user.email,
            name: user.name || user.email.split('@').first
          }
        },
        csrf_token: new_csrf_token
      }
    rescue StandardError => e
      Rails.logger.error "Authentication failed: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.join("\n")}"
      
      render json: {
        status: { code: 500, message: 'An error occurred during authentication' },
        error: e.message
      }, status: :internal_server_error
    end
  end

  def destroy
    Rails.logger.info "Attempting to sign out user"
    if current_user
      sign_out(current_user)
      reset_session
      Rails.logger.info "User signed out successfully"
      render json: {
        status: { code: 200, message: 'Logged out successfully.' }
      }
    else
      Rails.logger.info "No user found to sign out"
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end

  private

  def respond_to_on_destroy
    if current_user
      sign_out(current_user)
      reset_session
      render json: {
        status: { code: 200, message: 'Logged out successfully.' }
      }
    else
      render json: {
        status: { code: 401, message: "Couldn't find an active session." }
      }, status: :unauthorized
    end
  end

  def auth_options
    { scope: resource_name, recall: "#{controller_path}#new" }
  end

  def require_no_authentication
    return if request.format.json?
    super
  end

  def is_navigational_format?
    request.format.html?
  end
end 