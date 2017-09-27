class TagController < ApplicationController

	def edit
		if params[:id]
			tag = Tag.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id],session[:user_id])
			if tag
				params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
				Tag.edit(params_u,tag)
			end
		else
			params_u = {user_id: session[:user_id],
						org_id: session[:org_id],
						tag_name: session[:tag_name],
						tag_color: session[:tag_color], }
			Tag.edit(params_u)
		end

		render :json => {message: 'Tag update successful.'}
	end

	def user_tag_edit
		if params[:id]
			usertag = UserTag.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id],session[:user_id])
			if usertag
				params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
				UserTag.edit(params_u,usertag)
			end
		else
			params_u = {user_id: session[:user_id],
						org_id: session[:org_id],
						tag_id: session[:tag_id], }
			UserTag.edit(params_u)
		end

		render :json => {message: 'User tag update successful.'}
	end

end