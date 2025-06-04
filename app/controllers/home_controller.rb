# frozen_string_literal: true

class HomeController < ApplicationController
  include ActionController::MimeResponds
  include ActionController::ImplicitRender

  def index
    respond_to do |format|
      format.html { render 'home/index' }
      format.json { render json: { message: 'Welcome to the API' } }
    end
  end
end 