class UserTag < ActiveRecord::Base

	def self.read(params)
		en = self.find(params[:id])
		if en
			en.is_read = "\1"
			en.save!
		end
	end

	def self.list(params)
		usertag = self.where("user_id = ? AND is_deleted IS NULL", params[:user_id])
		usertag.each{|u|
			u.count = self.count_by_sql('SELECT COUNT(*) FROM users Where1');
		}
	end
end
