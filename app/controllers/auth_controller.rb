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
				last_login = UserLogin.where("user_id = #{session[:user_id]} and status='login'")
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
		if User.exists?(email: params['email'], is_deleted: nil)
			render :json => {:message => 'Duplicate email found.'}, :status => 500
		else
			User.transaction do
				salt, hashed = User.create_password_salt(params['password'])
				params_u     = {
						'firstname': params['firstname'],
						'lastname':  params['lastname'],
						'email':     params['email'],
						'salt':      salt,
						'password':  hashed,
						'group':     'o'
				}
				user         = User.edit(params_u)
				params_u     = {
						'user_id':  user.id,
						'address2': params['address']['apt'],
						'address1': params['address']['street'],
						'city':     params['address']['city'],
						'state':    params['address']['state'],
						'country':  params['address']['country'] || 'US',
						'zipcode':  params['address']['zipcode'],
				}
				UserAddress.edit(params_u)
				params_u = {
						'user_id': user.id,
						'area':    params['phone']['area'],
						'number':  params['phone']['number'],
						'ext':     params['phone']['ext']
				}
				UserPhone.edit(params_u)
			end
			render :json => {}
		end
	end

	def forget_password
		status, message = User.forget_password(params)
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
