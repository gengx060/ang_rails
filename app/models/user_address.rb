class UserAddress < ActiveRecord::Base

	def self.edit(params)
		if params[:id]
			addr = self.where("id = #{params[:id]}").first
		end

		unless addr
			addr = self.new
		end
		if addr
			self.params_to_model(params, addr)
			addr.save!
		end
	end

	def self.get_address(params)
		if params[:user_id]
			addr = self.where("user_id = #{params[:user_id]} AND is_deleted IS NULL").first
		end
		return addr.as_json
	end
end
