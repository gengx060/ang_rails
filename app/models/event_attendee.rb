class EventAttendee < ActiveRecord::Base

	def self.edit(params)
		attendee = self.where("event_id = #{params[:event_id]} AND user_id = #{params[:user_id]}").first
		if attendee
			if attendee.is_deleted
				attendee.is_deleted = nil
			else
				return 'no notify'
			end
		else
			attendee = self.new
		end
		self.params_to_model(params, attendee)

		attendee.save!
	end

	def self.get_attendees(ids)
		attendees = EventAttendee.joins("INNER JOIN `users` ON users.id = event_attendees.user_id")
						.joins("LEFT JOIN `user_profiles` as up ON up.user_id = u.id")
						.select("users.id, firstname, lastname, email, created_at, up.img_loc")
						.where("event_attendees.id in (#{ids.join(',')})")
		return attendees
	end

end
