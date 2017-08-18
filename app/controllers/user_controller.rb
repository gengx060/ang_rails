class UserController < ApplicationController

	def new_user
		if session[:is_org]
			render :json => {:message => 'You don\'t have such permission.'}, :status => 500
		elsif User.exists?(email: params['email'])
			render :json => {:message => 'Duplicate email found.'}, :status => 500
		else
			user = User.new do |u|
				u.firstname = params['firstname']
				u.lastname  = params['lastname']
				u.email     = params['email']
				# salt, hashed = create_password_salt('gege1818')
				# u.salt = salt
				# u.password = hashed
				u.org_id = session[:user_id]
			end
			user.save!
			render :json => {:success => true}
		end
	end

	def user_list
		users = User.where(:org_id => session[:org_id])
		users.as_json
		# if session[:is_org]
		# 	render :json => {:message => 'You don\'t have such permission.'}, :status => 500
		# elsif User.exists?(email: params['email'])
		# 	render :json => {:message => 'Duplicate email found.'}, :status => 500
		# else
		# 	user = User.new do |u|
		# 		u.firstname = params['firstname']
		# 		u.lastname = params['lastname']
		# 		u.email = params['email']
		# 		# salt, hashed = create_password_salt('gege1818')
		# 		# u.salt = salt
		# 		# u.password = hashed
		# 		u.org_id = session[:user_id]
		# 	end
		# 	user.save!
		# 	render :json => {:success => true}
		# end
	end

	def get_user
		users = User.find(session[:user_id])
		users.as_json
	end
end
