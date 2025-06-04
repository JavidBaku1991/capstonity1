module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!
      before_action :check_admin
      before_action :set_user, only: [:destroy, :promote, :demote]

      def index
        @users = User.all
        render json: @users.map { |user| 
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.admin ? 'admin' : 'user'
          }
        }
      end

      def destroy
        @user.destroy
        head :no_content
      end

      def promote
        @user.update(admin: true)
        render json: { message: 'User promoted to admin successfully' }
      end

      def demote
        @user.update(admin: false)
        render json: { message: 'User demoted from admin successfully' }
      end

      private

      def check_admin
        unless current_user.admin?
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end

      def set_user
        @user = User.find(params[:id])
      end
    end
  end
end 