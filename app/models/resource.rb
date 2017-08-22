class Resource < ActiveRecord::Base

	def self.save_file(filename, data, user_id)
		created_at = Time.now
		hashed_name = Digest::SHA512.hexdigest "#{filename}+#{created_at}"
		file_loc = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		data = data[data.index(';base64,')+';base64,'.length..-1]
		while File.exist?(file_loc) do
			create_at = Time.now
			hashed_name = Digest::SHA256.digest "#{filename}+#{created_at}"
			file_loc = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
		end
		File.open(file_loc, 'wb') do |file|
			file.write(data)
		end

		file = Resource.new do |f|
			f.name = filename
			f.hashed_name = hashed_name
			f.user_id = user_id
			f.created_at = created_at
		end
		file.save!

	end

end
