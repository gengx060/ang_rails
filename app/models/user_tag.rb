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
		usertag.each {|u|
			u.count = self.count_by_sql('SELECT COUNT(*) FROM users Where1');
		}
	end

	def self.create(params)
		params_u = {tag_id: params[:tag_id], org_id: params[:org_id]}
		params[:users].each {|user|
			params_u[:user_id] = user
			self.create_single(params_u)
		}
	end

	def self.create_single(params)
		user_tag = self.where("tag_id = ? AND user_id = ?", params[:tag_id], params[:user_id]).first
		if user_tag
			if user_tag.is_deleted
				self.edit({is_deleted: nil}, user_tag)
			end
		else
			self.edit({tag_id: params[:tag_id], user_id: params[:user_id], org_id: params[:org_id]})
		end
	end
end
