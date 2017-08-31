class AuthController < ApplicationController
	# protect_from_forgery with: :null_session
	before_action :check_auth, :except => ["login", "signup", "logout"]

	def login
		user = User.find_by(email: params['email'])
		if user
			hashed = Digest::SHA512.hexdigest("#{params['password']} #{user.salt}")
			if hashed == user.password
				session[:user_id] = user.id
				session[:ip] = request.remote_ip
				session[:is_org] = (user.id == user.org_id)
				session[:org_id] = user.org_id
				session[:expires_at] = 8.hours.from_now
				@username = user.firstname + ' ' + user.lastname
				Notifier.welcome(user.email).deliver_now
				last_login = UserLogin.where(:user_id => session[:user_id]).order("login_at DESC").first

				user_login = UserLogin.new do |ul|
					ul.user_id = user.id
					ul.user_ip = request.remote_ip
					ul.login_at = Time.now()
					ul.login_from = request.user_agent

				end
				user_login.save!

				render :json => {:user_id => session[:user_id],
												 :last_login => last_login ? last_login.login_at : nil,
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
		render :json => {:message => 'Unauthorized user, please login back in.'}, :status => 401
	end

	def logout
		reset_session
		render :json => {:message => 'You are logged out.'}
	end

	def signup
		# if User.exists?("email= params['email'] and is_deleted is null")
		if User.exists?(email: params['email'], is_deleted: nil)
			render :json => {:message => 'Duplicate email found.'}, :status => 500
		else
			User.transaction do
				salt, hashed = User.create_password_salt(params['password'])
				params_u = {
						'firstname': params['firstname'],
						'lastname': params['lastname'],
						'email': params['email'],
						'salt': salt,
						'password': hashed,
						'group': 'o'
				}
				user = User.edit(params_u)
				params_u = {
						'user_id': user.id,
						'address2': params['address']['apt'],
						'address1': params['address']['street'],
						'city': params['address']['city'],
						'state': params['address']['state'],
						'country': params['address']['country'] || 'US',
						'zipcode': params['address']['zipcode'],
				}
				UserAddress.edit(params_u)
				params_u = {
						'user_id': user.id,
						'area': params['phone']['area'],
						'number': params['phone']['number'],
						'ext': params['phone']['ext']
				}
				UserPhone.edit(params_u)
			end
			render :json => {}
		end
	end

end
