class UserHash < ActiveRecord::Base

	def self.find_user_hash(params)
		user_hash = self.where("user_id = ? and hash = ?", params['user_id'], params['hash']).first
		if user_hash
			user_hash.claimed = 1
			user_hash.save!
			return true
		end
		return false
	end


	def self.create_user_hash(params)
		user_hash = self.new
		self.params_to_model(params, user_hash)
		user_hash.save!
	end

end
