class Event < ActiveRecord::Base

	def self.edit(params)
		event = Event.where("id = #{params[:id]}").first
		params_t = {
				table: 'event',
				event: 'new',
				user_id: params[:user_id],
				org_id: params[:org_id],
		}
		if event
			# event.user_id = params[:user_id]
			params_t[:event] = 'update'
			event.start = params[:start]
			event.title = params[:title]
			event.end = params[:end]
			event.with_user_id = params[:with_user_id]
			# event.org_id = params[:org_id]
			event.comment = params[:comment]
			event.location = params[:location]
			event.save!
		else
			event = Event.new do |e|
				e.user_id = params[:user_id]
				e.title = params[:title]
				e.start = params[:start]
				e.end = params[:end]
				e.with_user_id = params[:with_user_id]
				e.org_id = params[:org_id]
				e.comment = params[:comment]
				e.location = params[:location]
				e.created_at = Time.now
			end
		end
		self.transaction do
			event.save!
			params_t[:table_id] = event.id
			params_t[:created_at] = event.id
			Log.create(params_t)
		end

	end

end
