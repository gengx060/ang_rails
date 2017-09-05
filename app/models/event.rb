class Event < ActiveRecord::Base

	def self.edit(params)
		if params[:id]
			event = Event.where("id = #{params[:id]}").first
		end

		params_t = {
				table:   'event',
				event:   'new',
				user_id: params[:user_id],
				org_id:  params[:org_id],
		}
		params_u = {
				'start':        params['start'],
				'title':        params['title'],
				'end':          params['end'],
				'with_user_id': params['with_user_id'],
				'comment':      params['comment'],
				'location':     params['location']
		}
		if event
			params_t[:event]      = 'update'
			params_u[:created_at] = Time.now.utc
		else
			params_u[:user_id] = params[:user_id]
			params_u[:org_id]  = params[:org_id]
		end

		unless event
			event = self.new
		end

		if event
			self.params_to_model(params_u, event)
			if params_t[:event] == 'new'
				self.transaction do
					event.save!
					params['with_user_id'].split(",").each {|a|
						params_u = {
								'event_id': event.id,
								'user_id':  a,
						}
						EventAttendee.edit(params_u)
					}
				end
			end
		end

		self.transaction do
			event.save!
			params_t[:table_id]   = event.id
			params_t[:created_at] = event.id
			Log.create(params_t)
		end

		return event, EventAttendee.list_with_user(event.id)
	end

	def self.delete(params)
		event = Event.where("id = #{params[:id]} and user_id = #{params[:user_id]}").first
		if event
			event.is_deleted = 1
			event.save!
		end
	end

	def self.list(params)
		events = self.where("user_id = #{params[:user_id]} and org_id = #{params[:org_id]}
and start > \"#{params[:start]}\" and end <  \"#{params[:end]}\" ").all.as_json
		events = events.map {|e|
			e['attendees'] = self.get_attendees(e['id']).as_json
			e
		}
		return events
	end

	def self.get_attendees(id)
		attendees = self.joins("LEFT JOIN `event_attendees` ea ON ea.event_id = events.id")
										.joins("INNER JOIN `users` u ON u.id = ea.user_id")
										.joins("LEFT JOIN `user_profiles` as up ON up.user_id = u.id")
										.select("u.id, firstname, lastname, email, u.created_at, up.img_loc")
										.where("events.id = #{id}").all
		return attendees
	end

end
