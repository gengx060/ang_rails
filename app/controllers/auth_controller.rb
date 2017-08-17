class AuthController < ApplicationController
	# protect_from_forgery with: :null_session
	before_action :check_auth, :except => ["login", "login_check"]

	def login
		user = User.find_by(email: params['email'])
		if user
			hashed = Digest::SHA512.hexdigest("#{params['password']} #{user.salt}")
			if hashed == user.password
				session[:user_id] = user.id
				session[:ip] = request.remote_ip
				session[:is_org] = (user.id == user.org_id)
				session[:expires_at] = 30.minutes.from_now
				render :json => {:success => true}
				user_login = UserLogin.new do |ul|
					ul.user_id = user.id
					ul.user_ip = request.remote_ip
					ul.login_at = Time.now()
				end
				user_login.save!
				return
			end
		end
		render :json => {:error => 'Incorrect username or password.'}, :status => 401

	end

	def login_check
		if session[:user_id]
			render :json => {:success => true}
			return
		end
		render :json => {:error => 'Unauthorized user, please login back in.'}, :status => 401
	end

	# def check_auth
	# 	return true    if (session[:user] != nil && session[:ip] == request.remote_ip)
	#
	# 	# # Avoid times where an account has changed, and a user is posting from a stale form
	# 	# if ((request.post?) && (params[:exactor_merchant_id] != nil) && (session[:merchant_id] != params[:exactor_merchant_id]) && (allow_admin_override(controller_name, action_name) == false))
	# 	#   results = { :text => "This session for this account is no longer valid since you have logged into another account. This operation has been denied.", :failure => 'true' }
	# 	#   render :json => results.to_json, :layout => false
	# 	#   return false
	# 	# end
	#
	# 	# Expire the session in 8 hours if there is no activity
	# 	if (session[:expires_at] != nil)
	# 		time_left = (session[:expires_at] - Time.now).to_i
	# 		# unless (time_left > 0)
	# 		#   logout
	# 		#   flash[:error] = "Your session has expired due to inactivity. Please log in again to continue."
	# 		#   return false
	# 		# end
	# 		session[:expires_at] = 2.hours.from_now
	# 	end

	# # Special Hack for State SST Testing
	# if ((session[:merchant_id] == "10001001") && (session[:login] == "sst_state"))
	#   session[:layout] = "exactor_lite.rhtml"
	#   if (((controller_name == "invoice") &&
	#       (action_name == "tax_calculator") ||
	#       (action_name == "get_invoice") ||
	#       (action_name == "show") ||
	#       (action_name == "calculate_tax") ||
	#       (action_name == "commit_tax")) ||
	#       ((controller_name == "sku") &&
	#           (action_name == "get_merchant_sku_table")))
	#     return true
	#   else
	#     redirect_to :controller=>"invoice", :action=>"tax_calculator"
	#     return false
	#   end
	# end
	#
	# unless session[:user]
	#   session[:intended_action] = action_name
	#   session[:intended_controller] = controller_name
	#   flash[:notice] = "Please log in"
	#   redirect_to :controller=>"auth", :action=>"login"
	#   return false
	# end
	#
	# return check_permissions(controller_name, action_name)
	# end
end
