class AuthController < ApplicationController
	# protect_from_forgery with: :null_session
	before_action :check_auth, :except => ["login", "signup", "logout", "forget_password", "change_password"]

	def login
		user = User.find_by(email: params['email'])
		if user
			hashed = Digest::SHA512.hexdigest("#{params['password']} #{user.salt}")
			if hashed == user.password
				session[:user_id]    = user.id
				session[:ip]         = request.remote_ip
				session[:is_org]     = (user.id == user.org_id)
				session[:org_id]     = user.org_id
				session[:expires_at] = 8.hours.from_now
				params               = {
						email:        user.email,
						emailSubject: "Welcome to login.",
						username:     "#{user.firstname}, #{user.lastname}"
				}
				# Notifier.welcome(params).deliver_later
				last_login = UserLogin.where("user_id = ? and status='login'", session[:user_id])
												 .order("created_at DESC").first

				params_u = {
						user_id:    user.id,
						user_ip:    request.remote_ip,
						user_agent: request.user_agent,
						status:     'Login'
				}
				UserLogin.record(params_u);

				render :json => {:user_id       => session[:user_id],
												 :last_login    => last_login ? last_login.created_at : nil,
												 :last_login_ip => last_login ? last_login.user_ip : nil}
				return
			end
		end
		render :json => {message: 'Incorrect username or password.'}, :status => 401

	end

	def login_check
		if session[:user_id]
			render :json => {:success => true}
			return
		end
		render :json => {:message => 'Unauthorized contact, please login back in.'}, :status => 401
	end

	def logout
		params_u = {
				user_id:    session[:user_id],
				user_ip:    request.remote_ip,
				user_agent: request.user_agent,
				status:     'Logout'
		}
		reset_session
		UserLogin.record(params_u);
		render :json => {:message => 'You are logged out.'}
	end

	def signup
		# if User.exists?("email= params['email'] and is_deleted is null")
		params[:org_id] = ''
		flag, msg = User.create_contact(params)
		if flag
			render :json => {message: 'Contact created.'}
		else
			render :json => {message: msg}, :status => 500
		end
	end

	def forget_password
		params[:user_ip] = request.remote_ip
		status, message  = User.forget_password(params)
		if status
			render :json => {}
		else
			render :json => {message: message}, :status => 500
		end
	end


	def change_password
		status, message = User.change_password(params)
		if status
			render :json => {message: 'Change password successful, please login back.'}
		else
			render :json => {message: message}, :status => 500
		end
	end

end
