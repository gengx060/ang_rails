class ResourceController < ApplicationController

	def upload
		data     = params[:file]
		params_u = {
				user_id: session[:user_id],
				org_id:  session[:org_id],
				name:    params[:name],
				length:  params[:size],
				data:    params[:src],
		}
		if data
			file = Resource.save_file(params_u)
			render :json => {id: file.id}
		else
			render :json => {message: "file doesn't exist."}, :status => 500
		end
	end

	def preview
		file = Resource.find_by(" id = ? AND (user_id = ? OR org_id = ?) ", params[:id], session[:user_id], session[:user_id])
		if file
			# if [ "image", "b", "c" ].any? {|it| file.type.start_with?(it)}
			if file.type.start_with?("image", "application")
				hashed_name = file.hashed_name
				file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
				send_file(file_loc,
						  :filename => file.name,
						  :type => 'application/pdf',
						  :disposition => 'inline')
			end
		end
	end

	def download
		file = Resource.find_by(" id = ? AND (user_id = ? OR org_id = ?) ", params[:id], session[:user_id], session[:user_id])
		if file
			hashed_name = file.hashed_name
			file_loc    = Rails.root.join('app', 'assets', 'resources', "#{hashed_name}")
			send_file(file_loc,
					  :filename => file.name,
					:disposition => 'attachment')
		end
	end

	def delete
		params_u= {
			id:      params[:id],
			user_id: session[:user_id],
			org_id:  session[:org_id],
		}
		Resource.delete(params_u)
		render :json => {}
	end

	def resource_list
		offset   = params[:offset] || 0
		limit    = params[:limit] || 0
		if limit < 1
			render :json => {message: 'Limit parameter is invalid.'}, :status => 500
			return
		end
		if offset < 0
			render :json => {message: 'Offset parameter is invalid.'}, :status => 500
			return
		end
		params_u = {
				offset:  offset,
				limit:   limit,
				org_id:  session[:org_id],
				user_id: session[:user_id],
				sortby:  ""
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