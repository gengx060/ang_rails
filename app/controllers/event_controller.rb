class EventController < ActionController::Base

	def list
		events = []
		if session[:user_id] and session[:org_id]
			params_u = {
					user_id: session[:user_id],
					org_id:  session[:org_id],
					start:   params[:start],
					end:     params[:end]
			}
			events = Event.list(params_u)
# 			events = Event.where("user_id = #{session[:user_id]} and org_id = #{session[:org_id]}
# and start > \"#{params[:start]}\" and end <  \"#{params[:end]}\" ").all
# 			events = events.map {|e|
# 				e.attendees=self.get_attendees(id)(e.id)
# 			}
		end
		render :json => events
	end

	def edit
		params[:user_id] = session[:user_id]
		params[:org_id]  = session[:org_id]
		event, attendees = Event.edit(params)
		render :json => {message: 'Update successful.', event: event.as_json, attendees: attendees.as_json}
	end

	def delete
		params[:user_id] = session[:user_id]
		params[:org_id]  = session[:org_id]
		Event.delete(params)
		render :json => {message: 'The event was deleted.'}
	end
end