class AuthController < ApplicationController
	# protect_from_forgery with: :null_session
	before_action :check_auth, :except => ["login", "singup", "logout"]

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

				last_login = UserLogin.where(:user_id => session[:user_id]).order("login_at DESC").first

				user_login = UserLogin.new do |ul|
					ul.user_id  = user.id
					ul.user_ip  = request.remote_ip
					ul.login_at = Time.now()
					ul.login_from = request.user_agent

				end
				user_login.save!

				render :json => {:user_id       => session[:user_id],
								 :last_login    => last_login ? last_login.login_at : null,
								 :last_login_ip => last_login ? last_login.user_ip : null}
				return
			end
		end
		render :json => {:message => 'Incorrect username or password.'}, :status => 401

	end

	def login_check
		if session[:user_id]
			render :json => {:success => true}
			return
		end
		render :json => {:message => 'Unauthorized user, please login back in.'}, :status => 401
	end

	def logout
		reset_session
		render :json => {:message => 'You are logged out.'}
	end

end
