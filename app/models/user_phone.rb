class UserPhone < ActiveRecord::Base

	def self.edit(params)
		if params[:id]
			phone = self.where("id = ?", params[:id]).first
		end

		unless phone
			phone = self.new
		end
		if phone
			self.params_to_model(params, phone)
			phone.save!
		end

	end

	def self.get_phone(params)
		if params[:user_id]
			phone = self.where("user_id = ? AND is_deleted IS NULL", params[:user_id]).first
		end
		return phone.as_json
	end
end
