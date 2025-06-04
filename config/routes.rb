# frozen_string_literal: true

Rails.application.routes.draw do
  # Mount Rails Admin
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  
  # Root route
  root 'home#index'
  
  # Favicon route
  get 'favicon.ico', to: ->(env) { [204, {}, ['']] }
  
  # Authentication routes
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # Override Devise routes for JSON requests
  scope :users, defaults: { format: :json } do
    post 'sign_in', to: 'users/sessions#create'
    delete 'sign_out', to: 'users/sessions#destroy'
    post '', to: 'users/registrations#create'
  end
  
  # Current user route
  get '/users/current', to: 'users#current'
  patch '/users/update', to: 'users#update'
  
  # User products route
  get '/users/:id/products', to: 'users#products'
  
  # Products routes
  resources :products, only: [:index, :show, :new, :create, :destroy] do
    member do
      post 'add_to_cart'
    end
  end

  # Cart routes
  resource :cart, only: [:show] do
    member do
      post 'checkout'
    end
  end

  # API routes
  namespace :api do
    namespace :v1 do
      resources :products, only: [:index, :show]
      resources :carts, only: [:show, :update, :destroy] do
        collection do
          get :current
        end
      end
      resources :cart_items, only: [:create, :update, :destroy]
      post 'create_payment_intent', to: 'payments#create_payment_intent'
      
      # Admin user management endpoints
      resources :users, only: [:index, :destroy] do
        member do
          post :promote
          post :demote
        end
      end
    end
  end
  
  # React Router catch-all - this should be the last route
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
