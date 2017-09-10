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
			User.edit(params_u)
			render :json => {}
		end
	end

	def user_list
		offset   = params[:offset] || 0
		limit    = params[:limit] || PAGING_LIMIT
		params_u = {
				offset: offset < 0 ? 0 : offset,
				limit:  limit < 0 ? PAGING_LIMIT : limit,
				org_id: session[:org_id],
				sortby: ""
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
			render :json => User.get_user(params[:user_id], session[:org_id]).as_json
		else
			render :json => {message: 'The contact is not from your organization.'}, :status => 500
		end
	end

	def user_search
		if params[:term]
			param_u = {
					term: params[:term],
					org_id: session[:org_id]
			}
			res = User.user_search(param_u)
			render :json => {items: res.as_json, total: res.length}
		end
	end
end
