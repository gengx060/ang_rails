class EventController < ActionController::Base

	def list
		events = Event.where("user_id = #{session[:user_id]} and org_id = #{session[:org_id]}
and start > \"#{params[:start]}\" and end <  \"#{params[:end]}\"
").all
		render :json => events.as_json
	end

	def edit
		params[:user_id] = session[:user_id]
		params[:org_id] = session[:org_id]
		Event.edit(params)
		render :json => {message: 'Update successful.'}
	end
end