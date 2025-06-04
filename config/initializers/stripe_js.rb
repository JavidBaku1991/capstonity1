Rails.application.config.after_initialize do
  ActionView::Base.send(:include, StripeJsHelper)
end

module StripeJsHelper
  def stripe_js_tag
    key = Rails.configuration.stripe[:publishable_key]
    Rails.logger.info "Stripe publishable key: #{key.present? ? 'present' : 'missing'}"
    
    javascript_tag do
      <<-JS.html_safe
        window.stripePublishableKey = '#{key}';
        console.log('Stripe key set:', window.stripePublishableKey);
        document.addEventListener('DOMContentLoaded', function() {
          console.log('DOM loaded - Stripe key:', window.stripePublishableKey);
        });
      JS
    end
  end
end 