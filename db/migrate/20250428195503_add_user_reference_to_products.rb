class AddUserReferenceToProducts < ActiveRecord::Migration[7.1]
  def up
    # First add the column as nullable
    add_reference :products, :user, foreign_key: true
    
    # Update existing products to have a default user (first user in the system)
    if User.any?
      default_user = User.first
      Product.where(user_id: nil).update_all(user_id: default_user.id)
    end
    
    # Now add the NOT NULL constraint
    change_column_null :products, :user_id, false
  end

  def down
    remove_reference :products, :user
  end
end 