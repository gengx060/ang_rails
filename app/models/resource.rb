class Resource < ActiveRecord::Base

	def self.save_file(params)
		created_at  = Time.now.utc
		hashed_name = Digest::SHA512.hexdigest "#{params[:filename]}+#{created_at}"
		file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		data        = params['data']
		data        = data[data.index(';base64,')+';base64,'.length..-1]
		while File.exist?(file_loc) do
			created_at  = Time.now.utc
			hashed_name = Digest::SHA256.digest "#{params[:filename]}+#{created_at}"
			file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		end
		File.open(file_loc, 'wb') do |file|
			file.write(data)
		end

		file = Resource.new do |f|
			f.name        = params[:filename]
			f.hashed_name = hashed_name
			f.user_id     = params[:user_id]
			f.org_id      = params[:org_id]
			f.created_at  = created_at
		end
		file.save!
	end


	def self.resource_list(params)
		total     = self.where("(user_id = #{params[:user_id]} OR org_id = #{params[:user_id]}) AND is_deleted IS NULL ").count
		resources = self.where("(user_id = #{params[:user_id]} OR org_id = #{params[:user_id]}) AND is_deleted IS NULL ")
						.select("id, name, created_at, length, type as kind, user_id")
						.order(params[:sortby])
						.offset(params[:offset]).limit(params[:limit])
		return total, resources
	end

end
