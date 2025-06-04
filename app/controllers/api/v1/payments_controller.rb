module Api
  module V1
    class PaymentsController < ApplicationController
      skip_before_action :verify_authenticity_token

      def create_payment_intent
        begin
          Rails.logger.info "Creating payment intent with params: #{params.inspect}"
          
          # Validate required parameters
          unless params[:amount].present? && params[:amount].to_i > 0
            return render json: { error: 'Amount is required and must be greater than 0' }, status: :unprocessable_entity
          end

          # Ensure amount is an integer
          amount = params[:amount].to_i
          currency = params[:currency] || 'usd'

          Rails.logger.info "Creating Stripe payment intent with amount: #{amount} #{currency}"
          
          # Create a PaymentIntent with the order amount and currency
          payment_intent = Stripe::PaymentIntent.create(
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
              enabled: true,
            },
            metadata: {
              integration_check: 'accept_a_payment'
            }
          )

          Rails.logger.info "Payment intent created successfully: #{payment_intent.id}"
          
          render json: {
            clientSecret: payment_intent.client_secret,
            id: payment_intent.id
          }
        rescue Stripe::StripeError => e
          Rails.logger.error "Stripe error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: e.message }, status: :unprocessable_entity
        rescue => e
          Rails.logger.error "Unexpected error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
        end
      end
    end
  end
end 