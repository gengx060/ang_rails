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
			Messages.edit(params_u)
		end

		render :json => {message: 'Tag update successful.'}
	end

end