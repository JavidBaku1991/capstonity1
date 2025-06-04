# frozen_string_literal: true

class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!, only: [:destroy]

  def create
    user = User.find_by(email: params[:user][:email])
    
    if user&.valid_password?(params[:user][:password])
      sign_in(user)
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    else
      render json: {
        status: { code: 401, message: 'Invalid email or password.' }
      }, status: :unauthorized
    end
  end

  def destroy
    sign_out(current_user)
    render json: {
      status: { code: 200, message: 'Logged out successfully.' }
    }
  end
end 