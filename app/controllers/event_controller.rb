class EventController < ActionController::Base

	def list
		events = []
		if session[:user_id] and session[:org_id]
			events = Event.where("user_id = #{session[:user_id]} and org_id = #{session[:org_id]}
and start > \"#{params[:start]}\" and end <  \"#{params[:end]}\" ").all
		end
		render :json => events.as_json
	end

	def edit
		params[:user_id] = session[:user_id]
		params[:org_id]  = session[:org_id]
		event            = Event.edit(params)
		render :json => {message: 'Update successful.', event: event.as_json}
	end

	def delete
		params[:user_id] = session[:user_id]
		params[:org_id]  = session[:org_id]
		Event.delete(params)
		render :json => {message: 'The event was deleted.'}
	end
end