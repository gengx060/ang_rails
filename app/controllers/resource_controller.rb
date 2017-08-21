class ResourceController < ActionController::Base

	def upload
		data = params[:file]
		File.open(Rails.root.join('public', 'test.jpg'), 'wb') do |file|
			file.write( Base64.decode64(data['data:image/jpeg;base64,'.length .. -1]))
		end
		render :json =>{}
	end
end