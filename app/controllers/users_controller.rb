# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!

  def current
    if current_user
      Rails.logger.info "Current user data: #{current_user.inspect}"
      Rails.logger.info "Phone number: #{current_user.phone_number}"
      render json: { 
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          phone_number: current_user.phone_number,
          avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
        }
      }
    else
      render json: { user: nil }, status: :unauthorized
    end
  end

  def update
    if params[:user][:avatar].present?
      # If only updating avatar, skip password validation
      current_user.avatar.attach(params[:user][:avatar])
      render json: {
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          phone_number: current_user.phone_number,
          avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
        }
      }
    else
      # For other updates, use normal update process
      if current_user.update(user_params)
        render json: {
          user: {
            id: current_user.id,
            email: current_user.email,
            name: current_user.name,
            phone_number: current_user.phone_number,
            avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
          }
        }
      else
        render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def products
    Rails.logger.info "Fetching products for user: #{params[:id]}"
    @user = User.find(params[:id])
    Rails.logger.info "Found user: #{@user.inspect}"
    
    @products = @user.products.map do |product|
      Rails.logger.info "Processing product: #{product.inspect}"
      product.as_json.merge(
        image_url: product.image.attached? ? url_for(product.image) : nil,
        user_name: @user.name
      )
    end
    Rails.logger.info "Returning products: #{@products.inspect}"
    render json: @products
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :phone_number, :avatar)
  end
end 