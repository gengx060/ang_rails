class Resource < ActiveRecord::Base

	def self.save_file(params)
		created_at  = Time.now.utc
		hashed_name = Digest::SHA512.hexdigest "#{params[:filename]}+#{created_at}"
		file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		data        = params[:data]
		start_pos   = data.index(';base64,')
		type        = data[(data.index('data:') > -1 ? 5 : 0)...start_pos]
		data        = data[start_pos+';base64,'.length..-1]
		while File.exist?(file_loc) do
			created_at  = Time.now.utc
			hashed_name = Digest::SHA256.digest "#{params[:filename]}+#{created_at}"
			file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		end
		File.open(file_loc, 'wb') do |file|
			file.write(data)
		end

		file = self.new do |f|
			f.name        = params[:name]
			f.hashed_name = hashed_name
			f.user_id     = params[:user_id]
			f.org_id      = params[:org_id]
			f.length      = params[:length]
			f.type        = type
		end
		file.save!

		return file
	end


	def self.delete(params)
		file = self.find(params[:id])
		if file && (file.user_id == params[:user_id] || file.org_id == params[:user_id])
			file.is_deleted = "\1"
			file.save!
		end
	end

	def self.resource_list(params)
		total     = self.where("(user_id = ? OR org_id = ?)", params[:user_id], params[:user_id]).count
		resources = self.where("(user_id = ? OR org_id = ?) ", params[:user_id], params[:user_id])
						.select("id, name, created_at, length, type, user_id,  IFNULL(is_deleted, 0) AS is_deleted ")
						.order(params[:sortby])
						.offset(params[:offset]).limit(params[:limit])
		resources = resources.as_json.map {|it|
			it['vcard'] = User.get_vcard(it['user_id']).as_json
			# it['is_deleted'] = it['is_deleted'] == "\1" ? 1 : 0
			it
		}
		return total, resources
	end

end
