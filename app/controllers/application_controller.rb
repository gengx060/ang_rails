class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception

	def check_auth
		# unless (session[:user] != nil && session[:ip] == request.remote_ip)
		unless (session[:user] != nil && session[:ip] == request.remote_ip)
			render :json => {:success => true, :product => {sucess: 1}.as_json()}, :status => 401
			return false
		else
			# time_left = (session[:expires_at] - Time.now).to_i

		end
	end
end
