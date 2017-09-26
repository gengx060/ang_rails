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
			'start':    params['start'],
			'title':    params['title'],
			'end':      params['end'],
			'comment':  params['comment'],
			'location': params['location']
		}
		if event
			params_t[:event]      = 'update'
			params_u[:created_at] = Time.now
		else
			params_u[:user_id] = params[:user_id]
			params_u[:org_id]  = params[:org_id]
		end

		unless event
			event = self.new
		end

		self.params_to_model(params_u, event)
		self.transaction do
			event.save!

			if params['with_user_id']
				eas = EventAttendee.where("event_id=? AND is_deleted IS NULL AND user_id NOT IN (?) ", event.id, params['with_user_id'])
			else
				eas    = EventAttendee.where("event_id=? AND is_deleted IS NULL", event.id)
			end
			eas.select('user_id').as_json.each {|ea|
				params_u = {
					'event_id':     event.id,
					'user_id':      ea['user_id'],
					'created_by':   params[:user_id],
					'event_table':  'events',
					'event_detail': 'Removed from event'
				}
				UserNotification.edit(params_u)
			}
			eas.update_all(is_deleted: "\1")

			if params['with_user_id']
				params['with_user_id'].each {|a|
					params_u = {
						'event_id': event.id,
						'user_id':  a,
					}
					res      = EventAttendee.edit(params_u)
					if res != 'no notify'
						params_u = {
							'event_id':     event.id,
							'user_id':      a,
							'created_by':   params[:user_id],
							'event_table':  'events',
							'event_detail': 'Added to event'
						}
						UserNotification.edit(params_u)
					end
				}
			end

			params_t[:table_id]   = event.id
			params_t[:created_at] = event.id
			Log.create(params_t)
		end

		event              = event.as_json
		event['attendees'] = self.get_attendees(event['id']).as_json

		return event
	end

	def self.delete(params)
		event = Event.where("id = ? and user_id = ?", params[:id], params[:user_id]).first
		if event
			event.is_deleted = 1
			event.save!
		end
	end

	def self.list(params)
		events = self.where("user_id = ? and org_id = ? and start > ? and end <  ? ",
							params[:user_id], params[:org_id], params[:start], params[:end]).all.as_json
		events = events.map {|e|
			e['attendees'] = self.get_attendees(e['id']).as_json
			e
		}
		return events
	end

	def self.get_attendees(id)
		attendees = self.joins("LEFT JOIN `event_attendees` ea ON ea.event_id = events.id AND ea.is_deleted IS NULL")
						.joins("INNER JOIN `users` u ON u.id = ea.user_id")
						.joins("LEFT JOIN `user_profiles` as up ON up.user_id = u.id")
						.select("u.id, firstname, lastname, email, u.created_at, up.img_loc")
						.where("events.id = ?", id).all
		return attendees
	end

end
