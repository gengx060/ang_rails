class ResourceController < ActionController::Base

	def upload
		data = params[:file]
		name = params[:name]
		if data
			Resource.save_file(name, data, session[:user_id])
		end

		render :json => {}
	end
end