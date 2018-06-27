class MessageController < ApplicationController

	def edit
		if params[:id]
			msg = Message.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id], session[:user_id])
			if msg
				params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
				Message.edit(params_u, msg)
			end
		else
			params_u = {user_id:   session[:user_id],
						org_id:    session[:org_id],
						content:   params[:name],
						parent_id: params[:parent_id],
						level:     params[:level], }
			Message.edit(params_u)
		end

		render :json => {message: 'Tag update successful.'}
	end

	def save
		params_u = {user_id: session[:user_id],
					org_id:  session[:org_id],
					content: params[:content],
		}
		Message.edit(params_u)
		# if params[:id]
		# 	msg = Message.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id], session[:user_id])
		# 	if msg
		# 		params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
		# 		Message.edit(params_u, msg)
		# 	end
		# else
		# 	params_u = {user_id:   session[:user_id],
		# 				org_id:    session[:org_id],
		# 				content:   params[:name],
		# 				parent_id: params[:parent_id],
		# 				level:     params[:level], }
		# 	Messages.edit(params_u)
		# end

		render :json => {message: 'Message saved successful.'}
	end

	def list
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
			filterbyids: params[:filterbyids],
			tag: params[:tag]
		}
		if params[:sortby]
			params[:sortby].each_with_index {|(key, value), index|
				params_u[:sortby] += "#{index > 0 ? ',' : ''} #{key} #{value} "
			}
		end

		total, users = Message.list(params_u)
		render :json => {total: total, users: users.as_json}

		render :json => {message: 'Message saved successful.'}
	end
end