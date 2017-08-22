class UserController < ApplicationController

	def new_user
		unless session[:is_org]
			render :json => {:message => 'You don\'t have such permission.'}, :status => 500
			return
		end

		if User.exists?(email: params['email'])
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

	def user_list
		offset = params[:offset] || 0
		limit = params[:limit] || PAGING_LIMIT
		offset = 0 if offset < 0
		limit = PAGING_LIMIT if limit < 0

		# total, users = User.user_list(session[:org_id], offset, limit)
		total = User.where(:org_id => session[:org_id]).count
		users = User.where(:org_id => session[:org_id])
								.offset(offset).limit(limit)
								.select("id, firstname, lastname, email")
		total, users = User.user_list(session[:org_id], offset, limit)
		render :json => {:total => total, :users => users.as_json}
	end

	def get_user
		if params[:user_id]
			render :json => User.get_user(params[:user_id], session[:user_id]).as_json
		else
			render :json => {message: 'The user is not from your organization.'}, :status => 500
		end

	end
end