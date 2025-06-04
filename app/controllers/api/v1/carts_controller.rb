module Api
  module V1
    class CartsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_cart, only: [:show, :update, :destroy, :current]

      def current
        Rails.logger.info "CartsController#current - Starting current action"
        Rails.logger.info "CartsController#current - Session: #{session.inspect}"
        Rails.logger.info "CartsController#current - Session cart ID: #{session[:cart_id]}"
        Rails.logger.info "CartsController#current - Current cart: #{@cart.inspect}"
        
        begin
          if @cart.nil?
            Rails.logger.error "CartsController#current - Cart is nil after set_cart"
            return render_error(:not_found, "Cart not found")
          end

          @line_items = @cart.line_items.includes(:product)
          Rails.logger.info "CartsController#current - Found line items: #{@line_items.inspect}"
          
          response_data = {
            id: @cart.id,
            line_items: @line_items.map do |item|
              {
                id: item.id,
                quantity: item.quantity,
                product: {
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  image_url: item.product.image.attached? ? url_for(item.product.image) : nil
                }
              }
            end,
            total_price: @cart.total_price
          }
          
          Rails.logger.info "CartsController#current - Response data: #{response_data.inspect}"
          render json: response_data
        rescue => e
          Rails.logger.error "CartsController#current - Unexpected error: #{e.message}"
          Rails.logger.error "CartsController#current - Error class: #{e.class}"
          Rails.logger.error "CartsController#current - Error backtrace: #{e.backtrace.join("\n")}"
          render_error(:internal_server_error, "An unexpected error occurred: #{e.message}")
        end
      end

      def show
        Rails.logger.info "CartsController#show - Session cart ID: #{session[:cart_id]}"
        Rails.logger.info "CartsController#show - Current cart: #{@cart.inspect}"
        
        @line_items = @cart.line_items.includes(:product)
        Rails.logger.info "CartsController#show - Found line items: #{@line_items.inspect}"
        
        render json: {
          id: @cart.id,
          line_items: @line_items.map do |item|
            {
              id: item.id,
              quantity: item.quantity,
              product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image_url: item.product.image_url
              }
            }
          end,
          total_price: @cart.total_price
        }
      end

      private

      def set_cart
        Rails.logger.info "CartsController#set_cart - Starting set_cart"
        Rails.logger.info "CartsController#set_cart - Session: #{session.inspect}"
        Rails.logger.info "CartsController#set_cart - Session cart ID: #{session[:cart_id]}"
        
        begin
          @cart = Cart.find_by(id: session[:cart_id])
          
          if @cart.nil?
            Rails.logger.info "CartsController#set_cart - No cart found, creating new cart"
            @cart = Cart.create
            session[:cart_id] = @cart.id
            Rails.logger.info "CartsController#set_cart - New cart created with ID: #{@cart.id}"
            Rails.logger.info "CartsController#set_cart - Updated session: #{session.inspect}"
          else
            Rails.logger.info "CartsController#set_cart - Found existing cart: #{@cart.inspect}"
          end
        rescue => e
          Rails.logger.error "CartsController#set_cart - Error setting cart: #{e.message}"
          Rails.logger.error "CartsController#set_cart - Error class: #{e.class}"
          Rails.logger.error "CartsController#set_cart - Error backtrace: #{e.backtrace.join("\n")}"
          render_error(:internal_server_error, "Error setting cart: #{e.message}")
        end
      end
    end
  end
end 