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
end
