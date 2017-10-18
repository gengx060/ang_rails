class Tag < ActiveRecord::Base

	def self.read(params)
		en = self.find(params[:id])
		if en
			en.is_read = "\1"
			en.save!
		end
	end

	def self.list(params)
		tags = self.where("user_id = ? AND is_deleted IS NULL", params[:user_id]).as_json
		tags.each{|t|
			t['count'] = self.count_by_sql("SELECT COUNT(*) FROM user_tags
 WHERE tag_id = #{t['id']} AND is_deleted IS NULL");
		}
		return tags
	end

	# def self.edit(params)
	# 	if params[:id]
	# 		tag = self.where("id = ?", params[:id]).first
	# 	end
	#
	# 	unless tag
	# 		tag = self.new
	# 	end
	# 	self.params_to_model(params, tag)
	# 	tag.save!
	# end
end
