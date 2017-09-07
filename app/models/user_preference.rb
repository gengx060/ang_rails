class UserPreference < ActiveRecord::Base


	def self.edit(params)
		preference = self.where("name = \"#{params[:name]}\" and user_id = #{params[:user_id]} and org_id = #{params[:org_id]}").first
		unless preference
			preference = self.new
		end

		self.params_to_model(params, preference)
		preference.save!
	end


end
