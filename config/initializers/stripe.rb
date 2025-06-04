Rails.configuration.stripe = {
  publishable_key: 'pk_test_51OvXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  secret_key: ENV['STRIPE_SECRET_KEY']
}

# Log Stripe configuration status
Rails.logger.info "Stripe configuration:"
Rails.logger.info "  Publishable key: #{Rails.configuration.stripe[:publishable_key].present? ? 'present' : 'missing'}"
Rails.logger.info "  Secret key: #{Rails.configuration.stripe[:secret_key].present? ? 'present' : 'missing'}"

Stripe.api_key = Rails.configuration.stripe[:secret_key] 