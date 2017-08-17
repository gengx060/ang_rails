class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	before_action :check_auth

	def check_auth
		# unless (session[:user] != nil && session[:ip] == request.remote_ip)
		if (session[:user] && session[:expires_at] && session[:ip] == request.remote_ip)
			if session[:expires_at].to_time - Time.now > 0
				return true
			else
				render :json => {:error => 'Your session expired, please login back in.'}, :status => 401
				return false
			end
		else
			render :json => {:error => 'Unauthorized user, please login back in.'}, :status => 401
			return false
		end
	end
end
