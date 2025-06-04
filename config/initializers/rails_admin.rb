RailsAdmin.config do |config|
  ### Popular gems integration

  ## == Devise ==
  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)

  ## == CancanCan ==
  # config.authorize_with :cancancan

  ## == Pundit ==
  # config.authorize_with :pundit

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/railsadminteam/rails_admin/wiki/Base-configuration

  ## == Gravatar integration ==
  ## To disable Gravatar integration in Navigation Bar set to false
  # config.show_gravatar = true

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  # Configure models
  config.model 'User' do
    list do
      field :id
      field :email
      field :name
      field :created_at
      field :updated_at
    end
  end

  config.model 'Product' do
    list do
      field :id
      field :name
      field :description
      field :price
      field :stock
      field :user
      field :created_at
      field :updated_at
    end
  end

  config.model 'Cart' do
    list do
      field :id
      field :user
      field :created_at
      field :updated_at
    end
  end

  config.model 'CartItem' do
    list do
      field :id
      field :cart
      field :product
      field :quantity
      field :created_at
      field :updated_at
    end
  end
end 