class UserPhone < ActiveRecord::Base

	def self.edit(params)
		if params[:id]
			phone = UserAddress.where("id = #{params[:id]}").first
		end

		unless phone
			phone = self.new
		end
		if phone
			self.params_to_model(params, phone)
			phone.save!
		end

	end
end
