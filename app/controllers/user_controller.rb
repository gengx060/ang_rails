class UserController < ApplicationController

	def edit
		unless session[:is_org]
			render :json => {:message => 'You don\'t have such permission.'}, :status => 500
			return
		end

		exist_user = User.where("email = \"#{params['email']}\"").select('id', 'group').first

		if exist_user && exist_user.id != params['id']
			render :json => {:message => 'Duplicate email found.'}, :status => 500
		elsif exist_user && exist_user.group == 'o' && params['type'] != 'o'
			render :json => {:message => 'Changing organization type to others is not allowed.'}, :status => 500
		else
			params_u = {
				'firstname': params['firstname'],
				'lastname':  params['lastname'],
				'email':     params['email']
			}
			if params['type'] == 'o'
				params['type'] = 'c' # sanity check dont allow convert type to org
			end
			params_u[:group] = params['type']
			if params['id']
				params_u[:id] = params['id']
			else
				params_u[:org_id] = session[:org_id]
			end

			User.transaction do
				user = User.edit(params_u)
				params[:phone][:user_id] = user.id if params[:phone]
				params[:address][:user_id] = user.id if params[:address]
				UserPhone.edit(params[:phone]) if params[:phone]
				UserAddress.edit(params[:address]) if params[:address]
			end
			render :json => {message: 'User update successful.'}
		end
	end

	def user_list
		offset = params[:offset] || 0
		limit  = params[:limit] || 0
		if limit < 1
			render :json => {message: 'Limit parameter is invalid.'}, :status => 500
			return
		end
		if offset < 0
			render :json => {message: 'Offset parameter is invalid.'}, :status => 500
			return
		end
		params_u = {
			offset:      offset,
			limit:       limit,
			org_id:      session[:org_id],
			sortby:      "",
			filterbyids: params[:filterbyids]
		}
		if params[:sortby]
			params[:sortby].each_with_index {|(key, value), index|
				params_u[:sortby] += "#{index > 0 ? ',' : ''} #{key} #{value} "
			}
		end

		total, users = User.user_list(params_u)
		render :json => {total: total, users: users.as_json}
	end

	def get_user
		if params[:user_id]
			user            = User.get_user(params[:user_id], session[:org_id]).as_json
			user['phone']   = UserPhone.get_phone(params).as_json
			user['address'] = UserAddress.get_address(params).as_json
			render :json => {contact: user}
		else
			render :json => {message: 'The contact is not from your organization.'}, :status => 500
		end
	end

	def user_search
		if params[:term]
			param_u = {
				term:   params[:term],
				org_id: session[:org_id]
			}
			res     = User.user_search(param_u)
			render :json => {items: res.as_json, total: res.length}
		end
	end

	def create
		params[:org_id] = session[:org_id]
		flag, msg       = User.create_contact(params)
		if flag
			render :json => {message: 'Contact created.'}
		else
			render :json => {message: msg}, :status => 500
		end
	end
end
