module Api
  module V1
    class CartItemsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_cart
      before_action :set_cart_item, only: [:update, :destroy]

      def create
        Rails.logger.info "CartItemsController#create - Starting create action"
        Rails.logger.info "CartItemsController#create - Session: #{session.inspect}"
        Rails.logger.info "CartItemsController#create - Session cart ID: #{session[:cart_id]}"
        Rails.logger.info "CartItemsController#create - Request params: #{params.inspect}"
        
        begin
          product_id = params.require(:product_id)
          quantity = params[:quantity].to_i || 1
          
          Rails.logger.info "CartItemsController#create - Product ID: #{product_id}"
          Rails.logger.info "CartItemsController#create - Quantity: #{quantity}"
          
          product = Product.find(product_id)
          Rails.logger.info "CartItemsController#create - Found product: #{product.inspect}"
          
          line_item = @cart.line_items.find_or_initialize_by(product_id: product_id)
          line_item.quantity = (line_item.quantity || 0) + quantity
          
          Rails.logger.info "CartItemsController#create - Line item before save: #{line_item.inspect}"
          
          if line_item.save
            Rails.logger.info "CartItemsController#create - Line item saved successfully"
            render json: { 
              message: 'Product added to cart successfully',
              line_item: {
                id: line_item.id,
                quantity: line_item.quantity,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image.attached? ? url_for(product.image) : nil
                }
              }
            }
          else
            Rails.logger.error "CartItemsController#create - Failed to save line item: #{line_item.errors.full_messages}"
            render_error(:unprocessable_entity, "Failed to add product to cart: #{line_item.errors.full_messages.join(', ')}")
          end
        rescue ActionController::ParameterMissing => e
          Rails.logger.error "CartItemsController#create - Missing parameter: #{e.message}"
          render_error(:bad_request, "Missing required parameter: product_id")
        rescue ActiveRecord::RecordNotFound => e
          Rails.logger.error "CartItemsController#create - Product not found: #{e.message}"
          render_error(:not_found, "Product not found")
        rescue => e
          Rails.logger.error "CartItemsController#create - Unexpected error: #{e.message}"
          Rails.logger.error "CartItemsController#create - Error class: #{e.class}"
          Rails.logger.error "CartItemsController#create - Error backtrace: #{e.backtrace.join("\n")}"
          render_error(:internal_server_error, "An unexpected error occurred: #{e.message}")
        end
      end

      def update
        if @cart_item.update(cart_item_params)
          render json: @cart_item
        else
          render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @cart_item.destroy
        head :no_content
      end

      private

      def set_cart
        Rails.logger.info "CartItemsController#set_cart - Starting set_cart"
        Rails.logger.info "CartItemsController#set_cart - Session: #{session.inspect}"
        Rails.logger.info "CartItemsController#set_cart - Session cart ID: #{session[:cart_id]}"
        
        begin
          @cart = Cart.find_by(id: session[:cart_id])
          
          if @cart.nil?
            Rails.logger.info "CartItemsController#set_cart - No cart found, creating new cart"
            @cart = Cart.create
            session[:cart_id] = @cart.id
            Rails.logger.info "CartItemsController#set_cart - New cart created with ID: #{@cart.id}"
            Rails.logger.info "CartItemsController#set_cart - Updated session: #{session.inspect}"
          else
            Rails.logger.info "CartItemsController#set_cart - Found existing cart: #{@cart.inspect}"
          end
        rescue => e
          Rails.logger.error "CartItemsController#set_cart - Error setting cart: #{e.message}"
          Rails.logger.error "CartItemsController#set_cart - Error class: #{e.class}"
          Rails.logger.error "CartItemsController#set_cart - Error backtrace: #{e.backtrace.join("\n")}"
          render_error(:internal_server_error, "Error setting cart: #{e.message}")
        end
      end

      def set_cart_item
        @cart_item = @cart.line_items.find(params[:id])
      end

      def cart_item_params
        params.require(:cart_item).permit(:quantity)
      end
    end
  end
end 