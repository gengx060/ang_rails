class TagController < ApplicationController

	def edit
		if params[:id]
			tag = Tag.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id], session[:user_id])
			if tag
				params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
				Tag.edit(params_u, tag)
			end
		else
			params_u = {user_id: session[:user_id],
						org_id:  session[:org_id],
						name:    session[:name],
						color:   session[:color], }
			Tag.edit(params_u)
		end

		render :json => {message: 'Tag update successful.'}
	end

	def user_tag_edit
		if params[:id]
			usertag = UserTag.where("id = ? AND (user_id = ? OR org_id = ?)", params[:id], session[:user_id], session[:user_id])
			if usertag
				params_u = {is_deleted: params[:is_deleted] ? '\1' : nil}
				UserTag.edit(params_u, usertag)
			end
		else
			params_u = {user_id: session[:user_id],
						org_id:  session[:org_id],
						tag_id:  session[:tag_id], }
			UserTag.edit(params_u)
		end

		render :json => {message: 'User tag update successful.'}
	end


	def list
		render :json => {tags: Tag.list({'user_id': session[:user_id]}).as_json}
	end

	def edit
		if Tag.exists("name = ? AND user_id = ?", params[:name], session[:user_id])
			render :json => {message: "Duplicated label name found."}, :status => 50
			return
		end
		render :json => {tags: Tag.list({'user_id': session[:user_id]}).as_json}
	end

end