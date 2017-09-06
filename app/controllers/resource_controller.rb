class ResourceController < ActionController::Base

	def upload
		data     = params[:file]
		params_u = {
			user_id: session[:user_id],
			name:    params[:name],
			data:    params[:file],
		}
		if data
			Resource.save_file(params_u)
		end

		render :json => {}
	end

	def resource_list
		offset   = params[:offset] || 0
		limit    = params[:limit] || PAGING_LIMIT
		params_u = {
			offset: offset < 0 ? 0 : offset,
			limit:  limit < 0 ? PAGING_LIMIT : limit,
			org_id: session[:org_id],
			user_id: session[:user_id],
			sortby: ""
		}
		if params[:sortby]
			params[:sortby].each_with_index {|(key, value), index|
				params_u[:sortby] += "#{index > 0 ? ',' : ''} #{key} #{value} "
			}
		end

		total, resources = Resource.resource_list(params_u)

		render :json => {total: total, resources: resources}
	end
end