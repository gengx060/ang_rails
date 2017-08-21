class ResourceController < ActionController::Base

	def upload
		data = params[:file]
		name = Digest::SHA256.digest 'message'
		File.open(Rails.root.join('app', 'resources', "#{name}"), 'wb') do |file|
			file.write( Base64.decode64(data['data:image/jpeg;base64,'.length .. -1]))
		end
		render :json =>{}
	end
end