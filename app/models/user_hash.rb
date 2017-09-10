class UserHash < ActiveRecord::Base

	def find_user_hash(params)
		user_hash = self.where("user_id = #{params['user_id']} and hash = #{params['hash']}").first
		if user_hash
			user_hash.claimed = 1
			user_hash.save!
			return true
		end
		return false
	end

end
