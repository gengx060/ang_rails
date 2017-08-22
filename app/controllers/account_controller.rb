class AccountController < ApplicationController
	before_action :check_auth, :except => ["login", "create_password_from_url_hash"]

	def create_FB_account
		if session[:is_org]
			render :json => {:message => 'You don\'t have such permission.'}, :status => 500
		elsif User.exists?(email: params['email'])
			render :json => {:message => 'Duplicate email found.'}, :status => 500
		else
			user = User.new do |u|
				u.firstname = params['firstname']
				u.lastname = params['lastname']
				u.email = params['email']
				# salt, hashed = create_password_salt('gege1818')
				# u.salt = salt
				# u.password = hashed
				u.org_id = session[:user_id]
			end
			user.save!
			render :json => {:success => true}
		end
	end

	def create_password_from_group_account
		unless params['user_id'] && params['password']
			render :json => {:message => 'Missing password or user id.'}, :status => 500
			return
		end
		if session[:is_org]
			user = User.find_by(:id => params['user_id'], :org_id => session[:user_id])
			if user
				user.salt, user.password = create_password_salt(params['password'])
				user.save!
				render :json => {:message => 'Password updated successfully.'}
			else
				render :json => {:message => 'User is not part of your organizaiton.'}, status => 500
			end
		else
			render :json => {:message => 'You don\'t have such permission.'}, status => 500
		end
	end

	def verify_from_url_hash
		unless params['hash']
			render :json => {:message => 'Missing hash token.'}, :status => 500
			return
		end
		uh = UserHash.find_by(:hash => params['hash'], :claimed => null)
		if uh
			render :json => {:message => 'Hash verified successfully.'}
		else
			render :json => {:message => 'Hash does not exist.'}, status => 500
		end
	end

	def create_password_from_url_hash
		unless params['hash']
			render :json => {:message => 'Missing hash token.'}, :status => 500
			return
		end
		uh = UserHash.find_by(:hash => params['hash'], :claimed => null)
		if uh
			user = User.find(uh.user_id)
			if user
				user.salt, user.password = create_password_salt(params['password'])
				user.save!
				render :json => {:message => 'Password updated successfully.'}
			else
				render :json => {:message => 'Hash or user does not exist.'}, status => 500
			end
		end
	end

	def get_menu
		if session[:user_id]
			render :json => [
					{name: 'welcome', route: '/welcome', nav: false, title: 'Welcome'},
					{name: 'comments', route: '/comment', nav: true, title: 'Github Users'},
					{name: 'contacts', route: '/contacts', nav: true, title: 'Github Users'}
			];
			return
		end
		render :json => {:error => 'Unauthorized user, please login back in.'}, :status => 401
	end

	def login_profile
		render :json => User.login_profile(session[:user_id]).as_json
	end

	def signup
		unless params['account'] && params['password'] && params['password'] == params['password1']
			render :json => {:message => 'Sign up info is invalid.'}, :status => 500
			return
		end
		params['account'] = true
		User.create(params)
		render :json => {}
	end

	def change_password
		if params['password'] && params['password1'] && params['password'] == params['password1']
			user = User.find(session['user_id'])
			salt, hashed = create_password_salt(password)
			user.salt, user.hashed = salt, hashed
			user.save!
			render :json => {:message => 'Your password is updated.'}
		else
			render :json => {:message => 'You are logged out.'}, status => 500
		end
	end

	private

	def create_password_salt(password)
		require 'securerandom'
		salt = SecureRandom.hex(5)
		require 'digest'
		# hashed = HMAC::SHA512.hexdigest('site_salt', "#{password} salt")
		hashed = Digest::SHA512.hexdigest("#{password} #{salt}")
		return salt, hashed
	end
end
